
// nome da chave onde as despesas ficam guardadas no navegador
const CHAVE = "mymoney:despesas";

// as despesas que estavam escritas na tabela, agora como dados
const despesasIniciais = [
    { id: 1, descricao: "Supermercado", valor: 250, data: "2026-10-01", categoria: "alimentacao", status: "Pago" },
    { id: 2, descricao: "Conta de luz", valor: 180, data: "2026-10-05", categoria: "moradia", status: "Pendente" },
    { id: 3, descricao: "Uber", valor: 35, data: "2026-10-07", categoria: "transporte", status: "Pago" }
];

// nomes das categorias para mostrar na tela
const nomesCategorias = {
    alimentacao: "Alimentação",
    lazer: "Lazer",
    saude: "Saúde",
    transporte: "Transporte",
    moradia: "Moradia"
};

// formata números como dinheiro brasileiro
const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// transforma "2026-10-01" em "01/10/2026"
function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// guarda a lista inteira no navegador
function salvarDespesas() {
    const texto = JSON.stringify(despesas);   // lista → texto
    localStorage.setItem(CHAVE, texto);       // texto → navegador
}

// lê a lista do navegador
function carregarDespesas() {
    const salvo = localStorage.getItem(CHAVE);   // navegador → texto (ou null)

    // nada salvo ainda (primeira visita): usa as despesas de exemplo
    if (!salvo) {
        return despesasIniciais;
    }

    return JSON.parse(salvo);                    // texto → lista
}

// cria um botão com as etiquetas da ação e do id
function criarBotao(texto, acao, id, classe) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.classList.add(classe);
    botao.dataset.acao = acao;
    botao.dataset.id = id;
    return botao;
}

// desenha as despesas na tabela
function renderizar(lista) {
    const corpo = document.querySelector("#lista-despesas");
    corpo.textContent = "";


    // se não tem nenhuma despesa, mostra um aviso no lugar da tabela
    if (lista.length === 0) {
        const linha = document.createElement("tr");      // cria uma linha
        const celula = document.createElement("td");     // cria uma célula
        celula.colSpan = 6;                              // a célula ocupa as 6 colunas da tabela
        celula.textContent = "Nenhuma despesa encontrada.";
        linha.append(celula);                            // põe a célula na linha
        corpo.append(linha);                             // põe a linha na tabela
        return;                                          // sai: não tem o que desenhar
    }

    lista.forEach(despesa => {
        const linha = document.createElement("tr");

        const descricao = document.createElement("td");
        descricao.textContent = despesa.descricao;

        const valor = document.createElement("td");
        valor.textContent = formatoMoeda.format(despesa.valor);

        const data = document.createElement("td");
        data.textContent = formatarData(despesa.data);

        const categoria = document.createElement("td");
        categoria.textContent = nomesCategorias[despesa.categoria];

        const status = document.createElement("td");
        status.textContent = despesa.status;

        // os três botões, agrupados como na Etapa 2
        const acoes = document.createElement("td");
        const grupo = document.createElement("div");
        grupo.classList.add("acoes");
        grupo.append(
            criarBotao("Editar", "editar", despesa.id, "btn-editar"),
            criarBotao("Excluir", "excluir", despesa.id, "btn-excluir"),
            criarBotao("Ver detalhes", "detalhes", despesa.id, "btn-detalhes")
        );
        acoes.append(grupo);

        linha.append(descricao, valor, data, categoria, status, acoes);
        corpo.append(linha);
    });
}

// estado inicial: o que está salvo no navegador, ou as de exemplo
let despesas = carregarDespesas();
salvarDespesas();          // grava já na abertura, pra a chave existir
renderizar(despesas);
// ===== CADASTRO =====

// pega o formulário, os campos e o lugar da mensagem
const formulario = document.querySelector("#form-despesa");
const campoDescricao = document.querySelector("#descricao");
const campoValor = document.querySelector("#valor");
const campoData = document.querySelector("#data");
const campoCategoria = document.querySelector("#categoria");
const campoStatus = document.querySelector("#status");
const mensagemFormulario = document.querySelector("#mensagem-formulario");

