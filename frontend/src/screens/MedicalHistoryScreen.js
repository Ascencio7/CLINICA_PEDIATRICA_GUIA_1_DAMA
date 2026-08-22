import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import API from '../config';
import UserBanner from '../components/UserBanner';

const MedicalHistoryScreen = ({ route }) => {
  const patient = route?.params?.patient;

  const [records, setRecords] = React.useState([]);
  const [note, setNote] = React.useState('');

  useEffect(() => {
    const load = async () => {
      try {
        if (!patient || !patient._id && !patient.id) {
          setRecords([]);
          return;
        }
        const id = patient._id || patient.id;
        const res = await fetch(`${API}/history/${id}`);
        const data = await res.json();
        setRecords(data);
      } catch (e) {
        console.warn('Error cargando historial desde backend:', e);
      }
    };
    load();
  }, [patient]);

  const addNote = () => {
    if (!note.trim()) return;
    const id = patient._id || patient.id;
    fetch(`${API}/history/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: note.trim() }),
    })
      .then(r => r.json())
      .then(created => setRecords(prev => [created, ...prev]))
      .catch(e => console.warn('Error guardando nota:', e));
    setNote('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <UserBanner />
        <Text style={styles.header}>Historial Médico</Text>
        {patient ? <Text style={styles.subHeader}>Paciente: {patient.name || patient.nombre}</Text> : null}

        <View style={styles.addRow}>
          <TextInput placeholder="Agregar nota clínica" style={styles.input} value={note} onChangeText={setNote} />
          <TouchableOpacity style={styles.addNoteBtn} onPress={addNote}>
            <Text style={styles.addNoteText}>Añadir</Text>
          </TouchableOpacity>
        </View>

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
  subHeader: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  addNoteBtn: {
    marginLeft: 8,
    backgroundColor: '#0A4D68',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addNoteText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
