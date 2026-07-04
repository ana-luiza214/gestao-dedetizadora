
/* =========================
   LOGIN SIMPLES
========================= */

function login() {
  let user = document.getElementById("user").value;
  let pass = document.getElementById("pass").value;

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("logado", "sim");

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

function logout() {
  localStorage.removeItem("logado");
  location.reload();
}

/* =========================
   AUTO LOGIN
========================= */

if (localStorage.getItem("logado") === "sim") {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("app").style.display = "block";
}

/* =========================
   DADOS
========================= */

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
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
   DASHBOARD
========================= */

function atualizarDashboard() {
  document.getElementById("dashboard").innerText =
    `Clientes: ${clientes.length} | OS: ${osList.length}`;
}

/* =========================
   INICIALIZAÇÃO
========================= */

mostrarClientes();
mostrarOS();
atualizarDashboard();
