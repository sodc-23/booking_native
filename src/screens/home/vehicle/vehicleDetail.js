import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    FlatList,
    Switch,
    Dimensions
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import { activityImage, transfer_bag, transfer_man, noImage,doors_icon, transmission_icon, ac_icon } from '@common/image'
import Color from '@common/color'
import GroupTitle from '@components/home/groupTitle'
import RoundButton from '@components/general/roundButton'
import ImageHeader from '@hotel_detail/imageHeader'
import ModalSelector from '@react-native-modal-selector'
import PolicyModal2 from '@hotel_room/policyModal2'

import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vehicleAction from '@store/vehicle';
import * as cartAction from '@store/cart';

import Ionicons from '@expo/vector-icons/Ionicons';
import Global from "@utils/global";
import UtilService from '@utils/utils';
const { T1, T2 } = Global.Translate
const {width:screenWidth} = Dimensions.get("window")

const InfoItem=({title, address, date, time})=>(
    <View style={{flex:1}}>
        <Text style={styles.tinyOrange}>{title}:</Text>
        <Text style={styles.tinyText}>{address}</Text>
        <Text style={styles.tinyText}>{date}</Text>
        <Text style={styles.tinyText}>{time}</Text>
    </View>
)

const ConditionItem=({checked, title})=>(
    <View style={styles.condition}>
        <Ionicons name={checked?"ios-checkmark":"ios-close"} size={20} color={Color.orange}/>
        <Text numberOfLines={1} style={[styles.tinyText,{marginLeft:5, marginTop:0}]}>{title}</Text>
    </View>
)

class CarDetail extends PureComponent {
    constructor(props) {
        super(props)

        /*
        {checked:true, title:"Free Cancellation"},
        {checked:true, title:"Free Amendement"},
        {checked:true, title:"Diesel"},
        {checked:true, title:"Fuel: Pickup Full - Return Full"},
        */
        var conditions = []
        var vehicle = Global.currentVehicle
        if (vehicle.flags.freeCancellation) {
            conditions.push({checked:true, title:"Free Cancellation"})
        }
        if (vehicle.flags.freeAmendment) {
            conditions.push({checked:true, title:"Free Amendement"})
        }
        if (vehicle.flags.unlimitedMileage) {
            conditions.push({checked:true, title:"Unlimited mileage"})
        }
        if (vehicle.tpExtension.find(o=>o.key=='fuelType')) {
            conditions.push({checked:true, title:"Diesel Vehicle"})
        }

        items = JSON.parse(JSON.stringify(Global.currentVehicle.items[0].item))
        items.map(o=>{
            o.maxQuantity = o.quantity
            o.quantity = 1
        })
        this.state = {
            title: 'Mercedes Benz C Class',
            image: activityImage,
            price: 43.6,
            passengers: 5,
            bags: 5,
            switches: [
                { title: 'Navigation System', value: true },
                { title: 'Ski Rack', value: true },
                { title: 'Infant Seat', value: true },
                { title: 'Tossler Seat', value: true },
            ],
            desc: 'Minimum booking period 12 hours for these route. minimum 12  hours is allowed from the booking time till the pick-up time.',
            menus: [
                { key: 0, title: 'Overview' },
                { key: 1, title: 'Inclusions' },
                { key: 2, title: 'Exclusions' },
                { key: 3, title: 'Payment Policy' },
                { key: 4, title: 'Cancellation Policy' },
                { key: 5, title: 'Terms & Conditions' },
            ],
            carDetails: [
                { title: 'Type:', content: 'TypeStandard' },
                { title: 'Transfer Operators:', content: 'Tour departs from the Belize City cruise ship port' },
                { title: 'Duration:', content: '8 am' },
            ],
            inAndExclusions: [
                { title: 'Inclusion:', content: 'No Inclusion Exist For The Selected Transfer' },
                { title: 'Exclusion:', content: 'No Exclusion Exist For The Selected Transfer' },
            ],
            counts:[
                {key:0, selection:true, label:'0'}, 
                {key:1, selection:true, label:'1'}, 
                {key:2, selection:true, label:'2'}, 
                {key:3, selection:true, label:'3'},
                {key:4, selection:true, label:'4'},
                {key:5, selection:true, label:'5'},
                {key:6, selection:true, label:'6'},
                {key:7, selection:true, label:'7'},
                {key:8, selection:true, label:'8'},
                {key:9, selection:true, label:'9'},
                {key:10, selection:true, label:'10'},
            ],
            conditions:conditions,
            selectedItem: {},
            items: items
        }
        this.loading = true
    }

    componentWillMount() {
        // let locationInfo = Global.currentActivity.locationInfo?Global.currentActivity.locationInfo.fromLocation:null
        this.props.navigation.setParams({
            title: "Details",
        });
    }
    done() {

    }

