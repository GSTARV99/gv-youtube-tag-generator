import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const faqs: FaqItem[] = [
    {
      question: 'What are YouTube tags?',
      answer:
        'YouTube tags are descriptive keywords and phrases added to a video’s backend metadata in YouTube Studio. They help YouTube’s algorithm categorize the topic of your content and can be especially useful if the subject of your video is commonly misspelled or searched using alternative colloquial terms.',
    },
    {
      question: 'How does this YouTube Tag Generator work?',
      answer:
        'GV YouTube Tag Generator analyzes your video title, optional description, category, and target language. It uses natural language processing (NLP) and contextual topic expansion to generate a balanced set of primary tags, long-tail search phrases, and category-relevant keywords, ranked by topical relevance.',
    },
    {
      question: 'Can I generate Hindi and Hinglish tags?',
      answer:
        'Yes, absolutely. Our system has dedicated multi-lingual support for Hindi (including Devanagari script), Hinglish (Romanized Hindi conversational search queries like "kaise kare" or "hindi me"), as well as Bengali, Tamil, Telugu, and Marathi.',
    },
    {
      question: 'Can I generate tags for Minecraft videos?',
      answer:
        'Yes! We have specialized gaming modules with extensive recognition of Minecraft terms such as Survival Series, Hardcore, Bedrock, MCPE, Netherite, Redstone, Farm Tutorials, and episode formats.',
    },
    {
      question: 'What is the difference between tags and hashtags?',
      answer:
        'Video tags are hidden backend keywords entered in YouTube Studio (up to 500 characters) to help YouTube categorize content. Hashtags (prefixed with #) are placed inside your video title or description and display as clickable search links above the video title for viewers.',
    },
    {
      question: 'Can I copy all generated tags at once?',
      answer:
        'Yes. You can copy all generated tags with a single click in comma-separated format (ready to paste directly into YouTube Studio’s tag box) or line-by-line format. You can also download them as a .txt file.',
    },
    {
      question: 'Does this tool guarantee more YouTube views?',
      answer:
        'No. We believe in complete transparency: no tool can honestly guarantee YouTube rankings or views. Tags are only one small part of metadata. YouTube prioritizes viewer satisfaction, click-through rate (CTR on thumbnails and titles), watch time, and average percentage viewed.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No account, signup, or login is required. You can immediately generate, edit, and copy tags for free right from the homepage.',
    },
    {
      question: 'Is the tool free to use?',
      answer:
        'Yes, GV YouTube Tag Generator is 100% free with no hidden paywalls, subscription fees, or locked features.',
    },
    {
      question: 'Are my titles stored on a server?',
      answer:
        'No. Your submitted video titles and descriptions are processed strictly in-memory during the generation request. We do not store, index, or sell your content on any server database. Your recent history is stored locally in your own web browser.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Clear, honest answers about YouTube tags, search optimization, and tool usage.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
