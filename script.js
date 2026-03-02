/* ================================================================
   BIOINFORMATICS KNOWLEDGE ARCHIVE
   Interactive Knowledge Base & Reproducible Workflow Guide
   Created by Bhuwan Sharma | © 2026

   script.js — Concatenate Parts 1–5 into this single file.
   ================================================================ */
;(function () {
'use strict';

/* ================================================================
   §1  STATE
   ================================================================ */
const state = {
    activeNodeId: null,
    expandedNodes: new Set(['root']),
    theme: localStorage.getItem('bioinfo-theme') || 'dark',
    sidebarWidth: parseInt(localStorage.getItem('bioinfo-sidebar') || '360', 10),
    breadcrumb: [{ id: 'root', label: '🏠 Home' }],
    nodeIndex: []                // flat list for search
};

/* ================================================================
   §2  TINY DOM HELPERS
   ================================================================ */
const $ = (s, p) => (p || document).querySelector(s);
const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* exposed to inline onclick */
window.copyCode = function (btn) {
    const txt = btn.closest('.code-block').querySelector('pre').textContent;
    navigator.clipboard.writeText(txt).then(() => {
        btn.classList.add('copied');
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '📋 Copy'; }, 2000);
    });
};

window.toggleError = function (hdr) {
    hdr.nextElementSibling.classList.toggle('open');
    hdr.querySelector('.error-toggle').classList.toggle('open');
};

window.navigateTo = function (id) { activateNode(id); };

/* ================================================================
   §3  HTML BUILDER HELPERS
   ================================================================ */
function codeBlock(lang, code, file) {
    const fl = file ? ` — ${file}` : '';
    return `<div class="code-block">
<div class="code-block-header"><span class="code-block-lang">${lang}${fl}</span>
<button class="code-block-copy" onclick="copyCode(this)">📋 Copy</button></div>
<pre>${escapeHtml(code.trim())}</pre></div>`;
}

function infoBox(type, title, html) {
    return `<div class="info-box ${type}"><div class="info-title">${title}</div>${html}</div>`;
}

function pipelineHTML(steps) {
    return `<div class="pipeline">${steps.map((s, i) =>
        `${i ? '<span class="pipeline-arrow">→</span>' : ''}<div class="pipeline-step">
<div class="step-num">Step ${i + 1}</div><div class="step-name">${s.name}</div>
${s.tool ? `<div class="step-tool">${s.tool}</div>` : ''}</div>`).join('')}</div>`;
}

function tableHTML(hdr, rows) {
    return `<div class="table-wrapper"><table class="comparison-table">
<thead><tr>${hdr.map(h => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>`;
}

function tagsHTML(tags) {
    return `<div class="tags">${tags.map(t =>
        `<span class="tag tag-${t.type}">${t.label}</span>`).join('')}</div>`;
}

function errorBlock(msg, sol) {
    return `<div class="error-item"><div class="error-header" onclick="toggleError(this)">
<span class="error-icon">❌</span><span class="error-text">${escapeHtml(msg)}</span>
<span class="error-toggle">▶</span></div>
<div class="error-solution"><div class="solution-label">✅ Solution</div>${sol}</div></div>`;
}

function formulaHTML(f) { return `<div class="formula">${f}</div>`; }

function interpretBox(html) {
    return `<div class="interpretation"><h4>📊 How to Interpret</h4>${html}</div>`;
}

function sectionCard(html) { return `<div class="content-card">${html}</div>`; }

/* ================================================================
   §4  KNOWLEDGE TREE STRUCTURE  (complete – all nodes)
   ================================================================ */
const TREE_DATA = {
    id: 'root', label: 'Bioinformatics', icon: '🧬',
    children: [
        /* ---- Sequence Analysis ---- */
        { id: 'sequence-analysis', label: 'Sequence Analysis', icon: '🔤', colorClass: 'sequence', children: [
            { id: 'pairwise-alignment', label: 'Pairwise Alignment', icon: '↔️' },
            { id: 'msa', label: 'Multiple Sequence Alignment', icon: '📊' },
            { id: 'blast-search', label: 'BLAST & Sequence Search', icon: '💥' },
            { id: 'sequence-databases', label: 'Sequence Databases', icon: '🗄️' },
            { id: 'file-formats', label: 'File Formats & Data Types', icon: '📄' }
        ]},
        /* ---- Genomics ---- */
        { id: 'genomics', label: 'Genomics', icon: '🧬', colorClass: 'genomics', children: [
            { id: 'ngs-preprocessing', label: 'NGS Data Preprocessing', icon: '⚙️', children: [
                { id: 'quality-control', label: 'Quality Control (FastQC)', icon: '✅' },
                { id: 'read-trimming', label: 'Read Trimming & Filtering', icon: '✂️' },
                { id: 'read-mapping', label: 'Read Mapping / Alignment', icon: '🎯' }
            ]},
            { id: 'genome-assembly', label: 'Genome Assembly', icon: '🔧', children: [
                { id: 'denovo-assembly', label: 'De Novo Assembly', icon: '🆕' },
                { id: 'reference-assembly', label: 'Reference-Guided Assembly', icon: '📌' }
            ]},
            { id: 'gene-prediction', label: 'Gene Prediction & Annotation', icon: '🏷️' },
            { id: 'variant-calling', label: 'Variant Calling', icon: '🔬', children: [
                { id: 'snp-indel', label: 'SNP & Indel Calling', icon: '📍' },
                { id: 'structural-variants', label: 'Structural Variant Detection', icon: '🔀' },
                { id: 'variant-annotation', label: 'Variant Annotation & Effect', icon: '📝' }
            ]},
            { id: 'gwas', label: 'Genome-Wide Association Studies', icon: '📈' }
        ]},
        /* ---- Transcriptomics ---- */
        { id: 'transcriptomics', label: 'Transcriptomics', icon: '📝', colorClass: 'transcriptomics', children: [
            { id: 'rnaseq-pipeline', label: 'RNA-Seq Analysis Pipeline', icon: '🔬', children: [
                { id: 'rnaseq-design', label: 'Experimental Design', icon: '📐' },
                { id: 'rnaseq-qc', label: 'Quality Control', icon: '✅' },
                { id: 'rnaseq-trimming', label: 'Read Trimming (Trimmomatic)', icon: '✂️' },
                { id: 'rnaseq-alignment', label: 'Alignment (HISAT2 / STAR)', icon: '🎯' },
                { id: 'rnaseq-quantification', label: 'Quantification (featureCounts)', icon: '🔢' },
                { id: 'differential-expression', label: 'Differential Expression', icon: '📊', children: [
                    { id: 'deseq2', label: 'DESeq2', icon: '📦' },
                    { id: 'edger', label: 'edgeR', icon: '📦' },
                    { id: 'limma-voom', label: 'limma-voom', icon: '📦' },
                    { id: 'geo2r', label: 'GEO2R', icon: '🌐' },
                    { id: 'degear', label: 'DEGEAR', icon: '🛠️' }
                ]},
                { id: 'functional-analysis', label: 'Functional Enrichment', icon: '🎯', children: [
                    { id: 'go-enrichment', label: 'GO Enrichment (clusterProfiler)', icon: '🏷️' },
                    { id: 'kegg-pathway', label: 'KEGG Pathway Analysis', icon: '🗺️' },
                    { id: 'gsea-analysis', label: 'Gene Set Enrichment (GSEA)', icon: '📈' }
                ]}
            ]},
            { id: 'transcriptome-assembly', label: 'Transcriptome Assembly', icon: '🔧' },
            { id: 'scrna-seq', label: 'Single-cell RNA-seq', icon: '🔬' },
            { id: 'long-read-rna', label: 'Long-read Transcriptomics', icon: '📏' }
        ]},
        /* ---- Phylogenetics ---- */
        { id: 'phylogenetics', label: 'Phylogenetics & Phylogenomics', icon: '🌳', colorClass: 'phylogenetics', children: [
            { id: 'tree-construction', label: 'Tree Construction Methods', icon: '🌲', children: [
                { id: 'distance-methods', label: 'Distance Methods (NJ / UPGMA)', icon: '📏' },
                { id: 'maximum-parsimony', label: 'Maximum Parsimony', icon: '✂️' },
                { id: 'maximum-likelihood', label: 'Maximum Likelihood (RAxML / IQ-TREE)', icon: '📊' },
                { id: 'bayesian-inference', label: 'Bayesian Inference (MrBayes / BEAST)', icon: '🎲' }
            ]},
            { id: 'substitution-models', label: 'Substitution Models', icon: '🔄' },
            { id: 'mega-phylogeny', label: 'Phylogenetics with MEGA', icon: '🖥️' },
            { id: 'ape-phylogeny', label: 'Phylogenetics with R (ape)', icon: '📦' },
            { id: 'molecular-dating', label: 'Molecular Dating', icon: '⏰' },
            { id: 'hgt-detection', label: 'Horizontal Gene Transfer', icon: '↗️' },
            { id: 'phylogenomics-analysis', label: 'Phylogenomics', icon: '🧬' }
        ]},
        /* ---- Metagenomics ---- */
        { id: 'metagenomics', label: 'Metagenomics & Microbial Analysis', icon: '🦠', colorClass: 'metagenomics', children: [
            { id: 'amplicon-analysis', label: '16S / ITS Amplicon Analysis', icon: '🔬', children: [
                { id: 'qiime2-pipeline', label: 'QIIME 2 Pipeline', icon: '🔧' },
                { id: 'mothur-pipeline', label: 'mothur Pipeline', icon: '🔧' }
            ]},
            { id: 'shotgun-metagenomics', label: 'Shotgun Metagenomics', icon: '💣', children: [
                { id: 'taxonomic-profiling', label: 'Taxonomic Profiling (Kraken2 / MetaPhlAn)', icon: '📊' },
                { id: 'functional-profiling', label: 'Functional Profiling (HUMAnN)', icon: '⚙️' }
            ]},
            { id: 'mag-recovery', label: 'Metagenome-Assembled Genomes (MAGs)', icon: '📦' },
            { id: 'diversity-analysis', label: 'Diversity Analysis (α / β)', icon: '🌈' }
        ]},
        /* ---- Structural Bioinformatics ---- */
        { id: 'structural-bioinformatics', label: 'Structural Bioinformatics', icon: '🏗️', colorClass: 'structural', children: [
            { id: 'structure-prediction', label: 'Protein Structure Prediction', icon: '🔮', children: [
                { id: 'alphafold', label: 'AlphaFold 2', icon: '🤖' },
                { id: 'homology-modeling', label: 'Homology Modeling (SWISS-MODEL)', icon: '📐' },
                { id: 'ab-initio', label: 'Ab Initio / Threading', icon: '🆕' }
            ]},
            { id: 'structure-visualization', label: 'Visualization (PyMOL / ChimeraX)', icon: '👁️' },
            { id: 'molecular-docking', label: 'Molecular Docking', icon: '🔗', children: [
                { id: 'autodock-vina', label: 'AutoDock Vina', icon: '🔧' },
                { id: 'haddock', label: 'HADDOCK', icon: '🔧' }
            ]},
            { id: 'molecular-dynamics', label: 'Molecular Dynamics (GROMACS)', icon: '💫' },
            { id: 'structure-validation', label: 'Structure Validation', icon: '✅' }
        ]},
        /* ---- Comparative Genomics ---- */
        { id: 'comparative-genomics', label: 'Comparative Genomics', icon: '🔄', colorClass: 'comparative', children: [
            { id: 'ortholog-detection', label: 'Ortholog & Paralog Detection', icon: '👥' },
            { id: 'synteny-analysis', label: 'Synteny Analysis', icon: '📊' },
            { id: 'whole-genome-alignment', label: 'Whole Genome Alignment', icon: '🔗' },
            { id: 'genome-browsers', label: 'Genome Browsers (IGV / NCBI)', icon: '🖥️' }
        ]},
        /* ---- Functional Genomics ---- */
        { id: 'functional-genomics', label: 'Functional Genomics', icon: '⚡', colorClass: 'functional', children: [
            { id: 'gene-ontology', label: 'Gene Ontology', icon: '🏷️' },
            { id: 'pathway-analysis-main', label: 'Pathway Analysis (KEGG / Reactome)', icon: '🗺️' },
            { id: 'chipseq', label: 'ChIP-seq Analysis', icon: '🧪' },
            { id: 'epigenomics', label: 'Epigenomics & DNA Methylation', icon: '🔬' }
        ]},
        /* ---- Systems Biology ---- */
        { id: 'systems-biology', label: 'Systems Biology', icon: '🕸️', colorClass: 'systems', children: [
            { id: 'network-analysis', label: 'Network Analysis (Cytoscape)', icon: '🕸️' },
            { id: 'metabolic-modeling', label: 'Metabolic Modeling (FBA)', icon: '⚗️' },
            { id: 'multi-omics', label: 'Multi-omics Integration', icon: '🔄' }
        ]}
    ]
};

/* ================================================================
   §5  CONTENT DATABASE  (keyed by node id)
   ================================================================ */
const CONTENT = {};

/* helper: count children recursively */
function countLeaves(node) {
    if (!node.children || !node.children.length) return 1;
    return node.children.reduce((s, c) => s + countLeaves(c), 0);
}

/* ---------- ROOT ---------- */
CONTENT['root'] = () => sectionCard(`
<h2>🧬 Bioinformatics Knowledge Archive</h2>
${infoBox('definition', '📖 What is Bioinformatics?',
`<p>Bioinformatics is an interdisciplinary field combining <strong>biology</strong>, <strong>computer science</strong>,
<strong>mathematics</strong>, and <strong>statistics</strong> to analyze and interpret biological data.
It develops methods and software tools for understanding complex biological processes — from gene regulation
and protein folding to evolutionary history and microbial ecology.</p>
<p>This archive serves as a <strong>comprehensive, reproducible reference</strong> for students, researchers,
and practitioners in the field.</p>`)}

<h3>🎯 What This Archive Provides</h3>
<ul>
<li><strong>Interactive decision trees</strong> — Hierarchical navigation of every sub-field</li>
<li><strong>Step-by-step workflows</strong> — Reproducible pipelines with exact Linux / R / Python commands</li>
<li><strong>Tool documentation</strong> — Installation, parameters, and best practices</li>
<li><strong>Mathematical foundations</strong> — Algorithms, models, and statistical tests explained</li>
<li><strong>Interpretation guides</strong> — How to read outputs and report results</li>
<li><strong>Troubleshooting</strong> — Common errors and their fixes</li>
</ul>

<h3>🗂️ Explore the Major Sub-fields</h3>
<div class="landing-grid">
${[
    ['sequence-analysis','🔤','Sequence Analysis','Pairwise & multiple alignment, BLAST, databases, file formats','sequence'],
    ['genomics','🧬','Genomics','NGS preprocessing, assembly, variant calling, annotation, GWAS','genomics'],
    ['transcriptomics','📝','Transcriptomics','RNA-Seq pipeline, DE analysis (DESeq2/edgeR/limma), GO enrichment','transcriptomics'],
    ['phylogenetics','🌳','Phylogenetics & Phylogenomics','Tree construction, substitution models, MEGA, RAxML, molecular dating, HGT','phylogenetics'],
    ['metagenomics','🦠','Metagenomics & Microbial','16S/ITS amplicon (QIIME 2, mothur), shotgun, MAGs, diversity','metagenomics'],
    ['structural-bioinformatics','🏗️','Structural Bioinformatics','AlphaFold, homology modeling, docking, MD simulations, validation','structural'],
    ['comparative-genomics','🔄','Comparative Genomics','Orthologs, synteny, whole-genome alignment, genome browsers','comparative'],
    ['functional-genomics','⚡','Functional Genomics','Gene Ontology, pathways, ChIP-seq, epigenomics','functional'],
    ['systems-biology','🕸️','Systems Biology','Network analysis, metabolic modeling, multi-omics integration','systems']
].map(([id,icon,title,desc,cls]) => `
<div class="landing-card ${cls}" onclick="navigateTo('${id}')">
    <div class="card-icon">${icon}</div>
    <div class="card-title">${title}</div>
    <div class="card-desc">${desc}</div>
</div>`).join('')}
</div>

${infoBox('tip', '💡 How to use this archive',
`<p>Use the <strong>sidebar tree</strong> on the left to navigate topics hierarchically.
Click any node to view its detailed content, including definitions, tools, step-by-step commands,
and troubleshooting guides. Use <kbd>Ctrl+K</kbd> to search across all topics.</p>`)}
`);

/* =================================================================
   SEQUENCE ANALYSIS — Parent
   ================================================================= */
CONTENT['sequence-analysis'] = () => sectionCard(`
<h2>🔤 Sequence Analysis</h2>
${infoBox('definition', '📖 Definition',
`<p>Sequence analysis is the foundation of bioinformatics. It encompasses all computational methods used to
analyze <strong>DNA</strong>, <strong>RNA</strong>, and <strong>protein sequences</strong> — including alignment,
searching, motif discovery, and database retrieval. Almost every bioinformatics workflow begins with some form
of sequence analysis.</p>`)}

${infoBox('question', '❓ Biological Questions Answered',
`<ul>
<li>How similar are two or more sequences? (Alignment)</li>
<li>What is the function of an unknown gene/protein? (Homology search)</li>
<li>Which regions are conserved across species? (Conservation analysis)</li>
<li>Does a sequence contain known functional motifs or domains? (Motif finding)</li>
<li>What organism does a sequence come from? (Taxonomic classification)</li>
</ul>`)}

<h3>🔑 Key Concepts</h3>
${infoBox('warning', '⚠️ Similarity ≠ Homology',
`<p><strong>Similarity</strong> is a quantitative measure (% identity). <strong>Homology</strong> is a qualitative
statement about shared evolutionary origin — sequences either are or are not homologous. High similarity
<em>suggests</em> homology, but similar sequences can arise by convergence.</p>`)}

<h3>📂 Sub-topics</h3>
<div class="landing-grid">
${[
    ['pairwise-alignment','↔️','Pairwise Alignment','Needleman-Wunsch, Smith-Waterman, scoring matrices, gap penalties'],
    ['msa','📊','Multiple Sequence Alignment','ClustalW, MUSCLE, MAFFT, T-Coffee — aligning 3+ sequences'],
    ['blast-search','💥','BLAST & Sequence Search','blastn/p/x, E-value, makeblastdb, DIAMOND'],
    ['sequence-databases','🗄️','Sequence Databases','NCBI, UniProt, EMBL-EBI, SRA toolkit, data download'],
    ['file-formats','📄','File Formats','FASTA, FASTQ, SAM/BAM, VCF, GFF/GTF, BED and conversions']
].map(([id,i,t,d])=>`<div class="landing-card sequence" onclick="navigateTo('${id}')">
<div class="card-icon">${i}</div><div class="card-title">${t}</div>
<div class="card-desc">${d}</div></div>`).join('')}
</div>
`) ;

/* =================================================================
   PAIRWISE ALIGNMENT
   ================================================================= */
