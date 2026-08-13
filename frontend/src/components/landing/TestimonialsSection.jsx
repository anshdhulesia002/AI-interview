import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Alex Rivera',
      role: 'Senior Backend Engineer',
      company: 'Landed L5 @ Google',
      hike: '+$55k Offer Increase',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      content: 'The voice AI system design rounds were indistinguishable from my real Google interview. The real-time feedback on concurrency tradeoffs helped me pass with strong hire ratings.',
      stars: 5,
    },
    {
      name: 'Sarah Jenkins',
      role: 'Frontend Architect',
      company: 'Landed E5 @ Meta',
      hike: '+$40k Offer Increase',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      content: 'I used to freeze during live coding sessions. Practicing 8 mock rounds on Interview AI built my confidence, optimized my time complexity explanations, and secured 3 FAANG offers.',
      stars: 5,
    },
    {
      name: 'Michael Scott',
      role: 'Fullstack Engineer',
      company: 'Landed Senior @ Netflix',
      hike: '+$60k Offer Increase',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      content: 'The STAR method behavioral feedback was a game-changer. The AI pointed out exactly where my stories lacked metrics and helped me structure clear, impactful answers.',
      stars: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-content-primary tracking-tight">
            Loved by Engineers Who Landed Dream Offers
          </h2>
          <p className="text-base sm:text-lg text-content-secondary">
            Join thousands of developers who transformed their tech career with Interview AI.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-2xl bg-surface-card border border-border-default shadow-xl flex flex-col justify-between relative group hover:border-sky-500/40 transition-all"
            >
              <Quote className="w-10 h-10 text-sky-500/10 absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-4">
                {/* Star Ratings */}
                <div className="flex items-center gap-1">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-content-secondary leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={item.avatar} name={item.name} size="md" status="online" />
                  <div>
                    <h4 className="text-sm font-bold text-content-primary">{item.name}</h4>
                    <p className="text-xs text-content-muted">{item.role}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <Badge variant="success" size="sm">{item.company}</Badge>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> {item.hike}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
