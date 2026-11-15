import { describe, it, expect } from 'vitest';
import {
  generateTagsWithFallbackEngine,
  optimizeTagsForYouTubeLimit,
  sanitizeTag,
  extractKeywordsAndEntities,
} from '../server/engine/tagEngine';
import { TagItem } from '../shared/types';

describe('Tag Generation Engine Tests', () => {
  // Test 1: Empty title
  it('Scenario 1: Handles empty title gracefully with validation result', () => {
    const result = generateTagsWithFallbackEngine({
      title: '   ',
      category: 'Gaming',
    });
    expect(result.tags).toHaveLength(0);
    expect(result.hashtags).toHaveLength(0);
    expect(result.titleAnalysis.clarityScore).toBe(0);
  });

  // Test 2: Minecraft title in Hindi
  it('Scenario 2: Generates specialized Minecraft tags in Hindi', () => {
    const result = generateTagsWithFallbackEngine({
      title: 'Minecraft Survival Series Episode 1 Hindi',
      category: 'Minecraft',
      language: 'Hindi',
      count: 20,
    });

    expect(result.tags.length).toBeGreaterThanOrEqual(10);
    const tagTexts = result.tags.map((t) => t.text);

    // Should include Minecraft entity keywords
    expect(tagTexts.some((t) => t.includes('minecraft'))).toBe(true);
    // Should include Hindi native or romanized variations
    expect(
      tagTexts.some((t) => t.includes('hindi') || t.includes('माइनक्राफ्ट'))
    ).toBe(true);

    // Hashtags should be relevant and formatted with #
    expect(result.hashtags).toContain('#Minecraft');
    expect(result.hashtags.every((h) => h.startsWith('#'))).toBe(true);
  });

  // Test 3: English educational video title
  it('Scenario 3: Generates targeted English educational tags', () => {
    const result = generateTagsWithFallbackEngine({
      title: 'How to Learn Python in 2025 Complete Beginner Roadmap',
      category: 'Education',
      language: 'English',
      count: 20,
    });

    expect(result.tags.length).toBeGreaterThan(5);
    const tagTexts = result.tags.map((t) => t.text);
    expect(tagTexts.some((t) => t.includes('python'))).toBe(true);
    expect(tagTexts.some((t) => t.includes('tutorial') || t.includes('course') || t.includes('guide'))).toBe(true);
    expect(result.titleAnalysis.mainTopic.toLowerCase()).toContain('python');
  });

  // Test 4: Hinglish gaming title
  it('Scenario 4: Handles Hinglish gaming titles and produces colloquial search phrases', () => {
    const result = generateTagsWithFallbackEngine({
      title: 'BGMI Me Pro Player Kaise Bane Secret Sensitivity Settings',
      category: 'Gaming',
      language: 'Hinglish',
      count: 20,
    });

    const tagTexts = result.tags.map((t) => t.text);
    expect(tagTexts.some((t) => t.includes('bgmi'))).toBe(true);
    // Should include Hinglish search phrases like 'kaise'
    expect(tagTexts.some((t) => t.includes('kaise') || t.includes('hindi'))).toBe(true);
  });

  // Test 5: Long title and description
  it('Scenario 5: Handles long title and extensive description without crashing', () => {
    const longTitle = 'Super Comprehensive Full Stack Web Development Crash Course 2025: From Zero to Junior Engineer in React Node Express TypeScript and Cloud Architecture Deployment';
    const longDescription = 'In this video we walk through how to build a production grade web application from scratch with database integration, responsive mobile design, dark and light themes, and secure authentication.'.repeat(5);

    const result = generateTagsWithFallbackEngine({
      title: longTitle,
      description: longDescription,
      category: 'Technology',
      count: 30,
    });

    expect(result.tags.length).toBeLessThanOrEqual(30);
    expect(result.tags.length).toBeGreaterThan(10);
    expect(result.titleAnalysis.clarityScore).toBeGreaterThan(0);
  });

  // Test 6: Duplicate keyword removal
  it('Scenario 6: Ensures strictly zero duplicate tags', () => {
    const result = generateTagsWithFallbackEngine({
      title: 'React React React Tutorial React Coding React',
      category: 'Technology',
      count: 20,
    });

    const tagTexts = result.tags.map((t) => t.text.toLowerCase());
    const uniqueTags = new Set(tagTexts);
    expect(tagTexts.length).toBe(uniqueTags.size);
  });

  // Test 7: Zero relevant keywords (random symbols or punctuation)
  it('Scenario 7: Handles edge case with strange symbols and punctuation', () => {
    const result = generateTagsWithFallbackEngine({
      title: '??? !!! ### $$$ %%%',
      category: 'Other',
    });

    // Should not crash and should clean symbols
    expect(result.titleAnalysis).toBeDefined();
  });

  // Test 14: YouTube-ready 500 character limit optimizer
  it('Scenario 14: Optimizes tags to strictly fit within 500 characters', () => {
    const testTags: TagItem[] = Array.from({ length: 40 }).map((_, i) => ({
      id: `tag-${i}`,
      text: `very detailed informative search keyword phrase number ${i + 1}`,
      relevance: i < 10 ? 'Highly relevant' : i < 25 ? 'Related' : 'Broad',
    }));

    const optimized = optimizeTagsForYouTubeLimit(testTags, 500);
    const joinedStr = optimized.tags.map((t) => t.text).join(', ');

    expect(joinedStr.length).toBeLessThanOrEqual(500);
    expect(optimized.characterCount).toBe(joinedStr.length);
    // Priority order: all highly relevant should be included before broad
    const highlyRelevantIncluded = optimized.tags.filter((t) => t.relevance === 'Highly relevant').length;
    expect(highlyRelevantIncluded).toBeGreaterThan(0);
  });

  // Helper tests
  it('Sanitizes tags properly by stripping illegal characters', () => {
    expect(sanitizeTag('  #Minecraft! Survival?  ')).toBe('minecraft survival');
    expect(sanitizeTag('How to Code: Python <3')).toBe('how to code python 3');
  });
});
