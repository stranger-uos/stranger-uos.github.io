import React, {Component} from 'react';
import {Button} from 'react-native';

class OpenChannel extends Component {
  static navigationOptions = {
    title: 'hi',
  };

  constructor(props) {
    super(props);

    const {navigation} = this.props;
    const channel = navigation.getParam('channel');
    const messageParams = navigation.getParam('messageParams');

    this.state = {channel, params: messageParams};
    this.state.channel.enter((response, error) => {
      if (error) {
        console.log(error);
        return;
      }

      let params = this.state.params;
      console.log(params);
      params.message = 'Hello?'
      params.mentionType = 'users'; // Either 'users' or 'channel'
      params.mentionedUserIds = ['Jeff', 'Julia']; // Or mentionedUsers = Array<User>;
      params.metaArrayKeys = ['linkTo', 'itemType'];
      params.translationTargetLanguages = ['fe', 'de']; // French and German
      params.pushNotificationDeliveryOption = 'default'; // Either 'default' or 'suppress'

      this.state.channel.sendUserMessage(params, function(message, error) {
          if(error) {
              return;
          }

          console.log(message);
      })
    });
  }

  componentWillUnmount() {
    console.log('component will unmount');
    this.state.channel.exit(function(response, error) {
      if (error) {
        console.error(error);
      }
    });
  }

  render() {
    return <Button title="Go to Jane's profile" />;
  }
}

export default OpenChannel;
