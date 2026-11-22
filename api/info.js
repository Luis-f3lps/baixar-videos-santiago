import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { url } = req.body;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'URL do YouTube inválida' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, {
            quality: 'highest',
            filter: format => format.container === 'mp4' && format.hasVideo && format.hasAudio
        });

        if (!format || !format.url) {
            return res.status(400).json({ error: 'Nenhum formato MP4 compatível encontrado' });
        }

        return res.status(200).json({
            downloadUrl: format.url,
            duration: Number(info.videoDetails.lengthSeconds)
        });
    } catch (error) {
        return res.status(500).json({ error: 'Falha ao extrair vídeo do YouTube: ' + error.message });
    }
}