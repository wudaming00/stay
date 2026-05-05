#!/usr/bin/env python3
"""
Build script for Paper C AIES submission.
Converts docs/paper-C-aies-anon.md to AAAI-format paper.tex.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
REPO = ROOT.parent
SRC = REPO / "docs/paper-C-aies-anon.md"
OUT_TEX = ROOT / "paper.tex"
OUT_BIB = ROOT / "paper.bib"

# Citation mapping: [N] -> bibtex key (must match paper.bib entries)
CITE_MAP = {
    1: "torous2018digital",
    2: "olawade2024review",
    3: "nice2024htg756",
    4: "openai2025strengthening",
    5: "samhsa2024nsduh",
    6: "star1991power",
    7: "strauss1993permutations",
    8: "schmidt1992cscw",
    9: "mishler1984discourse",
    10: "kleinman1988narratives",
    11: "nutbeam2000literacy",
    12: "hibbard2004pam",
    13: "elwyn2012sdm",
    14: "stacey2024cochrane",
    15: "krakovna2020specification",
    16: "goodhart1975",
    17: "manheim2018goodhart",
    18: "hubinger2019mesa",
    19: "sharma2023sycophancy",
    20: "casper2023rlhf",
    21: "shah2022goal",
    22: "perez2022evaluations",
    23: "heinz2025therabot",
    24: "habicht2024limbic",
    25: "ieso2024",
    26: "aiid2023neda",
    27: "garcia2025character",
    28: "wisniewski2022navigator",
    29: "yanos2010identity",
    30: "lally1989",
    31: "posner2011cssrs",
    32: "glass2008strangulation",
    33: "rollwage2023limbic",
    34: "raine2025openai",
    35: "sakata2025psychosis",
    36: "stanley2018spi",
    37: "drew2001",
    38: "jobes2016cams",
    39: "henderson2013stigma",
    40: "schomerus2012stigma",
    41: "clement2015stigma",
    42: "belli2025veramh",
    43: "politico2022crisistext",
}


def pandoc_convert(md_text):
    """Run pandoc markdown → latex."""
    result = subprocess.run(
        ["python3", "-c", "import pypandoc, sys; print(pypandoc.convert_text(sys.stdin.read(), 'latex', format='markdown', extra_args=['--wrap=none']))"],
        input=md_text, capture_output=True, text=True, check=True
    )
    return result.stdout


def post_process(latex):
    """Post-process pandoc output for AAAI format."""
    # Strip everything before first H1 section
    # Remove the title section (we re-add via \title{} in template)
    latex = re.sub(r'^\\section\{Articulation Skill[^}]*\}\\label\{[^}]*\}\s*\n', '', latex, count=1)

    # Remove the anon submission italic line
    latex = re.sub(r'\\emph\{Anonymous submission to AIES 2026\.\}\s*\n', '', latex)
    latex = re.sub(r'\\emph\{Throughout this paper.*?empirical claims\.\}\s*\n', '', latex, flags=re.DOTALL)

    # Remove horizontal rules
    latex = re.sub(r'\\begin\{center\}\\rule\{0\.5\\linewidth\}\{0\.5pt\}\\end\{center\}\s*\n', '', latex)

    # Remove the "## Abstract" subsection heading (template has \begin{abstract} env)
    latex = re.sub(r'\\subsection\{Abstract\}\\label\{abstract\}\s*\n', '', latex)

    # Convert numbered subsections "## 1. Introduction" -> \section{Introduction}
    # pandoc made them \subsection — promote and strip number
    latex = re.sub(r'\\subsection\{(\d+)\.\s+([^}]+)\}\\label\{[^}]*\}',
                   lambda m: r'\section{' + m.group(2).strip() + '}', latex)

    # Convert numbered subsubsections "### 1.1 X" -> \subsection{X}
    latex = re.sub(r'\\subsubsection\{(\d+\.\d+)\s+([^}]+)\}\\label\{[^}]*\}',
                   lambda m: r'\subsection{' + m.group(2).strip() + '}', latex)
    latex = re.sub(r'\\subsubsection\{(\d+\.\d+\.\d+)\s+([^}]+)\}\\label\{[^}]*\}',
                   lambda m: r'\subsubsection{' + m.group(2).strip() + '}', latex)

    # Convert {[}N{]} citation pattern -> \citep{key}
    def cite_replace(m):
        n = int(m.group(1))
        if n in CITE_MAP:
            return r'\citep{' + CITE_MAP[n] + '}'
        return f'[REF{n}?]'

    latex = re.sub(r'\{\[\}(\d+)\{\]\}', cite_replace, latex)

    # § sign fixup (pandoc may leave as is)
    latex = latex.replace('§', r'\S')

    # Replace non-ASCII unicode with LaTeX-safe equivalents
    unicode_map = {
        '✓': r'\checkmark{}',
        '✗': r'$\times$',
        '→': r'$\rightarrow$',
        'κ': r"Cohen's $\kappa$",  # but this only works in narrow context; better generic:
        '≥': r'$\geq$',
        '≈': r'$\approx$',
        '©': r'\textcopyright{}',
        '‘': "`",  # left single quote
        '’': "'",  # right single quote
        '“': "``", # left double quote
        '”': "''", # right double quote
        '–': '--', # en dash
        '—': '---', # em dash
    }
    # Don't double-replace κ. Use generic math mode:
    unicode_map['κ'] = r'$\kappa$'
    for k, v in unicode_map.items():
        latex = latex.replace(k, v)
    # Em-dashes are already handled by pandoc as ---

    # Strip pandoc's pre-table \LTcaptype block
    latex = re.sub(r'\{\\def\\LTcaptype\{none\}[^\n]*\n', '', latex)
    # Strip the closing brace of the LTcaptype scope (find lone } after \end{longtable})
    # We'll handle in conversion below

    # Convert longtable to regular table* (2-column AAAI doesn't allow longtable)
    def longtable_to_table(m):
        body = m.group(1)

        # Strip \begin{minipage}[b]{\linewidth}\raggedright ... \end{minipage} wrappers
        body = re.sub(
            r'\\begin\{minipage\}\[b\]\{\\linewidth\}\\raggedright\s*(.*?)\s*\\end\{minipage\}',
            r'\1',
            body,
            flags=re.DOTALL
        )
        # Strip \noalign{} fragments
        body = re.sub(r'\\noalign\{\}', '', body)

        # Find the data rows (everything after \toprule / \midrule / \bottomrule)
        # Pandoc emits: \toprule headers \\ \midrule \bottomrule data \\ data \\ ... \end{longtable}
        # Strip the whole tabular preamble; we'll rebuild
        # Find lines after "\toprule" until next "\\":
        rows = []
        # Get content from \toprule to end (excluding the spec)
        m_top = re.search(r'\\toprule(.+)', body, flags=re.DOTALL)
        if not m_top:
            # Fallback: pass through
            return r"\begin{table*}[ht]\centering\small\begin{tabular}" + body + r"\end{tabular}\end{table*}"

        content = m_top.group(1)
        # Strip rule commands
        content = re.sub(r'\\midrule\s*', '', content)
        content = re.sub(r'\\bottomrule\s*', '', content)
        content = re.sub(r'\\toprule\s*', '', content)
        # Now content should be header_row \\ data_row \\ data_row \\ ...
        # Split on \\ end-of-row markers (not in the middle of an expression)
        # Each row ends with "\\" at end of line
        row_strs = [r.strip() for r in re.split(r'\\\\', content) if r.strip()]

        if not row_strs:
            return r"\begin{table*}[ht]\centering\small\begin{tabular}" + body + r"\end{tabular}\end{table*}"

        # Count columns from first row
        col_count = row_strs[0].count('&') + 1

        # Build tabular with p-columns so cells can wrap
        # Total available width in table* is \textwidth (full page minus margins)
        # Distribute evenly with slight margin
        col_width_frac = 0.95 / col_count
        col_spec = ('p{' + f'{col_width_frac:.3f}' + r'\textwidth}') * col_count

        out = [r'\begin{table*}[ht]', r'\centering', r'\footnotesize',
               r'\begin{tabular}{' + col_spec + r'}', r'\toprule']
        # Header row (first)
        out.append(row_strs[0] + r' \\')
        out.append(r'\midrule')
        for row in row_strs[1:]:
            out.append(row + r' \\')
        out.append(r'\bottomrule')
        out.append(r'\end{tabular}')
        out.append(r'\end{table*}')
        return '\n'.join(out)

    latex = re.sub(
        r'\\begin\{longtable\}(.*?)\\end\{longtable\}',
        longtable_to_table,
        latex,
        flags=re.DOTALL
    )

    # Remove \endfirsthead, \endhead, \endlastfoot if present (longtable-specific)
    latex = re.sub(r'\\endfirsthead\s*', '', latex)
    latex = re.sub(r'\\endhead\s*', '', latex)
    latex = re.sub(r'\\endlastfoot\s*', '', latex)
    latex = re.sub(r'\\endfoot\s*', '', latex)

    # The \LTcaptype scope had a trailing }, find and remove
    # Actually it's the } that closes the {\def\LTcaptype{none}...} group
    # After my strip above, there's a stray } left. Find \end{table*}\n} and replace.
    latex = re.sub(r'\\end\{table\*\}\n\}', r'\\end{table*}', latex)

    # Remove the "## References" section — we use bibliography
    latex = re.sub(r'\\section\{References\}.*$', '', latex, flags=re.DOTALL)

    # Strip extra leading whitespace
    latex = latex.strip()

    return latex


def build_bib():
    """Write paper.bib with all citation entries."""
    entries = r"""
