"use client";

import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Check,
  Compass,
  Flag,
  GraduationCap,
  Printer,
  RotateCcw,
  Sparkles,
  Thermometer,
  Waves,
  Activity,
  X,
} from "lucide-react";
import type { LearnPath } from "@/lib/types";
import { Button, ProvenanceChip } from "@/components/ui/primitives";
import { FirnFigure, GlacierFigure, MeltFigure } from "@/components/science/Figures";
import { MascotBadge } from "@/components/yeti/Mascot";
import { cn } from "@/lib/utils";
import { useStoredJson } from "@/lib/useStoredJson";

const LESSON_FIGURES = { melt: MeltFigure, firn: FirnFigure, glacier: GlacierFigure };

const BADGE_ICONS: Record<string, React.ReactNode> = {
  compass: <Compass className="size-6" strokeWidth={1.5} />,
  flag: <Flag className="size-6" strokeWidth={1.5} />,
  sparkles: <Sparkles className="size-6" strokeWidth={1.5} />,
  waves: <Waves className="size-6" strokeWidth={1.5} />,
  thermometer: <Thermometer className="size-6" strokeWidth={1.5} />,
  activity: <Activity className="size-6" strokeWidth={1.5} />,
};

type Stage =
  | { kind: "overview" }
  | { kind: "lesson"; moduleId: string; lessonIdx: number }
  | { kind: "quiz"; moduleId: string };

const NO_BADGES: string[] = [];

