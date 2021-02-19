import React, { useContext, useState } from "react";
import { StyleSheet, Switch, ImageBackground, View, Alert, KeyboardAvoidingView, Modal, Dimensions } from "react-native";
import * as Yup from "yup";
import * as firebase from "firebase"
import 'firebase/firestore';
import authStorage from '../Auth/storage'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import Screen from "../components/Screen";
import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AuthContext from "../Auth/context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import getLocation from "../config/getLocation";
import MapView, { Marker } from "react-native-maps";
import AppButton from "../components/AppButton";



const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  contact: Yup.string().required().max(11, "Please Enter a valid Phone Number").min(11,"Please Enter a valid Phone Number").label("Contact")
});

function RegisterScreen({navigation}) {
  const [isEnabled,setIsEnabled] = useState(false)
  const [isEnabledAddress,setIsEnabledAddress] = useState(false)
  const [addressLocation,setAddressLocation] = useState(null)
  const toggleSwitch = () => {setIsEnabled(previousState => !previousState)};
  function toggleAddress() {
      setIsEnabledAddress(previousState => !previousState)
  }
  const authContext = useContext(AuthContext);
  let location = getLocation()
  
  
  const handleSubmit = async (values) => {

    values.isRestaurant = isEnabled
    values.isApproved = false
    values.image = 'https://firebasestorage.googleapis.com/v0/b/foodbeast-340381.appspot.com/o/normalUser.png?alt=media&token=5a10cc30-c204-4a74-9904-0712adb4267b'
    if (isEnabled){
      if(values.address==''){
      Alert.alert('Address is Required for Restaurants',"Please Enter Your Address",[
        {text: "Ok"}])
      return
    }
    }
    if (isEnabled){
      if(addressLocation==null){
      Alert.alert('Location is Required for Restaurants',"Please Set Your Location from Map",[
        {text: "Ok"}])
      return
    }
    else {
      values.addressLocation = addressLocation
    }
    }
    if(!isEnabled){

      delete values.isApproved
      delete values.addressLocation
    }
    await firebase.auth().createUserWithEmailAndPassword(values.email, values.password).catch(error => Alert.alert(error.message,"",[
      {text: 'Okay'},
  ]))
    firebase.auth().currentUser.sendEmailVerification().then(alert("Verification Link sent to Email, Please Check you Mail")).catch(error => console.log(error.message))
    values.uid = firebase.auth().currentUser.uid
    const userRef =firebase.firestore().collection("users")
    const snapshot = await userRef.where('email', '==', values.email ).get()
    if (snapshot.empty) {
      firebase.firestore().collection('users').add(values)
      navigation.goBack();
    }
    else {
      console.log("Already Registered")
      
    }  
  }

async function storeUser (email) {
  const userRef =firebase.firestore().collection("users")
  const snapshot = await userRef.where('email', '==', email ).get()
  await snapshot.forEach(doc => {
    if(email === doc.data().email){
      let u = doc.data();
      u.docId = doc.id
      console.log(u)
      authContext.setUserDetails(u);
      console.log(authContext.userDetails)
      authStorage.storeToken(JSON.stringify(u))
      console.log("Hello")
    }
    else{
      console.log("Error While Saving")
    }
  });
  console.log(authContext.userDetails)
  return
}

  return (
    <ImageBackground
    blurRadius={0}
    style={styles.background}
    source={require("../assets/RegisterBgc.jpg")}
  >
    
    <Screen style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView style = {{flex :1}}  behavior={Platform.OS == 'ios' ? 'position' : 'position'}>
      <Form
        initialValues={{ name: "", email: "", password: "", address: "", contact: "" }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          icon="account"
          name="name"
          placeholder="Name"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        
        <FormField
          autoCorrect={false}
          icon="phone"
          keyboardType="number-pad"
          name="contact"
          placeholder="Mobile Number"
        />
        
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        
        <FormField
          autoCorrect={false}
          icon="map-marker"
          name="address"
          placeholder="Address"
          width = '100%'
        /> 
        {isEnabled && 
        <View  style ={{flexDirection: "row", alignSelf: 'flex-end', alignItems: "center", marginVertical: 10}}>
          <AppText style = {{color: colors.primary, fontWeight: 'bold'}}>Please Set Your Location</AppText>
        <TouchableOpacity onPress={() => toggleAddress()}  style={{backgroundColor: colors.primary, borderRadius: 50, padding: 4, width: 60, alignItems: "center", marginHorizontal: 10}}>
          <MaterialCommunityIcons name = "map-marker-plus" size={45} color={colors.white}></MaterialCommunityIcons>
        </TouchableOpacity></View>}
        <View style ={{flexDirection: "row", alignSelf: 'flex-end', alignItems: "center", marginVertical: 10}}>
          <AppText style = {{color: colors.primary, fontWeight: 'bold'}}>Register As Restaurant</AppText>
            <Switch
            style={{marginHorizontal: 10}}
            trackColor={{ false: colors.light, true: colors.primary }}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
         
        <SubmitButton title="Register" />
      </Form></KeyboardAvoidingView></ScrollView>
    <Modal visible = {isEnabledAddress} animationType='slide'>
    <View>
      <MapView style={styles.mapStyle}
                region={{
                    latitude: location ? location.latitude : 30.3753,
                    longitude: location ? location.longitude : 69.3451,
                    latitudeDelta:  location ? 0.01:4,
                    longitudeDelta: location ? 0.01:4
                }}
                 
        
        >
            <Marker
            pinColor = {colors.secondary}
                style ={{borderColor: colors.secondary}}
                draggable ={true}
                onDragEnd={(value)=>{
                    setAddressLocation(value.nativeEvent.coordinate),
                    console.log(addressLocation)
                }}
                coordinate = {location? location : {latitude: 1, longitude: 1}}
                title = "You"
             >
             </Marker></MapView>
             <AppButton title="Confirm Address" onPress = {()=>setIsEnabledAddress(false)}></AppButton>
             <AppButton title="Cancel" onPress = {()=>setIsEnabledAddress(false)}></AppButton>
             </View>
    </Modal>
    </Screen>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    marginTop: 10
  },
  background: {
    flex: 1,

  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/1.2,
  },
});


export default RegisterScreen;
