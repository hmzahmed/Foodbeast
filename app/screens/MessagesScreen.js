import React, { useState, useEffect, useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as firebase from "firebase"
import 'firebase/firestore';

import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import AuthContext from "../Auth/context";

const initialMessages = [
  {
    id: 1,
    title: "Nashit",
    description: "hey",
    image: 'https://picsum.photos/200/300'
  },
  {
    id: 2,
    title: "Abdullah",
    description: "Hello bro",
    image: 'https://picsum.photos/200/300'
  },
];

function MessagesScreen({navigation}) {
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);
  const [listings , setListings ] = useState();
  const [Loading , isLoading] = useState();
  const authContext = useContext(AuthContext)

  async function loadData() {
    const userRef = await firebase.firestore().collection('users').doc(authContext.userDetails.docId).get()
    let user = userRef.data()
    console.log("not entered")
    if('foodbuddies' in user){
        console.log('entered')
        let x= []
        let fb = Array.from(user.foodbuddies)
        for(const buddies of fb){
            console.log(buddies)
          let w = await firebase.firestore().collection('users').doc(buddies).get()
          console.log(w.data())
          x.push({id: w.id , data: w.data()})
          
        }
        setListings(x)
    }
    return
}

useEffect(()=>{
  loadData()
},[])


  const handleDelete = (message) => {
    // Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen>
      <FlatList
        data={listings}
        keyExtractor={(listings) => listings.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.data.name}
            subTitle={item.data.email}
            chevron
            image={item.image}
            onPress={() => navigation.navigate('Texting',item)}  

          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        // onRefresh={() => {
        //   setMessages([
        //     {
        //       id: 2,
        //       title: "T2",
        //       description: "D2",
        //       image: require("../assets/mosh.jpg"),
        //     },
        //   ]);
        // }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
