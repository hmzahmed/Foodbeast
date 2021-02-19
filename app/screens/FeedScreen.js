import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TouchableHighlight, Modal } from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase"
import 'firebase/firestore';
import ActivityIndicator from "../components/ActivityIndicator";
import AuthContext from "../Auth/context";
import AppText from "../components/AppText";








function FeedScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading,isLoading]=useState(false)
  const authContext = useContext(AuthContext)
  


  async function loaddata() {
    isLoading(true)
    const postRef = await firebase.firestore().collection("posts").orderBy("time", "desc").get()
    setListings(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
    isLoading(false)
  }

  const [listings,setListings] = useState()
  useEffect(()=> {
      loaddata();

  },[])

  return (
    <Screen style={styles.screen}>
      <View style = {{flexDirection: "row-reverse", marginLeft: 10, marginBottom: 10, marginHorizontal: 3}}>
        <TouchableOpacity onPress={() => navigation.navigate("New Post")}  style={{marginHorizontal: 3, backgroundColor: colors.primary, borderRadius: 50, padding: 4}}>
          <MaterialCommunityIcons name = "plus" size={45} color={colors.white}></MaterialCommunityIcons>
        </TouchableOpacity>
        {authContext.userDetails.isRestaurant === false && <TouchableOpacity onPress={() => navigation.navigate("CheckIn")}  style={{backgroundColor: colors.primary, borderRadius: 50, padding: 4}}>
          <MaterialCommunityIcons name = "map-marker-plus" size={45} color={colors.white}></MaterialCommunityIcons>
        </TouchableOpacity>}
        {/* <TouchableOpacity onPress={() => setSearchModal(true)}  style={{marginHorizontal: 3, backgroundColor: colors.primary, borderRadius: 50, padding: 4, flexDirection: "row", alignItems: "center", paddingHorizontal: 15}}>
          <MaterialCommunityIcons name = "search-web" size={45} color={colors.white}></MaterialCommunityIcons>
          <AppText style={{color: colors.white}}>Search Users</AppText>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={listings}
        refreshing={refreshing}
        onRefresh={() => {
          loaddata();
        }}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <Card
            feedImageStyle = {styles.feedImageStyle}
            isVideo = {checkVideo(item.data.type)}
            isImage = {checkImage(item.data.type)}
            isCheckIn = {item.data.isCheckIn}
            location = {item.data.addressLocation}
            isFeedPost  
            postId= {item.id}          
            title={item.data.name}
            subTitle={item.data.description}
            image={item.data.images}
            onPress = {()=> navigation.navigate("Profile", item)}
          />
        )}
      />
      
    </Screen>
  );

  function checkVideo (type) {
    var str = String(type)
    if(str.includes("video"))
    {
      return true
    }
    else return false
  }
  function checkImage (type) {
    var str = String(type)
    if(str.includes("image"))
    {
      return true
    }
    else return false
  }
}



const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
  feedStyle: {
      height: 500,
      borderRadius: 40,
      marginHorizontal: 20,
      
  },
  button: {
    width: 45 ,height: 45,
  },
  feedImageStyle: {
    aspectRatio: 1,
    alignSelf: "center",
    height: "85%",

  }
});

export default FeedScreen;
