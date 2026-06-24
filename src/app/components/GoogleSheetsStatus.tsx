import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Cloud } from 'lucide-react';
import GoogleSheetsService from '../../lib/google-sheets.service';
import { toast } from 'sonner';

interface GoogleSheetsStatusProps {
  compact?: boolean;
}

export function GoogleSheetsStatus({ compact = false }: GoogleSheetsStatusProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [config, setConfig] = useState(GoogleSheetsService.getConfig());

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    const connected = await GoogleSheetsService.checkConnection();
    setIsConnected(connected);
    setConfig(GoogleSheetsService.getConfig());
    setIsChecking(false);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isChecking ? (
          <Badge variant="outline" className="gap-1">
            <RefreshCw className="size-3 animate-spin" />
            Checking...
          </Badge>
        ) : isConnected ? (
          <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
            <CheckCircle className="size-3" />
            Google Sheets Connected
          </Badge>
        ) : config.isConfigured ? (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" />
            Connection Error
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Database className="size-3" />
            Local Mode
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="size-5" />
          Status Google Sheets API
        </CardTitle>
        <CardDescription>
          Status koneksi dengan Google Apps Script backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status Koneksi:</span>
          {isChecking ? (
            <Badge variant="outline" className="gap-2">
              <RefreshCw className="size-3 animate-spin" />
              Checking...
            </Badge>
          ) : isConnected ? (
            <Badge variant="default" className="gap-2 bg-green-500 hover:bg-green-600">
              <CheckCircle className="size-4" />
              Connected
            </Badge>
          ) : config.isConfigured ? (
            <Badge variant="destructive" className="gap-2">
              <XCircle className="size-4" />
              Error
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-2">
              <AlertCircle className="size-4" />
              Not Configured
            </Badge>
          )}
        </div>

        {/* Configuration Status */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>API URL:</span>
            <span className={config.hasUrl ? 'text-green-600' : 'text-red-600'}>
              {config.hasUrl ? '✓ Configured' : '✗ Missing'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>API Key:</span>
            <span className={config.hasKey ? 'text-green-600' : 'text-red-600'}>
              {config.hasKey ? '✓ Configured' : '✗ Missing'}
            </span>
          </div>
        </div>

        {/* Alert Messages */}
        {!config.isConfigured && (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>API Belum Dikonfigurasi</AlertTitle>
            <AlertDescription className="text-xs">
              Aplikasi berjalan dalam mode lokal. Data tidak tersinkronisasi dengan Google Sheets.
              <br />
              <br />
              <strong>Setup Google Sheets API:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Buat file <code className="bg-gray-100 px-1 rounded">.env</code> di root project</li>
                <li>Tambahkan <code className="bg-gray-100 px-1 rounded">VITE_API_URL</code></li>
                <li>Tambahkan <code className="bg-gray-100 px-1 rounded">VITE_API_KEY</code></li>
                <li>Restart dev server</li>
              </ol>
              <br />
              Lihat <strong>GOOGLE_SHEETS_API_SETUP.md</strong> untuk panduan lengkap.
            </AlertDescription>
          </Alert>
        )}

        {config.isConfigured && !isConnected && !isChecking && (
          <Alert variant="destructive">
            <XCircle className="size-4" />
            <AlertTitle>Koneksi Gagal</AlertTitle>
            <AlertDescription className="text-xs">
              API sudah dikonfigurasi tapi koneksi gagal.
              <br />
              <br />
              <strong>Troubleshooting:</strong>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Pastikan Google Apps Script sudah di-deploy</li>
                <li>Check API_URL dan API_KEY sama dengan di Apps Script</li>
                <li>Test API di browser: [URL]?action=getServiceUsers&apiKey=[KEY]</li>
                <li>Check browser console untuk error details</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {isConnected && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="size-4 text-green-600" />
            <AlertTitle className="text-green-900">Terhubung ke Google Sheets!</AlertTitle>
            <AlertDescription className="text-xs text-green-800">
              Data akan otomatis tersinkronisasi dengan Google Sheets dan Google Drive.
              <br />
              <br />
              <strong>Fitur yang aktif:</strong>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>✓ Auto-save ke Google Sheets</li>
                <li>✓ Upload dokumen ke Google Drive</li>
                <li>✓ Real-time notifications</li>
                <li>✓ Activity logs</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={isChecking}
            className="gap-2"
          >
            <RefreshCw className={`size-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Refresh Status'}
          </Button>

          {config.isConfigured && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = `${config.apiUrl}?action=getServiceUsers&apiKey=${config.apiKey}`;
                window.open(url, '_blank');
              }}
              className="gap-2"
            >
              <Database className="size-4" />
              Test API
            </Button>
          )}
        </div>

        {/* Configuration Details (for debugging) */}
        {config.isConfigured && (
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
              Show Configuration
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded border space-y-1 font-mono">
              <div>
                <strong>API URL:</strong>
                <br />
                <span className="text-gray-600 break-all">{config.apiUrl || 'Not set'}</span>
              </div>
              <div>
                <strong>API Key:</strong>
                <br />
                <span className="text-gray-600">
                  {config.apiKey ? '••••••••' + config.apiKey.slice(-4) : 'Not set'}
                </span>
              </div>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

export default GoogleSheetsStatus;
