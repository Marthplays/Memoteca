import ui from "./ui.js";
import api from "./api.js";

const pensamentosSet = new Set();

async function adicionarChavePensamento() {
    try {
        const pensamentos = await api.buscarPensamentos()
        pensamentos.forEach(pensamento => {
            const chavePensamento = `${pensamento.conteudo.trim().toLowerCase()}-${pensamento.autoria.trim().toLowerCase()}`;
            pensamentosSet.add(chavePensamento);
        });
    } catch (error) {
        alert("Erro ao adicionar chave ao pensamento")
    }
}

function removerEspacos(string) {
    return string.replaceAll(/\s+/g, '')
}

const regexConteudo = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.,!?()'":;]{10,}$/

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo)
}

const regexAutoria = /^[a-zA-Z\s]{3,15}$/

function validarAutoria(autoria) {
  return regexAutoria.test(autoria)
}

document.addEventListener("DOMContentLoaded", () => {
    ui.renderizarPensamentos();
    adicionarChavePensamento();

    const form = document.getElementById("pensamento-form");
    form.addEventListener("submit", manipularSubmissaoForm);

    const buttonCancel = document.getElementById("botao-cancelar");
    buttonCancel.addEventListener("click", manipularCancelamento);

    const inputBusca = document.getElementById("campo-busca");
    inputBusca.addEventListener("input", manipularBusca);
});

async function manipularSubmissaoForm(evento) {
    evento.preventDefault();
    const id = document.getElementById("pensamento-id").value;
    const conteudo = document.getElementById("pensamento-conteudo").value;
    const autoria = document.getElementById("pensamento-autoria").value;
    const data = document.getElementById("pensamento-data").value;

    const conteudoSemEspacos = removerEspacos(conteudo);
    const autoriaSemEspacos = removerEspacos(autoria);

    if (!validarConteudo(conteudoSemEspacos)) {
        alert("É permitida a inclusão apenas de letras e espaços no campo conteúdo");
        return
    }

    if (!validarAutoria(autoriaSemEspacos)) {
        alert("É permitida a inclusão apenas de letras e espaços no campo autoria");
        return
    }

    if (!validarData(data)) {
        alert("Não é permitido o cadastro de datas futuras");
        return
    }

    const chaveNovoPensamento = `${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}`

    if (pensamentosSet.has(chaveNovoPensamento)) {
        alert("Esse pensamento ja existe!")
        return
    }

    try {
        if (id) {
            await api.editarPensamento({id, conteudo, autoria, data})
        } else {
            await api.salvarPensamento({conteudo, autoria, data});
        }
        ui.renderizarPensamentos();
    } catch (error) {
        alert("Erro ao salvar pensamentos");
    }

}

async function manipularCancelamento() {
    const form = document.getElementById("pensamento-form");
    form.reset()
}

async function manipularBusca() {
    const termoBusca = document.getElementById("campo-busca").value;
    try {
        const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoBusca);
        ui.renderizarPensamentos(pensamentosFiltrados);
    } catch (error) {
        alert("Erro ao realizar busca")
    }
}

function validarData(data) {
    const dataAtual = new Date();
    const dataInserida = new Date(data);
    return dataInserida <= dataAtual;
}