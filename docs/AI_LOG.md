# Bitácora de uso de IA

### Entrada #1
- Fecha: 2026-10-31
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Planear la estructura del proyecto y configurar la conexión con Firebase
- Prompt: Necesio que me ayudes con un proyecto final de una materia de la universidad que se llama desarrollo movil que usamos javascript react native y expo para simular las aplicaciones el proyecto final es como parecido a la aplicacion de uber para conductor la profe nos paso el pdf con todo lo que debebe de llevaer y la primera netrega la tengo para la proxima semana en la primera entrega pidio dos cosas registro de conductor  
pestaña 1 y pestaña 2 la estructura que tenga eso que me guarde en la bd que me deje entrar que guarde imagen que quede bien guardada y mas cosas excepciones toda la cosa bien, la bd que se va usar en este proyecto es no relacional es firebase, la estructura del proyecto me gustaria hacerla como ella nos enseño y todo la cosa quiero que piense como ingeniero de muchos años de experiecia para pensar y todo eso si pero me vas ayudar a analizar el proyecto y decirme que puedo hacer los pasos y orientarme como estructurar el proyecto bien, primero podemos empezar con la estructura del proyecto y planear todo como podemos iniciar y despues nos vamos con la parte del config para conectar la bd los tabs la navegacion el theme para los colores los componentes los servicios para las api ya me preguntaras si tienes dudas de esto analiza el documento y empecemos a planear como podemos hacerlo para la primera entrega vamos paso a paso
- Resumen de la respuesta: Analizó el PDF del proyecto y propuso la estructura de carpetas (screens, components, hooks, services, config, context, navigation, theme, utils, constants), Firebase Auth + Firestore, Cloudinary para imágenes y variables de entorno con .env.
- Qué se usó / modificó / descartó: Se usó la estructura y firebaseConfig.js. Se creó un proyecto de Firebase nuevo sin Analytics. Se descartó el selector de idioma por indicación de la docente.
- Archivos y commit: src/config/firebaseConfig.js, .env.example, src/theme/colors.js, src/constants/options.js — 0504d14
- Verificación: Prueba de conexión desde App.js que creó un documento en la colección test de Firestore.
- Aprendizaje: Para qué sirve el .env, por qué se ignora en git y por qué Auth se inicializa con AsyncStorage para mantener la sesión.

### Entrada #2
- Fecha: 2026-11-01
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Crear las validaciones de los campos de las pestañas 1 y 2 del registro
- Prompt: vamos a seguir con los validadores, aqui es mas analisis ese lo voy ahcer yo pero ayudame con cuales validadores el proyecto puede quedar bien conto y lo voy hacer para el registro del conductor y el del vehiculo te ire pasando lo que haga si etsa bien o me vas diciendo que correciones hago
- Resumen de la respuesta: analizo funciones puras que devuelven el mensaje de error de cada campo ('' si es válido), una función para validar cada pestaña completa y hasErrors para habilitar el botón de enviar.
- Qué se usó / modificó / descartó: Se usó el archivo completo. Se quitó la validación de idioma.
- Archivos y commit: src/utils/validators.js — 78f7a4e
- Verificación: Casos probados: nombre con números, cédula de 5 dígitos, persona de 17 años, placa "abc 123", XL con 4 pasajeros, correo sin dominio.
- Aprendizaje: Uso de expresiones regulares y cómo calcular la edad comparando año, mes y día.

### Entrada #3
- Fecha: 2026-11-01
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Crear componentes reutilizables para el formulario de registro
- Prompt: Vamos con los componentes los quiero ahcer reutilizables porque asi nos enseño la docente y mas ordenado y menos lineas de codigo voy hacer el InputField el PrymaryButton y SelectField ya me diras que esta bien como debe de ir si hay un eror que tenga y me corriges voya pesnar hacer los componentes
- Resumen de la respuesta: analizo InputField (label, campo y error debajo), SelectField (lista desplegable con Picker) y PrimaryButton (con estado deshabilitado y de carga).
- Archivos y commit: src/components/InputField.js, SelectField.js, PrimaryButton.js — 2d58bfe
- Verificación: Prueba en App.js con campos vacíos, nombre con números y datos correctos.
- Aprendizaje: Uso de errores sin usar alert se ve mas profesional que los errores salga en rojito debajo del input 

