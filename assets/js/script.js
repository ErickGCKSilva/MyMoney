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

// por enquanto, a lista é só a inicial
let despesas = despesasIniciais;
renderizar(despesas);