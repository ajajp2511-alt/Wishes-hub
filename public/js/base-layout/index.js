/**
 * Base Layout Module Initialization
 * Dynamically loads and renders layout.html into DOM
 */
export async function initBaseLayout() {
  try {
    const response = await fetch('/js/base-layout/layout.html');
    if (!response.ok) throw new Error('Failed to load layout.html');
    
    const htmlContent = await response.text();
    document.body.innerHTML = htmlContent;

    console.log("🏛️ Base Layout Loaded & Rendered Successfully!");
    return { status: "success", module: "base-layout" };
  } catch (error) {
    console.error("❌ Error loading Base Layout:", error);
    return { status: "error", module: "base-layout" };
  }
}
