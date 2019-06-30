import React, {PureComponent} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    View
} from 'react-native'
import Color from '@common/color'
import Global from "@utils/global";
// const {T1, T2} = Global.Translate

export default class ScrollTabView extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            width:'60%',
            left:0,
        }
        this.ref = []
        this.scrollX = 0;
    }
    handleScroll=(event)=>{
        let {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent
        const rate = layoutMeasurement.width/contentSize.width
        this.scrollX = contentOffset.x
        this.setState({
            left: contentOffset.x*rate,
            width:rate*100+'%'
        })
    }
    containerLayout(){
        
        this.container.measure((fx, fy, wd, ht, px, py)=>{
            this.LEFT = px
        })
    }

    measureScollView(event){
        this.scrollWidth = event.nativeEvent.layout.width
    }

    clickItem(title, index){
        this.props.onPress(title, index)
        let next = index < this.props.titles.length-1?index+1:index
        let prev = index == 0?0:index-1

        this.ref[next].measure((fx,fy, wd, ht, px, py)=>{
            let x = wd+px+this.scrollX-this.LEFT
            if ( x > this.scrollWidth ) {
                this.scrollView.scrollTo({x:x-this.scrollWidth, y:0, animate:true})
            }
        })
        this.ref[prev].measure((fx,fy, wd, ht, px, py)=>{
            let x = px - this.LEFT
            if ( x<0 ) {
                this.scrollView.scrollTo({x:this.scrollX+x, y:0, animate:true})
            }
        })

        
    }
    render(){
        let {selected, titles, onPress} = this.props
        let {width, left} = this.state
        let {T2} = this.props.language
        return(
            <View onLayout={()=>this.containerLayout()} ref={e=>this.container=e} style={styles.container}>
                <ScrollView 
                    onLayout={(event) => this.measureScollView(event)} 
                    ref={e=>this.scrollView = e}
                    onScroll={this.handleScroll}
                    scrollEventThrottle={10}
                    horizontal 
                    style={styles.scroll} 
                    showsHorizontalScrollIndicator={false}>

                    {titles.map((title, index)=>(
                        <TouchableOpacity ref={e=>this.ref[index] = e} key={index} 
                            style={[styles.tabContainer, {backgroundColor:index==selected?'white':Color.tabBack}]} 
                            onPress={()=>this.clickItem(title, index)}>

                            <Text style={[styles.tabText, {color:index==selected?Color.orange:Color.tabText}]}>{T2(title.toLowerCase()).toUpperCase()}</Text>
                        </TouchableOpacity> 
                    ))}
                </ScrollView>
                <View style={styles.scrollIndicatorContainer}>
                    <View style={[styles.scrollIndicator, {width:width, left:left}]}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%'
    },
    scroll:{
        height:44,
    },
    tabContainer:{
        paddingHorizontal:10,
        justifyContent:'center',
        height:'100%',
        marginRight:1,
        minWidth:70
    },
    tabText:{
        fontSize:13,
        textAlign:'center'
    },
    scrollIndicatorContainer:{
        width:'100%',
        height:2,
        backgroundColor:Color.tabText,
        marginTop:1,
        overflow:'hidden'
    },
    scrollIndicator:{
        height:'100%',
        backgroundColor:Color.orange,
        width:'70%'
    }
})