import React, { useState, useEffect } from 'react';
import {
  Category,
  GenerateTagsRequest,
  GenerateTagsResponse,
  OutputLanguage,
  SavedHistoryItem,
  SeoSuggestionsResult,
  TagItem,
  TargetAudience,
  TitleAnalysisResult,
} from '../shared/types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GeneratorCard } from './components/GeneratorCard';
import { ResultsSection } from './components/ResultsSection';
import { HashtagCard } from './components/HashtagCard';
import { TitleAnalyzerCard } from './components/TitleAnalyzerCard';
import { HistorySection } from './components/HistorySection';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { SeoGuideSection } from './components/SeoGuideSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import {
  getLocalHistory,
  saveToLocalHistory,
  deleteHistoryItem,
  clearAllHistory,
} from './utils/historyStorage';
import { generateTagsWithFallbackEngine } from '../server/engine/tagEngine';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Gaming');
  const [language, setLanguage] = useState<OutputLanguage>('Hindi');
  const [audience, setAudience] = useState<TargetAudience>('India');
  const [count, setCount] = useState<10 | 20 | 30 | 40>(20);

  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [tags, setTags] = useState<TagItem[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [titleAnalysis, setTitleAnalysis] = useState<TitleAnalysisResult | undefined>();
  const [seoSuggestions, setSeoSuggestions] = useState<SeoSuggestionsResult | undefined>();
  const [engineUsed, setEngineUsed] = useState<'ai' | 'fallback_nlp'>('fallback_nlp');

  const [history, setHistory] = useState<SavedHistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getLocalHistory());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const handleGenerate = async (overrideTitle?: string, isRegen = false) => {
    const currentTitle = overrideTitle || title;
    if (!currentTitle || !currentTitle.trim()) {
      setErrorMessage('Please enter a YouTube video title before generating tags.');
      return;
    }

    setErrorMessage(null);
    if (isRegen) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }

    const payload: GenerateTagsRequest = {
      title: currentTitle.trim(),
      description: description.trim() || undefined,
      category,
      language,
      audience,
      count,
    };

    try {
      let data: GenerateTagsResponse;

      // Try server API first
      try {
        const response = await fetch('/api/generate-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          // If server returns error, or during offline/mocking, fall back to client NLP engine
          const errorJson = await response.json().catch(() => null);
          if (response.status === 400 && errorJson?.error) {
            setErrorMessage(errorJson.error);
            setIsLoading(false);
            setIsRegenerating(false);
            return;
          }
          throw new Error('Server returned non-200');
        }
      } catch (networkErr) {
        // Transparent client-side fallback if server endpoint is unreachable
        console.warn('API endpoint unreachable, using client-side fallback engine:', networkErr);
        const fallback = generateTagsWithFallbackEngine(payload);
        const commaStr = fallback.tags.map((t) => t.text).join(', ');
        data = {
          success: true,
          engineUsed: 'fallback_nlp',
          tags: fallback.tags,
          hashtags: fallback.hashtags,
          titleAnalysis: fallback.titleAnalysis,
          seoSuggestions: fallback.seoSuggestions,
          characterStats: {
            totalCharactersCommaSeparated: commaStr.length,
            tagCount: fallback.tags.length,
            recommendedLimit: 500,
          },
        };
      }

      setTags(data.tags);
      setHashtags(data.hashtags);
      setTitleAnalysis(data.titleAnalysis);
      setSeoSuggestions(data.seoSuggestions);
      setEngineUsed(data.engineUsed);

      // Save to local history
      saveToLocalHistory({
        title: currentTitle.trim(),
        description: description.trim() || undefined,
        category,
        language,
        audience,
        tags: data.tags,
        hashtags: data.hashtags,
        characterCount: data.characterStats.totalCharactersCommaSeparated,
      });
      setHistory(getLocalHistory());

      showToast(isRegen ? 'Tags regenerated!' : 'Tags generated successfully!');

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to generate tags. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleSelectExample = (exTitle: string, exCat?: string, exLang?: string) => {
    setTitle(exTitle);
    if (exCat) setCategory(exCat as Category);
    if (exLang) setLanguage(exLang as OutputLanguage);
    setErrorMessage(null);

    // Focus or trigger generation
    handleGenerate(exTitle);
  };

  const handleLoadHistoryItem = (item: SavedHistoryItem) => {
    setTitle(item.title);
    if (item.description) setDescription(item.description);
    setCategory(item.category);
    setLanguage(item.language);
    setAudience(item.audience);
    setTags(item.tags);
    setHashtags(item.hashtags);
    setErrorMessage(null);
    showToast(`Restored "${item.title}"`);

    setTimeout(() => {
      const resultsEl = document.getElementById('results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    showToast('Removed entry from history');
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Hero onSelectExample={handleSelectExample} />

        <GeneratorCard
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          language={language}
          setLanguage={setLanguage}
          audience={audience}
          setAudience={setAudience}
          count={count}
          setCount={setCount}
          onGenerate={() => handleGenerate()}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />

        {/* Results Section */}
        {tags.length > 0 && (
          <>
            <ResultsSection
              tags={tags}
              setTags={setTags}
              hashtags={hashtags}
              engineUsed={engineUsed}
              onRegenerate={() => handleGenerate(title, true)}
              isRegenerating={isRegenerating}
              onToast={showToast}
              title={title}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <HashtagCard hashtags={hashtags} onToast={showToast} />

              <TitleAnalyzerCard
                analysis={titleAnalysis}
                seoSuggestions={seoSuggestions}
                onSelectTitleVariation={(v) => {
                  setTitle(v);
                  showToast('Applied title variation to generator');
                }}
                onToast={showToast}
              />
            </div>
          </>
        )}

        {/* Local History Section */}
        <HistorySection
          history={history}
          onLoadItem={handleLoadHistoryItem}
          onDeleteItem={handleDeleteHistoryItem}
          onClearAll={handleClearAllHistory}
          onToast={showToast}
        />

        <HowItWorks />
        <SeoGuideSection />
        <FaqSection />
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};
