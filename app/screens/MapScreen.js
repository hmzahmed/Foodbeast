import React, { useContext, useEffect, useState } from 'react';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import getLocation from '../config/getLocation';
import AuthContext from '../Auth/context';
import colors from '../config/colors';
import * as firebase from "firebase"
import 'firebase/firestore';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


function MapScreen({navigation,goToFeed, canDrag = false, data, ...otherProps}) {
let location = getLocation()
const [current,setCurrent] = useState()
async function loadLocation(){
   
}

const authContext = useContext(AuthContext)

async function postCheckIn(rname, rAL) {
    let values = {
        time: firebase.firestore.FieldValue.serverTimestamp(),
        description: "Enjoying the food at "+rname,
        images: [],
        isCheckIn : true,
        addressLocation: rAL,
        name: authContext.userDetails.name,
        userDocId: authContext.userDetails.docId,
    }
    await firebase.firestore().collection('posts').add(values)
}

useEffect(()=>{
   
},[location])




    return (
    <View style={styles.container}>

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
                draggable ={canDrag}
                onDragEnd={(value)=>{
                    location = value.nativeEvent.coordinate,
                    console.log(location)
                }}
                coordinate = {location? location : {latitude: 1, longitude: 1}}
                title = "You"
             >
             </Marker>
            {
                data?.map(marker => (
                    <Marker
                    pinColor = {colors.primary}
                    tracksInfoWindowChanges
                    key = {marker.id}
                    coordinate = {{
                        longitude: marker.data.addressLocation.longitude? marker.data.addressLocation.longitude : 1,
                        latitude: marker.data.addressLocation.latitude? marker.data.addressLocation.latitude: 1,
                        longitudeDelta: 0.001,
                        latitudeDelta: 0.001
                    }}
                    title = {"Click here at to Check In at "+marker.data.name}
                    onCalloutPress = {()=>{postCheckIn(marker.data.name, marker.data.addressLocation), goToFeed()}}
                     
                    >
                        
                    </Marker>
                ))
            }
            
            
            </MapView>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });


export default MapScreen;