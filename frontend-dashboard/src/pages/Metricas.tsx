import { Component, createSignal, onMount } from "solid-js";
import Layout from "../components/Layout";
import Chart from "../components/Charts";
import orderService from "../services/orderService";

interface MonthlyMetric {
  month: string;
  total: number;
}

interface AnnualMetric {
  year: string;
  total: number;
}

interface ComparisonMetric {
  day: string;
  total: number;
}

interface ProductMetric {
  product: string;
  sales: number;
  revenue: number;
}

interface CustomerMetric {
  customer: string;
  orders: number;
  revenue: number;
}

interface SellerMetric {
  seller: string;
  sales: number;
  revenue: number;
}

const Metrics: Component = () => {
  const [selectedMetric, setSelectedMetric] = createSignal("monthly");
  const [monthlyMetrics, setMonthlyMetrics] = createSignal<any>(null);
  const [annualMetrics, setAnnualMetrics] = createSignal<any>(null);
  const [comparisonMetrics, setComparisonMetrics] = createSignal<any>(null);
  const [productMetrics, setProductMetrics] = createSignal<any>(null);
  const [customerMetrics, setCustomerMetrics] = createSignal<any>(null);
  const [sellerMetrics, setSellerMetrics] = createSignal<any>(null);
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");

  onMount(async () => {
    try {
      const monthly = await orderService.getMonthlyMetrics();
      const annual = await orderService.getAnnualMetrics();
      const products = await orderService.getProductMetrics();
      const customers = await orderService.getCustomerMetrics();
      const sellers = await orderService.getSellerMetrics();
      console.log("Monthly Metrics:", monthly);
      console.log("Annual Metrics:", annual);
      console.log("Product Metrics:", products);
      console.log("Customer Metrics:", customers);
      console.log("Seller Metrics:", sellers);
      setMonthlyMetrics(processMonthlyMetrics(monthly));
      setAnnualMetrics(processAnnualMetrics(annual));
      setProductMetrics(processProductMetrics(products));
      setCustomerMetrics(processCustomerMetrics(customers));
      setSellerMetrics(processSellerMetrics(sellers));
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  });

  const handleDateChange = async () => {
    try {
      const comparison = await orderService.compareOrdersByDateRange(startDate(), endDate());
      console.log("Comparison Metrics:", comparison);
      setComparisonMetrics(processComparisonMetrics(comparison));
    } catch (error) {
      console.error("Error fetching comparison metrics:", error);
    }
  };

  const processMonthlyMetrics = (data: MonthlyMetric[]) => {
    const labels = data.map((entry: MonthlyMetric) => entry.month);
    const dataset = data.map((entry: MonthlyMetric) => entry.total);
    console.log("Processed Monthly Metrics:", { labels, datasets: [{ label: "Pedidos Mensuales", data: dataset }] });
    return {
      labels,
      datasets: [
        {
          label: "Pedidos Mensuales",
          data: dataset,
        },
      ],
    };
  };

  const processAnnualMetrics = (data: AnnualMetric[]) => {
    const labels = data.map((entry: AnnualMetric) => entry.year);
    const dataset = data.map((entry: AnnualMetric) => entry.total);
    console.log("Processed Annual Metrics:", { labels, datasets: [{ label: "Pedidos Anuales", data: dataset }] });
    return {
      labels,
      datasets: [
        {
          label: "Pedidos Anuales",
          data: dataset,
        },
      ],
    };
  };

  const processComparisonMetrics = (data: ComparisonMetric[]) => {
    const labels = data.map((entry: ComparisonMetric) => entry.day);
    const dataset = data.map((entry: ComparisonMetric) => entry.total);
    console.log("Processed Comparison Metrics:", { labels, datasets: [{ label: "Comparar Pedidos", data: dataset }] });
    return {
      labels,
      datasets: [
        {
          label: "Comparar Pedidos",
          data: dataset,
        },
      ],
    };
  };

  const processProductMetrics = (data: ProductMetric[]) => {
    const labels = data.map((entry: ProductMetric) => entry.product);
    const salesDataset = data.map((entry: ProductMetric) => entry.sales);
    const revenueDataset = data.map((entry: ProductMetric) => entry.revenue);
    console.log("Processed Product Metrics:", { labels, datasets: [{ label: "Ventas por Producto", data: salesDataset }, { label: "Ingresos por Producto", data: revenueDataset }] });
    return {
      labels,
      datasets: [
        {
          label: "Ventas por Producto",
          data: salesDataset,
        },
        {
          label: "Ingresos por Producto",
          data: revenueDataset,
        },
      ],
    };
  };

  const processCustomerMetrics = (data: CustomerMetric[]) => {
    const labels = data.map((entry: CustomerMetric) => entry.customer);
    const ordersDataset = data.map((entry: CustomerMetric) => entry.orders);
    const revenueDataset = data.map((entry: CustomerMetric) => entry.revenue);
    console.log("Processed Customer Metrics:", { labels, datasets: [{ label: "Pedidos por Cliente", data: ordersDataset }, { label: "Ingresos por Cliente", data: revenueDataset }] });
    return {
      labels,
      datasets: [
        {
          label: "Pedidos por Cliente",
          data: ordersDataset,
        },
        {
          label: "Ingresos por Cliente",
          data: revenueDataset,
        },
      ],
    };
  };

  const processSellerMetrics = (data: SellerMetric[]) => {
    const labels = data.map((entry: SellerMetric) => entry.seller);
    const salesDataset = data.map((entry: SellerMetric) => entry.sales);
    const revenueDataset = data.map((entry: SellerMetric) => entry.revenue);
    console.log("Processed Seller Metrics:", { labels, datasets: [{ label: "Ventas por Vendedor", data: salesDataset }, { label: "Ingresos por Vendedor", data: revenueDataset }] });
    return {
      labels,
      datasets: [
        {
          label: "Ventas por Vendedor",
          data: salesDataset,
        },
        {
          label: "Ingresos por Vendedor",
          data: revenueDataset,
        },
      ],
    };
  };

  return (
    <Layout>
      <div class="metrics-page">
        <h1>Métricas de Ventas</h1>
        <div class="metric-selector">
          <label for="metric-select">Seleccionar Métrica:</label>
          <select
            id="metric-select"
            value={selectedMetric()}
            onChange={(e) => setSelectedMetric(e.currentTarget.value)}
          >
            <option value="monthly">Mensual</option>
            <option value="annual">Anual</option>
            <option value="dateRange">Entre Fechas</option>
            <option value="product">Productos</option>
            <option value="customer">Clientes</option>
            <option value="seller">Vendedores</option>
          </select>
        </div>

        {selectedMetric() === "dateRange" && (
          <div class="date-range-selector">
            <label for="startDate">Fecha de Inicio:</label>
            <input
              type="date"
              id="startDate"
              value={startDate()}
              onChange={(e) => setStartDate(e.currentTarget.value)}
            />
            <label for="endDate">Fecha de Fin:</label>
            <input
              type="date"
              id="endDate"
              value={endDate()}
              onChange={(e) => setEndDate(e.currentTarget.value)}
            />
            <button onClick={handleDateChange}>Actualizar</button>
          </div>
        )}

        {selectedMetric() === "monthly" && monthlyMetrics() && (
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Pedidos Mensuales</h2>
            </div>
            <Chart type="bar" data={monthlyMetrics()} />
          </div>
        )}

        {selectedMetric() === "annual" && annualMetrics() && (
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Pedidos Anuales</h2>
            </div>
            <Chart type="line" data={annualMetrics()} />
          </div>
        )}

        {selectedMetric() === "dateRange" && comparisonMetrics() && (
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Comparar Pedidos dentro de Rango de Fechas</h2>
            </div>
            <Chart type="line" data={comparisonMetrics()} />
          </div>
        )}

        {selectedMetric() === "product" && productMetrics() && (
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Ventas de Productos</h2>
            </div>
            <Chart type="bar" data={productMetrics()} />
          </div>
        )}

        {selectedMetric() === "customer" && customerMetrics() && (
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Métricas de Clientes</h2>
            </div>
            <Chart type="bar" data={customerMetrics()} />
          </div>
        )}

        {selectedMetric() === "seller" && sellerMetrics() && (
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Métricas de Vendedores</h2>
            </div>
            <Chart type="bar" data={sellerMetrics()} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Metrics;