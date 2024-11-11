import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    // Verify JWT and extract userId
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      console.log('Extracted User ID:', userId); // Log the extracted user ID
    } catch (error) {
      console.error('JWT verification error:', error.message); // Log the exact JWT error
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }

    try {
      // Fetch all metrics from Airtable
      const records = await base('Metrics')
        .select()
        .all();

      // Filter records by userId after retrieval
      const metrics = records
        .filter((record) => record.fields['User ID']?.includes(userId))
        .map((record) => ({
          id: record.id,                          // Metric ID in Airtable
          metricName: record.fields['Metric Name'], // Name of the metric
          unit: record.fields['Unit'],            // Unit of the metric (e.g., lbs, hours)
        }));

      res.status(200).json({ metrics });
    } catch (error) {
      console.error('Error retrieving metrics:', error.message); // Detailed error log
      res.status(500).json({ message: 'Error retrieving metrics', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only GET requests are allowed' });
  }
}
