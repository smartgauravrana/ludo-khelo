const OneSignal = require("onesignal-node");

// appId, appKey
const client = new OneSignal.Client(
  process.env.ONESIGNAL_APPID,
  process.env.ONESIGNAL_APPKEY
);

module.exports.sendNotification = async ({ content, playerIds }) => {
  const notification = {
    contents: {
      en: content
    },
    include_player_ids: playerIds
  };
  if (playerIds && playerIds.length) {
    try {
      await client.createNotification(notification);
    } catch (e) {
      if (e instanceof OneSignal.HTTPError) {
        // When status code of HTTP response is not 2xx, HTTPError is thrown.
        console.log(e.statusCode);
        console.log(e.body);
      }
    }
  }
};
