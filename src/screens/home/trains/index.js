import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'

import HotDeals from '@components/home/hotDeals'
import Color from '@common/color'
import HomeWhiteMenuButton from '@components/general/homeWhiteMenuButton'
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

class Trains extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            deals: [
                {}, {}, {}, {}
            ],
            items: [
                {}, {}, {}, {}
            ],
            location: '',
            date: new Date(),
            persons:1,
            time: '11:00 am',
        }
    }

    

    render() {
        let { deals, date,persons, time } = this.state
        // let {selectedFromLocation, selectedToLocation} = this.props.activity
        // selectedFromLocation = selectedFromLocation||{}
        // selectedToLocation = selectedToLocation||{}
        let {T1, T2} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <HomeWhiteMenuButton
                        placeholder={T2('pick-up location').toProperCase()}
                        value={''}
                        onPress={() => Actions.SelectCommonLocation({business:'hotel'})}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('drop-off location').toProperCase()}
                        value={''}
                        onPress={() => Actions.SelectCommonLocation({business:'hotel'})}
                    />
                    <TouchableOpacity onPress={()=>Actions.SelectDate({ business: 'train', fromDate:date, disableRange:true })} style={styles.buttonContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{moment(date).format('DD')}</Text>
                            <View>
                                <Text style={styles.normal}>{T1(moment(date).format('ddd').toLowerCase()).toProperCase()}</Text>
                                <Text style={styles.normal}>{T1(moment(date).format('MMM').toLowerCase()).toProperCase()}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>Actions.SelectPassenger({business:'train'})} style={styles.buttonContainer}>
                        <Text style={styles.personNumber}>{persons}</Text>
                        <Text style={styles.middleText}>{T1('person').toProperCase()}</Text>
                    </TouchableOpacity>

                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={()=>Actions.TrainList()} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <HotDeals deals={deals} /> */}
            </View>
        )
    }
}

const mapStateToProps = ({language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Trains);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 15,
        marginBottom: 15
    },
    searchContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    searchButton: {
        flex: 1,
        height: 44,
        backgroundColor: Color.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchButtonText: {
        fontSize: 16,
        color: 'white'
    },
    mapButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    mapPin: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    normal: {
        fontSize: 12,
        color: Color.lightText
    },
    dateText: {
        fontSize: 24,
        color: Color.orange,
        marginRight: 10
    },
    dateContainer: {
        flexDirection: 'row',
        paddingVertical:10
    },
    buttonContainer:{
        width:'100%',
        backgroundColor:'white',
        minHeight:40,
        alignItems:'center',
        justifyContent:'center',
        marginTop:5,
        flexDirection:'row'
    },
    personNumber:{
        color:Color.orange,
        fontSize:16
    },
    middleText:{
        color:Color.text,
        marginLeft:5
    },
    timeText:{
        color:Color.lightText,
        fontSize:16
    }
})