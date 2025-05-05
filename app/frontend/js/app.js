// Particles.js configuration
document.addEventListener("DOMContentLoaded", () => {
  // Check if particlesJS is already defined, if not, declare it. This handles cases where the script might be loaded differently.
  if (typeof particlesJS === "undefined") {
    window.particlesJS = () => {
      console.warn("particlesJS is not properly loaded. Ensure particles.js library is included.")
    }
  }

  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#00c2ff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00c2ff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    })
  }

  // Add notification and loading overlay styles
  const style = document.createElement("style")
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      background-color: var(--medium-bg);
      border-left: 3px solid var(--primary-color);
      color: var(--text-color);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      transform: translateX(120%);
      transition: transform 0.3s ease;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification.success {
      border-left-color: var(--success-color);
    }
    
    .notification.error {
      border-left-color: var(--error-color);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
    }
    
    .notification-content i {
      margin-right: 10px;
      font-size: 1.2rem;
    }
    
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    
    .loading-spinner {
      position: relative;
      width: 80px;
      height: 80px;
    }
    
    .spinner {
      position: absolute;
      border: 4px solid transparent;
      border-top: 4px solid var(--primary-color);
      border-right: 4px solid var(--secondary-color);
      border-radius: 50%;
      width: 100%;
      height: 100%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .activity-log {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .activity-item {
      padding: 10px 15px;
      border-bottom: 1px solid var(--light-bg);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .activity-time {
      color: var(--primary-color);
      font-size: 0.8rem;
    }
    
    .activity-description {
      color: var(--text-color);
    }
  `
  document.head.appendChild(style)
})

// Helper functions
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Theme toggle functionality
function toggleTheme() {
  const body = document.body
  if (body.classList.contains("light-theme")) {
    body.classList.remove("light-theme")
    localStorage.setItem("theme", "dark")
  } else {
    body.classList.add("light-theme")
    localStorage.setItem("theme", "light")
  }
}

// Check for saved theme preference
function loadTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    document.body.classList.add("light-theme")
  }
}

// Call loadTheme on page load
document.addEventListener("DOMContentLoaded", loadTheme)
