import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import API from '../config';
import UserBanner from '../components/UserBanner';

const PacientesScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);

  useFocusEffect(useCallback(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/patients`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPatients(data);
      } catch (e) {
        console.warn('Error cargando pacientes desde backend:', e);
        Alert.alert('No se pudo cargar', `Verifica que el backend esté activo en ${API}`);
      }
    };
    load();
  }, []));

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addPatient = () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Nombre es requerido.');
      return;
    }
    const payload = { nombre: nombre.trim(), edad: edad ? parseInt(edad, 10) : null, telefono: telefono.trim(), correo: correo.trim() };

    if (editingId) {
      // actualizar
      fetch(`${API}/patients/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(r => r.json())
        .then(updated => {
          setPatients(prev => prev.map(p => (String(p._id || p.id) === String(editingId) ? updated : p)));
          setEditingId(null);
          setNombre('');
          setEdad('');
          setTelefono('');
          setCorreo('');
        })
        .catch(e => console.warn('Error actualizando paciente:', e));
    } else {
      // crear
      fetch(`${API}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(r => r.json())
        .then(created => {
          setPatients(prev => [created, ...prev]);
          setNombre('');
          setEdad('');
          setTelefono('');
          setCorreo('');
        })
        .catch(e => console.warn('Error creando paciente:', e));
    }
  };

  const removePatient = (id) => {
    Alert.alert('Confirmar', 'Eliminar paciente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        fetch(`${API}/patients/${id}`, { method: 'DELETE' })
          .then(() => setPatients(prev => prev.filter(p => p._id !== id && p.id !== id)))
          .catch(e => console.warn('Error eliminando paciente:', e));
      } },
    ]);
  };

  const renderItem = ({ item }) => {
    const displayName = item.name || item.nombre || item.patientName || item.patient || '';
    const displayAge = item.age || item.edad || '';
    const displayPhone = item.phone || item.telefono || item.phoneNumber || '';
    const displayEmail = item.email || item.correo || '';
    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>{displayName}</Text>
          {displayAge ? <Text style={styles.patientAge}>{displayAge} años</Text> : null}
          {displayPhone ? <Text style={styles.patientAge}>Tel: {displayPhone}</Text> : null}
          {displayEmail ? <Text style={styles.patientAge}>Email: {displayEmail}</Text> : null}
        </View>
        <TouchableOpacity style={styles.smallBtn} onPress={() => {
          setEditingId(item._id || item.id);
          setNombre(displayName);
          setEdad(String(displayAge || ''));
          setTelefono(displayPhone);
          setCorreo(displayEmail);
        }}>
          <Text style={styles.smallBtnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtn} onPress={() => navigation?.navigate('Historial', { patient: item })}>
          <Text style={styles.smallBtnText}>Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#FEE2E2' }]} onPress={() => removePatient(item._id || item.id)}>
          <Text style={[styles.smallBtnText, { color: '#DC2626' }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <UserBanner />
      <Text style={styles.title}>Pacientes</Text>
      <Text style={styles.subtitle}>Añadir y gestionar pacientes</Text>

      <View style={styles.formRow}>
        <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
        <TextInput placeholder="Edad" style={[styles.input, { width: 80 }]} value={edad} onChangeText={setEdad} keyboardType="numeric" />
        <TouchableOpacity style={styles.addBtn} onPress={addPatient}>
          <Text style={styles.addBtnText}>{editingId ? 'Guardar' : 'Agregar'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.formRow}>
        <TextInput placeholder="Teléfono" style={[styles.input, { flex: 1 }]} value={telefono} onChangeText={setTelefono} />
        <TextInput placeholder="Correo" style={[styles.input, { width: 200, marginLeft: 8 }]} value={correo} onChangeText={setCorreo} keyboardType="email-address" />
      </View>

      <FlatList data={patients} keyExtractor={i => String(i._id || i.id)} renderItem={renderItem} style={{ marginTop: 12 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#0F172A',
    marginRight: 8,
    flex: 1,
  },
  addBtn: {
    backgroundColor: '#0A4D68',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  patientAge: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  smallBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  smallBtnText: {
    color: '#0A4D68',
    fontWeight: '600',
  },
});

export default PacientesScreen;