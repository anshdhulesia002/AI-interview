import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Upload, Mic, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      icon: <Sliders className="w-6 h-6 text-sky-400" />,
      title: 'Configure Your Session',
      subtitle: 'Select role, domain & difficulty level',
      description: 'Choose your target role (Frontend, Backend, System Design, Fullstack), set difficulty level, and select target tech companies.',
      highlights: ['Frontend, Backend, System Design', 'Junior, Mid, Senior, Staff difficulty', 'Target company interview loops'],
    },
    {
      id: 2,
      icon: <Upload className="w-6 h-6 text-cyan-400" />,
      title: 'Personalize Context',
      subtitle: 'Upload resume or job description',
      description: 'Paste the target job description or upload your resume. Our AI extracts key technical topics and projects to craft custom questions.',
      highlights: ['Automatic skill extraction', 'Tailored project deep dives', 'Job description matching'],
    },
    {
      id: 3,
      icon: <Mic className="w-6 h-6 text-indigo-400" />,
      title: 'Live AI Simulation',
      subtitle: 'Conduct voice & coding round',
      description: 'Interact with our conversational voice AI avatar. Code in our collaborative IDE while the AI evaluates your explanations.',
      highlights: ['Natural voice conversation', 'Real-time code editor', 'Instant hint generation if stuck'],
    },
    {
      id: 4,
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: 'Detailed Scorecard',
      subtitle: 'Review feedback & improvement plan',
      description: 'Receive instant actionable feedback, code complexity analysis, STAR behavioral ratings, and a step-by-step prep roadmap.',
      highlights: ['Time & space complexity grade', 'Communication clarity breakdown', 'Personalized practice questions'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative bg-surface-card/40 border-y border-border-default/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-content-primary tracking-tight">
            How Interview AI Prepares You for Success
          </h2>
          <p className="text-base sm:text-lg text-content-secondary">
            From setup to post-interview analysis in less than 30 minutes.
          </p>
        </div>

        {/* 4-Step Interactive Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Step Selector Buttons */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-surface-card border-sky-500 shadow-lg shadow-sky-500/10'
                      : 'bg-surface-card/50 border-border-default hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg border transition-colors ${
                      isActive ? 'bg-sky-500/20 border-sky-500/40' : 'bg-surface-hover border-border-subtle'
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Step 0{step.id}</span>
                      <h4 className={`text-base font-bold transition-colors ${isActive ? 'text-content-primary' : 'text-content-secondary'}`}>
                        {step.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'text-sky-400 translate-x-1' : 'text-content-muted opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl bg-surface-card border border-border-default shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-8xl font-extrabold text-content-primary/5 select-none pointer-events-none">
                  0{steps[activeStep].id}
                </div>

                <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 mb-6">
                  {steps[activeStep].icon}
                </div>

                <h3 className="text-2xl font-bold text-content-primary mb-2">
                  {steps[activeStep].title}
                </h3>
                <p className="text-sm font-semibold text-sky-400 mb-4">
                  {steps[activeStep].subtitle}
                </p>
                <p className="text-sm text-content-secondary leading-relaxed mb-6">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-border-subtle">
                  <p className="text-xs font-bold uppercase text-content-muted tracking-wider mb-3">Key Highlights</p>
                  {steps[activeStep].highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2.5 text-sm text-content-primary">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Try Step 0{steps[activeStep].id} Demo
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
