/**
 * Google Sheets API Test Script
 * 
 * Script ini untuk test koneksi dan fungsi API Google Sheets
 * Jalankan di browser console atau gunakan untuk debugging
 */

import api, { isApiConfigured, getApiConfig } from '../api';
import GoogleSheetsService from '../google-sheets.service';

/**
 * Test 1: Check Configuration
 */
export async function testConfiguration() {
  console.group('🔧 Test 1: Configuration');
  
  const config = getApiConfig();
  console.log('API URL:', config.url);
  console.log('Has API Key:', config.hasKey);
  console.log('Is Configured:', config.isConfigured);
  
  const validation = GoogleSheetsService.validateConfig();
  console.log('Validation:', validation);
  
  if (!validation.valid) {
    console.error('❌ Configuration errors:', validation.errors);
    console.groupEnd();
    return false;
  }
  
  console.log('✅ Configuration valid');
  console.groupEnd();
  return true;
}

/**
 * Test 2: Check Connection
 */
export async function testConnection() {
  console.group('🌐 Test 2: Connection');
  
  try {
    const connected = await GoogleSheetsService.checkConnection();
    
    if (connected) {
      console.log('✅ Connection successful');
      console.groupEnd();
      return true;
    } else {
      console.error('❌ Connection failed');
      console.groupEnd();
      return false;
    }
  } catch (error: any) {
    console.error('❌ Connection error:', error.message);
    console.groupEnd();
    return false;
  }
}

/**
 * Test 3: Get Service Users
 */
export async function testGetServiceUsers() {
  console.group('📋 Test 3: Get Service Users');
  
  try {
    const users = await api.getServiceUsers();
    console.log('Service Users:', users);
    console.log('Count:', users.length);
    console.log('✅ Get service users successful');
    console.groupEnd();
    return true;
  } catch (error: any) {
    console.error('❌ Get service users failed:', error.message);
    console.groupEnd();
    return false;
  }
}

/**
 * Test 4: Create Service User
 */
export async function testCreateServiceUser() {
  console.group('➕ Test 4: Create Service User');
  
  const testUser = {
    nama: 'Test User API',
    nik: '1234567890123456',
    alamat: 'Test Address',
    noTelepon: '081234567890',
    email: 'test@example.com',
    jenisLayanan: 'Test Service',
    keterangan: 'Test dari API',
    fieldOfficerId: 'test-officer',
    fieldOfficerName: 'Test Officer',
  };
  
  try {
    const result = await api.createServiceUser(testUser);
    console.log('Created User:', result);
    console.log('User ID:', result.id);
    console.log('✅ Create service user successful');
    console.groupEnd();
    return result.id;
  } catch (error: any) {
    console.error('❌ Create service user failed:', error.message);
    console.groupEnd();
    return null;
  }
}

/**
 * Test 5: Update Status
 */
export async function testUpdateStatus(userId: string) {
  console.group('📝 Test 5: Update Status');
  
  try {
    const result = await api.updateServiceUserStatus(
      userId,
      'verified',
      'Test verification message'
    );
    console.log('Updated User:', result);
    console.log('New Status:', result.status);
    console.log('✅ Update status successful');
    console.groupEnd();
    return true;
  } catch (error: any) {
    console.error('❌ Update status failed:', error.message);
    console.groupEnd();
    return false;
  }
}

/**
 * Test 6: Upload Document (Mock)
 */
export async function testUploadDocument(userId: string) {
  console.group('📄 Test 6: Upload Document');
  
  // Create a simple base64 image (1x1 transparent PNG)
  const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  const testDoc = {
    serviceUserId: userId,
    type: 'KTP' as const,
    imageUrl: mockImage,
    ocrText: 'Test OCR Text',
    ocrData: {
      nik: '1234567890123456',
      nama: 'Test User',
    },
  };
  
  try {
    const result = await api.uploadDocument(testDoc);
    console.log('Uploaded Document:', result);
    console.log('File URL:', result.fileUrl);
    console.log('✅ Upload document successful');
    console.groupEnd();
    return true;
  } catch (error: any) {
    console.error('❌ Upload document failed:', error.message);
    console.error('Note: This might fail if userId is invalid');
    console.groupEnd();
    return false;
  }
}

/**
 * Test 7: Get Notifications
 */
export async function testGetNotifications() {
  console.group('🔔 Test 7: Get Notifications');
  
  try {
    const notifications = await api.getNotifications('test-user-id');
    console.log('Notifications:', notifications);
    console.log('Count:', notifications.length);
    console.log('✅ Get notifications successful');
    console.groupEnd();
    return true;
  } catch (error: any) {
    console.error('❌ Get notifications failed:', error.message);
    console.groupEnd();
    return false;
  }
}

/**
 * Run All Tests
 */
export async function runAllTests() {
  console.log('🚀 Starting Google Sheets API Tests...\n');
  
  const results = {
    configuration: false,
    connection: false,
    getUsers: false,
    createUser: false,
    updateStatus: false,
    uploadDocument: false,
    getNotifications: false,
  };
  
  let createdUserId: string | null = null;
  
  // Test 1: Configuration
  results.configuration = await testConfiguration();
  if (!results.configuration) {
    console.error('⛔ Configuration failed. Please setup .env file first.');
    return results;
  }
  
  // Test 2: Connection
  results.connection = await testConnection();
  if (!results.connection) {
    console.error('⛔ Connection failed. Check API URL and API Key.');
    return results;
  }
  
  // Test 3: Get Users
  results.getUsers = await testGetServiceUsers();
  
  // Test 4: Create User
  createdUserId = await testCreateServiceUser();
  results.createUser = Boolean(createdUserId);
  
  // Test 5: Update Status (only if create succeeded)
  if (createdUserId) {
    results.updateStatus = await testUpdateStatus(createdUserId);
    
    // Test 6: Upload Document (only if create succeeded)
    results.uploadDocument = await testUploadDocument(createdUserId);
  }
  
  // Test 7: Get Notifications
  results.getNotifications = await testGetNotifications();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.table(results);
  
  const passedCount = Object.values(results).filter(v => v).length;
  const totalCount = Object.values(results).length;
  
  console.log(`\n${passedCount}/${totalCount} tests passed`);
  
  if (passedCount === totalCount) {
    console.log('✅ All tests passed! Google Sheets API is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return results;
}

/**
 * Quick Test (untuk development)
 */
export async function quickTest() {
  console.log('⚡ Quick Test\n');
  
  const isConfigured = isApiConfigured();
  console.log('Configured:', isConfigured);
  
  if (!isConfigured) {
    console.error('❌ API not configured. Create .env file first.');
    return;
  }
  
  try {
    const users = await api.getServiceUsers();
    console.log('✅ API is working!');
    console.log('Service Users count:', users.length);
    return true;
  } catch (error: any) {
    console.error('❌ API error:', error.message);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).googleSheetsTest = {
    testConfiguration,
    testConnection,
    testGetServiceUsers,
    testCreateServiceUser,
    testUpdateStatus,
    testUploadDocument,
    testGetNotifications,
    runAllTests,
    quickTest,
  };
  
  console.log('💡 Google Sheets API test functions available:');
  console.log('   window.googleSheetsTest.quickTest()');
  console.log('   window.googleSheetsTest.runAllTests()');
}

export default {
  testConfiguration,
  testConnection,
  testGetServiceUsers,
  testCreateServiceUser,
  testUpdateStatus,
  testUploadDocument,
  testGetNotifications,
  runAllTests,
  quickTest,
};
