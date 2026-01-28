import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Radio,
    MessageSquare,
    Zap,
    Search,
    Filter,
    Plus,
    ArrowUpCircle,
    ShieldCheck,
    Cpu,
    Smartphone,
    Laptop,
    Car,
    ChevronRight,
    Loader2,
    LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { boostSignal, getSignalStrength, getCachedFeed, cacheFeed } from '@/services/upstash';
import type { CommunityPost } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

const deviceIcons: Record<string, LucideIcon> = {
    phone: Smartphone,
    laptop: Laptop,
    automotive: Car,
    default: Cpu
};

export default function Community() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [activeFilter]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            // Check Redis Cache first (only for 'All categories' view)
            if (!activeFilter && !searchQuery) {
                const cached = await getCachedFeed();
                if (cached) {
                    setPosts(cached);
                    setIsLoading(false);
                    return;
                }
            }

            let query = supabase
                .from('community_posts')
                .select(`
          *,
          author:profiles(display_name, avatar_url, is_pro)
        `)
                .order('created_at', { ascending: false });

            if (activeFilter) {
                query = query.eq('device_category', activeFilter);
            }

            const { data, error } = await query;
            if (error) throw error;

            const formattedPosts = (data || []).map(post => ({
                ...post,
                author_profile: post.author as unknown as CommunityPost['author_profile']
            })) as CommunityPost[];

            setPosts(formattedPosts);

            // Update Redis Cache if this is the main feed
            if (!activeFilter && !searchQuery) {
                await cacheFeed(formattedPosts);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBoost = async (postId: string) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        // Optimistic Update
        setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, signal_strength: p.signal_strength + 1 } : p
        ));

        await boostSignal(postId);
        await supabase.rpc('increment_signal_strength', { post_id: postId });
    };

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary selection:text-primary-foreground">
            {/* Background Technical Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden h-full">
                <svg width="100%" height="100%">
                    <pattern id="grid-community" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-community)" />
                </svg>
            </div>

            <GlobalHeader />

            <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                {/* Search & Filters */}
                <section className="mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                            <Input
                                placeholder="Search community posts..."
                                className="h-14 pl-12 pr-4 font-mono text-xs border-border/50 bg-muted/20 focus-visible:ring-primary/20 rounded-2xl transition-all duration-300 placeholder:text-muted-foreground/40"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between w-full lg:flex-1 gap-6">
                            <div className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-hide min-w-0 flex-1">
                                <Badge
                                    variant={activeFilter === null ? 'default' : 'outline'}
                                    className="cursor-pointer font-mono tracking-tighter px-4 py-1.5 rounded-full shrink-0 h-9 flex items-center border-border/40"
                                    onClick={() => setActiveFilter(null)}
                                >
                                    All Categories
                                </Badge>
                                {['phone', 'laptop', 'automotive', 'appliance', 'other'].map(cat => (
                                    <Badge
                                        key={cat}
                                        variant={activeFilter === cat ? 'default' : 'outline'}
                                        className="cursor-pointer font-mono tracking-tighter px-4 py-1.5 rounded-full shrink-0 h-9 flex items-center border-border/40 capitalize"
                                        onClick={() => setActiveFilter(cat)}
                                    >
                                        {cat}
                                    </Badge>
                                ))}
                            </div>
                            <Link to="/community/new" className="hidden sm:block shrink-0">
                                <Button size="lg" className="font-mono text-[10px] tracking-widest rounded-2xl px-6 h-11 shadow-xl shadow-primary/10 active:scale-95 transition-all border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    Ask for Help
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* The Feed */}
                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center opacity-40">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Reading the forum...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="py-20 text-center border border-dashed border-border/40 rounded-[32px] bg-muted/5">
                            <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-6">The forum is quiet // No posts found</p>
                            <Link to="/community/new">
                                <Button size="sm" className="font-mono text-[10px] tracking-widest rounded-full px-6">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    Ask for Help
                                </Button>
                            </Link>
                        </div>
                    ) : posts.filter(p =>
                        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.content.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 ? (
                        <div className="py-20 text-center border border-dashed border-border/40 rounded-[32px] bg-muted/5">
                            <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-6">No matching posts found</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSearchQuery('')}
                                className="font-mono text-[10px] tracking-widest rounded-full px-6"
                            >
                                Clear Search
                            </Button>
                        </div>
                    ) : (
                        posts.filter(p =>
                            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.content.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="rounded-[2.5rem] border-border/50 bg-muted/10 hover:bg-muted/20 transition-all group cursor-pointer overflow-hidden border-[0.5px]">
                                    <Link to={`/community/${post.id}`}>
                                        <CardContent className="p-0">
                                            <div className="p-8">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/20 group-hover:bg-primary/10 transition-colors">
                                                            {(() => {
                                                                const Icon = deviceIcons[post.device_category] || deviceIcons.default;
                                                                return <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />;
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[10px] font-black tracking-widest text-primary/70 capitalize">
                                                                    {post.device_category}
                                                                </span>
                                                                {post.is_pinned && <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                                            </div>
                                                            <h3 className="text-lg font-black tracking-tighter text-foreground/90 group-hover:text-primary transition-colors">
                                                                {post.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="font-mono text-[9px] tracking-tighter opacity-60">
                                                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                                    </Badge>
                                                </div>

                                                <p className="text-xs text-muted-foreground/70 line-clamp-2 mb-6 font-medium leading-relaxed italic">
                                                    {post.content}
                                                </p>

                                                <div className="flex items-center justify-between pt-6 border-t border-border/20">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-muted border border-border/50 overflow-hidden">
                                                                {post.author_profile?.avatar_url ? (
                                                                    <img src={post.author_profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                                        <span className="text-[8px] font-mono font-bold text-primary">OP</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] font-mono font-bold tracking-tighter text-foreground/70">
                                                                {post.author_profile?.display_name || 'Anonymous'}
                                                                {post.author_profile?.is_pro && <Badge className="ml-1 h-3.5 px-1 py-0 bg-amber-500/10 text-amber-500 text-[8px] border-none">Pro</Badge>}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="w-4 h-4 text-muted-foreground/50" />
                                                            <span className="font-mono text-[10px] font-black text-muted-foreground">{post.comment_count || 0}</span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleBoost(post.id);
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/20"
                                                        >
                                                            <ArrowUpCircle className={`w-4 h-4 ${post.signal_strength > 0 ? 'text-primary fill-primary/20' : 'text-muted-foreground/50'}`} />
                                                            <span className="font-mono text-[10px] font-black text-primary">{post.signal_strength}</span>
                                                            <span className="sr-only text-[8px] font-mono tracking-widest text-primary/40 ml-1 hidden sm:inline">Helpful</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>

            {/* Floating Network Status */}
            <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-6 py-2 shadow-2xl flex items-center gap-4 max-w-xs w-full justify-center hidden sm:flex">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">Forum Online</span>
                </div>
                <div className="w-px h-3 bg-border/50" />
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">{posts.length} Active Threads</span>
            </footer>

            {/* Mobile Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50 sm:hidden">
                <Link to="/community/new">
                    <Button size="icon" className="w-14 h-14 rounded-2xl shadow-2xl shadow-primary/40 ring-4 ring-background">
                        <Plus className="w-6 h-6" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
