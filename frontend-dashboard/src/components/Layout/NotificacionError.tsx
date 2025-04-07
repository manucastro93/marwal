import { createSignal, Show } from 'solid-js';
import '../../assets/css/usuarios.css';

interface NotificacionErrorProps {
  message: string;
  onClose: () => void;
}

const NotificacionError = (props: NotificacionErrorProps) => {
  return (
    <Show when={props.message}>
      <div class="error-notification">
        <span class="close-btn" onClick={props.onClose}>&times;</span>
        <p>{props.message}</p>
      </div>
    </Show>
  );
};

export default NotificacionError;