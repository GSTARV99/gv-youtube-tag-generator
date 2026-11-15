import {
  Category,
  GenerateTagsRequest,
  OutputLanguage,
  SeoSuggestionsResult,
  TagItem,
  TagRelevance,
  TitleAnalysisResult,
} from '../../shared/types';

// Stopwords to ignore during raw token extraction
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
  'by', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over', 'under',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'doing', 'can', 'could', 'should', 'would', 'will', 'my', 'your',
  'our', 'their', 'his', 'her', 'its', 'this', 'that', 'these', 'those', 'i', 'me',
  'we', 'us', 'you', 'he', 'him', 'she', 'they', 'them', 'what', 'which', 'who',
  'whom', 'whose', 'why', 'how', 'when', 'where', 'all', 'any', 'both', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'just', 'don', 'now'
]);

// Common video intent indicators
const INTENT_MODIFIERS = [
  'tutorial', 'guide', 'how to', 'tips and tricks', 'gameplay', 'walkthrough',
  'review', 'unboxing', 'course', 'full video', 'best', 'top 10', 'explained',
  'beginner guide', 'for beginners', 'highlights', 'reaction', 'update', 'series'
];

// Entity-specific dictionaries & keywords
interface EntityRule {
  matchKeywords: string[];
  primaryTags: string[];
  longTailTemplates: string[];
  hashtags: string[];
  devanagariTags?: string[];
  hinglishTags?: string[];
}

