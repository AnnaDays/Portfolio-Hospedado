// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });

  document.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
  });
}

// Efeito do cabeçalho ao rolar a página
const header = document.querySelector('.site-header');

function updateHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 30);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Animação de entrada das seções
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Carrosséis dos projetos
document.querySelectorAll('.project-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevButton = carousel.querySelector('.carousel-btn.prev');
  const nextButton = carousel.querySelector('.carousel-btn.next');
  const dotsContainer = carousel.querySelector('.carousel-dots');

  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  let autoplay = null;
  const hasMultipleSlides = slides.length > 1;

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentSlide);
        dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
      });
    }
  }

  function stopAutoplay() {
    if (autoplay) {
      clearInterval(autoplay);
      autoplay = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (hasMultipleSlides && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      autoplay = setInterval(() => goToSlide(currentSlide + 1), 6000);
    }
  }

  if (hasMultipleSlides) {
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(index);
          startAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        startAutoplay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        startAutoplay();
      });
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
    startAutoplay();
  } else {
    if (prevButton) prevButton.hidden = true;
    if (nextButton) nextButton.hidden = true;
    if (dotsContainer) dotsContainer.hidden = true;
  }
});

// Ano automático no rodapé
const yearElement = document.querySelector('#current-year');
if (yearElement) yearElement.textContent = new Date().getFullYear();


// Terminal interativo: comandos executados no próprio navegador
const terminalForm = document.querySelector('#terminal-form');
const terminalInput = document.querySelector('#terminal-input');
const terminalOutput = document.querySelector('#terminal-output');
const terminalCommands = {
  help: 'Comandos disponíveis: sobre, skills, experiencia, projetos, contato e clear.',
  sobre: 'Sou a Ana Luiza: Cientista de Dados Jr., atleta natural Wellness, crocheteira, fã de The Last of Us e obcecada por The Walking Dead. Mãe da Marie e da Pitucha!',
  skills: 'Python • SQL • PySpark • Databricks • Power BI • Excel • Pandas • NumPy • JavaScript • ETL • Pipelines',
  experiencia: 'No Santander, comecei como estagiária em Ciência de Dados e evoluí para Cientista de Dados Jr. Atuei com pipelines, ETL, preparação e validação de dados, dashboards, indicadores e análises. Ferramentas: Python, SQL, PySpark, Databricks e Power BI.',
  projetos: 'Tenho projetos web e mobile desenvolvidos durante minha formação. Role a página até a seção Projetos para conhecer cada um.',
  contato: 'Vamos conversar? E-mail: analuizadias389@gmail.com | LinkedIn: linkedin.com/in/ana-luiza-dias-an0808/'
};
const commandHistory = [];
let historyPosition = 0;

function runTerminalCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command || !terminalOutput) return;
  const commandLine = document.createElement('p');
  commandLine.className = 'terminal-line';
  commandLine.textContent = `ana@portfolio:~$ ${command}`;
  terminalOutput.appendChild(commandLine);

  if (command === 'clear') {
    terminalOutput.innerHTML = '<p class="terminal-welcome">Terminal limpo. Manda outro comando! ✨</p>';
    return;
  }

  const response = terminalCommands[command];
  const result = document.createElement('p');
  result.className = response ? 'terminal-result' : 'terminal-error';
  result.textContent = response || `Comando "${command}" não encontrado. Digite help para ver as opções.`;
  terminalOutput.appendChild(result);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

if (terminalForm && terminalInput && terminalOutput) {
  terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = terminalInput.value;
    if (command.trim()) {
      commandHistory.push(command);
      historyPosition = commandHistory.length;
      runTerminalCommand(command);
      terminalInput.value = '';
    }
  });

  terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && commandHistory.length) {
      event.preventDefault();
      historyPosition = Math.max(0, historyPosition - 1);
      terminalInput.value = commandHistory[historyPosition];
    }
    if (event.key === 'ArrowDown' && commandHistory.length) {
      event.preventDefault();
      historyPosition = Math.min(commandHistory.length, historyPosition + 1);
      terminalInput.value = commandHistory[historyPosition] || '';
    }
  });

  document.querySelectorAll('[data-command]').forEach((button) => {
    button.addEventListener('click', () => {
      const command = button.dataset.command;
      if (command === 'clear') {
        runTerminalCommand('clear');
      } else {
        runTerminalCommand(command);
      }
      terminalInput.focus();
    });
  });
}

// Pequeno efeito de inclinação nos cards (desativado em telas touch)
const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (supportsFinePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.project-card, .education-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * 4;
      const rotateX = (0.5 - y) * 4;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}


// Mini laboratório de Python: executa código real no navegador com Pyodide.
(() => {
  const runButton = document.getElementById('python-run');
  const resetButton = document.getElementById('python-reset');
  const codeEditor = document.getElementById('python-code');
  const output = document.getElementById('python-output');
  const status = document.getElementById('python-status');
  const runtime = document.getElementById('python-runtime');

  if (!runButton || !codeEditor || !output) return;

  const starterCode = codeEditor.value;
  let pyodideInstance = null;
  let loadingPromise = null;

  const setStatus = (message, state = '') => {
    status.innerHTML = `<b></b> ${message}`;
    status.dataset.state = state;
    runtime.textContent = message;
  };

  async function loadPython() {
    if (pyodideInstance) return pyodideInstance;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      if (typeof loadPyodide !== 'function') {
        throw new Error('Não consegui carregar o ambiente Python. Confira sua conexão e tente novamente.');
      }
      setStatus('CARREGANDO PYTHON...');
      pyodideInstance = await loadPyodide();
      return pyodideInstance;
    })();

    try {
      return await loadingPromise;
    } catch (error) {
      loadingPromise = null;
      throw error;
    }
  }

  runButton.addEventListener('click', async () => {
    runButton.disabled = true;
    runButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executando...';
    output.classList.remove('error');
    output.textContent = '';
    setStatus('EXECUTANDO...');

    try {
      const pyodide = await loadPython();
      let printed = '';
      pyodide.setStdout({ batched: (message) => { printed += `${message}\n`; } });
      pyodide.setStderr({ batched: (message) => { printed += `${message}\n`; } });
      await pyodide.runPythonAsync(codeEditor.value);
      output.textContent = printed.trim() || 'Código executado! (não houve saída porque não foi usado print.)';
      setStatus('EXECUTADO COM SUCESSO', 'success');
    } catch (error) {
      output.classList.add('error');
      output.textContent = error.message || String(error);
      setStatus('ERRO NA EXECUÇÃO', 'error');
    } finally {
      runButton.disabled = false;
      runButton.innerHTML = '<i class="fa-solid fa-play"></i> Executar Python';
    }
  });

  resetButton?.addEventListener('click', () => {
    codeEditor.value = starterCode;
    output.classList.remove('error');
    output.textContent = 'Exemplo restaurado. Clique em “Executar Python” para rodar.';
    setStatus('PRONTO PARA RODAR');
  });
})();