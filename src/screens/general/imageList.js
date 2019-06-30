import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Device from '@common/device'
import { Actions } from 'react-native-router-flux';
import Color from '@common/color'
import ImagePlaceholder from '@components/general/react-native-image-placeholder'
import Marquee from '@components/general/react-native-text-ticker'

const {width:screenWidth} = Dimensions.get('window')

export default class ImageList extends PureComponent {
    state={
        index:0
    }

    changePage(index){
        this.setState({ index })
        this.refs.scroll.scrollTo({x:screenWidth*index, y:0, animated:true})
    }

    changedPage(e){
        let {contentOffset} = e.nativeEvent
        let index = Math.round(contentOffset.x/screenWidth)
        this.setState({index})
        let length = this.props.images.length
        if ( (length-index)*100 < screenWidth ) {
            this.refs.small.scrollToEnd({animated:true})
        }else{
            this.refs.small.scrollTo({x:index*100, y:0, animated:true})
        }
    }

    render() {
        let {index} = this.state
        let {images, defaultTitle} = this.props
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Marquee style={styles.imageTitle}>{images[index].title||defaultTitle}</Marquee>
                </View>
                <View style={styles.centerContainer}>
                    <ScrollView 
                        ref="scroll" 
                        horizontal 
                        pagingEnabled
                        onMomentumScrollEnd={e=>this.changedPage(e)}
                        showsHorizontalScrollIndicator={false} 
                    >
                        {images.map((image, idx) => 
                            <ImagePlaceholder 
                                key={idx} 
                                source={image.image} 
                                style={styles.centerImage} 
                            />
                        )}
                    </ScrollView>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.indexText}>{index+1}/{images.length}</Text>
                    <View style={styles.scrollContainer}>
                        <ScrollView ref="small" showsHorizontalScrollIndicator={false} horizontal style={styles.scroll}>
                            {images.map((image, idx) => <TouchableOpacity key={idx} onPress={() => this.changePage(idx)}>
                                <ImagePlaceholder 
                                    source={image.image} 
                                    style={[styles.bottomImage, { borderWidth: index == idx ? 1.5 : 0 }]} 
                                />
                            </TouchableOpacity>)}
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>Actions.pop()} style={styles.closeContainer}>
                    <Ionicons name="ios-close" size={30} color={'white'} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.darkText,
        paddingTop: Device.ToolbarHeight
    },
    closeContainer: {
        position: 'absolute',
        left: 15,
        top: Device.ToolbarHeight + 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    bottomContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-end',
        marginBottom:10
    },
    imageTitle: {
        color: 'white',
        fontSize: 20
    },
    centerImage: {
        resizeMode: 'cover',
        width:screenWidth,
        height:'100%'
    },
    indexText: {
        color: 'white',
        fontSize: 18
    },
    scroll: {
    },
    bottomImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderColor: 'white'
    },
    scrollContainer: {
        marginTop: 20,
        height: 100
    }
})