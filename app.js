

/* ==========================================
   DADOS
========================================== */

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteSelecionadoId = null;
let clienteEditandoId = null;

/* ==========================================
   SALVAR
========================================== */

function salvar(){
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("servicos", JSON.stringify(servicos));
    localStorage.setItem("os", JSON.stringify(os));
    localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* ==========================================
   NAVEGAÇÃO
========================================== */

function abrir(id){

    document.querySelectorAll(".secao").forEach(s=>{
        s.classList.add("hidden");
    });

    const modal = document.getElementById("modalCliente");
    if(modal) modal.classList.add("hidden");

    const alvo = document.getElementById(id);
    if(alvo) alvo.classList.remove("hidden");

    render();
}

/* ==========================================
   RENDER GERAL
========================================== */

function render(){
    atualizarDashboard();
    atualizarClientes();
    atualizarServicos();
    atualizarOS();
    atualizarFinanceiro();
    montarCalendario();
    preencherClientes();
}

/* ==========================================
   DASHBOARD
========================================== */

function atualizarDashboard(){

    const c = document.getElementById("totalClientes");
    const s = document.getElementById("totalServicos");
    const o = document.getElementById("totalOS");
    const f = document.getElementById("saldoTotal");

    if(c) c.textContent = clientes.length;
    if(s) s.textContent = servicos.length;
    if(o) o.textContent = os.length;

    let saldo = 0;

    financeiro.forEach(x=>{
        saldo += x.tipo === "entrada" ? Number(x.valor) : -Number(x.valor);
    });

    if(f) f.textContent = "R$ " + saldo.toFixed(2).replace(".", ",");
}

/* ==========================================
   CLIENTES
========================================== */

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
    .filter(c => c.nome.toLowerCase().includes(filtro))
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

    if(!confirm("Excluir cliente?")) return;

    clientes = clientes.filter(c=>c.id!==id);
    servicos = servicos.filter(s=>s.clienteId!==id);
    os = os.filter(o=>o.clienteId!==id);
    financeiro = financeiro.filter(f=>f.clienteId!==id);

    salvar();
    render();
}

function verCliente(id){

    const c = clientes.find(x=>x.id===id);
    if(!c) return;

    clienteSelecionadoId = id;

    document.getElementById("infoCliente").innerHTML = `
        <b>${c.nome}</b><br>
        ${c.telefone}<br>
        ${c.endereco}
    `;

    abrir("detalheCliente");
}

function editarCliente(id){

    const c = clientes.find(x=>x.id===id);
    if(!c) return;

    clienteEditandoId = id;

    document.getElementById("editNome").value = c.nome;
    document.getElementById("editTelefone").value = c.telefone;
    document.getElementById("editEndereco").value = c.endereco;

    abrir("editarCliente");
}

function salvarEdicaoCliente(){

    const c = clientes.find(x=>x.id===clienteEditandoId);
    if(!c) return;

    c.nome = document.getElementById("editNome").value;
    c.telefone = document.getElementById("editTelefone").value;
    c.endereco = document.getElementById("editEndereco").value;

    salvar();
    render();
    abrir("clientes");
}

/* ==========================================
   SERVIÇOS
========================================== */

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
                ${s.data} - retorno ${s.retorno || ""}
            </span>
            <div>
                <button class="btn-delete" onclick="delServico(${i})">🗑️</button>
            </div>
        </li>`;
    });
}

function delServico(i){
    servicos.splice(i,1);
    salvar();
    render();
}

/* ==========================================
   OS
========================================== */

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
            <div>
                <button class="btn-delete" onclick="delOS(${i})">🗑️</button>
            </div>
        </li>`;
    });
}

function delOS(i){
    os.splice(i,1);
    salvar();
    render();
}

/* ==========================================
   FINANCEIRO
========================================== */

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

    if(total) total.textContent = "Saldo: R$ " + saldo.toFixed(2);
}

function addFinanceiro(){

    const desc = document.getElementById("descFin").value;
    const valor = Number(document.getElementById("valorFin").value);
    const tipo = document.getElementById("tipoFin").value;

    if(!desc || isNaN(valor)) return alert("Preencha");

    financeiro.push({
        id: Date.now().toString(),
        clienteId: clienteSelecionadoId,
        desc,
        valor,
        tipo,
        data: new Date().toISOString().split("T")[0]
    });

    salvar();
    render();
}

function delFinanceiro(i){
    financeiro.splice(i,1);
    salvar();
    render();
}

/* ==========================================
   CALENDÁRIO
========================================== */

function montarCalendario(){

    const cal = document.getElementById("cal");
    if(!cal) return;

    cal.innerHTML = "";

    const dias = {};

    servicos.forEach(s=>{

        const c = clientes.find(x=>x.id===s.clienteId);

        if(!dias[s.data]) dias[s.data]=[];

        dias[s.data].push("🔵 "+(c?.nome||"Cliente"));

        if(s.retorno){
            if(!dias[s.retorno]) dias[s.retorno]=[];
            dias[s.retorno].push("🟡 retorno "+(c?.nome||"Cliente"));
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

/* ==========================================
   CLIENTES SELECT
========================================== */

function preencherClientes(){

    const selects = [
        document.getElementById("clienteServico"),
        document.getElementById("clienteOS")
    ];

    selects.forEach(sel=>{
        if(!sel) return;

        sel.innerHTML = `<option value="">Selecione</option>`;

        clientes.forEach(c=>{
            sel.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });
    });
}

/* ==========================================
   INICIAL
========================================== */

window.addEventListener("load",()=>{
    abrir("dashboard");
});
