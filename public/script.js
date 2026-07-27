const API_URL = 'https://time-psi-five.vercel.app/api/current-utc';
const timezoneSelect = document.getElementById('timezoneSelect');
const refreshBtn = document.getElementById('refreshBtn');

let updateInterval;

async function fetchTime() {
    const timezone = timezoneSelect.value;
    const url = `${API_URL}?timezone=${timezone}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Update clock
        document.getElementById('hours').textContent = String(data.hour).padStart(2, '0');
        document.getElementById('minutes').textContent = String(data.minute).padStart(2, '0');
        document.getElementById('seconds').textContent = String(data.seconds).padStart(2, '0');
        document.getElementById('date').textContent = data.date;
        document.getElementById('day').textContent = data.dayOfWeek;
        document.getElementById('timezone-label').textContent = data.timeZone;
        
        // Update raw JSON
        document.getElementById('jsonData').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error fetching time:', error);
        document.getElementById('jsonData').textContent = '❌ Error fetching data';
    }
}

// Auto-update every second
function startAutoUpdate() {
    if (updateInterval) clearInterval(updateInterval);
    fetchTime();
    updateInterval = setInterval(fetchTime, 1000);
}

// Event listeners
timezoneSelect.addEventListener('change', startAutoUpdate);
refreshBtn.addEventListener('click', startAutoUpdate);

// Start
startAutoUpdate();
