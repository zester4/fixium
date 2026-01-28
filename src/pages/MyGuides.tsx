import { motion } from 'framer-motion';
import {
    ArrowLeft,
    FileText,
    Plus,
    Star,
    Users,
    Globe,
    Settings,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function MyGuides() {
    const { isVerifiedTechnician, user } = useAuth();
    const navigate = useNavigate();

    const { data: guides, isLoading } = useQuery({
        queryKey: ['my-guides', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('repair_guides')
                .select('*')
                .eq('author_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!user
    });

    const stats = {
        totalGuides: guides?.length || 0,
        totalReaders: guides?.reduce((acc, guide) => acc + (guide.rating_count || 0), 0) || 0,
        avgRating: guides?.length
            ? (guides.reduce((acc, guide) => acc + (guide.rating_sum || 0), 0) / guides.reduce((acc, guide) => acc + Math.max(1, guide.rating_count || 0), 0)).toFixed(1)
            : '0.0'
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <GlobalHeader />

            <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full pb-20">
                {/* Verification Status */}
                <div className="mb-6">
                    <Card className={`border-2 ${isVerifiedTechnician ? 'border-success/20 bg-success/5' : 'border-caution/20 bg-caution/5'}`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isVerifiedTechnician ? 'bg-success/20' : 'bg-caution/20'}`}>
                                    <ShieldCheck className={`w-6 h-6 ${isVerifiedTechnician ? 'text-success' : 'text-caution'}`} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-sm uppercase tracking-tight">
                                        {isVerifiedTechnician ? 'Verified Technician' : 'Standard Contributor'}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {isVerifiedTechnician
                                            ? 'Your guides are marked as expert-verified.'
                                            : 'Apply for verification to boost your guides.'}
                                    </p>
                                </div>
                                {!isVerifiedTechnician && (
                                    <Button size="sm" variant="outline" className="ml-auto text-[10px] font-mono uppercase tracking-widest" onClick={() => navigate('/technician-apply')}>
                                        APPLY
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <Card className="shadow-none border-border/50">
                        <CardContent className="pt-4 pb-4 text-center">
                            <div className="flex justify-center mb-1 text-primary/40"><Users className="w-4 h-4" /></div>
                            <p className="font-mono text-xl font-bold">{stats.totalReaders}</p>
                            <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Readers</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none border-border/50">
                        <CardContent className="pt-4 pb-4 text-center">
                            <div className="flex justify-center mb-1 text-amber-500/40"><Star className="w-4 h-4" /></div>
                            <p className="font-mono text-xl font-bold">{stats.avgRating}</p>
                            <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Avg Rating</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                            Published Guides
                        </h3>
                        <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest">View Archives</span>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-12 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
                            <p className="font-mono text-[9px] uppercase tracking-widest animate-pulse">Syncing Database...</p>
                        </div>
                    ) : !guides || guides.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl bg-muted/5">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-6 h-6 text-muted-foreground/30" />
                            </div>
                            <h4 className="text-sm font-semibold uppercase tracking-tight mb-1">No Guides Authored</h4>
                            <p className="text-xs text-muted-foreground mb-6 max-w-[200px] mx-auto leading-relaxed">
                                Start sharing your repair expertise with the community.
                            </p>
                            <Button size="sm" className="font-mono text-[10px] uppercase tracking-widest gap-2">
                                <Plus className="w-3.5 h-3.5" />
                                Create New Guide
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {guides.map((guide) => (
                                <Card key={guide.id} className="shadow-none border-border/50 hover:bg-muted/5 transition-colors cursor-pointer group">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center industrial-border">
                                                <FileText className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{guide.title}</h4>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <Badge variant="outline" className="text-[8px] uppercase font-mono tracking-tighter bg-primary/5">{guide.device_category}</Badge>
                                                    <span className="text-[9px] font-mono text-muted-foreground uppercase">{guide.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:translate-x-1 transition-transform" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tips Section */}
                <div className="mt-12 bg-primary/5 rounded-2xl p-5 border border-primary/10">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                        <Globe className="w-3.5 h-3.5" />
                        Impact Metric
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Every guide you create helps prevent E-waste. Technicians who post 3+ guides get featured on our discovery page.
                    </p>
                </div>
            </main>

            {/* Floating Action */}
            <div className="fixed bottom-6 right-6 z-20">
                <Button size="icon" className="w-14 h-14 rounded-full shadow-2xl shadow-primary/40 group">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </Button>
            </div>
        </div>
    );
}
