import {
  GenerateTagsRequest,
  GenerateTagsResponse,
  TagItem,
} from '../../shared/types';
import {
  generateTagsWithFallbackEngine,
  sanitizeTag,
} from './tagEngine';

const REQUEST_TIMEOUT_MS = 8000;

/**
 * Generate tags using Gemini API or OpenAI Compatible API if configured,
 * otherwise fall back to local rule-based NLP engine.
 */
export async function generateTagsWithAIOrFallback(
  request: GenerateTagsRequest
): Promise<GenerateTagsResponse> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // If no API key configured, use local fallback engine immediately
  if (!geminiApiKey && !openaiApiKey) {
    const fallbackResult = generateTagsWithFallbackEngine(request);
    const commaSeparated = fallbackResult.tags.map(t => t.text).join(', ');
    return {
      success: true,
      engineUsed: 'fallback_nlp',
      tags: fallbackResult.tags,
      hashtags: fallbackResult.hashtags,
      titleAnalysis: fallbackResult.titleAnalysis,
      seoSuggestions: fallbackResult.seoSuggestions,
      characterStats: {
        totalCharactersCommaSeparated: commaSeparated.length,
        tagCount: fallbackResult.tags.length,
        recommendedLimit: 500,
      },
    };
  }

  // Attempt AI generation with timeout
  try {
    const aiResult = await Promise.race([
      callAiProvider(request, geminiApiKey, openaiApiKey),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('AI Provider request timed out after 8s')), REQUEST_TIMEOUT_MS)
      ),
    ]);

    if (aiResult && aiResult.tags && aiResult.tags.length > 0) {
      const commaSeparated = aiResult.tags.map(t => t.text).join(', ');
      return {
        success: true,
        engineUsed: 'ai',
        tags: aiResult.tags,
        hashtags: aiResult.hashtags,
        titleAnalysis: aiResult.titleAnalysis,
        seoSuggestions: aiResult.seoSuggestions,
        characterStats: {
          totalCharactersCommaSeparated: commaSeparated.length,
          tagCount: aiResult.tags.length,
          recommendedLimit: 500,
        },
      };
    }
  } catch (error: any) {
    console.warn(`[AI Engine] Fallback activated due to error: ${error?.message || error}`);
  }

  // Safe Fallback to local engine
  const fallbackResult = generateTagsWithFallbackEngine(request);
  const commaSeparated = fallbackResult.tags.map(t => t.text).join(', ');
  return {
    success: true,
    engineUsed: 'fallback_nlp',
    tags: fallbackResult.tags,
    hashtags: fallbackResult.hashtags,
    titleAnalysis: fallbackResult.titleAnalysis,
    seoSuggestions: fallbackResult.seoSuggestions,
    characterStats: {
      totalCharactersCommaSeparated: commaSeparated.length,
      tagCount: fallbackResult.tags.length,
      recommendedLimit: 500,
    },
  };
}

async function callAiProvider(
  req: GenerateTagsRequest,
  geminiKey?: string,
  openaiKey?: string
) {
  const prompt = `You are an expert YouTube SEO metadata specialist.
Given the following YouTube video details:
- Title: "${req.title}"
- Description: "${req.description || 'N/A'}"
- Category: "${req.category || 'General'}"
- Output Language: "${req.language || 'English'}"
- Target Audience: "${req.audience || 'Global'}"
- Requested Tag Count: ${req.count || 20}

Generate a JSON object strictly following this structure:
{
  "tags": [
    { "text": "tag phrase here", "relevance": "Highly relevant" | "Related" | "Broad" }
  ],
  "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
  "titleAnalysis": {
    "mainTopic": "Short topic summary",
    "importantKeywords": ["keyword1", "keyword2"],
    "secondaryPhrases": ["phrase1"],
    "ambiguousWording": ["ambiguous word if any"],
    "descriptiveSuggestions": ["concrete suggestion 1"],
    "clarityScore": 85
  },
  "seoSuggestions": {
    "titleVariations": ["Title option 1", "Title option 2"],
    "missingKeywords": ["keyword"],
    "relatedPhrases": ["phrase"],
    "metadataAlignmentTips": ["tip 1", "tip 2"]
  }
}
Rules:
1. Provide only realistic, highly relevant tags.
2. Provide tags in lowercase, without '#' symbols in the tags list.
3. Respect the specified language (${req.language}) including native script or transliteration if appropriate.
4. Avoid spam, repetition, or misleading tags.
5. Return ONLY raw JSON without markdown code fences.`;

  if (geminiKey) {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error('No candidate content received from Gemini');

    return parseAiJsonResponse(candidateText, req.count || 20);
  }

  if (openaiKey) {
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API returned status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content returned from OpenAI provider');

    return parseAiJsonResponse(content, req.count || 20);
  }

  return null;
}

function parseAiJsonResponse(raw: string, maxCount: number) {
  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  const tags: TagItem[] = (parsed.tags || []).map((t: any, index: number) => ({
    id: `tag-ai-${Date.now()}-${index}`,
    text: sanitizeTag(t.text || String(t)),
    relevance: (t.relevance as any) || 'Related',
    source: 'ai' as const,
  })).filter((t: TagItem) => t.text.length > 1).slice(0, maxCount);

  return {
    tags,
    hashtags: parsed.hashtags || [],
    titleAnalysis: parsed.titleAnalysis || {
      mainTopic: 'Detected Topic',
      importantKeywords: [],
      secondaryPhrases: [],
      ambiguousWording: [],
      descriptiveSuggestions: [],
      clarityScore: 80,
    },
    seoSuggestions: parsed.seoSuggestions || {
      titleVariations: [],
      missingKeywords: [],
      relatedPhrases: [],
      metadataAlignmentTips: [],
    },
  };
}
