// In App.js in a new project
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import CookieManager from '@react-native-cookies/cookies';
import Innertube, { YT } from 'youtubei.js';
import { customFetch } from './CustomFetch';

function HomeScreen({ navigation }) {
  const [signedIn, setSignedIn] = useState(false);
  const [accountInfo, setAccountInfo] = useState<YT.AccountInfo>(null);

  useFocusEffect(() => {
    CookieManager.get("https://www.youtube.com").then((cookies) => {
      if (cookies['LOGIN_INFO'] && cookies["SAPISID"] && cookies["APISID"]) {
        console.log("User is signed in");
        setSignedIn(true);
        console.log("Cookies are", Object.keys(cookies));
        // Since we're signed in, we can create an Innertube instance and fetch what we need
        if (accountInfo === null) {
          Innertube.create({ retrieve_player: false, fetch: customFetch }).then((yt) => {
            yt.session.logged_in = true;

            yt.account.getInfo().then((account) => {
              console.log("got account info", account);
              setAccountInfo(account)
            })
          })
        }
      } else {
        setSignedIn(false)
      }
    })
  })

  if (signedIn) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {accountInfo ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", paddingVertical: 20 }}>Signed In</Text>
            <Image source={{ uri: accountInfo.contents.contents[0].account_photo[0].url }} resizeMode="cover" style={{ borderRadius: 1000, width: "30%", aspectRatio: 1 }} />
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>{accountInfo.contents.contents[0].account_name.text}</Text>
            <Text style={{ opacity: 0.6, fontSize: 20 }}>{accountInfo.contents.contents[0].channel_handle.text}</Text>
          </View>
        ) : (
          <Text>Auth Flow Done, but Account Info Fetch Failed or Loading</Text>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate("Login") }}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>);
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    paddingHorizontal: 30,
    borderRadius: 5,
    paddingVertical: 5
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  }
})
