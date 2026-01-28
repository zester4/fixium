import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    User,
    Search,
    Filter,
    Plus,
    ArrowRight,
    ShieldCheck,
    Star,
    MapPin,
    Clock,
    Wrench,
    Smartphone,
    Cpu,
    Layers,
    ChevronRight,
    BadgeCheck,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { SEO } from '@/components/seo/SEO';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

export default function Marketplace() {
    const [activeTab, setActiveTab] = useState('jobs');
    const navigate = useNavigate();

    // Fetch Live Jobs
    const { data: jobs, isLoading: isLoadingJobs } = useQuery({
        queryKey: ['repair-jobs'],
        queryFn: async () => {
            const { data, error } = await (supabase.from('repair_jobs' as any)
                .select('*')
                .eq('status', 'open')
                .order('created_at', { ascending: false }) as any);
            if (error) throw error;
            return data;
        }
    });

    // Fetch Live Technicians
    const { data: technicians, isLoading: isLoadingTechs } = useQuery({
        queryKey: ['verified-technicians'],
        queryFn: async () => {
            const { data, error } = await (supabase.from('technician_profiles' as any)
                .select('*')
                .order('reputation_tier', { ascending: false }) as any);
            if (error) throw error;
            return data;
        }
    });

    return (
        <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
            <SEO
                title="Repair Marketplace"
                description="Connect with verified technicians or post your repair needs on the Fixium Marketplace."
            />

            <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden text-foreground">
                <svg width="100%" height="100%">
                    <pattern id="market-grid-final" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#market-grid-final)" />
                </svg>
            </div>

            <GlobalHeader />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-foreground mb-4 uppercase italic leading-[0.9]">
                            Repair <span className="text-primary not-italic">Marketplace.</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium tracking-tight">Connect with experts to solve your hardware challenges.</p>
                    </div>
                    <Button
                        size="lg"
                        onClick={() => navigate('/marketplace/new')}
                        className="h-14 px-8 font-mono text-[10px] uppercase font-black tracking-[0.2em] shadow-xl group rounded-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Post a Repair Job
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl p-1 rounded-2xl border border-border/40 inline-flex shadow-2xl">
                        <TabsList className="bg-transparent gap-1">
                            <TabsTrigger value="jobs" className="h-10 px-8 font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all">
                                <Briefcase className="w-3.5 h-3.5 mr-2" />
                                Available Jobs
                            </TabsTrigger>
                            <TabsTrigger value="technicians" className="h-10 px-8 font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all">
                                <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                                Top Technicians
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="jobs">
                        {isLoadingJobs ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                                <p className="font-mono text-[10px] uppercase tracking-widest animate-pulse">Finding jobs...</p>
                            </div>
                        ) : !jobs || jobs.length === 0 ? (
                            <Card className="border-dashed bg-transparent shadow-none py-12 text-center rounded-[2rem] border-muted-foreground/20">
                                <AlertCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">No active repair orders found.</p>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {jobs.map((job: any, idx: number) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="group hover:border-primary/40 transition-all cursor-pointer bg-muted/5 glass-card overflow-hidden">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                    <div className="space-y-4 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="font-mono text-[8px] uppercase tracking-[0.1em] border-primary/20 bg-primary/5 text-primary">
                                                                {job.device_category}
                                                            </Badge>
                                                            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">Job ID: {job.id.slice(0, 8)}</span>
                                                        </div>
                                                        <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{job.title}</h3>
                                                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl line-clamp-2">{job.description}</p>
                                                        <div className="flex flex-wrap gap-6 pt-2">
                                                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                                                <MapPin className="w-3.5 h-3.5 text-primary/60" />
                                                                {job.location || 'Remote'}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                                                <Clock className="w-3.5 h-3.5 text-primary/60" />
                                                                {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                                                <BadgeCheck className="w-3.5 h-3.5 text-success" />
                                                                Budget: <span className="text-foreground font-bold">{job.budget_range}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                                                        <Button
                                                            onClick={() => navigate(`/marketplace/job/${job.id}`)}
                                                            variant="outline"
                                                            className="w-full font-mono text-[9px] uppercase tracking-[0.15em] h-11 hover:bg-primary hover:text-primary-foreground border-border/60"
                                                        >
                                                            Apply to Job
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="technicians">
                        {isLoadingTechs ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                                <p className="font-mono text-[10px] uppercase tracking-widest animate-pulse">Finding experts...</p>
                            </div>
                        ) : !technicians || technicians.length === 0 ? (
                            <Card className="border-dashed bg-transparent shadow-none py-12 text-center rounded-[2rem] border-muted-foreground/20">
                                <AlertCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">No technicians found.</p>
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {technicians.map((tech: any, idx: number) => (
                                    <motion.div
                                        key={tech.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="hover:border-primary/40 transition-all bg-muted/5 glass-card overflow-hidden">
                                            <CardContent className="p-6">
                                                <div className="flex gap-5">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center p-0.5 border border-primary/20 relative">
                                                            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                                <User className="w-6 h-6 text-muted-foreground/40" />
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
                                                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-black uppercase tracking-tight">{tech.full_name}</h3>
                                                            <div className="flex items-center gap-1 text-primary/40">
                                                                <BadgeCheck className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-mono font-bold uppercase">Vetted</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] font-mono uppercase tracking-widest text-primary/60 font-bold leading-none">
                                                            Tier {tech.reputation_tier || 1} Professional
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 pt-1">
                                                            {tech.specialties?.map((s: string) => (
                                                                <Badge key={s} variant="outline" className="text-[8px] bg-primary/5 border-primary/10 tracking-normal capitalize">{s}</Badge>
                                                            ))}
                                                        </div>
                                                        <div className="pt-4 flex items-center justify-between border-t border-border/30 mt-4">
                                                            <span className="text-[9px] font-mono uppercase tracking-tighter text-muted-foreground">{tech.experience_years || 0} Years Exp.</span>
                                                            <Button variant="ghost" size="sm" className="h-8 group-hover:text-primary">
                                                                <span className="font-mono text-[9px] uppercase tracking-widest">Connect</span>
                                                                <ChevronRight className="w-3 h-3 ml-1" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>

            <footer className="py-16 bg-muted/10 border-t border-border/30 mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.4em]">
                        FIXIUM MARKETPLACE // {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}
