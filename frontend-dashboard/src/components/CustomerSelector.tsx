import { Component, createSignal, onMount } from "solid-js";
import apiService from "../services/apiService";

interface Cliente {
  id: number;
  nombre: string;
}

interface CustomerSelectorProps {
  onCustomerChange: (customer: string | null) => void;
}

const CustomerSelector: Component<CustomerSelectorProps> = (props) => {
  const [customers, setCustomers] = createSignal<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = createSignal<string>("");

  onMount(async () => {
    const customersData: Cliente[] = await apiService.getClientes();
    setCustomers(customersData.map(customer => customer.nombre));
  });

  const handleChange = (event: Event) => {
    const customer = (event.target as HTMLSelectElement).value;
    setSelectedCustomer(customer);
    props.onCustomerChange(customer);
  };

  return (
    <select onChange={handleChange} value={selectedCustomer()}>
      <option value="">Seleccione un Cliente</option>
      {customers().map((customer) => (
        <option value={customer}>{customer}</option>
      ))}
    </select>
  );
};

export default CustomerSelector;