import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {orderBy} from 'lodash';

class OpenChannel extends Component {
  static navigationOptions = {
    title: 'hi',
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
        console.error(error);
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

  onSend(messages = []) {
    let params = this.state.messageParams;
    params.message = messages[0].text;
    params.mentionType = 'users'; // Either 'users' or 'channel'

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
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 'UOS_EXPERTS_1',
          name: 'TEST_1',
        }}
        locale="kr"
      />
    );
  }
}

export default OpenChannel;
