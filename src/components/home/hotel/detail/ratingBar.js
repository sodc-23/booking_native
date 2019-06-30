import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default CommentItem=({title, desc, percent})=>(
    <View style={styles.container}>
        <View style={styles.leftContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text numberOfLines={1} style={styles.desc}>"{desc}"</Text>
        </View>
        <View style={styles.rightContainer}>
            <View style={[styles.percent, {width:percent+'%'}]}/>
        </View>
    </View>
)

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        paddingVertical:8,
        alignItems:'center'
    },
    leftContainer:{
        flex:1,
        marginRight:10
    },
    title:{
        fontSize:13,
        fontWeight:'bold',
        color:Color.darkText,
    },
    desc:{
        fontSize:12,
        color:Color.lightText,
    },
    rightContainer:{
        flex:1,
        height:8,
        borderRadius:4,
        backgroundColor:Color.lightBack
    },
    percent:{
        height:8,
        borderRadius:4,
        backgroundColor:Color.lightPrimary
    }
})