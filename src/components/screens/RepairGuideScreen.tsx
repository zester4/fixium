import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Wrench,
  Package,
  Download,
  Star,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRepairStore } from '@/store/repairStore';
import { StepCard } from '@/components/repair/StepCard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { PartsToolsSheet } from '@/components/repair/PartsToolsSheet';
import { GuideRating } from '@/components/community/GuideRating';
import { exportGuideToPDF } from '@/utils/pdfExport';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function RepairGuideScreen() {
  const {
    setScreen,
    repairGuide,
    currentStepIndex,
    setCurrentStep,
    completedSteps,
    markStepComplete
  } = useRepairStore();
  const { isPro } = useAuth();
  const { toast } = useToast();

  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [showPartsTools, setShowPartsTools] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!repairGuide) return null;

  const { steps, parts, tools, diagnosis } = repairGuide;
  const progressPercent = (completedSteps.size / steps.length) * 100;
  const allStepsComplete = completedSteps.size === steps.length;

  const handleExportPDF = async () => {
    if (!isPro) {
      toast({
        title: 'Pro Feature',
        description: 'Upgrade to Pro to export guides as PDF.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleStepToggle = (index: number) => {
    setExpandedStep(expandedStep === index ? -1 : index);
    setCurrentStep(index);
  };

  const handleStepComplete = (index: number) => {
    markStepComplete(index);
    // Auto-expand next step
    if (index < steps.length - 1) {
      setExpandedStep(index + 1);
      setCurrentStep(index + 1);
    }
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
            onClick={() => setScreen('diagnosis')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="font-mono text-sm font-semibold tracking-wide text-muted-foreground">
              Repair Guide
            </h1>
          </div>
          <Sheet open={showPartsTools} onOpenChange={setShowPartsTools}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="tap-target -mr-2">
                <Package className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <PartsToolsSheet parts={parts} tools={tools} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Progress section */}
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {completedSteps.size} of {steps.length} steps complete
            </span>
            <span className="font-mono text-muted-foreground">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </header>

      {/* Difficulty & Time banner */}
      <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="capitalize">
            {diagnosis.difficulty}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {diagnosis.estimatedTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Download className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">PDF</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setShowPartsTools(true)}
          >
            <Wrench className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Tools & Parts</span>
          </Button>
        </div>
      </div>

      {/* Steps Timeline */}
      <main className="flex-1 px-4 py-6">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isComplete = completedSteps.has(index);
            const isExpanded = expandedStep === index;
            const isCurrent = currentStepIndex === index;

            return (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                isComplete={isComplete}
                isExpanded={isExpanded}
                isCurrent={isCurrent}
                onToggle={() => handleStepToggle(index)}
                onComplete={() => handleStepComplete(index)}
              />
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 pb-safe-bottom bg-background border-t border-border">
        {allStepsComplete ? (
          <Button
            size="lg"
            className="w-full tap-target text-base font-medium bg-success hover:bg-success/90"
            onClick={() => setScreen('completion')}
          >
            <Check className="w-5 h-5 mr-2" />
            Complete Repair
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 tap-target"
              onClick={() => setShowPartsTools(true)}
            >
              <Package className="w-5 h-5 mr-2" />
              Parts List
            </Button>
            <Button
              size="lg"
              className="flex-1 tap-target"
              onClick={() => {
                const nextIncomplete = steps.findIndex((_, i) => !completedSteps.has(i));
                if (nextIncomplete !== -1) {
                  setExpandedStep(nextIncomplete);
                  setCurrentStep(nextIncomplete);
                }
              }}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
