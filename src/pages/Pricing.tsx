import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    X,
    Crown,
    Zap,
    Building2,
    Globe,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    HelpCircle,
    FileDown,
    Cpu,
    ShoppingCart,
    Layers,
    BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { SEO } from '@/components/seo/SEO';
import { useNavigate } from 'react-router-dom';

const tiers = [
    {
        name: "Free",
        id: "tier-free",
        priceMonthly: "$0",
        description: "Perfect for occasional DIY repairs and electronics hobbyists.",
        features: [
            "Standard AI Diagnostics",
            "Basic Disassembly Guides",
            "Community Support Access",
            "3 Active Repair Slots",
            "Standard Image Resolution"
        ],
        cta: "Start for Free",
        mostPopular: false,
        icon: Globe
    },
    {
        name: "Fixium Pro",
        id: "tier-pro",
        priceMonthly: "$12",
        priceYearly: "$96",
        description: "The complete setup for dedicated enthusiasts and power users.",
        features: [
            "Priority AI Analysis (Gemini 3)",
            "Macro-Step Teardowns & Pro Tips",
            "Unlimited Offline PDF Exports",
            "Direct Verified Parts Sourcing",
            "Community-Vetted Tech Methods",
            "Unlimited Active Repair Slots",
            "4K Guide Reference Imagery"
        ],
        cta: "Go Pro Now",
        mostPopular: true,
        icon: Crown
    },
    {
        name: "Business",
        id: "tier-business",
        priceMonthly: "$49",
        description: "Scalable solutions for professional repair shops and small teams.",
        features: [
            "Everything in Pro Tier",
            "Team Management (Up to 5 Techs)",
            "White-label Guide Generation",
            "Advanced Inventory API Access",
            "Priority Engineer Support",
            "Workshop Dashboard Stats"
        ],
        cta: "Contact Sales",
        mostPopular: false,
        icon: Building2
    }
];

const faqs = [
    {
        q: "How does the AI analysis work?",
        a: "Fixium uses advanced computer vision to identify component damage and model specifications from your photos, then cross-references them with our extensive repair library."
    },
    {
        q: "Can I cancel my Pro subscription at any time?",
        a: "Yes. You can manage your subscription through your profile settings. You'll retain access until the end of your current billing period."
    },
    {
        q: "Do you offer refunds?",
        a: "We offer a 7-day money-back guarantee for new Pro subscribers if you're not satisfied with the guide quality."
    }
];

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
            <SEO
                title="Pricing & Plans"
                description="Choose the perfect plan for your repair needs. From free DIY basics to professional shop management with Fixium Pro."
            />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
                <svg width="100%" height="100%">
                    <pattern id="pricing-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pricing-grid)" />
                </svg>
            </div>

            <GlobalHeader />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-24 relative z-10">
                <div className="text-center mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-[12vw] sm:text-7xl font-black tracking-tighter text-foreground mb-6 uppercase italic leading-[0.85] sm:leading-[0.9]">
                            Precision <span className="text-primary not-italic">Value.</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                            Scale your repair capabilities with our AI-powered intelligence. Choose a plan that fits your technical workflow.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`font-mono text-[10px] font-black tracking-widest uppercase transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="w-14 h-7 rounded-full bg-muted border border-border p-1 relative transition-colors hover:border-primary/50"
                            >
                                <div className={`absolute top-1 bottom-1 w-5 rounded-full bg-primary transition-all duration-300 ${billingCycle === 'monthly' ? 'left-1' : 'left-8'}`} />
                            </button>
                            <span className={`font-mono text-[10px] font-black tracking-widest uppercase transition-colors ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                                Yearly
                                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-none text-[8px] py-0">Save 33%</Badge>
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`relative flex flex-col p-8 rounded-[32px] border transition-all duration-500 group ${tier.mostPopular
                                    ? 'bg-foreground text-background border-primary shadow-2xl scale-105 z-20'
                                    : 'bg-muted/10 border-border/40 hover:border-primary/30 z-10'
                                }`}
                        >
                            {tier.mostPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Badge className="bg-primary text-primary-foreground font-mono text-[10px] px-6 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl">Most Popular</Badge>
                                </div>
                            )}

                            <div className="mb-8 relative">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${tier.mostPopular ? 'bg-primary/20 text-primary' : 'bg-primary/5 text-primary'
                                    }`}>
                                    <tier.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{billingCycle === 'yearly' && tier.priceYearly ? `$${Math.round(parseInt(tier.priceYearly.replace('$', '')) / 12)}` : tier.priceMonthly}</span>
                                    <span className={`text-sm font-medium ${tier.mostPopular ? 'text-background/60' : 'text-muted-foreground'}`}>/month</span>
                                </div>
                                {billingCycle === 'yearly' && tier.priceYearly && (
                                    <p className="text-[10px] font-mono uppercase tracking-widest mt-2 opacity-60">Billed annually ({tier.priceYearly})</p>
                                )}
                                <p className={`mt-4 text-sm leading-relaxed ${tier.mostPopular ? 'text-background/80' : 'text-muted-foreground'}`}>
                                    {tier.description}
                                </p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {tier.features.map(feature => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${tier.mostPopular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => tier.id === 'tier-business' ? navigate('/contact') : navigate('/auth')}
                                className={`w-full h-14 rounded-2xl font-mono text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tier.mostPopular
                                        ? 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
                                        : 'bg-foreground text-background hover:bg-primary'
                                    }`}
                            >
                                {tier.cta}
                                <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <section className="mt-32 border-t border-border/30 pt-24">
                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-3 mb-4">
                                <HelpCircle className="w-5 h-5 text-primary" />
                                <h2 className="font-mono text-[10px] font-black text-primary uppercase tracking-[0.4em]">Inquiry_Center</h2>
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6">Frequently Asked Questions.</h3>
                            <p className="text-muted-foreground leading-relaxed">Everything you need to know about our plans, billing, and system capabilities.</p>
                        </div>
                        <div className="lg:col-span-8 grid gap-4">
                            {faqs.map(faq => (
                                <div key={faq.q} className="p-8 rounded-[32px] bg-muted/20 border border-border/40 hover:border-primary/20 transition-all">
                                    <h4 className="text-lg font-black uppercase tracking-tight mb-3">{faq.q}</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Global CTA */}
                <div className="mt-32 p-12 rounded-[40px] bg-primary text-primary-foreground relative overflow-hidden text-center group">
                    <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                    <div className="relative z-10">
                        <Sparkles className="w-12 h-12 text-white mx-auto mb-8 opacity-50 transition-transform group-hover:scale-110" />
                        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-6 leading-none text-white">The Future is <br /><span className="italic">Pro-Repair.</span></h2>
                        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">Join over 12,000 professional technicians and hobbyists already using Fixium Pro.</p>
                        <Button
                            onClick={() => navigate('/auth')}
                            variant="secondary"
                            className="h-16 px-12 font-mono text-sm font-black uppercase tracking-[0.2em] shadow-2xl"
                        >
                            Start Your Pro Journey
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="py-16 bg-muted/10 border-t border-border/30 mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.4em]">
                        SYSTEM_INTEGRITY_CHECK // FINANCE_MODULE_v4 // {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}
