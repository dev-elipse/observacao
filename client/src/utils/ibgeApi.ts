/**
 * Integração com API do IBGE para estados e cidades
 * Estados estáticos + cidades via API do IBGE (por sigla)
 */

export interface State {
  id: number;
  name: string;
  sigla: string;
}

export interface City {
  id: number;
  name: string;
}

export const STATES_STATIC: State[] = [
  { id: 12, name: "Acre", sigla: "AC" },
  { id: 27, name: "Alagoas", sigla: "AL" },
  { id: 16, name: "Amapá", sigla: "AP" },
  { id: 13, name: "Amazonas", sigla: "AM" },
  { id: 29, name: "Bahia", sigla: "BA" },
  { id: 23, name: "Ceará", sigla: "CE" },
  { id: 53, name: "Distrito Federal", sigla: "DF" },
  { id: 32, name: "Espírito Santo", sigla: "ES" },
  { id: 52, name: "Goiás", sigla: "GO" },
  { id: 21, name: "Maranhão", sigla: "MA" },
  { id: 51, name: "Mato Grosso", sigla: "MT" },
  { id: 50, name: "Mato Grosso do Sul", sigla: "MS" },
  { id: 31, name: "Minas Gerais", sigla: "MG" },
  { id: 15, name: "Pará", sigla: "PA" },
  { id: 25, name: "Paraíba", sigla: "PB" },
  { id: 41, name: "Paraná", sigla: "PR" },
  { id: 26, name: "Pernambuco", sigla: "PE" },
  { id: 22, name: "Piauí", sigla: "PI" },
  { id: 33, name: "Rio de Janeiro", sigla: "RJ" },
  { id: 24, name: "Rio Grande do Norte", sigla: "RN" },
  { id: 43, name: "Rio Grande do Sul", sigla: "RS" },
  { id: 11, name: "Rondônia", sigla: "RO" },
  { id: 14, name: "Roraima", sigla: "RR" },
  { id: 42, name: "Santa Catarina", sigla: "SC" },
  { id: 35, name: "São Paulo", sigla: "SP" },
  { id: 28, name: "Sergipe", sigla: "SE" },
  { id: 17, name: "Tocantins", sigla: "TO" },
];

// Cache por sigla
const citiesCache: Map<string, City[]> = new Map();

export const fetchStates = async (): Promise<State[]> => {
  return STATES_STATIC;
};

// Recebe a SIGLA do estado (ex: "PR", "SP")
export const fetchCities = async (sigla: string): Promise<City[]> => {
  if (!sigla) return [];

  if (citiesCache.has(sigla)) {
    return citiesCache.get(sigla) || [];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Erro na API do IBGE");

    const data = await response.json();

    const sorted = (data as { id: number; nome: string }[])
      .filter((city) => city && city.nome)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
      .map((city) => ({ id: city.id, name: city.nome }));

    citiesCache.set(sigla, sorted);
    return sorted;
  } catch (error) {
    console.error(`Erro ao buscar cidades de ${sigla}:`, error);
    return [];
  }
};