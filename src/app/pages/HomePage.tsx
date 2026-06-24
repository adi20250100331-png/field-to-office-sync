import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserCircle, Shield, FileText, Zap, Camera, Cloud, Bell, Mail } from 'lucide-react';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';
import { Footer } from '../components/Footer';
import { DevelopmentModeBanner } from '../components/DevelopmentModeBanner';
import { ThemeToggle } from '../components/ThemeToggle';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5F7] via-white to-[#F7FCE6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-[#17A2B8]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-[#C4D600]/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#5DCCDE]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        {/* Header with Logo - ANIMATED */}
        <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            {/* Logo dengan animasi bounce dan glow */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#17A2B8] via-[#C4D600] to-[#17A2B8] rounded-full blur-2xl opacity-30 group-hover:opacity-50 animate-pulse"></div>
              {/* Logo dengan multiple animations */}
              <img 
                src={kemenkesLogo} 
                alt="Kemenkes" 
                className="h-16 sm:h-20 md:h-24 w-auto relative z-10 
                           animate-[bounce_2s_ease-in-out_3,fadeIn_1s_ease-out]
                           hover:scale-110 transition-transform duration-500
                           drop-shadow-2xl" 
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#17A2B8] to-[#C4D600] bg-clip-text text-transparent px-4 animate-[fadeInUp_0.8s_ease-out]">
            Field-to-Office Sync
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 animate-[fadeInUp_1s_ease-out]">
            Sistem Sinkronisasi Data Lapangan Kemenkes Secara Real-Time
          </p>
        </div>

        {/* Development Mode Banner */}
        <div className="max-w-5xl mx-auto mb-6">
          <DevelopmentModeBanner />
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
          {/* Field Officer Card */}
          <Card className="group border-0 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(23,162,184,0.5)] transition-all duration-500 hover:-translate-y-2 md:hover:-translate-y-3 bg-gradient-to-br from-[#17A2B8]/95 to-[#138496]/95 text-white overflow-hidden relative backdrop-blur-2xl border border-white/20">
            {/* Animated Glass Layers */}
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full translate-y-16 sm:translate-y-24 -translate-x-16 sm:-translate-x-24 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-xl"></div>
            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border-t border-l border-white/20"></div>
            <CardHeader className="relative z-20 p-4 sm:p-6">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-white/20 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-500">
                  <UserCircle className="size-12 sm:size-14 md:size-16 text-white drop-shadow-2xl" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl sm:text-3xl text-white drop-shadow-2xl font-bold">Petugas Lapangan</CardTitle>
              <CardDescription className="text-center text-white/95 text-sm sm:text-base drop-shadow-lg font-medium">
                Input data pengguna jasa dan scan dokumen di lokasi
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-20 p-4 sm:p-6">
              <Link to="/field-officer/login">
                <Button className="w-full bg-white/90 backdrop-blur-xl text-[#17A2B8] hover:bg-white hover:scale-105 shadow-2xl h-11 sm:h-12 border-2 border-white/60 ring-1 ring-white/30 font-bold transition-all duration-300" size="lg">
                  Masuk sebagai Petugas
                </Button>
              </Link>
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3 text-white/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                    <FileText className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Form input data digital</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-white/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                    <Camera className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Scan dokumen dengan OCR</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-white/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                    <Bell className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Notifikasi status verifikasi</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Customer Card */}
          <Card className="group border-0 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(92,145,247,0.5)] transition-all duration-500 hover:-translate-y-2 md:hover:-translate-y-3 bg-gradient-to-br from-[#5DCCDE]/95 to-[#17A2B8]/95 text-white overflow-hidden relative backdrop-blur-2xl border border-white/20">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full translate-y-16 sm:translate-y-24 -translate-x-16 sm:-translate-x-24 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-xl"></div>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border-t border-l border-white/20"></div>
            <CardHeader className="relative z-20 p-4 sm:p-6">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-white/20 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-500">
                  <Cloud className="size-12 sm:size-14 md:size-16 text-white drop-shadow-2xl" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl sm:text-3xl text-white drop-shadow-2xl font-bold">Pelanggan</CardTitle>
              <CardDescription className="text-center text-white/95 text-sm sm:text-base drop-shadow-lg font-medium">
                Daftar dan masuk untuk akses layanan pelanggan dengan cepat
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-20 p-4 sm:p-6">
              <div className="grid gap-3">
                <Link to="/register">
                  <Button className="w-full bg-white/90 backdrop-blur-xl text-[#17A2B8] hover:bg-white hover:scale-105 shadow-2xl h-11 sm:h-12 border-2 border-white/60 ring-1 ring-white/30 font-bold transition-all duration-300" size="lg">
                    Daftar Pelanggan
                  </Button>
                </Link>
                <Link to="/customer/login">
                  <Button variant="outline" className="w-full h-11 sm:h-12 rounded-xl border-white/60 text-white hover:bg-white/10 transition-all duration-300">
                    Masuk Pelanggan
                  </Button>
                </Link>
              </div>
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3 text-white/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                    <Mail className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Masuk dengan email</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-white/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                    <FileText className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Akun langsung aktif</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-white/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                    <Bell className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Tanpa aktivasi admin</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="group border-0 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(196,214,0,0.5)] transition-all duration-500 hover:-translate-y-2 md:hover:-translate-y-3 bg-gradient-to-br from-[#C4D600]/95 to-[#A8B700]/95 text-gray-900 overflow-hidden relative backdrop-blur-2xl border border-white/30">
            {/* Animated Glass Layers */}
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/15 rounded-full -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 blur-3xl group-hover:bg-white/25 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/15 rounded-full translate-y-16 sm:translate-y-24 -translate-x-16 sm:-translate-x-24 blur-3xl group-hover:bg-white/25 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 backdrop-blur-xl"></div>
            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md border-t border-l border-white/30"></div>
            <CardHeader className="relative z-20 p-4 sm:p-6">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-white/35 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/50 ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="size-12 sm:size-14 md:size-16 text-gray-900 drop-shadow-2xl" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl sm:text-3xl text-gray-900 drop-shadow-2xl font-bold">Admin Kantor</CardTitle>
              <CardDescription className="text-center text-gray-900/90 text-sm sm:text-base drop-shadow-lg font-medium">
                Verifikasi data dari lapangan secara real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-20 p-4 sm:p-6">
              <Link to="/admin/login">
                <Button className="w-full bg-gray-900/95 backdrop-blur-xl text-white hover:bg-gray-900 hover:scale-105 shadow-2xl h-11 sm:h-12 border-2 border-gray-800/60 ring-1 ring-gray-800/30 font-bold transition-all duration-300" size="lg">
                  Masuk sebagai Admin
                </Button>
              </Link>
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3 text-gray-900/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/35 backdrop-blur-xl border-2 border-white/50 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/40 transition-colors duration-300">
                    <Zap className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Dashboard real-time</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-gray-900/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/35 backdrop-blur-xl border-2 border-white/50 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/40 transition-colors duration-300">
                    <Shield className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Verifikasi & validasi data</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-gray-900/95 text-sm sm:text-base">
                  <div className="size-7 sm:size-8 rounded-full bg-white/35 backdrop-blur-xl border-2 border-white/50 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/40 transition-colors duration-300">
                    <Bell className="size-3 sm:size-4 drop-shadow" />
                  </div>
                  <span className="drop-shadow-lg font-medium">Kirim status ke petugas</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tech Architecture Link */}
        <div className="text-center mb-12 sm:mb-16 px-4">
          <Link to="/architecture">
            <Button variant="outline" size="lg" className="gap-2 border-[#17A2B8] text-[#17A2B8] hover:bg-[#17A2B8] hover:text-white shadow-md text-sm sm:text-base h-11 sm:h-12 px-4 sm:px-6">
              <FileText className="size-4 sm:size-5" />
              <span className="hidden xs:inline">Lihat Arsitektur & Dokumentasi Teknis</span>
              <span className="xs:hidden">Dokumentasi</span>
            </Button>
          </Link>
        </div>

        {/* Unit Layanan Info */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <Card className="group border-0 shadow-2xl hover:shadow-[0_25px_70px_-20px_rgba(23,162,184,0.4)] overflow-hidden backdrop-blur-2xl bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-gray-600/40 transition-all duration-500">
            <div className="bg-gradient-to-r from-[#17A2B8]/95 to-[#138496]/95 backdrop-blur-xl text-white p-6 sm:p-8 relative overflow-hidden border-b border-white/20">
              {/* Enhanced Glass Effect Layers */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/15 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/15 rounded-full translate-y-24 -translate-x-24 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent backdrop-blur-xl"></div>
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md"></div>
              
              <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 relative z-20">
                <div className="size-16 sm:size-20 rounded-2xl bg-white/90 backdrop-blur-2xl p-2 flex items-center justify-center flex-shrink-0 shadow-2xl mx-auto md:mx-0 border-2 border-white/50 ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-500">
                  <img src={kemenkesLogo} alt="Kemenkes" className="h-12 sm:h-16 w-auto drop-shadow-lg" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 drop-shadow-2xl">Balai Kekarantinaan Kesehatan Kelas I Kupang</h2>
                  <p className="text-white/95 mb-4 text-sm sm:text-base drop-shadow-lg font-medium">Unit Layanan Kementerian Kesehatan RI</p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-white/95">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="size-9 sm:size-10 rounded-xl bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="size-4 sm:size-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-white/80 drop-shadow font-medium">Alamat</p>
                        <p className="font-semibold text-sm sm:text-base drop-shadow-lg">Jl. Adi Sucipto Penfui - Kupang</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="size-9 sm:size-10 rounded-xl bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="size-4 sm:size-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-white/80 drop-shadow font-medium">Telepon</p>
                        <p className="font-semibold text-sm sm:text-base drop-shadow-lg">(0380) 8806692</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="size-9 sm:size-10 rounded-xl bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="size-4 sm:size-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-white/80 drop-shadow font-medium">Email</p>
                        <p className="font-semibold text-sm sm:text-base break-all drop-shadow-lg">bkkkupang@kemkes.go.id</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="size-9 sm:size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <svg className="size-4 sm:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-white/70">Website</p>
                        <a 
                          href="https://www.bkkkupang.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium hover:text-[#C4D600] transition-colors text-sm sm:text-base"
                        >
                          www.bkkkupang.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3 sm:col-span-2">
                      <div className="size-9 sm:size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <svg className="size-4 sm:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-white/70">Media Sosial</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <a 
                            href="https://instagram.com/balaikarkeskupang" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 sm:px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs sm:text-sm font-medium transition-colors"
                          >
                            Instagram
                          </a>
                          <a 
                            href="https://facebook.com/balaikarkeskupang" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 sm:px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs sm:text-sm font-medium transition-colors"
                          >
                            Facebook
                          </a>
                        </div>
                        <p className="font-medium text-xs sm:text-sm mt-1">@balaikarkeskupang</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900">
              Fitur Unggulan
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Solusi digital untuk efisiensi kerja lapangan</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#E8F5F7]">
              <CardHeader className="p-4 sm:p-6">
                <div className="size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <FileText className="size-6 sm:size-7 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Dynamic Form Input</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Form digital untuk mengisi data identitas dan detail layanan dengan validasi otomatis
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#E8F5F7]">
              <CardHeader className="p-4 sm:p-6">
                <div className="size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Camera className="size-6 sm:size-7 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Smart Document Scanner</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Integrasi kamera dengan OCR untuk memindai KTP, KK, dan dokumen lainnya secara otomatis
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#E8F5F7]">
              <CardHeader className="p-4 sm:p-6">
                <div className="size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#C4D600] to-[#D8E64D] flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Zap className="size-6 sm:size-7 text-gray-900" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Real-Time Sync</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Data lapangan langsung muncul di dashboard admin tanpa delay atau refresh manual
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#F7FCE6]">
              <CardHeader className="p-4 sm:p-6">
                <div className="size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#C4D600] to-[#D8E64D] flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Bell className="size-6 sm:size-7 text-gray-900" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Instant Verification</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Sistem notifikasi real-time untuk status verifikasi dari admin ke petugas lapangan
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#F7FCE6]">
              <CardHeader className="p-4 sm:p-6">
                <div className="size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#C4D600] to-[#D8E64D] flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Cloud className="size-6 sm:size-7 text-gray-900" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Cloud Storage</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Penyimpanan otomatis untuk dokumen hasil scan tanpa memenuhi memori ponsel
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#E8F5F7]">
              <CardHeader className="p-4 sm:p-6">
                <div className="size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#17A2B8] to-[#5DCCDE] flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Shield className="size-6 sm:size-7 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Offline Support</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Data tersimpan lokal dan otomatis sync saat koneksi internet tersedia kembali
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}