CONTENT['pairwise-alignment'] = () => sectionCard(`
<h2>↔️ Pairwise Sequence Alignment</h2>
${tagsHTML([
    {type:'algo',label:'Needleman-Wunsch'},{type:'algo',label:'Smith-Waterman'},
    {type:'tool',label:'EMBOSS needle'},{type:'tool',label:'EMBOSS water'},
    {type:'tool',label:'BLAST'},{type:'db',label:'BLOSUM62'},{type:'db',label:'PAM250'}
])}

${infoBox('definition','📖 What is Pairwise Alignment?',
`<p>Pairwise alignment compares <strong>two</strong> biological sequences to identify regions of similarity.
There are two flavors:</p>
<ul>
<li><strong>Global alignment</strong> — aligns sequences end-to-end (Needleman-Wunsch, 1970)</li>
<li><strong>Local alignment</strong> — finds the best matching sub-region (Smith-Waterman, 1981)</li>
</ul>
<p>Both use <strong>dynamic programming</strong> to guarantee an optimal alignment given a scoring scheme.</p>`)}

${infoBox('question','❓ When to Use Which?',
`<ul>
<li><strong>Global</strong> — comparing two proteins of similar length that are suspected full-length homologs</li>
<li><strong>Local</strong> — searching for a conserved domain within a larger sequence, or when sequences differ in length</li>
</ul>`)}

<h3>🧮 Mathematical Foundation</h3>
<h4>Needleman-Wunsch (Global) Recurrence</h4>
${formulaHTML('F(i, j) = max { F(i−1, j−1) + s(x<sub>i</sub>, y<sub>j</sub>),&ensp; F(i−1, j) + d,&ensp; F(i, j−1) + d }')}
<p>where <em>s(x<sub>i</sub>, y<sub>j</sub>)</em> is the substitution score and <em>d</em> is the gap penalty (negative).</p>

<h4>Smith-Waterman (Local) Recurrence</h4>
${formulaHTML('H(i, j) = max { 0,&ensp; H(i−1, j−1) + s(x<sub>i</sub>, y<sub>j</sub>),&ensp; H(i−1, j) + d,&ensp; H(i, j−1) + d }')}
<p>The key difference is the <strong>zero</strong> — the score can never go negative, allowing alignments to start and end anywhere.</p>

<h4>Affine Gap Penalty</h4>
${formulaHTML('Gap cost = G<sub>open</sub> + (n − 1) × G<sub>extend</sub>')}
<p>Opening a gap is penalized more heavily than extending an existing gap. Typical values: G<sub>open</sub> = −10, G<sub>extend</sub> = −0.5.</p>

<h3>📊 Scoring Matrices</h3>
${tableHTML(
    ['Matrix','Type','Best For','Description'],
    [
        ['BLOSUM62','Protein','General protein comparison','Derived from conserved blocks; ~62% identity threshold. <strong>Most commonly used.</strong>'],
        ['BLOSUM80','Protein','Closely related proteins','Higher identity threshold — more stringent'],
        ['BLOSUM45','Protein','Divergent proteins','Lower identity threshold — more permissive'],
        ['PAM250','Protein','Distant homologs','Based on accepted point mutations over long evolution'],
        ['PAM120','Protein','Moderate divergence','Intermediate evolutionary distance'],
        ['DNA identity','DNA','Nucleotide comparison','Match = +1, Mismatch = −3 (BLAST default for blastn)']
    ]
)}

<h3>🔧 Step-by-Step: EMBOSS Pairwise Alignment</h3>
<h4>Installation</h4>
${codeBlock('bash',`
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install emboss

# Conda (recommended)
conda install -c bioconda emboss

# Verify
needle -version
water -version
`)}

<h4>Global Alignment (needle)</h4>
${codeBlock('bash',`
# Download two protein sequences from UniProt
wget -O human_insulin.fa "https://rest.uniprot.org/uniprotkb/P01308.fasta"
wget -O mouse_insulin.fa "https://rest.uniprot.org/uniprotkb/P01326.fasta"

# Run global alignment
needle \\
  -asequence human_insulin.fa \\
  -bsequence mouse_insulin.fa \\
  -gapopen 10.0 \\
  -gapextend 0.5 \\
  -outfile insulin_global.txt

# View result
cat insulin_global.txt
`)}

<h4>Local Alignment (water)</h4>
${codeBlock('bash',`
# Run local alignment
water \\
  -asequence human_insulin.fa \\
  -bsequence mouse_insulin.fa \\
  -gapopen 10.0 \\
  -gapextend 0.5 \\
  -outfile insulin_local.txt

cat insulin_local.txt
`)}

${interpretBox(`
<ul>
<li><strong>Identity %</strong> — Fraction of positions with identical residues. >30% for proteins strongly suggests homology.</li>
<li><strong>Similarity %</strong> — Includes conservative substitutions (e.g., I↔L). Always ≥ identity.</li>
<li><strong>Score</strong> — Sum of substitution scores minus gap penalties. Higher = better alignment.</li>
<li><strong>Gaps</strong> — Insertions/deletions. Too many gaps may indicate poor alignment or non-homologous sequences.</li>
<li>For <strong>proteins</strong>: >25% identity over >100 residues → likely homologous ("twilight zone" is 20-35%).</li>
<li>For <strong>DNA</strong>: >70% identity is generally considered significant for coding regions.</li>
</ul>`)}

<h3>⚠️ Common Errors & Troubleshooting</h3>
${errorBlock('Error: Unable to read sequence',
`<p>Ensure your FASTA file starts with <code>&gt;</code> and contains valid sequence characters.</p>
${codeBlock('bash',`# Check file format
head -5 human_insulin.fa
# Should show:
# >sp|P01308|INS_HUMAN Insulin OS=Homo sapiens ...
# MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEA...`)}`)}

${errorBlock('Error: Sequences are too long — runs out of memory',
`<p>Needleman-Wunsch/Smith-Waterman require O(n×m) memory. For very long sequences, use heuristic methods like BLAST instead.</p>
${codeBlock('bash',`# For long sequences, use BLAST instead of exact DP
blastp -query seq1.fa -subject seq2.fa -outfmt 6`)}`)}
`) + sectionCard(`
<h2>↔️ Pairwise Alignment in R</h2>
${codeBlock('r',`
# Using Biostrings package (Bioconductor)
if (!requireNamespace("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
BiocManager::install("Biostrings")

library(Biostrings)

# Define sequences
seq1 <- AAString("PLEASANTLY")
seq2 <- AAString("MEANLY")

# Global alignment (Needleman-Wunsch)
global_aln <- pairwiseAlignment(seq1, seq2, type = "global",
                                 substitutionMatrix = "BLOSUM62",
                                 gapOpening = 10, gapExtension = 0.5)
print(global_aln)
score(global_aln)
pid(global_aln)  # percent identity

# Local alignment (Smith-Waterman)
local_aln <- pairwiseAlignment(seq1, seq2, type = "local",
                                substitutionMatrix = "BLOSUM62",
                                gapOpening = 10, gapExtension = 0.5)
print(local_aln)

# DNA alignment
dna1 <- DNAString("ATCGATCGATCG")
dna2 <- DNAString("ATCAATCAATCG")
dna_aln <- pairwiseAlignment(dna1, dna2, type = "global")
print(dna_aln)
`)}
`);

/* =================================================================
   MULTIPLE SEQUENCE ALIGNMENT
   ================================================================= */
CONTENT['msa'] = () => sectionCard(`
<h2>📊 Multiple Sequence Alignment (MSA)</h2>
${tagsHTML([
    {type:'tool',label:'MAFFT'},{type:'tool',label:'MUSCLE'},{type:'tool',label:'Clustal Omega'},
    {type:'tool',label:'T-Coffee'},{type:'tool',label:'trimAl'},{type:'tool',label:'Jalview'},
    {type:'algo',label:'Progressive'},{type:'algo',label:'Iterative'}
])}

${infoBox('definition','📖 What is MSA?',
`<p>Multiple Sequence Alignment simultaneously aligns <strong>three or more</strong> sequences to reveal conserved
regions, identify functional domains, and prepare data for phylogenetic analysis. It is a prerequisite for many
downstream analyses including phylogenetics, conservation scoring, and protein structure prediction.</p>`)}

${infoBox('question','❓ Biological Questions',
`<ul>
<li>Which residues are conserved across a protein family?</li>
<li>Where are the variable / hypervariable regions? (e.g., antibody CDRs)</li>
<li>What is the evolutionary relationship among sequences? (input to phylogeny)</li>
<li>Can we identify functional motifs or domains?</li>
</ul>`)}

<h3>🧮 Algorithmic Approaches</h3>
${tableHTML(
    ['Approach','Method','Algorithm','Pros','Cons'],
    [
        ['Progressive','ClustalW, Clustal Omega','Build guide tree → align closest pairs first → add sequences','Fast, intuitive','Early errors propagate ("once a gap, always a gap")'],
        ['Iterative','MUSCLE, MAFFT','Refine alignment iteratively using multiple rounds','More accurate than progressive','Slower for very large datasets'],
        ['Consistency-based','T-Coffee, ProbCons','Use pairwise alignments as constraints for MSA','Very accurate for divergent sequences','Slowest; memory-intensive'],
        ['HMM-based','HMMER, HHblits','Profile Hidden Markov Models','Excellent for remote homologs','Requires profile database']
    ]
)}

<h3>🔧 Step-by-Step: Running MSA Tools</h3>

<h4>Install tools</h4>
${codeBlock('bash',`
# Via Conda (recommended — installs all tools)
conda create -n msa_env -c bioconda mafft muscle clustalo t-coffee trimal
conda activate msa_env

# Or individually
sudo apt-get install mafft muscle
`)}

<h4>Prepare input sequences</h4>
${codeBlock('bash',`
# Download homologous cytochrome c sequences from NCBI
# Save as cytochrome_c.fasta with multiple sequences in FASTA format

# Example: fetch from Entrez
# Install: conda install -c bioconda entrez-direct
esearch -db protein -query "cytochrome c [PROT] AND mammals[ORGN]" | \\
  efetch -format fasta | head -500 > cytochrome_c.fasta

# Check how many sequences
grep -c "^>" cytochrome_c.fasta
`)}

<h4>MAFFT (recommended for most cases)</h4>
${codeBlock('bash',`
# Default auto mode (selects best algorithm based on # sequences)
mafft --auto cytochrome_c.fasta > cytochrome_c_aligned.fasta

# For high accuracy with < 200 sequences
mafft --localpair --maxiterate 1000 cytochrome_c.fasta > aligned_linsi.fasta

# For large datasets (> 2000 sequences) — fast mode
mafft --retree 1 cytochrome_c.fasta > aligned_fast.fasta

# Adjusting gap penalties
mafft --op 1.53 --ep 0.123 cytochrome_c.fasta > aligned_custom_gaps.fasta
`)}

<h4>MUSCLE v5</h4>
${codeBlock('bash',`
# MUSCLE v5 (new version — note different syntax from v3)
muscle -align cytochrome_c.fasta -output aligned_muscle.fasta

# MUSCLE v3 (legacy — still widely used)
muscle -in cytochrome_c.fasta -out aligned_muscle3.fasta
`)}

<h4>Clustal Omega</h4>
${codeBlock('bash',`
# Basic usage
clustalo -i cytochrome_c.fasta -o aligned_clustalo.fasta --outfmt=fasta

# With guide tree output
clustalo -i cytochrome_c.fasta -o aligned_clustalo.fasta \\
  --guidetree-out=guide_tree.nwk --force
`)}

<h4>Trim alignment (remove poorly aligned regions)</h4>
${codeBlock('bash',`
# Using trimAl
# Automated trimming
trimal -in aligned_linsi.fasta -out trimmed.fasta -automated1

# Gap threshold: remove columns with > 50% gaps
trimal -in aligned_linsi.fasta -out trimmed_gt.fasta -gt 0.5

# Strict trimming for phylogenetics
trimal -in aligned_linsi.fasta -out trimmed_strict.fasta -strict

# View trimming statistics
trimal -in aligned_linsi.fasta -out /dev/null -htmlout alignment_report.html
`)}

${interpretBox(`
<ul>
<li><strong>Conserved columns</strong> — Positions where most/all sequences share the same residue → likely functionally important</li>
<li><strong>Gap-rich regions</strong> — Insertions/deletions; may represent loops, linkers, or alignment artifacts</li>
<li><strong>Consensus sequence</strong> — Most frequent residue at each position</li>
<li><strong>Visualization</strong> — Use <strong>Jalview</strong> (desktop) or <strong>MView</strong> (web) to color-code by conservation, chemistry, or identity</li>
<li>For phylogenetics: always <strong>trim</strong> the alignment (remove gappy, ambiguous columns) before tree building</li>
</ul>`)}

<h3>⚠️ Common Errors</h3>
${errorBlock('MAFFT: "nthread = X" warning or slow execution',
`<p>MAFFT defaults to single-threaded. Use <code>--thread N</code> for parallelism:</p>
${codeBlock('bash',`mafft --auto --thread 8 sequences.fasta > aligned.fasta`)}`)}

${errorBlock('Alignment looks wrong — large blocks of gaps in otherwise similar sequences',
`<p>Try a different algorithm or adjust gap penalties:</p>
${codeBlock('bash',`# Try L-INS-i (most accurate for < 200 seqs)
mafft --localpair --maxiterate 1000 sequences.fasta > aligned.fasta

# Or try T-Coffee for very divergent sequences
t_coffee sequences.fasta -output fasta_aln`)}`)}

${errorBlock('Input file has mixed DNA and protein sequences',
`<p>Ensure all sequences are the same type. MAFFT will autodetect, but mixing types causes errors.</p>
${codeBlock('bash',`# Check sequence type
head -2 sequences.fasta
# DNA: only A, T, G, C, N
# Protein: contains other letters like M, W, F, Y`)}`)}
`) + sectionCard(`
<h2>📊 MSA in R</h2>
${codeBlock('r',`
# Using the msa package (Bioconductor)
BiocManager::install("msa")
library(msa)
library(Biostrings)

# Read sequences
seqs <- readAAStringSet("cytochrome_c.fasta")

# ClustalW alignment
aln_cw <- msa(seqs, method = "ClustalW")
print(aln_cw, show = "complete")

# MUSCLE alignment
aln_mu <- msa(seqs, method = "Muscle")

# Convert to other formats for downstream use
library(seqinr)
aln_seqinr <- msaConvert(aln_cw, type = "seqinr::alignment")

# Write aligned FASTA
writeXStringSet(unmasked(aln_cw), file = "aligned_R.fasta")

# Visualization
msaPrettyPrint(aln_cw, output = "pdf", file = "alignment.pdf",
               showNames = "left", showLogo = "top",
               askForOverwrite = FALSE)
`)}
`);

/* =================================================================
   BLAST & SEQUENCE SEARCH
   ================================================================= */
CONTENT['blast-search'] = () => sectionCard(`
<h2>💥 BLAST & Sequence Search</h2>
${tagsHTML([
    {type:'tool',label:'BLAST+'},{type:'tool',label:'DIAMOND'},{type:'tool',label:'HMMER'},
    {type:'tool',label:'MMseqs2'},{type:'algo',label:'Seed-and-Extend'},
    {type:'db',label:'nr'},{type:'db',label:'nt'},{type:'db',label:'Swiss-Prot'}
])}

${infoBox('definition','📖 What is BLAST?',
`<p><strong>Basic Local Alignment Search Tool</strong> (Altschul et al., 1990) rapidly finds regions of local
similarity between a query sequence and a database. It uses a <strong>heuristic seed-and-extend</strong>
approach that is much faster than Smith-Waterman while still highly sensitive.</p>`)}

<h3>📋 BLAST Programs</h3>
${tableHTML(
    ['Program','Query','Database','Use Case'],
    [
        ['<code>blastn</code>','Nucleotide','Nucleotide','DNA vs DNA (e.g., identify species from a sequence)'],
        ['<code>blastp</code>','Protein','Protein','Protein vs protein (function prediction)'],
        ['<code>blastx</code>','Nucleotide (translated)','Protein','DNA query → all 6 reading frames searched against protein DB'],
        ['<code>tblastn</code>','Protein','Nucleotide (translated)','Protein query vs translated nucleotide DB'],
        ['<code>tblastx</code>','Nucleotide (translated)','Nucleotide (translated)','Both translated — very slow, rarely used'],
        ['<code>megablast</code>','Nucleotide','Nucleotide','Very similar sequences (>95% identity). Default for web blastn']
    ]
)}

<h3>🧮 Key Statistics</h3>
<h4>E-value (Expect value)</h4>
${formulaHTML('E = K · m · n · e<sup>−λS</sup>')}
<p>where <em>m</em> = query length, <em>n</em> = database size, <em>S</em> = alignment raw score, <em>K</em> and <em>λ</em> are statistical parameters.</p>
${infoBox('tip','💡 Interpreting E-value',
`<ul>
<li><strong>E &lt; 1e-50</strong> — Nearly certain homolog</li>
<li><strong>E &lt; 1e-10</strong> — Very likely homolog</li>
<li><strong>E &lt; 0.01</strong> — Probable homolog (investigate further)</li>
<li><strong>E &gt; 1</strong> — Likely a random match (not significant)</li>
</ul>
<p>E-value depends on database size: the same alignment will have a larger E-value in a larger database.</p>`)}

<h4>Bit Score</h4>
${formulaHTML("S' = (λ · S − ln K) / ln 2")}
<p>Normalized score independent of database size. Higher = better. Comparable across searches.</p>

<h3>🔧 Step-by-Step: Local BLAST</h3>
<h4>Install BLAST+</h4>
${codeBlock('bash',`
# Conda
conda install -c bioconda blast

# Ubuntu/Debian
sudo apt-get install ncbi-blast+

# Verify
blastn -version
# blastn: 2.14.0+
`)}

<h4>Create a local database</h4>
${codeBlock('bash',`
# Download reference genomes or protein sequences
wget https://ftp.ncbi.nlm.nih.gov/refseq/H_sapiens/mRNA_Prot/human.1.protein.faa.gz
gunzip human.1.protein.faa.gz

# Make BLAST database
# -dbtype: nucl (DNA) or prot (protein)
makeblastdb \\
  -in human.1.protein.faa \\
  -dbtype prot \\
  -out human_prot_db \\
  -parse_seqids

# List database files
ls human_prot_db.*
# human_prot_db.phr  human_prot_db.pin  human_prot_db.psq ...
`)}

<h4>Run BLAST search</h4>
${codeBlock('bash',`
# Basic protein BLAST
blastp \\
  -query my_protein.fasta \\
  -db human_prot_db \\
  -out blast_results.txt \\
  -evalue 1e-5 \\
  -num_threads 8

# Tabular output (most useful for parsing)
blastp \\
  -query my_protein.fasta \\
  -db human_prot_db \\
  -out blast_results.tsv \\
  -evalue 1e-5 \\
  -outfmt "6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore" \\
  -num_threads 8 \\
  -max_target_seqs 10

# DNA BLAST
blastn \\
  -query my_gene.fasta \\
  -db nt \\
  -out blastn_results.tsv \\
  -evalue 1e-10 \\
  -outfmt 6 \\
  -num_threads 8

# Translated search (DNA query → protein DB)
blastx \\
  -query my_contig.fasta \\
  -db nr \\
  -out blastx_results.tsv \\
  -evalue 1e-5 \\
  -outfmt 6
`)}

<h4>Output format 6 columns</h4>
${tableHTML(
    ['Column','Field','Description'],
    [
        ['1','qseqid','Query sequence ID'],
        ['2','sseqid','Subject (hit) sequence ID'],
        ['3','pident','Percent identity'],
        ['4','length','Alignment length'],
        ['5','mismatch','Number of mismatches'],
        ['6','gapopen','Number of gap openings'],
        ['7','qstart','Query start position'],
        ['8','qend','Query end position'],
        ['9','sstart','Subject start position'],
        ['10','send','Subject end position'],
        ['11','evalue','E-value'],
        ['12','bitscore','Bit score']
    ]
)}

<h3>⚡ DIAMOND (Faster Alternative)</h3>
${codeBlock('bash',`
# Install
conda install -c bioconda diamond

# Make database (much faster than BLAST)
diamond makedb --in nr.faa --db nr_diamond

# Run search (100-1000x faster than BLAST for large datasets)
diamond blastp \\
  --query my_proteins.fasta \\
  --db nr_diamond \\
  --out diamond_results.tsv \\
  --outfmt 6 \\
  --evalue 1e-5 \\
  --threads 16 \\
  --sensitive      # or --very-sensitive for maximum sensitivity
`)}

${interpretBox(`
<ul>
<li><strong>% Identity &gt; 30%</strong> over &gt; 100 aa → likely homolog (for proteins)</li>
<li><strong>Query coverage</strong> — What fraction of your query aligned? Low coverage may indicate partial matches or domain-level hits</li>
<li><strong>Multiple HSPs</strong> — Multiple high-scoring pairs for one subject may indicate repeated domains</li>
<li>Always check the <strong>alignment</strong> (not just E-value) for the top hits</li>
<li>No hits? Try a more sensitive search: use <code>blastp</code> instead of <code>blastn</code>, or use PSI-BLAST / HMMER</li>
</ul>`)}

<h3>⚠️ Common Errors</h3>
${errorBlock('BLAST database error: "No alias or index file found"',
`<p>The database wasn't built correctly. Rebuild:</p>
${codeBlock('bash',`makeblastdb -in sequences.fasta -dbtype nucl -out mydb
# Check files exist:
ls mydb.*`)}`)}

${errorBlock('No hits found even though homologs exist',
`<ul>
<li>Relax E-value threshold: <code>-evalue 10</code></li>
<li>Use a more sensitive program: <code>blastp</code> instead of <code>blastn</code></li>
<li>Try PSI-BLAST: <code>psiblast -query q.fa -db nr -num_iterations 3</code></li>
<li>Check that query and database are the same type (protein vs nucleotide)</li>
</ul>`)}

${errorBlock('Bus error or segmentation fault with large databases',
`<p>Increase system resources or use DIAMOND for large-scale searches:</p>
${codeBlock('bash',`# Use DIAMOND instead
diamond blastp --db nr --query query.fa --out results.tsv`)}`)}
`);

/* =================================================================
   SEQUENCE DATABASES
   ================================================================= */
CONTENT['sequence-databases'] = () => sectionCard(`
<h2>🗄️ Sequence Databases</h2>
${tagsHTML([
    {type:'db',label:'NCBI GenBank'},{type:'db',label:'RefSeq'},{type:'db',label:'UniProt'},
    {type:'db',label:'EMBL-EBI'},{type:'db',label:'SRA'},{type:'db',label:'GEO'},
    {type:'tool',label:'SRA Toolkit'},{type:'tool',label:'Entrez Direct'},{type:'tool',label:'wget'}
])}

${infoBox('definition','📖 Overview',
`<p>Biological sequence databases are the foundation of bioinformatics research. They store nucleotide sequences,
protein sequences, gene expression data, and associated metadata collected from experiments worldwide.</p>`)}

<h3>📊 Major Databases</h3>
${tableHTML(
    ['Database','Organization','Type','URL','Content'],
    [
        ['GenBank','NCBI','Nucleotide','ncbi.nlm.nih.gov','All publicly available DNA sequences'],
        ['RefSeq','NCBI','Curated reference','ncbi.nlm.nih.gov/refseq','Non-redundant, curated reference genomes and transcripts'],
        ['SRA','NCBI','Raw sequencing','ncbi.nlm.nih.gov/sra','Raw NGS reads (FASTQ) — largest data repo'],
        ['GEO','NCBI','Expression','ncbi.nlm.nih.gov/geo','Microarray and RNA-seq expression datasets'],
        ['UniProt','UniProt Consortium','Protein','uniprot.org','Swiss-Prot (curated) + TrEMBL (automated)'],
        ['ENA','EMBL-EBI','Nucleotide','ebi.ac.uk/ena','European mirror of GenBank/SRA'],
        ['PDB','RCSB','Structure','rcsb.org','3D protein and nucleic acid structures'],
        ['KEGG','Kanehisa Lab','Pathway','genome.jp/kegg','Metabolic and signaling pathways'],
        ['Pfam / InterPro','EMBL-EBI','Domains','interpro.embl-ebi.ac.uk','Protein domain families and functional annotation']
    ]
)}

<h3>🔧 Downloading Data from NCBI</h3>
<h4>Install SRA Toolkit</h4>
${codeBlock('bash',`
# Conda
conda install -c bioconda sra-tools

# Configure (first time only)
vdb-config --interactive
# Set cache directory, accept terms
`)}

<h4>Download raw reads from SRA</h4>
${codeBlock('bash',`
# Download and convert SRA to FASTQ
# Example: E. coli RNA-seq data
fastq-dump --split-3 --gzip SRR1234567

# Better: use fasterq-dump (faster, multi-threaded)
fasterq-dump SRR1234567 --split-3 --threads 8
gzip SRR1234567_1.fastq SRR1234567_2.fastq

# Prefetch first (for large files, more reliable)
prefetch SRR1234567
fasterq-dump SRR1234567 --split-3 --threads 8
`)}

<h4>Entrez Direct (command-line NCBI access)</h4>
${codeBlock('bash',`
# Install
conda install -c bioconda entrez-direct

# Search for sequences
esearch -db nucleotide -query "BRCA1[Gene] AND Homo sapiens[Organism]" | \\
  efetch -format fasta > brca1_human.fasta

# Search protein
esearch -db protein -query "insulin AND Mammalia[Organism]" | \\
  efetch -format fasta > mammal_insulin.fasta

# Get GenBank format
esearch -db nucleotide -query "NC_000001.11" | \\
  efetch -format gb > chr1_human.gb

# Download genome from NCBI FTP
wget https://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/000/005/845/GCF_000005845.2_ASM584v2/GCF_000005845.2_ASM584v2_genomic.fna.gz
`)}

<h4>Download from UniProt</h4>
${codeBlock('bash',`
# Single protein by accession
wget -O p53_human.fasta "https://rest.uniprot.org/uniprotkb/P04637.fasta"

# Batch download with search query (REST API)
wget -O kinases.fasta "https://rest.uniprot.org/uniprotkb/stream?query=(family:kinase)+AND+(organism_id:9606)&format=fasta"
`)}

${infoBox('tip','💡 Tips for Data Download',
`<ul>
<li>Always record the <strong>accession number, database, version, and download date</strong></li>
<li>Use <code>md5sum</code> to verify file integrity after download</li>
<li>Store raw data in a <code>raw/</code> directory and never modify it — work on copies</li>
<li>For reproducibility, include download commands in your analysis scripts</li>
</ul>`)}
`);

/* =================================================================
   FILE FORMATS
   ================================================================= */
CONTENT['file-formats'] = () => sectionCard(`
<h2>📄 File Formats & Data Types</h2>

${infoBox('definition','📖 Overview',
`<p>Understanding bioinformatics file formats is essential for every workflow. Each format encodes specific
biological information and is consumed by specific tools.</p>`)}

<h3>📋 Common Formats Reference</h3>
${tableHTML(
    ['Format','Extension','Content','Used By'],
    [
        ['FASTA','.fasta, .fa, .fna, .faa','Sequences with headers','BLAST, MAFFT, assembly tools'],
        ['FASTQ','.fastq, .fq','Sequences + quality scores','FastQC, Trimmomatic, aligners'],
        ['SAM','.sam','Aligned reads (text)','samtools, Picard, IGV'],
        ['BAM','.bam','Aligned reads (binary, compressed)','samtools, featureCounts, IGV'],
        ['CRAM','.cram','Aligned reads (highly compressed)','samtools (requires reference)'],
        ['VCF','.vcf','Variant calls (SNPs, indels)','GATK, bcftools, SnpEff'],
        ['BED','.bed','Genomic intervals','bedtools, UCSC browser'],
        ['GFF3','.gff3','Gene annotations (v3)','MAKER, GenBank, JBrowse'],
        ['GTF','.gtf','Gene annotations (Ensembl)','featureCounts, HISAT2, StringTie'],
        ['GenBank','.gb, .gbk','Annotated sequences','Biopython, Artemis, SnapGene'],
        ['Newick','.nwk, .tree','Phylogenetic trees','MEGA, FigTree, ape (R)'],
        ['PDB','.pdb','3D protein structures','PyMOL, Chimera, GROMACS'],
        ['SRA','.sra','Raw sequencing archive','SRA Toolkit']
    ]
)}

<h3>📝 Format Details & Examples</h3>

<h4>FASTA</h4>
${codeBlock('text',`
>sp|P04637|P53_HUMAN Cellular tumor antigen p53 OS=Homo sapiens
MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGP
DEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLNGTVNLPGRNSFEV
RVCACPGRDRRTEEENLHKTTGIDSFLHPATELLDTTDSHFRELLEGLKRFED`)}
<p><strong>Rules:</strong> Header line starts with <code>&gt;</code>. Sequence follows on subsequent lines (any line length). No blank lines within a record.</p>

<h4>FASTQ</h4>
${codeBlock('text',`
@SRR1234567.1 1 length=150
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
+
IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII`)}
<p><strong>4 lines per read:</strong> (1) @Header, (2) Sequence, (3) +Separator, (4) Quality scores (Phred+33 ASCII encoding).</p>
${formulaHTML('Q = −10 · log<sub>10</sub>(P<sub>error</sub>)&ensp;&ensp;→&ensp;&ensp;Q30 means P = 0.001 (99.9% accuracy)')}

<h4>SAM/BAM format key fields</h4>
${tableHTML(
    ['Col','Field','Description'],
    [
        ['1','QNAME','Read name'],
        ['2','FLAG','Bitwise flag (mapped, paired, etc.)'],
        ['3','RNAME','Reference chromosome'],
        ['4','POS','1-based mapping position'],
        ['5','MAPQ','Mapping quality (0-60)'],
        ['6','CIGAR','Alignment description (e.g., 75M2I23M)'],
        ['10','SEQ','Read sequence'],
        ['11','QUAL','Base qualities']
    ]
)}

<h3>🔧 Format Conversions</h3>
${codeBlock('bash',`
# SAM → BAM (compress)
samtools view -bS input.sam | samtools sort -o sorted.bam
samtools index sorted.bam

# BAM → SAM (decompress)
samtools view -h sorted.bam > output.sam

# BAM → FASTQ (extract reads)
samtools fastq -1 reads_R1.fq -2 reads_R2.fq sorted.bam

# GFF → GTF
gffread annotations.gff3 -T -o annotations.gtf

# GenBank → FASTA (using any-to-any converter or Biopython)
python3 -c "
from Bio import SeqIO
SeqIO.convert('input.gb', 'genbank', 'output.fasta', 'fasta')
"

# FASTQ → FASTA (remove quality)
sed -n '1~4s/^@/>/p;2~4p' input.fastq > output.fasta

# Compress/decompress
gzip file.fastq          # compress
gunzip file.fastq.gz     # decompress
pigz -p 8 file.fastq     # parallel gzip (faster)
`)}

<h3>🔍 Quick File Inspection</h3>
${codeBlock('bash',`
# Count sequences in FASTA
grep -c "^>" sequences.fasta

# Count reads in FASTQ
echo $(( $(wc -l < reads.fastq) / 4 ))

# Or with seqkit (recommended)
conda install -c bioconda seqkit
seqkit stats reads.fastq

# View BAM header and first few alignments
samtools view -H sorted.bam | head
samtools view sorted.bam | head -5

# View VCF
bcftools view variants.vcf | head -30
bcftools stats variants.vcf > vcf_stats.txt
`)}
`);

/* ================================================================
   §6  RENDERING ENGINE
   ================================================================ */

/* --- build flat index for search --- */
function buildNodeIndex(node, path) {
    path = path || [];
    const currentPath = [...path, node.label];
    state.nodeIndex.push({
        id: node.id,
        label: node.label,
        icon: node.icon || '📄',
        path: currentPath.join(' › '),
        colorClass: node.colorClass || (path.length > 0 ? path[0] : '')
    });
    if (node.children) node.children.forEach(c => buildNodeIndex(c, currentPath));
}

/* --- find a node by id --- */
function findNode(id, node) {
    node = node || TREE_DATA;
    if (node.id === id) return node;
    if (node.children) {
        for (const c of node.children) {
            const found = findNode(id, c);
            if (found) return found;
        }
    }
    return null;
}

/* --- get path to a node --- */
function getPathTo(id, node, path) {
    node = node || TREE_DATA;
    path = path || [];
    if (node.id === id) return [...path, { id: node.id, label: node.label, icon: node.icon }];
    if (node.children) {
        for (const c of node.children) {
            const res = getPathTo(id, c, [...path, { id: node.id, label: node.label, icon: node.icon }]);
            if (res) return res;
        }
    }
    return null;
}

/* --- render sidebar tree --- */
function renderTree() {
    const container = $('#treeContainer');
    container.innerHTML = '';

    function buildNode(node, depth) {
        const div = document.createElement('div');
        div.className = 'tree-node';
        div.dataset.id = node.id;

        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = state.expandedNodes.has(node.id);
        const isActive = state.activeNodeId === node.id;

        const header = document.createElement('div');
        header.className = 'tree-node-header' + (isActive ? ' active' : '');
        header.style.setProperty('--depth', depth);
        if (node.colorClass) header.dataset.color = node.colorClass;

        header.innerHTML = `
            <span class="tree-toggle ${hasChildren ? (isExpanded ? 'expanded' : '') : 'leaf'}">▶</span>
            <span class="node-icon">${node.icon || '📄'}</span>
            <span class="node-label">${node.label}</span>
            ${hasChildren ? `<span class="node-badge">${node.children.length}</span>` : ''}
        `;

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            if (hasChildren) {
                if (state.expandedNodes.has(node.id)) {
                    state.expandedNodes.delete(node.id);
                } else {
                    state.expandedNodes.add(node.id);
                }
            }
            activateNode(node.id);
        });

        div.appendChild(header);

        if (hasChildren) {
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'tree-node-children' + (isExpanded ? ' expanded' : '');
            node.children.forEach(c => childrenDiv.appendChild(buildNode(c, depth + 1)));
            div.appendChild(childrenDiv);
        }
        return div;
    }

    TREE_DATA.children.forEach(c => container.appendChild(buildNode(c, 0)));
}

