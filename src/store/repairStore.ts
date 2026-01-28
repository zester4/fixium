import { create } from 'zustand';
import type { 
  AppScreen, 
  DeviceInfo, 
  CapturedPhoto, 
  DiagnosisResult, 
  RepairGuide 
} from '@/types/repair';

interface RepairState {
  // Navigation
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;

  // Device selection
  deviceInfo: DeviceInfo | null;
  setDeviceInfo: (info: DeviceInfo) => void;

  // Photo capture
  capturedPhotos: CapturedPhoto[];
  addPhoto: (photo: CapturedPhoto) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;

  // Diagnosis
  diagnosis: DiagnosisResult | null;
  setDiagnosis: (diagnosis: DiagnosisResult) => void;

  // Repair guide
  repairGuide: RepairGuide | null;
  setRepairGuide: (guide: RepairGuide) => void;
  currentStepIndex: number;
  setCurrentStep: (index: number) => void;
  completedSteps: Set<number>;
  markStepComplete: (index: number) => void;

  // Reset
  resetSession: () => void;
}

export const useRepairStore = create<RepairState>((set) => ({
  // Navigation
  currentScreen: 'welcome',
  setScreen: (screen) => set({ currentScreen: screen }),

  // Device selection
  deviceInfo: null,
  setDeviceInfo: (info) => set({ deviceInfo: info }),

  // Photo capture
  capturedPhotos: [],
  addPhoto: (photo) => set((state) => ({ 
    capturedPhotos: [...state.capturedPhotos, photo] 
  })),
  removePhoto: (id) => set((state) => ({ 
    capturedPhotos: state.capturedPhotos.filter(p => p.id !== id) 
  })),
  clearPhotos: () => set({ capturedPhotos: [] }),

  // Diagnosis
  diagnosis: null,
  setDiagnosis: (diagnosis) => set({ diagnosis }),

  // Repair guide
  repairGuide: null,
  setRepairGuide: (guide) => set({ repairGuide: guide }),
  currentStepIndex: 0,
  setCurrentStep: (index) => set({ currentStepIndex: index }),
  completedSteps: new Set(),
  markStepComplete: (index) => set((state) => {
    const newCompleted = new Set(state.completedSteps);
    newCompleted.add(index);
    return { completedSteps: newCompleted };
  }),

  // Reset
  resetSession: () => set({
    currentScreen: 'welcome',
    deviceInfo: null,
    capturedPhotos: [],
    diagnosis: null,
    repairGuide: null,
    currentStepIndex: 0,
    completedSteps: new Set(),
  }),
}));
