import { Component, createSignal, onMount } from "solid-js";
import Layout from "../components/Layout";
import Chart from "../components/Charts";
import ProductSelector from "../components/ProductSelector";
import ProductRanking from "../components/ProductRanking";
import CustomerSelector from "../components/CustomerSelector";
import SellerSelector from "../components/SellerSelector";
import DatePicker from "../components/DatePicker";
import orderService from "../services/orderService";

interface DailyMetric {
  day: string;
  total: number;
}

interface CustomerMonthlyMetric {
  customer: string;
  month: string;
  sales: number;
}

interface ProductMonthlyMetric {
  product: string;
  month: string;
  sales: number;
}

const Metrics: Component = () => {
  const [monthlyMetrics, setMonthlyMetrics] = createSignal<any>(null);
  const [dailyMetrics, setDailyMetrics] = createSignal<any>(null);
  const [comparisonMetrics, setComparisonMetrics] = createSignal<any>(null);
  const [sellerDailyMetrics, setSellerDailyMetrics] = createSignal<any>(null);
  const [customerMonthlyMetrics, setCustomerMonthlyMetrics] = createSignal<any>(null);
  const [productMonthlyMetrics, setProductMonthlyMetrics] = createSignal<any>(null);
  const [selectedProduct, setSelectedProduct] = createSignal<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = createSignal<string | null>(null);
  const [selectedSeller, setSelectedSeller] = createSignal<string | null>(null);
  const [productRankings, setProductRankings] = createSignal<any>(null);
  const [startDate, setStartDate] = createSignal<Date | null>(new Date('2023-01-01'));
  const [endDate, setEndDate] = createSignal<Date | null>(new Date('2023-12-31'));

  onMount(async () => {
    fetchMetrics();
  });

  const fetchMetrics = async () => {
    try {
      const monthly = await orderService.getMonthlyMetrics();
      const daily = await orderService.getDailyMetrics();
      const comparison = await orderService.compareOrdersByDateRange(formatDate(startDate()), formatDate(endDate()));
      const sellerDaily = await orderService.getSalesBySellerDaily();
      const customerMonthly = await orderService.getSalesByCustomerMonthly();
      const productMonthly = await orderService.getSalesByProductMonthly();
      const productRankings = await orderService.getProductRankings();
      setMonthlyMetrics(processMonthlyMetrics(monthly));
      setDailyMetrics(processDailyMetrics(daily));
      setComparisonMetrics(processComparisonMetrics(comparison));
      setSellerDailyMetrics(processSellerDailyMetrics(sellerDaily));
      setCustomerMonthlyMetrics(processCustomerMonthlyMetrics(customerMonthly));
      setProductMonthlyMetrics(processProductMonthlyMetrics(productMonthly));
      setProductRankings(processProductRankings(productRankings));
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = async (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    const comparison = await orderService.compareOrdersByDateRange(formatDate(start), formatDate(end));
    setComparisonMetrics(processComparisonMetrics(comparison));
  };

  const handleCustomerChange = async (customer: string | null) => {
    setSelectedCustomer(customer);
    const customerMonthly = await orderService.getSalesByCustomerMonthly();
    setCustomerMonthlyMetrics(processCustomerMonthlyMetrics(customerMonthly));
  };

  const handleSellerChange = async (seller: string | null) => {
    setSelectedSeller(seller);
    const sellerDaily = await orderService.getSalesBySellerDaily();
    setSellerDailyMetrics(processSellerDailyMetrics(sellerDaily));
  };

  const processMonthlyMetrics = (data: any) => {
    const months = [
      "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
      "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"
    ];
    // Crear un mapa de los datos obtenidos del servicio
    const dataMap = new Map(data.map((entry: any) => [entry.month, entry.total]));
    // Crear labels con todos los meses del año
    const labels = months;
    const dataset = months.map(month => dataMap.get(month) ?? 0);
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

  const processDailyMetrics = (data: DailyMetric[]) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
    const allDays = Array.from({ length: daysInMonth }, (_, i) => `${year}-${month}-${(i + 1).toString().padStart(2, '0')}`);
    // Formatear correctamente las fechas en los datos de servicio
    const formattedData = data.map(entry => {
      const day = entry.day.padStart(2, '0');
      const formattedDay = `${year}-${month}-${day}`;
      return { day: formattedDay, total: entry.total };
    });
    const dataMap = new Map(formattedData.map(entry => [entry.day, entry.total]));
    const labels = allDays;
    const dataset = allDays.map(day => dataMap.get(day) ?? 0);
    return {
      labels,
      datasets: [
        {
          label: "Ventas Diarias",
          data: dataset,
        },
      ],
    };
  };

  const processComparisonMetrics = (data: any) => {
    const labels = data.map((entry: any) => entry.day);
    const dataset = data.map((entry: any) => entry.total);
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

  const processSellerDailyMetrics = (data: { id: number; nombre: string; ventas: number; ingresos: number | null; }[]) => {
    console.log("Seller Daily Metrics Raw Data:", data);
    console.log("Selected Seller:", selectedSeller());
  
    // Obtener la fecha actual
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
    const allDays = Array.from({ length: daysInMonth }, (_, i) => `${year}-${month}-${(i + 1).toString().padStart(2, '0')}`);
  
    const selectedSellerName = selectedSeller();
  
    // Filtrar los datos del vendedor seleccionado si hay uno seleccionado
    const filteredData = selectedSellerName ? data.filter(entry => entry.nombre === selectedSellerName) : data;
  
    // Crear un mapa de los datos obtenidos del servicio, sumando las ventas por día
    const salesByDay = new Map<string, number>();
    allDays.forEach(day => salesByDay.set(day, 0)); // Inicializar con 0 ventas para todos los días del mes
  
    filteredData.forEach((entry) => {
      const day = `${year}-${month}-${(entry.id).toString().padStart(2, '0')}`; // Asumiendo que `id` representa el día del mes
      if (salesByDay.has(day)) {
        salesByDay.set(day, salesByDay.get(day)! + entry.ventas);
      }
    });
  
    // Usar valores predeterminados si los datos están indefinidos
    const labels = allDays;
    const dataset = allDays.map(day => salesByDay.get(day) ?? 0);
  
    console.log("Processed Seller Daily Metrics:", { labels, datasets: [{ label: "Ventas Diarias por Vendedor", data: dataset }] });
  
    return {
      labels,
      datasets: [
        {
          label: "Ventas Diarias por Vendedor",
          data: dataset,
        },
      ],
    };
  };
  

const processCustomerMonthlyMetrics = (data: CustomerMonthlyMetric[]) => {
  // Crear un array con todos los meses del año
  const months = [
    "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
    "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"
  ];
  // Filtrar los datos del cliente seleccionado si hay uno seleccionado
  const filteredData = selectedCustomer() ? data.filter(entry => entry.customer === selectedCustomer()) : data;
  // Crear un mapa de los datos obtenidos del servicio, sumando las ventas por mes
  const salesByMonth = new Map<string, number>();
  filteredData.forEach((entry) => {
    const month = entry.month; // Formato de mes esperado: YYYY-MM
    if (!salesByMonth.has(month)) {
      salesByMonth.set(month, 0);
    }
    salesByMonth.set(month, salesByMonth.get(month)! + entry.sales);
  });
  // Usar valores predeterminados si los datos están indefinidos
  const labels = months;
  const dataset = months.map(month => salesByMonth.get(month) ?? 0);
  return {
    labels,
    datasets: [
      {
        label: "Ventas Mensuales por Cliente",
        data: dataset,
      },
    ],
  };
};

  const processProductMonthlyMetrics = (data: ProductMonthlyMetric[]) => {
    if (selectedProduct() !== null) {
      data = data.filter((entry) => entry.product === selectedProduct());
    }
    const labels = data.map((entry: ProductMonthlyMetric) => `${entry.product} - ${entry.month}`);
    const dataset = data.map((entry: ProductMonthlyMetric) => entry.sales);
    return {
      labels,
      datasets: [
        {
          label: "Ventas Mensuales por Producto",
          data: dataset,
        },
      ],
    };
  };

  const processProductRankings = (data: any) => {
    const rankedData = data.sort((a: any, b: any) => b.sales - a.sales);
    return rankedData;
  };

  return (
    <Layout>
      <div class="metrics-page">
        <h1>Métricas de Ventas</h1>
        <div class="charts-grid">
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Ventas por Mes</h2>
            </div>
            <Chart type="bar" data={monthlyMetrics()} />
          </div>
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Ventas por Día</h2>
            </div>
            <Chart type="bar" data={dailyMetrics()} />
          </div>
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Ventas por Rango de Fechas</h2>
              <div class="date-picker-container">
                <DatePicker
                  value={startDate()}
                  onChange={(date) => handleDateChange(date, endDate())}
                  options={{ dateFormat: "Y-m-d" }}
                />
                <DatePicker
                  value={endDate()}
                  onChange={(date) => handleDateChange(startDate(), date)}
                  options={{ dateFormat: "Y-m-d" }}
                />
              </div>
            </div>
            <Chart type="line" data={comparisonMetrics()} />
          </div>
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Ventas Diarias por Vendedor</h2>
              <div class="seller-selector-container">
                <SellerSelector onSellerChange={handleSellerChange} />
              </div>
            </div>
            <Chart type="bar" data={sellerDailyMetrics()} />
          </div>
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Ventas Mensuales por Cliente</h2>
              <div class="customer-selector-container">
                <CustomerSelector onCustomerChange={handleCustomerChange} />
              </div>
            </div>
            <Chart type="bar" data={customerMonthlyMetrics()} />
          </div>
          <div class="chart-container metric-chart">
            <div class="chart-header">
              <h2>Ventas Mensuales por Producto</h2>
              <ProductSelector onProductChange={(product: string | null) => setSelectedProduct(product)} />
            </div>
            <Chart type="bar" data={productMonthlyMetrics()} />
          </div>
        </div>
        <ProductRanking data={productRankings()} />
      </div>
    </Layout>
  );
};

export default Metrics;