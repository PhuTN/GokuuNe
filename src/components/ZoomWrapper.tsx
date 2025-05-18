import React, { useEffect } from 'react';
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  isZoom?: boolean;
  minScale?: number;
  maxScale?: number;
};

export default function ZoomWrapper({
  children,
  isZoom = false,
  minScale = 1,
  maxScale = 4,
}: Props) {
  const scale = useSharedValue(isZoom ? 1.5 : 1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  // Size thực tế của nội dung (ví dụ bàn cờ)
  const contentWidth = 390;
  const contentHeight = 750;

  const onLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
    containerHeight.value = e.nativeEvent.layout.height;
  };

  const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
  };

  const pinchHandler = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startScale: number }
  >({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      if (!isZoom) return;
      const newScale = clamp(ctx.startScale * event.scale, minScale, maxScale);
      scale.value = newScale;
    },
  });

  const panHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      if (!isZoom) return;
      const scaledWidth = contentWidth * scale.value;
      const scaledHeight = contentHeight * scale.value;

      const maxTranslateX = Math.max(0, (scaledWidth - containerWidth.value) / 2);
      const maxTranslateY = Math.max(0, (scaledHeight - containerHeight.value) / 2);

      translateX.value = clamp(ctx.startX + event.translationX, -maxTranslateX, maxTranslateX);
      translateY.value = clamp(ctx.startY + event.translationY, -maxTranslateY, maxTranslateY);
    },
  });

  // Khi isZoom thay đổi → cập nhật scale và vị trí
  useEffect(() => {
    scale.value = withTiming(isZoom ? 1.5 : 1, { duration: 200 });
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
  }, [isZoom]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: contentWidth,
    height: contentHeight,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView onLayout={onLayout}>
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Animated.View style={animatedStyle}>
                {children}
              </Animated.View>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
