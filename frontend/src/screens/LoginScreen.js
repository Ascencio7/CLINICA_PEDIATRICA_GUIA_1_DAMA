import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../context/SessionContext';

const LoginScreen = ({ navigation }) => {
  const { setUserName, colors } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      alert("Por favor ingresa usuario y contraseña.");
      return;
    }
    
    setUserName(username.trim());

    if (navigation) {
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          
          {/* Logo / Encabezado */}
          <View style={styles.header}>
            <Text style={styles.title}>Clínica Pediátrica</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Ingresa tus credenciales de acceso</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.text }]}>Usuario</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} 
              onChangeText={setUsername} 
              value={username} 
              placeholder="Ej. dr_ascencio"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} 
              onChangeText={setPassword} 
              value={password} 
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />

            <TouchableOpacity 
              style={styles.button} 
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBF4F6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#0A4D68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A4D68',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0A4D68',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;