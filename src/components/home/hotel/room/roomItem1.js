import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native'

import Color from '@common/color'
import ModalDropdown from 'react-native-modal-dropdown'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default class RoomItem extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state={
            options:[]
        }
        for ( let i = 0; i < props.count; i ++ )
            this.state.options.push(((i+1)+' Rooms'))
    }

    render() {
        let { image, title, capacity, count, price, requested, onChangeRoomCount, onPress } = this.props
        let {options} = this.state
        return (
            <TouchableOpacity onPress={()=>onPress()} style={styles.container}>
                <Image source={image} style={styles.image} />
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.capacity}>{capacity} guests/room</Text>
                    {/* <Text style={styles.count}>Our last {count} rooms</Text> */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}><Text style={{fontSize:16}}>USD</Text> {price}</Text>
                        <ModalDropdown
                            options={options}
                            defaultIndex={requested-1}
                            onChangeRoomCount={(index, value) => onChanged(index+1)}
                            renderRow={(option, index, isSelected) => <View style={[styles.itemContainer, {backgroundColor:isSelected?Color.darkOrange:Color.orange}]}>
                                <Text style={styles.roomText}>{option}</Text>
                            </View>}
                            adjustFrame={style=>{
                                style.top=style.top+5;
                                style.borderRadius = 4
                                style.right=15;
                                style.width=100;
                                style.height=options.length*28
                                style.overflow='hidden'
                                return style
                            }}
                            style={styles.modal}
                        >
                            <View style={styles.buttonContainer}>
                                <Text style={styles.text}>Select</Text>
                                <View style={styles.spacer}/>
                                <Text style={styles.rooms}>{requested}</Text>
                            </View>
                        </ModalDropdown>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc'
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    itemContainer:{
        backgroundColor:Color.orange,
        height:28,
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor:Color.darkOrange
    },
    buttonContainer:{
        width:100,
        height:32,
        backgroundColor:Color.orange,
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center'
    },
    text:{
        fontSize:12,
        color:'white',
        fontWeight:'bold',
        textAlign:'center',
        flex:1
    },
    rooms:{
        fontSize:12,
        color:'white',
        fontWeight:'bold',
        textAlign:'center',
        paddingHorizontal:8
    },
    spacer:{
        width:1,
        height:'100%',
        backgroundColor:Color.darkOrange
    },
    content:{
        marginLeft:8,
        flex:1
    },
    title:{
        fontSize:18,
        color:'black'
    },
    capacity:{
        fontSize:12,
        color: Color.lightText
    },
    count:{
        marginTop:15,
        color: Color.orange,
        fontSize:10
    },
    priceContainer:{
        flexDirection:'row',
        width:'100%'
    },
    price:{
        fontSize:24,
        color:Color.middlePrimary,
        fontWeight:'bold',
        flex:1,
    },
    roomText:{
        color:'white',
        fontSize:12
    },
    modal:{
        borderRadius:4,
    }
})