import Slider from '@react-native-community/slider';
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from "../../asycnc_store/ThemeContext";

interface ToggleButtonProps {
    enable: boolean;
    volume: number;
    setVolume: (volume: number) => void;
    onToggle: () => void;
    label: string; // Adding a label prop for the setting
    Icon: React.FC<{ width: number; height: number }>;
}

const ToggleButton_Sound_Music = ({
    enable,
    volume,
    setVolume,
    onToggle,
    label,
    Icon
}: ToggleButtonProps) => {
    const circleAnim = useRef(new Animated.Value(enable ? 1 : 0)).current;

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        Animated.timing(circleAnim, {
            toValue: enable ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [enable]);

    const translateX = circleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 32], // Position from left to right
    });

    return (
        <View style={styles.container}>
            <View style={styles.rowContentAll}>
                <View style={styles.rowContent}>
                    <Icon width={30} height={30} />
                    {isDark ? (
                        <Text style={styles.labelDark}>{label} - {Math.round(volume*100)}%</Text>
                    ) : (
                        <Text style={styles.labelLight}>{label} - {Math.round(volume*100)}%</Text>
                    )}

                </View>
                <TouchableOpacity
                    style={styles.wrapper}
                    onPress={onToggle}
                    activeOpacity={0.8}
                >
                    {enable ? (
                        <LinearGradient
                            colors={['#6B50F6', '#CC8FED']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientContainer}
                        >
                            <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
                        </LinearGradient>
                    ) : (
                        <View style={styles.grayBackground}>
                            <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            {enable && (
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={volume * 100} // Scale back to 0 - 100 for the slider
                    onValueChange={(value) => setVolume(value / 100)} // Realtime volume change
                    onSlidingComplete={(value) => setVolume(value / 100)} // Finalize volume on release
                    minimumTrackTintColor="#6B50F6"
                    maximumTrackTintColor="#CC8FED"
                    thumbTintColor="#FFCF26"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    rowContentAll: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    labelLight: {
        fontSize: 16,
        color: '#000', // Adjust as needed
        marginLeft: 10
    },
    labelDark: {
        fontSize: 16,
        color: '#FFFFFF', // Adjust as needed
        marginLeft: 10,
    },
    wrapper: {
        width: 60,
        height: 32,
        borderRadius: 16,
    },
    gradientContainer: {
        flex: 1,
        borderRadius: 16,
        justifyContent: 'center',
    },
    grayBackground: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#ccc',
        justifyContent: 'center',
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        position: 'absolute',
    },
    slider: {
        marginTop: 10,
    },
});

export default ToggleButton_Sound_Music;