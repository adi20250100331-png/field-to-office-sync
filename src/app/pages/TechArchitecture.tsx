import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  Database,
  Smartphone,
  Cloud,
  Zap,
  Code,
  GitBranch,
  Server,
  Shield,
  Camera,
  Wifi,
  CheckCircle,
  ArrowRight,
  Bell,
  Users
} from 'lucide-react';

export function TechArchitecture() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-purple-700 gap-2 mb-4">
              <ArrowLeft className="size-5" />
              Kembali ke Beranda
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Arsitektur & Dokumentasi Teknis</h1>
          <p className="text-purple-100">Field-to-Office Sync System</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="tech-stack" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="user-journey">User Journey</TabsTrigger>
            <TabsTrigger value="database">Database Schema</TabsTrigger>
            <TabsTrigger value="ui-ux">UI/UX Design</TabsTrigger>
          </TabsList>

          {/* Tech Stack */}
          <TabsContent value="tech-stack" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="size-6" />
                  Rekomendasi Tech Stack
                </CardTitle>
                <CardDescription>
                  Stack teknologi optimal untuk sistem Field-to-Office Sync
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mobile Application */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Smartphone className="size-5 text-blue-600" />
                    Mobile Application (Field Officer)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-base">React Native</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Cross-platform (iOS & Android)
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            JavaScript/TypeScript ecosystem
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Rich library untuk camera & OCR
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Hot reload untuk development cepat
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-base">Flutter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Performa native yang sangat baik
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            UI konsisten di semua platform
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Dart language yang modern
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Widget-based architecture
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">✅ Rekomendasi: React Native</p>
                    <p className="text-sm text-green-700 mt-1">
                      Lebih cocok jika tim sudah familiar dengan JavaScript/React, ecosystem yang matang untuk enterprise app
                    </p>
                  </div>
                </div>

                {/* Backend & Database */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Database className="size-5 text-purple-600" />
                    Backend & Real-Time Database
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-base">Supabase (Recommended)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            PostgreSQL database real-time
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Built-in Authentication & Authorization
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Storage untuk dokumen
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Real-time subscriptions
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Edge functions untuk logic
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-base">Firebase</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Firestore real-time database
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Firebase Authentication
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Cloud Storage
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Cloud Messaging (push notif)
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Mature ecosystem
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">✅ Rekomendasi: Supabase</p>
                    <p className="text-sm text-green-700 mt-1">
                      Open-source, SQL database lebih powerful untuk query kompleks, lebih cost-effective untuk long-term
                    </p>
                  </div>
                </div>

                {/* Web Dashboard */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Server className="size-5 text-green-600" />
                    Web Dashboard (Admin Office)
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-base">React + Vite</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-700">
                        Fast build, modern tooling, component-based
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-base">TypeScript</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-700">
                        Type safety, better IDE support, maintainable code
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-base">Tailwind CSS</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-700">
                        Rapid UI development, responsive design
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Additional Technologies */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GitBranch className="size-5 text-orange-600" />
                    Additional Technologies
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Camera className="size-4" />
                          OCR & Document Processing
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li><strong>Google ML Kit:</strong> On-device OCR, offline capable</li>
                          <li><strong>Tesseract.js:</strong> Open-source OCR engine</li>
                          <li><strong>react-native-vision-camera:</strong> Advanced camera features</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Wifi className="size-4" />
                          Real-Time Communication
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li><strong>WebSocket:</strong> Bidirectional communication</li>
                          <li><strong>Supabase Realtime:</strong> PostgreSQL changes subscription</li>
                          <li><strong>Push Notifications:</strong> Firebase Cloud Messaging</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Architecture Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-col items-center gap-6">
                    {/* Mobile App */}
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 text-white p-4 rounded-lg text-center min-w-[200px]">
                        <Smartphone className="size-8 mx-auto mb-2" />
                        <p className="font-semibold">Mobile App</p>
                        <p className="text-sm text-blue-100">Field Officer</p>
                      </div>
                    </div>

                    <ArrowRight className="size-8 text-gray-400 rotate-90" />

                    {/* Backend Layer */}
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-600 text-white p-4 rounded-lg text-center min-w-[200px]">
                        <Database className="size-8 mx-auto mb-2" />
                        <p className="font-semibold">Supabase</p>
                        <p className="text-sm text-purple-100">Backend + DB</p>
                      </div>
                      <div className="bg-orange-600 text-white p-4 rounded-lg text-center min-w-[200px]">
                        <Cloud className="size-8 mx-auto mb-2" />
                        <p className="font-semibold">Cloud Storage</p>
                        <p className="text-sm text-orange-100">Documents</p>
                      </div>
                    </div>

                    <ArrowRight className="size-8 text-gray-400 rotate-90" />

                    {/* Web Dashboard */}
                    <div className="flex items-center gap-4">
                      <div className="bg-green-600 text-white p-4 rounded-lg text-center min-w-[200px]">
                        <Server className="size-8 mx-auto mb-2" />
                        <p className="font-semibold">Web Dashboard</p>
                        <p className="text-sm text-green-100">Admin Office</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Zap className="size-4 text-yellow-600" />
                    <span>Real-time sync via WebSocket</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Journey */}
          <TabsContent value="user-journey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alur Kerja Sistem (End-to-End User Journey)</CardTitle>
                <CardDescription>
                  Langkah demi langkah dari pengumpulan data hingga verifikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Petugas Lapangan Login ke Aplikasi Mobile</h4>
                      <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Actor:</strong> Petugas Lapangan (Adhy)</p>
                        <p><strong>Action:</strong> Login dengan kredensial terverifikasi</p>
                        <p><strong>System:</strong> Authenticate user, sync data lokal dengan server</p>
                        <p><strong>Output:</strong> Dashboard petugas dengan riwayat pengajuan</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="size-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Pengguna Jasa Mengisi Form Digital</h4>
                      <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Actor:</strong> Pengguna Jasa (dengan bantuan Petugas)</p>
                        <p><strong>Action:</strong> Input data identitas (Nama, NIK, Alamat, dll)</p>
                        <p><strong>System:</strong> Validasi real-time (format NIK, email, dll)</p>
                        <p><strong>Output:</strong> Form tervalidasi, siap untuk scan dokumen</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="size-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Scan Dokumen dengan Smart Scanner</h4>
                      <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Actor:</strong> Petugas Lapangan</p>
                        <p><strong>Action:</strong> Buka kamera, arahkan ke dokumen (KTP/KK/NPWP)</p>
                        <div>
                          <p><strong>System:</strong></p>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Auto-detect tepi dokumen (edge detection)</li>
                            <li>Auto-crop dan straighten</li>
                            <li>Apply filter untuk meningkatkan clarity</li>
                            <li>Run OCR untuk ekstraksi teks</li>
                            <li>Auto-fill form jika data terdeteksi</li>
                            <li>Upload ke cloud storage</li>
                          </ul>
                        </div>
                        <p><strong>Output:</strong> Dokumen tersimpan dengan metadata OCR</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="size-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Data Disinkronkan ke Server (Real-Time)</h4>
                      <div className="bg-purple-50 p-4 rounded-lg text-sm space-y-2">
                        <div>
                          <p><strong>System:</strong></p>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Data dikirim via HTTPS ke Supabase</li>
                            <li>Insert ke database dengan status "pending"</li>
                            <li>Trigger WebSocket event</li>
                            <li>Notifikasi ke dashboard admin</li>
                          </ul>
                        </div>
                        <p><strong>Output:</strong> Data tersimpan, admin langsung melihat data baru</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="size-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                        5
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Admin Kantor Menerima Data (Real-Time)</h4>
                      <div className="bg-green-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Actor:</strong> Admin Kantor</p>
                        <p><strong>Action:</strong> Melihat dashboard web, data baru muncul otomatis</p>
                        <p><strong>System:</strong> WebSocket push notifikasi, counter update</p>
                        <p><strong>Output:</strong> Data siap untuk diverifikasi</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="size-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 6 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                        6
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Admin Melakukan Verifikasi</h4>
                      <div className="bg-green-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Actor:</strong> Admin Kantor</p>
                        <div>
                          <p><strong>Action:</strong></p>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Klik pada data untuk melihat detail</li>
                            <li>Review dokumen (zoom, compare dengan data)</li>
                            <li>Pilih status: Terverifikasi / Tidak Lengkap / Ditolak</li>
                            <li>Tulis catatan untuk petugas</li>
                            <li>Klik "Kirim Verifikasi"</li>
                          </ul>
                        </div>
                        <p><strong>System:</strong> Update status di database, trigger notifikasi</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="size-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 7 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        7
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Petugas Menerima Notifikasi (Instant)</h4>
                      <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Actor:</strong> Petugas Lapangan</p>
                        <div>
                          <p><strong>System:</strong></p>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Push notification ke mobile app</li>
                            <li>Update badge counter di app</li>
                            <li>In-app notification dengan detail status</li>
                          </ul>
                        </div>
                        <p><strong>Output:</strong> Petugas mengetahui status verifikasi secara real-time</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="size-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 8 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        8
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">Tindak Lanjut (Jika Diperlukan)</h4>
                      <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                        <p><strong>Jika Status = "Tidak Lengkap":</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Petugas membaca catatan dari admin</li>
                          <li>Melengkapi data/dokumen yang kurang</li>
                          <li>Re-submit data (kembali ke step 4)</li>
                        </ul>
                        <p className="mt-2"><strong>Jika Status = "Terverifikasi":</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Proses selesai</li>
                          <li>Data masuk ke archive</li>
                          <li>Dapat dicetak atau diekspor</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline View */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline Verifikasi (Typical Case)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">00:00</span>
                      <span>Petugas mulai mengisi form</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">03:00</span>
                      <span>Form selesai, mulai scan dokumen</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">05:00</span>
                      <span>OCR processing dokumen (auto)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">06:00</span>
                      <span>Data dikirim ke server</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">06:01</span>
                      <span className="font-semibold text-green-600">⚡ Admin melihat data di dashboard (real-time)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">08:00</span>
                      <span>Admin review data & dokumen</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">10:00</span>
                      <span>Admin kirim verifikasi</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono bg-white px-3 py-1 rounded border">10:01</span>
                      <span className="font-semibold text-blue-600">⚡ Petugas terima notifikasi (real-time)</span>
                    </div>
                  </div>
                  <div className="mt-6 text-center p-4 bg-green-100 border border-green-300 rounded-lg">
                    <p className="font-semibold text-green-800">⏱️ Total Waktu: ~10 menit</p>
                    <p className="text-sm text-green-700 mt-1">
                      Bandingkan dengan metode manual tradisional: 1-3 hari
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Schema */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-6" />
                  Skema Database (Supabase PostgreSQL)
                </CardTitle>
                <CardDescription>
                  Struktur tabel dan relasi antar entitas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Table: users */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Shield className="size-5 text-blue-600" />
                    Table: <code className="bg-gray-100 px-2 py-1 rounded text-sm">users</code>
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="text-left p-3 border-b">Column</th>
                          <th className="text-left p-3 border-b">Type</th>
                          <th className="text-left p-3 border-b">Constraint</th>
                          <th className="text-left p-3 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge>PRIMARY KEY</Badge></td>
                          <td className="p-3">Unique identifier</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">email</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(255)</td>
                          <td className="p-3"><Badge>UNIQUE</Badge> <Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">Email pengguna</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">name</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(255)</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">Nama lengkap</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">role</td>
                          <td className="p-3 font-mono text-xs">ENUM</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">'field_officer' | 'admin'</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">created_at</td>
                          <td className="p-3 font-mono text-xs">TIMESTAMP</td>
                          <td className="p-3"><Badge variant="outline">DEFAULT NOW()</Badge></td>
                          <td className="p-3">Waktu registrasi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table: service_users */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Users className="size-5 text-green-600" />
                    Table: <code className="bg-gray-100 px-2 py-1 rounded text-sm">service_users</code>
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="text-left p-3 border-b">Column</th>
                          <th className="text-left p-3 border-b">Type</th>
                          <th className="text-left p-3 border-b">Constraint</th>
                          <th className="text-left p-3 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge>PRIMARY KEY</Badge></td>
                          <td className="p-3">Unique identifier</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">nama</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(255)</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">Nama pengguna jasa</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">nik</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(16)</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">Nomor Induk Kependudukan</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">alamat</td>
                          <td className="p-3 font-mono text-xs">TEXT</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">Alamat lengkap</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">no_telepon</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(20)</td>
                          <td className="p-3">-</td>
                          <td className="p-3">Nomor telepon</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">email</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(255)</td>
                          <td className="p-3">-</td>
                          <td className="p-3">Email</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">jenis_layanan</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(100)</td>
                          <td className="p-3">-</td>
                          <td className="p-3">Jenis layanan yang diajukan</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">keterangan</td>
                          <td className="p-3 font-mono text-xs">TEXT</td>
                          <td className="p-3">-</td>
                          <td className="p-3">Keterangan tambahan</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">status</td>
                          <td className="p-3 font-mono text-xs">ENUM</td>
                          <td className="p-3"><Badge variant="outline">DEFAULT 'pending'</Badge></td>
                          <td className="p-3">'pending' | 'verified' | 'rejected' | 'incomplete'</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">status_message</td>
                          <td className="p-3 font-mono text-xs">TEXT</td>
                          <td className="p-3">-</td>
                          <td className="p-3">Catatan dari admin</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">field_officer_id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge className="bg-purple-100 text-purple-800">FOREIGN KEY</Badge></td>
                          <td className="p-3">Referensi ke users.id</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">created_at</td>
                          <td className="p-3 font-mono text-xs">TIMESTAMP</td>
                          <td className="p-3"><Badge variant="outline">DEFAULT NOW()</Badge></td>
                          <td className="p-3">Waktu pengajuan</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">updated_at</td>
                          <td className="p-3 font-mono text-xs">TIMESTAMP</td>
                          <td className="p-3"><Badge variant="outline">DEFAULT NOW()</Badge></td>
                          <td className="p-3">Waktu update terakhir</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table: documents */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Camera className="size-5 text-orange-600" />
                    Table: <code className="bg-gray-100 px-2 py-1 rounded text-sm">documents</code>
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="text-left p-3 border-b">Column</th>
                          <th className="text-left p-3 border-b">Type</th>
                          <th className="text-left p-3 border-b">Constraint</th>
                          <th className="text-left p-3 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge>PRIMARY KEY</Badge></td>
                          <td className="p-3">Unique identifier</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">service_user_id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge className="bg-purple-100 text-purple-800">FOREIGN KEY</Badge></td>
                          <td className="p-3">Referensi ke service_users.id</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">type</td>
                          <td className="p-3 font-mono text-xs">ENUM</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">'KTP' | 'KK' | 'NPWP' | 'OTHER'</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">storage_url</td>
                          <td className="p-3 font-mono text-xs">TEXT</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">URL di Supabase Storage</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">ocr_data</td>
                          <td className="p-3 font-mono text-xs">JSONB</td>
                          <td className="p-3">-</td>
                          <td className="p-3">Data hasil OCR (NIK, nama, dll)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">file_size</td>
                          <td className="p-3 font-mono text-xs">BIGINT</td>
                          <td className="p-3">-</td>
                          <td className="p-3">Ukuran file (bytes)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">uploaded_at</td>
                          <td className="p-3 font-mono text-xs">TIMESTAMP</td>
                          <td className="p-3"><Badge variant="outline">DEFAULT NOW()</Badge></td>
                          <td className="p-3">Waktu upload</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table: notifications */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Bell className="size-5 text-red-600" />
                    Table: <code className="bg-gray-100 px-2 py-1 rounded text-sm">notifications</code>
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="text-left p-3 border-b">Column</th>
                          <th className="text-left p-3 border-b">Type</th>
                          <th className="text-left p-3 border-b">Constraint</th>
                          <th className="text-left p-3 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge>PRIMARY KEY</Badge></td>
                          <td className="p-3">Unique identifier</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">user_id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge className="bg-purple-100 text-purple-800">FOREIGN KEY</Badge></td>
                          <td className="p-3">Referensi ke users.id (penerima)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">service_user_id</td>
                          <td className="p-3 font-mono text-xs">UUID</td>
                          <td className="p-3"><Badge className="bg-purple-100 text-purple-800">FOREIGN KEY</Badge></td>
                          <td className="p-3">Referensi ke service_users.id</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">type</td>
                          <td className="p-3 font-mono text-xs">ENUM</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">'verification' | 'message'</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">title</td>
                          <td className="p-3 font-mono text-xs">VARCHAR(255)</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">Judul notifikasi</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">message</td>
                          <td className="p-3 font-mono text-xs">TEXT</td>
                          <td className="p-3"><Badge variant="outline">NOT NULL</Badge></td>
                          <td className="p-3">Isi pesan</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">read</td>
                          <td className="p-3 font-mono text-xs">BOOLEAN</td>
                          <td className="p-3"><Badge variant="outline">DEFAULT FALSE</Badge></td>
                          <td className="p-3">Status baca</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">created_at</td>
                          <td className="p-3 font-mono text-xs">TIMESTAMP</td>
                          <td className="p-3"><Badge variant="outline">DEFAULT NOW()</Badge></td>
                          <td className="p-3">Waktu notifikasi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Relationships */}
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-lg mb-4">Relasi Antar Tabel</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Badge className="flex-shrink-0">1:N</Badge>
                      <p><strong>users (field_officer)</strong> → <strong>service_users</strong></p>
                      <p className="text-gray-600">Satu petugas dapat mengajukan banyak data</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="flex-shrink-0">1:N</Badge>
                      <p><strong>service_users</strong> → <strong>documents</strong></p>
                      <p className="text-gray-600">Satu pengajuan dapat memiliki banyak dokumen</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="flex-shrink-0">1:N</Badge>
                      <p><strong>users</strong> → <strong>notifications</strong></p>
                      <p className="text-gray-600">Satu user dapat menerima banyak notifikasi</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="flex-shrink-0">1:N</Badge>
                      <p><strong>service_users</strong> → <strong>notifications</strong></p>
                      <p className="text-gray-600">Satu pengajuan dapat menghasilkan banyak notifikasi</p>
                    </div>
                  </div>
                </div>

                {/* Indexes */}
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-lg mb-4">Recommended Indexes</h3>
                  <div className="space-y-2 text-sm font-mono">
                    <p>CREATE INDEX idx_service_users_status ON service_users(status);</p>
                    <p>CREATE INDEX idx_service_users_officer ON service_users(field_officer_id);</p>
                    <p>CREATE INDEX idx_documents_user ON documents(service_user_id);</p>
                    <p>CREATE INDEX idx_notifications_user ON notifications(user_id, read);</p>
                    <p>CREATE INDEX idx_service_users_created ON service_users(created_at DESC);</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UI/UX Design */}
          <TabsContent value="ui-ux" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prinsip Desain UI/UX</CardTitle>
                <CardDescription>
                  Panduan desain untuk penggunaan outdoor dan efisiensi maksimal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mobile Design Principles */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Mobile App (Field Officer)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-base">High Contrast Mode</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p><strong>Warna:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Background: Pure white (#FFFFFF)</li>
                          <li>Text: Dark gray (#1F2937)</li>
                          <li>Primary: Bold blue (#2563EB)</li>
                          <li>Contrast ratio minimum: 7:1</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Mudah dibaca di bawah sinar matahari</p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-base">Large Touch Targets</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p><strong>Ukuran minimum:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Button: 48x48 px (minimum 44x44)</li>
                          <li>Input field: 56px height</li>
                          <li>Spacing: 16px antar elemen</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Mudah digunakan dengan sarung tangan</p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-base">Minimal Input Steps</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Auto-fill dari OCR</li>
                          <li>Dropdown untuk pilihan berulang</li>
                          <li>Voice input untuk keterangan</li>
                          <li>Save draft otomatis</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Efisiensi waktu di lapangan</p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-base">Offline-First</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Local storage untuk draft</li>
                          <li>Queue untuk upload pending</li>
                          <li>Indicator koneksi jelas</li>
                          <li>Auto-sync when online</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Sinyal tidak stabil di lapangan</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Web Dashboard Design */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Web Dashboard (Admin Office)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-base">Information Hierarchy</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Stats overview di atas (at-a-glance)</li>
                          <li>Pending items prioritas tertinggi</li>
                          <li>Filter & search mudah dijangkau</li>
                          <li>Detail dalam modal/side panel</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Admin process banyak data</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Keyboard shortcuts (V = verify, R = reject)</li>
                          <li>Batch operations</li>
                          <li>One-click verification untuk data lengkap</li>
                          <li>Template untuk catatan berulang</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Kecepatan verifikasi</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-base">Data Visualization</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Chart untuk trend approval rate</li>
                          <li>Heatmap untuk jam sibuk</li>
                          <li>Leaderboard petugas terbaik</li>
                          <li>Real-time counter</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Insight & monitoring</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-base">Responsive Layout</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Sidebar collapse untuk fokus</li>
                          <li>Table → Card di mobile</li>
                          <li>Fixed header saat scroll</li>
                          <li>Breadcrumb navigation</li>
                        </ul>
                        <p className="mt-2"><strong>Alasan:</strong> Fleksibilitas device</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Color System */}
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-4">Color System</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="size-16 rounded-lg bg-blue-600 mb-2 border-2 border-white shadow"></div>
                      <p className="text-sm font-medium">Primary Blue</p>
                      <p className="text-xs text-gray-600">#2563EB</p>
                      <p className="text-xs">Field Officer</p>
                    </div>
                    <div>
                      <div className="size-16 rounded-lg bg-green-600 mb-2 border-2 border-white shadow"></div>
                      <p className="text-sm font-medium">Success Green</p>
                      <p className="text-xs text-gray-600">#16A34A</p>
                      <p className="text-xs">Admin / Verified</p>
                    </div>
                    <div>
                      <div className="size-16 rounded-lg bg-yellow-500 mb-2 border-2 border-white shadow"></div>
                      <p className="text-sm font-medium">Warning Yellow</p>
                      <p className="text-xs text-gray-600">#EAB308</p>
                      <p className="text-xs">Incomplete</p>
                    </div>
                    <div>
                      <div className="size-16 rounded-lg bg-red-600 mb-2 border-2 border-white shadow"></div>
                      <p className="text-sm font-medium">Danger Red</p>
                      <p className="text-xs text-gray-600">#DC2626</p>
                      <p className="text-xs">Rejected</p>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-4">Typography Scale</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold">Heading 1 - 30px Bold</p>
                      <p className="text-xs text-gray-600">Page titles</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">Heading 2 - 24px Bold</p>
                      <p className="text-xs text-gray-600">Section titles</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">Heading 3 - 20px Semibold</p>
                      <p className="text-xs text-gray-600">Card titles</p>
                    </div>
                    <div>
                      <p className="text-base">Body - 16px Regular</p>
                      <p className="text-xs text-gray-600">Main content</p>
                    </div>
                    <div>
                      <p className="text-sm">Small - 14px Regular</p>
                      <p className="text-xs text-gray-600">Secondary info</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    <strong>Font:</strong> System UI fonts (SF Pro, Roboto, Segoe UI) untuk performa optimal
                  </p>
                </div>

                {/* Accessibility */}
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-lg mb-4">Accessibility Standards</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">✅ WCAG 2.1 Level AA</p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                        <li>Contrast ratio 4.5:1 minimum</li>
                        <li>Focus indicators visible</li>
                        <li>Alt text untuk images</li>
                        <li>Form labels explicit</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">✅ Mobile Usability</p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                        <li>Touch target 44x44px minimum</li>
                        <li>No hover-only interactions</li>
                        <li>Orientation support (portrait/landscape)</li>
                        <li>Gestures alternative (swipe = button)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
