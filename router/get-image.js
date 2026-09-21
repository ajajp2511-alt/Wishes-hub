export default async function handler(req, res) {
    const { fileId } = req.query;
    const token = process.env.TG_BOT_TOKEN; // Vercel se token lega

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        const data = await response.json();
        
        if (data.ok) {
            const url = `https://api.telegram.org/file/bot${token}/${data.result.file_path}`;
            res.status(200).json({ ok: true, url: url });
        } else {
            res.status(400).json({ ok: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}
