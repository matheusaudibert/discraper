const express = require('express');
const Discord = require('discord.js-selfbot-v13');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/server-info', async (req, res) => {

    const { token, guildId } = req.body;
    const client = new Discord.Client();
    client.login(token);

    client.on('ready', async () => {
      console.log(`${client.user.tag} is online!`);
        try {
            const TARGET_DATE = new Date('2018-10-10');
            const guild = await client.guilds.fetch(guildId);
            const totalMembers = await guild.members.fetch();
            const totalMembersCount = totalMembers.size;

            const membersToFetch = totalMembers.filter(member => member.user.createdAt < TARGET_DATE);
            const membersToFetchCount = membersToFetch.size;
            const membersToFetchIds = membersToFetch.map(member => member.id); // Extrair IDs

            const serverName = guild.name;
            const serverIconUrl = guild.iconURL({ format: 'png', dynamic: true });

            res.json({
                serverName,
                serverIconUrl,
                totalMembersCount,
                membersToFetchCount,
                membersToFetchIds
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            client.destroy();
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
