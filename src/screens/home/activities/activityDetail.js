import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    WebView,
    ScrollView,
    Platform,
    Image
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import { activityImage } from '@common/image'
import Color from '@common/color'
import GroupTitle from '@components/home/groupTitle'
import RoundButton from '@components/general/roundButton'
import ImageHeader from '@hotel_detail/imageHeader'
import DetailItem from '@components/home/activity/detailItem'
import ContentItem from '@components/home/activity/contentItem'
import PolicyModal2 from '@hotel_room/policyModal2'
import AutoHeightWebView from "@components/general/autoHeightWebView";
import DateModal from '@components/general/dateModal'

import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as activityAction from '@store/activity';
import * as cartAction from '@store/cart';

import Ionicons from '@expo/vector-icons/Ionicons';
import Global from "@utils/global";
import UtilService from '../../../utils/utils';
const { T1, T2 } = Global.Translate

class ActivityDetailC extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            title: 'Green Island Half Day',
            image: activityImage,
            items: [
                {
                    title: '4 Start Umrah Packages 5D/4N_10/30/2017',
                    price: 1203,
                    date: new Date(),
                },
                {
                    title: '4 Start Umrah Packages 5D/4N_10/30/2017',
                    price: 1203,
                    date: new Date(),
                }
            ],
            // menus: [
            //     { key: 0, title: 'Overview' },
            //     { key: 1, title: 'Inclusions' },
            //     { key: 2, title: 'Exclusions' },
            //     { key: 3, title: 'Payment Policy' },
            //     { key: 4, title: 'Cancellation Policy' },
            //     { key: 5, title: 'Terms & Conditions' },
            // ],
            contents: [
                { title: 'DURATION:', content: '4 hours' },
                { title: 'MEETING POINT:', content: 'Tour departs from the Belize City cruise ship port' },
                { title: 'MEETING TIME:', content: '8 am' },
                { title: 'HIGHLIGHTS:', content: 'All enterence fees included Comprehensive tour of the city Family friendly Free port pickup and drop-off included Led by a local guide Choice of serveral departures throughout the day' }
            ],
            selectedItem: {},
            selectedIndex: -1,
            policyTitle: 'Cancel Policy',
            policyDesc: '',
            policies: [],
            loadingPolicy: true
        }
        this.loading = true
    }

    componentWillMount() {

        Actions.Loading({ searchType: 'activity', title: Global.currentActivity.name })

    }
    componentWillReceiveProps(next) {
        let { status, activity = [] } = next.activity
        let activityItem = activity[0] ? activity[0].item[0] : {}

        if (status != activityAction.LOADING && this.loading && activityItem.locationInfo) {
            this.loading = false
            Actions.pop()
            // let locationInfo = Global.currentActivity.locationInfo ? Global.currentActivity.locationInfo.fromLocation : null
            let {city, country} = activityItem.locationInfo.fromLocation
            this.props.navigation.setParams({
                // onRight: this.done,
                // rightTitle: 'DONE',
                goBack: () => {
                    Actions.pop()
                    if (this.props.fromHotDeal) Actions.jump('HotDeal')
                },
                title: 'Activities',
                description:city+', '+country
            });
        }

        if (activity && !this.state.selectedItem.id) {
            let items = activityItem.items ? activityItem.items : []
            if (items.length > 0) {
                this.setState({
                    selectedItem: items[0].item[0]
                })
            }
        }
    }
    done() {

    }

    addToCart() {
        let { selectedItem } = this.state
        let { activity = [] } = this.props.activity
        let activityItem = activity[0] ? activity[0].item[0] : {}

        if (!selectedItem.id) {
            return
        }

        var data = [{
            key: activityItem.id,
            value: selectedItem.id
        }]
        this.props.actions.addToCart(Global.searchToken['activity'], data).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            Actions.Booking({ business: 'activity' })
        })
    }

    changeDate(startDate, endDate){
        console.log(this.props.activity.activity)
        let {activity} = this.props.activity
        if ( activity == null || activity.length==0) return;
        activity[0].item[0].dateInfo={
            endDate,
            startDate
        }
        // this.props.actions.getActivityDetail2(activity[0].item[0])
    }

    render() {
        let { image, title, selectedItem, selectedIndex } = this.state
        let { activity = [] } = this.props.activity
        let activityItem = activity[0] ? activity[0].item[0] : {}

        let { status } = this.props.cart
        activityItem = activityItem || {}
        let items = activityItem.items ? activityItem.items : []
        let showImages = []
        let isLoading = status == activityAction.Loading
        if (activityItem.images) {
            showImages = activityItem.images.map(imageObj => {
                return {
                    image: { uri: imageObj.url },
                    title: imageObj.title
                }
            })
        }
        let {T1, T2, T3, T4} = this.props.language

        let menus = [
            { key: 0, title: T3('Overview'), value: activity.description || T2('No Information Available') },
            { key: 1, title: T3('Inclusions'), value: UtilService.getFieldFromList2(activityItem.tpExtension, 'key', 'value', 'inclusions') || 'No Information Avaialble' },
            { key: 2, title: T3('Exclusions'), value: UtilService.getFieldFromList2(activityItem.tpExtension, 'key', 'value', 'exclusions') || 'No Information Avaialble' },
            { key: 3, title: T3('Payment Policy'), value: T2('No Information Available') },
            // { key: 4, title: 'Cancellation Policy', value: 'No Information Avaialble' },
            { key: 5, title: T3('Terms and Conditions'), value: UtilService.getFieldFromList2(activityItem.tpExtension, 'key', 'value', 'rulesAndRegulations') || 'No Information Avaialble' },
        ]

        let contents = [
            {
                title: T4('DURATION')+':',
                content: UtilService.getFieldFromList2(activityItem.tpExtension, 'key', 'value', 'duration') || 'No Information Avaialble'
            },
            {
                title: T4('MEETING POINT')+':',
                content: UtilService.getFieldFromList2(activityItem.tpExtension, 'key', 'value', 'departurePoint') || 'No Information Avaialble'
            },
            // {
            //     title:'MEETING TIME:',
            //     content:'No Information Avaialble'
            // },
            // {
            //     title:'HIGHLIGHTS:',
            //     content:'No Information Avaialble'
            // },
            // {
            //     title:'PRICE INCLUDES:',
            //     content:'No Information Avaialble'
            // },
            // {
            //     title:'PRICE EXCLUSIONS:',
            //     content:'No Information Avaialble'
            // },
            {
                title: T4('LEVEL')+':',
                content: 'No Information Available'
            },
            {
                title: T4('AVAILABLE ON')+':',
                content: UtilService.getFieldFromList2(activityItem.tpExtension, 'key', 'value', 'operationalDays') || 'No Information Available'
            },
        ]
        // if (selectedItem.tpExtension) {
        //     contents = selectedItem.tpExtension.map(o => ({
        //         title: UtilService.startCase(o.key),
        //         content: o.value
        //     })).filter(o => o.content != '')
        // }

        

        return (
            <View style={styles.container}>
                <ImageHeader
                    images={showImages}
                    minPrice={Global.currentActivity.displayAmount}
                    isAmountPerNight={Global.currentActivity.flags.isAmountPerNight}
                    hotelName={Global.currentActivity.name}
                    rating={null}
                />
                <ScrollView>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{T4("AVAILABILITY")}:</Text>
                        <Text onPress={()=>this.refs.dateModal.show()} style={styles.middleText}>{T3('Change Dates')}</Text>
                    </View>
                    {items.map((itemGroup) => {
                        return itemGroup.item.map((subItem, index) => <DetailItem
                            key={index}
                            selected={selectedItem.id == subItem.id}
                            title={subItem.name}
                            price={subItem.displayAmount}
                            date={moment(subItem.dateInfo.startDate).format('MM/DD/YYYY')}
                            onPress={() => {
                                this.setState({
                                    selectedItem: subItem
                                })
                            }}
                            onPolicy={() => {
                                var data = {
                                    key: activityItem.id,
                                    value: itemGroup.item[0].id,
                                }
                                var policyTitle = T3('Terms & Conditions')
                                this.setState({
                                    loadingPolicy: true,
                                    policyTitle,
                                    policyDesc: "",
                                    policies: []
                                })
                                this.props.actions.getPolicy(Global.searchToken['activity'], data).then(({ error, result }) => {
                                    this.setState({
                                        loadingPolicy: false
                                    })
                                    if (error) {
                                        console.log(error)
                                        return
                                    }

                                    var policies = (result && result.policies) ? result.policies : []
                                    this.setState({
                                        policies: policies.length > 0 ? policies : []
                                    })

                                    this.forceUpdate()
                                })
                                this.policyModal.open()
                            }}
                        />)
                    })}
                    <View style={styles.content}>
                        {contents.map((item, index) => <ContentItem
                            {...item}
                            key={index}
                        />)}
                    </View>
                    {selectedItem.id && menus.map((item, index) => (
                        <View>
                            <TouchableOpacity key={index}
                                onPress={() => this.setState({ selectedIndex: this.state.selectedIndex == index ? -1 : index })}
                                style={styles.menuContainer}>
                                <Text style={styles.menuText}>{item.title}</Text>
                                <Ionicons name="ios-arrow-forward" size={24} color={Color.darkText} />
                            </TouchableOpacity>
                            {/* <WebView
                                style={{ height:300 }}
                                source={{ html:item.value }}
                                scalesPageToFit={Platform.OS === 'android'}
                            /> */}
                            {selectedIndex == index &&
                                <View style={styles.infoContainer2}><AutoHeightWebView
                                    style={styles.lightBack}
                                    scalesPageToFit={Platform.OS === 'android'}
                                    source={{ html: item.value || ' ' }}
                                /></View>}
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        {selectedItem.id && <View>
                            {selectedItem.strikeThroughAmount > 0 && <Text style={styles.price1}>{selectedItem.displayOriginalAmount}</Text>}
                            <Text style={styles.price2}>{selectedItem.displayAmount}</Text>
                            {selectedItem.flags.isAmountPerNight && <Text style={styles.smallText}>{T3('Nightly Average')}</Text>}
                        </View>}
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T4('ADD TO CART')}
                            disabledUI={(selectedItem.id ? false : true)}
                            disabled={isLoading || (selectedItem.id ? false : true)}
                            onPress={() => this.addToCart()}
                        />
                    </View>
                </View>
                <PolicyModal2
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    policies={this.state.policies || []}
                    closeModal={() => this.policyModal.close()}
                    isLoading={this.state.loadingPolicy}
                />
                <DateModal
                    ref="dateModal"
                    onSave={(dateFrom, dateTo)=>this.changeDate(dateFrom, dateTo)}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ activity, cart, language }) => ({ activity, cart, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...activityAction, ...cartAction }, dispatch)
});

export default ActivityDetail = connect(mapStateToProps, mapDispatchToProps)(ActivityDetailC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        height: 180,
        width: '100%',
        resizeMode: 'cover'
    },
    titleContainer: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    title: {
        fontSize: 16,
        color: Color.text,
        fontWeight: 'bold'
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
    },
    headerTitle: {
        fontSize: 18,
        color: Color.primary,
        fontWeight: 'bold',
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        marginTop: 15,
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    middleText: {
        fontSize: 12,
        color: Color.text,
        textDecorationLine: 'underline'
    },
    menuContainer: {
        borderTopColor: '#ccc',
        borderTopWidth: StyleSheet.hairlineWidth,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    menuText: {
        fontSize: 16,
        color: 'black'
    },
    content: {
        padding: 15,
        backgroundColor: Color.lightBack
    },
    info: {
        fontSize: 12,
        color: 'black'
    },
    infoContainer: {
        padding: 15,
        backgroundColor: Color.lightBack,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc'
    },
    infoContainer2: {
        paddingBottom: 15,
        paddingHorizontal: 15
    },
    lightBack: {
        backgroundColor: Color.lightBack
    }
})