    addToCart() {
        let { items } = this.state
        var data = [{
            key : Global.currentVehicle.token,
        }]

        items.map(item=>{
            data.push({
                "Key": Global.currentVehicle.token,
                "Value": item.id,
                "KeyName": null,
                "ValueName": null,
                "Quantity":item.enabled?item.quantity:0,
            })
        })
        
        this.props.actions.addToCart(Global.searchToken['vehicle'], data).then(({error, result})=>{
            //console.log("result", error, result)
            if(error) {
                //console.log(error)
                return
            }

            Actions.Booking({ business: 'vehicle' })
        })
    }

    changed(index) {
        let { items } = this.state
        items[index].quantity = (items[index].quantity == 0?Global.currentVehicle.items[0].item[index].quantity:0)
        //console.log('items', items[index])
        this.setState({ items })
        this.forceUpdate()
    }
    getCounts(maxVal) {
        var ret = []
        for (var i = 1 ; i < maxVal + 1 ; i++) {
            ret.push({
                key:i, selection:true, label:String(i)
            })
        }
        
        return ret
    }

    onPressRentalCondition() {
        let vehicle = Global.currentVehicle
        let {T3} = this.props.language
        var policyTitle = T3('Rate Details')
        this.setState({
            loadingPolicy: true,
            policyTitle,
            policyDesc: "",
            policies: []
        })
        this.props.actions.getFareRules(vehicle.token, Global.searchToken['vehicle']).then(({ error, result }) => {
            this.setState({
                loadingPolicy: false
            })
            if (error) {
                console.log(error)
                return
            }

            var policies = result.map(o=>{
                return {
                    type:o.name,
                    description:o.item.map(o=>o.value).join('<br/>')
                }
            })
            this.setState({
                policies: policies.length > 0 ? policies : []
            })
        })
        this.policyModal.open()
    }

    onPressPolicy() {
        let vehicle = Global.currentVehicle
        var data = {
            key: vehicle.token,
        }
        let {T3} = this.props.language
        var policyTitle = T3('Terms & Conditions')
        this.setState({
            loadingPolicy: true,
            policyTitle,
            policyDesc: "",
            policies: []
        })
        this.props.actions.getPolicy(Global.searchToken['vehicle'], data).then(({ error, result }) => {
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
        })
        this.policyModal.open()
    }

