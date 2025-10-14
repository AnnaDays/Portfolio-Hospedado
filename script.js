// Navegação mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
        navLinks.forEach(link => {
            link.style.animation = '';
        });
    });
});

// Carrossel de projetos
function initializeCarousels() {
    document.querySelectorAll('.project-carousel').forEach((carousel) => {
        const container = carousel.querySelector('.carousel-container');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoPlayInterval;
        
        // Criar indicadores
        if (indicatorsContainer && totalSlides > 1) {
            indicatorsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const indicator = document.createElement('div');
                indicator.classList.add('carousel-indicator');
                if (i === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => {
                    goToSlide(i);
                });
                indicatorsContainer.appendChild(indicator);
            });
        }
        
        const indicators = indicatorsContainer ? indicatorsContainer.querySelectorAll('.carousel-indicator') : [];
        
        // Função para ir para um slide específico
        function goToSlide(slideIndex) {
            // Atualizar slide atual
            currentSlide = slideIndex;
            
            // Mover o container
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Atualizar indicadores
            indicators.forEach((indicator, i) => {
                if (i === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // Event listeners para os botões (apenas se houver mais de um slide)
        if (totalSlides > 1) {
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const nextIndex = (currentSlide + 1) % totalSlides;
                    goToSlide(nextIndex);
                    resetAutoPlay();
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
                    goToSlide(prevIndex);
                    resetAutoPlay();
                });
            }
            
            // Iniciar autoplay
            function startAutoPlay() {
                if (totalSlides > 1) {
                    autoPlayInterval = setInterval(() => {
                        const nextIndex = (currentSlide + 1) % totalSlides;
                        goToSlide(nextIndex);
                    }, 5000);
                }
            }
            
            function resetAutoPlay() {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
            
            startAutoPlay();
            
            // Pausar autoplay ao passar o mouse
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            
            // Retomar autoplay ao remover o mouse
            carousel.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        } else {
            // Se houver apenas um slide, esconder controles
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (indicatorsContainer) indicatorsContainer.style.display = 'none';
        }
    });
}

// Inicializar carrosseis quando a página carregar
document.addEventListener('DOMContentLoaded', initializeCarousels);

// Animação de revelação ao scroll
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Formulário de contato
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulação de envio
        const formData = new FormData(this);
        const formObject = Object.fromEntries(formData);
        
        // Aqui você normalmente faria uma requisição AJAX
        console.log('Dados do formulário:', formObject);
        
        // Feedback visual
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Animações dos progress bars dos idiomas
document.addEventListener('DOMContentLoaded', function() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
});