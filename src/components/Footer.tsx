import React, { useState } from 'react';
import { ShieldCheck, Heart, ExternalLink, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-dark-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white font-black text-sm shadow-sm">
                GV
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                GV YouTube Tag Generator
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed text-xs">
              Fast, privacy-focused YouTube video tag and hashtag generator. Helping creators, gamers, and educators optimize their content metadata with multi-lingual support.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free • No Signup Required • Client-Side History</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 text-[11px]">
              Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('generator')}
                  className="hover:text-brand-500 transition-colors"
                >
                  YouTube Tag Generator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('analyzer')}
                  className="hover:text-brand-500 transition-colors"
                >
                  Title Keyword Analyzer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-brand-500 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('about')}
                  className="hover:text-brand-500 transition-colors"
                >
                  SEO Best Practices
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 text-[11px]">
              Trust & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setModalType('privacy')}
                  className="hover:text-brand-500 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalType('terms')}
                  className="hover:text-brand-500 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('faq')}
                  className="hover:text-brand-500 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p className="text-center sm:text-left text-[11px] leading-relaxed max-w-2xl">
            <strong>Disclaimer:</strong> GV YouTube Tag Generator is an independent creator utility and is not affiliated with, sponsored by, or endorsed by YouTube or Google LLC. YouTube™ is a registered trademark of Google LLC.
          </p>
          <div className="flex items-center gap-1 text-[11px] font-medium flex-shrink-0">
            <span>Built with care for creators worldwide © {new Date().getFullYear()} GV Tags</span>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Privacy & Terms */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    <strong>Data Handling:</strong> We respect your creative privacy. Titles and descriptions entered into GV YouTube Tag Generator are processed only in memory to generate keyword suggestions and are not stored in any permanent database or shared with advertisers.
                  </p>
                  <p>
                    <strong>Local Storage:</strong> Your recent generated tags are stored locally on your device via standard browser <code>localStorage</code> for your convenience. You can clear this history anytime.
                  </p>
                  <p>
                    <strong>Third-Party AI:</strong> If an AI API is enabled on the server, requests are processed under strict privacy guidelines and prompt data is never used to train public models.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Fair Usage:</strong> This tool is provided free of charge for content creators to assist in organizing video metadata and keyword discovery.
                  </p>
                  <p>
                    <strong>No Ranking Guarantees:</strong> GV YouTube Tag Generator does not guarantee YouTube views, algorithmic impressions, or subscriber growth. Video performance depends on content quality, viewer retention, and audience satisfaction.
                  </p>
                  <p>
                    <strong>Community Guidelines:</strong> Creators are responsible for ensuring that their final video tags accurately reflect their content and comply with YouTube Community Guidelines regarding misleading metadata.
                  </p>
                </>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
