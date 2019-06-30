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
import { chatIcon, removeIcon, primaryInfo, benz, infoIcon } from '@common/image'
import { oval_bus } from '@common/image'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import moment from 'moment'
import Marquee from '@components/general/react-native-text-ticker'

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
            <Image source={oval_bus} style={styles.timelineImage} />
            {hasStop && <View style={styles.circle} />}
            <Image source={oval_bus} style={styles.timelineImage} />
        </View>
    </View>
)

export default class BookingCard extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let { cart, onRemove, onPriceInfo, onPolicy } = this.props
        let {stopInfo, dateInfo, locationInfo, items, tpExtension} = cart.data
        let seats = items[0].item.map((o)=>o.token).join(',')
        let firstSeat = items[0].item[0]
        let title = UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'operatorName')
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeaderContainer}>
                    <View style={styles.cardTopContainer}>
                        <Text style={styles.cardTitle}>{moment(dateInfo.startDate).format('DD MMM, YYYY')}</Text>
                        <TouchableOpacity onPress={() => onPriceInfo()} style={styles.priceContainer}>
                            <Image source={primaryInfo} style={styles.icon} />
                            <Text style={styles.priceText}>{cart.data.displayAmount}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop:2}}>
                        <View style={styles.rowContainer}>
                            <Text style={styles.itemTitle}>Seats : </Text>
                            <Marquee style={styles.itemTitle}>{seats}</Marquee>
                        </View>
                        <View style={styles.cardBottomContainer}>
                            <Text style={styles.itemTitle}>{items[0].item.length + ' Traveler'}</Text>
                            <ActionText
                                image={removeIcon}
                                text='Remove'
                                onPress={() => onRemove(`'${locationInfo.fromLocation.name} - ${locationInfo.toLocation.name}'`)}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.itemHeaderContainer}>
                        <View style={styles.itemHeaderLeft}>
                            <Image source={{uri:cart.data.vendors[0].item.logo.url}} style={styles.itemMark} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.itemTitle}>{title}</Text>
                                <Text style={[styles.lightText, { textAlign: 'left' }]}>{cart.data.type}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.itemContent}>
                        <View style={styles.rowContainer}>
                            <Text style={styles.lightText}>{moment(dateInfo.startDate).format('DD/MM/YYYY')}</Text>
                            <View style={{ flex: 0.5 }} />
                            <Text style={styles.lightText}>{moment(dateInfo.endDate).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.lightText}>{moment(dateInfo.startDate).format('h:mm A')}</Text>
                            <Text style={[styles.lightText, { flex: 0.5 }]} ><Feather name="clock" size={10} color={Color.lightText} />{UtilService.getDuration(dateInfo.startDate, dateInfo.endDate)}</Text>
                            <Text style={styles.lightText}>{moment(dateInfo.endDate).format('h:mm A')}</Text>
                        </View>
                        <View style={styles.center}>
                            <TimeLine hasStop={false} />
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.primary}>{locationInfo.fromLocation.name}</Text>
                            <Text style={[styles.lightText, { flex: 0.5 }]} ></Text>
                            <Text style={styles.primary}>{locationInfo.toLocation.name}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.lightText}>{firstSeat.locationInfo.fromLocation.address}</Text>
                            <View style={{ flex: 0.5 }} />
                            <Text style={styles.lightText}>{firstSeat.locationInfo.toLocation.address}</Text>
                        </View>
                    </View>
                    <View style={{height:10}}/>
                    <ActionText
                        image={infoIcon}
                        text='Cancellation Policies'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        onPress={() => onPolicy()}
                    />
                </View>
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
        marginVertical: 10
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
        // justifyContent: 'center',
        flex: 2,
        marginLeft: 15
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
        flexDirection:'row',
        fontSize: 12,
        color: Color.darkText,
        marginTop:2
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
        alignItems: 'center'
    }
})


BookingCard.defaultProps = {
    date: '10 Aug, 2018',
    displayAmount: 'USD 390',
    seats: 'Seats : A01 - A02\n2 Traveler',
    logo: benz,
    title: 'Shrinath Travel Agency',
    startDate: '08/10/2018 3:00 PM',
    endDate: '08/10/2018 6:15 PM',
    duration: '3h 15m',
    fromLocation: 'Kuala Lumpur, Malaysia',
    toLocation: 'Bandung, Indonesia',
    type: 'AC Bus 3 + 2'
}