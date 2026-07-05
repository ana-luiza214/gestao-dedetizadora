let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteSelecionadoId = null;
let clienteEditandoId = null;

/* calendário */
let modoCalendario = "mes";
let dataBase = new Date();

/* =========================
   SALVAR
========================= */

function salvar(){
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("servicos", JSON.stringify(servicos));
    localStorage.setItem("os", JSON.stringify(os));
    localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* =========================
   NAVEGAÇÃO
========================= */

function abrir(id){

    document.querySelectorAll(".secao").forEach(s=>{
        s.classList.add("hidden");
    });

    const alvo = document.getElementById(id);
    if(alvo) alvo.classList.remove("hidden");

    render();
}

/* =========================
   RENDER
========================= */

function render(){
    atualizarDashboard();
    atualizarClientes();
    atualizarServicos();
    atualizarOS();
    atualizarFinanceiro();
    montarCalendario();
    preencherClientes();
}

/* =========================
   DASHBOARD
========================= */

function atualizarDashboard(){

    document.getElementById("totalClientes").textContent = clientes.length;
    document.getElementById("totalServicos").textContent = servicos.length;
    document.getElementById("totalOS").textContent = os.length;

    let saldo = 0;

    financeiro.forEach(f=>{
        saldo += f.tipo === "entrada" ? Number(f.valor) : -Number(f.valor);
    });

    document.getElementById("saldoTotal").textContent =
        "R$ " + saldo.toFixed(2).replace(".", ",");
}

/* =========================
   CLIENTES
========================= */

function addCliente(){

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    if(!nome || !telefone || !endereco) return alert("Preencha tudo");

    clientes.push({
        id: Date.now().toString(),
        nome,
        telefone,
        endereco
    });

    salvar();
    render();

    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("endereco").value = "";
}

function atualizarClientes(){

    const lista = document.getElementById("listaClientes");
    if(!lista) return;

    const filtro = document.getElementById("pesquisaCliente")?.value.toLowerCase() || "";

    lista.innerHTML = "";

    clientes
    .filter(c=>c.nome.toLowerCase().includes(filtro))
    .forEach(c=>{

        lista.innerHTML += `
        <li>
            <span onclick="verCliente('${c.id}')">${c.nome}</span>
            <div>
                <button class="btn-edit" onclick="editarCliente('${c.id}')">✏️</button>
                <button class="btn-delete" onclick="delCliente('${c.id}')">🗑️</button>
            </div>
        </li>`;
    });
}

function delCliente(id){

    clientes = clientes.filter(c=>c.id!==id);
    servicos = servicos.filter(s=>s.clienteId!==id);
    os = os.filter(o=>o.clienteId!==id);
    financeiro = financeiro.filter(f=>f.clienteId!==id);

    salvar();
    render();
}

/* =========================
   SERVIÇOS
========================= */

function addServico(){

    const clienteId = document.getElementById("clienteServico").value;
    const data = document.getElementById("dataServico").value;
    const dias = Number(document.getElementById("retornoDias").value || 0);

    if(!clienteId || !data) return alert("Preencha tudo");

    let retorno = new Date(data);
    retorno.setDate(retorno.getDate() + dias);

    servicos.push({
        id: Date.now().toString(),
        clienteId,
        data,
        retorno: retorno.toISOString().split("T")[0]
    });

    salvar();
    render();
}

function atualizarServicos(){

    const lista = document.getElementById("listaServicos");
    if(!lista) return;

    lista.innerHTML = "";

    servicos.forEach((s,i)=>{

        const c = clientes.find(x=>x.id===s.clienteId);

        lista.innerHTML += `
        <li>
            <span>
                ${c?.nome || "Cliente"}<br>
                ${s.data} → ${s.retorno}
            </span>
            <button class="btn-delete" onclick="delServico(${i})">🗑️</button>
        </li>`;
    });
}

function delServico(i){
    servicos.splice(i,1);
    salvar();
    render();
}

/* =========================
   OS
========================= */

function addOS(){

    const clienteId = document.getElementById("clienteOS").value;
    const servico = document.getElementById("servicoOS").value;

    if(!clienteId || !servico) return alert("Preencha tudo");

    os.push({
        id: Date.now().toString(),
        clienteId,
        servico,
        data: new Date().toISOString().split("T")[0]
    });

    salvar();
    render();
}

function atualizarOS(){

    const lista = document.getElementById("listaOS");
    if(!lista) return;

    lista.innerHTML = "";

    os.forEach((o,i)=>{

        const c = clientes.find(x=>x.id===o.clienteId);

        lista.innerHTML += `
        <li>
            <span>
                ${c?.nome || "Cliente"}<br>
                ${o.servico}
            </span>
            <button class="btn-delete" onclick="delOS(${i})">🗑️</button>
        </li>`;
    });
}

function delOS(i){
    os.splice(i,1);
    salvar();
    render();
}

/* =========================
   FINANCEIRO
========================= */

function addFinanceiro(){

    const desc = document.getElementById("descFin").value;
    const valor = Number(document.getElementById("valorFin").value);
    const tipo = document.getElementById("tipoFin").value;

    if(!desc || isNaN(valor)) return alert("Preencha tudo");

    financeiro.push({
        id: Date.now().toString(),
        clienteId: clienteSelecionadoId,
        desc,
        valor,
        tipo
    });

    salvar();
    render();
}

function atualizarFinanceiro(){

    const lista = document.getElementById("listaFin");
    const total = document.getElementById("totalFinanceiro");

    if(!lista) return;

    lista.innerHTML = "";

    let saldo = 0;

    financeiro.forEach((f,i)=>{

        saldo += f.tipo==="entrada" ? Number(f.valor) : -Number(f.valor);

        lista.innerHTML += `
        <li>
            <span>${f.desc} - R$ ${Number(f.valor).toFixed(2)}</span>
            <button class="btn-delete" onclick="delFinanceiro(${i})">🗑️</button>
        </li>`;
    });

    if(total){
        total.textContent = "Saldo: R$ " + saldo.toFixed(2);
    }
}

function delFinanceiro(i){
    financeiro.splice(i,1);
    salvar();
    render();
}

/* =========================
   CALENDÁRIO
========================= */

function trocarModoCalendario(){
    modoCalendario = document.getElementById("modoCalendario").value;
    montarCalendario();
}

function periodoAnterior(){
    if(modoCalendario==="mes") dataBase.setMonth(dataBase.getMonth()-1);
    if(modoCalendario==="semana") dataBase.setDate(dataBase.getDate()-7);
    if(modoCalendario==="ano") dataBase.setFullYear(dataBase.getFullYear()-1);
    montarCalendario();
}

function proximoPeriodo(){
    if(modoCalendario==="mes") dataBase.setMonth(dataBase.getMonth()+1);
    if(modoCalendario==="semana") dataBase.setDate(dataBase.getDate()+7);
    if(modoCalendario==="ano") dataBase.setFullYear(dataBase.getFullYear()+1);
    montarCalendario();
}

function montarCalendario(){

    const cal = document.getElementById("cal");
    if(!cal) return;

    cal.innerHTML = "";

    const dias = {};

    servicos.forEach(s=>{

        const d = new Date(s.data);

        let ok = false;

        if(modoCalendario==="mes")
            ok = d.getMonth()===dataBase.getMonth() && d.getFullYear()===dataBase.getFullYear();

        if(modoCalendario==="semana"){
            const ini = new Date(dataBase);
            ini.setDate(ini.getDate()-ini.getDay());

            const fim = new Date(ini);
            fim.setDate(fim.getDate()+6);

            ok = d>=ini && d<=fim;
        }

        if(modoCalendario==="ano")
            ok = d.getFullYear()===dataBase.getFullYear();

        if(!ok) return;

        const c = clientes.find(x=>x.id===s.clienteId);

        if(!dias[s.data]) dias[s.data]=[];

        dias[s.data].push("🔵 "+(c?.nome||"Cliente"));

        if(s.retorno){
            if(!dias[s.retorno]) dias[s.retorno]=[];
            dias[s.retorno].push("🟡 Retorno "+(c?.nome||"Cliente"));
        }
    });

    Object.keys(dias).sort().forEach(d=>{
        cal.innerHTML += `
        <div class="dia">
            <b>${d}</b>
            ${dias[d].map(x=>`<div>${x}</div>`).join("")}
        </div>`;
    });
}

/* =========================
   SELECT CLIENTES
========================= */

function preencherClientes(){

    const s1 = document.getElementById("clienteServico");
    const s2 = document.getElementById("clienteOS");

    [s1,s2].forEach(sel=>{
        if(!sel) return;

        sel.innerHTML = `<option disabled selected>Selecione</option>`;

        clientes.forEach(c=>{
            sel.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });
    });
}

/* =========================
   INÍCIO
========================= */

window.addEventListener("load",()=>{
    abrir("dashboard");
});
