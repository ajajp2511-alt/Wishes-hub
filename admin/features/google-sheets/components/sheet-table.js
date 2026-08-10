// Table Rendering & Dynamic Data View
export function renderDataTable(container, headers, rows) {
  if (!rows || rows.length === 0) {
    container.innerHTML = '<p>Is sheet mein koi data available nahi hai.</p>';
    return;
  }

  let html = `<table class="data-table"><thead><tr>`;
  headers.forEach(h => html += `<th>${h}</th>`);
  html += `</tr></thead><tbody>`;

  rows.forEach(row => {
    html += `<tr>`;
    headers.forEach((_, idx) => html += `<td>${row[idx] || ''}</td>`);
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}
