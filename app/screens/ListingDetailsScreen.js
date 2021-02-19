import React, { useContext, useEffect, useState } from "react";
import {FlatList, Alert, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity ,Button, View, Image, StyleSheet, Modal } from "react-native";
import AppText from "../components/AppText";
import Screen from '../components/Screen'
import * as Yup from "yup";
import * as firebase from "firebase"
import 'firebase/firestore';


import {
  AppForm as Form,
  AppFormField as FormField,
  AppFormPicker as Picker,
  SubmitButton,
} from "../components/forms";

import {ListItem, ListItemSeparator, ListItemDeleteAction} from "../components/lists";
import colors from "../config/colors";
import AppReview from "../components/AppReview";
import AppButton from "../components/AppButton";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AppPostedReviews from "../components/AppPostedReviews";
import CheckOutSwipes from "../components/CheckOutSwipes";
import AuthContext from "../Auth/context";
import WebView from "react-native-webview";

const validationSchema = Yup.object().shape({
  description: Yup.string().label("Description"),
});


const handleReviewSubmit = (values, rating) =>{
  firebase.firestore().collection('reviews').add(values)

}

let totalBill = 0
let order = []
let avg = 0
let dbadding

const channelName = "hamzaahmed2403"

const initialHTMLContent = `

<!-- Add a placeholder for the Twitch embed -->
<div id="twitch-embed"></div>

<!-- Load the Twitch embed script -->
<script src="https://player.twitch.tv/js/embed/v1.js"></script>

<!-- Create a Twitch.Player object. This will render within the placeholder div -->
<script type="text/javascript">
  new Twitch.Player("twitch-embed", {
    width: "100%",
    height: 780,
    channel: "hamzaahmed2403"
  });
</script>
`;