const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");

// guarda o id da despesa sendo editada; null = não está editando
let idEmEdicao = null;

// gera um id que não repete: o maior id existente + 1
function gerarProximoId() {
    if (despesas.length === 0) {
        return 1;
    }
    const ids = despesas.map(despesa => despesa.id);   // só os números dos ids
    return Math.max(...ids) + 1;                       // o maior, mais 1
}

// confere os dados; devolve o texto do erro, ou "" se estiver tudo certo
function validarDespesa(descricao, valor, data) {
    if (descricao === "") {
        return "Informe a descrição.";
    }
    if (descricao.length < 3) {
        return "A descrição precisa ter pelo menos 3 letras.";
    }
    if (Number.isNaN(valor) || valor <= 0) {          // não é número, ou é zero/negativo
        return "O valor precisa ser maior que zero.";
    }
    if (data === "") {
        return "Informe a data.";
    }
    return "";
}

// quando o formulário é enviado
// quando o formulário é enviado
formulario.addEventListener("submit", event => {
    event.preventDefault();                           // não recarrega a página

    // lê o que a pessoa preencheu
    const descricao = campoDescricao.value.trim();
    const valor = Number(campoValor.value);           // texto do campo → número
    const data = campoData.value;
    const categoria = campoCategoria.value;
    const status = campoStatus.value;

    // valida: se tiver erro, mostra e para aqui (os dados ficam no formulário)
    const erro = validarDespesa(descricao, valor, data);
    if (erro !== "") {
        mensagemFormulario.textContent = erro;
        return;
    }

    if (idEmEdicao === null) {
        // CADASTRO: cria uma despesa nova
        const novaDespesa = {
            id: gerarProximoId(),
            descricao,
            valor,
            data,
            categoria,
            status
        };
        despesas.push(novaDespesa);
        mensagemFormulario.textContent = "Despesa cadastrada com sucesso.";
    } else {
        // EDIÇÃO: acha a posição da despesa e troca os dados dela
        const indice = despesas.findIndex(despesa => despesa.id === idEmEdicao);
        despesas[indice] = {
            ...despesas[indice],    // copia tudo da despesa antiga (inclusive o id)
            descricao,              // e sobrescreve só os campos editados
            valor,
            data,
            categoria,
            status
        };
        mensagemFormulario.textContent = "Despesa atualizada com sucesso.";
    }

    salvarDespesas();               // grava no navegador
    atualizarVisualizacao();          // desenha a tabela de novo
    resetarFormulario();            // volta o formulário ao normal
});

// ===== AÇÕES DA TABELA (excluir, editar, detalhes) =====

// um ouvinte só, no corpo da tabela, pra todos os botões
const corpoTabela = document.querySelector("#lista-despesas");

corpoTabela.addEventListener("click", event => {

    // achou um botão com data-acao? se não, ignora o clique
    const botao = event.target.closest("[data-acao]");
    if (!botao) {
        return;
    }

    const acao = botao.dataset.acao;            // o que o botão faz
    const id = Number(botao.dataset.id);        // de qual despesa (texto → número)

    if (acao === "excluir") {
        excluirDespesa(id);
    }

    if (acao === "editar") {
        iniciarEdicao(id);
    }

    if (acao === "detalhes") {
        mostrarDetalhes(id);
    }
});

// remove a despesa com esse id
function excluirDespesa(id) {

    // pergunta antes; se a pessoa clicar em Cancelar, não exclui
    const confirmou = window.confirm("Deseja excluir esta despesa?");
    if (!confirmou) {
        return;
    }

    // acha a posição da despesa na lista (0, 1, 2...)
    const indice = despesas.findIndex(despesa => despesa.id === id);

    // -1 quer dizer que não achou: não faz nada
    if (indice === -1) {
        return;
    }

    despesas.splice(indice, 1);     // tira 1 item a partir dessa posição

    // se a despesa excluída era a que estava sendo editada, sai da edição
    if (id === idEmEdicao) {
        resetarFormulario();
    }

    salvarDespesas();               // grava a lista sem ela
    atualizarVisualizacao();          // desenha a tabela de novo
}