const ENTITY_RULES: EntityRule[] = [
  {
    matchKeywords: ['minecraft', 'mcpe', 'bedrock', 'netherite', 'redstone'],
    primaryTags: ['minecraft', 'minecraft gameplay', 'minecraft survival', 'minecraft hindi'],
    longTailTemplates: [
      '{topic} survival series',
      '{topic} episode 1',
      '{topic} gameplay hindi',
      '{topic} hardcore survival',
      '{topic} secret base build',
      '{topic} farms tutorial',
      '{topic} bedrock edition',
      '{topic} pocket edition mcpe',
      '{topic} mods gameplay',
      '{topic} pro tips and tricks'
    ],
    hashtags: ['#Minecraft', '#MinecraftHindi', '#MinecraftSurvival', '#Gaming', '#MCPE'],
    devanagariTags: ['माइनक्राफ्ट', 'माइनक्राफ्ट सर्वाइवल', 'माइनक्राफ्ट हिंदी', 'गेमप्ले'],
    hinglishTags: ['minecraft hindi me', 'minecraft survival kaise kare', 'minecraft ghar kaise banaye']
  },
  {
    matchKeywords: ['bgmi', 'pubg', 'battlegrounds', 'free fire', 'ff'],
    primaryTags: ['bgmi gameplay', 'bgmi montage', 'bgmi pro gameplay', 'pubg mobile'],
    longTailTemplates: [
      '{topic} best sensitivity settings',
      '{topic} clutch moments',
      '{topic} tips and tricks hindi',
      '{topic} rank push live',
      '{topic} 1v4 clutch gameplay'
    ],
    hashtags: ['#BGMI', '#BattlegroundsMobileIndia', '#Gaming', '#BGMIGameplay'],
    devanagariTags: ['बीजीएमआई', 'पबजी गेमप्ले', 'गेमिंग हिंदी'],
    hinglishTags: ['bgmi gameplay hindi', 'bgmi me pro kaise bane', 'bgmi rank push kaise kare']
  },
  {
    matchKeywords: ['python', 'javascript', 'typescript', 'react', 'coding', 'programming', 'web development'],
    primaryTags: ['coding tutorial', 'programming tutorial', 'learn to code', 'software developer'],
    longTailTemplates: [
      '{topic} full course',
      '{topic} tutorial for beginners',
      '{topic} crash course',
      '{topic} project tutorial',
      '{topic} roadmap 2025',
      '{topic} interview questions'
    ],
    hashtags: ['#Coding', '#Programming', '#WebDevelopment', '#TechTutorial'],
    devanagariTags: ['कोडिंग सीखें', 'प्रोग्रामिंग ट्यूटोरियल', 'सॉफ्टवेयर डेवलपमेंट'],
    hinglishTags: ['coding kaise sikhe', 'coding tutorial hindi', 'full stack developer kaise bane']
  },
  {
    matchKeywords: ['gym', 'workout', 'fitness', 'diet', 'weight loss', 'muscle', 'bodybuilding'],
    primaryTags: ['fitness motivation', 'workout routine', 'gym workout', 'diet plan'],
    longTailTemplates: [
      '{topic} for beginners',
      '{topic} full body routine',
      '{topic} diet plan hindi',
      '{topic} transformation journey',
      '{topic} common mistakes'
    ],
    hashtags: ['#Fitness', '#GymMotivation', '#Workout', '#HealthyDiet'],
    devanagariTags: ['जिम वर्कआउट', 'बॉडीबिल्डिंग', 'डाइट प्लान हिंदी', 'फिटनेस'],
    hinglishTags: ['workout kaise kare', 'body kaise banaye', 'weight loss diet plan hindi']
  },
  {
    matchKeywords: ['recipe', 'cooking', 'dish', 'paneer', 'biryani', 'cake', 'street food'],
    primaryTags: ['recipe tutorial', 'cooking video', 'easy recipe', 'quick recipe'],
    longTailTemplates: [
      '{topic} recipe in hindi',
      '{topic} hotel style recipe',
      '{topic} step by step recipe',
      '{topic} authentic recipe',
      '{topic} 10 minute recipe'
    ],
    hashtags: ['#Cooking', '#Recipe', '#IndianFood', '#Foodie'],
    devanagariTags: ['रेसिपी', 'खाना खजाना', 'स्वादिष्ट रेसिपी', 'घर पर कैसे बनाएं'],
    hinglishTags: ['recipe kaise banaye', 'hotel jaisa banaye', 'ghar par banaye testy']
  },
  {
    matchKeywords: ['vlog', 'daily vlog', 'travel', 'trip', 'family vlog', 'lifestyle'],
    primaryTags: ['daily vlog', 'travel vlog', 'lifestyle vlog', 'family vlog hindi'],
    longTailTemplates: [
      '{topic} my first vlog',
      '{topic} travel guide',
      '{topic} explore with me',
      '{topic} budget travel tips',
      '{topic} memorable journey'
    ],
    hashtags: ['#Vlog', '#DailyVlog', '#TravelDiaries', '#Vlogger'],
    devanagariTags: ['व्लॉग', 'दैनिक व्लॉग', 'यात्रा वृत्तांत', 'लाइफस्टाइल'],
    hinglishTags: ['daily vlog hindi', 'travel vlog hindi me', 'humara naya ghar vlog']
  }
];

