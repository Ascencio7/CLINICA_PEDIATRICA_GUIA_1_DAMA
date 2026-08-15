import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Switch, TouchableOpacity, ScrollView } from 'react-native';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenHeader}>Ajustes del Sistema</Text>

        {/* Sección 1: Preferencias de la App */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Preferencias Generales</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Notificaciones de Citas</Text>
              <Text style={styles.settingSubtitle}>Recordatorios de la agenda diaria</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#CBD5E1', true: '#7C93C3' }}
              thumbColor={notifications ? '#243A73' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Modo Oscuro</Text>
              <Text style={styles.settingSubtitle}>Ajustar la paleta de interfaz</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#CBD5E1', true: '#7C93C3' }}
              thumbColor={darkMode ? '#243A73' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Sección 2: Seguridad y Sistema */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Seguridad y Cuenta</Text>

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <Text style={styles.actionTitle}>Cambiar Contraseña</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <Text style={styles.actionTitle}>Políticas de Privacidad Médica</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Cierre de Sesión */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  screenHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  chevron: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;