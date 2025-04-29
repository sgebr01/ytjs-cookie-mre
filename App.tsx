import { Text, View } from "react-native";
import { useEffect, useState } from "react";

import Innertube from "./ytjs";

export default function App() {
  const [notificationCount, setNotificationCount] = useState<number>()

  useEffect(() => {
      Innertube.create({retrieve_player: false}).then((yt) => {
        yt.getUnseenNotificationsCount().then((count) => {
          console.log("GOT UNSEEN NOTIFICATION COUNT", count)
          setNotificationCount(count)
        });
      });
  }, []);

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text style={{fontWeight: 'bold', fontSize: 25}}>Fetched UnseenNotifCount: {notificationCount}</Text>
    </View>
  );
}

