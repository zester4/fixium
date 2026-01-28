import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wrench,
    Menu,
    X,
    User,
    Radio,
    Info,
    Mail,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const NAV_LINKS = [
    { label: 'Pricing', path: '/pricing', icon: Sparkles },
    { label: 'Community', path: '/community', icon: Radio },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail },
];

export function GlobalHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, profile } = useAuth();
    const location = useLocation();

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center industrial-border transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/20 overflow-hidden p-1.5 relative">
                        <img src="/logo-fixium.png" alt="Fixium Logo" className="w-full h-full object-contain relative z-10" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl scale-50 group-hover:scale-100 transition-transform duration-700 opacity-50" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-mono text-base sm:text-lg font-black tracking-tighter text-foreground leading-tight">Fixium</span>
                        <span className="font-mono text-[8px] tracking-[0.2em] text-primary/60 leading-none">Guided Care</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`font-mono text-[10px] font-black tracking-[0.2em] transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {user ? (
                        <Link to="/profile" className="flex items-center gap-2 sm:gap-3 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-[9px] font-mono font-bold text-muted-foreground leading-none mb-1 tracking-tighter">Contributor</p>
                                <p className="text-xs font-bold text-foreground leading-none">{profile?.display_name?.split(' ')[0]}</p>
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary/50 transition-colors bg-background overflow-hidden shadow-sm">
                                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-4 h-4 text-primary/60" />
                                    )}
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link to="/auth" className="hidden sm:block">
                            <Button variant="outline" className="font-mono text-[10px] font-bold tracking-widest px-6 h-9 border-border/60 hover:bg-primary hover:text-primary-foreground transition-all rounded-full">
                                Sign In
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-lg hover:bg-muted md:hidden transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 top-16 bg-background z-40 md:hidden overflow-hidden"
                    >
                        <div className="p-6 space-y-8 relative h-full">
                            {/* Technical Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                                <svg width="100%" height="100%">
                                    <pattern id="nav-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                                    </pattern>
                                    <rect width="100%" height="100%" fill="url(#nav-grid)" />
                                </svg>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <p className="font-mono text-[9px] font-black tracking-[0.4em] text-primary/50 mb-6">Menu</p>

                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${location.pathname === link.path
                                            ? 'bg-primary/5 border-primary/30 text-primary shadow-lg shadow-primary/5'
                                            : 'bg-muted/10 border-border/40 text-foreground hover:bg-muted/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-xl bg-background border border-border/50">
                                                <link.icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-mono text-xs font-black tracking-widest">{link.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-40" />
                                    </Link>
                                ))}
                            </div>

                            {!user && (
                                <div className="relative z-10 pt-4">
                                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full h-14 rounded-2xl font-mono text-xs font-black tracking-[0.2em] shadow-xl shadow-primary/20">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            <div className="absolute bottom-12 left-6 right-6 text-center opacity-20">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    <span className="font-mono text-[8px] tracking-[0.5em]">Fixium Companion</span>
                                </div>
                                <p className="font-mono text-[7px] tracking-widest leading-none text-muted-foreground">Always Ready // v2.0.4</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
