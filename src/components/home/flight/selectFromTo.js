import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import {twoWayIcon, oneWayIcon} from '@common/image'
export default SelectFromTo=({From, To, type, onPress, language:{T3}})=>(
    <View style={styles.container}>
        <TouchableOpacity onPress={()=>onPress('fromLocation')} style={styles.buttonContainer}>
            {From!=null&&<Text style={styles.bigText}>{From.id}</Text>}
            {From!=null&&<Text style={styles.smallText} numberOfLines={1}>{`${From.city}, ${From.country}`}</Text>}
            {From==null&&<Text style={styles.placehoder}>{T3('From')}</Text>}
        </TouchableOpacity>
        <Image source={type=='ONE_WAY'?oneWayIcon:twoWayIcon} style={styles.image}/>
        <TouchableOpacity onPress={()=>onPress('toLocation')} style={styles.buttonContainer}>
            {To!=null&&<Text style={styles.bigText}>{To.id}</Text>}
            {To!=null&&<Text style={styles.smallText} numberOfLines={1}>{`${To.city}, ${To.country}`}</Text>}
            {To==null&&<Text style={styles.placehoder}>{T3('To')}</Text>}
        </TouchableOpacity>
    </View>
)

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        width:'100%',
        height: 50,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:5,
    },
    buttonContainer:{
        flex:1,
        alignItems:'center'
    },
    bigText:{
        fontSize:20,
        color:Color.text
    },
    smallText:{
        fontSize:10,
        color:Color.lightText
    },
    placehoder:{
        fontSize: 20,
        color:Color.lightText
    },
    image:{
        marginHorizontal:5,
        width:24,
        height:24,
        resizeMode:'contain'
    }
})