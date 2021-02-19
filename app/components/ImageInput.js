import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import colors from '../config/colors';
import {MaterialCommunityIcons} from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker'

function ImageInput({imageUri, onChangeImage}) {

useEffect(() => {
    requestPermission();
}, [])


const requestPermission = async () => {
    const {granted} = await ImagePicker.requestCameraRollPermissionsAsync();
    if(!granted){
        alert("Enable Permissions from Settings")
    }
}

const handlePress = () => {
    if(!imageUri){
        selectImage();
    }else{
        Alert.alert('Delete Image?','Are You sure?',[
            {text: 'Yes', onPress: () => onChangeImage(null)},
            {text: "No"}
        ])
    }
}

const selectImage = async() => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.5,
            videoMaxDuration: 30,
            allowsEditing: true

        });
        if (!result.cancelled){
            onChangeImage(result.uri)
        }
    } catch (error) {
        console.log("Error", error)
    }
}

    return (
        <TouchableWithoutFeedback onPress ={handlePress}>
        <View style ={styles.container}>
           {!imageUri && <MaterialCommunityIcons name="camera" size ={40}/>}
           {imageUri && <Image source = {{uri: imageUri}} style={styles.image}/>} 
        </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: colors.light,
        borderRadius: 15,
        height: 100,
        width: 100,
        justifyContent: "center",
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: "100%",
    }
})
export default ImageInput;