import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text
} from 'react-native'

import Header from '@components/home/dateHeader'
import { Actions } from 'react-native-router-flux'
import Calendar from 'react-native-calendario';
import Color from '@common/color'
import moment, { isMoment } from 'moment'
import Dash from 'react-native-dash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as activityAction from '@store/activity';
import * as vehicleAction from '@store/vehicle';
import * as transferAction from '@store/transfer';
import * as airAction from '@store/air';
import * as busAction from '@store/bus';
import * as packagesAction from '@store/packages';
import Global from "@utils/global";
// const {T1, T2} = Global.Translate

let dateView = null
class SelectDateC extends PureComponent {
    constructor(props) {
        super(props)
        this.state={
            startDate: this.props.fromDate,
            endDate: this.props.toDate,
        }
        dateView = this
    }
    componentWillMount() {
        const {T2} = this.props.language
        this.props.navigation.setParams({
            onRight: this.done.bind(this),
            title:T2('Select Date'),
            rightTitle: T2('DONE'),
        });
    }
    done() {
        let {startDate, endDate} = dateView.state
        let {disableRange, business, index} = dateView.props
        let {fromDate, toDate} = this.props
        
        if(!disableRange && !endDate) {
            if(business == 'hotel')
                return alert('Please select check-out date.')
            else if(business == 'activity'||business == 'package'||business == 'vehicle')
                return alert('Please select To date.')
            
            return alert('Please select check-out date.')
        }
        if(startDate && fromDate) {
            startDate = moment(moment(startDate).format('YYYY-MM-DDT') + moment(fromDate).format('HH:mm:ss')).toDate()
        }
        if(endDate && toDate) {
            endDate = moment(moment(endDate).format('YYYY-MM-DDT') + moment(toDate).format('HH:mm:ss')).toDate()
        }

        if(disableRange) {
            if(startDate) {
                if ( dateView.props.actions[business] ){
                    dateView.props.actions[business].selectDate(startDate)
                }
                Actions.pop()
            }
        } else {
            if(startDate && endDate) {
                if(!disableRange&&moment(startDate).format('YYYYMMDD') == moment(endDate).format('YYYYMMDD')) {
                    return alert('Please select valid Check-in/Check-out dates.')
                }
                dateView.props.actions[business].selectDate(startDate, endDate, index)
                Actions.pop()
            }
        }
    }
    renderDay(item){
        let {date,
            isVisible,
            isActive,
            isStartDate,
            isEndDate,
            isMonthDate,
            isOutOfRange} = item
        let containerStyle=isStartDate||isEndDate?styles.startDateContainer:{}
        let textStyle=isStartDate||isEndDate?{color:'white'}:{color:Color.primary}
        let sundayStyle=date.getDay()==0?{color:Color.orange}:{}
        let A = moment(new Date()).format('DD/MM/YYYY')
        let B = moment(date).format('DD/MM/YYYY')
        let isToday = (A === B)
        const {T2} = this.props.language
        return (
            <View style={styles.virtualContainer}>
                {isStartDate&&!isEndDate&&<View style={styles.start}/>}
                {!isStartDate&&isEndDate&&<View style={styles.end}/>}
                <View style={containerStyle}>
                    <Text style={[styles.dayText, textStyle, sundayStyle]}>{date.getDate()}</Text>
                    {isToday&&<Text style={styles.todayText}>{T2('TODAY')}</Text>}
                </View>
            </View>
        )
    }

    setRange(range){
        let {startDate, endDate} = this.state
        let newStartDate = range.startDate
        let newEndDate = range.endDate
        this.setState({startDate:newStartDate, endDate: newEndDate})
    }

