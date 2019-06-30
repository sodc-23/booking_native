import React, { PureComponent } from 'react'

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native'

import Modal from 'react-native-modalbox';
import Color from '@common/color'
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

const { width: screenWidth } = Dimensions.get('window')

export default class PriceModal extends PureComponent {
    render() {
        let { onRef, title, items, total } = this.props
        var totalItem = items.find(o => o.title == 'Total')
        return (
            <Modal ref={e => {this.modal=e;onRef(e)}} position="center" style={styles.modal}>
                <TouchableOpacity onPress={()=>this.modal.close()} activeOpacity={1} style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{title}</Text>
                    </View>
                    <View style={styles.content}>
                        {items.map((item, index) => {
                            if (item.title == 'Total') return null;
                            return (
                                <View key={index} style={styles.itemContainer}>
                                    <Text style={[styles.itemText, item.amount == ' ' ? { fontSize: 11, color: '#888' } : {}]}>{item.title}</Text>
                                    <Text style={[styles.itemText, { textAlign: 'right' }]}>{item.amount}</Text>
                                </View>
                            )
                        }
                        )}
                    </View>
                    {totalItem && <View style={styles.bottomContainer}>
                        <Text style={styles.bottomText}>{totalItem.title}</Text>
                        <Text style={styles.bottomText}>{totalItem.amount}</Text>
                    </View>}
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor:'transparent',
        justifyContent:'center'
    },
    modal: {
        // borderRadius: 8,
        backgroundColor:'transparent',
        width: screenWidth - 30,
    },
    headerContainer: {
        backgroundColor: Color.lightBack,
        paddingHorizontal: 15,
        justifyContent: 'center',
        height: 40,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: Color.border
    },
    content: {
        paddingTop: 10,
        paddingBottom: 10,
        width:'100%',
        backgroundColor:'white'
    },
    headerText: {
        fontWeight: 'bold',
        color: Color.dark,
        fontSize: 14
    },
    itemContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    itemText: {
        flex: 1,
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold'
    },
    bottomContainer: {
        backgroundColor: Color.lightBack,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopWidth: 0.5,
        borderTopColor: Color.border
    },
    bottomText: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold'
    }
})