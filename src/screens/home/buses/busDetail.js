import React from 'react'

import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native'

import GroupTitle from '@components/home/groupTitle';
import Color from '@common/color'
import { aboutus, seatFacility } from '@common/image'
const { width: screenWidth } = Dimensions.get('window')
import ImageHeader from '@hotel_detail/imageHeader'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';
import * as cartAction from '@store/cart';
import { Actions } from 'react-native-router-flux';
import UtilService from '@utils/utils';

import moment from 'moment';

const Item = ({ title, value }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
)

class BusDetailC extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 0
        }
    }
    render() {
        if(!this.props.show) return null

        let {bus = {}} = this.props.bus
        let {locationInfo = {}, policies=[]} = bus
        let showImages = []

        if (bus.images) {
            showImages = bus.images.map(imageObj => {
                return {
                    image: { uri: imageObj.url }
                }
            })
        }
        let departurePoints = []
        let dropPoints = []
        let viaPoints = []
        let haltPoints = []
        if(bus.stopInfo) {
            bus.stopInfo.map(stop=>{
                stop.item.map(item=>{
                    if(stop.code == 'departurePoints')
                        departurePoints.push(item)
                    else if(stop.code == 'arrivalPoints')
                        dropPoints.push(item)
                    else if(stop.code == 'enrouteCities')
                        viaPoints.push(item)
                    else if(stop.code == 'halts')
                        haltPoints.push(item)
                })
            })
        }

        let policy = UtilService.decodeHtmlEntity(policies.filter(o=>o.type=='Cancellation').map(o=>o.description).join('\n\r'))
        let {T1, T2, T3, T4} = this.props.language
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageHeader
                        hotelName={bus.name}
                        images={showImages}
                        rating={null}
                    />
                    <GroupTitle title={T3("Boarding Point")} />
                    <View style={styles.padding}>
                        {
                            departurePoints.map((o, index)=>(
                                <Item key={index} title={o.address} value={moment(o.time).format('h:mm A')} />
                            ))
                        }
                    </View>
                    <GroupTitle title={T3("Dropping Point")} />
                    <View style={styles.padding}>
                        {
                            dropPoints.map((o, index)=>(
                                <Item key={index} title={o.address} value={moment(o.time).format('h:mm A')} />
                            ))
                        }
                    </View>
                    {haltPoints.length > 0 && <GroupTitle title={T3("Halts")} />}
                    {haltPoints.length > 0 && <View style={styles.padding}>
                        {
                            haltPoints.map((o, index)=>(
                                <Item key={index} title={`${o.address} - ${o.name}`} value={UtilService.getHourMin(o.duration)} />
                            ))
                        }
                    </View>}
                    <GroupTitle title={T3("Amenities")} />
                    <FlatList
                        numColumns={3}
                        style={styles.flatlist}
                        data={bus.amenities||[]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.itemContainer2}>
                                    <Image source={item.icon || seatFacility} style={styles.icon} />
                                    <Text style={styles.name}>{item.name}</Text>
                                </View>
                            )
                        }}
                    />
                    {viaPoints.length > 0 && <GroupTitle title={T3("Via Location")} />}
                    {viaPoints.length > 0 && <View style={styles.padding}>
                        {
                            viaPoints.map((viaPoint, index)=><Item key={index} title={viaPoint.name}  value={moment(departurePoints[0].time).add(viaPoint.duration, 'minutes').format('h:mm A')} />)
                        }
                    </View>}
                    <GroupTitle title={T3("Cancellation Policy")} />
                    <View style={styles.padding}>
                        <Text style={styles.smallText}>{policy}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ bus, cart,language }) => ({ bus, cart, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...busAction, ...cartAction }, dispatch)
});

export default BusDetail = connect(mapStateToProps, mapDispatchToProps)(BusDetailC);

BusDetail.defaultProps = {
    policy: "If cancelled on or before 10 Day of travelling date, user needs to pay 90 Percentage cancellation charges.\nAdditional fee and taxes may apply. If cancelled on or before 30 Day of travelling date, user needs to pay 50 Perfentage cancellation charges.\n Additional fee and taxes may apply.",
    image: aboutus,
    facilities: [{ name: 'Blanket' }, { name: 'Charging Point' }, { name: 'Current Location' }, { name: 'Emergency Exit' },
    { name: 'Fire Extinguisher' }, { name: 'Medical Box' }, { name: 'Pillow' }, { name: 'Reading Light' }, { name: 'TV' }]
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    padding: {
        paddingHorizontal: 15
    },
    smallText: {
        fontSize: 12,
        color: Color.text,
        marginVertical: 15
    },
    image: {
        height: 200,
        width: '100%',
        resizeMode: 'cover'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical:4,
        minHeight:40,
    },
    title: {
        fontSize: 14,
        color: Color.text,
        fontWeight: 'bold',
        flex:4,
    },
    value: {
        fontSize: 14,
        color: Color.text,
        textAlign:'right',
        flex:1
    },
    flatlist:{
        marginVertical:10
    },
    itemContainer2: {
        width: screenWidth / 3,
        alignItems: 'center',
        marginVertical: 10
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    name: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 10,
        color: Color.darkText
    }
})