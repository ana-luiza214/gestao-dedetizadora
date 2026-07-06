let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let os = JSON.parse(localStorage.getItem("os")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];

let clienteSelecionadoId = null;
let clienteEditandoId = null;


/* =========================
   CALENDÁRIO
========================= */

let modoCalendario = "mes";
let dataBase = new Date();



/* =========================
   SALVAR
========================= */

function salvar(){

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

    localStorage.setItem(
        "servicos",
        JSON.stringify(servicos)
    );

    localStorage.setItem(
        "os",
        JSON.stringify(os)
    );

    localStorage.setItem(
        "financeiro",
        JSON.stringify(financeiro)
    );

}



/* =========================
   NAVEGAÇÃO
========================= */

function abrir(id){

    document.querySelectorAll(".secao")
    .forEach(s=>{

        s.classList.add("hidden");

    });


    const alvo =
    document.getElementById(id);


    if(alvo){

        alvo.classList.remove("hidden");

    }


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


    const totalClientes =
    document.getElementById("totalClientes");


    const totalServicos =
    document.getElementById("totalServicos");


    const totalOS =
    document.getElementById("totalOS");



    if(totalClientes)
        totalClientes.textContent = clientes.length;


    if(totalServicos)
        totalServicos.textContent = servicos.length;


    if(totalOS)
        totalOS.textContent = os.length;



    let saldo = 0;


    financeiro.forEach(f=>{

        saldo +=
        f.tipo === "entrada"
        ? Number(f.valor)
        : -Number(f.valor);

    });



    const saldoTotal =
    document.getElementById("saldoTotal");


    if(saldoTotal){

        saldoTotal.textContent =
        "R$ "
        +
        saldo.toFixed(2)
        .replace(".",",");

    }


}



/* =========================
   CLIENTES
========================= */


function addCliente(){


    const nome =
    document.getElementById("nome")
    .value.trim();


    const telefone =
    document.getElementById("telefone")
    .value.trim();


    const endereco =
    document.getElementById("endereco")
    .value.trim();



    if(!nome || !telefone || !endereco){

        return alert(
            "Preencha todos os campos."
        );

    }




    const existente =
    clientes.find(c=>

        c.nome.toLowerCase()
        === nome.toLowerCase()

        ||

        c.telefone === telefone

        ||

        c.endereco.toLowerCase()
        === endereco.toLowerCase()

    );



    if(existente){

        return alert(

`Cliente já cadastrado!

Nome:
${existente.nome}

Telefone:
${existente.telefone}

Endereço:
${existente.endereco}`

        );

    }




    clientes.push({

        id:
        Date.now().toString(),

        nome,

        telefone,

        endereco,

        cadastro:
        new Date()
        .toLocaleDateString()

    });



    salvar();

    render();



    document.getElementById("nome").value="";

    document.getElementById("telefone").value="";

    document.getElementById("endereco").value="";


}




function atualizarClientes(){


    const lista =
    document.getElementById("listaClientes");


    if(!lista) return;



    const filtro =
    document.getElementById("pesquisaCliente")
    ?.value
    .toLowerCase()
    ||
    "";



    lista.innerHTML="";



    clientes

    .filter(c=>


        c.nome.toLowerCase()
        .includes(filtro)

        ||

        c.telefone
        .includes(filtro)

        ||

        c.endereco
        .toLowerCase()
        .includes(filtro)

    )


    .forEach(c=>{


        lista.innerHTML += `

<li>


<div>


<span
onclick="verCliente('${c.id}')"
style="cursor:pointer">

<b>${c.nome}</b>

<br>

📞 ${c.telefone}

<br>

📍 ${c.endereco}

</span>


</div>



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


</li>

`;



    });


}




function delCliente(id){


    clientes =
    clientes.filter(c=>c.id!==id);



    servicos =
    servicos.filter(s=>s.clienteId!==id);



    os =
    os.filter(o=>o.clienteId!==id);



    financeiro =
    financeiro.filter(f=>f.clienteId!==id);



    salvar();

    render();


}



/* =========================
   FICHA DO CLIENTE
========================= */


function verCliente(id){


    const cliente =
    clientes.find(c=>c.id===id);



    if(!cliente)
        return;



    clienteSelecionadoId = id;



    const info =
    document.getElementById("infoCliente");


    const historico =
    document.getElementById("historicoCliente");



    if(info){

        info.innerHTML = `

<h3>${cliente.nome}</h3>

<p>
📞 <b>Telefone:</b>
${cliente.telefone}
</p>


<p>
📍 <b>Endereço:</b>
${cliente.endereco}
</p>


<p>
📅 <b>Cadastro:</b>
${cliente.cadastro || "-"}
</p>

`;

    }




    if(historico){

        historico.innerHTML = "";

    }



    abrir("detalheCliente");


}/* =========================
   SERVIÇOS
========================= */


