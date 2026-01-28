import { motion } from 'framer-motion';
import { Camera, Clock, CheckCircle, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TimelinePhoto {
  id: string;
  type: 'before' | 'during' | 'after';
  dataUrl: string;
  timestamp: number;
  stepIndex?: number;
  caption?: string;
}

interface RepairTimelineProps {
  photos: TimelinePhoto[];
  onAddPhoto?: (type: 'before' | 'during' | 'after') => void;
  isEditable?: boolean;
}

export function RepairTimeline({ photos, onAddPhoto, isEditable = false }: RepairTimelineProps) {
  const sortedPhotos = [...photos].sort((a, b) => a.timestamp - b.timestamp);
  
  const beforePhotos = sortedPhotos.filter(p => p.type === 'before');
  const duringPhotos = sortedPhotos.filter(p => p.type === 'during');
  const afterPhotos = sortedPhotos.filter(p => p.type === 'after');

  const TimelineSection = ({ 
    title, 
    type, 
    items, 
    icon: Icon 
  }: { 
    title: string; 
    type: 'before' | 'during' | 'after'; 
    items: TimelinePhoto[]; 
    icon: React.ElementType;
  }) => (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center z-10
          ${type === 'before' ? 'bg-muted text-muted-foreground' : ''}
          ${type === 'during' ? 'bg-primary/20 text-primary' : ''}
          ${type === 'after' ? 'bg-success/20 text-success' : ''}
        `}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-medium text-foreground capitalize">{title}</h3>
      </div>
      
      {/* Photos */}
      <div className="ml-11 space-y-3 pb-6">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {items.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={photo.dataUrl}
                  alt={`${type} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white/80">
                    {formatDistanceToNow(photo.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          isEditable && (
            <button
              onClick={() => onAddPhoto?.(type)}
              className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm">Add {type} photo</span>
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-0">
      <TimelineSection title="Before" type="before" items={beforePhotos} icon={Circle} />
      <TimelineSection title="During Repair" type="during" items={duringPhotos} icon={Clock} />
      <TimelineSection title="After" type="after" items={afterPhotos} icon={CheckCircle} />
    </div>
  );
}
