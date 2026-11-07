"use client";

import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useBiz } from "@/components/preview/BizContext";
import { L } from "@/lib/biz-core";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";
import { Field, inputCls } from "./Field";

/** The phone homepage's short form: name, number, what's wrong. The full flow stays on /schedule. */
export function QuickRequest() {
  const biz = useBiz();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [sent, setSent] = useState(false);
  const issues = [
    L(biz, "No cool", "Klima ne hladi"),
    L(biz, "No heat", "Grejanje ne radi"),
    L(biz, "Tune-up", "Redovan servis"),
    L(biz, "Estimate for a new system", "Procena za novi sistem"),
    L(biz, "Something else", "Nešto drugo"),
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (name.trim().length < 2) er.name = L(biz, "Please enter your name.", "Unesite ime.");
    if (phone.replace(/\D/g, "").length < 6) er.phone = L(biz, "Enter a number we can call you back on.", "Unesite broj na koji možemo da vas pozovemo.");
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      document.getElementById(`qr-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="theme-navy rounded-[22px] p-6 text-center" role="status">
        <span className="success-pop mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-navy">
          <CheckIcon width={24} height={24} />
        </span>
        <p className="display-md mt-4">{L(biz, `Thanks, ${name.trim().split(" ")[0]}.`, `Hvala, ${name.trim().split(" ")[0]}.`)}</p>
        <p className="mt-2 text-[0.92rem] text-frost/75">
          {biz.preview
            ? L(biz, "On your live site this request lands in your inbox.", "Na vašem pravom sajtu ovaj zahtev stiže vama.")
            : "We'd call you back within minutes. (Concept site: nothing was actually sent.)"}
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid grid-cols-2 gap-2.5 rounded-[22px] bg-white p-3.5 ring-1 ring-line" aria-label={L(biz, "Request a visit", "Zahtev za servis")}>
      <Field id="qr-name" label={L(biz, "Name", "Ime")} error={errors.name}>
        <input
          id="qr-name"
          autoComplete="name"
          className={inputCls(errors.name)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "qr-name-err" : undefined}
        />
      </Field>
      <Field id="qr-phone" label={L(biz, "Phone", "Telefon")} error={errors.phone}>
        <input
          id="qr-phone"
          type="tel"
          autoComplete="tel"
          className={inputCls(errors.phone)}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "qr-phone-err" : undefined}
        />
      </Field>
      <Field id="qr-issue" className="col-span-2" label={L(biz, "What's going on?", "Šta se dešava?")}>
        <select id="qr-issue" className={clsx(inputCls(), "appearance-none")} value={issue} onChange={(e) => setIssue(Number(e.target.value))}>
          {issues.map((t, i) => (
            <option key={t} value={i}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <button type="submit" className="btn btn-navy col-span-2 mt-0.5 w-full">
        {L(biz, "Call me back", "Pozovite me")} <ArrowIcon width={18} height={18} />
      </button>
      <p className="col-span-2 text-center text-[0.8rem] text-muted">
        {L(biz, "Prefer to pick a time?", "Radije birate termin?")}{" "}
        <Link href="/schedule" className="underline underline-offset-2">
          {L(biz, "Schedule online in 2 minutes", "Zakažite online za 2 minuta")}
        </Link>
      </p>
    </form>
  );
}
