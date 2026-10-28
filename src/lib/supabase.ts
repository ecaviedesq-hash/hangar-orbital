import { createClient } from "@supabase/supabase-js";

function leerVariablePublica(
  nombre: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY",
): string {
  const valor = import.meta.env[nombre];
  if (valor.length === 0) {
    throw new Error(`Falta ${nombre}`);
  }
  return valor;
}

export const supabase = createClient(
  leerVariablePublica("VITE_SUPABASE_URL"),
  leerVariablePublica("VITE_SUPABASE_ANON_KEY"),
);
