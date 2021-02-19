import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';

import { ListItemSeparator } from "./lists";

import AppText from "./AppText"
import colors from '../config/colors';

function AppReview({ratingCompleted}) {
    return (
        <View style ={styles.container}>
            <AppText style = {{marginBottom: 10, alignSelf: 'center'}}>Please Swipe To Rate</AppText>
  <ListItemSeparator />
  <Rating
  showRating
  fractions = {1}
  onFinishRating={ratingCompleted}
  tintColor = {colors.light}
  style={{ paddingVertical: 10 }}
/>
        </View>
    );
}



export default AppReview;

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        color: colors.light,
        backgroundColor: colors.light,
        marginHorizontal: 20,
        paddingVertical: 25,
        flexGrow: 1
       
        
    },
})