# Fase 9 (opcional) — Calculadoras — Design

## Sem persistência

Não há tabelas novas. Toda lógica é de cálculo puro, podendo viver inteiramente no frontend (funções utilitárias) — não é necessário round-trip ao backend, já que não há dados sensíveis ou compartilhados envolvidos.

## Funções de cálculo (`modules/calculators/lib`)

- `compoundInterest.ts`:
  ```
  function simulateCompoundInterest(input: {
    initialAmount: number;
    monthlyContribution: number;
    annualRate: number;
    months: number;
  }): { month: number; invested: number; interest: number; total: number }[]
  ```
  Calcula mês a mês: `invested` acumulado (aportes), `interest` acumulado (rendimento), `total = invested + interest`.

- `firstMillion.ts`:
  ```
  function monthsToFirstMillion(input: {
    currentNetWorth: number;
    monthlyContribution: number;
    annualRate: number;
  }): number
  ```
  Itera mês a mês aplicando a taxa mensal equivalente até `total >= 1_000_000`.

- `financeVsRent.ts`:
  ```
  function compareFinanceVsRent(input: {
    propertyValue: number;
    downPayment: number;
    financeAnnualRate: number;
    termMonths: number;
    equivalentRent: number;
    investmentAnnualRate: number; // taxa para o dinheiro não usado como entrada, investido
  }): { financeNetWorth: number; rentNetWorth: number; recommendation: 'finance' | 'rent' }
  ```
  Simula patrimônio final em cada cenário ao fim do prazo.

## Frontend

- Rota `app/calculadoras/page.tsx` → `modules/calculators/components/CalculatorsPage.tsx` com 3 abas/cards.
- `CompoundInterestCalculator.tsx` + `CompoundInterestChart.tsx` (Recharts, tooltip por mês mostrando rendimento daquele ponto).
- `FirstMillionCalculator.tsx` (pode pré-preencher `currentNetWorth` puxando de `GET /net-worth/summary` da Fase 7, mas editável).
- `FinanceVsRentCalculator.tsx`.

## Se decidir mover cálculo para o backend no futuro

Endpoints stateless equivalentes (`POST /calculators/compound-interest`, etc.) podem ser adicionados sem quebrar o frontend, desde que o client de API já esteja isolado em `modules/calculators/api/` — decisão adiada, não bloqueia o MVP.

## Padrões de projeto aplicados

- Funções puras e testáveis isoladas de qualquer camada de UI ou HTTP — facilita testar regra de negócio sem mocks de rede.
