import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Live financial posture",
    body: "Track income, expense, and balance movement in one calm operating view built around real backend analytics.",
    icon: Radar,
  },
  {
    title: "Role-aware workspace",
    body: "Viewers get clarity, analysts get investigation tools, and admins control the operating surface without overlap.",
    icon: ShieldCheck,
  },
  {
    title: "Secure by design",
    body: "JWT auth, protected routes, account status checks, and explicit RBAC keep the frontend aligned with the API.",
    icon: LockKeyhole,
  },
];

const metrics = [
  { label: "Product views", value: "5+" },
  { label: "Role tiers", value: "3" },
  { label: "Demo records", value: "60" },
];

const proofPoints = [
  "JWT-secured sessions with protected routes",
  "MongoDB-backed summary and trend aggregation",
  "Analyst and admin workflows separated cleanly",
  "Responsive reports, insights, and record operations",
];

const useCases = [
  {
    label: "For leadership",
    title: "Get posture quickly",
    body: "See balance, trend direction, category pressure, and recent financial movement without dropping into transaction noise.",
    icon: TrendingUp,
  },
  {
    label: "For finance operators",
    title: "Investigate with context",
    body: "Move from summary to insights, reports, and records to explain variance instead of just observing it.",
    icon: FileSpreadsheet,
  },
  {
    label: "For admins",
    title: "Control the operating layer",
    body: "Manage users, roles, status, and ledger actions from one protected workspace designed for governance.",
    icon: Users,
  },
];

const featureStrips = [
  {
    eyebrow: "Why teams switch",
    title: "Most finance dashboards stop at reporting. This one keeps going into action.",
    body: "Pulse Finance is shaped around the actual journey a team follows: understand the current state, detect what changed, and then act with the correct permissions.",
    bullets: [
      "Summary, trends, and category breakdown backed by real API calls",
      "Reports and insights that help explain movement instead of repeating totals",
      "Records and admin tools exposed only to the roles that should use them",
    ],
  },
  {
    eyebrow: "Built for trust",
    title: "The page earns attention with useful content, not filler.",
    body: "Modern fintech sites work best when they mix clarity, trust, and restrained motion. This layout focuses on security, workflow, permissions, and product realism instead of generic talking points.",
    bullets: [
      "Real product preview shown above the fold",
      "Security and governance language near calls to action",
      "Longer sections that explain actual value by role",
    ],
  },
];

const faqItems = [
  {
    q: "Who is the dashboard meant for?",
    a: "Pulse Finance is designed for mixed teams: leadership wants posture, finance operators want explanation, and admins want control over who can do what.",
  },
  {
    q: "What makes the role system useful?",
    a: "Viewer accounts stay intentionally light. Analysts gain reports, insights, and records. Admins control users, statuses, and ledger actions. The point is to reduce clutter and risk, not just hide a menu item.",
  },
  {
    q: "Does the product rely on mock data?",
    a: "No. The dashboard, reports, and records views are wired to backend APIs. Demo records can be seeded for local development so the interface looks realistic from the start.",
  },
  {
    q: "Why use subtle motion instead of heavy animation?",
    a: "Because this is finance software. Motion should guide attention and improve flow, not compete with trust, clarity, or page performance.",
  },
];

