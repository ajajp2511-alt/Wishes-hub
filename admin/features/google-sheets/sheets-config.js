export const SHEETS_CONFIG = {
  endpoint: '/api/sheets'
};

export async function fetchSheetData(range = 'Sheet1!A2:B50') {
  try {
    const res = await fetch(`${SHEETS_CONFIG.endpoint}?range=${encodeURIComponent(range)}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Sheet Fetch Error:", err);
    return null;
  }
}