### Entrada #4
- Fecha: 2026-11-01
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Crear los campos de fecha e imagen y el hook personalizado useImagePicker
- Prompt: ahora hare lso componentes para la camara fecha que son datefield imagefiled, el hook useimagepicker para entar ala galeria del telefono, lo voy a ir creando uno por uno y te voy apasndo si tenig probkemas con algo con un eroror y tu e corriges
- Resumen de la respuesta: analizo DateField (calendario con formato dd/mm/aaaa), el hook useImagePicker (permisos, cámara y galería) e ImageField (vista previa y botones de cámara y galería).
- Archivos y commit: src/components/DateField.js, src/components/ImageField.js, src/hooks/useImagePicker.js — 64cbe1f
- Verificación: Prueba en celular: fecha de menor de edad, foto desde cámara, foto desde galería y permiso negado.
- Aprendizaje: el uso de los hooks personalizados bien, como el datefield para android e ios la forma del calnedario

### Entrada #5
- Fecha: 2026-11-01
- Integrante: Mateo Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Compartir los datos del registro entre pestañas y construir la Pestaña 1
- Prompt: Aqui hare el screen personaldata con todos los campos tambien el useregister y el contextregister para que cada pestaña guardara sus datos con su propio useState para que cada vez que el conductor llene la pestaña 1, pasa a la 2 y luego vuelve a la 1. Como algunos datos se pierden al cambiar de pantalla, tendría que volver a escribirlos. para eso se crea el context para que todoq uede guardado ahi mismo
- Resumen de la respuesta: analizo RegisterContext (datos de ambas pestañas, errores con useMemo, funciones con useCallback y campos "tocados"), el hook useRegister y la pantalla PersonalDataScreen.
- Archivos y commit: src/context/RegisterContext.js, src/hooks/useRegister.js, src/screens/PersonalDataScreen.js — 78d70cf
- Verificación: Errores solo en campos tocados, todos los errores al tocar Siguiente, contraseñas distintas y formulario completo válido.
- Aprendizaje: uso del context y use callback bien, la diferencia entre este con el usememo 

### Entrada #6
- Fecha: 2026-11-01
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Guardar el registro del conductor en Firebase con imágenes en Cloudinary y manejo de errores
- Prompt: No me quiere guardar las imagenes en claudinary, emepece a crear el imageservice driverservice
- Resumen de la respuesta: miro imageService (subida a Cloudinary con FormData), authService, driverService (registro en 4 pasos con rollback si falla) y firebaseErrors (traducción de errores). Conectó el botón Enviar registro con estado de carga y mensaje de error.
- Archivos y commit: src/config/cloudinaryConfig.js, src/services/imageService.js, authService.js, driverService.js, src/utils/firebaseErrors.js, src/screens/VehicleScreen.js — 6d6b6c9
- Verificación: Registro correcto verificado en Auth, Firestore y Cloudinary. Errores probados: correo repetido, documento repetido, placa repetida, sin internet. Se verificó que el rollback borra el usuario.
- Aprendizaje: uso del rollback se entnedio emjor para que se sirve y porque se usa url para las foto en vez de bsa64

### Entrada #7
- Fecha: 2026-11-01
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Implementar login, sesión persistente, pantalla de pendiente de aprobación y cerrar sesión
- Prompt: voy hacer el loginscreen donde se permita loguear el usurio bien que salga mas abajo la del registro si no hay cuenta y que lo lleve la las 2 pestañas de registro tambien este context AuthContext
- Resumen de la respuesta: analizo AuthContext (onAuthStateChanged + onSnapshot con funciones de limpieza en useEffect), el hook useAuth, LoginScreen, PendingScreen y navegación condicional en AppNavigator. Agregó flecha para volver del registro al login.
- Archivos y commit: src/context/AuthContext.js, src/hooks/useAuth.js, src/screens/LoginScreen.js, src/screens/PendingScreen.js, src/navigation/AppNavigator.js, src/navigation/RegisterTabs.js, src/screens/VehicleScreen.js, App.js — 8c93e3d
- Verificación: Login con errores, sesión persistente al cerrar la app, cambio de status en Firestore reflejado en tiempo real, cerrar sesión y registro nuevo que entra automáticamente.
- Aprendizaje: aqui aprendi a usar una navegacion en donde el usuario ya una vez inicie sesion no se pueda devolver atras sin cerrar sesion 