// copia os dados da despesa pro formulário e entra no modo de edição
function iniciarEdicao(id) {
    const despesa = despesas.find(despesa => despesa.id === id);
    if (!despesa) {                       // não achou: não faz nada
        return;
    }

    // a despesa vai pros campos do formulário
    campoDescricao.value = despesa.descricao;
    campoValor.value = despesa.valor;
    campoData.value = despesa.data;
    campoCategoria.value = despesa.categoria;
    campoStatus.value = despesa.status;

    idEmEdicao = despesa.id;              // anota qual está sendo editada

    // a tela avisa que é uma edição
    tituloFormulario.textContent = "Editar despesa";
    botaoSalvar.textContent = "Atualizar despesa";
    botaoCancelar.hidden = false;         // mostra o botão de cancelar
    mensagemFormulario.textContent = "";

    campoDescricao.focus();               // leva o cursor pro primeiro campo
}

// sai do modo de edição e volta o formulário ao estado de cadastro
function resetarFormulario() {
    idEmEdicao = null;                          // não está mais editando
    formulario.reset();                         // limpa os campos
    tituloFormulario.textContent = "Cadastro de despesa";
    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;                // esconde o cancelar
}

// cancelar: volta o formulário ao normal, sem mudar a despesa
botaoCancelar.addEventListener("click", () => {
    resetarFormulario();
    mensagemFormulario.textContent = "Edição cancelada.";
});

// mostra os dados de uma despesa na seção de detalhes
function mostrarDetalhes(id) {
    const despesa = despesas.find(despesa => despesa.id === id);
    if (!despesa) {                     // não achou: não faz nada
        return;
    }

    const area = document.querySelector("#detalhes-despesa");
    area.textContent = "";              // apaga o conteúdo anterior

    // total de todas as despesas
    const totalGeral = somarValores(despesas);

    // quanto esta despesa representa do total, em porcentagem
    const participacao = Math.round((despesa.valor / totalGeral) * 100);

    // só as despesas da mesma categoria, e a soma delas
    const mesmaCategoria = despesas.filter(item => item.categoria === despesa.categoria);
    const totalCategoria = somarValores(mesmaCategoria);

    // cada item é um rótulo e um valor
    const itens = [
        ["Descrição", despesa.descricao],
        ["Valor", formatoMoeda.format(despesa.valor)],
        ["Data", formatarData(despesa.data)],
        ["Categoria", nomesCategorias[despesa.categoria]],
        ["Status", despesa.status],
        ["Participação no total", `${participacao}% de todos os gastos`],
        [`Total em ${nomesCategorias[despesa.categoria]}`, formatoMoeda.format(totalCategoria)]
    ];

    // cria um <p> com o rótulo em negrito pra cada item
    itens.forEach(([rotulo, valor]) => {
        const linha = document.createElement("p");
        const negrito = document.createElement("strong");
        negrito.textContent = `${rotulo}: `;
        linha.append(negrito, valor);   // "Descrição: " + o valor
        area.append(linha);
    });

    // rola a página até a seção de detalhes
    document.querySelector("#detalhes").scrollIntoView({ behavior: "smooth" });
}

// soma o valor de todas as despesas de uma lista
function somarValores(lista) {
    let total = 0;
    lista.forEach(despesa => {
        total = total + despesa.valor;
    });
    return total;
}

// ===== PESQUISA, FILTRO E ORDENAÇÃO =====

const campoPesquisa = document.querySelector("#pesquisa");

// lê os controles, monta a lista resultante e desenha
function atualizarVisualizacao() {
    // o termo digitado, sem espaços nas pontas e em minúsculas
    const termo = campoPesquisa.value.trim().toLowerCase();

    // só as despesas cuja descrição contém o termo
    const resultado = despesas.filter(despesa =>
        despesa.descricao.toLowerCase().includes(termo)
    );

    renderizar(resultado);
}

// a cada letra digitada, atualiza a tabela
campoPesquisa.addEventListener("input", atualizarVisualizacao);