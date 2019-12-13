import React, {Component} from "react";
import {View, Image, Text, StyleSheet, SafeAreaView, TouchableHighlight} from "react-native";
import {GiftedChat} from 'react-native-gifted-chat';
import {orderBy} from 'lodash';

export default class ChatScreen extends Component {

    static navigationOptions = {
        title: '저기요',
        headerBackTitle: '  ',
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const sb = navigation.getParam('sb');
        const channel = navigation.getParam('channel');
        const messageParams = navigation.getParam('messageParams');

        this.state = {
            sb,
            created: false,
            channel,
            messageParams,
            messageList: [],
            messages: [],
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            handleHeaderLeft: this._gotoMain
        });
    }

    componentWillUnmount() {
        console.log('component will unmount');
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

    _gotoMain = () => {
        this.props.navigation.navigate('Main');
    }

    _gotoHistory = () => {
        this.props.navigation.navigate('History');
    }

    onSend(messages = []) {
        let params = this.state.messageParams;
        params.message = messages[0].text;
        params.mentionType = 'users'; // Either 'users' or 'channel'

        //open channel 만들었는지 먼저 확인하고 메세지 보내기
        if (this.state.created) { //this.state.created
            this.state.channel.sendUserMessage(params, (message, error) => {
                if (error) {
                    return;
                }
    
                this.setState(previousState => ({
                    messages: GiftedChat.append(
                        previousState.messages,
                        this._generateMessage(message),
                    ),
                }));
            });
            console.log('created open channel checked.')
        } else {
            this.state.sb.OpenChannel.createChannel(params.message, null, null, null, null, (openChannel, error) => {
                if (error) {
                    console.log('channel error');
                } else {
                    console.log('channel ok');

                    openChannel.enter((response, error) => {
                        if (error) {
                            console.log(error);
                            return;
                        }
            
                        const messageListQuery = openChannel.createPreviousMessageListQuery();
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
                                `${openChannel.url}_RECEIVED_HANDLER`,
                                ChannelHandler,
                            );
                        
                            this.setState({messages});
                        });
                    });

                    openChannel.sendUserMessage(params, (message, error) => {
                        if (error) {
                            console.error('after create channel, send message error', error)
                            return;
                        }
                        console.log('message')
                        this.setState(previousState => ({
                            messages: GiftedChat.append(
                                previousState.messages,
                                this._generateMessage(message),
                            ),
                        }));
                    });

                    this.setState({channel: openChannel});
                    this.setState({created: true});
                }
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                { this.state.created &&
                    <TouchableHighlight onPress={this._gotoHistory} style={styles.historyArea}>
                        <View style={styles.temp}>
                        <View style={styles.historyHeader}>
                            <View style={styles.historyIcon}>
                                <Image source={require('../../img/history_30.png')} />
                            </View>
                            <Text style={styles.historyHeaderTitle}>History</Text>
                            <Text style={styles.historyDate}>2년전</Text>
                        </View>
                        <View style={styles.historyBody}>
                            <Text style={styles.historyTitle}>외국인이 한국에서 계좌를 개설하려면 어떻게 해야하나요?</Text>
                        </View>
                        </View>
                    </TouchableHighlight>
                }
                <View style={styles.messageArea}>
                    <GiftedChat
                        placeholder={'질문을 입력하세요.'}
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: 'UOS_EXPERTS_1',
                            name: 'TEST_1',
                        }}
                        locale="kr"
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    temp: {
        flex:1,
        flexDirection: 'column',
        
    },
    historyArea: {
        flex: 1,
        margin: 15,
        padding: 15,
        backgroundColor: '#C3C2C2'
    },
    historyHeader: {
        flex: 2,
        flexDirection: 'row',
    },
    historyIcon: {
        flex: 1,
    },
    historyHeaderTitle: {
        flex: 7,
        paddingTop: 2,
        fontSize: 18,
    },
    historyDate: {
        flex: 1,
    },
    historyBody: {
        flex: 1,
    },
    historyTitle: {
        flex: 1,
        fontSize: 15,
        justifyContent: 'center',
    },
    messageArea: {
        flex: 10,
    },
});