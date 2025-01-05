const badges = [
    {
        src: '../assets/badges/early_supporter.png',
        alt: 'Early Supporter Badge'
    },
    {
        src: '../assets/badges/early_verified_bot_developer.png',
        alt: 'Early Verified Developer Badge'
    },
    {
        src: '../assets/badges/house_bravery.png',
        alt: 'Bravery Badge'
    },
    {
        src: '../assets/badges/house_brilliance.png',
        alt: 'Brilliance Badge'
    },
    {
        src: '../assets/badges/house_balance.png',
        alt: 'Balance Badge'
    },
    {
        src: '../assets/badges/hypesquad_events.png',
        alt: 'HypeSquad Events Badge'
    },
    {
        src: '../assets/badges/bughunter_level1.png',
        alt: 'Bug Hunter Badge'
    },
    {
        src: '../assets/badges/bughunter_level2.png',
        alt: 'Bug Hunter Gold Badge'
    },
    {
        src: '../assets/badges/discord_employee.png',
        alt: 'Staff Badge'
    },
    {
        src: '../assets/badges/partnered_server_owner.png',
        alt: 'Partner Badge'
    },
    {
        src: '../assets/badges/discord_certified_moderator.png',
        alt: 'Moderator Badge'
    }
];

function getRandomBadges() {
    const shuffled = [...badges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
}

function updateHeroBadges() {
    const badgesContainer = document.querySelector('.hero-badges');
    const randomBadges = getRandomBadges();
    
    badgesContainer.innerHTML = randomBadges.map(badge => `
        <img src="${badge.src}" alt="${badge.alt}" class="hero-badge">
    `).join('');
}

document.addEventListener('DOMContentLoaded', updateHeroBadges);
