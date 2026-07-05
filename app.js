/* ==========================
   DADOS
========================== */
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteSelecionadoId = null;
let clienteEditandoId = null;

/* ==========================
   SALVAR NO LOCALSTORAGE
========================== */
function salvar(){
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("servicos", JSON.stringify(servicos));
    localStorage.setItem("os", JSON.stringify(os));
    localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* ==========================
   NAVEGAÇÃO DE TELAS
========================== */
function abrir(id){
    document.querySelectorAll(".secao").forEach(sec => {
        sec.classList.add("hidden");
    });

    let alvo = document.getElementById(id);
    if(alvo) alvo.classList.remove("hidden");

    render();
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

    let nome = document.getElementById("nome").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let endereco = document.getElementById("endereco").value.trim();

    if(!nome || !telefone || !endereco){
        return alert("Preencha todos os campos");
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
    limparCamposCliente();
    render();
}

/* ==========================
   LIMPAR CAMPOS
========================== */
function limparCamposCliente(){
    ["nome","telefone","endereco"].forEach(id=>{
        let el = document.getElementById(id);
        if(el) el.value = "";
    });
}

/* ==========================
   ATUALIZAR CLIENTES
========================== */
function atualizarClientes(){

    let lista = document.getElementById("listaClientes");
    if(!lista) return;

    let filtro = document.getElementById("pesquisaCliente").value.toLowerCase();

    lista.innerHTML = "";

    clientes
    .filter(c => c.nome.toLowerCase().includes(filtro))
    .forEach(c=>{
        lista.innerHTML += `
        <li>
            <span onclick="verCliente('${c.id}')">
                ${c.nome}
            </span>

            <div>
                <button class="btn-edit" onclick="editarCliente('${c.id}')">✏️</button>
                <button class="btn-delete" onclick="delCliente('${c.id}')">🗑️</button>
            </div>
        </li>`;
    });
}

/* ==========================
   DELETE CLIENTE
========================== */
function delCliente(id){
    if(!confirm("Excluir cliente?")) return;

    clientes = clientes.filter(c => c.id !== id);
    salvar();
    render();
}

/* ==========================
   VER CLIENTE
========================== */
function verCliente(id){

    let c = clientes.find(x => x.id === id);
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
   EDITAR CLIENTE
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
   SALVAR EDIÇÃO CLIENTE
========================== */
function salvarEdicaoCliente(){

    let c = clientes.find(x => x.id === clienteEditandoId);
    if(!c) return;

    c.nome = document.getElementById("editNome").value;
    c.telefone = document.getElementById("editTelefone").value;
    c.endereco = document.getElementById("editEndereco").value;

    salvar();
    render();
    abrir("clientes");
}

/* ==========================
   FINANCEIRO
========================== */
function addFinanceiro(){

    let desc = document.getElementById("descFin").value;
    let valor = Number(document.getElementById("valorFin").value);
    let tipo = document.getElementById("tipoFin").value;

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

        total += f.tipo === "entrada" ? f.valor : -f.valor;

        lista.innerHTML += `
        <li>
            ${f.desc} - ${f.tipo} - R$ ${f.valor}
            <button class="btn-delete" onclick="delFinanceiro(${i})">🗑️</button>
        </li>`;
    });

    if(totalEl){
        totalEl.innerText = "Saldo: R$ " + total.toFixed(2);
    }
}

/* ==========================
   DELETE FINANCEIRO
========================== */
function delFinanceiro(index){
    if(!confirm("Excluir lançamento?")) return;

    financeiro.splice(index,1);
    salvar();
    render();
}

/* ==========================
   SERVIÇO
========================== */
function addServico(){

    let clienteId = document.getElementById("clienteServico").value;
    let data = document.getElementById("dataServico").value;
    let retornoDias = Number(document.getElementById("retornoDias").value || 0);

    if(!clienteId || !data) return alert("Preencha");

    let retorno = new Date(data);
    retorno.setDate(retorno.getDate() + retornoDias);

    servicos.push({
        id: Date.now().toString(),
        clienteId,
        data,
        retorno: retorno.toISOString().split("T")[0]
    });

    salvar();
    render();
}

/* ==========================
   OS
========================== */
function addOS(){

    let clienteId = document.getElementById("clienteOS").value;
    let servico = document.getElementById("servicoOS").value;

    if(!clienteId || !servico) return alert("Preencha");

    os.push({
        id: Date.now().toString(),
        clienteId,
        servico,
        data: new Date().toISOString().split("T")[0]
    });

    salvar();
    render();
}

/* ==========================
   PREENCHER SELECTS
========================== */
function preencherClientes(){

    let selects = [
        document.getElementById("clienteServico"),
        document.getElementById("clienteOS")
    ];

    selects.forEach(sel=>{
        if(!sel) return;

        sel.innerHTML = "";

        clientes.forEach(c=>{
            sel.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });
    });
}

/* ==========================
   CALENDÁRIO
========================== */
function montarCalendario(){

    let cal = document.getElementById("cal");
    if(!cal) return;

    cal.innerHTML = "";

    let datas = {};

    servicos.forEach(s=>{

        let c = clientes.find(x => x.id === s.clienteId);

        if(!datas[s.data]) datas[s.data] = {serv:[], ret:[]};

        datas[s.data].serv.push({
            ...s,
            cliente: c?.nome || "Cliente"
        });

        if(s.retorno){
            if(!datas[s.retorno]) datas[s.retorno] = {serv:[], ret:[]};

            datas[s.retorno].ret.push({
                ...s,
                cliente: c?.nome || "Cliente"
            });
        }
    });

    Object.keys(datas).sort().forEach(d=>{
        let bloco = datas[d];

        cal.innerHTML += `<div class="dia"><b>${d}</b>`;

        bloco.serv.forEach(s=>{
            cal.innerHTML += `<div>🔵 ${s.cliente}</div>`;
        });

        bloco.ret.forEach(s=>{
            cal.innerHTML += `<div>🟡 RETORNO - ${s.cliente}</div>`;
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
    montarCalendario();
    preencherClientes();
}
