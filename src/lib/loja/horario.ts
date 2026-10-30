// Horário de funcionamento da loja, sempre no fuso de São Paulo.
// O Brasil não tem horário de verão desde 2019, então o fuso é fixo em UTC-3.
const OFFSET_MS = -3 * 60 * 60 * 1000;

export type ModoAtendimento = "horario_comercial" | "fora_do_horario";

interface PartesLocais {
  ano: number;
  mes: number; // 0-11
  dia: number;
  diaSemana: number; // 0 = domingo
  minutos: number; // minutos desde 00:00
}

function partesLocais(data: Date): PartesLocais {
  const local = new Date(data.getTime() + OFFSET_MS);
  return {
    ano: local.getUTCFullYear(),
    mes: local.getUTCMonth(),
    dia: local.getUTCDate(),
    diaSemana: local.getUTCDay(),
    minutos: local.getUTCHours() * 60 + local.getUTCMinutes(),
  };
}

function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function ehPrimeiroSabado(data: Date): boolean {
  const p = partesLocais(data);
  return p.diaSemana === 6 && p.dia <= 7;
}

export function horarioDoDia(data: Date): { abre: string; fecha: string } | null {
  const { diaSemana } = partesLocais(data);
  if (diaSemana === 0) return null;
  if (diaSemana === 6) return { abre: "09:00", fecha: ehPrimeiroSabado(data) ? "15:00" : "13:00" };
  return { abre: "08:30", fecha: "18:00" };
}

export function modoEm(data: Date): ModoAtendimento {
  const horario = horarioDoDia(data);
  if (!horario) return "fora_do_horario";
  const { minutos } = partesLocais(data);
  return minutos >= paraMinutos(horario.abre) && minutos < paraMinutos(horario.fecha)
    ? "horario_comercial"
    : "fora_do_horario";
}

// Monta o instante em que a loja abre num dia local (ano/mês/dia de São Paulo).
function aberturaEm(ano: number, mes: number, dia: number, abre: string): Date {
  const local = Date.UTC(ano, mes, dia) + paraMinutos(abre) * 60 * 1000;
  return new Date(local - OFFSET_MS);
}

export function proximaAbertura(data: Date): Date {
  for (let i = 0; i < 8; i++) {
    const p = partesLocais(new Date(data.getTime() + i * 24 * 60 * 60 * 1000));
    const meioDia = aberturaEm(p.ano, p.mes, p.dia, "12:00");
    const horario = horarioDoDia(meioDia);
    if (!horario) continue;
    const abertura = aberturaEm(p.ano, p.mes, p.dia, horario.abre);
    if (abertura.getTime() > data.getTime()) return abertura;
  }
  throw new Error("Nenhuma abertura encontrada nos próximos 7 dias");
}

export function descricaoHorarios(): string {
  return (
    "Segunda a sexta, das 8h30 às 18h. Sábado, das 9h às 13h " +
    "(no primeiro sábado do mês, das 9h às 15h). Domingo, fechada."
  );
}
