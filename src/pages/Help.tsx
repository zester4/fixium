import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  ShieldAlert, 
  Camera, 
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Wrench,
  Package,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    title: "The Repair Process",
    icon: Wrench,
    questions: [
      {
        q: "How does the Smart Diagnosis actually work?",
        a: "Our smart assistant uses advanced computer vision to analyze the photos you capture. It looks for visual anomalies—like hairline fractures in glass, oxidation on pins, or specific component warping—and cross-references them against a vast library of technical disassembly data. This allows us to predict not just the immediate issue, but also potential complications you might face during the repair."
      },
      {
        q: "What should I do if the AI doesn't recognize my device?",
        a: "Try to take a photo of the manufacturer label or model number (usually found on the back or under a battery cover). If the automated system still fails, you can manually select your device category and model from our library. We are constantly updating our recognition engine to support newer models."
      },
      {
        q: "Can I use generic tools for my repair?",
        a: "While we provide 'substitute' suggestions for common tools, some steps require precision instruments (like Pentalobe or Tri-wing drivers) to prevent stripping screws or damaging sensitive electronics. We always recommend using the tools specified in the guide for the safest and most reliable result."
      }
    ]
  },
  {
    title: "Safety & Compliance",
    icon: ShieldAlert,
    questions: [
      {
        q: "How do I handle a swollen or damaged battery?",
        a: "CAUTION: A swollen lithium-ion battery is a serious fire hazard. Do not attempt to charge it or puncture the casing. We recommend stopping the repair immediately and placing the device in a fireproof container or a bucket of sand. Consult our specialized 'Battery Safety Protocol' in the documentation for disposal steps."
      },
      {
        q: "Do repairs void my manufacturer warranty?",
        a: "In many jurisdictions, including the US (under the Magnuson-Moss Warranty Act), performing your own repair does not automatically void your warranty. However, any damage you cause during the repair may not be covered. We recommend checking your local 'Right to Repair' laws for specific protections."
      }
    ]
  },
  {
    title: "FixFlow Pro Features",
    icon: Zap,
    questions: [
      {
        q: "What is included in the Pro tier?",
        a: "Pro users get access to our highest-fidelity documentation, including micro-step teardowns, 4K reference imagery, and priority AI processing. Pro also unlocks 'Offline Mode,' allowing you to export your entire repair guide as a portable PDF for use without an active data connection."
      },
      {
        q: "How do I cancel my subscription?",
        a: "Subscriptions can be managed directly through your Profile settings. You will maintain access to all Pro features until the end of your current billing cycle."
      }
    ]
  }
];

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%">
          <pattern id="grid-help" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-help)" />
        </svg>
      </div>

      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center gap-4 h-16 px-6 max-w-7xl mx-auto w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="tap-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-mono text-sm font-bold tracking-widest uppercase text-primary">System_Docs // v2.1</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-foreground mb-6 uppercase italic">
              Technical <span className="text-primary not-italic">Support.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Access our comprehensive knowledge base and community-driven documentation. Designed for precision, written for humans.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
              <Input 
                placeholder="Search for guides, safety protocols, or tool tips..." 
                className="h-16 pl-14 bg-muted/20 border-border/50 font-mono text-sm shadow-2xl transition-all focus:bg-background"
              />
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {[
              { label: "Guides", icon: Book, color: "text-primary" },
              { label: "Safety", icon: ShieldAlert, color: "text-amber-500" },
              { label: "Tools", icon: Package, color: "text-blue-500" },
              { label: "AI Tips", icon: Camera, color: "text-primary" }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-center group cursor-pointer hover:border-primary/30 transition-all hover:bg-background">
                <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="font-mono font-bold uppercase text-[11px] tracking-[0.2em]">{item.label}</h3>
              </div>
            ))}
          </div>

          {/* Detailed Categories */}
          <div className="grid lg:grid-cols-12 gap-16">
             <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-24 p-8 rounded-[32px] bg-primary text-primary-foreground overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <HelpCircle className="w-24 h-24" />
                   </div>
                   <h2 className="text-2xl font-bold uppercase tracking-tighter mb-4 leading-none text-white">Need more <br />clarity?</h2>
                   <p className="text-sm opacity-80 mb-8 leading-relaxed">Our support engineers are available for specialized technical inquiries.</p>
                   <Button 
                    variant="secondary" 
                    onClick={() => navigate('/contact')}
                    className="w-full font-mono text-[10px] font-bold uppercase tracking-widest h-12"
                   >
                     Open Support Ticket
                   </Button>
                </div>
                
                <div className="p-8 rounded-[32px] bg-muted/30 border border-border/50">
                   <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Latest Updates</h4>
                   <ul className="space-y-4">
                      {[
                        "Added support for 2026 MacBook Pro internal fans",
                        "New battery safety protocol for wearable devices",
                        "Improved AI recognition for stripped screw heads"
                      ].map((update, i) => (
                        <li key={i} className="flex gap-3 text-xs leading-relaxed text-muted-foreground italic">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                           {update}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>

             <div className="lg:col-span-8 space-y-16">
                {categories.map((section) => (
                  <section key={section.title}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-mono text-sm font-black uppercase tracking-[0.3em] text-foreground italic">
                        {section.title}
                      </h2>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {section.questions.map((item, i) => (
                        <AccordionItem key={i} value={`item-${section.title}-${i}`} className="border-none">
                          <AccordionTrigger className="text-left font-bold text-base hover:no-underline hover:text-primary transition-colors py-6 px-6 rounded-2xl bg-muted/20 hover:bg-muted/40 data-[state=open]:bg-primary/5 data-[state=open]:text-primary border border-border/40">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed text-sm p-8 bg-muted/10 rounded-b-2xl border-x border-b border-border/30">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                ))}
             </div>
          </div>

          {/* Call to Action Footer */}
          <div className="mt-32 p-12 rounded-[40px] border border-dashed border-primary/30 text-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <MessageCircle className="w-8 h-8 text-primary" />
             </div>
             <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Still have questions?</h2>
             <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">We're building the future of repair together. If you can't find what you're looking for, our team is ready to help.</p>
             <Button 
                onClick={() => navigate('/contact')}
                className="h-16 px-12 font-mono text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
             >
                Connect to Support
             </Button>
          </div>
        </motion.div>
      </main>

      <footer className="py-16 bg-muted/10 border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.4em]">
            SYSTEM_INTEGRITY_CHECK // KNOWLEDGE_BASE_v42 // 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
