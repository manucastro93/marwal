import { createSignal } from "solid-js";
import { createCheckout } from "../services/pedidoService";

const CheckoutForm = () => {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [address, setAddress] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [successMessage, setSuccessMessage] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await createCheckout({
        name: name(),
        email: email(),
        phone: phone(),
        address: address(),
      });

      if (response?.success) {
        setSuccessMessage("¡Compra realizada con éxito!");
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
      } else {
        setErrorMessage("Hubo un problema al procesar tu pedido.");
      }
    } catch (err) {
      setErrorMessage("Ocurrió un error. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form class="checkout-form" onSubmit={handleSubmit}>
      <label for="name">Nombre completo</label>
      <input
        id="name"
        type="text"
        value={name()}
        onInput={(e) => setName(e.currentTarget.value)}
        required
      />

      <label for="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        value={email()}
        onInput={(e) => setEmail(e.currentTarget.value)}
        required
      />

      <label for="phone">Teléfono</label>
      <input
        id="phone"
        type="tel"
        value={phone()}
        onInput={(e) => setPhone(e.currentTarget.value)}
        required
      />

      <label for="address">Dirección de envío</label>
      <input
        id="address"
        type="text"
        value={address()}
        onInput={(e) => setAddress(e.currentTarget.value)}
        required
      />

      <button type="submit" disabled={loading()}>
        {loading() ? "Procesando..." : "Finalizar compra"}
      </button>

      {loading() && <div class="loader">Enviando datos...</div>}
      {successMessage() && <div class="success-message">{successMessage()}</div>}
      {errorMessage() && <div class="error-message">{errorMessage()}</div>}
    </form>
  );
};

export default CheckoutForm;
