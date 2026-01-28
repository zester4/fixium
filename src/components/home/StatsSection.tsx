import { motion } from 'framer-motion';
import { Zap, Shield, Clock, Users, Star, Wrench } from 'lucide-react';

const stats = [
  { icon: Zap, value: 'Instant', label: 'AI Analysis' },
  { icon: Shield, value: 'Safe', label: 'Guided Steps' },
  { icon: Clock, value: '< 1hr', label: 'Most Repairs' },
];

const extendedStats = [
  { icon: Users, value: '50K+', label: 'Repairs Completed' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
  { icon: Wrench, value: '500+', label: 'Device Models' },
];

interface StatsSectionProps {
  extended?: boolean;
}

export function StatsSection({ extended = false }: StatsSectionProps) {
  const displayStats = extended ? [...stats, ...extendedStats] : stats;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`grid gap-3 sm:gap-4 mb-8 sm:mb-10 ${
        extended ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-3'
      }`}
    >
      {displayStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.05 }}
          className="text-center p-3 rounded-xl bg-card border border-border shadow-none"
        >
          <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/5 mb-2 border border-primary/10">
            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <p className="font-mono text-base sm:text-lg font-bold text-foreground tracking-tighter uppercase">{stat.value}</p>
          <p className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-tight">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
