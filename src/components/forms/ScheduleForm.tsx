"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Field, OptionCard, inputCls } from "./Field";
import { ArrowIcon, CheckIcon, ClockIcon, DropIcon, FanIcon, FlameIcon, PhoneIcon, ShieldIcon, SnowIcon, TagIcon, WindIcon } from "@/components/ui/Icons";
import { services } from "@/content/services";
import { plans } from "@/content/plans";
import { site, telHref } from "@/lib/site";

type Data = {
  problem: string;
  urgency: string;
  system: string;
  age: string;
  day: string;
  window: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  zip: string;
  notes: string;
  member: boolean;
  code: string;
};

const PROBLEMS = [
  { v: "no-cool", t: "No cooling", d: "Warm air, not keeping up, iced lines", icon: <SnowIcon /> },
  { v: "no-heat", t: "No heat", d: "Cold air, won't ignite, short-cycling", icon: <FlameIcon /> },
  { v: "noise", t: "Noise, smell or leak", d: "Something's not right", icon: <DropIcon /> },
  { v: "tuneup", t: "Tune-up", d: "Spring AC or fall furnace check", icon: <FanIcon /> },
  { v: "estimate", t: "New system estimate", d: "Free, in-home, no pressure", icon: <TagIcon /> },
  { v: "air", t: "Air quality / ducts", d: "Dust, allergies, humidity, airflow", icon: <WindIcon /> },
];
const URGENCY = [
  { v: "emergency", t: "Emergency — now", d: "24/7 dispatch. We'll call you in minutes." },
  { v: "today", t: "Today if possible", d: "Most requests before 2 pm get a same-day slot." },
  { v: "week", t: "This week", d: "Pick a window that suits you." },
  { v: "flexible", t: "I'm flexible", d: "We'll suggest the soonest opening." },
];
const SYSTEMS = ["Central AC + gas furnace", "Heat pump", "Ductless mini-split", "Not sure"];
const AGES = ["0–5 years", "6–10 years", "11–15 years", "16+ years", "Not sure"];
const WINDOWS = ["8–10 am", "10–12 pm", "12–2 pm", "2–4 pm", "4–6 pm"];
const STEP_TITLES = ["What's going on?", "How soon, and what system?", "Pick an arrival window", "Where should we come?"];

