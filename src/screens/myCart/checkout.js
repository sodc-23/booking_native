import React, {PureComponent} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Text
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import GroupTitle from '@components/home/groupTitle'
import RoundButton from '@components/general/roundButton'
import Promocode from '@components/cart/promocode'
import Ionicons from '@expo/vector-icons/Ionicons';
import {bank, internet_bank, card, sadad} from '@common/image'
import Color from '@common/color'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';
import PolicyModal from '@hotel_room/policyModal'

const {T1, T2} = Global.Translate

const PaymentItem=({icon, title, isChecked, detail, onPress, onDetail})=>(
    <TouchableOpacity onPress={onPress} style={styles.paymentItemContainer}>
        <View style={[styles.radioContainer,!isChecked?styles.circle:{}]}>
            {isChecked&&<Ionicons name="ios-checkmark-circle" size={30} color={Color.orange}/>}
        </View>
        <Image source={icon} style={styles.icon}/>
        <View style={styles.content}>
            <Text style={styles.itemTitle}>{title}</Text>
            {isChecked&&
                detail.map((detailItem, index)=>(
                    <View style={styles.detailListContainer} key={index}>
                        <Text style={[styles.detailTitle, detailItem.purpose=="10"?{color:Color.orange}:{}]}>{UtilService.getChargeType(detailItem.purpose)}</Text>
                        <Text style={[styles.detailValue, detailItem.purpose=="10"?{color:Color.orange}:{}]}>: {`${Global.environment.portalCurrency.isoCode} ${detailItem.amount}`}</Text>
                    </View>
                ))
            }
        </View>
        <TouchableOpacity onPress={onDetail} style={styles.forwardContainer}>
            <Ionicons name="ios-arrow-forward" size={24} color={Color.lightText}/>
        </TouchableOpacity>
    </TouchableOpacity>
)

const Card=({title, desc, spacer, style, onPress})=>(
    <TouchableOpacity onPress={onPress} style={[styles.cardContainer, style&&style.container]}>
        <Text style={[styles.cardTitle, style&&style.text]}>{title}</Text>
        {spacer&&<View style={styles.spacer}/>}
        <Text style={styles.cardDesc}>{desc}</Text>
    </TouchableOpacity>
)

const Terms1=({onPress, onLink, value})=>(
    <View style={styles.termConainer}>
        <TouchableOpacity onPress={onPress} style={styles.checkBox}>
            {value&&<Ionicons name="md-checkmark" size={24} color={Color.orange}/>}    
        </TouchableOpacity>
        <View style={{flex:1}}>
            <Text style={styles.term1Title}>
                Yes Secure my trip with insurance
            </Text>
            <Text style={styles.term1Text}>
                I agree to the 
                <Text onPress={onLink} style={styles.term1Link}> terms & Conditions </Text>
                 & confirm all passengers are between 2 to 70 years of age
            </Text>
        </View>
    </View>
)

