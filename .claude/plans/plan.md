# Plano: Integração BrAPI com Supabase Self-Hosted

> **Versão**: 5.0 | **Foco**: Cobertura Completa de Dados | **Compatível com**: Ralph Wiggum Plugin
>
> **Changelog v5.0**: Adicionadas Tabelas Fundamentalistas e Macroeconômicas
> - **NOVO**: 10 novas tabelas (balance_sheets, income_statements, key_statistics, financial_data, cashflows, value_added, crypto_quotes, currency_quotes, inflation_data, prime_rate_data)
> - **NOVO**: Abordagem híbrida (campos tipados + JSONB)
> - **NOVO**: Mapeamento Schema → Tabela documentado
> - **NOVO**: Edge Functions para módulos fundamentalistas
> - **NOVO**: Índices otimizados para JSONB
> - Mantido todo o conteúdo da v4.0
>
> **Changelog v4.0**: Adicionada Etapa 0 - Inventário Completo de Dados
> - Inventário exaustivo de TODOS os campos da BrAPI (400+ campos)
> - Documentação de todos os 11 endpoints
> - Documentação de todos os 15 módulos fundamentalistas
> - Documentação de todos os 30+ schemas
> - Documentação de todos os enums (range, interval, type, sector, sortBy)

---

## 📋 META-INFORMAÇÕES

```yaml
projeto: nodusai-brapi-integration
ambiente: /root/repo/database/dbnodusai
especificacao: /root/repo/docs/brapi.yaml
completion_promise: "BRAPI_INTEGRATION_COMPLETE"
max_iterations: 50
```

---

## 🎯 OBJETIVO

Implementar integração completa com a BrAPI (API de dados do mercado financeiro brasileiro) no Supabase Self-Hosted, incluindo:
- Cache inteligente de cotações
- Proxy seguro para a API externa
- Estrutura de dados para mercado financeiro

---

## 📊 ETAPA 0: INVENTÁRIO COMPLETO DE DADOS DA BRAPI

> **Esta etapa é apenas documentação. Nenhum código é escrito aqui.**
> O objetivo é mapear TODOS os campos disponíveis para informar o design do banco de dados.

### 0.1 ENDPOINTS DA API (11 endpoints)

| # | Endpoint | Método | Descrição |
|---|----------|--------|-----------|
| 1 | `/api/quote/{tickers}` | GET | Cotação detalhada de ativos (ações, FIIs, ETFs, BDRs, índices) |
| 2 | `/api/quote/list` | GET | Lista paginada de cotações com filtros |
| 3 | `/api/available` | GET | Lista todos os tickers disponíveis |
| 4 | `/api/v2/crypto` | GET | Cotação de criptomoedas |
| 5 | `/api/v2/crypto/available` | GET | Lista criptomoedas disponíveis |
| 6 | `/api/v2/currency` | GET | Cotação de pares de moedas fiduciárias |
| 7 | `/api/v2/currency/available` | GET | Lista pares de moedas disponíveis |
| 8 | `/api/v2/inflation` | GET | Dados históricos de inflação |
| 9 | `/api/v2/inflation/available` | GET | Lista países com dados de inflação |
| 10 | `/api/v2/prime-rate` | GET | Taxa básica de juros (SELIC) |
| 11 | `/api/v2/prime-rate/available` | GET | Lista países com dados de taxa básica |

---

### 0.2 MÓDULOS FUNDAMENTALISTAS (15 módulos)

| # | Módulo | Periodicidade | Descrição |
|---|--------|---------------|-----------|
| 1 | `summaryProfile` | - | Perfil cadastral da empresa |
| 2 | `balanceSheetHistory` | Anual | Balanço Patrimonial |
| 3 | `balanceSheetHistoryQuarterly` | Trimestral | Balanço Patrimonial |
| 4 | `defaultKeyStatistics` | TTM | Principais indicadores |
| 5 | `defaultKeyStatisticsHistory` | Anual | Principais indicadores |
| 6 | `defaultKeyStatisticsHistoryQuarterly` | Trimestral | Principais indicadores |
| 7 | `incomeStatementHistory` | Anual | DRE (Resultado) |
| 8 | `incomeStatementHistoryQuarterly` | Trimestral | DRE (Resultado) |
| 9 | `financialData` | TTM | Dados financeiros |
| 10 | `financialDataHistory` | Anual | Dados financeiros |
| 11 | `financialDataHistoryQuarterly` | Trimestral | Dados financeiros |
| 12 | `valueAddedHistory` | Anual | DVA (Valor Adicionado) |
| 13 | `valueAddedHistoryQuarterly` | Trimestral | DVA (Valor Adicionado) |
| 14 | `cashflowHistory` | Anual | DFC (Fluxo de Caixa) |
| 15 | `cashflowHistoryQuarterly` | Trimestral | DFC (Fluxo de Caixa) |

---

### 0.3 ENUMS E PARÂMETROS

#### 0.3.1 Range (período histórico)
```
1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
```

#### 0.3.2 Interval (granularidade)
```
1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
```

#### 0.3.3 Type (tipo de ativo)
```
stock, fund, bdr
```

#### 0.3.4 Type (periodicidade de dados)
```
yearly, quarterly, ttm
```

#### 0.3.5 SortBy (ordenação)
```
name, close, change, change_abs, volume, market_cap_basic, sector
```

#### 0.3.6 SortOrder
```
asc, desc
```

#### 0.3.7 Setores Disponíveis (20 setores)
```
Basic Materials, Communication Services, Consumer Cyclical, Consumer Defensive,
Energy, Financial, Financial Services, Health, Healthcare, Industrials,
Real Estate, Technology, Utilities, Consumer Goods, Industrial Goods,
Energy Minerals, Finance, Process Industries, Retail Trade, Transportation
```

---

### 0.4 SCHEMAS E CAMPOS COMPLETOS

#### 0.4.1 QuoteResult (Cotação de Ativo) - 50 campos
```yaml
# Identificação
- symbol: string              # Ticker (ex: PETR4)
- shortName: string           # Nome curto
- longName: string            # Nome completo
- currency: string            # Moeda (BRL)
- logourl: string             # URL do logo

# Preço Atual
- regularMarketPrice: float   # Preço atual
- regularMarketOpen: float    # Preço de abertura
- regularMarketDayHigh: float # Máxima do dia
- regularMarketDayLow: float  # Mínima do dia
- regularMarketDayRange: string # Range do dia
- regularMarketPreviousClose: float # Fechamento anterior
- regularMarketChange: float  # Variação absoluta
- regularMarketChangePercent: float # Variação percentual
- regularMarketTime: datetime # Timestamp da cotação
- regularMarketVolume: int64  # Volume do dia

# Médias Móveis
- twoHundredDayAverage: float # MM 200 dias
- twoHundredDayAverageChange: float
- twoHundredDayAverageChangePercent: float

# 52 Semanas
- fiftyTwoWeekHigh: float     # Máxima 52 semanas
- fiftyTwoWeekLow: float      # Mínima 52 semanas
- fiftyTwoWeekRange: string
- fiftyTwoWeekHighChange: float
- fiftyTwoWeekHighChangePercent: float
- fiftyTwoWeekLowChange: float

# Volume
- averageDailyVolume3Month: int64
- averageDailyVolume10Day: int64

# Valor de Mercado
- marketCap: int64            # Market Cap

# Indicadores Básicos (fundamental=true)
- priceEarnings: float        # P/L
- earningsPerShare: float     # LPA

# Metadados
- updatedAt: datetime
- usedInterval: string
- usedRange: string
- validRanges: string[]
- validIntervals: string[]
```

#### 0.4.2 HistoricalDataPrice (OHLCV) - 7 campos
```yaml
- date: int64                 # Timestamp UNIX
- open: float                 # Preço abertura
- high: float                 # Preço máximo
- low: float                  # Preço mínimo
- close: float                # Preço fechamento
- volume: int64               # Volume
- adjustedClose: float        # Fechamento ajustado
```

#### 0.4.3 DividendsData - 3 arrays
```yaml
cashDividends[]:              # Proventos em dinheiro
  - assetIssued: string
  - paymentDate: datetime
  - rate: float               # Valor por ação
  - relatedTo: string
  - approvedOn: datetime
  - isinCode: string
  - label: string             # DIVIDENDO, JCP
  - lastDatePrior: datetime   # Data Com
  - remarks: string

stockDividends[]:             # Eventos corporativos
  - assetIssued: string
  - factor: float
  - completeFactor: string
  - approvedOn: datetime
  - isinCode: string
  - label: string             # DESDOBRAMENTO, GRUPAMENTO, BONIFICACAO
  - lastDatePrior: datetime
  - remarks: string

subscriptions[]:              # Subscrições
  - (estrutura variável)
```

#### 0.4.4 SummaryProfile (Perfil da Empresa) - 15 campos
```yaml
- address1: string
- address2: string
- city: string
- state: string
- zip: string
- country: string
- phone: string
- website: string
- industry: string
- industryKey: string
- industryDisp: string
- sector: string
- sectorKey: string
- sectorDisp: string
- longBusinessSummary: string
- fullTimeEmployees: int
- companyOfficers: object[]
```

