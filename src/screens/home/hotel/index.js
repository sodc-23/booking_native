import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as packageAction from '@store/packages';
import moment from 'moment'

import Color from '@common/color'
import { mapPin } from '@common/image'
import UtilService from '@utils/utils';
import Global from "@utils/global";

import SearchLocation from '@components/home/searchLocation'
import DateView from '@components/home/dateView'
import InfoView from '@components/home/infoView'
import RecentSearchs from '@components/home/recentSearchs'

class HotelC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            deals: [
                {}, {}, {}, {}
            ],
            items: [
                {}, {}, {}, {}
            ],
            location: ''
        }

        this.props.actions.recentSearch()
        this.props.packageActions.getPromotedLocations()

    }

    searchHotel() {
        let { selectedLocation, fromDate, toDate, rooms } = this.props.hotel
        if (!selectedLocation) {
            alert('Please select a location first')
            return
        }
        let searchRequest = {
            "request": {
                "criteriaInfo": [{
                    "locationInfo": { fromLocation: selectedLocation },
                    "dateInfo": {
                        "startDate": moment(fromDate).format('YYYY-MM-DDTHH:mm:ss'),
                        "endDate": moment(toDate).format('YYYY-MM-DDTHH:mm:ss')
                    }
                }],
                "paxInfo": UtilService.makePaxInfo(rooms),
                "status": "Available",
                "code": null,
                "business": "hotel"
            },
            "flags": {}
        }

        //console.log('searchRequest', searchRequest)
        var nights = moment(toDate).diff(moment(fromDate), 'days')
        Global.searchLocation = selectedLocation.name
        Global.searchDetail = moment(fromDate).format('D MMM YYYY') + `, ${nights} Night` + (nights > 1 ? 's' : '')

        this.props.actions.search(searchRequest).then(({ error, result, token }) => {
            if (error) {
                console.log('searchHotel error', error)
                //alert('Failed to search') 
                return
            }
            Global.searchToken['hotel'] = token
        })
        Actions.HotelList()
    }

    searchHotelMap() {
        let { selectedLocation, fromDate, toDate, rooms } = this.props.hotel
        if (!selectedLocation) {
            alert('Please select a location first')
            return
        }
        let searchRequest = {
            "request": {
                "criteriaInfo": [{
                    "locationInfo": { fromLocation: selectedLocation },
                    "dateInfo": {
                        "startDate": moment(fromDate).format('YYYY-MM-DDTHH:mm:ss'),
                        "endDate": moment(toDate).format('YYYY-MM-DDTHH:mm:ss')
                    }
                }],
                "paxInfo": UtilService.makePaxInfo(rooms),
                "status": "Available",
                "code": null,
                "business": "hotel"
            },
            "flags": {}
        }

        //console.log('searchRequest', searchRequest)
        var nights = moment(toDate).diff(moment(fromDate), 'days')
        Global.searchLocation = selectedLocation.name
        Global.searchDetail = moment(fromDate).format('D MMM YYYY') + `, ${nights} Night` + (nights > 1 ? 's' : '')

        this.props.actions.search(searchRequest).then(({ error, result, token }) => {
            if (error) {
                console.log('searchHotel error', error)
                //alert('Failed to search') 
                return
            }
            Global.searchToken['hotel'] = token
            this.props.actions.searchMap(Global.searchToken['hotel'])
        })
        Actions.HotelList({ mode: 'map' })
    }

    clickItem(item) {
        if (item == null || item.searchInfo == null) return;
        let converted = {}
        let { config, criteriaInfo, paxinfo } = item.searchInfo
        config.map(item => converted[item.key] = item.value)
        Global.currentHotel = {
            locationInfo: criteriaInfo[0].locationInfo,
            name: converted.name
        }
        this.props.actions.getHotelDetail2(item)
        Actions.HotelDetail({ fromHotDeal: true })
    }

    render() {
        let { deals, items, location } = this.state
        let { selectedLocation, fromDate, toDate, rooms, recentSearches } = this.props.hotel
        let adults = 0, infants = 0, children = 0
        rooms.map((room) => {
            adults += room.adults
            children += room.children.length
            infants += room.infants
        })

        const { T1, T2 } = this.props.language

        let hotelRecentSearches = (recentSearches || []).filter((o) => o.info.business == 'hotel')
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <SearchLocation
                        location={selectedLocation ? UtilService.decodeHtmlEntity(selectedLocation.name) : ''}
                        onPress={() => Actions.SelectCommonLocation({ business: 'hotel' })}
                        language={this.props.language}
                    />
                    <DateView
                        fromDate={fromDate}
                        toDate={toDate}
                        onPress={() => Actions.SelectDate({ business: 'hotel', fromDate, toDate })}
                        language={this.props.language}
                    />
                    <InfoView
                        items={[
                            { title: T2('room').toProperCase(), value: rooms.length },
                            { title: T2('adult(s)').toProperCase(), value: adults },
                            { title: T2('children').toProperCase(), value: children }
                        ]}
                        onPress={() => Actions.SelectRoom()}
                    />
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={this.searchHotel.bind(this)} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.searchHotelMap.bind(this)} style={styles.mapButton}>
                            <Image source={mapPin} style={styles.mapPin} />
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={hotelRecentSearches} language={this.props.language} />
                {/* <HotDeals
                    {...this.props.hotDeal.all}
                    language={this.props.language}
                    onPress={(item) => this.clickItem(item)}
                /> */}
                
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, hotDeal, language }) => ({ hotel, hotDeal, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch),
    packageActions: bindActionCreators({ ...packageAction }, dispatch)
});

export default Hotel = connect(mapStateToProps, mapDispatchToProps)(HotelC);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    searchButton: {
        flex: 1,
        height: 44,
        backgroundColor: Color.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    searchButtonText: {
        fontSize: 16,
        color: 'white'
    },
    mapButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    mapPin: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    }
})