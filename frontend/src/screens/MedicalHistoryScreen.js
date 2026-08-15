import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';

const MedicalHistoryScreen = ({ route }) => {
  // `route.params` puede contener el paciente seleccionado en una implementación real
  const records = [
    { id: 1, date: '2026-06-12', note: 'Control de crecimiento: parámetros normales.' },
    { id: 2, date: '2025-12-01', note: 'Vacunación completa según calendario.' },
    { id: 3, date: '2024-09-20', note: 'Consulta por fiebre, tratamiento ambulatorio.' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Historial Médico</Text>

        {records.map(r => (
          <View key={r.id} style={styles.recordCard}>
            <Text style={styles.recordDate}>{r.date}</Text>
            <Text style={styles.recordNote}>{r.note}</Text>
          </View>
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
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  recordDate: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  recordNote: {
    fontSize: 15,
    color: '#1E293B',
  },
});

export default MedicalHistoryScreen;
