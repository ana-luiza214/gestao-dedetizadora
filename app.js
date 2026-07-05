let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteEditandoId = null;
let clienteSelecionadoId = null;

/* ==========================
   NAVEGAÇÃO
========================== */
function abrir(secao){

    document.querySelectorAll(".secao")
        .forEach(s => s.classList.add("hidden"));

    document.getElementById(secao).classList.remove("hidden");

    atualizarClientes();
    atualizarSelects();
    atualizarFinanceiro();
    atualizarHistorico();
    atualizarDashboard();
    montarCalendario();
}

/* ==========================
   CLIENTES - ANTI DUPLICAÇÃO
========================== */
function clienteExiste(nome, telefone, endereco){

    return clientes.some(c =>
        c.nome.toLowerCase() === nome.toLowerCase() ||
        c.telefone === telefone ||
        c.endereco.toLowerCase() === endereco.toLowerCase()
    );
}

/* ==========================
   ADICIONAR CLIENTE
========================== */
function addCliente(){

    let nome = document.getElementById("nome").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let endereco = document.getElementById("endereco").value.trim();

    if(!nome) return alert("Digite o nome");

    if(clienteExiste(nome, telefone, endereco)){
        return alert("Cliente já cadastrado!");
    }

    clientes.push({
        id: crypto.randomUUID(),
        nome,
        telefone,
        endereco
    });

    salvar();
    limparInputs();
    atualizarClientes();
    atualizarSelects();
    atualizarDashboard();
}

/* ==========================
   LIMPAR INPUTS
========================== */
function limparInputs(){
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("endereco").value = "";
}

/* ==========================
   LISTAR CLIENTES
========================== */
function atualizarClientes(){

    let lista = document.getElementById("listaClientes");
    let filtro = document.getElementById("pesquisaCliente")?.value.toLowerCase() || "";

    lista.innerHTML = "";

    clientes
    .filter(c => c.nome.toLowerCase().includes(filtro))
    .forEach(c => {

        lista.innerHTML += `
        <li>
            <div onclick="verCliente('${c.id}')" style="cursor:pointer;">
                ${c.nome}
            </div>

            <div>
                <button onclick="editarCliente('${c.id}')">✏️</button>
                <button onclick="delCliente('${c.id}')">🗑️</button>
            </div>
        </li>`;
    });
}

/* ==========================
   DELETAR CLIENTE
========================== */
function delCliente(id){

    if(!confirm("Excluir cliente?")) return;

    clientes = clientes.filter(c => c.id !== id);

    salvar();
    atualizarClientes();
    atualizarSelects();
    atualizarDashboard();
}

/* ==========================
   FICHA DO CLIENTE (HISTÓRICO)
========================== */
function verCliente(id){

    clienteSelecionadoId = id;

    let c = clientes.find(c => c.id === id);
    if(!c) return;

    document.getElementById("infoCliente").innerHTML = `
        <p><strong>Nome:</strong> ${c.nome}</p>
        <p><strong>Telefone:</strong> ${c.telefone}</p>
        <p><strong>Endereço:</strong> ${c.endereco}</p>
    `;

    let lista = document.getElementById("historicoCliente");
    lista.innerHTML = "";

    let serv = servicos.filter(s => s.clienteId === id);
    let ordens = os.filter(o => o.clienteId === id);
    let fin = financeiro.filter(f => f.clienteId === id);

    serv.forEach(s => {
        lista.innerHTML += `<li>🧴 Serviço: ${s.data} | Retorno: ${s.retorno}</li>`;
    });

    ordens.forEach(o => {
        lista.innerHTML += `<li>📄 OS: ${o.servico}</li>`;
    });

    fin.forEach(f => {
        lista.innerHTML += `<li>💰 ${f.tipo}: R$ ${f.valor.toFixed(2)}</li>`;
    });

    abrir("detalheCliente");
}

/* ==========================
   EDITAR CLIENTE
========================== */
function editarCliente(id){

    let c = clientes.find(c => c.id === id);
    if(!c) return;

    clienteEditandoId = id;

    document.getElementById("editNome").value = c.nome;
    document.getElementById("editTelefone").value = c.telefone;
    document.getElementById("editEndereco").value = c.endereco;

    abrir("editarCliente");
}

function salvarEdicaoCliente(){

    let c = clientes.find(c => c.id === clienteEditandoId);
    if(!c) return;

    c.nome = document.getElementById("editNome").value;
    c.telefone = document.getElementById("editTelefone").value;
    c.endereco = document.getElementById("editEndereco").value;

    clienteEditandoId = null;

    salvar();
    atualizarClientes();
    atualizarSelects();
    atualizarDashboard();

    abrir("clientes");
}

