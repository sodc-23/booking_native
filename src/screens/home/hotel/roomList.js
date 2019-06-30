import React, { PureComponent } from 'react'

import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'


import InfoBar from '@hotel_room/infoBar'
import RoomItem from '@hotel_room/roomItem'
import RoomItem2 from '@hotel_room/roomItem2'
import RoundButton from '@components/general/roundButton'
import Color from '@common/color'
import { Actions } from 'react-native-router-flux'
import { roomImage, facilityIcon1 } from '@common/image'
import {FontAwesome} from '@expo/vector-icons'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as cartAction from '@store/cart';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import PriceModal from '@hotel_room/priceModal'
import PolicyModal from '@hotel_room/policyModal'

const {T1, T2} = Global.Translate

class RoomListC extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            rooms: [
                {
                    image: roomImage, title: 'Bunk Bed Family Room',
                    option1: {
                        title: 'Option1',
                        optionDesc: 'Room With Breakfast',
                        price: 'USD 43.6',
                        desc: 'Occupancy : 4 Adults, 2 Children',
                        facilities: [
                            { icon: facilityIcon1, desc: 'Breakfast' },
                            { icon: facilityIcon1, desc: 'Wifi For 4 Devices' },
                        ],
                        isRefundable: false,
                        info: 'Get 20% Off If Book Within 24 Hours',
                        isChecked: true
                    },
                    option2: {
                        title: 'Option2',
                        optionDesc: 'Room With Breakfast',
                        price: 'USD 43.6',
                        desc: 'Occupancy : 4 Adults, 2 Children',
                        facilities: [
                            { icon: facilityIcon1, desc: 'Breakfast' },
                            { icon: facilityIcon1, desc: 'Wifi For 4 Devices' },
                        ],
                        isRefundable: false,
                        info: 'Get 20% Off If Book Within 24 Hours',
                        isChecked: false
                    },
                },
                {
                    image: roomImage, title: 'Bunk Bed Family Room',
                    option1: {
                        title: 'Option1',
                        optionDesc: 'Room With Breakfast',
                        price: 'USD 43.6',
                        desc: 'Occupancy : 4 Adults, 2 Children',
                        facilities: [
                            { icon: facilityIcon1, desc: 'Breakfast' },
                            { icon: facilityIcon1, desc: 'Wifi For 4 Devices' },
                        ],
                        isRefundable: false,
                        info: 'Get 20% Off If Book Within 24 Hours',
                        isChecked: true
                    },
                    option2: {
                        title: 'Option2',
                        optionDesc: 'Room With Breakfast',
                        price: 'USD 43.6',
                        desc: 'Occupancy : 4 Adults, 2 Children',
                        facilities: [
                            { icon: facilityIcon1, desc: 'Breakfast' },
                            { icon: facilityIcon1, desc: 'Wifi For 4 Devices' },
                        ],
                        isRefundable: false,
                        info: 'Get 20% Off If Book Within 24 Hours',
                        isChecked: false
                    },
                },
            ],
            totalPrice: 130.8,
            totalRoomCount: 3,
            checkedIndexes: [],
            bookAmount: 0,
            displayType: 'OPTION', // OPTION, GROUP
            priceList:[],
            policyTitle:'Room Terms & Conditions',
            policyDesc:''
        }

        let { hotel, searchData } = this.props.hotel
        this.defaultImage = hotel.images.length > 0 ? { uri: hotel.images[0].url } : null

        console.log('searchData', searchData)
    }

    componentWillMount() {
        let locationInfo = Global.currentHotel.locationInfo?Global.currentHotel.locationInfo.fromLocation:null
        this.props.navigation.setParams({
            title: UtilService.decodeHtmlEntity(Global.currentHotel.name),
            description: locationInfo?`${locationInfo.city}, ${locationInfo.country}`:''
        });
    }
    done() {
        Actions.pop()
    }

    onChangeRoomCount(room, count) {
        room.requested = count
        this.setState({ rooms: [...this.state.rooms] })
    }

    renderRoom = (room, index) => {
        let image = this.defaultImage
        let options = room.item
        let { checkedIndexes, bookAmount } = this.state
        let rawData = room
        // if ( options.images != null && options.images.length > 0 ){
        //     image = {uri:options.images[0].url}
        // }
        let roomItem = {
            image, options, checkedIndexes, rawData
        }
        let { searchData, hotel } = this.props.hotel
        return (
            <RoomItem
                language={this.props.language}
                key={index}
                index = {index}
                {...roomItem}
                onDetail={(option) => {
                    Actions.RoomDetail({ roomItem:option, searchData, image, hotelId:hotel.id, groupId:roomItem.groupId, isGroupLayout:false })
                }}
                onPress={(groupId, code, roomIndex, amount) => {
                    if(checkedIndexes[roomIndex]) {
                        if(checkedIndexes[roomIndex].code == code && checkedIndexes[roomIndex].groupId == groupId) {
                            delete checkedIndexes[roomIndex]
                            bookAmount -= amount
                        } else {
                            bookAmount = bookAmount - checkedIndexes[roomIndex].amount + amount
                            checkedIndexes[roomIndex] = {groupId, code, roomIndex, amount}
                        }
                    } else {
                        checkedIndexes[roomIndex] = {groupId, code, roomIndex, amount}
                        bookAmount += amount
                    }
                    this.setState({ checkedIndexes, bookAmount })
                    this.forceUpdate()
                }}
            />
        )
    }

    renderRoom2(room, index) {
        let { searchData } = this.props.hotel
        let { hotel } = this.props.hotel
        let image = this.defaultImage
        return (
            <RoomItem2
                language={this.props.language}
                key={index}
                image={image}
                roomGroup={room}
                onPress={()=>this.groupBook(room)}
                onDetail={(option)=>{
                    Actions.RoomDetail({ roomItem: option, searchData, image, hotelId:hotel.id, groupId:room.id, isGroupLayout:true })
                }}
                onPriceDetail={()=>{
                    this.showGroupPolicy(room)
                }}
            />
        )
    }

    groupBook(roomGroup) {
        let { hotel } = this.props.hotel

        var data = [{
            key: hotel.id,
            value: roomGroup.id,
        }]
        this.props.actions.addToCart(Global.searchToken['hotel'], data).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            Actions.Booking({business:'hotel'})
        })
    }
    showGroupPolicy(roomGroup) {
        let { hotel } = this.props.hotel

        var data = {
            key: hotel.id,
            value: roomGroup.id,
        }
        this.props.actions.getPolicy(Global.searchToken['hotel'], data).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            var description = result.policies.map(o=>UtilService.decodeHtmlEntity(o.description)).join('\n')
            this.setState({
                policyDesc :description||'No Policy Found'
            })
        })
        this.policyModal.open()
    }

    //combo mode
    addToCartAndBook() {
        let { checkedIndexes } = this.state
        let { hotel } = this.props.hotel
        hotel = hotel || {}
        let rooms = hotel.items ? hotel.items : []
        //var paxSize = rooms.length> 0 ? rooms[0].item.length : 0

        //check if one more item is selected
        // if (Object.keys(checkedIndexes).length == 0) {
        //     return alert("Please select one more rooms.")
        // }

        var data = Object.keys(checkedIndexes).map((key) => {
            var item = checkedIndexes[key]
            return {
                key: hotel.id,
                value: item.groupId,
                SecondaryBusinessObjectItemId:item.code
            }
        })
        this.props.actions.addToCart(Global.searchToken['hotel'], data).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            Actions.Booking({business:'hotel'})
        })
    }

    showPolicy() {
        let { checkedIndexes } = this.state
        let { hotel } = this.props.hotel
        hotel = hotel || {}
        //check if one more item is selected
        if (Object.keys(checkedIndexes).length == 0) {
            return
        }

        var data = Object.keys(checkedIndexes).map((key) => {
            var item = checkedIndexes[key]
            return {
                key: hotel.id,
                value: item.groupId,
                SecondaryBusinessObjectItemId : item.code
            }
        })
        console.log('data', data)
        this.props.actions.getPolicy(Global.searchToken['hotel'], data[0]).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            var description = result.policies.map(o=>o.description).join('\n')
            this.setState({
                policyDesc :description||'No Policy Found'
            })
            this.policyModal.open()
        })
    }

    render() {
        let { checkedIndexes, bookAmount, displayType, priceList } = this.state
        let { hotel, status, searchData } = this.props.hotel
        hotel = hotel || {}
        let rooms = hotel.items ? hotel.items : []

        //Not yet implemented group layout
        let isGroupLayout = rooms.length > 0 && rooms[0].flags && rooms[0].flags.isGroupedRooms
        let dateInfo = searchData.request.criteriaInfo[0].dateInfo
        var nights = moment(dateInfo.endDate).diff(moment(dateInfo.startDate), 'days')
        var currency = rooms.item?rooms.item[0].displayRateInfo[0].currencyCode:'SAR'
        // var paxSize = rooms.length> 0 ? rooms[0].item.length : 0
        // let comboRooms = []
        // if(paxSize > 0) {
        //     for(var idx = 0 ; idx < paxSize ; idx++) {
        //         comboRooms.push({
        //             item:rooms.map(o=>{
        //                 return Object.assign({groupId:o.id, roomIndex:'room' + (idx+1)}, o.item[idx])
        //             }),
        //             paxInfo : [rooms[0].paxInfo[idx]]
        //         })
        //     }
        // }

        var paxSize = rooms.length || 0
        let comboRooms = []
        if(paxSize > 0) {
            for(var idx = 0 ; idx < paxSize ; idx++) {
                var items = rooms[idx].item.map(o=>{
                    return Object.assign({groupId:rooms[idx].id, roomIndex:'room' + (idx+1)}, o)
                })
                comboRooms.push({
                    item: items,
                    paxInfo : [rooms[idx].paxInfo[0]]
                })
            }
        }

        //console.log('comboRooms', JSON.stringify(comboRooms))
        let {T1, T2} = this.props.language
        return (
            <View style={styles.container}>
                <InfoBar
                    language={this.props.language}
                    checkIn={new Date(dateInfo.startDate)}
                    duration={nights}
                    rooms={searchData.request.paxInfo.length}
                />
                <ScrollView>
                    {!isGroupLayout && <View style={styles.content}>
                        {comboRooms.map((room, index) => this.renderRoom(room, index))}
                    </View>}
                    {isGroupLayout && <View style={styles.content}>
                        {rooms.map((room, index) => this.renderRoom2(room, index))}
                    </View>}
                </ScrollView>
                {!isGroupLayout&&<View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        {bookAmount > 0 && <Text style={styles.totalPrice}>{Global.environment.portalCurrency.isoCode} {bookAmount}</Text>}
                        {bookAmount > 0 && <TouchableOpacity onPress={() => this.showPolicy()}>
                            <FontAwesome name="info-circle" size={24} color={Color.lightText} />
                        </TouchableOpacity>}
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T1('book').toProperCase()}
                            disabled={paxSize != Object.keys(checkedIndexes).length}
                            disabledUI={paxSize != Object.keys(checkedIndexes).length}
                            onPress={() => this.addToCartAndBook()}
                            textStyle={styles.buttonText}
                        />
                    </View>
                </View>}
                <PriceModal
                    onRef={e => this.priceModal = e}
                    title={this.state.priceTitle}
                    items={priceList}
                    total={this.state.totalPrice}
                />
                <PolicyModal
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    description={this.state.policyDesc}
                    closeModal={()=>this.policyModal.close()}
                    isLoading={status==hotelAction.LOADING_POLICY}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, cart, language }) => ({ hotel, cart, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction, ...cartAction }, dispatch)
});

export default RoomList = connect(mapStateToProps, mapDispatchToProps)(RoomListC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    bottomContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
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
    roomCount: {
        fontSize: 14,
        color: Color.primary,
        fontWeight: 'bold'
    },
    content: {
        padding: 15
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})