import React, { PureComponent } from 'react'

import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'

import RoomItem from '@components/home/cruise/roomItem'
import RoundButton from '@components/general/roundButton'
import Color from '@common/color'
import { Actions } from 'react-native-router-flux'
import { roomImage, facilityIcon1 } from '@common/image'
import {FontAwesome} from '@expo/vector-icons'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as cartAction from '@store/cart';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import PriceModal from '@hotel_room/priceModal'
import PolicyModal from '@hotel_room/policyModal'

const {T1, T2} = Global.Translate

class RoomListC extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            totalPrice: 130.8,
            totalRoomCount: 3,
            checkedIndexes: [],
            bookAmount: 0,
            displayType: 'OPTION', // OPTION, GROUP
            priceList:[],
            policyTitle:'Room Terms & Conditions',
            policyDesc:'',
            rooms:[
                {}, {}, {}, {}, {}, {}, {}
            ]
        }
    }

    clickItem(room){
        Actions.CruiseRoomDetail()
    }

    render() {
        let {rooms} = this.state
        let {T1, T2} = this.props.language
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.content}>
                        {rooms.map((room, index) => 
                            <RoomItem 
                                key={index} 
                                {...room} 
                                onPress={()=>this.clickItem(room)}/>)}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
});

export default RoomList = connect(mapStateToProps, mapDispatchToProps)(RoomListC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    bottomContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: Color.lightBack,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:'#ccc'
    },
    leftContainer: {
        width: 120,
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightContainer: {
        flex: 1
    },
    totalPrice: {
        fontSize: 14,
        color: Color.lightPrimary,
        fontWeight: 'bold',
        flex: 1
    },
    roomCount: {
        fontSize: 14,
        color: Color.primary,
        fontWeight: 'bold'
    },
    content: {
        padding: 15
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})