#### 0.4.5 BalanceSheetEntry (Balanço Patrimonial) - 99 campos
```yaml
# Identificação
- symbol: string
- type: enum(yearly|quarterly)
- endDate: date

# ATIVO CIRCULANTE
- cash: int64                         # Caixa
- shortTermInvestments: int64         # Aplicações CP
- netReceivables: int64               # Recebíveis
- inventory: int64                    # Estoques
- otherCurrentAssets: int64
- totalCurrentAssets: int64           # Total AC

# ATIVO NÃO CIRCULANTE
- longTermInvestments: int64
- propertyPlantEquipment: int64       # Imobilizado
- otherAssets: int64
- totalAssets: int64                  # Total Ativo

# PASSIVO CIRCULANTE
- accountsPayable: int64              # Fornecedores
- shortLongTermDebt: int64            # Dívida CP
- otherCurrentLiab: int64
- totalCurrentLiabilities: int64      # Total PC

# PASSIVO NÃO CIRCULANTE
- longTermDebt: int64                 # Dívida LP
- otherLiab: int64
- totalLiab: int64                    # Total Passivo

# PATRIMÔNIO LÍQUIDO
- commonStock: int64                  # Capital Social
- retainedEarnings: int64             # Lucros Retidos
- treasuryStock: int64                # Ações em Tesouraria
- otherStockholderEquity: int64
- totalStockholderEquity: int64       # Total PL
- minorityInterest: int64
- netTangibleAssets: int64

# Campos específicos para BANCOS (30+ campos adicionais)
- interestEarningAssets: int64
- loans: int64
- deposits: int64
- capitalAdequacy: int64
- nonPerformingLoans: int64
# ... (outros campos bancários)

# Campos específicos para SEGURADORAS (20+ campos adicionais)
- technicalProvisions: int64
- insuranceAndReinsurance: int64
- complementaryPension: int64
- capitalization: int64
# ... (outros campos de seguros)
```

#### 0.4.6 DefaultKeyStatisticsEntry (Indicadores) - 35 campos
```yaml
# Identificação
- symbol: string
- type: enum(yearly|quarterly|ttm)
- updatedAt: date

# Valuation
- enterpriseValue: float              # Valor da Firma (EV)
- forwardPE: float                    # P/L Projetado
- priceToBook: float                  # P/VP
- pegRatio: float                     # PEG

# Margens e Rentabilidade
- profitMargins: float                # Margem Líquida

# Ações
- floatShares: int64                  # Free Float
- sharesOutstanding: int64            # Ações em Circulação
- heldPercentInsiders: float          # % Insiders
- heldPercentInstitutions: float      # % Institucional
- impliedSharesOutstanding: int64

# Valor Patrimonial
- bookValue: float                    # VPA

# Lucro por Ação
- trailingEps: float                  # LPA TTM
- forwardEps: float                   # LPA Projetado
- netIncomeToCommon: int64

# Crescimento
- earningsQuarterlyGrowth: float
- earningsAnnualGrowth: float

# Datas
- lastFiscalYearEnd: date
- nextFiscalYearEnd: date
- mostRecentQuarter: date

# Múltiplos
- enterpriseToRevenue: float          # EV/Receita
- enterpriseToEbitda: float           # EV/EBITDA

# Performance
- 52WeekChange: float
- SandP52WeekChange: float
- ytdReturn: float
- beta: float

# Dividendos
- lastDividendValue: float
- lastDividendDate: date
- dividendYield: float

# Split
- lastSplitFactor: string
- lastSplitDate: int64

# Ativos
- totalAssets: int64
```

#### 0.4.7 IncomeStatementEntry (DRE) - 45 campos
```yaml
# Identificação
- id: string
- symbol: string
- type: enum(yearly|quarterly)
- endDate: date
- updatedAt: date

# Receita
- totalRevenue: int64                 # Receita Líquida

# Custos
- costOfRevenue: int64                # CPV/CSP

# Lucro Bruto
- grossProfit: int64

# Despesas Operacionais
- researchDevelopment: int64          # P&D
- sellingGeneralAdministrative: int64 # SG&A
- salesExpenses: int64
- administrativeCosts: int64
- nonRecurring: int64
- otherOperatingExpenses: int64
- totalOperatingExpenses: int64

# Resultado Operacional
- operatingIncome: int64              # EBIT
- ebit: int64

# Resultado Financeiro
- totalOtherIncomeExpenseNet: int64
- interestExpense: int64
- financialResult: int64
- financialIncome: int64
- financialExpenses: int64

# Lucro Antes dos Impostos
- incomeBeforeTax: int64              # LAIR

# Impostos
- incomeTaxExpense: int64
- currentTaxes: int64
- deferredTaxes: int64

# Lucro Líquido
- netIncomeFromContinuingOps: int64
- discontinuedOperations: int64
- extraordinaryItems: int64
- effectOfAccountingCharges: int64
- otherItems: int64
- netIncome: int64                    # Lucro Líquido
- netIncomeApplicableToCommonShares: int64
- minorityInterest: int64

# LPA
- earningsPerShare: float
- basicEarningsPerShare: float
- dilutedEarningsPerShare: float
- basicEarningsPerCommonShare: float
- dilutedEarningsPerCommonShare: float
- basicEarningsPerPreferredShare: float
- dilutedEarningsPerPreferredShare: float

# Outros
- lossesDueToNonRecoverabilityOfAssets: int64
- otherOperatingIncome: int64
- equityIncomeResult: int64
- profitSharingAndStatutoryContributions: int64
- incomeBeforeStatutoryParticipationsAndContributions: int64

# Campos específicos para SEGURADORAS
- claimsAndOperationsCosts: int64
- insuranceOperations: int64
- reinsuranceOperations: int64
- complementaryPensionOperations: int64
- capitalizationOperations: int64
```

#### 0.4.8 FinancialDataEntry (Dados Financeiros) - 30 campos
```yaml
# Identificação
- symbol: string
- type: enum(yearly|quarterly|ttm)
- financialCurrency: string
- updatedAt: date

# Preço e Recomendações
- currentPrice: float
- targetHighPrice: float
- targetLowPrice: float
- targetMeanPrice: float
- targetMedianPrice: float
- recommendationMean: float
- recommendationKey: string
- numberOfAnalystOpinions: int

# EBITDA
- ebitda: int64

# Liquidez
- quickRatio: float                   # Liquidez Seca
- currentRatio: float                 # Liquidez Corrente

# Endividamento
- debtToEquity: float
- totalDebt: int64

# Receita e Lucro
- totalRevenue: int64
- grossProfits: int64
- revenuePerShare: float

# Rentabilidade
- returnOnAssets: float               # ROA
- returnOnEquity: float               # ROE

# Crescimento
- earningsGrowth: float
- revenueGrowth: float

# Margens
- grossMargins: float
- ebitdaMargins: float
- operatingMargins: float
- profitMargins: float

# Caixa
- totalCash: int64
- totalCashPerShare: float
- operatingCashflow: int64
- freeCashflow: int64
```

#### 0.4.9 ValueAddedEntry (DVA) - 55 campos
```yaml
# Identificação
- symbol: string
- type: enum(yearly|quarterly)
- endDate: date
- updatedAt: date

# 1. RECEITAS
- revenue: int64                              # Receitas totais
- productSales: int64
- revenueFromTheProvisionOfServices: int64
- financialIntermediationRevenue: int64       # Bancos
- otherRevenues: int64
- provisionOrReversalOfExpectedCreditRiskLosses: int64
- provisionOrReversalOfDoubtfulAccounts: int64
- constructionOfOwnAssets: int64

# Campos específicos para SEGURADORAS
- insuranceOperationsRevenue: int64
- complementaryPensionOperationsRevenue: int64
- feesRevenue: int64
- netOperatingRevenue: int64

# 2. INSUMOS
- suppliesPurchasedFromThirdParties: int64
- costsWithProductsSold: int64
- materialsEnergyAndOthers: int64
- thirdPartyMaterialsAndServices: int64
- services: int64
- lossOrRecoveryOfAssetValues: int64
- lossOrRecoveryOfAssets: int64
- otherSupplies: int64
- financialIntermediationExpenses: int64      # Bancos

# 3. VALOR ADICIONADO BRUTO
- grossAddedValue: int64

# 4. RETENÇÕES
- retentions: int64
- depreciationAndAmortization: int64
- otherRetentions: int64

# 5. VALOR ADICIONADO LÍQUIDO
- netAddedValue: int64
- netAddedValueProduced: int64

# 6. VALOR RECEBIDO EM TRANSFERÊNCIA
- addedValueReceivedByTransfer: int64
- addedValueReceivedOnTransfer: int64
- equityIncomeResult: int64
- financialIncome: int64
- otherValuesReceivedByTransfer: int64

# 7. VALOR A DISTRIBUIR
- addedValueToDistribute: int64
- totalAddedValueToDistribute: int64

# 8. DISTRIBUIÇÃO
- distributionOfAddedValue: int64
- teamRemuneration: int64                     # Pessoal
- taxes: int64                                # Impostos
- federalTaxes: int64
- stateTaxes: int64
- municipalTaxes: int64
- remunerationOfThirdPartyCapitals: int64     # Juros
- equityRemuneration: int64                   # Capital próprio
- ownEquityRemuneration: int64
- interestOnOwnEquity: int64                  # JCP
- dividends: int64                            # Dividendos
- retainedEarningsOrLoss: int64               # Lucros Retidos
- nonControllingShareOfRetainedEarnings: int64
- otherDistributions: int64

# Campos específicos para SEGURADORAS
- variationsOfTechnicalProvisions: int64
- insuranceOperationsVariations: int64
- pensionOperationsVariations: int64
- claimsAndBenefits: int64
- variationInDeferredSellingExpenses: int64
- resultsOfCededReinsuranceOperations: int64
- resultOfCoinsuranceOperationsAssigned: int64
- otherVariations: int64
```

