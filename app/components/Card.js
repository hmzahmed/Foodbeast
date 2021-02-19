import React, { useContext, useState } from "react";
import { View, StyleSheet, Image,TouchableWithoutFeedback } from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player'
import * as firebase from "firebase"
import 'firebase/firestore';




import AppText from "./AppText";
import colors from "../config/colors";
import MapView, { Marker } from "react-native-maps";
import { array } from "yup";
import AuthContext from "../Auth/context";
import { useEffect } from "react/cjs/react.development";

function Card({ title, postId, subTitle, image,isCheckIn, location, isImage, video, isVideo, feedImageStyle, feedStyle, isFeedPost=false, like, onLikePress, onPress, }) {
  const [mute,setMute]=useState(false)
  const [like1, setLike] = useState(false)
  const [noOfLike, setNoOfLikes] = useState(0)
  const authContext = useContext(AuthContext)



  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('posts').onSnapshot(snapshot => {
        if (snapshot.size) {
          checkLike()
          {
          // it's empty
        }
      }
    })
  return () => {
      unsubscribe()
    }
  }, [firebase,setLike])

 

async function likePost() {
  const postRef = firebase.firestore().collection('posts').doc(postId)
  if(await checkLike()){
    console.log("UnLiking")
    setLike(false)
    await postRef.update({
      likes: firebase.firestore.FieldValue.arrayRemove(authContext.userDetails.docId)
    })
  }
  else{
    console.log("Liking")
    setLike(true)
    await postRef.update({
      likes: firebase.firestore.FieldValue.arrayUnion(authContext.userDetails.docId)
    })
  }
  
}

const checkLike = async() =>{
  const postRef = await firebase.firestore().collection('posts').doc(postId).get()
  if(postRef.data().likes === null) {
    setLike(false)
    return false

  }
  let array = []
  array = Array.from(postRef.data().likes)

  setNoOfLikes(array.length)
  
  console.log(array)
  if(array.includes(authContext.userDetails.docId)){
    console.log('True')
    setLike(true)
    return true
  }
  else{
    setLike(false)
    return false
  }

}

  return (
    <View style={[styles.card, feedStyle]}>
      <View style ={{alignItems: "center",}}>
        {isCheckIn && 
        <MapView
            style ={{height:200, width:"95%"}}
            liteMode
            scrollEnabled={false}
            rotateEnabled ={false}
            region={{
              latitude: location ? location.latitude : 30.3753,
              longitude: location ? location.longitude : 69.3451,
              latitudeDelta:  location ? 0.01:4,
              longitudeDelta: location ? 0.01:4
          }}
        >
          
          <Marker
            pinColor = {colors.primary}
                style ={{borderColor: colors.secondary}}
                draggable ={false}
                coordinate = {location? location : {latitude: 1, longitude: 1}}
                title = "You"
             >
             </Marker>
          
          
          </MapView>}
      {isImage && 
      <TouchableWithoutFeedback onPress={onPress}>
        <Image progressiveRenderingEnabled resizeMethod="scale" resizeMode="contain" style={[styles.image]} source={{uri: image}} />
        </TouchableWithoutFeedback>}
        {isVideo&&
      <VideoPlayer
      height = {500}
      disableSlider
      showControlsOnLoad
      videoBackground= {colors.white}
      showFullscreenButton = {false}
      videoProps={{
        shouldPlay: false,
        resizeMode: "contain",
        source: {
          uri: image,
        },
      }}
      inFullscreen={false}
    />}
    </View>

      <View style={styles.detailsContainer}>
      <TouchableWithoutFeedback onPress = {onPress}>
        <AppText style={styles.title}>{title}</AppText>
        </TouchableWithoutFeedback>
        <AppText style={styles.subTitle}>{subTitle}</AppText>
        <View style={{flexDirection: "row"}}>
        {(isFeedPost) &&<MaterialCommunityIcons color = {like1? "red" : "black"} name = "heart" size = {25} onPress = {likePost}/>}
        {
          isFeedPost && <AppText  style={{fontWeight: "200", paddingLeft: 5, fontSize: 19, color: like1? colors.primary : "black"}}>{''+noOfLike + ' '}</AppText>
        }
        </View>
        {/* {(isFeedPost && checkLike ) && <MaterialCommunityIcons color = 'red' name = "heart" size = {25} onPress = {likePost}/>} */}
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    overflow: "hidden",
    aspectRatio: 1,
    alignSelf: "center",
  },
  subTitle: {
    color: colors.medium,
    fontWeight: "100",
    fontStyle: "italic"
  },
  title: {
    marginBottom: 7,
    fontWeight: "500"
  },
});

export default Card;
