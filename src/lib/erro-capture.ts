// Armazena o último erro capturado globalmente
let lastError: Error | unknown = null;

export function captureError(error: Error | unknown) {
  lastError = error;
}

// Função chamada no seu server.ts para pegar e limpar o erro
export function consumeLastCapturedError(): Error | unknown | null {
  const error = lastError;
  lastError = null; // Limpa após consumir
  return error;
}