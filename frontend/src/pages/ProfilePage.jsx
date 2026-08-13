import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Globe,
  Camera,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  X,
  Code2,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    targetRole: 'Senior Fullstack Engineer',
    bio: 'Passionate software engineer with 6+ years of experience building scalable microservices, high-performance React frontends, and cloud architectures.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    github: 'https://github.com/alexrivera-dev',
    linkedin: 'https://linkedin.com/in/alexrivera-dev',
    portfolio: 'https://alexrivera.dev',
  });

  // Skills Tag State
  const [skills, setSkills] = useState([
    'React 19',
    'Node.js',
    'TypeScript',
    'System Design',
    'PostgreSQL',
    'Docker',
    'GraphQL',
    'Python',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Experience List State
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      role: 'Senior Software Engineer',
      company: 'TechFlow Systems',
      period: '2022 - Present',
      description: 'Led a team of 5 engineers building distributed caching services handling 100k req/sec.',
    },
    {
      id: 2,
      role: 'Fullstack Developer',
      company: 'CloudScale Labs',
      period: '2020 - 2022',
      description: 'Architected real-time WebSocket dashboard for monitoring cloud microservice telemetry.',
    },
  ]);

  // Education List State
  const [educations, setEducations] = useState([
    {
      id: 1,
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2016 - 2020',
    },
  ]);

  // UI Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Avatar Image Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, avatarUrl: imageUrl });
    }
  };

  // Add Skill Handler
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  // Remove Skill Handler
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Add Experience Handler
  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      role: 'Software Engineer',
      company: 'Company Name',
      period: '2023 - Present',
      description: 'Describe key responsibilities and accomplishments...',
    };
    setExperiences([...experiences, newExp]);
  };

  // Remove Experience Handler
  const handleRemoveExperience = (id) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  // Add Education Handler
  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: 'Degree Title',
      school: 'Institution / University',
      year: 'Year - Year',
    };
    setEducations([...educations, newEdu]);
  };

  // Remove Education Handler
  const handleRemoveEducation = (id) => {
    setEducations(educations.filter((e) => e.id !== id));
  };

  // Save Profile Handler
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-surface-base text-content-primary">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Profile Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                Candidate Profile
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                Manage your avatar, technical skills, background, and social presence.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="shadow-lg shadow-sky-500/20"
            >
              Save Profile
            </Button>
          </div>

          {/* Success Toast Banner */}
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-400 text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Profile changes saved successfully!</span>
                </div>
                <button type="button" onClick={() => setShowSuccessToast(false)}>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. AVATAR & BASIC DETAILS CARD */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Profile Photo & Identity</CardTitle>
              <CardDescription>Update your public avatar and primary target role</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border-subtle">
                
                {/* Avatar Preview & Upload Trigger */}
                <div className="relative group">
                  <Avatar src={profileData.avatarUrl} name={profileData.name} size="xl" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">Upload</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<Camera className="w-3.5 h-3.5" />}
                    >
                      Change Photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileData({ ...profileData, avatarUrl: '' })}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-content-muted">JPG, PNG or GIF. Max size 5MB.</p>
                </div>

              </div>

              {/* Personal Details Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  prefixIcon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  prefixIcon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  prefixIcon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Target Job Title"
                  value={profileData.targetRole}
                  onChange={(e) => setProfileData({ ...profileData, targetRole: e.target.value })}
                  prefixIcon={<Briefcase className="w-4 h-4" />}
                />
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-content-primary">Professional Summary / Bio</label>
                <textarea
                  rows="3"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full p-3 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. TECHNICAL SKILLS MANAGER */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="w-5 h-5 text-sky-400" />
                <span>Technical & Soft Skills</span>
              </CardTitle>
              <CardDescription>Add skills to customize AI mock interview questions</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              
              {/* Add Skill Form */}
              <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
                <Input
                  placeholder="e.g. React 19, Python, System Design"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary" size="md" type="submit" leftIcon={<Plus className="w-4 h-4" />}>
                  Add
                </Button>
              </form>

              {/* Skill Pill Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Badge
                      variant="primary"
                      size="md"
                      className="gap-1.5 py-1 px-3 bg-sky-500/10 border-sky-500/30 text-sky-300"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-400 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. WORK EXPERIENCE SECTION */}
          <Card variant="default" className="p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <span>Work Experience</span>
                </CardTitle>
                <CardDescription>Your past positions & key accomplishments</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddExperience}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Experience
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-surface-base/60 border border-border-subtle space-y-3 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="absolute top-4 right-4 text-content-muted hover:text-red-400 transition-colors"
                    title="Remove position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <Input
                      label="Job Title"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = experiences.map((item) =>
                          item.id === exp.id ? { ...item, role: e.target.value } : item
                        );
                        setExperiences(updated);
                      }}
                    />
                    <Input
                      label="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = experiences.map((item) =>
                          item.id === exp.id ? { ...item, company: e.target.value } : item
                        );
                        setExperiences(updated);
                      }}
                    />
                    <Input
                      label="Period"
                      value={exp.period}
                      onChange={(e) => {
                        const updated = experiences.map((item) =>
                          item.id === exp.id ? { ...item, period: e.target.value } : item
                        );
                        setExperiences(updated);
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-content-muted">Accomplishments</label>
                    <textarea
                      rows="2"
                      value={exp.description}
                      onChange={(e) => {
                        const updated = experiences.map((item) =>
                          item.id === exp.id ? { ...item, description: e.target.value } : item
                        );
                        setExperiences(updated);
                      }}
                      className="w-full p-2.5 text-xs bg-surface-card border border-border-default rounded-xl text-content-primary focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 4. EDUCATION SECTION */}
          <Card variant="default" className="p-6">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  <span>Education</span>
                </CardTitle>
                <CardDescription>Degrees & academic qualifications</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddEducation}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Education
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-2xl bg-surface-base/60 border border-border-subtle space-y-3 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="absolute top-4 right-4 text-content-muted hover:text-red-400 transition-colors"
                    title="Remove education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <Input
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = educations.map((item) =>
                          item.id === edu.id ? { ...item, degree: e.target.value } : item
                        );
                        setEducations(updated);
                      }}
                    />
                    <Input
                      label="Institution"
                      value={edu.school}
                      onChange={(e) => {
                        const updated = educations.map((item) =>
                          item.id === edu.id ? { ...item, school: e.target.value } : item
                        );
                        setEducations(updated);
                      }}
                    />
                    <Input
                      label="Year"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = educations.map((item) =>
                          item.id === edu.id ? { ...item, year: e.target.value } : item
                        );
                        setEducations(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 5. SOCIAL & PORTFOLIO LINKS */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Social & Portfolio Profiles</span>
              </CardTitle>
              <CardDescription>Connect GitHub, LinkedIn, and personal website</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <Input
                label="GitHub URL"
                value={profileData.github}
                onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                prefixIcon={
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                }
              />

              <Input
                label="LinkedIn URL"
                value={profileData.linkedin}
                onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                prefixIcon={
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                }
              />

              <Input
                label="Portfolio Website"
                value={profileData.portfolio}
                onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                prefixIcon={<Globe className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          {/* Sticky Bottom Save Action Bar */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-surface-card border border-border-default shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-4">
            <span className="text-xs text-content-secondary hidden sm:inline">Unsaved profile updates</span>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="shadow-md shadow-sky-500/20"
            >
              Save Profile Changes
            </Button>
          </div>

        </main>

      </div>

    </div>
  );
};

export default ProfilePage;
