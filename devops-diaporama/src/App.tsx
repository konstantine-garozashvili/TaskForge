import { useEffect, useState } from "react";

/* ---------------------------------- deck ---------------------------------- */

function Track({ vertical = false, className = "" }: { vertical?: boolean; className?: string }) {
  return (
    <div
      className={`relative rounded-full bg-white/10 ${
        vertical ? "w-0.5 h-full mx-auto" : "h-0.5 w-full"
      } ${className}`}
    />
  );
}

function FlowDot({ delay = 0, vertical = false, color = "var(--tf-blue)" }: { delay?: number; vertical?: boolean; color?: string }) {
  return (
    <span
      className={`absolute ${vertical ? "tf-dot-y" : "tf-dot-x"} w-2 h-2 rounded-full`}
      style={{ background: color, boxShadow: `0 0 8px ${color}`, animationDelay: `${delay}s`, top: vertical ? 0 : "-3px", left: vertical ? "-3px" : 0 }}
    />
  );
}

function Node({ label, sub, color = "var(--tf-blue)", delay = 0 }: { label: string; sub?: string; color?: string; delay?: number }) {
  return (
    <div className="tf-card px-4 py-3 text-center tf-enter" style={{ animationDelay: `${delay}s`, borderColor: "color-mix(in srgb, " + color + " 40%, transparent)" }}>
      <div className="text-sm font-semibold" style={{ color }}>{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: "var(--tf-text-3)" }}>{sub}</div>}
    </div>
  );
}

function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="tf-mono text-xs tracking-[0.25em] uppercase mb-3 tf-enter" style={{ color: "var(--tf-blue)" }}>
      {n} — {children}
    </div>
  );
}

function SlideTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold mb-8 tf-enter d1" style={{ color: "var(--tf-text)" }}>
      {children}
    </h2>
  );
}

/* --------------------------------- slides --------------------------------- */

