import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  ShieldCheck,
  FileText,
  Linkedin,
  Globe,
  Camera,
  Briefcase,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const specialtyOptions = [
  'Smartphones', 'Laptops', 'Tablets', 'Gaming Consoles',
  'Automotive', 'Appliances', 'Cameras', 'Drones',
  'Smart Home', 'Wearables', 'Audio Equipment', 'Micro-Soldering'
];

type AppStep = 'identity' | 'expertise' | 'verification' | 'review';

export default function TechnicianApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [currentStep, setCurrentStep] = useState<AppStep>('identity');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    linkedin: '',
    portfolio: '',
    experienceYears: '',
    credentials: '',
    specialties: [] as string[],
    certifications: '',
    equipment: '',
    files: [] as File[],
  });

  // Check existing application
  const { data: existingApplication, isLoading } = useQuery({
    queryKey: ['technician-application', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('technician_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Upload files to Supabase Storage if any
      const fileUrls = [];
      for (const file of formData.files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('technician_credentials')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        fileUrls.push(filePath);
      }

      // 2. Insert application record
      const { error } = await supabase
        .from('technician_applications')
        .insert({
          user_id: user.id,
          credentials: formData.credentials.trim(),
          experience_years: parseInt(formData.experienceYears) || null,
          specialties: formData.specialties,
          // metadata can store linkedin/portfolio/fileUrls
          metadata: {
            full_name: formData.fullName,
            linkedin: formData.linkedin,
            portfolio: formData.portfolio,
            certifications: formData.certifications,
            equipment: formData.equipment,
            file_attachments: fileUrls
          }
        });

      if (error) throw error;

      toast({
        title: 'Application Received',
        description: 'Welcome to the pipeline. We will review your credentials shortly.',
      });
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const StatusBadge = () => {
    if (!existingApplication) return null;
    const status = existingApplication.status;
    const config = {
      pending: { icon: Clock, label: 'Under Review', class: 'bg-secondary text-secondary-foreground' },
      approved: { icon: CheckCircle, label: 'Verified', class: 'bg-success text-success-foreground' },
      rejected: { icon: XCircle, label: 'Declined', class: 'bg-destructive text-destructive-foreground' },
    }[status as 'pending' | 'approved' | 'rejected'] || { icon: Clock, label: status, class: '' };

    const Icon = config.icon;
    return (
      <Badge className={`gap-1 font-mono text-[10px] uppercase tracking-widest ${config.class}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const StepIndicator = () => {
    const steps: AppStep[] = ['identity', 'expertise', 'verification', 'review'];
    const idx = steps.indexOf(currentStep);
    return (
      <div className="flex gap-1 mb-8">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= idx ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GlobalHeader />

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
            <p className="font-mono text-[10px] uppercase tracking-widest animate-pulse">Syncing application data...</p>
          </div>
        ) : existingApplication ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="glass-card overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-muted/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-sm uppercase tracking-tight">Status Update</CardTitle>
                  <StatusBadge />
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <ShieldCheck className="w-8 h-8 text-primary/60" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {existingApplication.status === 'pending' && 'We are currently auditing your technical credentials. Expect a decision in 2-3 business days.'}
                    {existingApplication.status === 'approved' && 'Identity verified. You now have full contributor access across the network.'}
                    {existingApplication.status === 'rejected' && 'Verification declined. You may re-apply after 30 days with updated certifications.'}
                  </p>
                </div>

                <div className="space-y-4 font-mono text-[10px] uppercase tracking-wider">
                  <div className="flex justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="text-foreground font-bold">Vetted Specialist</span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-foreground font-bold">Standard Professional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div>
            <StepIndicator />

            <AnimatePresence mode="wait">
              {currentStep === 'identity' && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Professional Identity</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">Tell us who you are in the repair community.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold opacity-70">Full Legal Name</Label>
                      <Input
                        placeholder="e.g., Alex Rivera"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold opacity-70">Professional Network (LinkedIn/Portfolio)</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          placeholder="linkedin.com/in/..."
                          value={formData.linkedin}
                          onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold opacity-70">Years of Dedicated Experience</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.experienceYears}
                        onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 font-mono text-[10px] uppercase tracking-[0.2em] rounded-full mt-8"
                    onClick={() => setCurrentStep('expertise')}
                    disabled={!formData.fullName || !formData.experienceYears}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {currentStep === 'expertise' && (
                <motion.div
                  key="expertise"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Field of Mastery</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">Select the systems you are qualified to diagnose and repair.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {specialtyOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleSpecialtyToggle(opt)}
                        className={`p-3 rounded-xl border text-[10px] font-mono uppercase tracking-tight transition-all text-left ${formData.specialties.includes(opt)
                          ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'bg-card border-border hover:border-primary/40'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold opacity-70">Certifications & Training</Label>
                      <Textarea
                        placeholder="e.g., Apple Certified iOS Technician, CompTIA A+..."
                        className="resize-none"
                        rows={3}
                        value={formData.certifications}
                        onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold opacity-70">Workshop Inventory / Specialized Gear</Label>
                      <Textarea
                        placeholder="e.g., JBC Micro-soldering station, Thermal Camera, Oscilloscope..."
                        className="resize-none"
                        rows={3}
                        value={formData.equipment}
                        onChange={e => setFormData({ ...formData, equipment: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold opacity-70">General Bio & Career Summary</Label>
                      <Textarea
                        placeholder="Briefly describe your technical background..."
                        className="resize-none"
                        rows={3}
                        value={formData.credentials}
                        onChange={e => setFormData({ ...formData, credentials: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button variant="outline" className="h-14 flex-1 rounded-full uppercase font-mono text-[10px] tracking-widest" onClick={() => setCurrentStep('identity')}>
                      Back
                    </Button>
                    <Button
                      className="h-14 flex-[2] rounded-full uppercase font-mono text-[10px] tracking-widest"
                      onClick={() => setCurrentStep('verification')}
                      disabled={formData.specialties.length === 0}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'verification' && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Proof of Expertise</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">Upload certifications, ID, or high-res photos of your repair workbench.</p>
                  </div>

                  <div
                    className="border-2 border-dashed border-primary/20 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Drop files or Browse</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Supported: JPG, PNG, PDF (Max 10MB)</p>
                  </div>

                  {formData.files.length > 0 && (
                    <div className="space-y-2">
                      {formData.files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
                          <div className="flex items-center gap-3">
                            {file.type.includes('image') ? <Camera className="w-4 h-4 text-primary/60" /> : <FileText className="w-4 h-4 text-primary/60" />}
                            <span className="text-[10px] font-mono truncate max-w-[140px]">{file.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => removeFile(i)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-8">
                    <Button variant="outline" className="h-14 flex-1 rounded-full uppercase font-mono text-[10px] tracking-widest" onClick={() => setCurrentStep('expertise')}>
                      Back
                    </Button>
                    <Button
                      className="h-14 flex-[2] rounded-full uppercase font-mono text-[10px] tracking-widest"
                      onClick={() => setCurrentStep('review')}
                    >
                      Final Scan
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 industrial-border">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-tight">Technical Commitment</h2>
                    <p className="text-[10px] text-muted-foreground leading-relaxed px-4 uppercase tracking-wider">
                      Review your credentials one final time. Submitting your application starts the verification process.
                    </p>
                  </div>

                  <Card className="glass-card shadow-xl shadow-primary/5 border-primary/20 bg-primary/[0.02]">
                    <CardContent className="pt-6 space-y-5">
                      <div className="space-y-3 font-mono text-[10px] uppercase tracking-[0.15em]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-muted-foreground flex items-center gap-2"><User className="w-3 h-3" /> Identity</span>
                          <span className="text-foreground font-bold">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-3 h-3" /> Experience</span>
                          <span className="text-foreground font-bold">{formData.experienceYears} Years</span>
                        </div>
                        {formData.linkedin && (
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-muted-foreground flex items-center gap-2"><Linkedin className="w-3 h-3" /> Network</span>
                            <span className="text-primary font-bold truncate max-w-[120px]">{formData.linkedin.replace('https://', '')}</span>
                          </div>
                        )}
                        <div className="space-y-2">
                          <span className="text-muted-foreground flex items-center gap-2"><Award className="w-3 h-3" /> Specialized Zones</span>
                          <div className="flex flex-wrap gap-1">
                            {formData.specialties.map(s => (
                              <Badge key={s} variant="outline" className="text-[8px] bg-primary/10 border-primary/20 text-primary capitalize tracking-normal">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-2">
                          <span className="text-muted-foreground flex items-center gap-2"><Upload className="w-3 h-3" /> Attachments</span>
                          <span className="text-foreground font-bold">{formData.files.length} Files</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3 mt-8">
                    <Button variant="outline" className="h-14 flex-1 rounded-full uppercase font-mono text-[10px] tracking-widest" onClick={() => setCurrentStep('verification')}>
                      Back
                    </Button>
                    <Button
                      className="h-14 flex-[2] rounded-full uppercase font-mono text-[10px] tracking-[0.2em] gap-2 bg-primary shadow-lg shadow-primary/30 group"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 transition-transform group-hover:scale-110" />}
                      {isSubmitting ? 'Sending Request...' : 'Submit Application'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
