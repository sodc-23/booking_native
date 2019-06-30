import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import { transferImage, transfer_bag, transfer_man, noImage } from '@common/image'
import Color from '@common/color'
import GroupTitle from '@components/home/groupTitle'
import RoundButton from '@components/general/roundButton'
import ImageHeader from '@hotel_detail/imageHeader'
import ContentItem from '@components/home/transfer/contentItem'
import DetailItem from '@components/home/transfer/detailItem'
import PolicyModal from '@hotel_room/policyModal'

import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as transferAction from '@store/transfer';
import * as cartAction from '@store/cart';

import Ionicons from '@expo/vector-icons/Ionicons';
import Global from "@utils/global";
import UtilService from '@utils/utils';
const { T1, T2 } = Global.Translate

class TransferDetailC extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            title: 'Mercedes Benz C Class',
            image: transferImage,
            loadingPolicy: false,
            price: 43.6,
            passengers:5,
            bags:5,
            items: [
                {
                    title: 'Paris To Paris - Economy',
                    price: 80,
                    date: new Date(),
                }
            ],
            desc:'Minimum booking period 12 hours for these route. minimum 12  hours is allowed from the booking time till the pick-up time.',
            menus: [
                { key: 0, title: 'Overview' },
                { key: 1, title: 'Inclusions' },
                { key: 2, title: 'Exclusions' },
                { key: 3, title: 'Payment Policy' },
                { key: 4, title: 'Cancellation Policy' },
                { key: 5, title: 'Terms & Conditions' },
            ],
            transferDetails: [
                { title: 'Type:', content: 'TypeStandard' },
                { title: 'Transfer Operators:', content: 'Tour departs from the Belize City cruise ship port' },
                { title: 'Duration:', content: '8 am' },
            ],
            inAndExclusions: [
                { title: 'Inclusion:', content: 'No Inclusion Exist For The Selected Transfer' },
                { title: 'Exclusion:', content: 'No Exclusion Exist For The Selected Transfer' },
            ],
            selectedItem: {},
            policyTitle: 'Cancel Policy',
            policyDesc: '',
        }
        this.loading = true
    }

    componentWillMount() {
        let locationInfo = Global.currentTransfer.locationInfo?Global.currentTransfer.locationInfo.fromLocation:null
        this.props.navigation.setParams({
            title: 'Details',
            // description: locationInfo?`${locationInfo.city}, ${locationInfo.country}`:''
        });
        Actions.Loading({ searchType: 'transfers', title: UtilService.NormalizeTransferName(Global.currentTransfer.name) })

    }
    componentWillReceiveProps(next) {
        let {status, transfer} = next.transfers

        if(status != transferAction.LOADING && this.loading) {
            this.loading = false
            Actions.pop()
        }

        if(transfer) {
            let items = transfer.items?transfer.items:[]
            if(items.length > 0) {
                this.setState({
                    selectedItem:items[0].item[0]
                })
            }
        }
    }
    done() {

    }

    addToCart() {
        let { selectedItem } = this.state
        let {transfer} = this.props.transfers
        if(!selectedItem.id) {
            return
        }

        var data = [{
            key : transfer.id,
            value: selectedItem.id
        }]
        this.props.actions.addToCart(Global.searchToken['transfers'], data).then(({error, result})=>{
            if(error || !result) {
                console.log(error)
                return
            }
            Actions.Booking({business:'transfers'})
        })
    }

    render() {
        let { image, inAndExclusions, transferDetails, title, price, passengers, bags, desc, selectedItem } = this.state
        
        let {transfer} = this.props.transfers
        let {status} = this.props.cart
        transfer = transfer||{}
        let {items = []} = transfer
        let item = items[0]
        let showImages = []
        let isLoading = status==cartAction.LOADING
        if(transfer.images) {
            showImages = transfer.images.map(imageObj=>{
                return {
                        image:{uri:imageObj.url},
                        title:imageObj.title
                    }
            })
        }
        // let contents = []
        // if(selectedItem && selectedItem.tpExtension) {
        //     contents = selectedItem.tpExtension.map(o=>({
        //         title:UtilService.startCase(o.key),
        //         content:o.value
        //     })).filter(o=>o.content != '')
        // }
        let duration = UtilService.getFieldFromList(transfer.tpExtension, 'duration')
        let {T1, T2, T3, T4} = this.props.language
        return (
            <View style={styles.container}>
                <Image
                    source={showImages.length>0?showImages[0].image:noImage}
                    style={styles.image}
                />
                <ScrollView>
                    {item && <Text style={styles.title}>{item.item[0].name}</Text>}
                    <View style={styles.splitter} />
                    <View style={styles.rowBetween}>
                        <View>
                            {/* <View style={styles.rowContainer}>
                                <Image source={transfer_man} style={styles.icon} />
                                <Text style={styles.number}>{passengers}</Text>
                                <Text style={styles.darkBold}>Passengers</Text>
                            </View> */}
                            {/* <View style={styles.rowContainer}>
                                <Image source={transfer_bag} style={styles.icon} />
                                <Text style={styles.number}>{bags}</Text>
                                <Text style={styles.darkBold}>Bags</Text>
                            </View> */}
                        </View>
                        <View>
                            <Text style={styles.priceText}>{transfer.displayAmount}</Text>
                        </View>
                    </View>
                    <View style={styles.splitter} />
                    <Text style={styles.desc}>{transfer.description}</Text>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{T4('AVAILABILITY')}:</Text>
                        {/* <Text style={styles.middleText}>Change Dates</Text> */}
                    </View>
                    {item && <DetailItem
                        selected={true}
                        title={UtilService.NormalizeTransferName(transfer.name)}
                        price={item.item[0].displayAmount}
                        date={item.item[0].dateInfo.startDate}
                        onPress={() => {
                            this.setState({
                                selectedItem:item.item[0]
                            })
                        }}
                        onPolicy={() => { 
                            var data = {
                                key: transfer.id,
                                value: item.item[0].id,
                            }
                            var policyTitle = T3('Cancellation Policy')
                            this.setState({
                                loadingPolicy:true,
                                policyTitle,
                                policyDesc:""
                            })
                            this.props.actions.getPolicy(Global.searchToken['transfers'], data).then(({ error, result }) => {
                                this.setState({
                                    loadingPolicy:false
                                })
                                if (error) {
                                    console.log(error)
                                    return
                                }
                                
                                var description = (result&&result.policies)?result.policies.map(o=>UtilService.decodeHtmlEntity(o.description)).join('\n'):''
                                this.setState({
                                    policyDesc :description||'No Policy Found'
                                })

                                this.forceUpdate()
                            })
                            this.policyModal.open()
                        }}
                    />}
                    <View style={styles.content}>
                        <Text style={styles.primaryText}>{T3('Transfer Details')}:</Text>
                        <View style={styles.contentWithSmallPadding}>
                            {<ContentItem
                                title={T3("Type")}
                                content={UtilService.capitalizeFirstLetter(transfer.category)}
                            />}
                            <ContentItem
                                title={T3("Transfer Operators")}
                                content={UtilService.getFieldFromList(transfer.tpExtension, 'operatorName')}
                            />
                            {duration != '0 Hour' && <ContentItem
                                title={T3("Duration")}
                                content={`${duration}`}
                            />}
                        </View>
                        <Text style={styles.primaryText}>{T3('Inclusion & Exclusion')}:</Text>
                        <ContentItem
                            title={T3("Inclusion")}
                            content={UtilService.getFieldFromList(transfer.tpExtension, 'inclusions')||T1('message25')}
                        />
                        <ContentItem
                            title={T3("Exclusion")}
                            content={UtilService.getFieldFromList(transfer.tpExtension, 'exclusions')||T1('message25')}
                        />
                    </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T4('ADD TO CART')}
                            disabledUI={isLoading}
                            disabled={isLoading}
                            isLoading={isLoading}
                            onPress={() => this.addToCart()}
                        />
                    </View>
                </View>
                <PolicyModal
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    description={this.state.policyDesc}
                    closeModal={()=>this.policyModal.close()}
                    isLoading={this.state.loadingPolicy}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ transfers, cart ,language }) => ({ transfers, cart, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...transferAction, ...cartAction }, dispatch)
});

export default TransferDetail = connect(mapStateToProps, mapDispatchToProps)(TransferDetailC);

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
        color: Color.darkText,
        fontWeight: 'bold',
        margin:15
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
    },
    contentWithSmallPadding: {
        padding: 5,
    },
    primaryText: {
        fontSize: 14,
        color: Color.primary,
        fontWeight: 'bold',
        marginTop: 20
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    icon:{
        width:14,
        height:14,
        resizeMode:'contain'
    },
    number:{
        color:Color.orange,
        fontWeight:'bold',
        fontSize:10,
        marginLeft:5
    },
    darkBold:{
        fontSize:10,
        color:Color.text,
        fontWeight:'bold',
        marginLeft:5
    },
    priceText:{
        marginTop:10,
        fontSize:24,
        color:Color.middlePrimary,
        fontWeight:'bold'
    },
    rowBetween:{
        flexDirection:'row',
        justifyContent:'space-between',
        margin:15
    },
    desc:{
        fontSize:12,
        color:Color.lightText,
        margin:15
    },
    splitter:{
        width:'100%',
        height:StyleSheet.hairlineWidth,
        backgroundColor:'#ccc'
    }
})