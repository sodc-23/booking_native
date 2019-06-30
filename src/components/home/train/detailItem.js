import React from 'react'


import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import moment from 'moment'

export default DetailItem=({date, selected, type, seatNumber})=>(
    <TouchableOpacity style={styles.container}>
        <View style={[styles.optionContainer,selected?{borderColor:Color.primary}:{}]}>
            <View style={[styles.option,selected?{backgroundColor:Color.primary}:{}]}/>
        </View>
        <Text style={styles.date}>{moment(date).format('DD')}</Text>
        <Text style={styles.weekMonth}>{moment(date).format('ddd')+'\n'+moment(date).format('MM')}</Text>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.seatNumber}>AVAILABLE-{seatNumber}</Text>
    </TouchableOpacity>
)

DetailItem.defaultProps={
    date:new Date(),
    selected: true,
    type: 'General',
    seatNumber: '0048'
}

const styles = StyleSheet.create({
    container:{
        height:60,
        width:'100%',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:Color.lightBack,
        paddingHorizontal:10
    },
    optionContainer:{
        width:12,
        height:12,
        borderRadius:6,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'grey',
        backgroundColor:'#ccc',
        alignItems:'center',
        justifyContent:'center'
    },
    option:{
        width:8,
        height:8,
        borderRadius:4,
        backgroundColor:'#ccc'
    },
    date:{
        marginLeft:10,
        fontSize:24,
        color:Color.orange
    },
    weekMonth:{
        fontSize:12,
        color:Color.text,
        marginLeft:3
    },
    type:{
        fontSize:14,
        color:Color.text,
        marginLeft:20,
        flex:1,
        textAlign:'center'
    },
    seatNumber:{
        color:Color.lightPrimary,
        fontSize:14,
        marginLeft:20,
    }
})