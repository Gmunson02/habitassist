// pages/api/auth/updateProfile.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Only PUT requests are allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  let username;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    username = decoded.username;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { userInfo } = req.body;

  try {
    // Retrieve the user's record from Airtable by username
    const userRecords = await base('Users')
      .select({ filterByFormula: `{Username} = '${username}'` })
      .firstPage();

    if (userRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRecordId = userRecords[0].id;

    // Ensure age is a number when updating Airtable
    const updatedFields = {
      'First Name': userInfo.firstName,
      'Last Name': userInfo.lastName,
      Age: Number(userInfo.age), // Ensure age is a number here
      Sex: userInfo.sex,
    };

    await base('Users').update(userRecordId, updatedFields);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
}
