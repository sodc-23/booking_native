import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'

import HotDeals from '@components/home/hotDeals'
import Color from '@common/color'
import HomeWhiteMenuButton from '@components/general/homeWhiteMenuButton'
import { Actions } from 'react-native-router-flux';
import RecentSearchs from '@components/home/recentSearchs'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as activityAction from '@store/activity';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

class ActivitiesC extends PureComponent {
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

    searchActivities() {
        let { selectedLocation, fromDate, toDate, passengers } = this.props.activity
        if (!selectedLocation) {
            alert('Please select a location first')
            return
        }

        var items = []
        for (var i = 0; i < passengers; i++) {
            items.push({
                "TypeString": "ADT",
                "Quantity": 1,
                age: 30
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
                "code": "Activity",
                "business": "activity"
            },
            "flags": {}
        }

        //console.log('searchRequest', searchRequest)
        var nights = moment(toDate).diff(moment(fromDate), 'days')
        Global.searchLocation = selectedLocation.name
        Global.searchDetail = moment(fromDate).format('D MMM YYYY') + `, ${nights} Night` + (nights > 1 ? 's' : '')

        this.props.actions.search(searchRequest).then(({ error, result, token }) => {
            if (error) {
                console.log('searchActivity error', error)
                return
            }
            Global.searchToken['activity'] = token
        })
        Actions.ActivityList()
    }
    clickItem(activity) {
        if (activity == null || activity.searchInfo == null) return;
        let convertedActivity = {}
        let { config, criteriaInfo, paxinfo } = activity.searchInfo
        config.map(item => convertedActivity[item.key] = item.value)
        Global.currentActivity = {
            locationInfo: criteriaInfo[0].locationInfo,
            name: convertedActivity.name,
            displayAmount: convertedActivity.currencyCode + ' ' + Number(convertedActivity.bestAmount).toFixed(),
            flags: {}
        }
        this.props.actions.getActivityDetail2(activity)
        Actions.ActivityDetail({ fromHotDeal: true })
    }
    render() {
        let { deals } = this.state
        let { selectedLocation, fromDate, toDate, passengers, recentSearches } = this.props.activity
        selectedLocation = selectedLocation || {}
        let activityRecentSearches = (recentSearches || []).filter((o) => o.info.business == 'activity')
        console.log('activityRecentSearches', activityRecentSearches)
        let {T1, T2, T3} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <HomeWhiteMenuButton
                        placeholder={T2('city').toProperCase()}
                        value={selectedLocation.name || ''}
                        onPress={() => Actions.SelectCommonLocation({ business: 'activity' })}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('from date').toProperCase()}
                        value={moment(fromDate).format('D MMM, YYYY')}
                        onPress={() => Actions.SelectDate({ business: 'activity', fromDate, toDate })}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('to date').toProperCase()}
                        value={moment(toDate).format('D MMM, YYYY')}
                        onPress={() => Actions.SelectDate({ business: 'activity', fromDate, toDate })}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('passengers').toProperCase()}
                        value={passengers <= 1 ? `${passengers} ${T3('Passenger')}` : `${passengers} ${T3('Passengers')}`}
                        onPress={() => Actions.SelectPassenger({ business: 'activity' })}
                    />
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={this.searchActivities.bind(this)} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={activityRecentSearches} />
                {/* <HotDeals
                    {...this.props.hotDeal.activity}
                    onPress={(activity) => this.clickItem(activity)}
                /> */}
            </View>
        )
    }
}

const mapStateToProps = ({ activity, hotDeal, language }) => ({ activity, hotDeal, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...activityAction }, dispatch)
});

export default Activities = connect(mapStateToProps, mapDispatchToProps)(ActivitiesC);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 15,
        marginBottom: 15
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