import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { useData, Document } from '../context/DataContext';
import { validateNIKFromOCR, validateNIKFormat } from '../utils/nikValidator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { 
  ArrowLeft, 
  Camera, 
  FileText, 
  Upload, 
  CheckCircle,
  X,
  Scan,
  RotateCw,
  Sparkles,
  Clock,
  MapPin,
  ClipboardCheck,
  XCircle,
  Check,
  AlertTriangle,
  Shield,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';
import { InfectiousDiseaseAlert } from '../components/InfectiousDiseaseAlert';

type FormStep = 'waktu-tempat' | 'dokumen' | 'fisik-peti' | 'review';

export function DataCollectionForm() {
  const navigate = useNavigate();
  const { addServiceUser } = useData();
  const [currentStep, setCurrentStep] = useState<FormStep>('waktu-tempat');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [currentDocType, setCurrentDocType] = useState<Document['type']>('KTP');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data - Bagian A: Waktu dan Tempat
  const [waktuTempat, setWaktuTempat] = useState({
    hari: '',
    tanggal: '',
    jam: '',
    lokasi: '',
  });

  // Bagian B: Kelengkapan Dokumen
  const [kelengkapanDokumen, setKelengkapanDokumen] = useState({
    suratKematian: false,
    suratPengawetan: false,
    suratBebasPenyakit: false,
    suratPemetian: false,
    beritaAcaraPembongkaran: false,
    suratKepolisian: false,
    identitasJenazah: false,
    suratKedutaan: false,
  });

  // Jenazah Penyakit Menular
  const [jenazahPenyakitMenular, setJenazahPenyakitMenular] = useState(false);
  const [showInfectiousAlert, setShowInfectiousAlert] = useState(false);
  const [infectiousProtocolConfirmed, setInfectiousProtocolConfirmed] = useState(false);
  const [infectiousProtocolTimestamp, setInfectiousProtocolTimestamp] = useState<string | null>(null);
  
  // Loading state untuk submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bagian C: Pemeriksaan Fisik Peti
  const [pemeriksaanFisik, setPemeriksaanFisik] = useState({
    bahanKayu: false,
    wrapping: false,
    adsorben: false,
    lapisanSeng: false,
    segelRapat: false,
    pelindungSudut: false,
    berbau: false,
    rembesanCairan: false,
    diletakkanTerpisah: false,
  });

  const [kesimpulan, setKesimpulan] = useState<'memenuhi' | 'tidak-memenuhi' | ''>('');
  
  const [namaPengantar, setNamaPengantar] = useState('');
  const [namaPemeriksa, setNamaPemeriksa] = useState('');

  const [documents, setDocuments] = useState<Document[]>([]);

  const handleWaktuTempatChange = (field: string, value: string) => {
    setWaktuTempat(prev => ({ ...prev, [field]: value }));
  };

  const toggleDokumen = (field: keyof typeof kelengkapanDokumen) => {
    setKelengkapanDokumen(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInfectiousDiseaseToggle = (checked: boolean) => {
    if (checked) {
      // Jika dicentang, tampilkan peringatan
      setShowInfectiousAlert(true);
    } else {
      // Jika di-uncheck, reset semua
      setJenazahPenyakitMenular(false);
      setInfectiousProtocolConfirmed(false);
      setInfectiousProtocolTimestamp(null);
      toast.info('Protokol penyakit menular dibatalkan');
    }
  };

  const handleInfectiousProtocolConfirm = () => {
    const timestamp = new Date().toISOString();
    setJenazahPenyakitMenular(true);
    setInfectiousProtocolConfirmed(true);
    setInfectiousProtocolTimestamp(timestamp);
    setShowInfectiousAlert(false);
    
    toast.success('Protokol Dikonfirmasi', {
      description: `Persetujuan tercatat pada ${new Date(timestamp).toLocaleString('id-ID')}`
    });
  };

  const handleInfectiousProtocolCancel = () => {
    setShowInfectiousAlert(false);
    toast.info('Protokol dibatalkan');
  };

  const toggleFisik = (field: keyof typeof pemeriksaanFisik) => {
    setPemeriksaanFisik(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCameraReady = () => {
    setCameraReady(true);
    setCameraError('');
    console.log('Camera ready!');
  };

  const handleCameraError = (error: string | DOMException) => {
    // Only log to console, don't show multiple toasts
    console.warn('Camera error (handled):', error);
    setCameraReady(false);
    
    // Check if it's a permission error
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      setPermissionDenied(true);
      setCameraError('Akses kamera ditolak. Anda perlu memberikan izin akses kamera untuk menggunakan fitur scan.');
      // Don't show toast here, will be shown in requestCameraPermission
    } else if (error instanceof DOMException && error.name === 'NotFoundError') {
      setCameraError('Kamera tidak ditemukan. Pastikan perangkat Anda memiliki kamera.');
      toast.error('Kamera Tidak Ditemukan', {
        description: 'Tidak ada kamera yang terdeteksi di perangkat ini.'
      });
    } else {
      setCameraError(typeof error === 'string' ? error : 'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
    }
  };

  const enableCamera = async () => {
    // Reset all states
    setCameraEnabled(false);
    setPermissionDenied(false);
    setCameraError('');
    setCameraReady(false);
    
    // Small delay to ensure state is reset
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Enable camera
    setCameraEnabled(true);
  };
  
  const disableCamera = () => {
    setCameraEnabled(false);
    setCameraError('');
    setPermissionDenied(false);
    setCameraReady(false);
  };

  const requestCameraPermission = async () => {
    try {
      setPermissionDenied(false);
      setCameraError('');
      setCameraReady(false);
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera. Gunakan browser modern seperti Chrome atau Firefox.');
      }
      
      // Request permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Stop the stream immediately, Webcam component will handle it
      stream.getTracks().forEach(track => track.stop());
      
      toast.success('Izin Kamera Diberikan', {
        description: 'Kamera siap digunakan untuk scan dokumen.'
      });
      
      // Enable camera
      setCameraEnabled(true);
      
    } catch (err) {
      console.warn('Permission request error:', err);
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setPermissionDenied(true);
          setCameraError('Akses kamera ditolak. Silakan izinkan akses kamera untuk melanjutkan.');
          toast.error('Izin Kamera Ditolak', {
            description: 'Klik ikon kamera 🎥 di address bar dan pilih "Allow" untuk memberikan izin.'
          });
        } else if (err.name === 'NotFoundError') {
          setCameraError('Kamera tidak ditemukan. Pastikan perangkat Anda memiliki kamera.');
          toast.error('Kamera Tidak Ditemukan', {
            description: 'Tidak ada kamera yang terdeteksi di perangkat ini.'
          });
        } else if (err.name === 'NotReadableError') {
          setCameraError('Kamera sedang digunakan oleh aplikasi lain.');
          toast.error('Kamera Sedang Digunakan', {
            description: 'Tutup aplikasi lain yang menggunakan kamera.'
          });
        } else {
          setCameraError(`Error kamera: ${err.message}`);
          toast.error('Error Kamera', {
            description: err.message
          });
        }
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Tidak dapat mengakses kamera';
        setCameraError(errorMsg);
        toast.error('Error Kamera', {
          description: errorMsg
        });
      }
    }
  };

  const captureDocument = () => {
    if (!webcamRef.current) {
      toast.error('Kamera belum siap', {
        description: 'Mohon tunggu kamera aktif terlebih dahulu'
      });
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error('Gagal mengambil foto', {
        description: 'Tidak dapat mengambil foto dari kamera'
      });
      return;
    }

    setIsProcessing(true);
    toast.info('Memproses OCR...', {
      description: 'Mohon tunggu, sedang membaca teks dari dokumen'
    });
    
    // Real OCR processing with Tesseract
    Tesseract.recognize(
      imageSrc,
      'ind', // Indonesian language
      { 
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    ).then(({ data: { text } }) => {
      // Try to extract data from OCR text
      const ocrData: any = {};
      
      // Try to find NIK using enhanced validation
      const nikResult = validateNIKFromOCR(text);
      if (nikResult.nik) {
        ocrData.nik = nikResult.nik;
        
        // Validate the NIK to extract additional info
        const validation = validateNIKFormat(nikResult.nik);
        if (validation.isValid && validation.details) {
          // Add extracted birth date from NIK
          ocrData.tanggalLahir = validation.details.tanggalLahir;
          ocrData.jenisKelamin = validation.details.jenisKelamin;
        }
      }
      
      // Try to find name (usually after "Nama" keyword in KTP)
      const namaMatch = text.match(/(?:Nama|NAMA)[:\s]*([A-Z\s]+)/i);
      if (namaMatch && namaMatch[1]) {
        ocrData.nama = namaMatch[1].trim();
      }
      
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        type: currentDocType,
        imageUrl: imageSrc,
        uploadedAt: new Date(),
        ocrText: text,
        ocrData: Object.keys(ocrData).length > 0 ? ocrData : undefined,
      };

      setDocuments(prev => [...prev, newDoc]);
      setShowCamera(false);
      setCameraEnabled(false);
      setCameraReady(false);
      setCameraError('');
      setIsProcessing(false);
      
      // Enhanced toast message with validation status
      const nikValidation = nikResult.nik ? validateNIKFormat(nikResult.nik) : null;
      toast.success(`Dokumen ${currentDocType} berhasil dipindai!`, {
        description: nikResult.nik 
          ? `NIK terdeteksi: ${nikResult.nik}${nikValidation?.isValid ? ' ✓ Valid' : ' ⚠️ Perlu verifikasi'}`
          : 'OCR selesai - NIK tidak terdeteksi'
      });
    }).catch(err => {
      console.error('OCR Error:', err);
      // Fallback: save document without OCR
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        type: currentDocType,
        imageUrl: imageSrc,
        uploadedAt: new Date(),
      };
      setDocuments(prev => [...prev, newDoc]);
      setShowCamera(false);
      setCameraEnabled(false);
      setCameraReady(false);
      setCameraError('');
      setIsProcessing(false);
      toast.warning('Dokumen tersimpan tanpa OCR', {
        description: 'Gagal membaca teks, tapi gambar sudah tersimpan'
      });
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('File tidak valid', {
        description: 'Silakan upload file gambar (JPG, PNG, dll)'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string;
      if (!imageSrc) return;

      setIsProcessing(true);
      toast.info('Memproses OCR...', {
        description: 'Mohon tunggu, sedang membaca teks dari dokumen'
      });

      // Real OCR processing with Tesseract
      Tesseract.recognize(
        imageSrc,
        'ind',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      ).then(({ data: { text } }) => {
        const ocrData: any = {};
        
        // Enhanced NIK validation for file upload
        const nikResult = validateNIKFromOCR(text);
        if (nikResult.nik) {
          ocrData.nik = nikResult.nik;
          
          // Validate and extract additional info from NIK
          const validation = validateNIKFormat(nikResult.nik);
          if (validation.isValid && validation.details) {
            ocrData.tanggalLahir = validation.details.tanggalLahir;
            ocrData.jenisKelamin = validation.details.jenisKelamin;
          }
        }
        
        // Try to find name
        const namaMatch = text.match(/(?:Nama|NAMA)[:\s]*([A-Z\s]+)/i);
        if (namaMatch && namaMatch[1]) {
          ocrData.nama = namaMatch[1].trim();
        }
        
        const newDoc: Document = {
          id: `doc-${Date.now()}`,
          type: currentDocType,
          imageUrl: imageSrc,
          uploadedAt: new Date(),
          ocrText: text,
          ocrData: Object.keys(ocrData).length > 0 ? ocrData : undefined,
        };

        setDocuments(prev => [...prev, newDoc]);
        setIsProcessing(false);
        
        // Enhanced toast message with validation status
        const nikValidation = nikResult.nik ? validateNIKFormat(nikResult.nik) : null;
        toast.success(`Dokumen ${currentDocType} berhasil dipindai!`, {
          description: nikResult.nik 
            ? `NIK terdeteksi: ${nikResult.nik}${nikValidation?.isValid ? ' ✓ Valid' : ' ⚠️ Perlu verifikasi'}`
            : 'OCR selesai - NIK tidak terdeteksi'
        });
      }).catch(err => {
        console.error('OCR Error:', err);
        const newDoc: Document = {
          id: `doc-${Date.now()}`,
          type: currentDocType,
          imageUrl: imageSrc,
          uploadedAt: new Date(),
        };
        setDocuments(prev => [...prev, newDoc]);
        setIsProcessing(false);
        toast.warning('Dokumen tersimpan tanpa OCR', {
          description: 'Gagal membaca teks, tapi gambar sudah tersimpan'
        });
      });
    };

    reader.readAsDataURL(file);
    
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Dokumen dihapus');
  };

  const handleSubmit = async () => {
    // Validasi waktu dan tempat
    if (!waktuTempat.hari || !waktuTempat.tanggal || !waktuTempat.jam || !waktuTempat.lokasi) {
      toast.error('Lengkapi data waktu dan tempat', {
        description: 'Semua field waktu dan tempat harus diisi'
      });
      return;
    }

    // Validasi minimal satu dokumen
    const hasDokumen = Object.values(kelengkapanDokumen).some(val => val === true);
    if (!hasDokumen) {
      toast.error('Kelengkapan Dokumen Tidak Valid', {
        description: 'Minimal salah satu dokumen harus dilampirkan'
      });
      return;
    }

    // Validasi kesimpulan
    if (!kesimpulan) {
      toast.error('Tentukan kesimpulan pemeriksaan', {
        description: 'Pilih memenuhi syarat atau tidak memenuhi syarat'
      });
      return;
    }

    // Validasi penyakit menular - jika checked tapi belum dikonfirmasi
    if (jenazahPenyakitMenular && !infectiousProtocolConfirmed) {
      toast.error('Protokol Belum Dikonfirmasi', {
        description: 'Mohon konfirmasi protokol penyakit menular terlebih dahulu'
      });
      return;
    }

    // Validasi nama pengantar dan pemeriksa
    if (!namaPengantar || !namaPemeriksa) {
      toast.error('Data Tidak Lengkap', {
        description: 'Nama pengantar dan pemeriksa harus diisi'
      });
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    try {
      // Buat keterangan yang komprehensif
      let keterangan = `Kesimpulan: ${kesimpulan === 'memenuhi' ? 'MEMENUHI SYARAT' : 'TIDAK MEMENUHI SYARAT'}. Pengantar: ${namaPengantar}. Pemeriksa: ${namaPemeriksa}.`;
      
      // Tambahkan info penyakit menular jika ada
      if (jenazahPenyakitMenular) {
        keterangan += ` [JENAZAH PENYAKIT MENULAR - Protokol Dikonfirmasi pada ${new Date(infectiousProtocolTimestamp!).toLocaleString('id-ID')}]`;
      }

      // Buat detailed keterangan untuk riwayat
      let detailKeterangan = `📋 PEMERIKSAAN JENAZAH\n\n`;
      detailKeterangan += `📅 Waktu & Tempat:\n`;
      detailKeterangan += `- Hari: ${waktuTempat.hari}\n`;
      detailKeterangan += `- Tanggal: ${waktuTempat.tanggal}\n`;
      detailKeterangan += `- Jam: ${waktuTempat.jam} LT\n`;
      detailKeterangan += `- Lokasi: ${waktuTempat.lokasi}\n\n`;
      
      detailKeterangan += `📄 Kelengkapan Dokumen:\n`;
      if (kelengkapanDokumen.suratKematian) detailKeterangan += `✅ Surat Keterangan Kematian\n`;
      if (kelengkapanDokumen.suratPengawetan) detailKeterangan += `✅ Surat Keterangan Pengawetan\n`;
      if (kelengkapanDokumen.suratBebasPenyakit) detailKeterangan += `✅ Surat Bebas Penyakit Menular\n`;
      if (kelengkapanDokumen.suratPemetian) detailKeterangan += `✅ Surat Pemetian/Pengepakan\n`;
      if (kelengkapanDokumen.beritaAcaraPembongkaran) detailKeterangan += `✅ Berita Acara Pembongkaran Makam\n`;
      if (kelengkapanDokumen.suratKepolisian) detailKeterangan += `✅ Surat Kepolisian\n`;
      if (kelengkapanDokumen.pasporAlmarhum) detailKeterangan += `✅ Paspor Almarhum\n`;
      if (kelengkapanDokumen.dokumenTambahan) detailKeterangan += `✅ Dokumen Tambahan\n\n`;
      
      detailKeterangan += `📦 Pemeriksaan Fisik Peti:\n`;
      if (pemeriksaanFisik.bahanKayu) detailKeterangan += `✅ Bahan kayu tebal min. 2 cm\n`;
      if (pemeriksaanFisik.wrapping) detailKeterangan += `✅ Wrapping/isolasi plastik\n`;
      if (pemeriksaanFisik.sengKeling) detailKeterangan += `✅ Seng keling/paku\n`;
      if (pemeriksaanFisik.platSeng) detailKeterangan += `✅ Plat seng tebal min. 0,2 cm\n`;
      if (pemeriksaanFisik.ukuranKawat) detailKeterangan += `✅ Ukuran kawat sesuai\n`;
      if (pemeriksaanFisik.identitas) detailKeterangan += `✅ Identitas jelas di peti\n\n`;
      
      detailKeterangan += `✍️ Kesimpulan: ${kesimpulan === 'memenuhi' ? '✅ MEMENUHI SYARAT' : '❌ TIDAK MEMENUHI SYARAT'}\n`;
      detailKeterangan += `👤 Pengantar: ${namaPengantar}\n`;
      detailKeterangan += `🔍 Pemeriksa: ${namaPemeriksa}\n`;
      
      if (jenazahPenyakitMenular) {
        detailKeterangan += `\n⚠️ JENAZAH PENYAKIT MENULAR\n`;
        detailKeterangan += `Protokol dikonfirmasi: ${new Date(infectiousProtocolTimestamp!).toLocaleString('id-ID')}\n`;
      }

      const formData = {
        nama: `Pemeriksaan Jenazah - ${waktuTempat.lokasi} (${waktuTempat.tanggal})`,
        nik: '-',
        alamat: waktuTempat.lokasi,
        noTelepon: `-`,
        email: '-',
        jenisLayanan: 'Pemeriksaan dan Pengepakan Jenazah',
        keterangan: detailKeterangan,
      };

      // Simulasi delay untuk menunjukkan loading (bisa dihapus di production)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const submissionData = {
        ...formData,
        documents,
        status: 'pending' as const,
      };

      console.log('📤 Submitting data:', submissionData);

      addServiceUser(submissionData);

      toast.success('Data pemeriksaan jenazah berhasil dikirim!', {
        description: 'Data akan segera diverifikasi oleh admin kantor'
      });

      setTimeout(() => {
        navigate('/field-officer');
      }, 1500);
    } catch (error) {
      toast.error('Gagal mengirim data', {
        description: 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.'
      });
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'waktu-tempat': return 25;
      case 'dokumen': return 50;
      case 'fisik-peti': return 75;
      case 'review': return 100;
      default: return 0;
    }
  };

  // Check if step is completed
  const isStepCompleted = (step: FormStep) => {
    switch (step) {
      case 'waktu-tempat':
        return waktuTempat.hari && waktuTempat.tanggal && waktuTempat.jam && waktuTempat.lokasi;
      case 'dokumen':
        return Object.values(kelengkapanDokumen).some(val => val === true);
      case 'fisik-peti':
        return kesimpulan !== '';
      case 'review':
        return false; // Review is never "completed" until submitted
      default:
        return false;
    }
  };

  // Navigate to specific step
  const navigateToStep = (step: FormStep) => {
    const stepNames = {
      'waktu-tempat': 'Waktu & Tempat',
      'dokumen': 'Kelengkapan Dokumen',
      'fisik-peti': 'Pemeriksaan Fisik Peti',
      'review': 'Review Data'
    };
    
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show toast feedback
    toast.info(`Pindah ke: ${stepNames[step]}`, {
      description: 'Data yang sudah diisi tetap tersimpan'
    });
  };

  // Go back one step
  const goBackOneStep = () => {
    switch (currentStep) {
      case 'dokumen':
        setCurrentStep('waktu-tempat');
        break;
      case 'fisik-peti':
        setCurrentStep('dokumen');
        break;
      case 'review':
        setCurrentStep('fisik-peti');
        break;
      default:
        // If on first step, go back to dashboard
        window.history.back();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5F7] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#17A2B8] to-[#138496] text-white shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Button 
              variant="ghost" 
              onClick={goBackOneStep}
              className="text-white hover:bg-white/20 gap-1 sm:gap-2 backdrop-blur-sm text-sm sm:text-base px-2 sm:px-4"
            >
              <ArrowLeft className="size-4 sm:size-5" />
              <span className="hidden xs:inline">Kembali</span>
            </Button>
            <img src={kemenkesLogo} alt="Kemenkes" className="h-10 sm:h-12 w-auto drop-shadow-lg hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold mb-1">Formulir Pemeriksaan Jenazah</h1>
          <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3">Pemeriksaan dan Pengepakan Jenazah/Kerangka/Abu Jenazah</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-full overflow-hidden h-1.5 sm:h-2">
            <div 
              className="h-full bg-[#C4D600] transition-all duration-300 rounded-full"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Step Indicators - Now Clickable! */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-6 sm:mb-8">
          {/* Step 1: Waktu & Tempat */}
          <button
            onClick={() => navigateToStep('waktu-tempat')}
            className={`text-center transition-all duration-200 hover:scale-105 active:scale-95 relative ${
              currentStep === 'waktu-tempat' ? '' : 'opacity-50 hover:opacity-75'
            }`}
          >
            <div className={`size-10 sm:size-12 rounded-xl sm:rounded-2xl mx-auto mb-1 sm:mb-2 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg transition-all duration-200 ${
              currentStep === 'waktu-tempat' 
                ? 'bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] text-white ring-2 ring-[#17A2B8] ring-offset-2' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}>
              <Clock className="size-5 sm:size-6" />
              {isStepCompleted('waktu-tempat') && currentStep !== 'waktu-tempat' && (
                <div className="absolute -top-1 -right-1 size-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-[10px] sm:text-xs font-medium leading-tight text-gray-900 dark:text-gray-100">Waktu & Tempat</p>
          </button>

          {/* Step 2: Dokumen */}
          <button
            onClick={() => navigateToStep('dokumen')}
            className={`text-center transition-all duration-200 hover:scale-105 active:scale-95 relative ${
              currentStep === 'dokumen' ? '' : 'opacity-50 hover:opacity-75'
            }`}
          >
            <div className={`size-10 sm:size-12 rounded-xl sm:rounded-2xl mx-auto mb-1 sm:mb-2 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg transition-all duration-200 ${
              currentStep === 'dokumen' 
                ? 'bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] text-white ring-2 ring-[#17A2B8] ring-offset-2' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}>
              <FileText className="size-5 sm:size-6" />
              {isStepCompleted('dokumen') && currentStep !== 'dokumen' && (
                <div className="absolute -top-1 -right-1 size-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-gray-100">Dokumen</p>
          </button>

          {/* Step 3: Fisik Peti */}
          <button
            onClick={() => navigateToStep('fisik-peti')}
            className={`text-center transition-all duration-200 hover:scale-105 active:scale-95 relative ${
              currentStep === 'fisik-peti' ? '' : 'opacity-50 hover:opacity-75'
            }`}
          >
            <div className={`size-10 sm:size-12 rounded-xl sm:rounded-2xl mx-auto mb-1 sm:mb-2 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg transition-all duration-200 ${
              currentStep === 'fisik-peti' 
                ? 'bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] text-white ring-2 ring-[#17A2B8] ring-offset-2' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}>
              <ClipboardCheck className="size-5 sm:size-6" />
              {isStepCompleted('fisik-peti') && currentStep !== 'fisik-peti' && (
                <div className="absolute -top-1 -right-1 size-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-[10px] sm:text-xs font-medium leading-tight text-gray-900 dark:text-gray-100">Fisik Peti</p>
          </button>

          {/* Step 4: Review */}
          <button
            onClick={() => navigateToStep('review')}
            className={`text-center transition-all duration-200 hover:scale-105 active:scale-95 ${
              currentStep === 'review' ? '' : 'opacity-50 hover:opacity-75'
            }`}
          >
            <div className={`size-10 sm:size-12 rounded-xl sm:rounded-2xl mx-auto mb-1 sm:mb-2 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg transition-all duration-200 ${
              currentStep === 'review' 
                ? 'bg-gradient-to-br from-[#C4D600] to-[#D8E64D] text-gray-900 ring-2 ring-[#C4D600] ring-offset-2' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}>
              <CheckCircle className="size-5 sm:size-6" />
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-gray-100">Review</p>
          </button>
        </div>

        {/* Hint: Steps are clickable */}
        <div className="text-center mb-6 -mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <span className="inline-block">💡</span>
            <span className="hidden sm:inline">Klik pada ikon di atas untuk langsung ke tahap tertentu</span>
            <span className="sm:hidden">Klik ikon untuk pindah tahap</span>
          </p>
        </div>

        {/* Step 1: Waktu dan Tempat Pemeriksaan */}
        {currentStep === 'waktu-tempat' && (
          <Card className="border-0 shadow-xl rounded-2xl sm:rounded-3xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-[#17A2B8]/5 to-[#C4D600]/5 dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 rounded-t-2xl sm:rounded-t-3xl p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 dark:text-white">
                <Clock className="size-5 sm:size-6 text-[#17A2B8]" />
                A. Waktu dan Tempat Pemeriksaan
              </CardTitle>
              <CardDescription className="text-sm dark:text-gray-300">
                Lengkapi informasi waktu dan lokasi pemeriksaan jenazah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hari" className="text-sm">Hari *</Label>
                  <Input
                    id="hari"
                    placeholder="Senin, Selasa, ..."
                    value={waktuTempat.hari}
                    onChange={(e) => handleWaktuTempatChange('hari', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#17A2B8] focus:ring-[#17A2B8] h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal" className="text-sm">Tanggal *</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={waktuTempat.tanggal}
                    onChange={(e) => handleWaktuTempatChange('tanggal', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#17A2B8] focus:ring-[#17A2B8] h-11"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jam" className="text-sm">Jam *</Label>
                  <Input
                    id="jam"
                    type="time"
                    value={waktuTempat.jam}
                    onChange={(e) => handleWaktuTempatChange('jam', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#17A2B8] focus:ring-[#17A2B8] h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lokasi" className="text-sm">Lokasi *</Label>
                  <Input
                    id="lokasi"
                    placeholder="Nama tempat/lokasi pemeriksaan"
                    value={waktuTempat.lokasi}
                    onChange={(e) => handleWaktuTempatChange('lokasi', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#17A2B8] focus:ring-[#17A2B8] h-11"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-2"
                  size="lg"
                  onClick={goBackOneStep}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Kembali
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white shadow-lg rounded-xl h-12"
                  size="lg"
                  onClick={() => navigateToStep('dokumen')}
                >
                  Lanjut
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Kelengkapan Dokumen */}
        {currentStep === 'dokumen' && (
          <Card className="border-0 shadow-xl rounded-3xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-[#17A2B8]/5 to-[#C4D600]/5 dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 rounded-t-3xl">
              <CardTitle className="text-2xl flex items-center gap-2 dark:text-white">
                <FileText className="size-6 text-[#17A2B8]" />
                B. Kelengkapan Dokumen
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Centang dokumen yang tersedia (YA/TIDAK)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="suratKematian" 
                    checked={kelengkapanDokumen.suratKematian}
                    onCheckedChange={() => toggleDokumen('suratKematian')}
                    className="mt-1"
                  />
                  <Label htmlFor="suratKematian" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Surat Keterangan Kematian dari Dokter/Puskesmas/RS/Pemda (untuk kematian di rumah)
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="suratPengawetan" 
                    checked={kelengkapanDokumen.suratPengawetan}
                    onCheckedChange={() => toggleDokumen('suratPengawetan')}
                    className="mt-1"
                  />
                  <Label htmlFor="suratPengawetan" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Surat Keterangan Pengawetan oleh tenaga kesehatan berwenang
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="suratBebasPenyakit" 
                    checked={kelengkapanDokumen.suratBebasPenyakit}
                    onCheckedChange={() => toggleDokumen('suratBebasPenyakit')}
                    className="mt-1"
                  />
                  <Label htmlFor="suratBebasPenyakit" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Surat Keterangan Bebas Penyakit Menular
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="suratPemetian" 
                    checked={kelengkapanDokumen.suratPemetian}
                    onCheckedChange={() => toggleDokumen('suratPemetian')}
                    className="mt-1"
                  />
                  <Label htmlFor="suratPemetian" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Surat Keterangan Pemetian/Pengepakan (dari RS/krematorium)
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="beritaAcaraPembongkaran" 
                    checked={kelengkapanDokumen.beritaAcaraPembongkaran}
                    onCheckedChange={() => toggleDokumen('beritaAcaraPembongkaran')}
                    className="mt-1"
                  />
                  <Label htmlFor="beritaAcaraPembongkaran" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Berita Acara Pembongkaran Makam (untuk kerangka/abu jenazah yang dipindahkan)
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="suratKepolisian" 
                    checked={kelengkapanDokumen.suratKepolisian}
                    onCheckedChange={() => toggleDokumen('suratKepolisian')}
                    className="mt-1"
                  />
                  <Label htmlFor="suratKepolisian" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Surat Keterangan dari Kepolisian (untuk kematian tidak wajar/kasus kriminal)
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="identitasJenazah" 
                    checked={kelengkapanDokumen.identitasJenazah}
                    onCheckedChange={() => toggleDokumen('identitasJenazah')}
                    className="mt-1"
                  />
                  <Label htmlFor="identitasJenazah" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Identitas Jenazah dan Pengantar Jenazah
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="suratKedutaan" 
                    checked={kelengkapanDokumen.suratKedutaan}
                    onCheckedChange={() => toggleDokumen('suratKedutaan')}
                    className="mt-1"
                  />
                  <Label htmlFor="suratKedutaan" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    Surat Izin Tambahan dari Kedutaan atau Konsulat Jenderal (untuk jenazah WNA)
                  </Label>
                </div>
              </div>

              {/* Checkbox Penyakit Menular - Highlighted */}
              <div className="mt-6 p-1 rounded-2xl bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse">
                <div className={`flex items-start gap-3 p-5 rounded-xl ${
                  jenazahPenyakitMenular 
                    ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-600' 
                    : 'bg-white dark:bg-gray-800 border-2 border-transparent'
                } transition-all duration-300`}>
                  <Checkbox 
                    id="jenazahPenyakitMenular" 
                    checked={jenazahPenyakitMenular}
                    onCheckedChange={handleInfectiousDiseaseToggle}
                    className="mt-1 size-5"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="jenazahPenyakitMenular" 
                      className="cursor-pointer font-bold text-base leading-relaxed dark:text-gray-100 flex items-center gap-2"
                    >
                      <span className={jenazahPenyakitMenular ? 'text-red-700 dark:text-red-300' : ''}>
                        ⚠️ Jenazah Penyakit Menular
                      </span>
                      {infectiousProtocolConfirmed && (
                        <Badge className="bg-green-600 text-white text-xs">
                          Protokol Dikonfirmasi ✓
                        </Badge>
                      )}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Centang jika jenazah memiliki penyakit menular (COVID-19, TBC, Hepatitis, dll)
                    </p>
                    {jenazahPenyakitMenular && infectiousProtocolTimestamp && (
                      <p className="text-xs text-green-700 dark:text-green-400 mt-2 font-medium">
                        ✓ Dikonfirmasi: {new Date(infectiousProtocolTimestamp).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-2"
                  onClick={() => setCurrentStep('waktu-tempat')}
                >
                  Kembali
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white shadow-lg rounded-xl"
                  onClick={() => navigateToStep('fisik-peti')}
                >
                  Lanjut
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Pemeriksaan Fisik Peti */}
        {currentStep === 'fisik-peti' && (
          <Card className="border-0 shadow-xl rounded-3xl dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-[#17A2B8]/5 to-[#C4D600]/5 dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 rounded-t-3xl">
              <CardTitle className="text-2xl flex items-center gap-2 dark:text-white">
                <ClipboardCheck className="size-6 text-[#17A2B8]" />
                C. Pemeriksaan Fisik Peti
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Centang kondisi fisik peti yang sesuai (YA/TIDAK)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#E8F5F7] to-white dark:from-[#17A2B8]/20 dark:to-[#138496]/20 p-4 rounded-xl border border-[#17A2B8]/20 dark:border-[#17A2B8]/40">
                  <p className="font-semibold mb-3 text-[#17A2B8] dark:text-[#5DCCDE]">1. Bahan Peti yang Kuat</p>
                  <div className="space-y-3 ml-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-700">
                      <Checkbox 
                        id="bahanKayu" 
                        checked={pemeriksaanFisik.bahanKayu}
                        onCheckedChange={() => toggleFisik('bahanKayu')}
                        className="mt-1"
                      />
                      <Label htmlFor="bahanKayu" className="cursor-pointer flex-1 dark:text-gray-100">
                        Bahan Kayu/Besi/Guci Keramik
                      </Label>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-700">
                      <Checkbox 
                        id="wrapping" 
                        checked={pemeriksaanFisik.wrapping}
                        onCheckedChange={() => toggleFisik('wrapping')}
                        className="mt-1"
                      />
                      <Label htmlFor="wrapping" className="cursor-pointer flex-1 dark:text-gray-100">
                        Wrapping
                      </Label>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-700">
                      <Checkbox 
                        id="adsorben" 
                        checked={pemeriksaanFisik.adsorben}
                        onCheckedChange={() => toggleFisik('adsorben')}
                        className="mt-1"
                      />
                      <Label htmlFor="adsorben" className="cursor-pointer flex-1 dark:text-gray-100">
                        Memiliki Adsorben
                      </Label>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-700">
                      <Checkbox 
                        id="lapisanSeng" 
                        checked={pemeriksaanFisik.lapisanSeng}
                        onCheckedChange={() => toggleFisik('lapisanSeng')}
                        className="mt-1"
                      />
                      <Label htmlFor="lapisanSeng" className="cursor-pointer flex-1 dark:text-gray-100">
                        Lapisan Seng/Logam dalam peti
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="segelRapat" 
                    checked={pemeriksaanFisik.segelRapat}
                    onCheckedChange={() => toggleFisik('segelRapat')}
                    className="mt-1"
                  />
                  <Label htmlFor="segelRapat" className="cursor-pointer flex-1 dark:text-gray-100">
                    2. Segel rapat
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="pelindungSudut" 
                    checked={pemeriksaanFisik.pelindungSudut}
                    onCheckedChange={() => toggleFisik('pelindungSudut')}
                    className="mt-1"
                  />
                  <Label htmlFor="pelindungSudut" className="cursor-pointer flex-1 dark:text-gray-100">
                    3. Pelindung sudut peti (karet/kardus)
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="berbau" 
                    checked={pemeriksaanFisik.berbau}
                    onCheckedChange={() => toggleFisik('berbau')}
                    className="mt-1"
                  />
                  <Label htmlFor="berbau" className="cursor-pointer flex-1 dark:text-gray-100">
                    4. Berbau
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="rembesanCairan" 
                    checked={pemeriksaanFisik.rembesanCairan}
                    onCheckedChange={() => toggleFisik('rembesanCairan')}
                    className="mt-1"
                  />
                  <Label htmlFor="rembesanCairan" className="cursor-pointer flex-1 dark:text-gray-100">
                    5. Rembesan cairan
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-700/50 hover:border-[#17A2B8]/30 transition-colors">
                  <Checkbox 
                    id="diletakkanTerpisah" 
                    checked={pemeriksaanFisik.diletakkanTerpisah}
                    onCheckedChange={() => toggleFisik('diletakkanTerpisah')}
                    className="mt-1"
                  />
                  <Label htmlFor="diletakkanTerpisah" className="cursor-pointer flex-1 leading-relaxed dark:text-gray-100">
                    6. Diletakkan terpisah dari bahan makanan, bahan berbahaya, hewan, penumpang dan kendaraan
                  </Label>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mt-4">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    <strong>Catatan Penting:</strong> Pengiriman jenazah penyakit menular harus menggunakan cargo khusus dan mengikuti protokol kesehatan yang berlaku serta tidak boleh dibuka hingga penguburan selesai.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-2"
                  onClick={() => setCurrentStep('dokumen')}
                >
                  Kembali
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white shadow-lg rounded-xl"
                  onClick={() => navigateToStep('review')}
                >
                  Lanjut ke Review
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {currentStep === 'review' && (
          <div className="space-y-4">
            <Card className="border-0 shadow-xl rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-[#C4D600]/10 to-[#D8E64D]/10 rounded-t-3xl">
                <CardTitle className="text-2xl">Review Pemeriksaan Jenazah</CardTitle>
                <CardDescription>
                  Pastikan semua informasi sudah benar dan lengkap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Waktu dan Tempat */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                      <Clock className="size-5 text-[#17A2B8]" />
                      A. Waktu dan Tempat Pemeriksaan
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToStep('waktu-tempat')}
                      className="gap-1 text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
                    >
                      <span className="hidden sm:inline">Edit</span>
                      <ArrowLeft className="size-4 rotate-180" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 p-5 rounded-2xl">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mb-1">Hari</p>
                      <p className="font-medium dark:text-white">{waktuTempat.hari}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mb-1">Tanggal</p>
                      <p className="font-medium dark:text-white">{waktuTempat.tanggal}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mb-1">Jam</p>
                      <p className="font-medium dark:text-white">{waktuTempat.jam} LT</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mb-1">Lokasi</p>
                      <p className="font-medium dark:text-white">{waktuTempat.lokasi}</p>
                    </div>
                  </div>
                </div>

                {/* Kelengkapan Dokumen */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg dark:text-white">
                      <FileText className="size-5 text-[#17A2B8]" />
                      B. Kelengkapan Dokumen
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToStep('dokumen')}
                      className="gap-1 text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
                    >
                      <span className="hidden sm:inline">Edit</span>
                      <ArrowLeft className="size-4 rotate-180" />
                    </Button>
                  </div>
                  <div className="bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Surat Keterangan Kematian</span>
                      <Badge className={kelengkapanDokumen.suratKematian ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.suratKematian ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Surat Keterangan Pengawetan</span>
                      <Badge className={kelengkapanDokumen.suratPengawetan ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.suratPengawetan ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Surat Bebas Penyakit Menular</span>
                      <Badge className={kelengkapanDokumen.suratBebasPenyakit ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.suratBebasPenyakit ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Surat Pemetian/Pengepakan</span>
                      <Badge className={kelengkapanDokumen.suratPemetian ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.suratPemetian ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Berita Acara Pembongkaran Makam</span>
                      <Badge className={kelengkapanDokumen.beritaAcaraPembongkaran ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.beritaAcaraPembongkaran ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Surat Kepolisian</span>
                      <Badge className={kelengkapanDokumen.suratKepolisian ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.suratKepolisian ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Identitas Jenazah dan Pengantar</span>
                      <Badge className={kelengkapanDokumen.identitasJenazah ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.identitasJenazah ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Surat Izin Kedutaan (WNA)</span>
                      <Badge className={kelengkapanDokumen.suratKedutaan ? 'bg-green-500' : 'bg-red-500'}>{kelengkapanDokumen.suratKedutaan ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                  </div>
                </div>

                {/* Pemeriksaan Fisik Peti */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg dark:text-white">
                      <ClipboardCheck className="size-5 text-[#17A2B8]" />
                      C. Pemeriksaan Fisik Peti
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToStep('fisik-peti')}
                      className="gap-1 text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
                    >
                      <span className="hidden sm:inline">Edit</span>
                      <ArrowLeft className="size-4 rotate-180" />
                    </Button>
                  </div>
                  <div className="bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Bahan Kayu/Besi/Guci Keramik</span>
                      <Badge className={pemeriksaanFisik.bahanKayu ? 'bg-green-500' : 'bg-red-500'}>{pemeriksaanFisik.bahanKayu ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Wrapping</span>
                      <Badge className={pemeriksaanFisik.wrapping ? 'bg-green-500' : 'bg-red-500'}>{pemeriksaanFisik.wrapping ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Memiliki Adsorben</span>
                      <Badge className={pemeriksaanFisik.adsorben ? 'bg-green-500' : 'bg-red-500'}>{pemeriksaanFisik.adsorben ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Lapisan Seng/Logam</span>
                      <Badge className={pemeriksaanFisik.lapisanSeng ? 'bg-green-500' : 'bg-red-500'}>{pemeriksaanFisik.lapisanSeng ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Segel Rapat</span>
                      <Badge className={pemeriksaanFisik.segelRapat ? 'bg-green-500' : 'bg-red-500'}>{pemeriksaanFisik.segelRapat ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Pelindung Sudut Peti</span>
                      <Badge className={pemeriksaanFisik.pelindungSudut ? 'bg-green-500' : 'bg-red-500'}>{pemeriksaanFisik.pelindungSudut ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Berbau</span>
                      <Badge className={pemeriksaanFisik.berbau ? 'bg-red-500' : 'bg-green-500'}>{pemeriksaanFisik.berbau ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Rembesan Cairan</span>
                      <Badge className={pemeriksaanFisik.rembesanCairan ? 'bg-red-500' : 'bg-green-500'}>{pemeriksaanFisik.rembesanCairan ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm dark:text-gray-100">
                      <span>Diletakkan Terpisah</span>
                      <Badge className={pemeriksaanFisik.diletakkanTerpisah ? 'bg-green-500' : 'bg-red-500'}>{pemeriksaanFisik.diletakkanTerpisah ? 'YA' : 'TIDAK'}</Badge>
                    </div>
                  </div>
                </div>

                {/* Kesimpulan */}
                <div className="bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 border-2 border-[#17A2B8]/30 dark:border-[#17A2B8]/50 rounded-2xl p-5">
                  <h3 className="font-semibold mb-3 text-lg dark:text-white">Kesimpulan Pemeriksaan</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Berdasarkan hasil pemeriksaan tersebut, maka pengepakan jenazah/abu jenazah/kerangka:
                  </p>
                  <RadioGroup value={kesimpulan} onValueChange={(value) => setKesimpulan(value as 'memenuhi' | 'tidak-memenuhi')}>
                    <div className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                      kesimpulan === 'memenuhi' 
                        ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-400 shadow-lg ring-2 ring-green-400/50 dark:ring-green-500/50' 
                        : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                    }`}>
                      {kesimpulan === 'memenuhi' && (
                        <div className="absolute -top-2 -right-2 bg-green-500 dark:bg-green-600 rounded-full p-1 shadow-lg">
                          <Check className="size-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <RadioGroupItem value="memenuhi" id="memenuhi" className={kesimpulan === 'memenuhi' ? 'border-green-600' : ''} />
                      <Label htmlFor="memenuhi" className={`cursor-pointer flex-1 font-bold text-base flex items-center gap-3 ${
                        kesimpulan === 'memenuhi' ? 'text-green-700 dark:text-green-200' : 'text-gray-700 dark:text-gray-200'
                      }`}>
                        {kesimpulan === 'memenuhi' && (
                          <CheckCircle className="size-6 text-green-600 dark:text-green-400 flex-shrink-0" strokeWidth={2.5} />
                        )}
                        <span>✅ MEMENUHI SYARAT untuk pengangkutan</span>
                      </Label>
                    </div>
                    <div className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 mt-3 ${
                      kesimpulan === 'tidak-memenuhi' 
                        ? 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-400 shadow-lg ring-2 ring-red-400/50 dark:ring-red-500/50' 
                        : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500'
                    }`}>
                      {kesimpulan === 'tidak-memenuhi' && (
                        <div className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 rounded-full p-1 shadow-lg">
                          <Check className="size-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <RadioGroupItem value="tidak-memenuhi" id="tidak-memenuhi" className={kesimpulan === 'tidak-memenuhi' ? 'border-red-600' : ''} />
                      <Label htmlFor="tidak-memenuhi" className={`cursor-pointer flex-1 font-bold text-base flex items-center gap-3 ${
                        kesimpulan === 'tidak-memenuhi' ? 'text-red-700 dark:text-red-200' : 'text-gray-700 dark:text-gray-200'
                      }`}>
                        {kesimpulan === 'tidak-memenuhi' && (
                          <XCircle className="size-6 text-red-600 dark:text-red-400 flex-shrink-0" strokeWidth={2.5} />
                        )}
                        <span>❌ TIDAK MEMENUHI SYARAT untuk pengangkutan</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Identitas Pihak Terkait */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaPengantar" className="dark:text-gray-200">Nama Pengantar Jenazah</Label>
                    <Input
                      id="namaPengantar"
                      placeholder="Nama pengantar"
                      value={namaPengantar}
                      onChange={(e) => setNamaPengantar(e.target.value)}
                      className="rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="namaPemeriksa" className="dark:text-gray-200">Nama Petugas Pemeriksa</Label>
                    <Input
                      id="namaPemeriksa"
                      placeholder="Nama pemeriksa"
                      value={namaPemeriksa}
                      onChange={(e) => setNamaPemeriksa(e.target.value)}
                      className="rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                    />
                  </div>
                </div>

                {/* Document Scanner Section */}
                <div className="bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] dark:from-[#17A2B8]/20 dark:to-[#C4D600]/20 border-2 border-[#17A2B8]/30 dark:border-[#17A2B8]/50 rounded-2xl p-5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg dark:text-white">
                    <Scan className="size-5 text-[#17A2B8] dark:text-[#5DCCDE]" />
                    Lampiran Dokumen Pendukung (Opsional)
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Scan dokumen pendukung dengan fitur OCR otomatis untuk ekstraksi data
                  </p>

                  {/* Document Type Selector */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="docType">Jenis Dokumen</Label>
                    <Select value={currentDocType} onValueChange={(value) => setCurrentDocType(value as Document['type'])}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Pilih jenis dokumen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KTP">KTP</SelectItem>
                        <SelectItem value="KK">Kartu Keluarga</SelectItem>
                        <SelectItem value="NPWP">NPWP</SelectItem>
                        <SelectItem value="OTHER">Dokumen Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Scan Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setShowCamera(true);
                        setCameraEnabled(false);
                        setCameraReady(false);
                        setPermissionDenied(false);
                        setCameraError('');
                      }}
                      className="w-full bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white rounded-xl gap-2"
                    >
                      <Camera className="size-5" />
                      Scan dengan Kamera
                    </Button>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-main"
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={() => document.getElementById('file-upload-main')?.click()}
                      disabled={isProcessing}
                      variant="outline"
                      className="w-full rounded-xl border-2 border-[#17A2B8] text-[#17A2B8] hover:bg-[#17A2B8]/10 gap-2"
                    >
                      <Upload className="size-5" />
                      {isProcessing ? 'Memproses...' : 'Upload dari Galeri'}
                    </Button>
                  </div>

                  {/* Documents List */}
                  {documents.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dokumen Tersimpan ({documents.length})</p>
                      {documents.map(doc => (
                        <div key={doc.id} className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                          <div className="flex items-start gap-3">
                            <img 
                              src={doc.imageUrl} 
                              alt={doc.type}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <Badge className="bg-[#17A2B8]">{doc.type}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocument(doc.id)}
                                  className="h-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                              {doc.ocrData && (
                                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                                  {doc.ocrData.nik && <p className="flex items-center gap-1"><Sparkles className="size-3 text-[#C4D600]"/> NIK: {doc.ocrData.nik}</p>}
                                  {doc.ocrData.nama && <p>Nama: {doc.ocrData.nama}</p>}
                                  {doc.ocrData.tanggalLahir && <p>Tanggal Lahir: {doc.ocrData.tanggalLahir}</p>}
                                </div>
                              )}
                              {doc.ocrText && !doc.ocrData && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{doc.ocrText.substring(0, 100)}...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-2"
                onClick={() => setCurrentStep('fisik-peti')}
              >
                Kembali
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#C4D600] to-[#D8E64D] hover:from-[#A8B700] hover:to-[#C4D600] text-gray-900 shadow-lg gap-2 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-5" />
                    Kirim Laporan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Scan Dokumen - {currentDocType}</h3>
                <p className="text-sm text-white/90">Arahkan kamera ke dokumen</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCamera(false);
                  setCameraEnabled(false);
                  setCameraReady(false);
                  setCameraError('');
                  setPermissionDenied(false);
                }}
                disabled={isProcessing}
                className="text-white hover:bg-white/20 h-auto p-2"
              >
                <X className="size-5" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[400px] flex items-center justify-center">
                {/* Initial State - Camera Not Enabled */}
                {!cameraEnabled ? (
                  <div className="text-center text-white p-8">
                    <Camera className="size-20 mx-auto mb-6 text-[#17A2B8] animate-pulse" />
                    <h3 className="font-bold text-xl mb-3">Aktifkan Kamera</h3>
                    <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
                      Klik tombol di bawah untuk mengaktifkan kamera dan memindai dokumen {currentDocType}
                    </p>
                    {!navigator.mediaDevices ? (
                      <div className="space-y-4">
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-sm font-medium text-red-200 mb-2">⚠️ Browser Tidak Didukung</p>
                          <p className="text-xs text-red-100/80">
                            Browser Anda tidak mendukung akses kamera. Gunakan Chrome, Firefox, Edge, atau Safari versi terbaru.
                          </p>
                        </div>
                        <p className="text-xs text-white/60">
                          Atau gunakan opsi Upload File di bawah
                        </p>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={enableCamera}
                          className="bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white gap-2 shadow-lg"
                          size="lg"
                        >
                          <Camera className="size-5" />
                          Aktifkan Kamera Sekarang
                        </Button>
                        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-xs font-medium mb-2">💡 Tips:</p>
                          <ul className="text-xs text-white/70 space-y-1 text-left">
                            <li>• Browser akan meminta izin akses kamera</li>
                            <li>• Pastikan Anda klik "Allow" atau "Izinkan"</li>
                            <li>• Jika ditolak, cek ikon 🎥 di address bar</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={1}
                      className="w-full"
                      mirrored={false}
                      onUserMedia={handleCameraReady}
                      onUserMediaError={handleCameraError}
                      videoConstraints={{
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 },
                        facingMode: 'environment',
                        aspectRatio: 16/9
                      }}
                    />
                    
                    {/* Camera Loading State */}
                    {!cameraReady && !cameraError && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Camera className="size-16 animate-pulse mx-auto mb-4" />
                          <p className="font-medium text-lg">Mengaktifkan kamera...</p>
                          <p className="text-sm text-white/80 mt-2">Mohon tunggu sebentar</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Camera Error State */}
                {cameraError && (
                  <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center p-4">
                    <div className="text-center text-white max-w-md">
                      <X className="size-16 mx-auto mb-4" />
                      <p className="font-medium text-lg mb-2">Kamera Tidak Tersedia</p>
                      <p className="text-sm text-white/90 mb-4">{cameraError}</p>
                      
                      {permissionDenied && (
                        <div className="bg-white/10 rounded-lg p-4 mb-4 text-left space-y-3">
                          <div>
                            <p className="text-xs font-medium mb-2">📱 Cara memberikan izin kamera:</p>
                            <ul className="text-xs space-y-1 text-white/80">
                              <li>1. Klik ikon kamera 🎥 di address bar browser (pojok kiri atas)</li>
                              <li>2. Pilih "Izinkan" atau "Allow"</li>
                              <li>3. Klik tombol "Coba Lagi" di bawah</li>
                            </ul>
                          </div>
                          <div className="pt-2 border-t border-white/20">
                            <p className="text-xs font-medium mb-1">🌐 Browser yang didukung:</p>
                            <p className="text-xs text-white/70">Chrome, Firefox, Edge, Safari (versi terbaru)</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        {permissionDenied && (
                          <Button
                            onClick={requestCameraPermission}
                            className="bg-white text-red-900 hover:bg-white/90"
                          >
                            <Camera className="size-4 mr-2" />
                            Coba Lagi
                          </Button>
                        )}
                        
                        <Button
                          onClick={disableCamera}
                          variant="outline"
                          className="bg-transparent border-white/30 text-white hover:bg-white/10"
                        >
                          <X className="size-4 mr-2" />
                          Tutup Kamera
                        </Button>
                      </div>
                      
                      <p className="text-xs text-white/60 mt-4">
                        Atau gunakan opsi Upload File di bawah
                      </p>
                    </div>
                  </div>
                )}

                {/* OCR Processing State */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center text-white">
                      <RotateCw className="size-12 animate-spin mx-auto mb-3" />
                      <p className="font-medium">Memproses OCR...</p>
                      <p className="text-sm text-white/80">Sedang membaca teks dari dokumen</p>
                    </div>
                  </div>
                )}

                {/* Camera Ready Indicator */}
                {cameraReady && !isProcessing && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                    <div className="size-2 bg-white rounded-full animate-pulse"></div>
                    Kamera Siap
                  </div>
                )}
              </div>

              {cameraEnabled && (
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCamera(false);
                      setCameraEnabled(false);
                      setCameraReady(false);
                      setCameraError('');
                      setPermissionDenied(false);
                    }}
                    disabled={isProcessing}
                    className="flex-1 rounded-xl"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={captureDocument}
                    disabled={isProcessing || !cameraReady || !!cameraError}
                    className="flex-1 bg-gradient-to-r from-[#C4D600] to-[#D8E64D] hover:from-[#A8B700] hover:to-[#C4D600] text-gray-900 rounded-xl gap-2 font-bold disabled:opacity-50"
                  >
                  {isProcessing ? (
                    <>
                      <RotateCw className="size-5 animate-spin" />
                      Memproses...
                    </>
                  ) : !cameraReady ? (
                    <>
                      <Camera className="size-5" />
                      Menunggu Kamera...
                    </>
                  ) : (
                    <>
                      <Camera className="size-5" />
                      Ambil Foto & Scan OCR
                    </>
                  )}
                </Button>
                </div>
              )}

              {/* Helpful Tips */}
              {cameraEnabled && cameraReady && !isProcessing && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium mb-2">💡 Tips untuk hasil OCR terbaik:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Pastikan pencahayaan cukup terang</li>
                    <li>• Posisikan dokumen sejajar dengan kamera</li>
                    <li>• Pastikan teks pada dokumen terlihat jelas</li>
                    <li>• Hindari bayangan atau pantulan cahaya</li>
                  </ul>
                </div>
              )}

              {/* Alternative: Upload File */}
              {!cameraEnabled && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">Atau upload file dari perangkat:</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full rounded-xl border-2 border-dashed border-[#17A2B8] text-[#17A2B8] hover:bg-[#17A2B8]/10 gap-2"
                >
                  <Upload className="size-5" />
                  {isProcessing ? 'Memproses...' : 'Upload & Scan Dokumen'}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Mendukung JPG, PNG, dan format gambar lainnya
                </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Infectious Disease Alert Dialog */}
      <InfectiousDiseaseAlert
        open={showInfectiousAlert}
        onConfirm={handleInfectiousProtocolConfirm}
        onCancel={handleInfectiousProtocolCancel}
        variant="warning"
      />
    </div>
  );
}