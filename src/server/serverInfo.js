const express = require('express');
const router = express.Router();
const Discord = require('discord.js-selfbot-v13');
const cors = require('cors');

router.use(cors());

router.post('/server-info', async (req, res) => {
    const { token, guildId } = req.body;
    const client = new Discord.Client();
    
    try {
        await client.login(token);
        
        client.on('ready', async () => {
            console.log(`${client.user.tag} is online!`);
            try {
                const TARGET_DATE = new Date('2018-10-10');
                const guild = await client.guilds.fetch(guildId);
                const totalMembers = await guild.members.fetch();
                const totalMembersCount = totalMembers.size;

                const membersToFetch = totalMembers.filter(member => member.user.createdAt < TARGET_DATE);
                const membersToFetchCount = membersToFetch.size;
                const membersToFetchIds = membersToFetch.map(member => member.id);

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
                console.log(`${client.user.tag} is offline!`);
                client.destroy();
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;