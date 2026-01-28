import { motion } from 'framer-motion';
import {
  Smartphone,
  Laptop,
  Cpu,
  Tablet,
  Headphones,
  Speaker,
  Gamepad2,
  Monitor,
  Microwave,
  Coffee,
  Car,
  Bike,
  Drill,
  Leaf,
  Watch,
  Camera,
  Plane,
  Armchair,
  Home,
  Plus,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRepairStore } from '@/store/repairStore';
import type { DeviceCategory } from '@/types/repair';
import { useState, forwardRef } from 'react';

const deviceCategories: { id: DeviceCategory; label: string; icon: React.ElementType }[] = [
  { id: 'phone', label: 'Phone', icon: Smartphone },
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'desktop', label: 'Desktop', icon: Cpu },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'headphones', label: 'Headphones', icon: Headphones },
  { id: 'audio', label: 'Audio', icon: Speaker },
  { id: 'console', label: 'Console', icon: Gamepad2 },
  { id: 'display', label: 'Display', icon: Monitor },
  { id: 'appliance', label: 'Appliance', icon: Microwave },
  { id: 'kitchen', label: 'Kitchen', icon: Coffee },
  { id: 'automotive', label: 'Auto', icon: Car },
  { id: 'bicycle', label: 'Bicycle', icon: Bike },
  { id: 'tool', label: 'Tools', icon: Drill },
  { id: 'garden', label: 'Garden', icon: Leaf },
  { id: 'wearable', label: 'Wearable', icon: Watch },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'drone', label: 'Drone', icon: Plane },
  { id: 'furniture', label: 'Furniture', icon: Armchair },
  { id: 'smart-home', label: 'Smart Home', icon: Home },
  { id: 'other', label: 'Custom', icon: Plus },
];

const conditionOptions = [
  { id: 'power', label: 'No Power', icon: Cpu },
  { id: 'broken', label: 'Broken Glass', icon: Smartphone },
  { id: 'liquid', label: 'Liquid Damage', icon: Speaker },
  { id: 'mechanical', label: 'Mechanical', icon: Drill },
  { id: 'other', label: 'General Wear', icon: Plus },
];

const safetyProtocols: Record<string, string[]> = {
  automotive: [
    "Ensure engine is completely cool",
    "Set parking brake & use wheel chocks",
    "Wear eye protection for fluids"
  ],
  appliance: [
    "Unplug device from wall outlet",
    "Wait 10 mins for capacitors to discharge",
    "Check for gas leaks if applicable"
  ],
  tool: [
    "Remove battery pack or unplug",
    "Ensure all blades are stationary",
    "Clear workspace of flammable debris"
  ],
  laptop: [
    "Ground yourself to prevent ESD",
    "Use non-conductive plastic tools",
    "Avoid touching battery cells"
  ],
  default: [
    "Work in a well-lit area",
    "Keep children and pets away",
    "Document screw locations"
  ]
};

export const DeviceSelectionScreen = forwardRef<HTMLDivElement>((_, ref) => {
  const { setScreen, setDeviceInfo } = useRepairStore();
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [modelInput, setModelInput] = useState('');

  const currentSafety = selectedCategory ? (safetyProtocols[selectedCategory] || safetyProtocols.default) : null;

  const handleContinue = () => {
    if (selectedCategory) {
      setDeviceInfo({
        category: selectedCategory,
        model: modelInput.trim() || undefined,
        condition: selectedCondition || undefined,
      });
      setScreen('photo-capture');
    }
  };

  return (
    <div ref={ref} className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="tap-target -ml-2"
            onClick={() => setScreen('welcome')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center pr-10">
            <h1 className="font-mono text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
              Select Device & Context
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Section 1: Device Category */}
          <div className="space-y-4">
            <h2 className="font-mono text-[11px] font-bold tracking-widest text-primary/70 mb-2">
              01. Choose Category
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {deviceCategories.map((device, index) => {
                const Icon = device.icon;
                const isSelected = selectedCategory === device.id;

                return (
                  <motion.button
                    key={device.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: isSelected ? 1.05 : 1,
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 17,
                      delay: index * 0.02
                    }}
                    onClick={() => {
                      setSelectedCategory(device.id);
                      setSelectedCondition(null); // Reset condition if category changes
                    }}
                    className={`
                      tap-target flex flex-col items-center justify-center p-3 rounded-lg border-[0.5px] transition-colors duration-300
                      ${isSelected
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-border/50 bg-card hover:border-primary/30'
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 mb-1.5 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground/60'
                        }`}
                      strokeWidth={1.2}
                    />
                    <span className={`text-[10px] font-semibold truncate w-full text-center ${isSelected ? 'text-foreground' : 'text-muted-foreground/80'
                      }`}>
                      {device.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Condition Triage */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 pt-4 border-t border-border/40"
            >
              <h2 className="font-mono text-[11px] font-bold tracking-widest text-primary/70 mb-2">
                02. Reported Condition
              </h2>
              <div className="flex flex-wrap gap-2">
                {conditionOptions.map((opt) => {
                  const CondIcon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedCondition(opt.id === selectedCondition ? null : opt.id)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-full border-[0.5px] transition-all
                        ${selectedCondition === opt.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/30 text-muted-foreground border-border hover:border-primary/40'
                        }
                      `}
                    >
                      <CondIcon className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold tracking-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Section 3: Model & Safety */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 pt-4 border-t border-border/40"
            >
              <div className="space-y-3">
                <h2 className="font-mono text-[11px] font-bold tracking-widest text-primary/70">
                  03. Technical Context
                </h2>
                <Input
                  type="text"
                  placeholder="Specific model (e.g., iPhone 14 Pro, Dyson V11)"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="h-10 text-sm bg-muted/20 border-border/60 rounded-lg placeholder:opacity-50"
                />
              </div>

              {/* Critical Safety Panel */}
              <div className="p-4 rounded-xl border-[0.5px] border-caution/30 bg-caution/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <ShieldAlert className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4 text-caution" />
                  <span className="font-mono text-[10px] font-extrabold tracking-[0.2em] text-caution">
                    Safety Protocol Required
                  </span>
                </div>
                <ul className="space-y-2">
                  {currentSafety?.map((step, i) => (
                    <li key={i} className="flex gap-2 text-[12px] font-medium text-foreground/80">
                      <span className="text-caution font-mono tabular-nums">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer CTA */}
      <div className="sticky bottom-0 p-4 pb-safe-bottom bg-background border-t border-border mt-auto">
        <div className="max-w-2xl mx-auto">
          <Button
            size="lg"
            className="w-full tap-target text-base font-medium shadow-xl rounded-2xl"
            disabled={!selectedCategory}
            onClick={handleContinue}
          >
            Start Diagnosis
          </Button>
        </div>
      </div>
    </div>
  );
});

DeviceSelectionScreen.displayName = 'DeviceSelectionScreen';
