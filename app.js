let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function adicionarCliente() {
  let nome = document.getElementById("nome").value;
  let telefone = document.getElementById("telefone").value;
  let endereco = document.getElementById("endereco").value;

  if (!nome || !telefone || !endereco) {
    alert("Preencha todos os campos!");
    return;
  }

  let cliente = {
    nome,
    telefone,
    endereco
  };

  clientes.push(cliente);

  localStorage.setItem("clientes", JSON.stringify(clientes));

  mostrarClientes();
  limparCampos();
}

function mostrarClientes() {
  let lista = document.getElementById("listaClientes");
  lista.innerHTML = "";

  clientes.forEach((c) => {
    lista.innerHTML += `<li>${c.nome} - ${c.telefone} - ${c.endereco}</li>`;
  });
}

function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("endereco").value = "";
}

mostrarClientes();
