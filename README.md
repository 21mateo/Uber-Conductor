# UberClone — Versión Conductor 

Aplicación móvil hecha con **React Native + Expo** 
Proyecto final 


## Entrega 1 — Registro del conductor

- Registro dividido en pestañas con navegación Tab: **Datos personales** y **Vehículo** (la pestaña **Documentos** se implementa en la entrega 2).
- Validaciones de todos los campos con mensajes de error debajo de cada campo.
- El botón **Enviar registro** solo se habilita cuando las pestañas están completas y válidas.
- Fotos de perfil y del vehículo desde cámara o galería, subidas a **Cloudinary**.
- Datos guardados en **Firestore**; la cuenta queda en estado **Pendiente de aprobación**.
- Validación de correo, documento y placa repetidos.
- Rollback: si el registro falla a medias, se borra el usuario creado.
- Inicio de sesión, sesión persistente y cierre de sesión con **Firebase Auth**.
- Pantalla de estado de la cuenta que se actualiza en tiempo real (`onSnapshot`).

## Tecnologías

- React Native + Expo (Expo Go)
- React Navigation (Native Stack + Bottom Tabs)
- Firebase Authentication y Cloud Firestore
- Cloudinary (almacenamiento de imágenes)
- AsyncStorage (persistencia de la sesión)
- expo-image-picker, expo-file-system, @react-native-community/datetimepicker, @react-native-picker/picker

## Estructura del proyecto

src/
├── components/ Componentes reutilizables (InputField, SelectField, DateField, ImageField, PrimaryButton)
├── config/ Conexión a Firebase y Cloudinary
├── constants/ Opciones de las listas desplegables
├── context/ AuthContext (sesión) y RegisterContext (datos del registro)
├── hooks/ useAuth, useRegister, useImagePicker
├── navigation/ AppNavigator (Stack) y RegisterTabs (Tabs)
├── screens/ Pantallas de la app
├── services/ authService, driverService, imageService
├── theme/ Colores, espaciados y tipografía
└── utils/ Validaciones y traducción de errores

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/21mateo/Uber-Conductor.git
   cd uber-conductor
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear el archivo `.env` en la raíz copiando `.env.example` y llenar los valores (ver abajo).
4. Iniciar la app:
   ```bash
   npx expo start -c
   ```
5. Escanear el código QR con la app **Expo Go**.

## Variables de entorno

El archivo `.env` **no se sube al repositorio**. Usar `.env.example` como plantilla:

| Variable | Dónde se obtiene |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase → Configuración del proyecto → Tus apps (app web) |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Igual que la anterior |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Igual que la anterior |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Igual que la anterior |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Igual que la anterior |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Igual que la anterior |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary → Dashboard → Cloud name |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload presets (modo **Unsigned**) |

### Configuración de Firebase
- **Authentication:** habilitar el proveedor *Correo electrónico/contraseña*.
- **Firestore:** crear la base de datos y publicar las reglas de seguridad del proyecto.

### Aprobar un conductor (simulación)
En Firestore, colección `drivers`, cambiar el campo `status` de `pending` a `approved`. La app lo refleja en tiempo real.

## Uso de IA

Durante el desarrollo se usó IA como apoyo. Todo el uso está documentado en la bitácora:
👉 [docs/AI_LOG.md](docs/AI_LOG.md)