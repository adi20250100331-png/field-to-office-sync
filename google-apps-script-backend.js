/**
 * ========================================
 * FIELD-TO-OFFICE SYNC - GOOGLE APPS SCRIPT BACKEND
 * ========================================
 * 
 * Backend API menggunakan Google Apps Script
 * - Google Sheets sebagai Database
 * - Google Drive sebagai File Storage
 * - REST API endpoints
 * 
 * SETUP:
 * 1. Buat Google Sheet baru dengan nama "Field-to-Office DB"
 * 2. Buat folder Google Drive dengan nama "Field-to-Office Documents"
 * 3. Copy script ini ke Apps Script editor
 * 4. Update SPREADSHEET_ID dan DRIVE_FOLDER_ID
 * 5. Deploy as Web App
 * 
 * ========================================
 */

// ========================================
// CONFIGURATION
// ========================================

// Ganti dengan ID Google Sheet Anda
// Cara dapat ID: Buka sheet > URL > copy bagian setelah /d/
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Ganti dengan ID Google Drive Folder Anda
// Cara dapat ID: Buka folder > URL > copy bagian setelah /folders/
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE';

// Sheet names
const SHEETS = {
  SERVICE_USERS: 'ServiceUsers',
  DOCUMENTS: 'Documents',
  NOTIFICATIONS: 'Notifications',
  USERS: 'Users',
  LOGS: 'ActivityLogs'
};

// API Key untuk basic authentication (ganti dengan key Anda)
const API_KEY = 'your-secret-api-key-here';

// ========================================
// MAIN HANDLERS
// ========================================

/**
 * Handle GET requests
 */
function doGet(e) {
  try {
    // Enable CORS
    const output = handleRequest(e, 'GET');
    return createJsonResponse(output);
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const output = handleRequest(e, 'POST');
    return createJsonResponse(output);
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

/**
 * Main request router
 */
function handleRequest(e, method) {
  // Verify API key
  const apiKey = e.parameter.apiKey || (e.postData && JSON.parse(e.postData.contents).apiKey);
  if (apiKey !== API_KEY) {
    throw new Error('Unauthorized: Invalid API key');
  }

  const action = e.parameter.action;
  
  if (!action) {
    throw new Error('Missing action parameter');
  }

  // Route to appropriate handler
  switch (action) {
    // Service Users endpoints
    case 'getServiceUsers':
      return getServiceUsers(e);
    case 'getServiceUserById':
      return getServiceUserById(e);
    case 'createServiceUser':
      return createServiceUser(e);
    case 'updateServiceUserStatus':
      return updateServiceUserStatus(e);
    case 'deleteServiceUser':
      return deleteServiceUser(e);
    
    // Documents endpoints
    case 'uploadDocument':
      return uploadDocument(e);
    case 'getDocuments':
      return getDocuments(e);
    case 'deleteDocument':
      return deleteDocument(e);
    
    // Notifications endpoints
    case 'getNotifications':
      return getNotifications(e);
    case 'markNotificationAsRead':
      return markNotificationAsRead(e);
    case 'createNotification':
      return createNotification(e);
    
    // User endpoints
    case 'login':
      return login(e);
    case 'getUser':
      return getUser(e);
    
    default:
      throw new Error('Unknown action: ' + action);
  }
}

// ========================================
// RESPONSE HELPERS
// ========================================

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function createErrorResponse(message) {
  const output = ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ========================================
// DATABASE HELPERS
// ========================================

/**
 * Get spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Get or create sheet
 */
function getOrCreateSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Initialize headers based on sheet type
    initializeSheetHeaders(sheet, sheetName);
  }
  
  return sheet;
}

/**
 * Initialize sheet headers
 */
function initializeSheetHeaders(sheet, sheetName) {
  let headers = [];
  
  switch (sheetName) {
    case SHEETS.SERVICE_USERS:
      headers = [
        'id', 'nama', 'nik', 'alamat', 'noTelepon', 'email', 
        'jenisLayanan', 'keterangan', 'status', 'statusMessage',
        'fieldOfficerId', 'fieldOfficerName', 'createdAt', 'updatedAt'
      ];
      break;
    case SHEETS.DOCUMENTS:
      headers = [
        'id', 'serviceUserId', 'type', 'fileName', 'fileId', 
        'fileUrl', 'ocrText', 'ocrData', 'uploadedAt'
      ];
      break;
    case SHEETS.NOTIFICATIONS:
      headers = [
        'id', 'userId', 'serviceUserId', 'userName', 
        'message', 'type', 'read', 'createdAt'
      ];
      break;
    case SHEETS.USERS:
      headers = [
        'id', 'email', 'password', 'fullName', 'role', 
        'phone', 'createdAt', 'updatedAt'
      ];
      break;
    case SHEETS.LOGS:
      headers = [
        'id', 'userId', 'action', 'entityType', 'entityId', 
        'details', 'timestamp'
      ];
      break;
  }
  
  if (headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

/**
 * Generate unique ID
 */
function generateId() {
  return Utilities.getUuid();
}

/**
 * Get current timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Convert row to object
 */
function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index];
  });
  return obj;
}