const Terms2=({onPress, onLink, value, language:{T1, T2}})=>(
    <View style={styles.termConainer}>
        <TouchableOpacity onPress={onPress} style={styles.checkBox}>
            {value&&<Ionicons name="md-checkmark" size={24} color={Color.orange}/>}
        </TouchableOpacity>
        <Text style={styles.term2Text}>
            {T1('message42')}
            <Text onPress={onLink} style={styles.term2Link}>{T2('terms and conditions').toProperCase()}</Text>
            {T1('message43')}
        </Text>
    </View>
)

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    subContainer:{
        paddingHorizontal:15,
    },
    buttonText:{
        fontWeight:'bold',
        fontSize:14
    },
    paymentItemContainer:{
        flexDirection:'row',
        paddingTop:10,
        paddingBottom:5,
        borderBottomColor:Color.lightText,
        borderBottomWidth:0.5,
    },
    radioContainer:{
        width:30,
        height:30,
        marginLeft:6,
    },
    circle:{
        borderWidth:0.5,
        borderColor:Color.lightText,
        borderRadius:12,
        marginHorizontal:6,
        width:24,
        height:24,
        marginVertical:4
    },
    icon:{
        marginLeft:10,
        width:30,
        height:30,
        resizeMode:'contain',
        marginTop:2,
    },
    content:{
        marginLeft:10,
        flex:1
    },
    itemTitle:{
        fontSize:15,
        color:Color.primary,
        marginTop:10
    },
    forwardContainer:{
        marginLeft:10,
        marginTop:5,
        paddingHorizontal:10
    },
    cardListContainer:{
        flexDirection:'row',
        height:100,
        marginBottom:15
    },
    cardContainer:{
        flex:1,
        borderRadius:4,
        borderWidth:1,
        borderColor:Color.lightText,
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        padding:5
    },
    cardTitle:{
        color:Color.darkText,
        fontSize:12,
        textAlign:'center'
    },
    cardDesc:{
        color:Color.lightText,
        fontSize:12,
        textAlign:'center'
    },
    spacer:{
        width:'100%',
        height:1,
        backgroundColor:Color.lightText,
        marginVertical:10
    },
    termConainer:{
        flexDirection:'row',
        marginVertical:10
    },
    checkBox:{
        width:24,
        height:24,
        borderRadius:3,
        borderColor:Color.lightText,
        borderWidth:StyleSheet.hairlineWidth,
        alignItems:'center',
        justifyContent:'center',
        marginRight:10
    },
    term1Title:{
        marginTop:5,
        fontSize:16,
        color:Color.darkText,
        fontWeight:'bold'
    },
    term1Text:{
        fontSize:15,
        color:Color.lightText,
        flex:1,
        marginTop:5,
    },
    term2Text:{
        fontSize:16,
        color:Color.text,
        flex:1
    },
    term1Link:{
        color:Color.orange
    },
    term2Link:{
        fontWeight:'bold',
        textDecorationLine:'underline'
    },
    detailListContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:8
    },
    detailTitle:{
        fontSize:10,
        fontWeight:'bold',
        color:Color.lightText,
        flex:1
    },
    detailValue:{
        width:60,
        fontSize:10,
        color:Color.lightText,
        textAlign:'right'
    }
})

const paymentGatewayIcons = {
    "payfort":bank,
    "payfortsadad":sadad,
    "payfortmada":internet_bank,
    "mastercardcheckout":card,
    "dummy":internet_bank,
}

