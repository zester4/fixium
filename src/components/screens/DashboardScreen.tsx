import { motion } from 'framer-motion';
import {
  Plus,
  History,
  ChevronRight,
  Wrench,
  Clock,
  CheckCircle2,
  ArrowRight,
  User,
  Crown,
  Zap,
  Smartphone,
  Laptop,
  Tablet,
  Gamepad2,
  Car,
  Armchair
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRepairStore } from '@/store/repairStore';
import { useRepairHistory } from '@/hooks/useRepairHistory';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

const quickActions = [
  { id: 'phone', label: 'Phone', icon: Smartphone },
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'console', label: 'Console', icon: Gamepad2 },
  { id: 'auto', label: 'Auto', icon: Car },
  { id: 'furniture', label: 'Furniture', icon: Armchair },
];

export function DashboardScreen() {
  const { setScreen, setDeviceInfo } = useRepairStore();
  const { history } = useRepairHistory();
  const { user, profile, isPro } = useAuth();
  const navigate = useNavigate();
  const recentRepairs = history.slice(0, 5);

  const handleStartRepair = (action?: any) => {
    if (action?.path) {
      navigate(action.path);
      return;
    }
    if (action) {
      setDeviceInfo({ category: action.id });
      setScreen('photo-capture');
    } else {
      setScreen('device-selection');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%">
          <pattern id="grid-dash" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-dash)" />
        </svg>
      </div>

      <GlobalHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 lg:grid-cols-12"
        >
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Welcome Banner */}
            <section>
              <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">
                What are you <span className="text-primary italic">fixing today?</span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium">Choose a category to get started with your repair assistant.</p>
            </section>

            {/* Quick Start Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartRepair(action)}
                  className="p-6 rounded-3xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all text-center group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                    <action.icon className="w-16 h-16" />
                  </div>
                  <action.icon className="w-8 h-8 text-primary mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="font-mono text-[10px] font-black tracking-widest text-foreground">{action.label}</p>
                </motion.button>
              ))}
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartRepair()}
                className="p-6 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 text-center group flex flex-col items-center justify-center col-span-2 sm:col-span-1"
              >
                <Plus className="w-8 h-8 mb-4 group-hover:rotate-90 transition-transform" />
                <p className="font-mono text-[10px] font-black tracking-widest">Other Device</p>
              </motion.button>
            </section>

            {/* In Progress */}
            <section>
              <div className="flex items-center gap-3 mb-4 px-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground">In Progress</h2>
              </div>
              {/* No active repairs placeholder */}
              <Card className="border-dashed border-border/50 bg-transparent shadow-none rounded-[32px]">
                <CardContent className="py-12 text-center">
                  <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-mono text-[10px] tracking-widest">No active repairs at the moment</p>
                  <Button
                    variant="ghost"
                    onClick={() => handleStartRepair()}
                    className="mt-4 font-mono text-[10px] tracking-widest"
                  >
                    Start a new fix
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* User Profile Card */}
            <Card className="rounded-[40px] border-border/50 bg-muted/20 shadow-none overflow-hidden">
              <div className="bg-primary/5 p-8 border-b border-border/40">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="font-mono text-[10px] tracking-widest bg-primary/10 text-primary border-none">{isPro ? 'Pro' : 'Free'}</Badge>
                </div>
                <p className="font-mono text-[10px] font-black text-muted-foreground tracking-widest mb-1">Welcome back,</p>
                <h3 className="text-2xl font-black tracking-tighter">{profile?.display_name?.split(' ')[0]}</h3>
              </div>
              <CardContent className="p-8 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-2xl font-black font-mono tracking-tighter">{history.length}</p>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground tracking-tighter">Items Fixed</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black font-mono tracking-tighter">0</p>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground tracking-tighter">My Goals</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Successes */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-primary" />
                  <h2 className="font-mono text-[11px] font-black tracking-[0.3em] text-muted-foreground">Recent Successes</h2>
                </div>
                <Button variant="ghost" size="sm" className="font-mono text-[9px] tracking-widest h-6">View All</Button>
              </div>

              <div className="space-y-3">
                {recentRepairs.length > 0 ? (
                  recentRepairs.map((repair) => (
                    <motion.div
                      key={repair.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-none cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-success/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs font-bold text-foreground truncate tracking-tighter">
                          {repair.guide.deviceInfo.model || repair.guide.deviceInfo.category}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground tracking-widest mt-1 opacity-60">
                          {formatDistanceToNow(repair.completedAt, { addSuffix: true })}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-all" />
                    </motion.div>
                  ))
                ) : (
                  <div className="py-8 text-center px-4 rounded-2xl border border-dashed border-border/40">
                    <p className="text-[10px] font-mono text-muted-foreground">No history yet</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Quick Access FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <Button
          size="icon"
          onClick={() => handleStartRepair()}
          className="w-14 h-14 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <footer className="py-12 bg-muted/5 border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[9px] text-muted-foreground/30 font-mono tracking-[0.4em]">
            FixFlow // Your Personal Dashboard // 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
