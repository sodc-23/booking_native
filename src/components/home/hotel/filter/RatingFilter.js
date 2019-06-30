import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

import Color from '@common/color'
import TitleBar from './TitleBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default RatingFilter = ({ values, title, data, onChanged }) => (
    <View style={styles.container}>
        <TitleBar title={title}/>
        <View style={styles.content}>
            {data.map((item, index)=>(
                <TouchableOpacity onPress={()=>onChanged(index)} key={index} style={[styles.itemContainter,{borderColor:item?Color.orange:Color.border}]}>
                    <Text style={[styles.text, {color:item?Color.orange:Color.darkText}]}>{values[index]}</Text>
                    <Ionicons name="ios-star" size={20} color={item?Color.orange:Color.darkText}/>
                </TouchableOpacity>
            ))}
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
    },
    content:{
        flexDirection:'row',
        padding:10
    },
    itemContainter:{
        flex:1,
        marginHorizontal:10,
        borderRadius:3,
        borderWidth:0.5,
        borderColor:Color.border,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        paddingVertical:5,
        backgroundColor:Color.lightBack
    },
    text:{
        fontSize:20,
        color: Color.darkText,
        marginRight:5
    }
})