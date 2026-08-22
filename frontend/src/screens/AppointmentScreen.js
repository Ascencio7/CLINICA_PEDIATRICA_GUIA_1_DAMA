import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import API from '../config';
import UserBanner from '../components/UserBanner';
import { useSession } from '../context/SessionContext';

const AppointmentScreen = ({ navigation }) => {
  const { colors } = useSession();
  const [appointments, setAppointments] = useState([
    // se inicializa vacío y se carga desde AsyncStorage
  ]);

  useFocusEffect(useCallback(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/appointments`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (e) {
        console.warn('Error cargando citas desde backend:', e);
        Alert.alert('No se pudo cargar', `Verifica que el backend esté activo en ${API}`);
      }
    };
    load();
  }, []));

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addAppointment = () => {
    if (!nombre.trim() || !hora.trim()) {
      Alert.alert('Error', 'Nombre del paciente y hora son requeridos.');
      return;
    }
    // send spanish keys to backend
    const payload = { nombre: nombre.trim(), hora: hora.trim(), motivo: motivo.trim() };

    if (editingId) {
      fetch(`${API}/appointments/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(r => r.json())
        .then(updated => {
          setAppointments(prev => prev.map(a => (String(a._id || a.id) === String(editingId) ? updated : a)));
          setEditingId(null);
        })
        .catch(e => console.warn('Error actualizando cita:', e));
    } else {
      fetch(`${API}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(r => r.json())
        .then(created => setAppointments(prev => [created, ...prev]))
        .catch(e => console.warn('Error creando cita:', e));
    }

    setModalVisible(false);
    setNombre('');
    setHora('');
    setMotivo('');
  };

  const removeAppointment = (id) => {
    fetch(`${API}/appointments/${id}`, { method: 'DELETE' })
      .then(() => setAppointments(prev => prev.filter(a => a._id !== id && a.id !== id)))
      .catch(e => console.warn('Error eliminando cita:', e));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <UserBanner />
        <Text style={[styles.header, { color: colors.text }]}>Agenda de Citas</Text>

        <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Nueva Cita</Text>
        </TouchableOpacity>

        {appointments.filter(Boolean).map(item => {
          const displayTime = item.time || item.hora || '';
          const displayPatient = item.patientName || item.nombre || item.patient || '';
          const displayReason = item.reason || item.motivo || item.descripcion || '';
          const apptId = item._id || item.id;
          return (
              <View key={apptId} style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardLeft}>
                <Text style={styles.time}>{displayTime}</Text>
              </View>
                  <View style={styles.cardRight}>
                    <Text style={[styles.patient, { color: colors.text }]}>{displayPatient}</Text>
                    <Text style={styles.reason}>{displayReason}</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => {
                    setEditingId(apptId);
                    setNombre(displayPatient);
                    setHora(displayTime);
                    setMotivo(displayReason);
                    setModalVisible(true);
                  }}>
                    <Text style={[styles.deleteText, { color: '#0A4D68' }]}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => removeAppointment(apptId)}>
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </TouchableOpacity>
            </View>
          );
        })}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalWrap}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Crear Nueva Cita</Text>
              <TextInput placeholder="Nombre del paciente" style={styles.input} value={nombre} onChangeText={setNombre} />
              <TextInput placeholder="Hora (ej. 10:30)" style={styles.input} value={hora} onChangeText={setHora} />
              <TextInput placeholder="Motivo" style={styles.input} value={motivo} onChangeText={setMotivo} />

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#6B7280' }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#243A73' }]} onPress={addAppointment}>
                  <Text style={styles.modalBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  addButton: {
    backgroundColor: '#0A4D68',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  deleteText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  modalWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default AppointmentScreen;
