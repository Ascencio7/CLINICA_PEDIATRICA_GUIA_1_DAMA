import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import UserBanner from '../components/UserBanner';
import { useSession } from '../context/SessionContext';
import { inspectDatabase } from '../database/database';

const DatabaseScreen = () => {
  const { colors } = useSession();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const loadDatabase = useCallback(async () => {
    const result = await inspectDatabase();
    setColumns(result.columns);
    setRows(result.rows);
  }, []);

  useFocusEffect(useCallback(() => {
    loadDatabase().catch(error => console.warn('Error inspeccionando SQLite:', error));
  }, [loadDatabase]));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={loadDatabase} />}
    >
      <UserBanner />
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Base SQLite</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Tabla pacientes · {rows.length} registros</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={loadDatabase}>
          <Text style={styles.refreshText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Esquema consultado</Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {columns.map(column => (
          <View key={column.name} style={[styles.columnRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.columnName, { color: colors.text }]}>{column.name}</Text>
            <Text style={[styles.columnType, { color: colors.secondaryText }]}>{column.type || 'TEXT'}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>SELECT * FROM pacientes</Text>
      {rows.map(row => (
        <View key={row.id} style={[styles.card, styles.record, { backgroundColor: colors.surface }]}>
          <Text style={[styles.recordTitle, { color: colors.text }]}>#{row.id} · {row.nombre}</Text>
          <Text style={[styles.recordText, { color: colors.secondaryText }]}>{row.edad || '-'} años · {row.telefono || 'Sin teléfono'}</Text>
          <Text style={[styles.recordText, { color: colors.secondaryText }]}>{row.correo || 'Sin correo'} · {row.direccion || 'Sin dirección'}</Text>
          <Text style={[styles.recordText, { color: colors.secondaryText }]}>Nacimiento: {row.fecha_nacimiento || 'Sin fecha'}</Text>
        </View>
      ))}
      {!rows.length ? <Text style={[styles.empty, { color: colors.secondaryText }]}>La consulta no devolvió registros.</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 6 },
  refreshButton: { backgroundColor: '#0A4D68', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  refreshText: { color: '#FFFFFF', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 22, marginBottom: 8 },
  card: { borderRadius: 10, padding: 12 },
  columnRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  columnName: { fontWeight: '600' },
  columnType: { textTransform: 'uppercase' },
  record: { marginBottom: 10 },
  recordTitle: { fontSize: 15, fontWeight: '700' },
  recordText: { fontSize: 12, marginTop: 5 },
  empty: { textAlign: 'center', marginTop: 16 },
});

export default DatabaseScreen;
