import React, {PureComponent} from 'react'
import {
    View,
    StyleSheet
} from 'react-native'

import ScrollTabView from '@hotDeal/scrollTabView'
import HotelList from '@hotDeal/hotelList'
import TransferList from '@hotDeal/transferList'
import ActivityList from '@hotDeal/activityList'
import PackageList from '@hotDeal/packageList'

import * as hotDealAction from '@store/hotDeal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HotDeal extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            titles:['HOTELS', 'ACTIVITIES', 'PACKAGE', ],
            selected:0,
            
        }
    }
    changeTab(item, index){
        this.setState({selected:index})
    }

    componentWillMount(){
        this.props.actions.hotDeal.fetchHotel()
        this.props.actions.hotDeal.fetchActivity()
        this.props.actions.hotDeal.fetchPackage()
    }

    renderSubview(){
        let {selected, titles} = this.state
        let {hotel, activity, transfer, vehicle} = this.props.hotDeal
        switch (titles[selected]){
            case 'HOTELS':
                return <HotelList {...hotel}/>
            case 'VEHICLE':
                return null
            case 'TRANSFER':
                return null
            case 'ACTIVITIES':
                return <ActivityList {...activity}/>
            case 'FLIGHTS':
                return null
            case 'BUSES':
                return null
            case 'CRUISE':
                return null;//<ActivityList/>
            case 'TRAINS':
                return null
            case 'PACKAGE':
                return <PackageList {...this.props.hotDeal.package}/>
        }
    }
    render(){
        let {titles, selected} = this.state
        return(
            <View style={styles.container}>
                <ScrollTabView
                    language={this.props.language}
                    titles={titles}
                    selected={selected}
                    onPress={(item, index)=>this.changeTab(item, index)}
                />
                {this.renderSubview()}
            </View>
        )
    }
}

const mapStateToProps = ({ hotDeal, language }) => ({ hotDeal, language });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        hotDeal : bindActionCreators({ ...hotDealAction }, dispatch),
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(HotDeal);

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    }
})