/* ==========================
   SELECTS
========================== */
function atualizarSelects(){

    let s1 = document.getElementById("clienteServico");
    let s2 = document.getElementById("clienteOS");

    if(s1){
        s1.innerHTML = "";
        clientes.forEach(c=>{
            s1.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });
    }

    if(s2){
        s2.innerHTML = "";
        clientes.forEach(c=>{
            s2.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });
    }
}

/* ==========================
   SERVIÇOS
========================== */
function addServico(){

    let clienteId = document.getElementById("clienteServico").value;
    let data = document.getElementById("dataServico").value;
    let dias = Number(document.getElementById("retornoDias").value || 0);

    if(!data) return alert("Escolha a data");

    let retorno = new Date(data);
    retorno.setDate(retorno.getDate() + dias);

    servicos.push({
        clienteId,
        data,
        retorno: retorno.toISOString().split("T")[0]
    });

    salvar();
    atualizarDashboard();
    montarCalendario();
}

/* ==========================
   OS
========================== */
function addOS(){

    let clienteId = document.getElementById("clienteOS").value;
    let servico = document.getElementById("servicoOS").value;

    if(!servico) return alert("Digite o serviço");

    os.push({
        clienteId,
        servico
    });

    salvar();
    atualizarDashboard();
}

/* ==========================
   FINANCEIRO
========================== */
function addFinanceiro(){

    let desc = document.getElementById("descFin").value;
    let valor = Number(document.getElementById("valorFin").value);
    let tipo = document.getElementById("tipoFin").value;

    if(!desc || !valor) return alert("Preencha tudo");

    financeiro.push({
        clienteId: clienteSelecionadoId || null,
        desc,
        valor,
        tipo,
        data: new Date().toISOString().split("T")[0]
    });

    salvar();
    atualizarFinanceiro();
    atualizarHistorico();
    atualizarDashboard();
}

/* ==========================
   DASHBOARD
========================== */
function atualizarDashboard(){

    document.getElementById("totalClientes").innerText = clientes.length;
    document.getElementById("totalServicos").innerText = servicos.length;
    document.getElementById("totalOS").innerText = os.length;

    let total = financeiro.reduce((acc, f)=>{
        return f.tipo === "entrada" ? acc + f.valor : acc - f.valor;
    },0);

    document.getElementById("saldoTotal").innerText =
        "R$ " + total.toFixed(2);
}

/* ==========================
   FINANCEIRO LISTA
========================== */
function atualizarFinanceiro(){

    let lista = document.getElementById("listaFin");
    let totalEl = document.getElementById("totalFinanceiro");

    if(!lista || !totalEl) return;

    lista.innerHTML = "";

    let total = 0;

    financeiro.forEach((f, index)=>{

        let valor = f.tipo === "entrada" ? f.valor : -f.valor;
        total += valor;

        lista.innerHTML += `
        <li>
            <div>
                <strong>${f.desc}</strong><br>
                <small>${f.data} - ${f.tipo}</small>
            </div>

            <div>
                R$ ${f.valor.toFixed(2)}
            </div>
        </li>`;
    });

    totalEl.innerText = "Saldo: R$ " + total.toFixed(2);
}

/* ==========================
   HISTÓRICO
========================== */
function atualizarHistorico(){

    let lista = document.getElementById("listaHistorico");
    if(!lista) return;

    lista.innerHTML = "";

    financeiro.forEach(f=>{
        lista.innerHTML += `
        <li>${f.data} - ${f.desc} - R$ ${f.valor.toFixed(2)}</li>`;
    });
}

/* ==========================
   CALENDÁRIO
========================== */
function montarCalendario(){

    let cal = document.getElementById("cal");
    if(!cal) return;

    cal.innerHTML = "";

    let hoje = new Date().toISOString().split("T")[0];

    let datas = {};

    servicos.forEach(s=>{

        if(!datas[s.data]) datas[s.data] = [];
        datas[s.data].push(s);
    });

    for(let d in datas){

        let html = `<div class="dia ${d===hoje?'dia-hoje':''}">
        <strong>${d}</strong>`;

        datas[d].forEach(s=>{
            html += `
            <div class="servico-dia">
                🧴 Serviço
            </div>`;
        });

        html += `</div>`;
        cal.innerHTML += html;
    }
}

/* ==========================
   SALVAR
========================== */
function salvar(){

    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("servicos", JSON.stringify(servicos));
    localStorage.setItem("os", JSON.stringify(os));
    localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* ==========================
   INIT
========================== */
abrir("dashboard");
