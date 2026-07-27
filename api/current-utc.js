module.exports = async (req, res) => {
    // Get client IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const clientIp = ip.split(',')[0].trim();
    
    let timezone = 'UTC'; // Default fallback
    
    try {
        // Fetch timezone from ip-api.com (free, no API key)
        const response = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,timezone`);
        const data = await response.json();
        
        if (data.status === 'success' && data.timezone) {
            timezone = data.timezone;
        }
    } catch (error) {
        console.log('IP lookup failed, using UTC');
    }
    
    // Get time in detected timezone
    const now = new Date();
    const dateTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
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
        dayOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dateTime.getDay()],
        dstActive: false,
        detectedIp: clientIp // Optional
    };
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(response);
};
