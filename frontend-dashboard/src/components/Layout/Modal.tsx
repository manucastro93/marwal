import { Component, JSX } from 'solid-js';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Modal: Component<ModalProps> = (props) => {
  return (
    <div class={`modal ${props.isOpen ? 'modal-open' : ''}`}>
      <div class="modal-content">
        <span class="close-button" onClick={props.onClose}>&times;</span>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;