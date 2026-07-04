
/* =========================
   DADOS
========================= */

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let osList = JSON.parse(localStorage.getItem("osList")) || [];

let pagar = JSON.parse(localStorage.getItem("pagar")) || [];
let receber = JSON.parse(localStorage.getItem("receber")) || [];

/* =========================
   CLIENTES
========================= */

function salvarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function adicionarCliente() {
  let nome = document.getElementById("nome").value;
  let telefone = document.getElementById("telefone").value;
  let endereco = document.getElementById("endereco").value;

  if (!nome || !telefone || !endereco) {
    alert("Preencha todos os campos!");
    return;
  }

  clientes.push({ nome, telefone, endereco });

  salvarClientes();
  mostrarClientes();
}

function mostrarClientes(lista = clientes) {
  let ul = document.getElementById("listaClientes");
  ul.innerHTML = "";

  lista.forEach((c, index) => {
    ul.innerHTML += `
      <li>
        ${c.nome} - ${c.telefone}
        <button onclick="deletarCliente(${index})">X</button>
      </li>
    `;
  });
}

function deletarCliente(index) {
  clientes.splice(index, 1);
  salvarClientes();
  mostrarClientes();
}

function buscarCliente() {
  let texto = document.getElementById("busca").value.toLowerCase();

  let filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(texto) ||
    c.telefone.includes(texto)
  );

  mostrarClientes(filtrados);
}

/* =========================
   SERVIÇOS
========================= */

function salvarServicos() {
  localStorage.setItem("servicos", JSON.stringify(servicos));
}

function adicionarServico() {
  let data = document.getElementById("data").value;
  let cliente = document.getElementById("clienteServico").value;
  let tipo = document.getElementById("tipoServico").value;
  let valor = Number(document.getElementById("valorServico").value);

  if (!data || !cliente || !tipo || !valor) {
    alert("Preencha tudo!");
    return;
  }

  servicos.push({ data, cliente, tipo, valor, status: "Agendado" });

  salvarServicos();
  mostrarServicos();
  atualizarFinanceiro();
}

function mostrarServicos() {
  let ul = document.getElementById("listaServicos");
  ul.innerHTML = "";

  servicos.forEach((s, index) => {
    ul.innerHTML += `
      <li>
        ${s.data} - ${s.cliente} - ${s.tipo} - R$ ${s.valor}
        <button onclick="deletarServico(${index})">X</button>
      </li>
    `;
  });
}

function deletarServico(index) {
  servicos.splice(index, 1);
  salvarServicos();
  mostrarServicos();
  atualizarFinanceiro();
}

/* =========================
   OS
========================= */

function criarOS() {
  let cliente = document.getElementById("clienteOS").value;
  let servico = document.getElementById("servicoOS").value;
  let data = document.getElementById("dataOS").value;

  osList.push({
    id: Date.now(),
    cliente,
    servico,
    data
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
        OS #${o.id} - ${o.cliente} - ${o.servico} - ${o.data}
      </li>
    `;
  });
}

/* =========================
   FINANCEIRO
========================= */

function addPagar() {
  let descricao = document.getElementById("descricaoPagar").value;
  let valor = Number(document.getElementById("valorPagar").value);

  pagar.push({ descricao, valor });

  localStorage.setItem("pagar", JSON.stringify(pagar));
  mostrarPagar();
  atualizarFinanceiro();
}

function addReceber() {
  let descricao = document.getElementById("descricaoReceber").value;
  let valor = Number(document.getElementById("valorReceber").value);

  receber.push({ descricao, valor });

  localStorage.setItem("receber", JSON.stringify(receber));
  mostrarReceber();
  atualizarFinanceiro();
}

function mostrarPagar() {
  let ul = document.getElementById("listaPagar");
  ul.innerHTML = "";

  pagar.forEach(p => {
    ul.innerHTML += `<li>${p.descricao} - R$ ${p.valor}</li>`;
  });
}

function mostrarReceber() {
  let ul = document.getElementById("listaReceber");
  ul.innerHTML = "";

  receber.forEach(r => {
    ul.innerHTML += `<li>${r.descricao} - R$ ${r.valor}</li>`;
  });
}

function atualizarFinanceiro() {
  let totalReceber = receber.reduce((t, r) => t + r.valor, 0);
  let totalPagar = pagar.reduce((t, p) => t + p.valor, 0);
  let faturamento = servicos.reduce((t, s) => t + s.valor, 0);

  let lucro = faturamento - totalPagar;

  document.getElementById("resumoFinanceiro").innerText =
    `Faturamento: R$ ${faturamento} | A Receber: R$ ${totalReceber} | A Pagar: R$ ${totalPagar} | Lucro: R$ ${lucro}`;
}

/* =========================
   INICIALIZAÇÃO
========================= */

mostrarClientes();
mostrarServicos();
mostrarOS();
mostrarPagar();
mostrarReceber();
atualizarFinanceiro();
