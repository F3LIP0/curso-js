/**
 * Sistema de Recados - Aplicação Principal
 * Autor: Sistema de Recados
 * Versão: 1.0.0
 */

// Classe principal do Sistema de Recados
class SistemaRecados {
    constructor() {
        this.recados = [];
        this.recadoParaExcluir = null;
        this.init();
    }

    // Inicialização da aplicação
    init() {
        this.carregarRecados();
        this.configurarEventos();
        this.renderizarRecados();
        this.atualizarContador();
        this.mostrarNotificacao('Sistema carregado com sucesso!', 'success');
    }

    // Configurar todos os eventos da aplicação
    configurarEventos() {
        // Evento de submit do formulário
        $('#formRecado').on('submit', (e) => {
            e.preventDefault();
            this.adicionarRecado();
        });

        // Evento de reset do formulário
        $('#formRecado').on('reset', () => {
            this.limparValidacao();
            setTimeout(() => {
                this.atualizarContadorCaracteres();
            }, 10);
        });

        // Contador de caracteres em tempo real
        $('#mensagem').on('input', () => {
            this.atualizarContadorCaracteres();
        });

        // Validação em tempo real
        $('#remetente, #destinatario, #mensagem').on('blur', (e) => {
            this.validarCampo($(e.target));
        });

        // Filtro de recados
        $('#filtroRecados').on('input', () => {
            this.filtrarRecados();
        });

        // Ordenação de recados
        $('#ordenarPor').on('change', () => {
            this.renderizarRecados();
        });

        // Confirmação de exclusão
        $('#confirmarExclusao').on('click', () => {
            if (this.recadoParaExcluir !== null) {
                this.excluirRecado(this.recadoParaExcluir);
                $('#modalConfirmacao').modal('hide');
            }
        });

        // Limpar modal ao fechar
        $('#modalConfirmacao').on('hidden.bs.modal', () => {
            this.recadoParaExcluir = null;
        });
    }

    // Adicionar novo recado
    adicionarRecado() {
        const dadosFormulario = this.capturarDadosFormulario();
        
        if (this.validarFormulario(dadosFormulario)) {
            const novoRecado = this.criarRecado(dadosFormulario);
            
            // Adicionar com animação
            this.recados.unshift(novoRecado);
            this.salvarRecados();
            this.renderizarRecados();
            this.atualizarContador();
            
            // Limpar formulário
            $('#formRecado')[0].reset();
            this.limparValidacao();
            this.atualizarContadorCaracteres();
            
            // Notificação de sucesso
            this.mostrarNotificacao('Recado adicionado com sucesso!', 'success');
            
            // Scroll suave para o novo recado
            setTimeout(() => {
                $('.recado-item').first().addClass('highlight');
                setTimeout(() => {
                    $('.recado-item').first().removeClass('highlight');
                }, 2000);
            }, 100);
        }
    }

    // Capturar dados do formulário
    capturarDadosFormulario() {
        return {
            remetente: $('#remetente').val().trim(),
            destinatario: $('#destinatario').val().trim(),
            mensagem: $('#mensagem').val().trim()
        };
    }

    // Criar objeto recado
    criarRecado(dados) {
        return {
            id: this.gerarId(),
            remetente: dados.remetente,
            destinatario: dados.destinatario,
            mensagem: dados.mensagem,
            dataHora: new Date().toISOString(),
            dataFormatada: this.formatarData(new Date())
        };
    }

    // Gerar ID único
    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Validar formulário completo
    validarFormulario(dados) {
        let valido = true;
        
        // Validar remetente
        if (!this.validarCampoTexto(dados.remetente, 2, 50)) {
            this.mostrarErroValidacao('#remetente', 'Nome deve ter entre 2 e 50 caracteres');
            valido = false;
        } else {
            this.mostrarSucessoValidacao('#remetente');
        }
        
        // Validar destinatário
        if (!this.validarCampoTexto(dados.destinatario, 2, 50)) {
            this.mostrarErroValidacao('#destinatario', 'Nome deve ter entre 2 e 50 caracteres');
            valido = false;
        } else {
            this.mostrarSucessoValidacao('#destinatario');
        }
        
        // Validar mensagem
        if (!this.validarCampoTexto(dados.mensagem, 5, 500)) {
            this.mostrarErroValidacao('#mensagem', 'Mensagem deve ter entre 5 e 500 caracteres');
            valido = false;
        } else {
            this.mostrarSucessoValidacao('#mensagem');
        }
        
        return valido;
    }

