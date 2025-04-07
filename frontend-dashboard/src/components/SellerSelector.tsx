import { Component, createSignal, onMount } from "solid-js";
import apiService from "../services/apiService";
import { Vendedor } from "../interfaces/Vendedor";

interface SellerSelectorProps {
  onSellerChange: (seller: string | null) => void;
}

const SellerSelector: Component<SellerSelectorProps> = (props) => {
  const [sellers, setSellers] = createSignal<string[]>([]);
  const [selectedSeller, setSelectedSeller] = createSignal<string>("");

  onMount(async () => {
    const sellersData: Vendedor[] = await apiService.getVendedores();
    setSellers(sellersData.map(seller => seller.nombre));
  });

  const handleChange = (event: Event) => {
    const seller = (event.target as HTMLSelectElement).value;
    setSelectedSeller(seller);
    props.onSellerChange(seller);
  };

  return (
    <select onChange={handleChange} value={selectedSeller()}>
      <option value="">Selecione un Vendedor</option>
      {sellers().map((seller) => (
        <option value={seller}>{seller}</option>
      ))}
    </select>
  );
};

export default SellerSelector;