function LandingPage() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".landing-fade-up"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-slate-100">
      <div className="landing-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      <div className="landing-orb landing-orb-three" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1380px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-sky-950/30">
            <BarChart3 size={18} className="text-emerald-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/70">Pulse</p>
            <p className="text-lg font-semibold text-white">Finance Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
          >
            Start free
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-[1380px] items-center gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-24">
          <div className="landing-fade-up max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
              <Sparkles size={16} />
              <span>Modern finance operations for fast-moving teams</span>
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              A finance dashboard that feels
              <span className="landing-text-glow block">active, calm, and trustworthy.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Pulse Finance turns backend analytics into a polished operating layer with role-based
              access, actionable alerts, reporting, and record management that actually feels built
              for a modern SaaS finance team.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
              >
                Create account
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="landing-fade-up rounded-[26px] border border-white/10 bg-white/5 px-4 py-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-fade-up relative">
            <div className="landing-panel-tilt panel panel-strong relative overflow-hidden rounded-[36px] p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.10),_transparent_35%)]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Operational overview</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Executive command center</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    Live
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Income", value: "$64K", tone: "bg-emerald-500/10" },
                    { label: "Expense", value: "$40K", tone: "bg-rose-500/10" },
                    { label: "Net", value: "$24K", tone: "bg-sky-500/10" },
                  ].map((card) => (
                    <div key={card.label} className={`rounded-[26px] border border-white/10 px-4 py-5 ${card.tone}`}>
                      <p className="text-sm text-slate-300">{card.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex h-52 items-end gap-2 sm:gap-3">
                      {[34, 52, 48, 66, 72, 64, 80, 92].map((height, index) => (
                        <div key={height} className="flex flex-1 flex-col justify-end gap-2">
                          <div
                            className="landing-bar rounded-t-[18px] bg-[linear-gradient(180deg,rgba(56,189,248,0.95),rgba(16,185,129,0.55))]"
                            style={{
                              height: `${height}%`,
                              animationDelay: `${index * 120 + 280}ms`,
                            }}
                          />
                          <span className="text-center text-[11px] uppercase tracking-[0.14em] text-slate-500">
                            {["J", "F", "M", "A", "M", "J", "J", "A"][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Role-specific dashboards that do not overwhelm viewers.",
                      "Record workflows for analysts and admins only.",
                      "Clean report views built on top of live API data.",
                    ].map((item) => (
                      <div key={item} className="rounded-[26px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="landing-fade-up panel rounded-[32px] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icon size={18} className="text-sky-300" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="landing-fade-up panel rounded-[36px] p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">Why it matters</p>
              <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Teams need more than a chart wall. They need a decision surface.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Finance products feel modern when they show the right depth at the right moment.
                That means posture for stakeholders, context for analysts, and control for admins.
              </p>
              <div className="mt-6 space-y-3">
                {proofPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {featureStrips.map((row) => (
                <article key={row.title} className="landing-fade-up panel rounded-[36px] p-6 sm:p-8">
                  <p className="text-sm uppercase tracking-[0.25em] text-sky-300/70">{row.eyebrow}</p>
                  <h3 className="mt-4 text-3xl font-semibold text-white">{row.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{row.body}</p>
                  <div className="mt-6 space-y-3">
                    {row.bullets.map((point) => (
                      <div key={point} className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                        {point}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {useCases.map((story) => {
              const Icon = story.icon;
              return (
                <article key={story.title} className="landing-fade-up panel rounded-[32px] p-6 sm:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icon size={18} className="text-emerald-300" />
                  </div>
                  <p className="mt-5 text-sm uppercase tracking-[0.22em] text-slate-400">{story.label}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{story.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{story.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="panel rounded-[36px] p-6 sm:sticky sm:top-6 sm:self-start sm:p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">Actionable Insights</p>
              <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Move from raw data to confident financial decisions.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Pulse Finance connects every level of your organization. It ensures clarity for leadership, deep investigative tools for operations, and absolute control for administrators.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  number: "01",
                  title: "Monitor live posture",
                  body: "The unified dashboard aggregates real-time metrics, instantly framing your net balance, income trends, and category pressures without clutter.",
                },
                {
                  number: "02",
                  title: "Investigate the variance",
                  body: "Transition from high-level summaries into detailed records. Filter, track, and annotate transactions to explain financial shifts accurately.",
                },
                {
                  number: "03",
                  title: "Govern with precision",
                  body: "Leverage explicit role-based access control. Ensure that sensitive ledger actions and user management panels are strictly limited to authorized personnel.",
                },
              ].map((step) => (
                <article key={step.number} className="landing-fade-up panel rounded-[32px] p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold text-white">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{step.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>



        <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <article key={item.q} className="landing-fade-up panel rounded-[32px] p-6 sm:p-8">
                <h3 className="text-2xl font-semibold text-white">{item.q}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1380px] px-4 pb-24 sm:px-6 lg:px-8">
          <div className="landing-cta-band panel rounded-[40px] overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="landing-fade-up">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300/70">Ready to enter the workspace?</p>
                <h3 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Start with the overview. Grow into deeper tools only when your role needs them.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Pulse Finance keeps the visual language modern and the permission model clear, so the right people see the right depth at the right time.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  to="/register"
                  className="landing-fade-up inline-flex items-center justify-center gap-2 rounded-[26px] bg-white px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
                >
                  Create account
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="landing-fade-up inline-flex items-center justify-center rounded-[26px] border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Sign in
                </Link>
                <div className="landing-fade-up rounded-[26px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300 sm:col-span-2">
                  Demo access after seeding:
                  <span className="ml-2 font-medium text-white">admin@demo.com / Password123!</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
