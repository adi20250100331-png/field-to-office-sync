import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import kemenkesLogo from 'figma:asset/ecc0fdfa2809893752e8251b46dd7ec2fd7fdac9.png';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#17A2B8] to-[#138496] text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Unit Name */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-16 rounded-xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-lg">
                <img src={kemenkesLogo} alt="Kemenkes" className="h-12 w-auto" />
              </div>
              <div>
                <h3 className="font-bold text-lg">BKK Kelas I Kupang</h3>
                <p className="text-sm text-white/80">Kementerian Kesehatan RI</p>
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Balai Kekarantinaan Kesehatan Kelas I Kupang
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg mb-4">Kontak</h4>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="size-5 flex-shrink-0 mt-0.5 text-[#C4D600]" />
              <p className="text-white/90">
                Jl. Adi Sucipto Penfui - Kupang
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="size-5 flex-shrink-0 text-[#C4D600]" />
              <a href="tel:+6203808806692" className="text-white/90 hover:text-white transition-colors">
                (0380) 8806692
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-5 flex-shrink-0 text-[#C4D600]" />
              <a href="mailto:bkkkupang@kemkes.go.id" className="text-white/90 hover:text-white transition-colors">
                bkkkupang@kemkes.go.id
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="size-5 flex-shrink-0 text-[#C4D600]" />
              <a 
                href="https://www.bkkkupang.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
              >
                www.bkkkupang.com
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg mb-4">Media Sosial</h4>
            <p className="text-white/90 text-sm mb-3">@balaikarkeskupang</p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/balaikarkeskupang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/balaikarkeskupang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
            <p>© 2026 Kementerian Kesehatan Republik Indonesia</p>
            <p>Balai Kekarantinaan Kesehatan Kelas I Kupang</p>
          </div>
        </div>
      </div>
    </footer>
  );
}