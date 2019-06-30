import React from 'react'

import {
    View,
    StyleSheet
} from 'react-native'

import {
    DateItem,
    DescItem,
    DropBoxItem,
    MobileNumItem,
    OrangeTitle,
    LeftSwitchItem,
    RightSwitchItem,
    TextItem,
    TimeItem,
    TitleItem,
    TouchItem,
    CountryItem
} from './inputItems'

import UtilService from '@utils/utils'

function isValid(item){
    if ( !item.isMandatory ) return true
    if ( item.valid ) return item.valid(item.value)
    if ( item.value == null || item.value == '' ) return false

    // EMAIL
    if (item.validType == 'EMAIL' ) return UtilService.validateEmail(item.value)
    if ( typeof item.errorMsg == 'function') return (item.errorMsg(item.value)==null)

    // ZIPCODE
    return true
}

export default class BookingInput extends React.PureComponent {

    invalidItem(){
        return this.props.items.find(item=>!isValid(item))
    }

    componentWillMount(){
        this.props.onChange(this.props.items, -1, this.invalidItem())
    }

    onChange(value, item, index) {
        if (item.type == 'DROPBOX') {
            item.value = item.options[value];
            item.index = value;
        } else {
            item.value = value
        }
        if (item.onChange) item.onChange(value)
        this.props.onChange([...this.props.items], index, this.invalidItem())
    }

    renderItem(item, index) {
        let { showError } = this.props
        switch (item.type) {
            case 'DATE':
                return <DateItem key={index} {...item} onChange={value => this.onChange(value, item, index)} showError={showError} />
            case 'DESCRIPTION':
                return <DescItem key={index} {...item} />
            case 'DROPBOX':
                return <DropBoxItem key={index} {...item} onChange={value => this.onChange(value, item, index)} showError={showError} />
            case 'PHONE_NUMBER':
                return <MobileNumItem key={index} {...item} onChange={value => this.onChange(value, item, index)} showError={showError} />
            case 'ORANGE_TEXT':
                return <OrangeTitle key={index} {...item} />
            case 'LEFT_SWITCH':
                return <LeftSwitchItem key={index} {...item} onChange={value => this.onChange(value, item, index)} />
            case 'RIGHT_SWITCH':
                return <RightSwitchItem key={index} {...item} onChange={value => this.onChange(value, item, index)} />
            case 'TEXT':
                return <TextItem key={index} {...item} isError={!isValid(item)} onChange={value => this.onChange(value, item, index)} showError={showError} />
            case 'TIME':
                return <TimeItem key={index} {...item} onChange={value => this.onChange(value, item, index)} showError={showError} />
            case 'TOUCH':
                return <TouchItem key={index} {...item} showError={showError} />
            case 'COUNTRY':
                return <CountryItem key={index} {...item} onChange={value => this.onChange(value, item, index)} showError={showError} />
        }
    }
    render() {
        let { title, items, contentStyle } = this.props
        return (
            <View style={styles.container}>
                {title != null && <TitleItem title={title} />}
                <View style={[styles.content, contentStyle]}>
                    {items.map((item, index) => this.renderItem(item, index))}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {

    },
    content: {
        paddingHorizontal: 15,
        paddingVertical: 10
    }
})