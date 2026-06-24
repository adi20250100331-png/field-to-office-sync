/**
 * ========================================
 * CONTOH VALIDASI BACKEND - GOOGLE APPS SCRIPT
 * ========================================
 * 
 * Tambahkan fungsi-fungsi ini ke file google-apps-script-backend.js
 * untuk menambah validasi server-side
 */

/**
 * Fungsi Validasi Form Data
 * Dipanggil sebelum menyimpan data ke sheet
 */
function validateFormData(data) {
  const errors = [];
  
  // 1. Validasi field wajib (waktu dan tempat)
  if (!data.tanggal || data.tanggal.trim() === '') {
    errors.push('Tanggal pemeriksaan harus diisi');
  }
  
  if (!data.lokasi || data.lokasi.trim() === '') {
    errors.push('Lokasi pemeriksaan harus diisi');
  }
  
  if (!data.nama_pengantar || data.nama_pengantar.trim() === '') {
    errors.push('Nama pengantar harus diisi');
  }
  
  if (!data.nama_pemeriksa || data.nama_pemeriksa.trim() === '') {
    errors.push('Nama pemeriksa harus diisi');
  }
  
  // 2. Validasi kelengkapan dokumen
  // Minimal salah satu dokumen harus dilampirkan
  const hasDokumen = data.surat_kematian || 
                     data.surat_pengawetan || 
                     data.surat_bebas_penyakit ||
                     data.surat_pemetian ||
                     data.berita_acara_pembongkaran ||
                     data.surat_kepolisian ||
                     data.identitas_jenazah ||
                     data.surat_kedutaan;
  
  if (!hasDokumen) {
    errors.push('Minimal salah satu dokumen kelengkapan harus dilampirkan');
  }
  
  // 3. Validasi kesimpulan pemeriksaan
  if (!data.kesimpulan || (data.kesimpulan !== 'memenuhi' && data.kesimpulan !== 'tidak-memenuhi')) {
    errors.push('Kesimpulan pemeriksaan harus ditentukan (memenuhi/tidak memenuhi syarat)');
  }
  
  // 4. Validasi khusus untuk Jenazah Penyakit Menular
  if (data.jenazah_penyakit_menular === true) {
    if (!data.infectious_protocol_confirmed) {
      errors.push('Protokol penyakit menular harus dikonfirmasi terlebih dahulu');
    }
    
    if (!data.infectious_protocol_timestamp) {
      errors.push('Timestamp konfirmasi protokol penyakit menular tidak valid');
    }
    
    // Validasi timestamp (harus valid ISO 8601)
    if (data.infectious_protocol_timestamp) {
      try {
        const timestamp = new Date(data.infectious_protocol_timestamp);
        if (isNaN(timestamp.getTime())) {
          errors.push('Format timestamp konfirmasi tidak valid');
        }
      } catch (e) {
        errors.push('Format timestamp konfirmasi tidak valid');
      }
    }
  }
  
  // 5. Validasi format tanggal
  if (data.tanggal) {
    try {
      const tanggal = new Date(data.tanggal);
      if (isNaN(tanggal.getTime())) {
        errors.push('Format tanggal tidak valid');
      }
      
      // Pastikan tanggal tidak lebih dari hari ini + 1 hari (toleransi timezone)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (tanggal > tomorrow) {
        errors.push('Tanggal pemeriksaan tidak boleh di masa depan');
      }
    } catch (e) {
      errors.push('Format tanggal tidak valid');
    }
  }
  
  // Jika ada error, throw dengan message yang di-join
  if (errors.length > 0) {
    throw new Error('Validasi gagal: ' + errors.join('; '));
  }
  
  return true;
}

/**
 * Validasi tambahan untuk data penyakit menular
 */
function validateInfectiousDisease(data) {
  if (!data.jenazah_penyakit_menular) {
    return true; // Skip validation jika bukan penyakit menular
  }
  
  // Log untuk audit trail
  logActivity({
    userId: data.fieldOfficerId || 'unknown',
    action: 'INFECTIOUS_DISEASE_CONFIRMED',
    entityType: 'service_user',
    entityId: data.id || 'pending',
    details: JSON.stringify({
      timestamp: data.infectious_protocol_timestamp,
      confirmed: data.infectious_protocol_confirmed,
      location: data.lokasi
    })
  });
  
  return true;
}

/**
 * Update fungsi createServiceUser() yang sudah ada
 * Tambahkan validasi sebelum menyimpan
 */
