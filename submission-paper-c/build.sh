#!/usr/bin/env bash
# Build script for AIES 2026 anonymous submission (Paper C).
# Run from inside submission-paper-c/ directory.

set -e
cd "$(dirname "$0")"

run_pdflatex() {
  pdflatex -interaction=nonstopmode -halt-on-error paper.tex >/tmp/paperc-pdflatex-$1.log 2>&1 || true
}

# Regenerate from markdown source first
echo "[0/4] Regenerating paper.tex from markdown source..."
python3 build-paper-c.py >/dev/null

echo "[1/4] First pdflatex pass..."
run_pdflatex 1

echo "[2/4] bibtex..."
bibtex paper >/tmp/paperc-bibtex.log 2>&1
if grep -qiE "error" /tmp/paperc-bibtex.log ; then
  echo "  bibtex output:"
  cat /tmp/paperc-bibtex.log
fi

echo "[3/4] Second pdflatex pass..."
run_pdflatex 2

echo "[4/4] Third pdflatex pass (final)..."
run_pdflatex 3

if [ ! -f paper.pdf ]; then
  echo "FAIL: paper.pdf not produced. Last log:"
  tail -50 /tmp/paperc-pdflatex-3.log
  exit 1
fi

if grep -qE "^! " /tmp/paperc-pdflatex-3.log ; then
  echo "FAIL: LaTeX errors in final pass:"
  grep -A 3 "^! " /tmp/paperc-pdflatex-3.log
  exit 1
fi

echo ""
echo "=== Build OK ==="
ls -la paper.pdf

if command -v pdfinfo >/dev/null ; then
  echo ""
  echo "=== Pages ==="
  pdfinfo paper.pdf | grep -E "Pages|File size"
fi

echo ""
echo "=== Sanity ==="
UNDEF=$(pdftotext paper.pdf - 2>/dev/null | grep -c "(?)" || true)
echo "Undefined citations '(?)' in PDF: $UNDEF"
QM=$(pdftotext paper.pdf - 2>/dev/null | grep -cE "REF[0-9]+\\?" || true)
echo "Unmapped refs (REFn?): $QM"

echo ""
echo "=== Anonymity ==="
ANON_CLEAN=1
for term in Wu Daming Stay thestay wudaming "San Jose" Sining ; do
  HITS=$(pdftotext paper.pdf - 2>/dev/null | grep -cE "\\b${term}\\b" || true)
  if [ "$HITS" -gt 0 ] 2>/dev/null; then
    echo "  WARNING: '$term' appears $HITS times"
    ANON_CLEAN=0
  fi
done
[ "$ANON_CLEAN" = "1" ] && echo "  ✓ clean"

echo ""
echo "=== Warnings ==="
grep -iE "(overfull|undefined.*reference|missing.*\.bib)" /tmp/paperc-pdflatex-3.log | grep -v "badness 1[0-9][0-9][0-9]" | head -5 || echo "(no significant warnings)"
