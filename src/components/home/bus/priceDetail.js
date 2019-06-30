import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native'
import Color from '@common/color';
import GroupTitle from '@components/home/groupTitle';
export default PriceDetail = ({ priceList, seatList }) => (
    <View>
        <GroupTitle title="Price Details:" />
        <View style={styles.container}>
            <View style={styles.seatContainer}>
                <Text style={styles.bigText}>Your Selected Seat(s):</Text>
                    <FlatList
                        numColumns={4}
                        data={seatList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => <View style={styles.seatItem}>
                            <Text style={styles.itemText}>{item.title}</Text>
                        </View>}
                    />
            </View>
            <View style={styles.spacer} />
            <View style={styles.priceContainer}>
                <Text style={styles.bigText}>Price Details:</Text>
                <View style={styles.priceContent}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.smallText}>Base Price :</Text>
                        <Text style={styles.smallText}>Service Tax :</Text>
                        <Text style={styles.smallText}>Total Price :</Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={styles.smallText}>{priceList[0].amount}</Text>
                        <Text style={styles.smallText}>{priceList[1].amount}</Text>
                        <Text style={styles.smallText}>{priceList[2].amount}</Text>
                    </View>
                </View>
            </View>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    bigText: {
        fontSize: 13,
        color: Color.text,
        marginBottom: 15
    },
    smallText: {
        fontSize: 11,
        color: Color.text,
        marginBottom: 5
    },
    seatContainer: {
        flex: 1
    },
    priceContainer: {
        flex: 1
    },
    spacer: {
        height: '100%',
        width: StyleSheet.hairlineWidth,
        backgroundColor: 'grey',
        marginHorizontal: 10
    },
    titleContainer: {
    },
    valueContainer: {
        alignItems: 'flex-end'
    },
    priceContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    seatItem: {
        backgroundColor: 'rgb(56,121,187)',
        width: 34,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginBottom:5,
    },
    itemText: {
        color: 'white',
        fontSize: 10
    }
})