/**
 * Object to row array
 */
function objectToRow(headers, obj) {
  return headers.map(header => obj[header] || '');
}

// ========================================
// SERVICE USERS CRUD
// ========================================

/**
 * Get all service users
 */
function getServiceUsers(e) {
  const sheet = getOrCreateSheet(SHEETS.SERVICE_USERS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  // Convert to objects
  const users = rows.map(row => {
    const user = rowToObject(headers, row);
    // Get documents for this user
    user.documents = getDocumentsByUserId(user.id);
    return user;
  });
  
  // Filter by status if provided
  const status = e.parameter.status;
  if (status) {
    return users.filter(u => u.status === status);
  }
  
  // Filter by field officer if provided
  const fieldOfficerId = e.parameter.fieldOfficerId;
  if (fieldOfficerId) {
    return users.filter(u => u.fieldOfficerId === fieldOfficerId);
  }
  
  return users;
}

/**
 * Get service user by ID
 */
function getServiceUserById(e) {
  const id = e.parameter.id;
  if (!id) {
    throw new Error('Missing id parameter');
  }
  
  const sheet = getOrCreateSheet(SHEETS.SERVICE_USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      const user = rowToObject(headers, data[i]);
      user.documents = getDocumentsByUserId(id);
      return user;
    }
  }
  
  throw new Error('Service user not found');
}

/**
 * Create new service user
 */
function createServiceUser(e) {
  const postData = JSON.parse(e.postData.contents);
  const userData = postData.data;
  
  // Validate required fields
  if (!userData.nama || !userData.nik) {
    throw new Error('Missing required fields: nama, nik');
  }
  
  const sheet = getOrCreateSheet(SHEETS.SERVICE_USERS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Create user object
  const user = {
    id: generateId(),
    nama: userData.nama,
    nik: userData.nik,
    alamat: userData.alamat || '',
    noTelepon: userData.noTelepon || '',
    email: userData.email || '',
    jenisLayanan: userData.jenisLayanan || '',
    keterangan: userData.keterangan || '',
    status: userData.status || 'pending',
    statusMessage: userData.statusMessage || '',
    fieldOfficerId: userData.fieldOfficerId || '',
    fieldOfficerName: userData.fieldOfficerName || '',
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
    
    // Get documents back
    user.documents = getDocumentsByUserId(user.id);
  }
  
  // Create notification for admins
  createNotificationForAdmins({
    serviceUserId: user.id,
    userName: user.nama,
    message: `Pengajuan baru dari ${user.nama} (${user.jenisLayanan})`,
    type: 'new'
  });
  
  // Log activity
  logActivity({
    userId: user.fieldOfficerId,
    action: 'CREATE_SERVICE_USER',
    entityType: 'service_user',
    entityId: user.id,
    details: JSON.stringify({ nama: user.nama, nik: user.nik })
  });
  
  return user;
}

/**
 * Update service user status
 */
function updateServiceUserStatus(e) {
  const postData = JSON.parse(e.postData.contents);
  const id = postData.id;
  const status = postData.status;
  const statusMessage = postData.statusMessage || '';
  
  if (!id || !status) {
    throw new Error('Missing required fields: id, status');
  }
  
  const sheet = getOrCreateSheet(SHEETS.SERVICE_USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  const statusIndex = headers.indexOf('status');
  const statusMessageIndex = headers.indexOf('statusMessage');
  const updatedAtIndex = headers.indexOf('updatedAt');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      const oldStatus = data[i][statusIndex];
      
      // Update status
      sheet.getRange(i + 1, statusIndex + 1).setValue(status);
      sheet.getRange(i + 1, statusMessageIndex + 1).setValue(statusMessage);
      sheet.getRange(i + 1, updatedAtIndex + 1).setValue(getTimestamp());
      
      const user = rowToObject(headers, sheet.getRange(i + 1, 1, 1, headers.length).getValues()[0]);
      
      // Create notification for field officer
      if (oldStatus !== status) {
        createNotificationForUser({
          userId: user.fieldOfficerId,
          serviceUserId: id,
          userName: user.nama,
          message: `Status ${user.nama} diubah menjadi ${status}`,
          type: 'status-change'
        });
      }
      
      // Log activity
      logActivity({
        userId: postData.userId || '',
        action: 'UPDATE_STATUS',
        entityType: 'service_user',
        entityId: id,
        details: JSON.stringify({ oldStatus, newStatus: status })
      });
      
      user.documents = getDocumentsByUserId(id);
      return user;
    }
  }
  
  throw new Error('Service user not found');
}

