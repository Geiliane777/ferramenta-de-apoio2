const SUPABASE_URL = 'https://excnllnuwmmksasowbox.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_f0nSx5N1WKnMA9IIey7TjQ_BXttEM1y';
  const supabaseClientPromise = SUPABASE_URL.startsWith('COLE_AQUI')
    ? Promise.reject(new Error('Supabase não configurado'))
    : import('https://esm.sh/@supabase/supabase-js@2').then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  supabaseClientPromise.catch(e => console.error(e));
  const $ = id => document.getElementById(id);
  const warn = m => `<span style="color:var(--vermelho)">⚠ ${m}</span>`;

  // ─── Helpers ───
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ─── Navigation ───
  function showSection(sectionId, el) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    el.classList.add('active');
    closeSidebar();
  }

  // ─── Sidebar mobile ───
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('open');
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
  }

 
  // ─── Theme ───
  function syncAndToggle(src) {
    const other = document.getElementById(
      src.id === 'toggleModeBtn' ? 'toggleModeBtn2' : 'toggleModeBtn'
    );

    if (other) other.checked = src.checked;

    document.body.classList.toggle('dark-mode', src.checked);
    try { localStorage.setItem('theme', src.checked ? 'dark' : 'light'); } catch (e) {}

    // Troca a logo central conforme o tema
    const logo = document.getElementById('formLogo');

    if (logo) {
      logo.src = src.checked
        ? logo.dataset.logoDark
        : logo.dataset.logoLight;
    }
  }

  // ─── Copy ───
  function copiarTexto(id, btn) {
    const el = document.getElementById(id);
    const text = el.innerText;
    btn = btn || el.closest('.card').querySelector('.btn-ghost');

    function mostrarSucesso() {
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Copiado!';
      btn.style.color = 'var(--azul)';
      btn.style.borderColor = 'var(--azul)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; btn.style.borderColor = ''; }, 1800);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(mostrarSucesso).catch(() => copiarFallback(text, mostrarSucesso));
    } else {
      copiarFallback(text, mostrarSucesso);
    }
  }


  function copiarFallback(text, callback) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch(e) {}
    document.body.removeChild(ta);
  }

  // ─── Multa ───
  function calcularMulta() {
    const valorMensalidade = parseFloat(document.getElementById("valorMensalidade").value);
    const mesesFaltantes = parseInt(document.getElementById("mesesFaltantes").value);
    const resultadoEl = document.getElementById("multaResultado");
    const totalMesesContrato = 13;

    if (isNaN(valorMensalidade) || valorMensalidade <= 0 || isNaN(mesesFaltantes) || mesesFaltantes < 0) {
      resultadoEl.innerHTML = '<span style="color:var(--vermelho)">⚠ Insira valores válidos.</span>';
      return;
    }
    if (mesesFaltantes > totalMesesContrato) {
      resultadoEl.innerHTML = `<span style="color:var(--vermelho)">⚠ Os meses faltantes não podem exceder ${totalMesesContrato}.</span>`;
      return;
    }

    const totalRestante = valorMensalidade * mesesFaltantes;
    const multa = totalRestante * 0.20;

    resultadoEl.innerHTML = `
      <div class="calc-result-grid">
        <div class="calc-card">
          <div class="calc-card-label">Mensalidade</div>
          <div class="calc-card-value">${formatBRL(valorMensalidade)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Meses restantes</div>
          <div class="calc-card-value">${mesesFaltantes}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Total de mensalidades</div>
          <div class="calc-card-value">${formatBRL(totalRestante)}</div>
        </div>
        <div class="calc-card highlight">
          <div class="calc-card-label">Multa a pagar (20%)</div>
          <div class="calc-card-value">${formatBRL(multa)}</div>
        </div>
      </div>`;
  }

  // ─── Pró-rata ───
  function calcularProporcional() {
    const valorTotal = parseFloat(document.getElementById("valorTotalProduto").value);
    const dias = parseInt(document.getElementById("quantidadeDias").value);
    const resultadoElement = document.getElementById("resultadoProporcional");

    if (isNaN(valorTotal) || valorTotal <= 0 || isNaN(dias) || dias <= 0 || dias > 31) {
      resultadoElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Insira valores válidos (dias entre 1 e 31).</span>';
      return;
    }

    const valorPorDia = valorTotal / 30;
    const valorFinal = valorPorDia * dias;

    resultadoElement.innerHTML = `
      <div class="calc-result-grid">
        <div class="calc-card">
          <div class="calc-card-label">Valor total do plano</div>
          <div class="calc-card-value">${formatBRL(valorTotal)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Valor por dia</div>
          <div class="calc-card-value">${formatBRL(valorPorDia)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Dias</div>
          <div class="calc-card-value">${dias}</div>
        </div>
        <div class="calc-card highlight">
          <div class="calc-card-label">Valor pró-rata</div>
          <div class="calc-card-value">${formatBRL(valorFinal)}</div>
        </div>
      </div>`;
  }

  // ─── Greeter ───
  function getGreeting() {
    const h = new Date().getHours();
    return h < 12 ? "bom dia" : h < 18 ? "boa tarde" : "boa noite";
  }

  function capitalizarNome(nome) {
    const prep = ['de', 'da', 'do', 'das', 'dos', 'e'];
    return nome.trim().toLowerCase().split(/\s+/).map((w, i) => {
      if (i !== 0 && prep.includes(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }


  // ─── Campos exigidos por cada mensagem (detectados pelos {marcadores} do texto) ───
  const FIELD_KEYS = {
    name: ['name'], gender: ['gender', 'genderAdj', 'genderPart'], protocol: ['protocol'],
    phone: ['phone'], multa: ['multa'], mensalidade: ['mensalidade'],
    agend: ['agendEspecialidade', 'agendDataHora', 'agendClinica']
  };
  function needs(content) {
    const used = new Set((content.match(/\{(\w+)\}/g) || []).map(k => k.slice(1, -1)));
    const r = {};
    Object.entries(FIELD_KEYS).forEach(([f, ks]) => { r[f] = ks.some(k => used.has(k)); });
    return r;
  }

  let templates = []; // { id (= template_key), label, content }
  const currentTemplate = () => templates.find(t => t.id === $('purpose').value);

  function onPurposeChange() {
    const t = currentTemplate();
    const n = t ? needs(t.content) : {};
    ['name', 'protocol', 'gender', 'phone', 'multa', 'mensalidade', 'agend'].forEach(f => { $('g-' + f).hidden = !n[f]; });
    syncMes();
  }
  function syncMes() {
    const m = document.querySelector('input[name="mensalidade"]:checked');
    $('g-mes').hidden = $('g-mensalidade').hidden || !m || m.value !== 'nao';
  }

  function generateText() {
    const out = $('generatedText');
    const t = currentTemplate();
    out.classList.remove('is-empty');
    if (!t) { out.innerHTML = warn('Selecione uma finalidade.'); return; }
    const n = needs(t.content), v = { greeting: getGreeting() }, miss = [];
    const radio = name => document.querySelector(`input[name="${name}"]:checked`);
    const val = id => $(id).value.trim();

    if (n.name) { const x = val('name'); if (!x) miss.push('nome'); v.name = capitalizarNome(x); }
    if (n.protocol) { const x = val('protocol'); if (!/^[0-9]+$/.test(x)) miss.push('protocolo (somente números)'); v.protocol = x; }
    if (n.gender) {
      const g = radio('gender');
      if (!g) miss.push('sexo');
      const set = { masculino: ['Prezado', 'tranquilo', 'comunicado'], feminino: ['Prezada', 'tranquila', 'comunicada'] }[g && g.value]
        || ['Prezado(a)', 'tranquilo(a)', 'comunicado(a)'];
      [v.gender, v.genderAdj, v.genderPart] = set;
    }
    if (n.phone) { v.phone = val('phoneContact'); if (!v.phone) miss.push('telefone'); }
    if (n.agend) {
      v.agendEspecialidade = val('agendEspecialidade');
      v.agendDataHora = val('agendDataHora');
      v.agendClinica = val('agendClinica');
      if (!v.agendEspecialidade || !v.agendDataHora || !v.agendClinica) miss.push('especialidade, data/hora e clínica');
    }
    if (n.multa) {
      const g = radio('vigencia');
      if (!g) miss.push('vigência');
      v.multa = g && g.value === 'sim' ? 'não haverá cobrança de multa contratual.' : 'haverá cobrança de multa contratual.';
    }
    if (n.mensalidade) {
      const g = radio('mensalidade'), mes = val('mesMensalidade');
      if (!g) miss.push('mensalidades em aberto');
      else if (g.value === 'nao' && !mes) miss.push('mês da última mensalidade');
      v.mensalidade = g && g.value === 'sim'
        ? 'Reforçamos que o seu contrato possui mensalidades em aberto, portanto orientamos que entre em contato com a nossa central de atendimento, caso seja do seu interesse.'
        : `Reforçamos que o seu contrato não possui mensalidades em aberto, sendo a última mensalidade devida referente ao mês ${mes}.`;
    }
    if (miss.length) { out.innerHTML = warn('Preencha: ' + miss.join(', ') + '.'); return; }

    // Uma única passada: o que foi digitado nunca é reinterpretado como marcador.
    const text = t.content.replace(/\{(\w+)\}/g, (m, k) => Object.prototype.hasOwnProperty.call(v, k) ? v[k] : m);
    out.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
  }

  // ─── Abrangências (consulta) ───
  function renderPlanDetails(content) {
    return content.split(/ \| |\n/).filter(p => p.trim()).map((part, i) => {
      const text = part.trim(), colon = text.indexOf(':');
      return i > 0 && colon > 0
        ? `<strong>${escapeHtml(text.slice(0, colon + 1))}</strong>${escapeHtml(text.slice(colon + 1))}`
        : escapeHtml(text);
    }).join('<br>');
  }
  async function consultarPlano() {
    const code = $('inputNumber').value.trim(), out = $('resultado');
    const notFound = warn('Código não localizado. Revise-o e tente novamente.');
    if (!/^[0-9]+$/.test(code)) { out.innerHTML = notFound; return; }
    out.textContent = 'Consultando…';
    try {
      const supabase = await supabaseClientPromise;
      const { data, error } = await supabase.from('plan_details').select('content').eq('product_code', code).maybeSingle();
      if (error) throw error;
      out.innerHTML = data ? renderPlanDetails(data.content) : notFound;
    } catch (e) {
      console.error(e);
      out.innerHTML = warn('Não foi possível consultar o banco de dados. Tente novamente.');
    }
  }

  // ─── Mensagens: carregar ───
  async function loadTemplates(selectId = '') {
    const sel = $('purpose'), keep = sel.value;
    try {
      const supabase = await supabaseClientPromise;
      const { data, error } = await supabase.from('text_templates').select('template_key, label, content').order('label');
      if (error) throw error;
      templates = data.map(r => ({ id: r.template_key, label: r.label, content: r.content }));
    } catch (e) {
      console.error(e);
      sel.innerHTML = '<option value="">— Não foi possível carregar —</option>';
      $('generatedText').innerHTML = warn('Não foi possível carregar as mensagens. Recarregue a página.');
      return;
    }
    const opts = templates.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)}</option>`).join('');
    sel.innerHTML = `<option value="">${templates.length ? '— Selecione uma finalidade —' : '— Nenhuma mensagem cadastrada —'}</option>` + opts;
    if (templates.some(t => t.id === keep)) sel.value = keep;
    $('tplSelect').innerHTML = '<option value="">+ Nova mensagem</option>' + opts;
    selectTemplate(selectId);
    onPurposeChange();
  }

  // ─── Administração ───
  function msg(text, type = '', id = 'adminSaveMessage') { const e = $(id); e.textContent = text; e.className = 'admin-message ' + type; }
  function setAdminView(on) { $('adminLoginCard').hidden = on; $('adminEditorCard').hidden = !on; if (on) loadPlans(); }
  async function isAdmin() {
    try {
      const supabase = await supabaseClientPromise;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle();
      return Boolean(data);
    } catch (e) { return false; }
  }
  async function requireAdmin() {
    if (await isAdmin()) return true;
    setAdminView(false);
    msg('Entre novamente para continuar.', 'error', 'adminAuthMessage');
    return false;
  }
  async function handleAdminLogin(ev) {
    ev.preventDefault();
    msg('Entrando...', '', 'adminAuthMessage');
    try {
      const supabase = await supabaseClientPromise;
      const { error } = await supabase.auth.signInWithPassword({ email: $('adminEmail').value.trim(), password: $('adminPassword').value });
      if (error || !(await isAdmin())) {
        if (!error) await supabase.auth.signOut();
        msg('Não foi possível entrar com essa conta.', 'error', 'adminAuthMessage');
        return;
      }
      msg('', '', 'adminAuthMessage');
      setAdminView(true);
    } catch (e) { msg('Sem conexão com o servidor. Tente novamente.', 'error', 'adminAuthMessage'); }
  }
  async function signOutAdmin() {
    try { await (await supabaseClientPromise).auth.signOut(); } catch (e) {}
    setAdminView(false);
    msg('Você saiu da área administrativa.', 'success', 'adminAuthMessage');
  }

  function selectTemplate(id) {
    const t = templates.find(x => x.id === id);
    $('tplSelect').value = t ? id : '';
    $('tplLabel').value = t ? t.label : '';
    $('tplContent').value = t ? t.content : '';
    $('tplDelete').hidden = !t;
  }
  function insertField(k) {
    const el = $('tplContent');
    el.setRangeText('{' + k + '}', el.selectionStart, el.selectionEnd, 'end');
    el.focus();
  }
  function newTemplateKey(label) {
    const slug = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return 'custom_' + (slug || 'modelo') + '_' + Date.now().toString(36);
  }
  async function saveTemplate() {
    if (!(await requireAdmin())) return;
    const label = $('tplLabel').value.trim(), content = $('tplContent').value.trim();
    if (!label || !content) { msg('Preencha o nome e o texto da mensagem.', 'error'); return; }
    const key = $('tplSelect').value || newTemplateKey(label);
    const supabase = await supabaseClientPromise;
    const { error } = await supabase.from('text_templates')
      .upsert({ template_key: key, label, content, updated_at: new Date().toISOString() }, { onConflict: 'template_key' });
    if (error) { console.error(error); msg('Não foi possível salvar a mensagem.', 'error'); return; }
    await loadTemplates(key);
    msg('Mensagem salva.', 'success');
  }
  async function deleteTemplate() {
    const id = $('tplSelect').value, t = templates.find(x => x.id === id);
    if (!t || !(await requireAdmin()) || !confirm(`Excluir a mensagem "${t.label}"? Ela deixará de aparecer no gerador.`)) return;
    const { error } = await (await supabaseClientPromise).from('text_templates').delete().eq('template_key', id);
    if (error) { msg('Não foi possível excluir a mensagem.', 'error'); return; }
    await loadTemplates('');
    msg('Mensagem excluída.', 'success');
  }

  async function loadPlans(selectCode = '') {
    try {
      const { data, error } = await (await supabaseClientPromise).from('plan_details').select('product_code').order('product_code');
      if (error) throw error;
      $('planSelect').innerHTML = '<option value="">+ Novo código</option>' + data.map(r => `<option>${escapeHtml(r.product_code)}</option>`).join('');
    } catch (e) { console.error(e); }
    await selectPlan(selectCode);
  }
  async function selectPlan(code) {
    $('planSelect').value = code;
    $('planCode').value = code;
    $('planContent').value = '';
    $('planDelete').hidden = !code;
    if (!code) return;
    try {
      const { data } = await (await supabaseClientPromise).from('plan_details').select('content').eq('product_code', code).maybeSingle();
      if (data) $('planContent').value = data.content;
    } catch (e) { console.error(e); }
  }
  async function savePlan() {
    if (!(await requireAdmin())) return;
    const code = $('planCode').value.trim(), content = $('planContent').value.trim();
    if (!/^[0-9]+$/.test(code) || !content) { msg('Informe o código (somente números) e os detalhes da cobertura.', 'error'); return; }
    const { error } = await (await supabaseClientPromise).from('plan_details')
      .upsert({ product_code: code, content, updated_at: new Date().toISOString() }, { onConflict: 'product_code' });
    if (error) { console.error(error); msg('Não foi possível salvar a abrangência.', 'error'); return; }
    await loadPlans(code);
    msg('Abrangência salva.', 'success');
  }
  async function deletePlan() {
    const code = $('planSelect').value;
    if (!code || !(await requireAdmin()) || !confirm(`Excluir o código ${code}? Ele deixará de aparecer na consulta.`)) return;
    const { error } = await (await supabaseClientPromise).from('plan_details').delete().eq('product_code', code);
    if (error) { msg('Não foi possível excluir a abrangência.', 'error'); return; }
    await loadPlans('');
    msg('Abrangência excluída.', 'success');
  }

  document.addEventListener('DOMContentLoaded', () => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const tg = $('toggleModeBtn');
    if (tg && dark) { tg.checked = true; syncAndToggle(tg); }

    $('adminAuthForm').addEventListener('submit', handleAdminLogin);
    document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === b));
      ['tabMsg', 'tabPlan'].forEach(id => { $(id).hidden = id !== b.dataset.tab; });
    }));
    document.querySelectorAll('input[name="mensalidade"]').forEach(r => r.addEventListener('change', syncMes));
    [['inputNumber', consultarPlano], ['name', generateText], ['protocol', generateText], ['mesMensalidade', generateText],
     ['valorMensalidade', calcularMulta], ['mesesFaltantes', calcularMulta],
     ['valorTotalProduto', calcularProporcional], ['quantidadeDias', calcularProporcional]
    ].forEach(([id, fn]) => { const el = $(id); if (el) el.addEventListener('keypress', e => { if (e.key === 'Enter') fn(); }); });
    loadTemplates();
    isAdmin().then(setAdminView);
  });
