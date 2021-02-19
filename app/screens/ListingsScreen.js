import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LogBox } from 'react-native';

import * as firebase from "firebase"
import 'firebase/firestore';


import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import AuthContext from "../Auth/context";
import AppTextInput from "../components/AppTextInput";


function ListingsScreen({navigation}) {
  LogBox.ignoreAllLogs()
  const [listings, setListings] = useState();
  const [searchText, setSearchText] = useState("");
  const authContext = useContext(AuthContext);
  const [loading,isLoading]=useState(false);

  const textInput = React.useRef();

  const clearInput = () => (textInput.current.value = "");

  useEffect(()=> {
    loaddata();

},[searchText])

  async function loaddata() {
    isLoading(true)
    setListings(null)
    
    const postRef = await firebase.firestore().collection("users").where("isRestaurant","==",true).get()
    setListings(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
    let data =[]
    
    if(searchText!==null && searchText!==""){
      console.log("Searching")
    postRef.forEach(doc => {
          if(String(doc.data().name).toLowerCase().startsWith(String(searchText).toLowerCase())){
            data.push({id: doc.id, data: doc.data()})
          }
        })
    setListings(data)
    isLoading(false)
    return
  }
  isLoading(false)
  }

 function clearSearch(){
  setSearchText("");

  }

 

  return (
    <Screen style={styles.screen}>
      <View style={{flexDirection: "row", alignItems: "center"}} >
      <AppTextInput defaultValue={searchText} ct = {true} width="85%" otherStyle={{backgroundColor: colors.white}} onChangeText={text => setSearchText(text)} placeholder = "Search Here"/>
      {/* <MaterialCommunityIcons name="check-circle" size={45} color={colors.secondary} onPress={()=>loaddata()}  /> */}
      <MaterialCommunityIcons name={searchText==""?"search-web":"close-circle"} size={55} color={colors.primary} onPress={()=>{clearSearch()}}/>
      </View>
      {
              loading && <Image style = {styles.loading} source={require('../assets/loading.gif')}  />
            }
      <FlatList
        data={listings}
        keyExtractor={(listings) => listings.id.toString()}
        renderItem={({ item }) => (
          <Card
            isImage
            title={item.data.name}
            subTitle={item.data.email}
            image={item.data.image}
            onPress={()=> navigation.navigate("Restaurant Profile", item)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
  loading: {
    height: 300,
    width : 300,
    alignSelf: "center"
  },
});

export default ListingsScreen;
