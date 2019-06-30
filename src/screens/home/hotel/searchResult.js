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
import HotelItem from '@components/home/hotel/hotelItem';
import HotelMapView from '@components/home/hotel/hotelMapView';
import SortList from '@components/home/hotel/sortList';
import { hotel1 } from '@common/image'
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
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
            viewType: props.mode=='map'?'MAP':'LIST',
            number: 0,
            initialRegion: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            hotels: [
                { image: hotel1, title: 'Alila Villas Uluwatu1', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78825, longitude: -122.4374 } },
                { image: hotel1, title: 'Alila Villas Uluwatu2', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78325, longitude: -122.4324 } },
                { image: hotel1, title: 'Alila Villas Uluwatu3', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.77325, longitude: -122.4324 } },
                { image: hotel1, title: 'Alila Villas Uluwatu4', rating: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78825, longitude: -122.4274 } },

            ],
            isFetching: false,
            canLoadMoreContent: true
        }

    }

    componentWillMount() {
        this.props.navigation.setParams({
            rightTitle: null,
            title: Global.searchLocation,
            description: Global.searchDetail
        });
    }
    clickTab(index) {
        let { result } = this.props.hotel

        switch (index) {
            case 0:
                if(result && result.availableSortingIndex)
                    this.refs.sort.open(); 
                break;
            case 1:
                if(result && result.availableFiltersIndex && result.availableFiltersIndex[0].item.length > 0)
                    Actions.FilterScreen({business:'hotel'}); 
                break;
            case 2:
                this.setState({ viewType: this.state.viewType == 'MAP' ? 'LIST' : 'MAP' });
                break;
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(hotel) {
        Global.currentHotel = hotel
        //console.log('Global.currentHotel', Global.currentHotel, hotel)
        Global.currentHotel.name = Global.currentHotel.name || Global.currentHotel.title
        this.props.actions.getHotelDetail(hotel.id, Global.searchToken['hotel'])
        Actions.HotelDetail()
    }

    fetchMore(){
        let {isFetching} = this.state
        if(isFetching) return

        let { searchPageData } = this.props.hotel
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

    renderHotelList() {
        let { result } = this.props.hotel
        result = result || {}
        let items = result.data ? result.data[0].item : []

        if(items.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>No Hotel(s) Found.</Text>
            </View>)
        }
        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={items}
                    spinnerColor={Color.primary}
                    renderRow={(hotel) => (
                        <HotelItem
                            language={this.props.language}
                            title={UtilService.decodeHtmlEntity(hotel.name)}
                            image={hotel.images ? { uri: hotel.images[0].url } : null}
                            rating={hotel.rating}
                            review={hotel.review||8.2}
                            location={hotel.locationInfo.fromLocation.address}
                            before={hotel.strikeThroughAmount>0?UtilService.priceFormat(hotel.strikeThroughAmount):0}
                            current={hotel.displayAmount}
                            desc={""}
                            ratingInfo={hotel.ratingInfo}
                            isAmountPerNight={hotel.flags.isAmountPerNight}
                            hasSpecialDeal={hotel.hasSpecialDeal}
                            specialDealDescription={hotel.specialDealDescription}
                            onPress={() => this.clickItem(hotel)}
                        // key={index}
                        />
                    )}
                    onRefresh={() => { }}
                    isRefreshing={false}
                    canLoadMore={true}
                    isLoadingMore={this.state.isFetching}
                    onLoadMore={() => this.fetchMore()}
                />
            </View>
        )
    }

    renderHotelMap() {
        return (
            <HotelMapView
                initialRegion={this.state.initialRegion}
                hotels={this.state.hotels}
                onPress={(hotel, index) => this.clickItem(hotel)}
            />
        )
    }

    sortHotel(index) {
        let { result, searchPageData } = this.props.hotel
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
        let { viewType } = this.state
        let { result, status } = this.props.hotel
        result = result || {}
        const isLoading = status == hotelAction.LOADING
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}
        let items = result.data ? result.data[0].item : []
        return (
            <View style={styles.container}>
                {<FilterBar onPress={(index) => this.clickTab(index)} type={viewType} disabled={status == hotelAction.LOADING} />}
                {viewType == 'LIST' && <PlaceHolder isLoading={isLoading} />}
                {viewType == 'LIST' ? this.renderHotelList() : this.renderHotelMap()}
                {availableSortingIndex.length > 0 && <Modal ref="sort" position="bottom" style={styles.modal} >
                    <SortList
                        list={availableSortingIndex}
                        selected={appliedSortingIndex}
                        onPress={(index) => this.sortHotel(index)}
                    />
                </Modal>}
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, language }) => ({ hotel, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
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
        height: 250
    },
    notFoundText: {
        paddingTop:20,
        textAlign:'center',
        color:Color.lightText
    }
})