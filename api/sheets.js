// api/sheets.js
export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.VITE_SHEETS_API_KEY;
  const masterSheetId = process.env.MASTER_SHEET_ID || process.env.VITE_MASTER_SHEET_ID;

  if (!apiKey || !masterSheetId) {
    return res.status(500).json({ error: 'Server environment configuration missing' });
  }

  const { sheetId, type, range = 'A2:C50' } = req.query; 
  const targetSheetId = (type === 'master' || !sheetId) ? masterSheetId : sheetId;

  try {
    const formattedRange = encodeURIComponent(range);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${targetSheetId}/values/${formattedRange}?key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Google API Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
