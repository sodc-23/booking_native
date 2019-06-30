import React, { PureComponent } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    View,
    Image,
} from 'react-native'
import Color from '@common/color'
import { background } from '@common/image'
import Ionicons from '@expo/vector-icons/Ionicons';
import { screenWidth } from '@common/const'
import UtilService from '@utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as activityAction from '@store/activity';
import * as vehicleAction from '@store/vehicle';
import * as transferAction from '@store/transfer';
import * as airAction from '@store/air';
import * as busAction from '@store/bus';
import * as packagesAction from '@store/packages';
import moment from 'moment'

const ITEM_WIDTH = (screenWidth - 45) / 2

class RecentSearchsC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            indicators: []
        }
        if (this.props.items && this.props.items.constructor === Array) {
            for (let i = 0; i < this.props.items.length / 2; i++) {
                this.state.indicators.push(i)
            }
        }

    }
    handlePageChange = (e) => {
        var offset = e.nativeEvent.contentOffset;
        if (offset) {
            var page = Math.round(offset.x / screenWidth);
            if (this.state.page != page) {
                this.setState({ page: page });
            }
        }
    }
    search(item) {
        let searchRequest = {
            "request": item.request,
            "flags": {}
        }

        let { startDate, endDate } = item.request.criteriaInfo[0].dateInfo
        var nights = moment(endDate).diff(moment(startDate), 'days')
        Global.searchLocation = item.request.criteriaInfo[0].locationInfo.fromLocation.name
        Global.searchDetail = moment(startDate).format('D MMM YYYY') + `, ${nights} Night` + (nights > 1 ? 's' : '')

        var business = item.info.business
        this.props.actions[business].search(searchRequest).then(({ error, result, token }) => {
            if (error) {
                console.log('search error', error)
                //alert('Failed to search') 
                return
            }
            Global.searchToken[business] = token

            if (this.props.actions[business].recentSearch)
                this.props.actions[business].recentSearch()
        })
        switch (business) {
            case 'hotel':
                Actions.HotelList();
                break;
            case 'activity':
                Actions.ActivityList();
                break;
            case 'vehicle':
                Actions.VehicleList();
                break;
            case 'transfers':
                Actions.TransferList();
                break;
            case 'bus':
                Actions.BusList();
                break;
            case 'package':
                Actions.PackageList();
                break;
            case 'air':
                {
                    let fromLocation = searchRequest.request.criteriaInfo[0].locationInfo.fromLocation
                    let toLocation = searchRequest.request.criteriaInfo[0].locationInfo.toLocation
                    let portalCountryCode = Global.environment.portalCountry.code
                    let isDomestic = searchRequest.request.tripType=='Roundtrip'&&fromLocation.countryID==portalCountryCode&&toLocation.countryID==portalCountryCode

                    Actions.FlightList({tripType: searchRequest.request.tripType=='Oneway'?0:1, isDomestic:isDomestic})
                }
                break;
        }
    }
    render() {
        let { items, language:{T4} } = this.props
        if (items.length == 0) return null;

        let { page, indicators } = this.state
        const getName = (sourceName) => {
            if(sourceName.lastIndexOf('-') != -1)
                return UtilService.decodeHtmlEntity(sourceName.substr(0, sourceName.lastIndexOf('-') - 1))
            return sourceName
        }
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{T4('recent searches').toUpperCase()}</Text>
                <ScrollView
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.handlePageChange}
                >
                    {items.map((item, index) => (
                        <TouchableOpacity key={index}
                            onPress={() => this.search(item)}
                            style={[styles.itemContainer, { marginRight: (index & 1 == 1) ? 15 : 0 }]}>
                            <Image source={item.image || background} style={styles.image} />
                            <View style={styles.content}>
                                <Text style={styles.location} numberOfLines={3}>{getName(item.request.criteriaInfo[0].locationInfo.fromLocation.name)}</Text>
                                {/* <Text style={styles.property}>{item.count||'632'} properties</Text> */}
                                {/* <View style={styles.spacer}/> */}
                                {/* <Text style={styles.average}>Average Price</Text>
                                <Text style={styles.price}>USD {item.price||200}</Text> */}
                            </View>
                        </TouchableOpacity>
                    ))}
                    {items.length%2==1&&<View style={[styles.itemContainer, { marginRight: 15, backgroundColor:'transparent' }]}/>}
                </ScrollView>
                <View style={styles.indicatorContainer}>
                    {indicators.map((item, index) => (
                        <View key={index} style={[styles.indicator, index == page ? { borderWidth: 2, backgroundColor: 'black' } : {}]}>
                        </View>
                    ))}
                </View>
            </View>
        )
    }
}
const mapStateToProps = ({ language}) => ({language});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        hotel: bindActionCreators({ ...hotelAction }, dispatch),
        activity: bindActionCreators({ ...activityAction }, dispatch),
        vehicle: bindActionCreators({ ...vehicleAction }, dispatch),
        transfers: bindActionCreators({ ...transferAction }, dispatch),
        air: bindActionCreators({ ...airAction }, dispatch),
        bus: bindActionCreators({ ...busAction }, dispatch),
        package: bindActionCreators({ ...packagesAction }, dispatch),
    }
});

export default RecentSearchs = connect(mapStateToProps, mapDispatchToProps)(RecentSearchsC);


const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        borderRadius: 5,
        height: 120,
        overflow: 'hidden',
        marginLeft: 15,
    },
    image: {
        flex: 1,
        resizeMode: 'cover'
    },
    content: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicatorContainer: {
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    indicator: {
        width: 8,
        height: 8,
        backgroundColor: 'rgb(212, 232, 237)',
        borderRadius: 4,
        margin: 5,
        borderWidth: 0,
        borderColor: 'white'
    },
    title: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        marginVertical: 10
    },
    location: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
        textAlign: 'center'
    },
    property: {
        fontSize: 12,
        // fontWeight:'bold',
        color: 'white',
        marginLeft: 10,
    },
    average: {
        fontSize: 12,
        color: 'white',
        textAlign: 'right',
        marginRight: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'right',
        marginRight: 10,
    },
    spacer: {
        flex: 1
    }
})