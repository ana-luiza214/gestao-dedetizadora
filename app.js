let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteEditandoId = null;
let clienteSelecionadoId = null;

/* ==========================
   UTIL
========================== */
function salvar(){
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("servicos", JSON.stringify(servicos));
    localStorage.setItem("os", JSON.stringify(os));
    localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* ==========================
   NAVEGAÇÃO SEGURA
========================== */
function abrir(secao){

    document.querySelectorAll(".secao").forEach(s=>{
        if(s) s.classList.add("hidden");
    });

    let el = document.getElementById(secao);
    if(el) el.classList.remove("hidden");

    renderTudo();
}

/* ==========================
   RENDER CENTRAL (IMPORTANTE)
========================== */
function renderTudo(){
    atualizarClientes();
    atualizarSelects();
    atualizarFinanceiro();
    atualizarHistorico();
    atualizarDashboard();
    montarCalendarioSemanal();
}

/* ==========================
   CLIENTE (CRIAR)
========================== */
function addCliente(){

    let nome = document.getElementById("nome")?.value.trim();
    let telefone = document.getElementById("telefone")?.value.trim();
    let endereco = document.getElementById("endereco")?.value.trim();

    if(!nome || !telefone || !endereco){
        return alert("Preencha tudo");
    }

    clientes.push({
        id: Date.now().toString(),
        nome,
        telefone,
        endereco
    });

    salvar();
    limparInputs();
    renderTudo();
}

/* ==========================
   LIMPAR
========================== */
function limparInputs(){
    ["nome","telefone","endereco"].forEach(id=>{
        let el = document.getElementById(id);
        if(el) el.value = "";
    });
}

/* ==========================
   LISTA CLIENTES (CORRIGIDO CLICK)
========================== */
function atualizarClientes(){

    let lista = document.getElementById("listaClientes");
    if(!lista) return;

    lista.innerHTML = "";

    let filtro = document.getElementById("pesquisaCliente")?.value.toLowerCase() || "";

    clientes
    .filter(c => c.nome.toLowerCase().includes(filtro))
    .forEach(c=>{

        lista.innerHTML += `
        <li>
            <span onclick="verCliente('${c.id}')" style="cursor:pointer">
                ${c.nome}
            </span>

            <div>
                <button onclick="editarCliente('${c.id}')">✏️</button>
                <button onclick="delCliente('${c.id}')">🗑️</button>
            </div>
        </li>`;
    });
}

/* ==========================
   DELETE CLIENTE (FORÇADO REFRESH)
========================== */
function delCliente(id){

    if(!confirm("Excluir cliente?")) return;

    clientes = clientes.filter(c => c.id !== id);

    salvar();
    renderTudo();
}

/* ==========================
   EDITAR CLIENTE (CORRIGIDO)
========================== */
function editarCliente(id){

    let c = clientes.find(x => x.id === id);
    if(!c) return;

    clienteEditandoId = id;

    document.getElementById("editNome").value = c.nome;
    document.getElementById("editTelefone").value = c.telefone;
    document.getElementById("editEndereco").value = c.endereco;

    abrir("editarCliente");
}

/* ==========================
   SALVAR EDIÇÃO
========================== */
function salvarEdicaoCliente(){

    let c = clientes.find(x => x.id === clienteEditandoId);
    if(!c) return;

    c.nome = document.getElementById("editNome").value;
    c.telefone = document.getElementById("editTelefone").value;
    c.endereco = document.getElementById("editEndereco").value;

    salvar();
    clienteEditandoId = null;

    renderTudo();
    abrir("clientes");
}

/* ==========================
   VER CLIENTE (FICHA)
========================== */
function verCliente(id){

    clienteSelecionadoId = id;

    let c = clientes.find(x => x.id === id);
    if(!c) return;

    document.getElementById("infoCliente").innerHTML = `
        <b>${c.nome}</b><br>
        ${c.telefone}<br>
        ${c.endereco}
    `;

    let lista = document.getElementById("historicoCliente");
    lista.innerHTML = "";

    servicos.filter(s=>s.clienteId===id).forEach(s=>{
        lista.innerHTML += `<li>🧴 Serviço: ${s.data}</li>`;
    });

    os.filter(o=>o.clienteId===id).forEach(o=>{
        lista.innerHTML += `<li>📄 OS: ${o.servico}</li>`;
    });

    financeiro.filter(f=>f.clienteId===id).forEach(f=>{
        lista.innerHTML += `<li>💰 ${f.tipo}: R$ ${f.valor}</li>`;
    });

    abrir("detalheCliente");
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
   SERVIÇO
========================== */
function addServico(){

    let clienteId = document.getElementById("clienteServico")?.value;
    let data = document.getElementById("dataServico")?.value;
    let dias = Number(document.getElementById("retornoDias")?.value || 0);

    if(!clienteId || !data) return alert("Preencha serviço");

    let retorno = new Date(data);
    retorno.setDate(retorno.getDate()+dias);

    servicos.push({
        clienteId,
        data,
        retorno: retorno.toISOString().split("T")[0]
    });

    salvar();
    renderTudo();
}

/* ==========================
   OS
========================== */
function addOS(){

    let clienteId = document.getElementById("clienteOS")?.value;
    let servico = document.getElementById("servicoOS")?.value;

    if(!clienteId || !servico) return alert("Preencha OS");

    os.push({clienteId, servico});

    salvar();
    renderTudo();
}

/* ==========================
   FINANCEIRO (CORRIGIDO TOTAL)
========================== */
function addFinanceiro(){

    let desc = document.getElementById("descFin")?.value;
    let valor = Number(document.getElementById("valorFin")?.value);
    let tipo = document.getElementById("tipoFin")?.value;

    if(!desc || !valor) return alert("Preencha financeiro");

    financeiro.push({
        clienteId: clienteSelecionadoId,
        desc,
        valor,
        tipo,
        data: new Date().toISOString().split("T")[0]
    });

    salvar();
    renderTudo();
}

/* ==========================
   FINANCEIRO
========================== */
function atualizarFinanceiro(){

    let lista = document.getElementById("listaFin");
    let totalEl = document.getElementById("totalFinanceiro");

    if(!lista || !totalEl) return;

    lista.innerHTML = "";

    let total = 0;

    financeiro.forEach(f=>{
        total += f.tipo==="entrada" ? f.valor : -f.valor;

        lista.innerHTML += `
        <li>
            ${f.desc} - ${f.tipo} - R$ ${f.valor}
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
        lista.innerHTML += `<li>${f.data} - ${f.desc}</li>`;
    });
}

/* ==========================
   DASHBOARD
========================== */
function atualizarDashboard(){

    document.getElementById("totalClientes").innerText = clientes.length;
    document.getElementById("totalServicos").innerText = servicos.length;
    document.getElementById("totalOS").innerText = os.length;

    let total = financeiro.reduce((a,f)=>{
        return f.tipo==="entrada" ? a+f.valor : a-f.valor;
    },0);

    document.getElementById("saldoTotal").innerText =
        "R$ " + total.toFixed(2);
}

/* ==========================
   CALENDÁRIO SEMANAL (NOVO)
========================== */
function montarCalendarioSemanal(){

    let cal = document.getElementById("cal");
    if(!cal) return;

    cal.innerHTML = "";

    let hoje = new Date();

    for(let i=0;i<7;i++){

        let d = new Date();
        d.setDate(hoje.getDate()+i);

        let dataStr = d.toISOString().split("T")[0];

        let itens = servicos.filter(s=>s.data===dataStr);

        let html = `<div class="dia">
            <b>${dataStr}</b>`;

        itens.forEach(s=>{
            let cliente = clientes.find(c=>c.id===s.clienteId);

            html += `<div>
                🧴 ${cliente?.nome || "Cliente"}
            </div>`;
        });

        html += `</div>`;

        cal.innerHTML += html;
    }
}
