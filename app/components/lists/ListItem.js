import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import AppText from "../AppText";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {MaterialCommunityIcons} from "@expo/vector-icons"

import colors from "../../config/colors";
import { Rating } from "react-native-ratings";


function ListItem({
  title,
  avgRating,
  subTitle,
  image,
  IconComponent,
  onPress,
  renderRightActions,
  renderLeftActions,
  style,
  badge=false,
  count = 0,
  imageStyle,
  chevron,
  settingIcon,
  onSettingPress
}) {
  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions} friction={2}  >
      <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
        <View style={[styles.container, style]}>
          {IconComponent}
          {image && <Image style={[styles.image,imageStyle]}source= {{uri: image}} />}
          <View style={[styles.detailsContainer]}>
            <AppText style={styles.title} numberOfLines ={1}>{title}</AppText>
            {subTitle && <AppText style={styles.subTitle} numberOfLines ={2}>{subTitle}</AppText>}
          </View>
          {count>0 && <AppText>In Cart: {count}</AppText>}
          {chevron && <MaterialCommunityIcons color={colors.medium} name = "chevron-right" size= {25}></MaterialCommunityIcons>}
          {settingIcon && <MaterialCommunityIcons onPress={onSettingPress} color={colors.primary} name = "lead-pencil" size= {25}></MaterialCommunityIcons>}
          {badge &&
          <View style={{backgroundColor: colors.light, alignItems: "center", padding: 10, borderRadius: 50, borderColor: colors.primary, borderWidth: 2}}>
            <AppText style={{color:colors.black}}>Rated {Math.round((avgRating + Number.EPSILON) * 100) / 100} </AppText>
            <Rating
            startingValue = {Math.round((avgRating + Number.EPSILON) * 100) / 100}
            fractions = {1}
            imageSize ={20}
            readonly ={true}
            tintColor = {colors.light}
            />
          </View>
          }
          
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
});

export default ListItem;
