const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the ip_log.txt file exists with proper permissions
const logFilePath = path.join(__dirname, 'ip_log.txt');
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, ''); // Create an empty log file if it doesn't exist
}

// Log IPs to a file
app.post('/log-ip', async (req, res) => {
  const userIp = req.body.ip;

  try {
    // Use ipapi.co for IP geolocation (ensure you replace YOUR_API_KEY with your actual API key)
    const response = await axios.get(`https://api.ipapi.co/${userIp}/json/?apikey=YOUR_API_KEY`);
    const location = `${response.data.city}, ${response.data.country_name}`;
    const logEntry = `[${new Date().toISOString()}] IP: ${userIp} | Location: ${location}\n`;

    // Append the log entry to the file
    fs.appendFileSync(logFilePath, logEntry);
    console.log("Logged IP:", logEntry.trim());

    res.json({ message: "IP successfully logged." });
  } catch (err) {
    console.error("Logging failed:", err.response ? err.response.data : err);
    res.status(500).json({ message: "Failed to log IP." });
  }
});

// View logs
app.get('/logs', (req, res) => {
  if (fs.existsSync(logFilePath)) {
    const logs = fs.readFileSync(logFilePath, 'utf8');
    res.type('text').send(logs);
  } else {
    res.send("No logs yet.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});