import React, {memo, useEffect, useRef} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface EditableTextProps {
  text: {
    id: string;
    value: string;
    x: number;
    y: number;
  };
  onUpdateText: (id: string, value: string) => void;
  onMoveText: (id: string, x: number, y: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

const EditableText = ({
  text,
  onUpdateText,
  onMoveText,
  onRemove,
  onDuplicate,
}: EditableTextProps) => {
  const pan = useRef(new Animated.ValueXY({x: text.x, y: text.y})).current;

  useEffect(() => {
    pan.setValue({x: text.x, y: text.y});
  }, [pan, text.x, text.y]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;

        pan.setOffset({
          x: currentX,
          y: currentY,
        });
        pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const x = (pan.x as any)._value;
        const y = (pan.y as any)._value;
        onMoveText(text.id, x, y);
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.textWrapper,
        {transform: [{translateX: pan.x}, {translateY: pan.y}]},
      ]}
      {...panResponder.panHandlers}>
      <TextInput
        style={styles.text}
        value={text.value}
        onChangeText={val => onUpdateText(text.id, val)}
        multiline
      />

      <View style={styles.actions}>
        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDuplicate}>
          <Text style={styles.actionText}>📄</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default memo(EditableText);

const styles = StyleSheet.create({
  textWrapper: {
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  text: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginHorizontal: 5,
  },
});
