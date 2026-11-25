"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";

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

  if (authenticated === null) return <div className="grid min-h-screen w-full place-items-center bg-slate-950 text-slate-300">A verificar sessão…</div>;

  if (!authenticated) {
    return (
      <main className="grid min-h-screen w-full place-items-center bg-[#0b1220] px-5 py-12 text-slate-100">
        <form onSubmit={signIn} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-lg font-black text-slate-950">N</div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Nishop</p><h1 className="text-2xl font-semibold">Área de gestão</h1></div>
          </div>
          <label className="mb-2 block text-sm text-slate-300" htmlFor="admin-email">E-mail de administração</label>
          <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="mb-5 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-amber-300" />
          <label className="mb-2 block text-sm text-slate-300" htmlFor="admin-password">Palavra-passe</label>
          <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="mb-5 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-amber-300" />
          {loginError && <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{loginError}</p>}
          <button className="w-full rounded-xl bg-amber-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-200">Entrar no painel</button>
          <p className="mt-5 text-xs leading-5 text-slate-500">Define NISHOP_ADMIN_EMAIL, NISHOP_ADMIN_PASSWORD e NISHOP_ADMIN_SESSION_SECRET no ambiente do servidor.</p>
        </form>
      </main>
    );
  }

  const navigation = [
    { key: "overview" as const, label: "Visão geral", icon: "▦" },
    { key: "products" as const, label: "Produtos", icon: "◈" },
    { key: "users" as const, label: "Utilizadores", icon: "◎" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f4f6fa] text-slate-900 md:flex">
      <aside className="flex shrink-0 flex-col bg-[#101827] text-slate-200 md:min-h-screen md:w-64">
        <div className="flex items-center gap-3 px-6 py-7">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300 font-black text-slate-950">N</div>
          <div><p className="font-semibold tracking-wide">NISHOP</p><p className="text-xs text-slate-400">Painel de administração</p></div>
        </div>
        <nav className="flex gap-2 px-3 pb-4 md:flex-col md:px-4">
          {navigation.map(item => <button key={item.key} onClick={() => { setActiveTab(item.key); setSearch(""); void loadTab(item.key); }} className={`flex min-w-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${activeTab === item.key ? "bg-amber-300 font-semibold text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}><span className="text-lg">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="mt-auto hidden border-t border-white/10 p-4 md:block">
          <a href="/" className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5">← Voltar à loja</a>
          <button onClick={signOut} className="mt-1 w-full rounded-xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5">Terminar sessão</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm text-slate-500">Nishop / Administração</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{navigation.find(item => item.key === activeTab)?.label}</h1></div>
          <div className="flex items-center gap-3">
            {(activeTab === "products" || activeTab === "users") && <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Pesquisar…" className="w-40 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400 sm:w-56" />}
            <button onClick={() => void loadTab(activeTab)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50">Atualizar</button>
            <button onClick={signOut} className="rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-white md:hidden">Sair</button>
          </div>
        </header>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading && <p className="mb-4 text-sm text-slate-500">A carregar dados…</p>}

        {activeTab === "overview" && overview && <OverviewPanel overview={overview} />}

        {activeTab === "products" && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-semibold">Catálogo</h2><p className="mt-1 text-sm text-slate-500">{products.length} produtos registados</p></div><button onClick={() => { setEditingProductId(null); setProductDraft({ ...emptyProduct }); }} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">+ Novo produto</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Produto</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Preço</th><th className="px-4 py-3">Destaque</th><th className="px-6 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredProducts.map(product => <tr key={product.id} className="hover:bg-slate-50/70"><td className="px-6 py-4"><div className="flex items-center gap-3"><img src={product.imageSrc} alt="" className="h-11 w-11 rounded-lg bg-slate-100 object-cover" /><div><p className="font-medium">{product.name}</p><p className="max-w-xs truncate text-xs text-slate-500">{product.description}</p></div></div></td><td className="px-4 py-4 text-slate-600">{product.category}</td><td className="px-4 py-4 font-medium">{money(product.price)}</td><td className="px-4 py-4">{product.Emphasis ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-800">Sim</span> : <span className="text-slate-400">—</span>}</td><td className="px-6 py-4 text-right"><button onClick={() => { setEditingProductId(product.id); setProductDraft({ ...product, colors: Array.isArray(product.colors) ? product.colors : [] }); }} className="px-2 py-1 font-medium text-slate-700 hover:text-amber-700">Editar</button><button onClick={() => void deleteProduct(product)} className="px-2 py-1 font-medium text-red-600 hover:text-red-800">Remover</button></td></tr>)}{!filteredProducts.length && <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Nenhum produto encontrado.</td></tr>}</tbody></table></div>
        </section>}

        {activeTab === "users" && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-semibold">Contas de cliente</h2><p className="mt-1 text-sm text-slate-500">{users.length} utilizadores registados</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Utilizador</th><th className="px-4 py-3">E-mail</th><th className="px-6 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredUsers.map(user => <tr key={user.id} className="hover:bg-slate-50/70"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-indigo-50 font-semibold text-indigo-700">{user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : user.name.slice(0, 1).toUpperCase()}</div><span className="font-medium">{user.name}</span></div></td><td className="px-4 py-4 text-slate-600">{user.email}</td><td className="px-6 py-4 text-right"><button onClick={() => setEditingUser(user)} className="px-2 py-1 font-medium text-slate-700 hover:text-amber-700">Editar</button><button onClick={() => void deleteUser(user)} className="px-2 py-1 font-medium text-red-600 hover:text-red-800">Remover</button></td></tr>)}{!filteredUsers.length && <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500">Nenhum utilizador encontrado.</td></tr>}</tbody></table></div>
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
          <label className="flex items-center gap-3 self-end pb-2 text-sm text-slate-700"><input type="checkbox" checked={productDraft.Emphasis} onChange={event => setProductDraft({ ...productDraft, Emphasis: event.target.checked })} className="h-4 w-4 accent-amber-500" />Produto em destaque</label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 sm:col-span-2"><button type="button" onClick={() => setProductDraft(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">Cancelar</button><button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Guardar produto</button></div>
        </form>
      </Modal>}

      {editingUser && <Modal title="Editar utilizador" onClose={() => setEditingUser(null)}>
        <form onSubmit={saveUser} className="grid gap-4">
          <Field label="Nome"><input required value={editingUser.name} onChange={event => setEditingUser({ ...editingUser, name: event.target.value })} /></Field>
          <Field label="E-mail"><input required type="email" value={editingUser.email} onChange={event => setEditingUser({ ...editingUser, email: event.target.value })} /></Field>
          <p className="text-xs leading-5 text-slate-500">A palavra-passe não é apresentada nem alterada neste formulário.</p>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={() => setEditingUser(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">Cancelar</button><button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Guardar alterações</button></div>
        </form>
      </Modal>}
    </div>
  );
}

function OverviewPanel({ overview }: { overview: Overview }) {
  const cards = [
    { label: "Compras concluídas", value: overview.totals.purchases.toLocaleString("pt-AO"), note: "Pagamentos confirmados", color: "bg-emerald-50 text-emerald-700", icon: "✓" },
    { label: "Tentativas de pagamento", value: overview.totals.attempts.toLocaleString("pt-AO"), note: `${overview.totals.pendingAttempts} pendentes`, color: "bg-blue-50 text-blue-700", icon: "↗" },
    { label: "Visualizações de produto", value: overview.totals.views.toLocaleString("pt-AO"), note: "Desde o início do registo", color: "bg-violet-50 text-violet-700", icon: "◉" },
    { label: "Receita confirmada", value: money(overview.totals.revenue), note: `${overview.totals.failedAttempts} tentativas falhadas`, color: "bg-amber-50 text-amber-800", icon: "Kz" },
  ];
  const peak = Math.max(1, ...overview.dailyViews.map(item => item.views));
  return <>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card => <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm text-slate-500">{card.label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${card.color}`}>{card.icon}</span></div><p className="mt-4 text-2xl font-bold tracking-tight">{card.value}</p><p className="mt-1 text-xs text-slate-500">{card.note}</p></article>)}</div>
    <div className="mb-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-7"><h2 className="font-semibold">Visualizações por dia</h2><p className="mt-1 text-sm text-slate-500">Últimos sete dias</p></div><div className="flex h-48 items-end justify-between gap-3">{overview.dailyViews.map(day => <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-medium text-slate-500">{day.views}</span><div className="flex h-36 w-full items-end"><div className="mx-auto w-full max-w-12 rounded-t-lg bg-amber-300 transition-all" style={{ height: `${Math.max(5, day.views / peak * 100)}%` }} /></div><span className="text-[11px] capitalize text-slate-400">{day.label.replace(".", "")}</span></div>)}</div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="font-semibold">Produtos mais vistos</h2><p className="mt-1 text-sm text-slate-500">Últimos sete dias</p></div><div className="space-y-4">{overview.popularProducts.map((product, index) => <div key={`${product.productId}-${product.productName}`} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.productName}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-400" style={{ width: `${Math.max(8, product.views / Math.max(1, overview.popularProducts[0]?.views ?? 1) * 100)}%` }} /></div></div><span className="text-sm font-semibold">{product.views}</span></div>)}{!overview.popularProducts.length && <p className="py-8 text-center text-sm text-slate-500">Ainda não há visualizações registadas.</p>}</div></section>
    </div>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-semibold">Atividade de pagamentos</h2><p className="mt-1 text-sm text-slate-500">Tentativas mais recentes</p></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Referência</th><th className="px-4 py-3">Itens</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Estado</th><th className="px-6 py-3">Data</th></tr></thead><tbody className="divide-y divide-slate-100">{overview.recentAttempts.map(attempt => <tr key={attempt.attemptId}><td className="px-6 py-4 font-mono text-xs">{attempt.merchantReference}</td><td className="px-4 py-4 text-slate-600">{attempt.items?.map(item => `${item.name} ×${item.quantity}`).join(", ") || "—"}</td><td className="px-4 py-4 font-medium">{money(attempt.amount)}</td><td className="px-4 py-4"><StatusBadge status={attempt.status} /></td><td className="px-6 py-4 text-slate-500">{shortDate(attempt.createdAt)}</td></tr>)}{!overview.recentAttempts.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Ainda não há tentativas de pagamento.</td></tr>}</tbody></table></div></section>
    <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500"><span>{overview.totals.users} utilizadores</span><span>·</span><span>{overview.totals.products} produtos</span></div>
  </>;
}

function StatusBadge({ status }: { status: string }) {
  const style = status === "SUCCEEDED" ? "bg-emerald-50 text-emerald-700" :
    ["FAILED", "DECLINED", "ERROR"].includes(status) ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800";
  const label: Record<string, string> = { SUCCEEDED: "Concluído", FAILED: "Falhou", DECLINED: "Recusado", ERROR: "Erro", CREATING: "A iniciar", UNKNOWN: "A confirmar", PENDING_CUSTOMER: "À espera do cliente", PROCESSING: "A processar", CREATED: "Criado" };
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>{label[status] ?? status}</span>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-label={title} className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2><button onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full text-xl text-slate-500 hover:bg-slate-100">×</button></div>{children}</section></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<div className="mt-1.5 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:bg-white [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:font-normal [&_input]:outline-none [&_input]:focus:border-amber-400 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:font-normal [&_textarea]:outline-none [&_textarea]:focus:border-amber-400">{children}</div></label>;
}
