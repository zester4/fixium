import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, ArrowLeft, FileText, Share2, Cookie, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      id: "01",
      title: "Introduction",
      icon: FileText,
      content: "This Privacy Policy describes how Fixium ('we', 'us', or 'our') collects, uses, and shares your personal information when you use our website, mobile application, and Smart Repair Assistant services. We are committed to protecting your privacy through technical precision and transparent data practices."
    },
    {
      id: "02",
      title: "Data Collection Subsystems",
      icon: Database,
      content: "We collect information through three primary channels: 1) Account Information: Name, email, and authentication metadata. 2) Device Information: Metadata about the items you seek to repair, including model names and technical specs. 3) Visual Data: Photos and videos captured for AI diagnosis."
    },
    {
      id: "03",
      title: "The Visual Privacy Protocol",
      icon: Eye,
      content: "Your uploaded photos are our most sensitive data point. We employ a 'Visual-Only' processing protocol where images are analyzed by our AI engines to identify component damage and then stored in encrypted containers. We do not use your personal photos for public marketing or external AI training without explicit, one-time consent."
    },
    {
      id: "04",
      title: "Third-Party AI Integration",
      icon: Share2,
      content: "To provide industry-leading diagnosis, we utilize secure gateways to Google Gemini and other advanced vision models. These partners are strictly prohibited from using your data for their own purposes and must adhere to our rigorous security standards for data ephemeralization."
    },
    {
      id: "05",
      title: "Cookies & Tracking",
      icon: Cookie,
      content: "We use essential cookies to maintain your session and security. We also utilize anonymized analytics to understand system performance and guide our development roadmap. You can manage your tracking preferences in your browser or device settings."
    },
    {
      id: "06",
      title: "Security & Encryption",
      icon: Lock,
      content: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Our internal security subsystems are audited regularly to ensure that your repair history and diagnostic data remain protected against unauthorized access."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%">
          <pattern id="grid-privacy" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-privacy)" />
        </svg>
      </div>

      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center gap-4 h-16 px-6 max-w-7xl mx-auto w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="tap-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-mono text-sm font-bold tracking-widest uppercase text-primary">Legal_Privacy // rev_2026.1</span>
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
              <Shield className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-primary">Data Protection Framework</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8 uppercase italic leading-[0.9]">
              Visual <span className="text-primary not-italic">Integrity</span> <br />
              & Privacy.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We handle your diagnostic data with the same technical precision we use to generate your repair guides. Your trust is our core architecture.
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

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[40px] bg-muted/30 border border-border/50">
              <UserCheck className="w-8 h-8 text-primary mb-6" />
              <h4 className="text-xl font-bold uppercase tracking-tight text-foreground mb-4">Your Data Rights</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">You have the absolute right to view, modify, or permanently erase your diagnostic history. We provide self-service tools in your profile to purge all visual and technical data from our subsystems instantly.</p>
              <Button variant="outline" className="w-full font-mono text-[10px] font-bold uppercase tracking-widest h-12">
                Access Data Dashboard
              </Button>
            </div>
            <div className="p-10 rounded-[40px] bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
              <Share2 className="w-8 h-8 text-white mb-6" />
              <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-4">Privacy Inquiries</h4>
              <p className="text-sm opacity-80 leading-relaxed mb-8">For complex data requests or specialized privacy inquiries, our legal and technical team is available for direct consultation.</p>
              <Button onClick={() => navigate('/contact')} variant="secondary" className="w-full font-mono text-[10px] font-bold uppercase tracking-widest h-12">
                Contact Privacy Team
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-16 bg-muted/10 border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.4em]">
            SYSTEM_ID: PRIVACY_SECURE // JURISDICTION: GLOBAL_WEB // 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
