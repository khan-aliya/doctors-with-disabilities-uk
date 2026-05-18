# Doctors with Disabilities UK

**Live site:** [doctorswithdisabilities.co.uk](https://doctorswithdisabilities.co.uk)

A peer-built resource for disabled doctors across the UK — providing rights guidance, practical support, and real stories from doctors who have been through it.

---

## About

Conceived and led by **Dr Syed Masihuddin** (GP Trainee, Shropshire / West Midlands), designed and built by **Aliya Khan**.

Syed has epilepsy and found there was no peer-written resource to help disabled doctors understand their rights and navigate the NHS system. This site is the resource he needed and could not find.

The site covers:

- Equality Act 2010 rights and how they apply to NHS doctors
- Reasonable adjustments — how to request them, what to do if refused
- Disclosure — what you are and are not legally required to share
- Sick leave entitlements, return to work, and capability proceedings
- Hidden disability and the NHS green lanyard scheme
- Real stories from disabled doctors, published with written consent
- An AI-powered rights advisor that helps doctors understand their legal position

---

## Tech stack

- Plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step
- Hosted on **Netlify** (Personal plan)
- Domain registered and managed through Netlify DNS
- Contact form via **Netlify Forms**
- AI rights advisor via **Anthropic API** (Claude Sonnet) proxied through a **Netlify Function**
- Fonts: Lora (serif) and Nunito (sans-serif) via Google Fonts
- Code editor: VS Code

---

## Project structure

```
doctors-with-disabilities-uk/
│
├── index.html                    # Homepage
├── stories.html                  # Stories index page
├── contact.html                  # Contact form
│
├── — Your Rights —
├── equality.html                 # Equality Act 2010
├── adjustments.html              # Reasonable adjustments
├── disclosure.html               # Disclosure guidance
├── if-refused.html               # If your request is refused
├── sick-leave.html               # Sick leave rights
├── return-to-work.html           # Return to work
├── legal-help.html               # Legal help resources
│
├── — Resources —
├── workplace.html                # Workplace and employment
├── training.html                 # Training and education
├── financial.html                # Financial and travel
├── regional.html                 # Regional — Shropshire & West Midlands
│
├── — Hidden Disability —
├── hidden_disability.html        # What is hidden disability?
├── lanyard-scheme.html           # NHS green lanyard scheme
├── bma-video.html                # BMA video embed
├── colleagues.html               # Guidance for colleagues
├── bma-policy.html               # BMA disability policy
│
├── — Stories —
├── stories/
│   └── syed-masihuddin.html      # Dr Syed Masihuddin's story
│
├── — Legal —
├── privacy.html                  # Privacy policy (UK GDPR compliant)
├── accessibility.html            # Accessibility statement (WCAG 2.1 AA)
├── 404.html                      # Custom 404 error page
│
├── — Assets —
├── css/
│   └── style.css                 # Full design system — plum & mauve palette
├── js/
│   ├── main.js                   # Shared interactive behaviour
│   └── chat-widget.js            # AI rights advisor floating widget
│
├── — Serverless —
├── netlify/
│   └── functions/
│       └── chat.js               # Anthropic API proxy function
│
├── — Config —
├── netlify.toml                  # Build settings, headers, redirects, functions
├── _redirects                    # Netlify redirect rules
├── sitemap.xml                   # XML sitemap for search engines
├── robots.txt                    # Search engine crawling rules
└── README.md                     # This file
```

---

## Design system

**Palette:** Plum and mauve. `--plum-800: #3d1f5c` is the primary colour used for navigation, card headers, buttons, and the footer. Warm amber `--gold-600: #b5821a` is used as an accent for underlines, highlights, and the disclaimer bar.

**Typography:** Lora for headings (serif, warm, readable at all sizes), Nunito for body text and UI elements (clean, friendly, legible).

**Accessibility:** WCAG 2.1 AA throughout, targeting partial AAA. All colour combinations verified for contrast ratios. Full keyboard navigation including dropdown menus, the contact form, and the AI chat widget. Skip link on every page.

---

## AI rights advisor

The chat widget uses the Anthropic API (Claude Sonnet) to help disabled doctors understand their employment rights. It appears as a floating button in the bottom-right corner of every page.

Key points:

- Proxied through a Netlify Function so the API key never reaches the browser
- Stateless — no messages are stored anywhere
- Configured via a detailed system prompt in `netlify/functions/chat.js`
- Explicitly positions itself as guidance only, not legal advice
- Fully keyboard accessible and screen reader compatible
- Moves above the cookie banner automatically when the banner is visible

To update the advisor's knowledge (e.g. when NHS policy changes), edit the `SYSTEM_PROMPT` constant in `netlify/functions/chat.js` and push.

**Environment variable required:** `ANTHROPIC_API_KEY` — set in Netlify dashboard under Site configuration → Environment variables. Never commit this to the repository.

---

## Deploying and updating content

The site deploys automatically from the `main` branch on GitHub. Push to GitHub and Netlify deploys within 30 seconds. There is no build step.

```bash
git add .
git commit -m "Brief description of what changed"
git push
```

To update a page, open the relevant HTML file in VS Code, make the change, save, and push. That is the entire workflow.

**Netlify plan:** Personal ($9/month) — 1,000 credits/month, approximately 66 deploys. Batch changes into single commits where possible to stay within the monthly limit.

---

## Adding a new story

1. Create a new HTML file in `stories/` following the structure of `stories/syed-masihuddin.html`
2. Add a story card to `stories.html`
3. Add the new URL to `sitemap.xml`
4. Push to GitHub

All stories require explicit written consent from the contributor before publication. The contributor must approve the final version.

---

## Maintenance schedule

| Frequency                  | Task                                                                           |
| -------------------------- | ------------------------------------------------------------------------------ |
| Every 6 months             | Verify legal content against current BMA guidance and NHS Terms and Conditions |
| Every 3 months             | Check all external links still resolve correctly                               |
| When policy changes        | Update the AI advisor system prompt in `netlify/functions/chat.js`             |
| When data practices change | Update `privacy.html` and its Last reviewed date                               |
| Annually                   | Confirm ICO registration exemption status at ico.org.uk/registration           |

---

## Legal and content notes

- No copyrighted content is reproduced on this site — external material is linked to, not copied
- Stories are published with explicit written consent, documented in writing before publication
- The privacy policy discloses Anthropic as a data processor for AI advisor messages
- UK GDPR compliant — data controller is Dr Syed Masihuddin

---

## Contact

**Conceived and led by:** Dr Syed Masihuddin  
**Designed and built by:** Aliya Khan  
**Site:** [doctorswithdisabilities.co.uk](https://doctorswithdisabilities.co.uk)  
**Contact:** [doctorswithdisabilities.co.uk/contact.html](https://doctorswithdisabilities.co.uk/contact.html)
