/* @jsxImportSource solid-js */
import { createSignal } from "solid-js";

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

const ProductSearch = ({ onSearch }: ProductSearchProps) => {
  const [searchQuery, setSearchQuery] = createSignal("");

  const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setSearchQuery(target.value);
    onSearch(target.value);
  };

  return (
    <div class="product-search" style={{ float: 'right', width: '200px' }}>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery()}
        onInput={handleSearch}
      />
    </div>
  );
};

export default ProductSearch;