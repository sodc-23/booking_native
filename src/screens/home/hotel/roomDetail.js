import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    FlatList
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import { roomImage, facilityIcon1 } from '@common/image'
import Color from '@common/color'
import GroupTitle from '@components/home/groupTitle'
import RoundButton from '@components/general/roundButton'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
const { T1, T2 } = Global.Translate
import mapping from '@common/iconMapping'
import ImageHeader from '@hotel_detail/imageHeader'

class RoomDetailC extends PureComponent {

    constructor(props) {
        super(props)

    }

    componentWillMount() {
        let locationInfo = Global.currentHotel.locationInfo ? Global.currentHotel.locationInfo.fromLocation : null
        this.props.navigation.setParams({
            title: UtilService.decodeHtmlEntity(Global.currentHotel.name),
            description: locationInfo ? `${locationInfo.city},${locationInfo.country}` : ''
        });
    }

    addToCart() {
        let { hotelId, groupId, roomItem, isGroupLayout } = this.props

        var data = [{
            key: hotelId,
            value: groupId,
            SecondaryBusinessObjectItemId: (isGroupLayout ? null : roomItem.code)
        }]
        this.props.actions.addToCart(Global.searchToken['hotel'], data).then(({ error, result }) => {
            if (error) {
                console.log(error)
                return
            }

            Actions.Booking({ business: 'hotel' })
        })
    }

    render() {
        //let { title, rooms, remain, price, facilities, secondaryFailities } = this.state
        let { roomItem, searchData, image, hotelId, groupId } = this.props
        var dateInfo = searchData.request.criteriaInfo[0].dateInfo
        var nights = moment(dateInfo.endDate).diff(moment(dateInfo.startDate), 'days')
        var facilities = roomItem.amenities || []
        let showImages = [{image, title:roomItem.name}]
        if (roomItem.images) {
            showImages=[]
            roomItem.items.map(o=>{
                o.item.map(room=>{
                    if(room.images) {
                        room.images.map((img)=>{
                            showImages.push({
                                image: { uri: img.url },
                                title: img.title
                            })
                        })
                    } 
                })
            })
            roomItem.images.map(imageObj => {
                showImages.push({
                    image: { uri: imageObj.url },
                    title: imageObj.title
                })
            })
        }
        let {T1, T2, T3, T4} = this.props.language
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageHeader
                        images={showImages}
                        // minPrice={hotel.displayAmount}
                        // isAmountPerNight={hotel.flags ? hotel.flags.isAmountPerNight : 0}
                        // hotelName={hotel.name}
                        // rating={hotel.rating}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{roomItem.name}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceDesc}>{T4('TOTAL PRICE')} {nights} {nights > 1 ? T4('NIGHTS') : T4('NIGHT')}, 1 {T4('ROOM')}</Text>
                        <View style={styles.priceValueContainer}>
                            {/* <Text style={styles.rooms}>Our last {roomItem.quantity} rooms</Text> */}
                            <Text style={styles.price}>{roomItem.displayAmount}</Text>
                        </View>
                    </View>
                    {facilities.length > 0 &&
                        <View>
                            <GroupTitle title={T3("Main Facility")} />
                            <View style={styles.facilityContainer}>
                                <FlatList
                                    numColumns={4}
                                    data={facilities}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        const svgIcon = mapping[item.name] ? mapping[item.name] : require('@images/svg/default.png')
                                        return (
                                            <View style={styles.facilityIconContainer}>
                                                <Image source={svgIcon} style={styles.facilityIcon} />
                                                <Text style={styles.facilityName}>{item.name}</Text>
                                            </View>
                                        )
                                    }}
                                />
                            </View>
                        </View>}
                    {/* <GroupTitle title="Secondary Facility" />
                    <View style={styles.secondaryContainer}>
                        {secondaryFailities.map((item, index) => (
                            <View key={index} style={styles.secondaryItemContainer}>
                                <View style={styles.dot} />
                                <Text style={styles.itemDesc}>{item.desc}</Text>
                            </View>
                        ))}
                    </View>  */}
                </ScrollView>
                {/* <View style={styles.bottomContainer}>
                    <RoundButton
                        title="ADD TO CART"
                        onPress={()=>this.addToCart()}
                    />
                </View> */}
            </View>
        )
    }
}

const mapStateToProps = ({ }) => ({});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch)
});

export default RoomDetail = connect(mapStateToProps, mapDispatchToProps)(RoomDetailC);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        height: 180,
        width: '100%',
        resizeMode: 'cover'
    },
    titleContainer: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    title: {
        fontSize: 16,
        color: Color.text,
        fontWeight: 'bold'
    },
    priceContainer: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    priceDesc: {
        fontSize: 10,
        color: Color.lightText,
        flex: 1
    },
    priceValueContainer: {
        alignItems: 'flex-end',
    },
    rooms: {
        fontSize: 9,
        color: Color.orange
    },
    price: {
        color: Color.middlePrimary,
        fontWeight: 'bold',
        fontSize: 20
    },
    bottomContainer: {
        height: 80,
        backgroundColor: Color.lightBack,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    facilityContainer: {
        paddingVertical: 20,
        width: '100%',
        flexDirection: 'row'
    },
    facilityIconContainer: {
        flex: 1,
        alignItems: 'center'
    },
    facilityIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    facilityName: {
        marginVertical: 8,
        fontSize: 10,
        textAlign: 'center'
    },
    secondaryContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    secondaryItemContainer: {
        flexDirection: 'row',
        marginVertical: 5
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ccc',
        marginTop: 5
    },
    itemDesc: {
        color: Color.text,
        fontSize: 12,
        marginLeft: 10
    }
})