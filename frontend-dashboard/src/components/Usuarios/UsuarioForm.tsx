import { createSignal } from 'solid-js';
import { Usuario } from '../../interfaces/Usuario';
import { usuarioService } from '../../services/usuarioService';
import NotificacionError from '../Layout/NotificacionError';
import '../../assets/css/usuarios.css';

interface UsuarioFormProps {
  usuario?: Usuario;
  onClose: () => void;
  onSave: () => void;
}

const UsuarioForm = (props: UsuarioFormProps) => {
  const [formData, setFormData] = createSignal<Usuario>({
    id: props.usuario?.id || '',
    usuario: props.usuario?.usuario || '',
    nombre: props.usuario?.nombre || '',
    email: props.usuario?.email || '',
    telefono: props.usuario?.telefono || '',
    contrasena: '',
    rol: props.usuario?.rol || 'vendedor',
    estado: props.usuario?.estado || 'activo',
    created_at: props.usuario?.created_at || new Date(),
    updated_at: props.usuario?.updated_at || new Date(),
  });

  const [error, setError] = createSignal('');

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData(), [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      if (props.usuario) {
        await usuarioService.actualizarUsuario(props.usuario.id, formData());
      } else {
        await usuarioService.crearUsuario(formData());
      }
      props.onSave();
      props.onClose();
    } catch (error) {
      if (Array.isArray(error)) {
        const errorMsg = error.map(err => `${err.param}: ${err.msg}`).join('\n');
        setError(errorMsg);
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div class="usuario-form">
      <NotificacionError message={error()} onClose={() => setError('')} />
      <form onSubmit={handleSubmit}>
        <div class="form-group">
          <label>Usuario</label>
          <input type="text" name="usuario" value={formData().usuario} onInput={handleChange} required />
        </div>
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={formData().nombre} onInput={handleChange} required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData().email} onInput={handleChange} required />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" name="telefono" value={formData().telefono} onInput={handleChange} />
        </div>
        {!props.usuario && (
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" name="contrasena" value={formData().contrasena} onInput={handleChange} required />
          </div>
        )}
        <div class="form-group">
          <label>Rol</label>
          <select name="rol" value={formData().rol} onChange={handleChange} required>
            <option value="supremo">Supremo</option>
            <option value="administrador">Administrador</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select name="estado" value={formData().estado} onChange={handleChange} required>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="save-btn">Guardar</button>
          <button type="button" class="cancel-btn" onClick={props.onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;