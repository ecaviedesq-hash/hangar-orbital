const fs = require("fs");
const path = require("path");

const extensiones = new Set([".ts", ".tsx", ".js", ".json", ".css"]);

async function main() {
  try {
    const trozos = [];
    for await (const trozo of process.stdin) {
      trozos.push(trozo);
    }
    const texto = Buffer.concat(trozos).toString("utf8");
    if (!texto.trim()) return;

    const evento = JSON.parse(texto);
    const ruta = evento?.tool_input?.file_path;
    if (typeof ruta !== "string" || ruta.length === 0) return;
    if (!extensiones.has(path.extname(ruta).toLowerCase())) return;

    const prettier = require("prettier");
    const original = fs.readFileSync(ruta, "utf8");
    const config = await prettier.resolveConfig(ruta);
    const formateado = await prettier.format(original, {
      ...(config ?? {}),
      filepath: ruta,
    });
    if (formateado !== original) {
      fs.writeFileSync(ruta, formateado);
    }
  } catch {
    // Si algo falla, no bloquear la herramienta.
  }
}

main();
