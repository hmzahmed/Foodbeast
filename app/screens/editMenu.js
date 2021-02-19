import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AppText from '../components/AppText';
import Screen from '../components/Screen'
import colors from '../config/colors';
import ListItemSeparator from "../components/lists/ListItemSeparator"
import ListItem from "../components/lists/ListItem"
import * as firebase from "firebase"
import 'firebase/firestore';
import AuthContext from '../Auth/context';





function editMenu({navigation}) {
  const authContext = useContext(AuthContext)
  async function loadMenuItems() {
    const postRef = await firebase.firestore().collection("menuItems").where("resId","==",authContext.userDetails.docId).get()
    setMessages(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
  }
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);





    const [messages, setMessages] = useState();

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection('menuItems').onSnapshot(snapshot => {
            if (snapshot.size) {
                loadMenuItems();
            } else {
              // it's empty
            }
          })
      return () => {
          unsubscribe()
        }
      }, [firebase])

    return (
        <Screen>

            <View style = {styles.container}>
                <AppText style = {styles.titleheader}>Edit Menu</AppText>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(message) => message.id.toString()}
                renderItem={({ item }) => (
                    <ListItem
                    title={item.data.title}
                    subTitle={item.data.price}
                    image = {item.data.images}
                    chevron
                    onPress = {()=>{navigation.navigate("Edit Menu Item", item); forceUpdate()}}
                    />
                )}
                ItemSeparatorComponent={ListItemSeparator}
                
             />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    titleheader: {
        fontSize: 28,
        color: colors.primary,
        fontWeight: "bold"
    }
})


export default editMenu;