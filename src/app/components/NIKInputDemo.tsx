import { useState } from 'react';
import { NIKInput } from './NIKInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  validateNIKFormat, 
  formatNIKDisplay, 
  maskNIK, 
  getNIKInfo,
  cleanNIK 
} from '../utils/nikValidator';
import { CheckCircle, XCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Demo component untuk menunjukkan penggunaan NIKInput
 * Untuk development/testing purposes
 */
export function NIKInputDemo() {
  const [nik, setNik] = useState('');
  const [showMasked, setShowMasked] = useState(false);

  const validation = nik ? validateNIKFormat(cleanNIK(nik)) : null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin ke clipboard`);
  };

  const testCases = [
    { label: 'NIK Laki-laki Valid', value: '3174012508900001', expected: '✅ Valid' },
    { label: 'NIK Perempuan Valid', value: '3174016508900001', expected: '✅ Valid' },
    { label: 'NIK Pendek', value: '317401250890', expected: '❌ Harus 16 digit' },
    { label: 'Tanggal Invalid', value: '3174013508900001', expected: '❌ Tanggal 35' },
    { label: 'Bulan Invalid', value: '3174012090900001', expected: '❌ Bulan 20' },
    { label: '30 Februari', value: '3174013002900001', expected: '❌ Tanggal invalid' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          NIK Input Component Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Validasi NIK (Nomor Induk Kependudukan) dengan ekstraksi data otomatis
        </p>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="test">Test Cases</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
        </TabsList>

        {/* Live Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input NIK</CardTitle>
              <CardDescription>
                Coba masukkan NIK untuk melihat validasi real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <NIKInput
                value={nik}
                onChange={setNik}
                label="NIK (Nomor Induk Kependudukan)"
                placeholder="Contoh: 3174012508900001"
                required
                showValidation
                showDetails
                autoFormat
              />

              {nik && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Output Values:
                  </h3>

                  <div className="grid gap-3">
                    {/* Raw Value */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Raw Value</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">{nik}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(nik, 'Raw value')}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>

                    {/* Cleaned Value */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Cleaned (for DB)</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">{cleanNIK(nik)}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(cleanNIK(nik), 'Cleaned value')}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>

                    {/* Formatted Value */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Formatted Display</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">{formatNIKDisplay(cleanNIK(nik))}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(formatNIKDisplay(cleanNIK(nik)), 'Formatted value')}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>

                    {/* Masked Value */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          Masked (Privacy)
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowMasked(!showMasked)}
                            className="h-auto p-0"
                          >
                            {showMasked ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                          </Button>
                        </p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">
                          {showMasked ? cleanNIK(nik) : maskNIK(cleanNIK(nik))}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(maskNIK(cleanNIK(nik)), 'Masked value')}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>

                    {/* Info String */}
                    {validation?.isValid && (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Info String</p>
                          <p className="text-sm text-gray-900 dark:text-white">{getNIKInfo(cleanNIK(nik))}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(getNIKInfo(cleanNIK(nik)), 'Info string')}
                        >
                          <Copy className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Cases Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
              <CardDescription>
                Klik untuk mencoba berbagai kasus validasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {testCases.map((testCase, index) => {
                const testValidation = validateNIKFormat(testCase.value);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setNik(testCase.value)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">{testCase.label}</p>
                        <Badge variant={testValidation.isValid ? 'default' : 'destructive'}>
                          {testValidation.isValid ? (
                            <><CheckCircle className="size-3 mr-1" /> Valid</>
                          ) : (
                            <><XCircle className="size-3 mr-1" /> Invalid</>
                          )}
                        </Badge>
                      </div>
                      <p className="font-mono text-sm text-gray-600 dark:text-gray-300">
                        {formatNIKDisplay(testCase.value)}
                      </p>
                      {!testValidation.isValid && testValidation.error && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {testValidation.error}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Expected:</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {testCase.expected}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilities Tab */}
        <TabsContent value="utilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utility Functions</CardTitle>
              <CardDescription>
                Functions yang tersedia di nikValidator.ts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    validateNIKFormat(nik: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Validasi format NIK lengkap dengan ekstraksi data (jenis kelamin, tanggal lahir, dll)
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    formatNIKDisplay(nik: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Format NIK dengan dots: XX.XXXX.XXXXXX.XXXX
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    cleanNIK(nik: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Hapus semua karakter non-digit dari NIK
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    maskNIK(nik: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Mask NIK untuk privacy: 317401******0001
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    getNIKInfo(nik: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Get ringkasan info: "Laki-laki • Lahir: 25/08/1990"
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    validateNIKFromOCR(ocrText: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Ekstrak dan validasi NIK dari hasil OCR dengan confidence level
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    autoFormatNIK(value: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Auto-format NIK saat user mengetik (real-time)
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    compareNIK(nik1: string, nik2: string)
                  </code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Bandingkan dua NIK (toleran terhadap format berbeda)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Reference */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <CardHeader>
          <CardTitle className="text-lg">📋 Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>NIK Format:</strong> 16 digit angka
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Struktur:</strong> Kode Wilayah (6) + Tanggal Lahir (6) + Nomor Urut (4)
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Jenis Kelamin:</strong> Tanggal lahir +40 untuk perempuan
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Contoh Laki-laki:</strong> 31.7401.<strong>25</strong>0890.0001 (lahir tanggal 25)
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Contoh Perempuan:</strong> 31.7401.<strong>65</strong>0890.0001 (lahir tanggal 25, +40 = 65)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