@misc{torous2018digital,
  author = {Torous, John and Onnela, Jukka-Pekka and Keshavan, Matcheri},
  title = {New dimensions and new tools to realize the potential of {RDoC}: digital phenotyping via smartphones and wearables},
  year = {2018},
  note = {Translational Psychiatry / JMIR Mental Health digital-phenotyping framework}
}

@article{olawade2024review,
  author = {Olawade, David B. and others},
  title = {Artificial intelligence in mental healthcare: a 2024 review of opportunities and risks},
  journal = {Computers in Biology and Medicine},
  year = {2024}
}

@misc{nice2024htg756,
  author = {{National Institute for Health and Care Excellence}},
  title = {Early Value Assessment {HTG756}: Digital front door technologies for {NHS} {T}alking {T}herapies},
  year = {2024}
}

@misc{openai2025strengthening,
  author = {{OpenAI}},
  title = {Strengthening {C}hat{GPT}'s Responses in Sensitive Conversations},
  year = {2025},
  month = {October},
  howpublished = {OpenAI}
}

@misc{samhsa2024nsduh,
  author = {{Substance Abuse and Mental Health Services Administration}},
  title = {2023 National Survey on Drug Use and Health (NSDUH)},
  year = {2024}
}

@incollection{star1991power,
  author = {Star, Susan Leigh},
  title = {Power, technology and the phenomenology of conventions: On being allergic to onions},
  booktitle = {A Sociology of Monsters},
  editor = {Law, John},
  publisher = {Routledge},
  year = {1991}
}

@book{strauss1993permutations,
  author = {Strauss, Anselm},
  title = {Continual Permutations of Action},
  publisher = {Aldine de Gruyter},
  year = {1993}
}

@article{schmidt1992cscw,
  author = {Schmidt, Kjeld and Bannon, Liam},
  title = {Taking {CSCW} seriously: supporting articulation work},
  journal = {{CSCW}: An International Journal},
  volume = {1},
  year = {1992}
}

@book{mishler1984discourse,
  author = {Mishler, Elliot G.},
  title = {The Discourse of Medicine: Dialectics of Medical Interviews},
  publisher = {Ablex},
  year = {1984}
}

@book{kleinman1988narratives,
  author = {Kleinman, Arthur},
  title = {The Illness Narratives: Suffering, Healing, and the Human Condition},
  publisher = {Basic Books},
  year = {1988}
}

@article{nutbeam2000literacy,
  author = {Nutbeam, Don},
  title = {Health literacy as a public health goal: a challenge for contemporary health education and communication strategies into the 21st century},
  journal = {Health Promotion International},
  volume = {15},
  number = {3},
  year = {2000}
}

@article{hibbard2004pam,
  author = {Hibbard, Judith H. and Stockard, Jean and Mahoney, Eldon R. and Tusler, Martin},
  title = {Development of the Patient Activation Measure ({PAM})},
  journal = {Health Services Research},
  volume = {39},
  year = {2004}
}

@article{elwyn2012sdm,
  author = {Elwyn, Glyn and others},
  title = {Shared decision making: a model for clinical practice},
  journal = {Journal of General Internal Medicine},
  volume = {27},
  number = {10},
  year = {2012}
}

@article{stacey2024cochrane,
  author = {Stacey, Dawn and others},
  title = {Decision aids for people facing health treatment or screening decisions},
  journal = {Cochrane Database of Systematic Reviews},
  number = {CD001431},
  year = {2024}
}

@misc{krakovna2020specification,
  author = {Krakovna, Victoria and others},
  title = {Specification gaming: the flip side of {AI} ingenuity},
  year = {2020},
  howpublished = {DeepMind blog and curated examples list}
}

@article{goodhart1975,
  author = {Goodhart, Charles A. E.},
  title = {Problems of monetary management: the {U.K.} experience},
  year = {1975}
}

@misc{manheim2018goodhart,
  author = {Manheim, David and Garrabrant, Scott},
  title = {Categorizing variants of {G}oodhart's Law},
  year = {2018},
  eprint = {1803.04585},
  archivePrefix = {arXiv}
}

@misc{hubinger2019mesa,
  author = {Hubinger, Evan and others},
  title = {Risks from learned optimization in advanced machine learning systems},
  year = {2019},
  eprint = {1906.01820},
  archivePrefix = {arXiv}
}

@misc{sharma2023sycophancy,
  author = {Sharma, Mrinank and others},
  title = {Towards understanding sycophancy in language models},
  year = {2023},
  eprint = {2310.13548},
  archivePrefix = {arXiv}
}

@misc{casper2023rlhf,
  author = {Casper, Stephen and others},
  title = {Open problems and fundamental limitations of reinforcement learning from human feedback},
  year = {2023},
  eprint = {2307.15217},
  archivePrefix = {arXiv}
}

@misc{shah2022goal,
  author = {Shah, Rohin and others},
  title = {Goal misgeneralization: why correct specifications aren't enough for correct goals},
  year = {2022},
  eprint = {2210.01790},
  archivePrefix = {arXiv}
}

@misc{perez2022evaluations,
  author = {Perez, Ethan and others},
  title = {Discovering language model behaviors with model-written evaluations},
  year = {2022},
  eprint = {2212.09251},
  archivePrefix = {arXiv}
}

@article{heinz2025therabot,
  author = {Heinz, Michael and others},
  title = {Randomized trial of a generative {AI} chatbot for mental health treatment},
  journal = {NEJM AI},
  year = {2025}
}

@article{habicht2024limbic,
  author = {Habicht, Johanna and others},
  title = {Closing the accessibility gap to mental health treatment with a personalized self-referral chatbot},
  journal = {Nature Medicine},
  year = {2024}
}

@misc{ieso2024,
  author = {{IESO Digital Health}},
  title = {Non-inferiority study, {NHS} partnership},
  year = {2024}
}

@misc{aiid2023neda,
  author = {{AI Incident Database}},
  title = {Incident on {NEDA} {T}essa chatbot replacing {ED} helpline},
  year = {2023}
}

@misc{garcia2025character,
  title = {{G}arcia v.\ {C}haracter {T}echnologies, Inc.},
  note = {{M.D. Fla. 6:24-cv-01903}; tort cluster settled 2026-01-07},
  year = {2025}
}

@article{wisniewski2022navigator,
  author = {Wisniewski, Hannah and others},
  title = {The role of digital navigators in promoting clinical care and technology integration into practice},
  journal = {The Lancet Digital Health},
  year = {2022}
}

@article{yanos2010identity,
  author = {Yanos, Philip T. and Roe, David and Lysaker, Paul H.},
  title = {The impact of illness identity on recovery from severe mental illness},
  journal = {American Journal of Psychiatric Rehabilitation},
  volume = {13},
  number = {2},
  year = {2010}
}

@article{lally1989,
  author = {Lally, Stephen J.},
  title = {``Does being in here mean there is something wrong with me?''},
  journal = {Schizophrenia Bulletin},
  volume = {15},
  number = {2},
  year = {1989}
}

@article{posner2011cssrs,
  author = {Posner, Kelly and others},
  title = {The {C}olumbia--{S}uicide {S}everity {R}ating {S}cale: initial validity and internal consistency findings from three multisite studies with adolescents and adults},
  journal = {American Journal of Psychiatry},
  volume = {168},
  number = {12},
  pages = {1266--1277},
  year = {2011}
}

@article{glass2008strangulation,
  author = {Glass, Nancy and others},
  title = {Non-fatal strangulation is an important risk factor for homicide of women},
  journal = {Journal of Emergency Medicine},
  volume = {35},
  pages = {329--335},
  year = {2008}
}

@article{rollwage2023limbic,
  author = {Rollwage, Max and others},
  title = {{L}imbic {A}ccess user-experience study},
  journal = {JMIR AI},
  year = {2023}
}

@misc{raine2025openai,
  title = {{R}aine v.\ {O}pen{AI}},
  note = {San Francisco Superior Court, filed 2025-08-26; coalition filings 2025-11-06},
  year = {2025}
}

@article{sakata2025psychosis,
  author = {Sakata, K. and others},
  title = {{AI}-induced delusional state case series},
  journal = {Psychiatric News and JMIR Mental Health},
  year = {2025}
}

@article{stanley2018spi,
  author = {Stanley, Barbara and Brown, Gregory K.},
  title = {Comparison of the safety planning intervention with follow-up vs usual care of suicidal patients treated in the emergency department},
  journal = {JAMA Psychiatry},
  year = {2018}
}

@article{drew2001,
  author = {Drew, Beverly L.},
  title = {Self-harm behavior and no-suicide contracting in psychiatric inpatient settings},
  journal = {Archives of Psychiatric Nursing},
  volume = {15},
  number = {3},
  year = {2001}
}

@book{jobes2016cams,
  author = {Jobes, David A.},
  title = {Managing Suicidal Risk: A Collaborative Approach},
  edition = {2nd},
  publisher = {Guilford},
  year = {2016}
}

@article{henderson2013stigma,
  author = {Henderson, Claire and Evans-Lacko, Sara and Thornicroft, Graham},
  title = {Mental illness stigma, help seeking, and public health programs},
  journal = {American Journal of Public Health},
  volume = {103},
  number = {5},
  year = {2013}
}

@article{schomerus2012stigma,
  author = {Schomerus, Georg and others},
  title = {Evolution of public attitudes about mental illness},
  journal = {Acta Psychiatrica Scandinavica},
  volume = {125},
  year = {2012}
}

@article{clement2015stigma,
  author = {Clement, Sarah and others},
  title = {What is the impact of mental health-related stigma on help-seeking?},
  journal = {Psychological Medicine},
  volume = {45},
  year = {2015}
}

@misc{belli2025veramh,
  author = {Belli, Luca and Bentley, Kate and others},
  title = {{VERA-MH}: Reliability and Validity of an Open-Source {AI} Safety Evaluation in Mental Health},
  year = {2025},
  eprint = {2510.15297},
  archivePrefix = {arXiv}
}

@misc{politico2022crisistext,
  author = {{Politico} and {JMIR}},
  title = {Reporting on Crisis Text Line / Loris.ai data-sharing controversy},
  year = {2022}
}
"""
    OUT_BIB.write_text(entries.strip() + "\n")
    print(f"  paper.bib written ({len(entries)} chars)")


# Read source markdown
md = SRC.read_text()

# Convert via pandoc
print("[1/3] Converting markdown -> latex...")
import pypandoc
latex_body = pypandoc.convert_text(md, 'latex', format='markdown', extra_args=['--wrap=none'])

# Post-process
print("[2/3] Post-processing...")
latex_body = post_process(latex_body)

# Build paper.tex by assembling header + abstract + body
print("[3/3] Assembling paper.tex...")

# Extract abstract (between '## Abstract' marker, which we already stripped, until next \section)
# Actually since we stripped Abstract heading, the abstract text is the first chunk before \section
# Find first \section - that marks start of section 1
m = re.search(r'\\section\{', latex_body)
if m:
    abstract_text = latex_body[:m.start()].strip()
    body_text = latex_body[m.start():]
else:
    abstract_text = ""
    body_text = latex_body

# Template
TEMPLATE = r"""%File: paper.tex --- AIES 2026 anonymous submission (Paper C)
\documentclass[letterpaper]{article}
\usepackage[submission]{aaai2026}
\usepackage{times}
\usepackage{helvet}
\usepackage{courier}
\usepackage[hyphens]{url}
\usepackage{graphicx}
\urlstyle{rm}
\def\UrlFont{\rm}
\usepackage{natbib}
\usepackage{caption}
\frenchspacing
\setlength{\pdfpagewidth}{8.5in}
\setlength{\pdfpageheight}{11in}

\usepackage{booktabs}
\usepackage{array}
\usepackage{longtable}
\usepackage{amssymb}

\pdfinfo{
/TemplateVersion (2026.1)
}

\setcounter{secnumdepth}{2}

\title{Articulation Skill: A Patient-Navigator Regime for Public-Good Mental-Health AI}

\author{Anonymous Submission}
\affiliations{}

\begin{document}

\maketitle

\begin{abstract}
ABSTRACT_HERE
\end{abstract}

\noindent\textit{Throughout this paper we refer to the reference implementation we built as \textbf{System X}, anonymized for double-blind review. Repository, deployment URL, and author identification are withheld; an anonymous code mirror is provided in supplementary materials. A companion paper (engineering-ethics scaffolding) by the same authors is referenced as [anonymous companion]; no contribution in this paper depends on its empirical claims.}

BODY_HERE

\bibliography{paper}

\end{document}
"""

final_tex = TEMPLATE.replace("ABSTRACT_HERE", abstract_text).replace("BODY_HERE", body_text)
OUT_TEX.write_text(final_tex)
print(f"  paper.tex written ({len(final_tex)} chars)")

# Build bib
build_bib()

print("\nDone. Run ./build.sh to compile.")
