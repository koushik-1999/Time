module.exports = (req, res) => {
    const now = new Date();
    const timezone = req.query.timezone || 'UTC'; // ?timezone=IST
    
    // Timezone options
    const timezones = {
        'UTC': 'UTC',
        'IST': 'Asia/Kolkata',
        'EST': 'America/New_York',
        'PST': 'America/Los_Angeles',
        'GMT': 'GMT',
        'JST': 'Asia/Tokyo',
        'AEDT': 'Australia/Sydney'
    };
    
    const tz = timezones[timezone] || 'UTC';
    
    // Get time in requested timezone
    const dateTime = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    
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
        dstActive: false
    };
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(response);
};
