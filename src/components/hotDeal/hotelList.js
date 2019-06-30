import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    ListView,
    RefreshControl,
    Text
} from 'react-native'

import PlaceHolder from '@components/home/hotel/placeholder';
import HotelItem from '@components/home/hotel/hotelItem';
import { hotel1 } from '@common/image'
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';

const { T1, T2 } = Global.Translate

class HotelList extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            up: false,
            viewType: 'LIST',
            number: 0,
            initialRegion: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            hotels: [
                { image: hotel1, title: 'Alila Villas Uluwatu1', review: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78825, longitude: -122.4374 } },
                { image: hotel1, title: 'Alila Villas Uluwatu2', review: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78325, longitude: -122.4324 } },
                { image: hotel1, title: 'Alila Villas Uluwatu3', review: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.77325, longitude: -122.4324 } },
                { image: hotel1, title: 'Alila Villas Uluwatu4', review: 8.3, location: 'Dubai - Subway Access', before: 400, current: 200, desc: 'No Pyament Needed', coordinate: { latitude: 37.78825, longitude: -122.4274 } },

            ],
            isFetching: false,
            canLoadMoreContent: true
        }

    }



    clickItem(hotel) {
        if (hotel == null || hotel.searchInfo == null) return;
        let convertedHotel = {}
        let { config, criteriaInfo, paxinfo } = hotel.searchInfo
        config.map(item => convertedHotel[item.key] = item.value)
        Global.currentHotel = {
            locationInfo: null,//criteriaInfo[0].locationInfo,
            name: convertedHotel.name
        }
        this.props.actions.getHotelDetail2(hotel)
        Actions.HotelDetail({ fromHotDeal: true })
    }

    fetchMore() {
        // let {isFetching} = this.state
        // if(isFetching) return

        // let { searchPageData } = this.props.hotel
        // //console.log('searchPageData', searchPageData)

        // let pageInfoIndex = searchPageData.request.pageInfoIndex || []
        // if(pageInfoIndex[0] && pageInfoIndex[0].item.hasNextPage) {
        //     this.setState({isFetching:true})
        //     pageInfoIndex[0].item.currentPage++

        //     this.props.actions.searchPageNext(searchPageData).then(()=>{
        //         this.setState({isFetching:false})
        //     })
        // }
    }

    convertForDisplay(hotel) {
        if (hotel == null || hotel.searchInfo == null) return {}
        let convertedHotel = {}
        let { config, criteriaInfo, paxinfo } = hotel.searchInfo
        config.map(item => convertedHotel[item.key] = item.value)
        return {
            title: convertedHotel.name,
            image: { uri: convertedHotel.image },
            rating: Number(convertedHotel.starRating),
            current: convertedHotel.currencyCode + ' ' + Number(convertedHotel.bestAmount).toFixed(),
            location: criteriaInfo[0].locationInfo.fromLocation.address,
            hasSpecialDeal: true
        }

    }

    renderHotelList() {
        let {T1, T2} = this.props.language
        if (this.props.items.length == 0) {
            return <Text style={styles.noItem}>{T2('No deal(s) are available.')}</Text>
        }
        return (
            <View style={styles.content}>
                <InfiniteListView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    dataArray={this.props.items}
                    spinnerColor={Color.primary}
                    renderRow={(hotel) => (
                        <HotelItem
                            language={this.props.language}
                            {...this.convertForDisplay(hotel)}
                            onPress={() => this.clickItem(hotel)}
                        />
                    )}
                    onRefresh={() => { }}
                    canLoadMore={true}
                    isLoadingMore={true}
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
                {this.renderHotelList()}
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, language }) => ({ hotel, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});

export default HotelList = connect(mapStateToProps, mapDispatchToProps)(HotelList);

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
        height: 250
    },
    notFoundText: {
        paddingTop: 20,
        textAlign: 'center',
        color: Color.lightText
    },
    noItem: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: Color.text
    }
})