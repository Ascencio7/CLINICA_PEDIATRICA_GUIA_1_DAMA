# SQLite local en la clínica pediátrica

## Preparar el entorno en VS Code

Desde la terminal integrada, en la carpeta del proyecto:

```bash
npm install
npx expo start
```

Para ejecutar en Android:

```bash
npx expo start --android
```

La dependencia instalada es `expo-sqlite`, compatible con Expo SDK 57. La base se crea automáticamente en el dispositivo con el nombre `clinica_pediatrica.db`.

## Ejercicio 1: ampliar la tabla

La tabla local `pacientes` se crea en `frontend/src/database/database.js` con estos campos:

- `nombre`
- `edad`
- `telefono`
- `correo`
- `direccion`
- `fecha_nacimiento`
- `created_at`

Los tres campos adicionales respecto al nombre y edad son `telefono`, `correo` y `direccion`; además se agregó `fecha_nacimiento`.

La pantalla `Pacientes` implementa las cuatro operaciones:

- Crear: botón `Agregar`.
- Leer: carga automática al entrar a la pantalla.
- Actualizar: botón `Editar` y luego `Guardar`.
- Eliminar: botón `Eliminar`.

## Ejercicio 2: consultar y visualizar la base

En la aplicación abre `Configuración > Consultar base SQLite`.

Esa pantalla consulta y muestra:

```sql
PRAGMA table_info(pacientes);
SELECT * FROM pacientes ORDER BY id DESC;
```

Así se puede comprobar el esquema y los registros sin extraer manualmente el archivo del dispositivo. Para inspección adicional desde VS Code se puede instalar una extensión como **SQLite Viewer** y abrir un archivo `.db` descargado del dispositivo o del emulador.

## Validación realizada

```bash
npx expo-doctor
npx expo export --platform android
```

Ambos comandos pasan correctamente en el proyecto actual.
