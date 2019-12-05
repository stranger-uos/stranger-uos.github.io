import React, {Component} from 'react';
import {
  Alert,
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import SendBird from 'sendbird';

const APP_ID = '82E76688-E4BC-4396-B1E4-6472899044B9';
const USER_ID = 'UOS_EXPERTS_1';
const NICK_NAME = 'TEST_1';

function Item({data, onPress}) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.item}>
        <Text style={styles.title}>{data.name}</Text>
      </View>
    </TouchableHighlight>
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channelList: [],
    };

    this.sb = new SendBird({appId: APP_ID});
    this.sb.connect(USER_ID, (user, error) => {
      if (error) {
        console.error('connect', error);
      } else {
        this.sb.updateCurrentUserInfo(NICK_NAME, null, (response, error) => {
          if (error) {
            console.error('update user info :', error);
          }
        });
      }
    });
  }

  componentDidMount() {
    this._getOpenChannelList();
  }

  componentWillUnmount() {
    this.sb.disconnect();
  }


  _getOpenChannelList() {
    let openChannelListQuery = this.sb.OpenChannel.createOpenChannelListQuery();
    openChannelListQuery.next((openChannels, error) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log('Get channel list');
      this.setState({channelList: openChannels});
    });
  }

  _enterOpenChannel(url) {
    this.sb.OpenChannel.getChannel(url, (openChannel, error) => {
      if (error) {
        Alert.alert(error);
        return;
      }

      openChannel.enter((response, error) => {
        if (error) {
          return;
        }
        console.log(response)
      })
    })
  }

  render() {
    const data = this.state.channelList.map(v => {
      return {
        id: v.url,
        participantCount: v.participantCount,
        coverUrl: v.coverUrl,
        createdAt: v.createdAt,
        name: v.name,
      };
    });
    return (
      <SafeAreaView>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <Item data={item} onPress={() => this._enterOpenChannel(item.id)} />
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
