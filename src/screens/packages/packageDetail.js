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
import DetailItem from '@components/home/packages/detailItem'
import ContentItem from '@components/home/packages/contentItem'
import PolicyModal2 from '@hotel_room/policyModal2'
import AutoHeightWebView from "@components/general/autoHeightWebView";
import DateModal from '@components/general/dateModal'

import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as packagesAction from '@store/packages';
import * as cartAction from '@store/cart';

import Ionicons from '@expo/vector-icons/Ionicons';
import Global from "@utils/global";
import UtilService from '../../utils/utils';
const { T1, T2 } = Global.Translate

class PackageDetailC extends PureComponent {
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

        Actions.Loading({ searchType: 'package', title: Global.currentPackage.name })

    }
    componentWillReceiveProps(next) {
        let { status, packageData } = next.package
        if ( packageData == null ) return;
        let packageItem = packageData[0].item[0]

        if (status != packagesAction.LOADING && this.loading) {
            this.loading = false
            // let locationInfo = Global.currentPackage.locationInfo ? Global.currentPackage.locationInfo.fromLocation : null
            let {city, country} = packageItem.locationInfo.fromLocation
            this.props.navigation.setParams({
                // onRight: this.done,
                // rightTitle: 'DONE',
                goBack: () => {
                    Actions.pop()
                    if (this.props.fromHotDeal) Actions.jump('HotDeal')
                    if (this.props.fromHome) Actions.jump('Home')
                },
                title: 'Packages',
                description:city+', '+country
            });
            Actions.pop()
        }

        if (packageData && !this.state.selectedItem.id) {
            let items = packageItem.items ? packageItem.items : []
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
        let { packageData = [] } = this.props.package
        let packageItem = packageData[0] ? packageData[0].item[0] : {}

        if (!selectedItem.id) {
            return
        }

        var data = [{
            key: packageItem.id,
            value: selectedItem.id
        }]
        this.props.actions.addToCart(Global.searchToken['package'], data).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            Actions.PackageBooking({ business: 'package' })
        })
    }

    getHtmlContent(o) {
        var ret = o.items.map(item=>{
            return (
                `<div style="position:relative">
                    <p>
                        <div>${item.name}</div>
                        <div>${item.fromLocationName}${item.toLocationName==''?'':' - ' + item.toLocationName}</div>
                    </p>
                    <img src="${item.image}" style="width:100%;"/>
                </div>`
            )
        }).join('<br/>')
        return ret
    }

    changeDate(){
        this.refs.dateModal.show()
    }

    render() {
        let { image, title, selectedItem, selectedIndex } = this.state
        let { packageData = [] } = this.props.package
        let packageItem = packageData[0] ? packageData[0].item[0] : {}

        let { status } = this.props.cart
        packageItem = packageItem || {}
        let items = packageItem.items ? packageItem.items : []
        let showImages = []
        let isLoading = status == packagesAction.Loading
        if (packageItem.images) {
            showImages = packageItem.images.map(imageObj => {
                return {
                    image: { uri: imageObj.url },
                    title: imageObj.title
                }
            })
        }

        //packageItem.policies[*].description
        let policyText = ""
        if(packageItem.policies) {
            policyText = packageItem.policies.map(o=>"<li>" + o.description + "</li>").join("<br/>")
        }

        let detailData = UtilService.getFieldFromList2(packageItem.tpExtension, 'key', 'value', 'itenaryInclusionDetails')
        
        if(detailData && detailData.length > 0) {
            detailData = JSON.parse(detailData)

            if(detailData && detailData.itinerary) {
                detailData = detailData.itinerary.data.map((o)=>{
                    return (
                        `<div>
                            <div style="background:darkblue;color:white;width:60px;height:24px;font-size:16px;line-height:24px;text-align:center;">${o.itineraryDay}</div>
                            ${this.getHtmlContent(o)}
                        </div>`
                    )
                })
            }
        }

        let menus = [
            { key: 0, title: 'Overview', value: packageItem.description || 'No Information Avaialble' },
            { key: 1, title: 'Inclusions', value: UtilService.getFieldFromList2(packageItem.tpExtension, 'key', 'value', 'inclusions') || 'No Information Avaialble' },
            { key: 2, title: 'Exclusions', value: UtilService.getFieldFromList2(packageItem.tpExtension, 'key', 'value', 'exclusions') || 'No Information Avaialble' },
            { key: 3, title: 'Payment Policy', value: policyText },
            // { key: 4, title: 'Cancellation Policy', value: 'No Information Avaialble' },
            { key: 5, title: 'Terms and Conditions', value: UtilService.getFieldFromList2(packageItem.tpExtension, 'key', 'value', 'rulesAndRegulations') || 'No Information Avaialble' },
            { key: 6, title: 'Detailed Day Wise Itinerary', value: UtilService.getFieldFromList2(packageItem.tpExtension, 'key', 'value', 'itenaryDetails') || 'No Information Avaialble' },
            { key: 7, title: 'Hotels & Transport', value: detailData || 'No Information Avaialble' },
        ]

        let subTpExtension = []

        if(packageItem.items) {
            subTpExtension = packageItem.items[0].item[0].tpExtension
        }

        let contents = [
            {
                title: 'DURATION',
                content: UtilService.getFieldFromList2(packageItem.tpExtension, 'key', 'value', 'duration') || 'No Information Avaialble'
            },
            {
                title: 'MEETING POINT',
                content: UtilService.getFieldFromList2(packageItem.tpExtension, 'key', 'value', 'departurePoint') || 'No Information Avaialble'
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
            // {
            //     title:'LEVEL:',
            //     content:'No Information Avaialble'
            // },
            {
                title: 'AVAILABLE ON',
                content: UtilService.getFieldFromList2(subTpExtension, 'key', 'value', 'operationalDays') || 'No Information Avaialble'
            },
        ]
        // if (selectedItem.tpExtension) {
        //     contents = selectedItem.tpExtension.map(o => ({
        //         title: UtilService.startCase(o.key),
        //         content: o.value
        //     })).filter(o => o.content != '')
        // }
        let {T1, T2, T3, T4} = this.props.language
        return (
            <View style={styles.container}>
                <ImageHeader
                    images={showImages}
                    minPrice={Global.currentPackage.displayAmount}
                    isAmountPerNight={Global.currentPackage.flags.isAmountPerNight}
                    hotelName={Global.currentPackage.name}
                    rating={null}
                />
                <ScrollView>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{T2('availability').toUpperCase()}:</Text>
                        <Text onPress={()=>this.changeDate()} style={styles.middleText}>{T2('change dates').toProperCase()}</Text>
                    </View>
                    {items.map((itemGroup) => {
                        return itemGroup.item.map((subItem, index) => <DetailItem
                            key={index}
                            language={this.props.language}
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
                                    key: packageItem.id,
                                    value: itemGroup.item[0].id,
                                }
                                var policyTitle = T2('terms & conditions').toProperCase()
                                this.setState({
                                    loadingPolicy: true,
                                    policyTitle,
                                    policyDesc: "",
                                    policies: []
                                })
                                this.props.actions.getPolicy(Global.searchToken['package'], data).then(({ error, result }) => {
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
                            title={T4(item.title)+':'}
                            key={index}
                        />)}
                    </View>
                    {selectedItem.id && menus.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity key={index}
                                onPress={() => this.setState({ selectedIndex: this.state.selectedIndex == index ? -1 : index })}
                                style={styles.menuContainer}>
                                <Text style={styles.menuText}>{T3(item.title)}</Text>
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
                            {selectedItem.flags.isAmountPerNight && <Text style={styles.smallText}>{T2('nightly average').toProperCase()}</Text>}
                        </View>}
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T2('add to cart').toUpperCase()}
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
                    onSave={(dateFrom, dateTo)=>{}}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ packages, cart, language }) => ({ package: packages, cart, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...packagesAction, ...cartAction }, dispatch)
});

export default PackageDetail = connect(mapStateToProps, mapDispatchToProps)(PackageDetailC);

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