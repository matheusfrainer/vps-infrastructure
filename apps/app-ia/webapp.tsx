import { useState, useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown, Send, Loader2, Trash2, FileText, X, Copy, Check, ChevronRight, ChevronDown, ChevronLeft, LayoutDashboard, PieChart, Scale, Settings, HelpCircle } from 'lucide-react';

// ============================================================================
// DATA
// ============================================================================

const RAW_DATA = [
  { ticker: "CASH", nome: "Saldo em Conta (USD)", classe: "Cash", setor: "-", aplicado: 32141.24, resultado: 0.00, posicao: 32141.24, ref: "L" },
  { ticker: "L5782A875", nome: "JP Morgan Global High Yield Bond (A)", classe: "Mutual Fund", setor: "Renda Fixa", aplicado: 37500.00, resultado: 820.21, posicao: 38320.21, ref: "L" },
  { ticker: "TFLO", nome: "iShares Treasury Floating Rate Bond ETF", classe: "ETF", setor: "Renda Fixa", aplicado: 40627.45, resultado: -275.45, posicao: 40352.00, ref: "L" },
  { ticker: "COIN", nome: "Coinbase Global Inc", classe: "Ação", setor: "Tecnologia", aplicado: 1863.14, resultado: 542.44, posicao: 2405.58, ref: "L" },
  { ticker: "ETHE", nome: "Grayscale Ethereum Trust ETF", classe: "ETF", setor: "Cripto", aplicado: 12193.66, resultado: -3884.97, posicao: 8308.69, ref: "L" },
  { ticker: "XOM", nome: "Exxon Mobil Corp", classe: "Ação", setor: "Energia", aplicado: 5409.68, resultado: 1018.25, posicao: 6427.93, ref: "L" },
  { ticker: "MSFT", nome: "Microsoft Corporation", classe: "Ação", setor: "Tecnologia", aplicado: 4721.75, resultado: 1196.44, posicao: 5918.19, ref: "L" },
  { ticker: "TSLA", nome: "Tesla Inc", classe: "Ação", setor: "Consumo", aplicado: 1977.44, resultado: 1758.19, posicao: 3735.63, ref: "L" },
  { ticker: "PLD", nome: "Prologis Inc", classe: "REIT", setor: "Imobiliário", aplicado: 1713.82, resultado: 597.17, posicao: 2310.99, ref: "L" },
  { ticker: "ARGT", nome: "Global X MSCI Argentina ETF", classe: "ETF", setor: "Emergentes", aplicado: 2638.12, resultado: 412.71, posicao: 3050.83, ref: "L" },
  { ticker: "GLD", nome: "SPDR Gold Trust", classe: "ETF", setor: "Commodities", aplicado: 2255.68, resultado: 818.84, posicao: 3074.52, ref: "L" },
  { ticker: "GOOGL", nome: "Alphabet Inc", classe: "Ação", setor: "Tecnologia", aplicado: 5455.71, resultado: 4364.35, posicao: 9820.06, ref: "L" },
  { ticker: "STAG", nome: "STAG Industrial Inc", classe: "REIT", setor: "Imobiliário", aplicado: 1704.38, resultado: 331.58, posicao: 2035.96, ref: "L" },
  { ticker: "ECH", nome: "iShares MSCI Chile ETF", classe: "ETF", setor: "Emergentes", aplicado: 1055.25, resultado: 437.89, posicao: 1493.14, ref: "L" },
  { ticker: "JPM", nome: "JPMorgan Chase & Co", classe: "Ação", setor: "Financeiro", aplicado: 5024.97, resultado: 1891.40, posicao: 6916.37, ref: "L" },
  { ticker: "BRK/B", nome: "Berkshire Hathaway Inc Class B", classe: "Ação", setor: "Financeiro", aplicado: 11464.18, resultado: -99.00, posicao: 11365.18, ref: "L" },
  { ticker: "LAES", nome: "SEALSQ Corp", classe: "Ação", setor: "Tecnologia", aplicado: 1914.28, resultado: 213.32, posicao: 2127.60, ref: "L" },
  { ticker: "CASH", nome: "Saldo em Conta (USD)", classe: "Cash", setor: "-", aplicado: 40489.47, resultado: 0.00, posicao: 40489.47, ref: "A" },
  { ticker: "L5782A875", nome: "JP Morgan Global High Yield Bond (A)", classe: "Mutual Fund", setor: "Renda Fixa", aplicado: 60000.00, resultado: 1312.38, posicao: 61312.38, ref: "A" },
  { ticker: "TFLO", nome: "iShares Treasury Floating Rate Bond ETF", classe: "ETF", setor: "Renda Fixa", aplicado: 38119.71, resultado: -289.71, posicao: 37830.00, ref: "A" },
  { ticker: "BRK/B", nome: "Berkshire Hathaway Inc Class B", classe: "Ação", setor: "Financeiro", aplicado: 18593.35, resultado: -66.89, posicao: 18526.46, ref: "A" },
  { ticker: "GOOGL", nome: "Alphabet Inc", classe: "Ação", setor: "Tecnologia", aplicado: 9346.50, resultado: 7903.35, posicao: 17249.85, ref: "A" },
  { ticker: "ETHE", nome: "Grayscale Ethereum Trust ETF", classe: "ETF", setor: "Cripto", aplicado: 25125.05, resultado: -8062.78, posicao: 17062.27, ref: "A" },
  { ticker: "ARGT", nome: "Global X MSCI Argentina ETF", classe: "ETF", setor: "Emergentes", aplicado: 12525.31, resultado: 1809.85, posicao: 14335.16, ref: "A" },
  { ticker: "JPM", nome: "JPMorgan Chase & Co", classe: "Ação", setor: "Financeiro", aplicado: 8679.35, resultado: 3279.79, posicao: 11959.14, ref: "A" },
  { ticker: "XOM", nome: "Exxon Mobil Corp", classe: "Ação", setor: "Energia", aplicado: 9359.49, resultado: 1760.32, posicao: 11119.81, ref: "A" },
  { ticker: "MSFT", nome: "Microsoft Corporation", classe: "Ação", setor: "Tecnologia", aplicado: 8136.27, resultado: 2112.57, posicao: 10248.84, ref: "A" },
  { ticker: "GLD", nome: "SPDR Gold Trust", classe: "ETF", setor: "Commodities", aplicado: 6885.02, resultado: 3302.99, posicao: 10188.01, ref: "A" },
  { ticker: "TSLA", nome: "Tesla Inc", classe: "Ação", setor: "Consumo", aplicado: 3426.99, resultado: 3006.84, posicao: 6433.83, ref: "A" },
  { ticker: "COIN", nome: "Coinbase Global Inc", classe: "Ação", setor: "Tecnologia", aplicado: 3173.47, resultado: 948.87, posicao: 4122.34, ref: "A" },
  { ticker: "PLD", nome: "Prologis Inc", classe: "REIT", setor: "Imobiliário", aplicado: 2829.73, resultado: 1021.97, posicao: 3851.70, ref: "A" },
  { ticker: "LAES", nome: "SEALSQ Corp", classe: "Ação", setor: "Tecnologia", aplicado: 3129.93, resultado: 337.27, posicao: 3467.20, ref: "A" },
  { ticker: "STAG", nome: "STAG Industrial Inc", classe: "REIT", setor: "Imobiliário", aplicado: 2859.87, resultado: 592.29, posicao: 3452.16, ref: "A" },
  { ticker: "ECH", nome: "iShares MSCI Chile ETF", classe: "ETF", setor: "Emergentes", aplicado: 1814.05, resultado: 767.34, posicao: 2581.39, ref: "A" },
];

