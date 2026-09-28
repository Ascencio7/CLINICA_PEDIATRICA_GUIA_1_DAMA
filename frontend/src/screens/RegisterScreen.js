import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import API from '../config';
import { useSession } from '../context/SessionContext';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario: username.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || 'No se pudo registrar el usuario.');

      alert('Usuario registrado. Ahora puedes iniciar sesión.');
      navigation.replace('Login');
    } catch (error) {
      alert(error.message || 'No se pudo registrar el usuario.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Regístrate para acceder a la clínica</Text>
          </View>

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

            <Text style={[styles.label, { color: colors.text }]}>Confirmar contraseña</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchButton} onPress={() => navigation.goBack()}>
              <Text style={styles.switchText}>Ya tengo una cuenta: iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#0A4D68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0A4D68' },
  subtitle: { fontSize: 14, marginTop: 4 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
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
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  switchButton: { alignItems: 'center', marginTop: 18 },
  switchText: { color: '#0A4D68', fontSize: 14, fontWeight: '600' },
});

export default RegisterScreen;