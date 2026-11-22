import { Innertube } from 'youtubei.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const url = body?.url;
        const match = url?.match(/(?:v=|youtu\.be\/|shorts\/)([^"&?\/\s]{11})/);
        const videoId = match ? match[1] : null;

        if (!videoId) {
            return res.status(400).json({ error: 'ID do vídeo inválido' });
        }

        const yt = await Innertube.create({
            client_type: 'IOS',
            enable_session_cache: false,
            generate_session_locally: true
        });

        const info = await yt.getBasicInfo(videoId);
        const format = info.chooseFormat({ type: 'video+audio', quality: 'best' });

        if (!format) {
            return res.status(400).json({ error: 'Nenhum formato MP4 com áudio encontrado' });
        }

        const downloadUrl = format.url || format.decipher(yt.session.player);

        if (!downloadUrl) {
            return res.status(400).json({ error: 'Não foi possível gerar a URL de download' });
        }

        return res.status(200).json({
            downloadUrl,
            duration: Number(info.basic_info.duration)
        });
    } catch (error) {
        return res.status(500).json({
            error: error?.message || 'Erro interno ao processar vídeo'
        });
    }
}