#### 0.4.10 CashflowEntry (DFC) - 18 campos
```yaml
# Identificação
- symbol: string
- type: enum(yearly|quarterly)
- endDate: date
- updatedAt: date

# Fluxo Operacional
- operatingCashFlow: int64                    # FCO
- incomeFromOperations: int64
- netIncomeBeforeTaxes: int64
- adjustmentsToProfitOrLoss: int64
- changesInAssetsAndLiabilities: int64
- otherOperatingActivities: int64
- cashGeneratedInOperations: int64

# Fluxo de Investimento
- investmentCashFlow: int64                   # FCI

# Fluxo de Financiamento
- financingCashFlow: int64                    # FCF

# Variação Cambial
- exchangeVariationWithoutCash: int64
- foreignExchangeRateWithoutCash: int64

# Saldos
- increaseOrDecreaseInCash: int64
- initialCashBalance: int64
- finalCashBalance: int64
```

#### 0.4.11 CryptoCoin (Criptomoeda) - 20 campos
```yaml
- coin: string                                # Ticker (BTC, ETH)
- coinName: string                            # Nome completo
- currency: string                            # Moeda de cotação
- currencyRateFromUSD: float
- coinImageUrl: string

# Preço
- regularMarketPrice: float
- regularMarketChange: float
- regularMarketChangePercent: float
- regularMarketDayHigh: float
- regularMarketDayLow: float
- regularMarketDayRange: string
- regularMarketVolume: int64
- regularMarketTime: datetime
- marketCap: int64

# Histórico
- usedInterval: string
- usedRange: string
- validRanges: string[]
- validIntervals: string[]
- historicalDataPrice: CryptoHistoricalData[]
```

#### 0.4.12 CurrencyQuote (Par de Moedas) - 12 campos
```yaml
- fromCurrency: string                        # Moeda origem (USD)
- toCurrency: string                          # Moeda destino (BRL)
- name: string                                # Nome do par
- high: string                                # Máxima
- low: string                                 # Mínima
- bidPrice: string                            # Preço compra
- askPrice: string                            # Preço venda
- bidVariation: string                        # Variação
- percentageChange: string                    # Variação %
- updatedAtTimestamp: string                  # Timestamp UNIX
- updatedAtDate: string                       # Data formatada
```

#### 0.4.13 InflationEntry (Inflação) - 3 campos
```yaml
- date: string                                # DD/MM/YYYY
- value: string                               # Índice
- epochDate: int64                            # Timestamp
```

#### 0.4.14 PrimeRateEntry (Taxa SELIC) - 3 campos
```yaml
- date: string                                # DD/MM/YYYY
- value: string                               # Taxa
- epochDate: int64                            # Timestamp
```

#### 0.4.15 QuoteListResponse (Lista de Cotações) - 10 campos
```yaml
- indexes: IndexSummary[]
- stocks: StockSummary[]
- availableSectors: string[]
- availableStockTypes: string[]
- currentPage: int
- totalPages: int
- itemsPerPage: int
- totalCount: int
- hasNextPage: boolean
```

#### 0.4.16 StockSummary (Resumo de Ativo) - 8 campos
```yaml
- stock: string                               # Ticker
- name: string
- close: float
- change: float                               # Variação %
- volume: int64
- market_cap: float
- logo: string
- sector: string
- type: enum(stock|fund|bdr)
```

---

### 0.5 CONTAGEM TOTAL DE CAMPOS

| Categoria | Campos |
|-----------|--------|
| QuoteResult | 50 |
| HistoricalDataPrice | 7 |
| DividendsData (CashDividend + StockDividend) | 18 |
| SummaryProfile | 17 |
| BalanceSheetEntry | 99 |
| DefaultKeyStatisticsEntry | 35 |
| IncomeStatementEntry | 45 |
| FinancialDataEntry | 30 |
| ValueAddedEntry | 55 |
| CashflowEntry | 18 |
| CryptoCoin | 20 |
| CurrencyQuote | 12 |
| InflationEntry | 3 |
| PrimeRateEntry | 3 |
| QuoteListResponse + StockSummary | 18 |
| **TOTAL** | **430+ campos únicos** |

---

### 0.6 AÇÕES DE TESTE (Sem Autenticação)

```
PETR4, MGLU3, VALE3, ITUB4
```

Estas 4 ações podem ser consultadas sem token, com acesso completo a todos os recursos.

---

### 0.7 MAPEAMENTO SCHEMA → TABELA (v5.0)

| Schema no `brapi.yaml` | Tabela no `market_data` | Campos Tipados | JSONB |
|------------------------|-------------------------|----------------|-------|
| `QuoteResult` | `quotes` | 12 | ✅ `raw_response` |
| `HistoricalDataPrice` | `historical_prices` | 7 | ❌ |
| `CashDividend` + `StockDividend` | `dividends` | 9 | ✅ `raw_data` |
| `SummaryProfile` | `company_profiles` | 8 | ✅ `raw_data` |
| `BalanceSheetEntry` | `balance_sheets` | 15 | ✅ `raw_data` |
| `IncomeStatementEntry` | `income_statements` | 12 | ✅ `raw_data` |
| `DefaultKeyStatisticsEntry` | `key_statistics` | 15 | ✅ `raw_data` |
| `FinancialDataEntry` | `financial_data` | 12 | ✅ `raw_data` |
| `CashflowEntry` | `cashflows` | 8 | ✅ `raw_data` |
| `ValueAddedEntry` | `value_added` | 10 | ✅ `raw_data` |
| `CryptoCoin` | `crypto_quotes` | 10 | ✅ `raw_response` |
| `CurrencyQuote` | `currency_quotes` | 8 | ✅ `raw_response` |
| `InflationEntry` | `inflation_data` | 4 | ❌ |
| `PrimeRateEntry` | `prime_rate_data` | 4 | ❌ |

**Total**: 15 tabelas | ~130 campos tipados | ~300 campos em JSONB

---

## 📁 ESTRUTURA DE ARQUIVOS FINAL

```
/root/repo/database/dbnodusai/
├── .env                                    # [MODIFICAR] Adicionar BRAPI_TOKEN
├── volumes/
│   ├── db/
│   │   ├── 10-market-data-schema.sql      # [CRIAR] Schema market_data
│   │   ├── 11-market-data-tables.sql      # [CRIAR] Tabelas básicas (assets, quotes, historical, dividends)
│   │   ├── 12-market-data-fundamentals.sql # [CRIAR] v5.0 - Tabelas fundamentalistas
│   │   ├── 13-market-data-macro.sql       # [CRIAR] v5.0 - Tabelas macroeconômicas
│   │   ├── 14-market-data-indexes.sql     # [CRIAR] Índices (incluindo GIN para JSONB)
│   │   ├── 15-market-data-rls.sql         # [CRIAR] Políticas RLS
│   │   └── 16-market-data-functions.sql   # [CRIAR] Functions SQL
│   └── functions/
│       ├── _shared/
│       │   ├── cors.ts                    # [CRIAR] Headers CORS
│       │   ├── supabase.ts                # [CRIAR] Cliente Supabase
│       │   └── brapi-client.ts            # [CRIAR] Cliente BrAPI (atualizado v5.0)
│       ├── brapi/
│       │   └── index.ts                   # [CRIAR] Edge Function BrAPI
│       └── brapi-fundamentals/
│           └── index.ts                   # [CRIAR] v5.0 - Edge Function Fundamentalistas
```

---

## ✅ CHECKPOINT: VERIFICAÇÃO PRÉVIA

Antes de iniciar, verificar:

```bash
# 1. Docker está rodando?
docker ps | grep supabase

# 2. PostgreSQL acessível?
docker exec supabase-db psql -U postgres -c "SELECT version();"

# 3. Edge Functions runtime disponível?
docker exec supabase-functions deno --version
```

**Critério de Sucesso**: Todos os 3 comandos executam sem erro.

---

## 🔧 ETAPA 1: CONFIGURAÇÃO DO AMBIENTE

### Tarefa 1.1: Adicionar BRAPI_TOKEN ao .env

**Arquivo**: `/root/repo/database/dbnodusai/.env`

**Ação**: Adicionar ao final do arquivo:
```env
# ===========================================
# BrAPI - API do Mercado Financeiro Brasileiro
# ===========================================
BRAPI_TOKEN=${BRAPI_TOKEN_VALUE}
BRAPI_BASE_URL=https://brapi.dev
```

**Critério de Aceitação**:
- [ ] Variável BRAPI_TOKEN existe no .env
- [ ] Valor não é placeholder vazio

**Verificação**:
```bash
grep "BRAPI_TOKEN=" /root/repo/database/dbnodusai/.env
```

---

### Tarefa 1.2: Adicionar market_data ao PGRST_DB_SCHEMAS

**Arquivo**: `/root/repo/database/dbnodusai/.env`

**Ação**: Modificar a linha PGRST_DB_SCHEMAS:
```env
# ANTES
PGRST_DB_SCHEMAS=public,storage,graphql_public

# DEPOIS
PGRST_DB_SCHEMAS=public,storage,graphql_public,market_data
```

**⚠️ CRÍTICO**: Sem esta configuração, o PostgREST **NÃO** expõe as tabelas do schema `market_data` via API REST.

**Critério de Aceitação**:
- [ ] market_data está incluído em PGRST_DB_SCHEMAS

**Verificação**:
```bash
grep "PGRST_DB_SCHEMAS" /root/repo/database/dbnodusai/.env
# Deve mostrar: PGRST_DB_SCHEMAS=public,storage,graphql_public,market_data
```

