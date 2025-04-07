import { Usuario } from '../../interfaces/Usuario';
import '../../assets/css/usuarios.css';

interface UsuarioDetallesProps {
  usuario: Usuario;
  onClose: () => void;
}

const UsuarioDetalles = (props: UsuarioDetallesProps) => {
  return (
    <div class="usuario-detalles">
      <div class="detalles-item">
        <label>Usuario:</label>
        <span>{props.usuario.usuario}</span>
      </div>
      <div class="detalles-item">
        <label>Nombre:</label>
        <span>{props.usuario.nombre}</span>
      </div>
      <div class="detalles-item">
        <label>Email:</label>
        <span>{props.usuario.email}</span>
      </div>
      <div class="detalles-item">
        <label>Teléfono:</label>
        <span>{props.usuario.telefono}</span>
      </div>
      <div class="detalles-item">
        <label>Rol:</label>
        <span>{props.usuario.rol}</span>
      </div>
      <div class="detalles-item">
        <label>Estado:</label>
        <span>{props.usuario.estado}</span>
      </div>
      <div class="detalles-actions">
        <button class="close-btn" onClick={props.onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default UsuarioDetalles;