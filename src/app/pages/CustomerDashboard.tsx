import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ThemeToggle } from '../components/ThemeToggle';
import { ArrowLeft, UserCircle, LogOut } from 'lucide-react';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FCE6] via-white to-[#E8F5F7] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] dark:from-[#0D6876] dark:to-[#138496] text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Halo, {user?.name}</h1>
            <p className="text-white/90 mt-1">Akun pelanggan Anda aktif dan siap digunakan.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/20 gap-2 backdrop-blur-sm">
                <ArrowLeft className="size-5" />
                Beranda
              </Button>
            </Link>
            <Button variant="outline" className="text-white border-white/60 hover:bg-white/10 gap-2" onClick={handleLogout}>
              <LogOut className="size-5" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Card className="mx-auto max-w-3xl border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#17A2B8]/10 to-[#5DCCDE]/10 border-b border-[#17A2B8]/10">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-3xl bg-[#17A2B8]/10 text-[#17A2B8] p-4">
                <UserCircle className="size-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">Dashboard Pelanggan</CardTitle>
                <CardDescription>Kelola akun Anda dan lihat informasi layanan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-200 text-lg">
                Selamat datang di portal pelanggan. Akun Anda sudah aktif tanpa perlu aktivasi admin dan Anda dapat langsung menggunakan layanan yang tersedia.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Saat ini, fitur pemantauan pesanan dan pengajuan layanan akan diintegrasikan dengan sistem utama. Jika Anda memerlukan bantuan, silakan hubungi admin melalui halaman beranda.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#17A2B8]/10 bg-[#E8F5F7] p-6">
                <h2 className="text-xl font-semibold text-[#17A2B8] mb-2">Akses Cepat</h2>
                <p className="text-sm text-gray-600">Lihat status akun, kontak dukungan, dan informasi penting lainnya.</p>
              </div>
              <div className="rounded-3xl border border-[#5DCCDE]/10 bg-[#F7FCE6] p-6">
                <h2 className="text-xl font-semibold text-[#138496] mb-2">Informasi Akun</h2>
                <p className="text-sm text-gray-600">Nama: {user?.name}</p>
                <p className="text-sm text-gray-600">Email: {user?.email}</p>
                <p className="text-sm text-gray-600">Peran: Pelanggan</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-center">
              <Link to="/">
                <Button className="w-full sm:w-auto bg-white text-[#17A2B8] hover:bg-[#E8F5F7] border border-[#17A2B8] shadow-none">
                  Kembali ke Beranda
                </Button>
              </Link>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] text-white" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
