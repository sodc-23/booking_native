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

import SortList from '@components/home/hotel/sortList';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';

import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';
import BusItem from '@components/home/bus/busItem';
const { T1, T2 } = Global.Translate

const default_bus = {
    "stopInfo": [
        {
            "code": "departurePoints",
            "sequence": 0,
            "properties": {},
            "item": [
                {
                    "timeStamp": 0,
                    "time": "2019-04-20T20:50:00",
                    "distance": 0,
                    "id": "857",
                    "name": "Makkah Al Haram Central Station",
                    "latitude": 0,
                    "longitude": 0,
                    "priority": 0
                },
                {
                    "timeStamp": 0,
                    "time": "2019-04-20T21:20:00",
                    "distance": 0,
                    "id": "859",
                    "name": "Makkah Alomra Central Station",
                    "latitude": 0,
                    "longitude": 0,
                    "priority": 0
                }
            ],
            "config": [],
            "flags": {}
        },
        {
            "code": "arrivalPoints",
            "sequence": 0,
            "properties": {},
            "item": [
                {
                    "timeStamp": 0,
                    "time": "2019-04-20T23:00:00",
                    "distance": 0,
                    "id": "855",
                    "name": "Jeddah Central Bus Station",
                    "latitude": 0,
                    "longitude": 0,
                    "priority": 0
                }
            ],
            "config": [],
            "flags": {}
        }
    ],
    "rating": 0,
    "ratersCount": 0,
    "items": [
        {
            "amount": 0,
            "strikeThroughAmount": 0,
            "originalAmount": 0,
            "dateInfo": {
                "startDate": "0001-01-01T00:00:00",
                "endDate": "0001-01-01T00:00:00"
            },
            "hasSpecialDeal": false,
            "tpExtension": [],
            "policies": [],
            "sequence": 0,
            "properties": {},
            "item": [],
            "config": [],
            "flags": {}
        }
    ],
    "isCheckAvailEnabled": false,
    "stopDetails": [],
    "totalDuration": 0,
    "ticketTimeLimit": "0001-01-01T00:00:00",
    "documents": [],
    "additionalParams": [],
    "cancellationPeriod": -1,
    "expiryPeriod": 0,
    "business": "bus",
    "objectIdentifier": "bus",
    "token": "9136b103-9ca0-4ddd-8895-ce1d49ef460c",
    "id": "113146",
    "tpExtension": [],
    "dateInfo": {
        "startDate": "2019-04-21T20:50:00",
        "endDate": "2019-04-21T23:00:00"
    },
    "locationInfo": {
        "fromLocation": {
            "name": "Makkah",
            "latitude": 0,
            "longitude": 0,
            "priority": 0
        },
        "toLocation": {
            "name": "Jeddah",
            "latitude": 0,
            "longitude": 0,
            "priority": 0
        }
    },
    "images": [],
    "paxInfo": [],
    "amount": 150,
    "displayAmount": "SAR  150",
    "strikeThroughAmount": 0,
    "originalAmount": 150,
    "displayOriginalAmount": "SAR  150",
    "policies": [],
    "vendors": [
        {
            "sequence": 0,
            "type": "default",
            "properties": {},
            "item": {
                "name": "ACTLBus",
                "provider": "UmrahTravels",
                "logo": {
                    "url": "http://businventory.hajzacom.com//Documents/OperatorsLogo/12072/OperatorsLogo.png",
                    "updatedDate": "0001-01-01T00:00:00",
                    "isDefault": false
                }
            },
            "config": [],
            "flags": {}
        }
    ],
    "seatLayout": [],
    "displayRateInfo": [
        {
            "amount": 150,
            "description": "BASEPRICE",
            "currencyCode": "SAR",
            "purpose": "1"
        },
        {
            "amount": 150,
            "description": "TOTALAMOUNT",
            "currencyCode": "SAR",
            "purpose": "10"
        }
    ],
    "breakDownRateInfo": [],
    "config": [],
    "flags": {
        "isBNPLAllow": false,
        "isBlockDateEnable": false
    },
    "stops": 0,
    "layOverDuration": 0,
    "journeyDuration": 130,
    "type": "Volvo Bus",
    "availabilityCount": 20,
    "sequenceNumber": 0,
    "amenities": [],
    "features": [],
    "paymentGatewayInfo": [],
    "displayPriority": 0,
    "hasSpecialDeal": true,
    "viewCount": 0,
    "quantity": 0
}