const RISK_ORDER = {
  "Cash|-": 1, "Mutual Fund|Renda Fixa": 2, "ETF|Renda Fixa": 3, "ETF|Commodities": 4,
  "REIT|Imobiliário": 5, "Ação|Financeiro": 6, "Ação|Energia": 7, "Ação|Consumo": 8,
  "Ação|Tecnologia": 9, "ETF|Emergentes": 10, "ETF|Cripto": 11
};

const CLASSE_ORDER = ['Cash', 'Mutual Fund', 'ETF', 'REIT', 'Ação'];

const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'portfolio', icon: PieChart, label: 'Portfólio' },
  { id: 'balance', icon: Scale, label: 'Balanceamento' },
  { id: 'settings', icon: Settings, label: 'Configurações' },
  { id: 'help', icon: HelpCircle, label: 'Ajuda' },
];

// ============================================================================
// UTILITIES
// ============================================================================

const fmt = (value, decimals = 2) => value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const getRiskLevel = (r) => {
  if (r.ticker === "LAES" || r.ticker === "COIN") return 10;
  if (r.ticker === "GOOGL" || r.ticker === "MSFT") return 7;
  if (r.ticker === "ARGT" || r.ticker === "ECH" || r.ticker === "ETHE") return 9;
  return RISK_ORDER[`${r.classe}|${r.setor}`] || 99;
};

