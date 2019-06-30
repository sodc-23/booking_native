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
import TransferItem from '@components/home/transfer/transferItem';
import { hotel1 } from '@common/image'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';

const { T1, T2 } = Global.Translate

export default class TransferList extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            up: false,
            number: 0,
            transfers: [
                { title: 'FullSize', image: hotel1, locationInfo: { fromLocation: { address: 'Bankok Thai' } }, name: 'Alila Villas Uluwatu1', rating: 8.3, location: 'Dubai - Subway Access', price: 'SAR 400', passengers: 5, bags: 5 },
                { title: 'FullSize', image: hotel1, locationInfo: { fromLocation: { address: 'Bankok Thai' } }, name: 'Alila Villas Uluwatu2', rating: 8.3, location: 'Dubai - Subway Access', price: 'SAR 400', passengers: 5, bags: 5 },
                { title: 'FullSize', image: hotel1, locationInfo: { fromLocation: { address: 'Bankok Thai' } }, name: 'Alila Villas Uluwatu3', rating: 8.3, location: 'Dubai - Subway Access', price: 'SAR 400', passengers: 5, bags: 5 },
                { title: 'FullSize', image: hotel1, locationInfo: { fromLocation: { address: 'Bankok Thai' } }, name: 'Alila Villas Uluwatu4', rating: 8.3, location: 'Dubai - Subway Access', price: 'SAR 400', passengers: 5, bags: 5 },
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

    clickItem(transfer) {
        // Global.currentTransfer = transfer
        // this.props.actions.getDetail(transfer.id, Global.searchToken['transfers'])
        // Actions.TransferDetail()
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
            location: fromLocation.name,
            duration: UtilService.getDuration(new Date(startDate),new Date(endDate)),
            hasSpecialDeal:true
        }
        
    }

    renderTransferList() {
        return (
            <View style={styles.content}>
                <InfiniteListView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    dataArray={this.props.items}
                    spinnerColor={Color.primary}
                    renderRow={(transfer) => (
                        <TransferItem
                            {...this.convertForDisplay(transfer)}
                            onPress={() => this.clickItem(transfer)}
                        />
                    )}
                    onRefresh={() => { }}
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
                {this.renderTransferList()}
            </View>
        )
    }
}
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
    }
})