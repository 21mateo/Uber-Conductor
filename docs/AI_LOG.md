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
- Archivos y commit: src/config/firebaseConfig.js, .env.example, src/theme/colors.js, src/constants/options.js — (hash)
- Verificación: Prueba de conexión desde App.js que creó un documento en la colección test de Firestore.
- Aprendizaje: Para qué sirve el .env, por qué se ignora en git y por qué Auth se inicializa con AsyncStorage para mantener la sesión.

### Entrada #2
- Fecha: 2026-11-01
- Integrante: Mateo Gonzalez
- Herramienta: Claude
- Objetivo: Crear las validaciones de los campos de las pestañas 1 y 2 del registro
- Prompt: vamos a seguir con los validadores, aqui es mas analisis ese lo voy ahcer yo pero ayudame con cuales validadores el proyecto puede quedar bien conto y lo voy hacer para el registro del conductor y el del vehiculo te ire pasando lo que haga si etsa bien o me vas diciendo que correciones hago
- Resumen de la respuesta: Creó funciones puras que devuelven el mensaje de error de cada campo ('' si es válido), una función para validar cada pestaña completa y hasErrors para habilitar el botón de enviar.
- Qué se usó / modificó / descartó: Se usó el archivo completo. Se quitó la validación de idioma.
- Archivos y commit: src/utils/validators.js — (hash)
- Verificación: Casos probados: nombre con números, cédula de 5 dígitos, persona de 17 años, placa "abc 123", XL con 4 pasajeros, correo sin dominio.
- Aprendizaje: Uso de expresiones regulares y cómo calcular la edad comparando año, mes y día.