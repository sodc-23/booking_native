import React, { PureComponent } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    View,
    Image,
} from 'react-native'
import Color from '@common/color'
import { background } from '@common/image'
import Ionicons from '@expo/vector-icons/Ionicons';
import { screenWidth } from '@common/const'
import Global from "@utils/global";
const { T1, T2 } = Global.Translate
import ImagePlaceholder from '@components/general/react-native-image-placeholder'
import Marquee from '@components/general/react-native-text-ticker'
const ITEM_WIDTH = screenWidth - 30

export default class HotDeals extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            page: 0,
        }
    }
    handlePageChange = (e) => {
        var offset = e.nativeEvent.contentOffset;
        if (offset) {
            var page = Math.round(offset.x / screenWidth);
            if (this.state.page != page) {
                this.setState({ page: page });
            }
        }
    }
    convertForDisplay(hotel) {
        if (hotel == null || hotel.searchInfo == null) return {}
        let convertedHotel = {}
        let { config, criteriaInfo, paxinfo } = hotel.searchInfo
        config.map(item => convertedHotel[item.key] = item.value)
        return {
            title: convertedHotel.name,
            image: { uri: convertedHotel.image },
            rating: Number(convertedHotel.starRating),
            current: convertedHotel.currencyCode + ' ' + Number(convertedHotel.bestAmount).toFixed(),
            location: criteriaInfo[0].locationInfo.fromLocation.address,
            hasSpecialDeal: true
        }

    }

    clickItem(item) {
        this.props.onPress(item)
    }

    render() {
        let { items, language } = this.props
        let { page } = this.state
        const T2 = language ? language.T2 : (key) => key
        const dots=[...items]
        if(dots.length == 0) return null;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{T2('HOT DEALS')}</Text>
                <ScrollView
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.handlePageChange}
                >
                    {dots.map((item, index) => {
                        let deal = this.convertForDisplay(item)
                        return (
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>this.clickItem(item)} key={index} style={styles.itemContainer}>
                                <ImagePlaceholder source={deal.image || background} style={styles.image} />
                                <View style={styles.content}>
                                    {/* <View style={styles.tagContainer}>
                                    <Text style={styles.tagText}>{deal.tagText || 'Flight Promo'}</Text>
                                </View> */}
                                    <Text numberOfLines={2} style={styles.dealTitle}>
                                        {deal.title || 'Adipiscing Elit Morbj'}
                                    </Text>
                                    <Text numberOfLines={2} style={styles.location}>
                                        <Ionicons name="ios-pin" size={10} color={Color.middlePrimary} />
                                        {' ' + (deal.location || 'Paris, France')}
                                    </Text>
                                    <View style={{ height: 20 }} />
                                    {/* <Text style={styles.from}>{deal.from || 'From USD 199'}</Text> */}
                                    <Text style={styles.price}>{deal.current || 'USD 149'}</Text>
                                </View>
                                {/* <View style={styles.topRightContainer} />
                            <Text style={styles.topRightText}>
                                {deal.discount || '20% OFF'}
                            </Text> */}
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                <View style={[styles.indicatorContainer, {marginTop:15}]}>
                    {dots.map((item, index) => 
                        index<18?<View key={index} style={[styles.indicator, index == page ? { borderWidth: 2, backgroundColor: 'black' } : {}]}/>:null
                    )}
                </View>
                <View style={styles.indicatorContainer}>
                    {dots.map((item, index) => 
                        (index>=18&&index<36)?<View key={index} style={[styles.indicator, index == page ? { borderWidth: 2, backgroundColor: 'black' } : {}]}/>:null
                    )}
                </View>
                <View style={styles.indicatorContainer}>
                    {dots.map((item, index) => 
                        index>=36&&index<54?<View key={index} style={[styles.indicator, index == page ? { borderWidth: 2, backgroundColor: 'black' } : {}]}/>:null
                    )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    itemContainer: {
        width: ITEM_WIDTH,
        borderRadius: 20,
        height: 150,
        backgroundColor: 'rgb(212, 232, 237)',
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        marginHorizontal: 15,
    },
    topRightContainer: {
        position: 'absolute',
        right: -35,
        top: -90,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Color.primary
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 20,
        marginRight: 10,
    },
    tagContainer: {
        height: 16,
        width: 80,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.lightText
    },
    tagText: {
        fontSize: 8,
        color: 'white'
    },
    location: {
        fontSize: 10,
        color: Color.middlePrimary,
        marginTop: 3,
        fontWeight: 'bold'
    },
    dealTitle: {
        marginTop: 15,
        fontSize: 15,
        color: Color.middlePrimary,
        fontWeight: 'bold',
    },
    from: {
        fontSize: 10,
        color: Color.text
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Color.darkText
    },
    topRightText: {
        position: 'absolute',
        right: 10,
        top: 5,
        fontSize: 10,
        color: 'white',
        // fontWeight:'bold'
    },
    title: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        marginVertical: 10
    },
    indicatorContainer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    indicator: {
        width: 8,
        height: 8,
        backgroundColor: 'rgb(212, 232, 237)',
        borderRadius: 4,
        margin: 5,
        borderWidth: 0,
        borderColor: 'white'
    },
    content: {
        flex: 1
    }
})