/**
 * Efeitos Visuais Adicionais - Sistema de Recados
 * Arquivo com efeitos especiais usando jQuery
 */

$(document).ready(function() {
    
    // Efeito de digitação no título
    function efeitoDigitacao() {
        const texto = "Sistema de Recados";
        const $titulo = $('header h1');
        $titulo.text('');
        
        let i = 0;
        const timer = setInterval(() => {
            $titulo.text(texto.substring(0, i + 1));
            i++;
            if (i >= texto.length) {
                clearInterval(timer);
                // Adicionar ícone após digitação
                setTimeout(() => {
                    $titulo.html('<i class="fas fa-sticky-note me-2"></i>' + texto);
                }, 500);
            }
        }, 100);
    }

    // Efeito de fade in nos cards
    function animarCards() {
        $('.card').each(function(index) {
            $(this).css({
                'opacity': '0',
                'transform': 'translateY(30px)'
            }).delay(index * 200).animate({
                'opacity': '1'
            }, 600).css('transform', 'translateY(0)');
        });
    }

    // Efeito de pulsação no botão de salvar
    function pulsarBotaoSalvar() {
        $('#formRecado button[type="submit"]').hover(
            function() {
                $(this).addClass('animate__animated animate__pulse');
            },
            function() {
                $(this).removeClass('animate__animated animate__pulse');
            }
        );
    }

    // Efeito de shake quando há erro de validação
    function shakeErroValidacao() {
        const originalMostrarErro = sistema.mostrarErroValidacao;
        sistema.mostrarErroValidacao = function(seletor, mensagem) {
            originalMostrarErro.call(this, seletor, mensagem);
            $(seletor).addClass('animate__animated animate__shakeX');
            setTimeout(() => {
                $(seletor).removeClass('animate__animated animate__shakeX');
            }, 1000);
        };
    }

    // Efeito de confetti quando recado é adicionado
    function confettiSucesso() {
        const originalAdicionarRecado = sistema.adicionarRecado;
        sistema.adicionarRecado = function() {
            const resultado = originalAdicionarRecado.call(this);
            
            // Criar confetti simples
            if (this.recados.length > 0) {
                criarConfetti();
            }
            
            return resultado;
        };
    }

    // Criar efeito de confetti
    function criarConfetti() {
        const cores = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = $('<div class="confetti"></div>');
            confetti.css({
                'position': 'fixed',
                'width': '10px',
                'height': '10px',
                'background': cores[Math.floor(Math.random() * cores.length)],
                'left': Math.random() * window.innerWidth + 'px',
                'top': '-10px',
                'z-index': '9999',
                'border-radius': '50%',
                'pointer-events': 'none'
            });
            
            $('body').append(confetti);
            
            confetti.animate({
                'top': window.innerHeight + 'px',
                'left': '+=' + (Math.random() * 200 - 100) + 'px'
            }, Math.random() * 3000 + 2000, function() {
                $(this).remove();
            });
        }
    }

    // Efeito de typewriter para mensagens
    function typewriterEffect($element, text, speed = 50) {
        $element.text('');
        let i = 0;
        
        const timer = setInterval(() => {
            $element.text(text.substring(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, speed);
    }

    // Efeito de loading nos botões
    function efeitoLoadingBotoes() {
        $(document).on('click', '.btn-excluir', function() {
            const $btn = $(this);
            const originalHtml = $btn.html();
            
            $btn.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);
            
            setTimeout(() => {
                $btn.html(originalHtml).prop('disabled', false);
            }, 1000);
        });
    }

    // Efeito de highlight ao pesquisar
    function highlightPesquisa() {
        const originalFiltrar = sistema.filtrarRecados;
        sistema.filtrarRecados = function() {
            const filtro = $('#filtroRecados').val().toLowerCase().trim();
            
            // Remover highlights anteriores
            $('.highlight-search').removeClass('highlight-search');
            
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
                        $recado.show().addClass('highlight-search');
                        
                        // Highlight do texto encontrado
                        const regex = new RegExp(`(${filtro})`, 'gi');
                        $recado.find('.recado-de, .recado-para, .recado-mensagem').each(function() {
                            const $elem = $(this);
                            const texto = $elem.text();
                            const novoTexto = texto.replace(regex, '<mark>$1</mark>');
                            if (novoTexto !== texto) {
                                $elem.html(novoTexto);
                            }
                        });
                    } else {
                        $recado.hide();
                    }
                }
            });
        };
    }

    // Efeito de contador animado
    function animarContador() {
        const originalAtualizarContador = sistema.atualizarContador;
        sistema.atualizarContador = function() {
            const total = this.recados.length;
            const $contador = $('#contadorRecados');
            const valorAtual = parseInt($contador.text()) || 0;
            
            // Animar contador
            $({ counter: valorAtual }).animate({ counter: total }, {
                duration: 500,
                step: function() {
                    $contador.text(Math.ceil(this.counter));
                },
                complete: function() {
                    $contador.text(total);
                }
            });
            
            // Atualizar título da página
            document.title = `Sistema de Recados (${total})`;
        };
    }

    // Efeito de parallax no header
    function efeitoParallax() {
        $(window).scroll(function() {
            const scrolled = $(window).scrollTop();
            const parallax = scrolled * 0.5;
            $('header').css('transform', `translateY(${parallax}px)`);
        });
    }

    // Efeito de smooth scroll
    function smoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 800);
            }
        });
    }

    // Efeito de tooltip dinâmico
    function tooltipDinamico() {
        $('[title]').tooltip({
            trigger: 'hover',
            placement: 'top',
            animation: true
        });
    }

    // Efeito de auto-save visual
    function autoSaveVisual() {
        const originalSalvarRecados = sistema.salvarRecados;
        sistema.salvarRecados = function() {
            originalSalvarRecados.call(this);
            
            // Mostrar indicador de salvamento
            const $indicador = $('<div class="save-indicator">💾 Salvando...</div>');
            $indicador.css({
                'position': 'fixed',
                'top': '20px',
                'right': '20px',
                'background': '#28a745',
                'color': 'white',
                'padding': '10px 15px',
                'border-radius': '5px',
                'z-index': '9999',
                'font-size': '14px',
                'opacity': '0'
            });
            
            $('body').append($indicador);
            
            $indicador.animate({ opacity: 1 }, 200).delay(1000).animate({ opacity: 0 }, 200, function() {
                $(this).remove();
            });
        };
    }

    // Inicializar todos os efeitos
    function inicializarEfeitos() {
        // Aguardar o sistema estar pronto
        setTimeout(() => {
            if (typeof sistema !== 'undefined') {
                animarCards();
                pulsarBotaoSalvar();
                shakeErroValidacao();
                confettiSucesso();
                efeitoLoadingBotoes();
                highlightPesquisa();
                animarContador();
                efeitoParallax();
                smoothScroll();
                tooltipDinamico();
                autoSaveVisual();
                
                console.log('Efeitos visuais carregados com sucesso!');
            }
        }, 1000);
    }

    // Adicionar CSS para os efeitos
    const estilosEfeitos = `
        <style>
        .highlight-search {
            box-shadow: 0 0 20px rgba(255, 193, 7, 0.5) !important;
            border-left-color: #ffc107 !important;
        }
        
        .save-indicator {
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
        
        .confetti {
            animation: fall linear infinite;
        }
        
        @keyframes fall {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        
        mark {
            background: linear-gradient(120deg, #ffeaa7 0%, #fab1a0 100%);
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }
        </style>
    `;
    
    $('head').append(estilosEfeitos);
    
    // Inicializar efeitos
    inicializarEfeitos();
});

// Adicionar Animate.css para animações
$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">');

