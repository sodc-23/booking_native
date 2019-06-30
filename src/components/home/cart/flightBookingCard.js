import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import { Ionicons, Feather } from '@expo/vector-icons';
import { chatIcon, removeIcon, primaryInfo, benz, transfer_green_car } from '@common/image'
import { oval_landing, oval_land_off, departIcon, returnIcon, nileIcon, double_arrow } from '@common/image'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import moment from 'moment'
import ContactInput from '@hotel_room/contactInput'
const { T1, T2 } = Global.Translate

const ActionText = ({ image, text, onPress }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.actionTextContainer}>
        <Image source={image} style={styles.icon} />
        <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
)

const TimeLine = ({ hasStop }) => (
    <View style={styles.timeLine}>
        <View style={styles.line} />
        <View style={styles.lineContainer}>
            <Image source={oval_landing} style={styles.timelineImage} />
            {hasStop && <View style={styles.circle} />}
            <Image source={oval_land_off} style={styles.timelineImage} />
        </View>
    </View>
)

export default class BookingCard extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let { cart, onRemove, onSpecial, onPriceInfo, onPolicy } = this.props
        //console.log('cart', JSON.stringify(cart))
        if (!cart || !cart.data) {
            return null
        }
        
        let { dateInfo, config, displayAmount, strikeThroughAmount, displayOriginalAmount, tripType, paxInfo, items } = cart.data
        var tripLocations = UtilService.getFieldFromList2(config, 'key', 'value', 'tripLocation').split('-')
        var fromLocation = tripLocations[0].trim()
        var toLocation = tripLocations[1].trim()
        var title = tripType == 'Oneway' ? `${fromLocation} - ${toLocation}` : `${fromLocation} - ${toLocation} - ${fromLocation}`
        var paxInfoStr = UtilService.getPaxSummary4(paxInfo)
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeaderContainer}>
                    <View style={styles.cardTopContainer}>
                        <Text style={styles.cardTitle}>{paxInfoStr}</Text>
                        <TouchableOpacity onPress={()=>onPriceInfo(title)} style={styles.priceContainer}>
                            <Image source={primaryInfo} style={styles.icon} />
                            <Text style={styles.priceText}>{displayAmount}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardBottomContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <ActionText
                            image={removeIcon}
                            text='Remove'
                            onPress={() => onRemove(title)}
                        />
                    </View>
                </View>
                {items.map((itemSource, index) => {
                    let { item = [{}], properties = {}, type } = itemSource
                    let { tpExtension = [], locationInfo = {}, images = [], vendors = [], config, stops = 0, journeyDuration, code } = item[0]
                    let {tripLocationDetails = {}} = properties
                    let fromLocation = tripLocationDetails.fromLocation||tripLocationDetails.FromLocation
                    let toLocation = tripLocationDetails.toLocation||tripLocationDetails.ToLocation

                    let duration = (properties.duration_Hour || 0) + 'h'
                    if (properties.duration_Minute || 0 > 0) {
                        duration += ' ' + properties.duration_Minute + 'm'
                    }
                    let dateInfo1 = item[0].dateInfo || {}
                    let dateInfo2 = item[item.length - 1].dateInfo|| {}

                    return (<View key={index} style={[styles.content, { borderTopWidth: index > 0 ? 1 : 0 }]}>
                        <View style={styles.itemHeaderContainer}>
                            <View style={styles.itemHeaderLeft}>
                                <Image source={{ uri: images[0].url }} style={styles.itemMark} />
                                <Text style={styles.itemTitle}>{vendors[0] ? vendors[0].item.name : 'airlines'}</Text>
                            </View>
                            <View style={styles.itemHeaderCenter}>

                            </View>
                            <View style={styles.itemHeaderRight}>
                                <Text style={styles.text}>Flight : {code}</Text>
                                <Text style={styles.text}>{UtilService.getFieldFromList(tpExtension, 'cabinClass')}</Text>
                            </View>
                        </View>
                        <View style={styles.itemContent}>
                            <View style={styles.rowContainer}>
                                <Text style={styles.primary}>{moment(dateInfo1.startDate).format('ddd, MMM D YYYY')}</Text>
                                <View style={{ flex: 0.5 }} />
                                <Text style={styles.primary}>{moment(dateInfo2.endDate).format('ddd, MMM D YYYY')}</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.lightText}>{moment(dateInfo1.startDate).format('h:mm A')}</Text>
                                <Text style={[styles.lightText, { flex: 0.5 }]} ><Feather name="clock" size={10} color={Color.lightText} />{` ${duration}`}</Text>
                                <Text style={styles.lightText}>{moment(dateInfo2.endDate).format('h:mm A')}</Text>
                            </View>
                            <View style={styles.center}>
                                <TimeLine hasStop={stops > 0} />
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.primary}>{fromLocation.name||fromLocation.Name}</Text>
                                <Text style={[styles.lightText, { flex: 0.5 }]} >{stops > 0 ? stops + ' Stop' : ''}</Text>
                                <Text style={styles.primary}>{toLocation.name||toLocation.Name}</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.lightText}>({fromLocation.id||fromLocation.ID})</Text>
                                <View style={{ flex: 0.5 }} />
                                <Text style={styles.lightText}>({toLocation.id||toLocation.ID})</Text>
                            </View>
                        </View>
                    </View>)
                }
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: Color.lightText,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 10,
    },
    cardHeaderContainer: {
        borderBottomColor: Color.lightText,
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 8,
        backgroundColor: Color.lightBack
    },
    cardTitle: {
        fontSize: 18,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    cardBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5
    },
    cardTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        paddingBottom: 10,
        borderTopColor: '#ccc'
    },
    actionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginHorizontal: 8
    },
    actionText: {
        color: Color.orange,
        fontSize: 12,
    },
    itemHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
    },
    itemContent: {
    },
    rowContainer: {
        flexDirection: 'row',
        marginVertical: 2
    },
    primary: {
        color: Color.primary,
        flex: 1,
        fontSize: 10,
        textAlign: 'center'
    },
    lightText: {
        color: Color.lightText,
        fontSize: 10,
        flex: 1,
        textAlign: 'center'
    },
    text: {
        color: Color.darkText,
        fontSize: 12,
        textAlign: 'center'
    },
    itemBottom: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 32
    },
    orangeText: {
        color: Color.orange,
        fontSize: 12,
    },
    timeLine: {
        marginVertical: 10,
        width: '65%'
    },
    line: {
        width: '100%',
        height: 2,
        backgroundColor: '#ccc',
        left: 0,
        top: 12,
        position: 'absolute',
    },
    lineContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    timelineImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    itemHeaderRight: {
        alignItems: 'center',
        flex: 2
    },
    itemHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2
    },
    itemHeaderCenter: {
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden'
    },
    semiCircle: {
        width: 40,
        height: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        marginBottom: 5
    },
    typeImage: {
        width: 16,
        height: 16,
        resizeMode: 'contain'
    },
    itemMark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        resizeMode: 'contain'
    },
    itemTitle: {
        marginLeft: 10,
        fontSize: 12,
        color: Color.darkText
    },
    tagContainer: {
        backgroundColor: '#eee',
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    tagText: {
        fontSize: 10,
        color: Color.primary
    },
    swapIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        marginHorizontal: 5
    },
    smallGrey: {
        fontSize: 11,
        color: Color.lightText
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.middlePrimary,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems:'center'
    }
})