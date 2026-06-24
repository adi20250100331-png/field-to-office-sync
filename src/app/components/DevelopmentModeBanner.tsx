import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Info, X, ExternalLink } from 'lucide-react';
import { isApiConfigured } from '../../lib/api';

export function DevelopmentModeBanner() {
  const [isVisible, setIsVisible] = useState(!isApiConfigured());
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('dev-banner-dismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('dev-banner-dismissed', 'true');
  };

  const handleLearnMore = () => {
    window.open('/PANDUAN_CEPAT_GOOGLE_SHEETS.md', '_blank');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <Alert className="border-blue-200 bg-blue-50 relative">
      <Info className="size-4 text-blue-600" />
      <AlertTitle className="text-blue-900 pr-8">Mode Development - Data Lokal</AlertTitle>
      <AlertDescription className="text-sm text-blue-800">
        Aplikasi berjalan dalam mode development. Data tersimpan di browser localStorage (tidak tersinkronisasi ke cloud).
        <br />
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={handleLearnMore}
          >
            <ExternalLink className="size-3 mr-1" />
            Setup Google Sheets (5 menit)
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7 text-blue-600 hover:bg-blue-100"
            onClick={handleDismiss}
          >
            Mengerti, jangan tampilkan lagi
          </Button>
        </div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-6 text-blue-600 hover:bg-blue-100"
        onClick={handleDismiss}
      >
        <X className="size-4" />
      </Button>
    </Alert>
  );
}

export default DevelopmentModeBanner;
