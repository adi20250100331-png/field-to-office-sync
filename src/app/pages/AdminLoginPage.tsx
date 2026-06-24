import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { UserCircle, Lock, ArrowLeft, Eye, EyeOff, Shield, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';

// Nomor WhatsApp Super Admin (format internasional tanpa +)
const SUPER_ADMIN_WHATSAPP = '6285237058348'; // Ganti dengan nomor super admin yang sebenarnya

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: authLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password, 'admin');
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login gagal');
    }
  };

  const handleContactSuperAdmin = () => {
    const message = encodeURIComponent('Halo Super Admin, saya membutuhkan bantuan untuk mengakses akun admin saya di aplikasi Field-to-Office Sync.');
    window.open(`https://wa.me/${SUPER_ADMIN_WHATSAPP}?text=${message}`, '_blank');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7FCE6] via-white to-[#E8F5F7] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="size-16 border-4 border-[#C4D600] dark:border-[#D8E64D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FCE6] via-white to-[#E8F5F7] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#C4D600] to-[#17A2B8] rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
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
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#C4D600] to-[#A8B700] bg-clip-text text-transparent animate-[fadeInUp_0.8s_ease-out]">
            Login Admin Kemenkes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 animate-[fadeInUp_1s_ease-out]">
            Portal administrasi dan verifikasi data
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl dark:bg-gray-800">
          <CardHeader className="space-y-1 bg-gradient-to-r from-[#C4D600]/5 to-[#A8B700]/5 dark:from-[#C4D600]/10 dark:to-[#A8B700]/10">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-[#C4D600] to-[#A8B700] flex items-center justify-center shadow-lg">
                <Shield className="size-8 text-gray-900" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center dark:text-white">Selamat Datang Admin</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Silakan masukkan kredensial admin Anda
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
                    placeholder="Masukkan username admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#C4D600] focus:ring-[#C4D600]"
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
                    className="pl-10 pr-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#C4D600] focus:ring-[#C4D600]"
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
                <button
                  type="button"
                  onClick={handleContactSuperAdmin}
                  className="text-[#C4D600] hover:text-[#A8B700] dark:text-[#D8E64D] dark:hover:text-[#C4D600] flex items-center gap-1"
                >
                  <MessageCircle className="size-4" />
                  Lupa password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#C4D600] to-[#A8B700] hover:from-[#A8B700] hover:to-[#8A9600] text-gray-900 shadow-lg rounded-xl text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="size-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </span>
                ) : (
                  'Masuk sebagai Admin'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#F7FCE6] to-[#E8F5F7] dark:from-gray-700 dark:to-gray-600 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Akun Demo Admin:</p>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <p>• Username: <span className="font-mono font-semibold">admin</span> | Password: <span className="font-mono font-semibold">admin123</span></p>
                <p>• Username: <span className="font-mono font-semibold">supervisor</span> | Password: <span className="font-mono font-semibold">super123</span></p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-400 text-center">
                Butuh bantuan akses? Hubungi Super Admin via WhatsApp
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Portal Admin - Balai Kekarantinaan Kesehatan Kelas I Kupang</p>
          <p className="text-xs mt-1">Kementerian Kesehatan RI</p>
        </div>
      </div>
    </div>
  );
}
