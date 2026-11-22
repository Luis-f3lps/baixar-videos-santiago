import { Innertube } from 'youtubei.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { url } = req.body;
    const match = url?.match(/(?:v=|youtu\.be\/|shorts\/)([^"&?\/\s]{11})/);
    const videoId = match ? match[1] : null;

    if (!videoId) {
        return res.status(400).json({ error: 'ID do vídeo inválido' });
    }

    try {
        const yt = await Innertube.create({ client_type: 'ANDROID' });
        const info = await yt.getBasicInfo(videoId);
        const format = info.chooseFormat({ type: 'video+audio', quality: 'best' });

        if (!format || !format.url) {
            return res.status(400).json({ error: 'Formato compatível não encontrado' });
        }

        return res.status(200).json({
            downloadUrl: format.url,
            duration: info.basic_info.duration
        });
    } catch (error) {
        return res.status(500).json({ error: 'Falha ao extrair vídeo: ' + error.message });
    }
}