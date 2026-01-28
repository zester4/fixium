import { motion } from 'framer-motion';
import {
  Package,
  Wrench,
  ExternalLink,
  Check,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Part, Tool } from '@/types/repair';

interface PartsToolsSheetProps {
  parts: Part[];
  tools: Tool[];
}

export function PartsToolsSheet({ parts, tools }: PartsToolsSheetProps) {
  const totalCostMin = parts.reduce((sum, p) => sum + p.estimatedCost.min, 0);
  const totalCostMax = parts.reduce((sum, p) => sum + p.estimatedCost.max, 0);

  const difficultyColors = {
    beginner: 'bg-success/10 text-success',
    intermediate: 'bg-caution/10 text-caution',
    advanced: 'bg-warning/10 text-warning',
  };

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="pb-4">
        <SheetTitle className="font-mono text-lg">Parts & Tools</SheetTitle>
      </SheetHeader>

      <Tabs defaultValue="parts" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parts" className="gap-2">
            <Package className="w-4 h-4" />
            Parts ({parts.length})
          </TabsTrigger>
          <TabsTrigger value="tools" className="gap-2">
            <Wrench className="w-4 h-4" />
            Tools ({tools.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parts" className="flex-1 overflow-auto mt-4 space-y-3">
          {/* Cost summary */}
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              Estimated Total Cost
            </div>
            <p className="text-xl font-semibold text-foreground">
              ${totalCostMin} – ${totalCostMax}
            </p>
          </div>

          {/* Parts list */}
          {parts.map((part, index) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{part.name}</p>
                  {part.partNumber && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {part.partNumber}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {part.isRequired && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                  <Badge className={`text-xs capitalize ${difficultyColors[part.difficulty]}`}>
                    {part.difficulty}
                  </Badge>
                </div>
              </div>

              <p className="text-sm font-medium text-foreground mb-3">
                ${part.estimatedCost.min} – ${part.estimatedCost.max}
              </p>

              {/* Suppliers */}
              <div className="space-y-2">
                {part.suppliers.map((supplier, i) => (
                  <a
                    key={i}
                    href={supplier.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <span className="text-sm text-foreground">{supplier.name}</span>
                    <div className="flex items-center gap-2 text-sm">
                      {supplier.price && (
                        <span className="text-muted-foreground">${supplier.price}</span>
                      )}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="tools" className="flex-1 overflow-auto mt-4 space-y-2">
          {/* Required tools */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground mb-3">
              Required Tools
            </h3>
            <div className="space-y-2">
              {tools.filter(t => t.isRequired).map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{tool.name}</p>
                    {tool.substitutes && tool.substitutes.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Alt: {tool.substitutes.join(', ')}
                      </p>
                    )}
                  </div>
                  <Check className="w-4 h-4 text-success" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Optional tools */}
          {tools.some(t => !t.isRequired) && (
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground mb-3">
                Recommended
              </h3>
              <div className="space-y-2">
                {tools.filter(t => !t.isRequired).map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
