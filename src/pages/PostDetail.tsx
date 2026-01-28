import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Radio,
    MessageSquare,
    ArrowLeft,
    ArrowUpCircle,
    ShieldCheck,
    Zap,
    Send,
    Loader2,
    CheckCircle2,
    Clock,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { boostSignal } from '@/services/upstash';
import type { CommunityPost, CommunityComment } from '@/types/community';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<CommunityPost | null>(null);
    const [comments, setComments] = useState<CommunityComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, isVerifiedTechnician } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchPostDetails();
        }
    }, [id]);

    const fetchPostDetails = async () => {
        setIsLoading(true);
        try {
            // Fetch Post
            const { data: postData, error: postError } = await supabase
                .from('community_posts')
                .select('*, author:profiles(display_name, avatar_url, is_pro)')
                .eq('id', id)
                .single();

            if (postError) throw postError;
            setPost({ ...postData, author_profile: postData.author as unknown as CommunityPost['author_profile'] } as CommunityPost);

            // Fetch Comments
            const { data: commentsData, error: commentsError } = await supabase
                .from('community_comments')
                .select('*, author:profiles(display_name, avatar_url, is_pro)')
                .eq('post_id', id)
                .order('created_at', { ascending: true });

            if (commentsError) throw commentsError;

            const formattedComments = (commentsData || []).map(comm => ({
                ...comm,
                author_profile: comm.author as unknown as CommunityComment['author_profile']
            })) as CommunityComment[];
            setComments(formattedComments);

        } catch (err) {
            console.error('Error fetching post details:', err);
            toast.error('Post Not Found', { description: 'Could not retrieve discussion data.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBoost = async () => {
        if (!user || !post) return;
        setPost({ ...post, signal_strength: post.signal_strength + 1 });
        await boostSignal(post.id);
        await supabase.rpc('increment_signal_strength', { post_id: post.id });
    };

    const handleSubmitComment = async () => {
        if (!user || !id || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('community_comments')
                .insert({
                    post_id: id,
                    author_id: user.id,
                    content: newComment.trim()
                })
                .select('*, author:profiles(display_name, avatar_url, is_pro)')
                .single();

            if (error) throw error;

            const formatted = { ...data, author_profile: data.author as unknown as CommunityComment['author_profile'] } as CommunityComment;
            setComments([...comments, formatted]);
            setNewComment('');
            toast.success('Reply Posted');
        } catch (err) {
            console.error('Comment error:', err);
            toast.error('Post Failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifySolution = async (commentId: string) => {
        if (!isVerifiedTechnician) return;

        try {
            const { error } = await supabase
                .from('community_comments')
                .update({
                    is_verified_solution: true,
                    verified_by: user?.id
                })
                .eq('id', commentId);

            if (error) throw error;

            setComments(comments.map(c =>
                c.id === commentId ? { ...c, is_verified_solution: true } : c
            ));
            toast.success('Advice Verified', { description: 'This solution is now marked as Expert-Approved.' });
        } catch (err) {
            console.error('Verification error:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-40" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <MessageSquare className="w-12 h-12 text-muted-foreground/20 mb-4" />
                <h2 className="font-mono text-xs tracking-widest text-muted-foreground mb-4">Post Not Found // 4NotFound</h2>
                <Button asChild variant="outline">
                    <Link to="/community">Return to Feed</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary selection:text-primary-foreground">
            {/* Background Technical Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden h-full">
                <svg width="100%" height="100%">
                    <pattern id="grid-post" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-post)" />
                </svg>
            </div>

            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/community" className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-mono text-[9px] tracking-widest text-muted-foreground">Back to Community</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="font-mono text-[9px] tracking-widest text-primary font-bold leading-none mb-1 capitalize">Category: {post.device_category}</span>
                            <span className="font-mono text-[7px] tracking-widest text-muted-foreground leading-none">ID: {post.id.slice(0, 8)}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
                <div className="space-y-12">
                    {/* Post Content */}
                    <article className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-primary/10 text-primary border-none font-mono text-[10px] tracking-tighter capitalize">
                                    {post.device_category}
                                </Badge>
                                {post.is_pinned && <Badge variant="secondary" className="font-mono text-[10px] tracking-tighter">Pinned</Badge>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.1] text-foreground/90">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 py-2 border-y border-border/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-muted border border-border/40 overflow-hidden">
                                        {post.author_profile?.avatar_url && <img src={post.author_profile.avatar_url} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono font-black tracking-tighter leading-none mb-1">{post.author_profile?.display_name || 'Anonymous'}</span>
                                        <span className="text-[8px] font-mono tracking-widest text-muted-foreground leading-none">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-border/20 mx-2" />
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground/50" />
                                        <span className="font-mono text-[10px] font-black">{comments.length}</span>
                                    </div>
                                    <button
                                        onClick={handleBoost}
                                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all"
                                    >
                                        <ArrowUpCircle className="w-3.5 h-3.5 text-primary" />
                                        <span className="font-mono text-[10px] font-black text-primary">{post.signal_strength}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Card className="rounded-[2.5rem] border-border/50 bg-muted/10 shadow-none overflow-hidden relative border-[0.5px]">
                            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none prose-xs font-medium leading-relaxed italic text-foreground/75">
                                <ReactMarkdown>{post.content}</ReactMarkdown>
                            </CardContent>
                        </Card>
                    </article>

                    {/* Comment Section (Support Stream) */}
                    <section className="space-y-8 pt-8">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground">Community Advice</h2>
                            </div>
                            <span className="font-mono text-[9px] tracking-widest text-muted-foreground/40">{comments.length} Responses</span>
                        </div>

                        {/* Comment Form */}
                        <div className="relative group">
                            <Textarea
                                placeholder="Offer your advice or share your observations..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[140px] bg-muted/20 border-border/50 rounded-[2rem] p-6 font-medium italic focus-visible:ring-primary/20 pr-16"
                            />
                            <Button
                                size="icon"
                                disabled={isSubmitting || !newComment.trim()}
                                onClick={handleSubmitComment}
                                className="absolute bottom-4 right-4 rounded-full w-10 h-10 shadow-xl shadow-primary/20"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {comments.map((comment, index) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative pl-12"
                                    >
                                        {/* Thread line */}
                                        <div className="absolute left-4 top-0 bottom-0 w-[0.5px] bg-border/40" />
                                        <div className="absolute left-4 top-10 w-6 h-[0.5px] bg-border/40" />

                                        <Card className={`rounded-[2rem] border-border/40 bg-card overflow-hidden transition-all ${comment.is_verified_solution ? 'border-primary/50 shadow-lg shadow-primary/5' : 'shadow-none'}`}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-muted border border-border/50 overflow-hidden">
                                                            {comment.author_profile?.avatar_url && <img src={comment.author_profile.avatar_url} alt="" className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-mono font-black tracking-tighter leading-none">{comment.author_profile?.display_name || 'Anonymous'}</span>
                                                                {comment.author_profile?.is_pro && <Badge className="h-3.5 px-1 py-0 bg-amber-500/10 text-amber-500 text-[7px] border-none">Pro</Badge>}
                                                                {comment.author_profile?.is_verified_tech && <ShieldCheck className="w-3 h-3 text-primary" />}
                                                            </div>
                                                            <span className="text-[8px] font-mono tracking-widest text-muted-foreground leading-none mt-1">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                                                        </div>
                                                    </div>

                                                    {comment.is_verified_solution ? (
                                                        <Badge className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1.5 font-mono text-[9px] tracking-widest py-1 px-3">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Verified Solution
                                                        </Badge>
                                                    ) : isVerifiedTechnician ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleVerifySolution(comment.id)}
                                                            className="h-7 px-3 font-mono text-[8px] tracking-widest text-primary/60 hover:text-primary hover:bg-primary/5 rounded-full"
                                                        >
                                                            Verify Advice
                                                        </Button>
                                                    ) : null}
                                                </div>
                                                <div className="prose prose-invert prose-xs max-w-none font-medium leading-relaxed italic text-foreground/70">
                                                    <ReactMarkdown>{comment.content}</ReactMarkdown>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer Info */}
            <footer className="py-20 flex flex-col items-center justify-center opacity-20">
                <MessageSquare className="w-8 h-8 mb-4" />
                <p className="font-mono text-[8px] tracking-[0.5em] text-center">End of Discussion // Fixium Community Support</p>
            </footer>
        </div>
    );
}
