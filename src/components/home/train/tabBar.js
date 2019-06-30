import React from 'react'

import{
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native'
import Color from '@common/color';
import Global from "@utils/global";
import { Actions } from 'react-native-router-flux';
import { bus_orange, question_orange } from '@common/image';

const TabItem=({title, image, onPress, selected})=>(
    <TouchableOpacity onPress={()=>onPress()} style={[styles.tabItemContainer, !selected?{backgroundColor:'rgb(223,223,223)'}:{}]}>
        {/* <Image source={image} style={styles.image}/> */}
        <Text style={styles.tabItemText}>{title}</Text>
    </TouchableOpacity>
)

export default TabBar=({onPress, index})=>(
    <View style={styles.container}>
        <TabItem
            title="Seat Selection"
            image={bus_orange}
            onPress={()=>onPress(0)}
            selected={index==0}
        />
        <View style={styles.spacer}/>
        <TabItem
            title="Train Details"
            image={question_orange}
            onPress={()=>onPress(1)}
            selected={index==1}
        />
    </View>
)

const styles=StyleSheet.create({
    container:{
        height:50,
        flexDirection:'row',
        width:'100%',
        backgroundColor:Color.lightBack,
        borderBottomWidth:0.5,
        borderBottomColor:Color.border
    },
    tabItemContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    tabItemText:{
        fontSize:12,
        color: Color.text,
        marginLeft:5
    },
    image:{
        width:12,
        height:12,
        resizeMode:'contain'
    },
    spacer:{
        height:'100%',
        width:1,
        backgroundColor:Color.border
    }
})