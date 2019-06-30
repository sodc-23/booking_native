import React from 'react'

import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

const TimeLine = ({ hasStop, background }) => (
    <View style={styles.timeLine}>
        <View style={styles.line} />
        <View style={styles.lineContainer}>
            <View style={[styles.circle, background]} />
            {hasStop && <View style={[styles.circle, background]} />}
            <View style={[styles.circle, background]} />
        </View>
    </View>
)

const Tag = ({ title }) => (
    <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{title}</Text>
    </View>
)

import Color from '@common/color'
import { nileIcon, promotion } from '@common/image'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import moment from 'moment';
import UtilService from '@utils/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default class BusItem extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            symbol: nileIcon,
            title: 'Nile Airline',
            startTime: new Date(),
            endTime: new Date(),
            duration: '45min',
            startLocation: 'Sin',
            endLocatin: 'Kul',
            stops: '1 stop',
            date: '12 Aug',
            tag: 'Economy',
            oldPrice: 'USD 200',
            currentPrice: 'USD 190',
            isFetched: false
        }
    }

    componentDidMount() {
        //setTimeout(() => this.setState({ isFetched: true }), 3000)
    }

    render() {
        let { index, onPress, stopInfo,items,tpExtension,dateInfo,locationInfo, images, 
            amount, displayAmount, strikeThroughAmount, displayOriginalAmount, 
            vendors=[],seatLayout,displayRateInfo,config, flags, stops,layOverDuration, 
            journeyDuration,type,availabilityCount,hasSpecialDeal, specialDealDescription = '', isFetched} = this.props
        // const background = { backgroundColor: index % 2 == 1 ? Color.lightPrimaryBack : 'white' }
        const background={}
        var title = UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'operatorName')
        return (
            <TouchableOpacity disabled={!isFetched} onPress={() => onPress()} style={[styles.container, background]}>
                <View style={[styles.titleContainer, {marginBottom:8}]}>
                    <ShimmerPlaceHolder autoRun style={styles.image} visible={isFetched}>
                        <Image source={{uri:vendors[0].item.logo.url}} style={styles.image} />
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.middleText} visible={isFetched}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{title}</Text>
                            {isFetched && hasSpecialDeal && (
                                specialDealDescription == '' ?
                                    <Image source={promotion} style={styles.promotionIcon} /> :
                                    <Text numberOfLines={1} style={styles.promotionText}>{specialDealDescription}</Text>
                            )}
                        </View>
                    </ShimmerPlaceHolder>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <View style={{flex:1}}>
                        <View style={styles.lineContainer}>
                            <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                                <Text style={styles.primary}>{moment(dateInfo.startDate).format('HH:mm')}</Text>
                            </ShimmerPlaceHolder>
                            <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                                <Text style={styles.lightText}>
                                    <FontAwesome name="clock-o" size={10} color={Color.lightText} /> {UtilService.getHourMin(journeyDuration)}</Text>
                            </ShimmerPlaceHolder>
                            <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                                <Text style={styles.primary}>{moment(dateInfo.endDate).format('HH:mm')}</Text>
                            </ShimmerPlaceHolder>
                        </View>
                        <TimeLine hasStop={false} background={background} />
                        <View style={styles.lineContainer}>
                            <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                                <Text style={[styles.lightText, {textAlign:'center'}]}>{locationInfo.fromLocation.name}</Text>
                            </ShimmerPlaceHolder>
                            <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                                <Text style={[styles.lightText,{textAlign:'center'}]}>{locationInfo.toLocation.name}</Text>
                            </ShimmerPlaceHolder>
                        </View>
                    </View>
                    <View style={styles.center}>
                        {strikeThroughAmount > 0 && <ShimmerPlaceHolder autoRun style={[styles.shortText, { marginBottom: 10 }]} visible={isFetched}>
                            <Text style={styles.strike}>{displayOriginalAmount}</Text>
                        </ShimmerPlaceHolder>}
                        <ShimmerPlaceHolder autoRun style={styles.bigText} visible={isFetched}>
                            <Text style={styles.bigOrange}>{displayAmount}</Text>
                        </ShimmerPlaceHolder>
                        <ShimmerPlaceHolder autoRun style={[styles.shortText, { marginTop: 5 }]} visible={isFetched}>
                            <Text style={styles.dark}>Per Person</Text>
                        </ShimmerPlaceHolder>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    rowContainer: {
        flexDirection: 'row',
        width: '100%'
    },
    columnContainer: {
        flex: 1,
        alignItems: 'center'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        left: 0,
        top: 5,
        position: 'absolute',
    },
    lineContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white'
    },
    image: {
        width: 24,
        height: 24,
        borderRadius: 12,
        resizeMode: 'contain'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        marginLeft: 10,
        fontSize: 13,
        color: Color.darkText
    },
    primary: {
        fontSize: 10,
        color: Color.primary,
        fontWeight: 'bold',
    },
    lightText: {
        fontSize: 10,
        color: Color.lightText,
    },
    timeLine: {
        marginVertical: 5,
        marginHorizontal:15
    },
    tagContainer: {
        backgroundColor: '#eee',
        borderRadius: 2,
        padding: 3
    },
    tagText: {
        fontSize: 10,
        color: Color.primary
    },
    bigOrange: {
        fontSize: 18,
        color: Color.orange,
        textAlign: 'center',
    },
    dark: {
        fontSize: 10,
        color: Color.darkText,
    },
    strike: {
        marginBottom: 8,
        fontSize: 12,
        color: Color.darkText,
        textDecorationLine: 'line-through'
    },
    shortText: {
        width: 30,
    },
    middleText: {
        width: 50,
        marginLeft: 10
    },
    bigText: {
        width: 100,
        height: 24
    },
    center: {
        alignItems: 'flex-end',
        marginLeft:20
    },
    promotionIcon: {
        height: 14,
        width: 14,
        resizeMode: 'contain',
        marginLeft: 8
    },
    promotionText: {
        color: Color.orange,
        fontSize: 14
    }
})