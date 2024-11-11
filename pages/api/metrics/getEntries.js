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
    console.log("Decoded User ID:", userId);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Fetch entries
    const entryRecords = await base('Entries')
      .select()
      .all();

    // Filter entries by User ID
    const userEntries = entryRecords
      .filter(record => record.fields['User ID']?.includes(userId))
      .map(record => ({
        id: record.id,
        metricId: record.fields['Metric ID'] ? record.fields['Metric ID'][0] : null,
        entryDate: record.fields['Entry Date'],
        value: record.fields['Value'],
        createdDate: record.fields['Created Date']
      }));

    // Fetch all metrics to map Metric IDs to Metric Names
    const metricRecords = await base('Metrics')
      .select()
      .all();

    const metricMap = {};
    metricRecords.forEach(record => {
      metricMap[record.id] = record.fields['Metric Name'];
    });

    // Add Metric Name to each entry based on Metric ID
    const enrichedEntries = userEntries
      .map(entry => ({
        ...entry,
        metricName: metricMap[entry.metricId] || 'Unnamed Metric'
      }))
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))  // Sort by Created Date descending
      .slice(0, 5);  // Limit to top 5

    console.log("Filtered, sorted, and enriched entries:", enrichedEntries);
    res.status(200).json({ entries: enrichedEntries });
  } catch (error) {
    console.error("Error retrieving entries:", error.message);
    res.status(500).json({ message: 'Error retrieving entries', error: error.message });
  }
}
