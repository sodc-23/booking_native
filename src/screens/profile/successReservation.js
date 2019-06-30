import React, {PureComponent} from 'react'
import {
    View,
    StyleSheet,
    Text
} from 'react-native'

import { FontAwesome } from '@expo/vector-icons'
import Color from '@common/color'
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';

const NoTitleItem = ({value})=>(
    <View style={styles.itemContainer}>
        <FontAwesome name="circle" size={4} color={Color.primary} style={{width:10, marginTop:3}}/>
        <Text style={styles.itemValue}>{value}</Text>
    </View>
)

class SuccessReservationC extends PureComponent{
    componentWillMount() {
        this.props.navigation.setParams({
            // onRight: this.done.bind(this),
            // rightTitle: 'DONE',
            title: 'Reservation',
            goBack:()=>{
                this.props.actions.getMyBookings('upcoming')
                Actions.popTo('MyBookings')
            }
        });
    }

    done() {
        Actions.popTo('MyBookings')
    }
    render(){
        let {T1} = this.props.language
        return(
            <View style={styles.container}>
                <Text style={styles.title}>{T1('message47')}</Text>
                <Text style={styles.primaryText}>
                    {T1('message48')}
                </Text>
                <Text style={[styles.primaryText, {marginBottom:20}]}>{T1('message49')}</Text>
                <NoTitleItem value={T1('message50')}/>
                <NoTitleItem value={T1('message51')}/>
                <NoTitleItem value={T1('message52')}/>
                <Text style={[styles.primaryText, {textAlign:'center'}]}>
                    {T1('message53')}
                </Text>
            </View>
        )
    }
}

const mapStateToProps = ({language}) => ({ language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch),
});

export default SuccessReservation = connect(mapStateToProps, mapDispatchToProps)(SuccessReservationC);


const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:15,
        backgroundColor:'white'
    },
    itemContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    itemValue: {
        color: Color.text,
        fontSize: 10,
        flex: 2,
        marginLeft: 8
    },
    primaryText:{
        fontSize:14,
        color:Color.primary,
        marginTop:20
    },
    title:{
        fontSize:18,
        fontWeight:'bold',
        color:Color.lightPrimary,
        textAlign:'center'
    }
})