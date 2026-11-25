"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Logo from "@/app/components/Logo";

type Product = {
  id: number; name: string; description: string; imageSrc: string; price: number;
  Emphasis: boolean; colors: string[]; category: string;
};
type AdminUser = { id: number; name: string; email: string; photoURL: string | null };
type CheckoutAttempt = {
  attemptId: string; paymentId: string | null; merchantReference: string; amount: number;
  currency: string; status: string; errorCode: string | null; createdAt: string;
  items: Array<{ name: string; quantity: number }>;
};
type Overview = {
  totals: { users: number; products: number; purchases: number; attempts: number; failedAttempts: number; pendingAttempts: number; views: number; revenue: number };
  dailyViews: Array<{ date: string; label: string; views: number }>;
  popularProducts: Array<{ productId: number | null; productName: string; views: number }>;
  recentAttempts: CheckoutAttempt[];
};
type ProductDraft = Omit<Product, "id">;

const emptyProduct: ProductDraft = {
  name: "", description: "", imageSrc: "", price: 0, Emphasis: false, colors: [], category: "",
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store", headers: { "Content-Type": "application/json", ...init?.headers } });
  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) throw new Error(body?.message ?? "Não foi possível concluir o pedido.");
  return body as T;
}

const money = (value: number) => `${Number(value || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
const shortDate = (value: string) => new Intl.DateTimeFormat("pt-AO", { dateStyle: "medium" }).format(new Date(value));

export default function ManagementDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "users">("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [productDraft, setProductDraft] = useState<ProductDraft | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const loadOverview = useCallback(async () => setOverview(await api<Overview>("/api/admin/overview")), []);
  const loadProducts = useCallback(async () => setProducts((await api<{ products: Product[] }>("/api/admin/products")).products), []);
  const loadUsers = useCallback(async () => setUsers((await api<{ users: AdminUser[] }>("/api/admin/users")).users), []);

  const loadTab = useCallback(async (tab: typeof activeTab) => {
    setLoading(true);
    setError("");
    try {
      if (tab === "overview") await loadOverview();
      if (tab === "products") await loadProducts();
      if (tab === "users") await loadUsers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [loadOverview, loadProducts, loadUsers]);

  useEffect(() => {
    api<{ authenticated: boolean }>("/api/admin/session")
      .then(({ authenticated: isAuthenticated }) => {
        setAuthenticated(isAuthenticated);
        if (isAuthenticated) void loadTab("overview");
      })
      .catch(() => setAuthenticated(false));
  }, [loadTab]);

  const filteredProducts = useMemo(() => products.filter(product =>
    `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const filteredUsers = useMemo(() => users.filter(user =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())), [users, search]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    try {
      await api("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setAuthenticated(true);
      setPassword("");
      await loadTab("overview");
    } catch (reason) {
      setLoginError(reason instanceof Error ? reason.message : "Não foi possível iniciar sessão.");
    }
  }

  async function signOut() {
    await api("/api/admin/session", { method: "DELETE" }).catch(() => undefined);
    setAuthenticated(false);
    setOverview(null);
    setProducts([]);
    setUsers([]);
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!productDraft) return;
    setError("");
    try {
      const url = editingProductId ? `/api/admin/products/${editingProductId}` : "/api/admin/products";
      await api(url, { method: editingProductId ? "PATCH" : "POST", body: JSON.stringify(productDraft) });
      setProductDraft(null);
      setEditingProductId(null);
      await Promise.all([loadProducts(), loadOverview()]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível guardar o produto.");
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Remover o produto “${product.name}”?`)) return;
    try {
      await api(`/api/admin/products/${product.id}`, { method: "DELETE" });
      await Promise.all([loadProducts(), loadOverview()]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível remover o produto.");
    }
  }

  async function saveUser(event: FormEvent) {
    event.preventDefault();
    if (!editingUser) return;
    try {
      await api(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH", body: JSON.stringify({ name: editingUser.name, email: editingUser.email }),
      });
      setEditingUser(null);
      await Promise.all([loadUsers(), loadOverview()]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível atualizar o utilizador.");
    }
  }

  async function deleteUser(user: AdminUser) {
    if (!window.confirm(`Remover a conta de ${user.name}? Esta ação não pode ser desfeita.`)) return;
    try {
      await api(`/api/admin/users/${user.id}`, { method: "DELETE" });
      await Promise.all([loadUsers(), loadOverview()]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível remover o utilizador.");
    }
  }

  if (authenticated === null) return <div className="grid min-h-screen w-full place-items-center bg-base-soft text-main-regular">A verificar sessão…</div>;

  if (!authenticated) {
    return (
      <main className="grid min-h-screen w-full bg-base-background text-main-regular lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <section className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-base-soft px-7 py-8 sm:px-12 lg:px-16 lg:py-12">
          <div className="relative z-10"><Logo /><span className="mt-2 block text-xs font-medium uppercase tracking-[0.3em] text-main-medium">Administração</span></div>
          <div className="relative z-10 max-w-xl py-10">
            <div className="mb-7 h-1 w-16 rounded-full bg-main-primary" />
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-main-primary">Gestão Nishop</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-main-softblack sm:text-5xl lg:text-6xl">A tua loja,<br /><span className="text-main-primary">por dentro.</span></h1>
            <p className="mt-6 max-w-md text-base leading-7 text-main-medium">Acompanha o que acontece na Nishop e cuida dos produtos e das pessoas num só lugar.</p>
          </div>
          <p className="relative z-10 text-xs uppercase tracking-[0.18em] text-SubText">Produtos · Clientes · Resultados</p>
          <div aria-hidden="true" className="absolute -bottom-40 -right-24 h-80 w-80 rounded-full border-[55px] border-main-primary/10 sm:h-[28rem] sm:w-[28rem]" />
        </section>
        <section className="grid place-items-center px-6 py-12 sm:px-10">
          <form onSubmit={signIn} className="w-full max-w-md rounded-[2rem] border border-base-border bg-main-white px-7 py-9 shadow-[0_24px_80px_-40px_rgba(27,27,27,0.22)] sm:px-10">
            <span className="inline-flex rounded-full bg-base-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-main-primary">Acesso reservado</span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-main-softblack">Bem-vindo de volta</h2>
            <p className="mb-8 mt-2 text-sm leading-6 text-main-medium">Entra com a tua conta de administração.</p>
            <label className="mb-2 block text-sm font-medium text-main-regular" htmlFor="admin-email">E-mail</label>
            <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="mb-5 w-full rounded-xl border border-base-border bg-base-background px-4 py-3 text-main-regular outline-none transition focus:border-main-primary focus:ring-2 focus:ring-main-primary/10" />
            <label className="mb-2 block text-sm font-medium text-main-regular" htmlFor="admin-password">Palavra-passe</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="mb-6 w-full rounded-xl border border-base-border bg-base-background px-4 py-3 text-main-regular outline-none transition focus:border-main-primary focus:ring-2 focus:ring-main-primary/10" />
            {loginError && <p role="alert" className="mb-4 rounded-xl bg-base-soft px-4 py-3 text-sm text-system-error">{loginError}</p>}
            <button className="w-full rounded-full bg-main-primary px-4 py-3.5 font-semibold text-main-white transition hover:bg-main-third">Entrar no painel <span aria-hidden="true" className="ml-2">→</span></button>
            <a href="/" className="mt-6 block text-center text-sm text-main-medium transition hover:text-main-primary">← Voltar à loja</a>
          </form>
        </section>
      </main>
    );
  }

  const navigation = [
    { key: "overview" as const, label: "Visão geral", icon: "◫" },
    { key: "products" as const, label: "Produtos", icon: "◇" },
    { key: "users" as const, label: "Utilizadores", icon: "◯" },
  ];

  return (
    <div className="min-h-screen w-full bg-base-background text-main-regular md:flex">
      <aside className="flex shrink-0 flex-col border-b border-base-border bg-base-soft md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="px-6 pb-6 pt-8 md:pb-12"><Logo /><p className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-main-medium">Painel de gestão</p></div>
        <p className="hidden px-6 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-SubText md:block">Navegação</p>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col md:gap-2 md:px-4">
          {navigation.map(item => <button key={item.key} onClick={() => { setActiveTab(item.key); setSearch(""); void loadTab(item.key); }} className={`flex min-w-max items-center gap-3 rounded-full px-4 py-3 text-left text-sm transition md:w-full ${activeTab === item.key ? "bg-main-primary font-semibold text-main-white shadow-[0_8px_20px_-10px_rgba(235,109,32,0.8)]" : "text-main-medium hover:bg-main-white hover:text-main-primary"}`}><span className="text-lg leading-none">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="mx-4 mt-auto hidden border-t border-base-border py-5 md:block">
          <a href="/" className="block rounded-full px-4 py-3 text-sm text-main-medium hover:bg-main-white hover:text-main-primary">← Voltar à loja</a>
          <button onClick={signOut} className="mt-1 w-full rounded-full px-4 py-3 text-left text-sm text-main-medium hover:bg-main-white hover:text-main-primary">Terminar sessão</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-base-border pb-7">
          <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-main-primary">Nishop / Administração</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-main-softblack sm:text-4xl">{navigation.find(item => item.key === activeTab)?.label}</h1></div>
          <div className="flex items-center gap-3">
            {(activeTab === "products" || activeTab === "users") && <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Pesquisar…" className="w-40 rounded-full border border-base-border bg-main-white px-4 py-2.5 text-sm outline-none focus:border-main-primary sm:w-56" />}
            <button onClick={() => void loadTab(activeTab)} className="rounded-full border border-base-border bg-main-white px-4 py-2.5 text-sm font-medium text-main-regular transition hover:border-main-primary hover:text-main-primary">Atualizar</button>
            <button onClick={signOut} className="rounded-full px-3 py-2.5 text-sm text-main-medium hover:bg-base-soft md:hidden">Sair</button>
          </div>
        </header>

        {error && <div role="alert" className="mb-5 rounded-xl border border-system-error/20 bg-base-soft px-4 py-3 text-sm text-system-error">{error}</div>}
        {loading && <p className="mb-4 text-sm text-SubText">A carregar dados…</p>}

        {activeTab === "overview" && overview && <OverviewPanel overview={overview} />}

        {activeTab === "products" && <section className="overflow-hidden rounded-2xl border border-base-border bg-main-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-border px-5 py-5 sm:px-6"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-main-primary">A tua vitrine</p><h2 className="text-xl font-semibold text-main-softblack">Catálogo</h2><p className="mt-1 text-sm text-SubText">{products.length} produtos registados</p></div><button onClick={() => { setEditingProductId(null); setProductDraft({ ...emptyProduct }); }} className="rounded-full bg-main-primary px-5 py-2.5 text-sm font-semibold text-main-white transition hover:bg-main-third">+ Novo produto</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-base-soft text-xs uppercase tracking-wide text-SubText"><tr><th className="px-6 py-3">Produto</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Preço</th><th className="px-4 py-3">Destaque</th><th className="px-6 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-base-border">{filteredProducts.map(product => <tr key={product.id} className="hover:bg-base-soft/70"><td className="px-6 py-4"><div className="flex items-center gap-3"><img src={product.imageSrc} alt="" className="h-11 w-11 rounded-lg bg-base-graybackground object-cover" /><div><p className="font-medium">{product.name}</p><p className="max-w-xs truncate text-xs text-SubText">{product.description}</p></div></div></td><td className="px-4 py-4 text-main-medium">{product.category}</td><td className="px-4 py-4 font-medium">{money(product.price)}</td><td className="px-4 py-4">{product.Emphasis ? <span className="rounded-full bg-base-soft px-2.5 py-1 text-xs text-main-primary">Sim</span> : <span className="text-SubText">—</span>}</td><td className="px-6 py-4 text-right"><button onClick={() => { setEditingProductId(product.id); setProductDraft({ ...product, colors: Array.isArray(product.colors) ? product.colors : [] }); }} className="px-2 py-1 font-medium text-main-regular hover:text-main-primary">Editar</button><button onClick={() => void deleteProduct(product)} className="px-2 py-1 font-medium text-system-error hover:text-system-error">Remover</button></td></tr>)}{!filteredProducts.length && <tr><td colSpan={5} className="px-6 py-12 text-center text-SubText">Nenhum produto encontrado.</td></tr>}</tbody></table></div>
        </section>}

        {activeTab === "users" && <section className="overflow-hidden rounded-2xl border border-base-border bg-main-white shadow-sm">
          <div className="border-b border-base-border px-5 py-5 sm:px-6"><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-main-primary">A tua comunidade</p><h2 className="text-xl font-semibold text-main-softblack">Contas de cliente</h2><p className="mt-1 text-sm text-SubText">{users.length} utilizadores registados</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-base-soft text-xs uppercase tracking-wide text-SubText"><tr><th className="px-6 py-3">Utilizador</th><th className="px-4 py-3">E-mail</th><th className="px-6 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-base-border">{filteredUsers.map(user => <tr key={user.id} className="hover:bg-base-soft/70"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-base-soft font-semibold text-main-primary">{user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : user.name.slice(0, 1).toUpperCase()}</div><span className="font-medium">{user.name}</span></div></td><td className="px-4 py-4 text-main-medium">{user.email}</td><td className="px-6 py-4 text-right"><button onClick={() => setEditingUser(user)} className="px-2 py-1 font-medium text-main-regular hover:text-main-primary">Editar</button><button onClick={() => void deleteUser(user)} className="px-2 py-1 font-medium text-system-error hover:text-system-error">Remover</button></td></tr>)}{!filteredUsers.length && <tr><td colSpan={3} className="px-6 py-12 text-center text-SubText">Nenhum utilizador encontrado.</td></tr>}</tbody></table></div>
        </section>}
      </main>

      {productDraft && <Modal title={editingProductId ? "Editar produto" : "Novo produto"} onClose={() => { setProductDraft(null); setEditingProductId(null); }}>
        <form onSubmit={saveProduct} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome"><input required value={productDraft.name} onChange={event => setProductDraft({ ...productDraft, name: event.target.value })} /></Field>
          <Field label="Categoria"><input required value={productDraft.category} onChange={event => setProductDraft({ ...productDraft, category: event.target.value })} /></Field>
          <Field label="Preço (Kz)"><input required type="number" min="0" step="0.01" value={productDraft.price} onChange={event => setProductDraft({ ...productDraft, price: Number(event.target.value) })} /></Field>
          <Field label="URL da imagem"><input required type="url" value={productDraft.imageSrc} onChange={event => setProductDraft({ ...productDraft, imageSrc: event.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Descrição"><textarea required rows={3} value={productDraft.description} onChange={event => setProductDraft({ ...productDraft, description: event.target.value })} /></Field></div>
          <Field label="Cores (hex separadas por vírgula)"><input value={productDraft.colors.join(", ")} onChange={event => setProductDraft({ ...productDraft, colors: event.target.value.split(",").map(color => color.trim()).filter(Boolean) })} placeholder="D4AF37, 101827" /></Field>
          <label className="flex items-center gap-3 self-end pb-2 text-sm text-main-regular"><input type="checkbox" checked={productDraft.Emphasis} onChange={event => setProductDraft({ ...productDraft, Emphasis: event.target.checked })} className="h-4 w-4 accent-main-primary" />Produto em destaque</label>
          <div className="flex justify-end gap-3 border-t border-base-border pt-4 sm:col-span-2"><button type="button" onClick={() => setProductDraft(null)} className="rounded-full border border-base-border px-4 py-2.5 text-sm">Cancelar</button><button className="rounded-full bg-main-primary px-5 py-2.5 text-sm font-semibold text-main-white transition hover:bg-main-third">Guardar produto</button></div>
        </form>
      </Modal>}

      {editingUser && <Modal title="Editar utilizador" onClose={() => setEditingUser(null)}>
        <form onSubmit={saveUser} className="grid gap-4">
          <Field label="Nome"><input required value={editingUser.name} onChange={event => setEditingUser({ ...editingUser, name: event.target.value })} /></Field>
          <Field label="E-mail"><input required type="email" value={editingUser.email} onChange={event => setEditingUser({ ...editingUser, email: event.target.value })} /></Field>
          <p className="text-xs leading-5 text-SubText">A palavra-passe não é apresentada nem alterada neste formulário.</p>
          <div className="flex justify-end gap-3 border-t border-base-border pt-4"><button type="button" onClick={() => setEditingUser(null)} className="rounded-full border border-base-border px-4 py-2.5 text-sm">Cancelar</button><button className="rounded-full bg-main-primary px-5 py-2.5 text-sm font-semibold text-main-white transition hover:bg-main-third">Guardar alterações</button></div>
        </form>
      </Modal>}
    </div>
  );
}

function OverviewPanel({ overview }: { overview: Overview }) {
  const cards = [
    { label: "Compras concluídas", value: overview.totals.purchases.toLocaleString("pt-AO"), note: "Pagamentos confirmados", color: "bg-base-soft text-system-success", icon: "✓" },
    { label: "Tentativas de pagamento", value: overview.totals.attempts.toLocaleString("pt-AO"), note: `${overview.totals.pendingAttempts} pendentes`, color: "bg-base-soft text-main-primary", icon: "↗" },
    { label: "Visualizações de produto", value: overview.totals.views.toLocaleString("pt-AO"), note: "Desde o início do registo", color: "bg-base-soft text-main-primary", icon: "◉" },
    { label: "Receita confirmada", value: money(overview.totals.revenue), note: `${overview.totals.failedAttempts} tentativas falhadas`, color: "bg-base-soft text-main-primary", icon: "Kz" },
  ];
  const peak = Math.max(1, ...overview.dailyViews.map(item => item.views));
  return <>
    <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-main-primary px-6 py-8 text-main-white shadow-[0_20px_50px_-28px_rgba(235,109,32,0.6)] sm:px-9 sm:py-10">
      <div aria-hidden="true" className="absolute -right-12 -top-24 h-72 w-72 rounded-full border-[44px] border-main-white/10" />
      <div aria-hidden="true" className="absolute -bottom-32 right-36 h-56 w-56 rounded-full border-[36px] border-main-white/10" />
      <div className="relative flex flex-wrap items-end justify-between gap-7">
        <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-white/80">Visão geral da loja</p><h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Cada visita conta.<br />Cada compra também.</h2><p className="mt-4 max-w-md text-sm leading-6 text-main-white/85">Acompanha o movimento da Nishop e encontra oportunidades para fazer a loja crescer.</p></div>
        <div className="rounded-2xl border border-main-white/25 bg-main-white/10 px-5 py-4 backdrop-blur-sm"><p className="text-xs uppercase tracking-[0.18em] text-main-white/75">Na loja agora</p><p className="mt-2 text-3xl font-semibold">{overview.totals.products} <span className="text-base font-normal">produtos</span></p><p className="mt-1 text-sm text-main-white/80">{overview.totals.users} utilizadores registados</p></div>
      </div>
    </section>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card => <article key={card.label} className="rounded-2xl border border-base-border bg-main-white p-5 shadow-[0_12px_32px_-24px_rgba(27,27,27,0.35)] transition hover:-translate-y-0.5 hover:border-main-primary/30"><div className="flex items-start justify-between"><p className="text-sm text-main-medium">{card.label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${card.color}`}>{card.icon}</span></div><p className="mt-5 text-2xl font-semibold tracking-tight text-main-softblack">{card.value}</p><p className="mt-1 text-xs text-SubText">{card.note}</p></article>)}</div>
    <div className="mb-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-2xl border border-base-border bg-main-white p-5 shadow-sm sm:p-6"><div className="mb-7"><h2 className="font-semibold">Visualizações por dia</h2><p className="mt-1 text-sm text-SubText">Últimos sete dias</p></div><div className="flex h-48 items-end justify-between gap-3">{overview.dailyViews.map(day => <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-medium text-SubText">{day.views}</span><div className="flex h-36 w-full items-end"><div className="mx-auto w-full max-w-12 rounded-t-lg bg-main-primary transition-all" style={{ height: `${Math.max(5, day.views / peak * 100)}%` }} /></div><span className="text-[11px] capitalize text-SubText">{day.label.replace(".", "")}</span></div>)}</div></section>
      <section className="rounded-2xl border border-base-border bg-main-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="font-semibold">Produtos mais vistos</h2><p className="mt-1 text-sm text-SubText">Últimos sete dias</p></div><div className="space-y-4">{overview.popularProducts.map((product, index) => <div key={`${product.productId}-${product.productName}`} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-base-graybackground text-xs font-semibold text-SubText">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.productName}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-base-graybackground"><div className="h-full rounded-full bg-main-third" style={{ width: `${Math.max(8, product.views / Math.max(1, overview.popularProducts[0]?.views ?? 1) * 100)}%` }} /></div></div><span className="text-sm font-semibold">{product.views}</span></div>)}{!overview.popularProducts.length && <p className="py-8 text-center text-sm text-SubText">Ainda não há visualizações registadas.</p>}</div></section>
    </div>
    <section className="overflow-hidden rounded-2xl border border-base-border bg-main-white shadow-sm"><div className="border-b border-base-border px-5 py-4 sm:px-6"><h2 className="font-semibold">Atividade de pagamentos</h2><p className="mt-1 text-sm text-SubText">Tentativas mais recentes</p></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-base-soft text-xs uppercase tracking-wide text-SubText"><tr><th className="px-6 py-3">Referência</th><th className="px-4 py-3">Itens</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Estado</th><th className="px-6 py-3">Data</th></tr></thead><tbody className="divide-y divide-base-border">{overview.recentAttempts.map(attempt => <tr key={attempt.attemptId}><td className="px-6 py-4 font-mono text-xs">{attempt.merchantReference}</td><td className="px-4 py-4 text-main-medium">{attempt.items?.map(item => `${item.name} ×${item.quantity}`).join(", ") || "—"}</td><td className="px-4 py-4 font-medium">{money(attempt.amount)}</td><td className="px-4 py-4"><StatusBadge status={attempt.status} /></td><td className="px-6 py-4 text-SubText">{shortDate(attempt.createdAt)}</td></tr>)}{!overview.recentAttempts.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-SubText">Ainda não há tentativas de pagamento.</td></tr>}</tbody></table></div></section>
    <div className="mt-5 flex flex-wrap gap-3 text-sm text-SubText"><span>{overview.totals.users} utilizadores</span><span>·</span><span>{overview.totals.products} produtos</span></div>
  </>;
}

function StatusBadge({ status }: { status: string }) {
  const style = status === "SUCCEEDED" ? "bg-base-soft text-system-success" :
    ["FAILED", "DECLINED", "ERROR"].includes(status) ? "bg-base-soft text-system-error" : "bg-base-soft text-main-primary";
  const label: Record<string, string> = { SUCCEEDED: "Concluído", FAILED: "Falhou", DECLINED: "Recusado", ERROR: "Erro", CREATING: "A iniciar", UNKNOWN: "A confirmar", PENDING_CUSTOMER: "À espera do cliente", PROCESSING: "A processar", CREATED: "Criado" };
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>{label[status] ?? status}</span>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-main-middleblack/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-label={title} className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-main-white p-5 shadow-2xl sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2><button onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full text-xl text-SubText hover:bg-base-graybackground">×</button></div>{children}</section></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-medium text-main-regular">{label}<div className="mt-1.5 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-base-border [&_input]:bg-main-white [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:font-normal [&_input]:outline-none [&_input]:focus:border-main-primary [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-base-border [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:font-normal [&_textarea]:outline-none [&_textarea]:focus:border-main-primary">{children}</div></label>;
}
