{
  "info": {
    "title": "Brapi - API do Mercado Financeiro Brasileiro",
    "version": "3.0.0",
    "description": "Acesso instantâneo a dados do mercado financeiro brasileiro e internacional.\n\n**Recursos Principais:**\n\n*   **Cotações:** Obtenha valores de cotação e históricos para ações (B3), fundos imobiliários (FIIs), BDRs, índices e ETFs.\n*   **Criptomoedas:** Consulte cotações e dados históricos de diversas criptomoedas em várias moedas fiduciárias.\n*   **Moedas:** Acesse taxas de câmbio entre diferentes moedas.\n*   **Dados Fundamentalistas:** Obtenha dados financeiros detalhados de empresas listadas (requer módulos específicos).\n*   **Dividendos:** Consulte informações sobre pagamentos de dividendos e JCP.\n*   **Inflação:** Acesse índices de inflação históricos para diferentes países.\n\n**SDKs Oficiais:**\n\nRecomendamos o uso de nossas SDKs oficiais para integração mais rápida e robusta:\n\n*   **TypeScript/JavaScript:** `npm install brapi`\n    *   Tipos completos com IntelliSense\n    *   Suporte a Node.js e navegador\n    *   Retry automático e tratamento de erros tipado\n    *   GitHub: https://github.com/brapi-dev/brapi-typescript\n\n*   **Python:** `pip install brapi`\n    *   Suporte síncrono e assíncrono (AsyncBrapi)\n    *   Type hints completos com Pydantic\n    *   Compatível com Python 3.8+\n    *   GitHub: https://github.com/brapi-dev/brapi-python\n\n**Vantagens das SDKs:**\n*   60% menos código comparado com requisições manuais\n*   Autenticação automática e tratamento de erros\n*   Retry inteligente com backoff exponencial\n*   Validação de tipos e autocomplete\n*   Documentação integrada no editor\n\nUtilize esta API para integrar dados financeiros robustos em suas aplicações, dashboards ou análises.\n\n**Website Oficial:** [https://brapi.dev](https://brapi.dev)\n**Documentação das SDKs:** [https://brapi.dev/docs/sdks](https://brapi.dev/docs/sdks)"
  },
  "statistics": {
    "endpoints": 12,
    "schemas": 45,
    "enums": 8,
    "total_fields": 514
  },
  "endpoints": [
    {
      "path": "/api/quote/{tickers}",
      "method": "GET",
      "summary": "Buscar Cotação Detalhada de Ativos Financeiros",
      "description": "Este endpoint é a principal forma de obter informações detalhadas sobre um ou mais ativos financeiros (ações, FIIs, ETFs, BDRs, índices) listados na B3, identificados pelos seus respectivos **tickers**.\n\n### Funcionalidades Principais:\n\n*   **Cotação Atual:** Retorna o preço mais recente, variação diária, máximas, mínimas, volume, etc.\n*   **Dados Históricos:** Permite solicitar séries históricas de preços usando os parâmetros `range` e `interval`.\n*   **Dados Fundamentalistas:** Opcionalmente, inclui dados fundamentalistas básicos (P/L, LPA) com o parâmetro `fundamental=true`.\n*   **Dividendos:** Opcionalmente, inclui histórico de dividendos e JCP com `dividends=true`.\n*   **Módulos Adicionais:** Permite requisitar conjuntos de dados financeiros mais aprofundados através do parâmetro `modules` (veja detalhes abaixo).\n\n### 🧪 Ações de Teste (Sem Autenticação):\n\nPara facilitar o desenvolvimento e teste, as seguintes **4 ações têm acesso irrestrito** e **não requerem autenticação**:\n\n*   **PETR4** (Petrobras PN)\n*   **MGLU3** (Magazine Luiza ON)  \n*   **VALE3** (Vale ON)\n*   **ITUB4** (Itaú Unibanco PN)\n\n**Importante:** Você pode consultar essas ações sem token e com acesso a todos os recursos (históricos, módulos, dividendos). Porém, se misturar essas ações com outras na mesma requisição, a autenticação será obrigatória.\n\n### Autenticação:\n\nPara **outras ações** (além das 4 de teste), é **obrigatório** fornecer um token de autenticação válido, seja via query parameter `token` ou via header `Authorization: Bearer seu_token`.\n\n### Exemplos de Requisição:\n\n**1. Cotação simples de PETR4 e VALE3 (ações de teste - sem token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/PETR4,VALE3\"\n```\n\n**2. Cotação de MGLU3 com dados históricos do último mês (ação de teste - sem token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/MGLU3?range=1mo&interval=1d\"\n```\n\n**3. Cotação de ITUB4 incluindo dividendos e dados fundamentalistas (ação de teste - sem token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/ITUB4?fundamental=true&dividends=true\"\n```\n\n**4. Cotação de WEGE3 com Resumo da Empresa e Balanço Patrimonial Anual (via módulos - requer token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/WEGE3?modules=summaryProfile,balanceSheetHistory&token=SEU_TOKEN\"\n```\n\n**5. Exemplo de requisição mista (requer token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/PETR4,BBAS3?token=SEU_TOKEN\"\n```\n\n*Nota: Como BBAS3 não é uma ação de teste, toda a requisição requer autenticação, mesmo contendo PETR4.*\n\n### Parâmetro `modules` (Detalhado):\n\nO parâmetro `modules` é extremamente poderoso para enriquecer a resposta com dados financeiros detalhados. Você pode solicitar um ou mais módulos, separados por vírgula.\n\n**Módulos Disponíveis:**\n\n*   `summaryProfile`: Informações cadastrais da empresa (endereço, setor, descrição do negócio, website, número de funcionários).\n*   `balanceSheetHistory`: Histórico **anual** do Balanço Patrimonial.\n*   `balanceSheetHistoryQuarterly`: Histórico **trimestral** do Balanço Patrimonial.\n*   `defaultKeyStatistics`: Principais estatísticas da empresa (Valor de Mercado, P/L, ROE, Dividend Yield, etc.) - **TTM (Trailing Twelve Months)**.\n*   `defaultKeyStatisticsHistory`: Histórico **anual** das Principais Estatísticas.\n*   `defaultKeyStatisticsHistoryQuarterly`: Histórico **trimestral** das Principais Estatísticas.\n*   `incomeStatementHistory`: Histórico **anual** da Demonstração do Resultado do Exercício (DRE).\n*   `incomeStatementHistoryQuarterly`: Histórico **trimestral** da Demonstração do Resultado do Exercício (DRE).\n*   `financialData`: Dados financeiros selecionados (Receita, Lucro Bruto, EBITDA, Dívida Líquida, Fluxo de Caixa Livre, Margens) - **TTM (Trailing Twelve Months)**.\n*   `financialDataHistory`: Histórico **anual** dos Dados Financeiros.\n*   `financialDataHistoryQuarterly`: Histórico **trimestral** dos Dados Financeiros.\n*   `valueAddedHistory`: Histórico **anual** da Demonstração do Valor Adicionado (DVA).\n*   `valueAddedHistoryQuarterly`: Histórico **trimestral** da Demonstração do Valor Adicionado (DVA).\n*   `cashflowHistory`: Histórico **anual** da Demonstração do Fluxo de Caixa (DFC).\n*   `cashflowHistoryQuarterly`: Histórico **trimestral** da Demonstração do Fluxo de Caixa (DFC).\n\n**Exemplo de Uso do `modules`:**\n\nPara obter a cotação de BBDC4 junto com seu DRE trimestral e Fluxo de Caixa anual:\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/BBDC4?modules=incomeStatementHistoryQuarterly,cashflowHistory&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON contendo a chave `results`, que é um array. Cada elemento do array corresponde a um ticker solicitado e contém os dados da cotação e os módulos adicionais requisitados.\n\n*   **Sucesso (200 OK):** Retorna os dados conforme solicitado.\n*   **Bad Request (400 Bad Request):** Ocorre se um parâmetro for inválido (ex: `range=invalid`) ou se a formatação estiver incorreta.\n*   **Unauthorized (401 Unauthorized):** Token inválido ou ausente.\n*   **Payment Required (402 Payment Required):** Limite de requisições do plano atual excedido.\n*   **Not Found (404 Not Found):** Um ou mais tickers solicitados não foram encontrados.\n",
      "operationId": "getQuote",
      "tags": [
        "Ações"
      ],
      "parameters": [
        "tickers",
        "",
        "range",
        "interval",
        "fundamental",
        "dividends",
        "modules"
      ],
      "param_count": 7
    },
    {
      "path": "/api/quote/list",
      "method": "GET",
      "summary": "Listar e Filtrar Cotações de Ativos",
      "description": "Obtenha uma lista paginada de cotações de diversos ativos (ações, FIIs, BDRs) negociados na B3, com opções avançadas de busca, filtragem e ordenação.\n\n### Funcionalidades:\n\n*   **Busca por Ticker:** Filtre por parte do ticker usando `search`.\n*   **Filtragem por Tipo:** Restrinja a lista a `stock`, `fund` (FII) ou `bdr` com o parâmetro `type`.\n*   **Filtragem por Setor:** Selecione ativos de um setor específico usando `sector`.\n*   **Ordenação:** Ordene os resultados por diversos campos (preço, variação, volume, etc.) usando `sortBy` e `sortOrder`.\n*   **Paginação:** Controle o número de resultados por página (`limit`) e a página desejada (`page`).\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar as 10 ações do setor Financeiro com maior volume, ordenadas de forma decrescente:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/list?sector=Finance&sortBy=volume&sortOrder=desc&limit=10&page=1&token=SEU_TOKEN\"\n```\n\n**Buscar por ativos cujo ticker contenha 'ITUB' e ordenar por nome ascendente:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/list?search=ITUB&sortBy=name&sortOrder=asc&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta contém a lista de `stocks` (e `indexes` relevantes), informações sobre os filtros aplicados, detalhes da paginação (`currentPage`, `totalPages`, `itemsPerPage`, `totalCount`, `hasNextPage`) e listas de setores (`availableSectors`) e tipos (`availableStockTypes`) disponíveis para filtragem.",
      "operationId": "getQuoteList",
      "tags": [
        "Ações"
      ],
      "parameters": [
        "search",
        "sortBy",
        "sortOrder",
        "limit",
        "page",
        "type",
        "sector",
        ""
      ],
      "param_count": 8
    },
    {
      "path": "/api/available",
      "method": "GET",
      "summary": "Listar Todos os Tickers Disponíveis na API",
      "description": "Obtenha uma lista completa de todos os tickers (identificadores) de ativos financeiros (ações, FIIs, BDRs, ETFs, índices) que a API Brapi tem dados disponíveis para consulta no endpoint `/api/quote/{tickers}`.\n\n### Funcionalidade:\n\n*   Retorna arrays separados para `indexes` (índices) e `stocks` (outros ativos).\n*   Pode ser filtrado usando o parâmetro `search` para encontrar tickers específicos.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todos os tickers disponíveis:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/available?token=SEU_TOKEN\"\n```\n\n**Buscar tickers que contenham 'BBDC':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/available?search=BBDC&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com duas chaves:\n\n*   `indexes`: Array de strings contendo os tickers dos índices disponíveis (ex: `[\"^BVSP\", \"^IFIX\"]`).\n*   `stocks`: Array de strings contendo os tickers das ações, FIIs, BDRs e ETFs disponíveis (ex: `[\"PETR4\", \"VALE3\", \"ITSA4\", \"MXRF11\"]`).",
      "operationId": "getAvailableTickers",
      "tags": [
        "Ações"
      ],
      "parameters": [
        "search",
        ""
      ],
      "param_count": 2
    },
    {
      "path": "/api/v2/crypto",
      "method": "GET",
      "summary": "Buscar Cotação Detalhada de Criptomoedas",
      "description": "Obtenha cotações atualizadas e dados históricos para uma ou mais criptomoedas.\n\n### Funcionalidades:\n\n*   **Cotação Múltipla:** Consulte várias criptomoedas em uma única requisição usando o parâmetro `coin`.\n*   **Moeda de Referência:** Especifique a moeda fiduciária para a cotação com `currency` (padrão: BRL).\n*   **Dados Históricos:** Solicite séries históricas usando `range` e `interval` (similar ao endpoint de ações).\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Cotação de Bitcoin (BTC) e Ethereum (ETH) em Dólar Americano (USD):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto?coin=BTC,ETH&currency=USD&token=SEU_TOKEN\"\n```\n\n**Cotação de Cardano (ADA) em Real (BRL) com histórico do último mês (intervalo diário):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto?coin=ADA&currency=BRL&range=1mo&interval=1d&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta contém um array `coins`, onde cada objeto representa uma criptomoeda solicitada, incluindo sua cotação atual, dados de mercado e, opcionalmente, a série histórica (`historicalDataPrice`).",
      "operationId": "getCryptoQuote",
      "tags": [
        "Criptomoedas"
      ],
      "parameters": [
        "coin",
        "currency",
        "range",
        "interval",
        ""
      ],
      "param_count": 5
    },
    {
      "path": "/api/v2/crypto/available",
      "method": "GET",
      "summary": "Listar Todas as Criptomoedas Disponíveis",
      "description": "Obtenha a lista completa de todas as siglas (tickers) de criptomoedas que a API Brapi suporta para consulta no endpoint `/api/v2/crypto`.\n\n### Funcionalidade:\n\n*   Retorna um array `coins` com as siglas.\n*   Pode ser filtrado usando o parâmetro `search`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todas as criptomoedas disponíveis:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto/available?token=SEU_TOKEN\"\n```\n\n**Buscar criptomoedas cujo ticker contenha 'DOGE':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto/available?search=DOGE&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com a chave `coins`, contendo um array de strings com as siglas das criptomoedas (ex: `[\"BTC\", \"ETH\", \"LTC\", \"XRP\"]`).",
      "operationId": "getAvailableCrypto",
      "tags": [
        "Criptomoedas"
      ],
      "parameters": [
        "search",
        ""
      ],
      "param_count": 2
    },
    {
      "path": "/api/v2/currency",
      "method": "GET",
      "summary": "Buscar Cotação de Pares de Moedas Fiduciárias",
      "description": "Obtenha cotações atualizadas para um ou mais pares de moedas fiduciárias (ex: USD-BRL, EUR-USD).\n\n### Funcionalidades:\n\n*   **Cotação Múltipla:** Consulte vários pares de moedas em uma única requisição usando o parâmetro `currency`.\n*   **Dados Retornados:** Inclui nome do par, preços de compra (bid) e venda (ask), variação, máximas e mínimas, e timestamp da atualização.\n\n### Parâmetros:\n\n*   **`currency` (Obrigatório):** Uma lista de pares de moedas separados por vírgula, no formato `MOEDA_ORIGEM-MOEDA_DESTINO` (ex: `USD-BRL`, `EUR-USD`). Consulte os pares disponíveis em [`/api/v2/currency/available`](#/Moedas/getAvailableCurrencies).\n*   **`token` (Obrigatório):** Seu token de autenticação.\n\n### Autenticação:\n\nRequer token de autenticação válido via `token` (query) ou `Authorization` (header).\n\n",
      "operationId": "getCurrencyQuote",
      "tags": [
        "Moedas"
      ],
      "parameters": [
        "currency",
        ""
      ],
      "param_count": 2
    },
    {
      "path": "/api/v2/currency/available",
      "method": "GET",
      "summary": "Listar Todas as Moedas Fiduciárias Disponíveis",
      "description": "Obtenha a lista completa de todas as moedas fiduciárias suportadas pela API, geralmente utilizadas no parâmetro `currency` de outros endpoints (como o de criptomoedas) ou para futuras funcionalidades de conversão.\n\n### Funcionalidade:\n\n*   Retorna um array `currencies` com os nomes das moedas.\n*   Pode ser filtrado usando o parâmetro `search`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todas as moedas disponíveis:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/currency/available?token=SEU_TOKEN\"\n```\n\n**Buscar moedas cujo nome contenha 'Euro':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/currency/available?search=Euro&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com a chave `currencies`, contendo um array de objetos. Cada objeto possui uma chave `currency` com o nome completo da moeda (ex: `\"Dólar Americano/Real Brasileiro\"`). **Nota:** O formato do nome pode indicar um par de moedas, dependendo do contexto interno da API.",
      "operationId": "getAvailableCurrencies",
      "tags": [
        "Moedas"
      ],
      "parameters": [
        "search",
        ""
      ],
      "param_count": 2
    },
    {
      "path": "/api/v2/inflation",
      "method": "GET",
      "summary": "Buscar Dados Históricos de Inflação por País",
      "description": "Obtenha dados históricos sobre índices de inflação para um país específico.\n\n### Funcionalidades:\n\n*   **Seleção de País:** Especifique o país desejado com o parâmetro `country` (padrão: `brazil`).\n*   **Filtragem por Período:** Defina um intervalo de datas com `start` e `end` (formato DD/MM/YYYY).\n*   **Inclusão de Histórico:** O parâmetro `historical` (booleano) parece controlar a inclusão de dados históricos (verificar comportamento exato, pode ser redundante com `start`/`end`).\n*   **Ordenação:** Ordene os resultados por data (`date`) ou valor (`value`) usando `sortBy` e `sortOrder`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Buscar dados de inflação do Brasil para o ano de 2022, ordenados por valor ascendente:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation?country=brazil&start=01/01/2022&end=31/12/2022&sortBy=value&sortOrder=asc&token=SEU_TOKEN\"\n```\n\n**Buscar os dados mais recentes de inflação (sem período definido, ordenação padrão):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation?country=brazil&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta contém um array `inflation`, onde cada objeto representa um ponto de dado de inflação com sua `date` (DD/MM/YYYY), `value` (o índice de inflação como string) e `epochDate` (timestamp UNIX).",
      "operationId": "getInflation",
      "tags": [
        "Inflação"
      ],
      "parameters": [
        "country",
        "historical",
        "start",
        "end",
        "sortBy",
        "sortOrder",
        ""
      ],
      "param_count": 7
    },
    {
      "path": "/api/v2/inflation/available",
      "method": "GET",
      "summary": "Listar Países com Dados de Inflação Disponíveis",
      "description": "Obtenha a lista completa de todos os países para os quais a API Brapi possui dados de inflação disponíveis para consulta no endpoint `/api/v2/inflation`.\n\n### Funcionalidade:\n\n*   Retorna um array `countries` com os nomes dos países (em minúsculas).\n*   Pode ser filtrado usando o parâmetro `search`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todos os países com dados de inflação:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation/available?token=SEU_TOKEN\"\n```\n\n**Buscar países cujo nome contenha 'arg':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation/available?search=arg&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com a chave `countries`, contendo um array de strings com os nomes dos países (ex: `[\"brazil\", \"argentina\", \"usa\"]`).",
      "operationId": "getAvailableInflationCountries",
      "tags": [
        "Inflação"
      ],
      "parameters": [
        "search",
        ""
      ],
      "param_count": 2
    },
    {
      "path": "/api/v2/prime-rate",
      "method": "GET",
      "summary": "Buscar Taxa Básica de Juros (SELIC) de um País por um Período Determinado",
      "description": "Obtenha informações atualizadas sobre a taxa básica de juros (SELIC) de um país por um período determinado.\n\n### Funcionalidades:\n\n*   **Seleção por País:** Especifique o país desejado usando o parâmetro `country` (padrão: brazil).\n*   **Período Customizado:** Defina datas de início e fim com `start` e `end` para consultar um intervalo específico.\n*   **Ordenação:** Ordene os resultados por data ou valor com os parâmetros `sortBy` e `sortOrder`.\n*   **Dados Históricos:** Solicite o histórico completo ou apenas o valor mais recente com o parâmetro `historical`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Taxa de juros do Brasil entre dezembro/2021 e janeiro/2022:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/prime-rate?country=brazil&start=01/12/2021&end=01/01/2022&sortBy=date&sortOrder=desc&token=SEU_TOKEN\"\n```",
      "operationId": "getPrimeRate",
      "tags": [
        "Taxa de Juros"
      ],
      "parameters": [
        "country",
        "historical",
        "start",
        "end",
        "sortBy",
        "sortOrder",
        ""
      ],
      "param_count": 7
    },
    {
      "path": "/api/v2/prime-rate/available",
      "method": "GET",
      "summary": "Listar Todos Os Possíveis Países com Taxa Básica de Juros (SELIC) Suportados",
      "description": "Liste todos os países disponíveis com dados de taxa básica de juros (SELIC) na API brapi. Este endpoint facilita a descoberta de quais países possuem dados disponíveis para consulta através do endpoint principal `/api/v2/prime-rate`.\n\n### Funcionalidades:\n\n*   **Busca Filtrada:** Utilize o parâmetro `search` para filtrar países por nome ou parte do nome.\n*   **Ideal para Autocomplete:** Perfeito para implementar campos de busca com autocompletar em interfaces de usuário.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar países que contenham \"BR\" no nome:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/prime-rate/available?search=BR&token=SEU_TOKEN\"\n```",
      "operationId": "getPrimeRateAvailableCountries",
      "tags": [
        "Taxa de Juros"
      ],
      "parameters": [
        "search",
        ""
      ],
      "param_count": 2
    },
    {
      "path": "/api/sdks",
      "method": "GET",
      "summary": "Documentação das SDKs Oficiais",
      "description": "Informações completas sobre as SDKs oficiais da brapi.dev para TypeScript/JavaScript e Python.\n\n## SDK TypeScript/JavaScript\n\n**Instalação:**\n```bash\nnpm install brapi\n```\n\n**Uso Básico:**\n```typescript\nimport Brapi from 'brapi';\n\nconst client = new Brapi({\n  apiKey: process.env.BRAPI_API_KEY,\n});\n\n// Buscar cotações com tipos completos\nconst quote = await client.quote.retrieve('PETR4,VALE3');\nconsole.log(quote.results[0].regularMarketPrice);\n\n// Múltiplos ativos\nconst quotes = await client.quote.retrieve('ITUB4,BBDC4,MGLU3');\nquotes.results.forEach(stock => {\n  console.log(`${stock.symbol}: R$ ${stock.regularMarketPrice}`);\n});\n```\n\n**Recursos:**\n- ✅ Tipos completos com IntelliSense\n- ✅ Suporte a Node.js e navegador\n- ✅ Retry automático com backoff exponencial\n- ✅ Tratamento de erros tipado\n- ✅ Documentação integrada no editor\n\n**GitHub:** https://github.com/brapi-dev/brapi-typescript\n\n## SDK Python\n\n**Instalação:**\n```bash\npip install brapi\n```\n\n**Uso Básico (Síncrono):**\n```python\nfrom brapi import Brapi\n\nclient = Brapi(api_key=\"seu_token\")\n\n# Buscar cotações com type hints\nquote = client.quote.retrieve(tickers=\"PETR4,VALE3\")\nprint(quote.results[0].regular_market_price)\n\n# Múltiplos ativos\nquotes = client.quote.retrieve(tickers=\"ITUB4,BBDC4,MGLU3\")\nfor stock in quotes.results:\n    print(f\"{stock.symbol}: R$ {stock.regular_market_price}\")\n```\n\n**Uso Básico (Assíncrono):**\n```python\nimport asyncio\nfrom brapi import AsyncBrapi\n\nasync def main():\n    client = AsyncBrapi(api_key=\"seu_token\")\n    quote = await client.quote.retrieve(tickers=\"PETR4,VALE3\")\n    print(quote.results[0].regular_market_price)\n\nasyncio.run(main())\n```\n\n**Recursos:**\n- ✅ Suporte síncrono e assíncrono\n- ✅ Type hints completos com Pydantic\n- ✅ Compatível com Python 3.8+\n- ✅ Retry automático inteligente\n- ✅ Validação de dados automática\n\n**GitHub:** https://github.com/brapi-dev/brapi-python\n\n## Vantagens das SDKs\n\nComparado com requisições HTTP manuais:\n\n- **60% menos código** - Sintaxe simples e direta\n- **Tipos completos** - IntelliSense e autocomplete\n- **Retry automático** - Tratamento inteligente de falhas\n- **Erros tipados** - Exceções específicas por status\n- **Menos erros** - Validação automática de parâmetros\n- **Documentação integrada** - Ajuda contextual no editor\n\n## Exemplo Comparativo\n\n**Com SDK TypeScript:**\n```typescript\nconst client = new Brapi({ apiKey: 'token' });\nconst quote = await client.quote.retrieve('PETR4');\nconsole.log(quote.results[0].regularMarketPrice);\n```\n\n**Sem SDK (Manual):**\n```typescript\nconst response = await fetch('https://brapi.dev/api/quote/PETR4', {\n  headers: { 'Authorization': 'Bearer token' }\n});\nconst data = await response.json();\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconsole.log(data.results[0].regularMarketPrice);\n```\n\n**Documentação completa:** https://brapi.dev/docs/sdks",
      "operationId": "getSDKs",
      "tags": [
        "SDKs"
      ],
      "parameters": [],
      "param_count": 0
    }
  ],
  "endpoints_by_tag": {
    "Ações": [
      {
        "path": "/api/quote/{tickers}",
        "method": "GET",
        "summary": "Buscar Cotação Detalhada de Ativos Financeiros",
        "description": "Este endpoint é a principal forma de obter informações detalhadas sobre um ou mais ativos financeiros (ações, FIIs, ETFs, BDRs, índices) listados na B3, identificados pelos seus respectivos **tickers**.\n\n### Funcionalidades Principais:\n\n*   **Cotação Atual:** Retorna o preço mais recente, variação diária, máximas, mínimas, volume, etc.\n*   **Dados Históricos:** Permite solicitar séries históricas de preços usando os parâmetros `range` e `interval`.\n*   **Dados Fundamentalistas:** Opcionalmente, inclui dados fundamentalistas básicos (P/L, LPA) com o parâmetro `fundamental=true`.\n*   **Dividendos:** Opcionalmente, inclui histórico de dividendos e JCP com `dividends=true`.\n*   **Módulos Adicionais:** Permite requisitar conjuntos de dados financeiros mais aprofundados através do parâmetro `modules` (veja detalhes abaixo).\n\n### 🧪 Ações de Teste (Sem Autenticação):\n\nPara facilitar o desenvolvimento e teste, as seguintes **4 ações têm acesso irrestrito** e **não requerem autenticação**:\n\n*   **PETR4** (Petrobras PN)\n*   **MGLU3** (Magazine Luiza ON)  \n*   **VALE3** (Vale ON)\n*   **ITUB4** (Itaú Unibanco PN)\n\n**Importante:** Você pode consultar essas ações sem token e com acesso a todos os recursos (históricos, módulos, dividendos). Porém, se misturar essas ações com outras na mesma requisição, a autenticação será obrigatória.\n\n### Autenticação:\n\nPara **outras ações** (além das 4 de teste), é **obrigatório** fornecer um token de autenticação válido, seja via query parameter `token` ou via header `Authorization: Bearer seu_token`.\n\n### Exemplos de Requisição:\n\n**1. Cotação simples de PETR4 e VALE3 (ações de teste - sem token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/PETR4,VALE3\"\n```\n\n**2. Cotação de MGLU3 com dados históricos do último mês (ação de teste - sem token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/MGLU3?range=1mo&interval=1d\"\n```\n\n**3. Cotação de ITUB4 incluindo dividendos e dados fundamentalistas (ação de teste - sem token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/ITUB4?fundamental=true&dividends=true\"\n```\n\n**4. Cotação de WEGE3 com Resumo da Empresa e Balanço Patrimonial Anual (via módulos - requer token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/WEGE3?modules=summaryProfile,balanceSheetHistory&token=SEU_TOKEN\"\n```\n\n**5. Exemplo de requisição mista (requer token):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/PETR4,BBAS3?token=SEU_TOKEN\"\n```\n\n*Nota: Como BBAS3 não é uma ação de teste, toda a requisição requer autenticação, mesmo contendo PETR4.*\n\n### Parâmetro `modules` (Detalhado):\n\nO parâmetro `modules` é extremamente poderoso para enriquecer a resposta com dados financeiros detalhados. Você pode solicitar um ou mais módulos, separados por vírgula.\n\n**Módulos Disponíveis:**\n\n*   `summaryProfile`: Informações cadastrais da empresa (endereço, setor, descrição do negócio, website, número de funcionários).\n*   `balanceSheetHistory`: Histórico **anual** do Balanço Patrimonial.\n*   `balanceSheetHistoryQuarterly`: Histórico **trimestral** do Balanço Patrimonial.\n*   `defaultKeyStatistics`: Principais estatísticas da empresa (Valor de Mercado, P/L, ROE, Dividend Yield, etc.) - **TTM (Trailing Twelve Months)**.\n*   `defaultKeyStatisticsHistory`: Histórico **anual** das Principais Estatísticas.\n*   `defaultKeyStatisticsHistoryQuarterly`: Histórico **trimestral** das Principais Estatísticas.\n*   `incomeStatementHistory`: Histórico **anual** da Demonstração do Resultado do Exercício (DRE).\n*   `incomeStatementHistoryQuarterly`: Histórico **trimestral** da Demonstração do Resultado do Exercício (DRE).\n*   `financialData`: Dados financeiros selecionados (Receita, Lucro Bruto, EBITDA, Dívida Líquida, Fluxo de Caixa Livre, Margens) - **TTM (Trailing Twelve Months)**.\n*   `financialDataHistory`: Histórico **anual** dos Dados Financeiros.\n*   `financialDataHistoryQuarterly`: Histórico **trimestral** dos Dados Financeiros.\n*   `valueAddedHistory`: Histórico **anual** da Demonstração do Valor Adicionado (DVA).\n*   `valueAddedHistoryQuarterly`: Histórico **trimestral** da Demonstração do Valor Adicionado (DVA).\n*   `cashflowHistory`: Histórico **anual** da Demonstração do Fluxo de Caixa (DFC).\n*   `cashflowHistoryQuarterly`: Histórico **trimestral** da Demonstração do Fluxo de Caixa (DFC).\n\n**Exemplo de Uso do `modules`:**\n\nPara obter a cotação de BBDC4 junto com seu DRE trimestral e Fluxo de Caixa anual:\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/BBDC4?modules=incomeStatementHistoryQuarterly,cashflowHistory&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON contendo a chave `results`, que é um array. Cada elemento do array corresponde a um ticker solicitado e contém os dados da cotação e os módulos adicionais requisitados.\n\n*   **Sucesso (200 OK):** Retorna os dados conforme solicitado.\n*   **Bad Request (400 Bad Request):** Ocorre se um parâmetro for inválido (ex: `range=invalid`) ou se a formatação estiver incorreta.\n*   **Unauthorized (401 Unauthorized):** Token inválido ou ausente.\n*   **Payment Required (402 Payment Required):** Limite de requisições do plano atual excedido.\n*   **Not Found (404 Not Found):** Um ou mais tickers solicitados não foram encontrados.\n",
        "operationId": "getQuote",
        "tags": [
          "Ações"
        ],
        "parameters": [
          "tickers",
          "",
          "range",
          "interval",
          "fundamental",
          "dividends",
          "modules"
        ],
        "param_count": 7
      },
      {
        "path": "/api/quote/list",
        "method": "GET",
        "summary": "Listar e Filtrar Cotações de Ativos",
        "description": "Obtenha uma lista paginada de cotações de diversos ativos (ações, FIIs, BDRs) negociados na B3, com opções avançadas de busca, filtragem e ordenação.\n\n### Funcionalidades:\n\n*   **Busca por Ticker:** Filtre por parte do ticker usando `search`.\n*   **Filtragem por Tipo:** Restrinja a lista a `stock`, `fund` (FII) ou `bdr` com o parâmetro `type`.\n*   **Filtragem por Setor:** Selecione ativos de um setor específico usando `sector`.\n*   **Ordenação:** Ordene os resultados por diversos campos (preço, variação, volume, etc.) usando `sortBy` e `sortOrder`.\n*   **Paginação:** Controle o número de resultados por página (`limit`) e a página desejada (`page`).\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar as 10 ações do setor Financeiro com maior volume, ordenadas de forma decrescente:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/list?sector=Finance&sortBy=volume&sortOrder=desc&limit=10&page=1&token=SEU_TOKEN\"\n```\n\n**Buscar por ativos cujo ticker contenha 'ITUB' e ordenar por nome ascendente:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/quote/list?search=ITUB&sortBy=name&sortOrder=asc&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta contém a lista de `stocks` (e `indexes` relevantes), informações sobre os filtros aplicados, detalhes da paginação (`currentPage`, `totalPages`, `itemsPerPage`, `totalCount`, `hasNextPage`) e listas de setores (`availableSectors`) e tipos (`availableStockTypes`) disponíveis para filtragem.",
        "operationId": "getQuoteList",
        "tags": [
          "Ações"
        ],
        "parameters": [
          "search",
          "sortBy",
          "sortOrder",
          "limit",
          "page",
          "type",
          "sector",
          ""
        ],
        "param_count": 8
      },
      {
        "path": "/api/available",
        "method": "GET",
        "summary": "Listar Todos os Tickers Disponíveis na API",
        "description": "Obtenha uma lista completa de todos os tickers (identificadores) de ativos financeiros (ações, FIIs, BDRs, ETFs, índices) que a API Brapi tem dados disponíveis para consulta no endpoint `/api/quote/{tickers}`.\n\n### Funcionalidade:\n\n*   Retorna arrays separados para `indexes` (índices) e `stocks` (outros ativos).\n*   Pode ser filtrado usando o parâmetro `search` para encontrar tickers específicos.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todos os tickers disponíveis:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/available?token=SEU_TOKEN\"\n```\n\n**Buscar tickers que contenham 'BBDC':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/available?search=BBDC&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com duas chaves:\n\n*   `indexes`: Array de strings contendo os tickers dos índices disponíveis (ex: `[\"^BVSP\", \"^IFIX\"]`).\n*   `stocks`: Array de strings contendo os tickers das ações, FIIs, BDRs e ETFs disponíveis (ex: `[\"PETR4\", \"VALE3\", \"ITSA4\", \"MXRF11\"]`).",
        "operationId": "getAvailableTickers",
        "tags": [
          "Ações"
        ],
        "parameters": [
          "search",
          ""
        ],
        "param_count": 2
      }
    ],
    "Criptomoedas": [
      {
        "path": "/api/v2/crypto",
        "method": "GET",
        "summary": "Buscar Cotação Detalhada de Criptomoedas",
        "description": "Obtenha cotações atualizadas e dados históricos para uma ou mais criptomoedas.\n\n### Funcionalidades:\n\n*   **Cotação Múltipla:** Consulte várias criptomoedas em uma única requisição usando o parâmetro `coin`.\n*   **Moeda de Referência:** Especifique a moeda fiduciária para a cotação com `currency` (padrão: BRL).\n*   **Dados Históricos:** Solicite séries históricas usando `range` e `interval` (similar ao endpoint de ações).\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Cotação de Bitcoin (BTC) e Ethereum (ETH) em Dólar Americano (USD):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto?coin=BTC,ETH&currency=USD&token=SEU_TOKEN\"\n```\n\n**Cotação de Cardano (ADA) em Real (BRL) com histórico do último mês (intervalo diário):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto?coin=ADA&currency=BRL&range=1mo&interval=1d&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta contém um array `coins`, onde cada objeto representa uma criptomoeda solicitada, incluindo sua cotação atual, dados de mercado e, opcionalmente, a série histórica (`historicalDataPrice`).",
        "operationId": "getCryptoQuote",
        "tags": [
          "Criptomoedas"
        ],
        "parameters": [
          "coin",
          "currency",
          "range",
          "interval",
          ""
        ],
        "param_count": 5
      },
      {
        "path": "/api/v2/crypto/available",
        "method": "GET",
        "summary": "Listar Todas as Criptomoedas Disponíveis",
        "description": "Obtenha a lista completa de todas as siglas (tickers) de criptomoedas que a API Brapi suporta para consulta no endpoint `/api/v2/crypto`.\n\n### Funcionalidade:\n\n*   Retorna um array `coins` com as siglas.\n*   Pode ser filtrado usando o parâmetro `search`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todas as criptomoedas disponíveis:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto/available?token=SEU_TOKEN\"\n```\n\n**Buscar criptomoedas cujo ticker contenha 'DOGE':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/crypto/available?search=DOGE&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com a chave `coins`, contendo um array de strings com as siglas das criptomoedas (ex: `[\"BTC\", \"ETH\", \"LTC\", \"XRP\"]`).",
        "operationId": "getAvailableCrypto",
        "tags": [
          "Criptomoedas"
        ],
        "parameters": [
          "search",
          ""
        ],
        "param_count": 2
      }
    ],
    "Moedas": [
      {
        "path": "/api/v2/currency",
        "method": "GET",
        "summary": "Buscar Cotação de Pares de Moedas Fiduciárias",
        "description": "Obtenha cotações atualizadas para um ou mais pares de moedas fiduciárias (ex: USD-BRL, EUR-USD).\n\n### Funcionalidades:\n\n*   **Cotação Múltipla:** Consulte vários pares de moedas em uma única requisição usando o parâmetro `currency`.\n*   **Dados Retornados:** Inclui nome do par, preços de compra (bid) e venda (ask), variação, máximas e mínimas, e timestamp da atualização.\n\n### Parâmetros:\n\n*   **`currency` (Obrigatório):** Uma lista de pares de moedas separados por vírgula, no formato `MOEDA_ORIGEM-MOEDA_DESTINO` (ex: `USD-BRL`, `EUR-USD`). Consulte os pares disponíveis em [`/api/v2/currency/available`](#/Moedas/getAvailableCurrencies).\n*   **`token` (Obrigatório):** Seu token de autenticação.\n\n### Autenticação:\n\nRequer token de autenticação válido via `token` (query) ou `Authorization` (header).\n\n",
        "operationId": "getCurrencyQuote",
        "tags": [
          "Moedas"
        ],
        "parameters": [
          "currency",
          ""
        ],
        "param_count": 2
      },
      {
        "path": "/api/v2/currency/available",
        "method": "GET",
        "summary": "Listar Todas as Moedas Fiduciárias Disponíveis",
        "description": "Obtenha a lista completa de todas as moedas fiduciárias suportadas pela API, geralmente utilizadas no parâmetro `currency` de outros endpoints (como o de criptomoedas) ou para futuras funcionalidades de conversão.\n\n### Funcionalidade:\n\n*   Retorna um array `currencies` com os nomes das moedas.\n*   Pode ser filtrado usando o parâmetro `search`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todas as moedas disponíveis:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/currency/available?token=SEU_TOKEN\"\n```\n\n**Buscar moedas cujo nome contenha 'Euro':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/currency/available?search=Euro&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com a chave `currencies`, contendo um array de objetos. Cada objeto possui uma chave `currency` com o nome completo da moeda (ex: `\"Dólar Americano/Real Brasileiro\"`). **Nota:** O formato do nome pode indicar um par de moedas, dependendo do contexto interno da API.",
        "operationId": "getAvailableCurrencies",
        "tags": [
          "Moedas"
        ],
        "parameters": [
          "search",
          ""
        ],
        "param_count": 2
      }
    ],
    "Inflação": [
      {
        "path": "/api/v2/inflation",
        "method": "GET",
        "summary": "Buscar Dados Históricos de Inflação por País",
        "description": "Obtenha dados históricos sobre índices de inflação para um país específico.\n\n### Funcionalidades:\n\n*   **Seleção de País:** Especifique o país desejado com o parâmetro `country` (padrão: `brazil`).\n*   **Filtragem por Período:** Defina um intervalo de datas com `start` e `end` (formato DD/MM/YYYY).\n*   **Inclusão de Histórico:** O parâmetro `historical` (booleano) parece controlar a inclusão de dados históricos (verificar comportamento exato, pode ser redundante com `start`/`end`).\n*   **Ordenação:** Ordene os resultados por data (`date`) ou valor (`value`) usando `sortBy` e `sortOrder`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Buscar dados de inflação do Brasil para o ano de 2022, ordenados por valor ascendente:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation?country=brazil&start=01/01/2022&end=31/12/2022&sortBy=value&sortOrder=asc&token=SEU_TOKEN\"\n```\n\n**Buscar os dados mais recentes de inflação (sem período definido, ordenação padrão):**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation?country=brazil&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta contém um array `inflation`, onde cada objeto representa um ponto de dado de inflação com sua `date` (DD/MM/YYYY), `value` (o índice de inflação como string) e `epochDate` (timestamp UNIX).",
        "operationId": "getInflation",
        "tags": [
          "Inflação"
        ],
        "parameters": [
          "country",
          "historical",
          "start",
          "end",
          "sortBy",
          "sortOrder",
          ""
        ],
        "param_count": 7
      },
      {
        "path": "/api/v2/inflation/available",
        "method": "GET",
        "summary": "Listar Países com Dados de Inflação Disponíveis",
        "description": "Obtenha a lista completa de todos os países para os quais a API Brapi possui dados de inflação disponíveis para consulta no endpoint `/api/v2/inflation`.\n\n### Funcionalidade:\n\n*   Retorna um array `countries` com os nomes dos países (em minúsculas).\n*   Pode ser filtrado usando o parâmetro `search`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar todos os países com dados de inflação:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation/available?token=SEU_TOKEN\"\n```\n\n**Buscar países cujo nome contenha 'arg':**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/inflation/available?search=arg&token=SEU_TOKEN\"\n```\n\n### Resposta:\n\nA resposta é um objeto JSON com a chave `countries`, contendo um array de strings com os nomes dos países (ex: `[\"brazil\", \"argentina\", \"usa\"]`).",
        "operationId": "getAvailableInflationCountries",
        "tags": [
          "Inflação"
        ],
        "parameters": [
          "search",
          ""
        ],
        "param_count": 2
      }
    ],
    "Taxa de Juros": [
      {
        "path": "/api/v2/prime-rate",
        "method": "GET",
        "summary": "Buscar Taxa Básica de Juros (SELIC) de um País por um Período Determinado",
        "description": "Obtenha informações atualizadas sobre a taxa básica de juros (SELIC) de um país por um período determinado.\n\n### Funcionalidades:\n\n*   **Seleção por País:** Especifique o país desejado usando o parâmetro `country` (padrão: brazil).\n*   **Período Customizado:** Defina datas de início e fim com `start` e `end` para consultar um intervalo específico.\n*   **Ordenação:** Ordene os resultados por data ou valor com os parâmetros `sortBy` e `sortOrder`.\n*   **Dados Históricos:** Solicite o histórico completo ou apenas o valor mais recente com o parâmetro `historical`.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Taxa de juros do Brasil entre dezembro/2021 e janeiro/2022:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/prime-rate?country=brazil&start=01/12/2021&end=01/01/2022&sortBy=date&sortOrder=desc&token=SEU_TOKEN\"\n```",
        "operationId": "getPrimeRate",
        "tags": [
          "Taxa de Juros"
        ],
        "parameters": [
          "country",
          "historical",
          "start",
          "end",
          "sortBy",
          "sortOrder",
          ""
        ],
        "param_count": 7
      },
      {
        "path": "/api/v2/prime-rate/available",
        "method": "GET",
        "summary": "Listar Todos Os Possíveis Países com Taxa Básica de Juros (SELIC) Suportados",
        "description": "Liste todos os países disponíveis com dados de taxa básica de juros (SELIC) na API brapi. Este endpoint facilita a descoberta de quais países possuem dados disponíveis para consulta através do endpoint principal `/api/v2/prime-rate`.\n\n### Funcionalidades:\n\n*   **Busca Filtrada:** Utilize o parâmetro `search` para filtrar países por nome ou parte do nome.\n*   **Ideal para Autocomplete:** Perfeito para implementar campos de busca com autocompletar em interfaces de usuário.\n\n### Autenticação:\n\nRequer token de autenticação via `token` (query) ou `Authorization` (header).\n\n### Exemplo de Requisição:\n\n**Listar países que contenham \"BR\" no nome:**\n\n```bash\ncurl -X GET \"https://brapi.dev/api/v2/prime-rate/available?search=BR&token=SEU_TOKEN\"\n```",
        "operationId": "getPrimeRateAvailableCountries",
        "tags": [
          "Taxa de Juros"
        ],
        "parameters": [
          "search",
          ""
        ],
        "param_count": 2
      }
    ],
    "SDKs": [
      {
        "path": "/api/sdks",
        "method": "GET",
        "summary": "Documentação das SDKs Oficiais",
        "description": "Informações completas sobre as SDKs oficiais da brapi.dev para TypeScript/JavaScript e Python.\n\n## SDK TypeScript/JavaScript\n\n**Instalação:**\n```bash\nnpm install brapi\n```\n\n**Uso Básico:**\n```typescript\nimport Brapi from 'brapi';\n\nconst client = new Brapi({\n  apiKey: process.env.BRAPI_API_KEY,\n});\n\n// Buscar cotações com tipos completos\nconst quote = await client.quote.retrieve('PETR4,VALE3');\nconsole.log(quote.results[0].regularMarketPrice);\n\n// Múltiplos ativos\nconst quotes = await client.quote.retrieve('ITUB4,BBDC4,MGLU3');\nquotes.results.forEach(stock => {\n  console.log(`${stock.symbol}: R$ ${stock.regularMarketPrice}`);\n});\n```\n\n**Recursos:**\n- ✅ Tipos completos com IntelliSense\n- ✅ Suporte a Node.js e navegador\n- ✅ Retry automático com backoff exponencial\n- ✅ Tratamento de erros tipado\n- ✅ Documentação integrada no editor\n\n**GitHub:** https://github.com/brapi-dev/brapi-typescript\n\n## SDK Python\n\n**Instalação:**\n```bash\npip install brapi\n```\n\n**Uso Básico (Síncrono):**\n```python\nfrom brapi import Brapi\n\nclient = Brapi(api_key=\"seu_token\")\n\n# Buscar cotações com type hints\nquote = client.quote.retrieve(tickers=\"PETR4,VALE3\")\nprint(quote.results[0].regular_market_price)\n\n# Múltiplos ativos\nquotes = client.quote.retrieve(tickers=\"ITUB4,BBDC4,MGLU3\")\nfor stock in quotes.results:\n    print(f\"{stock.symbol}: R$ {stock.regular_market_price}\")\n```\n\n**Uso Básico (Assíncrono):**\n```python\nimport asyncio\nfrom brapi import AsyncBrapi\n\nasync def main():\n    client = AsyncBrapi(api_key=\"seu_token\")\n    quote = await client.quote.retrieve(tickers=\"PETR4,VALE3\")\n    print(quote.results[0].regular_market_price)\n\nasyncio.run(main())\n```\n\n**Recursos:**\n- ✅ Suporte síncrono e assíncrono\n- ✅ Type hints completos com Pydantic\n- ✅ Compatível com Python 3.8+\n- ✅ Retry automático inteligente\n- ✅ Validação de dados automática\n\n**GitHub:** https://github.com/brapi-dev/brapi-python\n\n## Vantagens das SDKs\n\nComparado com requisições HTTP manuais:\n\n- **60% menos código** - Sintaxe simples e direta\n- **Tipos completos** - IntelliSense e autocomplete\n- **Retry automático** - Tratamento inteligente de falhas\n- **Erros tipados** - Exceções específicas por status\n- **Menos erros** - Validação automática de parâmetros\n- **Documentação integrada** - Ajuda contextual no editor\n\n## Exemplo Comparativo\n\n**Com SDK TypeScript:**\n```typescript\nconst client = new Brapi({ apiKey: 'token' });\nconst quote = await client.quote.retrieve('PETR4');\nconsole.log(quote.results[0].regularMarketPrice);\n```\n\n**Sem SDK (Manual):**\n```typescript\nconst response = await fetch('https://brapi.dev/api/quote/PETR4', {\n  headers: { 'Authorization': 'Bearer token' }\n});\nconst data = await response.json();\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconsole.log(data.results[0].regularMarketPrice);\n```\n\n**Documentação completa:** https://brapi.dev/docs/sdks",
        "operationId": "getSDKs",
        "tags": [
          "SDKs"
        ],
        "parameters": [],
        "param_count": 0
      }
    ]
  },
  "schemas": [
    {
      "name": "ErrorResponse",
      "type": "object",
      "description": "Schema padrão para respostas de erro da API.",
      "field_count": 2,
      "total_fields": 2,
      "required_count": 2,
      "fields": [
        {
          "name": "error",
          "type": "boolean",
          "required": true,
          "nullable": false,
          "description": "Indica se a requisição resultou em erro. Sempre `true` para este schema.",
          "has_enum": false
        },
        {
          "name": "message",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "Mensagem descritiva do erro ocorrido.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "AvailableTickersResponse",
      "type": "object",
      "description": "Resposta do endpoint que lista todos os tickers disponíveis.",
      "field_count": 2,
      "total_fields": 2,
      "required_count": 2,
      "fields": [
        {
          "name": "indexes",
          "type": "array<string>",
          "required": true,
          "nullable": false,
          "description": "Lista de tickers de **índices** disponíveis (ex: `^BVSP`, `^IFIX`).",
          "has_enum": false
        },
        {
          "name": "stocks",
          "type": "array<string>",
          "required": true,
          "nullable": false,
          "description": "Lista de tickers de **ações, FIIs, BDRs e ETFs** disponíveis (ex: `PETR4`, `VALE3`, `MXRF11`).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "IndexSummary",
      "type": "object",
      "description": "Resumo de informações de um índice, geralmente retornado em listas.",
      "field_count": 2,
      "total_fields": 2,
      "required_count": 0,
      "fields": [
        {
          "name": "stock",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do índice (ex: `^BVSP`).",
          "has_enum": false
        },
        {
          "name": "name",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Nome do índice (ex: `IBOVESPA`).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "StockSummary",
      "type": "object",
      "description": "Resumo de informações de um ativo (ação, FII, BDR), geralmente retornado em listas.",
      "field_count": 9,
      "total_fields": 9,
      "required_count": 0,
      "fields": [
        {
          "name": "stock",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo (ex: `PETR4`, `MXRF11`).",
          "has_enum": false
        },
        {
          "name": "name",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Nome do ativo ou empresa (ex: `PETROBRAS PN`).",
          "has_enum": false
        },
        {
          "name": "close",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço de fechamento mais recente ou último preço negociado.",
          "has_enum": false
        },
        {
          "name": "change",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Variação percentual do preço em relação ao fechamento anterior.",
          "has_enum": false
        },
        {
          "name": "volume",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Volume financeiro negociado no último pregão ou dia atual.",
          "has_enum": false
        },
        {
          "name": "market_cap",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Capitalização de mercado (Preço x Quantidade de Ações). Pode ser nulo para FIIs ou outros tipos.",
          "has_enum": false
        },
        {
          "name": "logo",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "URL para a imagem do logo da empresa/ativo.",
          "has_enum": false
        },
        {
          "name": "sector",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Setor de atuação da empresa (ex: `Energy Minerals`, `Finance`). Pode ser nulo ou variar para FIIs.",
          "has_enum": false
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Tipo do ativo: `stock` (Ação), `fund` (Fundo Imobiliário/FII), `bdr` (Brazilian Depositary Receipt).",
          "has_enum": true
        }
      ]
    },
    {
      "name": "QuoteListResponse",
      "type": "object",
      "description": "Resposta do endpoint de listagem de cotações (`/api/quote/list`).",
      "field_count": 9,
      "total_fields": 9,
      "required_count": 0,
      "fields": [
        {
          "name": "indexes",
          "type": "array<IndexSummary>",
          "required": false,
          "nullable": false,
          "description": "Lista resumida de índices relevantes (geralmente inclui IBOVESPA).",
          "has_enum": false
        },
        {
          "name": "stocks",
          "type": "array<StockSummary>",
          "required": false,
          "nullable": false,
          "description": "Lista paginada e filtrada dos ativos solicitados.",
          "has_enum": false
        },
        {
          "name": "availableSectors",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista de todos os setores disponíveis que podem ser usados no parâmetro de filtro `sector`.",
          "has_enum": false
        },
        {
          "name": "availableStockTypes",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista dos tipos de ativos (`stock`, `fund`, `bdr`) disponíveis que podem ser usados no parâmetro de filtro `type`.",
          "has_enum": false
        },
        {
          "name": "currentPage",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Número da página atual retornada nos resultados.",
          "has_enum": false
        },
        {
          "name": "totalPages",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Número total de páginas existentes para a consulta/filtros aplicados.",
          "has_enum": false
        },
        {
          "name": "itemsPerPage",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Número de itens (ativos) retornados por página (conforme `limit` ou padrão).",
          "has_enum": false
        },
        {
          "name": "totalCount",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Número total de ativos encontrados que correspondem aos filtros aplicados (sem considerar a paginação).",
          "has_enum": false
        },
        {
          "name": "hasNextPage",
          "type": "boolean",
          "required": false,
          "nullable": false,
          "description": "Indica se existe uma próxima página de resultados (`true`) ou se esta é a última página (`false`).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "HistoricalDataPrice",
      "type": "object",
      "description": "Representa um ponto na série histórica de preços de um ativo.",
      "field_count": 7,
      "total_fields": 7,
      "required_count": 0,
      "fields": [
        {
          "name": "date",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Data do pregão ou do ponto de dados, representada como um timestamp UNIX (número de segundos desde 1970-01-01 UTC).",
          "has_enum": false
        },
        {
          "name": "open",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço de abertura do ativo no intervalo (dia, semana, mês, etc.).",
          "has_enum": false
        },
        {
          "name": "high",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço máximo atingido pelo ativo no intervalo.",
          "has_enum": false
        },
        {
          "name": "low",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço mínimo atingido pelo ativo no intervalo.",
          "has_enum": false
        },
        {
          "name": "close",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço de fechamento do ativo no intervalo.",
          "has_enum": false
        },
        {
          "name": "volume",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Volume financeiro negociado no intervalo.",
          "has_enum": false
        },
        {
          "name": "adjustedClose",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço de fechamento ajustado para proventos (dividendos, JCP, bonificações, etc.) e desdobramentos/grupamentos.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CashDividend",
      "type": "object",
      "description": "Detalhes sobre um pagamento de provento em dinheiro (Dividendo ou JCP).",
      "field_count": 9,
      "total_fields": 9,
      "required_count": 0,
      "fields": [
        {
          "name": "assetIssued",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo que pagou o provento (ex: `ITSA4`). Pode incluir sufixos específicos relacionados ao evento.",
          "has_enum": false
        },
        {
          "name": "paymentDate",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data efetiva em que o pagamento foi realizado (ou está previsto). Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "rate",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Valor bruto do provento pago por unidade do ativo (por ação, por cota).",
          "has_enum": false
        },
        {
          "name": "relatedTo",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Descrição do período ou evento ao qual o provento se refere (ex: `1º Trimestre/2023`, `Resultado 2022`).",
          "has_enum": false
        },
        {
          "name": "approvedOn",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data em que o pagamento do provento foi aprovado pela empresa. Pode ser uma estimativa em alguns casos. Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "isinCode",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Código ISIN (International Securities Identification Number) do ativo relacionado ao provento.",
          "has_enum": false
        },
        {
          "name": "label",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Tipo do provento em dinheiro. Geralmente `DIVIDENDO` ou `JCP` (Juros sobre Capital Próprio).",
          "has_enum": false
        },
        {
          "name": "lastDatePrior",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data Com (Ex-Date). Último dia em que era necessário possuir o ativo para ter direito a receber este provento. Pode ser uma estimativa. Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "remarks",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Observações adicionais ou informações relevantes sobre o provento.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "StockDividend",
      "type": "object",
      "description": "Detalhes sobre um evento corporativo que afeta a quantidade de ações (Desdobramento/Split, Grupamento/Inplit, Bonificação).",
      "field_count": 8,
      "total_fields": 8,
      "required_count": 0,
      "fields": [
        {
          "name": "assetIssued",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo afetado pelo evento.",
          "has_enum": false
        },
        {
          "name": "factor",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Fator numérico do evento. \n* **Bonificação:** Percentual (ex: 0.1 para 10%).\n* **Desdobramento/Grupamento:** Fator multiplicativo ou divisor.",
          "has_enum": false
        },
        {
          "name": "completeFactor",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Descrição textual do fator (ex: `1 / 10`, `10 / 1`).",
          "has_enum": false
        },
        {
          "name": "approvedOn",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data em que o evento foi aprovado. Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "isinCode",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Código ISIN do ativo.",
          "has_enum": false
        },
        {
          "name": "label",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Tipo do evento: `DESDOBRAMENTO`, `GRUPAMENTO`, `BONIFICACAO`.",
          "has_enum": false
        },
        {
          "name": "lastDatePrior",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data Com (Ex-Date). Último dia para possuir o ativo nas condições antigas. Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "remarks",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Observações adicionais sobre o evento.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "DividendsData",
      "type": "object",
      "description": "Agrupa informações sobre proventos e eventos corporativos. Retornado quando `dividends=true` é solicitado.",
      "field_count": 3,
      "total_fields": 3,
      "required_count": 0,
      "fields": [
        {
          "name": "cashDividends",
          "type": "array<CashDividend>",
          "required": false,
          "nullable": false,
          "description": "Lista de proventos pagos em dinheiro (Dividendos e JCP).",
          "has_enum": false
        },
        {
          "name": "stockDividends",
          "type": "array<StockDividend>",
          "required": false,
          "nullable": false,
          "description": "Lista de eventos corporativos (Desdobramento, Grupamento, Bonificação).",
          "has_enum": false
        },
        {
          "name": "subscriptions",
          "type": "array<object>",
          "required": false,
          "nullable": false,
          "description": "Lista de eventos de subscrição de ações (estrutura não detalhada aqui).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "SummaryProfile",
      "type": "object",
      "description": "Contém informações cadastrais e descritivas sobre a empresa. Retornado via `modules=summaryProfile`.",
      "field_count": 17,
      "total_fields": 17,
      "required_count": 0,
      "fields": [
        {
          "name": "address1",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Linha 1 do endereço da sede da empresa.",
          "has_enum": false
        },
        {
          "name": "address2",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Linha 2 do endereço da sede da empresa (complemento).",
          "has_enum": false
        },
        {
          "name": "city",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Cidade da sede da empresa.",
          "has_enum": false
        },
        {
          "name": "state",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Estado ou província da sede da empresa.",
          "has_enum": false
        },
        {
          "name": "zip",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Código Postal (CEP) da sede da empresa.",
          "has_enum": false
        },
        {
          "name": "country",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "País da sede da empresa.",
          "has_enum": false
        },
        {
          "name": "phone",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Número de telefone principal da empresa.",
          "has_enum": false
        },
        {
          "name": "website",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "URL do website oficial da empresa.",
          "has_enum": false
        },
        {
          "name": "industry",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Nome da indústria em que a empresa atua.",
          "has_enum": false
        },
        {
          "name": "industryKey",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Chave interna ou código para a indústria.",
          "has_enum": false
        },
        {
          "name": "industryDisp",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Nome de exibição formatado para a indústria.",
          "has_enum": false
        },
        {
          "name": "sector",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Nome do setor de atuação da empresa.",
          "has_enum": false
        },
        {
          "name": "sectorKey",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Chave interna ou código para o setor.",
          "has_enum": false
        },
        {
          "name": "sectorDisp",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Nome de exibição formatado para o setor.",
          "has_enum": false
        },
        {
          "name": "longBusinessSummary",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Descrição longa e detalhada sobre as atividades e o negócio da empresa.",
          "has_enum": false
        },
        {
          "name": "fullTimeEmployees",
          "type": "integer",
          "required": false,
          "nullable": true,
          "description": "Número estimado de funcionários em tempo integral.",
          "has_enum": false
        },
        {
          "name": "companyOfficers",
          "type": "array<object>",
          "required": false,
          "nullable": true,
          "description": "Lista de diretores e executivos principais da empresa (estrutura interna do objeto não detalhada aqui).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "BalanceSheetEntry",
      "type": "object",
      "description": "Representa os dados de um Balanço Patrimonial para um período específico (anual ou trimestral).",
      "field_count": 131,
      "total_fields": 131,
      "required_count": 0,
      "fields": [
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo ao qual o balanço se refere.",
          "has_enum": false
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Indica a periodicidade do balanço: `yearly` (anual) ou `quarterly` (trimestral).",
          "has_enum": true
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data de término do período fiscal ao qual o balanço se refere (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "cash",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Caixa e equivalentes de caixa.",
          "has_enum": false
        },
        {
          "name": "shortTermInvestments",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Aplicações financeiras de curto prazo.",
          "has_enum": false
        },
        {
          "name": "netReceivables",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Contas a receber líquidas (clientes).",
          "has_enum": false
        },
        {
          "name": "inventory",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Estoques.",
          "has_enum": false
        },
        {
          "name": "otherCurrentAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros ativos circulantes.",
          "has_enum": false
        },
        {
          "name": "totalCurrentAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do ativo circulante.",
          "has_enum": false
        },
        {
          "name": "longTermInvestments",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Investimentos de longo prazo.",
          "has_enum": false
        },
        {
          "name": "propertyPlantEquipment",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Imobilizado (propriedades, instalações e equipamentos).",
          "has_enum": false
        },
        {
          "name": "otherAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros ativos não circulantes.",
          "has_enum": false
        },
        {
          "name": "totalAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do ativo.",
          "has_enum": false
        },
        {
          "name": "accountsPayable",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Contas a pagar (fornecedores).",
          "has_enum": false
        },
        {
          "name": "shortLongTermDebt",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Dívida de curto prazo (empréstimos e financiamentos circulantes).",
          "has_enum": false
        },
        {
          "name": "otherCurrentLiab",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros passivos circulantes.",
          "has_enum": false
        },
        {
          "name": "longTermDebt",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Dívida de longo prazo (empréstimos e financiamentos não circulantes).",
          "has_enum": false
        },
        {
          "name": "otherLiab",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros passivos não circulantes.",
          "has_enum": false
        },
        {
          "name": "totalCurrentLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do passivo circulante.",
          "has_enum": false
        },
        {
          "name": "totalLiab",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do passivo (circulante + não circulante).",
          "has_enum": false
        },
        {
          "name": "commonStock",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Capital social realizado.",
          "has_enum": false
        },
        {
          "name": "retainedEarnings",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucros/Prejuízos acumulados.",
          "has_enum": false
        },
        {
          "name": "treasuryStock",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ações em tesouraria.",
          "has_enum": false
        },
        {
          "name": "otherStockholderEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros componentes do patrimônio líquido.",
          "has_enum": false
        },
        {
          "name": "totalStockholderEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do patrimônio líquido.",
          "has_enum": false
        },
        {
          "name": "netTangibleAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos tangíveis líquidos (Ativo Total - Intangíveis - Passivo Total).",
          "has_enum": false
        },
        {
          "name": "goodWill",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ágio por expectativa de rentabilidade futura (Goodwill).",
          "has_enum": false
        },
        {
          "name": "intangibleAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos intangíveis (marcas, patentes, etc.).",
          "has_enum": false
        },
        {
          "name": "deferredLongTermAssetCharges",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Encargos diferidos de ativos de longo prazo.",
          "has_enum": false
        },
        {
          "name": "deferredLongTermLiab",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Passivos fiscais diferidos (longo prazo).",
          "has_enum": false
        },
        {
          "name": "minorityInterest",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Participação de não controladores (no patrimônio líquido).",
          "has_enum": false
        },
        {
          "name": "capitalSurplus",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Reservas de capital.",
          "has_enum": false
        },
        {
          "name": "taxesToRecover",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Impostos a recuperar.",
          "has_enum": false
        },
        {
          "name": "longTermAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do ativo não circulante (agregado).",
          "has_enum": false
        },
        {
          "name": "longTermRealizableAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativo realizável a longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermReceivables",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Contas a receber de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermDeferredTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Tributos diferidos (Ativo Não Circulante).",
          "has_enum": false
        },
        {
          "name": "otherNonCurrentAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros ativos não circulantes (detalhamento).",
          "has_enum": false
        },
        {
          "name": "nonCurrentAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do ativo não circulante (sinônimo de `longTermAssets`).",
          "has_enum": false
        },
        {
          "name": "provisions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Provisões (passivo).",
          "has_enum": false
        },
        {
          "name": "shareholdersEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Patrimônio líquido (sinônimo de `totalStockholderEquity`).",
          "has_enum": false
        },
        {
          "name": "realizedShareCapital",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Capital social realizado (sinônimo de `commonStock`).",
          "has_enum": false
        },
        {
          "name": "capitalReserves",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Reservas de capital (sinônimo de `capitalSurplus`).",
          "has_enum": false
        },
        {
          "name": "profitReserves",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Reservas de lucros.",
          "has_enum": false
        },
        {
          "name": "otherComprehensiveResults",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros resultados abrangentes.",
          "has_enum": false
        },
        {
          "name": "currentLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do passivo circulante (sinônimo de `totalCurrentLiabilities`).",
          "has_enum": false
        },
        {
          "name": "socialAndLaborObligations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações sociais e trabalhistas.",
          "has_enum": false
        },
        {
          "name": "providers",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fornecedores (sinônimo de `accountsPayable`).",
          "has_enum": false
        },
        {
          "name": "taxObligations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações fiscais (passivo circulante).",
          "has_enum": false
        },
        {
          "name": "loansAndFinancing",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Empréstimos e financiamentos (circulante).",
          "has_enum": false
        },
        {
          "name": "leaseFinancing",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Financiamento por arrendamento mercantil (circulante).",
          "has_enum": false
        },
        {
          "name": "otherObligations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras obrigações (circulante).",
          "has_enum": false
        },
        {
          "name": "otherCurrentLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros passivos circulantes (sinônimo de `otherCurrentLiab`).",
          "has_enum": false
        },
        {
          "name": "nonCurrentLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do passivo não circulante.",
          "has_enum": false
        },
        {
          "name": "longTermLoansAndFinancing",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Empréstimos e financiamentos (não circulante).",
          "has_enum": false
        },
        {
          "name": "longTermLeaseFinancing",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Financiamento por arrendamento mercantil (não circulante).",
          "has_enum": false
        },
        {
          "name": "otherLongTermObligations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras obrigações (passivo não circulante).",
          "has_enum": false
        },
        {
          "name": "longTermProvisions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Provisões (passivo não circulante).",
          "has_enum": false
        },
        {
          "name": "updatedAt",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data da última atualização deste registro (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "financialAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos financeiros (agregado de instrumentos financeiros no ativo).",
          "has_enum": false
        },
        {
          "name": "centralBankCompulsoryDeposit",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Depósitos compulsórios no Banco Central.",
          "has_enum": false
        },
        {
          "name": "financialAssetsMeasuredAtFairValueThroughProfitOrLoss",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos financeiros mensurados a valor justo por meio do resultado (FVTPL).",
          "has_enum": false
        },
        {
          "name": "currentAndDeferredTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Tributos correntes e diferidos no ativo.",
          "has_enum": false
        },
        {
          "name": "investments",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Investimentos (participações e outros).",
          "has_enum": false
        },
        {
          "name": "financialAssetsMeasuredAtFairValueThroughOtherComprehensiveIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos financeiros mensurados a valor justo por outros resultados abrangentes (FVOCI).",
          "has_enum": false
        },
        {
          "name": "financialAssetsAtAmortizedCost",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos financeiros ao custo amortizado.",
          "has_enum": false
        },
        {
          "name": "accountsReceivableFromClients",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Contas a receber de clientes (bruto).",
          "has_enum": false
        },
        {
          "name": "otherAccountsReceivable",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras contas a receber.",
          "has_enum": false
        },
        {
          "name": "biologicalAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos biológicos.",
          "has_enum": false
        },
        {
          "name": "prepaidExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas antecipadas.",
          "has_enum": false
        },
        {
          "name": "longTermAccountsReceivableFromClients",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Contas a receber de clientes - longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermInventory",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Estoques de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermBiologicalAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativos biológicos de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermPrepaidExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas antecipadas de longo prazo.",
          "has_enum": false
        },
        {
          "name": "creditsWithRelatedParties",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Créditos com partes relacionadas.",
          "has_enum": false
        },
        {
          "name": "shareholdings",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Participações societárias.",
          "has_enum": false
        },
        {
          "name": "investmentProperties",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Propriedades para investimento.",
          "has_enum": false
        },
        {
          "name": "otherLongTermReceivables",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros créditos/recebíveis de longo prazo.",
          "has_enum": false
        },
        {
          "name": "creditsFromOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Créditos oriundos de operações (instituições financeiras/seguradoras).",
          "has_enum": false
        },
        {
          "name": "securitiesAndCreditsReceivable",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Títulos e créditos a receber.",
          "has_enum": false
        },
        {
          "name": "otherValuesAndAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros valores e bens.",
          "has_enum": false
        },
        {
          "name": "compulsoryLoansAndDeposits",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Empréstimos e depósitos compulsórios.",
          "has_enum": false
        },
        {
          "name": "deferredSellingExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas de comercialização diferidas.",
          "has_enum": false
        },
        {
          "name": "longTermFinancialInvestmentsMeasuredAtFairValueThroughIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Investimentos financeiros de longo prazo mensurados a valor justo por meio do resultado.",
          "has_enum": false
        },
        {
          "name": "financialInvestmentsMeasuredAtFairValueThroughOtherComprehensiveIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Investimentos financeiros mensurados a valor justo por outros resultados abrangentes.",
          "has_enum": false
        },
        {
          "name": "financialInvestmentsMeasuredAtAmortizedCost",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Investimentos financeiros mensurados ao custo amortizado.",
          "has_enum": false
        },
        {
          "name": "intangibleAsset",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ativo intangível (valor agregado).",
          "has_enum": false
        },
        {
          "name": "deferredTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Tributos diferidos no ativo.",
          "has_enum": false
        },
        {
          "name": "otherOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras contas operacionais no ativo.",
          "has_enum": false
        },
        {
          "name": "totalLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do passivo.",
          "has_enum": false
        },
        {
          "name": "financialLiabilitiesMeasuredAtFairValueThroughIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Passivos financeiros mensurados a valor justo por meio do resultado.",
          "has_enum": false
        },
        {
          "name": "financialLiabilitiesAtAmortizedCost",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Passivos financeiros ao custo amortizado.",
          "has_enum": false
        },
        {
          "name": "taxLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações fiscais (passivo).",
          "has_enum": false
        },
        {
          "name": "otherLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros passivos.",
          "has_enum": false
        },
        {
          "name": "controllerShareholdersEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Patrimônio líquido atribuível aos controladores.",
          "has_enum": false
        },
        {
          "name": "nonControllingShareholdersEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Participação dos não controladores no patrimônio líquido.",
          "has_enum": false
        },
        {
          "name": "revaluationReserves",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Reservas de reavaliação.",
          "has_enum": false
        },
        {
          "name": "accumulatedProfitsOrLosses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucros ou prejuízos acumulados.",
          "has_enum": false
        },
        {
          "name": "equityValuationAdjustments",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ajustes de avaliação patrimonial.",
          "has_enum": false
        },
        {
          "name": "cumulativeConversionAdjustments",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ajustes acumulados de conversão.",
          "has_enum": false
        },
        {
          "name": "nationalSuppliers",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fornecedores nacionais.",
          "has_enum": false
        },
        {
          "name": "foreignSuppliers",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fornecedores estrangeiros.",
          "has_enum": false
        },
        {
          "name": "loansAndFinancingInNationalCurrency",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Empréstimos e financiamentos em moeda nacional (circulante).",
          "has_enum": false
        },
        {
          "name": "loansAndFinancingInForeignCurrency",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Empréstimos e financiamentos em moeda estrangeira (circulante).",
          "has_enum": false
        },
        {
          "name": "debentures",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Debêntures (passivo circulante).",
          "has_enum": false
        },
        {
          "name": "longTermLoansAndFinancingInNationalCurrency",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Empréstimos e financiamentos em moeda nacional (não circulante).",
          "has_enum": false
        },
        {
          "name": "longTermLoansAndFinancingInForeignCurrency",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Empréstimos e financiamentos em moeda estrangeira (não circulante).",
          "has_enum": false
        },
        {
          "name": "longTermDebentures",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Debêntures (passivo não circulante).",
          "has_enum": false
        },
        {
          "name": "otherNonCurrentLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros passivos não circulantes.",
          "has_enum": false
        },
        {
          "name": "profitsAndRevenuesToBeAppropriated",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucros e receitas a apropriar.",
          "has_enum": false
        },
        {
          "name": "debitsFromOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Débitos oriundos de operações.",
          "has_enum": false
        },
        {
          "name": "debitsFromInsuranceAndReinsurance",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Débitos de operações de seguros e resseguros.",
          "has_enum": false
        },
        {
          "name": "debitsFromComplementaryPension",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Débitos de operações de previdência complementar.",
          "has_enum": false
        },
        {
          "name": "thirdPartyDeposits",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Depósitos de terceiros.",
          "has_enum": false
        },
        {
          "name": "technicalProvisions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Provisões técnicas (seguradoras/previdência).",
          "has_enum": false
        },
        {
          "name": "insuranceAndReinsurance",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Provisões/obrigações de seguros e resseguros.",
          "has_enum": false
        },
        {
          "name": "complementaryPension",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações de previdência complementar.",
          "has_enum": false
        },
        {
          "name": "capitalization",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações de capitalização.",
          "has_enum": false
        },
        {
          "name": "otherDebits",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros débitos.",
          "has_enum": false
        },
        {
          "name": "longTermLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total do passivo de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermAccountsPayable",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fornecedores/contas a pagar de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermDebitsFromOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Débitos de operações (longo prazo).",
          "has_enum": false
        },
        {
          "name": "longTermTechnicalProvisions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Provisões técnicas de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermInsuranceAndReinsurance",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações de seguros e resseguros de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermComplementaryPension",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações de previdência complementar de longo prazo.",
          "has_enum": false
        },
        {
          "name": "longTermCapitalization",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Obrigações de capitalização de longo prazo.",
          "has_enum": false
        },
        {
          "name": "otherLongTermProvisions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras provisões de longo prazo.",
          "has_enum": false
        },
        {
          "name": "debitsFromCapitalization",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Débitos de operações de capitalização.",
          "has_enum": false
        },
        {
          "name": "debitsFromOtherOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Débitos de outras operações.",
          "has_enum": false
        },
        {
          "name": "otherProvisions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras provisões (diversas).",
          "has_enum": false
        },
        {
          "name": "advanceForFutureCapitalIncrease",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Adiantamento para futuro aumento de capital (AFAC).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "BalanceSheetHistory",
      "type": "object",
      "description": "Contém o histórico **anual** do Balanço Patrimonial. Retornado via `modules=balanceSheetHistory`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "balanceSheetHistory",
          "type": "array<BalanceSheetEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de Balanços Patrimoniais anuais, ordenados geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "BalanceSheetHistoryQuarterly",
      "type": "object",
      "description": "Contém o histórico **trimestral** do Balanço Patrimonial. Retornado via `modules=balanceSheetHistoryQuarterly`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "balanceSheetHistoryQuarterly",
          "type": "array<BalanceSheetEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de Balanços Patrimoniais trimestrais, ordenados geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "DefaultKeyStatisticsEntry",
      "type": "object",
      "description": "Representa um conjunto de principais indicadores e estatísticas financeiras para um período (TTM, anual ou trimestral).",
      "field_count": 34,
      "total_fields": 34,
      "required_count": 0,
      "fields": [
        {
          "name": "type",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Periodicidade dos dados: `yearly` (anual), `quarterly` (trimestral), `ttm` (Trailing Twelve Months - últimos 12 meses).",
          "has_enum": true
        },
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo ao qual as estatísticas se referem.",
          "has_enum": false
        },
        {
          "name": "enterpriseValue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor da Firma (Enterprise Value - EV): Market Cap + Dívida Total - Caixa.",
          "has_enum": false
        },
        {
          "name": "forwardPE",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço / Lucro Projetado (Forward P/E): Preço da Ação / LPA estimado para o próximo período.",
          "has_enum": false
        },
        {
          "name": "profitMargins",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Margem de Lucro Líquida (Lucro Líquido / Receita Líquida). Geralmente em base TTM ou anual.",
          "has_enum": false
        },
        {
          "name": "floatShares",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ações em livre circulação (free float).",
          "has_enum": false
        },
        {
          "name": "sharesOutstanding",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Número total de ações ordinárias em circulação.",
          "has_enum": false
        },
        {
          "name": "heldPercentInsiders",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Percentual de ações detidas por insiders (administradores, controladores).",
          "has_enum": false
        },
        {
          "name": "heldPercentInstitutions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Percentual de ações detidas por instituições (fundos, investidores institucionais).",
          "has_enum": false
        },
        {
          "name": "beta",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Beta da ação (sensibilidade em relação ao mercado).",
          "has_enum": false
        },
        {
          "name": "impliedSharesOutstanding",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ações implícitas em circulação (considerando diluição/derivativos).",
          "has_enum": false
        },
        {
          "name": "bookValue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Patrimonial por Ação (VPA): Patrimônio Líquido / Ações em Circulação.",
          "has_enum": false
        },
        {
          "name": "priceToBook",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço sobre Valor Patrimonial (P/VP): Preço da Ação / VPA.",
          "has_enum": false
        },
        {
          "name": "lastFiscalYearEnd",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data de encerramento do último ano fiscal (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "nextFiscalYearEnd",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data de encerramento do próximo ano fiscal (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "mostRecentQuarter",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data de término do trimestre mais recente considerado nos cálculos (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "earningsQuarterlyGrowth",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Crescimento percentual do lucro líquido no último trimestre em relação ao mesmo trimestre do ano anterior (YoY).",
          "has_enum": false
        },
        {
          "name": "earningsAnnualGrowth",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Crescimento percentual do lucro líquido no último ano fiscal completo em relação ao ano anterior.",
          "has_enum": false
        },
        {
          "name": "netIncomeToCommon",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Líquido atribuível aos acionistas ordinários (controladores).",
          "has_enum": false
        },
        {
          "name": "trailingEps",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Por Ação (LPA) dos Últimos 12 Meses (TTM).",
          "has_enum": false
        },
        {
          "name": "forwardEps",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Por Ação projetado (próximo período).",
          "has_enum": false
        },
        {
          "name": "pegRatio",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Índice PEG (P/E dividido pelo crescimento esperado dos lucros).",
          "has_enum": false
        },
        {
          "name": "lastSplitFactor",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Fator do último desdobramento/grupamento (ex.: 2:1, 1:10).",
          "has_enum": false
        },
        {
          "name": "lastSplitDate",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Data do último desdobramento/grupamento (timestamp UNIX em segundos).",
          "has_enum": false
        },
        {
          "name": "enterpriseToRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Múltiplo EV/Receita (Enterprise Value / Receita Líquida TTM).",
          "has_enum": false
        },
        {
          "name": "enterpriseToEbitda",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Múltiplo EV/EBITDA (Enterprise Value / EBITDA TTM).",
          "has_enum": false
        },
        {
          "name": "52WeekChange",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação percentual do preço da ação nas últimas 52 semanas.",
          "has_enum": false
        },
        {
          "name": "SandP52WeekChange",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação percentual do índice S&P 500 nas últimas 52 semanas (para referência).",
          "has_enum": false
        },
        {
          "name": "lastDividendValue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor do último dividendo ou JCP pago por ação.",
          "has_enum": false
        },
        {
          "name": "lastDividendDate",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data de pagamento (ou 'Data Com') do último dividendo/JCP (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "dividendYield",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Dividend Yield (provento anualizado sobre o preço atual).",
          "has_enum": false
        },
        {
          "name": "ytdReturn",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Retorno percentual do preço da ação desde o início do ano atual (Year-to-Date).",
          "has_enum": false
        },
        {
          "name": "totalAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor total dos ativos registrado no último balanço (anual ou trimestral).",
          "has_enum": false
        },
        {
          "name": "updatedAt",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data da última atualização deste registro específico na fonte de dados (YYYY-MM-DD).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "DefaultKeyStatistics",
      "type": "object",
      "description": "Contém as principais estatísticas financeiras atuais ou TTM (Trailing Twelve Months). Retornado via `modules=defaultKeyStatistics`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "defaultKeyStatistics",
          "type": "DefaultKeyStatisticsEntry",
          "required": false,
          "nullable": false,
          "description": "Objeto contendo as principais estatísticas.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "DefaultKeyStatisticsHistory",
      "type": "object",
      "description": "Contém o histórico **anual** das principais estatísticas financeiras. Retornado via `modules=defaultKeyStatisticsHistory`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "defaultKeyStatisticsHistory",
          "type": "array<DefaultKeyStatisticsEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista das principais estatísticas anuais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "DefaultKeyStatisticsHistoryQuarterly",
      "type": "object",
      "description": "Contém o histórico **trimestral** das principais estatísticas financeiras. Retornado via `modules=defaultKeyStatisticsHistoryQuarterly`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "defaultKeyStatisticsHistoryQuarterly",
          "type": "array<DefaultKeyStatisticsEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista das principais estatísticas trimestrais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "IncomeStatementEntry",
      "type": "object",
      "description": "Representa os dados de uma Demonstração do Resultado do Exercício (DRE) para um período específico (anual ou trimestral).",
      "field_count": 52,
      "total_fields": 52,
      "required_count": 0,
      "fields": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Identificador único deste registro de DRE (interno).",
          "has_enum": false
        },
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo ao qual a DRE se refere.",
          "has_enum": false
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Indica a periodicidade da DRE: `yearly` (anual) ou `quarterly` (trimestral).",
          "has_enum": true
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data de término do período fiscal ao qual a DRE se refere (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "totalRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita Operacional Líquida.",
          "has_enum": false
        },
        {
          "name": "costOfRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Custo dos Produtos Vendidos (CPV) ou Custo dos Serviços Prestados (CSP).",
          "has_enum": false
        },
        {
          "name": "grossProfit",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Bruto (Receita Líquida - CPV/CSP).",
          "has_enum": false
        },
        {
          "name": "researchDevelopment",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas com Pesquisa e Desenvolvimento.",
          "has_enum": false
        },
        {
          "name": "sellingGeneralAdministrative",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas com Vendas, Gerais e Administrativas.",
          "has_enum": false
        },
        {
          "name": "nonRecurring",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Itens Não Recorrentes (pode incluir outras despesas/receitas operacionais).",
          "has_enum": false
        },
        {
          "name": "otherOperatingExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Despesas Operacionais.",
          "has_enum": false
        },
        {
          "name": "totalOperatingExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Total das Despesas Operacionais (P&D + SG&A + Outras).",
          "has_enum": false
        },
        {
          "name": "operatingIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Operacional (EBIT - Earnings Before Interest and Taxes). Lucro Bruto - Despesas Operacionais.",
          "has_enum": false
        },
        {
          "name": "totalOtherIncomeExpenseNet",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado Financeiro Líquido + Outras Receitas/Despesas.",
          "has_enum": false
        },
        {
          "name": "ebit",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Antes dos Juros e Impostos (LAJIR ou EBIT). Geralmente igual a `operatingIncome`.",
          "has_enum": false
        },
        {
          "name": "interestExpense",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas Financeiras (Juros pagos). Note que este campo é negativo.",
          "has_enum": false
        },
        {
          "name": "incomeBeforeTax",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Antes do Imposto de Renda e Contribuição Social (LAIR). EBIT + Resultado Financeiro.",
          "has_enum": false
        },
        {
          "name": "incomeTaxExpense",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Imposto de Renda e Contribuição Social sobre o Lucro.",
          "has_enum": false
        },
        {
          "name": "minorityInterest",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Participação de Acionistas Não Controladores (no Lucro Líquido).",
          "has_enum": false
        },
        {
          "name": "netIncomeFromContinuingOps",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Líquido das Operações Continuadas.",
          "has_enum": false
        },
        {
          "name": "discontinuedOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado Líquido das Operações Descontinuadas.",
          "has_enum": false
        },
        {
          "name": "extraordinaryItems",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Itens Extraordinários.",
          "has_enum": false
        },
        {
          "name": "effectOfAccountingCharges",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Efeito de Mudanças Contábeis.",
          "has_enum": false
        },
        {
          "name": "otherItems",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros Itens.",
          "has_enum": false
        },
        {
          "name": "netIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Líquido Consolidado do Período.",
          "has_enum": false
        },
        {
          "name": "netIncomeApplicableToCommonShares",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Líquido Atribuível aos Acionistas Controladores (Ações Ordinárias).",
          "has_enum": false
        },
        {
          "name": "salesExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas com Vendas (detalhamento, pode estar contido em SG&A).",
          "has_enum": false
        },
        {
          "name": "lossesDueToNonRecoverabilityOfAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Perdas por Não Recuperabilidade de Ativos (Impairment).",
          "has_enum": false
        },
        {
          "name": "otherOperatingIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Receitas Operacionais (detalhamento).",
          "has_enum": false
        },
        {
          "name": "equityIncomeResult",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado de Equivalência Patrimonial.",
          "has_enum": false
        },
        {
          "name": "financialResult",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado Financeiro Líquido.",
          "has_enum": false
        },
        {
          "name": "financialIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receitas Financeiras.",
          "has_enum": false
        },
        {
          "name": "financialExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas Financeiras (valor positivo aqui, diferente de `interestExpense`).",
          "has_enum": false
        },
        {
          "name": "currentTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Imposto de Renda e Contribuição Social Correntes.",
          "has_enum": false
        },
        {
          "name": "deferredTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Imposto de Renda e Contribuição Social Diferidos.",
          "has_enum": false
        },
        {
          "name": "incomeBeforeStatutoryParticipationsAndContributions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado Antes das Participações Estatutárias.",
          "has_enum": false
        },
        {
          "name": "basicEarningsPerCommonShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Básico por Ação Ordinária (ON).",
          "has_enum": false
        },
        {
          "name": "dilutedEarningsPerCommonShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Diluído por Ação Ordinária (ON).",
          "has_enum": false
        },
        {
          "name": "basicEarningsPerPreferredShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Básico por Ação Preferencial (PN).",
          "has_enum": false
        },
        {
          "name": "profitSharingAndStatutoryContributions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Participações nos Lucros e Contribuições Estatutárias.",
          "has_enum": false
        },
        {
          "name": "dilutedEarningsPerPreferredShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Diluído por Ação Preferencial (PN).",
          "has_enum": false
        },
        {
          "name": "claimsAndOperationsCosts",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Custos com Sinistros e Operações (específico para Seguradoras).",
          "has_enum": false
        },
        {
          "name": "administrativeCosts",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas Administrativas (detalhamento, pode estar contido em SG&A).",
          "has_enum": false
        },
        {
          "name": "otherOperatingIncomeAndExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Receitas e Despesas Operacionais (agregado).",
          "has_enum": false
        },
        {
          "name": "earningsPerShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro por Ação (LPA) - Geral (pode ser básico ou diluído, verificar contexto).",
          "has_enum": false
        },
        {
          "name": "basicEarningsPerShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Básico por Ação (LPA Básico) - Geral.",
          "has_enum": false
        },
        {
          "name": "dilutedEarningsPerShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Diluído por Ação (LPA Diluído) - Geral.",
          "has_enum": false
        },
        {
          "name": "insuranceOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado de Operações de Seguros (específico para Seguradoras).",
          "has_enum": false
        },
        {
          "name": "reinsuranceOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado de Operações de Resseguros (específico para Seguradoras).",
          "has_enum": false
        },
        {
          "name": "complementaryPensionOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado de Operações de Previdência Complementar (específico para Seguradoras/Previdência).",
          "has_enum": false
        },
        {
          "name": "capitalizationOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado de Operações de Capitalização (específico para Seguradoras).",
          "has_enum": false
        },
        {
          "name": "updatedAt",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data da última atualização deste registro específico na fonte de dados (YYYY-MM-DD).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "IncomeStatementHistory",
      "type": "object",
      "description": "Contém o histórico **anual** da Demonstração do Resultado do Exercício (DRE). Retornado via `modules=incomeStatementHistory`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "incomeStatementHistory",
          "type": "array<IncomeStatementEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de DREs anuais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "IncomeStatementHistoryQuarterly",
      "type": "object",
      "description": "Contém o histórico **trimestral** da Demonstração do Resultado do Exercício (DRE). Retornado via `modules=incomeStatementHistoryQuarterly`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "incomeStatementHistoryQuarterly",
          "type": "array<IncomeStatementEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de DREs trimestrais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "FinancialDataEntry",
      "type": "object",
      "description": "Representa um conjunto de dados e indicadores financeiros calculados para um período (TTM, anual ou trimestral).",
      "field_count": 32,
      "total_fields": 32,
      "required_count": 0,
      "fields": [
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo ao qual os dados se referem.",
          "has_enum": false
        },
        {
          "name": "currentPrice",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço atual da ação (pode ser ligeiramente defasado).",
          "has_enum": false
        },
        {
          "name": "targetHighPrice",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço-alvo mais alto estimado por analistas.",
          "has_enum": false
        },
        {
          "name": "targetLowPrice",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço-alvo mais baixo estimado por analistas.",
          "has_enum": false
        },
        {
          "name": "targetMeanPrice",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço-alvo médio estimado por analistas.",
          "has_enum": false
        },
        {
          "name": "targetMedianPrice",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço-alvo mediano estimado por analistas.",
          "has_enum": false
        },
        {
          "name": "recommendationMean",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Média de recomendações dos analistas (1=Compra Forte, 5=Venda Forte).",
          "has_enum": false
        },
        {
          "name": "recommendationKey",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Resumo da recomendação (ex.: strong_buy, buy, hold, sell, strong_sell).",
          "has_enum": false
        },
        {
          "name": "numberOfAnalystOpinions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Número de opiniões de analistas consideradas.",
          "has_enum": false
        },
        {
          "name": "ebitda",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Antes de Juros, Impostos, Depreciação e Amortização (LAJIDA ou EBITDA). Geralmente TTM.",
          "has_enum": false
        },
        {
          "name": "quickRatio",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Índice de Liquidez Seca ((Ativo Circulante - Estoques) / Passivo Circulante).",
          "has_enum": false
        },
        {
          "name": "currentRatio",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Índice de Liquidez Corrente (Ativo Circulante / Passivo Circulante).",
          "has_enum": false
        },
        {
          "name": "debtToEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Índice Dívida Líquida / Patrimônio Líquido.",
          "has_enum": false
        },
        {
          "name": "revenuePerShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita Líquida por Ação (Receita Líquida TTM / Ações em Circulação).",
          "has_enum": false
        },
        {
          "name": "returnOnAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Retorno sobre Ativos (ROA): Lucro Líquido TTM / Ativo Total Médio.",
          "has_enum": false
        },
        {
          "name": "returnOnEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Retorno sobre Patrimônio Líquido (ROE): Lucro Líquido TTM / Patrimônio Líquido Médio.",
          "has_enum": false
        },
        {
          "name": "earningsGrowth",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Crescimento do Lucro Líquido (geralmente trimestral YoY, como `earningsQuarterlyGrowth`).",
          "has_enum": false
        },
        {
          "name": "revenueGrowth",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Crescimento da Receita Líquida (geralmente trimestral YoY).",
          "has_enum": false
        },
        {
          "name": "grossMargins",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Margem Bruta (Lucro Bruto TTM / Receita Líquida TTM).",
          "has_enum": false
        },
        {
          "name": "ebitdaMargins",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Margem EBITDA (EBITDA TTM / Receita Líquida TTM).",
          "has_enum": false
        },
        {
          "name": "operatingMargins",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Margem Operacional (EBIT TTM / Receita Líquida TTM).",
          "has_enum": false
        },
        {
          "name": "profitMargins",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Margem Líquida (Lucro Líquido TTM / Receita Líquida TTM). Sinônimo do campo de mesmo nome em `DefaultKeyStatisticsEntry`.",
          "has_enum": false
        },
        {
          "name": "totalCash",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Caixa e Equivalentes de Caixa + Aplicações Financeiras de Curto Prazo (último balanço).",
          "has_enum": false
        },
        {
          "name": "totalCashPerShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Caixa Total por Ação (Caixa Total / Ações em Circulação).",
          "has_enum": false
        },
        {
          "name": "totalDebt",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Dívida Bruta Total (Dívida de Curto Prazo + Dívida de Longo Prazo - último balanço).",
          "has_enum": false
        },
        {
          "name": "totalRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita Líquida Total (geralmente TTM).",
          "has_enum": false
        },
        {
          "name": "grossProfits",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Bruto (geralmente TTM).",
          "has_enum": false
        },
        {
          "name": "operatingCashflow",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fluxo de Caixa das Operações (FCO) - (geralmente TTM).",
          "has_enum": false
        },
        {
          "name": "freeCashflow",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fluxo de Caixa Livre (FCO - CAPEX) - (geralmente TTM).",
          "has_enum": false
        },
        {
          "name": "financialCurrency",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Moeda na qual os dados financeiros são reportados (ex: `BRL`, `USD`).",
          "has_enum": false
        },
        {
          "name": "updatedAt",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data da última atualização deste registro específico na fonte de dados (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Periodicidade dos dados: `yearly` (anual), `quarterly` (trimestral), `ttm` (Trailing Twelve Months).",
          "has_enum": true
        }
      ]
    },
    {
      "name": "FinancialData",
      "type": "object",
      "description": "Contém dados financeiros e indicadores TTM (Trailing Twelve Months). Retornado via `modules=financialData`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "financialData",
          "type": "FinancialDataEntry",
          "required": false,
          "nullable": false,
          "description": "Objeto contendo os dados financeiros TTM.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "FinancialDataHistory",
      "type": "object",
      "description": "Contém o histórico **anual** de dados financeiros e indicadores. Retornado via `modules=financialDataHistory`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "financialDataHistory",
          "type": "array<FinancialDataEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de dados financeiros anuais, ordenados geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "FinancialDataHistoryQuarterly",
      "type": "object",
      "description": "Contém o histórico **trimestral** de dados financeiros e indicadores. Retornado via `modules=financialDataHistoryQuarterly`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "financialDataHistoryQuarterly",
          "type": "array<FinancialDataEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de dados financeiros trimestrais, ordenados geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "ValueAddedEntry",
      "type": "object",
      "description": "Representa os dados de uma Demonstração do Valor Adicionado (DVA) para um período específico (anual ou trimestral). A DVA mostra como a riqueza gerada pela empresa foi distribuída.",
      "field_count": 60,
      "total_fields": 60,
      "required_count": 0,
      "fields": [
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo ao qual a DVA se refere.",
          "has_enum": false
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Indica a periodicidade da DVA: `yearly` (anual) ou `quarterly` (trimestral).",
          "has_enum": true
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data de término do período fiscal ao qual a DVA se refere (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "revenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receitas (Venda de Mercadorias, Produtos e Serviços, etc.). Item 1 da DVA.",
          "has_enum": false
        },
        {
          "name": "financialIntermediationRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita de Intermediação Financeira (específico para bancos).",
          "has_enum": false
        },
        {
          "name": "revenueFromTheProvisionOfServices",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita da Prestação de Serviços (detalhamento).",
          "has_enum": false
        },
        {
          "name": "provisionOrReversalOfExpectedCreditRiskLosses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Provisão/Reversão de Perdas com Risco de Crédito (PCLD).",
          "has_enum": false
        },
        {
          "name": "otherRevenues",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Receitas.",
          "has_enum": false
        },
        {
          "name": "financialIntermediationExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Despesas de Intermediação Financeira (específico para bancos).",
          "has_enum": false
        },
        {
          "name": "suppliesPurchasedFromThirdParties",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Insumos Adquiridos de Terceiros (Custo de Mercadorias, Matérias-Primas). Item 2 da DVA.",
          "has_enum": false
        },
        {
          "name": "materialsEnergyAndOthers",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Custos com Materiais, Energia, Serviços de Terceiros e Outros.",
          "has_enum": false
        },
        {
          "name": "services",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Serviços de Terceiros (detalhamento).",
          "has_enum": false
        },
        {
          "name": "lossOrRecoveryOfAssetValues",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Perda / Recuperação de Valores de Ativos (Impairment).",
          "has_enum": false
        },
        {
          "name": "otherSupplies",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros Insumos.",
          "has_enum": false
        },
        {
          "name": "grossAddedValue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Adicionado Bruto (Receitas - Insumos). Item 3 da DVA.",
          "has_enum": false
        },
        {
          "name": "retentions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Retenções (Depreciação, Amortização e Exaustão). Item 4 da DVA.",
          "has_enum": false
        },
        {
          "name": "depreciationAndAmortization",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Depreciação e Amortização.",
          "has_enum": false
        },
        {
          "name": "otherRetentions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Retenções (Exaustão, etc.).",
          "has_enum": false
        },
        {
          "name": "netAddedValue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Adicionado Líquido Produzido pela Entidade (Bruto - Retenções). Item 5 da DVA.",
          "has_enum": false
        },
        {
          "name": "addedValueReceivedByTransfer",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Adicionado Recebido em Transferência (Resultado de Equivalência Patrimonial, Receitas Financeiras, etc.). Item 6 da DVA.",
          "has_enum": false
        },
        {
          "name": "equityIncomeResult",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado de Equivalência Patrimonial (como receita na DVA).",
          "has_enum": false
        },
        {
          "name": "otherValuesReceivedByTransfer",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outros Valores Recebidos (Receitas Financeiras, Aluguéis, etc.).",
          "has_enum": false
        },
        {
          "name": "addedValueToDistribute",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Adicionado Total a Distribuir (Líquido Produzido + Recebido em Transferência). Item 7 da DVA.",
          "has_enum": false
        },
        {
          "name": "distributionOfAddedValue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Distribuição do Valor Adicionado (Soma dos itens seguintes). Item 8 da DVA.",
          "has_enum": false
        },
        {
          "name": "teamRemuneration",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Pessoal e Encargos (Salários, Benefícios, FGTS).",
          "has_enum": false
        },
        {
          "name": "taxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Impostos, Taxas e Contribuições (Federais, Estaduais, Municipais).",
          "has_enum": false
        },
        {
          "name": "federalTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Impostos Federais (IRPJ, CSLL, PIS, COFINS, IPI).",
          "has_enum": false
        },
        {
          "name": "stateTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Impostos Estaduais (ICMS).",
          "has_enum": false
        },
        {
          "name": "municipalTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Impostos Municipais (ISS).",
          "has_enum": false
        },
        {
          "name": "remunerationOfThirdPartyCapitals",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Remuneração de Capitais de Terceiros (Juros, Aluguéis).",
          "has_enum": false
        },
        {
          "name": "equityRemuneration",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Remuneração de Capitais Próprios (JCP, Dividendos, Lucros Retidos).",
          "has_enum": false
        },
        {
          "name": "interestOnOwnEquity",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Juros sobre o Capital Próprio (JCP).",
          "has_enum": false
        },
        {
          "name": "dividends",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Dividendos Distribuídos.",
          "has_enum": false
        },
        {
          "name": "retainedEarningsOrLoss",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucros Retidos ou Prejuízo do Exercício.",
          "has_enum": false
        },
        {
          "name": "nonControllingShareOfRetainedEarnings",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Participação dos Não Controladores nos Lucros Retidos.",
          "has_enum": false
        },
        {
          "name": "otherDistributions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Distribuições.",
          "has_enum": false
        },
        {
          "name": "productSales",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Venda de Produtos e Serviços (detalhamento).",
          "has_enum": false
        },
        {
          "name": "constructionOfOwnAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Construção de Ativos Próprios.",
          "has_enum": false
        },
        {
          "name": "provisionOrReversalOfDoubtfulAccounts",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Provisão/Reversão para Créditos de Liquidação Duvidosa (PCLD - como receita/despesa na DVA).",
          "has_enum": false
        },
        {
          "name": "costsWithProductsSold",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Custos dos Produtos, Mercadorias e Serviços Vendidos (detalhamento).",
          "has_enum": false
        },
        {
          "name": "thirdPartyMaterialsAndServices",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Materiais, Energia, Serviços de Terceiros.",
          "has_enum": false
        },
        {
          "name": "lossOrRecoveryOfAssets",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Perda/Recuperação de Valores de Ativos (Impairment - como custo/receita).",
          "has_enum": false
        },
        {
          "name": "netAddedValueProduced",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Adicionado Líquido Produzido (sinônimo de `netAddedValue`).",
          "has_enum": false
        },
        {
          "name": "addedValueReceivedOnTransfer",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Adicionado Recebido em Transferência (sinônimo de `addedValueReceivedByTransfer`).",
          "has_enum": false
        },
        {
          "name": "financialIncome",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receitas Financeiras (como valor recebido em transferência).",
          "has_enum": false
        },
        {
          "name": "insuranceOperationsRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita com Operações de Seguros (específico para Seguradoras).",
          "has_enum": false
        },
        {
          "name": "complementaryPensionOperationsRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita com Operações de Previdência Complementar.",
          "has_enum": false
        },
        {
          "name": "feesRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita com Taxas e Comissões.",
          "has_enum": false
        },
        {
          "name": "variationsOfTechnicalProvisions",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variações das Provisões Técnicas (específico para Seguradoras).",
          "has_enum": false
        },
        {
          "name": "insuranceOperationsVariations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variações de Operações de Seguros.",
          "has_enum": false
        },
        {
          "name": "pensionOperationsVariations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variações de Operações de Previdência.",
          "has_enum": false
        },
        {
          "name": "otherVariations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Variações.",
          "has_enum": false
        },
        {
          "name": "netOperatingRevenue",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Receita Operacional Líquida (detalhamento).",
          "has_enum": false
        },
        {
          "name": "claimsAndBenefits",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Sinistros Retidos e Benefícios.",
          "has_enum": false
        },
        {
          "name": "variationInDeferredSellingExpenses",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação nas Despesas de Comercialização Diferidas.",
          "has_enum": false
        },
        {
          "name": "resultsOfCededReinsuranceOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultados de Operações de Resseguros Cedidos.",
          "has_enum": false
        },
        {
          "name": "resultOfCoinsuranceOperationsAssigned",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Resultado de Operações de Cosseguros Cedidos.",
          "has_enum": false
        },
        {
          "name": "totalAddedValueToDistribute",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Valor Adicionado Total a Distribuir (sinônimo de `addedValueToDistribute`).",
          "has_enum": false
        },
        {
          "name": "ownEquityRemuneration",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Remuneração de Capitais Próprios (sinônimo de `equityRemuneration`).",
          "has_enum": false
        },
        {
          "name": "updatedAt",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data da última atualização deste registro específico na fonte de dados (YYYY-MM-DD).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "ValueAddedHistory",
      "type": "object",
      "description": "Contém o histórico **anual** da Demonstração do Valor Adicionado (DVA). Retornado via `modules=valueAddedHistory`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "valueAddedHistory",
          "type": "array<ValueAddedEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de DVAs anuais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "ValueAddedHistoryQuarterly",
      "type": "object",
      "description": "Contém o histórico **trimestral** da Demonstração do Valor Adicionado (DVA). Retornado via `modules=valueAddedHistoryQuarterly`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "valueAddedHistoryQuarterly",
          "type": "array<ValueAddedEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de DVAs trimestrais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CashflowEntry",
      "type": "object",
      "description": "Representa os dados de uma Demonstração do Fluxo de Caixa (DFC) para um período específico (anual ou trimestral).",
      "field_count": 18,
      "total_fields": 18,
      "required_count": 0,
      "fields": [
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker do ativo ao qual a DFC se refere.",
          "has_enum": false
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Indica a periodicidade da DFC: `yearly` (anual) ou `quarterly` (trimestral).",
          "has_enum": true
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data de término do período fiscal ao qual a DFC se refere (YYYY-MM-DD).",
          "has_enum": false
        },
        {
          "name": "operatingCashFlow",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fluxo de Caixa das Atividades Operacionais (FCO).",
          "has_enum": false
        },
        {
          "name": "incomeFromOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Caixa Gerado nas Operações (antes das variações de ativos/passivos).",
          "has_enum": false
        },
        {
          "name": "netIncomeBeforeTaxes",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro líquido antes dos impostos (base para reconciliação pelo método indireto).",
          "has_enum": false
        },
        {
          "name": "adjustmentsToProfitOrLoss",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Ajustes ao lucro/prejuízo (depreciação, amortização, equivalência patrimonial, variações não caixa).",
          "has_enum": false
        },
        {
          "name": "changesInAssetsAndLiabilities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variações em Ativos e Passivos Operacionais (Clientes, Estoques, Fornecedores, etc.).",
          "has_enum": false
        },
        {
          "name": "otherOperatingActivities",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Outras Atividades Operacionais (Juros pagos/recebidos, Impostos pagos, etc.).",
          "has_enum": false
        },
        {
          "name": "investmentCashFlow",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fluxo de Caixa das Atividades de Investimento (FCI) (Compra/Venda de Imobilizado, Investimentos).",
          "has_enum": false
        },
        {
          "name": "financingCashFlow",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Fluxo de Caixa das Atividades de Financiamento (FCF) (Captação/Pagamento de Empréstimos, Emissão/Recompra de Ações, Dividendos pagos).",
          "has_enum": false
        },
        {
          "name": "exchangeVariationWithoutCash",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação cambial sem efeito caixa (ajuste de conversão).",
          "has_enum": false
        },
        {
          "name": "foreignExchangeRateWithoutCash",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Efeito da Variação Cambial sobre o Caixa e Equivalentes.",
          "has_enum": false
        },
        {
          "name": "increaseOrDecreaseInCash",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Aumento ou Redução Líquida de Caixa e Equivalentes (FCO + FCI + FCF + Variação Cambial).",
          "has_enum": false
        },
        {
          "name": "initialCashBalance",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Saldo Inicial de Caixa e Equivalentes no início do período.",
          "has_enum": false
        },
        {
          "name": "finalCashBalance",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Saldo Final de Caixa e Equivalentes no final do período.",
          "has_enum": false
        },
        {
          "name": "cashGeneratedInOperations",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Caixa gerado nas operações (após variações no capital de giro).",
          "has_enum": false
        },
        {
          "name": "updatedAt",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data da última atualização deste registro específico na fonte de dados (YYYY-MM-DD).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CashflowHistory",
      "type": "object",
      "description": "Contém o histórico **anual** da Demonstração do Fluxo de Caixa (DFC). Retornado via `modules=cashflowHistory`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "cashflowHistory",
          "type": "array<CashflowEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de DFCs anuais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CashflowHistoryQuarterly",
      "type": "object",
      "description": "Contém o histórico **trimestral** da Demonstração do Fluxo de Caixa (DFC). Retornado via `modules=cashflowHistoryQuarterly`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "cashflowHistoryQuarterly",
          "type": "array<CashflowEntry>",
          "required": false,
          "nullable": false,
          "description": "Lista de DFCs trimestrais, ordenadas geralmente do mais recente para o mais antigo.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "QuoteResult",
      "type": "object",
      "description": "Contém os dados detalhados de um ativo específico retornado pelo endpoint `/api/quote/{tickers}`.",
      "field_count": 51,
      "total_fields": 51,
      "required_count": 0,
      "fields": [
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Ticker (símbolo) do ativo (ex: `PETR4`, `^BVSP`).",
          "has_enum": false
        },
        {
          "name": "currency",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Moeda na qual os valores monetários são expressos (geralmente `BRL`).",
          "has_enum": false
        },
        {
          "name": "twoHundredDayAverage",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Média móvel simples dos preços de fechamento dos últimos 200 dias.",
          "has_enum": false
        },
        {
          "name": "twoHundredDayAverageChange",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação absoluta entre o preço atual e a média de 200 dias.",
          "has_enum": false
        },
        {
          "name": "twoHundredDayAverageChangePercent",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação percentual entre o preço atual e a média de 200 dias.",
          "has_enum": false
        },
        {
          "name": "marketCap",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Capitalização de mercado total do ativo (Preço Atual x Ações em Circulação).",
          "has_enum": false
        },
        {
          "name": "shortName",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Nome curto ou abreviado da empresa ou ativo.",
          "has_enum": false
        },
        {
          "name": "longName",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Nome longo ou completo da empresa ou ativo.",
          "has_enum": false
        },
        {
          "name": "regularMarketChange",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação absoluta do preço no dia atual em relação ao fechamento anterior.",
          "has_enum": false
        },
        {
          "name": "regularMarketChangePercent",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação percentual do preço no dia atual em relação ao fechamento anterior.",
          "has_enum": false
        },
        {
          "name": "regularMarketTime",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Data e hora da última atualização da cotação (último negócio registrado). Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "regularMarketPrice",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço atual ou do último negócio registrado.",
          "has_enum": false
        },
        {
          "name": "regularMarketDayHigh",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço máximo atingido no dia de negociação atual.",
          "has_enum": false
        },
        {
          "name": "regularMarketDayRange",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "String formatada mostrando o intervalo de preço do dia (Mínimo - Máximo).",
          "has_enum": false
        },
        {
          "name": "regularMarketDayLow",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço mínimo atingido no dia de negociação atual.",
          "has_enum": false
        },
        {
          "name": "regularMarketVolume",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Volume financeiro negociado no dia atual.",
          "has_enum": false
        },
        {
          "name": "regularMarketPreviousClose",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço de fechamento do pregão anterior.",
          "has_enum": false
        },
        {
          "name": "regularMarketOpen",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço de abertura no dia de negociação atual.",
          "has_enum": false
        },
        {
          "name": "averageDailyVolume3Month",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Média do volume financeiro diário negociado nos últimos 3 meses.",
          "has_enum": false
        },
        {
          "name": "averageDailyVolume10Day",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Média do volume financeiro diário negociado nos últimos 10 dias.",
          "has_enum": false
        },
        {
          "name": "fiftyTwoWeekLowChange",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação absoluta entre o preço atual e o preço mínimo das últimas 52 semanas.",
          "has_enum": false
        },
        {
          "name": "fiftyTwoWeekRange",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "String formatada mostrando o intervalo de preço das últimas 52 semanas (Mínimo - Máximo).",
          "has_enum": false
        },
        {
          "name": "fiftyTwoWeekHighChange",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação absoluta entre o preço atual e o preço máximo das últimas 52 semanas.",
          "has_enum": false
        },
        {
          "name": "fiftyTwoWeekHighChangePercent",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Variação percentual entre o preço atual e o preço máximo das últimas 52 semanas.",
          "has_enum": false
        },
        {
          "name": "fiftyTwoWeekLow",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço mínimo atingido nas últimas 52 semanas.",
          "has_enum": false
        },
        {
          "name": "fiftyTwoWeekHigh",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Preço máximo atingido nas últimas 52 semanas.",
          "has_enum": false
        },
        {
          "name": "priceEarnings",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Indicador Preço/Lucro (P/L): Preço Atual / Lucro Por Ação (LPA) TTM. Retornado se `fundamental=true`.",
          "has_enum": false
        },
        {
          "name": "earningsPerShare",
          "type": "number",
          "required": false,
          "nullable": true,
          "description": "Lucro Por Ação (LPA) dos últimos 12 meses (TTM). Retornado se `fundamental=true`.",
          "has_enum": false
        },
        {
          "name": "logourl",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "URL da imagem do logo do ativo/empresa.",
          "has_enum": false
        },
        {
          "name": "updatedAt",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "Timestamp da última atualização dos dados do índice na fonte (aplicável principalmente a índices, como `^BVSP`). Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "usedInterval",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "O intervalo (`interval`) efetivamente utilizado pela API para retornar os dados históricos, caso solicitado.",
          "has_enum": false
        },
        {
          "name": "usedRange",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "O período (`range`) efetivamente utilizado pela API para retornar os dados históricos, caso solicitado.",
          "has_enum": false
        },
        {
          "name": "historicalDataPrice",
          "type": "array<HistoricalDataPrice>",
          "required": false,
          "nullable": true,
          "description": "Array contendo a série histórica de preços, retornado apenas se os parâmetros `range` e/ou `interval` forem especificados na requisição.",
          "has_enum": false
        },
        {
          "name": "validRanges",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista dos valores válidos que podem ser utilizados no parâmetro `range` para este ativo específico.",
          "has_enum": false
        },
        {
          "name": "validIntervals",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista dos valores válidos que podem ser utilizados no parâmetro `interval` para este ativo específico.",
          "has_enum": false
        },
        {
          "name": "dividendsData",
          "type": "DividendsData",
          "required": false,
          "nullable": true,
          "description": "Objeto contendo informações sobre dividendos, JCP e outros eventos corporativos. Retornado apenas se `dividends=true` for especificado na requisição.",
          "has_enum": false
        },
        {
          "name": "summaryProfile",
          "type": "SummaryProfile",
          "required": false,
          "nullable": true,
          "description": "Resumo do perfil da empresa. Retornado apenas se `modules` incluir `summaryProfile`.",
          "has_enum": false
        },
        {
          "name": "balanceSheetHistory",
          "type": "array<BalanceSheetEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **anual** do Balanço Patrimonial. Retornado apenas se `modules` incluir `balanceSheetHistory`.",
          "has_enum": false
        },
        {
          "name": "balanceSheetHistoryQuarterly",
          "type": "array<BalanceSheetEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **trimestral** do Balanço Patrimonial. Retornado apenas se `modules` incluir `balanceSheetHistoryQuarterly`.",
          "has_enum": false
        },
        {
          "name": "defaultKeyStatistics",
          "type": "DefaultKeyStatisticsEntry",
          "required": false,
          "nullable": true,
          "description": "Principais estatísticas financeiras atuais/TTM. Retornado apenas se `modules` incluir `defaultKeyStatistics`.",
          "has_enum": false
        },
        {
          "name": "defaultKeyStatisticsHistory",
          "type": "array<DefaultKeyStatisticsEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **anual** das principais estatísticas. Retornado apenas se `modules` incluir `defaultKeyStatisticsHistory`.",
          "has_enum": false
        },
        {
          "name": "defaultKeyStatisticsHistoryQuarterly",
          "type": "array<DefaultKeyStatisticsEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **trimestral** das principais estatísticas. Retornado apenas se `modules` incluir `defaultKeyStatisticsHistoryQuarterly`.",
          "has_enum": false
        },
        {
          "name": "incomeStatementHistory",
          "type": "array<IncomeStatementEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **anual** da Demonstração do Resultado (DRE). Retornado apenas se `modules` incluir `incomeStatementHistory`.",
          "has_enum": false
        },
        {
          "name": "incomeStatementHistoryQuarterly",
          "type": "array<IncomeStatementEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **trimestral** da Demonstração do Resultado (DRE). Retornado apenas se `modules` incluir `incomeStatementHistoryQuarterly`.",
          "has_enum": false
        },
        {
          "name": "financialData",
          "type": "FinancialDataEntry",
          "required": false,
          "nullable": true,
          "description": "Dados financeiros e indicadores TTM. Retornado apenas se `modules` incluir `financialData`.",
          "has_enum": false
        },
        {
          "name": "financialDataHistory",
          "type": "array<FinancialDataEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **anual** de dados financeiros e indicadores. Retornado apenas se `modules` incluir `financialDataHistory`.",
          "has_enum": false
        },
        {
          "name": "financialDataHistoryQuarterly",
          "type": "array<FinancialDataEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **trimestral** de dados financeiros e indicadores. Retornado apenas se `modules` incluir `financialDataHistoryQuarterly`.",
          "has_enum": false
        },
        {
          "name": "valueAddedHistory",
          "type": "array<ValueAddedEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **anual** da Demonstração do Valor Adicionado (DVA). Retornado apenas se `modules` incluir `valueAddedHistory`.",
          "has_enum": false
        },
        {
          "name": "valueAddedHistoryQuarterly",
          "type": "array<ValueAddedEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **trimestral** da Demonstração do Valor Adicionado (DVA). Retornado apenas se `modules` incluir `valueAddedHistoryQuarterly`.",
          "has_enum": false
        },
        {
          "name": "cashflowHistory",
          "type": "array<CashflowEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **anual** da Demonstração do Fluxo de Caixa (DFC). Retornado apenas se `modules` incluir `cashflowHistory`.",
          "has_enum": false
        },
        {
          "name": "cashflowHistoryQuarterly",
          "type": "array<CashflowEntry>",
          "required": false,
          "nullable": true,
          "description": "Histórico **trimestral** da Demonstração do Fluxo de Caixa (DFC). Retornado apenas se `modules` incluir `cashflowHistoryQuarterly`.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "QuoteResponse",
      "type": "object",
      "description": "Resposta principal do endpoint `/api/quote/{tickers}`.",
      "field_count": 3,
      "total_fields": 3,
      "required_count": 0,
      "fields": [
        {
          "name": "results",
          "type": "array<QuoteResult>",
          "required": false,
          "nullable": false,
          "description": "Array contendo os resultados detalhados para cada ticker solicitado.",
          "has_enum": false
        },
        {
          "name": "requestedAt",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Timestamp indicando quando a requisição foi recebida pelo servidor. Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "took",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Tempo aproximado que o servidor levou para processar a requisição, em formato de string (ex: `746ms`).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CryptoHistoricalData",
      "type": "object",
      "description": "Representa um ponto na série histórica de preços de uma criptomoeda.",
      "field_count": 7,
      "total_fields": 7,
      "required_count": 0,
      "fields": [
        {
          "name": "date",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Data do ponto de dados, representada como um timestamp UNIX.",
          "has_enum": false
        },
        {
          "name": "open",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço de abertura da criptomoeda no intervalo.",
          "has_enum": false
        },
        {
          "name": "high",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço máximo atingido no intervalo.",
          "has_enum": false
        },
        {
          "name": "low",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço mínimo atingido no intervalo.",
          "has_enum": false
        },
        {
          "name": "close",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço de fechamento da criptomoeda no intervalo.",
          "has_enum": false
        },
        {
          "name": "volume",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Volume negociado no intervalo (na criptomoeda ou na moeda de referência, verificar contexto).",
          "has_enum": false
        },
        {
          "name": "adjustedClose",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço de fechamento ajustado (geralmente igual ao `close` para cripto).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CryptoCoin",
      "type": "object",
      "description": "Contém os dados detalhados de uma criptomoeda específica retornada pelo endpoint `/api/v2/crypto`.",
      "field_count": 19,
      "total_fields": 19,
      "required_count": 0,
      "fields": [
        {
          "name": "currency",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Sigla da moeda fiduciária na qual os preços estão cotados (ex: `BRL`, `USD`).",
          "has_enum": false
        },
        {
          "name": "currencyRateFromUSD",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Taxa de câmbio da `currency` em relação ao USD (Dólar Americano). `1 USD = X currency`.",
          "has_enum": false
        },
        {
          "name": "coinName",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Nome completo da criptomoeda (ex: `Bitcoin`, `Ethereum`).",
          "has_enum": false
        },
        {
          "name": "coin",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Sigla (ticker) da criptomoeda (ex: `BTC`, `ETH`).",
          "has_enum": false
        },
        {
          "name": "regularMarketChange",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Variação absoluta do preço nas últimas 24 horas (ou período relevante).",
          "has_enum": false
        },
        {
          "name": "regularMarketPrice",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço atual da criptomoeda na `currency` especificada.",
          "has_enum": false
        },
        {
          "name": "regularMarketChangePercent",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Variação percentual do preço nas últimas 24 horas (ou período relevante).",
          "has_enum": false
        },
        {
          "name": "regularMarketDayLow",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço mínimo nas últimas 24 horas (ou período relevante).",
          "has_enum": false
        },
        {
          "name": "regularMarketDayHigh",
          "type": "number",
          "required": false,
          "nullable": false,
          "description": "Preço máximo nas últimas 24 horas (ou período relevante).",
          "has_enum": false
        },
        {
          "name": "regularMarketDayRange",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "String formatada mostrando o intervalo de preço das últimas 24h (Mínimo - Máximo).",
          "has_enum": false
        },
        {
          "name": "regularMarketVolume",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Volume negociado nas últimas 24 horas (na `currency` especificada).",
          "has_enum": false
        },
        {
          "name": "marketCap",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Capitalização de mercado da criptomoeda na `currency` especificada.",
          "has_enum": false
        },
        {
          "name": "regularMarketTime",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Timestamp da última atualização da cotação. Formato ISO 8601.",
          "has_enum": false
        },
        {
          "name": "coinImageUrl",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "URL da imagem do logo da criptomoeda.",
          "has_enum": false
        },
        {
          "name": "usedInterval",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "O intervalo (`interval`) efetivamente utilizado para os dados históricos, se solicitado.",
          "has_enum": false
        },
        {
          "name": "usedRange",
          "type": "string",
          "required": false,
          "nullable": true,
          "description": "O período (`range`) efetivamente utilizado para os dados históricos, se solicitado.",
          "has_enum": false
        },
        {
          "name": "historicalDataPrice",
          "type": "array<CryptoHistoricalData>",
          "required": false,
          "nullable": true,
          "description": "Array contendo a série histórica de preços, retornado se `range` ou `interval` forem especificados.",
          "has_enum": false
        },
        {
          "name": "validRanges",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista dos valores válidos para o parâmetro `range` nesta criptomoeda.",
          "has_enum": false
        },
        {
          "name": "validIntervals",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista dos valores válidos para o parâmetro `interval` nesta criptomoeda.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CryptoResponse",
      "type": "object",
      "description": "Resposta principal do endpoint `/api/v2/crypto`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "coins",
          "type": "array<CryptoCoin>",
          "required": false,
          "nullable": false,
          "description": "Array contendo os resultados detalhados para cada criptomoeda solicitada.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CryptoAvailableResponse",
      "type": "object",
      "description": "Resposta do endpoint que lista todas as criptomoedas disponíveis.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "coins",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista de siglas (tickers) das criptomoedas disponíveis (ex: `BTC`, `ETH`, `LTC`).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CurrencyAvailableResponse",
      "type": "object",
      "description": "Resposta do endpoint que lista todas as moedas fiduciárias disponíveis.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "currencies",
          "type": "array<object>",
          "required": false,
          "nullable": false,
          "description": "Lista de objetos, cada um contendo o nome de uma moeda fiduciária ou par suportado pela API.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CurrencyQuote",
      "type": "object",
      "description": "Contém os dados detalhados da cotação de um **par de moedas fiduciárias específico**, retornado como um elemento do array `currency` no endpoint `/api/v2/currency`.",
      "field_count": 11,
      "total_fields": 11,
      "required_count": 11,
      "fields": [
        {
          "name": "fromCurrency",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Moeda de Origem:** Sigla da moeda base do par (ex: `USD` em `USD-BRL`).",
          "has_enum": false
        },
        {
          "name": "toCurrency",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Moeda de Destino:** Sigla da moeda de cotação do par (ex: `BRL` em `USD-BRL`).",
          "has_enum": false
        },
        {
          "name": "name",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Nome do Par:** Nome descritivo do par de moedas (ex: `Dólar Americano/Real Brasileiro`).",
          "has_enum": false
        },
        {
          "name": "high",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Máxima:** Preço mais alto atingido pelo par no período recente (geralmente diário). Formato String.",
          "has_enum": false
        },
        {
          "name": "low",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Mínima:** Preço mais baixo atingido pelo par no período recente (geralmente diário). Formato String.",
          "has_enum": false
        },
        {
          "name": "bidVariation",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Variação Absoluta (Bid):** Mudança absoluta no preço de compra (bid) desde o último fechamento ou período de referência. Formato String.",
          "has_enum": false
        },
        {
          "name": "percentageChange",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Variação Percentual:** Mudança percentual no preço do par desde o último fechamento ou período de referência. Formato String.",
          "has_enum": false
        },
        {
          "name": "bidPrice",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Preço de Compra (Bid):** Preço atual pelo qual o mercado está disposto a comprar a moeda de origem (`fromCurrency`) pagando com a moeda de destino (`toCurrency`). Formato String.",
          "has_enum": false
        },
        {
          "name": "askPrice",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Preço de Venda (Ask):** Preço atual pelo qual o mercado está disposto a vender a moeda de origem (`fromCurrency`) recebendo a moeda de destino (`toCurrency`). Formato String.",
          "has_enum": false
        },
        {
          "name": "updatedAtTimestamp",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Timestamp da Atualização:** Data e hora da última atualização da cotação, representada como um **timestamp UNIX** (string contendo o número de segundos desde 1970-01-01 UTC).",
          "has_enum": false
        },
        {
          "name": "updatedAtDate",
          "type": "string",
          "required": true,
          "nullable": false,
          "description": "**Data da Atualização:** Data e hora da última atualização da cotação, formatada de forma legível (`YYYY-MM-DD HH:MM:SS`).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "CurrencyResponse",
      "type": "object",
      "description": "Estrutura da **resposta principal** do endpoint `GET /api/v2/currency`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 1,
      "fields": [
        {
          "name": "currency",
          "type": "array<CurrencyQuote>",
          "required": true,
          "nullable": false,
          "description": "Array contendo os objetos `CurrencyQuote`, um para cada par de moeda válido solicitado no parâmetro `currency`.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "InflationEntry",
      "type": "object",
      "description": "Representa um ponto de dado histórico de inflação para um país.",
      "field_count": 3,
      "total_fields": 3,
      "required_count": 0,
      "fields": [
        {
          "name": "date",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data da medição da inflação, no formato `DD/MM/YYYY`.",
          "has_enum": false
        },
        {
          "name": "value",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Valor do índice de inflação para a data especificada (formato string, pode conter `%` ou ser apenas numérico).",
          "has_enum": false
        },
        {
          "name": "epochDate",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Timestamp UNIX (número de segundos desde 1970-01-01 UTC) correspondente à `date`.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "InflationResponse",
      "type": "object",
      "description": "Resposta principal do endpoint `/api/v2/inflation`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "inflation",
          "type": "array<InflationEntry>",
          "required": false,
          "nullable": false,
          "description": "Array contendo os registros históricos de inflação para o país e período solicitados.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "InflationAvailableResponse",
      "type": "object",
      "description": "Resposta do endpoint que lista os países com dados de inflação disponíveis.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "countries",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista de nomes de países (em minúsculas) para os quais há dados de inflação disponíveis (ex: `brazil`, `usa`, `argentina`).",
          "has_enum": false
        }
      ]
    },
    {
      "name": "PrimeRateEntry",
      "type": "object",
      "description": "Representa um registro individual de taxa básica de juros (SELIC) para uma data específica.",
      "field_count": 3,
      "total_fields": 3,
      "required_count": 0,
      "fields": [
        {
          "name": "date",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Data do registro no formato DD/MM/YYYY.",
          "has_enum": false
        },
        {
          "name": "value",
          "type": "string",
          "required": false,
          "nullable": false,
          "description": "Valor da taxa básica de juros (SELIC) para a data correspondente.",
          "has_enum": false
        },
        {
          "name": "epochDate",
          "type": "integer",
          "required": false,
          "nullable": false,
          "description": "Timestamp em milissegundos (formato epoch) correspondente à data do registro.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "PrimeRateResponse",
      "type": "object",
      "description": "Resposta principal do endpoint `/api/v2/prime-rate`.",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "prime-rate",
          "type": "array<PrimeRateEntry>",
          "required": false,
          "nullable": false,
          "description": "Array contendo os registros históricos de taxa básica de juros (SELIC) para o país e período solicitados.",
          "has_enum": false
        }
      ]
    },
    {
      "name": "PrimeRateAvailableResponse",
      "type": "object",
      "description": "Resposta do endpoint `/api/v2/prime-rate/available` que lista os países disponíveis para consulta de taxa básica de juros (SELIC).",
      "field_count": 1,
      "total_fields": 1,
      "required_count": 0,
      "fields": [
        {
          "name": "countries",
          "type": "array<string>",
          "required": false,
          "nullable": false,
          "description": "Lista de países com dados de taxa básica de juros (SELIC) disponíveis para consulta.",
          "has_enum": false
        }
      ]
    }
  ],
  "enums": [
    {
      "name": "StockSummary.type",
      "location": "StockSummary → type",
      "values": [
        "stock",
        "fund",
        "bdr"
      ],
      "description": "Tipo do ativo: `stock` (Ação), `fund` (Fundo Imobiliário/FII), `bdr` (Brazilian Depositary Receipt)."
    },
    {
      "name": "QuoteListResponse.availableStockTypes[]",
      "location": "QuoteListResponse → availableStockTypes (array)",
      "values": [
        "stock",
        "fund",
        "bdr"
      ],
      "description": "Lista dos tipos de ativos (`stock`, `fund`, `bdr`) disponíveis que podem ser usados no parâmetro de filtro `type`."
    },
    {
      "name": "BalanceSheetEntry.type",
      "location": "BalanceSheetEntry → type",
      "values": [
        "yearly",
        "quarterly"
      ],
      "description": "Indica a periodicidade do balanço: `yearly` (anual) ou `quarterly` (trimestral)."
    },
    {
      "name": "DefaultKeyStatisticsEntry.type",
      "location": "DefaultKeyStatisticsEntry → type",
      "values": [
        "yearly",
        "quarterly",
        "ttm"
      ],
      "description": "Periodicidade dos dados: `yearly` (anual), `quarterly` (trimestral), `ttm` (Trailing Twelve Months - últimos 12 meses)."
    },
    {
      "name": "IncomeStatementEntry.type",
      "location": "IncomeStatementEntry → type",
      "values": [
        "yearly",
        "quarterly"
      ],
      "description": "Indica a periodicidade da DRE: `yearly` (anual) ou `quarterly` (trimestral)."
    },
    {
      "name": "FinancialDataEntry.type",
      "location": "FinancialDataEntry → type",
      "values": [
        "yearly",
        "quarterly",
        "ttm"
      ],
      "description": "Periodicidade dos dados: `yearly` (anual), `quarterly` (trimestral), `ttm` (Trailing Twelve Months)."
    },
    {
      "name": "ValueAddedEntry.type",
      "location": "ValueAddedEntry → type",
      "values": [
        "yearly",
        "quarterly"
      ],
      "description": "Indica a periodicidade da DVA: `yearly` (anual) ou `quarterly` (trimestral)."
    },
    {
      "name": "CashflowEntry.type",
      "location": "CashflowEntry → type",
      "values": [
        "yearly",
        "quarterly"
      ],
      "description": "Indica a periodicidade da DFC: `yearly` (anual) ou `quarterly` (trimestral)."
    }
  ]
}