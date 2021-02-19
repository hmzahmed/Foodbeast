import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AppText from '../components/AppText';
import Screen from '../components/Screen'
import colors from '../config/colors';
import ListItemSeparator from "../components/lists/ListItemSeparator"
import ListItem from "../components/lists/ListItem"
import * as firebase from "firebase"
import 'firebase/firestore';
import { color } from 'react-native-reanimated';
import ActivityIndicator from '../components/ActivityIndicator';
import AuthContext from '../Auth/context';





function OrdersScreen({navigation}) {
  const [loading,isLoading]=useState(false)
  const authContext = useContext(AuthContext)
  const [pending, setPending] = useState(true)
  const [accept, setAccept] = useState(false)
  const [dispatch, setDispatch] = useState(false)
  const [state, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  async function loadROrdersData() {
    setMessages(null)
    isLoading(true)
    const postRef = await firebase.firestore().collection("orders").where("restaurant","==",authContext.userDetails.docId).orderBy("time", "desc").get()
    let data = []

    if(accept){
    postRef.forEach(doc => {
      if(doc.data().accepted === true && doc.data().dispatched === false)
        data.push({id: doc.id, data: doc.data()})
      })
      
      setMessages(data)
      isLoading(false)
      return
    }
    else if(dispatch){
    postRef.forEach(doc => {
      if(doc.data().dispatched === true)
        data.push({id: doc.id, data: doc.data()})
      })

      setMessages(data)
      isLoading(false)

      return
    }
    else if(pending){
    postRef.forEach(doc => {
      if(doc.data().accepted === false)
        data.push({id: doc.id, data: doc.data()})

      })

      setMessages(data)
      isLoading(false)

      return
    }



    // setMessages(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
    isLoading(false)

  }
  async function loadUOrdersData() {
    isLoading(true)
    const postRef = await firebase.firestore().collection("orders").where("user","==",authContext.userDetails.docId).orderBy("time", "desc").get()
    setMessages(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
    isLoading(false)

  }
    const [messages, setMessages] = useState();


    useEffect(() => {
      const unsubscribe = firebase.firestore().collection('orders').onSnapshot(snapshot => {
          if (snapshot.size) {
            if(authContext.userDetails.isRestaurant === false){
              loadUOrdersData();
            }
            else {
              loadROrdersData();
            }
          } else {
            // it's empty
          }
        })
    return () => {
        unsubscribe()
      }
    }, [firebase,state])

  




    return (
        <Screen style={styles.screenStyle}>
           
            <View style = {styles.container}>
                <AppText style = {styles.titleheader}>Orders</AppText>
            </View>
            {authContext.userDetails.isRestaurant === true && <View style = {styles.options}>
              <View style={{backgroundColor: pending?colors.primary:colors.light, padding: 5, borderRadius: 100, paddingHorizontal:10}} >
                <TouchableHighlight onPress={()=>{setAccept(false), setDispatch(false), setPending(true), forceUpdate()}}>
                  <AppText style={{color: pending?colors.white:colors.black}} >Pending</AppText></TouchableHighlight></View>

              <View style={{backgroundColor: accept?colors.primary:colors.light, padding: 5, borderRadius: 100, paddingHorizontal:8}} >
                <TouchableHighlight onPress={()=>{setAccept(true), setDispatch(false), setPending(false), forceUpdate()}}>
                  <AppText style={{color: accept?colors.white:colors.black}} >Accepted</AppText></TouchableHighlight></View>

              <View style={{backgroundColor: dispatch?colors.primary:colors.light, padding: 5, borderRadius: 100, paddingHorizontal:6}} >
                <TouchableHighlight onPress={()=>{setAccept(false), setDispatch(true), setPending(false), forceUpdate()}}>
                  <AppText style={{color: dispatch?colors.white:colors.black}} >Dispatched</AppText></TouchableHighlight></View>
            </View>}
            {
              loading && <Image style = {styles.loading} source={require('../assets/loading.gif')}  />
            }
            <FlatList
                data={messages}
                keyExtractor={(message) => message.id.toString()}
                renderItem={({ item }) => (
                    <ListItem
                    title={authContext.userDetails.isRestaurant? item.data.username:item.data.restaurantName}
                    subTitle={item.data.address}
                    onPress={() => navigation.navigate("Order Details", item)}

                    />
                )}
                ItemSeparatorComponent={ListItemSeparator}
                
             />
        </Screen>
    );
}

const styles = StyleSheet.create({
  loading: {
    height: 300,
    width : 300,
    alignSelf: "center"
  },
    container: {
        padding: 10,
        backgroundColor: colors.light
    },
    titleheader: {
        fontSize: 28,
        color: colors.primary,
        fontWeight: "bold"
    },
    screenStyle: {
      backgroundColor: colors.light
    },
    options: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 30,
      paddingBottom: 10,
      
      
    }
})


export default OrdersScreen;