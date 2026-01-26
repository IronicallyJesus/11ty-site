---
title: "Jesus - Network Engineer"
layout: "layout.njk"
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
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/60 to-brand-dark"></div>
    </div>
    
    <div class="relative z-10 max-w-4xl mx-auto">
        <span class="inline-block py-1 px-3 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
            Available for Projects
        </span>
        <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Architecting <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Resilient</span> Networks
        </h1>
        <p id="typewriter" style="font-family: 'Red Hat Mono', monospace;" class="text-xl md:text-3xl text-blue-300 font-medium mb-8 h-10"></p>
        <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            10+ years of experience in troubleshooting, designing, and deploying robust network solutions for enterprise environments.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" class="btn">Get in Touch</a>
            <a href="#experience" class="btngray">View Experience</a>
        </div>
    </div>
</section>

<!-- Services Section -->
<!--
<section id="services" class="py-16">
    <h2 class="text-3xl font-bold text-center section-title">Consultation Services</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {%- for service in services -%}
        <div class="card">
            <div class="flex md:flex-row items-center mb-2">
                <i class="fa-solid {{ service.icon }} icon"></i>
                <h3 class="text-xl font-bold text-white">{{ service.name }}</h3>
            </div>
            <p class="text-gray-400">{{ service.description }}</p>
        </div>
        {%- endfor -%}
    </div>
</section>
-->

<!-- Skills & Certifications Section -->
<section id="skills" class="py-24">
    <h2 class="section-header">Skills & Certifications</h2>
    <div class="grid md:grid-cols-2 gap-12">
        <!-- Technical Skills -->
        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-white flex items-center">
                <i class="fa-solid fa-code-merge text-blue-400 mr-3"></i> Technical Mastery
            </h3>
            <div class="grid grid-cols-1 gap-4">
                {%- for skill in skills -%}
                <div class="card p-6 border-l-4 border-l-blue-500">
                    <p class="text-xl font-bold text-white mb-2">{{ skill.name }}</p>
                    <div class="flex flex-wrap gap-2">
                        {% set keywords = skill.keywords.split(',') %}
                        {% for keyword in keywords %}
                        <span class="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {{ keyword.trim() }}
                        </span>
                        {% endfor %}
                    </div>
                </div>
                {%- endfor -%}
            </div>
        </div>
        <!-- Certifications -->
        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-white flex items-center">
                <i class="fa-solid fa-award text-yellow-500 mr-3"></i> Professional Credentials
            </h3>
            <div class="card space-y-6">
                {%- for certification in certifications -%}
                <div class="relative pl-10">
                    <i class="fa-solid fa-certificate absolute left-0 top-1 text-yellow-500 text-xl" aria-hidden="true"></i>
                    <div>
                        <h4 class="font-bold text-white text-lg">{{ certification.name }}</h4>
                        <p class="text-blue-400 text-sm font-medium">Expires: {{ certification.expires }}</p>
                    </div>
                </div>
                {%- endfor -%}
            </div>
        </div>
    </div>
</section>

<!-- Experience Item -->
<section id="experience" class="py-24">
    <h2 class="section-header">Professional Journey</h2>
    <div class="max-w-4xl mx-auto">
        <div class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent">
            
            {%- for role in roles -%}
            {%- if role.featured -%}
            <!-- Experience Item -->
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <!-- Icon -->
                <div class="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500/50 bg-brand-dark text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white">
                    <i class="fa-solid fa-briefcase"></i>
                </div>
                <!-- Card -->
                <div class="w-[calc(100%-4rem)] md:w-[45%] card p-6">
                    <div class="flex items-center justify-between space-x-2 mb-1">
                        <div class="font-bold text-white text-lg">{{ role.title }}</div>
                        <time class="font-mono text-sm text-blue-400">{{ role.time }}</time>
                    </div>
                    {%- if role.company -%}
                    <div class="text-blue-300 font-medium mb-3">@ {{ role.company }}</div>
                    {%- endif -%}
                    {%- if role.description -%}
                    <div class="text-gray-400 text-sm leading-relaxed">{{ role.description }}</div>
                    {%- endif -%}
                </div>
            </div>
            {%- endif -%}
            {%- endfor -%}

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
                            <span class="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Network Engineering</span>
                            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{{ post.data.title }}</h3>
                            <p class="text-gray-400 text-sm line-clamp-3 mb-6">{{ post.data.excerpt or post.data.description }}</p>
                        </div>
                        <span class="text-blue-400 font-bold flex items-center text-sm">
                            Read Full Article <i class="fa-solid fa-arrow-right-long ml-2 transition-transform group-hover:translate-x-2"></i>
                        </span>
                    </div>
                </a>
            {%- endif -%}
        {%- endfor -%}
    </div>
    <div class="text-center mt-12">
        <a href="/blog" class="btngray inline-flex items-center">
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
            <p class="text-center text-gray-400 max-w-xl mx-auto mb-12">
                Have a challenging project or looking to build a high-performance network? I'm always open to discussing new opportunities.
            </p>
            <form action="https://formspree.io/f/mnnzgdak" method="POST" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="name" class="text-sm font-bold text-gray-400 ml-1">Full Name</label>
                        <input type="text" id="name" name="name" autocomplete="name" placeholder="John Doe" required 
                               class="w-full p-4 rounded-xl bg-brand-dark/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all">
                    </div>
                    <div class="space-y-2">
                        <label for="email" class="text-sm font-bold text-gray-400 ml-1">Email Address</label>
                        <input type="email" id="email" name="email" autocomplete="email" placeholder="john@example.com" required 
                               class="w-full p-4 rounded-xl bg-brand-dark/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all">
                    </div>
                </div>
                <div class="space-y-2">
                    <label for="message" class="text-sm font-bold text-gray-400 ml-1">Your Message</label>
                    <textarea id="message" name="message" placeholder="Tell me about your project..." rows="6" required 
                              class="w-full p-4 rounded-xl bg-brand-dark/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"></textarea>
                </div>
                <div class="text-center pt-4">
                    <button type="submit" class="btn px-12 py-4 text-lg">Send Message</button>
                    <p class="text-xs text-gray-500 mt-4">Powered by Formspree</p>
                </div>
            </form>
        </div>
    </div>
</section>
