/* ============================================================
   Doctors with Disabilities UK
   main.js - Shared interactive behaviour
   No dependencies | Astro-migration ready (each fn = component)
   ============================================================ */

"use strict";

/* ── 1. Disclaimer bar collapse / expand ── */
function initDisclaimerBar() {
  const bar = document.getElementById("disclaimerBar");
  const closeBtn = document.getElementById("disclaimerClose");
  const tab = document.getElementById("disclaimerTab");

  if (!bar || !closeBtn) return;

  // Restore state from sessionStorage (not localStorage - resets on new tab)
  if (sessionStorage.getItem("disclaimerCollapsed") === "true") {
    bar.classList.add("collapsed");
  }

  closeBtn.addEventListener("click", () => {
    bar.classList.add("collapsed");
    sessionStorage.setItem("disclaimerCollapsed", "true");
    if (tab) tab.setAttribute("aria-expanded", "false");
    closeBtn.setAttribute("aria-label", "Disclaimer hidden");
  });

  if (tab) {
    tab.addEventListener("click", () => {
      bar.classList.remove("collapsed");
      sessionStorage.removeItem("disclaimerCollapsed");
      tab.setAttribute("aria-expanded", "true");
    });
  }
}

/* ── 2. Cookie consent banner ── */
function initCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("cookieAccept");
  if (!banner) return;
  if (localStorage.getItem("cookieConsent")) {
    banner.classList.add("hidden");
    return;
  }
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      banner.classList.add("hidden");
      localStorage.setItem("cookieConsent", "essential");
    });
  }
}

