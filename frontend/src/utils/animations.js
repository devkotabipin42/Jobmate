import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const fadeUp = (element, delay = 0) => {
    if (!element) return // null check
    gsap.fromTo(element,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' }
    )
}

export const fadeIn = (element, delay = 0) => {
    if (!element) return
    gsap.fromTo(element,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay, ease: 'power2.out' }
    )
}

export const staggerFadeUp = (elements, delay = 0) => {
    if (!elements) return
    gsap.fromTo(elements,
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0,
            duration: 0.5,
            stagger: 0.1,
            delay,
            ease: 'power3.out'
        }
    )
}

export const scaleIn = (element, delay = 0) => {
    if (!element) return
    gsap.fromTo(element,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, delay, ease: 'back.out(1.7)' }
    )
}

export const scrollFadeUp = (element, trigger) => {
    if (!element) return
    gsap.fromTo(element,
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: trigger || element,
                start: 'top 80%',
            }
        }
    )
}

export const textReveal = (element, delay = 0) => {
    if (!element) return
    gsap.fromTo(element,
        { opacity: 0, y: 80, skewY: 5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, delay, ease: 'power4.out' }
    )
}

export const slideLeft = (element, delay = 0) => {
    if (!element) return
    gsap.fromTo(element,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.7, delay, ease: 'power3.out' }
    )
}

export const slideRight = (element, delay = 0) => {
    if (!element) return
    gsap.fromTo(element,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.7, delay, ease: 'power3.out' }
    )
}

// Cleanup function — important!
export const cleanupAnimations = () => {
    ScrollTrigger.getAll().forEach(t => t.kill())
    gsap.killTweensOf('*')
}