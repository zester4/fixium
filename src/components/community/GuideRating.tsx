import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GuideRatingProps {
  guideId: string;
  currentRating?: number;
  currentReview?: string;
  onRatingSubmit?: () => void;
}

export function GuideRating({ guideId, currentRating, currentReview, onRatingSubmit }: GuideRatingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(currentReview || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('guide_ratings')
        .upsert({
          guide_id: guideId,
          user_id: user.id,
          rating,
          review: review.trim() || null,
        }, {
          onConflict: 'guide_id,user_id',
        });

      if (error) throw error;

      toast({
        title: 'Rating submitted',
        description: 'Thank you for your feedback!',
      });
      
      onRatingSubmit?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Sign in to rate this guide</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Star rating */}
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => {
              setRating(star);
              if (!showReviewInput) setShowReviewInput(true);
            }}
            className="p-1 tap-target"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Rating label */}
      {rating > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </motion.p>
      )}

      {/* Review input */}
      {showReviewInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <Textarea
            placeholder="Share your experience with this guide (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Submit Rating'
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
