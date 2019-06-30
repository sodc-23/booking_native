import React from 'react'

import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native'

import GroupTitle from '@components/home/groupTitle';
import Color from '@common/color'
import { aboutus, seatFacility } from '@common/image'
const { width: screenWidth } = Dimensions.get('window')
import ImageHeader from '@hotel_detail/imageHeader'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';
import * as cartAction from '@store/cart';
import { Actions } from 'react-native-router-flux';
import UtilService from '@utils/utils';

import moment from 'moment';
import {locationBack} from '@common/image'

const Item = ({ title, value }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
)

class TrainDetailC extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 0
        }
    }
    render() {
        if ( !this.props.show ) return null
        let {showImages, policy, locations, amenities} = this.props
        let {T1, T2, T3, T4} = this.props.language

        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageHeader
                        hotelName={''}
                        images={showImages}
                        rating={null}
                    />
                    <GroupTitle title={T3("Facilities")} />
                    <FlatList
                        numColumns={3}
                        style={styles.flatlist}
                        data={amenities||[]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.itemContainer2}>
                                    <Image source={item.icon || seatFacility} style={styles.icon} />
                                    <Text style={styles.name}>{item.name}</Text>
                                </View>
                            )
                        }}
                    />
                    <GroupTitle title={T3("Via Location")} />
                    <View style={styles.padding}>
                        {
                            locations.map((location, index)=>(
                                <Item key={index} title={location} value={''} />
                            ))
                        }
                    </View>
                    <GroupTitle title={T3("Cancellation Policy")} />
                    <View style={styles.padding}>
                        <Text style={styles.smallText}>{policy}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...busAction, ...cartAction }, dispatch)
});

export default TrainDetail = connect(mapStateToProps, mapDispatchToProps)(TrainDetailC);

TrainDetail.defaultProps = {
    policy: "If cancelled on or before 10 Day of travelling date, user needs to pay 90 Percentage cancellation charges.\nAdditional fee and taxes may apply. If cancelled on or before 30 Day of travelling date, user needs to pay 50 Perfentage cancellation charges.\n Additional fee and taxes may apply.",
    image: aboutus,
    amenities: [{ name: 'Blanket' }, { name: 'Charging Point' }, { name: 'Current Location' }, { name: 'Emergency Exit' },
    { name: 'Fire Extinguisher' }, { name: 'Medical Box' }, { name: 'Pillow' }, { name: 'Reading Light' }, { name: 'TV' }],
    locations:[
        'Jeddah', 'Taeef'
    ],
    showImages:[
        {image:locationBack, title:'Train'}
    ]

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    padding: {
        paddingHorizontal: 15
    },
    smallText: {
        fontSize: 12,
        color: Color.text,
        marginVertical: 15
    },
    image: {
        height: 200,
        width: '100%',
        resizeMode: 'cover'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical:4,
        minHeight:40,
    },
    title: {
        fontSize: 14,
        color: Color.text,
        fontWeight: 'bold',
        flex:4,
    },
    value: {
        fontSize: 14,
        color: Color.text,
        textAlign:'right',
        flex:1
    },
    flatlist:{
        marginVertical:10
    },
    itemContainer2: {
        width: screenWidth / 3,
        alignItems: 'center',
        marginVertical: 10
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    name: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 10,
        color: Color.darkText
    }
})