    render() {
        let {startDate, endDate} = this.state
        let {disableRange, business} = this.props
        const {T2} = this.props.language
        var showHeader = true
        if(disableRange) showHeader = false
        if(business == 'activity'||business == 'vehicle'||business=='package'||business=='air') showHeader = false
        return (
            <View style={styles.container}>
                {showHeader&&<Header
                    fromDate={startDate?startDate:new Date()}
                    toDate={endDate?endDate:(startDate?startDate: new Date())}
                    language={this.props.language}
                />}
                <Calendar
                    onChange={range => this.setRange(range)}
                    minDate={moment().format('YYYY-MM-DD')}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    monthNames={[T2('JANUARY'), T2('FEBRUARY'), T2('MARCH'), T2('APRIL'), T2('MAY'), T2('JUNE'), T2('JULY'), T2('AUGUST'), T2('SEPTEMBER'), T2('OCTOBER'), T2('NOVEMBER'), T2('DECEMBER')]}
                    dayNames={[T2('SUN'), T2('MON'), T2('TUE'), T2('WED'), T2('THU'), T2('FRI'), T2('SAT')]}
                    renderDayContent={(props)=>this.renderDay(props)}
                    monthHeight={320}
                    numberOfMonths={36}
                    disableRange={disableRange}
                    renderWeekContent={(day, i)=><Text style={{color:i==0?Color.orange:'black', fontSize:10}}>{day}</Text>}
                    splitter={<Dash 
                        dashStyle={{height:1}} 
                        dashColor={'#ccc'}
                        style={{width:'100%'}}/>}
                    theme={{
                        weekColumnTextStyle: {
                            color: 'black',
                            fontSize:10
                        },
                        weekColumnStyle: {
                            marginVertical: 5,
                            paddingVertical: 8,
                            backgroundColor:Color.lightBack
                        },
                        weekColumnsContainerStyle: {
                            backgroundColor: 'white',
                        },
                        monthTitleTextStyle: {
                            color: Color.lightPrimary,
                            fontSize: 16,
                        },
                        nonTouchableDayContainerStyle: {
                            backgroundColor: 'white',
                        },
                        nonTouchableDayTextStyle: {
                            color: 'grey',
                        },
                        dayTextStyle: {
                            color: Color.calendarDate,
                            fontSize: 18
                        },
                        dayContainerStyle:{
                            height:30,
                            paddingVertical:0,
                            justifyContent:'center'
                        },
                        activeDayContainerStyle: {
                            backgroundColor: 'rgb(161, 215, 226)',
                            paddingVertical:0,
                            height:30,
                            justifyContent:'center',
                        },
                        activeDayTextStyle: {
                            color: Color.lightPrimary,
                        },
                        endDateContainerStyle:{
                            backgroundColor:'white',
                        },
                        startDateContainerStyle:{
                            backgroundColor:'white',
                        },
                        monthContainer:{
                            
                        }
                    }}
                />
            </View>
        )
    }
}
const mapStateToProps = ({ hotel, activity, vehicle, transfers, air, bus, packages, language }) => 
({ hotel, activity, vehicle, transfers, air, bus, package: packages, language });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        hotel : bindActionCreators({ ...hotelAction }, dispatch),
        activity : bindActionCreators({ ...activityAction }, dispatch),
        vehicle : bindActionCreators({ ...vehicleAction }, dispatch),
        transfers : bindActionCreators({ ...transferAction }, dispatch),
        air: bindActionCreators({ ...airAction }, dispatch), 
        bus: bindActionCreators({ ...busAction }, dispatch), 
        package: bindActionCreators({ ...packagesAction }, dispatch), 
    }
});
export default SelectDate = connect(mapStateToProps, mapDispatchToProps)(SelectDateC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    startDateContainer:{
        backgroundColor:Color.lightPrimary, 
        width:30, 
        height:30, 
        borderRadius:15, 
        alignItems:'center', 
        justifyContent:'center'
    },
    dayText:{
        fontSize:18
    },
    todayText:{
        fontSize:7,
        color: Color.middlePrimary,
        fontWeight:'bold',
        textAlign:'center'
    },
    virtualContainer:{
        backgroundColor:'transparent',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
    },
    start:{
        position:'absolute',
        width:'50%',
        height:'100%',
        right:-StyleSheet.hairlineWidth,
        top:0,
        backgroundColor:'rgb(161, 215, 226)'
    },
    end:{
        position:'absolute',
        width:'50%',
        height:'100%',
        left:-StyleSheet.hairlineWidth,
        top:0,
        backgroundColor:'rgb(161, 215, 226)'
    }
})