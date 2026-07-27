const express = require('express');
const app = express();
const port = 3000;

app.get('/api/current-utc', (req, res) => {
    const now = new Date();
    
    // UTC time components
    const utcYear = now.getUTCFullYear();
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
    const utcDay = String(now.getUTCDate()).padStart(2, '0');
    const utcHour = String(now.getUTCHours()).padStart(2, '0');
    const utcMinute = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    const utcMilliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
    
    // Day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[now.getUTCDay()];
    
    // ISO format
    const dateTime = now.toISOString();
    
    // Response object (same format as timeapi.io)
    const response = {
        year: parseInt(utcYear),
        month: parseInt(utcMonth),
        day: parseInt(utcDay),
        hour: parseInt(utcHour),
        minute: parseInt(utcMinute),
        seconds: parseInt(utcSeconds),
        milliSeconds: parseInt(utcMilliseconds),
        dateTime: dateTime,
        date: `${utcMonth}/${utcDay}/${utcYear}`,
        time: `${utcHour}:${utcMinute}`,
        timeZone: "UTC",
        dayOfWeek: dayOfWeek,
        dstActive: false
    };
    
    res.json(response);
});

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}/api/current-utc`);
});
