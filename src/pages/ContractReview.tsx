import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    ShieldCheck,
    Signature,
    User,
    Wrench,
    Calendar,
    ShieldAlert,
    ArrowRight,
    Sparkles,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { SEO } from '@/components/seo/SEO';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export default function ContractReview() {
    const [isSigned, setIsSigned] = useState(false);
    const [isSignLoading, setIsSignLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSign = () => {
        setIsSignLoading(true);
        setTimeout(() => {
            setIsSignLoading(false);
            setIsSigned(true);
            toast.success('Contract Finalized', { description: 'The technician has been formally assigned to your repair.' });
            setTimeout(() => navigate('/profile'), 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
            <SEO
                title="Repair Agreement Review"
                description="Formalize your repair request with a verified technician agreement."
            />

            {/* Industrial Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="contract-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#contract-grid)" />
                </svg>
            </div>

            <GlobalHeader />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 relative z-10">
                <div className="mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-mono text-[9px] uppercase tracking-widest mb-6 opacity-60">
                        <ChevronLeft className="w-3 h-3 mr-1" /> Back to Proposal
                    </Button>
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 italic">
                        Review & <span className="text-primary not-italic">Sign.</span>
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground italic tracking-tight">Job ID: #JOB-1502 // Status: Drafting Agreement</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <Card className="rounded-[2.5rem] border-primary/20 bg-muted/5 shadow-2xl glass-card overflow-hidden">
                        <CardHeader className="bg-primary/10 border-b border-primary/20 p-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center industrial-border">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Repair Agreement</CardTitle>
                                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em] mt-1">Official Document</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 sm:p-12 space-y-10">
                            {/* Party Information */}
                            <div className="grid sm:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black">Client (User)</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted/20 border border-border flex items-center justify-center">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-tight text-sm">User_492 (Verified)</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">ID: 4d2e-3f1g-7h8i</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black">Verified Technician</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <Wrench className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-tight text-sm">Marcus Sterling</p>
                                            <p className="text-[10px] text-primary/60 font-mono font-bold">Verified Professional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scope of Work */}
                            <div className="space-y-6 pt-10 border-t border-border/30">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <h3 className="font-mono text-[11px] font-black uppercase text-foreground tracking-[0.2em]">Scope of Work</h3>
                                </div>
                                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground/80 font-medium italic">
                                    <p>1. The Technician will perform a Logic Board restoration on the specified device (iPhone 15 Pro).</p>
                                    <p>2. The estimated resolution time is 3-5 business days from the moment and hardware reception.</p>
                                    <p>3. Both parties agree to a fixed cost of <span className="text-foreground font-black not-italic px-1">$210.00 USD</span> for labor and basic cleaning solvents.</p>
                                    <p>4. All communication must remain within the Fixium Terminal to ensure valid audit trails.</p>
                                </div>
                            </div>

                            {/* Warranty & Liability */}
                            <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 space-y-3">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <ShieldAlert className="w-4 h-4" />
                                    <p className="font-mono text-[10px] font-black uppercase tracking-widest">Important Disclaimer</p>
                                </div>
                                <p className="text-[11px] text-muted-foreground/70 font-medium italic">
                                    By signing this agreement, the Client acknowledges that hardware repair involves inherent risk to system integrity. Fixium acts as the verification layer only and is not responsible for physical handling outcomes.
                                </p>
                            </div>

                            {/* Signature Section */}
                            <div className="space-y-6 pt-10 border-t border-border/30">
                                {!isSigned ? (
                                    <div className="flex flex-col items-center justify-center gap-8 py-8">
                                        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/20 group">
                                            <Signature className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="font-black uppercase tracking-tighter text-xl leading-none">Awaiting signature.</p>
                                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Click to sign the agreement</p>
                                        </div>
                                        <Button
                                            size="lg"
                                            disabled={isSignLoading}
                                            onClick={handleSign}
                                            className="h-16 px-12 rounded-full font-mono text-xs font-black uppercase tracking-[0.3em] bg-primary shadow-2xl shadow-primary/30"
                                        >
                                            {isSignLoading ? 'Confirming...' : 'Confirm & Sign'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                            <ShieldCheck className="w-8 h-8 text-success" />
                                        </div>
                                        <p className="font-black uppercase tracking-tighter text-2xl text-success">Agreement Signed.</p>
                                        <p className="font-mono text-[10px] text-muted-foreground uppercase">Signed on: {new Date().toLocaleString()}</p>
                                        <div className="mt-8 flex items-center gap-2 p-3 bg-muted/10 border border-border rounded-xl">
                                            <span className="font-mono text-[9px] uppercase opacity-40">Blockchain_ID:</span>
                                            <span className="font-mono text-[9px] font-bold">0x4F92...B91E</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            <footer className="py-12 bg-muted/5 opacity-40 mt-auto">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className="text-[9px] font-mono uppercase tracking-[0.5em]">FIXIUM LEGAL TERMS</p>
                </div>
            </footer>
        </div>
    );
}
