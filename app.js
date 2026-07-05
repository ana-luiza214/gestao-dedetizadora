let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteEditandoId = null;
let clienteSelecionadoId = null;

/* ==========================
   INICIAR
========================== */
window.onload = function(){
    abrir("dashboard");
};

/* ==========================
   NAVEGAÇÃO
========================== */
function abrir(secao){

    document.querySelectorAll(".secao").forEach(s => {
        if(s) s.classList.add("hidden");
    });

    let el = document.getElementById(secao);
    if(el) el.classList.remove("hidden");

    atualizarClientes();
    atualizarSelects();
    atualizarFinanceiro();
    atualizarHistorico();
    atualizarDashboard();
    montarCalendario();
}

/* ==========================
   CLIENTE EXISTE
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

    let nome = document.getElementById("nome")?.value.trim();
    let telefone = document.getElementById("telefone")?.value.trim();
    let endereco = document.getElementById("endereco")?.value.trim();

    if(!nome || !telefone || !endereco){
        return alert("Preencha todos os campos");
    }

    if(clienteExiste(nome, telefone, endereco)){
        return alert("Cliente já existe");
    }

    clientes.push({
        id: Date.now().toString(),
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
   LIMPAR
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
    if(!lista) return;

    let filtro = document.getElementById("pesquisaCliente")?.value.toLowerCase() || "";

    lista.innerHTML = "";

    clientes
    .filter(c => c.nome.toLowerCase().includes(filtro))
    .forEach(c => {

        lista.innerHTML += `
        <li>
            <div onclick="verCliente('${c.id}')" style="cursor:pointer">
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
   DELETAR CLIENTE (CORRIGIDO)
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
   VER CLIENTE
========================== */
function verCliente(id){

    let c = clientes.find(c => c.id === id);
    if(!c) return alert("Cliente não encontrado");

    clienteSelecionadoId = id;

    document.getElementById("infoCliente").innerHTML = `
        <p><b>Nome:</b> ${c.nome}</p>
        <p><b>Telefone:</b> ${c.telefone}</p>
        <p><b>Endereço:</b> ${c.endereco}</p>
    `;

    let lista = document.getElementById("historicoCliente");
    lista.innerHTML = "";

    servicos.filter(s => s.clienteId === id).forEach(s=>{
        lista.innerHTML += `<li>🧴 Serviço: ${s.data}</li>`;
    });

    os.filter(o => o.clienteId === id).forEach(o=>{
        lista.innerHTML += `<li>📄 OS: ${o.servico}</li>`;
    });

    financeiro.filter(f => f.clienteId === id).forEach(f=>{
        lista.innerHTML += `<li>💰 ${f.tipo}: R$ ${f.valor}</li>`;
    });

    abrir("detalheCliente");
}

/* ==========================
   SELECTS (CORRIGIDO)
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
   SERVIÇO (CORRIGIDO)
========================== */
function addServico(){

    let clienteId = document.getElementById("clienteServico")?.value;
    let data = document.getElementById("dataServico")?.value;
    let dias = Number(document.getElementById("retornoDias")?.value || 0);

    if(!clienteId || !data){
        return alert("Preencha serviço corretamente");
    }

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

    let clienteId = document.getElementById("clienteOS")?.value;
    let servico = document.getElementById("servicoOS")?.value;

    if(!clienteId || !servico){
        return alert("Preencha OS");
    }

    os.push({
        clienteId,
        servico
    });

    salvar();
    atualizarDashboard();
}

/* ==========================
   FINANCEIRO (CORRIGIDO)
========================== */
function addFinanceiro(){

    let desc = document.getElementById("descFin")?.value;
    let valor = Number(document.getElementById("valorFin")?.value);
    let tipo = document.getElementById("tipoFin")?.value;

    if(!desc || !valor){
        return alert("Preencha financeiro");
    }

    financeiro.push({
        clienteId: clienteSelecionadoId,
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
   SALVAR
========================== */
function salvar(){
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("servicos", JSON.stringify(servicos));
    localStorage.setItem("os", JSON.stringify(os));
    localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* ==========================
   DASHBOARD
========================== */
function atualizarDashboard(){

    document.getElementById("totalClientes").innerText = clientes.length;
    document.getElementById("totalServicos").innerText = servicos.length;
    document.getElementById("totalOS").innerText = os.length;

    let total = financeiro.reduce((acc,f)=>{
        return f.tipo === "entrada" ? acc + f.valor : acc - f.valor;
    },0);

    document.getElementById("saldoTotal").innerText = "R$ " + total.toFixed(2);
}

/* ==========================
   CALENDÁRIO SIMPLES
========================== */
function montarCalendario(){

    let cal = document.getElementById("cal");
    if(!cal) return;

    cal.innerHTML = "";

    servicos.forEach(s=>{
        cal.innerHTML += `
        <div class="dia">
            🧴 Serviço em ${s.data}
        </div>`;
    });
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
        <li>${f.data} - ${f.desc} - R$ ${f.valor}</li>`;
    });
}
