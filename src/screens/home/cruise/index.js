import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'

import HomeWhiteMenuButton from '@components/general/homeWhiteMenuButton'
import DateView from '@components/home/dateView'
import InfoView from '@components/home/infoView'
import RecentSearchs from '@components/home/recentSearchs'
import HotDeals from '@components/home/hotDeals'
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from '@common/color'
import {mapPin} from '@common/image'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";

const {T1, T2} = Global.Translate

class Cruise extends PureComponent{
    render(){
        let {T1, T2} = this.props.language
        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <HomeWhiteMenuButton
                        placeholder={T2('location').toProperCase()}
                        value={''}
                        onPress={()=>Actions.SelectCommonLocation({business:'activity'})}
                    />
                    <DateView
                        language={this.props.language}
                        fromDate={new Date()}
                        disableRange={true}
                        onPress={()=>Actions.SelectDate({business:'hotel', fromDate:new Date(), disableRange:true})}
                    />
                    <InfoView 
                        items={[
                            {title:T2('room').toProperCase(), value:1},
                            {title:T2('adult(s)').toProperCase(), value: 2},
                            {title:T2('children').toProperCase(), value:0}
                        ]}
                        onPress={()=>Actions.SelectRoom()}
                    />
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={()=>Actions.CruiseList()} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={[]} />
                {/* <HotDeals deals={deals} /> */}
            </View>
        )
    }
}

const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Cruise);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content:{
        paddingHorizontal:15,
    },
    searchContainer:{
        flexDirection:'row',
        marginTop:5,
    },
    searchButton:{
        flex:1,
        height:44,
        backgroundColor:Color.primary,
        alignItems:'center',
        justifyContent:'center',
        marginRight:5,
    },
    searchButtonText:{
        fontSize:16,
        color:'white'
    },
    mapButton:{
        width:44,
        height:44,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white'
    },
    mapPin:{
        width:30,
        height:30,
        resizeMode:'contain'
    }
})