/**
 * Delete service user
 */
function deleteServiceUser(e) {
  const id = e.parameter.id;
  if (!id) {
    throw new Error('Missing id parameter');
  }
  
  const sheet = getOrCreateSheet(SHEETS.SERVICE_USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      // Delete associated documents
      deleteDocumentsByUserId(id);
      
      // Delete row
      sheet.deleteRow(i + 1);
      
      // Log activity
      logActivity({
        userId: e.parameter.userId || '',
        action: 'DELETE_SERVICE_USER',
        entityType: 'service_user',
        entityId: id,
        details: ''
      });
      
      return { success: true, message: 'Service user deleted' };
    }
  }
  
  throw new Error('Service user not found');
}

// ========================================
// DOCUMENTS CRUD
// ========================================

/**
 * Upload document
 */
function uploadDocument(e) {
  const postData = JSON.parse(e.postData.contents);
  const docData = postData.data;
  
  return uploadDocumentForUser(docData.serviceUserId, docData);
}

/**
 * Upload document for specific user
 */
function uploadDocumentForUser(serviceUserId, docData) {
  const sheet = getOrCreateSheet(SHEETS.DOCUMENTS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Decode base64 image
  const base64Data = docData.imageUrl.split(',')[1];
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    'image/jpeg',
    `${docData.type}_${Date.now()}.jpg`
  );
  
  // Upload to Google Drive
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const file = folder.createFile(blob);
  
  // Make file accessible
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  // Create document record
  const document = {
    id: generateId(),
    serviceUserId: serviceUserId,
    type: docData.type,
    fileName: file.getName(),
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    ocrText: docData.ocrText || '',
    ocrData: JSON.stringify(docData.ocrData || {}),
    uploadedAt: getTimestamp()
  };
  
  // Add to sheet
  const row = objectToRow(headers, document);
  sheet.appendRow(row);
  
  return document;
}

/**
 * Get documents by user ID
 */
function getDocumentsByUserId(serviceUserId) {
  const sheet = getOrCreateSheet(SHEETS.DOCUMENTS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const userIdIndex = headers.indexOf('serviceUserId');
  const rows = data.slice(1);
  
  return rows
    .filter(row => row[userIdIndex] === serviceUserId)
    .map(row => {
      const doc = rowToObject(headers, row);
      // Parse ocrData back to object
      try {
        doc.ocrData = JSON.parse(doc.ocrData);
      } catch (e) {
        doc.ocrData = {};
      }
      return doc;
    });
}

/**
 * Get all documents
 */
function getDocuments(e) {
  const serviceUserId = e.parameter.serviceUserId;
  
  if (serviceUserId) {
    return getDocumentsByUserId(serviceUserId);
  }
  
  const sheet = getOrCreateSheet(SHEETS.DOCUMENTS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const doc = rowToObject(headers, row);
    try {
      doc.ocrData = JSON.parse(doc.ocrData);
    } catch (e) {
      doc.ocrData = {};
    }
    return doc;
  });
}

/**
 * Delete document
 */
