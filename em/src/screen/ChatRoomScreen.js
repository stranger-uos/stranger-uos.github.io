import React, {Component} from "react";
import { View, Image, Text, StyleSheet, SafeAreaView} from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import {orderBy} from 'lodash';

export default class ChatRoomScreen extends Component {

    static navigationOptions = {
        title: '저기요',
    };

    constructor(props) {
        super(props);
    
        const {navigation} = this.props;
        const sb = navigation.getParam('sb');
        const channel = navigation.getParam('channel');
        const messageParams = navigation.getParam('messageParams');
    
        this.state = {
            sb,
            channel,
            messageParams,
            messageList: [],
            messages: [],
        };
    }

    componentWillUnmount() {
        console.log('component will unmount');
        this.state.channel.exit(function(response, error) {
            if (error) {
            console.error('component unmount:', error);
            }
        });
    }

    _generateMessage(message) {
        let user = {
            _id: 'admin',
            name: 'admin',
            avatar: 'https://placeimg.com/140/140/any',
        };
    
        if (message.messageType === 'user') {
            user._id = message._sender.userId;
            user.name = message._sender.nickname;
        }
    
        let result = {
            _id: message.messageId,
            text: message.message,
            createdAt: new Date(message.createdAt),
            user,
        };

        return result;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            handleHeaderLeft: this._gotoMain
        });
    
        this.state.channel.enter((response, error) => {
            if (error) {
                console.log(error);
                return;
            }

            const messageListQuery = this.state.channel.createPreviousMessageListQuery();
            messageListQuery.load((messageList, error) => {
                if (error) {
                    return;
                }

                let messages = messageList.map((v, i) => this._generateMessage(v));
                messages = orderBy(messages, ['createdAt'], ['desc']);

                let ChannelHandler = new this.state.sb.ChannelHandler();

                ChannelHandler.onMessageReceived = (_, message) => {
                    this.setState(previousState => ({
                        messages: GiftedChat.append(
                            previousState.messages,
                            this._generateMessage(message),
                        ),
                    }));
                };

                this.state.sb.addChannelHandler(
                    `${this.state.channel.url}_RECEIVED_HANDLER`,
                    ChannelHandler,
                );
            
                this.setState({messages});
            });
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.pastBody}>
                    <Text style={styles.pastText}>이미 종료된 대화입니다.</Text>
                </View>
                <GiftedChat style={styles.messageArea}
                    messages={this.state.messages}
                    renderInputToolbar={() => null}
                    renderComposer={() => null}
                    minInputToolbarHeight={0}
                    user={{
                        _id: 'UOS_EXPERTS_1',
                        name: 'TEST_1',
                    }}
                    locale="kr"
                />
            </SafeAreaView>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    pastBody: {
        height: '7%',
        margin: 15,
        padding: 15,
        backgroundColor: '#C3C2C2'
    },
    pastText: {
        flex: 1,
        paddingTop: 2,
        fontSize: 16,
        alignContent: 'center'
    },
    messageArea: {
        flex: 2,
    },
});