const consolidate = (items) => {
  const map = {};
  items.forEach(r => {
    if (!map[r.ticker]) map[r.ticker] = { ...r, aplicado: 0, resultado: 0, posicao: 0 };
    map[r.ticker].aplicado += r.aplicado;
    map[r.ticker].resultado += r.resultado;
    map[r.ticker].posicao += r.posicao;
  });
  return Object.values(map).map(r => ({ ...r, rent: r.aplicado > 0 ? ((r.posicao - r.aplicado) / r.aplicado * 100) : 0, riskLevel: getRiskLevel(r) }));
};

const addRent = (items) => items.map(r => ({ ...r, rent: r.aplicado > 0 ? ((r.posicao - r.aplicado) / r.aplicado * 100) : 0, riskLevel: getRiskLevel(r) }));

const calculateTotals = (data) => data.reduce((acc, r) => ({ aplicado: acc.aplicado + r.aplicado, resultado: acc.resultado + r.resultado, posicao: acc.posicao + r.posicao }), { aplicado: 0, resultado: 0, posicao: 0 });

const getFilteredTotal = (filter) => {
  const items = filter === 'all' ? consolidate(RAW_DATA) : addRent(RAW_DATA.filter(r => r.ref === filter));
  return items.reduce((acc, r) => acc + r.posicao, 0);
};

const adjustRebalanceData = (original, targetFilter) => {
  if (!original.data.length || !original.total) return [];
  const targetTotal = getFilteredTotal(targetFilter);
  const ratio = targetTotal / original.total;
  return original.data.map(op => ({ ...op, valor: Math.round(op.valor * ratio * 100) / 100 }));
};

const formatMarkdownText = (text) => {
  const cleanText = text.replace(/```json[\s\S]*?```/g, '');
  return cleanText.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-sm font-semibold mt-3 mb-1">{line.slice(3)}</h2>;
    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm text-neutral-600 dark:text-neutral-400" dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return <p key={i} className="text-sm text-neutral-600 dark:text-neutral-400" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
  });
};



// ============================================================================
// SHADCN/UI COMPONENTS
// ============================================================================

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "border-transparent bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900",
    secondary: "border-transparent bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
    outline: "border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50"
  };
  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${variants[variant]}`}>{children}</span>;
};

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
    ghost: "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
    outline: "border border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800"
  };
  const sizes = { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs", lg: "h-10 rounded-md px-8", icon: "h-9 w-9" };
  return <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const Progress = ({ value, className = "" }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-neutral-900/20 dark:bg-neutral-50/20 ${className}`}>
    <div className="h-full bg-neutral-900 dark:bg-neutral-50 transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

// ============================================================================
// TABLE COMPONENTS
// ============================================================================

const Table = ({ children, className = "" }) => <div className="relative w-full overflow-auto"><table className={`w-full caption-bottom text-sm ${className}`}>{children}</table></div>;
const TableHeader = ({ children }) => <thead className="[&_tr]:border-b">{children}</thead>;
const TableBody = ({ children }) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;
const TableFooter = ({ children }) => <tfoot className="border-t bg-neutral-100/50 font-medium dark:bg-neutral-800/50 [&>tr]:last:border-b-0">{children}</tfoot>;
const TableRow = ({ children, className = "", ...props }) => <tr className={`border-b border-neutral-200 dark:border-neutral-800 transition-colors hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 ${className}`} {...props}>{children}</tr>;
const TableHead = ({ children, className = "" }) => <th className={`h-10 px-3 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400 ${className}`}>{children}</th>;
const TableCell = ({ children, className = "" }) => <td className={`p-3 align-middle ${className}`}>{children}</td>;

