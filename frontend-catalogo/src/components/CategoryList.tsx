/* @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import categoriaService from "../services/categoriaService";
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

  const handleCategoryClick = (event: MouseEvent, categoryId: number) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    props.onSelectCategory(categoryId);
  };

  return (
    <aside class="sidebar">
      <ul class="sidebar-list">
        <li class="sidebar-item">
          <a 
            class={`sidebar-link ${props.activeCategoryId === 0 ? 'active' : ''}`} 
            href="#"
            onClick={(event) => handleCategoryClick(event, 0)}
          >
            Ver Todos
          </a>
        </li>
        {categories().map((category) => (
          <li class="sidebar-item">
            <a 
              class={`sidebar-link ${props.activeCategoryId === category.id ? 'active' : ''}`} 
              href="#"
              onClick={(event) => handleCategoryClick(event, category.id)}
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