/* --- activate a node --- */
function activateNode(id) {
    state.activeNodeId = id;

    // expand parents
    const path = getPathTo(id);
    if (path) {
        path.forEach(p => state.expandedNodes.add(p.id));
        state.breadcrumb = path.map(p => ({ id: p.id, label: (p.icon || '') + ' ' + p.label }));
    }

    renderTree();
    renderContent(id);
    updateBreadcrumb();

    // scroll sidebar active into view
    const active = $('.tree-node-header.active', $('#treeContainer'));
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    // scroll content to top
    $('#contentPanel').scrollTop = 0;
}

/* --- render content panel --- */
function renderContent(id) {
    const panel = $('#contentPanel');
    if (CONTENT[id]) {
        panel.innerHTML = CONTENT[id]();
    } else {
        // default fallback: show node info + children cards
        const node = findNode(id);
        if (!node) { panel.innerHTML = '<p>Node not found.</p>'; return; }

        let html = sectionCard(`
            <h2>${node.icon || '📄'} ${node.label}</h2>
            <p style="color:var(--text-muted);">Detailed content for this topic is being developed. Explore the sub-topics below.</p>
            ${node.children ? `
            <div class="landing-grid">
                ${node.children.map(c => `
                <div class="landing-card ${c.colorClass || node.colorClass || ''}" onclick="navigateTo('${c.id}')">
                    <div class="card-icon">${c.icon || '📄'}</div>
                    <div class="card-title">${c.label}</div>
                    ${c.children ? `<div class="card-count">${c.children.length} sub-topics</div>` : ''}
                </div>`).join('')}
            </div>` : ''}
        `);
        panel.innerHTML = html;
    }
}

/* --- breadcrumb --- */
function updateBreadcrumb() {
    const bc = $('#breadcrumb .breadcrumb-inner');
    bc.innerHTML = state.breadcrumb.map((b, i) => {
        if (i === state.breadcrumb.length - 1) {
            return `<span class="breadcrumb-current">${b.label}</span>`;
        }
        return `<span class="breadcrumb-item" onclick="navigateTo('${b.id}')">${b.label}</span>
                <span class="breadcrumb-separator">›</span>`;
    }).join('');
}

/* --- search --- */
function initSearch() {
    const modal = $('#searchModal');
    const modalInput = $('#modalSearchInput');
    const modalResults = $('#modalSearchResults');
    const headerInput = $('#searchInput');

    function openModal() {
        modal.classList.add('open');
        setTimeout(() => modalInput.focus(), 100);
    }
    function closeModal() {
        modal.classList.remove('open');
        modalInput.value = '';
        modalResults.innerHTML = '<div class="search-empty"><p>Start typing to search across all bioinformatics topics, tools, and workflows.</p></div>';
    }

    // open via header search click
    headerInput.addEventListener('focus', (e) => { e.target.blur(); openModal(); });

    // Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openModal(); }
        if (e.key === 'Escape') closeModal();
    });

    // close on overlay click
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // search logic
    modalInput.addEventListener('input', debounce(() => {
        const q = modalInput.value.trim().toLowerCase();
        if (!q) {
            modalResults.innerHTML = '<div class="search-empty"><p>Start typing to search…</p></div>';
            return;
        }
        const results = state.nodeIndex.filter(n =>
            n.label.toLowerCase().includes(q) || n.path.toLowerCase().includes(q)
        ).slice(0, 20);

        if (results.length === 0) {
            modalResults.innerHTML = '<div class="search-empty"><p>No results found for "' + escapeHtml(q) + '".</p></div>';
            return;
        }

        modalResults.innerHTML = results.map(r => `
            <div class="search-result-item" onclick="navigateTo('${r.id}'); document.getElementById('searchModal').classList.remove('open');">
                <span class="result-icon">${r.icon}</span>
                <div class="result-info">
                    <div class="result-title">${r.label}</div>
                    <div class="result-path">${r.path}</div>
                </div>
                <span class="result-arrow">→</span>
            </div>
        `).join('');
    }, 150));
}

/* --- theme --- */
function initTheme() {
    const btn = $('#themeToggle');
    const apply = () => {
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('bioinfo-theme', state.theme);
    };
    apply();
    btn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        apply();
    });
}

/* --- sidebar resize --- */
function initResize() {
    const handle = $('#resizeHandle');
    const sidebar = $('#sidebar');
    let isResizing = false;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        handle.classList.add('active');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        let w = e.clientX;
        w = Math.max(280, Math.min(600, w));
        sidebar.style.width = w + 'px';
        state.sidebarWidth = w;
    });

    document.addEventListener('mouseup', () => {
        if (!isResizing) return;
        isResizing = false;
        handle.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem('bioinfo-sidebar', state.sidebarWidth);
    });

    sidebar.style.width = state.sidebarWidth + 'px';
}

