import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AuthContext from '../Auth/context';
import AppText from '../components/AppText';
import { ListItem, ListItemSeparator } from '../components/lists';
import Screen from '../components/Screen';
import colors from '../config/colors';
import * as firebase from "firebase"
import 'firebase/firestore';

function myFoodbuddies({navigation}) {
    const [messages, setMessages] = useState(null);
    const authContext = useContext(AuthContext)

    useEffect(()=> {
        loadData();
    },[])

    async function loadData() {
        const userRef = await firebase.firestore().collection('users').doc(authContext.userDetails.docId).get()
        let user = userRef.data()
        console.log("not entered")
        if('foodbuddies' in user){
            console.log('entered')
            let x= []
            let fb = Array.from(user.foodbuddies)
            for(const buddies of fb){
                console.log(buddies)
              let w = await firebase.firestore().collection('users').doc(buddies).get()
              console.log(w.data())
              x.push({id: w.id , data: w.data()})
              
            }
            setMessages(x)
        }
        return
    }


    return (
        <Screen>
            <View style = {styles.container}>
                <AppText style = {styles.titleheader}>My Food Buddies</AppText>
            </View>
            {messages && <FlatList
                data={messages}
                keyExtractor={(message) => message.id.toString()}
                renderItem={({ item }) => (
                    <ListItem
                    image={item.data.image}
                    title={item.data.name}
                    subTitle={item.data.email}
                    onPress={() => navigation.navigate("Profile", {data:{
                        userDocId: item.id
                    }})}

                    />
                )}
                ItemSeparatorComponent={ListItemSeparator}
                
             />}
        </Screen>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: colors.light
    },
    titleheader: {
        fontSize: 28,
        color: colors.primary,
        fontWeight: "bold"
    },
})


export default myFoodbuddies;