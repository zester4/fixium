import { useRepairStore } from '@/store/repairStore';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { DeviceSelectionScreen } from '@/components/screens/DeviceSelectionScreen';
import { PhotoCaptureScreen } from '@/components/screens/PhotoCaptureScreen';
import { AnalyzingScreen } from '@/components/screens/AnalyzingScreen';
import { DiagnosisScreen } from '@/components/screens/DiagnosisScreen';
import { RepairGuideScreen } from '@/components/screens/RepairGuideScreen';
import { CompletionScreen } from '@/components/screens/CompletionScreen';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const currentScreen = useRepairStore((state) => state.currentScreen);
  const { user } = useAuth();

  const screens = {
    'welcome': user ? <DashboardScreen /> : <WelcomeScreen />,
    'device-selection': <DeviceSelectionScreen />,
    'photo-capture': <PhotoCaptureScreen />,
    'analyzing': <AnalyzingScreen />,
    'diagnosis': <DiagnosisScreen />,
    'repair-guide': <RepairGuideScreen />,
    'parts-tools': <RepairGuideScreen />, // Handled via sheet in RepairGuide
    'completion': <CompletionScreen />,
  };

  return screens[currentScreen] || <WelcomeScreen />;
};

export default Index;
