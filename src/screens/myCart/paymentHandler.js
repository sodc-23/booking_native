import React, {PureComponent} from 'react'
import {
    WebView
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';
import Global from "@utils/global";

const {T1, T2} = Global.Translate

class PaymentHandlerC extends PureComponent{
    constructor(props){
        super(props)
    }
    log(e) {
        console.log('log', e)
        if(!e.navigationType) {
            if(e.url == 'https://preprod-coreapi.travelcarma.com/v1/pg/transaction/finish') {
                this.props.actions.viewCart()
                //Actions.pop()
                // Actions.replace('ThankYou')
                Actions.pop()
                Actions.popTo('Packages')
                Actions.ThankYou()
            } else if (e.url == 'https://preprod-coreapi.travelcarma.com/v1/pg/transaction/cancel') {
                Actions.pop()
            }
        } 
    }
    render(){
        return (
            <WebView
                source={{uri: this.props.url}}
                style={{flex:1}}
                onNavigationStateChange={this.log.bind(this)}
            />
        )
    }
}

const mapStateToProps = ({ cart, auth }) => ({ cart, auth });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default PaymentHandler = connect(mapStateToProps, mapDispatchToProps)(PaymentHandlerC);