    // Validar campo individual
    validarCampo($campo) {
        const valor = $campo.val().trim();
        const id = $campo.attr('id');
        
        let valido = false;
        let mensagem = '';
        
        switch (id) {
            case 'remetente':
            case 'destinatario':
                valido = this.validarCampoTexto(valor, 2, 50);
                mensagem = 'Nome deve ter entre 2 e 50 caracteres';
                break;
            case 'mensagem':
                valido = this.validarCampoTexto(valor, 5, 500);
                mensagem = 'Mensagem deve ter entre 5 e 500 caracteres';
                break;
        }
        
        if (valor === '') {
            this.limparValidacaoCampo($campo);
        } else if (valido) {
            this.mostrarSucessoValidacao(`#${id}`);
        } else {
            this.mostrarErroValidacao(`#${id}`, mensagem);
        }
    }

    // Validar campo de texto
    validarCampoTexto(texto, minimo, maximo) {
        return texto.length >= minimo && texto.length <= maximo;
    }

    // Mostrar erro de validação
    mostrarErroValidacao(seletor, mensagem) {
        const $campo = $(seletor);
        $campo.removeClass('is-valid').addClass('is-invalid');
        $campo.siblings('.invalid-feedback').text(mensagem);
    }

    // Mostrar sucesso de validação
    mostrarSucessoValidacao(seletor) {
        const $campo = $(seletor);
        $campo.removeClass('is-invalid').addClass('is-valid');
        $campo.siblings('.invalid-feedback').text('');
    }

    // Limpar validação de um campo
    limparValidacaoCampo($campo) {
        $campo.removeClass('is-valid is-invalid');
        $campo.siblings('.invalid-feedback').text('');
    }

    // Limpar toda validação
    limparValidacao() {
        $('.form-control').removeClass('is-valid is-invalid');
        $('.invalid-feedback').text('');
    }

    // Atualizar contador de caracteres
    atualizarContadorCaracteres() {
        const texto = $('#mensagem').val();
        const contador = texto.length;
        const $contador = $('#contadorCaracteres');
        
        $contador.text(contador);
        
        // Mudar cor baseado no limite
        if (contador > 450) {
            $contador.css('color', '#dc3545'); // Vermelho
        } else if (contador > 400) {
            $contador.css('color', '#ffc107'); // Amarelo
        } else {
            $contador.css('color', '#0d6efd'); // Azul
        }
    }

    // Renderizar lista de recados
    renderizarRecados() {
        const $lista = $('#listaRecados');
        const $mensagemVazia = $('#mensagemVazia');
        
        // Obter recados filtrados e ordenados
        const recadosFiltrados = this.obterRecadosFiltrados();
        
        if (recadosFiltrados.length === 0) {
            $mensagemVazia.show();
            $('.recado-item').remove();
            return;
        }
        
        $mensagemVazia.hide();
        
        // Limpar lista atual
        $('.recado-item').remove();
        
        // Renderizar cada recado
        recadosFiltrados.forEach((recado, index) => {
            const $recadoElement = this.criarElementoRecado(recado, index);
            $lista.append($recadoElement);
        });
        
        // Configurar eventos dos botões de ação
        this.configurarEventosRecados();
    }

