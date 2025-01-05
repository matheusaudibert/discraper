async function getServerInfo(token, guildId) {
    const currentOrigin = window.location.origin;
    const response = await fetch(`${currentOrigin}/server-info`, {
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


