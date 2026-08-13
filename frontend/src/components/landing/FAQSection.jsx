import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How realistic is the AI voice interviewer compared to a human interviewer?',
      answer: 'Our voice AI models are trained on thousands of technical interview recordings from FAANG and top tech companies. The AI speaks naturally, asks follow-up questions based on your explanations, detects pauses, and challenges your assumptions just like a senior human interviewer.',
    },
    {
      question: 'Which programming languages are supported in the live coding rounds?',
      answer: 'We support over 15 programming languages including Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#, Ruby, PHP, and Swift. Our live IDE evaluates time/space complexity, syntax correctness, and edge cases in real time.',
    },
    {
      question: 'Can I practice company-specific interview loops (e.g. Google or Meta)?',
      answer: 'Yes! Interview AI features company-tailored tracks for Google, Meta, Amazon, Apple, Netflix, and top startups. Questions match the exact difficulty, question frequency, and evaluation rubrics of your target company.',
    },
    {
      question: 'How does resume and job description personalization work?',
      answer: 'When you upload your resume or paste a job description URL, our AI analyzes the required skills, tech stack, and your past project experiences. It then generates personalized interview questions that probe your actual resume achievements.',
    },
    {
      question: 'Is my voice data and resume information private and secure?',
      answer: 'Absoluty. Your privacy is paramount. All voice recordings and code submissions are encrypted in transit and at rest. We never share your resume data with third parties or use candidate submissions to train public models.',
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings with a single click. You will retain full access until the end of your billing period with zero cancellation fees.',
    },
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-content-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-content-secondary">
            Everything you need to know about Interview AI and how it works.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-surface-card border border-border-default overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-content-primary">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg border transition-transform duration-300 ${
                    isOpen ? 'bg-sky-500/20 border-sky-500/40 rotate-180' : 'bg-surface-hover border-border-subtle'
                  }`}>
                    <ChevronDown className="w-4 h-4 text-sky-400" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-2 text-sm text-content-secondary leading-relaxed border-t border-border-subtle/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
