import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity
} from 'react-native'

import BottomButton from '@components/general/bottomButton'
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from '@common/color'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as activityAction from '@store/activity';
import * as vehicleAction from '@store/vehicle';
import * as transferAction from '@store/transfer';
import * as airAction from '@store/air';
import * as busAction from '@store/bus';
import * as packagesAction from '@store/packages';
import ModalDropdown from 'react-native-modal-dropdown'
import Global from "@utils/global";
import _ from 'lodash'
const {T1, T2} = Global.Translate

const Item = ({ title, value, onPress, noBorder }) => (
    <View style={[styles.itemContainer, { borderBottomWidth: noBorder ? 0 : 0.5 }]}>
        <Text style={styles.itemValueText}>{value}</Text>
        <Text style={styles.itemtitleText}>{title}</Text>
        <TouchableOpacity style={styles.removeContainer} onPress={() => onPress(false)}>
            <Ionicons name="ios-remove-circle-outline" size={24} color={Color.lightPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.plusContainer} onPress={() => onPress(true)}>
            <Ionicons name="ios-add-circle-outline" size={24} color={Color.lightPrimary} />
        </TouchableOpacity>
    </View>
)

class SelectPassengerC extends PureComponent {
    constructor(props) {
        super(props)
        let business = this.props.business
        this.state={
            value: this.props[business]==null?1:this.props[business].passengers
        }
        this.maxPassengers = Global.environment.availableBusinesses.activity.maxGroupCount
    }
    componentWillMount() {
        let {T2} = this.props.language
        this.props.navigation.setParams({
            onRight: this.done.bind(this),
            rightTitle: T2('DONE'),
        });
    }
    done() {
        let business = this.props.business

        let {T1} = this.props.language
        if (this.state.value == 0 ) {
            return alert(T1('message17'))
        }
        if ( this.props.actions[business] ){
            this.props.actions[business].setPassengers(this.state.value)
        }
        
        Actions.pop()
    }

    onPress(inc){
        if ( !inc && this.state.value == 0 ) return
        if ( inc && this.state.value >= this.maxPassengers ) return
        if ( inc ) this.setState({value:this.state.value+1})
        else this.setState({value:this.state.value-1})
    }
    render() {
        let {T3} = this.props.language
        return (
            <View style={styles.container}>
                <Item
                    value={this.state.value}
                    title={T3("Persons")}
                    onPress={(inc)=>this.onPress(inc)}
                    noBorder
                />
            </View>
        )
    }
}

const mapStateToProps = ({ activity, vehicle, transfers, air, bus, packages, language }) => 
({ activity, vehicle, transfers, air, bus, packages, language });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        activity : bindActionCreators({ ...activityAction }, dispatch),
        vehicle : bindActionCreators({ ...vehicleAction }, dispatch),
        transfers : bindActionCreators({ ...transferAction }, dispatch),
        air: bindActionCreators({ ...airAction }, dispatch), 
        bus: bindActionCreators({ ...busAction }, dispatch), 
        packages: bindActionCreators({ ...packagesAction }, dispatch), 
    }
});
export default SelectPassenger = connect(mapStateToProps, mapDispatchToProps)(SelectPassengerC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        paddingHorizontal:10,
    },
    roomHeaderContainer: {
        height: 40,
        backgroundColor: Color.comment,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 13,
        color: Color.text,
        flex: 1,
    },
    itemContainer: {
        height: 60,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    itemValueText: {
        fontSize: 24,
        color: 'black'
    },
    itemtitleText: {
        color: 'black',
        fontSize: 12,
        flex: 1,
        marginLeft: 10,
        marginTop:8
    },
    removeContainer: {
        height: '100%',
        width: 40,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    plusContainer: {
        height: '100%',
        width: 40,
        marginLeft: 20,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    content: {
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    spacer: {
        width: '100%',
        height: 0.5,
        backgroundColor: Color.border
    }
})