function ListingDetailsScreen({route}) {
  const authContext = useContext(AuthContext)
  const listing = route.params
  const [loading,isLoading]=useState(false)
  const [rAvg,setRAvg]=useState(0)

  const [badge,setBadge] = useState(0)
  const [reviewModal, setReviewModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [lsModal, setLsModal] = useState(false);
  const [checkOutmodalVisible, setCheckOutModalVisible] = useState(false);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [rate, setRate] = useState(2.5);
  const [messages, setMessages] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (message) => {
    // Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  async function loadReviewData() {
    const postRef = await firebase.firestore().collection("reviews").where("resId","==",listing.id).orderBy('time','desc').get()
    setReviewData(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
    setRAvg(0)
    if(postRef.size){
    let t= 0
    let n = 0
    postRef.forEach(doc => {
      t=t+doc.data().rating
      n=n+1
    })
    avg = t/n
    setRAvg(avg)
  }
    
  }
  
  async function loadMenuData() {

    const postRef = await firebase.firestore().collection("menuItems").where("resId","==",listing.id).get()
    setMessages(postRef.docs.map((doc)=>({id: doc.id, data: doc.data()})))
    
  }

  const handleReviewSubmit = (values, rating) =>{
    let databaseadding = {...values, rating: rating, time: firebase.firestore.FieldValue.serverTimestamp(), resId: listing.id, reviewer: authContext.userDetails.name}
    firebase.firestore().collection('reviews').add(databaseadding)
  
  }

  const [reviewData,setReviewData] = useState()
  const [menuData,setMenuData] = useState()
  useEffect(()=> {
      loadMenuData();
      loadReviewData();

  },[])

  const handleIncrement = (message) => {
    if(messages.filter((m) => m.id !== message.id)){
      message.data.count = message.data.count+1
      setMessages(messages)
    }
  }
  const handleDecrement = (message) => {
    if(messages.filter((m) => m.id !== message.id)){
      if(message.data.count>0){
        console.log(message.count)
        message.data.count = message.data.count-1
        setMessages(messages)
      }
    }
  }

  const resetValues =() => {
    totalBill = 0
    order = []
    messages.forEach(element => {
      loadMenuData()
    });
    setCheckOutModalVisible(false)
  }

  const completeCheckout = () => {
    const orderRef =firebase.firestore().collection("orders")
    dbadding.accepted = false
    dbadding.dispatched = false
    orderRef.add(dbadding)
    Alert.alert('Order Confirmed',"",[
      {text: 'Okay', onPress: () => resetValues()},
    ])

  }

  const handleCheckout = () => {
    let total = 0
    console.log("Messages", messages)
    let orders = messages.filter((m) => m.data.count>0)
    console.log("Orders",orders)
    orders.forEach(element => {
      total = total + (element.data.count * element.data.price)
    });
    if('address' in authContext.userDetails){
    if(authContext.userDetails.address==="" || authContext.userDetails.address===null){
      alert("Address not provided, plesae add an address to your profile.");
      return
    }
  }
  else {
    alert("Address not provided, plesae add an address to your profile.");
    return
  }
    dbadding = {details: orders}
    dbadding.total = total
    dbadding.username= authContext.userDetails.name
    dbadding.restaurant= listing.id
    dbadding.restaurantName= listing.data.name
    dbadding.user = authContext.userDetails.docId
    dbadding.address= authContext.userDetails.address
    dbadding.number = authContext.userDetails.contact
    dbadding.time = firebase.firestore.FieldValue.serverTimestamp();
    console.log(total)
    console.log("DATABASE", dbadding.details)


    if(total > 0)
    {

      order = orders
      console.log(total)
      totalBill = total
      total = 0
      orders = []
      setCheckOutModalVisible(true)
    }
      else if (total<=0){
        Alert.alert('Please Select Something from the Menu First',"Swipe from Right to Left to start Adding Items",[
          {text: "Ok"}
      ])
      }
    }
   
  
  

  return (
    <>
    <Modal visible = {lsModal} animationType="slide">
    <WebView originWhitelist={['*']}
   javaScriptEnabled={true}
   scrollEnabled = {false}
   allowsInlineMediaPlayback = {true}
   style ={{width: "100%", }}
   domStorageEnabled={true} source={{html: listing.data.initalHtml,baseUrl: 'https://fcc3ddae59ed.us-west-2.playback.live-video.net'}}></WebView>
   <View style={{alignItems: "center", padding: 20, backgroundColor: colors.light, borderRadius: 25, width: "90%", alignSelf: "center", margin: 5}}>
   <AppText style={{color: colors.primary, fontWeight: "bold", fontStyle: "italic"}}>Note: The Normal Delay of the stream may be anywhere from 5 to upto 20 seconds</AppText>
   </View>
   <TouchableOpacity 
   style={{backgroundColor: colors.primary, borderRadius: 500, padding: 5, marginLeft: 5, width: '50%', alignItems: "center", alignSelf: "center", marginBottom: 50}} 
   onPress = {() =>{setLsModal(false)}}>

                    <AppText style={{color: colors.white}}>Close LiveStream</AppText>

        </TouchableOpacity></Modal>
     <View>
     
     <Image  style={styles.image} source={{uri: listing.data.image}} />
        <View style={styles.userContainer, {marginLeft: 1}}>
          <ListItem 
            image={listing.data.image}
            title={listing.data.name}
            avgRating = {rAvg}
            badge={true}
          ></ListItem>
        </View>
    </View > 
     <View style = {{alignItems: "center"}}>
       <View style = {{flexDirection: 'row', }}>
       {authContext.userDetails.isRestaurant === false && <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 500, padding: 5, marginHorizontal:10}} onPress={()=>handleCheckout()} title ="Check Out" color={colors.primary}>
                    <AppText style={{color: colors.white}}>Check Out</AppText>
  </TouchableOpacity> }
        <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 500, padding: 5}} onPress = {() =>{loadReviewData(); setReviewModal(true)}}>
                    <AppText style={{color: colors.white}}>   Reviews   </AppText>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 500, padding: 5, marginLeft: 5}} onPress = {() =>{setLsModal(true)}}>
                    <AppText style={{color: colors.white}}>   LiveStream   </AppText>
        </TouchableOpacity>
        </View>


        <Modal visible={reviewModal} animationType="slide">
          <Screen>
           <Button  title="Close" onPress={() => (setReviewModal(false))} />
           {authContext.userDetails.isRestaurant === false && <View style = {{alignItems: "center", padding: 5}}>
           <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 500, padding: 15, alignItems: "center"}} onPress = {() => {setModalVisible(true); setReviewModal(false)}}>
                    <AppText style={{color: colors.white, fontWeight: "bold"}}>Give your Own Review</AppText>
           </TouchableOpacity>
           </View>}
           <FlatList
            data={reviewData}
            keyExtractor={(dataa) => dataa.id.toString()}
            renderItem={({ item }) => (
              <AppPostedReviews
              username = {item.data.reviewer}
              time = {item.data.time.seconds}
              description={item.data.description}
              stars={item.data.rating}
               />
            )}
          />
          </Screen>
        </Modal>
        <Modal visible={modalVisible} animationType="fade" >
        <Screen>
        <Button  title="Close" onPress={() => (setModalVisible(false), setRate(2.5))} /> 
          <View style ={{marginTop: 50}}> 
          <AppReview ratingCompleted = {(rating) =>setRate(rating)}></AppReview>
          <Form
        initialValues={{
          description: "",
        }}
        onSubmit={(values) => (handleReviewSubmit(values, rate))}
        validationSchema={validationSchema}
      ><FormField
      maxLength={255}
      multiline
      name="description"
      numberOfLines={5}
      placeholder="Description"
    />
     <SubmitButton title="Post" />
    </Form>
    </View>
        </Screen>
        </Modal>
      </View> 
      <Screen>
    
      <FlatList
      data={messages}
      keyExtractor={(message) => message.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.data.title}
          subTitle={item.data.price}
          image={item.data.images}
          onPress={() => console.log(authContext.userDetails)}
          count={item.data.count}
          renderRightActions={() => (
            <>
            <CheckOutSwipes color = {colors.secondary} name="plus" onPress={() =>{handleIncrement(item); forceUpdate()} } />
            <CheckOutSwipes color = {colors.danger} name="minus" onPress={() => {handleDecrement(item); forceUpdate()}}  />
            </>
          )}
        />
      )}
          
      ItemSeparatorComponent={ListItemSeparator}
    />
   <Modal visible={checkOutmodalVisible} animationType="slide">
      <Screen>
      <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 500, padding: 5, marginLeft: 5, width: 100, alignItems: "center"}} onPress = {() =>{setCheckOutModalVisible(false)}}>
                    <AppText style={{color: colors.white}}>Close</AppText>
        </TouchableOpacity>
      <FlatList
      data={order}
      keyExtractor={(order) => order.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.data.title}
          subTitle = {("Price of One is Rs."+item.data.price+" You currently have "+item.data.count+" in cart").toString()}
        />
      )}
      ItemSeparatorComponent={ListItemSeparator}
      >  
      </FlatList>
      <View style ={styles.totalStyle}>
                <AppText style = {{fontWeight: "bold", color: colors.white}}>Total Bill: {totalBill}</AppText>
       </View>
       <View style ={styles.addressStyle}>
       <AppText style = {{alignSelf: "center", fontStyle: "italic", fontWeight: "100", color: colors.black}}>Delivering to: {authContext.userDetails.address}</AppText>
       </View >
          <AppButton style={{alignSelf: 'center',padding: 20, width: "75%"}} title="Click to Confirm" onPress={() => {completeCheckout()}} /> 
      </Screen>
    </Modal>
    </Screen>
    </>
    
  );
}

const styles = StyleSheet.create({
  settingFlex: {
    alignSelf: "center",
    flexDirection: "column",
    paddingTop: 1
  },
  detailsContainer: {
    padding: 5,
    paddingLeft: 20
  },
  image: {
    width: "100%",
    height: 200,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 10,
  },
  style: {
    width: 10
  },
  totalStyle: {
    flexDirection: "row-reverse",
    padding: 20,
    justifyContent:"center",
    backgroundColor: colors.primary
  },
  addressStyle: {
    flexDirection: "row-reverse",
    padding: 20,
    justifyContent:"center",
    backgroundColor: colors.secondary
  }
});

export default ListingDetailsScreen;


