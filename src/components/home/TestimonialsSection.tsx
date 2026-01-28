import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'DIY Enthusiast',
    avatar: null,
    rating: 5,
    quote: 'Fixed my iPhone screen in under an hour. The step-by-step guidance made it feel like having a pro at my side.',
  },
  {
    name: 'James K.',
    role: 'Small Business Owner',
    avatar: null,
    rating: 5,
    quote: 'Saved hundreds on laptop repairs. The AI diagnosis was spot-on and the parts sourcing feature is a game-changer.',
  },
  {
    name: 'Maria L.',
    role: 'Tech Hobbyist',
    avatar: null,
    rating: 5,
    quote: 'The community-verified fixes give me confidence. Pro mode\'s detailed teardowns are worth every penny.',
  },
];

export function TestimonialsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 text-center">
        Trusted by the Community
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <Card className="h-full border-border/50 shadow-none bg-muted/20">
              <CardContent className="p-5 flex flex-col h-full">
                <Quote className="w-5 h-5 text-primary/20 mb-4" />
                <p className="text-sm leading-relaxed text-foreground/80 flex-1 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 border border-border/50">
                    <AvatarImage src={testimonial.avatar || undefined} />
                    <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-mono font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-foreground truncate uppercase tracking-tight">{testimonial.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">{testimonial.role}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
