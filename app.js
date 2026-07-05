let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

/* ==========================
   MENU
========================== */
function abrir(secao){
    document.querySelectorAll(".secao").forEach(s => s.classList.add("hidden"));
    document.getElementById(secao).classList.remove("hidden");

    atualizarDashboard();
    montarCalendario();
}

/* ==========================
   CLIENTES
========================== */
function addCliente(){

    let nome = document.getElementById("nome");
    let telefone = document.getElementById("telefone");
    let endereco = document.getElementById("endereco");

    if(!nome.value.trim()) return alert("Digite o nome");

    clientes.push({
        nome: nome.value,
        telefone: telefone.value,
        endereco: endereco.value
    });

    nome.value = "";
    telefone.value = "";
    endereco.value = "";

    salvar();
    atualizarClientes();
    atualizarSelects();
    atualizarDashboard();
}

function atualizarClientes(){

    let lista = document.getElementById("listaClientes");
    let pesquisa = document.getElementById("pesquisaCliente");

    lista.innerHTML = "";

    let filtro = pesquisa ? pesquisa.value.toLowerCase() : "";

    clientes
    .filter(c => c.nome.toLowerCase().includes(filtro))
    .forEach((c,i)=>{

        lista.innerHTML += `
        <li>
            ${c.nome} - ${c.endereco}
            <button onclick="delCliente(${i})">🗑️</button>
        </li>
        `;

    });
}

function delCliente(i){

    if(confirm("Excluir cliente?")){

        clientes.splice(i,1);

        salvar();
        atualizarClientes();
        atualizarSelects();
        atualizarDashboard();

    }
}

/* ==========================
   SELECTS
========================== */
function atualizarSelects(){

    let s1 = document.getElementById("clienteServico");
    let s2 = document.getElementById("clienteOS");

    s1.innerHTML = "";
    s2.innerHTML = "";

    clientes.forEach(c=>{

        s1.innerHTML += `<option>${c.nome}</option>`;
        s2.innerHTML += `<option>${c.nome}</option>`;

    });
}

/* ==========================
   SERVIÇOS
========================== */
function addServico(){

    let cliente = document.getElementById("clienteServico");
    let data = document.getElementById("dataServico");
    let dias = document.getElementById("retornoDias");

    if(!data.value) return alert("Escolha a data");

    let retorno = new Date(data.value);
    retorno.setDate(retorno.getDate() + Number(dias.value || 0));

    servicos.push({
        cliente: cliente.value,
        data: data.value,
        retorno: retorno.toISOString().split("T")[0]
    });

    cliente.value = "";
    data.value = "";
    dias.value = "";

    salvar();
    atualizarServicos();
    atualizarDashboard();
    montarCalendario();
}

function atualizarServicos(){

    let lista = document.getElementById("listaServicos");

    lista.innerHTML = "";

    servicos.forEach((s,i)=>{

        lista.innerHTML += `
        <li>
            ${s.cliente} | ${s.data} | retorno ${s.retorno}
            <button onclick="delServico(${i})">🗑️</button>
        </li>
        `;

    });

}

function delServico(i){

    if(confirm("Excluir serviço?")){

        servicos.splice(i,1);

        salvar();
        atualizarServicos();
        atualizarDashboard();
        montarCalendario();

    }

}

/* ==========================
   OS
========================== */
function addOS(){

    let cliente = document.getElementById("clienteOS");
    let servico = document.getElementById("servicoOS");

    if(!servico.value.trim()) return alert("Digite o serviço");

    os.push({
        cliente: cliente.value,
        servico: servico.value
    });

    servico.value = "";

    salvar();
    atualizarOS();
    atualizarDashboard();
}

function atualizarOS(){

    let lista = document.getElementById("listaOS");

    lista.innerHTML = "";

    os.forEach((o,i)=>{

        lista.innerHTML += `
        <li>
            ${o.cliente} - ${o.servico}
            <button onclick="delOS(${i})">🗑️</button>
        </li>
        `;

    });

}

function delOS(i){

    if(confirm("Excluir OS?")){

        os.splice(i,1);

        salvar();
        atualizarOS();
        atualizarDashboard();

    }

}

/* ==========================
   FINANCEIRO
========================== */
function addFinanceiro(){

    let desc = document.getElementById("descFin");
    let valor = document.getElementById("valorFin");

    if(!desc.value.trim() || !valor.value) return alert("Preencha tudo");

    financeiro.push({
        desc: desc.value,
        valor: Number(valor.value),
        data: new Date().toLocaleDateString("pt-BR")
    });

    desc.value = "";
    valor.value = "";

    salvar();
    atualizarFinanceiro();
    atualizarHistorico();
    atualizarDashboard();
}

function atualizarFinanceiro(){

    let lista = document.getElementById("listaFin");
    let totalEl = document.getElementById("totalFinanceiro");

    let total = 0;

    lista.innerHTML = "";

    financeiro.forEach(f=>{

        total += f.valor;

        lista.innerHTML += `
        <li>
            ${f.desc} - R$ ${f.valor.toFixed(2)}
        </li>
        `;

    });

    totalEl.innerText = "Total: R$ " + total.toFixed(2);
}

/* ==========================
   HISTÓRICO
========================== */
function atualizarHistorico(){

    let lista = document.getElementById("listaHistorico");

    lista.innerHTML = "";

    financeiro.forEach(f=>{

        lista.innerHTML += `
        <li>
            ${f.data} - ${f.desc} - R$ ${f.valor.toFixed(2)}
        </li>
        `;

    });

}

/* ==========================
   DASHBOARD
========================== */
function atualizarDashboard(){

    let clientesEl = document.getElementById("totalClientes");
    let servicosEl = document.getElementById("totalServicos");
    let osEl = document.getElementById("totalOS");
    let saldoEl = document.getElementById("saldoTotal");

    let total = financeiro.reduce((a,b)=>a+b.valor,0);

    clientesEl.innerText = clientes.length;
    servicosEl.innerText = servicos.length;
    osEl.innerText = os.length;
    saldoEl.innerText = "R$ " + total.toFixed(2);

}

/* ==========================
   CALENDÁRIO (NOVO)
========================== */
function montarCalendario(){

    let cal = document.getElementById("cal");
    if(!cal) return;

    let hoje = new Date().toISOString().split("T")[0];

    let html = "";

    let eventosPorDia = {};

    servicos.forEach(s=>{

        if(!eventosPorDia[s.data]) eventosPorDia[s.data] = {serv:[], ret:[]};

        eventosPorDia[s.data].serv.push(s);

    });

    servicos.forEach(s=>{

        if(!eventosPorDia[s.retorno]) eventosPorDia[s.retorno] = {serv:[], ret:[]};

        eventosPorDia[s.retorno].ret.push(s);

    });

    for(let data in eventosPorDia){

        let bloco = eventosPorDia[data];

        let cor = "#f1f5f9";

        let classes = "dia";

        if(data === hoje) classes += " dia-hoje";

        html += `<div class="${classes}">`;
        html += `<strong>${data}</strong>`;

        bloco.serv.forEach(s=>{
            html += `<div class="servico-dia">🔵 ${s.cliente}</div>`;
        });

        bloco.ret.forEach(s=>{
            html += `<div class="retorno-dia">🟡 ${s.cliente}</div>`;
        });

        html += `</div>`;

    }

    cal.innerHTML = html;

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
atualizarClientes();
atualizarSelects();
atualizarServicos();
atualizarOS();
atualizarFinanceiro();
atualizarHistorico();
atualizarDashboard();
montarCalendario();
