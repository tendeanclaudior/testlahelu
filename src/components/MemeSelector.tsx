import React, {memo, useCallback} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const memes = [
  require('../assets/jpeg/Meme1.jpeg'),
  require('../assets/jpeg/Meme2.jpeg'),
  require('../assets/jpeg/Meme3.jpeg'),
];

const MemeSelector = ({onSelect}: {onSelect: (uri: string) => void}) => {
  const selectedPress = useCallback(
    (value: string) => {
      onSelect(value);
    },
    [onSelect],
  );

  return (
    <View>
      <FlatList
        data={memes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => selectedPress(Image.resolveAssetSource(item).uri)}>
            <Image source={item} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default memo(MemeSelector);

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
  },
});
