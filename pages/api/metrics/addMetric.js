import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, metricName, unit } = req.body;

    // Verify JWT
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      // Create a new metric in Airtable's Metrics table
      const newMetric = await base('Metrics').create({
        'User ID': [userId], // Link to Users table
        'Metric Name': metricName,
        'Unit': unit
      });

      // Return the Airtable record ID instead of the formula-generated ID
      res.status(201).json({
        message: 'Metric added',
        metricId: newMetric.id, // Use newMetric.id for the true Airtable record ID
        metric: newMetric.fields // Include other metric fields if needed
      });
    } catch (error) {
      res.status(500).json({ message: 'Error adding metric', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
