import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView
} from 'react-native'

import { Actions } from 'react-native-router-flux'

import RangeSelectBar from '@hotel_filter/RangeSelectBar'
import RatingFilterBar from '@hotel_filter/RatingFilter'
import SwitchEditor from '@hotel_filter/SwitchEditor'
import InputFilter from '@hotel_filter/InputFilter'
import RadioSelector from '@hotel_filter/RadioSelector'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as activityAction from '@store/activity';
import * as vehicleAction from '@store/vehicle';
import * as transferAction from '@store/transfer';
import * as airAction from '@store/air';
import * as busAction from '@store/bus';
import * as packagesAction from '@store/packages';
import _ from 'underscore';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";

const {T1, T2} = Global.Translate

const filterMapper = {
    'hotel' : [
        {key:'starrating', label:'Star Rate'},
        {key:'pricerange', label:'Price Range'},
        {key:'guestrating', label:'Guest Rate'},
        {key:'name', label:'Hotel Name'},
        {key:'category', label:'Hotel Type'},
        {key:'type', label:'Type'},
        {key:'currency', label:'Currency'},
        {key:'review', label:'Reviews'},
        {key:'amenity', label:'Amenities'}    
    ],
    'activity' : [
        {key:'starrating', label:'Star Rate'},
        {key:'pricerange', label:'Price Range'},
        {key:'guestrating', label:'Guest Rate'},
        {key:'name', label:'Activity Name'},
        {key:'amenity', label:'Activity Type'},    
        // {key:'category', label:'Activity Type'},
        // {key:'type', label:'Type'},
        {key:'currency', label:'Currency'},
        {key:'review', label:'Reviews'},
    ],
    'package' : [
        {key:'starrating', label:'Star Rate'},
        {key:'pricerange', label:'Price Range'},
        {key:'guestrating', label:'Guest Rate'},
        {key:'name', label:'Package Name'},
        {key:'amenity', label:'Themes'},    
        {key:'currency', label:'Currency'},
        {key:'review', label:'Reviews'},
    ],
    'transfers' : [
        {key:'starrating', label:'Star Rate'},
        {key:'pricerange', label:'Price Range'},
        {key:'guestrating', label:'Guest Rate'},
        {key:'name', label:'Transfer Name'},
        {key:'category', label:'Transfer Type'},
        {key:'type', label:'Type'},
        {key:'currency', label:'Currency'},
        {key:'review', label:'Reviews'},
        {key:'amenity', label:'Transfer Type'}    
    ],
    'bus' : [
        {key:'pricerange', label:'Price Range'},
        {key:'guestrating', label:'Guest Rate'},
        {key:'operator', label:'Operator Name'},    
        {key:'vehiclenature', label:'Bus Type'},
        {key:'boardingpoint', label:'Boarding Point'},    
        {key:'droppingpoint', label:'Dropping Point'},    
        {key:'currency', label:'Currency'},
        {key:'timeslot', label:'Depart Time'},    
        {key:'review', label:'Reviews'},
    ],
    'air' : [
        {key:'starrating', label:'Star Rate'},
        {key:'pricerange', label:'Price Range'},
        {key:'guestrating', label:'Guest Rate'},
        {key:'name', label:'Flight Name'},
        {key:'category', label:'Flight Type'},
        {key:'type', label:'Type'},
        {key:'currency', label:'Currency'},
        {key:'review', label:'Reviews'},
        {key:'amenity', label:'Amenities'},    
        {key:'stops', label:'Stops'},    
        {key:'airline', label:'Airline'},    
        {key:'faretype', label:'Fare Type'},    
        {key:'departuretimeslot', label:'Departure Time'},    
        {key:'arrivaltimeslot', label:'Arrival Time'},    
    ],
    'vehicle' : [
        {key:'starrating', label:'Star Rate'},
        {key:'pricerange', label:'Price Range'},
        {key:'guestrating', label:'Guest Rate'},
        {key:'name', label:'Car Name'},
        {key:'category', label:'Car Type'},
        {key:'type', label:'Type'},
        {key:'currency', label:'Currency'},
        {key:'review', label:'Reviews'},
        {key:'passengers', label:'Passengers'},    
        {key:'transmissiontype', label:'Transmission Type'},    
        {key:'doors', label:'Doors'},   
        {key:'optionalextras', label:'Optional Extras'},   
    ],
}

var wordMapper = {
    'direct' : 'Direct',
    '1stop' : '1 Stop',
    '1plusstop' : '1+ Stop',
    'refundable' : 'Refundable',
    'nonrefundable' : 'Non-Refundable',
}

