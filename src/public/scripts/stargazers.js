document.addEventListener('DOMContentLoaded', async () => {
    const stargazersGrid = document.querySelector('.stargazers-grid');
    
    try {
        
        const response = await fetch('https://api.github.com/repos/matheusaudibert/discraper/stargazers');
        const stargazers = await response.json();

        stargazers.forEach(user => {
            const stargazer = document.createElement('a');
            stargazer.href = user.html_url;
            stargazer.target = '_blank';
            stargazer.className = 'stargazer';
            stargazer.title = user.login;

            const img = document.createElement('img');
            img.src = user.avatar_url;
            img.alt = user.login;

            stargazer.appendChild(img);
            stargazersGrid.appendChild(stargazer);
        });
    } catch (error) {
        console.error('Error fetching stargazers:', error);
    }
});
