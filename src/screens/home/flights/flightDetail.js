import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native'

import Color from '@common/color'
import { FontAwesome } from '@expo/vector-icons'
import { oval_landing, oval_land_off, departIcon, returnIcon, nileIcon, double_arrow, oneWayIcon } from '@common/image'
import FlightDetailInfo from '@components/home/flight/flightDetailInfo'
import RoundButton from '@components/general/roundButton'
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as airAction from '@store/air';
import * as cartAction from '@store/cart';
import { Actions } from 'react-native-router-flux';
import Marquee from '@components/general/react-native-text-ticker'

import Global from "@utils/global";
import UtilService from '@utils/utils';
const {T1, T2} = Global.Translate

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
const Tag = ({ title }) => (
    <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{title}</Text>
    </View>
)
const PriceItem = ({ title, value }) => (
    <View style={styles.rowSpace}>
        <Text style={styles.normal}>{title}</Text>
        <Text style={styles.normalBold}>{value}</Text>
    </View>
)
class FlightDetailC extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            items: [
                {
                    fromDate: 'sun, Oct 8 2017',
                    toDate: 'sun, Oct 8 2017',
                    duration: '3h 15m',
                    fromTime: '3:00 PM',
                    toTime: '6:15 PM',
                    fromLocation: 'Kuala lumpur, Malaysia',
                    toLocation: 'Bandong, Indonesia',
                    fromDesc: 'KALI',
                    toDesc: 'Husein Sastranegara',
                    stops: 3,
                    landingType: 'Depart',
                    symbol: nileIcon,
                    title: 'Egypt Airline',
                    tag: 'Economy'
                },
                {
                    fromDate: 'sun, Oct 8 2017',
                    toDate: 'sun, Oct 8 2017',
                    duration: '3h 15m',
                    fromTime: '3:00 PM',
                    toTime: '6:15 PM',
                    fromLocation: 'Kuala lumpur, Malaysia',
                    toLocation: 'Bandong, Indonesia',
                    fromDesc: 'KALI',
                    toDesc: 'Husein Sastranegara',
                    stops: 0,
                    landingType: 'Return',
                    symbol: nileIcon,
                    title: 'Egypt Airline',
                    tag: 'Economy'
                }
            ],
            fromDate: 'Fri, 20 Oct',
            toDate: 'Sun, 22 Oct',
            showDetail: []
        }
    }

    showDetail(index) {
        this.state.showDetail[index] = !this.state.showDetail[index]
        this.setState({ showDetail: [...this.state.showDetail] })
    }

    renderItem(itemSource, index) {
        let {dateInfo} = Global.currentAir
        let {item = [{}], properties = {}, type} = itemSource
        let {tripLocationDetails = {}} = properties
        let fromLocation = tripLocationDetails.fromLocation||tripLocationDetails.FromLocation
        let toLocation = tripLocationDetails.toLocation||tripLocationDetails.ToLocation
        let {tpExtension = [], locationInfo = {},  images = [], vendors = [], config, stops = 0, journeyDuration} = item[0]
        let duration = (properties.duration_Hour||0) + 'h'
        if(properties.duration_Minute||0 > 0) {
            duration += ' ' + properties.duration_Minute + 'm'
        }
        let {fareRules = [], fareBreakups = []} = this.props.air

        let { showDetail } = this.state

        let dateInfo1 = item[0].dateInfo || {}
        let dateInfo2 = item[item.length - 1].dateInfo|| {}

        // let { fromDate, toDate, duration, fromTime, toTime, fromLocation, toLocation, fromDesc, toDesc, stops, landingType, title, symbol, tag } = item
        return (
            <View key={index}>
                <View style={styles.itemHeaderContainer}>
                    <View style={styles.itemHeaderLeft}>
                        {images.length>0&&<Image source={{uri:images[0].url}} style={styles.itemMark} />}
                        <View style={{flex:1}}>
                        <Marquee style={styles.itemTitle}>{vendors[0]?vendors[0].item.name:'airlines'}</Marquee>
                        </View>
                    </View>
                    <View style={styles.itemHeaderCenter}>
                        <View style={styles.semiCircle}>
                            <Image source={type == '1' ? departIcon : returnIcon} style={styles.typeImage} />
                        </View>
                        <Text style={styles.primary}>{type == '1'?'Depart':'Return'}</Text>
                    </View>
                    <View style={styles.itemHeaderRight}>
                        <Tag title={UtilService.getFieldFromList(tpExtension, 'cabinClass')} />
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
                        <Text style={[styles.lightText, { flex: 0.5 }]} >
                        <FontAwesome name="clock-o" size={10} color={Color.lightText}/> {duration}</Text>
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
                {showDetail[index] && <FlightDetailInfo {...itemSource} fareBreakups={fareBreakups} fareRules={fareRules} />}
                <TouchableOpacity onPress={() => this.showDetail(index)} style={styles.itemBottom}>
                    <Text style={styles.orangeText}>{showDetail[index] ? 'Hide Details ' : 'See Details '}</Text>
                    <FontAwesome name={showDetail[index] ? "angle-up" : "angle-down"} size={20} color={Color.orange} />
                </TouchableOpacity>
            </View>
        )
    }

    addToCart() {
        var data = [{
            key : Global.currentAir.token
        }]
        this.props.actions.addToCart(Global.searchToken['air'], data).then(({error, result})=>{
            if(error) {
                console.log(error)
                return
            }

            Actions.Booking({business:'air'})
        })
    }
    getTypeName(type) { 
        if(type == '0') return 'Adult'
        if(type == '1') return 'Child'

        return 'Infant'
    }
    render() {
        //let {air = {}} = this.props
        let {items = [], tripType} = Global.currentAir
        let {dateInfo, config, displayAmount, strikeThroughAmount, displayOriginalAmount} = Global.currentAir
        var tripLocations = UtilService.getFieldFromList2(config, 'key', 'value', 'tripLocation').split('-')
        var fromLocation = tripLocations[0].trim()
        var toLocation = tripLocations[1].trim()
        let {fareRules = [], fareBreakups = []} = this.props.air
        let {status} = this.props.cart
        let isLoading = status==cartAction.LOADING

        let {T1, T2, T3, T4} = this.props.language
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.headerContainer}>
                        <View style={styles.rowContainer}>
                            <Text style={styles.bigText}>{fromLocation}</Text>
                            <Image source={items.length==2?double_arrow:oneWayIcon} style={styles.swapIcon} />
                            <Text style={styles.bigText}>{toLocation}</Text>
                        </View>
                        <Text style={styles.smallGrey}>{tripType=='Roundtrip'?`${moment(dateInfo.startDate).format('ddd, D MMM')} - ${moment(dateInfo.endDate).format('ddd, D MMM')}`:`${moment(dateInfo.startDate).format('ddd, D MMM')}`}</Text>
                    </View>
                    {items.map((item, index) => this.renderItem(item, index))}
                    <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.normalTitle}>{T4('PRICE BREAKUP')}</Text>
                    {fareBreakups.map((items, idx)=>{
                        if(items.type != '10') {
                            var totalAmount = 0
                            items.item.map(o=>{totalAmount += Number(o.totalAmount)})
                            var currency = items.item[0].displayRateInfo[0].currencyCode
                            return (
                                <View key={idx}>
                                    <Text style={[styles.normalBold, { marginVertical: 5 }]}>{UtilService.getChargeType(items.type)}</Text>
                                    {items.item.map((item, index)=>{
                                        return (
                                            <PriceItem key={index} title={`${item.quantity} ${this.getTypeName(item.type)}(x ${item.displayRateInfo[0].displayAmount})`} value={item.displayTotalAmount} />
                                        )
                                    })}
                                    {/* <View style={{marginTop:5}}>
                                        <PriceItem title={`Total of ${UtilService.getChargeType(items.type)}`} value={`${currency} ${UtilService.priceFormat(totalAmount, 0)}`} />
                                    </View> */}
                                </View>
                            )
                        }  else {
                            return (
                                <View key={idx}>
                                    <View style={styles.line1} />
                                    <View style={styles.rowSpace}>
                                        <Text style={styles.orange}>{T3('Total')}</Text>
                                        <Text style={styles.orange}>{items.item[0].displayTotalAmount}</Text>
                                    </View>
                                </View>
                            )
                        }                     
                    })}                    
                </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        {strikeThroughAmount > 0 && <Text style={styles.price1}>{displayOriginalAmount}</Text>}
                        <Text style={styles.price2}>{displayAmount}</Text>
                        <Text style={styles.smallText}>{T3('Per Person')}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            disabledUI={isLoading}
                            disabled={isLoading}
                            isLoading={isLoading}
                            title={T4('ADD TO CART')}
                            onPress={() => this.addToCart()}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = ({ air, cart, language }) => ({ air, cart, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...airAction, ...cartAction }, dispatch)
});

