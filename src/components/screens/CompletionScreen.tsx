import { useEffect, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Star,
  RotateCcw,
  Download,
  Camera,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRepairStore } from '@/store/repairStore';
import { useRepairHistory } from '@/hooks/useRepairHistory';
import { useAuth } from '@/contexts/AuthContext';
import { RepairTimeline } from '@/components/repair/RepairTimeline';
import { exportGuideToPDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export function CompletionScreen() {
  const { resetSession, repairGuide, deviceInfo, capturedPhotos } = useRepairStore();
  const { addRepair } = useRepairHistory();
  const { isPro } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  // Save repair to history on mount
  useEffect(() => {
    if (repairGuide && !hasSaved) {
      addRepair(repairGuide);
      setHasSaved(true);
    }
  }, [repairGuide, addRepair, hasSaved]);

  // Convert captured photos to timeline format
  const timelinePhotos = capturedPhotos.map(photo => ({
    id: photo.id,
    type: 'before' as const,
    dataUrl: photo.dataUrl,
    timestamp: photo.timestamp,
  }));

  const handleStartNew = () => {
    resetSession();
  };

  const handleExportPDF = async () => {
    if (!repairGuide) return;

    if (!isPro) {
      toast({
        title: 'Pro Feature',
        description: 'Upgrade to Pro to export guides as PDF.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await exportGuideToPDF(repairGuide);
      toast({
        title: 'PDF Exported',
        description: 'Your repair guide has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Could not generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center w-full"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 sm:mb-8 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-success/10 border-2 border-success"
          >
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-success" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl font-semibold text-foreground mb-2"
          >
            Repair Complete!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6 sm:mb-8"
          >
            Great work on your {deviceInfo?.model || deviceInfo?.category || 'device'} repair.
          </motion.p>

          {/* Rating section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 sm:p-6 rounded-xl border border-border bg-card mb-6 sm:mb-8"
          >
            <p className="text-sm font-medium text-foreground mb-4">
              How accurate was this guide?
            </p>
            <div className="flex justify-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="tap-target p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${rating && star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-muted-foreground/30'
                      }`}
                  />
                </button>
              ))}
            </div>
            {rating && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground mt-3"
              >
                Thanks for your feedback!
              </motion.p>
            )}
          </motion.div>

          {/* Summary stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-3 mb-6 sm:mb-8"
          >
            <div className="p-3 sm:p-4 rounded-xl bg-muted text-center">
              <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                {repairGuide?.steps.length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Steps Completed</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-muted text-center">
              <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                {repairGuide?.diagnosis.estimatedTime || '—'}
              </p>
              <p className="text-xs text-muted-foreground">Estimated Time</p>
            </div>
          </motion.div>

          {/* Photo Timeline */}
          {timelinePhotos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6 sm:mb-8 text-left"
            >
              <h3 className="font-mono text-sm font-semibold tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Repair Photos
              </h3>
              <RepairTimeline photos={timelinePhotos} isEditable={false} />
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Button
              size="lg"
              className="w-full tap-target text-base font-medium"
              onClick={handleStartNew}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start New Repair
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 tap-target"
                onClick={handleExportPDF}
              >
                <Download className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Export</span> PDF
                {!isPro && <Crown className="w-4 h-4 ml-1 text-amber-500" />}
              </Button>

              {!isPro && (
                <Link to="/profile" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full tap-target">
                    <Crown className="w-5 h-5 mr-2 text-amber-500" />
                    Go Pro
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="pb-6 pb-safe-bottom text-center px-4">
        <p className="text-xs text-muted-foreground/50 font-mono">
          Repair saved to your history
        </p>
      </footer>
    </div>
  );
}
