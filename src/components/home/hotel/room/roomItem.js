import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native'

import Color from '@common/color'
import { facilityIcon1 } from '@common/image';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import UtilService from '@utils/utils';
import {man_child, man_man, roomImage} from '@common/image'
import ImagePlaceholder from '@components/general/react-native-image-placeholder'

import Global from "@utils/global";
import { man_black, child_black } from '@common/image';
const {T1, T2} = Global.Translate

const Facility = ({ icon, desc }) => (
    <View style={styles.facilityContainer}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.desc}>{desc}</Text>
    </View>
)

const OptionItem = ({ title, optionDesc, price, occupancy, facilities, isRefundable, info, isChecked, onPress, language:{T3} }) => (
    <View style={styles.optionContainer}>
        <View style={styles.firstContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.optionDesc}>{optionDesc}</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.night}>{T3('Per Night')}</Text>
            </View>
            <TouchableOpacity onPress={() => onPress()} style={styles.buttonContainer}>
                <Ionicons name="ios-checkmark-circle" size={30} color={isChecked ? Color.orange : Color.lightText} />
            </TouchableOpacity>
        </View>
        {facilities.map((item, index) => <Facility {...item} key={index} />)}
        <Text style={[styles.desc, { marginLeft: 0, marginTop: 10 }]}>{T3('Occupancy')} : {occupancy}</Text>
        {!isRefundable && <Text style={styles.warn}>{T3('Non Refundable')}</Text>}
        <Text style={styles.info}>{info}</Text>
    </View>
)

export default class RoomItem extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            index: 1,
            type: 0,
            options:[
                {image: roomImage, title:'Bunk Bed Family Room', rooms:5, price:130.8, selected: true},
                {image: roomImage, title:'Bunk Bed Family Room', rooms:5, price:130.8},
            ]
        }
    }

    renderOption = (option, index) => {
        let { rawData, onPress, checkedIndexes } = this.props
        let title = `Option ${index+1}`
        let optionDesc = option.boardTypes[0].type
        let price = option.displayAmount
        let isRefundable = option.flags.isRefundable
        let info = option.promotionInfo?option.promotionInfo[0].description:''
        let facilities = option.amenities||[]
        let occupancy = UtilService.getPaxSummary(rawData.paxInfo[0]||{})
        var uniqueKey = `${rawData.groupId}-${option.code}`
        let isChecked = (checkedIndexes.indexOf(uniqueKey) != -1)

        //console.log('renderOption', checkedIndexes, uniqueKey, isChecked)
        let optionItem = {
            title, optionDesc, price, occupancy, facilities, isRefundable, info, isChecked
        }
        return (
            <OptionItem
                language={this.props.language}
                key = {index}
                {...optionItem}
                onPress={() => onPress(uniqueKey, option.amount)}
            />
        )
    }

    renderPaxIcons = (paxInfo)=> {
        if(!paxInfo || !paxInfo.item) return null
        let types=[]
        let adults=0, childs = 0, infants = 0
        paxInfo.item.map((o)=>{
            if(o.type == 0) {
                adults += o.quantity
            } else if(o.type == 1) {
                childs += o.quantity
            } else if(o.type == 2) {
                infants += o.quantity
            } 
        })
        for (let i = 0; i < adults; i ++) types.push(0)
        for (let i = 0; i < childs; i ++) types.push(1)
        for (let i = 0; i < infants; i ++) types.push(1)
        const paxIcon=[man_black, child_black]
        return (
            <View style={styles.paxContainer}>
                {types.map((type, index)=>(
                    <Image key={index} source={paxIcon[type]} style={styles.paxIcon}/>
                ))}
            </View>
        )
    }
    render(){
        let { index, image, options, rawData, onDetail, checkedIndexes, onPress } = this.props
        var paxInfo = rawData.paxInfo
        let {T3} = this.props.language
        return(
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{T3('Room')} {index + 1}</Text>
                    <View>
                    {
                        this.renderPaxIcons(paxInfo[0])
                    }
                    </View>
                </View>
                {options.map((option, idx)=>{
                    var exist = (checkedIndexes[option.roomIndex]&&checkedIndexes[option.roomIndex].code==option.code&&checkedIndexes[option.roomIndex].groupId==option.groupId)?true:false
                    const img = option.images&&option.images.length>0?{uri:option.images[0].url}:image
                    return(<View key={idx} style={styles.itemContainer}>
                        <ImagePlaceholder source={img} style={styles.image}/>
                        <View style={styles.itemContent}>
                            <Text style={styles.itemTitle}>{option.name}</Text>
                            {/* <Text style={styles.roomCount}>Our last {option.quantity} rooms</Text> */}
                            <Text style={styles.price}>{option.displayAmount}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={()=>onDetail(option)}>
                                    <FontAwesome name="info-circle" size={24} color={Color.lightText}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>onPress(option.groupId, option.code, option.roomIndex, option.amount)} style={(exist)?styles.orangeButton:styles.borderButton}>
                                    <Ionicons name="md-checkmark" size={18} color='white'/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>)
                    }
                )}
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        backgroundColor:Color.lightBack,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#ccc',
        borderRadius:4,
        paddingHorizontal:10,
        marginBottom:10
    },
    headerContainer:{
        flexDirection:'row',
        borderBottomColor:'#ccc',
        borderBottomWidth:StyleSheet.hairlineWidth,
        height:40,
        alignItems:'center',
        justifyContent:'space-between'
    },
    headerText:{
        fontSize:12,
        color:Color.lightText
    },
    icon:{
        width:18,
        height:18,
        resizeMode:'contain'
    },
    itemContainer:{
        paddingVertical:15,
        borderBottomColor:'#ccc',
        borderBottomWidth:StyleSheet.hairlineWidth,
        flexDirection:'row'
    },
    image:{
        width:100,
        height:100,
    },
    itemContent:{
        marginLeft:10,
        flex:1
    },
    itemTitle:{
        fontSize:16,
        color: Color.text,
    },
    roomCount:{
        fontSize:10,
        color:Color.orange
    },
    price:{
        fontSize:18,
        fontWeight:'bold',
        color:Color.lightPrimary,
        marginVertical:5,
    },
    buttonContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:5
    },
    orangeButton:{
        backgroundColor:Color.orange,
        width:24,
        height:24,
        borderRadius:12,
        alignItems:'center',
        justifyContent:'center',
    },
    borderButton:{
        width:24,
        height:24,
        backgroundColor:'white',
        borderRadius:12,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#ccc',
        alignItems:'center',
        justifyContent:'center'
    },
    paxContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    paxIcon:{
        width:10,
        height:20,
        resizeMode:'contain'
    }
})