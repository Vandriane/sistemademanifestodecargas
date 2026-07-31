// Retorna um HTML básico para mostrar na tela quando o servidor crasha
export function renderErrorPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erro 500</title>
    </head>
    <body style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6; font-family: sans-serif; color: #333;">
      <div style="text-align: center;">
        <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">500</h1>
        <p style="font-size: 1.2rem; color: #666;">Erro Interno do Servidor</p>
        <p style="font-size: 0.9rem; color: #999;">Tente recarregar a página.</p>
      </div>
    </body>
    </html>
  `;
}