function deleteDocument(e) {
  const id = e.parameter.id;
  if (!id) {
    throw new Error('Missing id parameter');
  }
  
  const sheet = getOrCreateSheet(SHEETS.DOCUMENTS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  const fileIdIndex = headers.indexOf('fileId');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      // Delete file from Drive
      const fileId = data[i][fileIdIndex];
      try {
        DriveApp.getFileById(fileId).setTrashed(true);
      } catch (e) {
        // File might already be deleted
      }
      
      // Delete row
      sheet.deleteRow(i + 1);
      
      return { success: true, message: 'Document deleted' };
    }
  }
  
  throw new Error('Document not found');
}

/**
 * Delete all documents for user
 */
function deleteDocumentsByUserId(serviceUserId) {
  const documents = getDocumentsByUserId(serviceUserId);
  documents.forEach(doc => {
    deleteDocument({ parameter: { id: doc.id } });
  });
}

// ========================================
// NOTIFICATIONS CRUD
// ========================================

/**
 * Get notifications
 */
function getNotifications(e) {
  const userId = e.parameter.userId;
  const unreadOnly = e.parameter.unreadOnly === 'true';
  
  const sheet = getOrCreateSheet(SHEETS.NOTIFICATIONS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  let notifications = rows.map(row => rowToObject(headers, row));
  
  // Filter by userId
  if (userId) {
    notifications = notifications.filter(n => n.userId === userId);
  }
  
  // Filter unread only
  if (unreadOnly) {
    notifications = notifications.filter(n => n.read === false || n.read === 'false');
  }
  
  // Sort by createdAt descending
  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return notifications;
}

/**
 * Create notification
 */
function createNotification(e) {
  const postData = JSON.parse(e.postData.contents);
  return createNotificationForUser(postData.data);
}

/**
 * Create notification for specific user
 */
function createNotificationForUser(notifData) {
  const sheet = getOrCreateSheet(SHEETS.NOTIFICATIONS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const notification = {
    id: generateId(),
    userId: notifData.userId,
    serviceUserId: notifData.serviceUserId || '',
    userName: notifData.userName || '',
    message: notifData.message,
    type: notifData.type || 'new',
    read: false,
    createdAt: getTimestamp()
  };
  
  const row = objectToRow(headers, notification);
  sheet.appendRow(row);
  
  return notification;
}

/**
 * Create notification for all admins
 */
function createNotificationForAdmins(notifData) {
  const admins = getUsersByRole('admin');
  admins.forEach(admin => {
    createNotificationForUser({
      userId: admin.id,
      serviceUserId: notifData.serviceUserId,
      userName: notifData.userName,
      message: notifData.message,
      type: notifData.type
    });
  });
}

/**
 * Mark notification as read
 */
function markNotificationAsRead(e) {
  const id = e.parameter.id;
  if (!id) {
    throw new Error('Missing id parameter');
  }
  
  const sheet = getOrCreateSheet(SHEETS.NOTIFICATIONS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  const readIndex = headers.indexOf('read');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      sheet.getRange(i + 1, readIndex + 1).setValue(true);
      return { success: true, message: 'Notification marked as read' };
    }
  }
  
  throw new Error('Notification not found');
}

// ========================================
// USERS & AUTHENTICATION
// ========================================

/**
 * Login user
 */
function login(e) {
  const postData = JSON.parse(e.postData.contents);
  const email = postData.email;
  const password = postData.password;
  
  if (!email || !password) {
    throw new Error('Missing email or password');
  }
  
  const sheet = getOrCreateSheet(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    throw new Error('No users found. Please create admin user first.');
  }
  
  const headers = data[0];
  const emailIndex = headers.indexOf('email');
  const passwordIndex = headers.indexOf('password');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][emailIndex] === email && data[i][passwordIndex] === password) {
      const user = rowToObject(headers, data[i]);
      delete user.password; // Don't return password
      
      // Log activity
      logActivity({
        userId: user.id,
        action: 'LOGIN',
        entityType: 'user',
        entityId: user.id,
        details: ''
      });
      
      return {
        success: true,
        user: user,
        token: generateSessionToken(user.id)
      };
    }
  }
  
  throw new Error('Invalid email or password');
}

/**
 * Get user by ID
 */
