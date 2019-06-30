import React from 'react';
import { Image, StatusBar, View, Text } from 'react-native'
import Marquee from '@components/general/react-native-text-ticker'

import Color from '@common/color';
import {
  home_grey,
  home_primary,
  mycart_grey,
  mycart_primary,
  hotdeal_primary,
  hotdeal_grey,
  package_grey,
  package_primary,
  profile_grey,
  profile_primary
} from '@common/image'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class TabBarIcon extends React.Component {
  render() {
    let {T2} = this.props.language
    let { name, focused, tabBarLabel } = this.props
    let image = ''
    if (name == 'ios-home') image = focused ? home_primary : home_grey
    if (name == 'ios-list') image = focused ? package_primary : package_grey
    if (name == 'ios-heart') image = focused ? hotdeal_primary : hotdeal_grey
    if (name == 'ios-notifications') image = focused ? mycart_primary : mycart_grey
    if (name == 'ios-contact') image = focused ? profile_primary : profile_grey
    return (
      <View style={{ alignItems: 'center' }}>
        <Image source={image} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
        <Marquee style={{ fontSize: 10, color:Color.lightText }} >
          {T2(tabBarLabel.toLowerCase()).toProperCase()}
        </Marquee>
      </View>
    )
  }
}
const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TabBarIcon);