"use client";

import { useState } from "react";
import clsx from "clsx";
import { Field, inputCls } from "./Field";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";

type D = { name: string; email: string; phone: string; topic: string; message: string };
const TOPICS = ["General question", "Estimate for a new system", "Comfort Club", "Billing", "Careers"];

export function ContactForm() {
  const [d, setD] = useState<D>({ name: "", email: "", phone: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof D, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof D, v: string) => {
    setD((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<keyof D, string>> = {};
    if (d.name.trim().length < 2) er.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) er.email = "Enter a valid email so we can reply.";
    if (d.phone && d.phone.replace(/\D/g, "").length < 10) er.phone = "Enter a 10-digit number, or leave it blank.";
    if (d.message.trim().length < 10) er.message = "A few more words, please (10+ characters).";
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(Object.keys(er)[0])?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="theme-navy rounded-[28px] p-10 text-center" role="status">
        <span className="success-pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-navy">
          <CheckIcon width={30} height={30} />
        </span>
        <p className="display-md mt-6">Thanks, {d.name.split(" ")[0]}.</p>
        <p className="mt-3 text-frost/75">We reply to every message within one business day. (Concept site — nothing was actually sent.)</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-6 rounded-[28px] bg-white p-6 ring-1 ring-line sm:grid-cols-2 sm:p-10" aria-label="Contact form">
      <Field id="name" label="Name" error={errors.name}>
        <input id="name" autoComplete="name" className={inputCls(errors.name)} value={d.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input id="email" type="email" autoComplete="email" className={inputCls(errors.email)} value={d.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
      </Field>
      <Field id="phone" label="Phone" error={errors.phone} optional>
        <input id="phone" type="tel" autoComplete="tel" className={inputCls(errors.phone)} value={d.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-err" : undefined} />
      </Field>
      <Field id="topic" label="Topic">
        <select id="topic" className={clsx(inputCls(), "appearance-none")} value={d.topic} onChange={(e) => set("topic", e.target.value)}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field id="message" label="Message" error={errors.message} className="sm:col-span-2">
        <textarea id="message" rows={5} className={clsx(inputCls(errors.message), "py-3")} value={d.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
      </Field>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.82rem] text-muted">Need a technician? Use Schedule service or call — it&rsquo;s faster.</p>
        <button type="submit" className="btn btn-navy">
          Send message <ArrowIcon width={18} height={18} />
        </button>
      </div>
    </form>
  );
}
