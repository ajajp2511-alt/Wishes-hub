// Feature: SEO & Social Preview Manager
window.updateMetaTags = (title, description) => {
    document.title = title + " | Wishes Hub";
    document.querySelector('meta[name="description"]').setAttribute("content", description);
    
    // OG Tags for WhatsApp/Facebook
    document.querySelector('meta[property="og:title"]').setAttribute("content", title);
    document.querySelector('meta[property="og:description"]').setAttribute("content", description);
};
