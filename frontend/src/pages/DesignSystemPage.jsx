import { useState } from 'react';
import { Search, Mail, Lock, User, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Dropdown, DropdownItem, DropdownDivider } from '../components/ui/Dropdown';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Loading } from '../components/ui/Loading';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { useTheme } from '../hooks/useTheme';

export const DesignSystemPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('John Doe');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="space-y-12 pb-16">
      
      {/* Design System Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900/40 via-sky-800/20 to-surface-card p-8 border border-sky-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-3">
              Interview AI UI Library v1.0
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
              Design System & Component Showcase
            </h1>
            <p className="text-sm text-content-secondary mt-2 max-w-2xl">
              A comprehensive set of accessible, theme-adaptive design tokens and reusable UI components built with React 19, Tailwind CSS, and Framer Motion.
            </p>
          </div>
          <Button variant="primary" onClick={toggleTheme} leftIcon={<User className="w-4 h-4" />}>
            Active Theme: {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
          </Button>
        </div>
      </section>

      {/* 1. COLOR PALETTE TOKENS */}
      <section className="space-y-4">
        <div className="border-b border-border-default pb-2">
          <h2 className="text-2xl font-bold text-content-primary">Color Palette & Tokens</h2>
          <p className="text-xs text-content-muted">Semantic light & dark theme adaptive tokens</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-sky-500 text-white font-mono text-xs shadow-md">
            <p className="font-bold">Primary Sky</p>
            <p className="opacity-80">#0ea5e9</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-mono text-xs shadow-md">
            <p className="font-bold">Success</p>
            <p className="opacity-80">#10b981</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500 text-white font-mono text-xs shadow-md">
            <p className="font-bold">Warning</p>
            <p className="opacity-80">#f59e0b</p>
          </div>
          <div className="p-4 rounded-xl bg-red-500 text-white font-mono text-xs shadow-md">
            <p className="font-bold">Danger</p>
            <p className="opacity-80">#ef4444</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-border-default text-content-primary font-mono text-xs shadow-md">
            <p className="font-bold">Surface Card</p>
            <p className="text-content-muted">var(--bg-card)</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-hover border border-border-default text-content-primary font-mono text-xs shadow-md">
            <p className="font-bold">Surface Hover</p>
            <p className="text-content-muted">var(--bg-hover)</p>
          </div>
        </div>
      </section>

      {/* 2. BUTTONS */}
      <section className="space-y-4">
        <div className="border-b border-border-default pb-2">
          <h2 className="text-2xl font-bold text-content-primary">Buttons</h2>
          <p className="text-xs text-content-muted">Multiple variants, sizes, icon slots, and Framer Motion micro-animations</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" isLoading>Loading</Button>
          <Button variant="primary" leftIcon={<Mail className="w-4 h-4" />}>Icon Left</Button>
          <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>Icon Right</Button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </section>

      {/* 3. CARDS */}
      <section className="space-y-4">
        <div className="border-b border-border-default pb-2">
          <h2 className="text-2xl font-bold text-content-primary">Cards</h2>
          <p className="text-xs text-content-muted">Default, Glassmorphism, and Interactive hover cards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard background and border styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-content-secondary">This card uses standard theme tokens for surface background and subtle border outlines.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glassmorphic Card</CardTitle>
              <CardDescription>Translucent backdrop blur effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-content-secondary">Uses glassmorphism backdrop-blur to blend seamlessly into theme backgrounds.</p>
            </CardContent>
            <CardFooter>
              <Badge variant="primary">Glassmorphism</Badge>
            </CardFooter>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Interactive Hover Card</CardTitle>
              <CardDescription>Hover glow and border highlight</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-content-secondary">Interactive cards highlight on cursor hover with smooth shadow-glow effects.</p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="sm">Explore</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 4. INPUTS & FORM FIELDS */}
      <section className="space-y-4">
        <div className="border-b border-border-default pb-2">
          <h2 className="text-2xl font-bold text-content-primary">Inputs & Form Controls</h2>
          <p className="text-xs text-content-muted">Text, password visibility toggling, search with clear icon, error states</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            prefixIcon={<User className="w-4 h-4" />}
            helperText="Your full name as displayed on profile"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            prefixIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            prefixIcon={<Lock className="w-4 h-4" />}
            helperText="Must be at least 6 characters"
          />

          <Input
            label="Search Domain"
            placeholder="Search interviews..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
            prefixIcon={<Search className="w-4 h-4" />}
          />

          <Input
            label="Error Validation State"
            placeholder="Invalid field"
            error="This email address is already taken"
            prefixIcon={<Mail className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* 5. DROPDOWNS & MODALS */}
      <section className="space-y-4">
        <div className="border-b border-border-default pb-2">
          <h2 className="text-2xl font-bold text-content-primary">Dropdowns & Modals</h2>
          <p className="text-xs text-content-muted">Light dismiss popover dropdown menus & backdrop dialogs</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Dropdown Specimen */}
          <Dropdown
            trigger={
              <Button variant="secondary" rightIcon={<User className="w-4 h-4" />}>
                User Options Dropdown
              </Button>
            }
          >
            <DropdownItem icon={<User className="w-4 h-4" />}>My Profile</DropdownItem>
            <DropdownItem icon={<CheckCircle2 className="w-4 h-4" />} active>
              Active Subscription
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={<Trash2 className="w-4 h-4" />} danger>
              Delete Account
            </DropdownItem>
          </Dropdown>

          {/* Modal Trigger Specimen */}
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Accessible Modal Dialog
          </Button>
        </div>

        {/* Modal Specimen */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Interview AI Confirmation Modal"
          description="Light-dismiss enabled modal dialog with Framer Motion transitions."
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm Action
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-content-secondary">
              This modal locks background scroll, traps focus, supports Esc closing, and allows light-dismiss backdrop clicking.
            </p>
            <Input label="Interview Session Title" placeholder="e.g. Senior Frontend Engineer Mock" />
          </div>
        </Modal>
      </section>

      {/* 6. BADGES & AVATARS */}
      <section className="space-y-4">
        <div className="border-b border-border-default pb-2">
          <h2 className="text-2xl font-bold text-content-primary">Badges & Avatars</h2>
          <p className="text-xs text-content-muted">Status badges, soft colors, dot indicators & initial avatars</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary" dot>Primary Soft</Badge>
            <Badge variant="success" dot>Scheduled</Badge>
            <Badge variant="warning">In Progress</Badge>
            <Badge variant="danger" dot>Failed</Badge>
            <Badge variant="info">System Design</Badge>
            <Badge variant="primary" styleType="solid">Solid Badge</Badge>
            <Badge variant="secondary" styleType="outline">Outline Badge</Badge>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Avatar name="Vansh Sharma" size="xs" status="online" />
            <Avatar name="Sarah Jenkins" size="sm" status="away" />
            <Avatar name="Alex Rivera" size="md" status="online" />
            <Avatar name="Michael Scott" size="lg" status="busy" />
            <Avatar name="David Miller" size="xl" status="offline" />
          </div>
        </div>
      </section>

      {/* 7. LOADING & SKELETON PLACEHOLDERS */}
      <section className="space-y-4">
        <div className="border-b border-border-default pb-2">
          <h2 className="text-2xl font-bold text-content-primary">Loading Spinners & Skeletons</h2>
          <p className="text-xs text-content-muted">Spinners, wave dots, pulse loaders & shimmering skeleton cards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-surface-card border border-border-default rounded-xl space-y-4">
            <h4 className="text-sm font-semibold text-content-primary">Loader Variants</h4>
            <div className="flex items-center gap-8">
              <div className="text-center space-y-1">
                <Loading type="spinner" size="md" />
                <span className="text-xs text-content-muted">Spinner</span>
              </div>
              <div className="text-center space-y-1">
                <Loading type="dots" size="md" />
                <span className="text-xs text-content-muted">Dots Wave</span>
              </div>
              <div className="text-center space-y-1">
                <Loading type="pulse" size="md" />
                <span className="text-xs text-content-muted">Pulse</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-content-primary">Shimmer Skeleton Elements</h4>
            <div className="flex items-center gap-3">
              <Skeleton variant="avatar" />
              <div className="space-y-1 flex-1">
                <Skeleton variant="text" className="w-1/3" />
                <Skeleton variant="text" className="w-2/3" />
              </div>
            </div>
            <SkeletonCard />
          </div>
        </div>
      </section>

    </div>
  );
};