---

### Tarefa 1.3: Verificar docker-compose.yml para Edge Functions

**Arquivo**: `/root/repo/database/dbnodusai/docker-compose.yml`

**Ação**: Verificar se o serviço `functions` (ou `supabase-functions`) recebe as variáveis de ambiente:
```yaml
services:
  functions:
    environment:
      # ... outras variáveis ...
      - BRAPI_TOKEN=${BRAPI_TOKEN}
      - BRAPI_BASE_URL=${BRAPI_BASE_URL}
```

**Se não existir**, adicionar manualmente ao docker-compose.yml na seção do container de Edge Functions.

**Critério de Aceitação**:
- [ ] BRAPI_TOKEN e BRAPI_BASE_URL são passadas ao container de functions

---

## 🗄️ ETAPA 2: ESTRUTURA DO BANCO DE DADOS

### Tarefa 2.1: Criar Schema market_data

**Arquivo**: `/root/repo/database/dbnodusai/volumes/db/10-market-data-schema.sql`

**Conteúdo**:
```sql
-- ===========================================
-- Schema: market_data
-- Descrição: Dados do mercado financeiro (cache BrAPI)
-- Versão: 1.0
-- ===========================================

CREATE SCHEMA IF NOT EXISTS market_data;

COMMENT ON SCHEMA market_data IS 'Dados do mercado financeiro brasileiro - cache da BrAPI';

-- ===========================================
-- ⚠️ CRÍTICO: Permissões no Schema
-- Sem estas permissões, os roles não conseguem acessar as tabelas
-- ===========================================

-- Permitir que os roles acessem o schema
GRANT USAGE ON SCHEMA market_data TO anon, authenticated, service_role;

-- Permissões default para futuras tabelas
ALTER DEFAULT PRIVILEGES IN SCHEMA market_data
  GRANT SELECT ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA market_data
  GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA market_data
  GRANT ALL ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA market_data
  GRANT USAGE ON SEQUENCES TO anon, authenticated;
```

**⚠️ NOTA IMPORTANTE**: Os comandos `ALTER DEFAULT PRIVILEGES` só afetam tabelas criadas DEPOIS de executar este script. Por isso, executar este arquivo PRIMEIRO, antes dos outros.

**Critério de Aceitação**:
- [ ] Arquivo existe em volumes/db/
- [ ] Schema market_data criado no PostgreSQL
- [ ] Permissões concedidas aos roles

**Verificação**:
```bash
# Verificar schema
docker exec supabase-db psql -U postgres -c "\dn market_data"

# Verificar permissões
docker exec supabase-db psql -U postgres -c "\dn+ market_data"
```

---

### Tarefa 2.2: Criar Tabela market_data.assets

**Arquivo**: `/root/repo/database/dbnodusai/volumes/db/11-market-data-tables.sql`

**Conteúdo** (parcial - tabela assets):
```sql
-- ===========================================
-- Tabelas: market_data
-- ===========================================

-- Cadastro de ativos financeiros
CREATE TABLE IF NOT EXISTS market_data.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('stock', 'fii', 'etf', 'bdr', 'index', 'crypto')),
    sector VARCHAR(100),
    subsector VARCHAR(100),
    segment VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'BRL',
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE market_data.assets IS 'Cadastro de ativos financeiros da B3';
COMMENT ON COLUMN market_data.assets.ticker IS 'Código do ativo (ex: PETR4, VALE3)';
COMMENT ON COLUMN market_data.assets.type IS 'Tipo: stock, fii, etf, bdr, index, crypto';

-- Cache de cotações em tempo real
-- ⚠️ NOTA: Sem FK para assets - permite inserir cotações de qualquer ticker
--          O asset pode ser criado posteriormente de forma assíncrona
CREATE TABLE IF NOT EXISTS market_data.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    price DECIMAL(18,8) NOT NULL,
    change_percent DECIMAL(10,4),
    change_value DECIMAL(18,8),
    volume BIGINT,
    market_cap DECIMAL(20,2),
    previous_close DECIMAL(18,8),
    day_high DECIMAL(18,8),
    day_low DECIMAL(18,8),
    year_high DECIMAL(18,8),
    year_low DECIMAL(18,8),
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 minutes'),
    raw_response JSONB,
    -- UNIQUE constraint para permitir upsert com onConflict: 'ticker'
    CONSTRAINT uq_quotes_ticker UNIQUE (ticker)
);

COMMENT ON TABLE market_data.quotes IS 'Cache de cotações - TTL 5 minutos, apenas última cotação por ticker';

-- Dados históricos OHLCV
CREATE TABLE IF NOT EXISTS market_data.historical_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    open_price DECIMAL(18,8),
    high_price DECIMAL(18,8),
    low_price DECIMAL(18,8),
    close_price DECIMAL(18,8) NOT NULL,
    adjusted_close DECIMAL(18,8),
    volume BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_historical_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_historical_ticker_date UNIQUE (ticker, date)
);

COMMENT ON TABLE market_data.historical_prices IS 'Dados históricos OHLCV';

-- Proventos (dividendos, JCP, etc.)
CREATE TABLE IF NOT EXISTS market_data.dividends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('dividend', 'jcp', 'rendimento', 'bonus', 'subscription', 'split', 'grouping')),
    ex_date DATE NOT NULL,
    payment_date DATE,
    record_date DATE,
    value_per_share DECIMAL(18,8) NOT NULL,
    ratio DECIMAL(10,6),
    currency VARCHAR(10) DEFAULT 'BRL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_dividends_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_dividends_ticker_type_date UNIQUE (ticker, type, ex_date)
);

COMMENT ON TABLE market_data.dividends IS 'Histórico de proventos';

-- Configuração de cache
CREATE TABLE IF NOT EXISTS market_data.cache_config (
    data_type VARCHAR(50) PRIMARY KEY,
    ttl_seconds INTEGER NOT NULL,
    last_refresh TIMESTAMPTZ,
    next_refresh TIMESTAMPTZ,
    is_enabled BOOLEAN DEFAULT true
);

INSERT INTO market_data.cache_config (data_type, ttl_seconds) VALUES
    ('quotes', 300),           -- 5 minutos
    ('historical', 86400),     -- 24 horas
    ('dividends', 3600),       -- 1 hora
    ('assets', 604800)         -- 7 dias
ON CONFLICT (data_type) DO NOTHING;

COMMENT ON TABLE market_data.cache_config IS 'Configuração de TTL para cache';
```

**Critério de Aceitação**:
- [ ] Todas as 5 tabelas criadas (assets, quotes, historical_prices, dividends, cache_config)
- [ ] Constraints e foreign keys funcionando

**Verificação**:
```bash
docker exec supabase-db psql -U postgres -c "\dt market_data.*"
```

---

### Tarefa 2.3: Criar Tabelas Fundamentalistas (v5.0)

**Arquivo**: `/root/repo/database/dbnodusai/volumes/db/12-market-data-fundamentals.sql`

