import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: Error | null;
  retry?: () => void;
}

export function ErrorMessage({ error, retry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-destructive font-medium mb-2">
        Erreur de chargement
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        {error?.message || "Une erreur est survenue"}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}