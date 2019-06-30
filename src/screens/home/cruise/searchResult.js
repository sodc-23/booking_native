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
import PlaceHolder from '@components/home/cruise/placeholder';
import CruiseItem from '@components/home/cruise/cruiseItem'
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
            isFetching: false,
        }

    }

    componentWillMount() {
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000)
    }

    clickItem(hotel) {
        Actions.CruiseDetail()
    }

    renderHotelList() {
        // let { hotels } = this.props
        let hotels=[{}, {}, {}, {}, {} , {}, {}]
        if(hotels.length == 0) {
            return (<View style={styles.content}>
                <Text style={styles.notFoundText}>No Hotel(s) Found.</Text>
            </View>)
        }
        return (
            <View style={styles.content}>
                <InfiniteListView
                    dataArray={hotels}
                    spinnerColor={Color.primary}
                    renderRow={(hotel) => (
                        <CruiseItem
                            language={this.props.language}
                            {...hotel}
                            onPress={() => this.clickItem(hotel)}
                        />
                    )}
                    onRefresh={() => { }}
                    isRefreshing={false}
                    canLoadMore={true}
                    isLoadingMore={this.state.isFetching}
                    onLoadMore={() => {}}
                />
            </View>
        )
    }

    render() {
        let { isLoading } = this.state
        return (
            <View style={styles.container}>
                <FilterBar onPress={(index) => this.clickTab(index)} disabled={true} />
                <PlaceHolder isLoading={isLoading} />
                {this.renderHotelList()}
                {/* {availableSortingIndex.length > 0 && <Modal ref="sort" position="bottom" style={styles.modal} >
                    <SortList
                        list={availableSortingIndex}
                        selected={appliedSortingIndex}
                        onPress={(index) => this.sortHotel(index)}
                    />
                </Modal>} */}
            </View>
        )
    }
}

const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
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