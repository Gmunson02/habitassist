// pages/api/metrics/getMetricById.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  const { metricId } = req.query;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the metric from Airtable
    const record = await base('Metrics').find(metricId);
    const metricName = record.fields['Metric Name'] || 'Metric';

    res.status(200).json({ metricName });
  } catch (error) {
    console.error("Error fetching metric by ID:", error.message);
    res.status(500).json({ message: 'Error fetching metric', error: error.message });
  }
}
