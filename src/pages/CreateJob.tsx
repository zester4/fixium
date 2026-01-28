import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone,
    Laptop,
    Car,
    Refrigerator,
    Package,
    CheckCircle,
    AlertTriangle,
    History,
    Send,
    X,
    Target,
    DollarSign,
    Layers,
    Wrench,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const categories = [
    { id: 'phone', label: 'Phone', icon: Smartphone },
    { id: 'laptop', label: 'Laptop', icon: Laptop },
    { id: 'automotive', label: 'Auto', icon: Car },
    { id: 'appliance', label: 'Appliance', icon: Refrigerator },
    { id: 'other', label: 'Other', icon: Package },
];

export default function CreateJob() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [model, setModel] = useState('');
    const [budget, setBudget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const handlePostJob = async () => {
        if (!user) {
            toast.error('Authentication Required', { description: 'Please log in to post a job.' });
            return;
        }
        if (!title || !description || !selectedCategory || !budget) {
            toast.error('Missing Specs', { description: 'All fields are required to create a valid job post.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await (supabase
                .from('repair_jobs' as any)
                .insert({
                    user_id: user.id,
                    title,
                    description,
                    device_category: selectedCategory,
                    device_model: model || null,
                    budget_range: budget,
                    location: 'Remote', // Default for now
                    status: 'open'
                }) as any);

            if (error) throw error;

            toast.success('Repair Job Posted', { description: 'Technicians are now reviewing your job.' });
            navigate('/marketplace');
        } catch (err: any) {
            console.error('Job post error:', err);
            toast.error('Post Failed', { description: err.message || 'Internal system error.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col selection:bg-primary selection:text-primary-foreground">
            {/* Heavy Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/marketplace" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </Link>
                        <div className="w-[1px] h-6 bg-border/50 mx-1" />
                        <span className="font-mono text-[10px] uppercase font-black tracking-[0.2em] text-foreground">Post a New Job</span>
                    </div>

                    <Button
                        size="sm"
                        disabled={isSubmitting}
                        onClick={handlePostJob}
                        className="font-mono text-[10px] tracking-[0.2em] bg-primary hover:bg-primary/90 rounded-full px-6 font-black uppercase"
                    >
                        {isSubmitting ? (
                            <History className="w-3.5 h-3.5 mr-2 animate-spin" />
                        ) : (
                            <Send className="w-3.5 h-3.5 mr-2" />
                        )}
                        {isSubmitting ? 'Posting...' : 'Post Job'}
                    </Button>
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    {/* Header Section */}
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-4">
                            Post Your <span className="text-primary not-italic">Repair Job.</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium italic">Share what needs fixing to receive professional proposals.</p>
                    </div>

                    {/* Category Picker */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Target className="w-4 h-4 text-primary" />
                            <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground uppercase">01. Select Category</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${selectedCategory === cat.id
                                        ? 'border-primary bg-primary/2 text-primary shadow-lg shadow-primary/5'
                                        : 'border-border/50 bg-muted/20 hover:border-primary/40'
                                        }`}
                                >
                                    <cat.icon className={`w-5 h-5 transition-transform ${selectedCategory === cat.id ? 'text-primary scale-110' : 'text-muted-foreground/50 group-hover:text-primary/60'}`} />
                                    <span className={`font-mono text-[9px] tracking-widest font-black uppercase ${selectedCategory === cat.id ? 'text-primary' : 'text-muted-foreground/70'}`}>
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Specs Input */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Layers className="w-4 h-4 text-primary" />
                            <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground uppercase">02. Device Details</h2>
                        </div>
                        <div className="space-y-4">
                            <Input
                                placeholder="Job Title (e.g., iPhone 15 Screen Repair)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-xl font-black tracking-tight border-none bg-muted/20 rounded-2xl p-6 h-16 focus-visible:ring-primary/20 placeholder:opacity-20"
                            />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                    <Input
                                        placeholder="Hardware Model"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="pl-12 font-mono text-[10px] tracking-widest bg-muted/20 border-border/50 rounded-xl h-12 uppercase"
                                    />
                                </div>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                    <Input
                                        placeholder="Estimated Budget ($)"
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="pl-12 font-mono text-[10px] tracking-widest bg-muted/20 border-border/50 rounded-xl h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Description Editor */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground uppercase">03. Job Description</h2>
                        </div>
                        <Textarea
                            placeholder="Describe the issue you're facing. Include any parts needed or work you've already tried..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[200px] bg-muted/20 border-border/50 rounded-[2rem] p-8 text-xs font-medium leading-relaxed italic text-foreground focus-visible:ring-primary/20 shadow-none"
                        />
                    </section>

                    {/* Verification Protocol Tip */}
                    <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1 text-sm font-medium italic text-muted-foreground">
                            <p className="text-foreground tracking-tight font-black uppercase not-italic text-[10px] mb-1">Expert verification</p>
                            Once you post this job, verified technicians will review your request and submit their best proposals. You can then review their profiles and choose the best fit.
                        </div>
                    </div>
                </motion.div>
            </main>

            <footer className="py-12 bg-muted/5 border-t border-border/30 mt-auto opacity-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-[9px] font-mono uppercase tracking-[0.4em]">FIXIUM REPAIR MARKETPLACE // {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
}
