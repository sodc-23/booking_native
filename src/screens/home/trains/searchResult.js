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
import TrainItem from '@components/home/train/trainItem';
import SortList from '@components/home/hotel/sortList';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';

class SearchResultC extends PureComponent {
    constructor(props) {
        super(props)
        
        this.state = {
            isLoading: true,
            up: false,
            number: 0,
            isFetching: true,
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
            title: 'Trains'
        });
        setTimeout(()=>this.setState({isFetching:false}),3000)
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(train) {
        Actions.TrainDetail()
    }

    fetchMore(){

    }

    clickTab(index){
        if ( index == 0 ){
            this.refs.sort.open()
        }else if ( index == 1 ){
            Actions.FilterScreen({business:'train'})
        }else{
            Actions.pop()
        }
    }

    renderTrainList() {
        let {isFetching} = this.state
        if(this.props.trains.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>No Train Found.</Text>
            </View>)
        }
        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={this.props.trains}
                    spinnerColor={Color.primary}
                    showsVerticalScrollIndicator={false}
                    renderRow={(train) => (
                        <TrainItem
                            {...train}
                            isFetched={!isFetching}
                            onPress={() => this.clickItem(train)}
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

    sortTrain(index) {
    }

    render() {
        return (
            <View style={styles.container}>
                <FilterBar onPress={(index) => this.clickTab(index)} type={'NONE'} disabled={true} />
                {this.renderTrainList()}
                <Modal ref="sort" position="bottom" style={styles.modal} >
                    {/* <SortList
                        list={availableSortingList}
                        selected={appliedSortingIndex}
                        onPress={(index) => this.sortTrain(index)}
                    /> */}
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = ({ }) => ({ });

const mapDispatchToProps = (dispatch) => ({
});

export default SearchResult = connect(mapStateToProps, mapDispatchToProps)(SearchResultC);

SearchResult.defaultProps={
    trains:[
        {},{},{},{},{}
    ]
}

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