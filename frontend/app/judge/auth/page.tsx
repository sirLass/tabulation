"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

const CODE_LENGTH = 6;

export default function JudgeLoginPage() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase().slice(-1);
    const newCode = [...code];
    newCode[index] = sanitized;
    setCode(newCode);
    setStatus("idle");
    setErrorMessage("");

    if (sanitized && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, CODE_LENGTH);

    if (pasted.length === 0) return;
    const newCode = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length < CODE_LENGTH) {
      setStatus("error");
      setErrorMessage("Please enter your full access code.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("http://localhost:8000/api/judges/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.errors?.code?.[0] || "Invalid access code.");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setStatus("success");
      setTimeout(() => { window.location.href = "/judge/dashboard"; }, 1000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setCode(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const isFull = code.every((c) => c !== "");

  return (
    <div className="relative min-h-screen bg-purple-deep flex flex-col justify-center items-center overflow-hidden">
      {/* Radial spotlight overlay — mirrors hero */}
      <div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(197, 160, 89, 0.15) 0%, transparent 65%)",
        }}
      />

      {/* Decorative floating diamonds */}
      <div className="absolute top-[15%] left-[12%] w-4 h-4 border border-gold-shimmer/30 rotate-45 animate-float z-0" />
      <div
        className="absolute top-[30%] right-[8%] w-6 h-6 border border-gold-shimmer/20 rotate-45 animate-float-slow z-0"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-[20%] left-[18%] w-5 h-5 border border-gold-shimmer/25 rotate-45 animate-float-slower z-0"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-[35%] right-[22%] w-3 h-3 border border-gold-shimmer/40 rotate-45 animate-float z-0"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-[55%] left-[5%] w-3 h-3 border border-gold-shimmer/20 rotate-45 animate-float-slow z-0"
        style={{ animationDelay: "3s" }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 animate-fade-in-up">
        {/* Logo / Brand mark */}
        <div className="flex flex-col items-center mb-10">
          {/* Diamond crown icon */}
          <div className="w-12 h-12 border-2 border-gold rotate-45 flex items-center justify-center mb-6">
            <div className="w-3 h-3 bg-gold rotate-0" />
          </div>

          <span className="label-caps text-gold tracking-[0.2em] text-[10px] mb-3 block">
            JUDGE PORTAL
          </span>
          <h1 className="font-display text-cream-warm text-2xl md:text-3xl font-bold tracking-tight text-center leading-snug">
            Enter Your{" "}
            <span className="text-gold-gradient">Access Code</span>
          </h1>
          <p className="font-body text-gold-shimmer/60 text-sm mt-3 text-center leading-relaxed max-w-xs">
            Your unique code was provided by the event coordinator. It grants
            access to your assigned panel.
          </p>
        </div>

        {/* Code input grid */}
        <div className="flex gap-3 justify-center mb-2" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={status === "loading" || status === "success"}
              aria-label={`Code digit ${i + 1}`}
              className={[
                "w-12 h-14 text-center font-display text-xl font-bold uppercase",
                "border bg-transparent outline-none transition-all duration-200",
                "focus:scale-105",
                status === "error"
                  ? "border-red-400/60 text-red-300 focus:border-red-400"
                  : status === "success"
                  ? "border-gold text-gold"
                  : digit
                  ? "border-gold/60 text-cream-warm focus:border-gold"
                  : "border-gold-shimmer/20 text-cream-warm focus:border-gold-shimmer/60",
                "caret-gold",
              ].join(" ")}
              style={{ caretColor: "currentColor" }}
            />
          ))}
        </div>

        {/* Separator line beneath inputs */}
        <div className="flex gap-3 justify-center mb-8">
          {code.map((_, i) => (
            <div
              key={i}
              className={[
                "w-12 h-[1px] transition-all duration-300",
                status === "error"
                  ? "bg-red-400/50"
                  : status === "success"
                  ? "bg-gold"
                  : code[i]
                  ? "bg-gold/50"
                  : "bg-gold-shimmer/20",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Error message */}
        <div className="h-5 mb-6 flex items-center justify-center">
          {status === "error" && (
            <p className="font-body text-red-300/80 text-xs tracking-wide text-center animate-fade-in-up">
              {errorMessage}
            </p>
          )}
          {status === "success" && (
            <p className="font-body text-gold text-xs tracking-[0.1em] uppercase text-center animate-fade-in-up">
              Access granted — redirecting…
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!isFull || status === "loading" || status === "success"}
          className={[
            "w-full py-4 font-body text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300",
            "border relative overflow-hidden",
            !isFull || status === "loading" || status === "success"
              ? "border-gold-shimmer/20 text-gold-shimmer/30 cursor-not-allowed"
              : "border-gold text-white bg-gold hover:bg-gold-dark btn-shimmer",
          ].join(" ")}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingDots />
              Verifying
            </span>
          ) : status === "success" ? (
            "Access Granted"
          ) : (
            "Enter Panel"
          )}
        </button>

        {/* Back to Category */}
        <a
          href="/user-category/category"
          className="w-full mt-3 py-4 flex items-center justify-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.12em] border border-gold text-gold hover:text-white hover:bg-gold/10 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Category
        </a>

        {/* Help text */}
        <p className="font-body text-gold-shimmer/30 text-xs text-center mt-8 leading-relaxed">
          Don&apos;t have a code?{" "}
          <a
            href="#"
            className="text-gold-shimmer/50 underline underline-offset-2 hover:text-gold transition-colors duration-200"
          >
            Contact the event coordinator
          </a>
        </p>
      </div>

      {/* Bottom divider — subtle brand mark */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-40">
        <div className="w-px h-8 bg-gold-shimmer/30" />
        <div className="w-1.5 h-1.5 border border-gold-shimmer/50 rotate-45" />
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}