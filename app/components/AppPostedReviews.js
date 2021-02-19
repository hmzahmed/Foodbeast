import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import colors from '../config/colors';
import AppText from './AppText';
import { ListItemSeparator } from './lists';


function getDate(time){
    let date = new Date(time*1000)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString('en-US',{ hour: 'numeric', minute: 'numeric', hour12: true })
}

function AppPostedReviews({username, stars, description, time}) {
    return (
        <View style = {{paddingHorizontal: 20, backgroundColor: colors.light, margin: 10, borderRadius: 25, paddingBottom: 5}}>        
        <View style ={{flexDirection: "column",}}>
            <View>
            <AppText>{username}</AppText>
            </View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <AppText>Rated </AppText>    
            <Rating
            startingValue = {stars}
            fractions = {1}
            imageSize ={20}
            readonly ={true}
            tintColor = {colors.light}
            />
            <AppText> Stars</AppText>
            </View>
            <View>
              <AppText style={styles.dateStyle}>Rated on: {getDate(time)}</AppText>
            </View>
        </View>
        <View style ={{backgroundColor: colors.medium, height: 1, margin: 10}}/>
        <View style ={{flexDirection: "row" ,alignSelf: "flex-start"}}>
            <AppText>{description}</AppText>
        </View>
        </View>
    
        
    );
}

const styles = StyleSheet.create({
    dateStyle: {
        fontStyle: "italic",
        color:colors.medium,
        fontWeight: "100",
        fontSize: 14
    }
})

export default AppPostedReviews;