    // Criar elemento HTML do recado
    criarElementoRecado(recado, index) {
        return $(`
            <div class="recado-item fade-in" data-id="${recado.id}" style="animation-delay: ${index * 0.1}s">
                <div class="recado-header">
                    <div class="recado-info">
                        <div class="recado-de">
                            <i class="fas fa-user me-1"></i>
                            De: <strong>${this.escaparHtml(recado.remetente)}</strong>
                        </div>
                        <div class="recado-para">
                            <i class="fas fa-user-tag me-1"></i>
                            Para: <strong>${this.escaparHtml(recado.destinatario)}</strong>
                        </div>
                        <div class="recado-data">
                            <i class="fas fa-clock me-1"></i>
                            ${recado.dataFormatada}
                        </div>
                    </div>
                    <div class="recado-acoes">
                        <button class="btn btn-sm btn-outline-primary btn-visualizar" 
                                data-id="${recado.id}" title="Visualizar recado">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-excluir" 
                                data-id="${recado.id}" title="Excluir recado">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="recado-mensagem">
                    <i class="fas fa-quote-left me-2 text-muted"></i>
                    ${this.escaparHtml(recado.mensagem)}
                    <i class="fas fa-quote-right ms-2 text-muted"></i>
                </div>
            </div>
        `);
    }

    // Configurar eventos dos recados
    configurarEventosRecados() {
        // Botão de exclusão
        $('.btn-excluir').on('click', (e) => {
            const id = $(e.currentTarget).data('id');
            this.confirmarExclusao(id);
        });

        // Botão de visualização (expandir/contrair)
        $('.btn-visualizar').on('click', (e) => {
            const $botao = $(e.currentTarget);
            const $recado = $botao.closest('.recado-item');
            const $mensagem = $recado.find('.recado-mensagem');
            
            if ($mensagem.is(':visible')) {
                $mensagem.slideUp(300);
                $botao.html('<i class="fas fa-eye"></i>');
                $botao.attr('title', 'Visualizar recado');
            } else {
                $mensagem.slideDown(300);
                $botao.html('<i class="fas fa-eye-slash"></i>');
                $botao.attr('title', 'Ocultar recado');
            }
        });
    }

    // Confirmar exclusão
    confirmarExclusao(id) {
        this.recadoParaExcluir = id;
        const recado = this.recados.find(r => r.id === id);
        
        if (recado) {
            $('#modalConfirmacao .modal-body p:first').html(
                `Tem certeza que deseja excluir o recado de <strong>${this.escaparHtml(recado.remetente)}</strong> para <strong>${this.escaparHtml(recado.destinatario)}</strong>?`
            );
            $('#modalConfirmacao').modal('show');
        }
    }

    // Excluir recado
    excluirRecado(id) {
        const $recado = $(`.recado-item[data-id="${id}"]`);
        
        // Animação de saída
        $recado.addClass('slide-out');
        
        setTimeout(() => {
            this.recados = this.recados.filter(r => r.id !== id);
            this.salvarRecados();
            this.renderizarRecados();
            this.atualizarContador();
            this.mostrarNotificacao('Recado excluído com sucesso!', 'warning');
        }, 300);
    }

    // Filtrar recados
    filtrarRecados() {
        const filtro = $('#filtroRecados').val().toLowerCase().trim();
        
        if (filtro === '') {
            $('.recado-item').show();
            return;
        }
        
        $('.recado-item').each(function() {
            const $recado = $(this);
            const id = $recado.data('id');
            const recado = sistema.recados.find(r => r.id === id);
            
            if (recado) {
                const textoCompleto = `${recado.remetente} ${recado.destinatario} ${recado.mensagem}`.toLowerCase();
                
                if (textoCompleto.includes(filtro)) {
                    $recado.show();
                } else {
                    $recado.hide();
                }
            }
        });
    }

    // Obter recados filtrados e ordenados
    obterRecadosFiltrados() {
        let recadosOrdenados = [...this.recados];
        const ordenacao = $('#ordenarPor').val();
        
        switch (ordenacao) {
            case 'data-desc':
                recadosOrdenados.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
                break;
            case 'data-asc':
                recadosOrdenados.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
                break;
            case 'remetente':
                recadosOrdenados.sort((a, b) => a.remetente.localeCompare(b.remetente));
                break;
            case 'destinatario':
                recadosOrdenados.sort((a, b) => a.destinatario.localeCompare(b.destinatario));
                break;
        }
        
        return recadosOrdenados;
    }

