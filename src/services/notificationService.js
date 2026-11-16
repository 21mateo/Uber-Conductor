import * as Notifications from 'expo-notifications';

// Cómo se muestra la notificación cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Pide permiso para mostrar notificaciones. Devuelve true si lo dieron.
export const requestNotificationPermission = async () => {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch (error) {
    console.log('No se pudo pedir permiso de notificaciones:', error);
    return false;
  }
};

// Notificación local inmediata de una nueva solicitud de viaje
export const notifyNewRequest = async (request) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nueva solicitud de viaje',
        body: `Recogida: ${request.origin.address}`,
        sound: true,
      },
      trigger: null, // null = mostrarla de inmediato
    });
  } catch (error) {
    console.log('No se pudo mostrar la notificación:', error);
  }
};