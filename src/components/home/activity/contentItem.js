import React from 'react'

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'
import Color from '@common/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default contentItem=({title, content})=>(
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        borderBottomColor:'#ccc',
        borderBottomWidth:StyleSheet.hairlineWidth
    },
    title:{
        fontSize:12,
        color:Color.primary,
        marginTop:10
    },
    content:{
        fontSize:16,
        color:Color.darkText,
        marginVertical:10,
    }
})