export function LearnPathClient({ path }: { path: LearnPath }) {
  const [stage, setStage] = useState<Stage>({ kind: "overview" });
  const [badgeIds, setBadgeIds] = useStoredJson("yeti-badges", NO_BADGES);
  const passed = useMemo(() => new Set(badgeIds), [badgeIds]);
  const [certName, setCertName] = useState("");
  const [celebration, setCelebration] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const markPassed = useCallback(
    (badgeId: string) => {
      if (passed.has(badgeId)) return;
      const badge = path.modules.find((m) => m.badge.id === badgeId)?.badge;
      if (badge) {
        setCelebration(`${badge.name}|||${badge.description}`);
        window.setTimeout(() => setCelebration(null), 4200);
      }
      setBadgeIds([...badgeIds, badgeId]);
    },
    [path, passed, badgeIds, setBadgeIds],
  );

  const pathComplete = path.modules.every((m) => passed.has(m.badge.id));

  const activeModule = stage.kind !== "overview" ? path.modules.find((m) => m.id === stage.moduleId) : null;

  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = 1200);
    const H = (canvas.height = 850);
    // Background
    ctx.fillStyle = "#0A1628";
    ctx.fillRect(0, 0, W, H);
    // Border
    ctx.strokeStyle = "rgba(59,232,176,0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = "rgba(167,188,207,0.2)";
    ctx.strokeRect(34, 34, W - 68, H - 68);
    // Star
    ctx.fillStyle = "#3BE8B0";
    ctx.save();
    ctx.translate(W / 2, 150);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? 42 : 14;
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#EAF2F8";
    ctx.font = "600 26px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillText("D H R U V A  ·  I N D I A ' S  W I N D O W  T O  T H E  P O L E S", W / 2, 250);
    ctx.font = "700 58px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillStyle = "#3BE8B0";
    ctx.fillText("Junior Polar Scientist", W / 2, 340);
    ctx.fillStyle = "#A7BCCF";
    ctx.font = "400 24px 'Inter', sans-serif";
    ctx.fillText("This certifies that", W / 2, 415);
    ctx.fillStyle = "#EAF2F8";
    ctx.font = "700 54px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillText(certName.toUpperCase() || "YOUR NAME HERE", W / 2, 490);
    ctx.fillStyle = "#A7BCCF";
    ctx.font = "400 24px 'Inter', sans-serif";
    ctx.fillText(`has completed the learning path`, W / 2, 555);
    ctx.fillStyle = "#EAF2F8";
    ctx.font = "600 30px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillText(`${path.title} — ${path.classRange}`, W / 2, 605);
    ctx.fillStyle = "#6E8299";
    ctx.font = "400 19px 'Inter', sans-serif";
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    ctx.fillText(`Issued ${date} · Demonstration certificate — educational use, not an accreditation`, W / 2, 700);
    ctx.fillText("Concept portal for MoES · NCPOR — demo build", W / 2, 740);
  }, [certName, path]);

  return (
    <div className="pb-20">
      {/* Badge celebration — YETI marks the milestone, calmly */}
      {celebration && (
        <div
          role="status"
          className="ws-rise fixed bottom-20 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-xl border border-accent/40 bg-bg/95 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur md:bottom-8"
        >
          <MascotBadge state="success" className="h-10 w-14 shrink-0" />
          <div className="min-w-0">
            <p className="meta-label !text-[9px]">Badge earned · YETI logged it in your field notebook</p>
            <p className="text-sm font-semibold text-text">
              {celebration.split("|||")[0]} — {celebration.split("|||")[1]}
            </p>
          </div>
        </div>
      )}
      {/* Path header */}
      <header className="relative flex min-h-[52vh] flex-col justify-end overflow-hidden border-b border-line pb-10 pt-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={path.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/55" aria-hidden />
        <div className="dh-container relative">
          <Link href="/learn" className="link-line mb-5 inline-flex items-center gap-2 text-sm text-text-2 hover:text-text">
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden /> All learning paths
          </Link>
          <p className="meta-label mb-3">{path.audience} · {path.classRange} · {path.minutes} min</p>
          <h1 className="display text-balance text-5xl font-bold leading-[0.98] md:text-6xl">{path.title}</h1>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-text-2">{path.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ProvenanceChip p={path.provenance} label="Curriculum-aligned demo content" />
            <div className="flex items-center gap-1.5 text-xs text-text-3">
              <span className="numeral">{[...passed].length}</span> of <span className="numeral">{path.modules.length}</span> badges earned
            </div>
          </div>
        </div>
      </header>

      <div className="dh-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
        {/* Main stage */}
        <div>
          {stage.kind === "overview" && (
            <div className="flex flex-col gap-6">
              {path.modules.map((m, mi) => {
                const done = passed.has(m.badge.id);
                return (
                  <article key={m.id} className={cn("rounded-xl border bg-surface p-6", done ? "border-accent/40" : "border-line")}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="meta-label">Module {mi + 1} · {m.lessons.length} lessons + quiz</p>
                        <h2 className="display mt-2 text-2xl font-semibold">{m.title}</h2>
                      </div>
                      <div className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold", done ? "border-accent/50 bg-accent-dim text-accent" : "border-line-strong text-text-3")}>
                        {done ? <BadgeCheck className="size-4" strokeWidth={1.5} aria-hidden /> : <Award className="size-4" strokeWidth={1.5} aria-hidden />}
                        {done ? `${m.badge.name} earned` : `Badge: ${m.badge.name}`}
                      </div>
                    </div>
                    <ul className="mt-4 flex flex-col divide-y divide-line border-t border-line">
                      {m.lessons.map((l) => (
                        <li key={l.id} className="flex items-center justify-between gap-4 py-3">
                          <span className="flex min-w-0 items-center gap-3">
                            <BookOpenCheck className="size-4 shrink-0 text-text-3" strokeWidth={1.5} aria-hidden />
                            <span className="truncate text-sm text-text-2">{l.title}</span>
                          </span>
                          <span className="numeral shrink-0 text-[11px] text-text-3">{l.minutes} min</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button onClick={() => setStage({ kind: "lesson", moduleId: m.id, lessonIdx: 0 })}>
                        {done ? "Revisit module" : "Start module"}
                        <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {stage.kind === "lesson" && activeModule && (
            <LessonReader
              key={`${stage.moduleId}-${stage.lessonIdx}`}
              path={path}
              moduleId={stage.moduleId}
              lessonIdx={stage.lessonIdx}
              onNext={(nextIdx) => {
                if (nextIdx >= activeModule.lessons.length) setStage({ kind: "quiz", moduleId: stage.moduleId });
                else setStage({ kind: "lesson", moduleId: stage.moduleId, lessonIdx: nextIdx });
              }}
              onExit={() => setStage({ kind: "overview" })}
            />
          )}

          {stage.kind === "quiz" && activeModule && (
            <QuizRunner
              moduleId={activeModule.id}
              title={activeModule.title}
              questions={activeModule.quiz}
              badge={activeModule.badge}
              passed={passed.has(activeModule.badge.id)}
              onPass={() => markPassed(activeModule.badge.id)}
              onExit={() => setStage({ kind: "overview" })}
            />
          )}
        </div>

        {/* Side: badges + certificate */}
        <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-24">
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="meta-label mb-4">Badge wall</h2>
            <ul className="grid grid-cols-3 gap-4">
              {path.modules.map((m) => {
                const done = passed.has(m.badge.id);
                return (
                  <li key={m.badge.id} className="flex flex-col items-center gap-2 text-center" title={m.badge.description}>
                    <span className={cn("flex size-14 items-center justify-center rounded-full border", done ? "border-accent/50 bg-accent-dim text-accent" : "border-line text-text-3")}>
                      {BADGE_ICONS[m.badge.icon] ?? <Award className="size-6" strokeWidth={1.5} />}
                    </span>
                    <span className={cn("text-[10px] font-semibold leading-tight", done ? "text-accent" : "text-text-3")}>
                      {m.badge.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={cn("rounded-xl border p-6", pathComplete ? "border-accent/50 bg-accent-dim" : "border-line bg-surface")}>
            <h2 className="meta-label mb-2">Certificate</h2>
            <p className="text-sm leading-relaxed text-text-2">
              {pathComplete
                ? "All modules complete — generate your Junior Polar Scientist certificate."
                : `Earn all ${path.modules.length} badges in this path to unlock the certificate.`}
            </p>
            <input
              value={certName}
              onChange={(e) => setCertName(e.target.value.slice(0, 40))}
              placeholder="Your name"
              disabled={!pathComplete}
              className="mt-4 h-11 w-full rounded-lg border border-line-strong bg-bg px-3.5 text-sm text-text outline-none placeholder:text-text-3 focus:border-accent/60 disabled:opacity-50"
              aria-label="Name for the certificate"
            />
            {pathComplete && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    drawCertificate();
                    setTimeout(() => {
                      const url = canvasRef.current?.toDataURL("image/png");
                      if (!url) return;
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "yeti-junior-polar-scientist.png";
                      a.click();
                    }, 60);
                  }}
                >
                  <GraduationCap className="size-4" strokeWidth={1.5} aria-hidden />
                  Generate PNG
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    drawCertificate();
                    setTimeout(() => window.print(), 80);
                  }}
                >
                  <Printer className="size-4" strokeWidth={1.5} aria-hidden />
                  Print
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Offscreen certificate canvas */}
      <canvas ref={canvasRef} className="pointer-events-none fixed left-[-9999px] top-0" aria-hidden />

      {/* Certificate preview modal */}
      {pathComplete && certName && stage.kind === "overview" && (
        <p className="dh-container -mt-6 text-xs text-text-3">
          Preview: the canvas certificate renders with your name — <span className="text-text-2">{certName}</span> —
          path title and issue date. Fully offline, generated in your browser.
        </p>
      )}
    </div>
  );
}

function LessonReader({
  path,
  moduleId,
  lessonIdx,
  onNext,
  onExit,
}: {
  path: LearnPath;
  moduleId: string;
  lessonIdx: number;
  onNext: (nextIdx: number) => void;
  onExit: () => void;
}) {
  const mod = path.modules.find((m) => m.id === moduleId)!;
  const lesson = mod.lessons[lessonIdx];
  return (
    <motion.article
      key={lesson.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-line bg-surface p-7"
    >
      <div className="flex items-center justify-between">
        <p className="meta-label">
          {mod.title} · Lesson {lessonIdx + 1} of {mod.lessons.length} · {lesson.minutes} min
        </p>
        <button onClick={onExit} className="btn-tactile rounded-md border border-line-strong p-2 text-text-2 hover:text-text" aria-label="Exit to module list">
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <h2 className="display mt-4 text-3xl font-semibold">{lesson.title}</h2>
      <div className="mt-6 flex flex-col gap-5">
        {lesson.blocks.map((b, i) => (
          <div key={i}>
            {b.heading && <h3 className="display mb-1.5 text-lg font-semibold text-accent">{b.heading}</h3>}
            <p className="text-[15px] leading-[1.75] text-text-2">{b.text}</p>
            {b.figure && <div className="mt-5">{createElement(LESSON_FIGURES[b.figure])}</div>}
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
        <span className="numeral text-xs text-text-3">
          {lessonIdx + 1}/{mod.lessons.length} · then checkpoint quiz
        </span>
        <Button onClick={() => onNext(lessonIdx + 1)}>
          {lessonIdx + 1 >= mod.lessons.length ? "Take the quiz" : "Next lesson"}
          <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
        </Button>
      </div>
    </motion.article>
  );
}

function QuizRunner({
  moduleId,
  title,
  questions,
  badge,
  passed,
  onPass,
  onExit,
}: {
  moduleId: string;
  title: string;
  questions: LearnPath["modules"][number]["quiz"];
  badge: LearnPath["modules"][number]["badge"];
  passed: boolean;
  onPass: () => void;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(
    () => questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0),
    [answers, questions],
  );
  const passMark = Math.ceil(questions.length * 0.6);
  const didPass = score >= passMark;

  useEffect(() => {
    if (submitted && didPass && !passed) onPass();
  }, [submitted, didPass, passed, onPass]);

  return (
    <motion.section
      key={`${moduleId}-quiz`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-line bg-surface p-7"
      aria-label={`Checkpoint quiz: ${title}`}
    >
      <div className="flex items-center justify-between">
        <p className="meta-label">Checkpoint quiz · {title}</p>
        <button onClick={onExit} className="btn-tactile rounded-md border border-line-strong p-2 text-text-2 hover:text-text" aria-label="Exit quiz">
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <ol className="mt-6 flex flex-col gap-7">
        {questions.map((q, qi) => (
          <li key={qi}>
            <p className="text-[15px] font-semibold text-text">
              {qi + 1}. {q.q}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const correct = submitted && oi === q.answer;
                const wrong = submitted && chosen && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={cn(
                      "btn-tactile flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm",
                      correct
                        ? "border-accent/60 bg-accent-dim text-accent"
                        : wrong
                          ? "border-danger/60 bg-danger/10 text-danger"
                          : chosen
                            ? "border-accent/50 text-text"
                            : "border-line-strong text-text-2 hover:border-text-3",
                    )}
                  >
                    <span className="numeral text-[11px]">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                    {correct && <Check className="ml-auto size-4" strokeWidth={1.5} aria-hidden />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2.5 rounded-lg border border-line bg-bg px-4 py-2.5 text-xs leading-relaxed text-text-3">
                {q.explanation}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        {!submitted ? (
          <>
            <span className="numeral text-xs text-text-3">
              {Object.keys(answers).length}/{questions.length} answered · pass mark {passMark}/{questions.length}
            </span>
            <Button disabled={Object.keys(answers).length < questions.length} onClick={() => setSubmitted(true)}>
              Submit answers
            </Button>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-wrap items-center justify-between gap-4"
            >
              <p className={cn("display text-lg font-bold", didPass ? "text-accent" : "text-sunrise")}>
                {didPass ? `Badge earned: ${badge.name}` : `${score}/${questions.length} — close. Review the lessons and retry.`}
                {didPass && !passed && " (new)"}
              </p>
              <div className="flex gap-2">
                {!didPass && (
                  <Button variant="secondary" onClick={() => { setSubmitted(false); setAnswers({}); }}>
                    <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden />
                    Retry
                  </Button>
                )}
                <Button variant="secondary" onClick={onExit}>
                  Back to modules
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.section>
  );
}
