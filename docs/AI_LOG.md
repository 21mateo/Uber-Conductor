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
- Qué se usó / modificó / descartó: (escribe si cambiaste algo, por ejemplo colores o tamaños)
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
- Qué se usó / modificó / descartó: (escribe si cambiaste algo)
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
- Qué se usó / modificó / descartó: (escribe si cambiaste algo)
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
- Qué se usó / modificó / descartó: (escribe si cambiaste algo)
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
- Qué se usó / modificó / descartó: (escribe si cambiaste algo)
- Archivos y commit: src/context/AuthContext.js, src/hooks/useAuth.js, src/screens/LoginScreen.js, src/screens/PendingScreen.js, src/navigation/AppNavigator.js, src/navigation/RegisterTabs.js, src/screens/VehicleScreen.js, App.js — 8c93e3d
- Verificación: Login con errores, sesión persistente al cerrar la app, cambio de status en Firestore reflejado en tiempo real, cerrar sesión y registro nuevo que entra automáticamente.
- Aprendizaje: aqui aprende a usar una navegacion en donde el usuario ya una vez inicie sesion no se pueda devolver atras sin cerrar sesion 