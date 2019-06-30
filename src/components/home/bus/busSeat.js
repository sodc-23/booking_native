import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import DeckItem from './deckItem';
import PropTypes from 'prop-types'
import SeatItem from './seatItem'
import Color from '@common/color'
import GroupTitle from '@components/home/groupTitle'

const states=['Available', 'Selected', 'Taken', 'Ladies', 'Blocked']; 

export default class BusSeat extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <GroupTitle title="Select Seats:"/>
                <View style={styles.headerContainer}>
                    {states.map((status, index)=><View key={index} style={styles.item}>
                        <SeatItem type="demo" armSize={4} style={{width:20, height:20}} status={status}/>
                        <Text style={styles.smallText}>{status}</Text>
                    </View>)}
                </View>
                <DeckItem 
                    {...this.props}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        // flex:1
    },
    headerContainer:{
        flexDirection:'row',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15,
        height:60,
        borderBottomColor:'#ccc',
        borderBottomWidth:StyleSheet.hairlineWidth,
        marginBottom:30
    },
    item:{
        alignItems:'center'
    },
    titleBar:{
        height:36,
        width:'100%',
        paddingHorizontal:15,
        justifyContent:'center',
        backgroundColor:Color.lightBack
    },
    title:{
        fontSize:14,
        fontWeight:'bold',
        color:Color.lightText
    },
    smallText:{
        fontSize:12,
        color:Color.text
    }
})

BusSeat.propTypes = {
    floors: PropTypes.number,
    cols: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    seats: PropTypes.array.isRequired,
    onClickItem: PropTypes.func.isRequired
}

BusSeat.defaultProps={
    floors: 2,
    cols:5,
    rows:10,
    onClickItem:(row, col)=>console.log(row, col),
    seats:[
        {row:1, col:1, type:'door1'},
        {row:1, col:3, type:'TV'},
        {row:1, col:5, type:'driver'},
        {row:2, col:1, type:'Seater', title:'1'},
        {row:2, col:2, type:'Seater', title:'2'},
        {row:2, col:4, type:'Seater', title:'3'},
        {row:2, col:5, type:'Seater', title:'4', status:'Taken'},

        {row:3, col:1, type:'Sleeper', title:'5', selected:true},
        {row:3, col:2, type:'Sleeper', title:'6', selected:true},
        {row:3, col:4, type:'Sleeper', title:'7', selected:true},
        {row:3, col:5, type:'Sleeper', title:'8'},
        {row:5, col:1, type:'Sleeper', title:'9'},
        {row:5, col:2, type:'Sleeper', title:'10', status:'Taken'},
        {row:5, col:4, type:'Sleeper', title:'11', status:'Selected'},
        {row:5, col:5, type:'Sleeper', title:'12', status:'Selected'},
        {row:7, col:1, type:'Sleeper', title:'13'},
        {row:7, col:2, type:'Sleeper', title:'14', status:'Ladies'},
        {row:7, col:4, type:'Sleeper', title:'15'},
        {row:7, col:5, type:'Sleeper', title:'16'},
        {row:9, col:1, type:'Sleeper', title:'17', status:'Ladies'},
        {row:9, col:2, type:'Sleeper', title:'18'},
        {row:9, col:4, type:'Sleeper', title:'19', selected:true},
        {row:9, col:5, type:'Sleeper', title:'20', selected:true},
        {row:10, col:3, type:'toilet'},

        {row:1, col:7, type:'Sleeper', title:'21'},
        {row:1, col:8, type:'Sleeper', title:'22', status:'Blocked'},
        {row:1, col:10, type:'Sleeper', title:'23'},
        {row:1, col:11, type:'Sleeper', title:'24', status:'Taken'},
        {row:3, col:7, type:'Sleeper', title:'25'},
        {row:3, col:8, type:'Sleeper', title:'26'},
        {row:3, col:10, type:'Sleeper', title:'27', status:'Ladies'},
        {row:3, col:11, type:'Sleeper', title:'28'},
        {row:5, col:7, type:'Sleeper', title:'29'},
        {row:5, col:8, type:'Sleeper', title:'30'},
        {row:5, col:10, type:'Sleeper', title:'31', status:'Selected'},
        {row:5, col:11, type:'Sleeper', title:'32'},
        {row:7, col:7, type:'Sleeper', title:'33'},
        {row:7, col:8, type:'Sleeper', title:'34'},
        {row:7, col:10, type:'Sleeper', title:'35'},
        {row:7, col:11, type:'Sleeper', title:'36'},
        {row:9, col:7, type:'Sleeper', title:'37'},
        {row:9, col:8, type:'Sleeper', title:'38'},
        {row:9, col:10, type:'Sleeper', title:'39'},
        {row:9, col:11, type:'Sleeper', title:'40'},
    ]
}
