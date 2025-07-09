class LandingPage {
    constructor() {
        this.initializeElements()
        this.bindEvents()
        this.initializeAnimations()
    }

    initializeElements() {
        this.demoBtn = document.querySelector(".demo-btn")
        this.demoModal = document.getElementById("demoModal")
        this.closeDemoModal = document.getElementById("closeDemoModal")
        this.mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
        this.navMenu = document.querySelector(".nav-menu")
    }

    bindEvents() {
        // Demo modal events
        if (this.demoBtn) {
        this.demoBtn.addEventListener("click", () => this.openDemoModal())
        }

        if (this.closeDemoModal) {
        this.closeDemoModal.addEventListener("click", () => this.closeDemoModalHandler())
        }

        if (this.demoModal) {
        this.demoModal.addEventListener("click", (e) => {
            if (e.target === this.demoModal) {
            this.closeDemoModalHandler()
            }
        })
        }

        // Mobile menu toggle
        if (this.mobileMenuToggle) {
        this.mobileMenuToggle.addEventListener("click", () => this.toggleMobileMenu())
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault()
            const target = document.querySelector(anchor.getAttribute("href"))
            if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
            }
        })
        })

        // Keyboard events
        document.addEventListener("keydown", (e) => this.handleKeyboard(e))
    }

    openDemoModal() {
        if (this.demoModal) {
        this.demoModal.classList.add("show")
        document.body.style.overflow = "hidden"
        }
    }

    closeDemoModalHandler() {
        if (this.demoModal) {
        this.demoModal.classList.remove("show")
        document.body.style.overflow = "auto"
        }
    }

    toggleMobileMenu() {
        if (this.navMenu) {
        this.navMenu.classList.toggle("show")
        }
    }

    handleKeyboard(e) {
        if (e.key === "Escape") {
        this.closeDemoModalHandler()
        }
    }

    initializeAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        }

        const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
            }
        })
        }, observerOptions)

        // Observe elements for animation
        document.querySelectorAll(".feature-card, .pricing-card").forEach((el) => {
        observer.observe(el)
        })
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new LandingPage()
})

// Add animation styles
const animationStyles = `
    .feature-card, .pricing-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .feature-card.animate-in, .pricing-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`

const styleSheet = document.createElement("style")
styleSheet.textContent = animationStyles
document.head.appendChild(styleSheet)
