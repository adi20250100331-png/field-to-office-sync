import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

interface InfectiousDiseaseAlertProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'checklist';
}

export function InfectiousDiseaseAlert({ 
  open, 
  onConfirm, 
  onCancel,
  variant = 'warning' 
}: InfectiousDiseaseAlertProps) {
  
  if (variant === 'checklist') {
    return (
      <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
        <AlertDialogContent className="max-w-lg bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/30 dark:via-gray-900 dark:to-amber-950/30 border-2 border-amber-400 dark:border-amber-600">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Shield className="size-6 text-amber-600 dark:text-amber-400" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                KONFIRMASI PROSEDUR PENYAKIT MENULAR
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base text-gray-700 dark:text-gray-300 space-y-4 pt-2">
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                Mohon konfirmasi bahwa Anda telah menjalankan prosedur berikut:
              </p>
              
              <div className="space-y-3 bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900 dark:text-gray-100">
                    Jenazah telah dikemas menggunakan <strong>kargo khusus</strong>
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900 dark:text-gray-100">
                    Peti <strong className="text-red-600 dark:text-red-400">TIDAK AKAN DIBUKA</strong> hingga penguburan selesai
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900 dark:text-gray-100">
                    Mengikuti <strong>protokol kesehatan</strong> yang berlaku
                  </p>
                </div>
              </div>

              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg p-3 mt-4">
                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                  ⚠️ Persetujuan Anda akan tercatat dengan timestamp untuk akuntabilitas
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
            >
              Batal
            </button>
            <AlertDialogAction
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg"
            >
              LANJUTKAN PENGAJUAN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Warning variant (default)
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="max-w-lg bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/30 dark:via-gray-900 dark:to-orange-950/30 border-2 border-red-500 dark:border-red-600">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-14 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center animate-pulse">
              <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-red-900 dark:text-red-100">
              ⚠️ PERINGATAN PROTOKOL KESEHATAN
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-gray-700 dark:text-gray-300 space-y-4 pt-2">
            <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-700 rounded-xl p-4">
              <p className="text-red-900 dark:text-red-100 font-semibold mb-3">
                Anda telah memilih kategori <span className="font-bold underline">Jenazah Penyakit Menular</span>.
              </p>
              
              <div className="space-y-2 text-sm">
                <p className="text-red-800 dark:text-red-200">
                  Berdasarkan protokol kesehatan:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      Peti <strong className="text-red-700 dark:text-red-300 bg-red-200 dark:bg-red-900/50 px-2 py-0.5 rounded">WAJIB</strong> menggunakan kargo khusus
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      Peti <strong className="text-red-700 dark:text-red-300 bg-red-200 dark:bg-red-900/50 px-2 py-0.5 rounded font-extrabold">TIDAK BOLEH DIBUKA</strong> dalam kondisi apa pun
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      Protokol berlaku hingga proses <strong>penguburan selesai</strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-3">
              <p className="text-amber-900 dark:text-amber-200 font-semibold text-sm">
                Apakah Anda memahami dan akan mematuhi protokol ini?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
          >
            Batal
          </button>
          <AlertDialogAction
            onClick={onConfirm}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg"
          >
            SAYA PAHAM & PATUH
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
