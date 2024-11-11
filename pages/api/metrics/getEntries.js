// pages/api/metrics/getEntries.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  const { entryId } = req.query; // Retrieve entryId from query params
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Fetch entries and filter by user ID, and entry ID if provided
    const records = await base('Entries')
      .select()
      .all();

    const entries = records
      .filter(record => record.fields['User ID']?.includes(userId))
      .filter(record => !entryId || record.id === entryId) // Filter by entryId if provided
      .map(record => ({
        id: record.id,
        metricId: record.fields['Metric ID'] ? record.fields['Metric ID'][0] : null,
        entryDate: record.fields['Entry Date'],
        value: record.fields['Value'],
      }));

    res.status(200).json({ entries });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entries', error: error.message });
  }
}
