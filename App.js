import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './src/config/firebaseConfig';

export default function App() {
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    try {
      await addDoc(collection(db, 'test'), {
        ok: true,
        createdAt: serverTimestamp(),
      });
      setMessage('Conectado a Firestore ✅');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={testConnection}>
        <Text style={styles.buttonText}>Probar conexión</Text>
      </Pressable>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  button: { backgroundColor: '#111827', padding: 14, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});