import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

import UserBanner from '../components/UserBanner';
import { useSession } from '../context/SessionContext';
import { createPatient, deletePatient, listPatients, updatePatient } from '../database/database';

const emptyForm = {
  nombre: '',
  edad: '',
  telefono: '',
  correo: '',
  direccion: '',
  fechaNacimiento: '',
};

const PacientesScreen = () => {
  const { colors } = useSession();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadPatients = useCallback(async () => {
    try {
      setPatients(await listPatients());
    } catch (error) {
      console.warn('Error cargando pacientes desde SQLite:', error);
      Alert.alert('SQLite', 'No se pudieron cargar los pacientes.');
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadPatients();
  }, [loadPatients]));

  const setField = (field, value) => setForm(current => ({ ...current, [field]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowDatePicker(false);
  };

  const formatDate = value => {
    if (!value) return '';
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-ES');
  };

  const parseDate = value => {
    if (!value) return new Date();
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  };

  const handleDateChange = (_event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    setField('fechaNacimiento', `${year}-${month}-${day}`);
  };

  const savePatient = async () => {
    if (!form.nombre.trim()) {
      Alert.alert('Validación', 'El nombre es obligatorio.');
      return;
    }

    const patient = {
      ...form,
      nombre: form.nombre.trim(),
      edad: form.edad ? Number.parseInt(form.edad, 10) : null,
    };

    try {
      if (editingId) await updatePatient(editingId, patient);
      else await createPatient(patient);
      resetForm();
      await loadPatients();
    } catch (error) {
      console.warn('Error guardando paciente en SQLite:', error);
      Alert.alert('SQLite', 'No se pudo guardar el paciente.');
    }
  };

  const editPatient = patient => {
    setEditingId(patient.id);
    setForm({
      nombre: patient.nombre || '',
      edad: patient.edad ? String(patient.edad) : '',
      telefono: patient.telefono || '',
      correo: patient.correo || '',
      direccion: patient.direccion || '',
      fechaNacimiento: patient.fecha_nacimiento || '',
    });
  };

  const removePatient = id => {
    Alert.alert('Confirmar', '¿Eliminar este paciente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePatient(id);
            await loadPatients();
          } catch (error) {
            console.warn('Error eliminando paciente de SQLite:', error);
            Alert.alert('SQLite', 'No se pudo eliminar el paciente.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.patientInfo}>
        <View style={styles.nameLine}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{item.nombre.charAt(0).toUpperCase()}</Text></View>
          <View style={styles.nameBlock}>
            <Text style={[styles.patientName, { color: colors.text }]}>{item.nombre}</Text>
            {item.edad ? <Text style={[styles.detail, { color: colors.secondaryText }]}>{item.edad} años</Text> : null}
          </View>
        </View>
        <View style={styles.detailsGrid}>
          {item.telefono ? <Text style={[styles.detail, { color: colors.secondaryText }]}>Tel. {item.telefono}</Text> : null}
          {item.correo ? <Text style={[styles.detail, { color: colors.secondaryText }]}>{item.correo}</Text> : null}
          {item.direccion ? <Text style={[styles.detail, { color: colors.secondaryText }]}>Dir. {item.direccion}</Text> : null}
          {item.fecha_nacimiento ? <Text style={[styles.detail, { color: colors.secondaryText }]}>Nac. {formatDate(item.fecha_nacimiento)}</Text> : null}
        </View>
      </View>
      <TouchableOpacity style={styles.smallBtn} onPress={() => editPatient(item)}>
        <Text style={styles.smallBtnText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => removePatient(item.id)}>
        <Text style={[styles.smallBtnText, { color: '#DC2626' }]}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <UserBanner />
      <View style={styles.headingRow}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Pacientes</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Gestiona la información local de la clínica</Text>
        </View>
        <View style={styles.countBadge}><Text style={styles.countText}>{patients.length}</Text><Text style={styles.countLabel}>total</Text></View>
      </View>

      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.formHeader}>
          <View>
            <Text style={[styles.formTitle, { color: colors.text }]}>{editingId ? 'Editar paciente' : 'Nuevo paciente'}</Text>
            <Text style={[styles.formHint, { color: colors.secondaryText }]}>Completa los datos principales</Text>
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={resetForm}>
            <Text style={styles.clearText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formRow}>
          <TextInput placeholder="Nombre completo" placeholderTextColor={colors.secondaryText} style={[styles.input, styles.flexInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} value={form.nombre} onChangeText={value => setField('nombre', value)} />
          <TextInput placeholder="Edad" placeholderTextColor={colors.secondaryText} style={[styles.input, styles.ageInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} value={form.edad} onChangeText={value => setField('edad', value)} keyboardType="numeric" />
        </View>
        <View style={styles.formRow}>
          <TextInput placeholder="Teléfono" placeholderTextColor={colors.secondaryText} style={[styles.input, styles.flexInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} value={form.telefono} onChangeText={value => setField('telefono', value)} keyboardType="phone-pad" />
          <TextInput placeholder="Correo electrónico" placeholderTextColor={colors.secondaryText} style={[styles.input, styles.flexInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} value={form.correo} onChangeText={value => setField('correo', value)} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View style={styles.formRow}>
          <TextInput placeholder="Dirección" placeholderTextColor={colors.secondaryText} style={[styles.input, styles.flexInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} value={form.direccion} onChangeText={value => setField('direccion', value)} />
          <TouchableOpacity style={[styles.dateButton, styles.flexInput, { backgroundColor: colors.input, borderColor: colors.border }]} onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.dateLabel, { color: form.fechaNacimiento ? colors.text : colors.secondaryText }]}>{form.fechaNacimiento ? formatDate(form.fechaNacimiento) : 'Fecha de nacimiento'}</Text>
            <Text style={styles.calendarIcon}>▣</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker ? <DateTimePicker value={parseDate(form.fechaNacimiento)} mode="date" display="default" maximumDate={new Date()} onChange={handleDateChange} /> : null}
        <View style={styles.actionRow}>
          {editingId ? <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}><Text style={styles.cancelText}>Cancelar edición</Text></TouchableOpacity> : <View />}
          <TouchableOpacity style={styles.addBtn} onPress={savePatient}>
            <Text style={styles.addBtnText}>{editingId ? 'Guardar cambios' : 'Agregar paciente'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.listTitle, { color: colors.text }]}>Pacientes registrados</Text>

      <FlatList data={patients} keyExtractor={item => String(item.id)} renderItem={renderItem} style={styles.list} ListEmptyComponent={<Text style={[styles.empty, { color: colors.secondaryText }]}>No hay pacientes guardados.</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 0.2 },
  subtitle: { fontSize: 14, marginTop: 5 },
  countBadge: { backgroundColor: '#E6F4F1', minWidth: 58, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, alignItems: 'center' },
  countText: { color: '#087EA4', fontSize: 20, fontWeight: '800' },
  countLabel: { color: '#087EA4', fontSize: 11, fontWeight: '600' },
  formCard: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 18 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  formTitle: { fontSize: 17, fontWeight: '800' },
  formHint: { fontSize: 12, marginTop: 3 },
  clearButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, backgroundColor: '#F1F5F9' },
  clearText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  input: { height: 44, borderWidth: 1, borderRadius: 9, paddingHorizontal: 11, fontSize: 14, marginRight: 8 },
  flexInput: { flex: 1 },
  ageInput: { width: 70 },
  dateButton: { height: 44, borderWidth: 1, borderRadius: 9, paddingHorizontal: 11, marginRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateLabel: { fontSize: 14 },
  calendarIcon: { color: '#087EA4', fontSize: 17 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  addBtn: { backgroundColor: '#0A4D68', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 9 },
  addBtnText: { color: '#FFFFFF', fontWeight: '600' },
  cancelBtn: { paddingVertical: 8 },
  cancelText: { color: '#0A4D68', fontWeight: '600' },
  listTitle: { fontSize: 17, fontWeight: '800', marginBottom: 9 },
  list: { marginTop: 0 },
  row: { borderWidth: 1, borderRadius: 14, padding: 13, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  patientInfo: { flex: 1 },
  nameLine: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#D9F0F2', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: '#0A4D68', fontSize: 16, fontWeight: '800' },
  nameBlock: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '700' },
  detailsGrid: { marginLeft: 48, marginTop: 5 },
  detail: { fontSize: 12, marginTop: 4 },
  smallBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 8, marginLeft: 8 },
  deleteBtn: { backgroundColor: '#FEE2E2' },
  smallBtnText: { color: '#0A4D68', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 24 },
});

export default PacientesScreen;
