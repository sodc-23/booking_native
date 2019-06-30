import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default HeaderContainer=({count, average, mark})=>(
    <View style={styles.container}>
        <View style={styles.leftContainer}>
            <Text style={styles.title}>RATE AVERAGE</Text>
            <Text style={styles.desc}>{count} Reviews</Text>
        </View>
        <View style={styles.averageContainer}>
            <MaterialIcons name="mode-comment" size={50} color={Color.orange}/>
            <Text style={styles.average}>{average}</Text>
        </View>
        <Text style={styles.mark}>{mark}</Text>
    </View>
)

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:15,
        marginVertical:25
    },
    leftContainer:{
        flex:1,
    },
    averageContainer:{

    },
    average:{
        position:'absolute',
        color:'white',
        left:17,
        top:5,
        fontSize:28,
        fontWeight:'bold'
    },
    mark:{
        color:Color.orange,
        fontSize:18,
        fontWeight:'bold',
        marginHorizontal:10
    },
    title:{
        fontSize:14,
        fontWeight:'bold',
        color:Color.darkText
    },
    desc:{
        fontSize:10,
        color:Color.darkText,
        marginTop:5
    }
})