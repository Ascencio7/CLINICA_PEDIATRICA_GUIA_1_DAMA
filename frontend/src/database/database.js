import * as SQLite from 'expo-sqlite';

let databasePromise;

const createDatabase = async () => {
  const database = await SQLite.openDatabaseAsync('clinica_pediatrica.db');

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      edad INTEGER,
      telefono TEXT,
      correo TEXT,
      direccion TEXT,
      fecha_nacimiento TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return database;
};

export const getDatabase = () => {
  if (!databasePromise) databasePromise = createDatabase();
  return databasePromise;
};

export const listPatients = async () => {
  const database = await getDatabase();
  return database.getAllAsync(
    'SELECT id, nombre, edad, telefono, correo, direccion, fecha_nacimiento FROM pacientes ORDER BY id DESC'
  );
};

export const createPatient = async patient => {
  const database = await getDatabase();
  const result = await database.runAsync(
    `INSERT INTO pacientes (nombre, edad, telefono, correo, direccion, fecha_nacimiento)
     VALUES (?, ?, ?, ?, ?, ?)`,
    patient.nombre,
    patient.edad || null,
    patient.telefono || null,
    patient.correo || null,
    patient.direccion || null,
    patient.fechaNacimiento || null
  );
  return result.lastInsertRowId;
};

export const updatePatient = async (id, patient) => {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE pacientes
     SET nombre = ?, edad = ?, telefono = ?, correo = ?, direccion = ?, fecha_nacimiento = ?
     WHERE id = ?`,
    patient.nombre,
    patient.edad || null,
    patient.telefono || null,
    patient.correo || null,
    patient.direccion || null,
    patient.fechaNacimiento || null,
    id
  );
};

export const deletePatient = async id => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM pacientes WHERE id = ?', id);
};

export const inspectDatabase = async () => {
  const database = await getDatabase();
  const columns = await database.getAllAsync('PRAGMA table_info(pacientes)');
  const rows = await database.getAllAsync('SELECT * FROM pacientes ORDER BY id DESC');
  return { columns, rows };
};
