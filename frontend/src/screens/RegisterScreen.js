import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import API from '../config';
import { useSession } from '../context/SessionContext';

const { height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const { colors } = useSession();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para controlar el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const showAlertModal = (title, message, success = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsSuccess(success);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (isSuccess) {
      navigation.replace('Login');
    }
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlertModal('Atención', 'Por favor completa todos los campos del formulario.');
      return;
    }

    if (password.length < 6) {
      showAlertModal('Contraseña corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      showAlertModal('Error de validación', 'Las contraseñas ingresadas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario: username.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || 'No se pudo crear el usuario en la base de datos de la nube.');
      }

      showAlertModal('Registro exitoso', 'El usuario ha sido guardado en la base de datos. Ahora puedes iniciar sesión.', true);
    } catch (error) {
      showAlertModal('Error de Registro', error.message || 'No se pudo conectar con el servidor en la nube.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background || '#F8FAFC' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centerWrapper}>
            <View style={[styles.card, { backgroundColor: colors.surface || '#FFFFFF', borderColor: colors.border || '#E2E8F0' }]}>
              
              {/* Encabezado */}
              <View style={styles.header}>
                <Text style={styles.title}>Crear cuenta</Text>
                <Text style={[styles.subtitle, { color: colors.secondaryText || '#64748B' }]}>
                  Regístrate para acceder a la clínica pediátrica
                </Text>
              </View>

              {/* Formulario */}
              <View style={styles.form}>
                <Text style={[styles.label, { color: colors.text || '#0F172A' }]}>Usuario</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.input || '#F8FAFC', borderColor: colors.border || '#E2E8F0', color: colors.text || '#0F172A' }]}
                  onChangeText={setUsername}
                  value={username}
                  placeholder="Ej. dr_ascencio"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={[styles.label, { color: colors.text || '#0F172A' }]}>Contraseña</Text>
                <View style={[styles.passwordContainer, { backgroundColor: colors.input || '#F8FAFC', borderColor: colors.border || '#E2E8F0' }]}>
                  <TextInput
                    style={[styles.passwordInput, { color: colors.text || '#0F172A' }]}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeText}>
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.label, { color: colors.text || '#0F172A' }]}>Confirmar contraseña</Text>
                <View style={[styles.passwordContainer, { backgroundColor: colors.input || '#F8FAFC', borderColor: colors.border || '#E2E8F0' }]}>
                  <TextInput
                    style={[styles.passwordInput, { color: colors.text || '#0F172A' }]}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeText}>
                      {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  activeOpacity={0.8}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Registrarme</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => navigation.goBack()}
                  disabled={loading}
                >
                  <Text style={styles.switchText}>Ya tengo una cuenta: Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Diálogo Modal Flotante */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.surface || '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: colors.text || '#0F172A' }]}>{modalTitle}</Text>
            <Text style={[styles.modalMessage, { color: colors.secondaryText || '#64748B' }]}>{modalMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
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
  },
  centerWrapper: {
    flex: 1,
    minHeight: height * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#0A4D68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
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
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 14,
    paddingRight: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    paddingVertical: 0,
  },
  eyeButton: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  eyeText: {
    color: '#0A4D68',
    fontSize: 13,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#0A4D68',
    height: 48,
    borderRadius: 10,
    justify: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 6,
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
    justify: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;