### Entrada #8
- Fecha: 2026-11-06
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: ayudar a implementar la pestaña 3 de Documentos
- Prompt: voy a corregir el año del carro que debe ser 2026 + 1 y tanmbien a implementar la pestaña 3 que son los documentos que lleva la licencia el soat y tecno-mecanica si lo necesita el carro y lo demas
- Resumen de la respuesta:  el año máximo a año actual + 1. analizo la pestaña Documentos (licencia, SOAT, revisión técnico-mecánica según el año del vehículo, correo de Mercado Pago y términos con la comisión), CheckboxField, pricing.js, y movió el botón Enviar registro a la pestaña 3. El registro ahora sube y guarda los documentos.
- Archivos y commit: validators.js, pricing.js, DateField.js, CheckboxField.js, RegisterContext.js, PersonalDataScreen.js, VehicleScreen.js, DocumentsScreen.js, RegisterTabs.js, driverService.js — 387fa11
- Verificación: Año 2027 válido y 2028 inválido, revisión técnico-mecánica según el año, vencimientos solo futuros, términos obligatorios y registro completo con documentos en Firestore y Cloudinary.
- Aprendizaje: el uso para el calendario que no sirva fechas pasadas a las de hoy 

### Entrada #9
- Fecha: 2026-11-07
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Pantalla de inicio con mapa, Disponible/No disponible, ubicación en tiempo real y Drawer
- Prompt: Creare ya el inicio con el mapa un menu desplegable que va hacer el home donde este por el momento mi cuenta la foto el inicio con el mapa y la opcion de cerrar sesion
- Resumen de la respuesta: Analizo el hook useDriverLocation (watchPositionAsync con función de limpieza, guarda la ubicación cada 5 s), HomeScreen (mapa, interruptor solo para cuentas aprobadas, AsyncStorage para la última disponibilidad), MainDrawer (menú con perfil y cerrar sesión) y conectó el Drawer dentro del Stack.
- Qué se usó / modificó / descartó: Se eligió OSRM en vez de Google Directions para las rutas (gratis, sin tarjeta). (escribe si cambiaste algo más)
- Archivos y commit: src/hooks/useDriverLocation.js, src/services/driverService.js, src/screens/HomeScreen.js, src/navigation/MainDrawer.js, src/navigation/AppNavigator.js, App.js — 8e7e88a
- Verificación: Interruptor bloqueado con cuenta pendiente, ubicación guardada en Firestore mientras está disponible, seguimiento detenido al salir de la pantalla o pasar a No disponible, estado recuperado al reabrir la app.
- Aprendizaje: Utilizar librerias para ubicacion en tiempo real, y que sirva y no se desactive si se sale de la aplicacion o se cierra sin cerrar sesion y se cierra sesion se desactiva automaticamente

### Entrada 10
- Fecha: 2026-11-07
- Integrante: 10
- Herramienta: Claude
- Objetivo: Viaje en curso (recogida, pasajero a bordo, destino, finalizar), resumen del cobro y pago en efectivo
- Prompt: Ya en esta parte del proyecto voy hacer el screen del viaje en curso la recogida del pasajero para que me salga el punto en el mapa de su ubicacion para ir a recogerlo y despues el de pasajero a bordo que salga ya la direccion de donde hay que llevarlo el destino hacia donde va y ya por ultimo el finalizar el vieja en donde ya es el pago y donde se llega al destino final, aqui se voy a ayudar mucho te aydua porque nunca he echo akgo asi los mapas y con OSRM entonces quiero que me guies mucho en esta fase y tambien si me quieres ayudar con el codigo o modificandolo te dejo
- Resumen de la respuesta: Creó routeService (OSRM), ActiveTripContext y useActiveTrip (viaje activo con useContext), TripScreen (dos fases con Polyline), TripSummaryScreen (tarifa, comisión, ganancia y estado del pago), funciones de estados en tripService, pago en efectivo con writeBatch e increment, y navegación condicional por estado del viaje. Corrigió que el registro no se desmonte al crearse el usuario.
- Archivos y commit: routeService.js, tripService.js, ActiveTripContext.js, useActiveTrip.js, TripScreen.js, TripSummaryScreen.js, AppNavigator.js, App.js, HomeScreen.js, simulateRequest.mjs — 3be02a2
- Verificación: Flujo completo accepted → driver_arriving → in_progress → completed → paid, cancelación, viaje recuperado al reabrir la app y saldo descontado en efectivo.
- Aprendizaje: Ver como se conecta todo con google map para la direccion de la persona cuando se va a recogerlo y despues llevarlo a su destino 