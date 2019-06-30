import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity
} from 'react-native'

import Color from '@common/color'
import Global from "@utils/global";
import _ from 'lodash'
import { Actions } from 'react-native-router-flux';
import Ionicons from '@expo/vector-icons/Ionicons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as transferAction from '@store/transfer';

const {T1, T2} = Global.Translate

class SelectTypeC extends PureComponent {
    constructor(props) {
        super(props)
        this.state={
            types:[
                {id:'Airport', title:'Airport'},
                {id:'Accommodation', title:'Accommodation'}
            ]
        }
    }

    selectType(item, index){
        let {locationType} = this.props
        this.props.actions.selectType(item.id, locationType)
        Actions.pop()
    }

    render() {
        let {types} = this.state
        let selected = this.props.selectedID || 0
        // const card={
        //     date: new Date(),
        //     price: 43.6,
        //     travelers:1,
        //     carName: 'Mecedes Benz C type',
        //     fromDate: new Date(),
        //     toDate: new Date(),
        //     fromLocation:'Paris',
        //     toLocation:'Paris   '
        // }
        let {T3} = this.props.language
        return (
            <View style={styles.container}>
                {types.map((item, index)=><TouchableOpacity key={index} style={styles.itemContainer} onPress={()=>this.selectType(item, index)}>
                    <Text style={styles.itemText}>{T3(item.title)}</Text>
                    {selected==item.id&&<Ionicons name="md-checkmark" size={24} color={Color.orange}/>}
                </TouchableOpacity>)}
            </View>
        )
    }
}
const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...transferAction }, dispatch)
});
export default SelectType = connect(mapStateToProps, mapDispatchToProps)(SelectTypeC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        paddingHorizontal:10,
    },
    itemContainer:{
        borderBottomColor:'#ccc',
        borderBottomWidth:StyleSheet.hairlineWidth,
        height:40,
        alignItems:'center',
        flexDirection:'row',
        paddingHorizontal:10,
        marginTop:10,
        justifyContent:'space-between'
    },
    itemText:{
        fontSize:14,
        color:Color.primary
    }
})