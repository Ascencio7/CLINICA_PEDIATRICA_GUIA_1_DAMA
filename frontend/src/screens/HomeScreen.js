import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView 
} from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF4F6" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>¡Bienvenido Doctor(a)!</Text>
          <Text style={styles.title}>Clínica Pediátrica</Text>
          <Text style={styles.subtitle}>Panel de Control</Text>
        </View>

        {/* Menú Principal de Opciones en Grid Responsivo */}
        <View style={styles.menuGrid}>
          
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Pacientes')}
          >
            <Text style={styles.cardIcon}>👶</Text>
            <Text style={styles.cardTitle}>Pacientes</Text>
            <Text style={styles.cardSubtitle}>Expedientes e historial</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Citas')}
          >
            <Text style={styles.cardIcon}>📅</Text>
            <Text style={styles.cardTitle}>Citas</Text>
            <Text style={styles.cardSubtitle}>Agenda del día</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Perfil')}
          >
            <Text style={styles.cardIcon}>👨‍⚕️</Text>
            <Text style={styles.cardTitle}>Mi Perfil</Text>
            <Text style={styles.cardSubtitle}>Datos del médico</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Configuracion')}
          >
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardTitle}>Ajustes</Text>
            <Text style={styles.cardSubtitle}>Configuración general</Text>
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
    fontSize: 15,
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