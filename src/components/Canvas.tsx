import React, {memo} from 'react';
import {Dimensions, ImageBackground, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Button from './Button';
import EditableText from './EditableText';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const BOX_SIZE = 250;

const Canvas = ({
  backgroundUri,
  texts,
  onUpdateText,
  onMoveText,
  onRemoveText,
  onDuplicateText,
}: CanvasProps) => {
  const translateX = useSharedValue((screenWidth - BOX_SIZE) / 2);
  const translateY = useSharedValue((screenHeight - BOX_SIZE) / 2);
  const scale = useSharedValue(1);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(e => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      const newScale = e.scale * scale.value;
      if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
        scale.value = newScale;
      }
    })
    .onEnd(() => {
      if (scale.value < MIN_SCALE) {
        scale.value = MIN_SCALE;
      }

      if (scale.value > MAX_SCALE) {
        scale.value = MAX_SCALE;
      }
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <ImageBackground
            source={{uri: backgroundUri}}
            style={styles.image}
            resizeMode="cover"
          />

          {texts.map(text => (
            <EditableText
              key={text.id}
              text={text}
              onUpdateText={onUpdateText}
              onMoveText={onMoveText}
              onRemove={() => onRemoveText(text.id)}
              onDuplicate={() => onDuplicateText(text.id)}
            />
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={styles.contentButton}>
        <Button
          title="Zoom In"
          onPress={() => {
            scale.value = withTiming(scale.value + 0.1);
          }}
        />

        <Button
          title="Zoom Out"
          onPress={() => {
            scale.value = withTiming(scale.value - 0.1);
          }}
        />
      </View>
    </>
  );
};

export default memo(Canvas);

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#BBBBBB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentButton: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
