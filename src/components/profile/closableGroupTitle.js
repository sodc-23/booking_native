import React from 'react'

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from '@common/color'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default ClosableGroupTitle=({icon, title, isClosed, content, onPress})=>(
    <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={styles.titleContianer}>
            {icon}
            <Text style={styles.title}>{title}</Text>
            <Ionicons name={isClosed?"ios-arrow-down":"ios-arrow-up"} size={20} color={Color.text}/>
        </TouchableOpacity>
        {isClosed?null:content}
    </View>
)

const styles=StyleSheet.create({
    container:{
        width:'100%'
    },
    titleContianer:{
        flexDirection:'row',
        height:50,
        alignItems:'center',
        paddingHorizontal:15,
        backgroundColor:Color.lightBack
    },
    title:{
        marginLeft:10,
        fontSize:12,
        color:Color.text,
        flex:1
    }
})