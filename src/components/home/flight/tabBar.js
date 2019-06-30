import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'

import Color from '@common/color'

export default TabBar=({titles, onPress})=>(
    <View style={styles.container}>
        {titles.map((item, index)=>
        <TouchableOpacity 
            activeOpacity={0.8} 
            key={index} 
            onPress={()=>onPress(index)}
            style={[styles.buttonContainer, 
                {backgroundColor:item.selected?'white':Color.tabBack},
                {marginLeft:index>0?5:0}]}>
            <Text style={[styles.text,{color:item.selected?Color.orange:Color.primary}]}>
                {item.title}
            </Text>
        </TouchableOpacity>)}
    </View>
)

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        width:'100%',
        height: 36
    },
    buttonContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        fontSize:12,
    }
})