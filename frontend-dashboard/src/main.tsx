import { render } from "solid-js/web";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  render(() => <App />, rootElement);
} else {
  console.error("Root element not found");
}