function addServico(){


    const clienteId =
    document.getElementById("clienteServico").value;


    const data =
    document.getElementById("dataServico").value;


    const dias =
    Number(
        document.getElementById("retornoDias").value || 0
    );


    const valor =
    Number(
        document.getElementById("valorServico")?.value || 0
    );



    if(!clienteId || !data){

        return alert(
            "Preencha todos os campos."
        );

    }



    let retorno =
    new Date(data);


    retorno.setDate(
        retorno.getDate() + dias
    );



    servicos.push({

        id:
        Date.now().toString(),

        clienteId,

        data,

        retorno:
        retorno.toISOString()
        .split("T")[0],

        valor

    });



    salvar();

    render();



    const campoValor =
    document.getElementById("valorServico");


    if(campoValor)
        campoValor.value="";

}



function atualizarServicos(){


    const lista =
    document.getElementById("listaServicos");


    if(!lista)
        return;



    lista.innerHTML="";



    servicos.forEach((s,i)=>{


        const cliente =
        clientes.find(
            c=>c.id===s.clienteId
        );



        lista.innerHTML += `

<li>


<span>

<b>${cliente?.nome || "Cliente"}</b>

<br>

📅 ${s.data}

<br>

🔄 Retorno:
${s.retorno}

<br>

💰 R$
${Number(s.valor || 0)
.toFixed(2)}

</span>



<button
class="btn-delete"
onclick="delServico(${i})">

🗑️

</button>


</li>

`;



    });


}



function delServico(i){

    servicos.splice(i,1);

    salvar();

    render();

}





/* =========================
   ORDENS DE SERVIÇO
========================= */


function addOS(){


    const clienteId =
    document.getElementById("clienteOS").value;


    const servico =
    document.getElementById("servicoOS").value.trim();



    if(!clienteId || !servico){

        return alert(
            "Preencha todos os campos."
        );

    }



    os.push({

        id:
        Date.now().toString(),

        clienteId,

        servico,

        data:
        new Date()
        .toISOString()
        .split("T")[0]

    });



    salvar();

    render();


}