/* ── 3. Mobile nav toggle ── */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    // Animate hamburger → X
    const spans = toggle.querySelectorAll("span");
    if (isOpen) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    }
  });

  // Close nav when clicking outside
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("nav-open") && !nav.contains(e.target)) {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      const spans = toggle.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("nav-open")) {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

/* ── 4. Set active nav link based on current page ── */
function initActiveNav() {
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const links = document.querySelectorAll(
    ".nav-links__link:not(.nav-links__cta)",
  );

  links.forEach((link) => {
    const linkPath = new URL(
      link.href,
      window.location.origin,
    ).pathname.replace(/\/$/, "");
    if (
      linkPath === currentPath ||
      (currentPath === "" && linkPath === "/index") ||
      (currentPath.endsWith("/index") && linkPath === "")
    ) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ── 5. Smooth scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector(".main-nav")?.offsetHeight || 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top, behavior: "smooth" });

      // Update URL without reload
      history.pushState(null, "", "#" + targetId);

      // Move focus to target for accessibility
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

/* ── 6. Scroll-triggered subtle fade-in for sections ── */
function initScrollReveal() {
  if (!("IntersectionObserver" in window)) return;

  const elements = document.querySelectorAll(
    ".card, .checklist__item, .story-card, .definition-box",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    observer.observe(el);
  });
}

/* ── 7. Contact form: basic client-side validation ── */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const errors = [];

    // Clear previous errors
    form.querySelectorAll(".form-error").forEach((el) => el.remove());
    form
      .querySelectorAll(".form-input, .form-textarea, .form-select")
      .forEach((el) => {
        el.style.borderColor = "";
      });

    // Required fields
    form.querySelectorAll("[required]").forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        showFieldError(field, "This field is required");
        errors.push(field);
      }
    });

    // Email format
    const emailField = form.querySelector('input[type="email"]');
    if (
      emailField &&
      emailField.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)
    ) {
      valid = false;
      showFieldError(emailField, "Please enter a valid email address");
      errors.push(emailField);
    }

    if (!valid) {
      errors[0].focus();
      return;
    }

    // Check consent before submitting
    const consent = document.getElementById("consent");
    if (consent && !consent.checked) {
      consent.focus();
      let err = form.querySelector(".form-error--consent");
      if (!err) {
        err = document.createElement("span");
        err.className = "form-error form-error--consent";
        err.setAttribute("role", "alert");
        err.textContent =
          "Please confirm you consent to your data being stored to respond to your message.";
        consent.parentNode.parentNode.appendChild(err);
      }
      return;
    }
    form.submit();
  });
}
/* ── 8. Dropdown nav ── */
function initDropdownNav() {
  const parents = document.querySelectorAll(".nav-dropdown-parent");

  parents.forEach(function (parent) {
    const trigger = parent.querySelector(".nav-dropdown-trigger");
    const dropdown = parent.querySelector(".nav-dropdown");
    if (!trigger || !dropdown) return;

    function open() {
      trigger.setAttribute("aria-expanded", "true");
      dropdown.classList.add("is-open");
    }
    function close() {
      trigger.setAttribute("aria-expanded", "false");
      dropdown.classList.remove("is-open");
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      // Close all other open dropdowns first
      document.querySelectorAll(".nav-dropdown.is-open").forEach(function (d) {
        if (d !== dropdown) {
          d.classList.remove("is-open");
          d.closest(".nav-dropdown-parent")
            .querySelector(".nav-dropdown-trigger")
            .setAttribute("aria-expanded", "false");
        }
      });
      trigger.getAttribute("aria-expanded") === "true" ? close() : open();
    });

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        open();
        dropdown.querySelector(".nav-dropdown__link").focus();
      }
      if (e.key === "Escape") close();
    });

    dropdown.addEventListener("keydown", function (e) {
      const items = Array.from(
        dropdown.querySelectorAll(".nav-dropdown__link"),
      );
      const idx = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < items.length - 1) items[idx + 1].focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        idx > 0 ? items[idx - 1].focus() : (close(), trigger.focus());
      }
      if (e.key === "Escape") {
        close();
        trigger.focus();
      }
      if (e.key === "Tab" && !e.shiftKey && idx === items.length - 1) close();
    });
  });

  // Close all dropdowns on outside click
  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-dropdown.is-open").forEach(function (d) {
      d.classList.remove("is-open");
      d.closest(".nav-dropdown-parent")
        .querySelector(".nav-dropdown-trigger")
        .setAttribute("aria-expanded", "false");
    });
  });

  // Prevent clicks inside any dropdown from closing it
  document.querySelectorAll(".nav-dropdown").forEach(function (d) {
    d.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
}
function showFieldError(field, message) {
  field.style.borderColor = "#c0392b";
  const error = document.createElement("span");
  error.className = "form-error";
  error.setAttribute("role", "alert");
  error.style.cssText =
    "font-size:0.75rem; color:#c0392b; margin-top:3px; display:block;";
  error.textContent = message;
  field.parentNode.appendChild(error);
}

document.addEventListener("DOMContentLoaded", () => {
  initDisclaimerBar();
  initCookieBanner();
  initMobileNav();
  initActiveNav();
  initSmoothScroll();
  initScrollReveal();
  initContactForm();
  initDropdownNav();
  initContactReasons();
});

/* ── 9. Contact form reason tabs ── */
function initContactReasons() {
  /* selectReason is called from onclick in HTML - needs to be on window */
  window.selectReason = function (reason) {
    const reasonInput = document.getElementById("reasonInput");
    if (reasonInput) reasonInput.value = reason;

    document.querySelectorAll(".reason-tab").forEach(function (tab) {
      const isActive =
        tab.textContent.trim() === reason ||
        (reason === "Share my story" && tab.textContent.includes("story")) ||
        (reason === "Suggest a resource" &&
          tab.textContent.includes("resource")) ||
        (reason === "Collaboration enquiry" &&
          tab.textContent.includes("Collaborate")) ||
        (reason === "Feedback or correction" &&
          tab.textContent.includes("Feedback"));
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const anonOpt = document.getElementById("anonymous-option");
    if (anonOpt) {
      anonOpt.classList.toggle(
        "form-group--hidden",
        reason !== "Share my story",
      );
    }

    const hints = {
      "Share my story":
        "A brief description of your experience is fine here - we'll follow up by email to discuss the full publication process.",
      "Suggest a resource":
        "Please include the name of the resource, a link if available, and why you think it would be useful.",
      "Collaboration enquiry":
        "Tell us about your organisation and what kind of collaboration you have in mind.",
      "Feedback or correction":
        "Please be as specific as possible - which page, which section, and what needs changing.",
      Other: "Tell us what's on your mind.",
    };
    const hint = document.getElementById("message-hint");
    if (hint && hints[reason]) hint.textContent = hints[reason];
  };

  /* URL param pre-select */
  const params = new URLSearchParams(window.location.search);
  const reasonParam = params.get("reason");
  if (reasonParam) {
    const map = {
      story: "Share my story",
      resource: "Suggest a resource",
      collaborate: "Collaboration enquiry",
      feedback: "Feedback or correction",
    };
    if (map[reasonParam]) window.selectReason(map[reasonParam]);
  }

  /* Consent validation on submit */
  const form = document.getElementById("contactForm");
  if (!form) return;
  // form.addEventListener("submit", function (e) {
  //   const consent = document.getElementById("consent");
  //   if (consent && !consent.checked) {
  //     e.preventDefault();
  //     consent.focus();
  //     let err = form.querySelector(".form-error--consent");
  //     if (!err) {
  //       err = document.createElement("span");
  //       err.className = "form-error form-error--consent";
  //       err.setAttribute("role", "alert");
  //       err.textContent =
  //         "Please confirm you consent to your data being stored to respond to your message.";
  //       consent.parentNode.parentNode.appendChild(err);
  //     }
  //   }
  // });
}
