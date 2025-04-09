import { Component, createSignal } from 'solid-js';
import * as XLSX from 'xlsx';
import { Producto } from '../../interfaces/Producto';

interface Props {
  onClose: () => void;
  onImport: (productos: Producto[]) => void;
}

const ImportarExcelForm: Component<Props> = ({ onClose, onImport }) => {
  const [productos, setProductos] = createSignal<Producto[]>([]);

  const handleFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: Producto[] = XLSX.utils.sheet_to_json(worksheet);
      setProductos(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleChange = (index: number, field: keyof Producto, value: string) => {
    const updated = [...productos()];
    (updated[index] as any)[field] = value;
    setProductos(updated);
  };

  const handleImport = () => {
    onImport(productos());
    onClose();
  };

  return (
    <div class="import-form p-4">
      <h2>Importar productos desde Excel</h2>
      <input type="file" accept=".xlsx, .xls" class="form-control mb-3" onChange={handleFileUpload} />
      {productos().length > 0 && (
        <div class="table-responsive mb-3" style={{ maxHeight: '400px', overflow: 'auto' }}>
          <table class="table table-bordered table-striped table-sm">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría ID</th>
              </tr>
            </thead>
            <tbody>
              {productos().map((p, idx) => (
                <tr>
                  <td><input class="form-control" value={p.codigo} onInput={e => handleChange(idx, 'codigo', e.currentTarget.value)} /></td>
                  <td><input class="form-control" value={p.nombre} onInput={e => handleChange(idx, 'nombre', e.currentTarget.value)} /></td>
                  <td><input class="form-control" value={p.descripcion} onInput={e => handleChange(idx, 'descripcion', e.currentTarget.value)} /></td>
                  <td><input class="form-control" type="number" value={p.precio} onInput={e => handleChange(idx, 'precio', e.currentTarget.value)} /></td>
                  <td><input class="form-control" type="number" value={p.stock} onInput={e => handleChange(idx, 'stock', e.currentTarget.value)} /></td>
                  <td><input class="form-control" value={p.categoria_id} onInput={e => handleChange(idx, 'categoria_id', e.currentTarget.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-secondary" onClick={onClose}>Cerrar</button>
        {productos().length > 0 && (
          <button class="btn btn-primary" onClick={handleImport}>Importar productos</button>
        )}
      </div>
    </div>
  );
};

export default ImportarExcelForm;
