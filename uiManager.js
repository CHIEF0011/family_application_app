// UI Manager - Handles UI interactions and notifications
export class UIManager {
    constructor() {
        this.messageTimeout = null;
    }

    showMessage(message, type = 'info', duration = 3000) {
        // Remove existing message
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            const existingMessage = document.querySelector('.message');
            if (existingMessage) {
                existingMessage.remove();
            }
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;

        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageEl, mainContent.firstChild);

        // Auto-remove after duration
        this.messageTimeout = setTimeout(() => {
            messageEl.remove();
            this.messageTimeout = null;
        }, duration);
    }

    showLoading(element, show = true) {
        if (show) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    }

    confirm(message) {
        return window.confirm(message);
    }

    prompt(message, defaultValue = '') {
        return window.prompt(message, defaultValue);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Add smooth scrolling to element
    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Add fade in animation
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const fade = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(fade);
            }
        };
        
        requestAnimationFrame(fade);
    }

    // Add fade out animation
    fadeOut(element, duration = 300) {
        element.style.opacity = '1';
        
        let start = null;
        const fade = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(fade);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(fade);
    }
}