import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // carregarDados lê os JSONs com fs em tempo de execução; a Vercel precisa empacotá-los na função
  outputFileTracingIncludes: { "/api/mensagem": ["./data/publico/**/*"] },
  // há um package-lock.json solto na pasta do usuário; sem isto o Next adivinha a raiz errada
  turbopack: { root: __dirname },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
