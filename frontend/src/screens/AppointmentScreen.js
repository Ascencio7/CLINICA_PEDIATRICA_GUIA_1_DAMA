import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AppointmentScreen = ({ navigation }) => {
  const appointments = [
    { id: 1, time: '08:30', patient: 'María López', reason: 'Control de crecimiento' },
    { id: 2, time: '09:15', patient: 'Juan Pérez', reason: 'Vacunación' },
    { id: 3, time: '10:00', patient: 'Ana Gómez', reason: 'Consulta general' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Agenda de Citas</Text>

        {appointments.map(item => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
            <View style={styles.cardLeft}>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.patient}>{item.patient}</Text>
              <Text style={styles.reason}>{item.reason}</Text>
            </View>
          </TouchableOpacity>
        ))}

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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardLeft: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A4D68',
  },
  cardRight: {
    flex: 1,
  },
  patient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  reason: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
});

export default AppointmentScreen;
