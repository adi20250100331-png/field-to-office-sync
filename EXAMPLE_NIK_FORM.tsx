/**
 * EXAMPLE: Simple Form with NIK Validation
 * 
 * This file shows a complete example of how to use NIKInput component
 * in a form with proper validation and submission.
 * 
 * Copy this pattern to your own forms!
 */

import { useState } from 'react';
import { NIKInput } from './src/app/components/NIKInput';
import { Button } from './src/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './src/app/components/ui/card';
import { Input } from './src/app/components/ui/input';
import { Label } from './src/app/components/ui/label';
import { validateNIKFormat, cleanNIK, formatNIKDisplay } from './src/app/utils/nikValidator';
import { toast } from 'sonner';

export function ExampleNIKForm() {
  // Form state
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate NIK
    const cleanedNIK = cleanNIK(nik);
    const nikValidation = validateNIKFormat(cleanedNIK);
    
    if (!nikValidation.isValid) {
      toast.error('NIK tidak valid', {
        description: nikValidation.error
      });
      return;
    }

    // 2. Validate other required fields
    if (!nama.trim()) {
      toast.error('Nama harus diisi');
      return;
    }

    if (!alamat.trim()) {
      toast.error('Alamat harus diisi');
      return;
    }

    // 3. Submit data
    setIsSubmitting(true);
    
    try {
      // Example: Save to database
      const formData = {
        nik: cleanedNIK, // Save as 16 digits without formatting
        nama: nama.trim(),
        alamat: alamat.trim(),
        jenisKelamin: nikValidation.details?.jenisKelamin,
        tanggalLahir: nikValidation.details?.tanggalLahir,
        submittedAt: new Date().toISOString()
      };

      console.log('Submitting data:', formData);
      
      // Example API call:
      // await api.submitData(formData);
      
      toast.success('Data berhasil disimpan!', {
        description: `NIK: ${formatNIKDisplay(cleanedNIK)}`
      });

      // Reset form
      setNik('');
      setNama('');
      setAlamat('');
      
    } catch (error) {
      toast.error('Gagal menyimpan data', {
        description: 'Silakan coba lagi'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Formulir Pendaftaran</CardTitle>
          <CardDescription>
            Silakan lengkapi data berikut dengan benar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NIK Input with Validation */}
            <NIKInput
              value={nik}
              onChange={setNik}
              label="NIK (Nomor Induk Kependudukan)"
              placeholder="Contoh: 3174012508900001"
              required
              showValidation
              showDetails
              autoFormat
              disabled={isSubmitting}
            />

            {/* Nama Input */}
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Alamat Input */}
            <div className="space-y-2">
              <Label htmlFor="alamat">
                Alamat Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="alamat"
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Masukkan alamat lengkap"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setNik('');
                  setNama('');
                  setAlamat('');
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview (only shown when NIK is valid) */}
      {nik && validateNIKFormat(cleanNIK(nik)).isValid && (
        <Card className="mt-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg text-green-700 dark:text-green-400">
              Preview Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-600 dark:text-gray-400">NIK</p>
                <p className="font-mono font-medium text-gray-900 dark:text-white">
                  {formatNIKDisplay(cleanNIK(nik))}
                </p>
              </div>
              
              {validateNIKFormat(cleanNIK(nik)).details && (
                <>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Jenis Kelamin</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {validateNIKFormat(cleanNIK(nik)).details?.jenisKelamin}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Tanggal Lahir</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {validateNIKFormat(cleanNIK(nik)).details?.tanggalLahir}
                    </p>
                  </div>
                </>
              )}
              
              {nama && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Nama</p>
                  <p className="font-medium text-gray-900 dark:text-white">{nama}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * USAGE IN YOUR APP:
 * 
 * 1. Copy this component to your project
 * 2. Import and use it:
 * 
 *    import { ExampleNIKForm } from './ExampleNIKForm';
 *    
 *    function App() {
 *      return <ExampleNIKForm />;
 *    }
 * 
 * 3. Customize as needed:
 *    - Add more form fields
 *    - Change validation logic
 *    - Integrate with your API
 *    - Modify styling
 */

/**
 * KEY POINTS:
 * 
 * 1. NIK Validation:
 *    - Use cleanNIK() to remove formatting before validation
 *    - Use validateNIKFormat() to check if NIK is valid
 *    - Check nikValidation.isValid before submitting
 * 
 * 2. Saving to Database:
 *    - Save the CLEANED NIK (16 digits, no dots)
 *    - Save extracted info (gender, DOB) for reference
 * 
 * 3. Displaying:
 *    - Use formatNIKDisplay() for user-friendly display
 *    - Use maskNIK() for privacy-sensitive display
 * 
 * 4. Error Handling:
 *    - Show specific error messages from nikValidation.error
 *    - Use toast for user feedback
 * 
 * 5. User Experience:
 *    - Auto-format makes input easier
 *    - Real-time validation gives immediate feedback
 *    - Show extracted info (gender, DOB) for confirmation
 */
