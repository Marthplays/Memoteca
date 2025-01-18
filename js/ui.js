import api from "./api.js";


const ui = {

    async preencherFormulario(pensamentoID) {
        const pensamento = await api.buscarPensamentoPorID(pensamentoID);
        document.getElementById("pensamento-id").value = pensamento.id;
        document.getElementById("pensamento-conteudo").value = pensamento.conteudo;
        document.getElementById("pensamento-autoria").value = pensamento.autoria;
        document.getElementById("pensamento-data").value = pensamento.data.toISOString().split("T")[0];
        document.getElementById("form-container").scrollIntoView();
    },

    async renderizarPensamentos(pensamentosFiltrados = null) {
        const listaPensamentos = document.getElementById("lista-pensamentos");
        const mensagemVazia = document.getElementById("mensagem-vazia");
        listaPensamentos.innerHTML = "";

        try {
            let pensamentosRenderizar;

            if (pensamentosFiltrados) {
                pensamentosRenderizar = pensamentosFiltrados;
            } else {
                pensamentosRenderizar =  await api.buscarPensamentos();
            }

            if (pensamentosRenderizar.length === 0) {
                mensagemVazia.style.display = "block";
              } else {
                mensagemVazia.style.display = "none";
                pensamentosRenderizar.forEach(ui.adicionarPensamento);
              }  
        } catch (error) {
            alert('Erro ao renderizar pensamentos');
        }
    }, 
    async adicionarPensamento(pensamento) {
        const listaPensamentos = document.getElementById("lista-pensamentos");
        const li = document.createElement("li");
        li.setAttribute("data-id", pensamento.id);
        li.classList.add("li-pensamento");

        const iconeAspas = document.createElement("img");
        iconeAspas.src = "assets/imagens/aspas-azuis.png";
        iconeAspas.alt = "Aspas Azuis";
        iconeAspas.classList.add("icone-aspas");

        const pensamentoConteudo = document.createElement("div");
        pensamentoConteudo.textContent = pensamento.conteudo;
        pensamentoConteudo.classList.add("pensamento-conteudo");

        const pensamentoAutoria = document.createElement("div");
        pensamentoAutoria.textContent = pensamento.autoria;
        pensamentoAutoria.classList.add("pensamento-autoria");

        const pensamentoData = document.createElement("div");
        const options = {
            weekday: 'long',
            year:'numeric',
            month:'long',
            day:'numeric',
            timeZone:'UTC'
        }
        const dataFormatada = pensamento.data.toLocaleDateString('pt-BR', options);
        const dataRegex = dataFormatada.replace(/^(\w)/, (match) => match.toUpperCase())
        pensamentoData.textContent = dataRegex;
        pensamentoData.classList.add("pensamento-data");

        const botaoEditar = document.createElement("button");
        botaoEditar.classList.add("botao-editar");
        botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id);


        const iconeEditar = document.createElement("img");
        iconeEditar.src = "assets/imagens/icone-editar.png";
        iconeEditar.alt = "botao de editar";
        botaoEditar.appendChild(iconeEditar);

        const botaoExcluir = document.createElement("button")
        botaoExcluir.classList.add("botao-excluir")
        botaoExcluir.onclick = async () => {
            try {
                await api.excluirPensamento(pensamento.id)
                ui.renderizarPensamentos()
            } catch (error) {
                alert("Erro ao excluir pensamnto")
            }
        }

        const iconeExcluir = document.createElement("img");
        iconeExcluir.src = "assets/imagens/icone-excluir.png";
        iconeExcluir.alt = "botao de excluir";
        botaoExcluir.appendChild(iconeExcluir);

        const botaoFavorito = document.createElement("button");
        botaoFavorito.classList.add("botao-favorito");
        botaoFavorito.onclick = async () => {
            try {
                await api.atualizarFavorito(pensamento.id, !pensamento.favorito);
                ui.renderizarPensamentos();
            } catch (error) {
                alert("Erro ao atualizar pensamento")
            }
        }

        const iconeFavorito = document.createElement("img");
        iconeFavorito.src = pensamento.favorito ? 
        "assets/imagens/icone-favorito.png" : 
        "assets/imagens/icone-favorito_outline.png";
        iconeFavorito.alt = "Icone de favorito";
        botaoFavorito.appendChild(iconeFavorito);

        const icones = document.createElement("div");
        icones.classList.add("icones");
        icones.appendChild(botaoFavorito);
        icones.appendChild(botaoEditar);
        icones.appendChild(botaoExcluir);

        li.appendChild(iconeAspas);
        li.appendChild(pensamentoConteudo);
        li.appendChild(pensamentoAutoria);
        li.appendChild(pensamentoData);
        li.appendChild(icones);
        listaPensamentos.appendChild(li);
    }
}

export default ui;