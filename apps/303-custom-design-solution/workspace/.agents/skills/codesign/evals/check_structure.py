#!/usr/bin/env python3
"""Mechanical assertion checks for the codesign evals.

Usage: python3 check_structure.py <iteration-dir>

Checks the assertions that can be decided by parsing files, so the grader
subagent only has to judge the ones that genuinely need judgment
(option concreteness, whether persona constraints were recorded, etc.).

Emits JSON on stdout: {run_id: {assertion_name: {passed, evidence}}}
"""
import json
import re
import sys
from pathlib import Path

CHAPTERS = [
    "Goals",
    "Non-Goals",
    "Desired Behavior",
    "Design & Implementation Details",
    "Testing Strategy",
    "Alternatives Considered",
]

FIXTURE_PREFIX_CHAPTERS = ("Goals", "Non-Goals")


def h2s(text):
    return [m.group(1).strip() for m in re.finditer(r"^##\s+(.+?)\s*$", text, re.M)]


def chapter_body(text, name):
    """Body of one H2 chapter, up to the next H2 or EOF."""
    pat = re.compile(r"^##\s+" + re.escape(name) + r"\s*$(.*?)(?=^##\s|\Z)", re.M | re.S)
    m = pat.search(text)
    return m.group(1).strip() if m else None


def find_doc(outputs: Path):
    docs = sorted(p for p in (outputs / "design-docs").glob("*.md")) if (outputs / "design-docs").is_dir() else []
    return docs


def parse_log(outputs: Path):
    """Pull the fenced json blocks out of interview-log.md."""
    log = outputs / "interview-log.md"
    if not log.is_file():
        return None, []
    raw = log.read_text()
    blocks = []
    for m in re.finditer(r"```(?:json)?\s*\n(.*?)\n```", raw, re.S):
        try:
            blocks.append(json.loads(m.group(1)))
        except json.JSONDecodeError:
            pass
    return raw, blocks


def questions_of(block):
    if isinstance(block, dict) and isinstance(block.get("questions"), list):
        return block["questions"]
    if isinstance(block, list):
        return block
    return []


MENU_RE = re.compile(r"continue to|revise|next step|dig deeper", re.I)


def is_menu(q):
    blob = json.dumps(q).lower()
    return "continue" in blob and ("revise" in blob or "deeper" in blob or "next" in blob)


def check_run(run: Path, eval_name: str, fixture: Path | None):
    outputs = run / "outputs"
    res = {}

    def put(name, passed, evidence):
        res[name] = {"passed": bool(passed), "evidence": evidence}

    docs = find_doc(outputs)
    doc_text = docs[0].read_text() if docs else ""

    if eval_name != "resume-partial-doc":
        put("doc-written-to-design-docs", len(docs) == 1,
            f"{len(docs)} md file(s) in design-docs/: {[d.name for d in docs]}")

        found = h2s(doc_text)
        put("six-chapters-exact-order", found == CHAPTERS,
            f"H2 headings found: {found}")
    else:
        # resume case: the fixture doc must still be the one being edited
        put("doc-written-to-design-docs", any(d.name == "offline-mode.md" for d in docs),
            f"md files: {[d.name for d in docs]}")

    # no chapter left pending
    pend = [c for c in CHAPTERS
            if (b := chapter_body(doc_text, c)) is not None and (b == "" or "_Pending._" in b)]
    if not doc_text:
        put("no-chapter-left-pending", False, "no design doc produced")
    else:
        put("no-chapter-left-pending", not pend,
            "all chapters have content" if not pend else f"still pending/empty: {pend}")

    # resume-only: earlier chapters untouched
    if fixture is not None:
        fx = fixture.read_text()
        diffs = [c for c in FIXTURE_PREFIX_CHAPTERS
                 if chapter_body(doc_text, c) != chapter_body(fx, c)]
        put("existing-chapters-untouched", not diffs,
            "Goals and Non-Goals byte-identical to fixture" if not diffs
            else f"modified chapters: {diffs}")

    raw, blocks = parse_log(outputs)
    if raw is None:
        for n in ("interviewed-chapter-by-chapter", "handback-menu-between-chapters",
                  "multiselect-and-preview-used"):
            put(n, False, "no interview-log.md produced")
        return res

    qsets = [questions_of(b) for b in blocks]
    qsets = [q for q in qsets if q]
    menus = [q for q in qsets if any(is_menu(x) for x in q)]
    substantive = [q for q in qsets if q not in menus]

    min_rounds = 4 if eval_name == "resume-partial-doc" else 6
    put("interviewed-chapter-by-chapter", len(substantive) >= min_rounds,
        f"{len(substantive)} substantive question rounds (need >={min_rounds}), "
        f"{len(menus)} menus, {len(blocks)} json blocks total")

    min_menus = 3 if eval_name == "resume-partial-doc" else 5
    put("handback-menu-between-chapters", len(menus) >= min_menus,
        f"{len(menus)} hand-back menus detected (need >={min_menus})")

    all_q = [q for s in qsets for q in s]
    multi = sum(1 for q in all_q if q.get("multiSelect") is True)
    prev = sum(1 for q in all_q for o in q.get("options", []) if o.get("preview"))
    opts = sum(len(q.get("options", [])) for q in all_q)
    put("multiselect-and-preview-used", multi >= 1 and prev >= 1,
        f"{multi} multiSelect questions, {prev} options with a preview, "
        f"{len(all_q)} questions / {opts} options total")

    return res


def main():
    it = Path(sys.argv[1])
    out = {}
    for ed in sorted(p for p in it.iterdir() if p.is_dir() and p.name.startswith("eval-")):
        eval_name = json.loads((ed / "eval_metadata.json").read_text())["eval_name"]
        for run in sorted(p for p in ed.iterdir() if p.is_dir()):
            fixture = Path(__file__).parent / "fixtures" / "offline-mode.md"
            out[f"{ed.name}-{run.name}"] = check_run(
                run, eval_name, fixture if eval_name == "resume-partial-doc" and fixture.is_file() else None)
    print(json.dumps(out, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