var commonFilterView = null
class FilterScreenC extends PureComponent {
    constructor(props) {
        super(props)
        let {business} = this.props
        let {result, status, searchData} = this.props[business];
        result = result||{}
        let _availableFiltersIndex = result.availableFiltersIndex?result.availableFiltersIndex[0].item:[]
        let appliedFiltersIndex = result.appliedFiltersIndex?result.appliedFiltersIndex[0].item:{}
        _availableFiltersIndex = JSON.parse(JSON.stringify(_availableFiltersIndex))
        appliedFiltersIndex = JSON.parse(JSON.stringify(appliedFiltersIndex))

        var availableFiltersIndex = _.sortBy(_availableFiltersIndex, o=>{
            var obj = filterMapper[business].find(f=>f.key == o.name)
            var pos = obj?filterMapper[business].indexOf(obj):100
            return pos
        })
        
        this.state = {
            availableFiltersIndex,
            appliedFiltersIndex,
            ratingFilter: [false, false, false, true, true],
            minPrice: 50,
            maxPrice: 1000,
            minRating: 2.5,
            maxRating: 9.3,
            hotelName: '',
            hotelTypes: [
                { title: 'Hotel', value: true },
                { title: 'Apartment', value: true }
            ],
            currencyIndex: 0,
            currencies:[
                'USD',
                'EUR',
                'SAR',
                'CNY',
                'USD1',
                'EUR1',
                'SAR1',
                'CNY1',
                'USD2',
                'EUR2',
                'SAR2',
                'CNY2',
                'USD3',
                'EUR3',
                'SAR3',
                'CNY3',
            ],
            reviews: [
                { title: 'Excellent', value: true },
                { title: 'Good', value: true },
                { title: 'Average', value: true },
                { title: 'Bad', value: true },
            ],
            animaties: [
                { title: 'Free Internet', value: true },
                { title: 'Free Parking', value: true }
            ],
        }

        commonFilterView = this
    }
    componentWillMount() {
        this.props.navigation.setParams({
            onRight: this.done,
            rightTitle: 'Apply',
            goBack:()=>{
                Actions.pop()
                // if ( this.props.business=='package' ) {
                //     setTimeout(()=>Actions.jump('Packages'),10)
                // }
            }
        });
    }

    getFilterName(filterName) {
        let {business} = this.props
        var mapper = filterMapper[business]||[]
        var obj = mapper.find((o)=>o.key==filterName)
        return obj?obj.label:filterName
    }

    getWord(key) {
        return wordMapper[key]||key
    }
    
