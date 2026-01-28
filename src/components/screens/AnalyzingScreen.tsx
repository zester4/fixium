import { useEffect, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { useRepairStore } from '@/store/repairStore';
import { analyzeRepairWithGemini } from '@/services/aiService';
import { toast } from 'sonner';

const analysisSteps = [
  'Processing your photos...',
  'Identifying your device...',
  'Checking for damage...',
  'Mapping components...',
  'Creating your repair guide...',
  'Almost ready...',
];

export const AnalyzingScreen = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    setScreen,
    setDiagnosis,
    setRepairGuide,
    deviceInfo,
    capturedPhotos
  } = useRepairStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const analyzePhotos = async () => {
      // Start progress animation
      const stepInterval = setInterval(() => {
        if (!isMounted) return;
        setCurrentStep((prev) => Math.min(prev + 1, analysisSteps.length - 1));
      }, 1500);

      const progressInterval = setInterval(() => {
        if (!isMounted) return;
        setProgress((prev) => Math.min(prev + 2, 90));
      }, 200);

      try {
        const data = await analyzeRepairWithGemini(
          capturedPhotos,
          deviceInfo?.category || 'unknown',
          deviceInfo?.model,
          deviceInfo?.condition
        );

        if (!isMounted) return;

        // Set the diagnosis and repair guide from AI response
        setDiagnosis(data.diagnosis);
        setRepairGuide({
          id: `guide-${Date.now()}`,
          deviceInfo: deviceInfo || { category: 'phone' },
          diagnosis: data.diagnosis,
          steps: data.steps,
          parts: data.parts,
          tools: data.tools,
          createdAt: Date.now(),
        });

        setProgress(100);

        // Short delay before transition
        setTimeout(() => {
          if (isMounted) {
            setScreen('diagnosis');
          }
        }, 500);

      } catch (error) {
        console.error('Analysis error:', error);

        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Sorry, we couldn\'t analyze your photos. Please try again.'
          );
          setScreen('photo-capture');
        }
      } finally {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      }
    };

    analyzePhotos();

    return () => {
      isMounted = false;
    };
  }, [setScreen, setDiagnosis, setRepairGuide, deviceInfo, capturedPhotos]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-lg mx-auto w-full relative">
        {/* Technical Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <svg width="100%" height="100%">
            <pattern id="grid-analyze" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-analyze)" />
          </svg>
        </div>

        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 sm:mb-8 relative"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary/20 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-lg sm:text-xl font-semibold text-foreground mb-2"
        >
          Looking at your photos
        </motion.h1>

        {/* Current step */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-6 mb-6 sm:mb-8"
        >
          <p className="text-sm text-muted-foreground text-center italic">
            {analysisSteps[currentStep]}
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 font-mono tracking-tighter">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Photo thumbnails being analyzed */}
        <div className="mt-10 sm:mt-12 flex gap-4">
          {capturedPhotos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border border-primary/20 bg-muted shadow-2xl"
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.type}
                  className="w-full h-full object-cover grayscale opacity-50"
                />

                {/* Scanner bar */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5
                  }}
                  className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
                />

                {/* Status indicators */}
                <div className="absolute bottom-1 right-1">
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                </div>
              </motion.div>

              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <span className="font-mono text-[8px] tracking-tighter text-muted-foreground">
                  Photo {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Status log */}
        <div className="mt-12 w-full font-mono text-[10px] text-primary/60 overflow-hidden h-8 text-center max-w-xs tracking-tighter italic">
          <motion.div
            animate={{ y: [0, -20, -40, -60, -80, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          >
            <p>Checking connection...</p>
            <p>Reading photo data...</p>
            <p>Running diagnostic engine...</p>
            <p>Building your guide...</p>
            <p>Preparing instructions...</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
});

AnalyzingScreen.displayName = 'AnalyzingScreen';
