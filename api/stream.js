export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL ausente' });
    }

    try {
        const response = await fetch(decodeURIComponent(url));
        if (!response.ok) {
            return res.status(response.status).send('Erro ao buscar stream');
        }

        res.setHeader('Content-Type', 'video/mp4');
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}