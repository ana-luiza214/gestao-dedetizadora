let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];

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
  limparCamposCliente();
}

function mostrarClientes(lista = clientes) {
  let ul = document.getElementById("listaClientes");
  ul.innerHTML = "";

  lista.forEach((c, index) => {
    ul.innerHTML += `
      <li>
        ${c.nome} - ${c.telefone} - ${c.endereco}
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

function limparCamposCliente() {
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("endereco").value = "";
}

/* =========================
   SERVIÇOS (AGENDA)
========================= */

function salvarServicos() {
  localStorage.setItem("servicos", JSON.stringify(servicos));
}

function adicionarServico() {
  let data = document.getElementById("data").value;
  let cliente = document.getElementById("clienteServico").value;
  let tipo = document.getElementById("tipoServico").value;

  if (!data || !cliente || !tipo) {
    alert("Preencha todos os campos do serviço!");
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
   INICIALIZAÇÃO
========================= */

mostrarClientes();
mostrarServicos();
