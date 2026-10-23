(() => {
  "use strict";

  const giftMessages = [
    {
      emoji: "🌠",
      title: "A little wish",
      message: "May every goal you set feel a little closer, every challenge make you stronger, and every ordinary day give you one special reason to smile. The best is still ahead!"
    },
    {
      emoji: "💌",
      title: "A happy reminder",
      message: "Never forget how far you have come. You have your own strengths, your own journey, and so much potential. Take your time, trust yourself, and enjoy the little wins too."
    },
    {
      emoji: "🎉",
      title: "Your birthday mission",
      message: "Your mission, Rohan: eat something delicious, take at least one legendary photo, laugh until your cheeks hurt, and make a memory you will still talk about next year. Mission accepted?"
    }
  ];

  const modal = document.getElementById("giftModal");
  const closeModalButton = document.getElementById("closeModal");
  let previouslyFocused = null;

  function openGift(index) {
    const gift = giftMessages[index];
    if (!gift || !modal) return;
    previouslyFocused = document.activeElement;
    document.getElementById("modalEmoji").textContent = gift.emoji;
    document.getElementById("modalTitle").textContent = gift.title;
    document.getElementById("modalMessage").textContent = gift.message;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    closeModalButton.focus();
    burstConfetti(80);
    if (window.gsap && !prefersReducedMotion()) {
      gsap.fromTo(".modal-panel", { y: 18, scale: .96 }, { y: 0, scale: 1, duration: .42, ease: "back.out(1.5)" });
    }
  }

  function closeGift() {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (previouslyFocused && typeof previouslyFocused.focus === "function") previouslyFocused.focus();
  }

  document.querySelectorAll("[data-gift]").forEach(button => {
    button.addEventListener("click", () => openGift(Number(button.dataset.gift)));
  });
  closeModalButton.addEventListener("click", closeGift);
  document.getElementById("modalDone").addEventListener("click", closeGift);
  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeGift));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeGift();
    if (event.key === "Tab" && modal.classList.contains("open")) {
      const focusable = modal.querySelectorAll("button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  document.getElementById("openSurprise").addEventListener("click", () => {
    burstConfetti(150);
    document.getElementById("memories").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    for (let i = 0; i < 12; i++) window.setTimeout(createFloatingSymbol, i * 130);
  });
  document.getElementById("celebrate").addEventListener("click", () => {
    burstConfetti(220);
    for (let i = 0; i < 15; i++) window.setTimeout(createFloatingSymbol, i * 100);
  });

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Canvas confetti: lightweight and dependency-free.
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let confettiFrame = null;
  let lastFrame = 0;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  function burstConfetti(amount = 100) {
    const colors = ["#f6cc75", "#fff1bd", "#f3a7b8", "#b6dcff", "#ffffff", "#d9b7ff"];
    for (let i = 0; i < amount; i++) {
      particles.push({
        x: window.innerWidth * (.15 + Math.random() * .7),
        y: window.innerHeight * (.18 + Math.random() * .3),
        vx: (Math.random() - .5) * 8,
        vy: -Math.random() * 8 - 2,
        size: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - .5) * .2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 85 + Math.random() * 65
      });
    }
    // Prevent too many particles if someone clicks repeatedly.
    if (particles.length > 1200) particles = particles.slice(-1200);
    if (confettiFrame === null) {
      lastFrame = 0;
      confettiFrame = requestAnimationFrame(drawConfetti);
    }
  }

  function drawConfetti(timestamp) {
    if (lastFrame && timestamp - lastFrame < 16) {
      confettiFrame = requestAnimationFrame(drawConfetti);
      return;
    }
    lastFrame = timestamp;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter(p => p.life > 0);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += .13;
      p.rotation += p.spin;
      p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.min(1, p.life / 24);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
      ctx.restore();
    }
    if (particles.length) {
      confettiFrame = requestAnimationFrame(drawConfetti);
    } else {
      confettiFrame = null;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function createFloatingSymbol() {
    if (prefersReducedMotion()) return;
    const symbol = document.createElement("span");
    symbol.className = "floating-heart";
    symbol.textContent = ["♥", "✦", "♡", "✨", "🎈"][Math.floor(Math.random() * 5)];
    symbol.style.left = `${Math.random() * 100}vw`;
    symbol.style.fontSize = `${14 + Math.random() * 20}px`;
    symbol.style.color = ["#f6cc75", "#f3a7b8", "#fff1bd"][Math.floor(Math.random() * 3)];
    symbol.style.animationDuration = `${4 + Math.random() * 4}s`;
    document.body.appendChild(symbol);
    window.setTimeout(() => symbol.remove(), 8500);
  }

  if (!prefersReducedMotion()) {
    let floatCount = 0;
    const floatTimer = window.setInterval(() => {
      if (floatCount++ >= 12) {
        window.clearInterval(floatTimer);
        return;
      }
      createFloatingSymbol();
    }, 1100);
  }

  // GSAP entrance animations, scroll-linked parallax, and slow floating gift cards.
  const reducedMotion = prefersReducedMotion();
  if (window.gsap && window.ScrollTrigger && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-content > *", {
      y: 26,
      opacity: 0,
      duration: .9,
      stagger: .13,
      ease: "power3.out",
      delay: .12,
      clearProps: "all"
    });

    gsap.utils.toArray(".parallax-layer").forEach(layer => {
      const depth = Number(layer.dataset.depth || .04);
      gsap.to(layer, {
        y: () => window.innerHeight * depth * 1.5,
        x: () => window.innerWidth * depth * .45,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    });

    gsap.utils.toArray(".reveal").forEach((element, index) => {
      gsap.fromTo(element,
        { y: 42, opacity: 0, scale: .985 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: .8,
          delay: (index % 3) * .08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    gsap.utils.toArray(".photo-card").forEach((card, index) => {
      gsap.to(card, {
        y: index === 1 ? -22 : 14,
        ease: "none",
        scrollTrigger: {
          trigger: "#memories",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });
    });

    gsap.utils.toArray(".gift-box").forEach((gift, index) => {
      gsap.to(gift, {
        y: -7,
        duration: 1.7 + index * .2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * .3
      });
    });

    gsap.from(".ambient-orb", {
      scale: .7,
      opacity: 0,
      duration: 1.5,
      stagger: .25,
      ease: "power2.out"
    });
    gsap.to(".gold-text", {
      backgroundPosition: "200% center",
      duration: 4,
      repeat: -1,
      ease: "none"
    });
  } else {
    // If GSAP is unavailable, make all content visible instead of hiding it.
    document.querySelectorAll(".reveal").forEach(element => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }

  // Desktop pointer parallax. Disabled on phones and reduced-motion devices.
  if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches && window.gsap) {
    const hero = document.getElementById("hero");
    hero.addEventListener("pointermove", event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      document.querySelectorAll(".parallax-layer").forEach(layer => {
        const depth = Number(layer.dataset.depth || .04);
        gsap.to(layer, {
          x: x * depth * 180,
          y: y * depth * 140,
          duration: .65,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    });
    hero.addEventListener("pointerleave", () => {
      gsap.to(".parallax-layer", {
        x: 0, y: 0, duration: .7, ease: "power2.out", overwrite: "auto"
      });
    });
  }
})();
