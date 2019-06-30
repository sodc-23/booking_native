import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native'

import Color from '@common/color'
import { facilityIcon1, man_black, child_black } from '@common/image';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import UtilService from '@utils/utils';
import ImagePlaceholder from '@components/general/react-native-image-placeholder'
import { man_child, man_man, roomImage } from '@common/image'
import RoundButton from '@components/general/roundButton'
import Global from "@utils/global";
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
            options: [
                { image: roomImage, title: 'Bunk Bed Family Room', rooms: 5, price: 130.8, selected: true },
                { image: roomImage, title: 'Bunk Bed Family Room', rooms: 5, price: 130.8 },
            ],
            bookAmount:130,
        }
    }

    renderOption = (option, index) => {
        let { rawData, onPress, checkedIndexes } = this.props
        let title = `Option ${index + 1}`
        let optionDesc = option.boardTypes[0].type
        let price = option.displayAmount
        let isRefundable = option.flags.isRefundable
        let info = option.promotionInfo ? option.promotionInfo[0].description : ''
        let facilities = option.amenities || []
        let occupancy = UtilService.getPaxSummary(rawData.paxInfo[0] || {})
        var uniqueKey = `${rawData.id}-${option.code}`
        let isChecked = (checkedIndexes.indexOf(uniqueKey) != -1)

        //console.log('renderOption', checkedIndexes, uniqueKey, isChecked)
        let optionItem = {
            title, optionDesc, price, occupancy, facilities, isRefundable, info, isChecked
        }
        return (
            <OptionItem
                language={this.props.language}
                key={index}
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
    render() {
        let {image, roomGroup = {}, onDetail, onPress, onPriceDetail} = this.props
        let paxInfos = roomGroup.paxInfo||[]
        displayAmount = roomGroup.displayAmount
        if(!displayAmount) {
            var total = 0
            roomGroup.item.map((o)=>{
                total += o.amount
            })

            displayAmount = Global.environment.portalCurrency.isoCode + ' ' + total
        }
        let {T3} = this.props.language
        return (
            <View style={styles.container}>
                {roomGroup.item.map((option, idx) => (
                    <View key={idx} style={styles.itemContainer}>
                        <ImagePlaceholder source={option.images&&option.images.length>0?{uri:option.images[0].url}:image} style={styles.image} />
                        <View style={styles.itemContent}>
                            <Text style={styles.itemTitle}>{option.name}</Text>
                            {this.renderPaxIcons(paxInfos[idx])}
                            {/* <Text style={styles.roomCount}>Our last {option.quantity} rooms</Text> */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={() => onDetail(option)}>
                                    <FontAwesome name="info-circle" size={24} color={Color.lightText} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
                <View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.totalPrice}>{displayAmount}</Text>
                        <TouchableOpacity onPress={() => onPriceDetail()}>
                            <FontAwesome name="info-circle" size={24} color={Color.lightText} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T3('Book')}
                            onPress={() => onPress()}
                            textStyle={styles.buttonText}
                        />
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightBack,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    bottomContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.lightBack,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:'#ccc'
    },
    leftContainer: {
        width: 120,
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightContainer: {
        flex: 1
    },
    totalPrice: {
        fontSize: 14,
        color: Color.lightPrimary,
        fontWeight: 'bold',
        flex: 1
    },
    icon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
        marginVertical:10
    },
    itemContainer: {
        paddingVertical: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row'
    },
    image: {
        width: 100,
        height: 100,
    },
    itemContent: {
        marginLeft: 10,
        flex: 1
    },
    itemTitle: {
        fontSize: 16,
        color: Color.text,
    },
    roomCount: {
        fontSize: 10,
        color: Color.orange
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.lightPrimary,
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 20
    },
    orangeButton: {
        backgroundColor: Color.orange,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    borderButton: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paxContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:8
    },
    paxIcon:{
        width:10,
        height:20,
        resizeMode:'contain'
    }
})