import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../context/SessionContext';

const HomeScreen = ({ navigation }) => {
  const { userName, colors, darkMode } = useSession();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <Text style={[styles.greeting, { color: darkMode ? '#7DD3FC' : '#088395' }]}>Bienvenido/a {userName}, a la</Text>
          <Text style={[styles.title, { color: darkMode ? '#BAE6FD' : '#0A4D68' }]}>Clínica Pediátrica</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Panel de Control</Text>
        </View>

        {/* Menú Principal de Opciones en Grid Responsivo */}
        <View style={styles.menuGrid}>
          
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Pacientes')}
          >
            <Text style={styles.cardIcon}>🗂️</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Pacientes</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>Expedientes e historial</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Citas')}
          >
            <Text style={styles.cardIcon}>📅</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Citas</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>Agenda del día</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Perfil')}
          >
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Mi Perfil</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>Datos del médico</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Configuracion')}
          >
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Ajustes</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>Configuración general</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Historial')}
          >
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Historial</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>Notas médicas</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBF4F6',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 19,
    color: '#088395',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0A4D68',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '48%', // Dos columnas limpias
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#0A4D68',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A4D68',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
});

export default HomeScreen;