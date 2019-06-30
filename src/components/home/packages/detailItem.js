import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native'

import { infoIcon } from '@common/image'
import Color from '@common/color'
import moment from 'moment'
import RoundButton from '@components/general/roundButton'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

const ActionText = ({ image, text, onPress }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.actionTextContainer}>
        <Image source={image} style={styles.icon} />
        <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
)

export default Item = ({ title, price, date, selected, onPress, onPolicy, language:{T3, T4} }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemPrice}>{price}</Text>
        <Text style={styles.itemDate}>{moment(date).format('DD/MM/YYYY')}</Text>
        <View style={styles.itemActionContainer}>
            <ActionText
                image={infoIcon}
                text={T3('Booking Policies')}
                onPress={onPolicy}
            />
            <View style={styles.itemButtonContainer}>
                <RoundButton    
                    disabledUI={!selected}
                    style={styles.buttonStyle}
                    textStyle={styles.textStyle}
                    title={T4("CHOOSE")}
                    onPress={onPress}
                />
            </View>
        </View>
    </View>
)

const styles = StyleSheet.create({
    actionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginHorizontal: 8
    },
    actionText: {
        color: Color.orange,
        fontSize: 12,
    },
    itemContainer: {
        paddingHorizontal: 15,
    },
    itemTitle: {
        fontSize: 14,
        color: Color.primary,
        lineHeight:32,
        fontWeight:'bold',
        marginTop:10
    },
    itemPrice: {
        fontSize: 18,
        color: Color.orange,
        lineHeight:28
    },
    itemDate: {
        fontSize: 16,
        color: Color.lightText,
        lineHeight:26
    },
    itemActionContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        marginTop:10
    },
    itemButtonContainer: {
        width: 80,
    },
    buttonStyle: {
        height: 32
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize:11
    },
    headerTitle:{
        fontSize:18,
        color:Color.primary,
        fontWeight:'bold',
    },
    header:{
        alignItems:'center',
        flexDirection:'row',
        width:'100%',
        marginTop:15,
        paddingHorizontal:15,
        justifyContent:'space-between'
    },
})