**Conteúdo**:
```sql
-- ===========================================
-- Tabelas Fundamentalistas: market_data (v5.0)
-- Abordagem híbrida: campos essenciais tipados + JSONB completo
-- ===========================================

-- Perfil da Empresa (SummaryProfile)
CREATE TABLE IF NOT EXISTS market_data.company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    -- Campos tipados essenciais
    sector VARCHAR(100),
    industry VARCHAR(100),
    website TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(100),
    full_time_employees INTEGER,
    long_business_summary TEXT,
    -- JSONB completo
    raw_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    CONSTRAINT fk_profiles_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_profiles_ticker UNIQUE (ticker)
);

COMMENT ON TABLE market_data.company_profiles IS 'Perfil cadastral das empresas (SummaryProfile)';

-- Balanço Patrimonial (BalanceSheetEntry)
CREATE TABLE IF NOT EXISTS market_data.balance_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('yearly', 'quarterly')),
    end_date DATE NOT NULL,
    -- Campos tipados essenciais (mais usados em análise)
    total_assets BIGINT,
    total_liabilities BIGINT,
    total_stockholder_equity BIGINT,
    cash BIGINT,
    short_term_investments BIGINT,
    net_receivables BIGINT,
    inventory BIGINT,
    total_current_assets BIGINT,
    total_current_liabilities BIGINT,
    long_term_debt BIGINT,
    short_long_term_debt BIGINT,
    retained_earnings BIGINT,
    common_stock BIGINT,
    minority_interest BIGINT,
    -- JSONB completo (99 campos)
    raw_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_balance_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_balance_ticker_period_date UNIQUE (ticker, period_type, end_date)
);

COMMENT ON TABLE market_data.balance_sheets IS 'Balanço Patrimonial - anual e trimestral';

-- DRE - Demonstração de Resultado (IncomeStatementEntry)
CREATE TABLE IF NOT EXISTS market_data.income_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('yearly', 'quarterly')),
    end_date DATE NOT NULL,
    -- Campos tipados essenciais
    total_revenue BIGINT,
    cost_of_revenue BIGINT,
    gross_profit BIGINT,
    operating_income BIGINT,
    ebit BIGINT,
    net_income BIGINT,
    income_before_tax BIGINT,
    income_tax_expense BIGINT,
    interest_expense BIGINT,
    research_development BIGINT,
    selling_general_administrative BIGINT,
    -- JSONB completo (45 campos)
    raw_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_income_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_income_ticker_period_date UNIQUE (ticker, period_type, end_date)
);

COMMENT ON TABLE market_data.income_statements IS 'DRE - Demonstração de Resultado';

-- Indicadores Chave (DefaultKeyStatisticsEntry)
CREATE TABLE IF NOT EXISTS market_data.key_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('yearly', 'quarterly', 'ttm')),
    updated_at DATE NOT NULL,
    -- Campos tipados essenciais
    enterprise_value DECIMAL(20,2),
    forward_pe DECIMAL(10,4),
    price_to_book DECIMAL(10,4),
    peg_ratio DECIMAL(10,4),
    profit_margins DECIMAL(10,6),
    book_value DECIMAL(18,4),
    trailing_eps DECIMAL(18,4),
    forward_eps DECIMAL(18,4),
    dividend_yield DECIMAL(10,6),
    beta DECIMAL(10,4),
    shares_outstanding BIGINT,
    float_shares BIGINT,
    enterprise_to_ebitda DECIMAL(10,4),
    enterprise_to_revenue DECIMAL(10,4),
    -- JSONB completo (35 campos)
    raw_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_stats_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_stats_ticker_period_date UNIQUE (ticker, period_type, updated_at)
);

COMMENT ON TABLE market_data.key_statistics IS 'Indicadores chave - P/L, P/VP, etc.';

-- Dados Financeiros (FinancialDataEntry)
CREATE TABLE IF NOT EXISTS market_data.financial_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('yearly', 'quarterly', 'ttm')),
    updated_at DATE NOT NULL,
    -- Campos tipados essenciais
    current_price DECIMAL(18,4),
    ebitda BIGINT,
    total_revenue BIGINT,
    total_debt BIGINT,
    total_cash BIGINT,
    operating_cashflow BIGINT,
    free_cashflow BIGINT,
    return_on_assets DECIMAL(10,6),
    return_on_equity DECIMAL(10,6),
    gross_margins DECIMAL(10,6),
    operating_margins DECIMAL(10,6),
    profit_margins DECIMAL(10,6),
    -- JSONB completo (30 campos)
    raw_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_financial_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_financial_ticker_period_date UNIQUE (ticker, period_type, updated_at)
);

COMMENT ON TABLE market_data.financial_data IS 'Dados financeiros - margens, liquidez, etc.';

-- Fluxo de Caixa (CashflowEntry)
CREATE TABLE IF NOT EXISTS market_data.cashflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('yearly', 'quarterly')),
    end_date DATE NOT NULL,
    -- Campos tipados essenciais
    operating_cashflow BIGINT,
    investment_cashflow BIGINT,
    financing_cashflow BIGINT,
    net_income_before_taxes BIGINT,
    increase_or_decrease_in_cash BIGINT,
    initial_cash_balance BIGINT,
    final_cash_balance BIGINT,
    -- JSONB completo (18 campos)
    raw_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_cashflow_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_cashflow_ticker_period_date UNIQUE (ticker, period_type, end_date)
);

COMMENT ON TABLE market_data.cashflows IS 'DFC - Demonstração de Fluxo de Caixa';

-- DVA - Demonstração de Valor Adicionado (ValueAddedEntry)
CREATE TABLE IF NOT EXISTS market_data.value_added (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(20) NOT NULL,
    period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('yearly', 'quarterly')),
    end_date DATE NOT NULL,
    -- Campos tipados essenciais
    revenue BIGINT,
    gross_added_value BIGINT,
    net_added_value BIGINT,
    total_added_value_to_distribute BIGINT,
    team_remuneration BIGINT,
    taxes BIGINT,
    dividends BIGINT,
    retained_earnings_or_loss BIGINT,
    depreciation_and_amortization BIGINT,
    -- JSONB completo (55 campos)
    raw_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_dva_asset FOREIGN KEY (ticker) REFERENCES market_data.assets(ticker) ON DELETE CASCADE,
    CONSTRAINT uq_dva_ticker_period_date UNIQUE (ticker, period_type, end_date)
);

COMMENT ON TABLE market_data.value_added IS 'DVA - Demonstração de Valor Adicionado';
```

**Critério de Aceitação**:
- [ ] 7 tabelas fundamentalistas criadas
- [ ] Campos tipados para consultas frequentes
- [ ] JSONB para dados completos
- [ ] Constraints e foreign keys funcionando

**Verificação**:
```bash
docker exec supabase-db psql -U postgres -c "\dt market_data.*"
# Deve mostrar: company_profiles, balance_sheets, income_statements,
#               key_statistics, financial_data, cashflows, value_added
```

---

### Tarefa 2.4: Criar Tabelas Macroeconômicas (v5.0)

**Arquivo**: `/root/repo/database/dbnodusai/volumes/db/13-market-data-macro.sql`

**Conteúdo**:
```sql
-- ===========================================
-- Tabelas Macroeconômicas: market_data (v5.0)
-- Criptomoedas, Moedas, Inflação, SELIC
-- ===========================================

-- Cotações de Criptomoedas (CryptoCoin)
CREATE TABLE IF NOT EXISTS market_data.crypto_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coin VARCHAR(20) NOT NULL,
    coin_name VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'BRL',
    -- Campos tipados essenciais
    price DECIMAL(18,8) NOT NULL,
    change_percent DECIMAL(10,4),
    change_value DECIMAL(18,8),
    volume BIGINT,
    market_cap DECIMAL(20,2),
    day_high DECIMAL(18,8),
    day_low DECIMAL(18,8),
    coin_image_url TEXT,
    -- JSONB completo
    raw_response JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 minutes'),
    CONSTRAINT uq_crypto_coin UNIQUE (coin)
);

COMMENT ON TABLE market_data.crypto_quotes IS 'Cotações de criptomoedas - BTC, ETH, etc.';

-- Cotações de Moedas (CurrencyQuote)
CREATE TABLE IF NOT EXISTS market_data.currency_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    pair_name VARCHAR(50),
    -- Campos tipados essenciais
    bid_price DECIMAL(18,8) NOT NULL,
    ask_price DECIMAL(18,8),
    high DECIMAL(18,8),
    low DECIMAL(18,8),
    variation DECIMAL(10,4),
    percentage_change DECIMAL(10,4),
    -- JSONB completo
    raw_response JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 minutes'),
    CONSTRAINT uq_currency_pair UNIQUE (from_currency, to_currency)
);

COMMENT ON TABLE market_data.currency_quotes IS 'Cotações de pares de moedas - USD/BRL, EUR/BRL, etc.';

-- Dados de Inflação (InflationEntry)
CREATE TABLE IF NOT EXISTS market_data.inflation_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(50) NOT NULL DEFAULT 'brazil',
    date DATE NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    epoch_date BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_inflation_country_date UNIQUE (country, date)
);

COMMENT ON TABLE market_data.inflation_data IS 'Dados históricos de inflação por país';

-- Taxa SELIC / Prime Rate (PrimeRateEntry)
CREATE TABLE IF NOT EXISTS market_data.prime_rate_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(50) NOT NULL DEFAULT 'brazil',
    date DATE NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    epoch_date BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_prime_rate_country_date UNIQUE (country, date)
);

COMMENT ON TABLE market_data.prime_rate_data IS 'Taxa básica de juros (SELIC) por país';

-- Atualizar configuração de cache para novos tipos
INSERT INTO market_data.cache_config (data_type, ttl_seconds) VALUES
    ('company_profiles', 604800),    -- 7 dias
    ('balance_sheets', 86400),       -- 24 horas
    ('income_statements', 86400),    -- 24 horas
    ('key_statistics', 3600),        -- 1 hora
    ('financial_data', 3600),        -- 1 hora
    ('cashflows', 86400),            -- 24 horas
    ('value_added', 86400),          -- 24 horas
    ('crypto_quotes', 300),          -- 5 minutos
    ('currency_quotes', 300),        -- 5 minutos
    ('inflation_data', 86400),       -- 24 horas
    ('prime_rate_data', 86400)       -- 24 horas
ON CONFLICT (data_type) DO NOTHING;
```

**Critério de Aceitação**:
- [ ] 4 tabelas macroeconômicas criadas
- [ ] Configuração de cache atualizada

**Verificação**:
```bash
docker exec supabase-db psql -U postgres -c "\dt market_data.*"
# Deve mostrar: crypto_quotes, currency_quotes, inflation_data, prime_rate_data

docker exec supabase-db psql -U postgres -c "SELECT * FROM market_data.cache_config ORDER BY data_type;"
# Deve mostrar 15 tipos de dados configurados
```

---

### Tarefa 2.5: Criar Índices (Atualizado v5.0)

**Arquivo**: `/root/repo/database/dbnodusai/volumes/db/14-market-data-indexes.sql`

