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
import { nileIcon } from '@common/image'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import moment from 'moment';
import UtilService from '@utils/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default class FlightItem extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            symbol: nileIcon,
            title: 'Nile Airline',
            startTime: '9:15',
            endTime: '11:15',
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
        setTimeout(() => this.setState({ isFetched: true }), 3000)
    }

    render() {
        let { index, isFetched, onPress } = this.props
        const background = { backgroundColor: index % 2 == 1 ? Color.lightPrimaryBack : 'white' }
        let {rating, items = [{}], status, tripType, paxInfo, amount, displayAmount = 0, strikeThroughAmount = 0, displayOriginalAmount = 0, 
            displayRateInfo, flags} = this.props
            //console.log(items)
        if ( items == null || items.length == 0 ) return null
        let {item = [{}], properties = {}} = items[0]
        let {tripLocationDetails = {}} = properties
        let fromLocation = tripLocationDetails.fromLocation||tripLocationDetails.FromLocation||{}
        let toLocation = tripLocationDetails.toLocation||tripLocationDetails.ToLocation||{}
        let dateInfo1 = item[0].dateInfo || {}
        let dateInfo2 = item[item.length - 1].dateInfo|| {}
        let {tpExtension = [], locationInfo = {}, images = [], vendors = [], config, stops = 0, journeyDuration} = item[0]    
        let duration = (properties.duration_Hour||0) + 'h'
        if(properties.duration_Minute||0 > 0) {
            duration += ' ' + properties.duration_Minute + 'm'
        }
        return (
            <TouchableOpacity disabled={!isFetched} onPress={()=>onPress()} style={[styles.container, background]}>
                <View style={styles.titleContainer}>
                    <ShimmerPlaceHolder autoRun style={styles.image} visible={isFetched}>
                        {images.length>0&&<Image source={{uri:images[0].url}} style={styles.image} />}
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.middleText} visible={isFetched}>
                        <Text style={styles.title}>{vendors[0]?vendors[0].item.name:'airlines'}</Text>
                    </ShimmerPlaceHolder>
                </View>
                <View style={styles.lineContainer}>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.primary}>{dateInfo1.startDate?moment(dateInfo1.startDate).format('H:mm'):'12:00'}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.lightText}>
                        <FontAwesome name="clock-o" size={10} color={Color.lightText}/> {duration}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.primary}>{dateInfo2.endDate?moment(dateInfo2.endDate).format('H:mm'):'12:00'}</Text>
                    </ShimmerPlaceHolder>
                </View>
                <TimeLine hasStop={stops>0} background={background} />
                <View style={styles.lineContainer}>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.lightText}>{fromLocation.id||fromLocation.ID}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                    <Text style={styles.lightText}>{stops>0?stops+' Stop':'Non Stop'}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.lightText}>{toLocation.id||toLocation.ID}</Text>
                    </ShimmerPlaceHolder>
                </View>

                <View style={[styles.lineContainer, { marginTop: 20 }]}>
                    <View>
                        <ShimmerPlaceHolder autoRun style={[styles.shortText, { marginBottom: 5 }]} visible={isFetched}>
                            <Text style={[styles.primary, { marginBottom: 5 }]}>{dateInfo1.startDate?moment(dateInfo1.startDate).format('D MMM'):'1 Feb'}</Text>
                        </ShimmerPlaceHolder>
                        <ShimmerPlaceHolder autoRun style={styles.bigText} visible={isFetched}>
                            <Tag title={UtilService.getFieldFromList(tpExtension, 'cabinClass')} />
                        </ShimmerPlaceHolder>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <ShimmerPlaceHolder autoRun style={[styles.shortText, {marginRight:10}]} visible={isFetched}>
                            {strikeThroughAmount>0&&<Text style={styles.strike}>{displayOriginalAmount}</Text>}
                        </ShimmerPlaceHolder>
                        <View style={styles.center}>
                            <ShimmerPlaceHolder autoRun style={styles.bigText} visible={isFetched}>
                                <Text style={styles.bigOrange}>{displayAmount}</Text>
                            </ShimmerPlaceHolder>
                            <ShimmerPlaceHolder autoRun style={[styles.shortText, {marginTop:5}]} visible={isFetched}>
                                <Text style={styles.dark}>Per Person</Text>
                            </ShimmerPlaceHolder>
                        </View>
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
        borderColor: '#ccc'
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
        borderRadius:12,
        resizeMode: 'contain'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
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
        marginVertical: 5
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
        marginTop: 5,
        fontSize: 12,
        marginRight: 10,
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
    bigText:{
        width:100,
        height:24
    },
    center:{
        alignItems: 'flex-end',
        justifyContent:'flex-end'
    }
})