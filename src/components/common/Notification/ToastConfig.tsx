import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LauncherIcon from '../../../assets/icons/launcher_icon.svg';

const toastStyles = {
  success: {
    backgroundColor: '#55A430',
    borderColor: '#55A430',
  },
  info: {
    backgroundColor: '#1A84DA',
    borderColor: '#1A84DA',
  },
  warning: {
    backgroundColor: '#FFCF26',
    borderColor: '#FFCF26',
  },
  danger: {
    backgroundColor: '#DA251D',
    borderColor: '#DA251D',
  },
};

export const toastConfig = {
  success: ({ text1, text2 }: any) => renderToast('success', text1, text2),
  info: ({ text1, text2 }: any) => renderToast('info', text1, text2),
  warning: ({ text1, text2 }: any) => renderToast('warning', text1, text2),
  danger: ({ text1, text2 }: any) => renderToast('danger', text1, text2),
};

const renderToast = (type: keyof typeof toastStyles, text1: string, text2?: string) => {
  const { backgroundColor, borderColor} = toastStyles[type];

  return (
    <View style={[styles.toastContainer, { backgroundColor, borderLeftColor: borderColor }]}>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
      <LauncherIcon width={30} height={30}/>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 5,
    marginHorizontal: 10,
    marginTop: 10,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  text2: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
  },
});
