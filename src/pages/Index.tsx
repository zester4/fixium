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
import { SEO } from '@/components/seo/SEO';
import { StructuredData } from '@/components/seo/StructuredData';

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

  const orgStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fixium",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo-fixium.png`,
    "description": "AI-powered device repair guidance companion.",
    "sameAs": [
      "https://twitter.com/Fixium"
    ]
  };

  return (
    <>
      <SEO />
      <StructuredData data={orgStructuredData} />
      {screens[currentScreen] || <WelcomeScreen />}
    </>
  );
};

export default Index;
