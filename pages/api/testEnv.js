export default function handler(req, res) {
    res.status(200).json({
      airtablePat: process.env.AIRTABLE_PAT ? "Loaded" : "Not loaded",
      airtableBaseId: process.env.AIRTABLE_BASE_ID ? "Loaded" : "Not loaded",
      jwtSecret: process.env.JWT_SECRET ? "Loaded" : "Not loaded"
    });
  }
  