function createServiceUserWithValidation(e) {
  const postData = JSON.parse(e.postData.contents);
  const userData = postData.data;
  
  try {
    // VALIDASI DATA
    validateFormData(userData);
    validateInfectiousDisease(userData);
    
    // Jika lolos validasi, simpan ke sheet
    const sheet = getOrCreateSheet(SHEETS.SERVICE_USERS);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Buat user object dengan data penyakit menular (jika ada)
    const user = {
      id: generateId(),
      nama: userData.nama,
      nik: userData.nik || '-',
      alamat: userData.alamat || userData.lokasi,
      noTelepon: userData.noTelepon || '-',
      email: userData.email || '-',
      jenisLayanan: userData.jenisLayanan || 'Pemeriksaan dan Pengepakan Jenazah',
      keterangan: userData.keterangan || '',
      status: userData.status || 'pending',
      statusMessage: userData.statusMessage || '',
      fieldOfficerId: userData.fieldOfficerId || '',
      fieldOfficerName: userData.fieldOfficerName || '',
      
      // Data tambahan untuk pemeriksaan jenazah
      tanggal_pemeriksaan: userData.tanggal || '',
      lokasi_pemeriksaan: userData.lokasi || '',
      nama_pengantar: userData.nama_pengantar || '',
      nama_pemeriksa: userData.nama_pemeriksa || '',
      kesimpulan: userData.kesimpulan || '',
      
      // Data penyakit menular
      jenazah_penyakit_menular: userData.jenazah_penyakit_menular || false,
      infectious_protocol_confirmed: userData.infectious_protocol_confirmed || false,
      infectious_protocol_timestamp: userData.infectious_protocol_timestamp || '',
      
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    
    // Add to sheet
    const row = objectToRow(headers, user);
    sheet.appendRow(row);
    
    // Process documents if provided
    if (userData.documents && userData.documents.length > 0) {
      userData.documents.forEach(doc => {
        uploadDocumentForUser(user.id, doc);
      });
      
      user.documents = getDocumentsByUserId(user.id);
    }
    
    // Create notification for admins
    let notifMessage = `Pengajuan baru dari ${user.nama_pengantar || user.nama}`;
    if (user.jenazah_penyakit_menular) {
      notifMessage += ' [⚠️ PENYAKIT MENULAR]';
    }
    
    createNotificationForAdmins({
      serviceUserId: user.id,
      userName: user.nama_pengantar || user.nama,
      message: notifMessage,
      type: 'new'
    });
    
    // Log activity
    logActivity({
      userId: user.fieldOfficerId,
      action: 'CREATE_SERVICE_USER',
      entityType: 'service_user',
      entityId: user.id,
      details: JSON.stringify({ 
        nama: user.nama, 
        lokasi: user.lokasi_pemeriksaan,
        infectious: user.jenazah_penyakit_menular 
      })
    });
    
    return user;
    
  } catch (validationError) {
    // Jika validasi gagal, kirim error kembali ke frontend
    Logger.log('Validation Error: ' + validationError.message);
    throw validationError;
  }
}

/**
 * Update doPost handler untuk menggunakan validasi
 */
function doPostWithValidation(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    
    // Route ke handler yang sesuai
    if (action === 'createServiceUser') {
      const result = createServiceUserWithValidation(e);
      return createJsonResponse(result);
    }
    
    // ... handler lain tetap sama ...
    
    return createJsonResponse({ message: 'Unknown action' });
    
  } catch (err) {
    // Kirim error detail kembali ke frontend
    Logger.log('Error: ' + err.message);
    return createErrorResponse(err.message);
  }
}

/**
 * Helper untuk format error response
 */
function createErrorResponse(message) {
  const output = ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * INSTRUKSI IMPLEMENTASI:
 * 
 * 1. Buka file google-apps-script-backend.js
 * 
 * 2. Tambahkan fungsi validateFormData() di bagian UTILITY FUNCTIONS
 * 
 * 3. Update fungsi createServiceUser() untuk include validasi:
 *    - Copy logic dari createServiceUserWithValidation()
 *    - Tambahkan field baru untuk jenazah_penyakit_menular
 * 
 * 4. Update sheet "ServiceUsers" dengan kolom tambahan:
 *    - tanggal_pemeriksaan
 *    - lokasi_pemeriksaan  
 *    - nama_pengantar
 *    - nama_pemeriksa
 *    - kesimpulan
 *    - jenazah_penyakit_menular (boolean)
 *    - infectious_protocol_confirmed (boolean)
 *    - infectious_protocol_timestamp (datetime)
 * 
 * 5. Test dengan data dummy untuk memastikan validasi berjalan
 * 
 * 6. Deploy ulang Web App dengan versi baru
 */