// Language specific modifier libraries
const LANGUAGE_EXPANSIONS: Record<OutputLanguage, { suffix: string[]; DevanagariOrNative: string[]; searchPatterns: string[] }> = {
  Hindi: {
    suffix: ['hindi', 'in hindi', 'hindi me', 'hindi tutorial', 'hindi gameplay'],
    DevanagariOrNative: ['हिंदी', 'ट्यूटोरियल', 'वीडियो', 'जानकारी', 'गाइड'],
    searchPatterns: ['{topic} हिंदी में', '{topic} की पूरी जानकारी', '{topic} कैसे करें', 'बेस्ट {topic}']
  },
  Hinglish: {
    suffix: ['hindi me', 'kaise kare', 'full guide hindi', 'easy tarika', 'step by step'],
    DevanagariOrNative: [],
    searchPatterns: ['{topic} kaise kare', '{topic} hindi me samjhe', 'asani se {topic}', '{topic} secret trick']
  },
  Bengali: {
    suffix: ['in bengali', 'bangla tutorial', 'bangla video', 'bangla', 'bangla review'],
    DevanagariOrNative: ['বাংলা', 'বাংলা টিউটোরিয়াল', 'বাংলা ভিডিও'],
    searchPatterns: ['{topic} বাংলা টিউটোরিয়াল', '{topic} কিভাবে করবেন', 'সহজ {topic}']
  },
  Tamil: {
    suffix: ['in tamil', 'tamil tutorial', 'tamil review', 'tamil explanation', 'tamil'],
    DevanagariOrNative: ['தமிழ்', 'தமிழ் விளக்கம்', 'டுடோரியல்'],
    searchPatterns: ['{topic} தமிழில்', '{topic} செய்வது எப்படி', 'முழு விளக்கம்']
  },
  Telugu: {
    suffix: ['in telugu', 'telugu tutorial', 'telugu explanation', 'telugu video', 'telugu'],
    DevanagariOrNative: ['తెలుగు', 'తెలుగు వివరణ', 'ట్యుటోరియల్'],
    searchPatterns: ['{topic} తెలుగులో', '{topic} ఎలా చేయాలి', 'పూర్తి వివరాలు']
  },
  Marathi: {
    suffix: ['in marathi', 'marathi tutorial', 'marathi video', 'marathi माहिती'],
    DevanagariOrNative: ['मराठी', 'माहिती', 'ट्यूटोरियल'],
    searchPatterns: ['{topic} मराठी माहिती', '{topic} कसे करावे', 'मराठीत पूर्ण माहिती']
  },
  English: {
    suffix: ['tutorial', 'guide', 'explained', 'for beginners', 'walkthrough', '2025'],
    DevanagariOrNative: [],
    searchPatterns: ['how to {topic}', 'best {topic} guide', '{topic} step by step', '{topic} review']
  },
  Other: {
    suffix: ['guide', 'tutorial', 'overview', 'video'],
    DevanagariOrNative: [],
    searchPatterns: ['{topic} tutorial', 'best {topic}']
  }
};

// Category fallback tags
const CATEGORY_TAG_MAP: Record<Category, string[]> = {
  Gaming: ['gaming', 'gameplay', 'pc gaming', 'mobile gaming', 'gaming video', 'walkthrough', 'gamer'],
  Minecraft: ['minecraft', 'minecraft survival', 'minecraft build', 'minecraft gameplay', 'minecraft bedrock', 'minecraft redstone'],
  Education: ['education', 'learning', 'educational video', 'study', 'how to', 'tutorial', 'knowledge'],
  Technology: ['technology', 'tech', 'gadgets', 'tech review', 'software', 'digital', 'tech tips'],
  Entertainment: ['entertainment', 'fun video', 'trending video', 'viral video', 'must watch'],
  Vlogging: ['vlog', 'daily vlog', 'lifestyle', 'day in my life', 'vlogger', 'personal vlog'],
  Music: ['music', 'song', 'official music', 'cover song', 'audio', 'musical performance'],
  Sports: ['sports', 'highlights', 'match analysis', 'athlete', 'sports news', 'training'],
  Comedy: ['comedy', 'funny video', 'humor', 'skit', 'prank', 'standup comedy', 'laughter'],
  Travel: ['travel', 'travel vlog', 'tourism', 'best places to visit', 'travel guide', 'trip'],
  Fitness: ['fitness', 'workout', 'gym', 'health tips', 'bodybuilding', 'exercise', 'diet'],
  Food: ['food', 'recipe', 'cooking', 'street food', 'food review', 'delicious food'],
  News: ['news', 'latest news', 'breaking news', 'current affairs', 'updates', 'report'],
  Other: ['video', 'youtube video', 'trending', 'content']
};

/**
 * Clean & normalize a string into YouTube-safe tag format
 */
