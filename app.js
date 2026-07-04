/* =========================
   DADOS
========================= */

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let osList = JSON.parse(localStorage.getItem("osList")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

/* =========================
   CLIENTES
========================= */

function addCliente() {
  let nome = document.getElementById("nome").value;
  let telefone = document.getElementById("telefone").value;

  if (!nome || !telefone) return alert("Preencha tudo");

  clientes.push({ nome, telefone });

  localStorage.setItem("clientes", JSON.stringify(clientes));

  mostrarClientes();
}

function mostrarClientes() {
  let ul = document.getElementById("listaClientes");
  ul.innerHTML = "";

  clientes.forEach((c, i) => {
    ul.innerHTML += `
      <li>
        ${c.nome} - ${c.telefone}
        <button onclick="delCliente(${i})">🗑️</button>
      </li>
    `;
  });
}

function delCliente(i) {
  clientes.splice(i, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}

/* =========================
   SERVIÇOS + AGENDA
========================= */

function addServico() {
  let cliente = document.getElementById("clienteServico").value;
  let data = document.getElementById("dataServico").value;
  let retorno = document.getElementById("retornoDias").value;

  if (!cliente || !data) return alert("Preencha tudo");

  let retornoData = new Date(data);
  retornoData.setDate(retornoData.getDate() + Number(retorno));

  servicos.push({
    cliente,
    data,
    retorno: retornoData.toISOString().split("T")[0]
  });

  localStorage.setItem("servicos", JSON.stringify(servicos));

  mostrarServicos();
  checarLembretes();
}

function mostrarServicos() {
  let ul = document.getElementById("listaServicos");
  ul.innerHTML = "";

  servicos.forEach((s) => {
    ul.innerHTML += `
      <li>
        ${s.cliente} - Serviço: ${s.data} - Retorno: ${s.retorno}
      </li>
    `;
  });
}

/* =========================
   OS
========================= */

function addOS() {
  let cliente = document.getElementById("clienteOS").value;
  let servico = document.getElementById("servicoOS").value;

  osList.push({
    id: Date.now(),
    cliente,
    servico
  });

  localStorage.setItem("osList", JSON.stringify(osList));

  mostrarOS();
}

function mostrarOS() {
  let ul = document.getElementById("listaOS");
  ul.innerHTML = "";

  osList.forEach(o => {
    ul.innerHTML += `
      <li>
        OS #${o.id} - ${o.cliente} - ${o.servico}
      </li>
    `;
  });
}

/* =========================
   FINANCEIRO
========================= */

function addFinanceiro() {
  let desc = document.getElementById("descricao").value;
  let valor = Number(document.getElementById("valor").value);

  financeiro.push({ desc, valor });

  localStorage.setItem("financeiro", JSON.stringify(financeiro));

  atualizarFinanceiro();
}

function atualizarFinanceiro() {
  let total = financeiro.reduce((t, f) => t + f.valor, 0);

  document.getElementById("resumo").innerText =
    "Total financeiro: R$ " + total;
}

/* =========================
   LEMBRETE DE RETORNO
========================= */

function checarLembretes() {
  let hoje = new Date().toISOString().split("T")[0];

  servicos.forEach(s => {
    if (s.retorno === hoje) {
      alert("⚠️ Retorno do cliente hoje: " + s.cliente);
    }
  });
}

/* =========================
   INICIAL
========================= */

mostrarClientes();
mostrarServicos();
mostrarOS();
atualizarFinanceiro();
checarLembretes();
