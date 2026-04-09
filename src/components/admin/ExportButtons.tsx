import { usePDF } from 'react-to-pdf';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportButtonsProps {
  targetRef: React.RefObject<HTMLElement>;
  filename: string;
  title?: string;
}

export function ExportButtons({ targetRef, filename, title = 'Exporter en PDF' }: ExportButtonsProps) {
  const { toPDF, targetRef: pdfTargetRef } = usePDF({
    filename,
    page: {
      margin: 20,
      format: 'a4',
      orientation: 'landscape',
    },
  });

  // Use the provided ref or the internal one
  const ref = targetRef || pdfTargetRef;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toPDF()}
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      {title}
    </Button>
  );
}