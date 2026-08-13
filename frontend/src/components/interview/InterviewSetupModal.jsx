import { useState } from 'react';
import { Sliders, Briefcase, Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const InterviewSetupModal = ({ isOpen, onClose, initialDomain, onGenerate }) => {
  const [formData, setFormData] = useState({
    role: initialDomain || 'Frontend Engineer',
    difficulty: 'Senior',
    experienceYears: '3-5 Years',
    durationMinutes: '45',
    targetCompany: 'Google / Meta',
  });

  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    'Frontend Engineer',
    'Backend Engineer',
    'Fullstack Engineer',
    'System Design Architect',
    'DevOps Engineer',
    'AI / ML Engineer',
  ];

  const difficulties = ['Junior', 'Mid', 'Senior', 'Staff'];
  const experienceOptions = ['0-2 Years', '3-5 Years', '6-8 Years', '9+ Years'];
  const durations = [
    { label: '15 mins (Express)', value: '15' },
    { label: '30 mins (Standard)', value: '30' },
    { label: '45 mins (Full Loop)', value: '45' },
    { label: '60 mins (Deep Dive)', value: '60' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onGenerate) {
        await onGenerate({
          ...formData,
          domain: initialDomain || formData.role,
        });
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate AI Mock Interview"
      description="Configure your target role, difficulty, experience level, and duration"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        
        {/* 1. Target Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-content-primary flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-sky-400" /> 1. Select Target Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFormData({ ...formData, role: r })}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  formData.role === r
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                    : 'bg-surface-base border-border-default text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Difficulty Level Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-content-primary flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-400" /> 2. Difficulty Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setFormData({ ...formData, difficulty: diff })}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  formData.difficulty === diff
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                    : 'bg-surface-base border-border-default text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Years of Experience Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-content-primary flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> 3. Years of Experience
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {experienceOptions.map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => setFormData({ ...formData, experienceYears: exp })}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  formData.experienceYears === exp
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                    : 'bg-surface-base border-border-default text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Duration Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-content-primary flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> 4. Session Duration
          </label>
          <div className="grid grid-cols-2 gap-2">
            {durations.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setFormData({ ...formData, durationMinutes: d.value })}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  formData.durationMinutes === d.value
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                    : 'bg-surface-base border-border-default text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-content-muted">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Stores session in MongoDB
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-lg shadow-sky-500/25"
            >
              Generate & Save Session
            </Button>
          </div>
        </div>

      </form>
    </Modal>
  );
};
