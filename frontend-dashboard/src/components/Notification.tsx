import { Component, createSignal } from 'solid-js';

const [notification, setNotification] = createSignal<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null });

const Notification: Component = () => {
  return (
    <div class={`alert ${notification().type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert" style={{ display: notification().message ? 'block' : 'none' }}>
      {notification().message}
    </div>
  );
};

export const showNotification = (message: string, type: 'success' | 'error') => {
  setNotification({ message, type });
  setTimeout(() => setNotification({ message: '', type: null }), 3000);
};

export default Notification;