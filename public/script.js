fetch("https://api64.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    fetch('http://192.168.1.100:7700/log-ip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip: data.ip }),
    })
    .catch(() => {}); // Silently fail
  })
  .catch(() => {}); // Silently fail