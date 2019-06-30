import React, { PureComponent } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Text
} from 'react-native'

import Color from '@common/color'

import { hotelIco, transferIco, packageIco, cruiseIco, trainIco, carRentalIco, flightIco, activityIco, busIco } from '@common/image'

const TYPES = {
    HOTEL: { id: 0, image: hotelIco, name: 'HOTELS' },
    FLIGHT: { id: 1, image: flightIco, name: 'FLIGHTS' },
    BUS: { id: 2, image: busIco, name: 'BUSES' },
    ACTIVITY: { id: 3, image: activityIco, name: 'ACTIVITIES' },
    CRUISE: { id: 4, image: cruiseIco, name: 'CRUISES' },
    VEHICLE: { id: 5, image: carRentalIco, name: 'CAR RENTAL' },
    TRANSFER: { id: 6, image: transferIco, name: 'TRANSFER' },
    TRAIN: { id: 7, image: trainIco, name: 'TRAINS' },
    PACKAGE: { id: 8, image: packageIco, name: 'PACKAGES' }
}

const PriceCard = ({ type, title, prices, total }) => (
    <View style={{ marginBottom: 20 }}>
        <View style={styles.titleContainer}>
            <Image source={type.image} style={styles.image} />
            <Text style={styles.title}>{type.name}</Text>
        </View>
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <View style={styles.cardBody}>
                {prices.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <Text style={[styles.normal, { flex: 1 }]}>{item.title}</Text>
                        <Text style={[styles.normal, {marginLeft:10}]}>{item.price}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.cardBottom}>
                <Text style={styles.normal}>Total</Text>
                <Text style={styles.normal}>{total}</Text>
            </View>
        </View>
    </View>
)

export default class MyCart extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            totalPrice: 'USD 34.6',
            cardList: [
                { title: "Paradiso Hotel", prices: [{ title: 'Double Room - Superior/Room Only x 1', price: 'USD 43.6' }], total: 'USD 43.6', type: TYPES.HOTEL },
                { title: "Paradiso Hotel", prices: [{ title: 'Double Room - Superior/Room Only x 1', price: 'USD 43.6' }], total: 'USD 43.6', type: TYPES.ACTIVITY },
                { title: "Paradiso Hotel", prices: [{ title: 'Double Room - Superior/Room Only x 1', price: 'USD 43.6' }], total: 'USD 43.6', type: TYPES.TRAIN },
                { title: "Paradiso Hotel", prices: [{ title: 'Double Room - Superior/Room Only x 1', price: 'USD 43.6' }], total: 'USD 43.6', type: TYPES.CRUISE },
            ]
        }
    }
    render() {
        let { totalPrice, cardList } = this.state
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {cardList.map((item, index) => <PriceCard
                        {...item}
                        key={index}
                    />)}
                    <View style={styles.bottomInfo}>
                        <Text style={styles.blackBold}>TOTAL:</Text>
                        <Text style={styles.blackBold}>{totalPrice}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 15,
    },
    bottomInfo: {
        backgroundColor: Color.lightBack,
        height: 44,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    blackBold: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
    image: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 5
    },
    cardContainer: {
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#777',
        overflow: 'hidden',
        marginTop: 10
    },
    cardHeader: {
        backgroundColor: Color.lightBack,
        height: 36,
        paddingHorizontal: 15,
        justifyContent: 'center',
        borderBottomColor: '#777',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    cardBody: {
        padding: 15
    },
    cardBottom: {
        backgroundColor: Color.lightBack,
        height: 36,
        paddingHorizontal: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: '#777',
        borderTopWidth: StyleSheet.hairlineWidth
    },
    cardTitle: {
        fontSize: 14,
        color: Color.text,
        fontWeight: 'bold'
    },
    normal: {
        fontSize: 12,
        color: 'black',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContainer: {
        marginBottom: 3,
        flexDirection: 'row',
    }
})