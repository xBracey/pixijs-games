import type { GlobalProvider } from "@ladle/react";
import "../src/index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export const Provider: GlobalProvider = ({ children }) => children;
