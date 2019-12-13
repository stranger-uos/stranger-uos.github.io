import React, {Component} from "react";
import {Alert, StyleSheet} from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';

export default class HistoryScreen extends Component {

    static navigationOptions = {
        title: 'History',
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const sb = navigation.getParam('sb');
        const channel = navigation.getParam('channel');
        const messageParams = navigation.getParam('messageParams');

        this.state = {
            messages: [],
        };
    }
  
    componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: 2,
                    text: '궁금한게 있으시면 언제든지 찾아주세요!',
                    createdAt: new Date(Date.UTC(2017, 9, 2, 17, 55, 0)),
                    user: {_id: 2, name: 'Expert', avatar: 'https://placeimg.com/140/140/any'},
                },
                {
                    _id: 1,
                    text: '감사합니다!',
                    createdAt: new Date(Date.UTC(2017, 9, 2, 17, 51, 0)),
                    user: { _id: 1, name: 'User'},
                },
                {
                    _id: 2,
                    text: '첫번째로 필요한 것은 AA 서류인데, 이 서류는 구청에서 발급 받을 수 있습니다.\n그리고 다니고 계신 학교나 직장에서 B서류를 발급받아 오시면 됩니다.',
                    createdAt: new Date(Date.UTC(2017, 9, 2, 17, 35, 0)),
                    user: {_id: 2, name: 'Expert', avatar: 'https://placeimg.com/140/140/any'},
                },
                {
                    _id: 1,
                    text: '무슨 서류가 필요한거죠?',
                    createdAt: new Date(Date.UTC(2017, 9, 2, 17, 28, 0)),
                    user: { _id: 1, name: 'User'},
                },
                {
                    _id: 2,
                    text: '외국인이 한국에서 계좌를 개설하려면 몇가지 서류가 필요합니다.',
                    createdAt: new Date(Date.UTC(2017, 9, 2, 17, 27, 0)),
                    user: {_id: 2, name: 'Expert', avatar: 'https://placeimg.com/140/140/any'},
                },
                {
                    _id: 2,
                    text: '안녕하세요.\n한국에서 ㅁㅁ은행에 다니고 있는 00입니다.',
                    createdAt: new Date(Date.UTC(2017, 9, 2, 17, 25, 0)),
                    user: {_id: 2, name: 'Expert', avatar: 'https://placeimg.com/140/140/any'},
                },
                {
                    _id: 1,
                    text: '외국인이 한국에서 계좌를 개설하려면 어떻게 해야하나요?',
                    createdAt: new Date(Date.UTC(2017, 9, 2, 17, 20, 0)),
                    user: { _id: 1, name: 'User'},
                },
            ],
        })
    }

    renderInputToolbar(props){
        if (this.state.noinput == true) {
        } else {
            return(
                <InputToolbar {...props} />
            ); 
        }
    }
    
    al() {
        Alert.alert('History', '메세지를 입력할 수 없습니다.')
    }

    static navigationOptions = {
        headerTitle: 'History',
    };
    
    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                //onSend={messages => this.onSend(messages)}
                onSend={messages => this.al()}
                user={{
                _id: 1,
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
