import React from 'react'

import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'

import DateItem from '@components/general/bookingInput/dateItem'

export default class DateModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showMoal: false,
            dateFrom: props.dateFrom,
            dateTo: props.dateTo
        }
    }

    show(){
        this.setState({showMoal: true})
    }
    close(){
        this.setState({showMoal: false})
    }
    done(){
        let {dateFrom, dateTo} = this.state
        if ( this.props.onSave ) this.props.onSave(dateFrom, dateTo)
        this.close()
    }
    render(){
        let {dateFrom, dateTo, showMoal} = this.state
        return(
            <Modal
                transparent
                onRequestClose={()=>this.close()}
                visible={showMoal}
            >
                <TouchableOpacity activeOpacity={1} onPress={()=>this.close()} style={styles.back}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Change Date</Text>
                        </View>
                        <View style={styles.body}>
                            <DateItem
                                title="Date From"
                                value={dateFrom}
                                onChange={dateFrom=>this.setState({dateFrom})}
                            />
                            <View style={{height:8}}/>
                            <DateItem
                                title="Date To"
                                value={dateTo}
                                onChange={dateTo=>this.setState({dateTo})}
                            />
                            <View style={{height:8}}/>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={()=>this.done()}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles=StyleSheet.create({
    back:{
        flex:1,
        paddingHorizontal:15,
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.8)'
    },
    container:{
        borderRadius:4,
        overflow:'hidden'
    },
    header:{
        height:44,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Color.lightBack,
        borderBottomColor:'#333',
        borderBottomWidth:StyleSheet.hairlineWidth
    },
    body:{
        padding:15,
        backgroundColor:'white'
    },
    button:{
        height:44,
        backgroundColor:Color.primary,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText:{
        fontSize:14,
        color:'white',
        fontWeight:'bold'
    },
    headerText:{
        color:Color.darkText,
        fontSize:16,
        fontWeight:'bold'
    }
})