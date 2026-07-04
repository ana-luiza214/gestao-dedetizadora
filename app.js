let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let osList = JSON.parse(localStorage.getItem("osList")) || [];

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

  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("endereco").value = "";
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

  if (!data || !cliente || !tipo) {
    alert("Preencha todos os campos!");
    return;
  }

  servicos.push({
    data,
    cliente,
    tipo,
    status: "Agendado"
  });

  salvarServicos();
  mostrarServicos();

  document.getElementById("data").value = "";
  document.getElementById("clienteServico").value = "";
  document.getElementById("tipoServico").value = "";
}

function mostrarServicos() {
  let ul = document.getElementById("listaServicos");
  ul.innerHTML = "";

  servicos.forEach((s, index) => {
    ul.innerHTML += `
      <li>
        ${s.data} - ${s.cliente} - ${s.tipo} - ${s.status}
        <button onclick="deletarServico(${index})">X</button>
      </li>
    `;
  });
}

function deletarServico(index) {
  servicos.splice(index, 1);
  salvarServicos();
  mostrarServicos();
}

/* =========================
   ORDEM DE SERVIÇO (OS)
========================= */

function salvarOS() {
  localStorage.setItem("osList", JSON.stringify(osList));
}

function criarOS() {
  let cliente = document.getElementById("clienteOS").value;
  let servico = document.getElementById("servicoOS").value;
  let data = document.getElementById("dataOS").value;

  if (!cliente || !servico || !data) {
    alert("Preencha todos os campos da OS!");
    return;
  }

  osList.push({
    id: Date.now(),
    cliente,
    servico,
    data,
    status: "Agendado"
  });

  salvarOS();
  mostrarOS();

  document.getElementById("clienteOS").value = "";
  document.getElementById("servicoOS").value = "";
  document.getElementById("dataOS").value = "";
}

function mostrarOS() {
  let ul = document.getElementById("listaOS");
  ul.innerHTML = "";

  osList.forEach((o) => {
    ul.innerHTML += `
      <li>
        OS #${o.id} - ${o.cliente} - ${o.servico} - ${o.data} - ${o.status}
        <button onclick="deletarOS(${o.id})">X</button>
      </li>
    `;
  });
}

function deletarOS(id) {
  osList = osList.filter(o => o.id !== id);
  salvarOS();
  mostrarOS();
}

/* =========================
   INICIALIZAÇÃO
========================= */

mostrarClientes();
mostrarServicos();
mostrarOS();
