// pages/api/metrics/getEntries.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  console.log("Received request for getEntries");

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  // Extract and verify token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.error("No token provided in request");
    return res.status(401).json({ message: 'Token is missing' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
    console.log("Decoded User ID:", userId); // Confirm decoded user ID
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Fetch entries from Airtable and log results
    const records = await base('Entries')
      .select()
      .all();

    console.log("Entries fetched from Airtable:", records.map(record => record.fields)); // Logs all entry records

    // Filter records based on the user ID
    const userEntries = records.filter(
      (record) => record.fields['User ID']?.includes(userId)
    ).map((record) => ({
      id: record.id,
      metricId: record.fields['Metric ID'] ? record.fields['Metric ID'][0] : null,
      entryDate: record.fields['Entry Date'],
      value: record.fields['Value'],
    }));

    console.log("Filtered entries for user:", userEntries);
    res.status(200).json({ entries: userEntries });
  } catch (error) {
    console.error("Error retrieving entries:", error.message);
    res.status(500).json({ message: 'Error retrieving entries', error: error.message });
  }
}