export function sanitizeTag(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF\u0C00-\u0C7F-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract tokens, n-grams, and primary entities from text
 */
export function extractKeywordsAndEntities(title: string, description?: string) {
  const fullText = `${title} ${description || ''}`.toLowerCase();
  const rawWords = fullText
    .replace(/[^\w\s\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF\u0C00-\u0C7F]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);

  // Extract clean keywords excluding stop words
  const meaningfulWords = rawWords.filter(w => !STOP_WORDS.has(w) && isNaN(Number(w)));

  // Extract n-grams (2-word and 3-word phrases from title)
  const titleWords = title
    .replace(/[^\w\s\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF\u0C00-\u0C7F]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const bigrams: string[] = [];
  for (let i = 0; i < titleWords.length - 1; i++) {
    const pair = `${titleWords[i]} ${titleWords[i + 1]}`.toLowerCase();
    if (!STOP_WORDS.has(titleWords[i].toLowerCase()) || !STOP_WORDS.has(titleWords[i + 1].toLowerCase())) {
      bigrams.push(pair);
    }
  }

  const trigrams: string[] = [];
  for (let i = 0; i < titleWords.length - 2; i++) {
    const tri = `${titleWords[i]} ${titleWords[i + 1]} ${titleWords[i + 2]}`.toLowerCase();
    trigrams.push(tri);
  }

  // Detect matching entity rules
  const detectedRules: EntityRule[] = [];
  for (const rule of ENTITY_RULES) {
    if (rule.matchKeywords.some(keyword => fullText.includes(keyword))) {
      detectedRules.push(rule);
    }
  }

  return {
    rawWords,
    meaningfulWords: Array.from(new Set(meaningfulWords)),
    bigrams: Array.from(new Set(bigrams)),
    trigrams: Array.from(new Set(trigrams)),
    detectedRules,
  };
}

/**
 * Core Fallback NLP Tag Generation Engine
 */
export function generateTagsWithFallbackEngine(request: GenerateTagsRequest): {
  tags: TagItem[];
  hashtags: string[];
  titleAnalysis: TitleAnalysisResult;
  seoSuggestions: SeoSuggestionsResult;
} {
  const {
    title,
    description = '',
    category = 'Gaming',
    language = 'English',
    audience = 'Global',
    count = 20
  } = request;

  const titleClean = sanitizeTag(title);
  if (!titleClean) {
    return {
      tags: [],
      hashtags: [],
      titleAnalysis: {
        mainTopic: 'None',
        importantKeywords: [],
        secondaryPhrases: [],
        ambiguousWording: ['Empty title supplied'],
        descriptiveSuggestions: ['Please enter a descriptive YouTube video title.'],
        clarityScore: 0,
      },
      seoSuggestions: {
        titleVariations: [],
        missingKeywords: [],
        relatedPhrases: [],
        metadataAlignmentTips: ['Add a descriptive title to receive personalized SEO recommendations.']
      }
    };
  }

  const { meaningfulWords, bigrams, trigrams, detectedRules } = extractKeywordsAndEntities(title, description);

  // Determine main subject
  let mainSubject = meaningfulWords.slice(0, 3).join(' ') || titleClean;
  if (bigrams.length > 0) {
    mainSubject = bigrams[0];
  }

  // Collections for categorized tags
  const highlyRelevantTags = new Set<string>();
  const relatedTags = new Set<string>();
  const broadTags = new Set<string>();
  const rawHashtags = new Set<string>();

  // 1. Title itself as primary tag (if within reasonable length <= 45 chars)
  if (titleClean.length <= 45) {
    highlyRelevantTags.add(titleClean);
  }

  // 2. Add bigrams and trigrams directly from title
  trigrams.forEach(t => highlyRelevantTags.add(sanitizeTag(t)));
  bigrams.forEach(b => highlyRelevantTags.add(sanitizeTag(b)));

  // 3. Add single meaningful words
  meaningfulWords.slice(0, 5).forEach(w => {
    if (w.length >= 3) highlyRelevantTags.add(sanitizeTag(w));
  });

  // 4. Entity-specific tag injection
  for (const rule of detectedRules) {
    rule.primaryTags.forEach(t => highlyRelevantTags.add(sanitizeTag(t)));
    rule.longTailTemplates.forEach(template => {
      const formatted = template.replace('{topic}', mainSubject);
      relatedTags.add(sanitizeTag(formatted));
    });
    rule.hashtags.forEach(h => rawHashtags.add(h));

    if (language === 'Hindi' && rule.devanagariTags) {
      rule.devanagariTags.forEach(dt => highlyRelevantTags.add(dt));
    }
    if ((language === 'Hinglish' || language === 'Hindi') && rule.hinglishTags) {
      rule.hinglishTags.forEach(ht => relatedTags.add(sanitizeTag(ht)));
    }
  }

  // 5. Language-specific patterns
  const langConfig = LANGUAGE_EXPANSIONS[language] || LANGUAGE_EXPANSIONS['English'];
  for (const pattern of langConfig.searchPatterns) {
    const expanded = pattern.replace('{topic}', mainSubject);
    relatedTags.add(sanitizeTag(expanded));
  }

  for (const suffix of langConfig.suffix) {
    relatedTags.add(sanitizeTag(`${mainSubject} ${suffix}`));
  }

  if (langConfig.DevanagariOrNative.length > 0) {
    langConfig.DevanagariOrNative.forEach(nativeWord => {
      broadTags.add(nativeWord);
    });
  }

  // 6. Category-specific tags
  const catTags = CATEGORY_TAG_MAP[category] || CATEGORY_TAG_MAP['Other'];
  catTags.forEach(ct => broadTags.add(sanitizeTag(ct)));

  // Combine category with subject
  relatedTags.add(sanitizeTag(`${mainSubject} ${category.toLowerCase()}`));

  // 7. Intent expansions (how to, tutorial, gameplay, 2025, etc.)
  for (const intent of INTENT_MODIFIERS) {
    if (relatedTags.size > count * 2) break;
    relatedTags.add(sanitizeTag(`${mainSubject} ${intent}`));
    relatedTags.add(sanitizeTag(`${intent} ${mainSubject}`));
  }

  // 8. Audience variations
  if (audience === 'India') {
    relatedTags.add(sanitizeTag(`${mainSubject} india`));
    broadTags.add('india');
  }

  // 9. Hashtags extraction
  // Convert main words to hashtags
  meaningfulWords.slice(0, 4).forEach(word => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanWord.length > 2) {
      const capitalized = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      rawHashtags.add(`#${capitalized}`);
    }
  });

  // Add category hashtag
  const catClean = category.replace(/[^a-zA-Z0-9]/g, '');
  rawHashtags.add(`#${catClean}`);

  // Add language hashtag if non-English
  if (language !== 'English') {
    rawHashtags.add(`#${language}`);
  }

  // 10. Assemble and Rank Tags
  const finalTagItems: TagItem[] = [];
  const seenTexts = new Set<string>();

  const addTag = (text: string, relevance: TagRelevance) => {
    const clean = sanitizeTag(text);
    if (!clean || clean.length < 2 || clean.length > 50) return;
    if (seenTexts.has(clean)) return;
    seenTexts.add(clean);

    finalTagItems.push({
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      text: clean,
      relevance,
      source: 'engine'
    });
  };

  // Add highly relevant tags first
  Array.from(highlyRelevantTags).forEach(t => addTag(t, 'Highly relevant'));
  // Then related tags
  Array.from(relatedTags).forEach(t => addTag(t, 'Related'));
  // Then broad tags
  Array.from(broadTags).forEach(t => addTag(t, 'Broad'));

  // Cap at requested count
  const requestedCount = Number(count) || 20;
  const slicedTags = finalTagItems.slice(0, requestedCount);

  // 11. Title Keyword Analysis
  const titleAnalysis = analyzeTitle(title, meaningfulWords, category);

  // 12. SEO Suggestions
  const seoSuggestions = generateSeoSuggestions(title, mainSubject, meaningfulWords, category, language);

  return {
    tags: slicedTags,
    hashtags: Array.from(rawHashtags).slice(0, 8),
    titleAnalysis,
    seoSuggestions
  };
}

