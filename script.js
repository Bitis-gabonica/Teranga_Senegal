document.addEventListener('DOMContentLoaded', () => {
    // 1. Dakar Real-time Clock function
    const updateTime = () => {
        const now = new Date();
        const dakarTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Dakar',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(now);

        const timeElements = document.querySelectorAll('.dakar-time');
        timeElements.forEach(el => {
            el.textContent = dakarTime + ' DKR';
        });

        const ms = String(now.getMilliseconds()).padStart(3, '0');
        const timerElements = document.querySelectorAll('.dakar-timer');
        timerElements.forEach(el => {
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            el.textContent = `${mins}:${secs}.${ms}`;
        });
    };
    setInterval(updateTime, 47);
    updateTime();

    // 2. GSAP & ScrollTrigger Initialization
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    const scroller = ".scroll-container";
    const panels = gsap.utils.toArray('.panel');
    const dots = gsap.utils.toArray('.dot');

    // 3. Panel Animations on Scroll
    
    // Split titles for character-by-character animation
    const titles = document.querySelectorAll('.title, .word-solid, .word-outline');
    titles.forEach(title => {
        const html = title.innerHTML;
        // Split inner text but ignore <br> tags
        title.innerHTML = html.replace(/([^<>]+)(?=(<|$))/g, function(match) {
            return match.split('').map(char => `<span class="char" style="display:inline-block; opacity:0; transform:translateY(15px); filter:blur(4px);">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
        });
    });

    panels.forEach((panel, i) => {
        const texts = panel.querySelectorAll('.anim-text');
        const chars = panel.querySelectorAll('.char');
        const graphic = panel.querySelector('.anim-graphic');

        // Trigger for the UI state
        ScrollTrigger.create({
            trigger: panel,
            scroller: scroller,
            start: "top 50%",
            onEnter: () => activatePanel(i, true),
            onEnterBack: () => activatePanel(i, false)
        });

        // Text animations (general)
        gsap.to(texts, {
            scrollTrigger: {
                trigger: panel,
                scroller: scroller,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });

        // Title character stagger (progressive reveal)
        if (chars.length) {
            gsap.to(chars, {
                scrollTrigger: {
                    trigger: panel,
                    scroller: scroller,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: 0.04,
                ease: "power3.out"
            });
        }

        // Graphic animation (if any old graphics exist)
        if (graphic) {
            gsap.to(graphic, {
                scrollTrigger: {
                    trigger: panel,
                    scroller: scroller,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                },
                scale: 1,
                rotation: 0,
                opacity: i === 0 ? 0.9 : 0.2, 
                duration: 0.8,
                ease: "back.out(1.7)"
            });
        }
    });

    // 5. Indicator Slide Logic
    let currentActive = -1;
    function activatePanel(index, isScrollingDown) {
        if (currentActive === index) return;
        currentActive = index;

        // Update Dots
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');

        // Update Percentage
        const pct = Math.round((index / (panels.length - 1)) * 100);
        document.getElementById('progress-text').textContent = pct + '%';
    }

    // 5. Huge Star Scroll Animation
    gsap.to('.main-flag-star', {
        scrollTrigger: {
            trigger: ".panel-1",
            scroller: scroller,
            start: "top bottom", // Starts when scrolling down and panel-1 enters
            end: "top top",      // Ends when panel-1 is fully at the top
            scrub: true
        },
        scale: 30,
        y: "50vh", // shift it down a bit to keep it somewhat centered while sliding
        ease: "none"
    });

    // Interactive Hover Tilt effect on cards
    const cards = document.querySelectorAll('.main-card');
    cards.forEach(card => {
        card.parentElement.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // x, y relative to center of the card, -1 to 1
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            
            gsap.to(card, {
                rotationY: x * 2,
                rotationX: -y * 2,
                ease: "power2.out",
                transformPerspective: 1500,
                duration: 0.5
            });
        });
        
        card.parentElement.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                ease: "power2.out",
                duration: 1
            });
        });
    });
});
