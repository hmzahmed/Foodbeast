import React, { useContext, useEffect, useState } from 'react';
import {View, StyleSheet} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, ListItemSeparator } from '../components/lists';
import Screen from '../components/Screen';
import colors from "../config/colors"
import Card from "../components/Card"
import { StatusBar } from 'expo-status-bar';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AuthContext from '../Auth/context';
import * as firebase from "firebase"
import 'firebase/firestore';






function UserDetailScreen({route}) {
  const item = route.params
  const [friend,setFriend] = useState(false)
  const [like, setLike] = useState(false)
  const [listings,setListings] = useState()
  const [userProfile,setUserProfile] = useState(null)

  async function loaddata() {
    const postRef = await firebase.firestore().collection("posts").where("userDocId", "==",item.data.userDocId).get()
    setListings(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
    const userRef = firebase.firestore().collection('users').doc(item.data.userDocId);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      setUserProfile({id: doc.id, data: doc.data()})
    }
  }
  
  useEffect(()=> {
      loaddata();
      checkFriend();
  
  },[])
  
  const authContext = useContext(AuthContext)
  

  const handleLike = () => {
    if(like === false){
      setLike(true)
    }
    else{
      setLike(false)
    }
  }

  async function addFriend() {
    const postRef = firebase.firestore().collection('users').doc(authContext.userDetails.docId)
    if(await checkFriend()){
      console.log("UnLiking")
      setFriend(false)
      await postRef.update({
        foodbuddies: firebase.firestore.FieldValue.arrayRemove(item.data.userDocId)
      })
    }
    else{
      console.log("Liking")
      setFriend(true)
      await postRef.update({
        foodbuddies: firebase.firestore.FieldValue.arrayUnion(item.data.userDocId)
      })
    }
    
  }
  
  const checkFriend = async() =>{
    const postRef = await firebase.firestore().collection('users').doc(authContext.userDetails.docId).get()
    if('foodbuddies' in postRef.data() === false) {
      setFriend(false)
      return false
    }
    let array = []
    array = Array.from(postRef.data().foodbuddies)
  
    
    console.log(array)
    if(array.includes(item.data.userDocId)){
      console.log('True')
      setFriend(true)
      return true
    }
    else{
      setFriend(false)
      return false
    }
  
  }

    return (
        <Screen style = {{backgroundColor: colors.light}}>
          {userProfile!==null && <ListItem
            image={userProfile.data.image}
            title={userProfile.data.name}
            subTitle = {userProfile.data.email}
            style = {{backgroundColor: colors.light, flexDirection: "row"}}
            imageStyle ={{borderColor: colors.primary,borderWidth: 5, height: 100, width: 100, borderRadius: 75}}
          ></ListItem>}
          {(item.data.userDocId === authContext.userDetails.docId) === false &&<MaterialCommunityIcons style = {{position: "absolute", top: 15, right: 30}} size= {25} color ={friend? colors.secondary:colors.primary} onPress={() => addFriend(true)}  name = {friend?"account-check-outline" :"account-plus-outline"}></MaterialCommunityIcons>}
          <View style={styles.separator} />
           <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <>

          <Card
            feedImageStyle = {styles.feedImageStyle}
            isVideo = {checkVideo(item.data.type)}
            isImage = {checkImage(item.data.type)}
            isCheckIn = {item.data.isCheckIn}
            location = {item.data.addressLocation}
            isFeedPost   
            postId= {item.id}
            onLikePress = {handleLike}
            like = {like}
            title={item.data.name}
            subTitle={item.data.description}
            image={item.data.images}
          /></>
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
    feedStyle: {
        height: 600,
        borderRadius: 40,
        marginHorizontal: 20,
    },
    feedImageStyle: {
        aspectRatio: 1,
        alignSelf: "center",
        height: "70%",
    },
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: colors.primary,
        marginBottom: 5,
      },
    
})
export default UserDetailScreen;