**Conteúdo**:
```sql
-- ===========================================
-- Índices: market_data (v5.0)
-- Inclui índices GIN para colunas JSONB
-- ===========================================

-- ============ TABELAS BÁSICAS ============

-- Assets
CREATE INDEX IF NOT EXISTS idx_assets_type ON market_data.assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_sector ON market_data.assets(sector);

-- Quotes
CREATE INDEX IF NOT EXISTS idx_quotes_fetched_at ON market_data.quotes(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_expires_at ON market_data.quotes(expires_at);

-- Historical
CREATE INDEX IF NOT EXISTS idx_historical_ticker_date ON market_data.historical_prices(ticker, date DESC);

-- Dividends
CREATE INDEX IF NOT EXISTS idx_dividends_ticker ON market_data.dividends(ticker);
CREATE INDEX IF NOT EXISTS idx_dividends_ex_date ON market_data.dividends(ex_date DESC);

-- ============ TABELAS FUNDAMENTALISTAS (v5.0) ============

-- Company Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_sector ON market_data.company_profiles(sector);
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON market_data.company_profiles(industry);

-- Balance Sheets
CREATE INDEX IF NOT EXISTS idx_balance_ticker_date ON market_data.balance_sheets(ticker, end_date DESC);
CREATE INDEX IF NOT EXISTS idx_balance_period ON market_data.balance_sheets(period_type);

-- Income Statements
CREATE INDEX IF NOT EXISTS idx_income_ticker_date ON market_data.income_statements(ticker, end_date DESC);
CREATE INDEX IF NOT EXISTS idx_income_period ON market_data.income_statements(period_type);

-- Key Statistics
CREATE INDEX IF NOT EXISTS idx_stats_ticker_date ON market_data.key_statistics(ticker, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_stats_period ON market_data.key_statistics(period_type);

-- Financial Data
CREATE INDEX IF NOT EXISTS idx_financial_ticker_date ON market_data.financial_data(ticker, updated_at DESC);

-- Cashflows
CREATE INDEX IF NOT EXISTS idx_cashflow_ticker_date ON market_data.cashflows(ticker, end_date DESC);

-- Value Added
CREATE INDEX IF NOT EXISTS idx_dva_ticker_date ON market_data.value_added(ticker, end_date DESC);

-- ============ TABELAS MACROECONÔMICAS (v5.0) ============

-- Crypto Quotes
CREATE INDEX IF NOT EXISTS idx_crypto_fetched ON market_data.crypto_quotes(fetched_at DESC);

-- Currency Quotes
CREATE INDEX IF NOT EXISTS idx_currency_fetched ON market_data.currency_quotes(fetched_at DESC);

-- Inflation Data
CREATE INDEX IF NOT EXISTS idx_inflation_date ON market_data.inflation_data(country, date DESC);

-- Prime Rate Data
CREATE INDEX IF NOT EXISTS idx_prime_rate_date ON market_data.prime_rate_data(country, date DESC);

-- ============ ÍNDICES GIN PARA JSONB (v5.0) ============
-- Permitem consultas eficientes em campos JSONB

CREATE INDEX IF NOT EXISTS idx_quotes_raw_gin ON market_data.quotes USING GIN (raw_response jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_balance_raw_gin ON market_data.balance_sheets USING GIN (raw_data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_income_raw_gin ON market_data.income_statements USING GIN (raw_data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_stats_raw_gin ON market_data.key_statistics USING GIN (raw_data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_financial_raw_gin ON market_data.financial_data USING GIN (raw_data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_cashflow_raw_gin ON market_data.cashflows USING GIN (raw_data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_dva_raw_gin ON market_data.value_added USING GIN (raw_data jsonb_path_ops);
```

**Critério de Aceitação**:
- [ ] Todos os índices criados

**Verificação**:
```bash
docker exec supabase-db psql -U postgres -c "\di market_data.*"
```

---

### Tarefa 2.6: Criar Políticas RLS (Atualizado v5.0)

**Arquivo**: `/root/repo/database/dbnodusai/volumes/db/15-market-data-rls.sql`

**Conteúdo**:
```sql
-- ===========================================
-- RLS: market_data (v5.0)
-- Leitura pública para autenticados, escrita apenas service_role
-- ===========================================

-- ============ HABILITAR RLS EM TODAS AS TABELAS ============

-- Tabelas básicas
ALTER TABLE market_data.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.historical_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.cache_config ENABLE ROW LEVEL SECURITY;

-- Tabelas fundamentalistas (v5.0)
ALTER TABLE market_data.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.balance_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.income_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.key_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.cashflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.value_added ENABLE ROW LEVEL SECURITY;

-- Tabelas macroeconômicas (v5.0)
ALTER TABLE market_data.crypto_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.currency_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.inflation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data.prime_rate_data ENABLE ROW LEVEL SECURITY;

-- ============ POLÍTICAS DE LEITURA PARA AUTHENTICATED ============

-- Função helper para criar políticas de leitura
DO $$
DECLARE
    tables TEXT[] := ARRAY[
        'assets', 'quotes', 'historical_prices', 'dividends', 'cache_config',
        'company_profiles', 'balance_sheets', 'income_statements',
        'key_statistics', 'financial_data', 'cashflows', 'value_added',
        'crypto_quotes', 'currency_quotes', 'inflation_data', 'prime_rate_data'
    ];
    t TEXT;
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format(
            'CREATE POLICY IF NOT EXISTS "Authenticated users can read %s"
             ON market_data.%s FOR SELECT TO authenticated USING (true)',
            t, t
        );
    END LOOP;
END $$;

-- ============ POLÍTICAS DE ESCRITA PARA SERVICE_ROLE ============

DO $$
DECLARE
    tables TEXT[] := ARRAY[
        'assets', 'quotes', 'historical_prices', 'dividends', 'cache_config',
        'company_profiles', 'balance_sheets', 'income_statements',
        'key_statistics', 'financial_data', 'cashflows', 'value_added',
        'crypto_quotes', 'currency_quotes', 'inflation_data', 'prime_rate_data'
    ];
    t TEXT;
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format(
            'CREATE POLICY IF NOT EXISTS "Service role full access %s"
             ON market_data.%s FOR ALL TO service_role
             USING (true) WITH CHECK (true)',
            t, t
        );
    END LOOP;
END $$;
```

**Critério de Aceitação**:
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas de leitura para authenticated
- [ ] Políticas de escrita para service_role

---

### Tarefa 2.5: Criar Functions SQL

**Arquivo**: `/root/repo/database/dbnodusai/volumes/db/14-market-data-functions.sql`

**Conteúdo**:
```sql
-- ===========================================
-- Functions: market_data
-- ===========================================

-- Função para limpar cache expirado
CREATE OR REPLACE FUNCTION market_data.cleanup_expired_quotes()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM market_data.quotes
    WHERE expires_at < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION market_data.cleanup_expired_quotes IS 'Remove cotações expiradas do cache';

-- Função para verificar se cache está válido
CREATE OR REPLACE FUNCTION market_data.is_cache_valid(p_ticker VARCHAR, p_data_type VARCHAR DEFAULT 'quotes')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_expires_at TIMESTAMPTZ;
BEGIN
    IF p_data_type = 'quotes' THEN
        SELECT expires_at INTO v_expires_at
        FROM market_data.quotes
        WHERE ticker = p_ticker
        ORDER BY fetched_at DESC
        LIMIT 1;

        RETURN v_expires_at IS NOT NULL AND v_expires_at > NOW();
    END IF;

    RETURN FALSE;
END;
$$;

COMMENT ON FUNCTION market_data.is_cache_valid IS 'Verifica se cache de um ticker está válido';

-- Função para obter cotação com cache
CREATE OR REPLACE FUNCTION market_data.get_quote(p_ticker VARCHAR)
RETURNS TABLE (
    ticker VARCHAR,
    price DECIMAL,
    change_percent DECIMAL,
    volume BIGINT,
    fetched_at TIMESTAMPTZ,
    is_cached BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.ticker,
        q.price,
        q.change_percent,
        q.volume,
        q.fetched_at,
        (q.expires_at > NOW()) as is_cached
    FROM market_data.quotes q
    WHERE q.ticker = p_ticker
    ORDER BY q.fetched_at DESC
    LIMIT 1;
END;
$$;

COMMENT ON FUNCTION market_data.get_quote IS 'Retorna cotação mais recente de um ticker';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION market_data.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_assets_updated_at
    BEFORE UPDATE ON market_data.assets
    FOR EACH ROW
    EXECUTE FUNCTION market_data.set_updated_at();
```

**Critério de Aceitação**:
- [ ] Todas as functions criadas
- [ ] Trigger funcionando

**Verificação**:
```bash
docker exec supabase-db psql -U postgres -c "\df market_data.*"
```

---

## ⚡ ETAPA 3: EDGE FUNCTIONS

### Tarefa 3.1: Criar _shared/cors.ts

**Arquivo**: `/root/repo/database/dbnodusai/volumes/functions/_shared/cors.ts`

**Conteúdo**:
```typescript
// ===========================================
// CORS Headers para Edge Functions
// ===========================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}
```

**Critério de Aceitação**:
- [ ] Arquivo existe
- [ ] Exporta corsHeaders e handleCors

---

### Tarefa 3.2: Criar _shared/supabase.ts

**Arquivo**: `/root/repo/database/dbnodusai/volumes/functions/_shared/supabase.ts`

**Conteúdo**:
```typescript
// ===========================================
// Cliente Supabase para Edge Functions
// ===========================================

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function createSupabaseClient(req: Request): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createSupabaseClientWithAuth(req: Request): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  const authHeader = req.headers.get('Authorization');

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader ?? '' },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

**Critério de Aceitação**:
- [ ] Arquivo existe
- [ ] Exporta createSupabaseClient e createSupabaseClientWithAuth

---

### Tarefa 3.3: Criar _shared/brapi-client.ts

**Arquivo**: `/root/repo/database/dbnodusai/volumes/functions/_shared/brapi-client.ts`

**Conteúdo**:
```typescript
// ===========================================
// Cliente BrAPI para Edge Functions
// ===========================================

const BRAPI_BASE_URL = Deno.env.get('BRAPI_BASE_URL') || 'https://brapi.dev';
const BRAPI_TOKEN = Deno.env.get('BRAPI_TOKEN') || '';

