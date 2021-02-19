import React, { useContext, useState } from "react";
import { StyleSheet, View, FlatList, Modal, TouchableOpacity, Platform } from "react-native";

import Screen from "../components/Screen";
import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import UpdateAccountScreen from "./UpdateAccountScreen";
import AppButton from "../components/AppButton";
import * as firebase from "firebase"
import 'firebase/firestore';
import authStorage from '../Auth/storage'
import AuthContext from "../Auth/context";
import WebView from "react-native-webview";
import AppText from "../components/AppText";

let source = Platform.OS === 'ios'
          ? require('../assets/game.html')
          : {uri: '../assets/game.html'};
const menuItems = [

  {
    title: "Add Item to Menu",
    icon: {
      name: "food-fork-drink",
      backgroundColor: colors.secondary,
    },
    targetScreen: "Add Menu Item"
  },
  {
    title: "Edit Menu",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: "Edit Menu"
  },
  {
    title: "Sales",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: "Analytics"
  },
];
const userItems = [
  {
    title: "My Orders",
    icon: {
      name: "food-fork-drink",
      backgroundColor: colors.primary,
    },
    targetScreen: "Orders"
  },
  {
    title: "My FoodBuddies",
    icon: {
      name: "food-fork-drink",
      backgroundColor: colors.primary,
    },
    targetScreen: "Foodbuddy"
  },
 
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: "Message"
  },

];

function AccountScreen({navigation}) {
  const [modalVisible, setModalVisible]=useState(false)
  const authContext = useContext(AuthContext)
  const [gameModal,setGameModal] = useState(false)
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={authContext.userDetails.name}
          subTitle={authContext.userDetails.email}
          image={authContext.userDetails.image}
          settingIcon
          onSettingPress={()=>navigation.navigate("Update Account")}
          

        />
      </View>
      <View style={styles.container}>
        {authContext.userDetails.isRestaurant === true && <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress = {()=>navigation.navigate(item.targetScreen)}
            />
          )}
        />}
        <FlatList
          data={userItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress = {()=>navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>

      {Platform.OS === 'ios' && <ListItem
        title="Play Game"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={()=> {setGameModal(true)}}
      />}
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={()=> {authStorage.removeToken();firebase.auth().signOut();authContext.setUserDetails(null)}}
      />
          <Modal visible = {gameModal} animationType="slide">
            <Screen style={{backgroundColor: colors.black}}>
              <WebView
                originWhitelist={['*']}
                javaScriptEnabled={true}
                scrollEnabled = {true}
                style ={{width: "100%", }}
                domStorageEnabled={true}
                source={source}>
                </WebView>

   <TouchableOpacity 
   style={{backgroundColor: colors.primary, borderRadius: 500, padding: 5,marginTop:55, marginLeft: 5, width: '50%', alignItems: "center", alignSelf: "center", marginBottom: 50}} 
   onPress = {() =>{setGameModal(false)}}>

                    <AppText style={{color: colors.white}}>Quit</AppText>

        </TouchableOpacity>
        </Screen></Modal>
     
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
