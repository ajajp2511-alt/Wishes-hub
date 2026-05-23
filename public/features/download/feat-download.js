// Feature: Branded HD Export
window.triggerDownload = async (id) => {
    const element = document.getElementById(`card-${id}`);
    const watermark = document.createElement('div');
    watermark.innerText = "Wishes Hub | Patel Studio"; // Branding
    watermark.className = "watermark-overlay";
    
    element.appendChild(watermark);

    const canvas = await html2canvas(element, {
        scale: 3, // HD Quality
        backgroundColor: "#1a1a1a"
    });

    const link = document.createElement('a');
    link.download = `wish-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    
    watermark.remove(); // Download ke baad hata do
};
