import { motion } from 'framer-motion';
import { Mic, Code2, BrainCircuit, Target, BarChart3, FileText, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Mic className="w-6 h-6 text-sky-400" />,
      title: 'Conversational Voice AI',
      description: 'Practice natural voice-based technical interviews. AI evaluates tone, confidence, clarity, and pacing in real time.',
      badge: 'Voice Analysis',
    },
    {
      icon: <Code2 className="w-6 h-6 text-cyan-400" />,
      title: 'Live Code Evaluation',
      description: 'Write solutions in 15+ programming languages. Instant feedback on time/space complexity, edge cases, and code style.',
      badge: 'Interactive IDE',
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-indigo-400" />,
      title: 'STAR Method Coaching',
      description: 'Master behavioral questions. Receive breakdown of Situation, Task, Action, and Result formatting for maximum impact.',
      badge: 'Behavioral AI',
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      title: 'Company-Specific Tracks',
      description: 'Custom question pools tailored for Google, Meta, Amazon, Apple, and top startups with exact difficulty matching.',
      badge: 'Targeted Prep',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      title: 'Readiness Scorecard',
      description: 'Comprehensive post-interview analytics featuring overall score, domain heatmaps, and personalized study recommendations.',
      badge: 'Analytics',
    },
    {
      icon: <FileText className="w-6 h-6 text-rose-400" />,
      title: 'Resume Customization',
      description: 'Upload your resume or targeted job description to generate hyper-personalized technical questions based on your experience.',
      badge: 'Personalized',
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cutting-Edge Features</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-content-primary tracking-tight">
            Everything You Need to Ace Your Technical Rounds
          </h2>
            <p className="text-base sm:text-lg text-content-secondary">
            Built by senior engineering interviewers to replicate realistic tech company interview loops.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card variant="interactive" className="h-full flex flex-col justify-between p-7">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-surface-hover border border-border-subtle shadow-sm">
                      {feature.icon}
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {feature.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="mt-2">
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
