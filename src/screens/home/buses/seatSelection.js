import React from 'react'

import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native'

import BusSeat from '@bus/busSeat'
import Color from '@common/color'

import GroupTitle from '@components/home/groupTitle';
import PriceDetail from '@components/home/bus/priceDetail'
import RoundButton from '@components/general/roundButton'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';
import * as cartAction from '@store/cart';
import { Actions } from 'react-native-router-flux';
import Global from "@utils/global";
import UtilService from '@utils/utils';
import {
    DropBoxItem,
    TouchItem
} from '@components/general/bookingInput/inputItems'
const { T1, T2 } = Global.Translate

class SeatSelectionC extends React.Component {
    constructor(props) {
        super(props)

        let { bus = {} } = props.bus
        let seats = []
        this.noSeater = true
        if (bus.items && bus.items[0]) {
            this.noSeater = (bus.items[0].item.find(o => o.type == 'Seater') == null)
            seats = bus.items[0].item.map(o => this.convertSeat(o))
        }

        this.state = {
            tabIndex: 0,
            priceList: {
                basePrice: '120 SAR',
                serviceTax: '0',
                totalPrice: '120 SAR'
            },
            seatList: ['A01', 'A02', 'B01', 'B02'],
            seats: seats,
            departurePointIndex: 0,
            dropPointIndex: 0
        }
        this.loading = true
        Global.departurePointIndex = 0
        Global.dropPointIndex = 0
    }

    convertSeat(o) {
        let row = o.seatLayout[0].item.value
        if (this.noSeater) {
            row = row == 1 ? row : row * 2 - 2
        }
        //if ( o.status == 'block' ) console.log(o)
        return {
            row,
            col: o.seatLayout[0].item.key,
            type: o.amenities[0].name,
            title: o.token,
            status: o.status,
            id:o.id, 
            selected: false,
            gender: o.gender,
            displayRateInfo: o.displayRateInfo,
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(props) {
        let { bus = {} } = props.bus
        if (bus.items && bus.items[0] && this.state.seats.length == 0) {
            this.noSeater = (bus.items[0].item.find(o => o.type == 'Seater') == null)
            var seats = bus.items[0].item.map(o => this.convertSeat(o))

            this.setState({ seats })
        }
    }
    selectSeat(seat) {
        let { seats } = this.state
        seat.selected = !seat.selected
        this.setState({ seats })
    }

    addToCart() {
        let { seats, departurePointIndex = 0, dropPointIndex = 0 } = this.state
        let { bus = {} } = this.props.bus
        //console.log('bud data', JSON.stringify(bus.stopInfo))
        var data = []
        var config = []
        let selectedSeats = seats.filter(o => o.selected)
        if (selectedSeats.length == 0) {
            alert(T2('Please Select Seat.'))

            return
        }
        let departurePoints = []
        let dropPoints = []

        bus.stopInfo.map(stop => {
            stop.item.map(item => {
                if (stop.code == 'departurePoints')
                    departurePoints.push(item)
                else
                    dropPoints.push(item)
            })
        })

        //console.log('selectedSeats', selectedSeats)

        selectedSeats.map(o => {
            data.push({
                businessObjectId: bus.id,
                key: bus.id,
                businessObjectItemId: o.id,
                value: o.id,
            })
            selectedSeats.push(o.title)
            config.push({
                key: Global.searchToken['bus'] + ":" + bus.id + ":" + o.title + ":" + "fromLocation",
                value: departurePoints[departurePointIndex].id
            })
            config.push({
                key: Global.searchToken['bus'] + ":" + bus.id + ":" + o.title + ":" + "toLocation",
                value: dropPoints[dropPointIndex].id
            })
            // config.push({
            //     key:Global.searchToken['bus'] + ":" + bus.id + ":" + o.title + ":" + "toLocation",
            //     value:departurePoints[departurePointIndex].id
            // })
        })

        //console.log('data, config', data, config)

        this.props.actions.addToCart(Global.searchToken['bus'], data, config, { isFromBookingDetails: false }).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            Actions.Booking({ business: 'bus' })
        })
    }

