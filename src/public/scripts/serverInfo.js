const PORT = document.querySelector('meta[name="port"]')?.content || 5500;

async function getServerInfo(token, guildId) {
    const response = await fetch(`http://localhost:${PORT}/server-info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, guildId })
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to fetch server info');
    }
}

export { getServerInfo };


