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
import RoundButton from '@components/general/roundButton'

import FlightItem1 from '@components/home/flight/flightItem1'
import FlightItem2 from '@components/home/flight/flightItem2'
import FlightItem3 from '@components/home/flight/flightItem3'
import FlightItem4 from '@components/home/flight/flightItem4'

import SortList from '@components/home/hotel/sortList';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as airAction from '@store/air';
import * as cartAction from '@store/cart';

import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';
const { T1, T2 } = Global.Translate

const SelectedItem = ({flight})=>{
    if(!flight) {
        return <View style={styles.centerContainer}><Text style={styles.price}>No Selected</Text></View>
    }

    var {items, displayAmount} = flight
    let {item = [{}]} = items[0]
    let {vendors = []} = item[0]    

    return (
        <View style={styles.centerContainer}>
            <Text style={styles.title}>{vendors[0].item.name}</Text>
            <Text style={styles.price}>{displayAmount}</Text>
        </View>
    )
}

class SearchResultC extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            addingCart:false,
            up: false,
            number: 0,
            selected: {
                name: 'Name', order: false
            },
            isFetched: false,
            arrivalFlight:null,
            departureFlight:null,
        }
    }

    componentWillMount() {
        let {fromDate, passengers} = this.props.air
        this.props.navigation.setParams({
            title: (`Adt : ${passengers.adults}`+(passengers.children>0?`, Chd : ${passengers.children}`:'') + (passengers.infants > 0 ? `, Inf : ${passengers.infants}`:'')),
            description: moment(fromDate).format('ddd, DD MMM'),
        });
    }
    componentDidMount() {
        // setTimeout(() => {
        //     let { flights } = this.state
        //     flights.map((item) => item.isFetched = true)
        //     this.setState({ flights: [...flights] })
        // }, 3000)
    }

    clickItem(flight) {
        Global.currentAir = flight
        console.log('flight', JSON.stringify(flight))
        //this.props.actions.getDetail(flight.token, Global.searchToken['air'])
        this.props.actions.getFareRules(flight.token, Global.searchToken['air'])
        this.props.actions.getFareBreakups(flight.token, Global.searchToken['air'])

        Actions.FlightDetail()
    }

    fetchMore() {
        let {isFetching} = this.state
        if(isFetching) return

        let { searchPageData } = this.props.air
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
        let { result } = this.props.air

        if ( index == 0 ){
            if(this.refs.sort)
                this.refs.sort.open()
        }else{
            if(result && result.availableFiltersIndex && result.availableFiltersIndex[0].item.length > 0){
                Actions.FilterScreen({business:'air'}); 
            }
        }
    }

    selectItem(flight, type) {
        if(type == 'arrival') {
            this.setState({
                arrivalFlight:flight
            })
        } else {
            this.setState({
                departureFlight:flight
            })
        }
    }

    renderFlightList() {
        let { result = {}, status } = this.props.air
        let { arrivalFlight, departureFlight } = this.state
        const isLoading = status == airAction.LOADING
        let flights = result.data ? (result.data.find(o=>o.code=='default')?result.data.find(o=>o.code=='default').item:[]) : [{},{},{}]
        let isDomestic = this.props.isDomestic
        let flightArrivals = [{},{},{},{},{},{},{},{},{},{},{},{},], flightDepartures = [{},{},{},{},{},{},{},{},{},{},{},{},]
        if(isDomestic) {
            flightArrivals = result.data ? (result.data.find(o=>o.code=='arrival')?result.data.find(o=>o.code=='arrival').item:[]) :[{},{},{},{},{},{},{},{},{},{},{},{},]
            flightDepartures = result.data ? (result.data.find(o=>o.code=='departure')?result.data.find(o=>o.code=='departure').item:[]) :[{},{},{},{},{},{},{},{},{},{},{},{},]
            if(flightArrivals.length == 0) {
                return (<View style={styles.content}>
                    <Text style={styles.notFoundText}>No Flight Found.</Text>
                </View>)
            } 
        } else {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>No Flight Found.</Text>
            </View>)
        }

        return (
            <View style={styles.content}>
                {!isDomestic&&<InfiniteListView
                    dataArray={flights}
                    spinnerColor={Color.primary}
                    renderRow={(flight, sectionId, index) => {
                        switch (this.props.tripType) {
                            case 0:
                                return (
                                    <FlightItem1
                                        {...flight}
                                        isFetched = {!isLoading}
                                        index={index}
                                        onPress={() => this.clickItem(flight)}
                                    />
                                )
                            case 1:
                                return (
                                    <FlightItem2
                                        {...flight}
                                        isFetched = {!isLoading}
                                        index={index}
                                        onPress={() => this.clickItem(flight)}
                                    />
                                )
                            case 2:
                                return (
                                    <FlightItem3
                                        {...flight}
                                        isFetched = {!isLoading}
                                        index={index}
                                        onPress={() => this.clickItem(flight)}
                                    />
                                )
                        }
                    }}      
                    onRefresh={() => { }}
                    isRefreshing={false}
                    canLoadMore={true}
                    isLoadingMore={false}
                    onLoadMore={() => { this.fetchMore() }}
                />}
                {isDomestic&&
                <View style={styles.row}>
                    <View style={styles.column}>
                        <InfiniteListView
                            dataArray={flightArrivals}
                            renderRow={(flight, sectionId, index) => {
                                return (
                                    <FlightItem4
                                        {...flight}
                                        isFetched = {!isLoading}
                                        index={index}
                                        type='left'
                                        selected={arrivalFlight}
                                        onPress={() => this.selectItem(flight, 'arrival')}
                                    />
                                )
                            }}      
                            onRefresh={() => { }}
                            isRefreshing={false}
                            canLoadMore={true}
                            isLoadingMore={false}
                            onLoadMore={() => { this.fetchMore() }}
                        />
                    </View>
                    <View style={styles.column}>
                        <InfiniteListView
                            dataArray={flightDepartures}
                            renderRow={(flight, sectionId, index) => {
                                return (
                                    <FlightItem4
                                        {...flight}
                                        isFetched = {!isLoading}
                                        index={index}
                                        selected={departureFlight}
                                        onPress={() => this.selectItem(flight, 'departure')}
                                    />
                                )
                            }}      
                            onRefresh={() => { }}
                            isRefreshing={false}
                            canLoadMore={true}
                            isLoadingMore={false}
                            onLoadMore={() => { this.fetchMore() }}
                        />
                    </View>
                </View>}
            </View>
        )
    }

    sort(index) {
        let { result, searchPageData } = this.props.air
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

    addToCart() {
        let { arrivalFlight, departureFlight, addingCart } = this.state

        var data = [{
            key : arrivalFlight.token
        },
        {
            key : departureFlight.token
        }]
        this.setState({
            addingCart:true
        })
        this.props.actions.addToCart(Global.searchToken['air'], data).then(({error, result})=>{
            this.setState({
                addingCart:false
            })
            
            if(error) {
                console.log(error)
                return
            }

            Actions.Booking({business:'air'})
        })
    }

    render() {
        let { result, status } = this.props.air
        let { arrivalFlight, departureFlight, addingCart } = this.state
        result = result || {}
        const isLoading = status == airAction.LOADING
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}
        let totalAmount = 0
        let currency = "SAR"
        if(arrivalFlight) {
            totalAmount += arrivalFlight.amount
            currency = arrivalFlight.displayAmount.split(" ")[0]
        }
        if(departureFlight) {
            totalAmount += departureFlight.amount
            currency = arrivalFlight.displayAmount.split(" ")[0]
        }

        return (
            <View style={styles.container}>
                <FilterBar onPress={(index) => this.clickTab(index)} type={'AIR'} disabled={isLoading} />
                {/* <ScrollView>
                    
                </ScrollView> */}
                {this.renderFlightList()}
                {!isLoading&&<View style={styles.selectedPriceContainer}>
                    <View style={styles.column}>
                        <SelectedItem flight={arrivalFlight}/>
                    </View>
                    <View style={styles.column}>
                        <SelectedItem flight={departureFlight}/>
                    </View>
                </View>}
                {!isLoading&&<View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        {totalAmount>0&&<Text style={styles.totalText}>Total</Text>}
                        {totalAmount>0&&<Text style={styles.price2}>{currency} {totalAmount}</Text>}
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            disabledUI={!arrivalFlight||!departureFlight||addingCart}
                            disabled={!arrivalFlight||!departureFlight||addingCart}
                            isLoading={addingCart}
                            title='ADD TO CART'
                            onPress={() => this.addToCart()}
                        />
                    </View>
                </View>}
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

const mapStateToProps = ({ air }) => ({ air });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...airAction, ...cartAction }, dispatch)
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
    row: {
        flex:1,
        flexDirection:'row',
    },
    column:{
        flex:1
    },
    selectedPriceContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        paddingHorizontal: 10,
        height:50
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
        color: Color.orange,
        fontSize: 20,
        fontWeight: 'bold'
    },
    totalText: {
        color: Color.text,
        fontWeight: 'bold',
        fontSize: 16
    },
    normal: {
        color: Color.primary,
        fontSize: 14,
    },
    normalTitle: {
        fontSize: 12,
        color: Color.text,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20
    },
    normalBold: {
        fontSize: 12,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    orange: {
        fontSize: 14,
        color: Color.orange,
        fontWeight: 'bold'
    },
    centerContainer:{
        flex:1,
        // alignItems:'center',
        justifyContent:'center',
    },
    title:{
        fontSize: 13,
        color: Color.darkText
    },
    price:{
        fontSize: 16,
        color: Color.primary,
        fontWeight: 'bold',
    }
})