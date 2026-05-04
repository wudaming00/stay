#!/usr/bin/env bash
# Build script for AIES 2026 anonymous submission.
# Run from inside submission/ directory.

set -e
cd "$(dirname "$0")"

# pdflatex returns non-zero on undefined-reference warnings during the first pass.
# That's expected — references resolve on later passes. Don't bail.
run_pdflatex() {
  pdflatex -interaction=nonstopmode -halt-on-error paper.tex >/tmp/paper-pdflatex-$1.log 2>&1 || true
}

echo "[1/4] First pdflatex pass (refs unresolved, warnings expected)..."
run_pdflatex 1

echo "[2/4] bibtex..."
bibtex paper >/tmp/paper-bibtex.log 2>&1
if grep -qiE "error|warning" /tmp/paper-bibtex.log ; then
  echo "  bibtex output:"
  cat /tmp/paper-bibtex.log
fi

echo "[3/4] Second pdflatex pass..."
run_pdflatex 2

echo "[4/4] Third pdflatex pass (final)..."
run_pdflatex 3

# Verify compile actually produced a PDF
if [ ! -f paper.pdf ]; then
  echo "FAIL: paper.pdf not produced. Last log:"
  tail -50 /tmp/paper-pdflatex-3.log
  exit 1
fi

# Check for fatal errors in last pass
if grep -qE "^! " /tmp/paper-pdflatex-3.log ; then
  echo "FAIL: LaTeX errors in final pass:"
  grep -A 3 "^! " /tmp/paper-pdflatex-3.log
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

# Sanity checks
echo ""
echo "=== Sanity checks ==="
UNDEF=$(pdftotext paper.pdf - 2>/dev/null | grep -c "(?)" || true)
echo "Undefined citations '(?)' in PDF: $UNDEF"
QUESTIONS=$(pdftotext paper.pdf - 2>/dev/null | grep -c "§??" || true)
echo "Unresolved section refs '§??': $QUESTIONS"

echo ""
echo "=== Anonymity scan ==="
for term in Wu Daming Stay thestay wudaming "San Jose" ; do
  HITS=$(pdftotext paper.pdf - 2>/dev/null | grep -c -i "\\b${term}\\b" || true)
  if [ "$HITS" -gt 0 ]; then
    # exclude false positives like "T. Wu" co-author of CheckList
    if [ "$term" = "Wu" ]; then
      HITS=$(pdftotext paper.pdf - 2>/dev/null | grep -c -E "\\bWu," || true)
      if [ "$HITS" -gt 1 ]; then
        echo "  WARNING: 'Wu' appears as more than just CheckList co-author ($HITS hits)"
      else
        echo "  OK: 'Wu' only as CheckList co-author"
      fi
    else
      echo "  WARNING: '$term' appears $HITS times in PDF"
    fi
  fi
done

echo ""
echo "=== Warnings worth checking ==="
grep -iE "(overfull|underfull|warning)" /tmp/paper-pdflatex-3.log | grep -v "badness 1[0-9][0-9][0-9]" | head -5 || echo "(no significant warnings)"