class SearchResultC extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            up: false,
            number: 0,
            selected: {
                name: 'Name', order: false
            },
            isFetched: false
        }
    }

    componentWillMount() {
        let {fromDate, passengers} = this.props.bus
        this.props.navigation.setParams({
            title: "Buses List",
        });
    }
    componentDidMount() {
        // setTimeout(() => {
        //     let { flights } = this.state
        //     flights.map((item) => item.isFetched = true)
        //     this.setState({ flights: [...flights] })
        // }, 3000)
    }

    clickItem(bus) {
        Global.currentBus = bus
        console.log('bus', JSON.stringify(bus))
        this.props.actions.getDetail(bus.id, Global.searchToken['bus'])
        //this.props.actions.getFareRules(bus.token, Global.searchToken['bus'])
        //this.props.actions.getFareBreakups(bus.token, Global.searchToken['bus'])

        Actions.BusDetail()
    }

    fetchMore() {
        let {isFetching} = this.state
        if(isFetching) return

        let { searchPageData } = this.props.bus
        //console.log('searchPageData', searchPageData)
        
        let pageInfoIndex = searchPageData.request.pageInfoIndex || []
        if(pageInfoIndex[0] && pageInfoIndex[0].item.hasNextPage) {
            this.setState({isFetching:true})
            pageInfoIndex[0].item.currentPage++
    
            this.props.actions.searchPageNext(searchPageData).then(()=>{
                this.setState({isFetching:false})
            })
        }
    }

    clickTab(index) {
        let { result } = this.props.bus

        if ( index == 0 ){
            if(this.refs.sort)
                this.refs.sort.open()
        }else{
            if(result && result.availableFiltersIndex && result.availableFiltersIndex[0].item.length > 0){
                Actions.FilterScreen({business:'bus'}); 
            }
        }
    }

    renderBusList() {
        let { result = {}, status } = this.props.bus
        const isLoading = status == busAction.LOADING
        let buses = result.data ? ((result.data.find(o=>o.code=='default')||{}).item)||[] : [default_bus, default_bus, default_bus]

        if (buses.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>No Bus Found.</Text>
            </View>)
        }

        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={buses}
                    spinnerColor={Color.primary}
                    renderRow={(bus, sectionId, index) => {
                        return <BusItem isFetched={!isLoading} index {...bus} onPress={()=>this.clickItem(bus)}/>
                    }}      
                    onRefresh={() => { }}
                    isRefreshing={false}
                    canLoadMore={true}
                    isLoadingMore={false}
                    onLoadMore={() => { this.fetchMore() }}
                />
            </View>
        )
    }

    sort(index) {
        let { result, searchPageData } = this.props.bus
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
        let { result, status } = this.props.bus
        result = result || {}
        const isLoading = status == busAction.LOADING
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}

        return (
            <View style={styles.container}>
                <FilterBar onPress={(index) => this.clickTab(index)} type={'BUS'} disabled={isLoading} />
                {this.renderBusList()}
                {availableSortingIndex.length > 0 && <Modal ref="sort" position="bottom" style={styles.modal} >
                    <SortList
                        list={availableSortingIndex}
                        selected={appliedSortingIndex}
                        onPress={(index) => {this.sort(index)}}
                    />
                </Modal>}
            </View>
        )
    }
}

const mapStateToProps = ({ bus }) => ({ bus });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...busAction }, dispatch)
});

export default SearchResult = connect(mapStateToProps, mapDispatchToProps)(SearchResultC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
    },
    modal: {
        height: 300
    },
    notFoundText: {
        paddingTop: 20,
        textAlign: 'center',
        color: Color.lightText
    },
    
})