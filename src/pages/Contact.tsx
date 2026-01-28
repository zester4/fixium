import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Clock, LifeBuoy, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function Contact() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: "Transmission Received",
      description: "Our support engineers have been notified of your inquiry.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%">
          <pattern id="grid-contact" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-contact)" />
        </svg>
      </div>

      <GlobalHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            {/* Left: Content */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <h1 className="text-[12vw] lg:text-6xl font-black tracking-tighter text-foreground mb-6 sm:mb-8 italic leading-[0.85] lg:leading-[0.9]">
                Technical <br />
                <span className="text-primary not-italic text-sm sm:text-lg">Support Center</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 sm:mb-12 leading-relaxed">
                Our support team is ready to assist with technical issues, account inquiries, or general feedback.
              </p>

              <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-6 sm:gap-4 text-left">
                <div className="flex items-start gap-4 p-4 lg:p-0 rounded-2xl bg-muted/20 lg:bg-transparent border border-border/50 lg:border-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold tracking-tight text-[11px] sm:text-xs mb-1">Fast Response</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-none">Average response time is under 12 hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 lg:p-0 rounded-2xl bg-muted/20 lg:bg-transparent border border-border/50 lg:border-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <LifeBuoy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold tracking-tight text-[11px] sm:text-xs mb-1">Direct Engineering</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-none">Talk to the team building FixFlow.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 lg:p-0 rounded-2xl bg-muted/20 lg:bg-transparent border border-border/50 lg:border-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold tracking-tight text-[11px] sm:text-xs mb-1">Peer Support</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-none">Join our active Discord community.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7 w-full max-w-2xl mx-auto">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-12 text-center rounded-[32px] sm:rounded-[40px] bg-muted/30 border border-dashed border-primary/30"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4">Message Sent</h2>
                  <p className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed">Your inquiry has been received. We'll be in touch shortly.</p>
                  <Button onClick={() => navigate('/')} variant="outline" className="h-14 px-8 sm:px-10 font-mono text-[10px] sm:text-xs font-black tracking-[0.2em] border-border/60 w-full sm:w-auto">
                    Take me Home
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] bg-muted/20 border border-border/50 shadow-2xl space-y-6 sm:space-y-8">
                  <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="name" className="font-mono text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-primary">Your Name</Label>
                      <Input id="name" placeholder="John Doe" className="h-12 sm:h-14 bg-background border-border/50 font-mono text-sm shadow-sm" required />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="email" className="font-mono text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-primary">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="h-12 sm:h-14 bg-background border-border/50 font-mono text-sm shadow-sm" required />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="subject" className="font-mono text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-primary">How can we help?</Label>
                    <Input id="subject" placeholder="Select a topic..." className="h-12 sm:h-14 bg-background border-border/50 font-mono text-sm shadow-sm" required />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="message" className="font-mono text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-primary">Describe your issue</Label>
                    <Textarea
                      id="message"
                      placeholder="Provide details about your technical issue..."
                      className="min-h-[150px] sm:min-h-[200px] bg-background border-border/50 font-mono text-sm shadow-sm leading-relaxed"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 sm:h-16 font-mono text-xs sm:text-sm font-black tracking-[0.3em] shadow-2xl shadow-primary/20 group relative overflow-hidden" disabled={isLoading}>
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success opacity-60" />
                    <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground tracking-tight">Your connection is secure and encrypted</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-12 sm:py-16 bg-muted/10 border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[9px] sm:text-[10px] text-muted-foreground/40 font-mono tracking-[0.3em] sm:tracking-[0.4em]">
            FixFlow global operations // 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
