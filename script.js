// =====================================================
// Abdullahi Madowe — Portfolio interactions
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initScrollSpy();
  initTypingEffect();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initFooterYear();
});

// -----------------------------------------------------
// Mobile hamburger menu
// -----------------------------------------------------
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const navbar = document.querySelector('.navbar');
  if (!menuBtn || !navbar) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navbar.classList.toggle('active');
  });

  // close menu when a link is tapped
  navbar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navbar.classList.remove('active');
    });
  });
}

// -----------------------------------------------------
// Header background on scroll
// -----------------------------------------------------
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  toggle();
  window.addEventListener('scroll', toggle);
}

// -----------------------------------------------------
// Highlight the active nav link based on scroll position
// -----------------------------------------------------
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar a');
  if (!sections.length || !navLinks.length) return;

  const setActive = () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  setActive();
  window.addEventListener('scroll', setActive);
}

// -----------------------------------------------------
// Typewriter effect cycling through roles
// -----------------------------------------------------
function initTypingEffect() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const roles = ['Graphic Designer', 'Brand Identity Designer', 'Social Media & Print Designer'];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 40 : 80);
  };

  tick();
}

// -----------------------------------------------------
// Fade/slide sections and cards into view on scroll
// -----------------------------------------------------
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.about-imag, .about-content, .skill-box, .project-box, .contact-info, .contact-form'
  );
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

// -----------------------------------------------------
// Animate skill bars once they scroll into view
// -----------------------------------------------------
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar span');
  if (!bars.length) return;

  bars.forEach((bar) => {
    const targetWidth = bar.style.width;
    bar.dataset.targetWidth = targetWidth;
    bar.style.setProperty('--target-width', targetWidth);
    bar.style.width = '0';
  });

  const fillBar = (bar) => {
    bar.style.width = bar.dataset.targetWidth;
  };

  if (!('IntersectionObserver' in window)) {
    bars.forEach(fillBar);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

// -----------------------------------------------------
// Filter the projects grid by category
// -----------------------------------------------------
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectBoxes = document.querySelectorAll('.project-box');
  if (!filterBtns.length || !projectBoxes.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectBoxes.forEach((box) => {
        const matches = filter === 'all' || box.dataset.filter === filter;
        box.classList.toggle('hidden', !matches);
      });
    });
  });
}

// -----------------------------------------------------
// Validate and "submit" the contact form
// -----------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('name-error') },
    email: { input: document.getElementById('email'), error: document.getElementById('email-error') },
    message: { input: document.getElementById('message'), error: document.getElementById('message-error') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (key) => {
    const { input, error } = fields[key];
    let message = '';

    if (!input.value.trim()) {
      message = 'This field is required.';
    } else if (key === 'email' && !emailPattern.test(input.value.trim())) {
      message = 'Please enter a valid email address.';
    }

    input.classList.toggle('invalid', Boolean(message));
    error.textContent = message;
    return !message;
  };

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const isValid = results.every(Boolean);

    if (!isValid) {
      status.textContent = 'Please fix the errors above before sending.';
      status.className = 'form-status error';
      return;
    }

    // Sends the message to daahino2004@gmail.com via FormSubmit (no backend required).
    status.textContent = 'Sending...';
    status.className = 'form-status';

    const formData = new FormData(form);

    fetch('https://formsubmit.co/ajax/daahino2004@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      })
      .then(() => {
        status.textContent = `Thanks ${fields.name.input.value.trim()}! Your message has been sent. I'll reply to ${fields.email.input.value.trim()} soon.`;
        status.className = 'form-status success';
        form.reset();
      })
      .catch(() => {
        status.textContent = 'Something went wrong sending your message. Please email me directly at daahino2004@gmail.com.';
        status.className = 'form-status error';
      });
  });
}

// -----------------------------------------------------
// Show/hide + wire up the back-to-top button
// -----------------------------------------------------
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => btn.classList.toggle('show', window.scrollY > 400);
  toggle();
  window.addEventListener('scroll', toggle);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// -----------------------------------------------------
// Footer year
// -----------------------------------------------------
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