const phoneDigits = (s: string) => s.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
const fmtPhone = (s: string) => {
  const d = phoneDigits(s).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

function upcomingDays(n = 7) {
  const out: { v: string; wd: string; d: string }[] = [];
  const now = new Date();
  for (let i = 0; out.length < n; i++) {
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    out.push({
      v: dt.toISOString().slice(0, 10),
      wd: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dt.toLocaleDateString("en-US", { weekday: "short" }),
      d: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }
  return out;
}

export function ScheduleForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  // Rendered client-side only (useSearchParams bails out of static rendering), so dates are safe here.
  const [days] = useState(upcomingDays);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const initialProblem = useMemo(() => {
    const svc = params.get("service");
    const reason = params.get("reason");
    if (reason === "estimate" || svc?.includes("installation") || svc === "heat-pumps") return "estimate";
    if (params.get("plan")) return "tuneup";
    if (svc) {
      const kind = services.find((s) => s.slug === svc)?.kind;
      if (svc === "ac-repair") return "no-cool";
      if (svc === "furnace-repair") return "no-heat";
      if (kind === "air") return "air";
    }
    return "";
  }, [params]);

  const [data, setData] = useState<Data>({
    problem: initialProblem,
    urgency: "",
    system: "",
    age: "",
    day: "",
    window: "",
    name: "",
    phone: "",
    email: "",
    street: "",
    zip: "",
    notes: "",
    member: Boolean(params.get("plan")),
    code: "",
  });
  const plan = plans.find((p) => p.id === params.get("plan"));

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const h = heading.current;
    if (!h) return;
    h.focus({ preventScroll: true });
    if (window.__lenis) window.__lenis.scrollTo(h, { offset: -160 });
    else h.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, done]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const emergency = data.urgency === "emergency";
  const totalSteps = 4;

  const validate = (s: number) => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (s === 0 && !data.problem) e.problem = "Pick the option that fits best.";
    if (s === 1) {
      if (!data.urgency) e.urgency = "Let us know how soon you need us.";
      if (!data.system) e.system = "Pick one — “Not sure” is fine.";
    }
    if (s === 2 && !emergency) {
      if (!data.day) e.day = "Choose a day.";
      if (!data.window) e.window = "Choose an arrival window.";
    }
    if (s === 3) {
      if (data.name.trim().length < 2) e.name = "Please enter your name.";
      if (phoneDigits(data.phone).length !== 10) e.phone = "Enter a 10-digit phone number.";
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) e.email = "That email doesn't look right.";
      if (data.street.trim().length < 4) e.street = "Enter the service address.";
      if (!/^\d{5}$/.test(data.zip)) e.zip = "Enter a 5-digit ZIP code.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    if (step === 1 && emergency) setStep(3);
    else if (step < totalSteps - 1) setStep(step + 1);
    else setDone(true);
  };
  const back = () => setStep((s) => (s === 3 && emergency ? 1 : Math.max(0, s - 1)));

  const outsideArea = /^\d{5}$/.test(data.zip) && !/^73[01]/.test(data.zip);
  const problemLabel = PROBLEMS.find((p) => p.v === data.problem)?.t ?? "";
  const dayLabel = days.find((d) => d.v === data.day);

  if (done) {
    return (
      <div className="theme-navy relative overflow-hidden rounded-[28px] p-8 text-center sm:p-14" role="status">
        <div aria-hidden className="absolute -top-32 left-1/2 h-72 w-[560px] -translate-x-1/2 rounded-full opacity-40 blur-[90px]" style={{ background: "var(--accent)" }} />
        <span className="success-pop relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent text-navy">
          <CheckIcon width={36} height={36} />
        </span>
        <h2 ref={heading} tabIndex={-1} className="display-md relative mt-8 outline-none">
          {emergency ? "We're on it." : "You're booked."}
        </h2>
        <p className="relative mx-auto mt-4 max-w-[34rem] text-frost/75 lede">
          {emergency
            ? `A dispatcher will call ${fmtPhone(data.phone)} within 5 minutes to confirm the nearest technician.`
            : `${dayLabel ? `${dayLabel.wd}, ${dayLabel.d}` : ""} · ${data.window}. We'll text ${fmtPhone(data.phone)} when your technician is on the way.`}
        </p>
        <dl className="relative mx-auto mt-10 grid max-w-[36rem] gap-3 rounded-[22px] bg-white/5 p-6 text-left ring-1 ring-white/10 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-frost/60 uppercase">Service</dt>
            <dd className="mt-1">{problemLabel}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-frost/60 uppercase">Address</dt>
            <dd className="mt-1">
              {data.street}, {data.zip}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-frost/60 uppercase">System</dt>
            <dd className="mt-1">{data.system}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-frost/60 uppercase">Price</dt>
            <dd className="mt-1">{data.member ? "$0 diagnostic (member)" : "$89 diagnostic, waived with repair"}</dd>
          </div>
        </dl>
        <p className="relative mt-8 text-[0.82rem] text-frost/50">Concept site: this form validates but doesn&rsquo;t send anything.</p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-accent on-dark">
            Back to home
          </Link>
          <a href={telHref} className="btn btn-ghost">
            <PhoneIcon width={18} height={18} /> {site.phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  const shownStep = step === 3 && emergency ? 2 : step;
  const shownTotal = emergency ? 3 : 4;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="overflow-hidden rounded-[28px] bg-white ring-1 ring-line"
      aria-label="Schedule service"
    >
      {/* progress */}
      <div className="border-b border-line px-6 pt-6 pb-5 sm:px-10">
        <div className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase">
          <span>
            Step {shownStep + 1} of {shownTotal}
          </span>
          <span className="flex items-center gap-2">
            <ClockIcon width={14} height={14} /> About 2 minutes
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist" aria-hidden>
          <div className="h-full rounded-full bg-accent-ink transition-[width] duration-700 ease-[var(--ease-out-expo)]" style={{ width: `${((shownStep + 1) / shownTotal) * 100}%` }} />
        </div>
      </div>

      <div key={step} className="step-in px-6 py-8 sm:px-10 sm:py-10">
        <h2 ref={heading} tabIndex={-1} className="display-md outline-none">
          {step === 3 && emergency ? "Where should we send a tech?" : STEP_TITLES[step]}
        </h2>
        {plan && step === 0 && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-[0.9rem] text-navy">
            <ShieldIcon width={16} height={16} /> Joining Comfort Club {plan.name} — your first tune-up is included.
          </p>
        )}

        {step === 0 && (
          <fieldset className="mt-8">
            <legend className="sr-only">Problem</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROBLEMS.map((p) => (
                <OptionCard key={p.v} name="problem" value={p.v} checked={data.problem === p.v} onChange={(v) => set("problem", v)} title={p.t} desc={p.d} icon={p.icon} />
              ))}
            </div>
            {errors.problem && (
              <p className="mt-3 text-[0.85rem] font-medium text-[#b42318]" role="alert">
                {errors.problem}
              </p>
            )}
          </fieldset>
        )}

        {step === 1 && (
          <div className="mt-8 grid gap-10">
            <fieldset>
              <legend className="font-medium">How soon?</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {URGENCY.map((u) => (
                  <OptionCard key={u.v} name="urgency" value={u.v} checked={data.urgency === u.v} onChange={(v) => set("urgency", v)} title={u.t} desc={u.d} />
                ))}
              </div>
              {errors.urgency && (
                <p className="mt-3 text-[0.85rem] font-medium text-[#b42318]" role="alert">
                  {errors.urgency}
                </p>
              )}
            </fieldset>
            <fieldset>
              <legend className="font-medium">What kind of system?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SYSTEMS.map((s) => (
                  <Chip key={s} name="system" value={s} checked={data.system === s} onChange={(v) => set("system", v)} />
                ))}
              </div>
              {errors.system && (
                <p className="mt-3 text-[0.85rem] font-medium text-[#b42318]" role="alert">
                  {errors.system}
                </p>
              )}
            </fieldset>
            <fieldset>
              <legend className="font-medium">
                About how old? <span className="text-[0.82rem] font-normal text-muted">Optional</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {AGES.map((s) => (
                  <Chip key={s} name="age" value={s} checked={data.age === s} onChange={(v) => set("age", v)} />
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 grid gap-10">
            <fieldset>
              <legend className="font-medium">Day</legend>
              <div className="no-scrollbar -mx-6 mt-3 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0">
                {days.map((d) => (
                  <label
                    key={d.v}
                    className={clsx(
                      "flex min-h-[76px] min-w-[84px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--accent-ink)]",
                      data.day === d.v ? "bg-navy text-frost ring-navy" : "bg-white ring-line hover:ring-navy/40",
                    )}
                  >
                    <input type="radio" name="day" value={d.v} checked={data.day === d.v} onChange={() => set("day", d.v)} className="sr-only" />
                    <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase opacity-70">{d.wd}</span>
                    <span className="mt-1 font-display text-[1.05rem] tracking-[-0.03em]">{d.d}</span>
                  </label>
                ))}
              </div>
              {errors.day && (
                <p className="mt-3 text-[0.85rem] font-medium text-[#b42318]" role="alert">
                  {errors.day}
                </p>
              )}
            </fieldset>
            <fieldset>
              <legend className="font-medium">Arrival window</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {WINDOWS.map((w) => (
                  <Chip key={w} name="window" value={w} checked={data.window === w} onChange={(v) => set("window", v)} />
                ))}
              </div>
              {errors.window && (
                <p className="mt-3 text-[0.85rem] font-medium text-[#b42318]" role="alert">
                  {errors.window}
                </p>
              )}
              <p className="mt-3 text-[0.85rem] text-muted">We text when your technician is 30 minutes away — with their name and photo.</p>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {emergency && (
              <p className="flex items-start gap-3 rounded-2xl bg-accent-soft p-4 text-[0.95rem] sm:col-span-2">
                <PhoneIcon className="mt-0.5 shrink-0" /> Faster still: call {site.phoneDisplay}. A dispatcher answers 24/7.
              </p>
            )}
            <Field id="name" label="Full name" error={errors.name}>
              <input id="name" autoComplete="name" className={inputCls(errors.name)} value={data.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
            </Field>
            <Field id="phone" label="Mobile phone" error={errors.phone} hint="For arrival texts. No spam, ever.">
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={inputCls(errors.phone)}
                value={data.phone}
                onChange={(e) => set("phone", fmtPhone(e.target.value))}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-err" : "phone-hint"}
                placeholder="(405) 555-0100"
              />
            </Field>
            <Field id="email" label="Email" error={errors.email} optional>
              <input id="email" type="email" autoComplete="email" className={inputCls(errors.email)} value={data.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
            </Field>
            <Field id="zip" label="ZIP code" error={errors.zip} hint={outsideArea ? "That's outside our usual area — we'll confirm availability." : undefined}>
              <input
                id="zip"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                className={inputCls(errors.zip)}
                value={data.zip}
                onChange={(e) => set("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                aria-invalid={!!errors.zip}
                aria-describedby={errors.zip ? "zip-err" : outsideArea ? "zip-hint" : undefined}
              />
            </Field>
            <Field id="street" label="Service address" error={errors.street} className="sm:col-span-2">
              <input id="street" autoComplete="street-address" className={inputCls(errors.street)} value={data.street} onChange={(e) => set("street", e.target.value)} aria-invalid={!!errors.street} aria-describedby={errors.street ? "street-err" : undefined} />
            </Field>
            <Field id="notes" label="Anything we should know?" optional className="sm:col-span-2">
              <textarea id="notes" rows={3} className={clsx(inputCls(), "py-3")} value={data.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Gate code, dog in the yard, the noise it's making…" />
            </Field>
            <Field id="code" label="Promo code" optional>
              <input id="code" className={clsx(inputCls(), "uppercase")} value={data.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="DRY69" />
            </Field>
            <label className="flex cursor-pointer items-center gap-3 self-end rounded-2xl p-3 ring-1 ring-line has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--accent-ink)]">
              <input type="checkbox" checked={data.member} onChange={(e) => set("member", e.target.checked)} className="h-5 w-5 accent-[var(--accent-ink)]" />
              <span className="text-[0.95rem]">I&rsquo;m a Comfort Club member</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-5 sm:px-10">
        <button type="button" onClick={back} className={clsx("btn btn-ghost", step === 0 && "invisible")} tabIndex={step === 0 ? -1 : 0} aria-hidden={step === 0}>
          Back
        </button>
        <button type="submit" className="btn btn-navy">
          {step === 3 ? (emergency ? "Send a technician" : "Confirm booking") : "Continue"} <ArrowIcon width={18} height={18} />
        </button>
      </div>
    </form>
  );
}

function Chip({ name, value, checked, onChange }: { name: string; value: string; checked: boolean; onChange: (v: string) => void }) {
  return (
    <label
      className={clsx(
        "inline-flex min-h-[46px] cursor-pointer items-center rounded-full px-5 text-[0.95rem] ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--accent-ink)]",
        checked ? "bg-navy text-frost ring-navy" : "bg-white ring-line hover:ring-navy/40",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {value}
    </label>
  );
}