/* --- scroll to top --- */
function initScrollTop() {
    const btn = $('#scrollTop');
    const panel = $('#contentPanel');
    panel.addEventListener('scroll', () => {
        btn.classList.toggle('visible', panel.scrollTop > 400);
    });
    btn.addEventListener('click', () => {
        panel.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- collapse / expand all --- */
function initTreeControls() {
    $('#collapseAll').addEventListener('click', () => {
        state.expandedNodes.clear();
        state.expandedNodes.add('root');
        renderTree();
    });
    $('#expandAll').addEventListener('click', () => {
        (function addAll(node) {
            state.expandedNodes.add(node.id);
            if (node.children) node.children.forEach(addAll);
        })(TREE_DATA);
        renderTree();
    });
}

/* --- loader --- */
function initLoader() {
    setTimeout(() => {
        $('#loader').classList.add('hidden');
    }, 800);
}

/* --- footer stats --- */
function updateStats() {
    let topics = 0, tools = 0, workflows = 0;
    (function count(node) {
        topics++;
        if (node.children) node.children.forEach(count);
    })(TREE_DATA);
    tools = Object.keys(CONTENT).length;
    workflows = Math.floor(tools * 0.6);
    const te = $('#totalTopics'); if (te) te.textContent = topics;
    const to = $('#totalTools'); if (to) to.textContent = tools;
    const tw = $('#totalWorkflows'); if (tw) tw.textContent = workflows;
}

// ============================================================
//  END OF PART 1 — Parts 2-5 continue below.
//  (concatenate all parts into one script.js)
// ============================================================
// ================================================================
// PART 3: EXTENDED KNOWLEDGE DATA — Phylogenetics, Metagenomics,
//         Structural Bioinformatics, Comparative Genomics,
//         Systems Biology, and more sub-nodes
// ================================================================

// ----------------------------------------------------------------
// 3A. PHYLOGENETICS & PHYLOGENOMICS (continued / detailed children)
// ----------------------------------------------------------------

const phylogeneticsChildren = [
    {
        id: "phylo_concepts",
        label: "Core Concepts",
        icon: "📖",
        children: [],
        content: {
            title: "Phylogenetic Core Concepts",
            breadcrumb: ["Bioinformatics", "Phylogenetics & Phylogenomics", "Core Concepts"],
            sections: [
                {
                    type: "definition",
                    title: "What is Phylogenetics?",
                    body: `Phylogenetics is the study of evolutionary relationships among biological entities 
                    — often species, populations, or genes — through molecular sequencing data and morphological 
                    characteristics. A phylogenetic tree (or phylogeny) represents the evolutionary history and 
                    divergence of organisms from common ancestors.`
                },
                {
                    type: "questions",
                    title: "Biological Questions Answered",
                    items: [
                        "How are organisms evolutionarily related?",
                        "When did two species diverge from a common ancestor?",
                        "What is the evolutionary origin of a gene or protein?",
                        "Has horizontal gene transfer occurred between lineages?",
                        "What are the rates of molecular evolution in different lineages?",
                        "Which organisms share the most recent common ancestor?",
                        "How do we classify newly discovered species?"
                    ]
                },
                {
                    type: "html",
                    body: `
                    <h3>🌳 Key Terminology</h3>
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Term</th>
                                    <th>Definition</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>Taxon (Taxa)</strong></td><td>A named group of organisms (e.g., species, genus)</td></tr>
                                <tr><td><strong>Clade</strong></td><td>A group consisting of an ancestor and all its descendants</td></tr>
                                <tr><td><strong>Node</strong></td><td>A point in a tree representing a divergence event (speciation)</td></tr>
                                <tr><td><strong>Branch</strong></td><td>A line connecting nodes; length can represent evolutionary distance or time</td></tr>
                                <tr><td><strong>Root</strong></td><td>The common ancestor of all taxa in the tree</td></tr>
                                <tr><td><strong>Outgroup</strong></td><td>A taxon outside the group of interest, used to root the tree</td></tr>
                                <tr><td><strong>Monophyletic</strong></td><td>A group that includes an ancestor and ALL its descendants</td></tr>
                                <tr><td><strong>Paraphyletic</strong></td><td>A group including an ancestor but NOT all descendants</td></tr>
                                <tr><td><strong>Polyphyletic</strong></td><td>A group whose members don't share a recent common ancestor</td></tr>
                                <tr><td><strong>Bootstrap</strong></td><td>Statistical support for a node (resampling method)</td></tr>
                                <tr><td><strong>Homology</strong></td><td>Similarity due to shared ancestry</td></tr>
                                <tr><td><strong>Orthologs</strong></td><td>Genes in different species from a common ancestor (speciation)</td></tr>
                                <tr><td><strong>Paralogs</strong></td><td>Genes within a species from gene duplication</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <h3>📐 Types of Phylogenetic Trees</h3>
                    <ul>
                        <li><strong>Rooted Tree:</strong> Has a single node (root) representing the common ancestor. Direction of evolution is clear.</li>
                        <li><strong>Unrooted Tree:</strong> Shows relationships but doesn't indicate direction of evolution or common ancestor.</li>
                        <li><strong>Cladogram:</strong> Branch lengths have no meaning; only topology matters.</li>
                        <li><strong>Phylogram:</strong> Branch lengths proportional to amount of evolutionary change.</li>
                        <li><strong>Chronogram / Ultrametric Tree:</strong> Branch lengths proportional to time (all tips equidistant from root).</li>
                    </ul>
                    `
                },
                {
                    type: "math",
                    title: "Substitution Models",
                    body: `
                    <p>Substitution models describe how nucleotides or amino acids change over evolutionary time.</p>
                    <h4>Jukes-Cantor (JC69) Model</h4>
                    <p>Simplest model — assumes equal base frequencies and equal substitution rates:</p>
                    <div class="formula">d = -(3/4) × ln(1 - (4/3) × p)</div>
                    <p>Where <em>d</em> = evolutionary distance, <em>p</em> = proportion of sites that differ.</p>
                    
                    <h4>Kimura 2-Parameter (K2P) Model</h4>
                    <p>Distinguishes between transitions (purine↔purine, pyrimidine↔pyrimidine) and transversions (purine↔pyrimidine):</p>
                    <div class="formula">d = -(1/2) × ln(1 - 2P - Q) - (1/4) × ln(1 - 2Q)</div>
                    <p>Where <em>P</em> = proportion of transitional differences, <em>Q</em> = proportion of transversional differences.</p>
                    
                    <h4>General Time Reversible (GTR) Model</h4>
                    <p>Most general neutral model — allows different rates for all substitution types and unequal base frequencies. Has 6 rate parameters + 3 frequency parameters = 9 free parameters.</p>
                    
                    <h4>Rate Heterogeneity</h4>
                    <p>Real sequences don't evolve uniformly. The <strong>Gamma (Γ) distribution</strong> models among-site rate variation:</p>
                    <div class="formula">GTR + Γ + I (Gamma distribution with Invariant sites)</div>
                    <p>The shape parameter <em>α</em> controls the distribution: small α = high rate variation; large α = nearly uniform rates.</p>
                    `
                }
            ]
        }
    },
    {
        id: "tree_construction",
        label: "Tree Construction Methods",
        icon: "🔨",
        children: [
            {
                id: "distance_methods",
                label: "Distance-Based Methods",
                icon: "📏",
                children: [],
                content: {
                    title: "Distance-Based Phylogenetic Methods",
                    breadcrumb: ["Bioinformatics", "Phylogenetics", "Tree Construction", "Distance-Based Methods"],
                    sections: [
                        {
                            type: "definition",
                            title: "Overview",
                            body: `Distance-based methods compute a pairwise distance matrix from sequence alignments, 
                            then use clustering algorithms to build the tree. They are fast but may lose information 
                            by reducing sequences to single distance values.`
                        },
                        {
                            type: "html",
                            body: `
                            <h3>UPGMA (Unweighted Pair Group Method with Arithmetic Mean)</h3>
                            <ul>
                                <li>Assumes a <strong>molecular clock</strong> (constant rate of evolution)</li>
                                <li>Produces an <strong>ultrametric/rooted</strong> tree</li>
                                <li>Agglomerative hierarchical clustering</li>
                                <li>⚠️ Rarely used for phylogenetics now — clock assumption usually violated</li>
                            </ul>
                            
                            <h3>Neighbor-Joining (NJ)</h3>
                            <ul>
                                <li>Does <strong>NOT</strong> assume a molecular clock</li>
                                <li>Produces an <strong>unrooted</strong> tree</li>
                                <li>Star decomposition — starts with all taxa connected to one node</li>
                                <li>Iteratively joins neighbors that minimize total branch length</li>
                                <li>Time complexity: O(n³)</li>
                                <li>✅ Good for large datasets as initial tree / quick overview</li>
                            </ul>
                            
                            <h3>Minimum Evolution (ME)</h3>
                            <ul>
                                <li>Finds the tree with the smallest sum of branch lengths</li>
                                <li>NJ is a fast approximation of ME</li>
                            </ul>
                            `
                        },
                        {
                            type: "code",
                            language: "r",
                            title: "Neighbor-Joining Tree in R (ape package)",
                            code: `# Install and load packages
if (!require("ape")) install.packages("ape")
if (!require("phangorn")) install.packages("phangorn")
library(ape)
library(phangorn)

# Read aligned sequences (FASTA format)
sequences <- read.FASTA("aligned_sequences.fasta")

# OR read from phyDat format
sequences_phydat <- read.phyDat("aligned_sequences.fasta", format = "fasta")

# Compute distance matrix using Kimura 2-Parameter model
dist_matrix <- dist.dna(sequences, model = "K80")  # K80 = K2P

# Build Neighbor-Joining tree
nj_tree <- nj(dist_matrix)

# Root the tree with an outgroup
rooted_tree <- root(nj_tree, outgroup = "Outgroup_Species", resolve.root = TRUE)

# Bootstrap analysis (1000 replicates)
set.seed(42)
bootstrap_nj <- boot.phylo(
    nj_tree, 
    sequences, 
    FUN = function(x) nj(dist.dna(x, model = "K80")),
    B = 1000,
    quiet = TRUE
)

# Plot tree with bootstrap values
plot(rooted_tree, type = "phylogram", cex = 0.8, main = "NJ Tree (K2P)")
nodelabels(bootstrap_nj, cex = 0.6, bg = "lightyellow", frame = "rect")
add.scale.bar()

# Save tree in Newick format
write.tree(rooted_tree, file = "nj_tree.nwk")

# Save as PDF
pdf("nj_phylogeny.pdf", width = 12, height = 10)
plot(rooted_tree, type = "phylogram", cex = 0.7, edge.width = 2)
nodelabels(bootstrap_nj, cex = 0.5, bg = ifelse(bootstrap_nj > 70, "lightgreen", "lightyellow"))
add.scale.bar()
dev.off()`
                        },
                        {
                            type: "interpretation",
                            title: "How to Interpret",
                            body: `
                            <ul>
                                <li><strong>Branch lengths</strong> represent evolutionary distance (substitutions per site)</li>
                                <li><strong>Bootstrap values ≥ 70%</strong> are generally considered well-supported</li>
                                <li><strong>Bootstrap ≥ 95%</strong> is considered strongly supported</li>
                                <li>Closely grouped taxa on the same clade share more recent common ancestors</li>
                                <li>NJ trees are unrooted — you must specify an outgroup to root them</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                id: "parsimony_methods",
                label: "Maximum Parsimony",
                icon: "✂️",
                children: [],
                content: {
                    title: "Maximum Parsimony",
                    breadcrumb: ["Bioinformatics", "Phylogenetics", "Tree Construction", "Maximum Parsimony"],
                    sections: [
                        {
                            type: "definition",
                            title: "Overview",
                            body: `Maximum Parsimony (MP) finds the tree that requires the fewest evolutionary 
                            changes (substitutions) to explain the observed data. Based on Occam's Razor — 
                            the simplest explanation is preferred.`
                        },
                        {
                            type: "html",
                            body: `
                            <h3>Key Features</h3>
                            <ul>
                                <li>Character-based method (uses actual sequence data, not distances)</li>
                                <li>Counts minimum number of substitutions for each possible tree</li>
                                <li>NP-hard problem — heuristic searches needed for >20 taxa</li>
                                <li>Sensitive to <strong>long-branch attraction</strong> artifact</li>
                                <li>Works well when evolutionary rates are low and uniform</li>
                            </ul>
                            
                            <h3>Informative Sites</h3>
                            <p>Only <strong>parsimony-informative sites</strong> affect tree selection:</p>
                            <ul>
                                <li>Must have at least 2 different character states</li>
                                <li>At least 2 of these states must occur in ≥ 2 taxa</li>
                                <li>Invariant sites and singletons (autapomorphies) don't help choose among trees</li>
                            </ul>
                            `
                        },
                        {
                            type: "warning",
                            title: "Long-Branch Attraction (LBA)",
                            body: `When two lineages evolve rapidly, they may accumulate similar changes by 
                            convergence. Parsimony incorrectly groups them together. Solutions: use ML/Bayesian 
                            methods, remove long-branch taxa, or use amino acid data instead of nucleotides.`
                        },
                        {
                            type: "code",
                            language: "r",
                            title: "Maximum Parsimony in R (phangorn)",
                            code: `library(phangorn)

# Read alignment
alignment <- read.phyDat("aligned_sequences.fasta", format = "fasta")

# Generate starting tree (NJ)
dm <- dist.ml(alignment)
start_tree <- NJ(dm)

# Parsimony score of starting tree
parsimony(start_tree, alignment)

# Optimize tree using parsimony ratchet
# (more thorough search than simple heuristics)
mp_tree <- pratchet(
    alignment,
    start = start_tree,
    minit = 100,      # minimum iterations
    maxit = 1000,      # maximum iterations
    k = 10,            # number of ratchet iterations
    trace = 1
)

# Get parsimony score
parsimony(mp_tree, alignment)

# Bootstrap
set.seed(42)
bs_mp <- bootstrap.phyDat(alignment, pratchet, bs = 100)

# Plot with bootstrap
plotBS(midpoint(mp_tree), bs_mp, type = "phylogram", 
       bs.col = "red", cex = 0.7, p = 50)
add.scale.bar()

# Consensus tree
consensus_tree <- consensus(bs_mp, p = 0.5)  # majority-rule
plot(consensus_tree, main = "50% Majority-Rule Consensus")`
                        }
                    ]
                }
            },
            {
                id: "ml_methods",
                label: "Maximum Likelihood",
                icon: "📊",
                children: [],
                content: {
                    title: "Maximum Likelihood Phylogenetics",
                    breadcrumb: ["Bioinformatics", "Phylogenetics", "Tree Construction", "Maximum Likelihood"],
                    sections: [
                        {
                            type: "definition",
                            title: "Overview",
                            body: `Maximum Likelihood (ML) evaluates the probability of observing the sequence 
                            data given a particular tree topology, branch lengths, and substitution model. 
                            The tree that maximizes this likelihood is selected. It is statistically rigorous 
                            and the most widely used method in modern phylogenetics.`
                        },
                        {
                            type: "math",
                            title: "The Likelihood Function",
                            body: `
                            <p>For a tree T with parameters θ (branch lengths + model parameters):</p>
                            <div class="formula">L(T, θ | D) = P(D | T, θ) = ∏<sub>sites</sub> P(site pattern | T, θ)</div>
                            <p>In practice, we compute the <strong>log-likelihood</strong> (sum instead of product):</p>
                            <div class="formula">ln L = Σ<sub>i=1</sub><sup>n</sup> ln P(x<sub>i</sub> | T, θ)</div>
                            <p>Felsenstein's pruning algorithm computes site likelihoods efficiently in O(n × s × k²) time, 
                            where n = number of taxa, s = number of sites, k = alphabet size.</p>
                            `
                        },
                        {
                            type: "html",
                            body: `
                            <h3>🛠️ Major ML Software</h3>
                            <div class="table-wrapper">
                                <table class="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Tool</th>
                                            <th>Speed</th>
                                            <th>Key Features</th>
                                            <th>Best For</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>RAxML-NG</strong></td>
                                            <td>Very Fast</td>
                                            <td>Parallelized, auto model selection, bootstrap</td>
                                            <td>Large datasets, production runs</td>
                                        </tr>
                                        <tr>
                                            <td><strong>IQ-TREE 2</strong></td>
                                            <td>Fast</td>
                                            <td>ModelFinder, ultrafast bootstrap, concordance factors</td>
                                            <td>Model selection + phylogeny in one</td>
                                        </tr>
                                        <tr>
                                            <td><strong>PhyML</strong></td>
                                            <td>Moderate</td>
                                            <td>NNI/SPR search, aLRT support</td>
                                            <td>Medium datasets</td>
                                        </tr>
                                        <tr>
                                            <td><strong>MEGA</strong></td>
                                            <td>Moderate</td>
                                            <td>GUI-based, educational</td>
                                            <td>Teaching, small datasets</td>
                                        </tr>
                                        <tr>
                                            <td><strong>GARLI</strong></td>
                                            <td>Moderate</td>
                                            <td>Genetic algorithm search</td>
                                            <td>Complex search spaces</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            `
                        },
                        {
                            type: "code",
                            language: "bash",
                            title: "RAxML-NG: Complete ML Phylogeny Workflow",
                            code: `# ============================================
# RAxML-NG Installation & ML Tree Construction
# ============================================

# --- Step 1: Install RAxML-NG ---
# Option A: Conda (recommended)
conda install -c bioconda raxml-ng

# Option B: From GitHub releases
wget https://github.com/amkozlov/raxml-ng/releases/download/1.2.0/raxml-ng_v1.2.0_linux_x86_64.zip
unzip raxml-ng_v1.2.0_linux_x86_64.zip
chmod +x raxml-ng
sudo mv raxml-ng /usr/local/bin/

# --- Step 2: Check alignment ---
raxml-ng --check \\
    --msa aligned_sequences.fasta \\
    --model GTR+G \\
    --prefix check

# --- Step 3: Determine best substitution model ---
# (Alternatively use ModelTest-NG or IQ-TREE ModelFinder)
# For DNA:  JC, K80, HKY, GTR  (+G for gamma, +I for invariant sites)
# For protein: LG, WAG, JTT, DAYHOFF

# --- Step 4: ML tree search (20 starting trees) ---
raxml-ng --search \\
    --msa aligned_sequences.fasta \\
    --model GTR+G4+I \\
    --prefix ml_search \\
    --threads auto{4} \\
    --seed 42 \\
    --tree pars{10},rand{10}

# --- Step 5: Bootstrap analysis (1000 replicates) ---
raxml-ng --bootstrap \\
    --msa aligned_sequences.fasta \\
    --model GTR+G4+I \\
    --prefix ml_bootstrap \\
    --threads auto{4} \\
    --seed 42 \\
    --bs-trees 1000

# --- Step 6: Check bootstrap convergence ---
raxml-ng --bsconverge \\
    --bs-trees ml_bootstrap.raxml.bootstraps \\
    --prefix convergence \\
    --seed 42

# --- Step 7: Map bootstrap support onto best ML tree ---
raxml-ng --support \\
    --tree ml_search.raxml.bestTree \\
    --bs-trees ml_bootstrap.raxml.bootstraps \\
    --prefix final_tree \\
    --threads 2

# --- Step 8: All-in-one command ---
raxml-ng --all \\
    --msa aligned_sequences.fasta \\
    --model GTR+G4+I \\
    --prefix full_analysis \\
    --threads auto{4} \\
    --seed 42 \\
    --tree pars{10},rand{10} \\
    --bs-trees 1000

# Output files:
# full_analysis.raxml.bestTree     - Best ML tree
# full_analysis.raxml.support      - Tree with bootstrap values
# full_analysis.raxml.bootstraps   - All bootstrap trees
# full_analysis.raxml.log          - Log file`
                        },
                        {
                            type: "code",
                            language: "bash",
                            title: "IQ-TREE 2: ML with Automatic Model Selection",
                            code: `# ============================================
# IQ-TREE 2 Installation & Usage
# ============================================

# --- Install ---
conda install -c bioconda iqtree

# --- All-in-one: Model selection + ML tree + Bootstrap ---
iqtree2 -s aligned_sequences.fasta \\
    -m MFP \\               # ModelFinder Plus (auto model selection)
    -B 1000 \\              # Ultrafast bootstrap (UFBoot2)
    -alrt 1000 \\           # SH-aLRT test (1000 replicates)
    -T AUTO \\              # Auto-detect threads
    --prefix iqtree_result \\
    -seed 42

# -m MFP tests hundreds of models and selects the best one (BIC)
# UFBoot2 values >= 95 are well-supported
# SH-aLRT values >= 80 are well-supported

# --- For protein sequences ---
iqtree2 -s protein_alignment.fasta \\
    -st AA \\               # Sequence type: Amino Acid
    -m MFP \\
    -B 1000 \\
    -alrt 1000 \\
    -T AUTO

# --- Partition analysis (different genes evolve differently) ---
iqtree2 -s concatenated_genes.fasta \\
    -p partition_file.nex \\  # NEXUS partition file
    -m MFP+MERGE \\           # Find best partition scheme
    -B 1000 \\
    -T AUTO

# Output files:
# iqtree_result.iqtree    - Full report (model, tree, stats)
# iqtree_result.treefile  - Best ML tree (Newick)
# iqtree_result.contree   - Consensus tree with support values
# iqtree_result.log       - Screen log
# iqtree_result.model.gz  - Model parameters`
                        },
                        {
                            type: "errors",
                            title: "Common Errors & Solutions",
                            items: [
                                {
                                    error: "ERROR: Alignment has undetermined columns",
                                    solution: `Some columns contain only gaps or ambiguous characters. 
                                    Solution: trim alignment with trimAl: \`trimal -in alignment.fasta -out trimmed.fasta -automated1\``
                                },
                                {
                                    error: "ERROR: Duplicate sequence names found",
                                    solution: `Two or more sequences share the same header. Ensure all FASTA headers 
                                    are unique. Use: \`grep ">" alignment.fasta | sort | uniq -d\` to find duplicates.`
                                },
                                {
                                    error: "WARNING: bootstrap support values below 50% on many nodes",
                                    solution: `Possible causes: poor alignment, insufficient phylogenetic signal, 
                                    wrong substitution model, or conflicting signal (e.g., HGT). Try: re-align 
                                    with MAFFT, use ModelFinder, or remove poorly aligned regions with Gblocks/trimAl.`
                                },
                                {
                                    error: "Segmentation fault with large alignment",
                                    solution: `Memory issue. Solutions: use --threads auto{N} to limit threads, 
                                    use --mem flag to set memory limit, or subsample taxa.`
                                }
                            ]
                        },
                        {
                            type: "interpretation",
                            title: "Interpreting ML Trees",
                            body: `
                            <ul>
                                <li><strong>Log-likelihood:</strong> Higher (less negative) = better fit. Compare models using AIC/BIC.</li>
                                <li><strong>UFBoot ≥ 95%:</strong> Strong support (for IQ-TREE ultrafast bootstrap)</li>
                                <li><strong>Standard Bootstrap ≥ 70%:</strong> Generally reliable support</li>
                                <li><strong>SH-aLRT ≥ 80%:</strong> Supported by approximate likelihood ratio test</li>
                                <li><strong>Branch lengths:</strong> Number of expected substitutions per site</li>
                                <li><strong>Long branches:</strong> May indicate fast evolution or long time since divergence — beware of LBA</li>
                                <li>Always report both the model used and support values</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                id: "bayesian_methods",
                label: "Bayesian Inference",
                icon: "🎲",
                children: [],
                content: {
                    title: "Bayesian Phylogenetic Inference",
                    breadcrumb: ["Bioinformatics", "Phylogenetics", "Tree Construction", "Bayesian Inference"],
                    sections: [
                        {
                            type: "definition",
                            title: "Overview",
                            body: `Bayesian inference uses Bayes' theorem to estimate the posterior probability 
                            distribution of phylogenetic trees. It combines the likelihood of the data with 
                            prior probabilities using Markov Chain Monte Carlo (MCMC) sampling. Results 
                            provide posterior probabilities for clades — directly interpretable as probability 
                            that a clade is correct.`
                        },
                        {
                            type: "math",
                            title: "Bayes' Theorem in Phylogenetics",
                            body: `
                            <div class="formula">P(Tree | Data) = P(Data | Tree) × P(Tree) / P(Data)</div>
                            <p>Where:</p>
                            <ul>
                                <li><strong>P(Tree | Data)</strong> = Posterior probability (what we want)</li>
                                <li><strong>P(Data | Tree)</strong> = Likelihood (same as ML)</li>
                                <li><strong>P(Tree)</strong> = Prior probability of tree topology & parameters</li>
                                <li><strong>P(Data)</strong> = Marginal likelihood (normalizing constant, usually intractable)</li>
                            </ul>
                            <p>MCMC sampling explores tree space proportional to posterior probability, avoiding the need to compute P(Data) directly.</p>
                            `
                        },
                        {
                            type: "code",
                            language: "bash",
                            title: "MrBayes: Bayesian Phylogenetic Analysis",
                            code: `# ============================================
# MrBayes Installation & Usage
# ============================================

# --- Install ---
conda install -c bioconda mrbayes

# --- Create NEXUS file with MrBayes block ---
cat > analysis.nex << 'EOF'
#NEXUS
begin data;
    dimensions ntax=20 nchar=500;
    format datatype=dna gap=- missing=?;
    matrix
    [paste your aligned sequences here]
    ;
end;

begin mrbayes;
    [Set substitution model]
    lset nst=6 rates=invgamma;     [GTR+I+G]
    
    [Set priors]
    prset brlenspr=unconstrained:exp(10.0);
    prset shapepr=exp(1.0);
    prset tratiopr=beta(1.0,1.0);
    
    [MCMC settings]
    mcmc ngen=1000000           [1 million generations]
         samplefreq=100         [sample every 100 gens]
         printfreq=1000
         nchains=4              [3 heated + 1 cold chain]
         nruns=2                [2 independent runs]
         temp=0.2               [heating parameter]
         savebrlens=yes;
    
    [Summarize - discard first 25% as burn-in]
    sumt burnin=2500;           [tree summary]
    sump burnin=2500;           [parameter summary]
end;
EOF

# --- Run MrBayes ---
mb analysis.nex

# --- OR run interactively ---
mb
> execute analysis.nex
> lset nst=6 rates=invgamma
> mcmc ngen=1000000 samplefreq=100 nchains=4 nruns=2
> sumt
> sump
> quit

# --- Check convergence ---
# PSRF (Potential Scale Reduction Factor) should be ~ 1.0
# Average standard deviation of split frequencies < 0.01 = good
# ESS (Effective Sample Size) > 200 for all parameters

# Output files:
# analysis.nex.con.tre    - Consensus tree with posterior probabilities
# analysis.nex.trprobs    - Tree probabilities
# analysis.nex.pstat      - Parameter statistics`
                        },
                        {
                            type: "code",
                            language: "bash",
                            title: "BEAST2: Bayesian Evolutionary Analysis",
                            code: `# ============================================
# BEAST2 — for time-calibrated phylogenies
# ============================================

# --- Install ---
# Download from https://www.beast2.org/
# OR
conda install -c bioconda beast2

# --- Workflow ---
# Step 1: Prepare alignment in FASTA/NEXUS

# Step 2: Configure analysis with BEAUti (GUI)
beauti  # Opens GUI to set:
        # - Import alignment
        # - Set substitution model (Site Models tab)
        # - Set clock model (Clock Model tab)
        #   * Strict Clock
        #   * Relaxed Clock (Uncorrelated Lognormal)
        # - Set tree prior (Priors tab)
        #   * Yule (speciation)
        #   * Birth-Death
        #   * Coalescent
        # - Set calibration points (node age constraints)
        # - Set MCMC chain length
        # - Export as .xml file

# Step 3: Run BEAST
beast -threads 4 -seed 42 analysis.xml

# Step 4: Check convergence with Tracer
tracer analysis.log
# Check: ESS > 200 for all parameters
#         Trace plots show stationarity
#         No trends in likelihood traces

# Step 5: Summarize trees with TreeAnnotator
treeannotator \\
    -burnin 10 \\           # 10% burn-in
    -heights median \\       # node heights
    analysis.trees \\        # input trees
    mcc_tree.tre            # output Maximum Clade Credibility tree

# Step 6: Visualize with FigTree
figtree mcc_tree.tre`
                        },
                        {
                            type: "interpretation",
                            title: "Interpreting Bayesian Results",
                            body: `
                            <ul>
                                <li><strong>Posterior Probability (PP) ≥ 0.95:</strong> Strong support for a clade</li>
                                <li><strong>PP ≥ 0.99:</strong> Very strong support</li>
                                <li>PP values tend to be higher than bootstrap values — they are NOT equivalent!</li>
                                <li><strong>ESS > 200:</strong> Sufficient sampling of parameter space</li>
                                <li><strong>PSRF ≈ 1.00:</strong> Independent runs have converged</li>
                                <li><strong>95% HPD interval:</strong> 95% Highest Posterior Density — Bayesian credible interval for parameters like divergence times</li>
                            </ul>`
                        }
                    ]
                }
            }
        ],
        content: {
            title: "Tree Construction Methods",
            breadcrumb: ["Bioinformatics", "Phylogenetics", "Tree Construction"],
            sections: [
                {
                    type: "html",
                    body: `
                    <h3>Overview of Phylogenetic Methods</h3>
                    <p>Phylogenetic tree construction methods fall into four major categories:</p>
                    
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Method</th>
                                    <th>Approach</th>
                                    <th>Speed</th>
                                    <th>Accuracy</th>
                                    <th>Output</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Distance (NJ/UPGMA)</strong></td>
                                    <td>Pairwise distances</td>
                                    <td>⚡ Very Fast</td>
                                    <td>⭐⭐</td>
                                    <td>Single tree</td>
                                </tr>
                                <tr>
                                    <td><strong>Maximum Parsimony</strong></td>
                                    <td>Min. changes</td>
                                    <td>⚡⚡ Moderate</td>
                                    <td>⭐⭐⭐</td>
                                    <td>Single/multiple trees</td>
                                </tr>
                                <tr>
                                    <td><strong>Maximum Likelihood</strong></td>
                                    <td>Statistical model</td>
                                    <td>⚡⚡⚡ Slow</td>
                                    <td>⭐⭐⭐⭐</td>
                                    <td>Single best tree + support</td>
                                </tr>
                                <tr>
                                    <td><strong>Bayesian Inference</strong></td>
                                    <td>Posterior probability</td>
                                    <td>⚡⚡⚡⚡ Slowest</td>
                                    <td>⭐⭐⭐⭐⭐</td>
                                    <td>Distribution of trees</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    `
                }
            ]
        }
    },
    {
        id: "mega_phylogeny",
        label: "MEGA Software",
        icon: "🧮",
        children: [],
        content: {
            title: "Phylogenetic Analysis with MEGA",
            breadcrumb: ["Bioinformatics", "Phylogenetics", "MEGA Software"],
            sections: [
                {
                    type: "definition",
                    title: "What is MEGA?",
                    body: `MEGA (Molecular Evolutionary Genetics Analysis) is an integrated GUI-based software 
                    for sequence alignment, phylogenetic tree construction, molecular dating, and evolutionary 
                    analysis. Widely used in teaching and research. Current version: MEGA 11.`
                },
                {
                    type: "html",
                    body: `
                    <h3>📋 Step-by-Step: Building a Phylogenetic Tree in MEGA</h3>
                    
                    <h4>Step 1: Install MEGA</h4>
                    <ul>
                        <li>Download from <a href="https://www.megasoftware.net/" target="_blank">megasoftware.net</a></li>
                        <li>Available for Windows, macOS, Linux</li>
                        <li>MEGA-CC (command-line version) also available</li>
                    </ul>
                    
                    <h4>Step 2: Obtain Sequences</h4>
                    <ul>
                        <li>Open MEGA → <strong>File → Open a File/Session</strong></li>
                        <li>Or use built-in BLAST: <strong>Alignment → Query GenBank</strong></li>
                        <li>Import FASTA, GenBank, or MEGA format sequences</li>
                    </ul>
                    
                    <h4>Step 3: Align Sequences</h4>
                    <ul>
                        <li>Click <strong>Alignment → Align by ClustalW</strong> or <strong>MUSCLE</strong></li>
                        <li>MUSCLE is generally preferred (faster, often more accurate)</li>
                        <li>Review alignment — manually edit if needed</li>
                        <li>Save alignment: <strong>Data → Save Session</strong></li>
                    </ul>
                    
                    <h4>Step 4: Find Best Model</h4>
                    <ul>
                        <li><strong>Models → Find Best DNA/Protein Model (ML)</strong></li>
                        <li>Uses BIC (Bayesian Information Criterion) to rank models</li>
                        <li>Note the best model (e.g., GTR+G+I, K2+G, etc.)</li>
                    </ul>
                    
                    <h4>Step 5: Build Tree</h4>
                    <ul>
                        <li><strong>Phylogeny → Construct/Test ML Tree</strong></li>
                        <li>Select substitution model from Step 4</li>
                        <li>Set bootstrap replications (1000 recommended)</li>
                        <li>Choose gaps/missing data treatment</li>
                        <li>Click <strong>Compute</strong></li>
                    </ul>
                    
                    <h4>Step 6: Interpret & Export</h4>
                    <ul>
                        <li>View bootstrap values on nodes</li>
                        <li>Root tree: Right-click outgroup → <strong>Root on this Branch</strong></li>
                        <li>Export: <strong>Image → Save as PDF/SVG/PNG</strong></li>
                        <li>Export Newick: <strong>File → Export Current Tree (Newick)</strong></li>
                    </ul>
                    `
                },
                {
                    type: "tip",
                    title: "Pro Tips for MEGA",
                    body: `
                    <ul>
                        <li>Always run model selection before tree building</li>
                        <li>Use MEGA-CC for command-line batch analysis</li>
                        <li>For large datasets (>500 sequences), use RAxML or IQ-TREE instead</li>
                        <li>MEGA saves sessions in .mas format — include this for reproducibility</li>
                        <li>You can also build NJ, MP, and ME trees in MEGA</li>
                    </ul>`
                }
            ]
        }
    },
    {
        id: "molecular_dating",
        label: "Molecular Dating",
        icon: "⏰",
        children: [],
        content: {
            title: "Molecular Dating & Divergence Time Estimation",
            breadcrumb: ["Bioinformatics", "Phylogenetics", "Molecular Dating"],
            sections: [
                {
                    type: "definition",
                    title: "What is Molecular Dating?",
                    body: `Molecular dating estimates the absolute time of divergence between lineages using 
                    molecular sequence data and calibration points from the fossil record or biogeographic 
                    events. It converts phylogenetic branch lengths (substitutions/site) into time units (millions of years).`
                },
                {
                    type: "math",
                    title: "The Molecular Clock Hypothesis",
                    body: `
                    <p>The <strong>strict molecular clock</strong> assumes a constant rate of molecular evolution across all lineages:</p>
                    <div class="formula">d = 2 × r × t</div>
                    <p>Where d = genetic distance, r = substitution rate, t = divergence time.</p>
                    <p>Therefore:</p>
                    <div class="formula">t = d / (2 × r)</div>
                    <p>In practice, rates vary across lineages (<strong>relaxed clock models</strong>):</p>
                    <ul>
                        <li><strong>Uncorrelated Lognormal (UCLN):</strong> Each branch draws rate from lognormal distribution</li>
                        <li><strong>Uncorrelated Exponential:</strong> Each branch draws rate from exponential distribution</li>
                        <li><strong>Local Clock:</strong> Different rates for different clades</li>
                        <li><strong>Autocorrelated:</strong> Descendant rates correlated with ancestor rates</li>
                    </ul>
                    `
                },
                {
                    type: "html",
                    body: `
                    <h3>🛠️ Tools for Molecular Dating</h3>
                    <div class="tags">
                        <span class="tag tag-tool">BEAST2</span>
                        <span class="tag tag-tool">MEGA (RelTime)</span>
                        <span class="tag tag-tool">MCMCTree (PAML)</span>
                        <span class="tag tag-tool">r8s</span>
                        <span class="tag tag-tool">treePL</span>
                        <span class="tag tag-tool">MEGA-CC</span>
                    </div>
                    
                    <h3>MEGA RelTime Method</h3>
                    <p>RelTime is a fast method in MEGA for estimating relative and absolute divergence times:</p>
                    <ol>
                        <li>Build ML tree in MEGA</li>
                        <li><strong>Timetree → Compute Timetree (RelTime-ML)</strong></li>
                        <li>Select calibration constraints (fossil calibrations)</li>
                        <li>Choose clock model</li>
                        <li>View timetree with confidence intervals</li>
                    </ol>
                    `
                },
                {
                    type: "warning",
                    title: "Calibration is Critical",
                    body: `The accuracy of molecular dating depends heavily on calibration points. 
                    Always use multiple calibration points when possible, and specify them as ranges 
                    (uniform or normal distributions), not point estimates. Fossil calibrations typically 
                    provide minimum ages (first appearance of a clade in the fossil record).`
                }
            ]
        }
    },
    {
        id: "hgt_detection",
        label: "Horizontal Gene Transfer",
        icon: "↔️",
        children: [],
        content: {
            title: "Horizontal Gene Transfer (HGT) Detection",
            breadcrumb: ["Bioinformatics", "Phylogenetics", "Horizontal Gene Transfer"],
            sections: [
                {
                    type: "definition",
                    title: "What is HGT?",
                    body: `Horizontal Gene Transfer (HGT), also called Lateral Gene Transfer (LGT), is the 
                    transmission of genetic material between organisms through mechanisms other than vertical 
                    transmission (parent to offspring). Common in prokaryotes via conjugation, transformation, 
                    and transduction. HGT complicates phylogenetic analysis because gene trees may differ from species trees.`
                },
                {
                    type: "questions",
                    title: "Questions Answered",
                    items: [
                        "Has a gene been horizontally transferred between species?",
                        "What is the donor and recipient of the transferred gene?",
                        "How prevalent is HGT in a given genome?",
                        "Does HGT explain antibiotic resistance spread?",
                        "What role does HGT play in microbial evolution?"
                    ]
                },
                {
                    type: "html",
                    body: `
                    <h3>Detection Methods</h3>
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Approach</th>
                                    <th>Method</th>
                                    <th>Tools</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Phylogenetic</strong></td>
                                    <td>Gene tree vs. species tree discordance</td>
                                    <td>HGTPhyloDetect, RANGER-DTL, AnGST</td>
                                </tr>
                                <tr>
                                    <td><strong>Compositional</strong></td>
                                    <td>Unusual GC content, codon usage, k-mer frequency</td>
                                    <td>Alien Hunter, IslandViewer, SIGI-HMM</td>
                                </tr>
                                <tr>
                                    <td><strong>Distribution-based</strong></td>
                                    <td>Patchy phylogenetic distribution</td>
                                    <td>Count, GLOOME</td>
                                </tr>
                                <tr>
                                    <td><strong>Synteny-based</strong></td>
                                    <td>Genomic context / gene order disruption</td>
                                    <td>Mauve, SynChro</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "HGTPhyloDetect Workflow",
                    code: `# ============================================
# HGTPhyloDetect: Detecting HGT via phylogenetic analysis
# ============================================

# --- Install ---
git clone https://github.com/Xingyu-Liao/HGTPhyloDetect.git
cd HGTPhyloDetect
pip install -r requirements.txt

# --- Prepare input ---
# Need: protein sequences of query genome
#        reference database (e.g., NCBI nr or custom)

# --- Run HGTPhyloDetect ---
python HGTPhyloDetect.py \\
    --query query_proteins.fasta \\
    --database reference_db.fasta \\
    --output results/ \\
    --threads 8 \\
    --evalue 1e-10

# --- Alternative: Manual phylogenetic approach ---
# 1. BLAST gene of interest against nr database
blastp -query gene.fasta \\
    -db nr \\
    -out blast_results.txt \\
    -evalue 1e-10 \\
    -outfmt 6 \\
    -max_target_seqs 100

# 2. Retrieve top hits and align
# 3. Build gene tree (RAxML/IQ-TREE)
# 4. Build species tree (concatenated markers or 16S)
# 5. Compare topologies — incongruence suggests HGT

# --- NCBI Genome Workbench ---
# Download: https://www.ncbi.nlm.nih.gov/tools/gbench/
# GUI tool for viewing genomic context, synteny
# Useful for visualizing potential HGT regions`
                        }
                    ]
                }
            }
        ];

// ----------------------------------------------------------------
// 3B. METAGENOMICS & MICROBIAL ANALYSIS
// ----------------------------------------------------------------

const metagenomicsChildren = [
    {
        id: "meta_concepts",
        label: "Core Concepts",
        icon: "📖",
        children: [],
        content: {
            title: "Metagenomics Core Concepts",
            breadcrumb: ["Bioinformatics", "Metagenomics & Microbial Analysis", "Core Concepts"],
            sections: [
                {
                    type: "definition",
                    title: "What is Metagenomics?",
                    body: `Metagenomics is the study of genetic material recovered directly from environmental 
                    samples (soil, water, gut, skin, etc.) without culturing organisms individually. It provides 
                    insights into microbial community composition, diversity, and functional potential.`
                },
                {
                    type: "questions",
                    title: "Biological Questions Answered",
                    items: [
                        "What microorganisms are present in a sample? (Who is there?)",
                        "How diverse is the microbial community?",
                        "What metabolic functions are encoded? (What can they do?)",
                        "How do microbial communities differ between conditions?",
                        "What environmental factors drive community composition?",
                        "Are there novel organisms or genes in the environment?",
                        "How does the microbiome relate to health/disease?"
                    ]
                },
                {
                    type: "html",
                    body: `
                    <h3>Two Main Approaches</h3>
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Amplicon (16S/18S/ITS)</th>
                                    <th>Shotgun Metagenomics</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>Target</strong></td><td>Marker gene only</td><td>All DNA</td></tr>
                                <tr><td><strong>Taxonomy</strong></td><td>Good (genus level)</td><td>Better (species/strain)</td></tr>
                                <tr><td><strong>Function</strong></td><td>Predicted (PICRUSt2)</td><td>Directly measured</td></tr>
                                <tr><td><strong>Cost</strong></td><td>Lower</td><td>Higher</td></tr>
                                <tr><td><strong>Depth</strong></td><td>~10K-100K reads</td><td>~1M-100M reads</td></tr>
                                <tr><td><strong>Databases</strong></td><td>SILVA, Greengenes, UNITE</td><td>NCBI nr, KEGG, UniRef</td></tr>
                                <tr><td><strong>Rare taxa</strong></td><td>Better detection</td><td>May miss rare taxa</td></tr>
                                <tr><td><strong>Novel organisms</strong></td><td>Limited</td><td>Can discover novel genomes</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <h3>Key Diversity Metrics</h3>
                    <h4>Alpha Diversity (within-sample)</h4>
                    <ul>
                        <li><strong>Observed OTUs/ASVs:</strong> Simple richness count</li>
                        <li><strong>Chao1:</strong> Estimated richness (accounts for unseen species)</li>
                        <li><strong>Shannon Index (H'):</strong> Accounts for both richness and evenness</li>
                        <li><strong>Simpson Index (D):</strong> Probability two randomly chosen individuals are different species</li>
                        <li><strong>Faith's PD:</strong> Sum of branch lengths in phylogenetic tree</li>
                    </ul>
                    `
                },
                {
                    type: "math",
                    title: "Diversity Formulas",
                    body: `
                    <h4>Shannon Diversity Index</h4>
                    <div class="formula">H' = -Σ<sub>i=1</sub><sup>S</sup> p<sub>i</sub> × ln(p<sub>i</sub>)</div>
                    <p>Where S = total number of species, p<sub>i</sub> = proportion of species i. Higher H' = more diverse.</p>
                    
                    <h4>Simpson's Diversity Index</h4>
                    <div class="formula">D = 1 - Σ<sub>i=1</sub><sup>S</sup> p<sub>i</sub>²</div>
                    <p>Ranges from 0 to 1. Higher D = more diverse.</p>
                    
                    <h4>Chao1 Estimator</h4>
                    <div class="formula">S<sub>Chao1</sub> = S<sub>obs</sub> + (F₁² / 2F₂)</div>
                    <p>Where F₁ = number of singletons, F₂ = number of doubletons.</p>
                    
                    <h4>Beta Diversity (between-sample)</h4>
                    <p><strong>Bray-Curtis Dissimilarity:</strong></p>
                    <div class="formula">BC<sub>ij</sub> = 1 - (2 × C<sub>ij</sub>) / (S<sub>i</sub> + S<sub>j</sub>)</div>
                    <p>Where C<sub>ij</sub> = sum of lesser abundances shared, S = total abundances per sample.</p>
                    <p><strong>UniFrac:</strong> Incorporates phylogenetic distances between taxa (unique to microbial ecology).</p>
                    `
                }
            ]
        }
    },
    {
        id: "qiime2_analysis",
        label: "QIIME 2 Analysis",
        icon: "🔬",
        children: [],
        content: {
            title: "16S rRNA Analysis with QIIME 2",
            breadcrumb: ["Bioinformatics", "Metagenomics", "QIIME 2 Analysis"],
            sections: [
                {
                    type: "definition",
                    title: "What is QIIME 2?",
                    body: `QIIME 2 (Quantitative Insights Into Microbial Ecology 2) is a powerful, extensible, 
                    and decentralized microbiome analysis package. It provides end-to-end workflows for 
                    amplicon sequencing data (16S, 18S, ITS) from raw reads to publication-quality statistics 
                    and visualizations. Uses a plugin architecture and provenance tracking for reproducibility.`
                },
                {
                    type: "html",
                    body: `
                    <h3>🔄 Complete QIIME 2 Pipeline</h3>
                    <div class="pipeline">
                        <div class="pipeline-step"><span class="step-num">Step 1</span><span class="step-name">Import</span><span class="step-tool">qiime tools import</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 2</span><span class="step-name">QC & Denoise</span><span class="step-tool">DADA2 / Deblur</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 3</span><span class="step-name">Phylogeny</span><span class="step-tool">align-to-tree</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 4</span><span class="step-name">Taxonomy</span><span class="step-tool">classify-sklearn</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 5</span><span class="step-name">Diversity</span><span class="step-tool">core-metrics</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 6</span><span class="step-name">Statistics</span><span class="step-tool">PERMANOVA, ANCOM</span></div>
                    </div>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "Complete QIIME 2 Workflow (16S rRNA)",
                    code: `# ============================================
# QIIME 2 — Complete 16S rRNA Analysis Pipeline
# ============================================

# --- Step 0: Install QIIME 2 ---
wget https://data.qiime2.org/distro/amplicon/qiime2-amplicon-2024.5-py38-linux-conda.yml
conda env create -n qiime2 --file qiime2-amplicon-2024.5-py38-linux-conda.yml
conda activate qiime2

# Verify installation
qiime --version

# --- Step 1: Import Data ---
# For paired-end Casava 1.8 demultiplexed format:
qiime tools import \\
    --type 'SampleData[PairedEndSequencesWithQuality]' \\
    --input-path raw_reads/ \\
    --input-format CasavaOneEightSingleLanePerSampleDirFmt \\
    --output-path demux-paired-end.qza

# Visualize quality scores
qiime demux summarize \\
    --i-data demux-paired-end.qza \\
    --o-visualization demux-summary.qzv

# View visualization (opens browser)
qiime tools view demux-summary.qzv

# --- Step 2: Denoise with DADA2 ---
# Check quality plots to choose trim/trunc parameters
qiime dada2 denoise-paired \\
    --i-demultiplexed-seqs demux-paired-end.qza \\
    --p-trim-left-f 0 \\
    --p-trim-left-r 0 \\
    --p-trunc-len-f 250 \\
    --p-trunc-len-r 200 \\
    --p-n-threads 8 \\
    --o-table feature-table.qza \\
    --o-representative-sequences rep-seqs.qza \\
    --o-denoising-stats dada2-stats.qza

# View denoising stats
qiime metadata tabulate \\
    --m-input-file dada2-stats.qza \\
    --o-visualization dada2-stats.qzv

# Summarize feature table
qiime feature-table summarize \\
    --i-table feature-table.qza \\
    --m-sample-metadata-file sample-metadata.tsv \\
    --o-visualization table-summary.qzv

# --- Step 3: Phylogenetic Tree ---
qiime phylogeny align-to-tree-mafft-fasttree \\
    --i-sequences rep-seqs.qza \\
    --o-alignment aligned-rep-seqs.qza \\
    --o-masked-alignment masked-aligned-rep-seqs.qza \\
    --o-tree unrooted-tree.qza \\
    --o-rooted-tree rooted-tree.qza

# --- Step 4: Taxonomy Classification ---
# Download pre-trained classifier (Silva 138.1 for V4 region)
wget https://data.qiime2.org/2024.5/common/silva-138-99-515-806-nb-classifier.qza

qiime feature-classifier classify-sklearn \\
    --i-classifier silva-138-99-515-806-nb-classifier.qza \\
    --i-reads rep-seqs.qza \\
    --o-classification taxonomy.qza \\
    --p-n-jobs 8

# Visualize taxonomy
qiime metadata tabulate \\
    --m-input-file taxonomy.qza \\
    --o-visualization taxonomy.qzv

# Taxonomy barplot
qiime taxa barplot \\
    --i-table feature-table.qza \\
    --i-taxonomy taxonomy.qza \\
    --m-metadata-file sample-metadata.tsv \\
    --o-visualization taxa-barplot.qzv

# --- Step 5: Diversity Analysis ---
# Determine rarefaction depth from table-summary.qzv
qiime diversity core-metrics-phylogenetic \\
    --i-phylogeny rooted-tree.qza \\
    --i-table feature-table.qza \\
    --p-sampling-depth 10000 \\
    --m-metadata-file sample-metadata.tsv \\
    --output-dir core-metrics-results

# Alpha rarefaction curves
qiime diversity alpha-rarefaction \\
    --i-table feature-table.qza \\
    --i-phylogeny rooted-tree.qza \\
    --p-max-depth 50000 \\
    --m-metadata-file sample-metadata.tsv \\
    --o-visualization alpha-rarefaction.qzv

# --- Step 6: Statistical Tests ---
# Alpha diversity significance (e.g., Shannon)
qiime diversity alpha-group-significance \\
    --i-alpha-diversity core-metrics-results/shannon_vector.qza \\
    --m-metadata-file sample-metadata.tsv \\
    --o-visualization shannon-significance.qzv

# Beta diversity significance (PERMANOVA)
qiime diversity beta-group-significance \\
    --i-distance-matrix core-metrics-results/unweighted_unifrac_distance_matrix.qza \\
    --m-metadata-file sample-metadata.tsv \\
    --m-metadata-column treatment \\
    --p-method permanova \\
    --p-pairwise \\
    --o-visualization permanova-results.qzv

# --- Step 7: Differential Abundance (ANCOM-BC) ---
qiime composition ancombc \\
    --i-table feature-table.qza \\
    --m-metadata-file sample-metadata.tsv \\
    --p-formula treatment \\
    --o-differentials ancombc-results.qza

qiime composition da-barplot \\
    --i-data ancombc-results.qza \\
    --p-significance-threshold 0.05 \\
    --o-visualization ancombc-barplot.qzv

# --- Export results for further analysis ---
qiime tools export \\
    --input-path feature-table.qza \\
    --output-path exported/

biom convert \\
    -i exported/feature-table.biom \\
    -o exported/feature-table.tsv \\
    --to-tsv`
                },
                {
                    type: "errors",
                    title: "Common QIIME 2 Errors",
                    items: [
                        {
                            error: "Plugin error: No features remain after denoising",
                            solution: `Trunc lengths are too aggressive. Check quality plots and increase 
                            trunc-len values. Ensure reads have sufficient overlap for merging (typically 
                            need ≥12 bp overlap for paired-end).`
                        },
                        {
                            error: "ValueError: Metadata does not contain any sample IDs found in the feature table",
                            solution: `Sample IDs in metadata TSV must exactly match sample IDs in the feature 
                            table. Check for trailing whitespace, case sensitivity. Use \`qiime feature-table summarize\` 
                            to see actual sample IDs.`
                        },
                        {
                            error: "The subsampled table contains fewer samples than expected",
                            solution: `Sampling depth is higher than the read count of some samples. Lower the 
                            --p-sampling-depth value or remove low-depth samples from the analysis.`
                        },
                        {
                            error: "Memory error during classify-sklearn",
                            solution: `The classifier is memory-intensive. Solutions: use --p-reads-per-batch 
                            to process fewer reads at once, increase system RAM, or use a smaller classifier 
                            (region-specific instead of full-length).`
                        }
                    ]
                },
                {
                    type: "interpretation",
                    title: "Interpreting QIIME 2 Results",
                    body: `
                    <ul>
                        <li><strong>Alpha diversity:</strong> Higher Shannon/Chao1 = more diverse community</li>
                        <li><strong>Rarefaction curves:</strong> Should plateau — if not, sequencing depth may be insufficient</li>
                        <li><strong>PCoA plots:</strong> Samples clustering together share similar community composition</li>
                        <li><strong>PERMANOVA p < 0.05:</strong> Significant difference between groups in community composition</li>
                        <li><strong>ANCOM-BC:</strong> Reports differentially abundant taxa with W-statistic; higher W = found significant in more comparisons</li>
                        <li><strong>Taxonomy barplots:</strong> Visual overview; use for hypothesis generation, not quantitative comparison</li>
                    </ul>`
                }
            ]
        }
    },
    {
        id: "mothur_analysis",
        label: "mothur Analysis",
        icon: "🦠",
        children: [],
        content: {
            title: "16S rRNA Analysis with mothur",
            breadcrumb: ["Bioinformatics", "Metagenomics", "mothur Analysis"],
            sections: [
                {
                    type: "definition",
                    title: "What is mothur?",
                    body: `mothur is an open-source bioinformatics tool for processing and analyzing 16S rRNA 
                    gene sequences from microbial communities. Developed by Pat Schloss lab. Uses OTU-based 
                    approach (97% similarity clustering) as well as ASVs. Has a comprehensive SOP (Standard 
                    Operating Procedure) that is widely followed.`
                },
                {
                    type: "code",
                    language: "bash",
                    title: "mothur MiSeq SOP (Abbreviated)",
                    code: `# ============================================
# mothur MiSeq Standard Operating Procedure
# Based on: https://mothur.org/wiki/miseq_sop/
# ============================================

# --- Install ---
conda install -c bioconda mothur

# --- Download reference databases ---
# SILVA alignment
wget https://mothur.s3.us-east-2.amazonaws.com/wiki/silva.nr_v138_1.tgz
tar -xzf silva.nr_v138_1.tgz

# RDP training set
wget https://mothur.s3.us-east-2.amazonaws.com/wiki/trainset18_062020.rdp.tgz
tar -xzf trainset18_062020.rdp.tgz

# --- Run mothur interactively ---
mothur

# Step 1: Make contigs from paired-end reads
make.contigs(file=stability.files, processors=8)

# Step 2: Screen sequences (remove ambiguous, too long/short)
screen.seqs(fasta=stability.trim.contigs.fasta, \\
    group=stability.contigs.groups, \\
    maxambig=0, maxlength=275, minlength=200)

# Step 3: Reduce redundancy
unique.seqs(fasta=current)
count.seqs(name=current, group=current)

# Step 4: Align to SILVA reference
align.seqs(fasta=current, reference=silva.nr_v138_1.align, \\
    processors=8)

# Step 5: Screen aligned sequences
screen.seqs(fasta=current, count=current, \\
    start=1968, end=11550)
filter.seqs(fasta=current, vertical=T, trump=.)
unique.seqs(fasta=current, count=current)

# Step 6: Pre-cluster to reduce sequencing errors
pre.cluster(fasta=current, count=current, diffs=2)

# Step 7: Remove chimeras
chimera.vsearch(fasta=current, count=current, \\
    dereplicate=t)
remove.seqs(fasta=current, accnos=current)

# Step 8: Classify sequences
classify.seqs(fasta=current, count=current, \\
    reference=trainset18_062020.rdp.fasta, \\
    taxonomy=trainset18_062020.rdp.tax, \\
    cutoff=80)

# Remove unwanted lineages
remove.lineage(fasta=current, count=current, \\
    taxonomy=current, \\
    taxon=Chloroplast-Mitochondria-unknown-Archaea-Eukaryota)

# Step 9: OTU clustering (97% similarity)
dist.seqs(fasta=current, cutoff=0.03)
cluster(column=current, count=current)

# Step 10: Make shared file and classify OTUs
make.shared(list=current, count=current, label=0.03)
classify.otu(list=current, count=current, \\
    taxonomy=current, label=0.03)

# Step 11: Alpha diversity
rarefaction.single(shared=current, calc=sobs, freq=100)
summary.single(shared=current, \\
    calc=nseqs-coverage-sobs-invsimpson-shannon-chao)

# Step 12: Beta diversity
dist.shared(shared=current, calc=braycurtis-jclass-thetayc)
pcoa(phylip=current)
nmds(phylip=current)
amova(phylip=current, design=mouse.design)  # AMOVA test

# Quit mothur
quit()`
                },
                {
                    type: "html",
                    body: `
                    <h3>mothur vs. QIIME 2 Comparison</h3>
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr><th>Feature</th><th>mothur</th><th>QIIME 2</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>Interface</strong></td><td>Command-line (interactive)</td><td>Command-line (plugin-based)</td></tr>
                                <tr><td><strong>Language</strong></td><td>C++</td><td>Python</td></tr>
                                <tr><td><strong>OTU method</strong></td><td>OptiClust (default)</td><td>DADA2 ASVs (default)</td></tr>
                                <tr><td><strong>Visualization</strong></td><td>R/external</td><td>Built-in (.qzv files)</td></tr>
                                <tr><td><strong>Provenance</strong></td><td>Log files</td><td>Automatic tracking</td></tr>
                                <tr><td><strong>Learning curve</strong></td><td>Moderate</td><td>Steep initially</td></tr>
                            </tbody>
                        </table>
                    </div>
                    `
                }
            ]
        }
    },
    {
        id: "shotgun_meta",
        label: "Shotgun Metagenomics",
        icon: "🔫",
        children: [],
        content: {
            title: "Shotgun Metagenomics Analysis",
            breadcrumb: ["Bioinformatics", "Metagenomics", "Shotgun Metagenomics"],
            sections: [
                {
                    type: "definition",
                    title: "Overview",
                    body: `Shotgun metagenomics sequences all DNA in a sample (not just marker genes), 
                    enabling species-level taxonomy, functional profiling, and genome assembly from 
                    uncultured organisms (Metagenome-Assembled Genomes / MAGs).`
                },
                {
                    type: "html",
                    body: `
                    <h3>🔄 Shotgun Metagenomics Pipeline</h3>
                    <div class="pipeline">
                        <div class="pipeline-step"><span class="step-num">Step 1</span><span class="step-name">QC</span><span class="step-tool">FastQC, Trimmomatic</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 2</span><span class="step-name">Host Removal</span><span class="step-tool">Bowtie2, BMTagger</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 3</span><span class="step-name">Taxonomy</span><span class="step-tool">Kraken2, MetaPhlAn</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 4</span><span class="step-name">Function</span><span class="step-tool">HUMAnN 3</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 5</span><span class="step-name">Assembly</span><span class="step-tool">MEGAHIT, metaSPAdes</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 6</span><span class="step-name">Binning</span><span class="step-tool">MetaBAT2, CONCOCT</span></div>
                    </div>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "Shotgun Metagenomics Pipeline",
                    code: `# ============================================
# Shotgun Metagenomics — Complete Pipeline
# ============================================

# --- Step 1: Quality Control ---
# FastQC
fastqc -t 8 raw_R1.fastq.gz raw_R2.fastq.gz -o fastqc_results/

# Trimmomatic
trimmomatic PE -threads 8 \\
    raw_R1.fastq.gz raw_R2.fastq.gz \\
    trimmed_R1.fastq.gz unpaired_R1.fastq.gz \\
    trimmed_R2.fastq.gz unpaired_R2.fastq.gz \\
    ILLUMINACLIP:adapters.fa:2:30:10 \\
    LEADING:3 TRAILING:3 \\
    SLIDINGWINDOW:4:20 \\
    MINLEN:50

# --- Step 2: Remove Host Reads ---
# Build host genome index (e.g., human)
bowtie2-build GRCh38.fasta host_index

# Map and keep unmapped (microbial) reads
bowtie2 -x host_index \\
    -1 trimmed_R1.fastq.gz \\
    -2 trimmed_R2.fastq.gz \\
    --very-sensitive \\
    --threads 8 \\
    --un-conc-gz microbial_%.fastq.gz \\
    -S /dev/null 2> host_mapping_stats.txt

# --- Step 3: Taxonomic Profiling ---
# Option A: Kraken2 (fast, k-mer based)
kraken2 --db kraken2_db \\
    --paired microbial_1.fastq.gz microbial_2.fastq.gz \\
    --output kraken2_output.txt \\
    --report kraken2_report.txt \\
    --threads 8

# Bracken for abundance estimation
bracken -d kraken2_db \\
    -i kraken2_report.txt \\
    -o bracken_species.txt \\
    -r 150 \\    # read length
    -l S         # species level

# Option B: MetaPhlAn 4 (marker gene based)
metaphlan microbial_1.fastq.gz,microbial_2.fastq.gz \\
    --input_type fastq \\
    --bowtie2out metaphlan_bt2.bz2 \\
    --nproc 8 \\
    -o metaphlan_profile.txt

# --- Step 4: Functional Profiling ---
# HUMAnN 3
humann --input microbial_concat.fastq.gz \\
    --output humann_results/ \\
    --threads 8

# Normalize pathway abundances
humann_renorm_table \\
    --input humann_results/pathabundance.tsv \\
    --output humann_results/pathabundance_cpm.tsv \\
    --units cpm

# --- Step 5: Metagenomic Assembly ---
# MEGAHIT (memory-efficient)
megahit -1 microbial_1.fastq.gz \\
    -2 microbial_2.fastq.gz \\
    -o megahit_assembly/ \\
    -t 8 \\
    --min-contig-len 1000

# Quality assessment
quast megahit_assembly/final.contigs.fa \\
    -o quast_results/ \\
    --min-contig 1000

# --- Step 6: Genome Binning (MAGs) ---
# Map reads to assembly
bowtie2-build megahit_assembly/final.contigs.fa assembly_index
bowtie2 -x assembly_index \\
    -1 microbial_1.fastq.gz \\
    -2 microbial_2.fastq.gz \\
    --threads 8 | samtools sort -@ 4 -o sorted_mapped.bam
samtools index sorted_mapped.bam

# Generate depth file
jgi_summarize_bam_contig_depths \\
    --outputDepth depth.txt sorted_mapped.bam

# MetaBAT2 binning
metabat2 -i megahit_assembly/final.contigs.fa \\
    -a depth.txt \\
    -o bins/bin \\
    -m 1500 \\
    -t 8

# Check bin quality with CheckM
checkm lineage_wf bins/ checkm_results/ -t 8 -x fa
checkm qa checkm_results/lineage.ms checkm_results/ \\
    --file checkm_summary.txt --tab_table

# Good MAGs: Completeness > 50%, Contamination < 10%
# High-quality MAGs: Completeness > 90%, Contamination < 5%`
                }
            ]
        }
    }
];

// ----------------------------------------------------------------
// 3C. STRUCTURAL BIOINFORMATICS
// ----------------------------------------------------------------

const structuralChildren = [
    {
        id: "struct_concepts",
        label: "Core Concepts",
        icon: "📖",
        children: [],
        content: {
            title: "Structural Bioinformatics Core Concepts",
            breadcrumb: ["Bioinformatics", "Structural Bioinformatics", "Core Concepts"],
            sections: [
                {
                    type: "definition",
                    title: "What is Structural Bioinformatics?",
                    body: `Structural bioinformatics deals with the analysis, prediction, and modeling of 
                    three-dimensional structures of biological macromolecules (proteins, nucleic acids) 
                    and their interactions. Understanding 3D structure is key to understanding function, 
                    as structure determines how molecules interact.`
                },
                {
                    type: "questions",
                    title: "Biological Questions Answered",
                    items: [
                        "What is the 3D structure of a protein?",
                        "How does a drug bind to its target protein?",
                        "What conformational changes occur during function?",
                        "Can we predict protein structure from sequence?",
                        "Which residues are in the active site?",
                        "How do mutations affect protein structure and stability?",
                        "What protein-protein interactions occur?"
                    ]
                },
                {
                    type: "html",
                    body: `
                    <h3>Levels of Protein Structure</h3>
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr><th>Level</th><th>Description</th><th>Determined By</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>Primary</strong></td><td>Linear amino acid sequence</td><td>Sequencing, mass spectrometry</td></tr>
                                <tr><td><strong>Secondary</strong></td><td>Local folding (α-helices, β-sheets, loops)</td><td>CD spectroscopy, prediction tools</td></tr>
                                <tr><td><strong>Tertiary</strong></td><td>Complete 3D fold of single polypeptide</td><td>X-ray, NMR, Cryo-EM, AlphaFold</td></tr>
                                <tr><td><strong>Quaternary</strong></td><td>Multi-subunit assembly</td><td>X-ray, Cryo-EM</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <h3>Key Databases</h3>
                    <div class="tags">
                        <span class="tag tag-db">PDB (Protein Data Bank)</span>
                        <span class="tag tag-db">AlphaFold DB</span>
                        <span class="tag tag-db">SWISS-MODEL Repository</span>
                        <span class="tag tag-db">SCOP2</span>
                        <span class="tag tag-db">CATH</span>
                        <span class="tag tag-db">UniProt</span>
                        <span class="tag tag-db">PDBe</span>
                    </div>
                    `
                }
            ]
        }
    },
    {
        id: "structure_prediction",
        label: "Structure Prediction",
        icon: "🔮",
        children: [],
        content: {
            title: "Protein Structure Prediction",
            breadcrumb: ["Bioinformatics", "Structural Bioinformatics", "Structure Prediction"],
            sections: [
                {
                    type: "html",
                    body: `
                    <h3>Prediction Methods</h3>
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr><th>Method</th><th>Approach</th><th>When to Use</th><th>Accuracy</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Homology Modeling</strong></td>
                                    <td>Template-based; uses known structure of homolog</td>
                                    <td>Sequence identity > 30% to a PDB structure</td>
                                    <td>High (>30% identity)</td>
                                </tr>
                                <tr>
                                    <td><strong>Threading (Fold Recognition)</strong></td>
                                    <td>Fits sequence onto known fold library</td>
                                    <td>Distant homology, 15-30% identity</td>
                                    <td>Moderate</td>
                                </tr>
                                <tr>
                                    <td><strong>Ab initio / De novo</strong></td>
                                    <td>Physics-based; samples conformational space</td>
                                    <td>No homologs available</td>
                                    <td>Lower (small proteins)</td>
                                </tr>
                                <tr>
                                    <td><strong>AlphaFold 2</strong></td>
                                    <td>Deep learning; MSA + structure module</td>
                                    <td>Any protein sequence</td>
                                    <td>Very high (often experimental quality)</td>
                                </tr>
                                <tr>
                                    <td><strong>ESMFold</strong></td>
                                    <td>Language model; single sequence (no MSA)</td>
                                    <td>Fast prediction, orphan proteins</td>
                                    <td>High</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <h3>🛠️ Tools</h3>
                    <div class="tags">
                        <span class="tag tag-tool">AlphaFold 2</span>
                        <span class="tag tag-tool">ColabFold</span>
                        <span class="tag tag-tool">SWISS-MODEL</span>
                        <span class="tag tag-tool">I-TASSER</span>
                        <span class="tag tag-tool">Phyre2</span>
                        <span class="tag tag-tool">RoseTTAFold</span>
                        <span class="tag tag-tool">ESMFold</span>
                        <span class="tag tag-tool">MODELLER</span>
                        <span class="tag tag-tool">Robetta</span>
                    </div>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "AlphaFold 2 / ColabFold Local Installation",
                    code: `# ============================================
# ColabFold (LocalColabFold) — Fastest way to run AlphaFold locally
# ============================================

# --- Install LocalColabFold ---
wget https://raw.githubusercontent.com/YoshitakaMo/localcolabfold/main/install_colabbatch_linux.sh
bash install_colabbatch_linux.sh
export PATH="/path/to/localcolabfold/colabfold-conda/bin:$PATH"

# --- Run prediction ---
# Create input FASTA
cat > query.fasta << 'EOF'
>my_protein
MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSH
GSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKL
LSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR
EOF

# Run ColabFold
colabfold_batch query.fasta output_dir/ \\
    --num-recycle 3 \\
    --amber \\              # Relax with AMBER force field
    --num-models 5 \\       # Run all 5 models
    --use-gpu-relax

# --- Using SWISS-MODEL (web-based) ---
# 1. Go to https://swissmodel.expasy.org/
# 2. Paste sequence
# 3. Click "Build Model"
# 4. Select best template
# 5. Download PDB file

# --- Using MODELLER (template-based) ---
conda install -c salilab modeller

# Create alignment file (query aligned to template)
# Run MODELLER Python script
python3 << 'PYEOF'
from modeller import *
from modeller.automodel import *

env = Environ()
a = AutoModel(env,
    alnfile='alignment.ali',
    knowns='template_pdb',
    sequence='target',
    assess_methods=(assess.DOPE, assess.GA341))
a.starting_model = 1
a.ending_model = 5
a.make()
PYEOF`
                },
                {
                    type: "code",
                    language: "bash",
                    title: "Structure Validation & Visualization",
                    code: `# ============================================
# Validate and Visualize Predicted Structures
# ============================================

# --- Validation with MolProbity ---
# Web: http://molprobity.biochem.duke.edu/
# Upload PDB file → Get Ramachandran plot, clashscore, rotamer outliers

# --- PyMOL visualization ---
conda install -c conda-forge pymol-open-source

pymol predicted_structure.pdb << 'PYMOLEOF'
# Color by secondary structure
color red, ss h    # helices
color yellow, ss s # sheets
color green, ss l+ # loops

# Color by B-factor (pLDDT for AlphaFold)
spectrum b, blue_white_red, minimum=0, maximum=100

# Show surface
show surface
set transparency, 0.5

# Save image
ray 2400, 2400
png structure_visualization.png, dpi=300
PYMOLEOF

# --- ChimeraX ---
# Download: https://www.cgl.ucsf.edu/chimerax/
chimerax predicted_structure.pdb

# --- AlphaFold pLDDT interpretation ---
# pLDDT > 90: Very high confidence (blue)
# 70 < pLDDT < 90: Confident (cyan)
# 50 < pLDDT < 70: Low confidence (yellow)
# pLDDT < 50: Very low confidence / disordered (orange)`
                },
                {
                    type: "interpretation",
                    title: "Interpreting Structure Predictions",
                    body: `
                    <ul>
                        <li><strong>AlphaFold pLDDT > 90:</strong> Backbone prediction is very reliable</li>
                        <li><strong>pLDDT 70-90:</strong> Good backbone, but side chains may be less accurate</li>
                        <li><strong>pLDDT < 50:</strong> Likely intrinsically disordered region — don't trust the structure</li>
                        <li><strong>PAE (Predicted Aligned Error):</strong> Low PAE between domains = confident relative positioning</li>
                        <li><strong>GMQE (SWISS-MODEL):</strong> 0-1 scale; > 0.7 is good</li>
                        <li><strong>Ramachandran plot:</strong> > 98% residues in allowed regions = good geometry</li>
                        <li><strong>RMSD:</strong> Root Mean Square Deviation vs. experimental structure; < 2Å is excellent</li>
                    </ul>`
                }
            ]
        }
    },
    {
        id: "molecular_docking",
        label: "Molecular Docking",
        icon: "🔗",
        children: [],
        content: {
            title: "Molecular Docking",
            breadcrumb: ["Bioinformatics", "Structural Bioinformatics", "Molecular Docking"],
            sections: [
                {
                    type: "definition",
                    title: "What is Molecular Docking?",
                    body: `Molecular docking predicts the preferred orientation and binding affinity of a 
                    small molecule (ligand) when bound to a target protein (receptor). It is fundamental 
                    to structure-based drug design and virtual screening.`
                },
                {
                    type: "html",
                    body: `
                    <h3>🔄 Docking Workflow</h3>
                    <div class="pipeline">
                        <div class="pipeline-step"><span class="step-num">Step 1</span><span class="step-name">Protein Prep</span><span class="step-tool">PyMOL, UCSF Chimera</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 2</span><span class="step-name">Ligand Prep</span><span class="step-tool">Open Babel, RDKit</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 3</span><span class="step-name">Grid Setup</span><span class="step-tool">AutoDock Tools</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 4</span><span class="step-name">Docking</span><span class="step-tool">AutoDock Vina</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 5</span><span class="step-name">Analysis</span><span class="step-tool">PyMOL, PLIP</span></div>
                    </div>
                    
                    <h3>🛠️ Docking Software</h3>
                    <div class="tags">
                        <span class="tag tag-tool">AutoDock Vina</span>
                        <span class="tag tag-tool">AutoDock 4</span>
                        <span class="tag tag-tool">GOLD</span>
                        <span class="tag tag-tool">Glide (Schrödinger)</span>
                        <span class="tag tag-tool">HADDOCK</span>
                        <span class="tag tag-tool">SwissDock</span>
                        <span class="tag tag-tool">CB-Dock2</span>
                        <span class="tag tag-tool">DiffDock</span>
                    </div>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "AutoDock Vina: Complete Docking Workflow",
                    code: `# ============================================
# Molecular Docking with AutoDock Vina
# ============================================

# --- Install ---
conda install -c conda-forge autodock-vina
conda install -c conda-forge openbabel
pip install meeko  # For PDBQT preparation

# --- Step 1: Prepare Protein ---
# Download structure from PDB
wget https://files.rcsb.org/download/1HSG.pdb

# Clean protein (remove water, ligands, select chain A)
# Using PyMOL:
pymol 1HSG.pdb << 'PYMOLEOF'
remove solvent
remove resn MK1    # remove co-crystallized ligand
remove chain B     # keep only chain A (if homodimer)
h_add              # add hydrogens
save protein_clean.pdb
quit
PYMOLEOF

# Convert to PDBQT format
# Using ADFR suite (mk_prepare_receptor.py)
prepare_receptor -r protein_clean.pdb \\
    -o protein.pdbqt \\
    -A hydrogens

# --- Step 2: Prepare Ligand ---
# Download ligand from PubChem or draw in Avogadro
# Convert SDF to PDBQT
obabel ligand.sdf -O ligand.pdbqt --gen3d -h

# OR using meeko (modern approach)
mk_prepare_ligand.py -i ligand.sdf -o ligand.pdbqt

# --- Step 3: Define Search Space ---
# Identify binding site coordinates (from co-crystallized ligand or literature)
# Create config file
cat > config.txt << 'EOF'
receptor = protein.pdbqt
ligand = ligand.pdbqt

center_x = 16.0
center_y = 25.0
center_z = 4.0

size_x = 20
size_y = 20
size_z = 20

exhaustiveness = 32
num_modes = 10
energy_range = 3
EOF

# --- Step 4: Run Docking ---
vina --config config.txt --out docking_result.pdbqt --log docking_log.txt

# --- Step 5: Analyze Results ---
# View log file for binding energies
cat docking_log.txt
# mode |   affinity | dist from best mode
#      | (kcal/mol) | rmsd l.b.| rmsd u.b.
#    1       -8.5      0.000      0.000
#    2       -7.9      1.234      2.456

# Visualize in PyMOL
pymol protein.pdbqt docking_result.pdbqt

# Analyze interactions with PLIP (Protein-Ligand Interaction Profiler)
pip install plip
plip -f complex.pdb -o plip_results/ -x  # XML output`
                },
                {
                    type: "interpretation",
                    title: "Interpreting Docking Results",
                    body: `
                    <ul>
                        <li><strong>Binding Affinity (kcal/mol):</strong> More negative = stronger binding. Typically -6 to -12 for drug-like molecules</li>
                        <li><strong>RMSD:</strong> Deviation from best pose. Mode 1 is usually the most relevant</li>
                        <li><strong>Hydrogen bonds:</strong> Key interactions — check distance (< 3.5 Å) and angle</li>
                        <li><strong>Hydrophobic contacts:</strong> Important for binding in hydrophobic pockets</li>
                        <li><strong>Salt bridges:</strong> Charged interactions stabilize binding</li>
                        <li>⚠️ Docking scores are approximate — always validate with MD simulations or experimental assays</li>
                        <li>⚠️ Re-dock the known ligand first to validate your docking protocol (RMSD < 2 Å)</li>
                    </ul>`
                }
            ]
        }
    },
    {
        id: "mol_dynamics",
        label: "Molecular Dynamics",
        icon: "⚛️",
        children: [],
        content: {
            title: "Molecular Dynamics Simulations",
            breadcrumb: ["Bioinformatics", "Structural Bioinformatics", "Molecular Dynamics"],
            sections: [
                {
                    type: "definition",
                    title: "What is Molecular Dynamics?",
                    body: `Molecular Dynamics (MD) simulations compute the physical movements of atoms and 
                    molecules by numerically solving Newton's equations of motion. In bioinformatics, MD 
                    is used to study protein dynamics, conformational changes, ligand binding stability, 
                    and membrane interactions at atomic resolution.`
                },
                {
                    type: "math",
                    title: "The Physics Behind MD",
                    body: `
                    <p>Newton's second law for each atom:</p>
                    <div class="formula">F<sub>i</sub> = m<sub>i</sub> × a<sub>i</sub> = -∇V(r<sub>1</sub>, r<sub>2</sub>, ..., r<sub>N</sub>)</div>
                    <p>The potential energy V is computed from the force field:</p>
                    <div class="formula">V = V<sub>bonds</sub> + V<sub>angles</sub> + V<sub>dihedrals</sub> + V<sub>vdW</sub> + V<sub>electrostatic</sub></div>
                    <p>Common force fields: AMBER, CHARMM, GROMOS, OPLS</p>
                    <p>Time integration: Verlet / Leap-frog algorithm with timestep Δt ≈ 1-2 fs</p>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "GROMACS: Basic MD Simulation",
                    code: `# ============================================
# GROMACS — Protein in Water MD Simulation
# ============================================

# --- Install ---
conda install -c conda-forge gromacs

# --- Step 1: Prepare topology ---
gmx pdb2gmx -f protein_clean.pdb \\
    -o protein_processed.gro \\
    -water spce \\           # SPC/E water model
    -ff amber99sb-ildn       # Force field

# --- Step 2: Define simulation box ---
gmx editconf -f protein_processed.gro \\
    -o protein_box.gro \\
    -c \\                    # Center protein
    -d 1.0 \\               # 1 nm from box edge
    -bt dodecahedron         # Box type

# --- Step 3: Solvate ---
gmx solvate -cp protein_box.gro \\
    -cs spc216.gro \\
    -o protein_solv.gro \\
    -p topol.top

# --- Step 4: Add ions (neutralize charge) ---
gmx grompp -f ions.mdp -c protein_solv.gro -p topol.top -o ions.tpr
echo "SOL" | gmx genion -s ions.tpr \\
    -o protein_ions.gro \\
    -p topol.top \\
    -pname NA -nname CL -neutral

# --- Step 5: Energy Minimization ---
gmx grompp -f minim.mdp -c protein_ions.gro -p topol.top -o em.tpr
gmx mdrun -v -deffnm em

# Check potential energy converged
echo "10" | gmx energy -f em.edr -o em_potential.xvg

# --- Step 6: NVT Equilibration (100 ps) ---
gmx grompp -f nvt.mdp -c em.gro -r em.gro -p topol.top -o nvt.tpr
gmx mdrun -deffnm nvt

# --- Step 7: NPT Equilibration (100 ps) ---
gmx grompp -f npt.mdp -c nvt.gro -r nvt.gro \\
    -t nvt.cpt -p topol.top -o npt.tpr
gmx mdrun -deffnm npt

# --- Step 8: Production MD (100 ns) ---
gmx grompp -f md.mdp -c npt.gro -t npt.cpt \\
    -p topol.top -o md.tpr
gmx mdrun -deffnm md -nb gpu  # Use GPU if available

# --- Step 9: Analysis ---
# RMSD
echo "4 4" | gmx rms -s md.tpr -f md.xtc -o rmsd.xvg -tu ns

# RMSF (per residue flexibility)
echo "4" | gmx rmsf -s md.tpr -f md.xtc -o rmsf.xvg -res

# Radius of gyration (compactness)
echo "1" | gmx gyrate -s md.tpr -f md.xtc -o gyrate.xvg

# Hydrogen bonds
echo "1 1" | gmx hbond -s md.tpr -f md.xtc -num hbonds.xvg

# SASA (Solvent Accessible Surface Area)
echo "1" | gmx sasa -s md.tpr -f md.xtc -o sasa.xvg`
                },
                {
                    type: "interpretation",
                    title: "Interpreting MD Results",
                    body: `
                    <ul>
                        <li><strong>RMSD plateau:</strong> System has equilibrated. Typically 1-3 Å for stable proteins.</li>
                        <li><strong>RMSD > 4 Å:</strong> Major conformational change or unfolding</li>
                        <li><strong>RMSF peaks:</strong> Flexible regions (loops, termini). Low RMSF = rigid regions</li>
                        <li><strong>Rg (Radius of gyration):</strong> Stable Rg = protein maintains fold; decreasing Rg = compaction</li>
                        <li><strong>H-bonds:</strong> Consistent H-bonds between protein-ligand indicate stable binding</li>
                        <li>Always check for equilibration before analyzing production run</li>
                        <li>Run triplicates with different random seeds for statistical validity</li>
                    </ul>`
                }
            ]
        }
    }
];

// ----------------------------------------------------------------
// 3D. COMPARATIVE GENOMICS
// ----------------------------------------------------------------

const comparativeGenomicsChildren = [
    {
        id: "comp_gen_concepts",
        label: "Core Concepts",
        icon: "📖",
        children: [],
        content: {
            title: "Comparative Genomics Core Concepts",
            breadcrumb: ["Bioinformatics", "Comparative Genomics", "Core Concepts"],
            sections: [
                {
                    type: "definition",
                    title: "What is Comparative Genomics?",
                    body: `Comparative genomics is the study of similarities and differences in genome structure, 
                    gene content, gene order, and regulatory elements across different organisms. By comparing 
                    genomes, we can understand evolutionary relationships, identify conserved functional elements, 
                    and discover lineage-specific adaptations.`
                },
                {
                    type: "questions",
                    title: "Biological Questions Answered",
                    items: [
                        "What genes are shared across species (core genome)?",
                        "What genes are unique to a species (accessory genome)?",
                        "How has genome structure changed over evolution?",
                        "What genomic rearrangements have occurred?",
                        "Which non-coding regions are conserved (potentially functional)?",
                        "What are the genetic bases of phenotypic differences?",
                        "How does gene family size vary across species?"
                    ]
                },
                {
                    type: "html",
                    body: `
                    <h3>🛠️ Tools for Comparative Genomics</h3>
                    <div class="tags">
                        <span class="tag tag-tool">OrthoFinder</span>
                        <span class="tag tag-tool">Roary</span>
                        <span class="tag tag-tool">Mauve</span>
                        <span class="tag tag-tool">MUMmer</span>
                        <span class="tag tag-tool">SyMAP</span>
                        <span class="tag tag-tool">Circos</span>
                        <span class="tag tag-tool">NCBI Genome Workbench</span>
                        <span class="tag tag-tool">Ensembl Compara</span>
                        <span class="tag tag-tool">OrthoMCL</span>
                        <span class="tag tag-tool">PGAP</span>
                    </div>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "Core/Pan Genome Analysis with Roary",
                    code: `# ============================================
# Pan-genome Analysis (Prokaryotic)
# ============================================

# --- Install ---
conda install -c bioconda roary

# --- Input: GFF3 files from Prokka annotation ---
# First annotate your genomes
for genome in *.fasta; do
    name=\$(basename "$genome" .fasta)
    prokka --outdir "prokka_\${name}" \\
        --prefix "\${name}" \\
        --cpus 8 \\
        "$genome"
done

# --- Run Roary ---
roary -f roary_results/ \\
    -e -n \\                # Create core gene alignment with MAFFT
    -p 8 \\                 # Threads
    -i 95 \\                # Minimum % identity for blastp
    -cd 99 \\               # Core definition: present in 99% of isolates
    -v \\                   # Verbose
    prokka_*//*.gff

# --- Output files ---
# gene_presence_absence.csv  - Main results matrix
# core_gene_alignment.aln    - Alignment of core genes
# summary_statistics.txt     - Pan-genome stats
# pan_genome_reference.fa    - All unique genes

# --- Visualize with Phandango ---
# Upload gene_presence_absence.csv to https://jameshadfield.github.io/phandango/

# --- Create plots ---
# Using roary_plots.py
python roary_plots.py core_gene_alignment.nwk \\
    gene_presence_absence.csv

# --- OrthoFinder for eukaryotic ortholog detection ---
conda install -c bioconda orthofinder

# Prepare: one FASTA file of protein sequences per species
mkdir proteomes/
cp species1_proteins.fasta proteomes/
cp species2_proteins.fasta proteomes/

orthofinder -f proteomes/ -t 8 -a 4

# Results in: proteomes/OrthoFinder/Results_*/
# Orthogroups.tsv — ortholog groups
# Species_Tree/  — species tree from orthologs
# Comparative_Genomics_Statistics/`
                }
            ]
        }
    },
    {
        id: "synteny_analysis",
        label: "Synteny Analysis",
        icon: "🔀",
        children: [],
        content: {
            title: "Synteny & Genome Rearrangement Analysis",
            breadcrumb: ["Bioinformatics", "Comparative Genomics", "Synteny Analysis"],
            sections: [
                {
                    type: "definition",
                    title: "What is Synteny?",
                    body: `Synteny refers to the conservation of gene order and content between genomic 
                    regions of different species. Synteny analysis reveals chromosomal rearrangements 
                    (inversions, translocations, duplications) that occurred during evolution.`
                },
                {
                    type: "code",
                    language: "bash",
                    title: "Synteny Analysis with MUMmer & Mauve",
                    code: `# ============================================
# Genome Alignment & Synteny
# ============================================

# --- MUMmer 4 ---
conda install -c bioconda mummer4

# Align two genomes
nucmer --prefix alignment \\
    reference_genome.fasta \\
    query_genome.fasta

# Filter alignments
delta-filter -1 -q -r alignment.delta > alignment_filtered.delta

# Generate coordinates
show-coords -rcl alignment_filtered.delta > alignment.coords

# Generate dot plot
mummerplot --fat --png --large \\
    alignment_filtered.delta \\
    -p dotplot

# --- Mauve (GUI) ---
# Download: https://darlinglab.org/mauve/
# Perform progressive alignment
progressiveMauve \\
    --output=mauve_alignment.xmfa \\
    genome1.fasta genome2.fasta genome3.fasta

# Open in Mauve GUI to visualize synteny blocks

# --- Circos plots ---
conda install -c bioconda circos

# Circos creates beautiful circular genome comparisons
# Configure circos.conf with:
#   - Karyotype (chromosome sizes)
#   - Links (syntenic regions)
#   - Histograms (gene density, GC content)
circos -conf circos.conf`
                }
            ]
        }
    }
];

// ----------------------------------------------------------------
// 3E. FUNCTIONAL GENOMICS & ENRICHMENT
// ----------------------------------------------------------------

const functionalGenomicsChildren = [
    {
        id: "go_annotation",
        label: "GO Annotation",
        icon: "🏷️",
        children: [],
        content: {
            title: "Gene Ontology (GO) Annotation",
            breadcrumb: ["Bioinformatics", "Functional Genomics", "GO Annotation"],
            sections: [
                {
                    type: "definition",
                    title: "What is Gene Ontology?",
                    body: `The Gene Ontology (GO) provides a standardized vocabulary to describe gene and 
                    protein functions across all organisms. It consists of three ontologies:
                    1) Biological Process (BP) — what the gene product does in the cell
                    2) Molecular Function (MF) — biochemical activity at molecular level
                    3) Cellular Component (CC) — where in the cell the product acts`
                },
                {
                    type: "html",
                    body: `
                    <h3>GO Structure</h3>
                    <ul>
                        <li>GO is a <strong>Directed Acyclic Graph (DAG)</strong>, not a simple hierarchy</li>
                        <li>A term can have multiple parent terms</li>
                        <li>More specific terms are "children" of more general terms</li>
                        <li>Evidence codes indicate how the annotation was made (IDA, IMP, IEA, etc.)</li>
                    </ul>
                    
                    <h3>Databases & Tools</h3>
                    <div class="tags">
                        <span class="tag tag-db">Gene Ontology (geneontology.org)</span>
                        <span class="tag tag-db">AmiGO 2</span>
                        <span class="tag tag-db">QuickGO</span>
                        <span class="tag tag-tool">Blast2GO</span>
                        <span class="tag tag-tool">InterProScan</span>
                        <span class="tag tag-tool">eggNOG-mapper</span>
                    </div>
                    `
                }
            ]
        }
    },
    {
        id: "enrichment_analysis",
        label: "Enrichment Analysis",
        icon: "📊",
        children: [],
        content: {
            title: "GO & Pathway Enrichment Analysis",
            breadcrumb: ["Bioinformatics", "Functional Genomics", "Enrichment Analysis"],
            sections: [
                {
                    type: "definition",
                    title: "What is Enrichment Analysis?",
                    body: `Enrichment analysis (also called over-representation analysis or ORA) determines 
                    whether a predefined set of genes (e.g., GO terms, KEGG pathways) is statistically 
                    over-represented in a list of differentially expressed genes compared to what would 
                    be expected by chance.`
                },
                {
                    type: "math",
                    title: "Statistical Foundation",
                    body: `
                    <h4>Hypergeometric Test (Fisher's Exact Test)</h4>
                    <div class="formula">P(X ≥ k) = Σ<sub>i=k</sub><sup>min(K,n)</sup> C(K,i) × C(N-K, n-i) / C(N,n)</div>
                    <p>Where:</p>
                    <ul>
                        <li>N = total genes in genome</li>
                        <li>K = genes annotated to the GO term</li>
                        <li>n = genes in your DE list</li>
                        <li>k = DE genes annotated to the GO term</li>
                    </ul>
                    
                    <h4>Multiple Testing Correction</h4>
                    <p>Testing thousands of GO terms requires correction:</p>
                    <ul>
                        <li><strong>Bonferroni:</strong> Most conservative. p<sub>adj</sub> = p × m (m = number of tests)</li>
                        <li><strong>Benjamini-Hochberg (FDR):</strong> Controls false discovery rate. Most commonly used.</li>
                    </ul>
                    
                    <h4>Gene Set Enrichment Analysis (GSEA)</h4>
                    <p>Unlike ORA, GSEA uses ALL genes ranked by a metric (e.g., log2FC) — no arbitrary cutoff needed:</p>
                    <div class="formula">ES = max<sub>j</sub> |Σ<sub>i=1</sub><sup>j</sup> (weighted hit/miss)|</div>
                    `
                },
                {
                    type: "code",
                    language: "r",
                    title: "clusterProfiler: Complete Enrichment Analysis",
                    code: `# ============================================
# GO & KEGG Enrichment with clusterProfiler
# ============================================

# --- Install ---
if (!require("BiocManager")) install.packages("BiocManager")
BiocManager::install(c(
    "clusterProfiler", "enrichplot", "org.Hs.eg.db",
    "DOSE", "pathview", "AnnotationDbi"
))

library(clusterProfiler)
library(enrichplot)
library(org.Hs.eg.db)
library(DOSE)
library(pathview)
library(ggplot2)

# --- Prepare gene list ---
# Assume you have DESeq2/limma results
de_results <- read.csv("deseq2_results.csv")

# Get significant DEGs
sig_genes <- de_results[de_results$padj < 0.05 & 
                        abs(de_results$log2FoldChange) > 1, ]

# Convert gene symbols to Entrez IDs
gene_ids <- bitr(sig_genes$gene, 
                 fromType = "SYMBOL",
                 toType = "ENTREZID",
                 OrgDb = org.Hs.eg.db)

# =============================================
# 1. GO Over-Representation Analysis (ORA)
# =============================================
ego_bp <- enrichGO(
    gene = gene_ids$ENTREZID,
    OrgDb = org.Hs.eg.db,
    ont = "BP",           # BP, MF, CC, or "ALL"
    pAdjustMethod = "BH",
    pvalueCutoff = 0.05,
    qvalueCutoff = 0.2,
    readable = TRUE       # Convert IDs to gene symbols
)

# Visualizations
dotplot(ego_bp, showCategory = 20, title = "GO Biological Process")
ggsave("GO_BP_dotplot.pdf", width = 10, height = 8)

barplot(ego_bp, showCategory = 15)
ggsave("GO_BP_barplot.pdf", width = 10, height = 7)

# Network plot (shows gene overlap between terms)
cnetplot(ego_bp, categorySize = "pvalue", 
         showCategory = 5, node_label = "gene")
ggsave("GO_BP_network.pdf", width = 12, height = 10)

# Enrichment map
ego_bp_sim <- pairwise_termsim(ego_bp)
emapplot(ego_bp_sim, showCategory = 30)
ggsave("GO_BP_emap.pdf", width = 12, height = 10)

# Tree plot (hierarchical clustering of GO terms)
treeplot(ego_bp_sim)
ggsave("GO_BP_tree.pdf", width = 14, height = 10)

# =============================================
# 2. KEGG Pathway Enrichment
# =============================================
ekegg <- enrichKEGG(
    gene = gene_ids$ENTREZID,
    organism = "hsa",      # Human
    pAdjustMethod = "BH",
    pvalueCutoff = 0.05
)

dotplot(ekegg, showCategory = 15, title = "KEGG Pathways")
ggsave("KEGG_dotplot.pdf", width = 10, height = 8)

# Pathway visualization with pathview
pathview(
    gene.data = setNames(sig_genes$log2FoldChange, gene_ids$ENTREZID),
    pathway.id = "hsa04110",  # Cell cycle pathway
    species = "hsa",
    out.suffix = "DE_genes"
)

# =============================================
# 3. Gene Set Enrichment Analysis (GSEA)
# =============================================
# Prepare ranked gene list (ALL genes, ranked by log2FC)
all_genes <- de_results$log2FoldChange
names(all_genes) <- bitr(de_results$gene, 
                          fromType = "SYMBOL",
                          toType = "ENTREZID",
                          OrgDb = org.Hs.eg.db)$ENTREZID
all_genes <- sort(all_genes, decreasing = TRUE)
all_genes <- all_genes[!is.na(names(all_genes))]

gsea_go <- gseGO(
    geneList = all_genes,
    OrgDb = org.Hs.eg.db,
    ont = "BP",
    minGSSize = 10,
    maxGSSize = 500,
    pvalueCutoff = 0.05,
    verbose = TRUE
)

# GSEA plot for a specific term
gseaplot2(gsea_go, geneSetID = 1:3, pvalue_table = TRUE)
ggsave("GSEA_plot.pdf", width = 10, height = 7)

# Ridge plot
ridgeplot(gsea_go, showCategory = 15)
ggsave("GSEA_ridge.pdf", width = 10, height = 9)

# =============================================
# 4. Disease Ontology / Reactome
# =============================================
BiocManager::install("ReactomePA")
library(ReactomePA)

reactome <- enrichPathway(
    gene = gene_ids$ENTREZID,
    organism = "human",
    pvalueCutoff = 0.05,
    readable = TRUE
)
dotplot(reactome, showCategory = 15)

# Save all results as CSV
write.csv(as.data.frame(ego_bp), "GO_BP_results.csv", row.names = FALSE)
write.csv(as.data.frame(ekegg), "KEGG_results.csv", row.names = FALSE)
write.csv(as.data.frame(gsea_go), "GSEA_GO_results.csv", row.names = FALSE)`
                },
                {
                    type: "interpretation",
                    title: "Interpreting Enrichment Results",
                    body: `
                    <ul>
                        <li><strong>Adjusted p-value < 0.05:</strong> Statistically significant enrichment</li>
                        <li><strong>Gene Ratio:</strong> k/n — fraction of DE genes in the term. Higher = stronger effect.</li>
                        <li><strong>GeneRatio vs BgRatio:</strong> Compare to see if term is truly over-represented</li>
                        <li><strong>Redundancy:</strong> GO terms are hierarchical — many overlapping terms. Use enrichment maps to cluster similar terms.</li>
                        <li><strong>GSEA NES (Normalized Enrichment Score):</strong> Positive = upregulated pathway; negative = downregulated</li>
                        <li><strong>GSEA leading edge genes:</strong> The subset of genes driving the enrichment signal</li>
                        <li>Always report: method used, database version, multiple testing correction, and gene universe (background)</li>
                    </ul>`
                }
            ]
        }
    }
];

// ----------------------------------------------------------------
// 3F. NGS DATA ANALYSIS — TRANSCRIPTOMICS (Extended)
// ----------------------------------------------------------------

const transcriptomicsChildren = [
    {
        id: "rnaseq_pipeline",
        label: "RNA-Seq Pipeline",
        icon: "🧪",
        children: [],
        content: {
            title: "Complete RNA-Seq Analysis Pipeline",
            breadcrumb: ["Bioinformatics", "Transcriptomics", "RNA-Seq Pipeline"],
            sections: [
                {
                    type: "html",
                    body: `
                    <h3>🔄 Standard RNA-Seq Pipeline</h3>
                    <div class="pipeline">
                        <div class="pipeline-step"><span class="step-num">Step 1</span><span class="step-name">QC</span><span class="step-tool">FastQC + MultiQC</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 2</span><span class="step-name">Trim</span><span class="step-tool">Trimmomatic / fastp</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 3</span><span class="step-name">Align</span><span class="step-tool">HISAT2 / STAR</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 4</span><span class="step-name">Count</span><span class="step-tool">featureCounts / HTSeq</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 5</span><span class="step-name">DE Analysis</span><span class="step-tool">DESeq2 / limma / edgeR</span></div>
                        <span class="pipeline-arrow">→</span>
                        <div class="pipeline-step"><span class="step-num">Step 6</span><span class="step-name">Enrichment</span><span class="step-tool">clusterProfiler</span></div>
                    </div>
                    `
                },
                {
                    type: "code",
                    language: "bash",
                    title: "Steps 1-4: Raw Reads to Count Matrix (Linux/Bash)",
                    code: `# ============================================
# RNA-Seq Analysis: From FASTQ to Count Matrix
# ============================================

# --- Setup directories ---
mkdir -p {raw_data,qc_reports,trimmed,aligned,counts,results}

# --- Step 1: Quality Control ---
# Run FastQC on all samples
fastqc -t 8 raw_data/*.fastq.gz -o qc_reports/

# Aggregate reports with MultiQC
multiqc qc_reports/ -o qc_reports/multiqc/

# --- Step 2: Adapter Trimming ---
# Option A: Trimmomatic (paired-end)
for sample in raw_data/*_R1.fastq.gz; do
    name=$(basename "$sample" _R1.fastq.gz)
    
    trimmomatic PE -threads 8 \\
        "raw_data/\${name}_R1.fastq.gz" "raw_data/\${name}_R2.fastq.gz" \\
        "trimmed/\${name}_R1_paired.fastq.gz" "trimmed/\${name}_R1_unpaired.fastq.gz" \\
        "trimmed/\${name}_R2_paired.fastq.gz" "trimmed/\${name}_R2_unpaired.fastq.gz" \\
        ILLUMINACLIP:TruSeq3-PE-2.fa:2:30:10:2:True \\
        LEADING:3 TRAILING:3 \\
        SLIDINGWINDOW:4:20 \\
        MINLEN:36
done

# Option B: fastp (faster, auto-detects adapters)
for sample in raw_data/*_R1.fastq.gz; do
    name=$(basename "$sample" _R1.fastq.gz)
    
    fastp \\
        -i "raw_data/\${name}_R1.fastq.gz" \\
        -I "raw_data/\${name}_R2.fastq.gz" \\
        -o "trimmed/\${name}_R1.fastq.gz" \\
        -O "trimmed/\${name}_R2.fastq.gz" \\
        -h "qc_reports/\${name}_fastp.html" \\
        -j "qc_reports/\${name}_fastp.json" \\
        --thread 8 \\
        --qualified_quality_phred 20 \\
        --length_required 36
done

# --- Step 3: Alignment with HISAT2 ---
# Download and build genome index
# Download reference genome (e.g., GRCh38)
wget https://genome-idx.s3.amazonaws.com/hisat2/grch38.tar.gz
tar -xzf grch38.tar.gz

# OR build index from FASTA
# hisat2-build genome.fasta genome_index

# Align each sample
for sample in trimmed/*_R1_paired.fastq.gz; do
    name=$(basename "$sample" _R1_paired.fastq.gz)
    
    hisat2 -p 8 \\
        --dta \\                         # For downstream assembly
        -x grch38/genome \\              # Index prefix
        -1 "trimmed/\${name}_R1_paired.fastq.gz" \\
        -2 "trimmed/\${name}_R2_paired.fastq.gz" \\
        --summary-file "aligned/\${name}_hisat2_summary.txt" \\
        | samtools sort -@ 4 \\
        -o "aligned/\${name}.sorted.bam"
    
    # Index BAM file
    samtools index "aligned/\${name}.sorted.bam"
done

# Check alignment rates
for f in aligned/*_summary.txt; do
    echo "=== $(basename $f) ==="
    cat "$f"
done

# --- Step 4: Read Counting with featureCounts ---
# Download GTF annotation
wget https://ftp.ensembl.org/pub/release-110/gtf/homo_sapiens/Homo_sapiens.GRCh38.110.gtf.gz
gunzip Homo_sapiens.GRCh38.110.gtf.gz

# Count reads per gene (all samples at once)
featureCounts \\
    -T 8 \\
    -p --countReadPairs \\    # Paired-end mode
    -a Homo_sapiens.GRCh38.110.gtf \\
    -g gene_id \\
    -o counts/raw_counts.txt \\
    aligned/*.sorted.bam

# Clean up count matrix
# Remove first line (command) and columns 2-6 (chr, start, end, strand, length)
tail -n +2 counts/raw_counts.txt | cut -f1,7- > counts/count_matrix.txt

echo "Pipeline complete! Count matrix: counts/count_matrix.txt"`
                },
                {
                    type: "errors",
                    title: "Common RNA-Seq Errors",
                    items: [
                        {
                            error: "Overall alignment rate: 0.00% (HISAT2)",
                            solution: `Wrong genome index! Check that your reference matches the organism. 
                            Also ensure index files are complete (.ht2 files). Rebuild if needed.`
                        },
                        {
                            error: "featureCounts: Unassigned_NoFeatures count is very high",
                            solution: `GTF annotation doesn't match the reference genome version. Ensure both 
                            are from the same Ensembl/NCBI release. Also check strandedness: use -s 0 (unstranded), 
                            -s 1 (stranded), or -s 2 (reverse stranded). Run \`infer_experiment.py\` from RSeQC to check.`
                        },
                        {
                            error: "Trimmomatic: Error: Unable to detect quality encoding",
                            solution: `Specify quality encoding explicitly: PHRED33 (Illumina 1.8+) or PHRED64 (older). 
                            Add \`-phred33\` flag to the trimmomatic command.`
                        },
                        {
                            error: "samtools sort: Out of memory",
                            solution: `Limit memory per thread: \`samtools sort -m 2G -@ 4\`. 
                            Also ensure sufficient disk space for temporary files.`
                        }
                    ]
                }
            ]
        }
    },
    {
        id: "deseq2_analysis",
        label: "DESeq2 Analysis",
        icon: "📈",
        children: [],
        content: {
            title: "Differential Expression with DESeq2",
            breadcrumb: ["Bioinformatics", "Transcriptomics", "DESeq2 Analysis"],
            sections: [
                {
                    type: "definition",
                    title: "What is DESeq2?",
                    body: `DESeq2 is a Bioconductor R package for differential gene expression analysis 
                    of RNA-Seq count data. It uses a negative binomial generalized linear model with 
                    shrinkage estimation for dispersions and fold changes. It handles low-count genes, 
                    outliers, and provides robust statistical testing with multiple testing correction.`
                },
                {
                    type: "math",
                    title: "Statistical Model",
                    body: `
                    <h4>Negative Binomial Model</h4>
                    <div class="formula">K<sub>ij</sub> ~ NB(μ<sub>ij</sub>, α<sub>i</sub>)</div>
                    <p>Where K<sub>ij</sub> = read count for gene i in sample j, μ = mean, α = dispersion.</p>
                    
                    <h4>Mean-variance relationship</h4>
                    <div class="formula">Var(K<sub>ij</sub>) = μ<sub>ij</sub> + α<sub>i</sub> × μ<sub>ij</sub>²</div>
                    
                    <h4>Log2 fold change shrinkage (apeglm)</h4>
                    <p>DESeq2 uses empirical Bayes shrinkage to produce more reliable log2FC estimates, 
                    especially for genes with low counts or high variability.</p>
                    
                    <h4>Wald test</h4>
                    <div class="formula">W = β̂ / SE(β̂)</div>
                    <p>Tests if log2FC (β) is significantly different from zero. P-values adjusted with BH method.</p>
                    `
                },
                {
                    type: "code",
                    language: "r",
                    title: "Complete DESeq2 Analysis",
                    code: `# ============================================
# Differential Expression Analysis with DESeq2
# ============================================

# --- Install ---
if (!require("BiocManager")) install.packages("BiocManager")
BiocManager::install(c("DESeq2", "apeglm", "EnhancedVolcano"))
install.packages(c("pheatmap", "RColorBrewer", "ggplot2", "ggrepel"))

library(DESeq2)
library(apeglm)
library(pheatmap)
library(RColorBrewer)
library(ggplot2)
library(EnhancedVolcano)

# --- Step 1: Load Data ---
# Read count matrix
count_data <- read.table("counts/count_matrix.txt", 
                         header = TRUE, row.names = 1, sep = "\\t")

# Read sample metadata
col_data <- read.csv("sample_metadata.csv", row.names = 1)
# col_data should have columns: condition, batch, etc.
# Example:
# SampleID,condition,batch
# Sample1,Control,1
# Sample2,Control,1
# Sample3,Treatment,2

# Ensure column order matches
count_data <- count_data[, rownames(col_data)]

# --- Step 2: Create DESeq2 Dataset ---
dds <- DESeqDataSetFromMatrix(
    countData = count_data,
    colData = col_data,
    design = ~ condition    # Add ~ batch + condition for batch correction
)

# Pre-filtering: remove low-count genes
keep <- rowSums(counts(dds)) >= 10
dds <- dds[keep, ]

# Set reference level
dds$condition <- relevel(dds$condition, ref = "Control")

# --- Step 3: Run DESeq2 ---
dds <- DESeq(dds)

# --- Step 4: Extract Results ---
res <- results(dds, 
               contrast = c("condition", "Treatment", "Control"),
               alpha = 0.05)

# Apply log2FC shrinkage (recommended)
res_shrunk <- lfcShrink(dds, 
                         coef = "condition_Treatment_vs_Control",
                         type = "apeglm")

# Summary
summary(res_shrunk)

# --- Step 5: Explore Results ---
# Order by adjusted p-value
res_ordered <- res_shrunk[order(res_shrunk$padj), ]

# Get significant DEGs
sig_genes <- subset(res_ordered, padj < 0.05 & abs(log2FoldChange) > 1)
cat("Significant DEGs:", nrow(sig_genes), "\\n")
cat("Upregulated:", sum(sig_genes$log2FoldChange > 0), "\\n")
cat("Downregulated:", sum(sig_genes$log2FoldChange < 0), "\\n")

# Save results
write.csv(as.data.frame(res_ordered), "results/deseq2_all_results.csv")
write.csv(as.data.frame(sig_genes), "results/deseq2_significant_DEGs.csv")

# --- Step 6: Visualizations ---

# 6a. MA Plot
plotMA(res_shrunk, ylim = c(-5, 5), main = "MA Plot")

# 6b. Volcano Plot
EnhancedVolcano(res_shrunk,
    lab = rownames(res_shrunk),
    x = 'log2FoldChange',
    y = 'padj',
    title = 'Treatment vs Control',
    pCutoff = 0.05,
    FCcutoff = 1,
    pointSize = 2.0,
    labSize = 3.0,
    col = c('grey30', 'forestgreen', 'royalblue', 'red2'),
    legendPosition = 'right')
ggsave("results/volcano_plot.pdf", width = 10, height = 8)

# 6c. PCA Plot
vsd <- vst(dds, blind = FALSE)

pcaData <- plotPCA(vsd, intgroup = "condition", returnData = TRUE)
percentVar <- round(100 * attr(pcaData, "percentVar"))

ggplot(pcaData, aes(PC1, PC2, color = condition)) +
    geom_point(size = 4) +
    xlab(paste0("PC1: ", percentVar[1], "% variance")) +
    ylab(paste0("PC2: ", percentVar[2], "% variance")) +
    theme_minimal(base_size = 14) +
    ggtitle("PCA: RNA-Seq Samples")
ggsave("results/pca_plot.pdf", width = 8, height = 6)

# 6d. Heatmap of top DEGs
top_genes <- head(rownames(res_ordered), 50)
mat <- assay(vsd)[top_genes, ]
mat <- mat - rowMeans(mat)  # Center

annotation_col <- data.frame(Condition = col_data$condition, 
                              row.names = colnames(mat))

pheatmap(mat,
    annotation_col = annotation_col,
    clustering_distance_rows = "euclidean",
    clustering_distance_cols = "euclidean",
    clustering_method = "complete",
    scale = "row",
    show_rownames = TRUE,
    fontsize_row = 7,
    main = "Top 50 DEGs Heatmap",
    filename = "results/heatmap_top50.pdf",
    width = 10, height = 12)

# 6e. Sample distance heatmap
sampleDists <- dist(t(assay(vsd)))
sampleDistMatrix <- as.matrix(sampleDists)

pheatmap(sampleDistMatrix,
    clustering_distance_rows = sampleDists,
    clustering_distance_cols = sampleDists,
    col = colorRampPalette(rev(brewer.pal(9, "Blues")))(255),
    main = "Sample Distance Matrix",
    filename = "results/sample_distances.pdf")`
                },
                {
                    type: "interpretation",
                    title: "Interpreting DESeq2 Results",
                    body: `
                    <ul>
                        <li><strong>log2FoldChange > 0:</strong> Gene is upregulated in Treatment vs Control</li>
                        <li><strong>log2FoldChange < 0:</strong> Gene is downregulated</li>
                        <li><strong>|log2FC| > 1:</strong> Common threshold = 2-fold change</li>
                        <li><strong>padj < 0.05:</strong> Statistically significant after FDR correction</li>
                        <li><strong>baseMean:</strong> Average normalized count across all samples. Very low baseMean genes have unreliable estimates.</li>
                        <li><strong>PCA:</strong> Samples should cluster by condition, not batch. If batch effect visible, include batch in model.</li>
                        <li><strong>Dispersion plot:</strong> Points should follow the fitted line. Outlier points = high variability genes.</li>
                        <li><strong>Cook's distance:</strong> Identifies outlier samples for specific genes. Flagged genes have padj = NA.</li>
                    </ul>`
                }
            ]
        }
    },
    {
        id: "limma_analysis",
        label: "limma-voom Analysis",
        icon: "📉",
        children: [],
        content: {
            title: "Differential Expression with limma-voom",
            breadcrumb: ["Bioinformatics", "Transcriptomics", "limma-voom"],
            sections: [
                {
                    type: "definition",
                    title: "What is limma?",
                    body: `limma (Linear Models for Microarray Data) with voom transformation enables 
                    analysis of RNA-Seq data using the same linear modeling framework originally developed 
                    for microarrays. The voom function models the mean-variance relationship to generate 
                    precision weights. limma is particularly powerful for complex experimental designs 
                    (multiple factors, interactions, paired samples).`
                },
                {
                    type: "code",
                    language: "r",
                    title: "limma-voom Analysis",
                    code: `# ============================================
# limma-voom for RNA-Seq
# ============================================
BiocManager::install(c("limma", "edgeR"))
library(limma)
library(edgeR)
library(ggplot2)

# Load count data
counts <- read.table("counts/count_matrix.txt", header = TRUE, 
                      row.names = 1, sep = "\\t")
metadata <- read.csv("sample_metadata.csv", row.names = 1)

# Create DGEList object
dge <- DGEList(counts = counts, group = metadata$condition)

# Filter lowly expressed genes
keep <- filterByExpr(dge, group = metadata$condition)
dge <- dge[keep, , keep.lib.sizes = FALSE]
cat("Genes retained:", nrow(dge), "\\n")

# TMM normalization
dge <- calcNormFactors(dge, method = "TMM")

# Design matrix
design <- model.matrix(~ 0 + condition, data = metadata)
colnames(design) <- gsub("condition", "", colnames(design))

# Voom transformation
v <- voom(dge, design, plot = TRUE)  # Plots mean-variance trend

# Fit linear model
fit <- lmFit(v, design)

# Define contrasts
contrasts <- makeContrasts(
    TreatmentVsControl = Treatment - Control,
    levels = design
)

# Apply contrasts and empirical Bayes
fit2 <- contrasts.fit(fit, contrasts)
fit2 <- eBayes(fit2)

# Get results
results <- topTable(fit2, coef = "TreatmentVsControl", 
                     number = Inf, sort.by = "P")

# Significant genes
sig <- results[results$adj.P.Val < 0.05 & abs(results$logFC) > 1, ]
cat("Significant DEGs:", nrow(sig), "\\n")

# Visualizations
# Volcano plot
volcanoplot(fit2, coef = "TreatmentVsControl", 
            highlight = 20, names = rownames(fit2))

# MD plot
plotMD(fit2, column = 1, status = results$adj.P.Val < 0.05)

# Venn diagram (if multiple contrasts)
# decideTests gives -1 (down), 0 (ns), 1 (up)
dt <- decideTests(fit2, adjust.method = "BH", p.value = 0.05, lfc = 1)
summary(dt)

# Save
write.csv(results, "results/limma_voom_results.csv")`
                },
                {
                    type: "html",
                    body: `
                    <h3>DESeq2 vs. limma-voom vs. edgeR</h3>
                    <div class="table-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr><th>Feature</th><th>DESeq2</th><th>limma-voom</th><th>edgeR</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>Model</strong></td><td>Negative Binomial GLM</td><td>Normal (log-CPM)</td><td>Negative Binomial GLM</td></tr>
                                <tr><td><strong>Normalization</strong></td><td>Median of ratios</td><td>TMM (via edgeR)</td><td>TMM</td></tr>
                                <tr><td><strong>Small samples (n<3)</strong></td><td>OK</td><td>Less power</td><td>OK</td></tr>
                                <tr><td><strong>Complex designs</strong></td><td>Good</td><td>Excellent</td><td>Good</td></tr>
                                <tr><td><strong>Speed</strong></td><td>Moderate</td><td>Fast</td><td>Fast</td></tr>
                                <tr><td><strong>FC shrinkage</strong></td><td>Built-in (apeglm)</td><td>treat() function</td><td>No</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p><strong>Recommendation:</strong> Use DESeq2 for straightforward designs, limma-voom 
                    for complex designs, and consider running multiple tools for consensus.</p>
                    `
                }
            ]
        }
    },
    {
        id: "geo2r_degear",
        label: "GEO2R & DEGEAR",
        icon: "🌐",
        children: [],
        content: {
            title: "GEO2R & DEGEAR for GEO Data Analysis",
            breadcrumb: ["Bioinformatics", "Transcriptomics", "GEO2R & DEGEAR"],
            sections: [
                {
                    type: "definition",
                    title: "What is GEO2R?",
                    body: `GEO2R is a web-based tool provided by NCBI to analyze Gene Expression Omnibus (GEO) 
                    datasets directly in the browser. It uses limma (for microarray) or DESeq2 (for RNA-Seq) 
                    to identify differentially expressed genes between user-defined groups.`
                },
                {
                    type: "html",
                    body: `
                    <h3>GEO2R Step-by-Step</h3>
                    <ol>
                        <li>Go to <a href="https://www.ncbi.nlm.nih.gov/geo/geo2r/" target="_blank">ncbi.nlm.nih.gov/geo/geo2r</a></li>
                        <li>Enter GEO Series accession (e.g., GSE12345)</li>
                        <li>Define groups (e.g., Control vs. Disease)</li>
                        <li>Assign samples to groups</li>
                        <li>Click "Analyze" → View results table</li>
                        <li>Download full results table</li>
                        <li>View R script used (for reproducibility)</li>
                    </ol>
                    
                    <h3>DEGEAR</h3>
                    <p><strong>DEGEAR</strong> (Differential Expression Gene Expression Analysis in R) is a 
                    tool developed that provides enhanced analysis of GEO data with additional statistical 
                    methods, visualizations, and downstream analysis options beyond what GEO2R offers.</p>
                    
                    <div class="info-box tip">
                        <div class="info-title">💡 Pro Tip</div>
                        <p>GEO2R is great for quick exploration, but for publication-quality analysis, 
                        download the raw data and run your own pipeline with DESeq2 or limma for full 
                        control over normalization, filtering, and batch correction.</p>
                    </div>
                    `
                }
            ]
        }
    }
];

// ----------------------------------------------------------------
// 3G. SEQUENCE ANALYSIS (FUNDAMENTALS)
// ----------------------------------------------------------------

const sequenceAnalysisChildren = [
    {
        id: "seq_alignment",
        label: "Sequence Alignment",
        icon: "📐",
        children: [
            {
                id: "pairwise_alignment",
                label: "Pairwise Alignment",
                icon: "↔️",
                children: [],
                content: {
                    title: "Pairwise Sequence Alignment",
                    breadcrumb: ["Bioinformatics", "Sequence Analysis", "Alignment", "Pairwise"],
                    sections: [
                        {
                            type: "definition",
                            title: "Overview",
                            body: `Pairwise alignment finds the best way to align two sequences to identify 
                            regions of similarity. Global alignment (Needleman-Wunsch) aligns entire sequences; 
                            local alignment (Smith-Waterman) finds the best matching subsequences.`
                        },
                        {
                            type: "math",
                            title: "Dynamic Programming Algorithms",
                            body: `
                            <h4>Needleman-Wunsch (Global Alignment)</h4>
                            <p>Fill matrix F(i,j) using recurrence:</p>
                            <div class="formula">F(i,j) = max { F(i-1,j-1) + s(x<sub>i</sub>, y<sub>j</sub>), F(i-1,j) + d, F(i,j-1) + d }</div>
                            <p>Where s(x,y) = substitution score, d = gap penalty</p>
                            
                            <h4>Smith-Waterman (Local Alignment)</h4>
                            <div class="formula">F(i,j) = max { 0, F(i-1,j-1) + s(x<sub>i</sub>, y<sub>j</sub>), F(i-1,j) + d, F(i,j-1) + d }</div>
                            <p>Key difference: scores cannot go below 0. Traceback starts from the maximum score.</p>
                            
                            <h4>Time Complexity: O(m × n)</h4>
                            <p>Where m and n are the lengths of the two sequences.</p>
                            `
                        },
                        {
                            type: "html",
                            body: `
                            <h3>Scoring Matrices</h3>
                            <ul>
                                <li><strong>DNA:</strong> Simple match/mismatch scores (e.g., +1/-1)</li>
                                <li><strong>Protein (PAM):</strong> PAM250 — for distantly related proteins</li>
                                <li><strong>Protein (BLOSUM):</strong> BLOSUM62 — most commonly used; based on conserved blocks</li>
                                <li><strong>Higher BLOSUM number</strong> (e.g., BLOSUM80) = for closely related sequences</li>
                                <li><strong>Lower BLOSUM number</strong> (e.g., BLOSUM45) = for distantly related sequences</li>
                            </ul>
                            
                            <h3>Gap Penalties</h3>
                            <ul>
                                <li><strong>Linear:</strong> γ(g) = -d × g (penalty proportional to gap length)</li>
                                <li><strong>Affine:</strong> γ(g) = -d - (g-1) × e (separate gap opening and extension penalties)</li>
                            </ul>
                            `
                        }
                    ]
                }
            },
            {
                id: "msa",
                label: "Multiple Sequence Alignment",
                icon: "📊",
                children: [],
                content: {
                    title: "Multiple Sequence Alignment (MSA)",
                    breadcrumb: ["Bioinformatics", "Sequence Analysis", "Alignment", "MSA"],
                    sections: [
                        {
                            type: "definition",
                            title: "What is MSA?",
                            body: `Multiple Sequence Alignment aligns three or more sequences simultaneously 
                            to identify conserved regions, functional domains, and evolutionary relationships. 
                            Exact MSA is NP-hard, so heuristic methods are used.`
                        },
                        {
                            type: "html",
                            body: `
                            <h3>MSA Tools</h3>
                            <div class="table-wrapper">
                                <table class="comparison-table">
                                    <thead>
                                        <tr><th>Tool</th><th>Algorithm</th><th>Speed</th><th>Accuracy</th><th>Best For</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td><strong>MAFFT</strong></td><td>FFT-based progressive</td><td>Very Fast</td><td>High</td><td>General use, large datasets</td></tr>
                                        <tr><td><strong>MUSCLE</strong></td><td>Iterative progressive</td><td>Fast</td><td>High</td><td>Protein alignments</td></tr>
                                        <tr><td><strong>Clustal Omega</strong></td><td>HMM-based progressive</td><td>Moderate</td><td>Good</td><td>Very large datasets</td></tr>
                                        <tr><td><strong>T-Coffee</strong></td><td>Consistency-based</td><td>Slow</td><td>Very High</td><td>Difficult alignments</td></tr>
                                        <tr><td><strong>PRANK</strong></td><td>Phylogeny-aware</td><td>Slow</td><td>Best for phylo</td><td>Phylogenetic analysis</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            `
                        },
                        {
                            type: "code",
                            language: "bash",
                            title: "MSA Tools Usage",
                            code: `# ============================================
# Multiple Sequence Alignment
# ============================================

# --- MAFFT ---
conda install -c bioconda mafft

# Auto mode (selects best algorithm based on size)
mafft --auto sequences.fasta > aligned.fasta

# High accuracy for small datasets
mafft --maxiterate 1000 --localpair sequences.fasta > aligned_accurate.fasta

# Fast for large datasets (>2000 sequences)
mafft --retree 1 sequences.fasta > aligned_fast.fasta

# --- MUSCLE ---
conda install -c bioconda muscle

# MUSCLE v5
muscle -align sequences.fasta -output aligned.fasta

# --- Clustal Omega ---
conda install -c bioconda clustalo

clustalo -i sequences.fasta \\
    -o aligned.fasta \\
    --threads 8 \\
    --outfmt fasta \\
    -v

# --- Alignment trimming ---
# trimAl
conda install -c bioconda trimal
trimal -in aligned.fasta -out trimmed.fasta -automated1

# Gblocks
conda install -c bioconda gblocks
Gblocks aligned.fasta -t=d  # DNA
Gblocks aligned.fasta -t=p  # Protein

# --- View alignment ---
# AliView (GUI): https://ormbunkar.se/aliview/
# Jalview (GUI): https://www.jalview.org/
# Command-line viewer:
alv aligned.fasta  # pip install alv`
                        }
                    ]
                }
            }
        ],
        content: {
            title: "Sequence Alignment",
            breadcrumb: ["Bioinformatics", "Sequence Analysis", "Alignment"],
            sections: [{
                type: "html",
                body: `<p>Sequence alignment is the fundamental technique in bioinformatics for comparing 
                biological sequences (DNA, RNA, protein). It identifies regions of similarity that may 
                be a consequence of functional, structural, or evolutionary relationships.</p>`
            }]
        }
    },
    {
        id: "blast_search",
        label: "BLAST & Homology Search",
        icon: "🔍",
        children: [],
        content: {
                // Continuing from your last line:
    // "BLAST & Sequence Similarity Search",
    // breadcrumb: ["Bioinformatics", "Sequence Analysis",

            title: "BLAST & Sequence Similarity Search",
            breadcrumb: ["Bioinformatics", "Sequence Analysis", "BLAST & Homology Search"],
            sections: [
                {
                    type: "definition",
                    title: "What is BLAST?",
                    body: `BLAST (Basic Local Alignment Search Tool) is the most widely used tool for finding regions of local similarity between biological sequences (DNA, RNA, protein) and large sequence databases. It uses a fast heuristic algorithm that approximates the Smith-Waterman local alignment.`
                },
                {
                    type: "html",
                    body: `
                    <h3>Common BLAST Variants</h3>
                    <ul>
                        <li><strong>blastn</strong> — nucleotide vs nucleotide</li>
                        <li><strong>blastp</strong> — protein vs protein</li>
                        <li><strong>blastx</strong> — translated nucleotide vs protein</li>
                        <li><strong>tblastn</strong> — protein vs translated nucleotide</li>
                        <li><strong>tblastx</strong> — translated nucleotide vs translated nucleotide</li>
                    </ul>
                    `
                }
            ]
        }
    }
];

// ────────────────────────────────────────────────
//   Optional: minimal placeholders for other major branches
//   (you can expand them later the same way)
// ────────────────────────────────────────────────

const genomicsChildren = [
    { id: "ngs-preprocessing", label: "NGS Preprocessing", icon: "⚙️" },
    { id: "genome-assembly",    label: "Genome Assembly",  icon: "🛠️" },
    { id: "variant-calling",    label: "Variant Calling",  icon: "🔍" }
];

const systemsBiologyChildren = [
    { id: "network-analysis",     label: "Network Analysis",     icon: "🕸️" },
    { id: "metabolic-modeling",   label: "Metabolic Modeling",   icon: "⚗️" },
    { id: "multi-omics",          label: "Multi-omics Integration", icon: "🔄" }
];

// ────────────────────────────────────────────────
//   INTEGRATION — connect children to TREE_DATA
// ────────────────────────────────────────────────

function integrateAllChildren() {
    const mappings = {
        'sequence-analysis':     sequenceAnalysisChildren,
        'genomics':              genomicsChildren,
        'systems-biology':       systemsBiologyChildren,
        // Add more when you expand them:
        // 'phylogenetics':         phylogeneticsChildren,
        // 'metagenomics':          metagenomicsChildren,
        // 'structural-bioinformatics': structuralChildren,
        // 'comparative-genomics':  comparativeGenomicsChildren,
        // 'functional-genomics':   functionalGenomicsChildren,
        // 'transcriptomics':       transcriptomicsChildren
    };

    Object.entries(mappings).forEach(([parentId, childArray]) => {
        const parent = findNode(parentId);
        if (parent) {
            parent.children = childArray;
        }
    });
}

integrateAllChildren();

// ────────────────────────────────────────────────
//   AUTO-GENERATE CONTENT[] FROM .content.sections
// ────────────────────────────────────────────────

function generateContentFromNode(node) {
    if (!node.content || !node.content.sections) return null;

    let html = `<h2>${node.content.title || node.label}</h2>`;

    node.content.sections.forEach(sec => {
        let block = '';

        if (sec.type === 'definition') {
            block = infoBox('definition', sec.title, `<p>${sec.body}</p>`);
        } else if (sec.type === 'html') {
            block = sec.body;
        } else if (sec.type === 'code') {
            block = `<h4>${sec.title || 'Code Example'}</h4>` +
                    codeBlock(sec.language || 'bash', sec.code);
        }

        html += block;
    });

    return () => sectionCard(html);
}

function autoPopulateContent() {
    function traverse(node) {
        if (node.content) {
            CONTENT[node.id] = generateContentFromNode(node);
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    }
    traverse(TREE_DATA);
}

autoPopulateContent();

// ────────────────────────────────────────────────
//   FINAL INITIALIZATION
// ────────────────────────────────────────────────

function initializeBioinfoArchive() {
    // Rebuild search index after children were replaced
    state.nodeIndex = [];
    buildNodeIndex(TREE_DATA);

    // Render UI
    renderTree();
    activateNode('root');

    // Activate features
    initSearch();
    initTheme();
    initResize();
    initScrollTop();
    initTreeControls();
    initLoader();
    updateStats();
}

// Run when page is ready
window.addEventListener('load', initializeBioinfoArchive);

// ────────────────────────────────────────────────
//   End of script — close the IIFE
// ────────────────────────────────────────────────
})();