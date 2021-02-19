import React, { useContext, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import Screen from '../components/Screen';
import colors from '../config/colors';
import {BarChart, LineChart} from 'react-native-chart-kit'
import * as firebase from "firebase"
import 'firebase/firestore';
import { useState } from 'react/cjs/react.development';
import AuthContext from '../Auth/context';
import AppTextInput from '../components/AppTextInput';
import { ListItemSeparator } from '../components/lists';






function Analytics(props) {

    const[barData,setBarData] = useState(null)
    const[lineData,setLineData] = useState(null)
    const[lineDataLabels,setLineDataLabels] = useState(null)
    const[barDataLabels,setBarDataLabels] = useState(null)
    const authContext = useContext(AuthContext)
    const[yt,setYt] = useState(0)
    const[mt,setMt] = useState(0)

    useEffect(()=>{
        loadYearData()
        loadMonthlyData()
    },[])

    function getMonthString(time) {
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[time]
    }

    let yearTotal=0
    let monthTotal=0

    async function loadYearData() {
        const orders = await firebase.firestore().collection('orders').where("restaurant",'==', authContext.userDetails.docId).get()
        let data= []
        orders.forEach((doc)=>{
            if(doc.data().dispatched === true){
                if(new Date(doc.data().time.seconds * 1000).getFullYear() === new Date(Date.now()).getFullYear())
                data.push({id: doc.id, total: doc.data().total, time: new Date(doc.data().time.seconds * 1000).getMonth()})
            }
        })
        const groups = data.reduce((groups, orders) => {
            const date = getMonthString(orders.time);
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(orders);
            return groups;
          }, {});
          
          // Edit: to add it in the array format instead
          const groupArrays = Object.keys(groups).map((date) => {
            return {
              date,
              orders: groups[date]
            };
          });
          let finalOrder= []
          groupArrays.forEach((doc)=>{
              let array =[]
              array = doc.orders
              Array.isArray(array)
              let t = 0
              array.forEach((e)=>{
                t= t+ e.total
              })

              finalOrder.push({month: doc.date, total: t})
              
          })
          let months = ['January','Feburay','March', 'April','May','June','July','August','September','October','November','December']
          const sorter = (a, b) => {
            if(a.year !== b.year){
               return a.year - b.year;
            }else{
               return months.indexOf(a.month) - months.indexOf(b.month);
            };
         };
         finalOrder.sort(sorter);

        setBarDataLabels(finalOrder.map((doc)=>doc.month))
        setBarData(finalOrder.map((doc)=>doc.total))
        finalOrder.forEach((doc)=>{
            yearTotal = yearTotal + doc.total
        })
        setYt(yearTotal)
        
     
    }
    async function loadMonthlyData() {
        const orders = await firebase.firestore().collection('orders').where("restaurant",'==', authContext.userDetails.docId).get()
        let data= []
        orders.forEach((doc)=>{
            if(doc.data().dispatched === true){
                if(new Date(doc.data().time.seconds * 1000).getFullYear() === new Date(Date.now()).getFullYear())
                    if(new Date(doc.data().time.seconds * 1000).getMonth() === new Date(Date.now()).getMonth()){
                        data.push({id: doc.id, total: doc.data().total, time: new Date(doc.data().time.seconds * 1000).getDate()})
                    }
            }
        })
        const groups = data.reduce((groups, orders) => {
            const date = orders.time;
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(orders);
            return groups;
          }, {});
          
          // Edit: to add it in the array format instead
          const groupArrays = Object.keys(groups).map((date) => {
            return {
              date,
              orders: groups[date]
            };
          });
          let finalOrder= []
          groupArrays.forEach((doc)=>{
              let array =[]
              array = doc.orders
              Array.isArray(array)
              let t = 0
              array.forEach((e)=>{
                t= t+ e.total
              })

              finalOrder.push({day: doc.date, total: t})
              
          })


        setLineDataLabels(finalOrder.map((doc)=>doc.day))
        setLineData(finalOrder.map((doc)=>doc.total))
        
        finalOrder.forEach((doc)=>{
            monthTotal = monthTotal + doc.total
        })
        setMt(monthTotal)
     
    }

    return (
        <Screen>
            <View style = {styles.container}>
                <AppText style = {styles.titleheader}>My Sales</AppText>
            </View>
         <ScrollView>
            <AppText style={styles.graphtitles}>Sales for {new Date(Date.now()).getFullYear()}</AppText>
            <ScrollView horizontal style={styles.graph}>
                {barData && <BarChart
                data={{
                labels: barDataLabels,
                datasets: [{
                    data: barData
                }]
                }}
                width={Dimensions.get('window').width*2} // from react-native
                height={Dimensions.get('window').height/1.8}
                showValuesOnTopOfBars
                chartConfig={{
                backgroundColor: colors.primary,
                backgroundGradientFrom: colors.medium,
                backgroundGradientTo: colors.black,
                decimalPlaces: 0, 
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                }
                }}
                bezier
                style={{
                marginVertical: 8,
                marginHorizontal: 8,
                borderRadius: 16
                }}
            />}
                </ScrollView>
                <AppText style={styles.totals}>Total for the Year is {yt}</AppText>
                <ListItemSeparator/>
                <AppText style={styles.graphtitles}>Sales for {getMonthString(new Date(Date.now()).getMonth())}</AppText>
            <ScrollView horizontal style={styles.graph}>
                {lineData&&<LineChart
                withShadow
                data={{
                labels: lineDataLabels,
                datasets: [{
                    data: lineData
                }]
                }}
                width={Dimensions.get('window').width*2} // from react-native
                height={Dimensions.get('window').height/1.8}
                chartConfig={{
                backgroundColor: colors.primary,
                backgroundGradientFrom: colors.medium,
                backgroundGradientTo: colors.black,
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                }
                }}
                bezier
                renderDotContent={({x, y, index}) => <AppText style={{
                        color: colors.light,
                        fontSize: 13,
                        position: 'absolute',
                        paddingTop: y-25,
                        paddingLeft: x-10}}>
                    
                {lineData[index]}</AppText>}
                style={{
                marginVertical: 8,
                marginHorizontal: 8,
                borderRadius: 16
                }}
                        />}
                </ScrollView>
                <AppText style={styles.totals}>Total for the Month is {mt}</AppText>
 </ScrollView>
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
    graphtitles: {
        fontSize: 24,
        color: colors.primary,
        fontWeight: "bold",
        alignSelf: 'center'
    },
    totals: {
        fontSize: 16,
        color: colors.medium,
        fontWeight: "bold",
        marginLeft: 5,
        marginBottom: 5
    },

})
export default Analytics;