/**
 * Title Analysis Engine
 */
export function analyzeTitle(
  title: string,
  meaningfulWords: string[],
  category: Category
): TitleAnalysisResult {
  const words = title.split(/\s+/).filter(Boolean);
  const ambiguousWords: string[] = [];
  const suggestions: string[] = [];

  const clickbaitVagueWords = ['epic', 'insane', 'shocking', 'unbelievable', 'omg', 'must watch', 'this happened'];
  const lowerTitle = title.toLowerCase();

  clickbaitVagueWords.forEach(cb => {
    if (lowerTitle.includes(cb)) {
      ambiguousWords.push(cb);
    }
  });

  if (words.length < 3) {
    ambiguousWords.push('Short title without context');
    suggestions.push('Add specific keywords such as topic name, version, or format (e.g. "Beginner Tutorial" or "Episode 1").');
  }

  if (!meaningfulWords.some(w => ['tutorial', 'guide', 'gameplay', 'review', 'vlog', 'how', 'tips'].includes(w))) {
    suggestions.push(`Consider clarifying intent (e.g. "Gameplay", "Full Guide", "Review", or "Walkthrough" for ${category}).`);
  }

  if (title.length > 70) {
    suggestions.push('Keep the core keyword in the first 50 characters so it remains visible on mobile search results.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Strong, descriptive title with clear focus.');
  }

  const clarityScore = Math.max(30, Math.min(100, 100 - (ambiguousWords.length * 15) - (words.length < 3 ? 25 : 0)));

  return {
    mainTopic: meaningfulWords.slice(0, 2).join(' ') || 'General',
    importantKeywords: meaningfulWords.slice(0, 5),
    secondaryPhrases: words.filter(w => !meaningfulWords.includes(w.toLowerCase())).slice(0, 4),
    ambiguousWording: ambiguousWords,
    descriptiveSuggestions: suggestions,
    clarityScore
  };
}

