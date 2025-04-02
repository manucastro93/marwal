/* @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import categoriaService from "../services/CategoriaService";
import { Categoria } from "../interfaces/Categoria";

interface CategoryListProps {
  onSelectCategory: (categoryId: number) => void;
  activeCategoryId: number;
}

const CategoryList = (props: CategoryListProps) => {
  const [categories, setCategories] = createSignal<Categoria[]>([]);

  const fetchCategories = async () => {
    const fetchedCategories = await categoriaService.getProductos();
    setCategories(fetchedCategories);
  };

  onMount(() => {
    fetchCategories();
  });

  return (
    <aside class="sidebar">
      <ul class="sidebar-list">
        <li class="sidebar-item">
          <a 
            class={`sidebar-link ${props.activeCategoryId === 0 ? 'active' : ''}`} 
            href="#"
            onClick={() => props.onSelectCategory(0)}
          >
            Ver Todos
          </a>
        </li>
        {categories().map((category) => (
          <li class="sidebar-item">
            <a 
              class={`sidebar-link ${props.activeCategoryId === category.id ? 'active' : ''}`} 
              href="#"
              onClick={() => props.onSelectCategory(category.id)}
            >
              {category.nombre}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryList;