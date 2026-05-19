export default function Lost0x01Site() {
  const projects = [
    {
      title: "RAIccoon",
      description: "AI-focused cybersecurity skill set and tooling experiments.",
      tags: ["AI", "Cybersecurity", "Automation"],
      link: "https://github.com/lost0x01/RAIccoon-Reports",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.15),transparent_50%)] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-green-500/20 backdrop-blur bg-black/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-widest">lost0x01</h1>
            <p className="text-xs text-green-500">cybersecurity • AI • builder</p>
          </div>

          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wider">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 border border-green-500/30 rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] mb-6 bg-green-500/5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            online
          </div>

          <h2 className="text-5xl md:text-7xl font-black leading-tight text-white">
            Building
            <span className="block text-green-400">Cyber + AI</span>
            Systems
          </h2>

          <p className="mt-8 text-lg text-green-200/80 leading-relaxed max-w-xl">
            Welcome to lost0x01.com — a digital lab focused on cybersecurity,
            AI experimentation, automation, and open-source projects.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-6 py-3 rounded-2xl border border-green-400 bg-green-400 text-black font-bold hover:bg-white transition"
            >
              View Projects
            </a>

            <a
              href="https://github.com/lost0x01"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl border border-green-500/40 hover:border-green-300 hover:text-white transition"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Terminal Card */}
        <div className="relative">
          <div className="rounded-3xl border border-green-500/20 bg-zinc-950 shadow-2xl shadow-green-500/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/20 bg-zinc-900">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs text-green-500">terminal</span>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <p>
                <span className="text-green-500">root@lost0x01</span>
                <span className="text-white">:~$</span> whoami
              </p>

              <p className="text-green-300">
                cybersecurity enthusiast / builder / AI tinkerer
              </p>

              <p>
                <span className="text-green-500">root@lost0x01</span>
                <span className="text-white">:~$</span> ls projects/
              </p>

              <div className="grid grid-cols-2 gap-2 text-green-300">
                <div>RAIccoon/</div>
                <div>experiments/</div>
                <div>research/</div>
                <div>security/</div>
              </div>

              <p>
                <span className="text-green-500">root@lost0x01</span>
                <span className="text-white">:~$</span>
                <span className="animate-pulse"> _</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-green-500/10 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">About</h3>
            <p className="text-green-200/80 leading-relaxed text-lg">
              lost0x01 is a personal brand focused on cybersecurity research,
              automation workflows, AI-assisted tooling, and digital creativity.
              This site acts as a central hub for projects, writeups, and
              experiments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              "Cybersecurity",
              "AI Tooling",
              "Automation",
              "Open Source",
              "Red Teaming",
              "Creative Tech",
            ].map((skill) => (
              <div
                key={skill}
                className="rounded-2xl border border-green-500/20 p-5 bg-black/50 hover:border-green-400 transition"
              >
                <p className="text-white font-semibold">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h3 className="text-4xl font-bold text-white">Projects</h3>
            <p className="text-green-300/70 mt-3">
              Selected builds and experiments.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl border border-green-500/20 bg-zinc-950 p-6 hover:border-green-400 hover:-translate-y-1 transition duration-300 cursor-pointer block"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-green-500">
                  active
                </span>
              </div>

              <h4 className="text-2xl font-bold text-white mb-3">
                {project.title}
              </h4>

              <p className="text-green-200/70 leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs border border-green-500/20 rounded-full px-3 py-1 bg-green-500/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-green-500/10 bg-zinc-950/50"
      >
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Connect & Collaborate
          </h3>

          <p className="text-green-200/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Interested in cybersecurity, AI tooling, automation, or open-source
            collaboration? Reach out or follow along on GitHub.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@lost0x01.com"
              className="px-6 py-3 rounded-2xl border border-green-400 bg-green-400 text-black font-bold hover:bg-white transition"
            >
              Contact
            </a>

            <a
              href="https://github.com/lost0x01"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl border border-green-500/30 hover:border-green-300 hover:text-white transition"
            >
              GitHub Profile
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-500/10 px-6 py-8 text-center text-sm text-green-500/70">
        © 2026 lost0x01.com — built for GitHub Pages
      </footer>
    </div>
  );
}
