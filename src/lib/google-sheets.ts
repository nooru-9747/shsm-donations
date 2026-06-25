import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// We remove the global `doc` cache to avoid issues with Next.js HMR and 
// unloaded instances. For a low-traffic app, initializing it per request is safe and robust.

export async function getGoogleSheet() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!email || !key || !spreadsheetId) {
    throw new Error('Google Sheets credentials are not fully configured in environment variables.');
  }

  // Initialize auth
  const serviceAccountAuth = new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Initialize the sheet
  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  
  try {
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(`Loaded Google Sheet: ${doc.title}`);

    // Ensure required sheets exist automatically on first load
    const requiredSheets = [
      { title: 'Users', headers: ['ID', 'Name', 'Username', 'Password', 'Role'] },
      { title: 'Members', headers: ['ID', 'SerialNumber', 'Name', 'Address', 'MobileNumber', 'MonthlyAmount', 'JoinDate', 'Status', 'Notes'] },
      { title: 'Payments', headers: ['PaymentID', 'MemberID', 'CollectorID', 'AmountPaid', 'Month', 'Year', 'PaymentDate', 'Status', 'Remarks'] }
    ];

    for (const req of requiredSheets) {
      let sheet = doc.sheetsByTitle[req.title];
      if (!sheet) {
        console.log(`Creating missing sheet: ${req.title}`);
        sheet = await doc.addSheet({ title: req.title, headerValues: req.headers });
      }
    }

    return doc;
  } catch (error) {
    console.error('Error loading Google Sheet:', error);
    throw error;
  }
}

// Utility to ensure required sheets exist
export async function initializeSheets() {
  const document = await getGoogleSheet();
  
  const requiredSheets = [
    { title: 'Users', headers: ['ID', 'Name', 'Username', 'Password', 'Role'] },
    { title: 'Members', headers: ['ID', 'SerialNumber', 'Name', 'Address', 'MobileNumber', 'MonthlyAmount', 'JoinDate', 'Status', 'Notes'] },
    { title: 'Payments', headers: ['PaymentID', 'MemberID', 'CollectorID', 'AmountPaid', 'Month', 'Year', 'PaymentDate', 'Status', 'Remarks'] }
  ];

  for (const req of requiredSheets) {
    let sheet = document.sheetsByTitle[req.title];
    if (!sheet) {
      console.log(`Creating missing sheet: ${req.title}`);
      sheet = await document.addSheet({ title: req.title, headerValues: req.headers });
    }
  }

  return document;
}
