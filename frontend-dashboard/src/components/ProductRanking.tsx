import { Component, For } from "solid-js";

interface ProductRankingProps {
  data: any;
}

const ProductRanking: Component<ProductRankingProps> = (props) => {
  return (
    <div class="product-ranking">
      <h2>Ranking de Productos Vendidos</h2>
      <ol>
        <For each={props.data}>
          {(item) => (
            <li>{item.product}: {item.sales} ventas</li>
          )}
        </For>
      </ol>
    </div>
  );
};

export default ProductRanking;