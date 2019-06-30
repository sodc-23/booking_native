import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

import Color from '@common/color'
import TitleBar from './TitleBar';
import Ionicons from '@expo/vector-icons/Ionicons';
// import {closeButtonImage} from '@common/image'
// import CountryCurrencyPicker from 'react-native-country-currency-picker';
// import CountryPicker, { getAllCountries } from '@react-native-country-picker-modal'
import ModalDropdown from 'react-native-modal-dropdown'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default RadioSelector = ({ title, options, index, onChanged, noTitle }) => (
    <View style={styles.container}>
        {noTitle==null&&<TitleBar title={title} />}
        <View style={styles.wrapper}>
            <ModalDropdown
                options={options}
                defaultIndex={Number(index)}
                onSelect={(index, value)=>onChanged(index,value)}
                renderRow={(option, index, isSelected)=><View style={styles.itemContainer}>
                    <Text style={[styles.currency, {color:isSelected?Color.orange:Color.primary}]}>{option}</Text>
                </View>}
                dropdownStyle={{height:200}}
                adjustFrame={style=>{
                    style.right=10;
                    style.left=undefined;
                    style.padding=10
                    return style
                }}
            >
                <View style={styles.content}>
                    <Text style={styles.text}>{title}</Text>
                    <Text style={styles.currency}>{options[index]}</Text>
                    <Ionicons name="ios-arrow-forward" size={24} color={Color.text} />
                </View>
            </ModalDropdown>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
    },
    wrapper: {
        padding: 10,
    },
    content: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: Color.border,
        paddingLeft: 15,
        paddingRight: 5,
        height: 44,
        width: '100%',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        color: Color.lightText,
        flex: 1
    },
    currency: {
        color: Color.orange,
        textAlign:'center',
        fontSize: 18,
        marginRight: 10
    },
    itemContainer:{
        height:36, 
        justifyContent:'center', 
        alignItems:'center', 
        // width:140
    }
})

const darkTheme = StyleSheet.create({
    itemCountryName: {
        height: 32
    },
    currency: {
        color: Color.primary,
        fontWeight: 'bold',
        fontSize: 14
    }
});