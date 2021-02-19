import React from "react";
import Constants from "expo-constants";
import { StyleSheet, SafeAreaView, View, Keyboard } from "react-native";

function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View onStartShouldSetResponder = {()=>Keyboard.dismiss()} style={{flex: 1}} >{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  view: {
    flex: 1
  }
});

export default Screen;
