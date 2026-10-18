import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../context/SessionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config';

const LoginScreen = ({ navigation }) => {
  const { setUserName, setToken, colors } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para el control del diálogo modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setModalMessage("Por favor ingresa usuario y contraseña.");
      setModalVisible(true);
      return;
    }

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario: username.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Mensaje específico para cuando el usuario no existe en la base de datos de Atlas
        throw new Error(data.msg || 'El usuario no existe en la base de datos de la nube o las credenciales son incorrectas.');
      }

      if (!data.token) throw new Error('La respuesta no contiene un token de acceso.');

      await AsyncStorage.multiSet([
        ['token', data.token],
        ['userName', username.trim()],
      ]);
      setToken(data.token);
      setUserName(username.trim());
      navigation.replace('Private');
    } catch (error) {
      setModalMessage(error.message || 'No se pudo conectar con el servidor de la nube.');
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Clínica Pediátrica</Text>
              <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                Ingresa tus credenciales de acceso
              </Text>
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
              <View style={[styles.passwordContainer, { backgroundColor: colors.input, borderColor: colors.border }]}>
                <TextInput 
                  style={[styles.passwordInput, { color: colors.text }]} 
                  onChangeText={setPassword} 
                  value={password} 
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeText}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.switchText}>¿No tienes cuenta? Regístrate</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Diálogo Modal Personalizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Aviso del Sistema</Text>
            <Text style={[styles.modalMessage, { color: colors.secondaryText }]}>{modalMessage}</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#0A4D68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A4D68',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  eyeButton: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  eyeText: {
    color: '#0A4D68',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0A4D68',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchText: {
    color: '#0A4D68',
    fontSize: 13,
    fontWeight: '600',
  },
  // Estilos del Modal / Diálogo
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#0A4D68',
    width: '100%',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LoginScreen;