// ============================================================================
// TABS COMPONENTS
// ============================================================================

const TabsList = ({ children }) => <div className="inline-flex h-9 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">{children}</div>;
const TabsTrigger = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${active ? 'bg-white text-neutral-950 shadow dark:bg-neutral-950 dark:text-neutral-50' : 'hover:text-neutral-950 dark:hover:text-neutral-50'}`}>{children}</button>
);

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

const Sidebar = ({ expanded, onToggle, activeItem, onItemClick }) => (
  <aside className={`fixed left-0 top-0 z-40 h-screen border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 transition-all duration-300 ${expanded ? 'w-56' : 'w-14'}`}>
    <div className="flex h-full flex-col">
      <div className={`flex h-14 items-center border-b border-neutral-200 dark:border-neutral-800 ${expanded ? 'justify-between px-4' : 'justify-center'}`}>
        {expanded && <span className="text-sm font-semibold tracking-tight">AssessorIA</span>}
        <button onClick={onToggle} className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 transition-colors">
          <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => onItemClick(item.id)} title={!expanded ? item.label : undefined}
              className={`flex w-full items-center rounded-md transition-colors ${expanded ? 'px-3 py-2' : 'justify-center p-2'} ${activeItem === item.id ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50'}`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              {expanded && <span className="ml-3 text-sm font-medium truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className={`border-t border-neutral-200 dark:border-neutral-800 p-2 ${expanded ? 'px-3' : ''}`}>
        <div className={`flex items-center ${expanded ? 'gap-3' : 'justify-center'}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-xs font-medium">MF</div>
          {expanded && <div className="flex-1 truncate"><p className="text-sm font-medium truncate">Frainer</p><p className="text-xs text-neutral-500 truncate">Assessor</p></div>}
        </div>
      </div>
    </div>
  </aside>
);

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

const SummaryCards = ({ totals, rentTotal }) => (
  <section className="grid grid-cols-4 gap-4">
    <Card className="p-4">
      <p className="text-xs font-medium text-neutral-500 mb-1">Aplicado</p>
      <p className="text-lg font-semibold tabular-nums">${fmt(totals.aplicado)}</p>
    </Card>
    <Card className="p-4">
      <p className="text-xs font-medium text-neutral-500 mb-1">Posição</p>
      <p className="text-lg font-semibold tabular-nums">${fmt(totals.posicao)}</p>
    </Card>
    <Card className="p-4">
      <p className="text-xs font-medium text-neutral-500 mb-1">Resultado</p>
      <p className={`text-lg font-semibold tabular-nums flex items-center gap-1 ${totals.resultado >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
        {totals.resultado >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {totals.resultado >= 0 ? '+' : ''}${fmt(totals.resultado)}
      </p>
    </Card>
    <Card className="p-4">
      <p className="text-xs font-medium text-neutral-500 mb-1">Rentabilidade</p>
      <p className={`text-lg font-semibold tabular-nums ${rentTotal >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
        {rentTotal >= 0 ? '+' : ''}{fmt(rentTotal)}%
      </p>
    </Card>
  </section>
);

const FilterTabs = ({ filterTab, setFilterTab }) => (
  <TabsList>
    <TabsTrigger active={filterTab === 'all'} onClick={() => setFilterTab('all')}>Consolidado</TabsTrigger>
    <TabsTrigger active={filterTab === 'L'} onClick={() => setFilterTab('L')}>L</TabsTrigger>
    <TabsTrigger active={filterTab === 'A'} onClick={() => setFilterTab('A')}>A</TabsTrigger>
  </TabsList>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Portfolio() {
  // State - Sidebar
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState('portfolio');
  
  // State - Filters
  const [filterTab, setFilterTab] = useState('all');
  const [expandedClasses, setExpandedClasses] = useState([]);

  // State - Chat
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // State - Rebalance
  const [rebalanceData, setRebalanceData] = useState([]);
  const [originalRebalance, setOriginalRebalance] = useState({ data: [], total: 0 });

  // State - Report
  const [showReport, setShowReport] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);

  // Derived Data
  const getData = () => filterTab === 'all' ? consolidate(RAW_DATA) : addRent(RAW_DATA.filter(r => r.ref === filterTab));
  const data = getData();
  const sorted = [...data].sort((a, b) => a.riskLevel - b.riskLevel);
  const totals = calculateTotals(data);
  const rentTotal = totals.aplicado > 0 ? ((totals.posicao - totals.aplicado) / totals.aplicado * 100) : 0;

  const groupedByClasse = CLASSE_ORDER.map(classe => {
    const items = sorted.filter(r => r.classe === classe);
    const totClasse = calculateTotals(items);
    const rentClasse = totClasse.aplicado > 0 ? ((totClasse.posicao - totClasse.aplicado) / totClasse.aplicado * 100) : 0;
    return { classe, items, ...totClasse, rent: rentClasse, pct: totals.posicao > 0 ? (totClasse.posicao / totals.posicao * 100) : 0 };
  }).filter(g => g.items.length > 0);

  const compras = rebalanceData.filter(op => op.acao === 'comprar').reduce((sum, op) => sum + op.valor, 0);
  const vendas = rebalanceData.filter(op => op.acao === 'vender').reduce((sum, op) => sum + op.valor, 0);

  // Effects
  useEffect(() => {
    if (originalRebalance.data.length > 0) {
      setRebalanceData(adjustRebalanceData(originalRebalance, filterTab));
    }
  }, [filterTab, originalRebalance]);

  // Handlers
  const toggleClasse = (classe) => setExpandedClasses(prev => prev.includes(classe) ? prev.filter(c => c !== classe) : [...prev, classe]);
  const expandAll = () => setExpandedClasses(groupedByClasse.map(g => g.classe));
  const collapseAll = () => setExpandedClasses([]);

  const clearChat = () => {
    setMessages([]);
    setRebalanceData([]);
    setOriginalRebalance({ data: [], total: 0 });
    setReportContent('');
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const portfolioSummary = data.map(r => `${r.ticker}: ${fmt(r.posicao)} (${(r.posicao / totals.posicao * 100).toFixed(1)}%, ${r.classe}, ${r.setor})`).join('\n');
    const systemPrompt = `Você é um assessor de investimentos experiente. Analise o portfólio e sugira rebalanceamentos.

Portfólio atual (${fmt(totals.posicao)}):
${portfolioSummary}

Regras:
1. Responda em português, de forma objetiva e profissional
2. Ao sugerir operações, SEMPRE inclua um bloco JSON no formato:
\`\`\`json
[{"ticker":"SYMBOL","acao":"comprar"|"vender","valor":1000,"motivo":"Razão da operação"}]
\`\`\`
3. Seja específico com valores e tickers reais do portfólio
4. Considere o perfil de risco mencionado pelo cliente`;

    try {
      // Usa o proxy local que gerencia OAuth do Claude Desktop
      const response = await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [...messages, { role: 'user', content: userMsg }].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Erro na API');
      }
      
      const text = result.content?.map(c => c.text || '').join('') || 'Erro ao processar resposta.';
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);

      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const ops = JSON.parse(jsonMatch[1]);
          const total = getFilteredTotal('all');
          setOriginalRebalance({ data: ops, total });
          setRebalanceData(adjustRebalanceData({ data: ops, total }, filterTab));
        } catch {}
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro de conexão com a IA';
      setMessages(prev => [...prev, { role: 'assistant', content: `Erro: ${errorMsg}. Verifique se o proxy está rodando.` }]);
    }
    setLoading(false);
  };

  const generateReport = async () => {
    if (messages.length === 0) return;
    setReportLoading(true);
    setShowReport(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const opsText = rebalanceData.map(op => `- ${op.acao.toUpperCase()} ${op.ticker}: $${fmt(op.valor)} — ${op.motivo}`).join('\n');
    setReportContent(`## Relatório de Rebalanceamento\n\n**Portfólio Total:** $${fmt(totals.posicao)}\n**Rentabilidade:** ${fmt(rentTotal)}%\n\n## Operações Sugeridas\n\n${opsText || 'Nenhuma operação sugerida.'}\n\n## Resumo Financeiro\n\n- Compras: $${fmt(compras)}\n- Vendas: $${fmt(vendas)}\n- Saldo: $${fmt(compras - vendas)}`);
    setReportLoading(false);
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Page Title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'portfolio': return 'Portfólio';
      case 'balance': return 'Balanceamento';
      case 'settings': return 'Configurações';
      case 'help': return 'Ajuda';
      default: return 'AssessorIA';
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(prev => !prev)} activeItem={currentPage} onItemClick={setCurrentPage} />

      <div className={`transition-all duration-300 ${sidebarExpanded ? 'ml-56' : 'ml-14'}`}>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>
              <p className="text-sm text-neutral-500">{data.length} ativos • USD</p>
            </div>
            <FilterTabs filterTab={filterTab} setFilterTab={setFilterTab} />
          </header>

          {/* Summary Cards */}
          <SummaryCards totals={totals} rentTotal={rentTotal} />

          {/* Portfolio Page */}
          {currentPage === 'portfolio' && (
            <Card>
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-base font-semibold tracking-tight">Composição da Carteira</h2>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={expandAll}>Expandir</Button>
                  <Button variant="ghost" size="sm" onClick={collapseAll}>Recolher</Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableHead className="w-8"></TableHead>
                    <TableHead className="w-[40%]">Classe / Ativo</TableHead>
                    <TableHead className="w-24">Setor</TableHead>
                    <TableHead className="w-28">Aplicado</TableHead>
                    <TableHead className="w-20">Rent %</TableHead>
                    <TableHead className="w-28">Resultado</TableHead>
                    <TableHead className="w-28">Posição</TableHead>
                    <TableHead className="w-32">Peso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedByClasse.map((grupo) => (
                    <>
                      <TableRow key={grupo.classe} onClick={() => toggleClasse(grupo.classe)} className="cursor-pointer bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <TableCell className="py-3">{expandedClasses.includes(grupo.classe) ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}</TableCell>
                        <TableCell className="py-3 font-semibold">{grupo.classe}</TableCell>
                        <TableCell className="py-3 text-neutral-400">—</TableCell>
                        <TableCell className="py-3 tabular-nums font-medium">${fmt(grupo.aplicado)}</TableCell>
                        <TableCell className={`py-3 tabular-nums font-medium ${grupo.rent >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>{grupo.rent >= 0 ? '+' : ''}{fmt(grupo.rent)}%</TableCell>
                        <TableCell className={`py-3 tabular-nums font-medium ${grupo.resultado >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>{grupo.resultado >= 0 ? '+' : ''}${fmt(grupo.resultado)}</TableCell>
                        <TableCell className="py-3 tabular-nums font-semibold">${fmt(grupo.posicao)}</TableCell>
                        <TableCell className="py-3"><div className="flex items-center gap-2"><Progress value={grupo.pct} className="w-16 h-1.5" /><span className="text-xs tabular-nums text-neutral-500">{fmt(grupo.pct, 1)}%</span></div></TableCell>
                      </TableRow>
                      {expandedClasses.includes(grupo.classe) && grupo.items.map((r) => (
                        <TableRow key={r.ticker + r.ref + grupo.classe}>
                          <TableCell></TableCell>
                          <TableCell className="pl-10"><span className="font-medium">{r.ticker}</span><span className="ml-2 text-neutral-500 text-xs">{r.nome}</span></TableCell>
                          <TableCell><Badge variant="secondary">{r.setor}</Badge></TableCell>
                          <TableCell className="tabular-nums text-neutral-500">${fmt(r.aplicado)}</TableCell>
                          <TableCell className={`tabular-nums ${r.rent >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>{r.rent >= 0 ? '+' : ''}{fmt(r.rent)}%</TableCell>
                          <TableCell className={`tabular-nums ${r.resultado >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>{r.resultado >= 0 ? '+' : ''}${fmt(r.resultado)}</TableCell>
                          <TableCell className="tabular-nums">${fmt(r.posicao)}</TableCell>
                          <TableCell><div className="flex items-center gap-2"><Progress value={r.posicao / totals.posicao * 100} className="w-16 h-1.5" /><span className="text-xs tabular-nums text-neutral-500">{fmt(r.posicao / totals.posicao * 100, 1)}%</span></div></TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="font-semibold">TOTAL</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="tabular-nums font-semibold">${fmt(totals.aplicado)}</TableCell>
                    <TableCell className={`tabular-nums font-semibold ${rentTotal >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>{rentTotal >= 0 ? '+' : ''}{fmt(rentTotal)}%</TableCell>
                    <TableCell className={`tabular-nums font-semibold ${totals.resultado >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>{totals.resultado >= 0 ? '+' : ''}${fmt(totals.resultado)}</TableCell>
                    <TableCell className="tabular-nums font-semibold">${fmt(totals.posicao)}</TableCell>
                    <TableCell className="tabular-nums font-semibold">100%</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Card>
          )}

          {/* Balanceamento Page */}
          {currentPage === 'balance' && (
            <section className="grid grid-cols-2 gap-4">
              {/* Chat Card */}
              <Card className="flex flex-col h-[calc(100dvh-220px)] overflow-hidden">
                <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold">Chat de Rebalanceamento</h3>
                  {messages.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={generateReport}><FileText className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={clearChat}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && <p className="text-sm text-neutral-500">Descreva sua estratégia de rebalanceamento. Exemplos: "Vender REIT", "Reduzir cripto", "Perfil conservador".</p>}
                  {messages.map((m, i) => (
                    <div key={i} className={`text-sm p-3 rounded-lg ${m.role === 'user' ? 'bg-neutral-100 dark:bg-neutral-800 ml-8' : 'bg-neutral-50 dark:bg-neutral-900 mr-4 border border-neutral-200 dark:border-neutral-800'}`}>
                      {m.role === 'user' ? <p>{m.content}</p> : <div className="space-y-1">{formatMarkdownText(m.content)}</div>}
                    </div>
                  ))}
                  {loading && <div className="flex items-center gap-2 text-neutral-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Analisando portfólio...</div>}
                </div>
                <div className="shrink-0 p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                  <input ref={inputRef} type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }} placeholder="Digite sua diretriz..." className="flex-1 h-9 rounded-md border border-neutral-200 bg-transparent px-3 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300" />
                  <Button onClick={sendMessage} disabled={loading}><Send className="w-4 h-4" /></Button>
                </div>
              </Card>

              {/* Operations Card */}
              <Card className="flex flex-col max-h-[calc(100dvh-220px)] overflow-hidden">
                <div className="shrink-0 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold">Operações Sugeridas</h3>
                </div>
                <div className="min-h-0 overflow-y-auto p-4">
                  {rebalanceData.length === 0 ? <p className="text-sm text-neutral-500">As sugestões aparecerão aqui após análise.</p> : (
                    <>
                      <Table>
                        <TableHeader><TableRow><TableHead>Ticker</TableHead><TableHead>Ação</TableHead><TableHead>Valor</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {rebalanceData.map((op, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{op.ticker}</TableCell>
                              <TableCell><Badge variant={op.acao === 'comprar' ? 'default' : 'secondary'}>{op.acao}</Badge></TableCell>
                              <TableCell className="tabular-nums">${fmt(op.valor)}</TableCell>
                              <TableCell className="text-neutral-500 text-xs">{op.motivo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-4 text-sm">
                        <div><p className="text-neutral-500 text-xs mb-1">Compras</p><p className="font-medium text-emerald-600 dark:text-emerald-500">+${fmt(compras)}</p></div>
                        <div><p className="text-neutral-500 text-xs mb-1">Vendas</p><p className="font-medium text-red-600 dark:text-red-500">-${fmt(vendas)}</p></div>
                        <div><p className="text-neutral-500 text-xs mb-1">Saldo</p><p className={`font-medium ${compras - vendas >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>{compras - vendas >= 0 ? '+' : ''}{fmt(compras - vendas)}</p></div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </section>
          )}

          {/* Other Pages Placeholder */}
          {(currentPage === 'dashboard' || currentPage === 'settings' || currentPage === 'help') && (
            <Card className="p-8 text-center">
              <p className="text-neutral-500">Página "{getPageTitle()}" em desenvolvimento.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold">Relatório de Rebalanceamento</h2>
              <div className="flex items-center gap-1">
                {reportContent && !reportLoading && <Button variant="ghost" size="sm" onClick={copyReport}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copiado' : 'Copiar'}</Button>}
                <Button variant="ghost" size="icon" onClick={() => setShowReport(false)}><X className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {reportLoading ? <div className="flex items-center justify-center h-full gap-2 text-neutral-500"><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</div> : <div className="space-y-1">{formatMarkdownText(reportContent)}</div>}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
