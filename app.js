let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteSelecionadoId = null;

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
   CLIENTE DUPLICADO
========================== */
function clienteDuplicado(nome, telefone, endereco){
    return clientes.some(c =>
        c.nome.toLowerCase() === nome.toLowerCase() ||
        c.telefone === telefone ||
        c.endereco.toLowerCase() === endereco.toLowerCase()
    );
}

/* ==========================
   ADD CLIENTE
========================== */
function addCliente(){

    let nome = document.getElementById("nome")?.value.trim();
    let telefone = document.getElementById("telefone")?.value.trim();
    let endereco = document.getElementById("endereco")?.value.trim();

    if(!nome || !telefone || !endereco){
        return alert("Preencha tudo");
    }

    if(clienteDuplicado(nome, telefone, endereco)){
        return alert("Cliente já existe");
    }

    clientes.push({
        id: Date.now().toString(),
        nome,
        telefone,
        endereco
    });

    salvar();
    limpar();
    render();
}

/* ==========================
   LIMPAR
========================== */
function limpar(){
    ["nome","telefone","endereco"].forEach(id=>{
        let el = document.getElementById(id);
        if(el) el.value = "";
    });
}

/* ==========================
   LISTA CLIENTES
========================== */
function atualizarClientes(){

    let lista = document.getElementById("listaClientes");
    if(!lista) return;

    lista.innerHTML = "";

    clientes.forEach(c=>{
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
   DELETE CLIENTE
========================== */
function delCliente(id){
    if(!confirm("Excluir cliente?")) return;

    clientes = clientes.filter(c=>c.id!==id);
    salvar();
    render();
}

/* ==========================
   VER CLIENTE
========================== */
function verCliente(id){

    let c = clientes.find(x=>x.id===id);
    if(!c) return;

    clienteSelecionadoId = id;

    document.getElementById("infoCliente").innerHTML = `
        <b>${c.nome}</b><br>
        ${c.telefone}<br>
        ${c.endereco}
    `;

    abrir("detalheCliente");
}

/* ==========================
   FINANCEIRO DELETE
========================== */
function delFinanceiro(index){

    if(!confirm("Excluir lançamento?")) return;

    financeiro.splice(index,1);
    salvar();
    render();
}

/* ==========================
   FINANCEIRO
========================== */
function addFinanceiro(){

    let desc = document.getElementById("descFin")?.value;
    let valor = Number(document.getElementById("valorFin")?.value);
    let tipo = document.getElementById("tipoFin")?.value;

    if(!desc || !valor) return alert("Preencha");

    financeiro.push({
        clienteId: clienteSelecionadoId,
        desc,
        valor,
        tipo,
        data: new Date().toISOString().split("T")[0]
    });

    salvar();
    render();
}

/* ==========================
   LISTA FINANCEIRO
========================== */
function atualizarFinanceiro(){

    let lista = document.getElementById("listaFin");
    let totalEl = document.getElementById("totalFinanceiro");

    if(!lista) return;

    lista.innerHTML = "";

    let total = 0;

    financeiro.forEach((f,i)=>{

        total += f.tipo==="entrada" ? f.valor : -f.valor;

        lista.innerHTML += `
        <li>
            ${f.desc} - ${f.tipo} - R$ ${f.valor}

            <button onclick="delFinanceiro(${i})">🗑️</button>
        </li>`;
    });

    totalEl.innerText = "Saldo: R$ " + total.toFixed(2);
}

/* ==========================
   CALENDÁRIO (SEMANAL / MENSAL / ANUAL)
========================== */
let modoCalendario = "semanal";

function setCalendarioModo(modo){
    modoCalendario = modo;
    montarCalendario();
}

function montarCalendario(){

    let cal = document.getElementById("cal");
    if(!cal) return;

    cal.innerHTML = "";

    let datas = {};

    servicos.forEach(s=>{

        if(!datas[s.data]) datas[s.data] = {serv:[], ret:[]};

        let c = clientes.find(x=>x.id===s.clienteId);

        datas[s.data].serv.push({
            ...s,
            cliente: c?.nome || "Cliente"
        });

        if(!datas[s.retorno]) datas[s.retorno] = {serv:[], ret:[]};

        datas[s.retorno].ret.push({
            ...s,
            cliente: c?.nome || "Cliente"
        });
    });

    let keys = Object.keys(datas).sort();

    keys.forEach(d=>{

        let bloco = datas[d];

        cal.innerHTML += `
        <div class="dia">
            <b>${d}</b>
        `;

        bloco.serv.forEach(s=>{
            cal.innerHTML += `
            <div style="background:#2563eb;color:white;padding:5px;margin-top:5px;border-radius:6px;cursor:pointer"
                 onclick="verCliente('${s.clienteId}')">
                🔵 ${s.cliente}
            </div>`;
        });

        bloco.ret.forEach(s=>{
            cal.innerHTML += `
            <div style="background:#facc15;color:black;padding:5px;margin-top:5px;border-radius:6px;cursor:pointer"
                 onclick="verCliente('${s.clienteId}')">
                🟡 RETORNO - ${s.cliente}
            </div>`;
        });

        cal.innerHTML += `</div>`;
    });
}

/* ==========================
   RENDER GERAL
========================== */
function render(){
    atualizarClientes();
    atualizarFinanceiro();
    atualizarDashboard();
    montarCalendario();
}
