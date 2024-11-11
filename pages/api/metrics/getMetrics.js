// pages/api/metrics/getMetrics.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    console.log(`Decoded User ID: ${userId}`);

    // Fetch all records without filtering in Airtable
    const records = await base('Metrics').select().all();

    // Filter records by `User ID` server-side
    const metrics = records
      .filter((record) => record.fields['User ID'] && record.fields['User ID'].includes(userId))
      .map((record) => ({
        id: record.id,
        metricName: record.fields['Metric Name'],
        unit: record.fields['Unit'],
      }));

    console.log("Filtered metrics data:", metrics);
    return res.status(200).json({ metrics });
  } catch (error) {
    console.error("Token verification or Airtable retrieval error:", error.message);
    return res.status(401).json({ message: 'Invalid token or database error' });
  }
}
