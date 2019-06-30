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
import TransferItem from '@components/home/packages/packageItem';
import { hotel1 } from '@common/image'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as packagesAction from '@store/packages';
import UtilService from '@utils/utils';
import Global from "@utils/global";
import InfiniteListView from '@components/general/infiniteListView';
import Color from '@common/color';
import { Actions } from 'react-native-router-flux'

const { T1, T2 } = Global.Translate

class PackageList extends PureComponent {
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

    clickItem(item) {
        if (item == null || item.searchInfo == null) return;
        let converted = {}
        let { config, criteriaInfo, paxinfo } = item.searchInfo
        config.map(item => converted[item.key] = item.value)
        Global.currentPackage = {
            locationInfo: null, //criteriaInfo[0].locationInfo,
            name: converted.name,
            displayAmount: converted.currencyCode + ' ' + Number(converted.bestAmount).toFixed(),
            flags: {}
        }
        this.props.actions.getPackageDetail2(item)
        Actions.PackageDetail({ fromHotDeal: true })
    }

    fetchMore() {

    }

    convertForDisplay(package_) {
        if (package_ == null || package_.searchInfo == null) return {}
        let convertedPackage = {}
        let { config, criteriaInfo, paxinfo } = package_.searchInfo
        config.map(item => convertedPackage[item.key] = item.value)
        const isAvailableImage = (convertedPackage.image.indexOf('http') >= 0)
        let { locationInfo: { fromLocation }, dateInfo: { startDate, endDate } } = criteriaInfo[0]
        return {
            title: convertedPackage.name,
            image: isAvailableImage ? { uri: convertedPackage.image } : null,
            rating: Number(convertedPackage.starRating),
            current: convertedPackage.currencyCode + ' ' + Number(convertedPackage.bestAmount).toFixed(),
            location: fromLocation.address,
            duration: convertedPackage.duration,
            hasSpecialDeal: true
        }

    }

    renderPackageList() {
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
                    renderRow={(package_) => (
                        <TransferItem
                            {...this.convertForDisplay(package_)}
                            onPress={() => this.clickItem(package_)}
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
                {this.renderPackageList()}
            </View>
        )
    }
}

const mapStateToProps = ({ packages, language }) => ({ package: packages, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...packagesAction }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PackageList);

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
    },
    noItem: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: Color.text
    }
})