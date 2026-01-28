import { motion } from 'framer-motion';
import { Gavel, AlertTriangle, Scale, UserCheck, ArrowLeft, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      id: "01",
      title: "Agreement to Terms",
      icon: UserCheck,
      content: "By accessing or using the Fixium platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately terminate your use of our Smart Repair Assistant and associated services."
    },
    {
      id: "02",
      title: "DIY Repair Disclaimer",
      icon: AlertTriangle,
      content: "FIXIUM PROVIDES REPAIR GUIDANCE 'AS-IS'. Repairing consumer electronics and other physical goods involves significant risk, including electric shock, fire, and permanent property damage. You assume all responsibility for your safety and the integrity of your devices. Fixium, its partners, and its developers are not liable for any direct or indirect damages, injuries, or data loss resulting from your use of our guides."
    },
    {
      id: "03",
      title: "User Obligations",
      icon: ShieldCheck,
      content: "You represent that you have the legal capacity to enter into this agreement. You agree to provide accurate information, including device model data and visual captures. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
    },
    {
      id: "04",
      title: "Intellectual Property",
      icon: BookOpen,
      content: "The Fixium interface, Smart Diagnosis algorithms, and generated repair guides are the exclusive property of Fixium. We grant you a limited, non-exclusive, non-transferable license to access our guides for personal, non-commercial use only."
    },
    {
      id: "05",
      title: "Pro Subscriptions & Billing",
      icon: Zap,
      content: "Pro features are provided on a subscription basis. Fees are billed in advance on a recurring monthly or annual cycle. You may cancel your subscription at any time; however, we do not provide refunds for partial months or unused portions of a billing cycle."
    },
    {
      id: "06",
      title: "Indemnification",
      icon: Gavel,
      content: "You agree to indemnify and hold Fixium harmless from any claims, losses, or liabilities (including legal fees) arising from your misuse of the platform, your violation of these terms, or any damage caused during a repair attempted while using our services."
    },
    {
      id: "07",
      title: "Modifications to Service",
      icon: Scale,
      content: "Fixium reserves the right to modify or discontinue any part of the service (including AI features and guide libraries) at any time without prior notice. We are not liable to you or any third party for any modification, price change, or suspension of the service."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%">
          <pattern id="grid-terms" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-terms)" />
        </svg>
      </div>

      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center gap-4 h-16 px-6 max-w-7xl mx-auto w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="tap-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-mono text-sm font-bold tracking-widest uppercase text-primary">Legal_Terms // v1.8.4</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-8">
              <Gavel className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-primary">Service Framework & Liability</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8 uppercase italic leading-[0.9]">
              Governing <span className="text-primary not-italic">Rules</span> <br />
              & Usage.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              These terms define our relationship with you as you use our technology to restore your belongings. Please read the DIY Disclaimer carefully.
            </p>
          </div>

          <div className="grid gap-12 sm:gap-16 mb-24">
            {sections.map((section) => (
              <div key={section.id} className="grid lg:grid-cols-12 gap-8 items-start pb-12 border-b border-border/30 last:border-0">
                <div className="lg:col-span-1">
                  <span className="font-mono text-xs font-black text-primary/40 tracking-tighter">{section.id}</span>
                </div>
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold uppercase tracking-tight text-foreground text-sm">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <div className="lg:col-span-8 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-12 rounded-[40px] bg-muted/30 border border-border/50 text-center">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground mb-4">Final Agreement</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto">By clicking 'Initialize Repair' or similar actions on our platform, you confirm your acceptance of these terms and acknowledge the risks associated with DIY technical work.</p>
            <Button onClick={() => navigate('/')} className="h-16 px-12 font-mono text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
              I Acknowledge & Accept
            </Button>
          </div>
        </motion.div>
      </main>

      <footer className="py-16 bg-muted/10 border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.4em]">
            GOVERNANCE_PROTOCOL // JURISDICTION: GLOBAL // 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
