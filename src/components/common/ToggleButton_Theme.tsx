import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import SunIcon from '../../assets/icons/sun_icon.svg';
import SunBackgroundIcon from '../../assets/icons/sun_background_icon.svg';
import MoonIcon from '../../assets/icons/moon_icon.svg';
import MoonBackgroundIcon from '../../assets/icons/moon_background_icon.svg';

interface ToggleButtonProps {
    value: boolean;
    onToggle: () => void;
}

const ToggleButton_Theme = ({ value, onToggle }: ToggleButtonProps) => {
    const circleAnim = useRef(new Animated.Value(value ? 0 : 1)).current;

    useEffect(() => {
        Animated.timing(circleAnim, {
            toValue: value ? 0 : 1,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = circleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [32, 4], // Circle bên phải (Moon) → trái (Sun)
    });

    return (
        <TouchableOpacity style={styles.wrapper} onPress={onToggle} activeOpacity={0.8}>
            {/* Nền động theo theme */}
            {value ? (
                <MoonBackgroundIcon width={60} height={32} style={styles.backgroundImage} />
            ) : (
                <SunBackgroundIcon width={60} height={32} style={styles.backgroundImage} />
            )}

            {/* Circle di chuyển và hiển thị icon */}
            <Animated.View style={[styles.circle, { transform: [{ translateX }] }]}>
                {value ? (
                    <MoonIcon width="100%" height="100%" />
                ) : (
                    <SunIcon width="100%" height="100%" />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: 60,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ToggleButton_Theme;