export default FlightDetail = connect(mapStateToProps, mapDispatchToProps)(FlightDetailC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemHeaderContainer: {
        backgroundColor: Color.lightBack,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 10
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        paddingHorizontal: 15,
    },
    itemContent: {
        padding: 15,
        backgroundColor: Color.lightPrimaryBack,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems:'center'
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
        justifyContent: 'center',
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
        borderRadius: 8,
        paddingHorizontal: 15,
        height:16,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#999'
    },
    tagText: {
        fontSize: 10,
        color: 'white'
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

    bottomContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    leftContainer: {
        alignItems: 'flex-end',
        width: 120,
        marginRight: 10
    },
    rightContainer: {
        flex: 1,
    },
    price1: {
        fontSize: 10,
        textDecorationLine: 'line-through',
        color: Color.text,
    },
    price2: {
        color: Color.orange,
        fontSize: 20,
        fontWeight: 'bold'
    },
    smallText: {
        color: Color.text,
        fontSize: 9
    },
    normal: {
        color: Color.darkText,
        fontSize: 12,
    },
    normalTitle: {
        fontSize: 12,
        color: Color.text,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20
    },
    normalBold: {
        fontSize: 12,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    orange: {
        fontSize: 14,
        color: Color.orange,
        fontWeight: 'bold'
    },
    rowSpace: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    line1: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15
    },
})