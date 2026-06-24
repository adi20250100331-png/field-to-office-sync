import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { UserCircle, Lock, ArrowLeft, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';

// Nomor WhatsApp Admin (format internasional tanpa +)
const ADMIN_WHATSAPP = '6285237058348'; // Ganti dengan nomor admin yang sebenarnya

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: authLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/field-officer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password, 'field_officer');
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login gagal');
    }
  };

  const handleContactAdmin = () => {
    const message = encodeURIComponent('Halo Admin, saya ingin mendaftar sebagai petugas lapangan di aplikasi Field-to-Office Sync.');
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5F7] via-white to-[#F7FCE6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="size-16 border-4 border-[#17A2B8] dark:border-[#5DCCDE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5F7] via-white to-[#F7FCE6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button and Theme Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="size-5" />
              Kembali ke Beranda
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Logo and Title - ANIMATED */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* Logo dengan animasi */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#17A2B8] to-[#C4D600] rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
              <img 
                src={kemenkesLogo} 
                alt="Kemenkes" 
                className="h-20 sm:h-24 w-auto relative z-10 
                           animate-[fadeIn_1s_ease-out,logoFloat_3s_ease-in-out_infinite]
                           hover:scale-110 transition-transform duration-500
                           drop-shadow-2xl" 
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#17A2B8] to-[#C4D600] bg-clip-text text-transparent animate-[fadeInUp_0.8s_ease-out]">
            Login Petugas Lapangan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 animate-[fadeInUp_1s_ease-out]">
            Masuk ke sistem Field-to-Office Sync
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl dark:bg-gray-800">
          <CardHeader className="space-y-1 bg-gradient-to-r from-[#17A2B8]/5 to-[#C4D600]/5 dark:from-[#17A2B8]/10 dark:to-[#C4D600]/10">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] flex items-center justify-center shadow-lg">
                <UserCircle className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center dark:text-white">Selamat Datang</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Silakan masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 border-red-200 dark:border-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="dark:text-gray-200">Username</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link 
                  to="/recovery" 
                  className="text-[#17A2B8] hover:text-[#138496] dark:text-[#5DCCDE] dark:hover:text-[#17A2B8]"
                >
                  Tidak dapat mengakses akun Anda?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white shadow-lg rounded-xl text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>

            {/* Contact Admin for Registration */}
            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Belum punya akun?</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 gap-2"
                onClick={handleContactAdmin}
              >
                <MessageCircle className="size-5" />
                <span>Hubungi Admin via WhatsApp</span>
              </Button>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                Hanya petugas terdaftar yang dapat mengakses aplikasi ini
              </p>
            </div>

            {/* Demo Credentials */}
            {/* <div className="mt-6 p-4 bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-2">Akun Demo:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Username: <span className="font-mono font-semibold">adhy</span> | Password: <span className="font-mono font-semibold">adhy123</span></p>
                <p>• Username: <span className="font-mono font-semibold">budi</span> | Password: <span className="font-mono font-semibold">budi123</span></p>
                <p>• Username: <span className="font-mono font-semibold">siti</span> | Password: <span className="font-mono font-semibold">siti123</span></p>
              </div>
            </div> */}
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
