import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { UserCircle, Lock, ArrowLeft, Eye, EyeOff, Mail, UserPlus } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Format email tidak valid');
      return;
    }

    setIsLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    setIsLoading(false);

    if (result.success) {
      navigate('/customer', { replace: true });
    } else {
      setError(result.error || 'Pendaftaran gagal');
    }
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
          <Link to="/customer/login">
            <Button variant="ghost" className="gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="size-5" />
              Kembali ke Login Pelanggan
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
            Daftar Akun Pelanggan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buat akun pelanggan aktif tanpa perlu aktivasi admin
          </p>
        </div>

        {/* Register Card */}
        <Card className="border-0 shadow-2xl dark:bg-gray-800">
          <CardHeader className="space-y-1 bg-gradient-to-r from-[#17A2B8]/5 to-[#C4D600]/5 dark:from-[#17A2B8]/10 dark:to-[#C4D600]/10">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] flex items-center justify-center shadow-lg">
                <UserPlus className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center dark:text-white">Buat Akun</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Isi formulir di bawah untuk mendaftar
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
                <Label htmlFor="name" className="dark:text-gray-200">Nama Lengkap</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="dark:text-gray-200">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#17A2B8] focus:ring-[#17A2B8]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
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
                  'Daftar Sekarang'
                )}
              </Button>
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sudah punya akun?{' '}
                <Link to="/customer/login" className="text-[#17A2B8] dark:text-[#5DCCDE] hover:underline font-semibold">
                  Masuk di sini
                </Link>
              </p>
            </div>
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
