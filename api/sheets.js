// api/sheets.js
export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const masterSheetId = process.env.MASTER_SHEET_ID;

  if (!apiKey || !masterSheetId) {
    return res.status(500).json({ error: 'Server environment configuration missing' });
  }

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${masterSheetId}/values/Sheet1!A2:B50?key=${apiKey}`
  );
  const data = await response.json();

  return res.status(200).json(data);
}
