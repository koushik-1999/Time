// ===== IN-MEMORY CACHE =====
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

module.exports = async (req, res) => {
    // ===== NO CACHE HEADERS =====
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // ===== GET CLIENT IP =====
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const clientIp = ip.split(',')[0].trim();

    let timezone = 'UTC';
    let cached = false;

    // ===== CHECK CACHE =====
    if (cache.has(clientIp)) {
        const cachedData = cache.get(clientIp);
        if (Date.now() - cachedData.timestamp < CACHE_TTL) {
            timezone = cachedData.timezone;
            cached = true;
            console.log(`✅ Cache hit for ${clientIp}: ${timezone}`);
        } else {
            cache.delete(clientIp);
            console.log(`⏰ Cache expired for ${clientIp}`);
        }
    }

    // ===== IF NOT CACHED, FETCH FROM IP-API =====
    if (!cached) {
        try {
            console.log(`🌐 Fetching timezone for ${clientIp}...`);
            const response = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,timezone`, {
                timeout: 3000 // 3 second timeout
            });
            const data = await response.json();

            if (data.status === 'success' && data.timezone) {
                timezone = data.timezone;
                // Store in cache
                cache.set(clientIp, {
                    timezone: timezone,
                    timestamp: Date.now()
                });
                console.log(`✅ Cached ${clientIp}: ${timezone}`);
            } else {
                console.log(`⚠️ IP-API failed for ${clientIp}, using UTC`);
            }
        } catch (error) {
            console.log(`❌ IP lookup error: ${error.message}, using UTC`);
        }
    }

    // ===== GET TIME =====
    const now = new Date();
    let dateTime;
    try {
        dateTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    } catch (e) {
        console.log(`⚠️ Invalid timezone: ${timezone}, falling back to UTC`);
        timezone = 'UTC';
        dateTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    }

    // ===== RESPONSE =====
    const response = {
        year: dateTime.getFullYear(),
        month: dateTime.getMonth() + 1,
        day: dateTime.getDate(),
        hour: dateTime.getHours(),
        minute: dateTime.getMinutes(),
        seconds: dateTime.getSeconds(),
        milliSeconds: dateTime.getMilliseconds(),
        dateTime: dateTime.toISOString(),
        date: dateTime.toLocaleDateString('en-US'),
        time: `${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`,
        timeZone: timezone,
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateTime.getDay()],
        dstActive: false,
        cached: cached // Optional: show if cached
    };

    res.status(200).json(response);
};
