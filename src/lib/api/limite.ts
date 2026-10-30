// Limite simples por instância do servidor, para ninguém gastar os créditos da API pela demo.
export interface Limitador {
  permitir(agora?: number): boolean;
}

export function criarLimitador(maximo: number, janelaMs: number): Limitador {
  let chamadas: number[] = [];
  return {
    permitir(agora = Date.now()) {
      chamadas = chamadas.filter((t) => agora - t < janelaMs);
      if (chamadas.length >= maximo) return false;
      chamadas.push(agora);
      return true;
    },
  };
}
