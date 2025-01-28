const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../node_modules/discord.js-selfbot-v13/src/managers/ClientUserSettingManager.js"
);

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error", err);
    return;
  }

  const patchedData = data
    .replace(
      "all: data.friend_source_flags.all || false,",
      "all: (data.friend_source_flags && data.friend_source_flags.all) || false,"
    )
    .replace(
      "mutual_friends: data.friend_source_flags.mutual_friends || false,",
      "mutual_friends: (data.friend_source_flags && data.friend_source_flags.mutual_friends) || false,"
    )
    .replace(
      "mutual_guilds: data.friend_source_flags.mutual_guilds || false,",
      "mutual_guilds: (data.friend_source_flags && data.friend_source_flags.mutual_guilds) || false,"
    )
    .replace(
      "mutual_friends: data.friend_source_flags.all ? true : data.friend_source_flags.mutual_friends,",
      "mutual_friends: (data.friend_source_flags && data.friend_source_flags.all) ? true : (data.friend_source_flags && data.friend_source_flags.mutual_friends),"
    )
    .replace(
      "mutual_guilds: data.friend_source_flags.all ? true : data.friend_source_flags.mutual_guilds,",
      "mutual_guilds: (data.friend_source_flags && data.friend_source_flags.all) ? true : (data.friend_source_flags && data.friend_source_flags.mutual_guilds),"
    );

  fs.writeFile(filePath, patchedData, "utf8", (err) => {
    if (err) {
      console.error("Error:", err);
      return;
    }

    console.log("Patched!");
  });
});
