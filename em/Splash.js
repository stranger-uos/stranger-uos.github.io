import React, {Component} from "react";
import {View, Image, StyleSheet} from "react-native";

export default class Splash extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../img/splash.png')} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
