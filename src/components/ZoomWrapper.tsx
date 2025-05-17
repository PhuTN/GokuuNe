import React from 'react';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
};

export default function ZoomWrapper({
  children,
  minScale = 1,
  maxScale = 4,
}: Props) {
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startScale: number}
  >({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = Math.max(
        minScale,
        Math.min(ctx.startScale * event.scale, maxScale),
      );
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={[{flex: 1}, animatedStyle]}>
        {children}
      </Animated.View>
    </PinchGestureHandler>
  );
}
