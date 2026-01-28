import { useState, useRef, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  ArrowLeft, 
  X, 
  Check,
  Image as ImageIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRepairStore } from '@/store/repairStore';
import type { CapturedPhoto } from '@/types/repair';
import { DeviceOverlay } from '@/components/repair/DeviceOverlay';

const captureSteps = [
  { type: 'front' as const, label: 'Front View', instruction: 'Capture the entire device from the front' },
  { type: 'problem' as const, label: 'Problem Area', instruction: 'Focus on the damaged or broken area' },
  { type: 'detail' as const, label: 'Close-up Detail', instruction: 'Get as close as possible to the issue' },
];

export const PhotoCaptureScreen = forwardRef<HTMLDivElement>((_, ref) => {
  const { setScreen, capturedPhotos, addPhoto, removePhoto } = useRepairStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStep = captureSteps[currentStepIndex];
  const photosForCurrentStep = capturedPhotos.filter(p => p.type === currentStep.type);
  const hasPhotoForStep = photosForCurrentStep.length > 0;

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newPhoto: CapturedPhoto = {
        id: `${currentStep.type}-${Date.now()}`,
        type: currentStep.type,
        dataUrl,
        timestamp: Date.now(),
      };
      addPhoto(newPhoto);
      
      // Auto-advance to next step if not the last
      if (currentStepIndex < captureSteps.length - 1) {
        setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 300);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [currentStep.type, currentStepIndex, addPhoto]);

  const handleCameraCapture = useCallback(() => {
    setIsCapturing(true);
    // Trigger file input with camera
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
    setIsCapturing(false);
  }, []);

  const handleUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  }, []);

  const handleRemovePhoto = (photoId: string) => {
    removePhoto(photoId);
  };

  const handleContinue = () => {
    setScreen('analyzing');
  };

  const allStepsComplete = captureSteps.every(step => 
    capturedPhotos.some(p => p.type === step.type)
  );

  const completedCount = captureSteps.filter(step =>
    capturedPhotos.some(p => p.type === step.type)
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="tap-target -ml-2"
            onClick={() => setScreen('device-selection')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="font-mono text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Capture Photos
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
        
        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedCount / captureSteps.length) * 100}%` }} 
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Step tabs */}
        <div className="flex border-b border-border">
          {captureSteps.map((step, index) => {
            const hasPhoto = capturedPhotos.some(p => p.type === step.type);
            const isCurrent = index === currentStepIndex;
            
            return (
              <button
                key={step.type}
                onClick={() => setCurrentStepIndex(index)}
                className={`
                  flex-1 py-3 px-2 text-center transition-colors relative
                  ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                `}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {hasPhoto ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <span className="font-mono text-xs">{index + 1}</span>
                  )}
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
                {isCurrent && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Capture area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.type}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-sm text-center"
            >
              {hasPhotoForStep ? (
                // Show captured photo
                <div className="relative">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border-2 border-success">
                    <img
                      src={photosForCurrentStep[0].dataUrl}
                      alt={currentStep.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleRemovePhoto(photosForCurrentStep[0].id)}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="mt-3 text-sm text-success font-medium flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    Photo captured
                  </p>
                </div>
              ) : (
                // Show capture prompt
                <>
                  <div className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex flex-col items-center justify-center mb-6 overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-[200px] z-10">
                      {currentStep.instruction}
                    </p>
                    
                    {/* Visual alignment overlay */}
                    {useRepairStore.getState().deviceInfo?.category && (
                      <DeviceOverlay category={useRepairStore.getState().deviceInfo!.category} />
                    )}
                  </div>

                  {/* Capture buttons */}
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1 tap-target"
                      onClick={handleCameraCapture}
                      disabled={isCapturing}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="tap-target"
                      onClick={handleUpload}
                    >
                      <Upload className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Photo thumbnails */}
        {capturedPhotos.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {capturedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border"
                >
                  <img
                    src={photo.dataUrl}
                    alt={photo.type}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background text-[10px] text-center py-0.5 font-mono">
                    {photo.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <div className="sticky bottom-0 p-4 pb-safe-bottom bg-background border-t border-border">
        <div className="max-w-2xl mx-auto">
          <Button
            size="lg"
            className="w-full tap-target text-base font-medium"
            disabled={capturedPhotos.length === 0}
            onClick={handleContinue}
          >
            {allStepsComplete ? 'Analyze Photos' : `Continue with ${capturedPhotos.length} Photo${capturedPhotos.length !== 1 ? 's' : ''}`}
          </Button>
          {!allStepsComplete && capturedPhotos.length > 0 && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              {completedCount} of {captureSteps.length} views captured
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

PhotoCaptureScreen.displayName = 'PhotoCaptureScreen';
