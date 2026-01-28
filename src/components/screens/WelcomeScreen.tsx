import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Smartphone,
  Car,
  Armchair,
  History,
  ChevronRight,
  User,
  Crown,
  Sparkles,
  ArrowRight,
  Maximize2,
  Scan,
  Activity,
  BadgeCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRepairStore } from '@/store/repairStore';
import { useRepairHistory } from '@/hooks/useRepairHistory';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ProFeaturesSection } from '@/components/home/ProFeaturesSection';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

const categories = [
  { icon: Smartphone, label: 'Electronics', items: ['Phones', 'Laptops', 'Tablets'] },
  { icon: Car, label: 'Automotive', items: ['Interior', 'Lights', 'Minor repairs'] },
  { icon: Armchair, label: 'Furniture', items: ['Assembly', 'Repairs', 'Restoration'] },
];

export const WelcomeScreen = forwardRef<HTMLDivElement>((_, ref) => {
  const setScreen = useRepairStore((state) => state.setScreen);
  const navigate = useNavigate();
  const { history } = useRepairHistory();
  const { user, profile, isPro } = useAuth();
  const recentRepairs = history.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* ADVANCED BLUEPRINT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main Technical Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Large Geometric Accents */}
        <svg className="absolute top-[-5%] right-[-10%] w-[80%] h-[80%] sm:w-[60%] sm:h-[60%] opacity-[0.02] text-primary" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
          <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke="currentColor" strokeWidth="0.2" />
        </svg>

        {/* Dynamic Scan Line */}
        <motion.div
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/10 to-transparent z-0"
        />
      </div>

      <GlobalHeader />

      {/* HIGH-END HERO SECTION */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6">
        <section className="relative pt-10 pb-12 sm:pt-24 sm:pb-32 overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-16 items-center">
            {/* Column: Text Content */}
            <div className="lg:col-span-7 relative z-10 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 sm:mb-8 glass-card">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-primary">Your Intelligent Repair Partner</span>
                </div>

                <h1 className="text-[12vw] sm:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[0.9] mb-6 sm:mb-8">
                  Fix it like <br />
                  <span className="text-primary italic">an Expert.</span>
                </h1>

                <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-lg mb-8 sm:mb-12 font-medium mx-auto lg:mx-0">
                  Don't let broken things hold you back. Follow expert-verified guides to restore your devices with confidence and ease.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="h-14 sm:h-16 px-10 sm:px-12 text-[11px] sm:text-xs font-mono font-black tracking-[0.2em] shadow-2xl shadow-primary/30 group relative overflow-hidden rounded-full"
                    onClick={() => {
                      if (user) {
                        setScreen('device-selection');
                      } else {
                        navigate('/auth?redirect=repair');
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    Get Started Now
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {!isPro && (
                    <Link to="/pricing">
                      <Button variant="outline" size="lg" className="h-14 sm:h-16 px-8 sm:px-10 text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] border-2 group rounded-full border-primary/20 hover:border-primary/50">
                        <Crown className="w-4 h-4 mr-3 text-amber-500 group-hover:scale-125 transition-transform" />
                        Explore Pro
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Column: Visual 3D element */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="relative mx-auto max-w-sm lg:max-w-none"
              >
                {/* Decorative Frame */}
                <div className="absolute inset-[-40px] border border-primary/10 rounded-[48px] pointer-events-none hidden lg:block opacity-50 industrial-border" />

                <div className="aspect-square sm:aspect-[4/5] rounded-[32px] sm:rounded-[48px] overflow-hidden relative shadow-[0_32px_64px_-16px_rgba(var(--primary),0.3)] bg-gradient-to-br from-primary/5 to-transparent border border-white/10 group">
                  <img
                    src="/images/hero-3d.png"
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                    alt="Fixium 3D Assistant"
                  />

                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Stats Section */}
        <div className="relative z-10 mb-16 sm:mb-20">
          <StatsSection extended />
        </div>

        {/* Pro Features Section */}
        <ProFeaturesSection isPro={isPro} isLoggedIn={!!user} />

        {/* The Protocol - How it Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 sm:mb-24 py-16 px-8 rounded-[40px] bg-muted/5 border border-border/40 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="text-center mb-16">
            <h2 className="font-mono text-[10px] sm:text-[11px] font-black tracking-[0.5em] text-primary mb-4 uppercase">
              The Protocol
            </h2>
            <p className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic">
              How Fixium <span className="text-primary not-italic">Restores Reality.</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/5">
                <Scan className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-mono text-xs font-black tracking-widest uppercase mb-3">01. Optical Scan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Capture the structural failure point. Our vision models identifies the exact hardware model and component status.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6 transition-all group-hover:scale-110 group-hover:-rotate-3 shadow-lg shadow-indigo-500/5">
                <Zap className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="font-mono text-xs font-black tracking-widest uppercase mb-3">02. AI Diagnostics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Gemini 3.0 analyzes the breakage against 1.2M+ verified logs to generate a surgical repair path.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-amber-500/5">
                <Wrench className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-mono text-xs font-black tracking-widest uppercase mb-3">03. Restoration</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Execute the guided teardown. If the fix reaches critical complexity, seamlessly pivot to our expert marketplace.</p>
            </div>

            {/* Connector Lines (Desktop only) */}
            <div className="hidden sm:block absolute top-8 left-[calc(16.6%+4rem)] right-[calc(16.6%+4rem)] h-px bg-gradient-to-r from-primary/20 via-indigo-500/20 to-amber-500/20 -z-10" />
          </div>
        </motion.section>

        {/* Categories We Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 sm:mb-24"
        >
          <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
            <h2 className="font-mono text-[9px] sm:text-[10px] font-black tracking-[0.4em] text-primary mb-3 sm:mb-4 px-1">
              What You Can Fix
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Multi-Category Support</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.label}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl sm:rounded-3xl bg-muted/20 border border-border/40 hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                  <cat.icon className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />
                </div>
                <cat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4 sm:mb-6" />
                <h3 className="font-mono text-base sm:text-lg font-black tracking-tighter text-foreground mb-3 sm:mb-4">{cat.label}</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Marketplace Teaser */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 sm:mb-24"
        >
          <div className="rounded-[40px] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.png')] bg-repeat" />
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 p-8 sm:p-12 items-center relative z-10">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Verified Experts</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 uppercase italic">
                  Complete Repair <br /><span className="text-primary not-italic">Marketplace.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                  Some repairs require a specialist's touch. Connect with vetted technicians, request custom quotes, and get your device fixed by the best in the industry.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/marketplace">
                    <Button size="lg" className="w-full sm:w-auto font-mono font-bold tracking-widest uppercase h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
                      Find a Technician
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/technician-apply">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto font-mono font-bold tracking-widest uppercase h-14 rounded-2xl border-primary/20 hover:bg-primary/5">
                      Apply as Pro
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <div className="aspect-video rounded-3xl bg-black/40 border border-white/10 overflow-hidden backdrop-blur-sm shadow-2xl relative">
                  {/* ADVANCED SPECIALIST RADAR SVG */}
                  <svg className="w-full h-full text-primary" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Radial Background */}
                    <circle cx="200" cy="112.5" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-20" />
                    <circle cx="200" cy="112.5" r="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-10" />

                    {/* Rotating Scanner Line */}
                    <motion.line
                      x1="200" y1="112.5" x2="200" y2="32.5"
                      stroke="currentColor" strokeWidth="1.5"
                      className="opacity-40"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      style={{ originX: "200px", originY: "112.5px" }}
                    />

                    {/* Specialist Blips (Animated Avatars) */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <circle cx="150" cy="70" r="4" fill="currentColor" />
                      <circle cx="150" cy="70" r="10" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
                    </motion.g>

                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                    >
                      <circle cx="260" cy="90" r="4" fill="currentColor" />
                      <circle cx="260" cy="90" r="10" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
                    </motion.g>

                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
                    >
                      <circle cx="210" cy="150" r="4" fill="currentColor" />
                      <circle cx="210" cy="150" r="10" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
                    </motion.g>

                    {/* Floating Info Tags */}
                    <rect x="50" y="40" width="70" height="20" rx="4" fill="currentColor" className="opacity-[0.05]" />
                    <text x="60" y="53" className="fill-primary font-mono text-[8px] font-bold opacity-40 uppercase tracking-widest">Specialist</text>

                    <rect x="280" y="160" width="80" height="20" rx="4" fill="currentColor" className="opacity-[0.05]" />
                    <text x="290" y="173" className="fill-primary font-mono text-[8px] font-bold opacity-40 uppercase tracking-widest">Verified</text>
                  </svg>

                  {/* Technical Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="font-mono text-[7px] text-primary/60 uppercase tracking-[0.2em]">Network Active</span>
                      </div>
                      <p className="font-mono text-[10px] text-white font-bold tracking-tighter uppercase italic">Fixium Specialist Grid</p>
                    </div>
                    <div className="font-mono text-[8px] text-white/40 tracking-[0.3em] uppercase">0x4F_ALLOCATION</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Community & Knowledge Hub */}
        <section className="mb-16 sm:mb-24 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-10 rounded-[32px] bg-card border border-border/50 hover:border-primary/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
              <Activity className="w-32 h-32 text-primary" />
            </div>
            <Activity className="w-8 h-8 text-primary mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Fixium Community</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
              Join a global network of fixers. Share your repair stories, ask for help on tricky diagnostics, and contribute to the hive mind.
            </p>
            <Link to="/community">
              <Button variant="link" className="p-0 h-auto font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/80">
                Enter Forums <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-10 rounded-[32px] bg-card border border-border/50 hover:border-primary/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
              <Scan className="w-32 h-32 text-indigo-500" />
            </div>
            <Scan className="w-8 h-8 text-indigo-500 mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Diagnostic Database</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
              Access thousands of verified repair logs. Search by device model, symptom, or error code to find proven solutions instantly.
            </p>
            <Button variant="link" className="p-0 h-auto font-mono text-xs uppercase tracking-widest text-indigo-400 hover:text-indigo-300">
              Search Registry <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        </section>

        {/* Community Testimonials */}
        <div className="mb-16 sm:mb-24">
          <TestimonialsSection />
        </div>

        {/* Recent Repairs */}
        {recentRepairs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 sm:mb-24"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8 px-1">
              <h2 className="font-mono text-[10px] sm:text-[11px] font-black tracking-[0.3em] text-primary flex items-center gap-3">
                <span className="w-6 sm:w-8 h-[1px] bg-primary/30" />
                Recent Activity
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentRepairs.map((repair) => (
                <div
                  key={repair.id}
                  className="flex items-center gap-4 p-4 rounded-xl sm:rounded-2xl bg-card border border-border/50 shadow-none hover:border-primary/40 hover:bg-muted/10 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <History className="w-5 h-5 text-primary/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[11px] sm:text-sm font-bold text-foreground truncate tracking-tighter">
                      {repair.guide.deviceInfo.model || repair.guide.deviceInfo.category}
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground tracking-widest mt-1 opacity-60">
                      {formatDistanceToNow(repair.completedAt, { addSuffix: true })}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 sm:py-16 bg-muted/10 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center sm:text-left">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 mb-10 text-center sm:text-left">
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20 p-1.5 overflow-hidden">
                  <img src="/logo-fixium.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-base font-black tracking-tighter leading-none mb-1">Fixium</span>
                  <span className="font-mono text-[8px] tracking-[0.2em] text-primary/60 leading-none">Guided Care</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground max-w-[240px] leading-relaxed italic">Helping you fix what matters, with expert guidance at every step.</p>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <p className="font-mono text-[9px] sm:text-[10px] font-black text-primary mb-4">Company</p>
              <ul className="text-xs font-medium text-muted-foreground space-y-3">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-center sm:items-start col-span-2 sm:col-span-1 mt-8 sm:mt-0">
              <p className="font-mono text-[9px] sm:text-[10px] font-black text-primary mb-4">Legal</p>
              <ul className="text-xs font-medium text-muted-foreground space-y-3">
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8" />
          <p className="text-[10px] text-muted-foreground/40 font-mono tracking-[0.4em]">
            Fixium // Your Repair Companion // {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';
