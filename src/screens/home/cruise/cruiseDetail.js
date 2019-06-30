import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import CruiseOverview from './cruiseOverview'
import CruiseReviews from './cruiseReviews'
// import CruiseLocation from './cruiseLocation'
import ImageHeader from '@hotel_detail/imageHeader'
import Color from '@common/color'
import { roomImage } from '@common/image';
import { Actions } from 'react-native-router-flux';
import RoundButton from '@components/general/roundButton'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";

const TabLabel = ({ route, title }) => (
    <Text style={[styles.tabLabel, { color: title == route.title ? Color.primary : Color.text }]}>{route.title}</Text>
)

class CruisetailC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            index:0,
            routes: [
                { key: 'first', title: 'overview'},
                { key: 'second', title: 'reviews' },
                // { key: 'third', title: 'REVIEWS' },
            ],
        }
    }
    componentWillMount() {
       
    }

    componentWillReceiveProps(next) {
    }
    
    render() {
        let showImages=[{title:'Cruise', image:roomImage}]
        let {T1, T2, T4} = this.props.language
        let {routes, index} = this.state
        return (
            <View style={styles.container}>
                <ImageHeader
                    images={showImages}
                    minPrice={200}
                    isAmountPerNight={1}
                    hotelName={''}
                    rating={''}
                />
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <CruiseOverview />,
                        // second: () => <CruiseLocation />,
                        second: () => <CruiseReviews />,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    // initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            renderLabel={props => <TabLabel {...props} title={T4(routes[index].title)} />}
                            style={styles.tabBar}
                            indicatorStyle={styles.indicator}
                        />
                    }
                />
                <View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.price1}>USD 500</Text>
                        <Text style={styles.price2}>USD 200</Text>
                        <Text style={styles.smallText}>{T2('nightly average').toProperCase()}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T2('choose room').toUpperCase()}
                            onPress={() => Actions.CruiseRoomList()}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
});

export default Cruisetail = connect(mapStateToProps, mapDispatchToProps)(CruisetailC);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabLabel: {
        fontSize: 12,
    },
    tabBar: {
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        height: 50,
        justifyContent: 'center'
    },
    indicator: {
        backgroundColor: Color.primary,
        height: 3
    },


    bottomContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    leftContainer: {
        alignItems: 'flex-end',
        width: 120,
        marginRight: 10
    },
    rightContainer: {
        flex: 1,
    },
    price1: {
        fontSize: 10,
        textDecorationLine: 'line-through',
        color: Color.text,
    },
    price2: {
        color: Color.primary,
        fontSize: 20,
        fontWeight: 'bold'
    },
    smallText: {
        color: Color.text,
        fontSize: 9
    }
})

