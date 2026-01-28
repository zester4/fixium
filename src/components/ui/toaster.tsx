import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { AlertCircle, CheckCircle2, ShieldAlert, XCircle, Info } from "lucide-react";

const getIcon = (variant: string | null | undefined) => {
  switch (variant) {
    case 'destructive': return <XCircle className="w-5 h-5 text-destructive" />;
    case 'success': return <CheckCircle2 className="w-5 h-5 text-success" />;
    case 'caution': return <ShieldAlert className="w-5 h-5 text-caution" />;
    default: return <Info className="w-5 h-5 text-primary" />;
  }
};

const getAccentColor = (variant: string | null | undefined) => {
  switch (variant) {
    case 'destructive': return 'bg-destructive';
    case 'success': return 'bg-success';
    case 'caution': return 'bg-caution';
    default: return 'bg-primary';
  }
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="overflow-hidden">
            {/* Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getAccentColor(variant)} opacity-80`} />

            <div className="flex gap-4">
              <div className="mt-0.5 shrink-0 opacity-80">
                {getIcon(variant)}
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">{title}</ToastTitle>}
                {description && <ToastDescription className="text-sm font-medium leading-relaxed">{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose className="opacity-40 hover:opacity-100 transition-opacity" />
          </Toast>
        );
      })}
      <ToastViewport className="p-6 gap-3" />
    </ToastProvider>
  );
}
