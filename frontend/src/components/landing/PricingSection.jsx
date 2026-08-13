import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const PricingSection = () => {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      description: 'Ideal for trying out AI mock interviews & basic coding practice.',
      priceMonthly: '$0',
      priceAnnual: '$0',
      period: 'Forever free',
      popular: false,
      features: [
        '3 AI Mock Interviews per month',
        'Voice & Text interaction',
        'Standard Question Bank',
        'Basic Performance Feedback',
        'Community Support',
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'secondary',
    },
    {
      name: 'Candidate Pro',
      description: 'Everything you need to master technical & behavioral interviews.',
      priceMonthly: '$29',
      priceAnnual: '$22',
      period: 'per month, billed annually',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Unlimited AI Mock Interviews',
        'Conversational Voice AI & Speech Analytics',
        '15+ Coding Languages with IDE Evaluation',
        'STAR Method Behavioral Analysis',
        'Company-Specific Interview Tracks (FAANG)',
        'Resume & Job Description Customization',
        'Detailed Readiness Scorecard & Heatmaps',
        'Priority 24/7 Support',
      ],
      buttonText: 'Start 14-Day Free Trial',
      buttonVariant: 'primary',
    },
    {
      name: 'Enterprise / Team',
      description: 'For bootcamps, universities, and engineering teams.',
      priceMonthly: '$89',
      priceAnnual: '$69',
      period: 'per seat / month',
      popular: false,
      features: [
        'Everything in Candidate Pro',
        'Dedicated Team Admin Dashboard',
        'Custom Company Question Repository',
        'Candidate Performance Benchmark Reports',
        'Custom SSO & Security Compliance',
        'Dedicated Success Manager',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
    },
  ];

  return (
    <section id="pricing" className="py-20 relative bg-surface-card/30 border-t border-border-default/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-content-primary tracking-tight">
            Invest in Your Tech Career
          </h2>
          <p className="text-base sm:text-lg text-content-secondary">
            Choose the plan that fits your interview timeline. Cancel anytime.
          </p>

          {/* Monthly vs Annual Toggle */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span className={`text-sm font-semibold ${!annualBilling ? 'text-content-primary' : 'text-content-muted'}`}>
              Monthly Billing
            </span>

            <button
              type="button"
              onClick={() => setAnnualBilling((prev) => !prev)}
              className="relative w-14 h-8 rounded-full bg-surface-card border border-border-default p-1 transition-colors focus:outline-none"
            >
              <motion.div
                animate={{ x: annualBilling ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-sky-500 shadow-md"
              />
            </button>

            <span className={`text-sm font-semibold flex items-center gap-2 ${annualBilling ? 'text-content-primary' : 'text-content-muted'}`}>
              Annual Billing
              <Badge variant="success" size="sm">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl p-8 flex flex-col justify-between relative transition-all ${
                tier.popular
                  ? 'bg-surface-card border-2 border-sky-500 shadow-2xl shadow-sky-500/15 scale-105 z-10'
                  : 'bg-surface-card border border-border-default shadow-lg hover:border-border-strong'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tier.badge}</span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-content-primary">{tier.name}</h3>
                <p className="text-xs text-content-secondary mt-2 leading-relaxed min-h-[36px]">
                  {tier.description}
                </p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-content-primary">
                      {annualBilling ? tier.priceAnnual : tier.priceMonthly}
                    </span>
                    <span className="text-sm text-content-muted">{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-border-subtle">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-content-primary">
                      <div className="p-0.5 rounded bg-sky-500/15 text-sky-400 mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  variant={tier.buttonVariant}
                  size="lg"
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {tier.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
