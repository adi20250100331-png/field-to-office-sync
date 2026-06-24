import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { validateNIKFormat, autoFormatNIK, cleanNIK, type NIKValidationResult } from '../utils/nikValidator';

interface NIKInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
  showDetails?: boolean;
  className?: string;
  autoFormat?: boolean;
}

export function NIKInput({
  value,
  onChange,
  label = 'NIK (Nomor Induk Kependudukan)',
  placeholder = 'Masukkan 16 digit NIK',
  required = true,
  disabled = false,
  showValidation = true,
  showDetails = true,
  className = '',
  autoFormat = true
}: NIKInputProps) {
  const [validation, setValidation] = useState<NIKValidationResult | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (value) {
      const cleanedValue = cleanNIK(value);
      const result = validateNIKFormat(cleanedValue);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (autoFormat) {
      // Auto-format with dots
      const formatted = autoFormatNIK(inputValue);
      onChange(formatted);
    } else {
      // Only allow numbers
      const cleaned = inputValue.replace(/\D/g, '').substring(0, 16);
      onChange(cleaned);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const getInputClassName = () => {
    if (!showValidation || !isTouched || !value) {
      return '';
    }

    if (validation?.isValid) {
      return 'border-green-500 focus-visible:ring-green-500';
    } else {
      return 'border-red-500 focus-visible:ring-red-500';
    }
  };

  const showError = showValidation && isTouched && validation && !validation.isValid;
  const showSuccess = showValidation && validation?.isValid;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="nik-input" className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        
        {showSuccess && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 gap-1">
            <CheckCircle className="size-3" />
            Valid
          </Badge>
        )}
      </div>

      <div className="relative">
        <Input
          id="nik-input"
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={autoFormat ? 19 : 16} // 16 digits + 3 dots
          className={`${getInputClassName()} font-mono`}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? 'nik-error' : showSuccess ? 'nik-success' : undefined}
        />
        
        {showValidation && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validation?.isValid ? (
              <CheckCircle className="size-5 text-green-500" />
            ) : isTouched ? (
              <XCircle className="size-5 text-red-500" />
            ) : (
              <AlertCircle className="size-5 text-yellow-500" />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {showError && (
        <div id="nik-error" className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <XCircle className="size-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">NIK tidak valid</p>
            <p className="text-xs mt-1">{validation?.error}</p>
          </div>
        </div>
      )}

      {/* Success Message with Details */}
      {showSuccess && showDetails && validation?.details && (
        <div id="nik-success" className="space-y-2 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
            <CheckCircle className="size-4" />
            NIK Valid
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <User className="size-3.5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400">Jenis Kelamin</p>
                <p className="font-medium text-gray-900 dark:text-white">{validation.details.jenisKelamin}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400">Tanggal Lahir</p>
                <p className="font-medium text-gray-900 dark:text-white">{validation.details.tanggalLahir}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-green-200 dark:border-green-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Kode Wilayah:</span> {validation.details.provinsi}.{validation.details.kabupatenKota}.{validation.details.kecamatan}
            </p>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!value && !isTouched && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {autoFormat 
            ? 'Format: XX.XXXX.XXXXXX.XXXX (akan diformat otomatis)' 
            : 'Masukkan 16 digit angka tanpa spasi atau tanda baca'}
        </p>
      )}
    </div>
  );
}