    // Atualizar contador de recados
    atualizarContador() {
        const total = this.recados.length;
        $('#contadorRecados').text(total);
        
        // Atualizar título da página
        document.title = `Sistema de Recados (${total})`;
    }

    // Salvar recados no localStorage
    salvarRecados() {
        try {
            localStorage.setItem('sistemaRecados', JSON.stringify(this.recados));
        } catch (error) {
            console.error('Erro ao salvar recados:', error);
            this.mostrarNotificacao('Erro ao salvar dados!', 'danger');
        }
    }

    // Carregar recados do localStorage
    carregarRecados() {
        try {
            const dados = localStorage.getItem('sistemaRecados');
            if (dados) {
                this.recados = JSON.parse(dados);
                console.log(`${this.recados.length} recados carregados do localStorage`);
            }
        } catch (error) {
            console.error('Erro ao carregar recados:', error);
            this.recados = [];
            this.mostrarNotificacao('Erro ao carregar dados salvos!', 'warning');
        }
    }

    // Formatar data
    formatarData(data) {
        const opcoes = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        return data.toLocaleDateString('pt-BR', opcoes);
    }

    // Escapar HTML para prevenir XSS
    escaparHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // Mostrar notificação toast
    mostrarNotificacao(mensagem, tipo = 'info') {
        const $toast = $('#toastNotificacao');
        const $body = $toast.find('.toast-body');
        const $header = $toast.find('.toast-header');
        
        // Configurar ícone e cor baseado no tipo
        let icone = 'fas fa-info-circle';
        let cor = 'text-primary';
        
        switch (tipo) {
            case 'success':
                icone = 'fas fa-check-circle';
                cor = 'text-success';
                break;
            case 'warning':
                icone = 'fas fa-exclamation-triangle';
                cor = 'text-warning';
                break;
            case 'danger':
                icone = 'fas fa-times-circle';
                cor = 'text-danger';
                break;
        }
        
        $header.find('i').attr('class', `${icone} ${cor} me-2`);
        $body.text(mensagem);
        
        // Mostrar toast
        const toast = new bootstrap.Toast($toast[0], {
            autohide: true,
            delay: 3000
        });
        toast.show();
    }

    // Exportar recados para JSON
    exportarRecados() {
        if (this.recados.length === 0) {
            this.mostrarNotificacao('Nenhum recado para exportar!', 'warning');
            return;
        }
        
        const dados = {
            exportadoEm: new Date().toISOString(),
            totalRecados: this.recados.length,
            recados: this.recados
        };
        
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recados_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.mostrarNotificacao('Recados exportados com sucesso!', 'success');
    }

    // Limpar todos os recados
    limparTodosRecados() {
        if (this.recados.length === 0) {
            this.mostrarNotificacao('Não há recados para limpar!', 'warning');
            return;
        }
        
        if (confirm('Tem certeza que deseja excluir TODOS os recados? Esta ação não pode ser desfeita.')) {
            this.recados = [];
            this.salvarRecados();
            this.renderizarRecados();
            this.atualizarContador();
            this.mostrarNotificacao('Todos os recados foram excluídos!', 'success');
        }
    }
}

// Instância global do sistema
let sistema;

// Inicializar quando o documento estiver pronto
$(document).ready(function() {
    sistema = new SistemaRecados();
    
    // Adicionar eventos globais
    $(window).on('beforeunload', function() {
        sistema.salvarRecados();
    });
    
    // Atalhos de teclado
    $(document).on('keydown', function(e) {
        // Ctrl + Enter para salvar recado
        if (e.ctrlKey && e.keyCode === 13) {
            e.preventDefault();
            $('#formRecado').submit();
        }
        
        // Escape para limpar formulário
        if (e.keyCode === 27) {
            $('#formRecado')[0].reset();
            sistema.limparValidacao();
            sistema.atualizarContadorCaracteres();
        }
    });
    
    console.log('Sistema de Recados inicializado com sucesso!');
});

