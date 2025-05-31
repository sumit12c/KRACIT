// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe sections
document.querySelectorAll('.about-section, .feature-item').forEach(section => {
  observer.observe(section);
});

// Login container animation
const loginContainer = document.querySelector('.login-container');
if (loginContainer) {
  setTimeout(() => {
    loginContainer.classList.add('animate');
  }, 100);
}

// Notification function
function showNotification(message) {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.classList.add('show');

  setTimeout(() => {
    note.classList.remove('show');
  }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Form submission handling (keep your existing backend code)
document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;

  if (password !== confirm) {
    showNotification('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(data.message || 'Registration successful!');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      showNotification(data.message || 'Registration failed.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showNotification('An error occurred during registration.');
  }
});

// Hover effects for buttons
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-3px)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
  });
});


