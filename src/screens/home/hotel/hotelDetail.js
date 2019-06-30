import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import HotelOverview from './hotelOverview'
import HotelReviews from './hotelReviews'
import HotelLocation from './hotelLocation'
import ImageHeader from '@hotel_detail/imageHeader'
import Color from '@common/color'
import { roomImage } from '@common/image';
import { Actions } from 'react-native-router-flux';
import RoundButton from '@components/general/roundButton'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";

const TabLabel = ({ route, title }) => (
    <Text style={[styles.tabLabel, { color: title == route.title ? Color.primary : Color.text }]}>{route.title}</Text>
)

class HotelDetailC extends PureComponent {
    constructor(props) {
        super(props)
        let {T1, T2} = this.props.language
        this.state = {
            images: [roomImage, roomImage, roomImage, roomImage, roomImage, roomImage],
            index: 0,
            routes: [
                { key: 'first', title: T2('overview').toUpperCase() },
                { key: 'second', title: T2('location').toUpperCase() },
                // { key: 'third', title: 'REVIEWS' },
            ],
            price1: 109,
            price2: 120
        }

        this.loading = true
    }
    componentWillMount() {
        //console.log('Global.currentHotel', Global.currentHotel, Global.currentUser)

        Actions.Loading({ searchType: 'hotel', title: UtilService.decodeHtmlEntity(Global.currentHotel.name) })
    }

    componentWillReceiveProps(next) {
        let { status, hotel } = next.hotel

        if (status != hotelAction.LOADING && this.loading && hotel && hotel.locationInfo) {
            this.loading = false
            Actions.pop()
            let {city, country} = hotel.locationInfo.fromLocation
            this.props.navigation.setParams({
                // onRight: this.done,
                // rightTitle: 'DONE',
                goBack: () => {
                    Actions.pop()
                    if (this.props.fromHotDeal) Actions.jump('HotDeal')
                },
                title: UtilService.decodeHtmlEntity(Global.currentHotel.name),
                description: city+', '+country
            });
            return
        }
    }
    // done() {
    //     Actions.pop()
    // }
    render() {
        let { index, routes, price1, price2, } = this.state
        let { hotel, status } = this.props.hotel
        hotel = hotel || {}
        let items = hotel.items ? hotel.items : []
        let showImages = []

        if (hotel.images) {
            hotel.items.map(o=>{
                o.item.map(room=>{
                    if(room.images) {
                        room.images.map((img)=>{
                            if(img.url) {
                                showImages.push({
                                    image: { uri: img.url },
                                    title: img.title
                                })
                            }
                        })
                    } 
                })
            })

            hotel.images.map(imageObj => {
                if(imageObj.url) {
                    showImages.push({
                        image: { uri: imageObj.url },
                        title: imageObj.title
                    })    
                }
            })
        }
        let {T1, T2} = this.props.language

        return (
            <View style={styles.container}>
                <ImageHeader
                    images={showImages}
                    minPrice={hotel.displayAmount}
                    isAmountPerNight={hotel.flags ? hotel.flags.isAmountPerNight : 0}
                    hotelName={hotel.name}
                    rating={hotel.rating}
                />
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <HotelOverview />,
                        second: () => <HotelLocation />,
                        third: () => <HotelReviews />,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    // initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            renderLabel={props => <TabLabel {...props} title={routes[index].title} />}
                            style={styles.tabBar}
                            indicatorStyle={styles.indicator}
                        />
                    }
                />
                <View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        {hotel.strikeThroughAmount > 0 && <Text style={styles.price1}>{hotel.displayOriginalAmount}</Text>}
                        <Text style={styles.price2}>{hotel.displayAmount}</Text>
                        {hotel.flags && hotel.flags.isAmountPerNight && <Text style={styles.smallText}>{T2('nightly average').toProperCase()}</Text>}
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T2('choose room').toUpperCase()}
                            onPress={() => Actions.RoomList()}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, language }) => ({ hotel, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});

export default HotelDetail = connect(mapStateToProps, mapDispatchToProps)(HotelDetailC);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabLabel: {
        fontSize: 12,
    },
    tabBar: {
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        height: 50,
        justifyContent: 'center'
    },
    indicator: {
        backgroundColor: Color.primary,
        height: 3
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
        color: Color.primary,
        fontSize: 20,
        fontWeight: 'bold'
    },
    smallText: {
        color: Color.text,
        fontSize: 9
    }
})

