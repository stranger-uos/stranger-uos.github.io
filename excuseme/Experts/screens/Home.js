import React, {Component} from 'react';
import {
  TouchableHighlight,
  Image,
  Text,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import SendBird from 'sendbird';
import DeviceInfo from 'react-native-device-info';

const APP_ID = '82E76688-E4BC-4396-B1E4-6472899044B9';
const USER_ID = DeviceInfo.getUniqueId();
const NICK_NAME = 'TEST_1';
const sb = new SendBird({appId: APP_ID});

function Item({data, onPress}) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.item}>
        <View>
          <Image
            style={styles.image}
            source={{
              uri: data.coverUrl,
            }}
          />
        </View>
        <View>
          <Text style={styles.title}>{data.name}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

class Home extends Component {
  static navigationOptions = {
    title: '저기요?',
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
            console.error(error);
            return;
          }

          this.setState({channelList: openChannels, refreshing: false});
        });
      },
    );
  }

  _enterOpenChannel(url, name) {
    const {navigate} = this.props.navigation;

    sb.OpenChannel.getChannel(url, (openChannel, error) => {
      if (error) {
        console.error(error);
        Alert.alert(error);
        return;
      }

      navigate('OpenChannel', {
        sb,
        USER_ID,
        channel: openChannel,
        messageParams: new sb.UserMessageParams(),
      });
    });
  }

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
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <Item
              data={item}
              onPress={() => this._enterOpenChannel(item.id, item.name)}
            />
          )}
          keyExtractor={item => item.id}
          refreshing={this.state.refreshing}
          onRefresh={() => this._getOpenChannelList()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    padding: 10,
  },
  image: {
    borderRadius: 15,
    width: 50,
    height: 50,
    marginRight: 20,
  },
  title: {
    fontSize: 20,
  },
});

export default Home;

