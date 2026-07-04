
/* LOGIN */
function login() {
  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if (u === "admin" && p === "1234") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "flex";
  } else {
    alert("Login inválido");
  }
}

function logout() {
  location.reload();
}

/* MENU */
function mostrarSecao(secao) {
  document.getElementById("clientes").style.display = "none";function mostrarClientes(lista = clientes) {
  let ul = document.getElementById("listaClientes");
  ul.innerHTML = "";

  lista.forEach((c, index) => {
    ul.innerHTML += `
      <li>
        <span>
          ${c.nome} - ${c.telefone}
        </span>

        <button class="trash" onclick=function deletarCliente(index) {
  let confirmacao = confirm("Tem certeza que deseja excluir este cliente?");

  if (confirmacao) {
    clientes.splice(index, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    mostrarClientes();
  }
}(${index})">
          🗑️
        </button>
      </li>
    `;
  });
}
  document.getElementById("servicos").style.display = "none";
  document.getElementById("os").style.display = "none";

  document.getElementById(secao).style.display = "block";
}

/* DASHBOARD SIMPLES */
function atualizarDashboard() {
  document.getElementById("dashboard").innerText =
    `Sistema ativo | Clientes: ${clientes.length} | OS: ${osList.length}`;
}
