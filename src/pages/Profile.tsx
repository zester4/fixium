import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Crown,
  Shield,
  Settings,
  LogOut,
  Camera,
  Award,
  History,
  Star,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRepairHistory } from '@/hooks/useRepairHistory';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function Profile() {
  const { user, profile, isPro, isVerifiedTechnician, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { history } = useRepairHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GlobalHeader />

      <main className="flex-1 px-4 py-6 space-y-6 pb-24">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="displayName" className="text-xs">Display Name</Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-xs">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-semibold text-lg text-foreground">
                        {profile?.display_name || 'User'}
                      </h2>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {profile?.bio && (
                        <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {isPro && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                        {isVerifiedTechnician && (
                          <Badge variant="secondary">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified Technician
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="font-mono text-2xl font-bold text-foreground">{history.length}</p>
              <p className="text-xs text-muted-foreground">Repairs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="font-mono text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Guides</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="font-mono text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pro Upgrade */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Upgrade to Pro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Detailed teardown sequences</li>
                  <li>• Priority AI analysis</li>
                  <li>• Parts sourcing links</li>
                  <li>• Offline PDF export</li>
                </ul>
                <Button size="sm" className="w-full" onClick={() => navigate('/pricing')}>
                  View Plans
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Technician Application */}
        {!isVerifiedTechnician && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-primary" />
                  Become a Technician
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit verified repair guides and help the community.
                </p>
                <Button size="sm" variant="outline" onClick={() => navigate('/technician-apply')}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Menu Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <button
            onClick={() => navigate('/my-repairs')}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
          >
            <History className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium">My Repairs</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/my-guides')}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
          >
            <Star className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium">My Guides</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>
      </main>

      {/* Sign Out Button */}
      <div className="sticky bottom-0 p-4 pb-safe-bottom bg-background border-t border-border">
        <Button
          variant="outline"
          size="lg"
          className="w-full tap-target text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
