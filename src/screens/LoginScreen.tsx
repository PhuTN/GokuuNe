import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TextInputProps, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { accounts } from '../fake_data/Dien/fake_data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackIcon from '../assets/icons/back_icon.svg';
import LinearGradient from 'react-native-linear-gradient';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const passwordInputRef = useRef<TextInput>(null);

    const handleLogin = () => {
        const accountExist = accounts.find(account => account.username === username && account.password === password);

        if (accountExist) {
            Alert.alert('Success', 'Login successful!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home', { accountLogin: accountExist })
                }
            ]);
        } else {
            Alert.alert('Error', 'Invalid username or password!');
        }
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackIcon width={45} height={45} />
                </TouchableOpacity>
                <Text style={styles.headerText}>LOGIN</Text>
            </View>
    
            <View style={styles.body}>
                <Text style={styles.title}>Login</Text>
    
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
    
                <Text style={styles.label}>Password</Text>
                <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                />
    
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <LinearGradient
                            colors={["#6B50F6", "#CC8FED"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.button}
                          >
                            <Text style={styles.buttonText}>Confirm and Continue</Text>
                          </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );    
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 10,
        position: "relative",
    },
    backButton: {
        position: "absolute",
        left: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFC107",
        textAlign: "center",
    },
    body: {
        flex: 1,                
        justifyContent: "center",
        alignItems: "center",     
        width: "90%",           
        alignSelf: "center"
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
