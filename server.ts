import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Helper to extract hash from jazzdrive URL
function hashFromUrl(u: string): string {
  const m = String(u || '').match(/\/share\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
}

function findStr(o: any, test: (s: string) => boolean): string {
  if (typeof o === 'string') return test(o) ? o : '';
  if (o && typeof o === 'object') {
    for (const k of Object.keys(o)) {
      const r = findStr(o[k], test);
      if (r) return r;
    }
  }
  return '';
}

// Proxy endpoint to resolve JazzDrive share link to direct video
app.post('/api/jazzdrive/resolve', async (req, res) => {
  try {
    const { shareUrl } = req.body;
    const hash = hashFromUrl(shareUrl);
    if (!hash) {
      return res.status(400).json({ error: 'Invalid share link format' });
    }

    const jd = 'https://cloud.jazzdrive.com.pk';
    const api = `${jd}/sapi/media/set?action=get&items=true&thumbnaildimensions=true&shared=true&key=${encodeURIComponent(hash)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const jdRes = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referer': `${jd}/share/${hash}`,
        'Origin': jd,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ data: {} }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!jdRes.ok) {
      return res.status(jdRes.status).json({ error: `JazzDrive responded with HTTP ${jdRes.status}` });
    }

    const data = await jdRes.json();
    const videoUrl = findStr(data, (s) => /^https?:\/\//.test(s) && s.includes('/sapi/download/video'))
      || findStr(data, (s) => /^https?:\/\//.test(s) && s.includes('/sapi/download/') && !/thumb/i.test(s));
    
    const poster = findStr(data, (s) => /^https?:\/\//.test(s) && s.includes('/sapi/download/') && /thumb/i.test(s));

    if (!videoUrl) {
      return res.status(404).json({ error: 'Video stream URL not found in JazzDrive response' });
    }

    return res.json({ success: true, url: videoUrl, poster: poster || '' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error resolving JazzDrive link' });
  }
});

// Proxy endpoint to fetch remote feed.json
app.get('/api/feed', async (req, res) => {
  try {
    const targetUrl = (req.query.url as string) || 'https://salmanbot248.github.io/jazz-24-7-bot-tg/feed.json';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl + (targetUrl.includes('?') ? '&' : '?') + 't=' + Date.now(), {
      signal: controller.signal,
      headers: { 'User-Agent': 'ZeroFeed-TikTok/2.0' }
    });
    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Feed HTTP ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({ error: err.message || 'Failed to fetch feed' });
  }
});

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZeroFeed TikTok server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch(console.error);
