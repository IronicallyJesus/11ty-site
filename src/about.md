---
title: "About"
description: "Network engineer, homelab tinkerer, and immigrant who found his path through technology."
layout: "layouts/page.njk"
image: "/assets/images/jesus.webp"
---

<div style="display: flex; flex-direction: column; gap: 2rem; max-width: 800px;">

<div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
    <img src="{{ image }}" width="140" height="140" alt="{{ site.author.name }}"
        style="border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0;">
    <div>
        <h3>{{ site.author.name }}</h3>
        <div class="kv" style="margin-top: 0.5rem;">
            <span class="kv-label">Role</span>
            <span class="kv-value">Industrial Switching Engineer II, <span class="sparklight-word"><span class="slash">/</span>Sparklight</span></span>
        </div>
        <div class="kv">
            <span class="kv-label">Focus</span>
            <span class="kv-value">ISP networking, automation, homelab</span>
        </div>
        <div class="kv">
            <span class="kv-label">Location</span>
            <span class="kv-value">Georgia, USA</span>
        </div>
    </div>
</div>

<p>I'm a husband, a nerd, an ex-gifted student, an engineer, and an immigrant. I came into the United States from Mexico at 5 years old, but even before then I loved taking things apart and finding out how they worked. In my teenage years, technology only boosted that tremendously. After high school though, without a clear path to pursue higher education I quickly joined the workforce.</p>

<p>I taught myself networking from the ground up — starting in tech support and eventually into engineering. Today I hold Juniper certifications and design switching infrastructure at an ISP. The same curiosity that had me dismantling electronics as a kid now drives me to build homelab environments, automate network operations, and share what I learn.</p>

<p>This site is where I document that journey — the labs, the configs, the mistakes, and the solutions.</p>

</div>

<h2 class="section-heading" style="margin-top: 3rem;">// Career Timeline</h2>

<div style="position: relative; padding-left: 1.5rem; border-left: 1px solid var(--border); margin-left: 0.5rem;">
{%- for role in roles -%}
<div style="margin-bottom: 2rem; position: relative;">
    <div style="position: absolute; left: -1.75rem; top: 0.35rem; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); border: 2px solid var(--bg-primary);"></div>
    <div class="muted" style="font-family: var(--font-mono); font-size: 0.8125rem; margin-bottom: 0.25rem;">{{ role.time }}</div>
    <h4 style="margin: 0 0 0.15rem 0;">{{ role.title }}</h4>
    <div class="muted" style="font-size: 0.9375rem; margin-bottom: 0.5rem;">{{ role.company | brand | safe }}{% if role.location %} &middot; {{ role.location }}{% endif %}</div>
    <p style="font-size: 1rem; color: var(--text-secondary);">{{ role.description | brand | safe }}</p>
    {%- if role.timeline_tidbit -%}
    <span class="tag tag-accent" style="margin-top: 0.5rem;">{{ role.timeline_tidbit | brand | safe }}</span>
    {%- endif -%}
</div>
{%- endfor -%}
</div>

<div style="margin-top: 2rem;">
    <a href="/resume" class="btn">Download Resume</a>
</div>
