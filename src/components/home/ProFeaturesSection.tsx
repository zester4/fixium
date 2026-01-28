import { motion } from 'framer-motion';
import { Crown, Layers, Cpu, ShoppingCart, FileDown, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const proFeatures = [
  {
    icon: Layers,
    title: 'Detailed Teardowns',
    description: 'Micro-step disassembly guides with pro tips',
  },
  {
    icon: Cpu,
    title: 'Priority AI Analysis',
    description: 'Faster, more detailed Gemini 3 diagnostics',
  },
  {
    icon: ShoppingCart,
    title: 'Parts Sourcing',
    description: 'Direct links to verified parts suppliers',
  },
  {
    icon: FileDown,
    title: 'Offline PDF Export',
    description: 'Download guides for offline access',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Techniques',
    description: 'Access community-verified repair methods',
  },
];

interface ProFeaturesSectionProps {
  isPro: boolean;
  isLoggedIn: boolean;
}

export function ProFeaturesSection({ isPro, isLoggedIn }: ProFeaturesSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3 }}
      className="mb-8 sm:mb-10"
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          Pro Community
        </h2>
        {isPro && (
          <Badge className="bg-gradient-to-r from-amber-500/80 to-orange-600/80 text-white border-none font-mono text-[10px] uppercase tracking-tighter">
            PRO ACCESS
          </Badge>
        )}
      </div>

      <Card className="overflow-hidden border-border/50 shadow-none bg-muted/10 glass-card">
        <div className="bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 p-5 border-b border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="font-mono text-lg font-bold text-foreground tracking-tight">
                  FIXFLOW PRO
                </h3>
              </div>
              <p className="text-xs font-mono uppercase tracking-tighter text-muted-foreground">
                Expert Guidance & Resources
              </p>
            </div>
            {!isPro && (
              <Link to={isLoggedIn ? '/profile' : '/auth'}>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] uppercase tracking-widest px-4 h-9 shadow-sm">
                  {isLoggedIn ? 'UPGRADE' : 'SIGN UP'}
                </Button>
              </Link>
            )}
          </div>
        </div>

        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {proFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                  <feature.icon className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-[13px] text-foreground font-mono uppercase tracking-tight">{feature.title}</p>
                  <p className="text-[11px] leading-snug text-muted-foreground mt-0.5">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
