// pages/api/metrics/addMetric.js

import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  // Retrieve token from Authorization header
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
    console.log("Decoded User ID:", userId); // Log decoded user ID for verification
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { metricName, unit } = req.body;
  if (!metricName || !unit) {
    return res.status(400).json({ message: 'Metric name and unit are required' });
  }

  try {
    // Create a new metric in Airtable for the user
    const createdMetric = await base('Metrics').create({
      'Metric Name': metricName,
      Unit: unit,
      'User ID': [userId], // Link the new metric to the user by ID
    });

    res.status(201).json({ message: 'Metric added', metric: createdMetric.fields });
  } catch (error) {
    console.error("Error adding metric:", error.message);
    res.status(500).json({ message: 'Error adding metric', error: error.message });
  }
}
