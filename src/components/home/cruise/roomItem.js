import React from 'react'

import {
    View, 
    TouchableOpacity,
    Text,
    Image,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import RoundButton from '@components/general/roundButton'
import {man_child, man_man, roomImage} from '@common/image'

export default class RoomItem extends React.Component{
    render(){
        let {title, info, rooms, price, onPress} = this.props
        return(
            <View style={styles.container}>
                <Image style={styles.image} source={roomImage}/>
                <View style={styles.body}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.info}>{info}</Text>
                    <View style={styles.bottom}>
                        <View style={{flex:1}}>
                            <Text style={styles.orange}>{rooms}</Text>
                            <Text style={styles.price}>{price}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <RoundButton
                                title="CHOOSE"
                                onPress={onPress}
                                style={styles.button}
                                textStyle={{fontSize:12}}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

RoomItem.defaultProps={
    title:'Bunk Bed Family Room',
    info:'Up to 182 sq ft',
    rooms:'Our last 5 rooms',
    price:'USD 43.6',
    onPress:()=>{}
}

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        paddingVertical:10,
        width:'100%',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc'
    },
    body:{
        marginLeft:8,
        flex:1
    },
    image:{
        width:100,
        height:100,
    },
    title:{
        fontSize:16,
        color:Color.darkText
    },
    info:{
        fontSize:10,
        color:Color.text,
        marginTop:5
    },
    bottom:{
        marginTop:15,
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        height:40
    },
    orange:{
        fontSize:10,
        color: Color.orange,
    },
    price:{
        fontSize:20,
        color:Color.lightPrimary,
        fontWeight:'bold'
    },
    buttonContainer:{
        width:80
    },
    button:{
        height:32
    }
})