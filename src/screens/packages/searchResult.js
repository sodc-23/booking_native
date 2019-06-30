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
import PackageItem from '@components/home/packages/packageItem';
import SortList from '@components/home/hotel/sortList';
import { hotel1, noImage } from '@common/image'
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as packagesAction from '@store/packages';
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
            title: 'Travel Packages',
            description: Global.searchLocation,
            goBack:()=>{
                if(this.props.fromPage == 'packages') {
                    Actions.pop()
                } else {
                    Actions.pop()
                    Actions.jump('Home')
                }
            }
        });
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(item) {
        Global.currentPackage = item
        this.props.actions.getDetail(item.id, Global.searchToken['package'])
        Actions.PackageDetail()
    }

    fetchMore(){

    }

    clickTab(index){
        let { result } = this.props.package

        if ( index == 0 ){
            if(this.refs.sort)
                this.refs.sort.open()
        }else{
            if(result && result.availableFiltersIndex && result.availableFiltersIndex[0].item.length > 0){
                Actions.PackageFilter({business:'package'}); 
            }
        }
    }

    renderPackageList() {
        let {isFetching} = this.state
        let { result } = this.props.package
        result = result || {}
        let items = result.data ? result.data[0].item : []

        let {T1, T2} = this.props.language
        if(items.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>{T2('no package found.').toProperCase()}</Text>
            </View>)
        }

        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={items}
                    spinnerColor={Color.primary}
                    renderRow={(item) => (
                        <PackageItem
                            language={this.props.language}
                            title={item.name}
                            image={item.images ? { uri: item.url } : null}
                            rating={item.rating||0}
                            duration={UtilService.getFieldFromList(item.tpExtension, 'duration')||''}
                            location={item.locationInfo.fromLocation.address}
                            before={item.strikeThroughAmount>0?UtilService.priceFormat(item.strikeThroughAmount):0}
                            current={item.displayAmount}
                            desc={""}
                            onPress={() => this.clickItem(item)}
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

    sortPackage(index) {
        let { result, searchPageData } = this.props.package
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
        let { result, status } = this.props.package
        result = result || {}
        const isLoading = status == packagesAction.LOADING
        let availableSortingIndex = result.availableSortingIndex ? result.availableSortingIndex[0].item : []
        let appliedSortingIndex = result.appliedSortingIndex ? result.appliedSortingIndex[0].item : {}

        return (
            <View style={styles.container}>
                {result.data&&result.data[0].item.length>0&&<FilterBar onPress={(index) => this.clickTab(index)} type={'PACKAGE'} disabled={status == packagesAction.LOADING} />}

                <PlaceHolder isLoading={isLoading} />
                {this.renderPackageList()}
                {availableSortingIndex.length > 0 && <Modal ref="sort" position="bottom" style={styles.modal} >
                    <SortList
                        list={availableSortingIndex}
                        selected={appliedSortingIndex}
                        onPress={(index) => this.sortPackage(index)}
                    />
                </Modal>}
            </View>
        )
    }
}

const mapStateToProps = ({ packages, language }) => ({ package : packages, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...packagesAction }, dispatch)
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