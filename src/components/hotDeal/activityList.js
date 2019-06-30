import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    ListView,
    RefreshControl,
    Text
} from 'react-native'

import FilterBar from '@components/home/filterBar'
import PlaceHolder from '@components/home/hotel/placeholder';
import ActivityItem from '@components/home/activity/activityItem';
import SortList from '@components/home/hotel/sortList';
import { hotel1, noImage } from '@common/image'
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as activityAction from '@store/activity';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';
const { T1, T2 } = Global.Translate

class ActivityList extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            up: false,
            number: 0,
            activities: [
                { image: hotel1, title: 'Alila Villas Uluwatu1', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78825, longitude: -122.4374 } },
                { image: hotel1, title: 'Alila Villas Uluwatu2', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78325, longitude: -122.4324 } },
                { image: hotel1, title: 'Alila Villas Uluwatu3', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.77325, longitude: -122.4324 } },
                { image: hotel1, title: 'Alila Villas Uluwatu4', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78825, longitude: -122.4274 } },
            ],
            isFetching: false,
            canLoadMoreContent: true,
            availableSortingList: [
                { name: 'Name', order: false },
                { name: 'Price', order: false }
            ],
            selected: {
                name: 'Name', order: false
            }
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(activity) {
        if ( activity == null || activity.searchInfo == null ) return ;
        let convertedActivity = {}
        let {config, criteriaInfo, paxinfo} = activity.searchInfo
        config.map(item=>convertedActivity[item.key] = item.value)
        Global.currentActivity = {
            locationInfo:null,//criteriaInfo[0].locationInfo,
            name: convertedActivity.name,
            displayAmount:convertedActivity.currencyCode+ ' ' +Number(convertedActivity.bestAmount).toFixed(),
            flags:{}
        }
        this.props.actions.getActivityDetail2(activity)
        Actions.ActivityDetail({fromHotDeal:true})
    }

    fetchMore() {

    }

    convertForDisplay(activity){
        if ( activity == null || activity.searchInfo == null ) return {}
        let convertedActivity = {}
        let {config, criteriaInfo, paxinfo} = activity.searchInfo
        config.map(item=>convertedActivity[item.key] = item.value)
        const isAvailableImage = (convertedActivity.image.indexOf('http')>=0)
        let {locationInfo:{fromLocation}, dateInfo:{startDate, endDate}} = criteriaInfo[0]
        return {
            title:convertedActivity.name,
            image: isAvailableImage?{uri:convertedActivity.image}:null,
            rating: Number(convertedActivity.starRating),
            current: convertedActivity.currencyCode+ ' ' +Number(convertedActivity.bestAmount).toFixed(),
            location: fromLocation.address,
            duration: convertedActivity.duration,
            hasSpecialDeal:true
        }
        
    }

    renderActivityList() {
        let {T1, T2} = this.props.language
        if ( this.props.items.length == 0 ){
            return <Text style={styles.noItem}>{T2('No deal(s) are available.')}</Text>
        }
        return (
            <View style={styles.content}>
                <InfiniteListView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    dataArray={this.props.items}
                    spinnerColor={Color.primary}
                    renderRow={(activity) => (
                        <ActivityItem
                        {...this.convertForDisplay(activity)}
                            onPress={() => this.clickItem(activity)}
                        />
                    )}
                    onRefresh={() => { }}
                    isRefreshing={false}
                    canLoadMore={true}
                    isLoadingMore={false}
                    onLoadMore={() => this.fetchMore()}
                />
            </View>
        )
    }

    render() {
        let { status } = this.props
        return (
            <View style={styles.container}>
                <PlaceHolder isLoading={status == 'LOADING'} />
                {this.renderActivityList()}
            </View>
        )
    }
}

const mapStateToProps = ({ activity, language }) => ({ activity, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...activityAction }, dispatch)
});

export default ActivityList = connect(mapStateToProps, mapDispatchToProps)(ActivityList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
        paddingHorizontal: 10
    },
    modal: {
        height: 150
    },
    notFoundText: {
        paddingTop: 20,
        textAlign: 'center',
        color: Color.lightText
    },
    noItem:{
        textAlign:'center',
        marginTop:20,
        fontSize:14,
        color: Color.text
    }
})