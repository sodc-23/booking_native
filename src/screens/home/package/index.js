import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'

import SearchLocation from '@components/home/searchLocation'
import DateView from '@components/home/dateView'
import InfoView from '@components/home/infoView'
import RecentSearchs from '@components/home/recentSearchs'
import HotDeals from '@components/home/hotDeals'
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from '@common/color'
import { mapPin } from '@common/image'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as packagesAction from '@store/packages';

import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";

const { T1, T2 } = Global.Translate

class PackageC extends PureComponent {
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
    }

    searchPackages() {
        let { selectedLocation, fromDate, toDate, passengers, ages = [] } = this.props.packages
        if (!selectedLocation) {
            alert('Please select a location first')
            return
        }

        var items = []
        for (var i = 0; i < passengers; i++) {
            var age = ages[i] || 25
            items.push({
                "TypeString": age >= 18 ? "ADT" : (age >= 2 ? "CHD" : "INF"),
                "Quantity": 1,
                age: age
            })
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
                "paxInfo": [
                    {
                        "Item": items
                    }
                ],
                "status": "Available",
                "code": "Package",
                "business": "package"
            },
            "flags": {}
        }

        //console.log('searchRequest', searchRequest)
        var nights = moment(toDate).diff(moment(fromDate), 'days')
        Global.searchLocation = selectedLocation.name
        //Global.searchDetail = moment(fromDate).format('D MMM YYYY') + `, ${nights} Night` + (nights>1?'s':'')

        this.props.actions.search(searchRequest).then(({ error, result, token }) => {
            if (error) {
                console.log('searchPackage error', error)
                return
            }
            Global.searchToken['package'] = token
        })
        Actions.PackageList()
    }

    clickItem(item) {
        if (item == null || item.searchInfo == null) return;
        let converted = {}
        let { config, criteriaInfo, paxinfo } = item.searchInfo
        config.map(item => converted[item.key] = item.value)
        
    }

    render() {
        let { selectedLocation, fromDate, toDate, passengers, recentSearches } = this.props.packages
        selectedLocation = selectedLocation || {}
        let packageRecentSearches = (recentSearches || []).filter((o) => o.info.business == 'package')
        let {T1, T2, T3} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <HomeWhiteMenuButton
                        placeholder={T2('city').toProperCase()}
                        value={selectedLocation.name || ''}
                        onPress={() => Actions.SelectCommonLocation({ business: 'package' })}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('from date').toProperCase()}
                        value={moment(fromDate).format('D MMM, YYYY')}
                        onPress={() => Actions.SelectDate({ business: 'package', fromDate, toDate })}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('to date').toProperCase()}
                        value={moment(toDate).format('D MMM, YYYY')}
                        onPress={() => Actions.SelectDate({ business: 'package', fromDate, toDate })}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('passengers').toProperCase()}
                        value={passengers <= 1 ? `${passengers} ${T3('Passenger')}` : `${passengers} ${T3('Passengers')}`}
                        onPress={() => Actions.SelectPassenger3({ business: 'package' })}
                    />
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={this.searchPackages.bind(this)} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={packageRecentSearches} />
                {/* <HotDeals
                    {...this.props.hotDeal.package}
                    onPress={(item) => this.clickItem(item)}
                /> */}
            </View>
        )
    }
}

const mapStateToProps = ({ packages, hotDeal, language }) => ({ packages, hotDeal, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...packagesAction }, dispatch)
});

export default Package = connect(mapStateToProps, mapDispatchToProps)(PackageC);

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
        justifyContent: 'center'
    },
    searchButtonText: {
        fontSize: 16,
        color: 'white'
    }
})