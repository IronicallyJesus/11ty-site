---
title: "Jesus - Network Engineer"
layout: "layouts/base.njk"
description: "A website showcasing my skills and experience as a network engineer"
sitemapPriority: 0.9
sitemapChangefreq: "weekly"
image: "/assets/images/jesus.webp"
---
<!-- Hero Section -->
<section id="hero" class="relative overflow-hidden rounded-3xl mb-16 min-h-[70vh] flex items-center justify-center text-center p-8">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
        <img src="/assets/images/hero-bg.png" alt="" class="w-full h-full object-cover opacity-60">
        <div class="absolute inset-0 hero-overlay"></div>
    </div>
    <div class="relative z-10 mx-auto">
        <span class="inline-block py-1 px-3 mb-6 text-xs font-bold tracking-widest status-pill uppercase border rounded-full">
            Available for Projects
        </span>
        <h1 class="text-5xl md:text-7xl font-extrabold logo-text mb-6 tracking-tight">
            Architecting <span id="hero-adjective" class="hero-title-grad transition-all duration-500">Resilient</span> Networks
        </h1>
        <p class="text-lg md:text-xl article-text max-w-2xl mx-auto mb-10 leading-relaxed">
            10+ years of experience in troubleshooting, designing, and deploying robust network solutions for enterprise environments.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" class="btn">Get in Touch</a>
            <a href="#experience" class="btnalt">View Experience</a>
        </div>
    </div>