export interface BrAPIQuoteResult {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  regularMarketPreviousClose: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  historicalDataPrice?: Array<{
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjustedClose: number;
  }>;
  dividendsData?: {
    cashDividends: Array<{
      assetIssued: string;
      paymentDate: string;
      rate: number;
      relatedTo: string;
      approvedOn: string;
      isinCode: string;
      label: string;
      lastDatePrior: string;
      priceUnit: string;
    }>;
  };
}

export interface BrAPIResponse {
  results: BrAPIQuoteResult[];
  requestedAt: string;
  took: string;
}

export interface BrAPIError {
  error: boolean;
  message: string;
}

export class BrAPIClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = BRAPI_BASE_URL;
    this.token = BRAPI_TOKEN;
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Adicionar token se disponível
    if (this.token) {
      params.token = this.token;
    }

    // Adicionar parâmetros à URL
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json() as BrAPIError;
      throw new Error(error.message || `BrAPI error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Buscar cotações de ativos
   * @param tickers Lista de tickers separados por vírgula (ex: "PETR4,VALE3")
   * @param options Opções adicionais
   */
  async getQuote(
    tickers: string,
    options: {
      range?: string;      // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
      interval?: string;   // 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
      fundamental?: boolean;
      dividends?: boolean;
      modules?: string;
    } = {}
  ): Promise<BrAPIResponse> {
    const params: Record<string, string> = {};

    if (options.range) params.range = options.range;
    if (options.interval) params.interval = options.interval;
    if (options.fundamental) params.fundamental = 'true';
    if (options.dividends) params.dividends = 'true';
    if (options.modules) params.modules = options.modules;

    return this.request<BrAPIResponse>(`/api/quote/${tickers}`, params);
  }

  /**
   * Listar ativos disponíveis
   */
  async getAvailable(search?: string): Promise<{ indexes: string[]; stocks: string[] }> {
    const params: Record<string, string> = {};
    if (search) params.search = search;

    return this.request(`/api/available`, params);
  }

  /**
   * Listar cotações com filtros
   */
  async getQuoteList(options: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    page?: number;
    type?: string;
    sector?: string;
  } = {}): Promise<any> {
    const params: Record<string, string> = {};

    if (options.search) params.search = options.search;
    if (options.sortBy) params.sortBy = options.sortBy;
    if (options.sortOrder) params.sortOrder = options.sortOrder;
    if (options.limit) params.limit = options.limit.toString();
    if (options.page) params.page = options.page.toString();
    if (options.type) params.type = options.type;
    if (options.sector) params.sector = options.sector;

    return this.request(`/api/quote/list`, params);
  }
}

// Singleton
export const brapiClient = new BrAPIClient();
```

**Critério de Aceitação**:
- [ ] Arquivo existe
- [ ] Classe BrAPIClient implementada
- [ ] Métodos getQuote, getAvailable, getQuoteList funcionando

---

### Tarefa 3.4: Criar brapi/index.ts

**Arquivo**: `/root/repo/database/dbnodusai/volumes/functions/brapi/index.ts`

**Conteúdo**:
```typescript
// ===========================================
// Edge Function: BrAPI Proxy
// Endpoint: /functions/v1/brapi
// ===========================================

// ⚠️ ATUALIZADO: Deno std 0.224.0 (versão mais recente em Jan 2025)
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createSupabaseClient } from '../_shared/supabase.ts';
import { brapiClient, BrAPIQuoteResult } from '../_shared/brapi-client.ts';

interface RequestBody {
  action: 'quote' | 'historical' | 'dividends' | 'search' | 'list';
  tickers?: string;
  options?: Record<string, any>;
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request
    const body: RequestBody = await req.json();
    const { action, tickers, options = {} } = body;

    // Validar action
    if (!action) {
      return new Response(
        JSON.stringify({ error: true, message: 'Missing action parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Supabase para cache
    const supabase = createSupabaseClient(req);
    let result: any;

    switch (action) {
      case 'quote': {
        if (!tickers) {
          return new Response(
            JSON.stringify({ error: true, message: 'Missing tickers parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const tickerList = tickers.split(',').map(t => t.trim().toUpperCase());

        // ⚠️ CORRIGIDO: .schema() ANTES de .from()
        // Buscar cache válido (não expirado)
        const { data: validCachedQuotes } = await supabase
          .schema('market_data')
          .from('quotes')
          .select('*')
          .in('ticker', tickerList)
          .gt('expires_at', new Date().toISOString());

        const validCachedTickers = new Set(validCachedQuotes?.map(q => q.ticker) || []);
        const missingTickers = tickerList.filter(t => !validCachedTickers.has(t));

        let freshQuotes: BrAPIQuoteResult[] = [];
        let brapiError: Error | null = null;

        // Buscar tickers não cacheados da BrAPI
        if (missingTickers.length > 0) {
          try {
            const brapiResponse = await brapiClient.getQuote(
              missingTickers.join(','),
              options
            );
            freshQuotes = brapiResponse.results;

            // Salvar no cache
            for (const quote of freshQuotes) {
              // ⚠️ CORRIGIDO: .schema() ANTES de .from()
              await supabase
                .schema('market_data')
                .from('quotes')
                .upsert({
                  ticker: quote.symbol,
                  price: quote.regularMarketPrice,
                  change_percent: quote.regularMarketChangePercent,
                  change_value: quote.regularMarketChange,
                  volume: quote.regularMarketVolume,
                  market_cap: quote.marketCap,
                  previous_close: quote.regularMarketPreviousClose,
                  day_high: quote.regularMarketDayHigh,
                  day_low: quote.regularMarketDayLow,
                  year_high: quote.fiftyTwoWeekHigh,
                  year_low: quote.fiftyTwoWeekLow,
                  fetched_at: new Date().toISOString(),
                  expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                  raw_response: quote,
                }, { onConflict: 'ticker' });
            }
          } catch (error) {
            // ⚠️ NOVO: Capturar erro da BrAPI para fallback
            brapiError = error as Error;
            console.error('BrAPI request failed:', error);
          }
        }

        // ⚠️ NOVO: Fallback para cache expirado se BrAPI falhar
        let expiredCacheUsed = false;
        if (brapiError && missingTickers.length > 0) {
          // Buscar cache expirado como fallback
          const { data: expiredCachedQuotes } = await supabase
            .schema('market_data')
            .from('quotes')
            .select('*')
            .in('ticker', missingTickers);

          if (expiredCachedQuotes && expiredCachedQuotes.length > 0) {
            freshQuotes = expiredCachedQuotes.map(q => ({
              ...q.raw_response,
              _stale: true,
              _staleReason: brapiError?.message,
            }));
            expiredCacheUsed = true;
          }
        }

        // Combinar resultados
        const allQuotes = [
          ...(validCachedQuotes || []).map(q => ({
            ...q.raw_response,
            _cached: true,
            _cachedAt: q.fetched_at,
          })),
          ...freshQuotes.map(q => ({
            ...q,
            _cached: expiredCacheUsed,
          })),
        ];

        result = {
          results: allQuotes,
          requestedAt: new Date().toISOString(),
          cached: validCachedQuotes?.length || 0,
          fresh: expiredCacheUsed ? 0 : freshQuotes.length,
          stale: expiredCacheUsed ? freshQuotes.length : 0,
          warning: brapiError ? `BrAPI unavailable: ${brapiError.message}` : undefined,
        };
        break;
      }

      case 'search': {
        const search = options.search || tickers || '';
        result = await brapiClient.getAvailable(search);
        break;
      }

      case 'list': {
        result = await brapiClient.getQuoteList(options);
        break;
      }

      case 'historical': {
        if (!tickers) {
          return new Response(
            JSON.stringify({ error: true, message: 'Missing tickers parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = await brapiClient.getQuote(tickers, {
          range: options.range || '1mo',
          interval: options.interval || '1d',
        });
        break;
      }

      case 'dividends': {
        if (!tickers) {
          return new Response(
            JSON.stringify({ error: true, message: 'Missing tickers parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = await brapiClient.getQuote(tickers, { dividends: true });
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: true, message: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('BrAPI Edge Function error:', error);
    return new Response(
      JSON.stringify({ error: true, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Critério de Aceitação**:
- [ ] Arquivo existe
- [ ] Ações quote, search, list, historical, dividends implementadas
- [ ] Cache funcionando para quotes

---

## 🧪 ETAPA 4: DEPLOY E VALIDAÇÃO

### Tarefa 4.0: Reiniciar Containers (⚠️ OBRIGATÓRIO)

**⚠️ CRÍTICO**: Após modificar `.env`, é **OBRIGATÓRIO** reiniciar os containers para que as novas variáveis de ambiente sejam carregadas.

```bash
cd /root/repo/database/dbnodusai

# Opção 1: Reinício completo (mais seguro)
docker-compose down && docker-compose up -d

# Opção 2: Reinício com recreate (mantém volumes)
docker-compose up -d --force-recreate

# Aguardar containers iniciarem completamente
sleep 30

# Verificar status
docker-compose ps
```

**Critério de Aceitação**:
- [ ] Todos os containers estão com status "Up"
- [ ] Nenhum container em estado "Restarting"

---

### Tarefa 4.1: Executar Scripts SQL (MANUAL)

**⚠️ IMPORTANTE**: Os arquivos em `volumes/db/` NÃO são executados automaticamente em containers já existentes. É necessário executar manualmente.

**Ação**: Executar os scripts SQL no banco de dados **NA ORDEM CORRETA** (v5.0 - 7 arquivos):

```bash
cd /root/repo/database/dbnodusai

# 1. Primeiro o schema (com permissões) - OBRIGATÓRIO PRIMEIRO
docker exec -i supabase-db psql -U postgres < volumes/db/10-market-data-schema.sql

# 2. Tabelas básicas (assets, quotes, historical_prices, dividends, cache_config)
docker exec -i supabase-db psql -U postgres < volumes/db/11-market-data-tables.sql

# 3. v5.0 - Tabelas fundamentalistas (7 tabelas)
docker exec -i supabase-db psql -U postgres < volumes/db/12-market-data-fundamentals.sql

# 4. v5.0 - Tabelas macroeconômicas (4 tabelas)
docker exec -i supabase-db psql -U postgres < volumes/db/13-market-data-macro.sql

# 5. Índices (incluindo GIN para JSONB)
docker exec -i supabase-db psql -U postgres < volumes/db/14-market-data-indexes.sql

# 6. Políticas RLS (todas as 16 tabelas)
docker exec -i supabase-db psql -U postgres < volumes/db/15-market-data-rls.sql

# 7. Functions SQL
docker exec -i supabase-db psql -U postgres < volumes/db/16-market-data-functions.sql
```

**Verificação**:
```bash
# Verificar schema e permissões
docker exec supabase-db psql -U postgres -c "\dn+ market_data"

# Verificar tabelas (devem ser 16 no total)
docker exec supabase-db psql -U postgres -c "\dt market_data.*"

# Verificar contagem de tabelas
docker exec supabase-db psql -U postgres -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'market_data';"

# Verificar functions
docker exec supabase-db psql -U postgres -c "\df market_data.*"

# Verificar RLS habilitado em todas as tabelas
docker exec supabase-db psql -U postgres -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'market_data' ORDER BY tablename;"

# Verificar índices GIN criados
docker exec supabase-db psql -U postgres -c "SELECT indexname FROM pg_indexes WHERE schemaname = 'market_data' AND indexname LIKE '%gin%';"
```

**Critério de Aceitação (v5.0)**:
- [ ] Schema market_data existe com permissões para anon, authenticated, service_role
- [ ] 16 tabelas criadas (5 básicas + 7 fundamentalistas + 4 macroeconômicas)
- [ ] Índices GIN criados para colunas JSONB
- [ ] Functions criadas
- [ ] RLS habilitado em todas as 16 tabelas (rowsecurity = true)

---

### Tarefa 4.2: Deploy das Edge Functions

**⚠️ IMPORTANTE**: Edge Functions também NÃO são detectadas automaticamente. Precisamos reiniciar o container de functions.

```bash
# Reiniciar container de Edge Functions para detectar novos arquivos
docker restart supabase-functions

# Aguardar
sleep 10

# Verificar logs
docker logs supabase-functions --tail 50
```

**Verificação**:
```bash
# Verificar se a function brapi foi carregada
docker logs supabase-functions 2>&1 | grep -i "brapi"
```

**Critério de Aceitação**:
- [ ] Container supabase-functions está rodando
- [ ] Logs mostram que a function brapi foi carregada

---

### Tarefa 4.3: Testar Edge Function

**Ação**: Testar a Edge Function BrAPI via curl.

```bash
# Teste 1: Buscar cotação (ações de teste - sem auth)
curl -X POST https://api.nodusai.com.br/functions/v1/brapi \
  -H "Content-Type: application/json" \
  -d '{"action": "quote", "tickers": "PETR4,VALE3"}'

# Teste 2: Buscar ativos
curl -X POST https://api.nodusai.com.br/functions/v1/brapi \
  -H "Content-Type: application/json" \
  -d '{"action": "search", "options": {"search": "PETR"}}'

# Teste 3: Dados históricos
curl -X POST https://api.nodusai.com.br/functions/v1/brapi \
  -H "Content-Type: application/json" \
  -d '{"action": "historical", "tickers": "PETR4", "options": {"range": "1mo"}}'
```

**Critério de Aceitação**:
- [ ] Todos os testes retornam 200
- [ ] Dados são retornados corretamente
- [ ] Cache é populado no banco

---

## 📊 CRITÉRIOS DE CONCLUSÃO

A integração BrAPI está **COMPLETA** quando todos os itens abaixo forem verificados:

### Banco de Dados (v5.0 - 15 tabelas)
- [ ] Schema `market_data` existe com permissões corretas
- [ ] **Tabelas Básicas (5)**:
  - [ ] `assets` - Cadastro de ativos
  - [ ] `quotes` - Cache de cotações
  - [ ] `historical_prices` - Dados OHLCV
  - [ ] `dividends` - Proventos
  - [ ] `cache_config` - Configuração de cache
- [ ] **Tabelas Fundamentalistas (7)**:
  - [ ] `company_profiles` - Perfil da empresa (SummaryProfile)
  - [ ] `balance_sheets` - Balanço Patrimonial
  - [ ] `income_statements` - DRE
  - [ ] `key_statistics` - Indicadores (P/L, P/VP, etc.)
  - [ ] `financial_data` - Dados financeiros (margens, ROE, etc.)
  - [ ] `cashflows` - DFC
  - [ ] `value_added` - DVA
- [ ] **Tabelas Macroeconômicas (4)**:
  - [ ] `crypto_quotes` - Cotações de criptomoedas
  - [ ] `currency_quotes` - Cotações de moedas
  - [ ] `inflation_data` - Dados de inflação
  - [ ] `prime_rate_data` - Taxa SELIC
- [ ] Índices criados (incluindo GIN para JSONB)
- [ ] RLS habilitado em todas as 15 tabelas
- [ ] Functions SQL funcionando

### Edge Functions
- [ ] `_shared/cors.ts` existe
- [ ] `_shared/supabase.ts` existe
- [ ] `_shared/brapi-client.ts` existe (atualizado v5.0)
- [ ] `brapi/index.ts` existe e responde
- [ ] `brapi-fundamentals/index.ts` existe e responde (v5.0)

### Testes
- [ ] Endpoint `/brapi` responde para action=quote
- [ ] Endpoint `/brapi` responde para action=search
- [ ] Endpoint `/brapi` responde para action=historical
- [ ] Endpoint `/brapi` responde para action=dividends
- [ ] Endpoint `/brapi-fundamentals` responde (v5.0)
- [ ] Cache está sendo salvo no banco
- [ ] Cache está sendo lido do banco (segunda requisição)
- [ ] Tabelas fundamentalistas recebem dados corretamente (v5.0)

---

## 🏁 COMPLETION PROMISE

Quando todos os critérios acima forem atendidos, retornar:

```
BRAPI_INTEGRATION_COMPLETE
```

---

## 📚 REFERÊNCIAS

- **Especificação BrAPI**: `/root/repo/docs/brapi.yaml`
- **SDK TypeScript**: https://github.com/brapi-dev/brapi-typescript
- **SDK Python**: https://github.com/brapi-dev/brapi-python
- **Documentação BrAPI**: https://brapi.dev/docs

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Mitigação |
|-------|-----------|
| Rate limit da BrAPI (429) | Cache agressivo de 5 minutos |
| BrAPI offline | Retornar dados do cache mesmo expirados (implementado com fallback) |
| Token inválido | Validar no startup, log de erro claro |
| Falha de conexão DB | Retry com backoff exponencial |

---

## 🔧 TROUBLESHOOTING

### Problema: "relation market_data.quotes does not exist"

**Causa**: Schema `market_data` não está exposto no PostgREST.

**Solução**:
```bash
# Verificar PGRST_DB_SCHEMAS
grep "PGRST_DB_SCHEMAS" /root/repo/database/dbnodusai/.env

# Deve conter: PGRST_DB_SCHEMAS=public,storage,graphql_public,market_data
# Se não contiver, adicionar e reiniciar containers
```

---

### Problema: "permission denied for schema market_data"

**Causa**: Faltam GRANTs de permissão no schema.

**Solução**:
```sql
-- Executar no banco
GRANT USAGE ON SCHEMA market_data TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA market_data TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA market_data TO anon, authenticated;
```

---

### Problema: Edge Function não responde / 404

**Causa**: Container de functions não carregou a nova function.

**Solução**:
```bash
# Reiniciar container
docker restart supabase-functions

# Verificar logs
docker logs supabase-functions --tail 100

# Se ainda não funcionar, verificar se arquivos existem
ls -la /root/repo/database/dbnodusai/volumes/functions/brapi/
```

---

### Problema: "BRAPI_TOKEN is undefined"

**Causa**: Variável de ambiente não chegou ao container.

**Solução**:
```bash
# Verificar se está no .env
grep "BRAPI_TOKEN" /root/repo/database/dbnodusai/.env

# Verificar docker-compose.yml se passa a variável
grep -A5 "functions:" /root/repo/database/dbnodusai/docker-compose.yml

# Reiniciar com force-recreate
docker-compose up -d --force-recreate
```

---

### Problema: Upsert falha com "conflicting key value"

**Causa**: Constraint UNIQUE não existe na tabela quotes.

**Solução**:
```sql
-- Verificar constraint
SELECT constraint_name FROM information_schema.table_constraints
WHERE table_schema = 'market_data' AND table_name = 'quotes';

-- Se uq_quotes_ticker não existir, criar:
ALTER TABLE market_data.quotes ADD CONSTRAINT uq_quotes_ticker UNIQUE (ticker);
```

---

## 🔄 PRÓXIMAS FASES (Após BrAPI)

> Não implementar agora. Apenas referência.

1. **Sistema de Carteira e Transações**
2. **Cálculos Financeiros**
3. **Importação de Extratos**
4. **Calculadoras**
5. **Chat com IA**
