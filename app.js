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

function salvar() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("servicos", JSON.stringify(servicos));
    localStorage.setItem("os", JSON.stringify(os));
    localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

/* ==========================================
   DASHBOARD
========================================== */

function atualizarDashboard() {

    const totalClientes = document.getElementById("totalClientes");
    const totalServicos = document.getElementById("totalServicos");
    const totalOS = document.getElementById("totalOS");
    const saldoTotal = document.getElementById("saldoTotal");

    if (totalClientes)
        totalClientes.textContent = clientes.length;

    if (totalServicos)
        totalServicos.textContent = servicos.length;

    if (totalOS)
        totalOS.textContent = os.length;

    let saldo = 0;

    financeiro.forEach(f => {
        saldo += f.tipo === "entrada"
            ? Number(f.valor)
            : -Number(f.valor);
    });

    if (saldoTotal)
        saldoTotal.textContent =
            "R$ " + saldo.toFixed(2).replace(".", ",");
}

/* ==========================================
   NAVEGAÇÃO
========================================== */

function abrir(id) {

    document.querySelectorAll(".secao").forEach(sec => {
        sec.classList.add("hidden");
    });

    const tela = document.getElementById(id);

    if (tela)
        tela.classList.remove("hidden");

    render();
}

/* ==========================================
   CLIENTE DUPLICADO
========================================== */

function clienteDuplicado(nome, telefone, endereco) {

    return clientes.some(c =>
        c.nome.toLowerCase() === nome.toLowerCase() ||
        c.telefone === telefone ||
        c.endereco.toLowerCase() === endereco.toLowerCase()
    );

}

/* ==========================================
   LIMPAR CAMPOS
========================================== */

function limparCamposCliente() {

    ["nome", "telefone", "endereco"].forEach(id => {

        const campo = document.getElementById(id);

        if (campo)
            campo.value = "";

    });

}

/* ==========================================
   ADICIONAR CLIENTE
========================================== */

