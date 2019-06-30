import React from 'react'

import{
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default CommentItem=({image, name, date, desc})=>(
    <View style={styles.container}>
        <Image source={image} style={styles.avatar}/>
        <View style={styles.content}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.desc}>{desc}</Text>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        marginTop:20
    },
    content:{
        marginLeft:15,
        flex:1 
    },
    name:{
        fontSize:15,
        color:Color.darkText,
        fontWeight:'bold'
    },
    date:{
        fontSize:10,
        color:Color.lightText
    },
    desc:{
        marginTop:15,
        fontSize:12,
        color:Color.text,
        width:'100%'
    },
    avatar:{
        width:32,
        height:32,
        borderRadius:16
    }
})