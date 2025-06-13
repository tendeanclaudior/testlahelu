import React, {useCallback, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Button, Canvas, MemeSelector} from './components';

const App = () => {
  const [background, setBackground] = useState<string | null>(null);
  const [texts, setTexts] = useState<any[]>([]);

  const buttonPress = useCallback(
    (type: string, id: string) => {
      if (type === 'removeText') {
        setTexts(texts.filter(t => t.id !== id));
        return;
      }

      if (type === 'duplicateText') {
        const original = texts.find(t => t.id === id);

        if (original) {
          setTexts([
            ...texts,
            {
              ...original,
              id: Date.now().toString(),
              x: original.x + 20,
              y: original.y + 20,
            },
          ]);
        }
        return;
      }

      setTexts([
        ...texts,
        {id: Date.now().toString(), value: 'Edit me', x: 50, y: 50},
      ]);
    },
    [texts],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        {!background ? (
          <MemeSelector onSelect={uri => setBackground(uri)} />
        ) : (
          <>
            <Canvas
              backgroundUri={background}
              texts={texts}
              onUpdateText={(id, value) => {
                setTexts(texts.map(t => (t.id === id ? {...t, value} : t)));
              }}
              onMoveText={(id, x, y) => {
                setTexts(texts.map(t => (t.id === id ? {...t, x, y} : t)));
              }}
              onRemoveText={id => buttonPress('removeText', id)}
              onDuplicateText={id => buttonPress('duplicateText', id)}
            />

            <View style={styles.contentButton}>
              <Button
                title={'Add Text'}
                onPress={() => buttonPress('adText', '')}
              />
            </View>
          </>
        )}
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

export default App;

const styles = StyleSheet.create({
  contentButton: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
