const SUPABASE_URL = 'https://excnllnuwmmksasowbox.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_f0nSx5N1WKnMA9IIey7TjQ_BXttEM1y';
  const supabaseClientPromise = SUPABASE_URL.startsWith('COLE_AQUI')
    ? Promise.reject(new Error('Supabase não configurado: preencha SUPABASE_URL e SUPABASE_ANON_KEY no início do script.js'))
    : import('https://esm.sh/@supabase/supabase-js@2').then(({ createClient }) =>
        createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      );
  supabaseClientPromise.catch(e => console.error(e));

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

  // ─── Textos (vêm somente do banco: tabela text_templates) ───
  let texts = {};
  const templateLabels = {};

  // ─── Textos da interface (tabela app_settings) ───
  let appSettings = {}; // chave -> { label, value, multiline }

  function settingValue(key, fallback) {
    return appSettings[key] ? appSettings[key].value : fallback;
  }

  function applyAppSettings() {
    if (appSettings['app.document_title']) document.title = appSettings['app.document_title'].value;

    document.querySelectorAll('[data-setting]').forEach(el => {
      const setting = appSettings[el.dataset.setting];
      if (!setting) return;
      if (el.dataset.fallback !== undefined) {
        // Mensagem inicial de resultado: só troca se ainda não foi substituída por um resultado
        if (el.textContent.trim() !== el.dataset.fallback) return;
        el.dataset.fallback = setting.value;
      }
      el.textContent = setting.value;
    });

    document.querySelectorAll('[data-setting-placeholder]').forEach(el => {
      const setting = appSettings[el.dataset.settingPlaceholder];
      if (setting) el.setAttribute('placeholder', setting.value);
    });

    if (Object.keys(texts).length) populatePurposeSelect();
  }

  const SETTING_PREFIX = { app: 'Geral', nav: 'Menu', page: 'Página', form: 'Formulário', calc: 'Calculadora',
    button: 'Botão', result: 'Resultado', generator: 'Resultado inicial', calculator: 'Resultado inicial', purpose: 'Finalidade' };

  function captureDefaultSettings() {
    const add = (key, value, multiline) => {
      if (!key || !value || appSettings[key]) return;
      const prefix = SETTING_PREFIX[key.split('.')[0]] || 'Texto';
      const short = value.length > 48 ? value.slice(0, 48) + '…' : value;
      appSettings[key] = { label: `${prefix}: ${short}`, value, multiline };
    };
    document.querySelectorAll('[data-setting]').forEach(el =>
      add(el.dataset.setting, el.dataset.fallback !== undefined ? el.dataset.fallback : el.textContent.trim(), false));
    document.querySelectorAll('[data-setting-placeholder]').forEach(el =>
      add(el.dataset.settingPlaceholder, el.getAttribute('placeholder') || '', el.tagName === 'TEXTAREA'));
    add('app.document_title', document.title, false);
    add('purpose.placeholder', '— Selecione um tópico —', false);
  }

  async function loadAppSettings() {
    document.querySelectorAll('[data-setting]').forEach(el => {
      if (el.dataset.setting.endsWith('.result.initial')) el.dataset.fallback = el.textContent.trim();
    });
    appSettings = {};
    captureDefaultSettings(); // padrão = textos que já estão no HTML; o banco só guarda o que for alterado
    try {
      const supabase = await supabaseClientPromise;
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, label, setting_value, multiline');
      if (error) throw error;
      data.forEach(row => {
        appSettings[row.setting_key] = { label: row.label, value: row.setting_value, multiline: row.multiline };
      });
    } catch (e) {
      console.error('Could not load app settings', e);
    }
    applyAppSettings();
    renderAppSettingsEditor();
  }

  function renderAppSettingsEditor() {
    const list = document.getElementById('appSettingsList');
    if (!list) return;
    list.replaceChildren();
    Object.entries(appSettings).forEach(([key, setting]) => {
      const group = document.createElement('div');
      group.className = 'form-group';

      const label = document.createElement('label');
      label.setAttribute('for', `setting-${key}`);
      label.textContent = setting.label;

      const field = document.createElement(setting.multiline ? 'textarea' : 'input');
      if (setting.multiline) field.rows = 6; else field.type = 'text';
      field.id = `setting-${key}`;
      field.dataset.settingKey = key;
      field.value = setting.value;

      group.append(label, field);
      list.appendChild(group);
    });
  }

  async function saveAppSettings() {
    if (!(await checkAdminSession())) {
      setAdminView(false);
      showAdminMessage('adminAuthMessage', 'Entre novamente para editar os textos.', 'error');
      return;
    }

    const rows = [];
    document.querySelectorAll('#appSettingsList [data-setting-key]').forEach(field => {
      const key = field.dataset.settingKey;
      if (field.value.trim() === '') return; // nunca salva campo vazio
      if (field.value !== appSettings[key].value) {
        rows.push({
          setting_key: key,
          label: appSettings[key].label,
          setting_value: field.value,
          multiline: appSettings[key].multiline
        });
      }
    });

    if (!rows.length) {
      showAdminMessage('adminSaveMessage', 'Nenhuma alteração para salvar.', '');
      return;
    }

    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminSaveMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { error } = await supabase.from('app_settings').upsert(rows, { onConflict: 'setting_key' });
    if (error) {
      console.error('Could not save app settings', error);
      showAdminMessage('adminSaveMessage', 'Não foi possível salvar os textos da interface.', 'error');
      return;
    }

    rows.forEach(r => { appSettings[r.setting_key].value = r.setting_value; });
    applyAppSettings();
    showAdminMessage('adminSaveMessage', `${rows.length} texto(s) da interface salvo(s).`, 'success');
  }

  function populatePurposeSelect() {
    const select = document.getElementById('purpose');
    if (!select) return;
    const current = select.value;
    select.replaceChildren();

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = settingValue('purpose.placeholder', '— Selecione um tópico —');
    select.appendChild(placeholder);

    Object.keys(texts)
      .sort((a, b) => templateLabel(a).localeCompare(templateLabel(b), 'pt-BR'))
      .forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = templateLabel(key);
        select.appendChild(opt);
      });

    if (current && texts[current] !== undefined) select.value = current;
  }

  async function loadSavedTemplates() {
    const select = document.getElementById('purpose');
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      console.error('Supabase indisponível', e);
      showTemplatesError(select);
      return;
    }

    const { data, error } = await supabase
      .from('text_templates')
      .select('template_key, label, content');

    if (error) {
      console.error('Could not load saved templates', error);
      showTemplatesError(select);
      return;
    }

    texts = {};
    Object.keys(templateLabels).forEach(k => delete templateLabels[k]);
    data.forEach(template => {
      texts[template.template_key] = template.content;
      templateLabels[template.template_key] = template.label;
    });

    populatePurposeSelect();
    togglePhoneField();
    refreshAdminTemplateOptions();
    if (selectedTemplateKey && texts[selectedTemplateKey] === undefined) selectedTemplateKey = '';
    renderTemplateEditor();
  }

  function showTemplatesError(select) {
    if (select) select.options[0].textContent = '— Não foi possível carregar os textos —';
    const result = document.getElementById('generatedText');
    if (result) result.innerHTML = '<span style="color:var(--vermelho)">⚠ Não foi possível carregar os textos do banco de dados. Recarregue a página.</span>';
  }

  async function checkAdminSession() {
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      console.error('Supabase indisponível', e);
      return false;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Could not check admin access', error);
      return false;
    }

    return Boolean(data);
  }

  function showAdminMessage(id, message, type = '') {
    const element = document.getElementById(id);
    element.textContent = message;
    element.className = `admin-message ${type}`;
  }

  function templateLabel(key) {
    return templateLabels[key] || key;
  }

  let selectedTemplateKey = '';

  function refreshAdminTemplateOptions() {
    const select = document.getElementById('adminTemplateSelect');
    if (!select) return;
    const currentValue = selectedTemplateKey;
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— Selecione uma mensagem —';
    select.appendChild(placeholder);

    Object.keys(texts).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = templateLabel(key);
      select.appendChild(option);
    });
    select.value = currentValue;
  }

  function selectTemplateToEdit(key) {
    selectedTemplateKey = key;
    renderTemplateEditor();
  }

  function renderTemplateEditor() {
    const list = document.getElementById('templateEditorList');
    list.replaceChildren();
    if (!selectedTemplateKey || !Object.prototype.hasOwnProperty.call(texts, selectedTemplateKey)) {
      const empty = document.createElement('p');
      empty.className = 'template-editor-empty';
      empty.textContent = 'Selecione uma mensagem acima para começar a editar.';
      list.appendChild(empty);
      return;
    }

    const group = document.createElement('div');
    group.className = 'template-editor-item';

    const header = document.createElement('div');
    header.className = 'template-editor-header';

    const label = document.createElement('label');
    label.setAttribute('for', `template-${selectedTemplateKey}`);
    label.textContent = templateLabel(selectedTemplateKey);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete-template';
    deleteBtn.textContent = 'Excluir mensagem';
    deleteBtn.onclick = () => deleteTemplate(selectedTemplateKey);

    header.append(label, deleteBtn);

    const textarea = document.createElement('textarea');
    textarea.id = `template-${selectedTemplateKey}`;
    textarea.dataset.templateKey = selectedTemplateKey;
    textarea.rows = 14;
    textarea.value = texts[selectedTemplateKey];

    group.append(header, textarea);
    list.appendChild(group);
  }

  function setAdminView(isAdmin) {
    document.getElementById('adminLoginCard').hidden = isAdmin;
    document.getElementById('adminEditorCard').hidden = !isAdmin;
    if (isAdmin) {
      loadPlansAdmin();
      refreshAdminTemplateOptions();
      renderTemplateEditor();
    }
  }

  async function handleAdminLogin(event) {
    event.preventDefault();
    showAdminMessage('adminAuthMessage', 'Entrando...');

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminAuthMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !(await checkAdminSession())) {
      if (!error) await supabase.auth.signOut();
      showAdminMessage('adminAuthMessage', 'Não foi possível entrar com essa conta.', 'error');
      return;
    }

    showAdminMessage('adminAuthMessage', '');
    setAdminView(true);
  }

  async function createAdminAccount() {
    showAdminMessage('adminAuthMessage', 'Criando acesso...');

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminAuthMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      showAdminMessage('adminAuthMessage', 'Não foi possível criar o acesso. Confira os dados informados.', 'error');
      return;
    }

    if (!data.session) {
      showAdminMessage('adminAuthMessage', 'A conta foi criada. Verifique seu e-mail para concluir o acesso.', 'success');
      return;
    }

    if (await checkAdminSession()) {
      setAdminView(true);
      showAdminMessage('adminSaveMessage', 'Acesso administrativo criado.', 'success');
    } else {
      showAdminMessage('adminAuthMessage', 'Esta conta não possui acesso administrativo.', 'error');
    }
  }

  async function saveTemplates() {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) {
      setAdminView(false);
      showAdminMessage('adminAuthMessage', 'Entre novamente para editar os textos.', 'error');
      return;
    }

    const textarea = document.querySelector('#templateEditorList textarea');
    if (!textarea || !selectedTemplateKey) {
      showAdminMessage('adminSaveMessage', 'Selecione uma mensagem antes de salvar.', 'error');
      return;
    }

    const row = {
      template_key: selectedTemplateKey,
      label: templateLabel(selectedTemplateKey),
      content: textarea.value
    };

    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminSaveMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { error } = await supabase.from('text_templates').upsert(row, { onConflict: 'template_key' });

    if (error) {
      console.error('Could not save templates', error);
      showAdminMessage('adminSaveMessage', 'Não foi possível salvar as alterações.', 'error');
      return;
    }

    texts[row.template_key] = row.content;
    togglePhoneField();
    showAdminMessage('adminSaveMessage', 'Mensagem salva com sucesso.', 'success');
  }

  function slugifyLabel(label) {
    const slug = label.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return 'custom_' + (slug || 'modelo') + '_' + Date.now().toString(36);
  }

  function addNewTemplate() {
    const labelInput = document.getElementById('newTemplateLabel');
    const contentInput = document.getElementById('newTemplateContent');
    const label = labelInput.value.trim();
    const content = contentInput.value.trim();

    if (!label || !content) {
      showAdminMessage('adminSaveMessage', 'Preencha o nome e o texto da nova mensagem.', 'error');
      return;
    }

    const key = slugifyLabel(label);
    texts[key] = content;
    templateLabels[key] = label;
    populatePurposeSelect();

    selectedTemplateKey = key;
    refreshAdminTemplateOptions();
    labelInput.value = '';
    contentInput.value = '';
    renderTemplateEditor();
    showAdminMessage('adminSaveMessage', 'Nova mensagem adicionada. Clique em "Salvar mensagem selecionada" para confirmar.', 'success');
  }

  async function deleteTemplate(key) {
    if (!confirm(`Excluir a mensagem "${templateLabel(key)}"? Ela deixará de aparecer no gerador.`)) return;

    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminSaveMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { error } = await supabase
      .from('text_templates')
      .delete()
      .eq('template_key', key);

    if (error) {
      showAdminMessage('adminSaveMessage', 'Não foi possível excluir a mensagem.', 'error');
      return;
    }

    delete texts[key];
    delete templateLabels[key];
    populatePurposeSelect();
    togglePhoneField();

    selectedTemplateKey = '';
    refreshAdminTemplateOptions();
    renderTemplateEditor();
    showAdminMessage('adminSaveMessage', 'Mensagem excluída.', 'success');
  }

  async function signOutAdmin() {
    try {
      const supabase = await supabaseClientPromise;
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Falha ao sair', e);
    }
    setAdminView(false);
    showAdminMessage('adminAuthMessage', 'Você saiu da área administrativa.', 'success');
  }

  function initializeAdmin() {
    document.getElementById('adminAuthForm').addEventListener('submit', handleAdminLogin);
    loadAppSettings().catch(err => console.error('Falha ao carregar textos da interface', err));
    loadSavedTemplates().catch(err => console.error('Falha ao carregar modelos', err));
    checkAdminSession().then(setAdminView).catch(err => console.error(err));
  }

  // ─── Text editor and admin access ───
  const FIELD_KEYS = {
    name: ['name'], gender: ['gender', 'genderAdj', 'genderPart'], protocol: ['protocol'], phone: ['phone'],
    multa: ['multa'], mensalidade: ['mensalidade'], agend: ['agendEspecialidade', 'agendDataHora', 'agendClinica']
  };

  function templateNeeds(content) {
    const used = new Set((content.match(/\{(\w+)\}/g) || []).map(k => k.slice(1, -1)));
    const needs = {};
    Object.entries(FIELD_KEYS).forEach(([field, keys]) => { needs[field] = keys.some(k => used.has(k)); });
    return needs;
  }

  function togglePhoneField() {
    const purpose = document.getElementById('purpose').value;
    const known = purpose && texts[purpose] !== undefined;
    const n = known ? templateNeeds(texts[purpose]) : {};
    const base = !purpose; // sem finalidade escolhida: mostra os campos básicos
    const show = (id, on) => { const el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };

    show('nameGroup', base || n.name);
    show('protocolGroup', base || n.protocol);
    show('genderGroup', base || n.gender);
    show('phoneGroup', n.phone);
    show('cancelamentoGroup', n.multa || n.mensalidade);
    show('vigenciaGroup', n.multa);
    show('mensalidadeGroup', n.mensalidade);
    show('agendamentoGroup', n.agend);

    if (!base && !n.name) document.getElementById('name').value = '';
    if (!base && !n.protocol) document.getElementById('protocol').value = '';
    if (!base && !n.gender) document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = false);
    if (!n.phone) document.getElementById('phoneContact').value = '';
    if (!n.multa) document.querySelectorAll('input[name="vigencia"]').forEach(r => r.checked = false);
    if (!n.mensalidade) {
      document.querySelectorAll('input[name="mensalidade"]').forEach(r => r.checked = false);
      document.getElementById('mesMensalidade').value = '';
      document.getElementById('mesMensalidadeGroup').style.display = 'none';
    }
    if (!n.agend) {
      ['agendEspecialidade', 'agendDataHora', 'agendClinica'].forEach(id => { document.getElementById(id).value = ''; });
    }
  }

  // ─── Enter key shortcuts ───
  document.addEventListener('DOMContentLoaded', function() {
    [['inputNumber', consultarPlano], ['name', generateText], ['protocol', generateText],
     ['valorMensalidade', calcularMulta], ['mesesFaltantes', calcularMulta],
     ['valorTotalProduto', calcularProporcional], ['quantidadeDias', calcularProporcional],
     ['mesMensalidade', generateText]
    ].forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keypress', e => { if (e.key === 'Enter') fn(); });
    });

    document.querySelectorAll('input[name="mensalidade"]').forEach(radio => {
      radio.addEventListener('change', function() {
        document.getElementById("mesMensalidadeGroup").style.display =
          this.value === 'nao' ? 'block' : 'none';
        if (this.value !== 'nao') document.getElementById("mesMensalidade").value = '';
      });
    });
  });

  function generateText() {
    const out = document.getElementById('generatedText');
    const purpose = document.getElementById('purpose').value;
    const warn = m => { out.innerHTML = `<span style="color:var(--vermelho)">⚠ ${m}</span>`; };
    if (!purpose) return warn('Selecione uma finalidade.');
    if (texts[purpose] === undefined) return warn('Texto não encontrado. Recarregue a página.');

    const n = templateNeeds(texts[purpose]);
    const val = id => document.getElementById(id).value.trim();
    const radio = name => document.querySelector(`input[name="${name}"]:checked`);
    const values = { greeting: getGreeting() };
    const missing = [];

    if (n.name) { values.name = val('name'); if (!values.name) missing.push('nome'); else values.name = capitalizarNome(values.name); }
    if (n.protocol) {
      values.protocol = val('protocol');
      if (!values.protocol) missing.push('protocolo');
      else if (!/^[0-9]+$/.test(values.protocol)) return warn('O campo Protocolo deve conter apenas números.');
    }
    if (n.gender) {
      const g = radio('gender');
      if (!g) missing.push('sexo');
      const set = { masculino: ['Prezado', 'tranquilo', 'comunicado'], feminino: ['Prezada', 'tranquila', 'comunicada'] }[g && g.value]
        || ['Prezado(a)', 'tranquilo(a)', 'comunicado(a)'];
      [values.gender, values.genderAdj, values.genderPart] = set;
    }
    if (n.phone) { values.phone = val('phoneContact'); if (!values.phone) missing.push('telefone cadastrado'); }
    if (n.agend) {
      values.agendEspecialidade = val('agendEspecialidade');
      values.agendDataHora = val('agendDataHora');
      values.agendClinica = val('agendClinica');
      if (!values.agendEspecialidade || !values.agendDataHora || !values.agendClinica) missing.push('especialidade, data/hora e clínica');
    }
    if (n.multa) {
      const v = radio('vigencia');
      if (!v) missing.push('vigência');
      values.multa = v && v.value === 'sim' ? 'não haverá cobrança de multa contratual.' : 'haverá cobrança de multa contratual.';
    }
    if (n.mensalidade) {
      const m = radio('mensalidade'), mes = val('mesMensalidade');
      if (!m) missing.push('mensalidades em aberto');
      else if (m.value === 'nao' && !mes) missing.push('mês da última mensalidade devida');
      values.mensalidade = m && m.value === 'sim'
        ? 'Reforçamos que o seu contrato possui mensalidades em aberto, portanto orientamos que entre em contato com a nossa central de atendimento, caso seja do seu interesse.'
        : `Reforçamos que o seu contrato não possui mensalidades em aberto, sendo a última mensalidade devida referente ao mês ${mes}.`;
    }
    if (missing.length) return warn('Preencha: ' + missing.join(', ') + '.');

    // Uma única passada: valores digitados nunca são reinterpretados como marcadores.
    const text = texts[purpose].replace(/\{(\w+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match);
    out.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
  }
  // ─── Planos ───
  function renderPlanDetails(content) {
    // O conteúdo vem do banco no formato "Item. | Chave: valor. | Chave: valor."
    return content.split(/ \| |\n/).filter(p => p.trim()).map((part, i) => {
      const text = part.trim();
      const colon = text.indexOf(':');
      if (i > 0 && colon > 0) {
        return `<strong>${escapeHtml(text.slice(0, colon + 1))}</strong>${escapeHtml(text.slice(colon + 1))}`;
      }
      return escapeHtml(text);
    }).join('<br>');
  }

  async function consultarPlano() {
    const code = document.getElementById("inputNumber").value.trim();
    const out = document.getElementById("resultado");
    const notFound = '<span style="color:var(--vermelho)">⚠ Código não localizado. Revise-o e tente novamente.</span>';

    if (!/^[0-9]+$/.test(code)) {
      out.innerHTML = notFound;
      return;
    }

    out.textContent = 'Consultando…';
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      out.innerHTML = '<span style="color:var(--vermelho)">⚠ Não foi possível consultar o banco de dados. Tente novamente.</span>';
      return;
    }

    const { data, error } = await supabase
      .from('plan_details')
      .select('content')
      .eq('product_code', code)
      .maybeSingle();

    if (error) {
      console.error('Could not load plan details', error);
      out.innerHTML = '<span style="color:var(--vermelho)">⚠ Não foi possível consultar o banco de dados. Tente novamente.</span>';
      return;
    }

    out.innerHTML = data ? renderPlanDetails(data.content) : notFound;
  }

  // ─── Abrangências: cadastro pelo site ───
  async function loadPlansAdmin(selectCode = '') {
    const select = document.getElementById('planSelectAdmin');
    if (!select) return;
    try {
      const supabase = await supabaseClientPromise;
      const { data, error } = await supabase.from('plan_details').select('product_code').order('product_code');
      if (error) throw error;
      select.replaceChildren(new Option('+ Novo código', ''), ...data.map(r => new Option(r.product_code, r.product_code)));
    } catch (e) {
      console.error('Could not load plan codes', e);
    }
    await selectPlanToEdit(selectCode);
  }

  async function selectPlanToEdit(code) {
    document.getElementById('planSelectAdmin').value = code;
    document.getElementById('planCodeAdmin').value = code;
    document.getElementById('planContentAdmin').value = '';
    document.getElementById('planDeleteAdmin').hidden = !code;
    if (!code) return;
    try {
      const supabase = await supabaseClientPromise;
      const { data } = await supabase.from('plan_details').select('content').eq('product_code', code).maybeSingle();
      if (data) document.getElementById('planContentAdmin').value = data.content;
    } catch (e) {
      console.error('Could not load plan', e);
    }
  }

  async function requireAdminForPlans() {
    if (await checkAdminSession()) return true;
    setAdminView(false);
    showAdminMessage('adminAuthMessage', 'Entre novamente para editar as abrangências.', 'error');
    return false;
  }

  async function savePlanAdmin() {
    if (!(await requireAdminForPlans())) return;
    const code = document.getElementById('planCodeAdmin').value.trim();
    const content = document.getElementById('planContentAdmin').value.trim();
    if (!/^[0-9]+$/.test(code) || !content) {
      showAdminMessage('adminSaveMessage', 'Informe o registro ANS (somente números) e os detalhes da cobertura.', 'error');
      return;
    }
    const supabase = await supabaseClientPromise;
    const { error } = await supabase.from('plan_details')
      .upsert({ product_code: code, content, updated_at: new Date().toISOString() }, { onConflict: 'product_code' });
    if (error) {
      console.error('Could not save plan', error);
      showAdminMessage('adminSaveMessage', 'Não foi possível salvar a abrangência.', 'error');
      return;
    }
    await loadPlansAdmin(code);
    showAdminMessage('adminSaveMessage', 'Abrangência salva com sucesso.', 'success');
  }

  async function deletePlanAdmin() {
    const code = document.getElementById('planSelectAdmin').value;
    if (!code || !(await requireAdminForPlans())) return;
    if (!confirm(`Excluir o código ${code}? Ele deixará de aparecer na consulta.`)) return;
    const supabase = await supabaseClientPromise;
    const { error } = await supabase.from('plan_details').delete().eq('product_code', code);
    if (error) {
      showAdminMessage('adminSaveMessage', 'Não foi possível excluir a abrangência.', 'error');
      return;
    }
    await loadPlansAdmin('');
    showAdminMessage('adminSaveMessage', 'Abrangência excluída.', 'success');
  }

  document.addEventListener('DOMContentLoaded', initializeAdmin);
