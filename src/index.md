---
title: "Jesus - Network Engineer"
layout: "layout.njk"
description: "A website showcasing my skills and experience as a network engineer"
sitemapPriority: 0.9
sitemapChangefreq: "weekly"
image: "/assets/images/jesus.jpg"
---
<!-- Hero Section -->
<section id="hero" class="text-center py-20">
    <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">Network Engineer</h1>
    <p id="typewriter" style="font-family: 'Red Hat Mono', monospace;" class="text-lg md:text-2xl text-blue-400 font-medium mb-8 h-8"></p>
    <p class="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">10+ years of experience in troubleshooting, designing, and deploying robust network solutions.</p>
    <div class="flex justify-center space-x-4">
        <a href="#contact" class="btngray">Contact Me</a>
        <a href="{{ site.resumeUrl }}" target="_blank" class="md:hidden btn">View Resume</a>
    </div>
</section>
<!-- About Me Section -->
<section id="about" class="py-16">
    <h2 class="text-3xl font-bold text-center section-title">About Me</h2>
    <div class="flex flex-col md:flex-row items-center gap-12">
        <div class="md:w-1/3 text-center">
            <img src="/assets/images/jesus.jpg" width="300" height="300" alt="Jesus Otero Lagunes" class="rounded-full mx-auto shadow-2xl border-4 border-gray-700">
        </div>
        <div class="md:w-2/3">
            <p class="text-lg text-gray-400 mb-4">
                I am Jesus, a highly motivated and adaptable telecommunications engineer with a proven ability to troubleshoot and resolve complex network issues. I am passionate about all things computer networking and thrive in challenging environments where continuous learning and meaningful contributions are valued.
            </p>
            <p class="text-lg text-gray-400">
                My goal is to leverage my decade of experience to help businesses optimize their network infrastructure, ensuring high availability, security, and performance. I believe in a healthy work-life balance, which allows me to stay sharp and bring my best to every project.
            </p>
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
                <i class="fas {{ service.icon }} icon"></i>
                <h3 class="text-xl font-bold text-white">{{ service.name }}</h3>
            </div>
            <p class="text-gray-400">{{ service.description }}</p>
        </div>
        {%- endfor -%}
    </div>
</section>
-->

<!-- Skills & Certifications Section -->
<section id="skills" class="py-16">
    <h2 class="text-3xl font-bold text-center section-title">Skills & Certifications</h2>
    <div class="grid md:grid-cols-2 gap-12">
        <!-- Skills -->
        <div>
            <h3 class="text-2xl font-bold mb-6 text-center text-white">Technical Skills</h3>
            <div class="card">
                {%- for skill in skills -%}
                <p class="text-lg font-semibold mb-1 text-blue-400">{{ skill.name }}</p>
                <p class="text-gray-400 mb-5">{{ skill.keywords }}</p>
                {%- endfor -%}
            </div>
        </div>
        <!-- Certifications -->
        <div>
            <h3 class="text-2xl font-bold mb-6 text-center text-white">Certifications</h3>
            <div class="card space-y-4">
                {%- for certification in certifications -%}
                <div class="flex items-center">
                    <i class="fas fa-certificate icon text-yellow-400"></i>
                    <div>
                        <h4 class="font-bold text-white">{{ certification.name }}</h4>
                        <p class="text-gray-400">Expires: {{ certification.expires }}</p>
                    </div>
                </div>
                {%- endfor -%}
            </div>
        </div>
    </div>
</section>
<!-- Work Experience Section -->
<section id="experience" class="py-16">
    <h2 class="text-3xl font-bold text-center section-title">Work Experience</h2>
    <div class="relative border-l-2 border-gray-700 ml-6">
        {# Loop through and display all "featured" roles #}
        {%- for role in roles -%}
        {%- if role.featured -%}
        <div class="mb-10 ml-6">
            <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-gray-900">
            <i class="fas fa-briefcase text-white text-xs"></i>
            </span>
            <div class="card">
                <h3 class="flex items-center text-lg font-semibold text-white">
                    {{ role.title }}
                </h3>
                {%- if role.company -%}
                <p class="text-blue-400 text-md font-medium mb-2 ">
                    {{ role.company }}
                </p>
                {%- endif -%}
                <time class="block mb-2 text-sm font-normal leading-none text-gray-500">{{ role.time }}</time>
                {%- if role.description -%}
                <p class="mb-4 text-base font-normal text-gray-400">{{ role.description }}</p>
                {%- endif -%}
            </div>
        </div>
        {%- endif -%}
        {%- endfor -%}
        <div class="ml-6">
            <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-gray-900">
            <i class="fas fa-briefcase text-white text-xs"></i>
            </span>
            <div class="card">
                <h3 class="text-lg font-semibold text-white">Previous Roles</h3>
                <time class="block mb-2 text-sm font-normal leading-none text-gray-500">Since 2014</time>
                <ul class="list-disc list-inside text-gray-400">
                    {%- for role in roles -%}
                    {%- if not role.featured -%}
                    {%- if role.company -%}
                    <li>
                        {{ role.title }} at <span class="text-blue-400 text-md font-medium">{{ role.company }}</span>
                    </li>
                    {%- endif -%}
                    {%- endif -%}
                    {%- endfor -%}
                </ul>
            </div>
        </div>
    </div>
</section>
<!-- Contact Section -->
<section id="contact" class="py-16">
    <div class="glass-card max-w-3xl mx-auto p-8 md:p-12 rounded-lg">
        <h2 class="text-3xl font-bold text-center section-title">Get In Touch</h2>
        <p class="text-center text-gray-400 mb-8">I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.</p>
        <form action="https://formspree.io/f/mnnzgdak" method="POST">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input type="text" name="name" placeholder="Your Name" required class="w-full p-3 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <input type="email" name="email" placeholder="Your Email" required class="w-full p-3 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <textarea name="message" placeholder="Your Message" rows="5" required class="w-full p-3 rounded bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"></textarea>
            <div class="text-center">
                <button type="submit" class="btn">Send Message</button>
            </div>
        </form>
    </div>
</section>
<script src="/js/view-counter.js"></script>
<span data-slug="homepage"></span>
