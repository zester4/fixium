import { motion } from 'framer-motion';
import {
    ArrowLeft,
    History,
    ChevronRight,
    Trash2,
    Clock,
    Wrench,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRepairHistory } from '@/hooks/useRepairHistory';
import { useRepairStore } from '@/store/repairStore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyRepairs() {
    const { history, removeRepair, clearHistory } = useRepairHistory();
    const { setScreen, setDeviceInfo } = useRepairStore();
    const navigate = useNavigate();

    const handleResume = (repair: any) => {
        setDeviceInfo(repair.guide.deviceInfo);
        // Ideally we'd set the specific step too, 
        // but for now we resume the guide flow
        setScreen('repair-guide');
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <GlobalHeader />

            <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full pb-20">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <History className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">No repairs yet</h2>
                        <p className="text-sm text-muted-foreground max-w-[240px]">
                            Your journey of fixing things will show up here as you complete guides.
                        </p>
                        <Button onClick={() => navigate('/')} className="mt-4">
                            Start New Repair
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((repair, index) => (
                            <motion.div
                                key={repair.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="group overflow-hidden border-border/50 hover:border-primary/40 transition-colors shadow-none active:scale-[0.98] transition-transform">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-4 p-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                                                <Wrench className="w-6 h-6 text-primary/60" />
                                            </div>

                                            <div className="flex-1 min-w-0" onClick={() => handleResume(repair)}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-sm truncate uppercase tracking-tight">
                                                        {repair.guide.deviceInfo.model || repair.guide.deviceInfo.category}
                                                    </h3>
                                                    {repair.rating && (
                                                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-mono border-amber-500/30 text-amber-600">
                                                            ★ {repair.rating}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(repair.completedAt, { addSuffix: true })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeRepair(repair.id);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}

                        <p className="text-center text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] pt-8 opacity-40">
                            -- End of Records --
                        </p>
                    </div>
                )}
            </main>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
                <Button
                    variant="secondary"
                    className="rounded-full shadow-lg border border-primary/20 bg-background/80 backdrop-blur-md px-6 font-mono text-[10px] uppercase tracking-widest gap-2"
                    onClick={() => navigate('/')}
                >
                    <AlertCircle className="w-3 h-3 text-primary" />
                    Quick Start
                </Button>
            </div>
        </div>
    );
}