/**
 * Title-based SEO Suggestions
 */
export function generateSeoSuggestions(
  title: string,
  mainSubject: string,
  meaningfulWords: string[],
  category: Category,
  language: OutputLanguage
): SeoSuggestionsResult {
  const currentYear = new Date().getFullYear();
  const variations: string[] = [
    `${title} | Step-by-Step ${category} Guide (${currentYear})`,
    `How to Master ${mainSubject}: Complete ${category} Tutorial`,
    `${title} [${language} Full Breakdown]`
  ];

  const missingKeywords: string[] = [];
  if (!meaningfulWords.includes('tutorial') && !meaningfulWords.includes('guide')) {
    missingKeywords.push('Tutorial / Guide');
  }
  if (!meaningfulWords.includes(language.toLowerCase())) {
    missingKeywords.push(language);
  }
  if (!meaningfulWords.includes(category.toLowerCase())) {
    missingKeywords.push(category);
  }

  return {
    titleVariations: variations,
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ['Key topic covered', 'Format clear'],
    relatedPhrases: [
      `${mainSubject} best practices`,
      `${mainSubject} for beginners`,
      `${mainSubject} tips and tricks`,
      `${mainSubject} explanation in ${language}`
    ],
    metadataAlignmentTips: [
      'Place your primary video tag directly into your video title and within the first 2 lines of your description.',
      'Do not stuff unrelated tags; YouTube penalizes misleading metadata.',
      'Add 3 to 5 targeted hashtags in the video description to appear above your video title.',
      'Remember tags assist YouTube with misspellings and content categorization, but viewer click-through-rate and watch time determine rankings.'
    ]
  };
}

/**
 * YouTube 500-Character Constraint Optimizer
 * Knapsack / greedy selection: fits tags in comma-separated string under 500 chars,
 * without clipping any tag mid-word, prioritizing highly relevant first.
 */
export function optimizeTagsForYouTubeLimit(tags: TagItem[], limit = 500): {
  tags: TagItem[];
  characterCount: number;
  omittedCount: number;
} {
  // Sort priority: Highly relevant > Related > Broad
  const sorted = [...tags].sort((a, b) => {
    const weight = { 'Highly relevant': 3, 'Related': 2, 'Broad': 1 };
    return weight[b.relevance] - weight[a.relevance];
  });

  const selected: TagItem[] = [];
  let currentString = '';

  for (const tag of sorted) {
    const candidateString = currentString ? `${currentString}, ${tag.text}` : tag.text;
    if (candidateString.length <= limit) {
      selected.push(tag);
      currentString = candidateString;
    }
  }

  return {
    tags: selected,
    characterCount: currentString.length,
    omittedCount: tags.length - selected.length
  };
}