    done() {
        let {business} = commonFilterView.props
        let {result, searchPageData} = commonFilterView.props[business]
        let {appliedFiltersIndex} = commonFilterView.state;
        let pageInfoIndex = searchPageData.request.pageInfoIndex || []
        if(pageInfoIndex[0]) {
            pageInfoIndex[0].item.currentPage = 0
        }

        searchPageData.request.filtersIndex[0] = {
            "code": "default",
            "sequence": 0,
            "properties": {},
            "item": appliedFiltersIndex,
            "config": [],
            "flags": {}
        }

        console.log('searchPageData', searchPageData)

        commonFilterView.props.actions[business].searchPage(searchPageData)

        Actions.pop()
        // if ( commonFilterView.props.business=='package' ) {
        //     setTimeout(()=>Actions.jump('Packages'),10)
        // }
    }
    renderStarRating(filter, index){
        let {appliedFiltersIndex, availableFiltersIndex} = this.state;
        let ratingFilterIndex = appliedFiltersIndex.find((o)=>o.name==filter.name)
        var ratingIndex = availableFiltersIndex.find(o=>o.name==filter.name).values.sort()
        var ratingFilter = ratingIndex.map((idx)=>ratingFilterIndex.values.indexOf(idx)!=-1)
        var that = this
        return (
            <RatingFilterBar
                key={index}
                title={this.getFilterName(filter.name)}
                values={ratingIndex}
                data={ratingFilter}
                onChanged={(index) => {
                    ratingFilter[index] = !ratingFilter[index]
                    ratingFilterIndex.values = []
                    ratingFilter.map((val, idx)=>{
                        if(val) {
                            ratingFilterIndex.values.push(ratingIndex[idx])
                        }
                    })

                    this.setState({appliedFiltersIndex})
                    this.forceUpdate()
                }}
            />
        )
    }
    renderCheckBox(filter, INDEX) {
        if(!filter.values || !filter.values[0]) return null

        let {appliedFiltersIndex} = this.state;
        let filterIndex = appliedFiltersIndex.find((o)=>o.name==filter.name)
        let indexes = filter.values
        var selectedFilters = indexes.map((idx)=>{
            return {
                title:this.getWord(idx),
                value:filterIndex.values.indexOf(idx)!=-1,
                origin:idx,
            }
        })

        //console.log('selectedFilters', selectedFilters)
        return (
        <SwitchEditor
            key={INDEX}
            title={this.getFilterName(filter.name)}
            value={selectedFilters}
            onChanged={index => {
                selectedFilters[index].value = !selectedFilters[index].value
                filterIndex.values = []
                selectedFilters.map((val, idx)=>{
                    if(val.value) {
                        filterIndex.values.push(val.origin)
                    }
                })

                this.setState({appliedFiltersIndex})
                this.forceUpdate()
            }}
        />)
    }
    renderRangeList(filter, INDEX) {
        if(!filter.minMaxList || filter.minMaxList.length == 0) return null

        let {appliedFiltersIndex} = this.state;
        let filterIndex = appliedFiltersIndex.find((o)=>o.name==filter.name)
        let indexes = filter.minMaxList
        var selectedFilters = indexes.map((item)=>{
            var exist = filterIndex.minMaxList.find(o=>o.minValue == item.minValue && o.maxValue == item.maxValue)
            return {
                title:`${item.minValue} - ${item.maxValue}`,
                value: exist?true:false,
                origin: item,
            }
        })

        //console.log('selectedFilters', selectedFilters)
        return (
        <SwitchEditor
            key={INDEX}
            title={this.getFilterName(filter.name)}
            value={selectedFilters}
            onChanged={index => {
                selectedFilters[index].value = !selectedFilters[index].value
                filterIndex.minMaxList = []
                selectedFilters.map((val, idx)=>{
                    if(val.value) {
                        filterIndex.minMaxList.push(val.origin)
                    }
                })

                this.setState({appliedFiltersIndex})
                this.forceUpdate()
            }}
        />)
    }
    renderRadio(filter, INDEX) {
        if(!filter.values || !filter.values[0]) return null

        let {appliedFiltersIndex} = this.state;
        let filterIndex = appliedFiltersIndex.find((o)=>o.name==filter.name)
        let index = filter.values.indexOf(filterIndex.defaultValue)
        var options = filter.values.map(o=>this.getWord(o))
        return (
            <RadioSelector
                key={INDEX}
                title={this.getFilterName(filter.name)}
                options={options}
                index={index}
                onChanged={(index) => {
                    filterIndex.defaultValue = filter.values[index]
                    filterIndex.values = [filterIndex.defaultValue]
                    this.setState({appliedFiltersIndex})
                    this.forceUpdate()
                }}
            />
        )
    }
    renderInput(filter, index) {
        let {appliedFiltersIndex} = this.state;
        let filterIndex = appliedFiltersIndex.find((o)=>o.name==filter.name)

        return (
            <InputFilter
                key={index}
                title={this.getFilterName(filter.name)}
                value={filterIndex.defaultValue||''}
                onChanged={(value) => {
                    filterIndex.defaultValue = value
                    this.setState({appliedFiltersIndex})
                    this.forceUpdate()
                }}
            />
        )
    }
    renderRange(filter, index) {
        let {appliedFiltersIndex} = this.state;
        let filterIndex = appliedFiltersIndex.find((o)=>o.name==filter.name)
        let minValue = Number(filter.minValue)
        let maxValue = Number(filter.maxValue)

        return (
            <RangeSelectBar
                key={index}
                step={(maxValue - minValue) > 1000?10:1}
                range={[minValue, maxValue]}
                minText={Global.currency + ' ' + Number(filterIndex.minValue).toFixed(0)}
                maxText={Global.currency + ' ' + Number(filterIndex.maxValue).toFixed(0)}
                value={[Number(filterIndex.minValue), Number(filterIndex.maxValue)]}
                onChanged={(minValue, maxValue) => {
                    filterIndex.minValue = minValue
                    filterIndex.maxValue = maxValue
                    this.setState({appliedFiltersIndex})
                    this.forceUpdate()
                }}
                title={this.getFilterName(filter.name)}
            />
        )
    }
    renderFilter(filter, index) {
        switch(filter.type) {
            case 'checkBox': 
                if(filter.name == 'starrating') {
                    return this.renderStarRating(filter, index)
                } else {
                    return this.renderCheckBox(filter, index)
                }
            case 'radio':
                return this.renderRadio(filter, index)
            case 'input':
                return this.renderInput(filter, index)
            case 'range':
                return this.renderRange(filter, index)
            case 'rangeList':
                return this.renderRangeList(filter, index)
        }

        return null;
    }
    render() {
        let {availableFiltersIndex} = this.state;

        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        availableFiltersIndex.map((filter, index)=>{
                            return this.renderFilter(filter, index)
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, activity, vehicle, transfers, air, bus, packages }) => 
({ hotel, activity, vehicle, transfers, air, bus, package:packages });

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

export default FilterScreen = connect(mapStateToProps, mapDispatchToProps)(FilterScreenC);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})