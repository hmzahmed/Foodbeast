import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";

function CheckOutSwipes({ onPress, number, name, color }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container,{backgroundColor: color}]}>
        <AppText>{number}</AppText>
        <MaterialCommunityIcons
          name={name}
          size={35}
          color={colors.white}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CheckOutSwipes;
