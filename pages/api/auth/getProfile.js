// pages/api/auth/getProfile.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    console.log("Token received:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;  // Assuming `username` is part of the JWT payload
    console.log("Decoded Username:", username);

    // Use `Username` as the filter field
    const userRecords = await base('Users')
      .select({ filterByFormula: `{Username} = '${username}'` })  // Adjust to match exact Airtable field name
      .firstPage();

    if (userRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      username: userRecords[0].fields.Username,
      firstName: userRecords[0].fields['First Name'],
      lastName: userRecords[0].fields['Last Name'],
      age: userRecords[0].fields.Age,
      sex: userRecords[0].fields.Sex,
    };

    res.status(200).json({ profile: userProfile });
  } catch (error) {
    console.error("Error during token verification or profile retrieval:", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
}
