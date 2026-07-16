/**
 * =============================================================================
 * Cloudflare Worker — GLS Tracking Proxy
 * =============================================================================
 *
 * Questo Worker funge da proxy sicuro tra il frontend (GitHub Pages) e l'API
 * di TrackingMore. Protegge la API Key e gestisce il CORS.
 *
 * ENVIRONMENT VARIABLES (da configurare nel Cloudflare Dashboard):
 *   TRACKINGMORE_API_KEY  — La tua API key di TrackingMore
 *   ALLOWED_ORIGIN        — L'origine CORS consentita (es. https://tuonome.github.io)
 *
 * ENDPOINT:
 *   GET /api/tracking?number={trackingNumber}&courier={courierCode}
 *   GET /health
 *
 * RISPOSTA STANDARDIZZATA:
 *   {
 *     success: true,
 *     data: {
 *       trackingNumber, courier, status, statusLabel,
 *       lastUpdate, location, latestEvent, events[]
 *     }
 *   }
 * =============================================================================
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── CORS Headers ──────────────────────────────────────────────────────
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // ── CORS Preflight ────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── Health Check ──────────────────────────────────────────────────────
    if (url.pathname === '/health') {
      return jsonResponse(
        { status: 'ok', timestamp: new Date().toISOString() },
        200,
        corsHeaders
      );
    }

    // ── Routing: solo /api/tracking ───────────────────────────────────────
    if (url.pathname !== '/api/tracking') {
      return jsonResponse(
        { success: false, error: 'Not found' },
        404,
        corsHeaders
      );
    }

    // ── Metodo: solo GET ──────────────────────────────────────────────────
    if (request.method !== 'GET') {
      return jsonResponse(
        { success: false, error: 'Method not allowed' },
        405,
        corsHeaders
      );
    }

    // ── Validazione API Key ───────────────────────────────────────────────
    if (!env.TRACKINGMORE_API_KEY) {
      console.error('TRACKINGMORE_API_KEY non configurata');
      return jsonResponse(
        { success: false, error: 'Server misconfiguration: API key missing' },
        500,
        corsHeaders
      );
    }

    // ── Parsing parametri ─────────────────────────────────────────────────
    const trackingNumber = url.searchParams.get('number');
    const courier = (url.searchParams.get('courier') || 'gls').toLowerCase().trim();

    if (!trackingNumber || trackingNumber.trim().length < 3) {
      return jsonResponse(
        { success: false, error: 'Parametro "number" mancante o troppo corto' },
        400,
        corsHeaders
      );
    }

    // ── Rate limiting base (anti-abuse) ───────────────────────────────────
    // In produzione, sostituisci con Cloudflare Rate Limiting o Durable Objects.
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    // ── Chiamata a TrackingMore API ───────────────────────────────────────
    try {
      const result = await fetchTrackingData(
        trackingNumber.trim(),
        courier,
        env.TRACKINGMORE_API_KEY
      );

      return jsonResponse(
        { success: true, data: result },
        200,
        corsHeaders
      );
    } catch (err) {
      console.error('Tracking API error:', err.message);
      return jsonResponse(
        { success: false, error: err.message || 'Tracking service error' },
        502,
        corsHeaders
      );
    }
  },
};


/* ===========================================================================
 * TRACKINGMORE API INTEGRATION
 * =========================================================================== */

/**
 * Strategia di fetch:
 * 1. Prova l'endpoint /realtime (non crea entry, dati freschi dal corriere)
 * 2. Se fallisce, usa /post (crea entry se non esiste, ritorna dati correnti)
 */
async function fetchTrackingData(trackingNumber, courier, apiKey) {
  const headers = {
    'Content-Type': 'application/json',
    'Trackingmore-Key': apiKey,
  };

  // ── Strategia 1: Realtime (preferita, non crea tracking entries) ─────
  try {
    const response = await fetch(
      'https://api.trackingmore.com/v2/trackings/realtime',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tracking_number: trackingNumber,
          courier_code: courier,
        }),
      }
    );

    const data = await response.json();

    if (data.meta?.code === 200 && data.data) {
      return normalizeResponse(data.data, trackingNumber, courier);
    }
  } catch (e) {
    // Realtime non disponibile (piano free?), fallback a /post
    console.log('Realtime endpoint fallito, provo /post:', e.message);
  }

  // ── Strategia 2: Create/Get (crea entry se assente) ──────────────────
  const createResponse = await fetch(
    'https://api.trackingmore.com/v2/trackings/post',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tracking_number: trackingNumber,
        courier_code: courier,
      }),
    }
  );

  const createData = await createResponse.json();

  // 200 = esistente, 201 = appena creato
  if (createData.meta?.code !== 200 && createData.meta?.code !== 201) {
    throw new Error(
      createData.meta?.message || 'Impossibile creare/recuperare il tracking'
    );
  }

  // Se appena creato e senza dati, aspetta e recupera
  if (
    createData.data?.delivery_status === 'notfound' ||
    !createData.data?.origin_info?.trackinfo?.length
  ) {
    await sleep(2500);

    const getResponse = await fetch(
      `https://api.trackingmore.com/v2/trackings/${encodeURIComponent(courier)}/${encodeURIComponent(trackingNumber)}`,
      { method: 'GET', headers }
    );

    const getData = await getResponse.json();

    if (getData.meta?.code === 200 && getData.data) {
      return normalizeResponse(getData.data, trackingNumber, courier);
    }
  }

  return normalizeResponse(createData.data, trackingNumber, courier);
}


/**
 * Normalizza la risposta di TrackingMore nel nostro formato standard.
 */
function normalizeResponse(data, trackingNumber, courier) {
  const trackinfo = data?.origin_info?.trackinfo || [];
  const latestEvent = trackinfo.length > 0 ? trackinfo[0] : null;

  return {
    trackingNumber: data.tracking_number || trackingNumber,
    courier: courier,
    status: data.delivery_status || 'notfound',
    statusLabel: mapStatusLabel(data.delivery_status),
    lastUpdate:
      data.latest_checkpoint_time || latestEvent?.Date || null,
    location: latestEvent?.Details || null,
    latestEvent: latestEvent?.StatusDescription || data.latest_event || null,
    events: trackinfo.map((e) => ({
      date: e.Date || null,
      status: e.StatusDescription || null,
      details: e.Details || null,
      checkpointStatus: e.checkpoint_status || null,
    })),
    fetchedAt: new Date().toISOString(),
  };
}


/**
 * Mappa il codice stato TrackingMore → etichetta italiana leggibile.
 */
function mapStatusLabel(status) {
  const map = {
    pending: 'In Attesa',
    notfound: 'Non Trovato',
    transit: 'In Transito',
    pickup: 'In Consegna',
    delivered: 'Consegnato',
    expired: 'Scaduto',
    undelivered: 'Non Consegnato',
    exception: 'Anomalia',
    inforeceived: 'Info Ricevute',
  };
  return map[(status || '').toLowerCase()] || 'Sconosciuto';
}


/* ===========================================================================
 * UTILITY
 * =========================================================================== */

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