    render() {
        if (!this.props.show) return null
        let { tabIndex, seats, seatList, departurePoint, dropPoint, haltPoint, departurePointIndex = 0, dropPointIndex = 0, haltPointIndex = 0 } = this.state
        let { bus = {} } = this.props.bus
        let { locationInfo, stopInfo = [], seatLayout } = bus

        let { status } = this.props.cart
        let isLoading = status == cartAction.LOADING

        if (!locationInfo) return null

        let floors = seatLayout.find(o => o.type == 'deck').item.key
        let cols = seatLayout.find(o => o.type == 'total').item.key
        let rows = this.noSeater ? (seatLayout.find(o => o.type == 'total').item.value * 2 - 1) : seatLayout.find(o => o.type == 'total').item.value
        let selectedSeats = seats.filter(o => o.selected)
        let equipments = seatLayout.filter(o => o.item.key > 0 && o.item.value > 0).map(o=>{return {...o, col:o.item.key, row:o.item.value}})
        

        var basePrice = 0
        var taxPrice = 0
        var totalPrice = 0
        selectedSeats.map((seat, index) => {
            basePrice += Number(UtilService.getFieldFromList2(seat.displayRateInfo, 'purpose', 'amount', '1'))
            taxPrice += Number(UtilService.getFieldFromList2(seat.displayRateInfo, 'purpose', 'amount', '7'))
            totalPrice += Number(UtilService.getFieldFromList2(seat.displayRateInfo, 'purpose', 'amount', '10'))
        })
        let priceList = [
            { amount: Global.environment.portalCurrency.isoCode + ' ' + basePrice },
            { amount: Global.environment.portalCurrency.isoCode + ' ' + taxPrice },
            { amount: Global.environment.portalCurrency.isoCode + ' ' + totalPrice },
        ]
        let departurePoints = []
        let dropPoints = []
        //let haltPoints = []
        stopInfo.map(stop => {
            stop.item.map(item => {
                if (stop.code == 'departurePoints')
                    departurePoints.push(item)
                else if (stop.code == 'arrivalPoints')
                    dropPoints.push(item)
                // else if(stop.code == 'halts')
                //     haltPoints.push(item)
            })
        })

        return (
            <View style={styles.container}>
                <ScrollView>
                    <GroupTitle title="Select Boarding & Dropping Point:" />
                    <View style={styles.padding}>
                        {departurePoints.length > 0 && <DropBoxItem
                            title={'Select Boarding Point:'}
                            index={departurePointIndex}
                            value={departurePoint || UtilService.getBusLocation(departurePoints[0])}
                            options={departurePoints.map(o => UtilService.getBusLocation(o))}
                            onChange={(index) => {
                                this.setState({ departurePoint: UtilService.getBusLocation(departurePoints[index]), departurePointIndex: index })
                                Global.departurePointIndex = index
                            }}
                        />}
                        {departurePoints.length > 0 && <DropBoxItem
                            title={'Select Dropping Point:'}
                            index={dropPointIndex}
                            value={dropPoint || UtilService.getBusLocation(dropPoints[0])}
                            options={dropPoints.map(o => UtilService.getBusLocation(o))}
                            onChange={(index) => {
                                this.setState({ dropPoint: UtilService.getBusLocation(dropPoints[index]), dropPointIndex: index })
                                Global.dropPointIndex = index
                            }}
                        />}
                        {/* {haltPoints.length > 0 && <DropBoxItem 
                            title={'Select Halt Point:'}
                            index={haltPointIndex}
                            value={haltPoint||UtilService.getBusLocation(haltPoints[0])}
                            options={haltPoints.map(o=>UtilService.getBusLocation(o))}
                            onChange={(index)=>this.setState({haltPoint:UtilService.getBusLocation(haltPoints[index]), dropPointIndex:index})}
                        />} */}
                    </View>
                    {selectedSeats.length > 0 && <PriceDetail priceList={priceList} seatList={selectedSeats} />}
                    <BusSeat floors={floors} cols={cols} rows={rows} seats={[...seats, ...equipments]} onClickItem={(seat) => this.selectSeat(seat)} />
                </ScrollView>
                <View style={styles.bottomContainer}>
                    {/* <View style={styles.leftContainer}>
                        {strikeThroughAmount > 0 && <Text style={styles.price1}>{displayOriginalAmount}</Text>}
                        <Text style={styles.price2}>{displayAmount}</Text>
                        <Text style={styles.smallText}>Per Person</Text>
                    </View> */}
                    <View style={styles.rightContainer}>
                        <RoundButton
                            disabledUI={isLoading}
                            disabled={isLoading}
                            isLoading={isLoading}
                            title='ADD TO CART'
                            onPress={() => this.addToCart()}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = ({ bus, cart }) => ({ bus, cart });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...busAction, ...cartAction }, dispatch)
});

export default SeatSelection = connect(mapStateToProps, mapDispatchToProps)(SeatSelectionC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    padding: {
        paddingHorizontal: 15
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
    smallTitle: {
        fontSize: 10,
        color: Color.text
    },
    valueText: {
        fontSize: 16,
        color: Color.primary
    },
})