let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

/* MENU */
function abrir(secao) {
  document.querySelectorAll(".secao").forEach(s => s.classList.add("hidden"));
  document.getElementById(secao).classList.remove("hidden");
}

/* CLIENTES */
function addCliente() {
  clientes.push({
    nome: nome.value,
    telefone: telefone.value,
    endereco: endereco.value
  });

  salvar();
  atualizarClientes();
  atualizarSelects();
}

function atualizarClientes() {
  listaClientes.innerHTML = "";

  clientes.forEach((c, i) => {
    listaClientes.innerHTML += `
      <li>
        ${c.nome} - ${c.endereco}
        <button onclick="delCliente(${i})">🗑️</button>
      </li>
    `;
  });
}

function delCliente(i) {
  clientes.splice(i, 1);
  salvar();
  atualizarClientes();
  atualizarSelects();
}

/* SELECT CLIENTES */
function atualizarSelects() {
  clienteServico.innerHTML = "";
  clienteOS.innerHTML = "";

  clientes.forEach(c => {
    clienteServico.innerHTML += `<option>${c.nome}</option>`;
    clienteOS.innerHTML += `<option>${c.nome}</option>`;
  });
}

/* SERVIÇOS */
function addServico() {
  let data = dataServico.value;

  let retorno = new Date(data);
  retorno.setDate(retorno.getDate() + Number(retornoDias.value));

  servicos.push({
    cliente: clienteServico.value,
    data,
    retorno: retorno.toISOString().split("T")[0]
  });

  salvar();
  atualizarServicos();
}

function atualizarServicos() {
  listaServicos.innerHTML = "";

  servicos.forEach((s, i) => {
    listaServicos.innerHTML += `
      <li>
        ${s.cliente} | ${s.data} | retorno ${s.retorno}
        <button onclick="delServico(${i})">🗑️</button>
      </li>
    `;
  });
}

function delServico(i) {
  servicos.splice(i, 1);
  salvar();
  atualizarServicos();
}

/* OS */
function addOS() {
  os.push({
    cliente: clienteOS.value,
    servico: servicoOS.value
  });

  salvar();
  atualizarOS();
}

function atualizarOS() {
  listaOS.innerHTML = "";

  os.forEach((o, i) => {
    listaOS.innerHTML += `
      <li>
        ${o.cliente} - ${o.servico}
        <button onclick="delOS(${i})">🗑️</button>
      </li>
    `;
  });
}

function delOS(i) {
  os.splice(i, 1);
  salvar();
  atualizarOS();
}

/* FINANCEIRO */
function addFinanceiro() {
  financeiro.push({
    desc: descFin.value,
    valor: Number(valorFin.value)
  });

  salvar();
  atualizarFinanceiro();
  atualizarHistorico();
}

function atualizarFinanceiro() {
  listaFin.innerHTML = "";

  financeiro.forEach(f => {
    listaFin.innerHTML += `<li>${f.desc} - R$ ${f.valor}</li>`;
  });
}

/* HISTÓRICO */
function atualizarHistorico() {
  listaHistorico.innerHTML = "";

  financeiro.forEach(f => {
    listaHistorico.innerHTML += `<li>${f.desc} - R$ ${f.valor}</li>`;
  });
}

/* CALENDÁRIO */
function montarCalendario() {
  let html = "";

  servicos.forEach(s => {
    let cor = s.retorno === new Date().toISOString().split("T")[0]
      ? "#facc15"
      : "#2563eb";

    html += `
      <div style="background:${cor};color:white;padding:10px;margin:5px;border-radius:6px;">
        ${s.data} - ${s.cliente} <br>
        retorno: ${s.retorno}
      </div>
    `;
  });

  cal.innerHTML = html;
}

setInterval(montarCalendario, 1000);

/* SALVAR */
function salvar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("servicos", JSON.stringify(servicos));
  localStorage.setItem("os", JSON.stringify(os));
  localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* INIT */
atualizarClientes();
atualizarSelects();
atualizarServicos();
atualizarOS();
atualizarFinanceiro();
atualizarHistorico();