function getUser(e) {
  const id = e.parameter.id;
  if (!id) {
    throw new Error('Missing id parameter');
  }
  
  const sheet = getOrCreateSheet(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      const user = rowToObject(headers, data[i]);
      delete user.password;
      return user;
    }
  }
  
  throw new Error('User not found');
}

/**
 * Get users by role
 */
function getUsersByRole(role) {
  const sheet = getOrCreateSheet(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const roleIndex = headers.indexOf('role');
  const rows = data.slice(1);
  
  return rows
    .filter(row => row[roleIndex] === role)
    .map(row => {
      const user = rowToObject(headers, row);
      delete user.password;
      return user;
    });
}

/**
 * Generate session token (simple implementation)
 */
function generateSessionToken(userId) {
  const timestamp = new Date().getTime();
  const token = Utilities.base64Encode(userId + ':' + timestamp);
  return token;
}

// ========================================
// ACTIVITY LOGS
// ========================================

/**
 * Log activity
 */
function logActivity(logData) {
  const sheet = getOrCreateSheet(SHEETS.LOGS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const log = {
    id: generateId(),
    userId: logData.userId || '',
    action: logData.action,
    entityType: logData.entityType || '',
    entityId: logData.entityId || '',
    details: logData.details || '',
    timestamp: getTimestamp()
  };
  
  const row = objectToRow(headers, log);
  sheet.appendRow(row);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Setup initial database (run once)
 */
function setupDatabase() {
  // Create all sheets
  Object.values(SHEETS).forEach(sheetName => {
    getOrCreateSheet(sheetName);
  });
  
  // Create sample admin user
  const usersSheet = getOrCreateSheet(SHEETS.USERS);
  const headers = usersSheet.getRange(1, 1, 1, usersSheet.getLastColumn()).getValues()[0];
  
  const admin = {
    id: generateId(),
    email: 'admin@test.com',
    password: 'admin123', // Change this!
    fullName: 'Admin User',
    role: 'admin',
    phone: '+6281234567890',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp()
  };
  
  const row = objectToRow(headers, admin);
  usersSheet.appendRow(row);
  
  Logger.log('Database setup complete!');
  Logger.log('Admin user created: admin@test.com / admin123');
}

/**
 * Test endpoint
 */
function testApi() {
  // Test create user
  const testUser = {
    apiKey: API_KEY,
    data: {
      nama: 'Test User',
      nik: '1234567890123456',
      alamat: 'Test Address',
      jenisLayanan: 'Test Service',
      fieldOfficerId: 'test-officer-id',
      fieldOfficerName: 'Test Officer'
    }
  };
  
  const e = {
    parameter: { action: 'createServiceUser', apiKey: API_KEY },
    postData: { contents: JSON.stringify(testUser) }
  };
  
  const result = createServiceUser(e);
  Logger.log('Test result:', result);
}

/**
 * Get API documentation
 */
function getApiDocumentation() {
  return {
    baseUrl: 'YOUR_WEB_APP_URL',
    authentication: 'Pass apiKey parameter in all requests',
    endpoints: {
      serviceUsers: {
        'GET getServiceUsers': 'Get all service users. Optional: ?status=pending&fieldOfficerId=xxx',
        'GET getServiceUserById': 'Get user by ID. Required: ?id=xxx',
        'POST createServiceUser': 'Create new user. Body: { data: {...} }',
        'POST updateServiceUserStatus': 'Update status. Body: { id, status, statusMessage }',
        'GET deleteServiceUser': 'Delete user. Required: ?id=xxx'
      },
      documents: {
        'POST uploadDocument': 'Upload document. Body: { data: {...} }',
        'GET getDocuments': 'Get documents. Optional: ?serviceUserId=xxx',
        'GET deleteDocument': 'Delete document. Required: ?id=xxx'
      },
      notifications: {
        'GET getNotifications': 'Get notifications. Optional: ?userId=xxx&unreadOnly=true',
        'POST createNotification': 'Create notification. Body: { data: {...} }',
        'GET markNotificationAsRead': 'Mark as read. Required: ?id=xxx'
      },
      users: {
        'POST login': 'Login user. Body: { email, password }',
        'GET getUser': 'Get user. Required: ?id=xxx'
      }
    }
  };
}
