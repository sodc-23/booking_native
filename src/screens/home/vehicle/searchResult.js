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
import VehicleItem from '@components/home/vehicle/vehicleItem';
import SortList from '@components/home/hotel/sortList';
import { hotel1 } from '@common/image'
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vehicleAction from '@store/vehicle';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';
import PolicyModal2 from '@hotel_room/policyModal2'

const {T1, T2} = Global.Translate

class SearchResultC extends PureComponent {
    constructor(props) {
        super(props)
        
        this.state = {
            isLoading: true,
            up: false,
            number: 0,
            activities: [
                { locationInfo: {fromLocation:{address:'Bankok Thai'}}, name: 'Alila Villas Uluwatu1', rating: 8.3, location: 'Dubai - Subway Access', displayAmount: 400, passengers: 5, bags: 5 },
                { locationInfo: {fromLocation:{address:'Bankok Thai'}}, name: 'Alila Villas Uluwatu2', rating: 8.3, location: 'Dubai - Subway Access', displayAmount: 400, passengers: 5, bags: 5 },
                { locationInfo: {fromLocation:{address:'Bankok Thai'}}, name: 'Alila Villas Uluwatu3', rating: 8.3, location: 'Dubai - Subway Access', displayAmount: 400, passengers: 5, bags: 5 },
                { locationInfo: {fromLocation:{address:'Bankok Thai'}}, name: 'Alila Villas Uluwatu4', rating: 8.3, location: 'Dubai - Subway Access', displayAmount: 400, passengers: 5, bags: 5 },
            ],
            isFetching: false,
            canLoadMoreContent: true,
            availableSortingList:[
                {name: 'Name', order:false},
                {name: 'Price', order:false}
            ],
            selected:{
                name:'Name', order:false
            },
            policyTitle: 'Cancel Policy',
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: 'Cars List',
        });
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(vehicle) {
        Global.currentVehicle = vehicle
        //this.props.actions.getPolicyDetail(vehicle.token, Global.searchToken['vehicle'])
        //this.props.actions.getFareBreakups(vehicle.token, Global.searchToken['vehicle'])

        Actions.VehicleDetail()
    }

    clickFareLink(vehicle) {
        var policyTitle = 'Rate Details'
        this.setState({
            loadingPolicy: true,
            policyTitle,
            policyDesc: "",
            policies: []
        })
        this.props.actions.getFareRules(vehicle.token, Global.searchToken['vehicle']).then(({ error, result }) => {
            this.setState({
                loadingPolicy: false
            })
            if (error) {
                console.log(error)
                return
            }

            var policies = result.map(o=>{
                return {
                    type:o.name,
                    description:o.item.map(o=>o.value).join('<br/>')
                }
            })
            this.setState({
                policies: policies.length > 0 ? policies : []
            })
        })
        this.policyModal.open()
    }

    fetchMore(){

    }

    clickTab(index){
        let { result } = this.props.vehicle
        if ( index == 0 ){
            if(this.refs.sort)
                this.refs.sort.open()
        } else if ( index == 1 ){
            if(result && result.availableFiltersIndex && result.availableFiltersIndex[0].item.length > 0)
                Actions.FilterScreen({business:'vehicle'})
        } 
    }

    renderVehicleList() {
        let {isFetching} = this.state
        let { result } = this.props.vehicle
        result = result || {}
        let items = result.data ? result.data[0].item : []

        if(items.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>No Cars Found.</Text>
            </View>)
        }
        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={items}
                    spinnerColor={Color.primary}
                    renderRow={(car) => (
                        <VehicleItem
                            title={car.name}
                            image={car.url}
                            vendorImage={car.vendors[0].item.url}
                            category={car.category}
                            passengers={UtilService.getFieldFromList(car.tpExtension, 'passengerQuantity')}
                            baggages={UtilService.getFieldFromList(car.tpExtension, 'baggageQuantity')}
                            doors={UtilService.getFieldFromList(car.tpExtension, 'doorCount')}
                            transmission={UtilService.getFieldFromList(car.tpExtension, 'transmissionType')}
                            ac={car.flags.isAirConditionAvailable?'Yes':'No'}
                            price={car.displayAmount}
                            strikePrice={car.displayStrikeThroughAmount}
                            onPress={() => this.clickItem(car)}
                            onPressFarePrice={() => this.clickFareLink(car)}
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

    sortVehicle(index) {
        let { result, searchPageData } = this.props.vehicle
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
        let { result, status } = this.props.vehicle
        result = result || {}
        const isLoading = status == vehicleAction.LOADING
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}

        return (
            <View style={styles.container}>
                {/* {result.data&&result.data.items.length>0&&<FilterBar onPress={(index) => this.clickTab(index)} type={'TRANSFER'} disabled={status == transferAction.LOADING} />} */}
                <FilterBar onPress={(index) => this.clickTab(index)} type={'CHANGEDATE'} disabled={status == vehicleAction.LOADING} />
                <PlaceHolder isLoading={isLoading} />
                {this.renderVehicleList()}
                {availableSortingIndex.length > 0 && <Modal ref="sort" position="bottom" style={styles.modal} >
                    <SortList
                        list={availableSortingIndex}
                        selected={appliedSortingIndex}
                        onPress={(index) => this.sortVehicle(index)}
                    />
                </Modal>}
                <PolicyModal2
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    policies={this.state.policies || []}
                    closeModal={() => this.policyModal.close()}
                    isLoading={this.state.loadingPolicy}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ vehicle }) => ({ vehicle });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...vehicleAction }, dispatch)
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
        height: 180
    },
    notFoundText: {
        paddingTop:20,
        textAlign:'center',
        color:Color.lightText
    }
})