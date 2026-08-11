// api/sheets.js
export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const masterSheetId = process.env.MASTER_SHEET_ID;

  if (!apiKey || !masterSheetId) {
    return res.status(500).json({ error: 'Server environment configuration missing' });
  }

  // Frontend se query parameters read karein
  const { sheetId, type, range = 'Sheet1!A1:Z100' } = req.query;

  // Agar 'type=master' hai toh Master Sheet ID, nahi toh requested sub-sheet ID
  const targetSheetId = (type === 'master' || !sheetId) ? masterSheetId : sheetId;

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${targetSheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Google API Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
