import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet } from "react-native";
import * as Yup from "yup";
import * as Location from 'expo-location'
import * as firebase from "firebase"
import 'firebase/firestore';
import LottieView from "lottie-react-native";


import {
  AppForm as Form,
  AppFormField as FormField,
  AppFormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import FormImagePicker from "../components/forms/FormImagePicker";
import Screen from "../components/Screen";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  description: Yup.string().label("Description"),
  images: Yup.array().max(3, "Image Limit Reached")
});


function editMenuItem({route, navigation: {goBack}}) {
    const [uploading, setUploading]=useState(false)

    const item = route.params;

  async function uploadImageAsync(uri, values) {
      setUploading(true)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  
    const ref = firebase
      .storage()
      .ref().child(Math.random(1000,10000).toString())

  
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();
    let imageref= await snapshot.ref.getDownloadURL();
    console.log(imageref)
    let databasevalues = {...values, images: imageref, time: firebase.firestore.FieldValue.serverTimestamp()}

    await handleSubmit(databasevalues)
    setUploading(false)
    return await snapshot.ref.getDownloadURL();
  }


  const handleSubmit = async (databasevalues) => {

      console.log(databasevalues.images)
      databasevalues.count = 0
      // console.log(values.images, imageUri)
      
      firebase.firestore().collection('menuItems').doc(item.id).update(databasevalues)
      firebase.storage().refFromURL(item.data.images).delete().then( goBack() )


  }

  return (
    <Screen style={styles.container}>
       <Modal visible={uploading}>
      {
              uploading && <Image style = {styles.loading} source={require('../assets/upload.gif')}  />
            }
      </Modal>
      <Form
        initialValues={{
          title: item.data.title,
          price: item.data.price,
          description: item.data.description,
          images: [item.data.images]
        }}
        onSubmit={(values) => {uploadImageAsync(values.images[0], values);}}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder={item.data.title} defaultValue = {item.data.title}
 />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder= {item.data.price}
          defaultValue = {item.data.price}
          
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          defaultValue = {item.data.description}

          placeholder={item.data.description}
        />
        <SubmitButton title="Save" />
      </Form>
      {/* <Modal visible={uploading}>
            <LottieView
            autoPlay
            loop
            source={require("../assets/images/upload.json")}
            />
      </Modal> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  loading: {
    height: 300,
    width : 300,
    alignSelf: "center"
  },
});


export default editMenuItem;