</section>
<!-- Services Section -->
{# <section id="services" class="py-24">
    <h2 class="section-header">Consultation Services</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {%- for service in services -%}
        <div class="card p-8 border-t-2 border-t-transparent hover:border-t-accent-primary transition-all duration-300">
            <div class="flex items-center mb-6">
                <div class="w-12 h-12 rounded-xl card-icon-bg flex items-center justify-center mr-4">
                    <i class="fa-solid {{ service.icon }} text-xl"></i>
                </div>
                <h3 class="text-xl font-bold logo-text">{{ service.name }}</h3>
            </div>
            <p class="article-text text-sm leading-relaxed">{{ service.description }}</p>
        </div>
        {%- endfor -%}
    </div>
</section> #}
<!-- Skills & Certifications Section -->
<section id="skills" class="py-24">
    <h2 class="section-header">Skills & Certifications</h2>
    <div class="grid md:grid-cols-2 gap-12">
        <!-- Technical Skills -->
        <div class="space-y-6">
            <h3 class="text-2xl font-bold logo-text flex items-center">
                <i class="fa-solid fa-code-merge accent-primary mr-3"></i> Technical Mastery
            </h3>
            <div class="grid grid-cols-1 gap-4">
                {%- for skill in skills -%}
                <div class="card p-6 border-l-4 border-l-accent-primary">
                    <p class="text-xl font-bold logo-text mb-2">{{ skill.name }}</p>
                    <div class="flex flex-wrap gap-2">
                        {% set keywords = skill.keywords.split(',') %}
                        {%- for keyword in keywords -%}
                        <span class="text-xs font-semibold px-2 py-1 rounded skill-badge">
                            {{ keyword.trim() }}
                        </span>
                        {%- endfor -%}
                    </div>
                </div>
                {%- endfor -%}
            </div>
        </div>
        <!-- Certifications -->
        <div class="space-y-6">
            <h3 class="text-2xl font-bold logo-text flex items-center">
                <i class="fa-solid fa-award text-yellow-500 mr-3"></i> Professional Credentials
            </h3>
            <div class="card space-y-6">
                {%- for certification in certifications -%}
                <div class="flex items-center space-x-4">
                    <i class="fa-solid fa-certificate text-yellow-500 text-xl shrink-0" aria-hidden="true"></i>
                    <div>
                        <h4 class="font-bold card-heading text-lg leading-tight flex items-center gap-2">
                            {{- certification.name -}}
                            {% if certification.verification_url %}
                            <a href="{{ certification.verification_url }}" target="_blank" rel="noopener noreferrer" class="accent-secondary hover:text-blue-600 transition-colors" title="Verify Certification">
                                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                            </a>
                            {% endif %}
                        </h4>
                        <p class="accent-secondary text-sm font-medium mt-0.5">Expires: {{ certification.expires }}</p>
                    </div>
                </div>
                {%- endfor -%}
            </div>
        </div>
    </div>
</section>
<!-- Work Experience Section -->
<section id="experience" class="py-24">
    <h2 class="section-header">Professional Journey</h2>
    <div class="max-w-6xl mx-auto">
        <div class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px lg:before:mx-auto lg:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-accent-primary before:to-transparent">
            {% from "components/experience-card.njk" import experienceCard %}
            {%- for role in roles | selectattr("featured") -%}
            {{ experienceCard(role, loop.index) }}
            {%- endfor -%}
        </div>
        <div class="text-center mt-16">
            <a href="/experience" class="btnalt inline-flex items-center">
                View Full Professional History <i class="fa-solid fa-arrow-right-long ml-2"></i>
            </a>
        </div>
    </div>
</section>

<!-- Blog Posts Section -->
<section id="blog" class="py-24">
    <h2 class="section-header">Insights & Articles</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {%- set postCount = 0 -%}
        {%- for post in collections.blog | reverse -%}
            {%- if not post.data.draft and postCount < 3 -%}
                {%- set postCount = postCount + 1 -%}
                <a href="{{ post.url }}" class="group relative card overflow-hidden flex flex-col h-full hover:border-blue-500/50">
                    {% if post.data.image %}
                    <div class="overflow-hidden">
                        <img src="{{ post.data.image }}" alt="{{ post.data.title }}" class="object-cover h-48 w-full transition-transform duration-500 group-hover:scale-110" loading="lazy">
                    </div>
                    {% endif %}
                    <div class="flex-1 flex flex-col justify-between pt-4">
                        <div>
                            <!-- Tags -->
                            <!--
                            <div class="flex flex-nowrap overflow-hidden whitespace-nowrap items-center">
                                {% set first = true %}
                                {%- for tag in post.data.tags -%}
                                    {%- if tag != 'blog' -%}
                                        {%- if not first -%}
                                            <span class="text-xs accent-primary px-1">·</span>
                                        {%- endif -%}
                                        <span class="text-xs font-bold accent-primary uppercase tracking-widest">{{ tag }}</span>
                                        {%- set first = false -%}
                                    {%- endif -%}
                                {%- endfor -%}
                            </div>
                            -->
                            <h3 class="text-xl font-bold card-heading mb-2 group-hover:accent-primary transition-colors">{{ post.data.title }}</h3>
                            <p class="article-text text-sm line-clamp-3 mb-6">{{ post.data.excerpt or post.data.description }}</p>
                        </div>
                        <span class="accent-primary font-bold flex items-center text-sm">
                            Read Full Article <i class="fa-solid fa-arrow-right-long ml-2 transition-transform group-hover:translate-x-2"></i>
                        </span>
                    </div>
                </a>
            {%- endif -%}
        {%- endfor -%}
    </div>
    <div class="text-center mt-12">
        <a href="/blog" class="btnalt inline-flex items-center">
            Explore All Posts <i class="fa-solid fa-chevron-right ml-2 text-xs"></i>
        </a>
    </div>
</section>
<!-- Contact Section -->
<section id="contact" class="py-24">
    <div class="glass-card max-w-4xl mx-auto p-12 rounded-3xl relative overflow-hidden">
        <!-- Subtle Background Glow -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div class="relative z-10">
            <h2 class="section-header">Let's Connect</h2>
            <p class="text-center article-text max-w-xl mx-auto mb-12">
                Have a challenging project or looking to build a high-performance network? I'm always open to discussing new opportunities.
            </p>
            <form action="https://formspree.io/f/mnnzgdak" method="POST" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="name" class="text-sm font-bold article-text ml-1">Full Name</label>
                        <input type="text" id="name" name="name" autocomplete="name" placeholder="John Doe" required 
                               class="w-full p-4 rounded-xl theme-input focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all">
                    </div>
                    <div class="space-y-2">
                        <label for="email" class="text-sm font-bold article-text ml-1">Email Address</label>
                        <input type="email" id="email" name="email" autocomplete="email" placeholder="john@example.com" required 
                               class="w-full p-4 rounded-xl theme-input focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all">
                    </div>
                </div>
                <div class="space-y-2">
                    <label for="message" class="text-sm font-bold article-text ml-1">Your Message</label>
                    <textarea id="message" name="message" placeholder="Tell me about your project..." rows="6" required 
                              class="w-full p-4 rounded-xl theme-input focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"></textarea>
                </div>
                <div class="text-center pt-4">
                    <button type="submit" class="btn px-12 py-4 text-lg">Send Message</button>
                    <p class="text-xs text-gray-500 mt-4">Powered by Formspree</p>
                </div>
            </form>
        </div>
    </div>
</section>
