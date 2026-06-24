import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Users,
  FileCheck,
  TrendingUp,
  Search,
  MessageSquare,
  Eye,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import type { ServiceUser } from '../context/DataContext';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { serviceUsers, updateServiceUserStatus } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<ServiceUser | null>(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<ServiceUser['status']>('verified');
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredUsers = serviceUsers.filter(user => 
    user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.nik.includes(searchQuery) ||
    user.jenisLayanan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: serviceUsers.length,
    pending: serviceUsers.filter(u => u.status === 'pending').length,
    verified: serviceUsers.filter(u => u.status === 'verified').length,
    rejected: serviceUsers.filter(u => u.status === 'rejected').length,
    incomplete: serviceUsers.filter(u => u.status === 'incomplete').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
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
        return 'Menunggu';
    }
  };

  const handleVerification = () => {
    if (!selectedUser) return;

    updateServiceUserStatus(selectedUser.id, verificationStatus, verificationMessage);
    
    toast.success('Status berhasil diupdate!', {
      description: `Data ${selectedUser.nama} telah ${verificationStatus === 'verified' ? 'diverifikasi' : 'diupdate'}`
    });

    setVerificationDialog(false);
    setSelectedUser(null);
    setVerificationMessage('');
  };

  const openVerificationDialog = (user: ServiceUser) => {
    setSelectedUser(user);
    setVerificationStatus('verified');
    setVerificationMessage('');
    setVerificationDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FCE6] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C4D600] to-[#A8B700] dark:from-[#A8B700] dark:to-[#8A9600] text-gray-900 dark:text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" className="text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/20 gap-2 backdrop-blur-sm">
                <ArrowLeft className="size-5" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img src={kemenkesLogo} alt="Kemenkes" className="h-10 sm:h-12 w-auto drop-shadow-lg hover:scale-110 transition-transform duration-300" />
              <ThemeToggle />
              <Button 
                variant="ghost" 
                className="text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/20 gap-2 backdrop-blur-sm"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Dashboard Admin Kemenkes</h1>
          <p className="text-gray-800 dark:text-gray-200">Verifikasi data dari petugas lapangan</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="size-8 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Data</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="size-8 mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                <p className="text-sm text-blue-700">Menunggu</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="size-8 mx-auto mb-2 text-green-600" />
                <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                <p className="text-sm text-green-700">Terverifikasi</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="size-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-3xl font-bold text-yellow-600">{stats.incomplete}</p>
                <p className="text-sm text-yellow-700">Tidak Lengkap</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="size-8 mx-auto mb-2 text-red-600" />
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-red-700">Ditolak</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Real-Time Indicator */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama, NIK, atau layanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="size-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-600 dark:text-gray-300 font-medium">Real-Time Sync Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="size-6" />
              Data Masuk dari Lapangan
            </CardTitle>
            <CardDescription>
              Klik pada baris untuk melihat detail dan melakukan verifikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              {/* Mobile: 2x2 Grid, Desktop: 1x4 Grid */}
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2">
                <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 py-2.5 gap-1 flex-col sm:flex-row data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900">
                  <Clock className="size-4 sm:hidden" />
                  <span className="whitespace-nowrap">Menunggu</span>
                  <span className="font-bold">({stats.pending})</span>
                </TabsTrigger>
                <TabsTrigger value="verified" className="text-xs sm:text-sm px-2 py-2.5 gap-1 flex-col sm:flex-row data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900">
                  <CheckCircle className="size-4 sm:hidden" />
                  <span className="whitespace-nowrap">Terverifikasi</span>
                  <span className="font-bold">({stats.verified})</span>
                </TabsTrigger>
                <TabsTrigger value="incomplete" className="text-xs sm:text-sm px-2 py-2.5 gap-1 flex-col sm:flex-row data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900">
                  <AlertCircle className="size-4 sm:hidden" />
                  <span className="whitespace-nowrap">Tidak Lengkap</span>
                  <span className="font-bold">({stats.incomplete})</span>
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2.5 gap-1 flex-col sm:flex-row data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700">
                  <Users className="size-4 sm:hidden" />
                  <span className="whitespace-nowrap">Semua</span>
                  <span className="font-bold">({stats.total})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <DataTable 
                  users={filteredUsers.filter(u => u.status === 'pending')} 
                  onSelectUser={openVerificationDialog}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getStatusText={getStatusText}
                />
              </TabsContent>

              <TabsContent value="verified" className="mt-4">
                <DataTable 
                  users={filteredUsers.filter(u => u.status === 'verified')} 
                  onSelectUser={openVerificationDialog}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getStatusText={getStatusText}
                />
              </TabsContent>

              <TabsContent value="incomplete" className="mt-4">
                <DataTable 
                  users={filteredUsers.filter(u => u.status === 'incomplete' || u.status === 'rejected')} 
                  onSelectUser={openVerificationDialog}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getStatusText={getStatusText}
                />
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                <DataTable 
                  users={filteredUsers} 
                  onSelectUser={openVerificationDialog}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getStatusText={getStatusText}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Tingkat Verifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Terverifikasi</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${stats.total > 0 ? (stats.verified / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Menunggu</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Petugas Lapangan Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(serviceUsers.map(u => u.fieldOfficerName))).map(name => {
                  const count = serviceUsers.filter(u => u.fieldOfficerName === name).length;
                  return (
                    <div key={name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{count} pengajuan</p>
                        </div>
                      </div>
                      <div className="size-3 rounded-full bg-green-500" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verification Dialog */}
      <Dialog open={verificationDialog} onOpenChange={setVerificationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Detail & Verifikasi Data</DialogTitle>
            <DialogDescription>
              Review data dan dokumen untuk verifikasi
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* User Info */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{selectedUser.nama}</h3>
                    <Badge className={`${getStatusColor(selectedUser.status)} gap-1`}>
                      {getStatusIcon(selectedUser.status)}
                      {getStatusText(selectedUser.status)}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">NIK</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.nik}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">No. Telepon</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.noTelepon}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">Jenis Layanan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.jenisLayanan}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600 dark:text-gray-300">Alamat</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.alamat}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600 dark:text-gray-300">Keterangan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.keterangan}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">Petugas Lapangan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.fieldOfficerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">Waktu Pengajuan</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format(selectedUser.createdAt, 'dd MMM yyyy, HH:mm', { locale: id })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-semibold mb-3">Dokumen Terlampir ({selectedUser.documents.length})</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedUser.documents.map(doc => (
                      <div key={doc.id} className="border rounded-lg overflow-hidden">
                        <img 
                          src={doc.imageUrl} 
                          alt={doc.type}
                          className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(doc.imageUrl, '_blank')}
                        />
                        <div className="p-3 bg-gray-50 dark:bg-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <Badge>{doc.type}</Badge>
                            <Button variant="ghost" size="sm" className="gap-1 dark:text-gray-200 dark:hover:text-white">
                              <Eye className="size-3" />
                              Lihat Besar
                            </Button>
                          </div>
                          {doc.ocrData && (
                            <div className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 p-2 rounded">
                              <p className="font-medium text-gray-700 dark:text-white mb-1">Data OCR:</p>
                              <p className="text-gray-900 dark:text-gray-100">NIK: {doc.ocrData.nik}</p>
                              <p className="text-gray-900 dark:text-gray-100">Nama: {doc.ocrData.nama}</p>
                              {doc.ocrData.tanggalLahir && (
                                <p className="text-gray-900 dark:text-gray-100">Tanggal Lahir: {doc.ocrData.tanggalLahir}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Form */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    Tindakan Verifikasi
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status Verifikasi</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={verificationStatus === 'verified' ? 'default' : 'outline'}
                          className={verificationStatus === 'verified' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => setVerificationStatus('verified')}
                        >
                          <CheckCircle className="size-4 mr-2" />
                          Terverifikasi
                        </Button>
                        <Button
                          variant={verificationStatus === 'incomplete' ? 'default' : 'outline'}
                          className={verificationStatus === 'incomplete' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                          onClick={() => setVerificationStatus('incomplete')}
                        >
                          <AlertCircle className="size-4 mr-2" />
                          Tidak Lengkap
                        </Button>
                        <Button
                          variant={verificationStatus === 'rejected' ? 'default' : 'outline'}
                          className={verificationStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => setVerificationStatus('rejected')}
                        >
                          <XCircle className="size-4 mr-2" />
                          Ditolak
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Catatan untuk Petugas Lapangan</Label>
                      <Textarea
                        id="message"
                        placeholder="Berikan catatan atau instruksi untuk petugas lapangan..."
                        rows={4}
                        value={verificationMessage}
                        onChange={(e) => setVerificationMessage(e.target.value)}
                      />
                      <p className="text-sm text-gray-600">
                        Catatan ini akan dikirim sebagai notifikasi ke petugas lapangan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerificationDialog(false)}>
              Batal
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleVerification}
            >
              Kirim Verifikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Data Table Component
function DataTable({ 
  users, 
  onSelectUser,
  getStatusColor,
  getStatusIcon,
  getStatusText
}: { 
  users: ServiceUser[]; 
  onSelectUser: (user: ServiceUser) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusText: (status: string) => string;
}) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FileCheck className="size-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p>Tidak ada data</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map(user => (
        <div 
          key={user.id}
          className="border dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors bg-white dark:bg-gray-800"
          onClick={() => onSelectUser(user)}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{user.nama}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">NIK: {user.nik}</p>
            </div>
            <Badge className={`${getStatusColor(user.status)} gap-1`}>
              {getStatusIcon(user.status)}
              {getStatusText(user.status)}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Layanan:</span>
              <p className="font-medium text-gray-900 dark:text-white">{user.jenisLayanan}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Dokumen:</span>
              <p className="font-medium text-gray-900 dark:text-white">{user.documents.length} file</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Petugas:</span>
              <p className="font-medium text-gray-900 dark:text-white">{user.fieldOfficerName}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Waktu:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {format(user.createdAt, 'dd/MM/yy HH:mm', { locale: id })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}