function SlideTitle_() {
  const steps = ["git push", "CI", "Docker", "Traefik", "Cloud", "Users"];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="tf-mono text-xs tracking-[0.3em] uppercase mb-6 tf-enter" style={{ color: "var(--tf-text-3)" }}>
        TaskForge · Sprint 1 · DevOps
      </div>
      <h1 className="text-5xl md:text-6xl font-bold mb-4 tf-enter d1">
        From <span style={{ color: "var(--tf-blue)" }}>git push</span> to production
      </h1>
      <p className="text-lg mb-14 tf-enter d2" style={{ color: "var(--tf-text-2)" }}>
        How code travels from a laptop to a live URL — automatically.
      </p>
      <div className="flex items-center gap-3 w-full max-w-3xl tf-enter d3">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1 last:flex-none">
            <div className="tf-card px-3 py-2 tf-mono text-xs whitespace-nowrap" style={{ color: i === steps.length - 1 ? "var(--tf-green)" : "var(--tf-text-2)" }}>
              {s}
            </div>
            {i < steps.length - 1 && (
              <div className="relative flex-1">
                <Track />
                <FlowDot delay={i * 0.4} color={i >= 3 ? "var(--tf-green)" : "var(--tf-blue)"} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideArchitecture() {
  return (
    <div className="flex flex-col justify-center h-full max-w-4xl mx-auto w-full">
      <Kicker n="01">The big picture</Kicker>
      <SlideTitle>Three environments, one flow</SlideTitle>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="tf-card p-5 tf-enter d1">
          <div className="tf-mono text-xs mb-2" style={{ color: "var(--tf-text-3)" }}>SOURCE</div>
          <div className="font-semibold">GitHub</div>
          <div className="text-sm mt-1" style={{ color: "var(--tf-text-2)" }}>main · develop · feature/*</div>
          <div className="tf-mono text-xs mt-3" style={{ color: "var(--tf-orange)" }}>git tag v0.1.8</div>
        </div>
        <div className="relative w-16 tf-enter d2">
          <Track />
          <FlowDot delay={0} />
        </div>
        <div className="tf-card p-5 tf-enter d2" style={{ borderColor: "rgba(23,131,255,.4)" }}>
          <div className="tf-mono text-xs mb-2" style={{ color: "var(--tf-text-3)" }}>PIPELINE</div>
          <div className="font-semibold" style={{ color: "var(--tf-blue)" }}>GitHub Actions</div>
          <div className="text-sm mt-1" style={{ color: "var(--tf-text-2)" }}>test · build · deploy</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {[
          { name: "Vercel", sub: "frontend · React build", c: "var(--tf-text)", d: 0.3 },
          { name: "Railway", sub: "backend API + PostgreSQL", c: "var(--tf-purple)", d: 0.45 },
          { name: "Docker + Traefik", sub: "local production mirror", c: "var(--tf-blue)", d: 0.6 },
        ].map((t) => (
          <div key={t.name} className="tf-card p-5 tf-enter" style={{ animationDelay: `${t.d}s` }}>
            <div className="relative mb-3"><Track /><FlowDot delay={t.d + 0.6} color="var(--tf-green)" /></div>
            <div className="font-semibold" style={{ color: t.c }}>{t.name}</div>
            <div className="text-sm mt-1" style={{ color: "var(--tf-text-2)" }}>{t.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-sm mt-8 tf-enter d4" style={{ color: "var(--tf-text-3)" }}>
        What runs in the cloud also runs locally, container for container — so what we test is what we ship.
      </p>
    </div>
  );
}

function SlideGitFlow() {
  const lanes = [
    { name: "feature/*", sub: "where work happens", dotDelay: 0.2, c: "var(--tf-text-2)" },
    { name: "develop", sub: "integration — PR + review", dotDelay: 1.0, c: "var(--tf-blue)" },
    { name: "main", sub: "production only", dotDelay: 1.8, c: "var(--tf-purple)" },
  ];
  return (
    <div className="flex flex-col justify-center h-full max-w-4xl mx-auto w-full">
      <Kicker n="02">Branching</Kicker>
      <SlideTitle>Git flow: one direction, no shortcuts</SlideTitle>
      <div className="space-y-6">
        {lanes.map((l, i) => (
          <div key={l.name} className="flex items-center gap-5 tf-enter" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="w-40 shrink-0">
              <div className="tf-mono text-sm font-semibold" style={{ color: l.c }}>{l.name}</div>
              <div className="text-xs" style={{ color: "var(--tf-text-3)" }}>{l.sub}</div>
            </div>
            <div className="relative flex-1">
              <Track />
              <FlowDot delay={l.dotDelay} color={l.c} />
              {i < lanes.length - 1 && (
                <span className="absolute right-8 -bottom-1.5 text-xs" style={{ color: "var(--tf-text-3)" }}>↓ merge</span>
              )}
            </div>
            {l.name === "main" && (
              <span className="tf-mono text-xs px-3 py-1.5 rounded-full tf-glow shrink-0" style={{ background: "rgba(22,196,86,.12)", color: "var(--tf-green)", border: "1px solid rgba(22,196,86,.4)" }}>
                v0.1.8 → deploy
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm mt-10 tf-enter d3" style={{ color: "var(--tf-text-3)" }}>
        Direct pushes to <span className="tf-mono" style={{ color: "var(--tf-text-2)" }}>main</span> and{" "}
        <span className="tf-mono" style={{ color: "var(--tf-text-2)" }}>develop</span> are blocked — everything goes through a pull request.
      </p>
    </div>
  );
}

function SlideCI() {
  const steps = [
    { name: "Checkout + npm ci", sub: "clean, locked install" },
    { name: "ESLint", sub: "code quality gate" },
    { name: "Prettier", sub: "format check" },
    { name: "Unit tests", sub: "23 tests — Jest + Vitest" },
    { name: "Build", sub: "backend + frontend" },
  ];
  return (
    <div className="flex flex-col justify-center h-full max-w-4xl mx-auto w-full">
      <Kicker n="03">Continuous integration</Kicker>
      <SlideTitle>Every push proves itself</SlideTitle>
      <div className="grid grid-cols-[1fr_1fr] gap-10 items-center">
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={s.name} className="tf-card px-5 py-3.5 flex items-center gap-4 tf-step" style={{ animationDelay: `${i * 1}s` }}>
              <span className="tf-mono text-xs w-6" style={{ color: "var(--tf-text-3)" }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs" style={{ color: "var(--tf-text-3)" }}>{s.sub}</div>
              </div>
              <span className="ml-auto text-sm" style={{ color: "var(--tf-green)" }}>✓</span>
            </div>
          ))}
        </div>
        <div className="tf-enter d3">
          <div className="tf-card p-6">
            <div className="text-5xl font-bold mb-2" style={{ color: "var(--tf-green)" }}>23</div>
            <div className="text-sm" style={{ color: "var(--tf-text-2)" }}>automated tests on every push and every pull request</div>
            <div className="h-px my-5" style={{ background: "var(--tf-border)" }} />
            <div className="text-sm space-y-2" style={{ color: "var(--tf-text-2)" }}>
              <div>🔒 GitGuardian scans for leaked secrets</div>
              <div>🚫 A red pipeline blocks the merge</div>
              <div>⏱ About two minutes per run</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideCD() {
  const Step = ({ children, c = "var(--tf-text-2)" }: { children: React.ReactNode; c?: string }) => (
    <span className="tf-mono text-[11px] px-2.5 py-1 rounded whitespace-nowrap" style={{ border: "1px solid var(--tf-border)", color: c }}>
      {children}
    </span>
  );
  return (
    <div className="flex flex-col justify-center h-full max-w-4xl mx-auto w-full">
      <Kicker n="04">Continuous deployment</Kicker>
      <SlideTitle>One tag deploys everything</SlideTitle>

      {/* trigger */}
      <div className="flex items-center gap-4 tf-enter d1">
        <div className="tf-card px-4 py-3 tf-mono text-sm shrink-0 tf-glow" style={{ color: "var(--tf-orange)", borderColor: "rgba(255,149,0,.4)" }}>
          git tag v0.1.8
        </div>
        <div className="relative flex-1"><Track /><FlowDot delay={0.2} color="var(--tf-orange)" /></div>
        <Node label="GitHub Actions · cd.yml" sub="two jobs in parallel" color="var(--tf-blue)" delay={0.3} />
      </div>

      {/* two deploy lanes */}
      <div className="space-y-4 mt-8 ml-6 pl-6" style={{ borderLeft: "2px solid var(--tf-border)" }}>
        <div className="tf-card p-4 tf-enter d2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm mr-2">Vercel</span>
            <Step>vercel pull</Step><span style={{ color: "var(--tf-text-3)" }}>→</span>
            <Step>build --prod</Step><span style={{ color: "var(--tf-text-3)" }}>→</span>
            <Step>deploy --prebuilt</Step><span style={{ color: "var(--tf-text-3)" }}>→</span>
            <Step c="var(--tf-green)">live ✓</Step>
          </div>
        </div>
        <div className="tf-card p-4 tf-enter d3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm mr-2" style={{ color: "var(--tf-purple)" }}>Railway</span>
            <Step>railway up</Step><span style={{ color: "var(--tf-text-3)" }}>→</span>
            <Step>watch deployment = SUCCESS</Step><span style={{ color: "var(--tf-text-3)" }}>→</span>
            <Step>/health gate</Step><span style={{ color: "var(--tf-text-3)" }}>→</span>
            <Step c="var(--tf-green)">live ✓</Step>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="tf-card p-5 tf-enter d4">
          <div className="tf-mono text-xs mb-2" style={{ color: "var(--tf-text-3)" }}>FRONTEND</div>
          <div className="tf-mono text-xs break-all" style={{ color: "var(--tf-blue)" }}>taskforge-helpdesk.vercel.app</div>
        </div>
        <div className="tf-card p-5 tf-enter d4">
          <div className="tf-mono text-xs mb-2" style={{ color: "var(--tf-text-3)" }}>BACKEND API</div>
          <div className="tf-mono text-xs break-all" style={{ color: "var(--tf-purple)" }}>backend-production-d4bd5.up.railway.app</div>
        </div>
      </div>

      <p className="text-sm mt-6 tf-enter d4" style={{ color: "var(--tf-text-3)" }}>
        <span style={{ color: "var(--tf-red)" }}>✕</span> push on main never deploys — Railway auto-deploy is disconnected.
        Production only serves <span className="tf-mono" style={{ color: "var(--tf-text-2)" }}>tagged</span> code, same commit on both platforms.
      </p>
    </div>
  );
}

function SlideDocker() {
  const bars = [
    { name: "backend", from: 308, to: 253, pct: "-18%", toWidth: 82, c: "var(--tf-blue)" },
    { name: "frontend", from: 425, to: 76, pct: "-82%", toWidth: 18, c: "var(--tf-green)" },
  ];
  return (
    <div className="flex flex-col justify-center h-full max-w-4xl mx-auto w-full">
      <Kicker n="05">Containers</Kicker>
      <SlideTitle>Multi-stage builds, lean images</SlideTitle>
      <div className="space-y-8">
        {bars.map((b, i) => (
          <div key={b.name} className="tf-enter" style={{ animationDelay: `${i * 0.2}s` }}>
            <div className="flex justify-between text-sm mb-2">
              <span className="tf-mono font-semibold" style={{ color: b.c }}>{b.name}</span>
              <span style={{ color: "var(--tf-text-3)" }}>
                {b.from} MB → <span className="font-bold" style={{ color: b.c }}>{b.to} MB</span>{" "}
                <span className="tf-mono text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: "rgba(22,196,86,.12)", color: "var(--tf-green)" }}>{b.pct}</span>
              </span>
            </div>
            <div className="h-3 rounded-full mb-1.5" style={{ background: "rgba(255,56,73,.25)", width: "100%" }} />
            <div className="h-3 rounded-full tf-bar" style={{ background: b.c, ["--from" as string]: "100%", ["--to" as string]: `${b.toWidth}%`, animationDelay: `${0.4 + i * 0.3}s` }} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-10 tf-enter d3">
        {["non-root user", "versioned tags (v0.1.2, not just latest)", "0 secrets in layers — docker history checked", ".dockerignore: 1.2 GB → 68 MB context"].map((t) => (
          <span key={t} className="text-xs px-3 py-1.5 rounded-full" style={{ border: "1px solid var(--tf-border)", color: "var(--tf-text-2)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function SlideTraefik() {
  const [r3Down, setR3Down] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setR3Down((v) => !v), 3500);
    return () => clearInterval(id);
  }, []);

  const replicas = [
    { name: "backend_1", port: "app:3000", down: false },
    { name: "backend_2", port: "app:3000", down: false },
    { name: "backend_3", port: "app:3000", down: r3Down },
  ];

  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto w-full">
      <Kicker n="06">Local production — the fun part</Kicker>
      <SlideTitle>Traefik load balancer, live</SlideTitle>
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] grid-rows-3 items-center gap-x-3 gap-y-6">
        {/* Traefik center card spanning rows */}
        <div className="col-start-3 row-start-1 row-span-3 self-center tf-card p-6 text-center tf-glow" style={{ borderColor: "rgba(23,131,255,.5)" }}>
          <div className="text-2xl mb-1">🚦</div>
          <div className="font-bold" style={{ color: "var(--tf-blue)" }}>Traefik v3.6</div>
          <div className="tf-mono text-xs mt-1" style={{ color: "var(--tf-text-3)" }}>:80 · dashboard :8080</div>
          <div className="h-px my-4" style={{ background: "var(--tf-border)" }} />
          <div className="tf-mono text-xs" style={{ color: r3Down ? "var(--tf-orange)" : "var(--tf-green)" }}>
            {r3Down ? "⚠ retry → healthy replicas" : "round-robin 4 / 3 / 3 ✓"}
          </div>
        </div>

        {replicas.map((r, i) => (
          <div key={r.name} className="contents">
            <div className="col-start-1 tf-card px-3 py-2 text-center" style={{ opacity: r.down ? 0.4 : 1 }}>
              <div className="text-lg">👤</div>
              <div className="tf-mono text-[10px]" style={{ color: "var(--tf-text-3)" }}>client</div>
            </div>
            <div className="col-start-2 relative">
              <Track />
              {!r.down && <FlowDot delay={i * 0.5} />}
            </div>
            <div className="col-start-4 relative">
              <Track />
              {!r.down && <FlowDot delay={0.3 + i * 0.5} color={i === 2 ? "var(--tf-purple)" : "var(--tf-blue)"} />}
              {r.down && <div className="absolute inset-x-0 -top-1 h-1.5" style={{ background: "repeating-linear-gradient(90deg, var(--tf-red) 0 6px, transparent 6px 12px)" }} />}
            </div>
            <div
              className={`col-start-5 tf-card px-4 py-3 ${r.down ? "" : r3Down ? "" : ""} ${!r.down && r3Down === false ? "tf-replica-hit" : ""}`}
              style={{
                minWidth: 150,
                borderColor: r.down ? "var(--tf-red)" : "var(--tf-border)",
                opacity: r.down ? 0.55 : 1,
              }}
            >
              <div className="tf-mono text-sm font-semibold" style={{ color: r.down ? "var(--tf-red)" : "var(--tf-text)" }}>
                {r.name}
              </div>
              <div className="tf-mono text-xs" style={{ color: r.down ? "var(--tf-red)" : "var(--tf-text-3)" }}>
                {r.down ? "✕ killed — connection refused" : `healthy · ${r.port}`}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-10 tf-enter d3">
        <span className="tf-mono text-xs" style={{ color: "var(--tf-text-3)" }}>
          docker compose up --scale backend=3
        </span>
        <span className="tf-mono text-xs px-3 py-1.5 rounded" style={{ background: "rgba(255,149,0,.1)", color: "var(--tf-orange)" }}>
          watch: replica 3 gets killed every few seconds — traffic never drops
        </span>
      </div>
    </div>
  );
}

function SlideObservability() {
  const [req, setReq] = useState(1240);
  const [tickets, setTickets] = useState(37);
  useEffect(() => {
    const id = setInterval(() => {
      setReq((v) => v + Math.floor(Math.random() * 6) + 1);
      setTickets((v) => (Math.random() > 0.75 ? v + 1 : v));
    }, 900);
    return () => clearInterval(id);
  }, []);

  const logs = [
    { t: "12:04:01", m: 'GET /api/tickets 200 · 12ms · request_id=a3f9…', c: "var(--tf-green)" },
    { t: "12:04:02", m: 'POST /api/tickets 201 · 31ms · user_id=42', c: "var(--tf-blue)" },
    { t: "12:04:03", m: 'GET /health 200 · 2ms', c: "var(--tf-text-3)" },
    { t: "12:04:05", m: 'WARN login failed · user_id=17 · 3rd attempt', c: "var(--tf-orange)" },
    { t: "12:04:06", m: 'GET /api/tickets/7 200 · 9ms · request_id=71bc…', c: "var(--tf-green)" },
  ];

  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto w-full">
      <Kicker n="07">Observability</Kicker>
      <SlideTitle>If it moves, we can see it</SlideTitle>
      <div className="grid grid-cols-3 gap-5">
        <div className="tf-card p-5 tf-enter d1">
          <div className="tf-mono text-xs mb-4" style={{ color: "var(--tf-text-3)" }}>HEALTH</div>
          <div className="flex items-center gap-3 mb-3">
            <span className="tf-heartbeat inline-block w-3 h-3 rounded-full" style={{ background: "var(--tf-green)", boxShadow: "0 0 10px var(--tf-green)" }} />
            <span className="tf-mono text-sm" style={{ color: "var(--tf-green)" }}>200 OK</span>
          </div>
          <div className="tf-mono text-xs space-y-1.5" style={{ color: "var(--tf-text-2)" }}>
            <div>GET /health → api</div>
            <div>GET /healthz → frontend</div>
            <div>uptime · db status · version</div>
          </div>
        </div>
        <div className="tf-card p-5 tf-enter d2">
          <div className="tf-mono text-xs mb-4" style={{ color: "var(--tf-text-3)" }}>CENTRALIZED JSON LOGS</div>
          <div className="space-y-2">
            {logs.map((l, i) => (
              <div key={l.t} className="tf-log-line tf-mono text-[11px]" style={{ animationDelay: `${0.4 + i * 0.5}s`, color: l.c }}>
                <span style={{ color: "var(--tf-text-3)" }}>{l.t}</span> {l.m}
              </div>
            ))}
          </div>
          <div className="tf-mono text-[10px] mt-3" style={{ color: "var(--tf-text-3)" }}>shared volume → logs_data/backend.log</div>
        </div>
        <div className="tf-card p-5 tf-enter d3">
          <div className="tf-mono text-xs mb-4" style={{ color: "var(--tf-text-3)" }}>PROMETHEUS + GRAFANA</div>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold tf-tick" style={{ color: "var(--tf-blue)" }}>{req.toLocaleString()}</div>
              <div className="tf-mono text-[10px]" style={{ color: "var(--tf-text-3)" }}>http_requests_total</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "var(--tf-green)" }}>{tickets}</div>
              <div className="tf-mono text-[10px]" style={{ color: "var(--tf-text-3)" }}>taskforge_tickets_created_total</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "var(--tf-purple)" }}>14 ms</div>
              <div className="tf-mono text-[10px]" style={{ color: "var(--tf-text-3)" }}>avg response time</div>
            </div>
          </div>
          <div className="tf-mono text-[10px] mt-3" style={{ color: "var(--tf-text-3)" }}>scraped 15s · grafana :3001 · prometheus :9090</div>
        </div>
      </div>
    </div>
  );
}

function SlideNumbers() {
  const stats = [
    { v: "23", l: "tests on every push", c: "var(--tf-green)" },
    { v: "3", l: "load-balanced replicas", c: "var(--tf-blue)" },
    { v: "4/3/3", l: "verified round-robin", c: "var(--tf-purple)" },
    { v: "-82%", l: "frontend image size", c: "var(--tf-green)" },
    { v: "0", l: "secrets in images", c: "var(--tf-orange)" },
    { v: "1 tag", l: "deploys both platforms together", c: "var(--tf-orange)" },
  ];
  return (
    <div className="flex flex-col justify-center h-full max-w-4xl mx-auto w-full text-center">
      <Kicker n="08">Sprint 1 — done</Kicker>
      <SlideTitle>By the numbers</SlideTitle>
      <div className="grid grid-cols-3 gap-5 mb-12">
        {stats.map((s, i) => (
          <div key={s.l} className="tf-card p-6 tf-enter" style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="text-4xl font-bold mb-1" style={{ color: s.c }}>{s.v}</div>
            <div className="text-xs" style={{ color: "var(--tf-text-2)" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <p className="text-lg tf-enter d4" style={{ color: "var(--tf-text-2)" }}>
        The road is paved. <span style={{ color: "var(--tf-blue)" }}>Sprint 2</span> — auth, ticket CRUD, websockets — can now ship with confidence.
      </p>
    </div>
  );
}

/* ---------------------------------- app ----------------------------------- */

const SLIDES = [
  SlideTitle_,
  SlideArchitecture,
  SlideGitFlow,
  SlideCI,
  SlideCD,
  SlideDocker,
  SlideTraefik,
  SlideObservability,
  SlideNumbers,
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) { e.preventDefault(); next(); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
      if (e.key === "Home") setCurrent(0);
      if (e.key === "End") setCurrent(SLIDES.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Slide = SLIDES[current];

  return (
    <div className="h-screen w-screen overflow-hidden relative select-none" style={{ background: "var(--tf-bg)", color: "var(--tf-text)" }}>
      {/* progress */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-20" style={{ background: "rgba(255,255,255,.06)" }}>
        <div className="tf-progress h-full" style={{ width: `${((current + 1) / SLIDES.length) * 100}%`, background: "var(--tf-blue)" }} />
      </div>

      {/* click zones */}
      <button aria-label="previous" onClick={prev} className="absolute left-0 top-0 bottom-0 w-[12%] z-10 cursor-w-resize bg-transparent border-0" />
      <button aria-label="next" onClick={next} className="absolute right-0 top-0 bottom-0 w-[12%] z-10 cursor-e-resize bg-transparent border-0" />

      {/* slide */}
      <main key={current} className="h-full w-full px-16 md:px-24 py-14">
        <Slide />
      </main>

      {/* footer */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-4 z-20 pointer-events-none">
        <span className="tf-mono text-xs" style={{ color: "var(--tf-text-3)" }}>
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
        <span className="tf-mono text-[10px]" style={{ color: "var(--tf-text-3)" }}>← → navigate</span>
      </div>
    </div>
  );
}
