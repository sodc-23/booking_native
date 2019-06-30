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
const {T1, T2} = Global.Translate

class SearchResultC extends PureComponent {
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
            availableSortingList:[
                {name: 'Name', order:false},
                {name: 'Price', order:false}
            ],
            selected:{
                name:'Name', order:false
            }
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: 'Activities',
            description: Global.searchLocation,
        });
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(activity) {
        Global.currentActivity = activity
        this.props.actions.getDetail(activity.id, Global.searchToken['activity'])
        Actions.ActivityDetail()
    }

    fetchMore(){

    }

    clickTab(index){
        let { result } = this.props.activity

        if ( index == 0 ){
            if(this.refs.sort)
                this.refs.sort.open()
        }else{
            if(result && result.availableFiltersIndex && result.availableFiltersIndex[0].item.length > 0){
                Actions.FilterScreen({business:'activity'}); 
            }
        }
    }

    renderActivityList() {
        let {isFetching} = this.state
        let { result } = this.props.activity
        result = result || {}
        let items = result.data ? result.data[0].item : []

        let {T2} = this.props.language
        if(items.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>{T2('No Activity Found.')}</Text>
            </View>)
        }

        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={items}
                    spinnerColor={Color.primary}
                    renderRow={(activity) => (
                        <ActivityItem
                            language={this.props.language}
                            title={activity.name}
                            image={activity.images ? { uri: activity.url } : null}
                            rating={activity.rating||0}
                            duration={UtilService.getFieldFromList(activity.tpExtension, 'duration')||''}
                            location={activity.locationInfo.fromLocation.address}
                            before={activity.strikeThroughAmount>0?UtilService.priceFormat(activity.strikeThroughAmount):0}
                            current={activity.displayAmount}
                            desc={""}
                            onPress={() => this.clickItem(activity)}
                        />
                    )}
                    onRefresh={() => { }}
                    isRefreshing={false}
                    canLoadMore={true}
                    isLoadingMore={isFetching}
                    onLoadMore={() => this.fetchMore()}
                />
            </View>
        )
    }

    sortActivity(index) {
        let { result, searchPageData } = this.props.activity
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}
        let pageInfoIndex = searchPageData.request.pageInfoIndex || []
        if(pageInfoIndex[0]) {
            pageInfoIndex[0].item.currentPage = 0
        }
        searchPageData.request.sortIndex[0] = {
            "code": "default",
            "sequence": 0,
            "properties": {},
            "item": {
                "order": availableSortingIndex[index].name == appliedSortingIndex.name ? appliedSortingIndex.order * (-1) : 1,
                "name": availableSortingIndex[index].name
            },
            "config": [],
            "flags": {}
        }

        this.props.actions.searchPage(searchPageData)
    }

    render() {
        let { result, status } = this.props.activity
        result = result || {}
        const isLoading = status == activityAction.LOADING
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}

        return (
            <View style={styles.container}>
                {result.data&&result.data[0].item.length>0&&<FilterBar onPress={(index) => this.clickTab(index)} type={'ACTIVITY'} disabled={status == activityAction.LOADING} />}

                <PlaceHolder isLoading={isLoading} />
                {this.renderActivityList()}
                {availableSortingIndex.length > 0 && <Modal ref="sort" position="bottom" style={styles.modal} >
                    <SortList
                        list={availableSortingIndex}
                        selected={appliedSortingIndex}
                        onPress={(index) => this.sortActivity(index)}
                    />
                </Modal>}
            </View>
        )
    }
}

const mapStateToProps = ({ activity, language }) => ({ activity, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...activityAction }, dispatch)
});

export default SearchResult = connect(mapStateToProps, mapDispatchToProps)(SearchResultC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex:1,
        paddingHorizontal: 10
    },
    modal: {
        height: 150
    },
    notFoundText: {
        paddingTop:20,
        textAlign:'center',
        color:Color.lightText
    }
})