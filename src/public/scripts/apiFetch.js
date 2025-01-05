const INITIAL_DELAY = 4500;
const MAX_RETRIES = 3;
const audio = new Audio('../assets/audios/notification.mp3');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUser(id, retryCount = 0) {
    try {
        const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${id}`);
        const data = await response.json();

        if (data.message && data.message.includes('rate limited')) {
            console.log(`Rate limit - ${id}`);
            const retryAfter = Math.ceil((data.retry_after || 1) * 1000);
            await sleep(retryAfter);
            return false;
        }

        if (data.badges && (data.badges.includes('EARLY_SUPPORTER') || 
            data.badges.includes('EARLY_VERIFIED_BOT_DEVELOPER') || 
            data.badges.includes('HYPESQUAD_EVENTS') || 
            data.badges.includes('PARTNERED_SERVER_OWNER') || 
            data.badges.includes('DISCORD_CERTIFIED_MODERATOR') || 
            data.badges.includes('DISCORD_EMPLOYEE') || 
            data.badges.includes('BUGHUNTER_LEVEL_1') || 
            data.badges.includes('BUGHUNTER_LEVEL_2'))) {
            
            const userInfo = {
                id: data.id,
                username: data.username,
                avatar: data.avatar.link,
                badges: data.badges,
                createdAt: data.created_at
            };
            return userInfo;
        }
        
        await sleep(INITIAL_DELAY);
        return false;
        
    } catch (error) {
        
        if (retryCount < MAX_RETRIES) {
            await sleep(INITIAL_DELAY * (retryCount + 1));
            return checkUser(id, retryCount + 1);
        }
        return false;
    }
}

let userIdsWithBadges = [];
let isScrapingActive = true;

async function processIds(ids) {
    isScrapingActive = true;
    const downloadButton = document.querySelector('.scrapper-button.download');
    const startButton = document.querySelector('.scrapper-button.start');
    const finishButton = document.querySelector('.scrapper-button.finish');
    downloadButton.disabled = true;
    
    
    startButton.disabled = true;
    startButton.textContent = 'Started!';

    const queue = [];
    for (let i = 0; i < ids.length; i += 5) {
        queue.push(ids.slice(i, i + 5));
    }

    let processedCount = 0;
    let foundCount = 0;
    const serverProgress = document.querySelector('.server-progress');

    userIdsWithBadges = []; 

    for (const batch of queue) {
        if (!isScrapingActive) {
            downloadButton.disabled = true;
            serverProgress.textContent = "Finished!";
            serverProgress.setAttribute('data-status', 'finished');
            finishButton.textContent = "Finished!";
            finishButton.disabled = true;
            return; 
        }

        const results = await Promise.all(batch.map(id => checkUser(id.trim())));
        
        processedCount += batch.length;
        const foundInBatch = results.filter(Boolean).length;
        foundCount += foundInBatch;

        if (foundInBatch > 0) {
            audio.play(); // Tocar o áudio se pelo menos um usuário for encontrado no grupo
        }

    
        results.filter(Boolean).forEach(userInfo => {
            userIdsWithBadges.push({
                username: userInfo.username,
                id: userInfo.id
            });
            createUserCard(userInfo);
        });

        if (serverProgress) {
            serverProgress.textContent = `Progress: ${processedCount}/${ids.length}`;
        }


        if (processedCount === ids.length) {
            downloadButton.disabled = userIdsWithBadges.length === 0;
            serverProgress.textContent = "Finished!";
            serverProgress.setAttribute('data-status', 'finished');
            finishButton.textContent = "Finished!";
            finishButton.disabled = true;
        }

        console.log(`Progresso: ${processedCount}/${ids.length} (${foundCount} encontrados)`);
    }
}

function createUserCard(userInfo) {
    const usersGrid = document.querySelector('.users-grid');
    const centralMessage = document.querySelector('.scrapper-results .central-message');

    if (centralMessage) {
        centralMessage.style.display = 'none';
    }

    const userCard = document.createElement('a');
    userCard.href = `https://discord.com/users/${userInfo.id}`;
    userCard.target = '_blank';
    userCard.classList.add('user-card');

    userCard.innerHTML = `
        <img src="${userInfo.avatar}" alt="User Avatar" class="user-card-avatar" />
        <span class="user-card-name">${userInfo.username}</span>
        <span class="user-card-member">${new Date(userInfo.createdAt).toLocaleDateString()}</span>
        <div class="user-card-badges">
            ${userInfo.badges.map(badge => `<img src="../assets/badges/${badge.toLowerCase()}.png" alt="${badge}" class="user-card-badge" />`).join('')}
        </div>
    `;

    usersGrid.appendChild(userCard);
}

function downloadIds() {
    const content = userIdsWithBadges.map(user => `${user.username} - ${user.id}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discrapper.com.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function stopScraping() {
    isScrapingActive = false;
    const serverProgress = document.querySelector('.server-progress');
    const finishButton = document.querySelector('.scrapper-button.finish');
    
    serverProgress.textContent = "Finished!";
    serverProgress.setAttribute('data-status', 'finished');
    finishButton.textContent = "Finished!";
    finishButton.disabled = true;
}

export { processIds, stopScraping, downloadIds };
