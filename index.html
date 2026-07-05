let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

/* ==========================
   MENU
========================== */
function abrir(secao){

    document.querySelectorAll(".secao")
    .forEach(s => s.classList.add("hidden"));

    document.getElementById(secao).classList.remove("hidden");

    atualizarDashboard();
    montarCalendario();
    atualizarClientes();

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
            ${s.cliente} | ${formatarData(s.data)} | retorno ${formatarData(s.retorno)}
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

    if(!desc.value.trim() || !valor.value)
        return alert("Preencha tudo");

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

    document.getElementById("totalClientes").innerText = clientes.length;
    document.getElementById("totalServicos").innerText = servicos.length;
    document.getElementById("totalOS").innerText = os.length;

    let total = financeiro.reduce((a,b)=>a + b.valor,0);

    document.getElementById("saldoTotal").innerText =
    "R$ " + total.toFixed(2);

}

/* ==========================
   CALENDÁRIO
========================== */
function montarCalendario(){

    let cal = document.getElementById("cal");
    if(!cal) return;

    let hoje = new Date().toISOString().split("T")[0];

    cal.innerHTML = "";

    let datas = {};

    servicos.forEach(s=>{

        if(!datas[s.data]) datas[s.data] = {serv:[], ret:[]};
        datas[s.data].serv.push(s);

        if(!datas[s.retorno]) datas[s.retorno] = {serv:[], ret:[]};
        datas[s.retorno].ret.push(s);

    });

    for(let d in datas){

        let bloco = datas[d];

        let html = `<div class="dia ${d===hoje?'dia-hoje':''}">
        <strong>${formatarData(d)}</strong><br>`;

        bloco.serv.forEach(s=>{
            html += `
            <div class="servico-dia"
            onclick="verCliente(${JSON.stringify(s.cliente)})">
            🔵 ${s.cliente}
            </div>`;
        });

        bloco.ret.forEach(s=>{
            html += `
            <div class="retorno-dia"
            onclick="verCliente(${JSON.stringify(s.cliente)})">
            🟡 ${s.cliente}
            </div>`;
        });

        html += `</div>`;

        cal.innerHTML += html;

    }

}

/* ==========================
   VER CLIENTE
========================== */
function verCliente(nome){

    let c = clientes.find(c => c.nome === nome);

    if(!c){
        alert("Cliente não encontrado");
        return;
    }

    alert(
        "CLIENTE\n\n" +
        "Nome: " + c.nome + "\n" +
        "Telefone: " + c.telefone + "\n" +
        "Endereço: " + c.endereco
    );

}

/* ==========================
   DATA BR
========================== */
function formatarData(data){

    if(!data) return "";

    let partes = data.split("-");
    if(partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

/* ==========================
   ALERTA RETORNO
========================== */
function alertaRetornos(){

    let hoje = new Date().toISOString().split("T")[0];

    let lista = servicos.filter(s => s.retorno === hoje);

    if(lista.length > 0){

        let msg = "RETORNOS DE HOJE:\n\n";

        lista.forEach(s=>{
            msg += "- " + s.cliente + "\n";
        });

        alert(msg);

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
atualizarClientes();
atualizarSelects();
atualizarServicos();
atualizarOS();
atualizarFinanceiro();
atualizarHistorico();
atualizarDashboard();
montarCalendario();

setTimeout(alertaRetornos, 500);
