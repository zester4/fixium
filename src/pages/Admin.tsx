import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Briefcase,
  Calendar,
  ArrowLeft,
  Loader2,
  BadgeCheck,
  AlertCircle,
  Linkedin,
  Globe,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type TechnicianApplication = Database['public']['Tables']['technician_applications']['Row'] & {
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  user_email?: string;
  metadata?: any;
};

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<TechnicianApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin, activeTab]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, isAuthLoading]);

  const fetchApplications = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('technician_applications')
      .select(`
        *,
        profile:profiles!technician_applications_profiles_fkey(display_name, avatar_url)
      `)
      .eq('status', activeTab as 'pending' | 'approved' | 'rejected')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('CRITICAL DATABASE ERROR:', error);
      toast({
        title: 'Query Failed',
        description: error.message || 'Failed to load applications.',
        variant: 'destructive',
      });
    } else {
      // Process profiles (Supabase sometimes returns an array for joins)
      const formattedApps = (data || []).map((app) => ({
        ...app,
        profile: Array.isArray(app.profile) ? app.profile[0] : app.profile,
      }));
      setApplications(formattedApps);
    }

    setIsLoading(false);
  };

  const handleApplication = async (applicationId: string, action: 'approve' | 'reject') => {
    setProcessingId(applicationId);

    const { error } = await supabase
      .from('technician_applications')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq('id', applicationId);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} application.`,
        variant: 'destructive',
      });
    } else {
      // If approved, create/update the technician profile
      if (action === 'approve') {
        const app = applications.find(a => a.id === applicationId);
        if (app) {
          const metadata = app.metadata as any;
          await (supabase as any)
            .from('technician_profiles')
            .upsert({
              user_id: app.user_id,
              full_name: metadata?.full_name || app.profile?.display_name || 'Verified Technician',
              specialties: app.specialties,
              experience_years: app.experience_years,
              linkedin_url: metadata?.linkedin,
              portfolio_url: metadata?.portfolio,
              reputation_tier: 1
            });

          // Also set is_pro to true in the main profile
          await supabase
            .from('profiles')
            .update({ is_pro: true })
            .eq('user_id', app.user_id);
        }
      }

      toast({
        title: 'Success',
        description: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });
      fetchApplications();
    }

    setProcessingId(null);
  };

  const statusCounts = {
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (isAuthLoading || (user && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center shadow-none border-border/50 bg-muted/30">
            <CardContent className="pt-4 pb-3">
              <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-mono font-bold text-foreground">{statusCounts.pending}</p>
              <p className="text-[10px] uppercase font-mono tracking-tighter text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-none border-border/50 bg-muted/30">
            <CardContent className="pt-4 pb-3">
              <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
              <p className="text-2xl font-mono font-bold text-foreground">{statusCounts.approved}</p>
              <p className="text-[10px] uppercase font-mono tracking-tighter text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-none border-border/50 bg-muted/30">
            <CardContent className="pt-4 pb-3">
              <XCircle className="w-5 h-5 text-destructive mx-auto mb-1" />
              <p className="text-2xl font-mono font-bold text-foreground">{statusCounts.rejected}</p>
              <p className="text-[10px] uppercase font-mono tracking-tighter text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4 bg-muted/50 p-1">
            <TabsTrigger value="pending" className="flex-1 font-mono text-xs uppercase tracking-tight">
              <Clock className="w-3 h-3 mr-2" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex-1 font-mono text-xs uppercase tracking-tight">
              <CheckCircle className="w-3 h-3 mr-2" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex-1 font-mono text-xs uppercase tracking-tight">
              <XCircle className="w-3 h-3 mr-2" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : applications.length === 0 ? (
              <Card className="border-dashed shadow-none">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-mono text-xs">No {activeTab} applications found.</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="shadow-none border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                            {app.profile?.avatar_url ? (
                              <img
                                src={app.profile.avatar_url}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {app.profile?.display_name || 'Anonymous User'}
                            </CardTitle>
                            <CardDescription className="text-xs font-mono">
                              Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={
                            app.status === 'approved' ? 'default' :
                              app.status === 'rejected' ? 'destructive' : 'secondary'
                          }
                          className="font-mono text-[10px] uppercase tracking-wider"
                        >
                          {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Experience */}
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-primary/60" />
                        <span className="text-muted-foreground font-mono text-xs uppercase tracking-tight">Experience:</span>
                        <span className="font-semibold">{app.experience_years || 0} years</span>
                      </div>

                      {/* Specialties */}
                      {app.specialties && app.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {app.specialties.map((specialty, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] font-mono uppercase tracking-tight bg-primary/5">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Credentials */}
                      <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                        <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                          <Briefcase className="w-3 h-3" /> Technical Audit
                        </p>
                        <p className="text-sm leading-relaxed mb-4">{app.credentials}</p>

                        {/* Links & Files */}
                        <div className="space-y-3 pt-3 border-t border-border/30">
                          {app.metadata && (typeof app.metadata === 'object') && (
                            <div className="flex flex-wrap gap-4">
                              {(app.metadata as any).linkedin && (
                                <a
                                  href={(app.metadata as any).linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-tighter text-primary hover:underline"
                                >
                                  <Linkedin className="w-3 h-3" /> Linkedin
                                </a>
                              )}
                              {(app.metadata as any).portfolio && (
                                <a
                                  href={(app.metadata as any).portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-tighter text-primary hover:underline"
                                >
                                  <Globe className="w-3 h-3" /> Portfolio
                                </a>
                              )}
                            </div>
                          )}

                          {app.metadata && (typeof app.metadata === 'object') && (app.metadata as any).file_attachments && (
                            <div className="space-y-1.5">
                              <p className="text-[9px] uppercase font-mono text-muted-foreground">Certified Attachments:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {((app.metadata as any).file_attachments as string[]).map((path, i) => (
                                  <a
                                    key={i}
                                    href={`${supabase.storage.from('technician_credentials').getPublicUrl(path).data.publicUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors group"
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <FileText className="w-3 h-3 text-primary/60" />
                                      <span className="text-[9px] font-mono truncate uppercase">View Doc {i + 1}</span>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {app.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 font-mono text-xs uppercase tracking-wider h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                            onClick={() => handleApplication(app.id, 'approve')}
                            disabled={processingId === app.id}
                          >
                            {processingId === app.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <BadgeCheck className="w-4 h-4 mr-2" />
                                Verified Approval
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 font-mono text-xs uppercase tracking-wider h-10"
                            onClick={() => handleApplication(app.id, 'reject')}
                            disabled={processingId === app.id}
                          >
                            {processingId === app.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Reviewed info */}
                      {app.reviewed_at && (
                        <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                          <Calendar className="w-3 h-3" />
                          Reviewed {formatDistanceToNow(new Date(app.reviewed_at), { addSuffix: true })}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
