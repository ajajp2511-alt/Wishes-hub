/**
 * modules/manage-home-export.js
 * CSV/Report quick export handler
 */
export const HomeExport = {
  downloadCSV() {
    const csvContent = "data:text/csv;charset=utf-8,Metric,Value\nTotal Wishes,1240\nActive Users,85\nStorage,42%";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wishes_hub_report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
