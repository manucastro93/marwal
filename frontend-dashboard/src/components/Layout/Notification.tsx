import { Component, createSignal } from 'solid-js';

const [notification, setNotification] = createSignal<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null });
const [show, setShow] = createSignal(false);

const Notification: Component = () => {
  return (
    <div class={`notification ${notification().type === 'success' ? 'notification-success' : 'notification-error'} ${show() ? 'notification-show' : ''}`} role="alert">
      {notification().message}
    </div>
  );
};

export const showNotification = (message: string, type: 'success' | 'error') => {
  setNotification({ message, type });
  setShow(true);
  setTimeout(() => {
    setShow(false);
    setNotification({ message: '', type: null });
  }, 3000);
};

export default Notification;