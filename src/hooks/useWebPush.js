import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";

import { ONESIGNAL_CONFIG } from "../config";

const { appId, safariWebId } = ONESIGNAL_CONFIG;

export default function useWebPush({ userDetails, addDevice }) {
  const [isInitialised, setIsInitialised] = useState(false);
  const { _id: userId, notificationDevices } = userDetails;

  useEffect(() => {
    if (!isInitialised && userId) {
      OneSignal.initialize(appId, {
        safari_web_id: safariWebId
      });
      setTimeout(() => {
        OneSignal.getPlayerId()
          .then(playerId => {
            if (
              playerId &&
              (!notificationDevices || !notificationDevices.includes(playerId))
            ) {
              addDevice(playerId);
            }
          })
          .catch(err => console.log("player Id error: ", err));
      }, 3000);
      setIsInitialised(true);
    }
  }, [userId]);
}
