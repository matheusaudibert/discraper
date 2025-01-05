import { getServerInfo } from './serverInfo.js';

async function checkDiscordToken(token) {
    try {
        const response = await fetch('https://discord.com/api/v9/users/@me', {
            headers: {
                'Authorization': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.id;
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function checkGuildMembership(token, guildId) {
    try {
        const response = await fetch(`https://discord.com/api/v9/users/@me/guilds/${guildId}/member`, {
            headers: {
                'Authorization': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function getUserInfo(userId) {
    try {
        const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${userId}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function updateScrapperUserInfo(userId) {
    const userInfo = await getUserInfo(userId);
    if (userInfo) {
        document.querySelector('.user-avatar').src = userInfo.avatar.link;
        document.querySelector('.user-name').textContent = `${userInfo.username}`;
    }
}

let membersToFetchList = [];

async function updateScrapperServerInfo(token, guildId) {
    try {
        const serverInfo = await getServerInfo(token, guildId);
        document.querySelector('.server-icon').src = serverInfo.serverIconUrl;
        document.querySelector('.server-name').textContent = serverInfo.serverName;
        
        // Atualizar spans com ícones
        document.querySelector('.server-details span:nth-child(1)').innerHTML = 
            `<i class="fa-solid fa-users"></i> Members: ${serverInfo.totalMembersCount}`;
        
        document.querySelector('.server-details span:nth-child(2)').innerHTML = 
            `<i class="fa-solid fa-magnifying-glass"></i> Members to Fetch: ${serverInfo.membersToFetchCount}`;
        
       
        let estimatedTimeMinutes = Math.ceil(serverInfo.membersToFetchCount / 60);
        if (estimatedTimeMinutes < 1) {
            estimatedTimeMinutes = 1;
        }
        
        document.querySelector('.server-details span:nth-child(3)').innerHTML = 
            `<i class="fa-solid fa-clock"></i> Estimated time: ${estimatedTimeMinutes} min`;

        membersToFetchList = serverInfo.membersToFetchIds;
    } catch (error) {
        console.error('Erro ao obter informações do servidor:', error.message);
    }
}

export { checkDiscordToken, checkGuildMembership, updateScrapperUserInfo, updateScrapperServerInfo, membersToFetchList };