    render() {
        let { image, items, inAndExclusions, carDetails, title, price, passengers, bags, switches } = this.state
        let vehicle = Global.currentVehicle
        let {url, name, category, locationInfo, tpExtension, amount, displayAmount, 
            strikeThroughAmount, dateInfo, description, flags, features} = vehicle
        let passengerQuantity = UtilService.getFieldFromList(tpExtension, 'passengerQuantity')
        let baggageQuantity = UtilService.getFieldFromList(tpExtension, 'baggageQuantity')
        let doors = UtilService.getFieldFromList(tpExtension, 'doorCount')
        let transmission = UtilService.getFieldFromList(tpExtension, 'transmissionType')
        let ac = flags.isAirConditionAvailable?'Yes':'No'

        let {T1, T2, T3, T4 } = this.props.language
        return (
            <View style={styles.container}>
                <Image
                    source={url?{uri:url}:noImage}
                    style={styles.image}
                />
                <ScrollView>
                    <Text style={styles.title}>{name}</Text>
                    <View style={styles.splitter} />
                    <View style={styles.rowBetween}>
                        <View>
                            <View style={styles.rowContainer}>
                                <Image source={transfer_man} style={styles.icon} />
                                <Text style={styles.number}>{passengerQuantity}</Text>
                                <Text style={styles.darkBold}>{T3('Passengers')}</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Image source={transfer_bag} style={styles.icon} />
                                <Text style={styles.number}>{baggageQuantity}</Text>
                                <Text style={styles.darkBold}>{T3('Bags')}</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Image source={doors_icon} style={styles.icon_small}/>
                                <Text style={styles.number}>{doors}</Text>
                                <Text style={styles.darkBold}>{T3('Doors')}</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Image source={ac_icon} style={styles.icon_small}/>
                                <Text style={styles.number}>{ac}</Text>
                                <Text style={styles.darkBold}>AC</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Image source={transmission_icon} style={styles.icon_small}/>
                                <Text style={styles.number}>{transmission}</Text>
                                <Text style={styles.darkBold}>{T3('Transmission')}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.priceText}><Text style={{ fontSize: 28 }}>{displayAmount}</Text></Text>
                        </View>
                    </View>
                    <View style={styles.splitter} />
                    <View style={[styles.row,{paddingHorizontal:15, paddingVertical:10}]}>
                        <InfoItem 
                            title={T3("From")}
                            address={locationInfo.fromLocation.name}
                            date={moment(dateInfo.startDate).format('ddd DD MMM YYYY')}
                            time={moment(dateInfo.startDate).format('HH:mm')}
                        />
                        <InfoItem 
                            title={T3("To")}
                            address={locationInfo.toLocation.name}
                            date={moment(dateInfo.endDate).format('ddd DD MMM YYYY')}
                            time={moment(dateInfo.endDate).format('HH:mm')}
                        />
                    </View>
                    <View style={styles.splitter} />
                    <View style={{padding:15}}>
                        <FlatList
                            data={this.state.conditions}
                            keyExtractor={(item, index)=>index.toString()}
                            numColumns={2}
                            renderItem={({item})=><ConditionItem {...item}/>}
                        />
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.rentalCondition} onPress={this.onPressRentalCondition.bind(this)}>
                                <Ionicons name="ios-information-circle-outline" size={14} color={Color.primary}/>
                                <Text style={[styles.tinyOrange,{marginLeft:5}]}>{T3('Rental Conditions')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rentalCondition} onPress={this.onPressPolicy.bind(this)}>
                                <Ionicons name="ios-information-circle-outline" size={14} color={Color.primary}/>
                                <Text style={[styles.tinyOrange,{marginLeft:5}]}>{T3('Terms & Conditions')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.splitter} />
                    <View style={styles.padding}>
                        {items.map((item, index) => (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={[styles.text,item.enabled?{color:Color.orange}:{}]}>{item.name}</Text>
                                <ModalSelector
                                    data={this.getCounts(item.maxQuantity)}
                                    onChange={(option)=>{
                                        item.quantity=option.key
                                        this.setState({items:[...this.state.items]})
                                    }}
                                >
                                    <View style={styles.row}>
                                        <Text style={styles.quantity}>{item.quantity}</Text>
                                        <Ionicons name="ios-arrow-down" size={16} color={Color.lightText}/>
                                    </View>
                                </ModalSelector>
                                <Text style={[styles.price,item.enabled?{color:Color.orange}:{}]}>{item.displayAmount.split(' ')[0]} {item.amount * item.quantity}</Text>
                                <Switch
                                    trackColor={{ true: Color.orange, false: Color.lightBack }}
                                    value={item.enabled}
                                    onValueChange={() => {
                                        item.enabled = !item.enabled
                                        this.setState({items:[...this.state.items]})
                                    }}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <RoundButton
                        title={T4('ADD TO CART')}
                        onPress={() => this.addToCart()}
                    />
                </View>
                <PolicyModal2
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    policies={this.state.policies || []}
                    closeModal={() => this.policyModal.close()}
                    isLoading={this.state.loadingPolicy}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ vehicle, cart, language }) => ({ vehicle, cart, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...vehicleAction, ...cartAction }, dispatch)
});

export default CarDetail = connect(mapStateToProps, mapDispatchToProps)(CarDetail);

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
    padding:{
        paddingHorizontal:10
    },
    title: {
        fontSize: 16,
        color: Color.darkText,
        fontWeight: 'bold',
        margin: 15
    },
    bottomContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
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
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain'
    },
    icon_small:{
        width:12,
        height:12,
        resizeMode:'contain',
        marginHorizontal:1,
        marginVertical:1,
    },
    number: {
        color: Color.orange,
        fontWeight: 'bold',
        fontSize: 10,
        marginLeft: 5
    },
    darkBold: {
        fontSize: 10,
        color: Color.text,
        fontWeight: 'bold',
        marginLeft: 5
    },
    priceText: {
        marginTop: 10,
        fontSize: 24,
        color: Color.middlePrimary,
        fontWeight: 'bold'
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15
    },
    desc: {
        fontSize: 12,
        color: Color.lightText,
        margin: 15
    },
    splitter: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#ccc'
    },
    itemContainer: {
        flexDirection: 'row',
        paddingLeft: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: Color.border,
        height: 50,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        color: Color.lightText,
        width:150,
    },
    price:{
        fontSize:12,
        color:Color.text
    },
    quantity:{
        fontSize:12,
        color:Color.text,
        marginRight:5
    },
    row:{
        flexDirection:'row',
    },
    tinyText:{
        fontSize:10, 
        color:Color.text,
        marginTop:3
    },
    tinyOrange:{
        fontSize:10, 
        color:Color.orange
    },
    condition:{
        width:screenWidth/2-15,
        flexDirection:'row',
        alignItems:'center',
    },
    rentalCondition:{
        flex:1,
        marginTop:5,
        flexDirection:'row',
        alignItems:'center'
    },
})