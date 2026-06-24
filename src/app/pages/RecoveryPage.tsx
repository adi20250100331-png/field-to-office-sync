import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, ArrowLeft, CheckCircle, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';

// Nomor WhatsApp Admin (format internasional tanpa +)
const ADMIN_WHATSAPP = '6285237058348'; // Ganti dengan nomor admin yang sebenarnya

export function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Email harus diisi');
      return;
    }

    if (!email.includes('@')) {
      setError('Format email tidak valid');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setSuccess(true);
  };

  const handleContactAdmin = () => {
    const message = encodeURIComponent('Halo Admin, saya membutuhkan bantuan untuk mengakses akun saya di aplikasi Field-to-Office Sync.');
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5F7] via-white to-[#F7FCE6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button and Theme Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/field-officer/login">
            <Button variant="ghost" className="gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="size-5" />
              Kembali ke Login
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={kemenkesLogo} alt="Kemenkes" className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#17A2B8] to-[#C4D600] bg-clip-text text-transparent">
            Pemulihan Akun
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tidak dapat mengakses akun Anda?
          </p>
        </div>

        {/* Recovery Card */}
        <Card className="border-0 shadow-2xl dark:bg-gray-800">
          <CardHeader className="space-y-1 bg-gradient-to-r from-[#17A2B8]/5 to-[#C4D600]/5 dark:from-[#17A2B8]/10 dark:to-[#C4D600]/10">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] flex items-center justify-center shadow-lg">
                <Mail className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center dark:text-white">Reset Password</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Masukkan email Anda untuk menerima link reset password
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {success ? (
              <div className="text-center py-8">
                <div className="size-20 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="size-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">Email Terkirim!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Kami telah mengirim link reset password ke <span className="font-semibold">{email}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Silakan cek inbox atau folder spam Anda. Link akan kadaluarsa dalam 1 jam.
                </p>
                <Link to="/field-officer/login">
                  <Button className="w-full bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white">
                    Kembali ke Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 border-red-200 dark:border-red-800">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Masukkan email yang terdaftar pada akun Anda
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white shadow-lg rounded-xl text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengirim Email...
                    </span>
                  ) : (
                    'Kirim Link Reset Password'
                  )}
                </Button>

                {/* Help Section */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">
                    Butuh bantuan lebih lanjut?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 gap-2"
                    onClick={handleContactAdmin}
                  >
                    <MessageCircle className="size-4" />
                    Hubungi Admin via WhatsApp
                  </Button>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-3">
                    Admin akan membantu Anda mengakses kembali akun atau memberikan akun baru
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Balai Kekarantinaan Kesehatan Kelas I Kupang</p>
          <p className="text-xs mt-1">Kementerian Kesehatan RI</p>
        </div>
      </div>
    </div>
  );
}
