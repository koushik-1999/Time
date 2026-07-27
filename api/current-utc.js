module.exports = (req, res) => {
    const now = new Date();
    
    const response = {
        year: now.getUTCFullYear(),
        month: now.getUTCMonth() + 1,
        day: now.getUTCDate(),
        hour: now.getUTCHours(),
        minute: now.getUTCMinutes(),
        seconds: now.getUTCSeconds(),
        milliSeconds: now.getUTCMilliseconds(),
        dateTime: now.toISOString(),
        date: now.toLocaleDateString('en-US', { timeZone: 'UTC' }),
        time: now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false }),
        timeZone: "UTC",
        dayOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getUTCDay()],
        dstActive: false
    };
    
    res.status(200).json(response);
};