function atualizarOS(){


    const lista =
    document.getElementById("listaOS");


    if(!lista)
        return;



    lista.innerHTML="";



    os.forEach((o,i)=>{


        const cliente =
        clientes.find(
            c=>c.id===o.clienteId
        );



        lista.innerHTML += `

<li>


<span>

<b>${cliente?.nome || "Cliente"}</b>

<br>

📅 ${o.data}

<br>

${o.servico}

</span>



<button
class="btn-delete"
onclick="delOS(${i})">

🗑️

</button>


</li>

`;



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


    const desc =
    document.getElementById("descFin")
    .value.trim();


    const valor =
    Number(
        document.getElementById("valorFin")
        .value
    );


    const tipo =
    document.getElementById("tipoFin")
    .value;



    if(!desc || isNaN(valor)){

        return alert(
            "Preencha tudo."
        );

    }



    financeiro.push({

        id:
        Date.now().toString(),

        clienteId:
        clienteSelecionadoId,

        desc,

        valor,

        tipo

    });



    salvar();

    render();



}





function atualizarFinanceiro(){


    const lista =
    document.getElementById("listaFin");


    const total =
    document.getElementById("totalFinanceiro");



    if(!lista)
        return;



    lista.innerHTML="";



    let saldo=0;



    financeiro.forEach((f,i)=>{


        saldo +=
        f.tipo==="entrada"
        ?
        Number(f.valor)
        :
        -Number(f.valor);



        lista.innerHTML += `

<li>


<span>

${f.desc}

<br>

R$ 
${Number(f.valor)
.toFixed(2)}

</span>



<button
class="btn-delete"
onclick="delFinanceiro(${i})">

🗑️

</button>


</li>

`;



    });



    if(total){

        total.textContent =
        "Saldo: R$ "
        +
        saldo
        .toFixed(2);

    }



}



function delFinanceiro(i){

    financeiro.splice(i,1);

    salvar();

    render();

}




/* =========================
   COMPLETAR HISTÓRICO CLIENTE
========================= */


function carregarHistoricoCliente(id){


    const historico =
    document.getElementById("historicoCliente");



    if(!historico)
        return;



    historico.innerHTML="";



    let total=0;



    historico.innerHTML += `

<h4>
/* =========================
   ATUALIZA VER CLIENTE
========================= */

const verClienteOriginal = verCliente;


verCliente = function(id){

    verClienteOriginal(id);

    carregarHistoricoCliente(id);

};



/* =========================
   CALENDÁRIO
========================= */


function trocarModoCalendario(){

    modoCalendario =
    document.getElementById("modoCalendario")
    .value;


    montarCalendario();

}




function periodoAnterior(){

    if(modoCalendario==="mes")
        dataBase.setMonth(
            dataBase.getMonth()-1
        );


    if(modoCalendario==="semana")
        dataBase.setDate(
            dataBase.getDate()-7
        );


    if(modoCalendario==="ano")
        dataBase.setFullYear(
            dataBase.getFullYear()-1
        );


    montarCalendario();

}





function proximoPeriodo(){

    if(modoCalendario==="mes")
        dataBase.setMonth(
            dataBase.getMonth()+1
        );


    if(modoCalendario==="semana")
        dataBase.setDate(
            dataBase.getDate()+7
        );


    if(modoCalendario==="ano")
        dataBase.setFullYear(
            dataBase.getFullYear()+1
        );


    montarCalendario();

}





function montarCalendario(){


    const cal =
    document.getElementById("cal");


    if(!cal)
        return;



    cal.innerHTML="";



    const dias={};



    servicos.forEach(s=>{


        const data =
        new Date(s.data);


        let mostrar=false;



        if(modoCalendario==="mes"){

            mostrar =
            data.getMonth()
            ===
            dataBase.getMonth()

            &&

            data.getFullYear()
            ===
            dataBase.getFullYear();

        }



        if(modoCalendario==="ano"){

            mostrar =
            data.getFullYear()
            ===
            dataBase.getFullYear();

        }




        if(modoCalendario==="semana"){


            const inicio =
            new Date(dataBase);


            inicio.setDate(
                inicio.getDate()
                -
                inicio.getDay()
            );


            const fim =
            new Date(inicio);


            fim.setDate(
                fim.getDate()+6
            );


            mostrar =
            data>=inicio &&
            data<=fim;

        }



        if(!mostrar)
            return;



        const cliente =
        clientes.find(
            c=>c.id===s.clienteId
        );



        if(!cliente)
            return;



        if(!dias[s.data])
            dias[s.data]=[];



        dias[s.data].push(`

<div
class="clienteCalendario"
onclick="abrirModalCliente('${cliente.id}')">

🔵 ${cliente.nome}

</div>

`);




        if(s.retorno){


            if(!dias[s.retorno])
                dias[s.retorno]=[];



            dias[s.retorno].push(`

<div
class="clienteCalendario"
onclick="abrirModalCliente('${cliente.id}')">

🟡 Retorno ${cliente.nome}

</div>

`);

        }



    });





    Object.keys(dias)
    .sort()
    .forEach(data=>{


        cal.innerHTML += `

<div class="dia">


<b>${data}</b>


${dias[data].join("")}


</div>

`;



    });



}






/* =========================
   MODAL CLIENTE
========================= */


function abrirModalCliente(id){


    clienteSelecionadoId=id;



    const cliente =
    clientes.find(
        c=>c.id===id
    );



    if(!cliente)
        return;



    const modal =
    document.getElementById("modalCliente");


    const dados =
    document.getElementById("dadosCliente");



    dados.innerHTML = `

<h3>
${cliente.nome}
</h3>


<p>
📞 ${cliente.telefone}
</p>


<p>
📍 ${cliente.endereco}
</p>


<br>


<button
class="btn-ficha"
onclick="verCliente('${cliente.id}')">

📋 Abrir ficha completa

</button>

`;



    modal.classList.remove("hidden");

}




function fecharModalCliente(){

    const modal =
    document.getElementById("modalCliente");


    modal.classList.add("hidden");

}





function verClienteModalCompleto(){


    fecharModalCliente();


    if(clienteSelecionadoId){

        verCliente(
            clienteSelecionadoId
        );

    }


}






/* =========================
   SELECT CLIENTES
========================= */


function preencherClientes(){


    const selects=[

        document.getElementById("clienteServico"),

        document.getElementById("clienteOS")

    ];



    selects.forEach(select=>{


        if(!select)
            return;



        const valorAtual =
        select.value;



        select.innerHTML = `

<option value="">
Selecione um cliente
</option>

`;



        clientes.forEach(c=>{


            select.innerHTML += `

<option value="${c.id}">

${c.nome}

</option>

`;



        });



        if(valorAtual)
            select.value=valorAtual;



    });



}





/* =========================
   FECHAR MODAL CLICANDO FORA
========================= */


window.addEventListener(
"click",
function(e){


    const modal =
    document.getElementById("modalCliente");


    if(e.target===modal){

        fecharModalCliente();

    }


});





/* =========================
   INÍCIO
========================= */


window.addEventListener(
"load",
()=>{

    abrir("dashboard");

}); Serviços
</h4>

`;



    servicos

    .filter(s=>s.clienteId===id)

    .forEach(s=>{


        total += Number(s.valor || 0);



        historico.innerHTML += `

<li>

📅 ${s.data}

<br>

Serviço realizado

<br>

💰 R$
${Number(s.valor || 0)
.toFixed(2)}

</li>

`;



    });



    historico.innerHTML += `

<h4>
📄 Ordens de Serviço
</h4>

`;



    os

    .filter(o=>o.clienteId===id)

    .forEach(o=>{


        historico.innerHTML += `

<li>

📅 ${o.data}

<br>

${o.servico}

</li>

`;



    });



    historico.innerHTML += `

<h4>
💰 Total gasto
</h4>


<li class="total-cliente">

R$
${total.toFixed(2)}

</li>

`;



}