function addCliente() {

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    if (!nome || !telefone || !endereco) {

        alert("Preencha todos os campos.");
        return;

    }

    if (clienteDuplicado(nome, telefone, endereco)) {

        alert("Cliente já cadastrado.");
        return;

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

/* ==========================================
   LISTA CLIENTES
========================================== */

function atualizarClientes() {

    const lista = document.getElementById("listaClientes");

    if (!lista)
        return;

    const pesquisa = document.getElementById("pesquisaCliente");

    const filtro = pesquisa
        ? pesquisa.value.toLowerCase()
        : "";

    lista.innerHTML = "";

    clientes
        .filter(c =>
            c.nome.toLowerCase().includes(filtro)
        )
        .forEach(c => {

            lista.innerHTML += `
            <li>

                <span onclick="verCliente('${c.id}')">

                    ${c.nome}

                </span>

                <div>

                    <button
                        class="btn-edit"
                        onclick="editarCliente('${c.id}')">

                        ✏️

                    </button>

                    <button
                        class="btn-delete"
                        onclick="delCliente('${c.id}')">

                        🗑️

                    </button>

                </div>

            </li>`;

        });

}

/* ==========================================
   EXCLUIR CLIENTE
========================================== */

function delCliente(id) {

    if (!confirm("Excluir cliente?"))
        return;

    clientes = clientes.filter(c => c.id !== id);

    servicos = servicos.filter(s => s.clienteId !== id);

    os = os.filter(o => o.clienteId !== id);

    financeiro = financeiro.filter(f => f.clienteId !== id);

    salvar();

    render();

}

/* ==========================================
   VER CLIENTE
========================================== */

function verCliente(id) {

    const cliente = clientes.find(c => c.id === id);

    if (!cliente)
        return;

    clienteSelecionadoId = id;

    document.getElementById("infoCliente").innerHTML = `

        <strong>${cliente.nome}</strong><br>

        📞 ${cliente.telefone}<br>

        📍 ${cliente.endereco}

    `;

    atualizarHistoricoCliente();

    abrir("detalheCliente");

}

/* ==========================================
   EDITAR CLIENTE
========================================== */

function editarCliente(id) {

    const cliente = clientes.find(c => c.id === id);

    if (!cliente)
        return;

    clienteEditandoId = id;

    document.getElementById("editNome").value = cliente.nome;
    document.getElementById("editTelefone").value = cliente.telefone;
    document.getElementById("editEndereco").value = cliente.endereco;

    abrir("editarCliente");

}

/* ==========================================
   SALVAR EDIÇÃO
========================================== */

function salvarEdicaoCliente() {

    const nome = document.getElementById("editNome").value.trim();
    const telefone = document.getElementById("editTelefone").value.trim();
    const endereco = document.getElementById("editEndereco").value.trim();

    if (!nome || !telefone || !endereco) {

        alert("Preencha todos os campos.");
        return;

    }

    if (clientes.some(c =>
        c.id !== clienteEditandoId &&
        (
            c.nome.toLowerCase() === nome.toLowerCase() ||
            c.telefone === telefone ||
            c.endereco.toLowerCase() === endereco.toLowerCase()
        )
    )) {

        alert("Já existe outro cliente com esses dados.");
        return;

    }

    const cliente = clientes.find(c => c.id === clienteEditandoId);

    cliente.nome = nome;
    cliente.telefone = telefone;
    cliente.endereco = endereco;

    salvar();

    render();

    abrir("clientes");

}/* ==========================================
   PREENCHER SELECTS
========================================== */

function preencherClientes() {

    const selects = [
        document.getElementById("clienteServico"),
        document.getElementById("clienteOS")
    ];

    selects.forEach(select => {

        if (!select) return;

        const valorAtual = select.value;

        select.innerHTML =
            `<option value="">Selecione um cliente</option>`;

        clientes.forEach(cliente => {

            select.innerHTML += `
                <option value="${cliente.id}">
                    ${cliente.nome}
                </option>
            `;

        });

        if (clientes.some(c => c.id === valorAtual)) {
            select.value = valorAtual;
        }

    });

}

/* ==========================================
   ADICIONAR SERVIÇO
========================================== */

function addServico() {

    const clienteId = document.getElementById("clienteServico").value;
    const data = document.getElementById("dataServico").value;
    const retornoDias = Number(
        document.getElementById("retornoDias").value || 0
    );

    if (!clienteId || !data) {
        alert("Preencha todos os campos.");
        return;
    }

    const retorno = new Date(data);
    retorno.setDate(retorno.getDate() + retornoDias);

    servicos.push({

        id: Date.now().toString(),

        clienteId,

        data,

        retorno: retorno.toISOString().split("T")[0]

    });

    salvar();

    document.getElementById("clienteServico").value = "";
    document.getElementById("dataServico").value = "";
    document.getElementById("retornoDias").value = "";

    render();

}

/* ==========================================
   LISTA DE SERVIÇOS
========================================== */

function atualizarServicos() {

    const lista = document.getElementById("listaServicos");

    if (!lista) return;

    lista.innerHTML = "";

    if (servicos.length === 0) {

        lista.innerHTML =
            "<li>Nenhum serviço cadastrado.</li>";

        return;

    }

    servicos.forEach((servico, index) => {

        const cliente = clientes.find(
            c => c.id === servico.clienteId
        );

        lista.innerHTML += `

        <li>

            <span>

                <strong>${cliente ? cliente.nome : "Cliente removido"}</strong><br>

                Serviço: ${servico.data}<br>

                Retorno: ${servico.retorno}

            </span>

            <div>

                <button
                    class="btn-delete"
                    onclick="delServico(${index})">

                    🗑️

                </button>

            </div>

        </li>

        `;

    });

}

/* ==========================================
   EXCLUIR SERVIÇO
========================================== */

function delServico(index) {

    if (!confirm("Excluir serviço?")) return;

    servicos.splice(index, 1);

    salvar();

    render();

}/* ==========================================
   ADICIONAR ORDEM DE SERVIÇO
========================================== */

function addOS() {

    const clienteId = document.getElementById("clienteOS").value;
    const servico = document.getElementById("servicoOS").value.trim();

    if (!clienteId || !servico) {
        alert("Preencha todos os campos.");
        return;
    }

    os.push({

        id: Date.now().toString(),

        clienteId,

        servico,

        data: new Date().toISOString().split("T")[0]

    });

    salvar();

    document.getElementById("clienteOS").value = "";
    document.getElementById("servicoOS").value = "";

    render();

}

/* ==========================================
   LISTA ORDENS DE SERVIÇO
========================================== */

function atualizarOS() {

    const lista = document.getElementById("listaOS");

    if (!lista) return;

    lista.innerHTML = "";

    if (os.length === 0) {
        lista.innerHTML = "<li>Nenhuma OS cadastrada.</li>";
        return;
    }

    os.forEach((ordem, index) => {

        const cliente = clientes.find(
            c => c.id === ordem.clienteId
        );

        lista.innerHTML += `

        <li>

            <span>

                <strong>${cliente ? cliente.nome : "Cliente removido"}</strong><br>

                ${ordem.servico}<br>

                Data: ${ordem.data}

            </span>

            <div>

                <button
                    class="btn-delete"
                    onclick="delOS(${index})">

                    🗑️

                </button>

            </div>

        </li>

        `;

    });

}

/* ==========================================
   EXCLUIR ORDEM DE SERVIÇO
========================================== */

function delOS(index) {

    if (!confirm("Excluir ordem de serviço?")) return;

    os.splice(index, 1);

    salvar();

    render();

}

/* ==========================================
   HISTÓRICO GERAL
========================================== */

function atualizarHistorico() {

    const lista = document.getElementById("listaHistorico");

    if (!lista) return;

    lista.innerHTML = "";

    const eventos = [];

    clientes.forEach(c => {
        eventos.push({
            tipo: "Cliente",
            texto: `Cliente cadastrado: ${c.nome}`,
            data: ""
        });
    });

    servicos.forEach(s => {

        const cliente = clientes.find(c => c.id === s.clienteId);

        eventos.push({
            tipo: "Serviço",
            texto: `Serviço - ${cliente ? cliente.nome : "Cliente"} - ${s.data}`,
            data: s.data
        });

    });

    os.forEach(o => {

        const cliente = clientes.find(c => c.id === o.clienteId);

        eventos.push({
            tipo: "OS",
            texto: `OS - ${cliente ? cliente.nome : "Cliente"} - ${o.data}`,
            data: o.data
        });

    });

    financeiro.forEach(f => {

        const cliente = clientes.find(c => c.id === f.clienteId);

        eventos.push({
            tipo: "Financeiro",
            texto: `${f.tipo.toUpperCase()} - ${f.desc} - ${cliente ? cliente.nome : "Sem cliente"}`,
            data: f.data || ""
        });

    });

    eventos.sort((a, b) => (b.data || "").localeCompare(a.data || ""));

    eventos.forEach(e => {

        lista.innerHTML += `
        <li>
            <span>
                <strong>[${e.tipo}]</strong> ${e.texto}
            </span>
        </li>`;
    });

}

/* ==========================================
   HISTÓRICO DO CLIENTE
========================================== */

function atualizarHistoricoCliente() {

    const lista = document.getElementById("historicoCliente");

    if (!lista || !clienteSelecionadoId) return;

    lista.innerHTML = "";

    const servicosCliente = servicos.filter(
        s => s.clienteId === clienteSelecionadoId
    );

    const osCliente = os.filter(
        o => o.clienteId === clienteSelecionadoId
    );

    const financeiroCliente = financeiro.filter(
        f => f.clienteId === clienteSelecionadoId
    );

    servicosCliente.forEach(s => {

        lista.innerHTML += `
        <li>
            🔵 Serviço realizado - ${s.data}
        </li>`;
    });

    osCliente.forEach(o => {

        lista.innerHTML += `
        <li>
            📄 OS - ${o.servico} - ${o.data}
        </li>`;
    });

    financeiroCliente.forEach(f => {

        lista.innerHTML += `
        <li>
            💰 ${f.tipo.toUpperCase()} - ${f.desc} - R$ ${Number(f.valor).toFixed(2)}
        </li>`;
    });

}/* ==========================================
   ADICIONAR FINANCEIRO
========================================== */

function addFinanceiro() {

    const desc = document.getElementById("descFin").value.trim();
    const valor = Number(document.getElementById("valorFin").value);
    const tipo = document.getElementById("tipoFin").value;

    if (!desc || isNaN(valor)) {
        alert("Preencha todos os campos.");
        return;
    }

    financeiro.push({

        id: Date.now().toString(),

        clienteId: clienteSelecionadoId,

        desc,

        valor,

        tipo,

        data: new Date().toISOString().split("T")[0]

    });

    salvar();

    document.getElementById("descFin").value = "";
    document.getElementById("valorFin").value = "";

    render();

}

/* ==========================================
   LISTA FINANCEIRO
========================================== */

function atualizarFinanceiro() {

    const lista = document.getElementById("listaFin");
    const totalEl = document.getElementById("totalFinanceiro");

    if (!lista) return;

    lista.innerHTML = "";

    let total = 0;

    if (financeiro.length === 0) {
        lista.innerHTML = "<li>Nenhum lançamento.</li>";
    }

    financeiro.forEach((f, index) => {

        const valor = Number(f.valor);

        if (f.tipo === "entrada") {
            total += valor;
        } else {
            total -= valor;
        }

        lista.innerHTML += `
        <li>

            <span>
                ${f.desc} - ${f.tipo} - R$ ${valor.toFixed(2)}
            </span>

            <div>
                <button class="btn-delete" onclick="delFinanceiro(${index})">
                    🗑️
                </button>
            </div>

        </li>`;
    });

    if (totalEl) {
        totalEl.textContent =
            "Saldo: R$ " + total.toFixed(2).replace(".", ",");
    }
}

/* ==========================================
   EXCLUIR FINANCEIRO
========================================== */

function delFinanceiro(index) {

    if (!confirm("Excluir lançamento?")) return;

    financeiro.splice(index, 1);

    salvar();

    render();

}

/* ==========================================
   DASHBOARD (ATUALIZAÇÃO GERAL)
========================================== */

function atualizarDashboard() {

    const totalClientes = document.getElementById("totalClientes");
    const totalServicos = document.getElementById("totalServicos");
    const totalOS = document.getElementById("totalOS");
    const saldoTotal = document.getElementById("saldoTotal");

    if (totalClientes)
        totalClientes.textContent = clientes.length;

    if (totalServicos)
        totalServicos.textContent = servicos.length;

    if (totalOS)
        totalOS.textContent = os.length;

    let saldo = 0;

    financeiro.forEach(f => {

        saldo += f.tipo === "entrada"
            ? Number(f.valor)
            : -Number(f.valor);

    });

    if (saldoTotal) {
        saldoTotal.textContent =
            "R$ " + saldo.toFixed(2).replace(".", ",");
    }
}

/* ==========================================
   CALENDÁRIO SIMPLES
========================================== */

function montarCalendario() {

    const cal = document.getElementById("cal");

    if (!cal) return;

    cal.innerHTML = "";

    const datas = {};

    servicos.forEach(s => {

        const cliente = clientes.find(c => c.id === s.clienteId);

        if (!datas[s.data]) {
            datas[s.data] = [];
        }

        datas[s.data].push(`🔵 ${cliente ? cliente.nome : "Cliente"}`);

        if (s.retorno) {

            if (!datas[s.retorno]) {
                datas[s.retorno] = [];
            }

            datas[s.retorno].push(`🟡 RETORNO - ${cliente ? cliente.nome : "Cliente"}`);
        }

    });

    const ordenado = Object.keys(datas).sort();

    if (ordenado.length === 0) {
        cal.innerHTML = "<p>Nenhum evento no calendário.</p>";
        return;
    }

    ordenado.forEach(data => {

        cal.innerHTML += `
        <div class="dia">

            <b>${data}</b>

            ${datas[data].map(item => `<div>${item}</div>`).join("")}

        </div>`;
    });

}/* ==========================================
   RENDER PRINCIPAL
========================================== */

function render() {

    atualizarDashboard();

    atualizarClientes();

    atualizarServicos();

    atualizarOS();

    atualizarFinanceiro();

    atualizarHistorico();

    atualizarHistoricoCliente();

    montarCalendario();

    preencherClientes();

}

/* ==========================================
   INICIALIZAÇÃO DO SISTEMA
========================================== */

window.addEventListener("load", () => {

    abrir("dashboard");

    render();

});

/* ==========================================
   FUNÇÕES DE CALENDÁRIO (BOTÕES DO HTML)
   (VERSÃO SIMPLES SEM FILTRO AVANÇADO)
========================================== */

function periodoAnterior() {

    alert("Modo calendário avançado ainda não implementado.");

}

function proximoPeriodo() {

    alert("Modo calendário avançado ainda não implementado.");

}

function trocarModoCalendario() {

    alert("Modo calendário (semana/mês/ano) ainda não implementado.");

}

/* ==========================================
   FECHAR MODAL (RESERVADO PARA FUTURO)
========================================== */

function fecharModalCliente() {

    const modal = document.getElementById("modalCliente");

    if (modal) {
        modal.classList.add("hidden");
    }

}

/* ==========================================
   PROTEÇÃO DE ERROS (SEGURANÇA DO RENDER)
========================================== */

function safeCall(fn) {

    try {
        if (typeof fn === "function") fn();
    } catch (e) {
        console.warn("Erro em função:", e);
    }

}
