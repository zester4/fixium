import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone,
    Laptop,
    Car,
    Refrigerator,
    ShieldCheck,
    Cpu,
    CheckCircle,
    AlertTriangle,
    History,
    MessageSquare,
    Package,
    Radio,
    Send,
    X,
    Eye,
    Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { invalidateFeed } from '@/services/upstash';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const categories = [
    { id: 'phone', label: 'Phone', icon: Smartphone },
    { id: 'laptop', label: 'Laptop', icon: Laptop },
    { id: 'automotive', label: 'Auto', icon: Car },
    { id: 'appliance', label: 'Appliance', icon: Refrigerator },
    { id: 'other', label: 'Other', icon: Package },
];

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [model, setModel] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleBroadcast = async () => {
        if (!user) {
            toast.error('Authentication Required', { description: 'Please log in to post in the community.' });
            return;
        }
        if (!title || !content || !selectedCategory) {
            toast.error('Missing Information', { description: 'Headline, description, and category are required.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('community_posts')
                .insert({
                    author_id: user.id,
                    title,
                    content,
                    device_category: selectedCategory,
                    device_model: model || null
                });

            if (error) throw error;

            // Invalidate Redis cache to ensure the new post shows up immediately
            await invalidateFeed();

            toast.success('Posted Successfully', { description: 'Your request is now live for the community to see.' });
            navigate('/community');
        } catch (err) {
            console.error('Post error:', err);
            toast.error('Post Failed', { description: 'Internal system error. Try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/community" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </Link>
                        <div className="w-[1px] h-6 bg-border/50 mx-1" />
                        <span className="font-mono text-xs font-black tracking-widest text-foreground">New Discussion</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPreview(!isPreview)}
                            className="font-mono text-[10px] tracking-widest"
                        >
                            {isPreview ? <Edit3 className="w-3.5 h-3.5 mr-2" /> : <Eye className="w-3.5 h-3.5 mr-2" />}
                            {isPreview ? 'Back to Editor' : 'Preview Post'}
                        </Button>
                        <Button
                            size="sm"
                            disabled={isSubmitting}
                            onClick={handleBroadcast}
                            className="font-mono text-[10px] tracking-widest bg-primary hover:bg-primary/90 rounded-full px-6"
                        >
                            {isSubmitting ? (
                                <History className="w-3.5 h-3.5 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5 mr-2" />
                            )}
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                <AnimatePresence mode="wait">
                    {isPreview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-mono text-[10px] tracking-tighter border-primary/20 text-primary bg-primary/5 capitalize">
                                        {selectedCategory || 'General Topic'}
                                    </Badge>
                                    <span className="text-muted-foreground/40 font-mono text-[10px]">//</span>
                                    <Badge variant="outline" className="font-mono text-[10px] tracking-tighter border-border/40">
                                        {model || 'Standard Model'}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground/90">{title || 'Untitled Discussion'}</h1>
                            </div>
                            <Card className="rounded-[2rem] border-border/50 bg-muted/5 shadow-none p-8">
                                <div className="prose prose-invert max-w-none prose-sm font-medium leading-relaxed italic opacity-80">
                                    <ReactMarkdown>{content || '*Post description is empty...*'}</ReactMarkdown>
                                </div>
                            </Card>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-black">Verified Post</span>
                                        <span className="text-[10px] font-medium text-muted-foreground">Authenticated via secure session</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 transparent-border rounded-full bg-background/50">
                                    <div className="w-4 h-4 rounded-full bg-muted overflow-hidden">
                                        {user?.email && <div className="w-full h-full bg-primary/20" />}
                                    </div>
                                    <span className="font-mono text-[8px] uppercase tracking-widest font-bold">Author Identity Secure</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            {/* Category Picker */}
                            <section>
                                <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground mb-6">01. Choose Category</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${selectedCategory === cat.id
                                                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                : 'border-border/50 bg-muted/20 hover:border-primary/30'
                                                }`}
                                        >
                                            <cat.icon className={`w-5 h-5 transition-colors ${selectedCategory === cat.id ? 'text-primary' : 'text-muted-foreground/50 group-hover:text-primary/60'}`} />
                                            <span className={`font-mono text-[9px] tracking-widest font-bold ${selectedCategory === cat.id ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                                                {cat.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Title Input */}
                            <section>
                                <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground mb-6">02. Discussion Headline</h2>
                                <Input
                                    placeholder="What do you need help with?..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-xl font-black tracking-tighter border-none bg-transparent p-0 focus-visible:ring-0 placeholder:opacity-20 h-auto mb-4"
                                />
                                <Input
                                    placeholder="Hardware Model (Optional)"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="font-mono text-[10px] tracking-widest border-b border-border/50 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 px-0 h-8 opacity-60"
                                />
                            </section>

                            {/* Content Editor */}
                            <section>
                                <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground mb-6">03. Description (Markdown Supported)</h2>
                                <div className="relative group">
                                    <Textarea
                                        placeholder="Describe the problem, steps you've already taken, and what you're seeing. Use Markdown for parts lists..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="min-h-[400px] bg-muted/10 border-border/50 rounded-[2rem] p-8 text-xs font-medium leading-relaxed italic text-foreground/80 focus-visible:ring-primary/20 shadow-none scrollbar-hide"
                                    />
                                    <div className="absolute top-4 right-6 opacity-20 pointer-events-none">
                                        <Radio className="w-12 h-12 text-primary animate-pulse" />
                                    </div>
                                </div>
                            </section>

                            {/* Professional Tips */}
                            <div className="flex flex-col sm:flex-row gap-4 p-8 rounded-[2rem] bg-muted/20 border border-border/40">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-primary">
                                        <AlertTriangle className="w-4 h-4" />
                                        <p className="font-mono text-[10px] font-black tracking-widest leading-none mt-0.5">Privacy Check</p>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium italic">Avoid sharing serial numbers or personal info. Keep descriptions clear and helpful.</p>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-success">
                                        <CheckCircle className="w-4 h-4" />
                                        <p className="font-mono text-[10px] font-black tracking-widest leading-none mt-0.5">High Fidelity</p>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium italic">Use tables for parts and code blocks for error codes to get faster expert verification.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
