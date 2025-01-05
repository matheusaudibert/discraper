import { membersToFetchList, checkDiscordToken, checkGuildMembership, updateScrapperUserInfo, updateScrapperServerInfo } from './tokenChecker.js';
import { processIds, stopScraping, downloadIds } from './apiFetch.js';

const tokenInput = document.querySelector('input[placeholder="Your Discord Token"]');
const tokenStatus = tokenInput.nextElementSibling;
const serverInput = document.querySelector('input[placeholder="Server ID"]');
const serverStatus = serverInput.nextElementSibling;
const getButton = document.querySelector('.hero-button');
const startButton = document.querySelector('.scrapper-button.start');
const centralMessage = document.querySelector('.central-message');

let userId = null; 
let isServerInfoLoaded = false;
let isUserInfoLoaded = false;


tokenStatus.textContent = "";
serverStatus.textContent = "";


document.addEventListener('DOMContentLoaded', () => {
    tokenInput.value = '';
    serverInput.value = '';
});


async function checkServer(showAfterCheck = false) {
    if (!serverInput.value.trim()) {
        serverStatus.textContent = "";
        return;
    }
    
    if (!/^\d+$/.test(serverInput.value.trim()) || serverInput.value.trim().length <= 12) {
        serverStatus.textContent = "Error!";
        serverStatus.style.color = "#f04747";
        return;
    }

    if (!tokenInput.value.trim() || tokenStatus.textContent !== "Ready!") {
        serverStatus.textContent = "Token!";
        serverStatus.style.color = "#faa61a";
        return;
    }

    try {
        const guildInfo = await checkGuildMembership(tokenInput.value, serverInput.value);
        if (guildInfo) {
            serverStatus.textContent = "Ready!";
            serverStatus.style.color = "#43b581";
            await updateScrapperServerInfo(tokenInput.value, serverInput.value); // Atualizar info do servidor
            isServerInfoLoaded = true;
            if (showAfterCheck) {
                showScrapper();
                showScrapperButtons();
                const resultsCentralMessage = document.querySelector('.scrapper-results .central-message2');
                if (resultsCentralMessage) {
                    resultsCentralMessage.textContent = 'Members who were scrapped...';
                }
            }
        } else {
            serverStatus.textContent = "Error!";
            serverStatus.style.color = "#f04747";
        }
        updateButtonState();
    } catch (error) {
        console.error('Erro ao verificar o servidor:', error);
        serverStatus.textContent = "Error!";
        serverStatus.style.color = "#f04747";
        updateButtonState();
    }
}


function updateButtonState() {
    if (tokenStatus.textContent === "Ready!" && serverStatus.textContent === "Ready!") {
        getButton.classList.add('active');
    } else {
        getButton.classList.remove('active');
    }
}


function showScrapper() {
    centralMessage.style.display = 'none';
    const scrapper = document.querySelector('.scrapper');
    scrapper.style.display = 'flex';
}


function showScrapperButtons() {
    const scrapperButtons = document.querySelector('.scrapper-buttons');
    scrapperButtons.style.display = 'flex';
}


function checkAllDataLoaded() {
    
}


tokenInput.addEventListener('input', async () => {
    if (!tokenInput.value.trim()) {
        tokenStatus.textContent = "";
        return;
    }

    const trimmedToken = tokenInput.value.trim();
   
    if (!trimmedToken.includes('.') || trimmedToken.length <= 30) {
        tokenStatus.textContent = "Error!";
        tokenStatus.style.color = "#f04747";
        updateButtonState();
        return;
    }

    if (trimmedToken.includes('.') && trimmedToken.length > 30) {
        tokenStatus.textContent = "Check!";
        tokenStatus.style.color = "#faa61a";
    }

    try {
        userId = await checkDiscordToken(tokenInput.value);
        if (userId) {
            tokenStatus.textContent = "Ready!";
            tokenStatus.style.color = "#43b581";
            isUserInfoLoaded = true;
            checkAllDataLoaded();
        } else {
            tokenStatus.textContent = "Error!";
            tokenStatus.style.color = "#f04747";
        }
        updateButtonState();
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        tokenStatus.textContent = "Error!";
        tokenStatus.style.color = "#f04747";
        updateButtonState();
    }
});


serverInput.addEventListener('input', async () => {
    if (!serverInput.value.trim()) {
        serverStatus.textContent = "";
        return;
    }

   
    if (!/^\d+$/.test(serverInput.value.trim()) || serverInput.value.trim().length <= 12) {
        serverStatus.textContent = "Error!";
        serverStatus.style.color = "#f04747";
        updateButtonState();
        return;
    }

    if (/^\d+$/.test(serverInput.value.trim()) && serverInput.value.trim().length > 12) {
        serverStatus.textContent = "Check!";
        serverStatus.style.color = "#faa61a";
    }

    if (!tokenInput.value.trim()) {
        serverStatus.textContent = "Token!";
        serverStatus.style.color = "#faa61a";
        updateButtonState();
        return;
    }

    try {
        const guildInfo = await checkGuildMembership(tokenInput.value, serverInput.value);
        if (guildInfo) {
            serverStatus.textContent = "Ready!";
            serverStatus.style.color = "#43b581";
            isServerInfoLoaded = true;
            checkAllDataLoaded();
        } else {
            serverStatus.textContent = "Error!";
            serverStatus.style.color = "#f04747";
        }
        updateButtonState();
    } catch (error) {
        console.error('Erro ao verificar o servidor:', error);
        serverStatus.textContent = "Error!";
        serverStatus.style.color = "#f04747";
        updateButtonState();
    }
});


getButton.addEventListener('click', async () => {
    if (getButton.classList.contains('active')) {
        centralMessage.textContent = "Generating your session...";
        await updateScrapperUserInfo(userId); 
        await checkServer(true); 
        
        tokenInput.value = '';
        serverInput.value = '';
        tokenStatus.textContent = '';
        serverStatus.textContent = '';
        getButton.classList.remove('active');
    }
});


startButton.addEventListener('click', async () => {
    if (membersToFetchList.length > 0) {
        await processIds(membersToFetchList);
    }
});


const downloadButton = document.querySelector('.scrapper-button.download');
downloadButton.addEventListener('click', () => {
    if (!downloadButton.disabled) {
        downloadIds();
    }
});

const finishButton = document.querySelector('.scrapper-button.finish');
finishButton.addEventListener('click', () => {
    stopScraping();
    downloadButton.disabled = false;
});


updateButtonState();