import { describe, expect, it } from "vitest";
import { iniciais } from "./nome";

describe("iniciais", () => {
  it("usa as duas primeiras palavras", () => expect(iniciais("Bela Flor Cosméticos")).toBe("BF"));
  it("ignora preposições curtas", () => expect(iniciais("Casa da Beleza")).toBe("CB"));
  it("aceita sigla de uma palavra", () => expect(iniciais("LOJA")).toBe("L"));
});
