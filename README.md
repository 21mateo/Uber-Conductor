# UberClone — Versión Conductor 

Aplicación móvil hecha con **React Native + Expo** inspirada en la app de Uber para conductores.
Proyecto final de la materia Desarrollo Móvil.

## Funcionalidades

1. **Registro del conductor** en 3 pestañas (Datos personales, Vehículo, Documentos) con validaciones debajo de cada campo. El botón *Enviar registro* solo se habilita cuando las tres pestañas son válidas. La cuenta queda en estado **Pendiente de aprobación**.
2. **Inicio de sesión** con sesión persistente y cierre de sesión.
3. **Disponible / No disponible** (solo con la cuenta aprobada) y ubicación en tiempo real cada 5 segundos.
4. **Solicitudes de viaje** en tiempo real con temporizador de 15 segundos para aceptar o rechazar.
5. **Viaje en curso:** ruta al punto de recogida, *Pasajero a bordo*, ruta al destino y finalizar.
6. **Cobro** con **Mercado Pago Checkout Pro** (modo prueba) o en **efectivo**.
7. **Cálculo de tarifa, comisión (20 %) y ganancia neta** con una sola función (`calculateFare`).
8. **Ganancias** de hoy, la semana y el mes, y **saldo** del conductor.
9. **Historial de carreras** con filtros (Hoy, Semana, Mes, Rango, método de pago), paginación de 20 y detalle con la ruta en el mapa.
10. **Perfil y configuración:** datos editables, vehículo y documentos.
11. **Navegación combinada:** Stack (flujo del viaje), Tabs (registro) y Drawer (inicio, ganancias, historial y perfil).


## Tecnologías

- React Native + Expo (Expo Go)
- React Navigation: Native Stack, Bottom Tabs y Drawer
- Firebase Authentication y Cloud Firestore (tiempo real con `onSnapshot`)
- Cloudinary (fotos de perfil, vehículo y documentos)
- react-native-maps y expo-location
- OSRM (rutas, distancia y duración) y Nominatim (direcciones) — gratuitos
- Mercado Pago Checkout Pro + backend en Node.js / Express
- AsyncStorage (sesión y última disponibilidad)

## Estructura

```
uber-conductor/
├── App.js
├── backend/            Servidor de pagos (Node + Express + Mercado Pago + Firebase Admin)
├── scripts/            Simulador del pasajero (crea solicitudes de viaje)
├── docs/AI_LOG.md      Bitácora de uso de IA
└── src/
    ├── components/     Componentes reutilizables
    ├── config/         Firebase, Cloudinary, backend y tarifas (pricing.js)
    ├── constants/      Opciones de listas
    ├── context/        AuthContext, RegisterContext y ActiveTripContext
    ├── hooks/          useDriverLocation, useTripRequests, useEarnings y otros
    ├── navigation/     AppNavigator, RegisterTabs y MainDrawer
    ├── screens/        Pantallas
    ├── services/       Auth, Firestore, imágenes, rutas, viajes y pagos
    ├── theme/          Colores y estilos
    └── utils/          Validaciones, tarifa, fechas y formatos
```

## Instalación

### 1. App

```bash
git clone <URL del repositorio>
cd uber-conductor
npm install
```

Crear el archivo `.env` en la raíz copiando `.env.example`:

| Variable | Dónde se obtiene |
|---|---|
| `EXPO_PUBLIC_FIREBASE_*` (6 variables) | Firebase → Configuración del proyecto → Tus apps (app web) |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary → Dashboard |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload presets (modo **Unsigned**) |
| `EXPO_PUBLIC_BACKEND_URL` | `http://<IP del PC>:3000` (el celular y el PC deben estar en la misma red) |

### 2. Backend de pagos

```bash
cd backend
npm install
```

- Crear `backend/.env` copiando `backend/.env.example` y poner el **Access Token de prueba** de Mercado Pago.
- Descargar la llave de Firebase (Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada), guardarla como `backend/serviceAccountKey.json`.
- **El `.env` y la llave no se suben al repositorio** (están en `.gitignore`).

### 3. Firebase

- **Authentication:** habilitar *Correo electrónico/contraseña*.
- **Firestore:** crear la base de datos. La primera vez que se abren *Ganancias* e *Historial*, Firestore pide crear dos índices compuestos de la colección `trips`; el link aparece en la terminal de Expo.

## Cómo correr el proyecto (3 terminales)

```bash
# Terminal 1 — la app
npx expo start -c

# Terminal 2 — el backend de pagos
cd backend
node server.js

# Terminal 3 — simular que un pasajero pide un viaje
node --env-file=.env scripts/simulateRequest.mjs
```

### Aprobar un conductor
En Firestore, colección `drivers`, cambiar `status` de `pending` a `approved`. La app lo refleja en tiempo real.

### Pago de prueba con Mercado Pago
Tarjeta **5254 1336 7440 3564**, CVV **123**, vencimiento **11/30**, documento **123456789**.
Nombre del titular: **APRO** (aprobado) u **OTHE** (rechazado).

## Uso de IA

Durante el desarrollo se usó IA como apoyo. Todo el uso está documentado en la bitácora:
👉 [docs/AI_LOG.md](docs/AI_LOG.md)