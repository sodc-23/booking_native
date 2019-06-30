import React from 'react'

import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import Marguee from '@components/general/react-native-text-ticker'

export default HomeWhiteMenuButton=({placeholder, value, onPress})=>(
    <TouchableOpacity onPress={()=>onPress()} style={styles.container}>
        {(value==null||value=='')&&<Text style={styles.text}>{placeholder}</Text>}
        {value!=null&&value!=''&&<Marguee style={styles.value}>{value}</Marguee>}
    </TouchableOpacity>
)

const styles=StyleSheet.create({
    container:{
        height:40,
        paddingHorizontal:15,
        justifyContent:'center',
        backgroundColor:'white',
        marginTop:5
    },
    text:{
        fontSize:14,
        color:Color.lightText
    },
    value:{
        fontSize:14,
        color:Color.darkText
    }
})