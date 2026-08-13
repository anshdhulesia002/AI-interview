import { motion } from 'framer-motion';
import { TrendingUp, Users, Star, Zap } from 'lucide-react';

export const StatsSection = () => {
  const stats = [
    {
      icon: <TrendingUp className="w-6 h-6 text-sky-400" />,
      value: '98.4%',
      label: 'Offer Success Rate',
      description: 'Candidates who complete 5+ mock interviews receive job offers.',
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      value: '500,000+',
      label: 'Mock Interviews Completed',
      description: 'Simulations conducted across Frontend, Backend, and System Design.',
    },
    {
      icon: <Star className="w-6 h-6 text-amber-400" />,
      value: '4.9 / 5.0',
      label: 'Candidate Satisfaction',
      description: 'Rated #1 AI interview preparation tool by tech job seekers.',
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      value: '3.5x',
      label: 'Faster Offer Speed',
      description: 'Accelerated job search timeline from initial screen to final offer.',
    },
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-surface-card border border-border-default shadow-lg hover:border-sky-500/40 hover:shadow-glow-sky transition-all group"
            >
              <div className="p-3 rounded-xl bg-surface-hover border border-border-subtle inline-block mb-4 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
                {stat.value}
              </h3>
              <p className="text-sm font-bold text-sky-400 mt-1">{stat.label}</p>
              <p className="text-xs text-content-secondary mt-2 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
