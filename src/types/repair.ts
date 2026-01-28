export type DeviceCategory =
  | 'phone'
  | 'laptop'
  | 'desktop'
  | 'tablet'
  | 'headphones'
  | 'audio'
  | 'console'
  | 'display'
  | 'appliance'
  | 'kitchen'
  | 'automotive'
  | 'bicycle'
  | 'tool'
  | 'garden'
  | 'wearable'
  | 'camera'
  | 'drone'
  | 'furniture'
  | 'smart-home'
  | 'other';

export type RepairDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface DeviceInfo {
  category: DeviceCategory;
  model?: string;
  brand?: string;
  condition?: string;
  isEmergency?: boolean;
}

export interface CapturedPhoto {
  id: string;
  type: 'front' | 'problem' | 'detail';
  dataUrl: string;
  timestamp: number;
}

export interface DamageDetection {
  type: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  location?: string;
}

export interface DiagnosisResult {
  damages: DamageDetection[];
  difficulty: RepairDifficulty;
  estimatedTime: string;
  confidence: number; // 0-100
  failurePredictions: string[];
  repairability: 'high' | 'medium' | 'low';
}

export interface RepairStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  detailedNotes?: string;
  toolsRequired: string[];
  warningLevel?: 'info' | 'caution' | 'warning';
  warningMessage?: string;
  estimatedTime?: string;
  imageAnnotations?: ImageAnnotation[];
}

export interface ImageAnnotation {
  id: string;
  type: 'hotspot' | 'zone' | 'arrow';
  label: string;
  x: number; // percentage
  y: number; // percentage
  color: 'safe' | 'caution' | 'warning' | 'connector';
}

export interface Part {
  id: string;
  name: string;
  partNumber?: string;
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  suppliers: PartSupplier[];
  difficulty: RepairDifficulty;
  isRequired: boolean;
}

export interface PartSupplier {
  name: string;
  url: string;
  price?: number;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  isRequired: boolean;
  substitutes?: string[];
}

export interface RepairGuide {
  id: string;
  deviceInfo: DeviceInfo;
  diagnosis: DiagnosisResult;
  steps: RepairStep[];
  parts: Part[];
  tools: Tool[];
  createdAt: number;
}

export type AppScreen =
  | 'welcome'
  | 'device-selection'
  | 'photo-capture'
  | 'analyzing'
  | 'diagnosis'
  | 'repair-guide'
  | 'parts-tools'
  | 'completion';
