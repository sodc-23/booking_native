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

export default class FlightItem extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            items: [
                {
                    symbol: nileIcon,
                    title: 'Nile Airline',
                    startTime: '9:15',
                    endTime: '11:15',
                    duration: '45min',
                    startLocation: 'Sin',
                    endLocatin: 'Kul',
                    stops: '1 stop',
                    date: '12 Aug',
                },
                {
                    symbol: nileIcon,
                    title: 'Nile Airline',
                    startTime: '9:15',
                    endTime: '11:15',
                    duration: '45min',
                    startLocation: 'Sin',
                    endLocatin: 'Kul',
                    stops: '1 stop',
                    date: '12 Aug',
                },
                {
                    symbol: nileIcon,
                    title: 'Nile Airline',
                    startTime: '9:15',
                    endTime: '11:15',
                    duration: '45min',
                    startLocation: 'Sin',
                    endLocatin: 'Kul',
                    stops: '1 stop',
                    date: '12 Aug',
                },
            ],
            tag: 'Economy',
            oldPrice: 'USD 200',
            currentPrice: 'USD 190',
            isFetched: false
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isFetched: true }), 3000)
    }

    renderItem(item, index) {
        let { symbol, title, startTime, endTime, duration, startLocation, endLocatin, stops, date, tag, oldPrice, currentPrice } = item
        let { isFetched } = this.props
        const background = { backgroundColor: index % 2 == 1 ? Color.lightPrimaryBack : 'white' }
        return (
            <View key={index}>
                <View style={styles.titleContainer}>
                    <ShimmerPlaceHolder autoRun style={styles.image} visible={isFetched}>
                        <Image source={symbol} style={styles.image} />
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.middleText} visible={isFetched}>
                        <Text style={styles.title}>{title}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={[styles.shortText, { marginLeft: 10 }]} visible={isFetched}>
                        <Text style={[styles.primary, { marginLeft: 10 }]}>{date}</Text>
                    </ShimmerPlaceHolder>
                </View>
                <View style={styles.lineContainer}>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.primary}>{startTime}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.lightText}>{duration}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.primary}>{endTime}</Text>
                    </ShimmerPlaceHolder>
                </View>
                <TimeLine hasStop={stops>0} background={background} />
                <View style={styles.lineContainer}>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.lightText}>{startLocation}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.lightText}>{stops>0?stops+' Stop':'Non Stop'}</Text>
                    </ShimmerPlaceHolder>
                    <ShimmerPlaceHolder autoRun style={styles.shortText} visible={isFetched}>
                        <Text style={styles.lightText}>{endLocatin}</Text>
                    </ShimmerPlaceHolder>
                </View>
            </View>
        )
    }

    render() {
        let { tag, oldPrice, currentPrice, items } = this.state
        let { index, isFetched } = this.props
        const background = { backgroundColor: index % 2 == 1 ? Color.lightPrimaryBack : 'white' }
        return (
            <TouchableOpacity disabled={!isFetched} onPress={()=>onPress()} style={[styles.container, background]}>


                {items.map((item, index) => this.renderItem(item, index))}
                <View style={[styles.lineContainer, { marginTop: 20 }]}>
                    <View>
                        <ShimmerPlaceHolder autoRun style={styles.bigText} visible={isFetched}>
                            <Tag title={tag} />
                        </ShimmerPlaceHolder>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <ShimmerPlaceHolder autoRun style={[styles.shortText, { marginRight: 10 }]} visible={isFetched}>
                            <Text style={styles.strike}>{oldPrice}</Text>
                        </ShimmerPlaceHolder>
                        <View style={styles.center}>
                            <ShimmerPlaceHolder autoRun style={styles.bigText} visible={isFetched}>
                                <Text style={styles.bigOrange}>{currentPrice}</Text>
                            </ShimmerPlaceHolder>
                            <ShimmerPlaceHolder autoRun style={[styles.shortText, { marginTop: 5 }]} visible={isFetched}>
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
        borderRadius: 12,
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
    bigText: {
        width: 100,
        height: 24
    },
    center: {
        alignItems: 'center'
    }
})