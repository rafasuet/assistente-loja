import { describe, expect, it } from "vitest";
import { ehPrimeiroSabado, horarioDoDia, modoEm, proximaAbertura } from "./horario";

const d = (iso: string) => new Date(iso);

describe("modoEm: dias úteis", () => {
  it("8h29 de terça ainda está fora do horário", () => {
    expect(modoEm(d("2026-11-03T08:29:00-03:00"))).toBe("fora_do_horario");
  });
  it("8h30 de terça já é horário comercial", () => {
    expect(modoEm(d("2026-11-03T08:30:00-03:00"))).toBe("horario_comercial");
  });
  it("17h59 ainda é horário comercial", () => {
    expect(modoEm(d("2026-11-03T17:59:00-03:00"))).toBe("horario_comercial");
  });
  it("18h em ponto já está fora do horário", () => {
    expect(modoEm(d("2026-11-03T18:00:00-03:00"))).toBe("fora_do_horario");
  });
});

describe("modoEm: sábados e domingo", () => {
  it("primeiro sábado do mês às 14h30 está aberto", () => {
    expect(modoEm(d("2026-11-07T14:30:00-03:00"))).toBe("horario_comercial");
  });
  it("primeiro sábado do mês às 15h já fechou", () => {
    expect(modoEm(d("2026-11-07T15:00:00-03:00"))).toBe("fora_do_horario");
  });
  it("sábado comum às 12h59 está aberto", () => {
    expect(modoEm(d("2026-11-14T12:59:00-03:00"))).toBe("horario_comercial");
  });
  it("sábado comum às 13h já fechou", () => {
    expect(modoEm(d("2026-11-14T13:00:00-03:00"))).toBe("fora_do_horario");
  });
  it("sábado comum às 14h30 está fechado", () => {
    expect(modoEm(d("2026-11-14T14:30:00-03:00"))).toBe("fora_do_horario");
  });
  it("domingo às 10h está fechado", () => {
    expect(modoEm(d("2026-11-01T10:00:00-03:00"))).toBe("fora_do_horario");
  });
});

describe("horarioDoDia", () => {
  it("domingo não tem horário", () => {
    expect(horarioDoDia(d("2026-11-01T10:00:00-03:00"))).toBeNull();
  });
  it("dia útil abre 08:30 e fecha 18:00", () => {
    expect(horarioDoDia(d("2026-11-03T10:00:00-03:00"))).toEqual({ abre: "08:30", fecha: "18:00" });
  });
  it("primeiro sábado fecha 15:00", () => {
    expect(horarioDoDia(d("2026-11-07T10:00:00-03:00"))).toEqual({ abre: "09:00", fecha: "15:00" });
  });
});

describe("ehPrimeiroSabado", () => {
  it("07/11/2026 é o primeiro sábado de novembro", () => {
    expect(ehPrimeiroSabado(d("2026-11-07T10:00:00-03:00"))).toBe(true);
  });
  it("31/10/2026 é o quinto sábado de outubro", () => {
    expect(ehPrimeiroSabado(d("2026-10-31T10:00:00-03:00"))).toBe(false);
  });
  it("usa a data de São Paulo, não a UTC (sábado 23h em SP já é domingo em UTC)", () => {
    expect(ehPrimeiroSabado(d("2026-11-07T23:00:00-03:00"))).toBe(true);
  });
});

describe("proximaAbertura", () => {
  it("sábado à noite reabre segunda às 8h30", () => {
    expect(proximaAbertura(d("2026-10-31T20:00:00-03:00")).toISOString()).toBe(
      d("2026-11-02T08:30:00-03:00").toISOString(),
    );
  });
  it("sexta à noite antes do primeiro sábado reabre sábado às 9h", () => {
    expect(proximaAbertura(d("2026-11-06T19:00:00-03:00")).toISOString()).toBe(
      d("2026-11-07T09:00:00-03:00").toISOString(),
    );
  });
  it("de madrugada num dia útil reabre no mesmo dia às 8h30", () => {
    expect(proximaAbertura(d("2026-11-03T03:25:00-03:00")).toISOString()).toBe(
      d("2026-11-03T08:30:00-03:00").toISOString(),
    );
  });
});
