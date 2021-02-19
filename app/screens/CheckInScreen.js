import React, { useEffect, useState } from 'react';
import MapScreen from './MapScreen';
import * as firebase from "firebase"
import 'firebase/firestore';


function CheckInScreen({navigation}) {
    async function loaddata() {
        const postRef = await firebase.firestore().collection("users").where("isRestaurant", "==", true).get()
        let data = []
        postRef.forEach(doc => {
            if(doc.data().addressLocation != null)
            {
                data.push({id: doc.id, data: doc.data()})
            }
            })
        setListings(data)
        console.log(data)

      }
      
    
      const [listings,setListings] = useState()
      useEffect(()=> {
          loaddata();
    
      },[])
    return (
        
            <MapScreen goToFeed={()=>{navigation.goBack()}} data = {listings} canDrag ={true}>

            </MapScreen>
    );
}

export default CheckInScreen;