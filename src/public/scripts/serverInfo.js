async function getServerInfo(token, guildId) {
    const response = await fetch('http://localhost:3000/server-info', {
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
