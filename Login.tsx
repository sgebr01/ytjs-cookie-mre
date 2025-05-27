import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

const Login = ({navigation}) => {
    return (
        <WebView
            style={{ flex: 1 }}
            source={{ uri: "https://youtube.com/signin" }}
            onNavigationStateChange={(state) => {
                let url = state.url;
                if (
                    url == "https://m.youtube.com/" ||
                    url == "https://m.youtube.com/?noapp=1"
                ) {
                    navigation.goBack();
                }
        }} />
    )
}

export default Login

const styles = StyleSheet.create({})