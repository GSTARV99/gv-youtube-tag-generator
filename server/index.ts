import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { z } from 'zod';
import { generateTagsWithAIOrFallback } from './engine/aiProvider.js';
import { generateTagsWithFallbackEngine } from './engine/tagEngine.js';
import { GenerateTagsRequest } from '../shared/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3001;

// Security & Header Configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite inline scripts & styles in development
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors());
app.use(express.json({ limit: '100kb' })); // Protection against large payloads

// Rate Limiter: Max 60 requests per 15-minute window by default
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please wait a few minutes before generating more tags.',
  },
});

app.use('/api/', limiter);

// Request validation schema using Zod
const generateTagsSchema = z.object({
  title: z
    .string({ required_error: 'Video title is required.' })
    .trim()
    .min(1, 'Video title cannot be empty.')
    .max(200, 'Video title must be under 200 characters.'),
  description: z.string().max(2000, 'Description must be under 2000 characters.').optional(),
  category: z
    .enum([
      'Gaming',
      'Minecraft',
      'Education',
      'Technology',
      'Entertainment',
      'Vlogging',
      'Music',
      'Sports',
      'News',
      'Comedy',
      'Travel',
      'Fitness',
      'Food',
      'Other',
    ] as const)
    .optional(),
  language: z
    .enum([
      'Hindi',
      'English',
      'Hinglish',
      'Bengali',
      'Tamil',
      'Telugu',
      'Marathi',
      'Other',
    ] as const)
    .optional(),
  audience: z.enum(['India', 'Global', 'Custom'] as const).optional(),
  count: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(40)]).optional(),
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiProvider: hasGemini ? 'GEMINI' : hasOpenAi ? 'OPENAI' : 'FALLBACK_LOCAL_NLP',
    aiConfigured: hasGemini || hasOpenAi,
    version: '1.0.0',
  });
});

// Main Generate Tags API Endpoint
app.post('/api/generate-tags', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = generateTagsSchema.safeParse(req.body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Invalid input parameters.';
      return res.status(400).json({
        success: false,
        error: firstError,
        details: parseResult.error.format(),
      });
    }

    const requestData: GenerateTagsRequest = parseResult.data;
    const response = await generateTagsWithAIOrFallback(requestData);

    return res.json(response);
  } catch (error: any) {
    next(error);
  }
});

// Standalone Title Analysis Endpoint
app.post('/api/analyze-title', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, category = 'Gaming' } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A valid title is required for keyword analysis.',
      });
    }

    const result = generateTagsWithFallbackEngine({
      title,
      category,
      count: 10,
    });

    return res.json({
      success: true,
      titleAnalysis: result.titleAnalysis,
      seoSuggestions: result.seoSuggestions,
    });
  } catch (error: any) {
    next(error);
  }
});

// Static files for production build
const clientDistPath = path.resolve(__dirname, '../dist');
app.use(express.static(clientDistPath));

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(clientDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send('GV YouTube Tag Generator API Server is running.');
    }
  });
});

// Centralized error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected internal error occurred. Please try again.',
  });
});

// Start listener only when run directly (not during unit testing)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[GV Tag Generator Server] Running on http://localhost:${PORT}`);
    console.log(`[AI Mode]: ${process.env.GEMINI_API_KEY ? 'Gemini AI Active' : 'Linguistic Fallback NLP Engine Active'}`);
  });
}
