let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function salvar() {
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

  salvar();
  mostrarClientes();
  limparCampos();
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
  salvar();
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

function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("endereco").value = "";
}

mostrarClientes();
