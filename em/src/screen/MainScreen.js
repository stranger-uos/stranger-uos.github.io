import React, { Component } from "react";
import { View,
    Text,
    Image, 
    Button, 
    FlatList, 
    SafeAreaView, 
    TouchableHighlight,
    TouchableWithoutFeedback, 
    StyleSheet } from "react-native";
import SendBird from 'sendbird';

const APP_ID = '82E76688-E4BC-4396-B1E4-6472899044B9';
const USER_ID = 'UOS_EXPERTS_1';
const NICK_NAME = 'TEST1';
const sb = new SendBird({appId: APP_ID});

function ChatItem({data, onPress}) {
    return (
        <TouchableHighlight onPress={onPress}>
            <View style={styles.chatItem}>
                <View style={styles.chatItemL}>
                    <Image style={styles.expertImg}
                    source={{uri: data.coverUrl,}} />
                </View>
                <View style={styles.chatItemR}>
                    <Text style={styles.name}>{data.name}</Text>
                    {/*
                    <Text style={styles.createdAt}>{data.createdAt}</Text>
                    */}
                </View>
            </View>
      </TouchableHighlight>
    );
  }

export default class MainScreen extends Component {
    static navigationOptions = {
        title: '저기요',
        headerBackTitle: '  ',
    };

    constructor(props) {
        super(props);

        this.state = {
            channelList: [],
            refreshing: false,
        };

        sb.connect(USER_ID, (user, error) => {
            if (error) {
                console.error('connect', error);
            } else {
                sb.updateCurrentUserInfo(NICK_NAME, null, (response, error) => {
                    if (error) {
                        console.error('Update user info:', error);
                    }
                    console.log('connect process ok');
                });
            }
        });
    }

    componentDidMount() {
        this.props.initOpenChannelCreate;
        this._getOpenChannelList();
    }

    componentWillUnmount() {
        sb.disconnect();
    }

    _getOpenChannelList() {
        this.setState(
            {
                refreshing: true,
            },
            () => {
                let openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
                openChannelListQuery.next((openChannels, error) => {
                    if (error) {
                        console.error('open channel list', error);
                        return;
                    }
                    this.setState({channelList: openChannels, refreshing: false});
                });
            },
        );
    }

    _enterOpenChannel(url, name) {
        const {navigate} = this.props.navigation;
        console.log('url:', url);

        sb.OpenChannel.getChannel(url, (openChannel, error) => {
            if (error) {
                console.error('enter channel: ', error);
                return;
            }
            
            navigate('ChatRoom', {
                sb,
                USER_ID,
                channel: openChannel,
                messageParams: new sb.UserMessageParams(),
            });
        });
    }

    _startChat = () => {
        this.props.navigation.navigate(
            'Chat',
            { sb: sb, messageParams: new sb.UserMessageParams()}
        );
    };

    render() {
        const data = this.state.channelList.map(v => {
            console.log(v);
            return {
                id: v.url,
                participantCount: v.participantCount,
                coverUrl: v.coverUrl,
                createdAt: v.createdAt,
                name: v.name,
            };
        });

        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    style={styles.chatList}
                    data={data}
                    renderItem={({item}) => (
                        <ChatItem
                            data={item}
                            onPress={() => this._enterOpenChannel(item.id, item.name)}
                        />
                    )}
                    keyExtractor={item => item.id}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._getOpenChannelList()}
                />
                <View style={styles.chatStart}>
                    <Button
                        style={styles.chatStartButton}
                        title='새 질문 시작하기'
                        onPress={this._startChat}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    chatList: {
        flex: 3,
        flexDirection: 'column',
    },
    chatItem: {
        flexDirection: 'row',
        height: 80,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    chatItemL: {
        flex: 2,
        padding: 10,
        paddingTop: 15,
        alignItems: 'center',
    },
    expertImg: {
        width: 50,
        height: 50,
    },
    chatItemR: {
        flex: 8,
        flexDirection: 'column',
    },
    name: {
        flex: 1,
        color: 'black',
        fontSize: 16,
        width: 275,
        paddingTop: 20,
    },
    createdAt: {
        justifyContent: 'flex-end',
        fontSize: 10,
        color: 'grey',
        textAlign: 'right',
        paddingRight: 10,
        paddingBottom: 15,
    },
    chatStart: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    chatStartButton: {
        position: 'absolute',
        bottom: 0,
    }
});