class CheckOutC extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            items:[],
            agree1: false,
            agree2: false,
        }
        this.props.actions.viewCart()
        this.termsAndConditions = UtilService.getFieldFromList2(Global.environment.cobrandDetails, 'shortDesc', 'value', 'SIGNUPTERMS')
        console.log('termsAndConditions', Global.environment.cobrandDetails, this.termsAndConditions)

    }
    componentWillMount() {
        this.props.navigation.setParams({
            goBack: this.goBack.bind(this)
        });
    }
    
    componentWillReceiveProps(props) {
        let {result, status} = props.cart
        result = result||{}
        let paymentCharges = result.paymentGatewayCharges

        if(paymentCharges) {
            var keys = Object.keys(paymentCharges)
            var items = keys.map((key, index)=>{
                var val = paymentCharges[key]
                return {
                    title: Global.getPaymentGatewayName(key),
                    icon: paymentGatewayIcons[key]||internet_bank,
                    isChecked: false,
                    detail: val,
                    gatewayId: key
                }
            })

            this.setState({items})
        }
    }

    done(){
        Actions.pop()
        Actions.pop()
    }
    goBack(){
        Actions.pop()
        Actions.jump(this.props.from=='package'?'Packages':'Home')
    }
    validate() {
        let { items, agree2 } = this.state
        var checkedItem = items.find(o=>o.isChecked)
        if(!checkedItem) return false
        if(!agree2) return false

        return true
    }

    paynow() {
        let { items } = this.state
        var gatewayId = items.find(o=>o.isChecked).gatewayId

        this.props.actions.bookCart(Global.currentCart, gatewayId, "https://preprod-coreapi.travelcarma.com/v1/pg/transaction/finish", Global.itineraryName).then(({error, result})=>{
            if(!error) {
                var url = Global.environment.paymentHandlerUrl.replace('{token}', result.data)
                console.log('url', url)
                //open webview
                Actions.pop()
                Actions.PaymentHandler({url})
            }
        })
    }

    render(){
        let {items, agree1, agree2} = this.state
        let {status} = this.props.cart
        const isPaymentLoading = status==cartAction.PAYMENT_LOADING
        let {T1, T2} = this.props.language
        return(
            <View style={styles.container}>
                <ScrollView>
                    <GroupTitle title={T2("select payment method").toProperCase()}/>
                    <View style={[styles.subContainer,{paddingVertical:20}]}>
                        {items.map((item, index)=><PaymentItem
                            key={index}
                            {...item}
                            onPress={()=>{
                                var flag = !item.isChecked
                                items.map(o=>o.isChecked = false)
                                item.isChecked = flag

                                this.setState({items:[...this.state.items]})
                            }}
                            onDetail={()=>{}}
                        />)}
                    </View>
                    {/* <GroupTitle title="Promocode"/>
                    <Promocode
                        onChange={(code)=>{}}
                    /> */}
                    {/* <GroupTitle title="Insure you trip"/> */}
                    <View style={[styles.subContainer, {paddingVertical:15}]}>
                        {/* <View style={styles.cardListContainer}>
                            <Card
                                title="Loose of Baggage"
                                desc="Claim up to $500"
                                spacer
                                onPress={()=>alert('card1')}
                            />
                            <Card
                                title="Medical Expenses"
                                desc="Claim up to $50,000"
                                spacer
                                onPress={()=>alert('card2')}
                            />
                            <Card
                                title="Loose of Passport"
                                desc="Claim up to $300"
                                spacer
                                onPress={()=>alert('card3')}
                            />
                            <Card
                                title="8+"
                                desc="More"
                                onPress={()=>alert('card4')}
                                style={{
                                    text:{color:Color.orange, fontSize:14}, 
                                    container:{marginRight:0}
                                }}
                            />
                        </View>
                        <Terms1
                            value={agree1}
                            onPress={()=>this.setState({agree1:!agree1})}
                            onLink={()=>{
                                // this.setState({
                                //     policyTitle:'Terms & Conditions',
                                //     policyDesc:UtilService.decodeHtmlEntity(this.termsAndConditions)
                                // })
                                // this.policyModal.open()
                                Actions.HomePrivacy({title:'Terms & Conditions', html:this.termsAndConditions})
                            }}
                        />
                        <View style={styles.spacer}/> */}
                        <Terms2
                            language={this.props.language}
                            value={agree2}
                            onPress={()=>this.setState({agree2:!agree2})}
                            onLink={()=>{
                                // this.setState({
                                //     policyTitle:'Terms & Conditions',
                                //     policyDesc:UtilService.decodeHtmlEntity(this.termsAndConditions)
                                // })
                                // this.policyModal.open()
                                Actions.HomePrivacy({title:T2('terms & conditions').toProperCase(), html:this.termsAndConditions})
                            }}
                        />
                        <RoundButton 
                            disabled={!this.validate()||isPaymentLoading}
                            disabledUI={!this.validate()}
                            title={T2("pay now").toProperCase()} 
                            isLoading={isPaymentLoading}
                            onPress={()=>this.paynow()}
                            textStyle={styles.buttonText}
                        />
                    </View>
                </ScrollView>
                <PolicyModal
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    description={this.state.policyDesc}
                    closeModal={()=>this.policyModal.close()}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ cart, auth, language }) => ({ cart, auth, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default CheckOut = connect(mapStateToProps, mapDispatchToProps)(CheckOutC);
