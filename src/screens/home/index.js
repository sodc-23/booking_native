import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ImageBackground,
    Image,
    ScrollView,
    TouchableOpacity,
    Text,
    StatusBar
} from 'react-native'

import Color from '@common/color'
import { logo, homeBack, mapPin } from '@common/image'
import ScrollTabView from '@components/home/scrollTabView'
import Hotel from '@screens/home/hotel'
import Flights from '@screens/home/flights'
import Activities from '@screens/home/activities'
import Buses from '@screens/home/buses'
import Cruise from '@screens/home/cruise'
import Transfer from '@screens/home/transfer'
import Trains from '@screens/home/trains'
import Vehicle from '@screens/home/vehicle'
import Package from '@screens/home/package'
import Global from '@utils/global'
import HotDeals from '@components/home/hotDeals'

const { T1, T2 } = Global.Translate

import * as hotDealAction from '@store/hotDeal';
import * as hotelAction from '@store/hotel';
import * as activityAction from '@store/activity';
import * as packagesAction from '@store/packages';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Actions} from 'react-native-router-flux'



class Home extends PureComponent {

    static onEnter(){
        StatusBar.setBarStyle('dark-content')
    }
    static onExit(){
        StatusBar.setBarStyle('light-content')
    } 

    constructor(props) {
        super(props)
        this.state = {
            titles: ['HOTELS', 'BUSES', 'TRANSFER', 'CAR RENTAL', 'ACTIVITIES', 'PACKAGE', 'FLIGHTS', 'CRUISE', 'TRAINS',],
            selected: 0,

        }
    }

    componentWillMount() {
        this.props.actions.hotDeal.fetchAllHotDeal()
    }

    changeTab(item, index) {
        this.setState({ selected: index })
    }

    renderSubview() {
        let { selected, titles } = this.state
        switch (titles[selected]) {
            case 'HOTELS':
                return <Hotel />
            case 'CAR RENTAL':
                return <Vehicle />
            case 'TRANSFER':
                return <Transfer />
            case 'ACTIVITIES':
                return <Activities />
            case 'FLIGHTS':
                return <Flights />
            case 'BUSES':
                return <Buses />
            case 'CRUISE':
                return <Cruise />
            case 'TRAINS':
                return <Trains />
            case 'PACKAGE':
                return <Package />
        }
    }
    clickItem(item) {
        if (item == null || item.searchInfo == null) return;
        let converted = {}
        let { config, criteriaInfo, paxinfo, business } = item.searchInfo
        config.map(item => converted[item.key] = item.value)

        switch (business) {
            case 'hotel':
                Global.currentHotel = {
                    locationInfo: criteriaInfo[0].locationInfo,
                    name: converted.name
                }
                this.props.actions.hotel.getHotelDetail2(item)
                Actions.HotelDetail({fromHome:true})
                break;
            case 'package':
                Global.currentPackage = {
                    locationInfo: criteriaInfo[0].locationInfo,
                    name: converted.name,
                    displayAmount: converted.currencyCode + ' ' + Number(converted.bestAmount).toFixed(),
                    flags: {}
                }
                this.props.actions.packages.getPackageDetail2(item)
                Actions.PackageDetail({fromHome:true})
                break;
            case 'activity':
                Global.currentActivity = {
                    locationInfo: criteriaInfo[0].locationInfo,
                    name: converted.name,
                    displayAmount: converted.currencyCode + ' ' + Number(converted.bestAmount).toFixed(),
                    flags: {}
                }
                this.props.actions.activity.getActivityDetail2(item)
                Actions.ActivityDetail({fromHome:true})
                break;
        }

    }

    render() {
        let { titles, selected, deals, items } = this.state

        return (
            <ImageBackground source={homeBack} style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} />
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <ScrollTabView
                            titles={titles}
                            selected={selected}
                            onPress={(item, index) => this.changeTab(item, index)}
                            language={this.props.language}
                        />
                    </View>
                    {this.renderSubview()}
                    <HotDeals
                        {...this.props.hotDeal.all}
                        language={this.props.language}
                        onPress={(item) => this.clickItem(item)}
                    />
                </ScrollView>
            </ImageBackground>
        )
    }
}
const mapStateToProps = ({ hotDeal, language }) => ({ hotDeal, language });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        hotDeal: bindActionCreators({ ...hotDealAction }, dispatch),
        hotel: bindActionCreators({ ...hotelAction }, dispatch),
        activity: bindActionCreators({ ...activityAction }, dispatch),
        packages: bindActionCreators({ ...packagesAction }, dispatch),
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoContainer: {
        backgroundColor: 'white',
        height: 100,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    logo: {
        height: 50,
        resizeMode: 'contain'
    },
    content: {
        paddingHorizontal: 15,
        marginTop: 15,
    },
})