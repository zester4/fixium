import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Clock,
  Gauge,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRepairStore } from '@/store/repairStore';
import { ConfidenceMeter } from '@/components/repair/ConfidenceMeter';

export const DiagnosisScreen = forwardRef<HTMLDivElement>((_, ref) => {
  const { setScreen, diagnosis, deviceInfo, capturedPhotos } = useRepairStore();

  if (!diagnosis) {
    return null;
  }

  const difficultyColors = {
    beginner: 'bg-success/10 text-success border-success/30',
    intermediate: 'bg-caution/10 text-caution border-caution/30',
    advanced: 'bg-warning/10 text-warning border-warning/30',
  };

  const severityIcons = {
    minor: <CheckCircle2 className="w-4 h-4 text-success" />,
    moderate: <AlertCircle className="w-4 h-4 text-caution" />,
    severe: <AlertTriangle className="w-4 h-4 text-warning" />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="tap-target -ml-2"
            onClick={() => setScreen('photo-capture')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="font-mono text-sm font-semibold tracking-wide text-muted-foreground">
              Repair Diagnosis
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto w-full">
        {/* Device info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            {deviceInfo?.model || deviceInfo?.category || 'Device'}
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mt-1">
            Analysis Complete
          </h2>
        </motion.div>

        {/* Confidence meter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ConfidenceMeter confidence={diagnosis.confidence} />
        </motion.div>

        {/* Difficulty & Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 sm:gap-3"
        >
          <div className={`flex-1 p-3 sm:p-4 rounded-xl border ${difficultyColors[diagnosis.difficulty]}`}>
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-medium tracking-wide">Difficulty</span>
            </div>
            <p className="text-base sm:text-lg font-semibold capitalize">{diagnosis.difficulty}</p>
          </div>
          <div className="flex-1 p-3 sm:p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium tracking-wide">Estimated time</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-foreground">{diagnosis.estimatedTime}</p>
          </div>
        </motion.div>

        {/* Damage findings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="font-mono text-sm font-semibold tracking-wide text-muted-foreground">
            Detected Issues
          </h3>
          {diagnosis.damages.map((damage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-start gap-3">
                {severityIcons[damage.severity]}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{damage.type}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {damage.description}
                  </p>
                  {damage.location && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {damage.location}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Failure predictions */}
        {diagnosis.failurePredictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="font-mono text-sm font-semibold tracking-wide text-muted-foreground">
              Potential Related Issues
            </h3>
            <div className="p-4 rounded-xl border border-caution/30 bg-caution/5">
              <ul className="space-y-2">
                {diagnosis.failurePredictions.map((prediction, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-caution flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{prediction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer CTA */}
      <div className="sticky bottom-0 p-4 pb-safe-bottom bg-background border-t border-border">
        <div className="max-w-2xl mx-auto">
          <Button
            size="lg"
            className="w-full tap-target text-base font-medium"
            onClick={() => setScreen('repair-guide')}
          >
            View Repair Guide
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
});

DiagnosisScreen.displayName = 'DiagnosisScreen';
