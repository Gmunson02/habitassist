import { google } from "googleapis";

let sheets;

const initGoogleSheetsClient = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  sheets = google.sheets({ version: 'v4', auth: client });
};

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  if (!sheets) {
    await initGoogleSheetsClient();
  }

  const { selectedDate, weight, bodyFat, bmi } = req.body;
  const range = `WeightData!A1`; // Assuming 'WeightData' is the name of your sheet

  const row = [[selectedDate, weight, bodyFat, bmi]];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'RAW',
      resource: { values: row },
    });

    return res.status(200).send('Weight data submitted successfully.');
  } catch (error) {
    console.error('Error writing to Google Sheet:', error);
    return res.status(500).send('Internal Server Error');
  }
};
