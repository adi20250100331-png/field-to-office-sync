import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  ArrowLeft, 
  Plus, 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  User,
  FileText,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';
import { DevelopmentModeBanner } from '../components/DevelopmentModeBanner';

export function FieldOfficerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { serviceUsers, notifications, markNotificationAsRead, clearAllNotifications } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const mySubmissions = serviceUsers.filter(submission => submission.fieldOfficerId === user?.id);
  const unreadNotifications = notifications.filter(n => !n.read);

  const handleLogout = () => {
    logout();
    navigate('/field-officer/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-[#C4D600] text-gray-900 border-[#A8B700]';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-[#E8F5F7] text-[#17A2B8] border-[#17A2B8]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="size-4" />;
      case 'rejected':
        return <XCircle className="size-4" />;
      case 'incomplete':
        return <AlertCircle className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Terverifikasi';
      case 'rejected':
        return 'Ditolak';
      case 'incomplete':
        return 'Perlu Dilengkapi';
      default:
        return 'Menunggu Verifikasi';
    }
  };

  const selectedUserData = mySubmissions.find(u => u.id === selectedUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5F7] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#17A2B8] to-[#138496] dark:from-[#138496] dark:to-[#0D6876] text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/20 gap-2 backdrop-blur-sm">
                <ArrowLeft className="size-5" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img src={kemenkesLogo} alt="Kemenkes" className="h-10 sm:h-12 w-auto drop-shadow-lg hover:scale-110 transition-transform duration-300" />
              <ThemeToggle />
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 relative backdrop-blur-sm"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="size-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C4D600] text-gray-900 text-xs rounded-full size-5 flex items-center justify-center font-bold">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 gap-2 backdrop-blur-sm"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <User className="size-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-white/90">Petugas Lapangan Kemenkes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Development Mode Banner */}
      <div className="container mx-auto px-4 py-4">
        <DevelopmentModeBanner />
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#E8F5F7]">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <FileText className="size-6" />
                </div>
                <p className="text-3xl font-bold text-[#17A2B8]">{mySubmissions.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Pengajuan</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F7FCE6]">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-[#C4D600] to-[#D8E64D] text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CheckCircle className="size-6" />
                </div>
                <p className="text-3xl font-bold text-[#A8B700]">
                  {mySubmissions.filter(u => u.status === 'verified').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Terverifikasi</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="size-12 rounded-2xl bg-yellow-400 text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Clock className="size-6" />
                </div>
                <p className="text-3xl font-bold text-yellow-600">
                  {mySubmissions.filter(u => u.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Menunggu</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="size-12 rounded-2xl bg-red-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <AlertCircle className="size-6" />
                </div>
                <p className="text-3xl font-bold text-red-600">
                  {mySubmissions.filter(u => u.status === 'incomplete').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Perlu Dilengkapi</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <div className="mb-6">
          <Link to="/field-officer/collect-data">
            <Button size="lg" className="w-full bg-gradient-to-r from-[#17A2B8] to-[#5DCCDE] hover:from-[#138496] hover:to-[#17A2B8] text-white shadow-xl gap-3 py-7 rounded-2xl border-0">
              <Plus className="size-7" />
              <span className="text-lg">Tambah Data Pengguna Jasa Baru</span>
            </Button>
          </Link>
        </div>

        {/* Submissions List */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#17A2B8]/5 to-[#C4D600]/5">
            <CardTitle className="text-2xl">Riwayat Pengajuan Data</CardTitle>
            <CardDescription>
              Daftar semua data yang telah Anda kumpulkan dari lapangan
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {mySubmissions.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="size-24 rounded-3xl bg-gradient-to-br from-[#17A2B8]/10 to-[#C4D600]/10 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="size-12 text-gray-300" />
                </div>
                <p className="text-lg font-medium">Belum ada data yang dikumpulkan</p>
                <p className="text-sm mt-2">Klik tombol di atas untuk mulai mengumpulkan data</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mySubmissions.map(submission => (
                  <div 
                    key={submission.id}
                    className="border-0 rounded-2xl p-5 hover:shadow-lg cursor-pointer transition-all duration-300 bg-gradient-to-r from-white to-gray-50 shadow-md"
                    onClick={() => setSelectedUser(submission.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{submission.nama}</h3>
                        <p className="text-sm text-gray-600">NIK: {submission.nik}</p>
                      </div>
                      <Badge className={`${getStatusColor(submission.status)} gap-1 px-3 py-1 rounded-full`}>
                        {getStatusIcon(submission.status)}
                        {getStatusText(submission.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="bg-[#E8F5F7] rounded-xl p-3">
                        <span className="text-gray-600 text-xs">Layanan</span>
                        <p className="font-medium text-[#17A2B8]">{submission.jenisLayanan}</p>
                      </div>
                      <div className="bg-[#F7FCE6] rounded-xl p-3">
                        <span className="text-gray-600 text-xs">Dokumen</span>
                        <p className="font-medium text-[#A8B700]">{submission.documents.length} file</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Diajukan: {format(submission.createdAt, 'dd MMM yyyy, HH:mm', { locale: id })}
                    </div>
                    {submission.statusMessage && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
                        <p className="font-medium text-yellow-800">Catatan dari Admin:</p>
                        <p className="text-yellow-700 mt-1">{submission.statusMessage}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Notifikasi</DialogTitle>
            <DialogDescription>
              Status verifikasi dari admin kantor
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="size-20 rounded-3xl bg-gradient-to-br from-[#17A2B8]/10 to-[#C4D600]/10 mx-auto mb-4 flex items-center justify-center">
                  <Bell className="size-10 text-gray-300" />
                </div>
                <p>Belum ada notifikasi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-0 rounded-2xl cursor-pointer transition-all ${!notif.read ? 'bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] shadow-md' : 'bg-white shadow'}`}
                    onClick={() => markNotificationAsRead(notif.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{notif.title}</h4>
                      {!notif.read && (
                        <span className="size-3 rounded-full bg-[#17A2B8]" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(notif.timestamp, 'dd MMM yyyy, HH:mm', { locale: id })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          {notifications.length > 0 && unreadNotifications.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-[#17A2B8] text-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
              onClick={() => {
                clearAllNotifications();
                setShowNotifications(false);
              }}
            >
              Tandai Semua Sudah Dibaca
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detail Pengajuan</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang pengajuan data pengguna jasa
            </DialogDescription>
          </DialogHeader>
          {selectedUserData && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{selectedUserData.nama}</h3>
                  <Badge className={`${getStatusColor(selectedUserData.status)} gap-1 px-3 py-1 rounded-full`}>
                    {getStatusIcon(selectedUserData.status)}
                    {getStatusText(selectedUserData.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm bg-gradient-to-r from-[#E8F5F7] to-[#F7FCE6] p-5 rounded-2xl">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">NIK</p>
                    <p className="font-medium">{selectedUserData.nik}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">No. Telepon</p>
                    <p className="font-medium">{selectedUserData.noTelepon}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Email</p>
                    <p className="font-medium">{selectedUserData.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Jenis Layanan</p>
                    <p className="font-medium">{selectedUserData.jenisLayanan}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-xs mb-1">Alamat</p>
                    <p className="font-medium">{selectedUserData.alamat}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-xs mb-1">Keterangan</p>
                    <pre className="font-medium whitespace-pre-wrap text-sm">{selectedUserData.keterangan}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Dokumen Terlampir ({selectedUserData.documents.length})</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUserData.documents.map(doc => (
                      <div key={doc.id} className="border-0 rounded-2xl overflow-hidden shadow-lg">
                        <img 
                          src={doc.imageUrl} 
                          alt={doc.type}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3 bg-gradient-to-r from-[#E8F5F7] to-white">
                          <p className="font-medium text-sm">{doc.type}</p>
                          {doc.ocrData && (
                            <div className="text-xs text-gray-600 mt-1">
                              <p>NIK: {doc.ocrData.nik}</p>
                              <p>Nama: {doc.ocrData.nama}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedUserData.statusMessage && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <p className="font-semibold text-yellow-800">Catatan dari Admin:</p>
                    <p className="text-yellow-700 mt-2">{selectedUserData.statusMessage}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}