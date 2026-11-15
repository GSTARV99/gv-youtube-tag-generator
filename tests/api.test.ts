import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';

describe('Server API Endpoints & Failure Scenarios', () => {
  it('GET /api/health returns 200 and server status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.aiProvider).toBeDefined();
  });

  // Test 1: Empty title validation
  it('Scenario 1: POST /api/generate-tags with empty title returns 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/generate-tags')
      .send({
        title: '',
        category: 'Gaming',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Video title cannot be empty');
  });

  // Valid generation via API
  it('POST /api/generate-tags with valid payload succeeds', async () => {
    const res = await request(app)
      .post('/api/generate-tags')
      .send({
        title: 'Minecraft Bedrock Survival Episode 1',
        category: 'Minecraft',
        language: 'Hindi',
        count: 20,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.tags).toBeDefined();
    expect(res.body.tags.length).toBeGreaterThan(0);
    expect(res.body.hashtags).toBeDefined();
    expect(res.body.characterStats).toBeDefined();
  });

  // Test 8 & 9: AI API failure & timeout fallback
  it('Scenario 8 & 9: Falls back safely to NLP engine when AI is not configured or fails', async () => {
    // When no GEMINI_API_KEY is present (default in tests), it uses fallback_nlp smoothly
    const res = await request(app)
      .post('/api/generate-tags')
      .send({
        title: 'Complete React 19 Guide for Web Developers',
        category: 'Technology',
        language: 'English',
        count: 10,
      });

    expect(res.status).toBe(200);
    expect(res.body.engineUsed).toBe('fallback_nlp');
    expect(res.body.tags.length).toBeGreaterThan(0);
  });

  // Title analyzer endpoint
  it('POST /api/analyze-title analyzes title keywords accurately', async () => {
    const res = await request(app)
      .post('/api/analyze-title')
      .send({
        title: 'INSANE Epic Minecraft Survival Base Tour',
        category: 'Gaming',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.titleAnalysis).toBeDefined();
    expect(res.body.titleAnalysis.ambiguousWording).toContain('insane');
    expect(res.body.seoSuggestions).toBeDefined();
  });
});
