// ── Cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
if (cursor && ring) {
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
    function animRing() { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(animRing); }
    animRing();
}

// ── Nav scroll ──
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ── Counter animation ──
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + (el.dataset.count == '98' ? '%' : '+');
        if (current >= target) clearInterval(timer);
    }, 25);
}

// ── Reveal on scroll ──
const revealEls = document.querySelectorAll('.reveal');
const statsEls = document.querySelectorAll('[data-count]');
let statsAnimated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statsEls.forEach(el => animateCounter(el));
        }
    });
}, { threshold: 0.5 });

if (statsEls.length) statsObserver.observe(statsEls[0]);

// ── Form submit ──
function submitForm() {
    const nombre = document.getElementById('inputNombre').value.trim();
    const tel = document.getElementById('inputTel').value.trim();
    const servicio = document.getElementById('inputServicio').value;
    if (!nombre || !tel || !servicio) {
        document.getElementById('inputNombre').style.borderColor = nombre ? '' : 'rgba(224,28,28,0.8)';
        document.getElementById('inputTel').style.borderColor = tel ? '' : 'rgba(224,28,28,0.8)';
        document.getElementById('inputServicio').style.borderColor = servicio ? '' : 'rgba(224,28,28,0.8)';
        return;
    }
    const btn = document.getElementById('btnSubmit');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
        document.getElementById('contactForm').querySelector('.form-title').style.display = 'none';
        document.getElementById('contactForm').querySelectorAll('.form-group, .form-row, .btn-submit').forEach(el => el.style.display = 'none');
        document.getElementById('formSuccess').style.display = 'block';
    }, 1200);
}

// Quitar borde rojo al escribir
document.querySelectorAll('.form-input').forEach(el => {
    el.addEventListener('input', () => el.style.borderColor = '');
});

// ── CATALOG FILTER ──
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        document.querySelectorAll('.product-card').forEach(card => {
            if (filter === 'all' || card.dataset.filter === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ── WHATSAPP OPEN ──
function openWhatsApp(e, el) {
    e.preventDefault();
    const product = el.dataset.product || 'producto';
    const msg = encodeURIComponent('Hola DieselMex, me interesa cotizar: ' + product + '. Gracias.');
    window.open('https://wa.me/5215512345678?text=' + msg, '_blank');
}

// ── DIAGNÓSTICO INTERACTIVO ──
const diagData = {
    humo: {
        title: 'Posible desgaste en inyectores',
        desc: 'El humo negro indica combustión incompleta. Generalmente es por inyectores desgastados que no pulverizan bien el diésel o presión de bomba incorrecta.',
        recomendacion: 'Te recomendamos una calibración de inyectores en banco de prueba.'
    },
    potencia: {
        title: 'Posible falla en bomba de alta presión',
        desc: 'La pérdida de potencia suele deberse a baja presión en el riel común. La bomba CP1/CP3 puede estar perdiendo eficiencia interna.',
        recomendacion: 'Te recomendamos diagnóstico computarizado del sistema de inyección.'
    },
    arranque: {
        title: 'Posible problema de precámara o toberas',
        desc: 'El arranque difícil en frío apunta a toberas con goteo, pérdida de compresión en precámara o válvulas de retención dañadas.',
        recomendacion: 'Te recomendamos revisión de toberas y prueba de compresión.'
    },
    ruido: {
        title: 'Posible descalibración de inyección',
        desc: 'El cascabeleo o ruido anormal indica que el tiempo de inyección está desfasado. Puede ser por desgaste en el sistema de inyección o bomba mal calibrada.',
        recomendacion: 'Te recomendamos calibración completa del sistema de inyección.'
    }
};

function diagSelect(sintoma) {
    const data = diagData[sintoma];
    if (!data) return;
    document.getElementById('diagSintoma').textContent = document.querySelector('.diag-opt[onclick*="' + sintoma + '"] span').textContent;
    document.getElementById('diagResultTitle').textContent = data.title;
    document.getElementById('diagResultDesc').textContent = data.desc;
    document.getElementById('diagRecomendacion').textContent = data.recomendacion;
    document.getElementById('diagStep1').classList.remove('active');
    document.getElementById('diagStep2').classList.add('active');
}

function diagReset() {
    document.getElementById('diagStep2').classList.remove('active');
    document.getElementById('diagStep1').classList.add('active');
}
