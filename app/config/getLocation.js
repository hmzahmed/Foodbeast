import React, { useEffect, useState } from "react";
import * as Location from 'expo-location'

export default getLocation = () => {
    const [location, setLocation]= useState();

    const getLocation = async () => {
        try {
            const {granted} = await Location.requestPermissionsAsync();
            if(!granted) return;
            const {coords: {latitude, longitude}}= await Location.getLastKnownPositionAsync()

            setLocation({latitude,longitude})
            
        } catch (error) { 
            console.log("Error Getting Position")
        }
    }
  
    useEffect(() => {
      getLocation();
    },[])

    return location
}