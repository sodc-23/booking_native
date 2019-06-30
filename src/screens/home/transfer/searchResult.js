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
import TransferItem from '@components/home/transfer/transferItem';
import SortList from '@components/home/hotel/sortList';
import { hotel1 } from '@common/image'
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as transferAction from '@store/transfer';
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
            }
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: 'Transfer List'
        });
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(transfer) {
        Global.currentTransfer = transfer
        this.props.actions.getDetail(transfer.id, Global.searchToken['transfers'])
        Actions.TransferDetail()
    }

    fetchMore(){

    }

    clickTab(index){
        if ( index == 0 ){
            this.refs.sort.open()
        }else if ( index == 1 ){
            Actions.FilterScreen({business:'transfers'})
        }else{
            Actions.pop()
        }
    }

    renderTransferList() {
        let {isFetching} = this.state
        let { result } = this.props.transfers
        result = result || {}
        let items = result.data ? result.data[0].item : []
        if(items.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>No Transfer Found.</Text>
            </View>)
        }
        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={items}
                    spinnerColor={Color.primary}
                    renderRow={(transfer) => (
                        <TransferItem
                            title={UtilService.NormalizeTransferName(transfer.name)}
                            image={transfer.url ? { uri: transfer.url } : null}
                            passengers={UtilService.getFieldFromList(transfer.tpExtension, 'searchCount')}
                            duration={UtilService.getFieldFromList(transfer.tpExtension, 'duration')}
                            bags={4}
                            price={transfer.displayAmount}
                            desc={""}
                            onPress={() => this.clickItem(transfer)}
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

    sortTransfer(index) {
        let { result, searchPageData } = this.props.transfers
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
        let { result, status } = this.props.transfers
        result = result || {}
        const isLoading = status == transferAction.LOADING
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}

        return (
            <View style={styles.container}>
                {/* {result.data&&result.data.items.length>0&&<FilterBar onPress={(index) => this.clickTab(index)} type={'TRANSFER'} disabled={status == transferAction.LOADING} />} */}
                <FilterBar onPress={(index) => this.clickTab(index)} type={'NONE'} disabled={status == transferAction.LOADING} />
                <PlaceHolder isLoading={isLoading} />
                {this.renderTransferList()}
                {availableSortingIndex.length > 0 && <Modal ref="sort" position="bottom" style={styles.modal} >
                    <SortList
                        list={availableSortingIndex}
                        selected={appliedSortingIndex}
                        onPress={(index) => this.sortTransfer(index)}
                    />
                </Modal>}
            </View>
        )
    }
}

const mapStateToProps = ({ transfers }) => ({ transfers });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...transferAction }, dispatch)
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