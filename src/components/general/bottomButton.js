import React from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native'

import Color from '@common/color'

export default BottomButton=({title, containerStyle, textStyle, disabled, onPress})=>(
    <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled} 
        style={[styles.container,containerStyle]}>
        <Text style={[styles.title, textStyle]}>{title}</Text>
    </TouchableOpacity>
)

const styles=StyleSheet.create({
    container:{
        position:'absolute',
        bottom:0,
        left:0,
        width:'100%',
        height:44,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Color.primary
    },
    title:{
        fontSize:14,
        color:'white',
    }
})