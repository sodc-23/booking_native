import React, { PureComponent } from 'react'
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  ScrollView,
  NativeModules,
  findNodeHandle
} from 'react-native'
import PropTypes from 'prop-types'

const { UIManager } = NativeModules

export default class TextMarquee extends PureComponent {

  static propTypes = {
    style:             Text.propTypes.style,
    duration:          PropTypes.number,
    loop:              PropTypes.bool,
    bounce:            PropTypes.bool,
    scroll:            PropTypes.bool,
    marqueeOnMount:    PropTypes.bool,
    marqueeDelay:      PropTypes.number,
    useNativeDriver:   PropTypes.bool,
    onMarqueeComplete: PropTypes.func,
    children:          PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    repeatSpacer:    PropTypes.number,
    easing:          PropTypes.func
  }

  static defaultProps = {
    style:             {},
    loop:              true,
    bounce:            true,
    scroll:            true,
    marqueeOnMount:    true,
    marqueeDelay:      0,
    useNativeDriver:   true,
    repeatSpacer:      50,
    easing:            Easing.ease
  }

  animatedValue = new Animated.Value(0)
  distance = null
  textRef = null
  containerRef = null

  state = {
    animating:    false,
    contentFits:  false,
    shouldBounce: false,
    isScrolling:  false,
    isLoading: true,
  }

  componentDidMount() {
    this.invalidateMetrics()
    const { marqueeDelay, marqueeOnMount } = this.props
    if (marqueeOnMount) {
      this.startAnimation(marqueeDelay)
    }
  }

  componentWillReceiveProps(next){
      if ( next.children != this.props.children ){
        this.stopAnimation();
        this.clearTimeout();
        setTimeout(()=>this.startAnimation(),100)
      }
  }

  componentWillUnmount() {
    this.stopAnimation();
    // always stop timers when unmounting, common source of crash
    this.clearTimeout();
  }

  startAnimation = (timeDelay) => {
    if (this.state.animating) {
      return
    }
    this.start(timeDelay)
  }

  animateScroll = () => {
    const {
      duration,
      marqueeDelay,
      loop,
      useNativeDriver,
      repeatSpacer,
      easing,
      children,
      onMarqueeComplete
    } = this.props
    this.setTimeout(() => {
      Animated.timing(this.animatedValue, {
        toValue:         -this.textWidth - repeatSpacer,
        duration:        duration || children.length * 150,
        easing:          easing,
        useNativeDriver: useNativeDriver
      }).start(({ finished }) => {
        if (finished) {
          if (onMarqueeComplete) {
            onMarqueeComplete()
          }
          if (loop) {
            this.animatedValue.setValue(0)
            this.animateScroll()
          }
        }
      })
    }, marqueeDelay)
  }

  animateBounce = () => {
    const {duration, marqueeDelay, loop, useNativeDriver, easing, children} = this.props
    this.setTimeout(() => {
      Animated.sequence([
        Animated.timing(this.animatedValue, {
          toValue:         -this.distance - 10,
          duration:        duration || children.length * 50,
          easing:          easing,
          useNativeDriver: useNativeDriver
        }),
        Animated.timing(this.animatedValue, {
          toValue:         10,
          duration:        duration || children.length * 50,
          easing:          easing,
          useNativeDriver: useNativeDriver
        })
      ]).start(({finished}) => {
        if (loop) {
          this.animateBounce()
        }
      })
    }, marqueeDelay)
  }

  start = async (timeDelay) => {
    this.setState({ animating: true })
    this.setTimeout(async () => {
      await this.calculateMetrics()
      if (!this.state.contentFits) {
        if (this.state.shouldBounce && this.props.bounce) {
          this.animateBounce()
        } else {
          this.animateScroll()
        }
      }
    }, 100)
  }

  stopAnimation() {
    this.animatedValue.setValue(0)
    this.setState({ animating: false, shouldBounce: false })
  }

  async calculateMetrics() {
    return new Promise(async (resolve, reject) => {
        let myInterval = setInterval(() => {
          if ( this.scrollWidth && this.contentWidth ){
            this.containerWidth = this.scrollWidth
            this.textWidth = this.contentWidth
            this.distance = this.contentWidth - this.scrollWidth
    
            this.setState({
              contentFits:  this.distance <= 1,
              shouldBounce: this.distance < this.scrollWidth && this.distance > 1
            })
            clearInterval(myInterval)
            resolve([])
          }
        }, 20);
    })
  }

  invalidateMetrics = () => {
    this.distance = null
    this.setState({ contentFits: false })
  }

  clearTimeout() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  setTimeout(fn, time = 0) {
    this.clearTimeout()
    this.timer = setTimeout(fn, time)
  }

  onScroll = () => {
    this.clearTimeout()
    this.setState({ isScrolling: true })
    this.animatedValue.setValue(0)
    this.setTimeout(() => {
      this.setState({ isScrolling: false })
      this.start()
    }, this.props.marqueeDelay || 3000)
  }

  render() {
    const { style, children, repeatSpacer, scroll, ... props } = this.props
    const { animating, contentFits, isScrolling } = this.state
    return (
      <View style={[styles.container]}>
        <Text
          {...props}
          numberOfLines={1}
          style={[style, { opacity: animating ? 0 : 1 }]}
        >
          {this.props.children}
        </Text>
        <ScrollView
          ref={c => (this.containerRef = c)}
          horizontal
          scrollEnabled={scroll ? !this.state.contentFits : false}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          showsHorizontalScrollIndicator={false}
          style={StyleSheet.absoluteFillObject}
          display={animating ? 'flex' : 'none'}
          onContentSizeChange={() => this.calculateMetrics()}
          onLayout={({nativeEvent:{layout:{width}}})=>this.scrollWidth = width}
        >
          <Animated.Text
            onLayout={({nativeEvent:{layout:{width}}})=>this.contentWidth = width}
            ref={c => (this.textRef = c)}
            numberOfLines={1}
            {... props}
            style={[style, { transform: [{ translateX: this.animatedValue }], width: null }]}
          >
            {this.props.children}
          </Animated.Text>
          {!contentFits && !isScrolling
            ? <View style={{ paddingLeft: repeatSpacer }}>
              <Animated.Text
                numberOfLines={1}
                {... props}
                style={[style, { transform: [{ translateX: this.animatedValue }], width: null }]}
              >
                {this.props.children}
              </Animated.Text>
            </View> : null }
        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  }
})

