import { Component, createSignal } from 'solid-js';

interface FormModalProps {
  title: string;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const FormModal: Component<FormModalProps> = ({ title, onSubmit, initialData }) => {
  const [formData, setFormData] = createSignal(initialData || {});

  const handleChange = (e: Event) => {
    const { name, value } = e.currentTarget as HTMLInputElement;
    setFormData({ ...formData(), [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData());
  };

  return (
    <div class="modal" tabindex="-1" style={{ display: 'block' }}>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{title}</h5>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              {Object.keys(formData()).map((key) => (
                <div class="mb-3">
                  <label for={key} class="form-label">{key}</label>
                  <input type="text" class="form-control" id={key} name={key} value={formData()[key]} onInput={handleChange} />
                </div>
              ))}
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary">Close</button>
            <button type="button" class="btn btn-primary" onClick={handleSubmit}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;