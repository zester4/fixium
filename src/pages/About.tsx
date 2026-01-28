import { motion } from 'framer-motion';
import { Wrench, Heart, Zap, Globe, ArrowLeft, ShieldCheck, Leaf, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%">
          <pattern id="grid-about" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-about)" />
        </svg>
      </div>

      <GlobalHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="max-w-3xl mb-16 sm:mb-24 text-center sm:text-left">
            <h1 className="text-[12vw] sm:text-7xl font-black tracking-tighter text-foreground mb-6 sm:mb-8 uppercase italic leading-[0.85] sm:leading-[0.9]">
              The <span className="text-primary not-italic">Philosophy</span> <br />
              of Repair.
            </h1>
            <p className="text-lg sm:text-2xl text-muted-foreground leading-relaxed font-medium">
              Fixium is a response to a world built for the temporary. We believe that ownership is only real when you have the right to repair, understand, and sustain the things you own.
            </p>
          </div>

          {/* Deep Content Sections */}
          <div className="space-y-20 sm:space-y-24">
            {/* Mission Section */}
            <section className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-start">
              <div className="lg:col-span-4 text-center sm:text-left">
                <h2 className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 sm:mb-4">01 // THE_MISSION</h2>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight leading-none">Curbing Global E-Waste.</h3>
              </div>
              <div className="lg:col-span-8 space-y-4 sm:space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
                <p>
                  Every year, millions of tons of consumer electronics end up in landfills. Often, these devices are discarded not because they are beyond repair, but because the path to fixing them has been intentionally obscured by manufacturers.
                </p>
                <p>
                  Fixium's mission is to democratize technical knowledge. By using smart visual analysis and community-vetted guides, we lower the barrier to entry for DIY repair, keeping devices in hands and out of landfills.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-3 sm:mb-4" />
                    <p className="text-xs sm:text-sm font-bold text-foreground uppercase mb-1">Environmental Impact</p>
                    <p className="text-[11px] sm:text-xs">Targeting a 20% reduction in annual device turnover for our active user base.</p>
                  </div>
                  <div className="p-5 sm:p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-3 sm:mb-4" />
                    <p className="text-xs sm:text-sm font-bold text-foreground uppercase mb-1">Community Growth</p>
                    <p className="text-[11px] sm:text-xs">Empowering over 50,000 users to complete their first successful repair in 2026.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Section */}
            <section className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-start pt-16 sm:pt-24 border-t border-border/30">
              <div className="lg:col-span-4 lg:order-last text-center sm:text-left">
                <h2 className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 sm:mb-4 lg:text-left">02 // TECHNOLOGY</h2>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight leading-none lg:text-left">Visual Intelligence.</h3>
              </div>
              <div className="lg:col-span-8 space-y-4 sm:space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
                <p>
                  Our Smart Repair Assistant isn't just a database of text. It's a vision-aware engine powered by the latest Gemini models, trained to understand the specific geometry and damage patterns of modern consumer goods.
                </p>
                <p>
                  When you upload a photo, our system performs a multi-pass analysis:
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex gap-3 sm:gap-4 items-start">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-mono text-[9px] sm:text-[10px] font-bold text-primary">A</span>
                    </div>
                    <p className="text-xs sm:text-sm"><strong className="text-foreground uppercase">Component Mapping:</strong> Identifying specific screws, flex cables, and housing clips unique to your model.</p>
                  </li>
                  <li className="flex gap-3 sm:gap-4 items-start">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-mono text-[9px] sm:text-[10px] font-bold text-primary">B</span>
                    </div>
                    <p className="text-xs sm:text-sm"><strong className="text-foreground uppercase">Failure Patterning:</strong> Correlating visual damage with known technical failure modes across thousands of devices.</p>
                  </li>
                  <li className="flex gap-3 sm:gap-4 items-start">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-mono text-[9px] sm:text-[10px] font-bold text-primary">C</span>
                    </div>
                    <p className="text-xs sm:text-sm"><strong className="text-foreground uppercase">Adaptive Guidance:</strong> Generating instructions that adapt to the tools you have available and your technical skill level.</p>
                  </li>
                </ul>
              </div>
            </section>

            {/* Human Section */}
            <section className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-start pt-16 sm:pt-24 border-t border-border/30">
              <div className="lg:col-span-4 text-center sm:text-left">
                <h2 className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 sm:mb-4">03 // HUMAN_CENTERED</h2>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight leading-none">Designed for People.</h3>
              </div>
              <div className="lg:col-span-8 space-y-4 sm:space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
                <p>
                  We believe that technical documentation should be as beautiful and clear as a luxury manual. We've moved away from the robotic, confusing language of the past to create an experience that reduces anxiety and builds confidence.
                </p>
                <p>
                  Every word in Fixium is carefully humanized to ensure that even the most complex disassembly feels manageable. We don't just tell you what to do; we explain <em>why</em> it matters and how to stay safe during the process.
                </p>
                <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-primary/5 border border-primary/10 italic text-foreground/80 text-sm sm:text-base">
                  "Repair is more than just a functional necessity—it's an act of mindfulness and a rebellion against the temporary."
                </div>
              </div>
            </section>
          </div>

          {/* Call to Action Expansion */}
          <div className="mt-24 sm:mt-32 p-8 sm:p-12 rounded-[32px] sm:rounded-[40px] bg-foreground text-background relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
              <svg width="100%" height="100%">
                <pattern id="grid-cta" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid-cta)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 text-center md:text-left">
              <div className="max-w-md">
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-4 leading-none">The Future is <span className="text-primary italic">Repairable.</span></h2>
                <p className="text-background/70 text-base sm:text-lg leading-relaxed">Join a community of thousands who are taking back control of their belongings. Start your first repair guide today.</p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 w-full md:w-auto">
                <Button
                  size="lg"
                  onClick={() => navigate('/')}
                  className="h-14 sm:h-16 px-10 sm:px-12 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-xl w-full"
                >
                  Start for Free
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="h-14 sm:h-16 px-10 sm:px-12 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] border-background/20 hover:bg-background hover:text-foreground w-full"
                >
                  Talk to the Team
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-12 sm:py-16 bg-muted/10 border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[9px] sm:text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em]">
            FIXIUM_OS // DESIGNED_FOR_SUSTAINABILITY // GLOBAL_OPERATIONS
          </p>
        </div>
      </footer>
    </div>
  );
}
