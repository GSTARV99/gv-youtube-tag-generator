export type Category =
  | 'Gaming'
  | 'Minecraft'
  | 'Education'
  | 'Technology'
  | 'Entertainment'
  | 'Vlogging'
  | 'Music'
  | 'Sports'
  | 'News'
  | 'Comedy'
  | 'Travel'
  | 'Fitness'
  | 'Food'
  | 'Other';

export type OutputLanguage =
  | 'Hindi'
  | 'English'
  | 'Hinglish'
  | 'Bengali'
  | 'Tamil'
  | 'Telugu'
  | 'Marathi'
  | 'Other';

export type TargetAudience = 'India' | 'Global' | 'Custom';

export type TagRelevance = 'Highly relevant' | 'Related' | 'Broad';

export interface TagItem {
  id: string;
  text: string;
  relevance: TagRelevance;
  category?: string;
  source?: 'ai' | 'engine' | 'user';
}

export interface GenerateTagsRequest {
  title: string;
  description?: string;
  category?: Category;
  language?: OutputLanguage;
  audience?: TargetAudience;
  count?: 10 | 20 | 30 | 40;
}

export interface TitleAnalysisResult {
  mainTopic: string;
  importantKeywords: string[];
  secondaryPhrases: string[];
  ambiguousWording: string[];
  descriptiveSuggestions: string[];
  clarityScore: number; // 0-100
}

export interface SeoSuggestionsResult {
  titleVariations: string[];
  missingKeywords: string[];
  relatedPhrases: string[];
  metadataAlignmentTips: string[];
}

export interface GenerateTagsResponse {
  success: boolean;
  engineUsed: 'ai' | 'fallback_nlp';
  tags: TagItem[];
  hashtags: string[];
  titleAnalysis: TitleAnalysisResult;
  seoSuggestions: SeoSuggestionsResult;
  characterStats: {
    totalCharactersCommaSeparated: number;
    tagCount: number;
    recommendedLimit: number; // 500
  };
}

export interface SavedHistoryItem {
  id: string;
  timestamp: number;
  title: string;
  description?: string;
  category: Category;
  language: OutputLanguage;
  audience: TargetAudience;
  tags: TagItem[];
  hashtags: string[];
  characterCount: number;
}
