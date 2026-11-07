
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

    // monta a despesa nova
    const novaDespesa = {
        id: gerarProximoId(),
        descricao,
        valor,
        data,
        categoria,
        status
    };

    despesas.push(novaDespesa);       // põe na lista
    salvarDespesas();                 // grava no navegador
    renderizar(despesas);             // desenha a tabela de novo

    formulario.reset();               // limpa os campos
    mensagemFormulario.textContent = "Despesa cadastrada com sucesso.";
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
    salvarDespesas();               // grava a lista sem ela
    renderizar(despesas);           // desenha a tabela de novo
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