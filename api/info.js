export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL obrigatória' });
    }

    try {
        const response = await fetch('https://SUA-API-EXTRACAO.com/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                vQuality: '720'
            })
        });

        const data = await response.json();

        if (!data.url) {
            return res.status(400).json({ error: 'Não foi possível extrair o vídeo' });
        }

        return res.status(200).json({
            downloadUrl: data.url,
            filename: data.filename || 'video.mp4'
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}