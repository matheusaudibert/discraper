const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../node_modules/discord.js-selfbot-v13/src/managers/ClientUserSettingManager.js');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    const patchedData = data.replace(
        'all: data.friend_source_flags.all || false,',
        'all: (data.friend_source_flags && data.friend_source_flags.all) || false,'
    );

    fs.writeFile(filePath, patchedData, 'utf8', (err) => {
        if (err) {
            console.error('Erro ao escrever o arquivo:', err);
            return;
        }

        console.log('Arquivo patchado com sucesso!');
    });
});
