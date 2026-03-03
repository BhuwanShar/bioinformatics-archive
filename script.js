// ================================================================
//  BIOINFORMATICS ARCHIVE — Complete Script
//  Created by Bhuwan Sharma | © 2026
// ================================================================

(function () {
  "use strict";

  // ==============================================================
  //  SECTION 1: KNOWLEDGE DATA
  // ==============================================================

  const KNOWLEDGE_TREE = {
    id: "root",
    label: "Bioinformatics",
    icon: "DNA",
    color: "blue",
    content: {
      title: "Bioinformatics Knowledge Archive",
      what: "Bioinformatics is an interdisciplinary field combining biology, computer science, mathematics, and statistics to analyze and interpret biological data at the molecular level.",
      questions: [
        "How do we store, retrieve, and analyze biological sequences?",
        "What genes are expressed under specific conditions?",
        "How are organisms evolutionarily related?",
        "What is the 3D structure of a protein and how does it function?",
        "How do microbial communities differ across environments?",
        "What genomic variants are associated with diseases?",
        "How do we assemble and annotate genomes from raw sequencing data?",
        "What metabolic pathways are active in a given organism?"
      ],
      overview: "This archive provides a comprehensive, interactive decision tree covering every major sub-field of bioinformatics — definitions, tools, algorithms, workflows, troubleshooting, and interpretation guides.",
      references: [
        { text: "Lesk, A.M. Introduction to Bioinformatics (Oxford University Press)", url: "https://global.oup.com/academic/product/introduction-to-bioinformatics-9780198794141" },
        { text: "NCBI Bioinformatics Resources", url: "https://www.ncbi.nlm.nih.gov/guide/all/" }
      ]
    },
    children: [

      // ── 1. SEQUENCE ANALYSIS ──
      {
        id: "sequence_analysis",
        label: "Sequence Analysis",
        icon: "SEQ",
        color: "yellow",
        content: {
          title: "Sequence Analysis",
          what: "The process of subjecting DNA, RNA, or protein sequences to computational methods to understand features, function, structure, or evolution. This is the foundational pillar of bioinformatics.",
          questions: [
            "What is the identity of an unknown sequence?",
            "Which regions of two or more sequences are similar?",
            "What functional domains exist in a protein?",
            "Where are the open reading frames in a DNA sequence?",
            "How conserved is a region across species?"
          ],
          tools: [
            { name: "BLAST", type: "tool", desc: "Basic Local Alignment Search Tool — similarity search in databases" },
            { name: "HMMER", type: "tool", desc: "Profile HMM-based sequence searching" },
            { name: "Clustal Omega", type: "tool", desc: "Multiple sequence alignment" },
            { name: "MUSCLE", type: "tool", desc: "Fast multiple sequence alignment" },
            { name: "MAFFT", type: "tool", desc: "High-speed multiple alignment" },
            { name: "EMBOSS", type: "tool", desc: "Suite of sequence analysis tools" },
            { name: "Biopython", type: "lang", desc: "Python library for biological computation" }
          ],
          databases: [
            { name: "NCBI GenBank", type: "db", desc: "Nucleotide sequence database" },
            { name: "UniProt", type: "db", desc: "Protein sequence and annotation" },
            { name: "Pfam / InterPro", type: "db", desc: "Protein family and domain classification" }
          ],
          references: [
            { text: "BLAST algorithm — Altschul et al. 1990 (J Mol Biol)", url: "https://doi.org/10.1016/S0022-2836(05)80360-2" },
            { text: "HMMER documentation", url: "http://hmmer.org/documentation.html" }
          ]
        },
        children: [
          {
            id: "pairwise_alignment",
            label: "Pairwise Alignment",
            icon: "ALN",
            content: {
              title: "Pairwise Sequence Alignment",
              what: "Compares two sequences to identify regions of similarity. Global alignment (Needleman-Wunsch) aligns entire lengths; local alignment (Smith-Waterman) finds best matching sub-regions.",
              questions: [
                "How similar are two sequences?",
                "What is the optimal alignment between two sequences?",
                "Are two proteins homologous?"
              ],
              algorithms: [
                { name: "Needleman-Wunsch", desc: "Global alignment via dynamic programming. Time O(mn), Space O(mn). Finds optimal end-to-end alignment." },
                { name: "Smith-Waterman", desc: "Local alignment with zero-reset in scoring matrix. Finds best local match region." },
                { name: "BLAST heuristic", desc: "Seed-and-extend approach for fast database searching. Not guaranteed optimal but highly practical." }
              ],
              math: [
                "Needleman-Wunsch: F(i,j) = max{ F(i-1,j-1)+s(xi,yj), F(i-1,j)+d, F(i,j-1)+d }",
                "Smith-Waterman: H(i,j) = max{ 0, H(i-1,j-1)+s(xi,yj), H(i-1,j)+d, H(i,j-1)+d }",
                "E-value: E = K*m*n*e^(-lambda*S) — expected alignments with score >= S by chance"
              ],
              workflow: [
                { step: 1, title: "Install BLAST+", cmd: "sudo apt-get install ncbi-blast+", lang: "bash" },
                { step: 2, title: "Create BLAST database", cmd: "makeblastdb -in reference.fasta -dbtype nucl -out mydb", lang: "bash" },
                { step: 3, title: "Run BLAST search", cmd: "blastn -query query.fasta -db mydb -out results.txt -evalue 1e-5 -outfmt 6 -num_threads 4", lang: "bash" },
                { step: 4, title: "Interpret output", cmd: "# Output format 6 columns:\n# qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore\n# evalue < 1e-5 = significant; pident > 30% (protein) suggests homology", lang: "bash" }
              ],
              interpretation: "E-value < 1e-5 indicates statistical significance. Percent identity >30% for proteins or >70% for nucleotides suggests homology. Bit score is normalized and database-size independent — higher is better. Always check alignment length covers a significant portion of the query.",
              errors: [
                { error: "No alias or index file found", solution: "Run makeblastdb again. Ensure -dbtype matches sequence type (nucl/prot). Verify file permissions." },
                { error: "No hits found", solution: "Increase -evalue threshold (e.g., 10). Verify query is not empty. Try different BLAST program (blastn vs tblastx)." }
              ],
              references: [
                { text: "Needleman-Wunsch 1970 (original paper)", url: "https://doi.org/10.1016/0022-2836(70)90057-4" },
                { text: "Smith-Waterman 1981", url: "https://doi.org/10.1016/0022-2836(81)90087-5" },
                { text: "BLAST tutorial — NCBI", url: "https://blast.ncbi.nlm.nih.gov/doc/blast-help/" }
              ]
            }
          },
          {
            id: "msa",
            label: "Multiple Sequence Alignment",
            icon: "MSA",
            content: {
              title: "Multiple Sequence Alignment (MSA)",
              what: "MSA extends pairwise alignment to three or more sequences, revealing conserved regions, functional domains, and evolutionary relationships.",
              algorithms: [
                { name: "Progressive (Clustal)", desc: "Build guide tree, align closest pairs first, progressively add sequences." },
                { name: "Iterative (MUSCLE)", desc: "Repeated refinement cycles to improve overall score." },
                { name: "Consistency-based (T-Coffee)", desc: "Uses pairwise alignment library to guide the multiple alignment." },
                { name: "FFT-based (MAFFT)", desc: "Fast Fourier Transform for rapid alignment of large datasets." }
              ],
              math: [
                "Sum-of-pairs score: SP = sum over all i<j of score(Si, Sj)",
                "Guide tree: UPGMA or Neighbor-Joining from pairwise distances",
                "Substitution matrices: BLOSUM62 (protein), NUC.4.4 (nucleotide)"
              ],
              workflow: [
                { step: 1, title: "Install MAFFT", cmd: "conda install -c bioconda mafft", lang: "bash" },
                { step: 2, title: "Run alignment", cmd: "# Fast default\nmafft sequences.fasta > aligned.fasta\n\n# High accuracy (<200 seqs)\nmafft --localpair --maxiterate 1000 sequences.fasta > aligned.fasta\n\n# Large datasets (>2000 seqs)\nmafft --retree 1 sequences.fasta > aligned.fasta", lang: "bash" },
                { step: 3, title: "Trim poorly aligned regions", cmd: "conda install -c bioconda trimal\ntrimal -in aligned.fasta -out trimmed.fasta -automated1", lang: "bash" }
              ],
              interpretation: "Highly conserved columns indicate functionally or structurally important residues. Gaps may indicate insertions/deletions. Variable regions evolve under less selective constraint.",
              errors: [
                { error: "Sequences too divergent — poor alignment", solution: "Use L-INS-i mode in MAFFT or T-Coffee. Verify sequences are truly homologous." },
                { error: "Out of memory for large datasets", solution: "Use MAFFT --retree 1 or --parttree. Remove redundant sequences with CD-HIT first." }
              ],
              references: [
                { text: "MAFFT — Katoh et al. 2002", url: "https://doi.org/10.1093/nar/gkf436" },
                { text: "MUSCLE — Edgar 2004", url: "https://doi.org/10.1093/nar/gkh340" },
                { text: "Clustal Omega — Sievers et al. 2011", url: "https://doi.org/10.1038/msb.2011.75" }
              ]
            }
          },
          {
            id: "sequence_databases",
            label: "Databases and Retrieval",
            icon: "DB",
            content: {
              title: "Sequence Databases and Retrieval",
              what: "Organized collections of biological sequences. Efficient retrieval and format understanding is fundamental to all analyses.",
              databases: [
                { name: "NCBI GenBank", type: "db", desc: "Primary nucleotide database" },
                { name: "NCBI RefSeq", type: "db", desc: "Curated reference sequences" },
                { name: "UniProt/SwissProt", type: "db", desc: "Curated protein sequences" },
                { name: "Ensembl", type: "db", desc: "Vertebrate genomes and annotation" },
                { name: "PDB", type: "db", desc: "Protein 3D structures" },
                { name: "KEGG", type: "db", desc: "Pathway and genome database" },
                { name: "Gene Ontology", type: "db", desc: "Functional annotation terms" }
              ],
              formats: [
                { name: "FASTA", desc: ">header followed by sequence" },
                { name: "GenBank (.gb)", desc: "Rich annotation format with features" },
                { name: "FASTQ", desc: "Sequence + quality scores from NGS" },
                { name: "SAM/BAM", desc: "Sequence Alignment/Map format" },
                { name: "VCF", desc: "Variant Call Format" },
                { name: "GFF/GTF", desc: "Genome Feature Format" },
                { name: "BED", desc: "Genomic intervals" }
              ],
              workflow: [
                { step: 1, title: "Install Entrez Direct", cmd: "sh -c \"$(curl -fsSL https://ftp.ncbi.nlm.nih.gov/entrez/entrezdirect/install-edirect.sh)\"\nexport PATH=${HOME}/edirect:${PATH}", lang: "bash" },
                { step: 2, title: "Search and download", cmd: "# Search for human TP53\nesearch -db nucleotide -query \"TP53[Gene] AND Homo sapiens[Organism] AND refseq[filter]\" | efetch -format fasta > tp53.fasta\n\n# Download protein by accession\nefetch -db protein -id P04637 -format fasta > p53_protein.fasta", lang: "bash" },
                { step: 3, title: "SRA data download", cmd: "conda install -c bioconda sra-tools\nprefetch SRR1234567\nfasterq-dump SRR1234567 --split-3 -O ./fastq_output/", lang: "bash" }
              ],
              references: [
                { text: "NCBI Entrez Help", url: "https://www.ncbi.nlm.nih.gov/books/NBK3837/" },
                { text: "UniProt documentation", url: "https://www.uniprot.org/help" }
              ]
            }
          }
        ]
      },

      // ── 2. GENOMICS ──
      {
        id: "genomics",
        label: "Genomics",
        icon: "GEN",
        color: "blue",
        content: {
          title: "Genomics",
          what: "Study of complete DNA content (genome) within an organism — sequencing, assembly, annotation, variant calling, and comparative analysis.",
          questions: [
            "What is the complete DNA sequence of an organism?",
            "How many genes does it have?",
            "What genetic variants exist between individuals?",
            "Which genomic regions associate with diseases?"
          ],
          tools: [
            { name: "BWA-MEM2", type: "tool", desc: "Burrows-Wheeler Aligner for read mapping" },
            { name: "SAMtools", type: "tool", desc: "SAM/BAM manipulation" },
            { name: "GATK", type: "tool", desc: "Genome Analysis Toolkit — variant calling" },
            { name: "SPAdes", type: "tool", desc: "De novo genome assembler" },
            { name: "FastQC", type: "tool", desc: "Quality control for sequencing data" },
            { name: "MultiQC", type: "tool", desc: "Aggregate QC reports" }
          ]
        },
        children: [
          {
            id: "genome_assembly",
            label: "Genome Assembly",
            icon: "ASM",
            content: {
              title: "Genome Assembly",
              what: "Reconstructing complete genome sequences from short or long reads. Can be de novo (no reference) or reference-guided.",
              algorithms: [
                { name: "De Bruijn Graph", desc: "Breaks reads into k-mers, finds Eulerian path. Used by SPAdes, Velvet, SOAPdenovo." },
                { name: "Overlap-Layout-Consensus", desc: "Finds read overlaps, builds layout, generates consensus. Used by Canu, Flye for long reads." }
              ],
              math: [
                "Coverage: C = (N * L) / G where N=reads, L=read length, G=genome size",
                "N50: shortest contig length at 50% of total assembly length"
              ],
              workflow: [
                { step: 1, title: "Quality Control", cmd: "conda install -c bioconda fastqc multiqc\nfastqc reads_R1.fastq.gz reads_R2.fastq.gz -o qc_output/ -t 4\nmultiqc qc_output/", lang: "bash" },
                { step: 2, title: "Trim reads", cmd: "conda install -c bioconda trimmomatic\ntrimmomatic PE -threads 4 \\\n  reads_R1.fastq.gz reads_R2.fastq.gz \\\n  trimmed_R1.fastq.gz unpaired_R1.fastq.gz \\\n  trimmed_R2.fastq.gz unpaired_R2.fastq.gz \\\n  ILLUMINACLIP:TruSeq3-PE.fa:2:30:10 \\\n  LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36", lang: "bash" },
                { step: 3, title: "Assemble with SPAdes", cmd: "conda install -c bioconda spades\nspades.py --isolate -1 trimmed_R1.fastq.gz -2 trimmed_R2.fastq.gz \\\n  -o spades_output/ -t 8", lang: "bash" },
                { step: 4, title: "Assess quality", cmd: "conda install -c bioconda quast busco\nquast spades_output/scaffolds.fasta -o quast_results/ --min-contig 500\nbusco -i spades_output/scaffolds.fasta -l bacteria_odb10 -o busco_results -m genome -c 4", lang: "bash" }
              ],
              interpretation: "Good assembly: high N50, few contigs, total length near expected genome size. BUSCO >95% complete indicates most genes present.",
              errors: [
                { error: "SPAdes: not enough memory", solution: "Reduce k-mer sizes, use -m to set limit, or subsample reads with seqtk." },
                { error: "Assembly too fragmented", solution: "Check coverage (aim 50-100x), ensure proper trimming, try different k-mer sizes." }
              ],
              references: [
                { text: "SPAdes — Bankevich et al. 2012", url: "https://doi.org/10.1089/cmb.2012.0021" },
                { text: "BUSCO — Simao et al. 2015", url: "https://doi.org/10.1093/bioinformatics/btv351" }
              ]
            }
          },
          {
            id: "read_mapping",
            label: "Read Mapping",
            icon: "MAP",
            content: {
              title: "Read Mapping / Alignment to Reference",
              what: "Aligning sequencing reads to a reference genome — prerequisite for variant calling, expression quantification, and peak calling.",
              algorithms: [
                { name: "Burrows-Wheeler Transform", desc: "Efficient exact and approximate string matching. Used by BWA and Bowtie2." },
                { name: "FM-index", desc: "Compressed full-text index enabling fast pattern search." }
              ],
              workflow: [
                { step: 1, title: "Index and align", cmd: "conda install -c bioconda bwa-mem2 samtools picard\nbwa-mem2 index reference.fasta\nsamtools faidx reference.fasta\n\nbwa-mem2 mem -t 8 reference.fasta trimmed_R1.fastq.gz trimmed_R2.fastq.gz | \\\n  samtools sort -@ 4 -o aligned.bam\nsamtools index aligned.bam", lang: "bash" },
                { step: 2, title: "Mark duplicates and stats", cmd: "picard MarkDuplicates I=aligned.bam O=dedup.bam M=dup_metrics.txt REMOVE_DUPLICATES=true\nsamtools index dedup.bam\nsamtools flagstat dedup.bam\nsamtools depth -a dedup.bam | awk '{sum+=$3} END {print \"Avg coverage:\", sum/NR}'", lang: "bash" }
              ],
              interpretation: "Mapping rate >95% expected for same-species DNA-seq. Duplicate rate >30% suggests library complexity issues. 30-50x coverage standard for variant calling.",
              references: [
                { text: "BWA — Li & Durbin 2009", url: "https://doi.org/10.1093/bioinformatics/btp324" },
                { text: "SAMtools — Li et al. 2009", url: "https://doi.org/10.1093/bioinformatics/btp352" }
              ]
            }
          },
          {
            id: "variant_calling",
            label: "Variant Calling",
            icon: "VAR",
            content: {
              title: "Variant Calling",
              what: "Identifies differences (SNPs, indels, structural variants) between a sequenced sample and a reference genome.",
              math: [
                "Phred quality: Q = -10*log10(P_error) — Q30 means 1/1000 error probability",
                "Genotype likelihood: P(D|G) = product of P(base|genotype) for each covering read"
              ],
              workflow: [
                { step: 1, title: "Call variants (bcftools)", cmd: "conda install -c bioconda bcftools\nbcftools mpileup -f reference.fasta dedup.bam | \\\n  bcftools call -mv -Oz -o variants.vcf.gz\ntabix -p vcf variants.vcf.gz\nbcftools filter -s 'LowQual' -e 'QUAL<20 || DP<10' variants.vcf.gz -Oz -o filtered.vcf.gz", lang: "bash" },
                { step: 2, title: "GATK HaplotypeCaller", cmd: "conda install -c bioconda gatk4\ngatk CreateSequenceDictionary -R reference.fasta\ngatk AddOrReplaceReadGroups -I dedup.bam -O rg_dedup.bam \\\n  -RGID 1 -RGLB lib1 -RGPL illumina -RGPU unit1 -RGSM sample1\nsamtools index rg_dedup.bam\ngatk HaplotypeCaller -R reference.fasta -I rg_dedup.bam -O raw_variants.vcf", lang: "bash" },
                { step: 3, title: "Annotate variants", cmd: "conda install -c bioconda snpsift snpeff\nsnpEff ann GRCh38.105 filtered_snps.vcf > annotated.vcf\nbcftools stats annotated.vcf > vcf_stats.txt", lang: "bash" }
              ],
              interpretation: "QUAL>30, depth>10 = reliable. Ti/Tv ~2.0-2.1 for human WGS indicates good call quality. SnpEff classifies as HIGH (stop gain), MODERATE (missense), LOW (synonymous), MODIFIER (intergenic).",
              errors: [
                { error: "GATK: Read groups missing", solution: "Add read groups with AddOrReplaceReadGroups. Every read needs RG tag." },
                { error: "Contig names don't match", solution: "Ensure BAM and reference use same naming (chr1 vs 1). Use samtools reheader." }
              ],
              references: [
                { text: "GATK Best Practices", url: "https://gatk.broadinstitute.org/hc/en-us/sections/360007226651-Best-Practices-Workflows" },
                { text: "bcftools documentation", url: "https://samtools.github.io/bcftools/bcftools.html" }
              ]
            }
          },
          {
            id: "genome_annotation",
            label: "Genome Annotation",
            icon: "ANN",
            content: {
              title: "Genome Annotation",
              what: "Identifying locations and functions of genes and other functional elements. Structural annotation finds genes; functional annotation assigns biological roles.",
              tools: [
                { name: "Prokka", type: "tool", desc: "Rapid prokaryotic annotation" },
                { name: "Augustus", type: "tool", desc: "Eukaryotic gene prediction" },
                { name: "Prodigal", type: "tool", desc: "Prokaryotic gene finding" },
                { name: "eggNOG-mapper", type: "tool", desc: "Functional annotation" },
                { name: "InterProScan", type: "tool", desc: "Protein domain annotation" }
              ],
              workflow: [
                { step: 1, title: "Annotate with Prokka", cmd: "conda install -c bioconda prokka\nprokka --outdir prokka_output --prefix my_genome --kingdom Bacteria --cpus 8 scaffolds.fasta", lang: "bash" },
                { step: 2, title: "Functional annotation", cmd: "conda install -c bioconda eggnog-mapper\ndownload_eggnog_data.py\nemapper.py -i prokka_output/my_genome.faa -o eggnog_results --cpu 8 -m diamond", lang: "bash" }
              ],
              references: [
                { text: "Prokka — Seemann 2014", url: "https://doi.org/10.1093/bioinformatics/btu153" }
              ]
            }
          }
        ]
      },

      // ── 3. TRANSCRIPTOMICS ──
      {
        id: "transcriptomics",
        label: "Transcriptomics",
        icon: "RNA",
        color: "green",
        content: {
          title: "Transcriptomics and Gene Expression Analysis",
          what: "Studies the complete set of RNA transcripts under specific conditions — which genes are active, their expression levels, and how expression changes.",
          tools: [
            { name: "DESeq2", type: "tool", desc: "Differential expression (R/Bioconductor)" },
            { name: "limma-voom", type: "tool", desc: "Linear models for RNA-seq/microarray" },
            { name: "edgeR", type: "tool", desc: "Empirical Bayes DE" },
            { name: "HISAT2", type: "tool", desc: "Splice-aware aligner" },
            { name: "STAR", type: "tool", desc: "Fast RNA-seq aligner" },
            { name: "featureCounts", type: "tool", desc: "Read counting" },
            { name: "clusterProfiler", type: "tool", desc: "GO/KEGG enrichment (R)" }
          ]
        },
        children: [
          {
            id: "rnaseq_pipeline",
            label: "RNA-seq Pipeline",
            icon: "PIP",
            content: {
              title: "RNA-seq Analysis Pipeline",
              what: "End-to-end pipeline: raw FASTQ through QC, alignment, quantification, differential expression, and functional enrichment.",
              pipeline: [
                { name: "QC", tool: "FastQC/fastp" },
                { name: "Trim", tool: "Trimmomatic/fastp" },
                { name: "Align", tool: "HISAT2/STAR" },
                { name: "Count", tool: "featureCounts" },
                { name: "Normalize", tool: "DESeq2" },
                { name: "DE Analysis", tool: "DESeq2/limma" },
                { name: "Enrichment", tool: "clusterProfiler" }
              ],
              workflow: [
                { step: 1, title: "QC and Trimming", cmd: "conda install -c bioconda fastp hisat2 samtools subread\n\nfor sample in sample1 sample2 sample3; do\n  fastp -i ${sample}_R1.fastq.gz -I ${sample}_R2.fastq.gz \\\n    -o ${sample}_trim_R1.fastq.gz -O ${sample}_trim_R2.fastq.gz \\\n    --html ${sample}_fastp.html --thread 4\ndone", lang: "bash" },
                { step: 2, title: "Align with HISAT2", cmd: "for sample in sample1 sample2 sample3; do\n  hisat2 -x genome_index -1 ${sample}_trim_R1.fastq.gz -2 ${sample}_trim_R2.fastq.gz \\\n    -S ${sample}.sam --dta -p 8\n  samtools sort -@ 4 ${sample}.sam -o ${sample}.bam\n  samtools index ${sample}.bam\n  rm ${sample}.sam\ndone", lang: "bash" },
                { step: 3, title: "Count reads", cmd: "featureCounts -a annotation.gtf -o counts.txt -T 8 -p --countReadPairs -s 2 \\\n  sample1.bam sample2.bam sample3.bam control1.bam control2.bam control3.bam", lang: "bash" },
                { step: 4, title: "DESeq2 analysis (R)", cmd: "library(DESeq2)\nlibrary(ggplot2)\nlibrary(pheatmap)\n\ncounts_data <- read.table(\"counts.txt\", header=TRUE, row.names=1, skip=1)\ncounts_data <- counts_data[, 6:ncol(counts_data)]\ncolnames(counts_data) <- gsub(\"\\\\.bam$\", \"\", colnames(counts_data))\n\ncondition <- factor(c(rep(\"treatment\",3), rep(\"control\",3)))\ncoldata <- data.frame(row.names=colnames(counts_data), condition=condition)\n\ndds <- DESeqDataSetFromMatrix(countData=round(counts_data), colData=coldata, design=~condition)\nkeep <- rowSums(counts(dds)) >= 10\ndds <- dds[keep,]\ndds <- DESeq(dds)\nres <- results(dds, contrast=c(\"condition\",\"treatment\",\"control\"), alpha=0.05)\n\nres_sig <- subset(as.data.frame(res), padj < 0.05 & abs(log2FoldChange) > 1)\nwrite.csv(as.data.frame(res), \"deseq2_results.csv\")\nwrite.csv(res_sig, \"deseq2_significant.csv\")", lang: "r" },
                { step: 5, title: "Visualization (R)", cmd: "# Volcano plot\nres_df <- as.data.frame(res)\nres_df$sig <- ifelse(res_df$padj<0.05 & abs(res_df$log2FoldChange)>1,\n  ifelse(res_df$log2FoldChange>1,\"Up\",\"Down\"), \"NS\")\n\nggplot(res_df, aes(x=log2FoldChange, y=-log10(pvalue), color=sig)) +\n  geom_point(alpha=0.6, size=1.5) +\n  scale_color_manual(values=c(Down=\"#3498db\",NS=\"grey70\",Up=\"#e74c3c\")) +\n  theme_minimal() +\n  geom_vline(xintercept=c(-1,1), linetype=\"dashed\") +\n  geom_hline(yintercept=-log10(0.05), linetype=\"dashed\")\n\n# PCA\nvsd <- vst(dds, blind=FALSE)\nplotPCA(vsd, intgroup=\"condition\") + theme_minimal()\n\n# Heatmap top 50\ntop50 <- head(order(res$padj), 50)\nmat <- assay(vsd)[top50,] - rowMeans(assay(vsd)[top50,])\npheatmap(mat, scale=\"row\", annotation_col=coldata)", lang: "r" },
                { step: 6, title: "GO/KEGG Enrichment (R)", cmd: "library(clusterProfiler)\nlibrary(org.Hs.eg.db)\n\ngene_ids <- bitr(rownames(res_sig), fromType=\"ENSEMBL\", toType=\"ENTREZID\", OrgDb=org.Hs.eg.db)\n\ngo_bp <- enrichGO(gene=gene_ids$ENTREZID, OrgDb=org.Hs.eg.db, ont=\"BP\",\n  pAdjustMethod=\"BH\", pvalueCutoff=0.05, readable=TRUE)\n\nkegg <- enrichKEGG(gene=gene_ids$ENTREZID, organism=\"hsa\", pvalueCutoff=0.05)\n\ndotplot(go_bp, showCategory=20)\ndotplot(kegg, showCategory=20)", lang: "r" }
              ],
              interpretation: "DESeq2 uses negative binomial model. padj < 0.05 and |log2FC| > 1 = significant. PCA should show separation between conditions. In volcano plots, upper corners are most significant.",
              errors: [
                { error: "featureCounts: 0% assignment rate", solution: "Wrong strandedness — try -s 0, -s 1, -s 2. Verify GTF matches reference genome version." },
                { error: "DESeq2: every gene has 0 counts", solution: "Check GTF annotation matches reference. Verify BAMs contain mapped reads." }
              ],
              references: [
                { text: "DESeq2 — Love et al. 2014", url: "https://doi.org/10.1186/s13059-014-0550-8" },
                { text: "HISAT2 — Kim et al. 2019", url: "https://doi.org/10.1038/s41587-019-0201-4" },
                { text: "clusterProfiler — Yu et al. 2012", url: "https://doi.org/10.1089/omi.2011.0118" }
              ]
            }
          },
          {
            id: "geo_analysis",
            label: "GEO Data Analysis",
            icon: "GEO",
            content: {
              title: "GEO Data Analysis",
              what: "NCBI Gene Expression Omnibus — public repository of expression data. GEO2R provides online DE analysis; local analysis with GEOquery + limma gives more control.",
              workflow: [
                { step: 1, title: "Online: GEO2R", cmd: "# 1. Go to https://www.ncbi.nlm.nih.gov/geo/\n# 2. Search dataset (e.g., GSE12345)\n# 3. Click 'Analyze with GEO2R'\n# 4. Define groups, assign samples\n# 5. Click 'Top 250' for results\n# 6. Download full table + R script", lang: "bash" },
                { step: 2, title: "Local analysis (R)", cmd: "library(GEOquery)\nlibrary(limma)\n\ngse <- getGEO(\"GSE12345\", GSEMatrix=TRUE)\ndata <- gse[[1]]\nexpr_mat <- exprs(data)\npheno <- pData(data)\n\ngroup <- factor(pheno$`condition:ch1`)\ndesign <- model.matrix(~0+group)\ncolnames(design) <- levels(group)\n\nfit <- lmFit(expr_mat, design)\ncontrast.matrix <- makeContrasts(treatment-control, levels=design)\nfit2 <- contrasts.fit(fit, contrast.matrix)\nfit2 <- eBayes(fit2)\nresults <- topTable(fit2, number=Inf, sort.by=\"P\")\nwrite.csv(results, \"limma_results.csv\")", lang: "r" }
              ],
              references: [
                { text: "GEOquery — Davis & Meltzer 2007", url: "https://doi.org/10.1093/bioinformatics/btm254" },
                { text: "limma — Ritchie et al. 2015", url: "https://doi.org/10.1093/nar/gkv007" }
              ]
            }
          },
          {
            id: "transcriptome_assembly",
            label: "Transcriptome Assembly",
            icon: "TAS",
            content: {
              title: "De Novo Transcriptome Assembly",
              what: "Reconstructs full-length transcripts from RNA-seq reads without a reference genome, using tools like Trinity.",
              workflow: [
                { step: 1, title: "Assemble with Trinity", cmd: "conda install -c bioconda trinity\nTrinity --seqType fq --left trimmed_R1.fastq.gz --right trimmed_R2.fastq.gz \\\n  --CPU 8 --max_memory 50G --output trinity_output\nTrinityStats.pl trinity_output/Trinity.fasta", lang: "bash" },
                { step: 2, title: "Assess and quantify", cmd: "busco -i trinity_output/Trinity.fasta -l metazoa_odb10 -o busco_transcriptome -m transcriptome\n\nconda install -c bioconda salmon\nsalmon index -t trinity_output/Trinity.fasta -i trinity_index\nsalmon quant -i trinity_index -l A -1 trimmed_R1.fastq.gz -2 trimmed_R2.fastq.gz -o salmon_quant -p 8", lang: "bash" }
              ],
              references: [
                { text: "Trinity — Grabherr et al. 2011", url: "https://doi.org/10.1038/nbt.1883" },
                { text: "Salmon — Patro et al. 2017", url: "https://doi.org/10.1038/nmeth.4197" }
              ]
            }
          }
        ]
      },

      // ── 4. PHYLOGENETICS ──
      {
        id: "phylogenetics",
        label: "Phylogenetics",
        icon: "PHY",
        color: "orange",
        content: {
          title: "Phylogenetics and Phylogenomics",
          what: "Study of evolutionary relationships using molecular data. Results depicted as phylogenetic trees. Phylogenomics extends this to whole-genome scale.",
          questions: [
            "How are organisms evolutionarily related?",
            "When did species diverge?",
            "Did horizontal gene transfer occur?",
            "What is the history of a gene family?"
          ],
          tools: [
            { name: "IQ-TREE", type: "tool", desc: "Fast ML tree with model selection" },
            { name: "RAxML-NG", type: "tool", desc: "Maximum Likelihood phylogenetics" },
            { name: "MrBayes", type: "tool", desc: "Bayesian inference" },
            { name: "BEAST2", type: "tool", desc: "Bayesian molecular dating" },
            { name: "FigTree", type: "tool", desc: "Tree visualization" },
            { name: "iTOL", type: "tool", desc: "Interactive Tree Of Life (web)" },
            { name: "ggtree (R)", type: "tool", desc: "Tree visualization in ggplot2" }
          ]
        },
        children: [
          {
            id: "tree_construction",
            label: "Tree Construction",
            icon: "TRE",
            content: {
              title: "Phylogenetic Tree Construction",
              what: "Trees built using distance methods (NJ, UPGMA), maximum parsimony, maximum likelihood (IQ-TREE, RAxML), or Bayesian inference (MrBayes, BEAST).",
              algorithms: [
                { name: "Neighbor-Joining", desc: "Distance-based, no molecular clock assumption. Fast, good for initial analysis. See: Saitou & Nei 1987." },
                { name: "Maximum Likelihood", desc: "Finds tree maximizing P(data|tree,model). Gold standard. See: Felsenstein 1981." },
                { name: "Bayesian Inference", desc: "MCMC sampling of tree space; posterior probabilities as support. See: Huelsenbeck & Ronquist 2001." }
              ],
              math: [
                "Jukes-Cantor: d = -3/4 * ln(1 - 4p/3)",
                "Kimura 2-parameter: d = -1/2*ln(1-2P-Q) - 1/4*ln(1-2Q)",
                "ML: L(T,theta) = P(D|T,theta) — maximize over tree T and parameters",
                "Bootstrap: resample alignment columns with replacement, rebuild tree, report % support"
              ],
              workflow: [
                { step: 1, title: "Prepare alignment", cmd: "mafft --auto sequences.fasta > aligned.fasta\ntrimal -in aligned.fasta -out trimmed.fasta -automated1", lang: "bash" },
                { step: 2, title: "Build tree with IQ-TREE", cmd: "conda install -c bioconda iqtree\niqtree -s trimmed.fasta -m MFP -bb 1000 -alrt 1000 -nt AUTO -pre phylo\n\n# MFP = automatic model selection\n# -bb 1000 = ultrafast bootstrap\n# Output: phylo.treefile (Newick), phylo.iqtree (report)", lang: "bash" },
                { step: 3, title: "RAxML-NG alternative", cmd: "conda install -c bioconda raxml-ng\nraxml-ng --all --msa trimmed.fasta --model GTR+G --bs-trees 100 --threads 4 --prefix raxml", lang: "bash" },
                { step: 4, title: "Visualize", cmd: "# FigTree: http://tree.bio.ed.ac.uk/software/figtree/\n# iTOL: https://itol.embl.de/ — upload .treefile\n# R: ggtree\nlibrary(ggtree)\ntree <- read.tree(\"phylo.treefile\")\nggtree(tree) + geom_tiplab(size=3) + theme_tree2()", lang: "r" }
              ],
              interpretation: "Bootstrap >= 70% (ML) or posterior probability >= 0.95 (Bayesian) = well-supported. Use ModelFinder for appropriate substitution model. Long branches may indicate rapid evolution or artifacts. Root with an outgroup.",
              errors: [
                { error: "Too many identical sequences", solution: "Remove duplicates with CD-HIT: cd-hit -i seqs.fasta -o unique.fasta -c 0.99" },
                { error: "Illegal characters in names", solution: "Remove spaces/colons/parentheses: sed 's/[^a-zA-Z0-9_]/_/g'" }
              ],
              references: [
                { text: "IQ-TREE — Nguyen et al. 2015", url: "https://doi.org/10.1093/molbev/msu300" },
                { text: "RAxML — Stamatakis 2014", url: "https://doi.org/10.1093/bioinformatics/btu033" },
                { text: "Neighbor-Joining — Saitou & Nei 1987", url: "https://doi.org/10.1093/oxfordjournals.molbev.a040454" },
                { text: "Felsenstein 1985 (bootstrap)", url: "https://doi.org/10.1111/j.1558-5646.1985.tb00420.x" }
              ]
            }
          },
          {
            id: "molecular_dating",
            label: "Molecular Dating",
            icon: "CLK",
            content: {
              title: "Molecular Dating and Divergence Times",
              what: "Estimates when lineages diverged using molecular clock models combined with fossil calibrations.",
              tools: [
                { name: "BEAST2", type: "tool", desc: "Bayesian dating with relaxed clocks" },
                { name: "MCMCTree (PAML)", type: "tool", desc: "Bayesian dating in PAML" },
                { name: "RelTime (MEGA)", type: "tool", desc: "Relative time estimation" }
              ],
              references: [
                { text: "BEAST2 — Bouckaert et al. 2019", url: "https://doi.org/10.1371/journal.pcbi.1006650" },
                { text: "Molecular clock review — Ho & Duchene 2014", url: "https://doi.org/10.1111/brv.12020" }
              ]
            }
          },
          {
            id: "hgt_detection",
            label: "Horizontal Gene Transfer",
            icon: "HGT",
            content: {
              title: "Horizontal Gene Transfer Detection",
              what: "HGT is transfer of genetic material between organisms outside vertical inheritance. Common in prokaryotes. Detected via phylogenetic incongruence, compositional analysis, or comparative genomics.",
              tools: [
                { name: "IslandViewer", type: "tool", desc: "Genomic island prediction (web)" },
                { name: "Alien_hunter", type: "tool", desc: "Compositional bias detection" },
                { name: "T-REX", type: "tool", desc: "Tree comparison for HGT" }
              ],
              workflow: [
                { step: 1, title: "Compositional analysis", cmd: "# Genes acquired by HGT often have atypical GC content\npython3 << 'EOF'\nfrom Bio import SeqIO\ngenome = SeqIO.read('genome.fasta', 'fasta')\nwindow, step = 1000, 500\nfor i in range(0, len(genome.seq)-window, step):\n    sub = str(genome.seq[i:i+window]).upper()\n    gc = sum(1 for b in sub if b in 'GC') / len(sub) * 100\n    print(f'{i}\\t{gc:.2f}')\nEOF", lang: "bash" }
              ],
              references: [
                { text: "HGT review — Soucy et al. 2015", url: "https://doi.org/10.1038/nrg3962" },
                { text: "IslandViewer", url: "https://www.pathogenomics.sfu.ca/islandviewer/" }
              ]
            }
          }
        ]
      },

      // ── 5. METAGENOMICS ──
      {
        id: "metagenomics",
        label: "Metagenomics",
        icon: "MET",
        color: "pink",
        content: {
          title: "Metagenomics and Microbial Analysis",
          what: "Studies genetic material from environmental/clinical samples to analyze microbial community composition, diversity, and function without culturing.",
          tools: [
            { name: "QIIME2", type: "tool", desc: "Comprehensive microbiome platform" },
            { name: "Kraken2", type: "tool", desc: "Taxonomic classification" },
            { name: "MetaPhlAn4", type: "tool", desc: "Marker-based profiling" },
            { name: "HUMAnN3", type: "tool", desc: "Functional profiling" },
            { name: "DADA2", type: "tool", desc: "ASV inference from amplicon data" },
            { name: "phyloseq (R)", type: "tool", desc: "Microbiome analysis in R" }
          ]
        },
        children: [
          {
            id: "amplicon_16s",
            label: "16S rRNA Analysis",
            icon: "16S",
            content: {
              title: "16S rRNA Amplicon Analysis",
              what: "Targets bacterial 16S rRNA gene variable regions (V3-V4 most common) to identify and classify bacteria. Uses ASV or OTU approaches.",
              workflow: [
                { step: 1, title: "Import data (QIIME2)", cmd: "qiime tools import \\\n  --type 'SampleData[PairedEndSequencesWithQuality]' \\\n  --input-path manifest.tsv \\\n  --output-path demux.qza \\\n  --input-format PairedEndFastqManifestPhred33V2", lang: "bash" },
                { step: 2, title: "Denoise with DADA2", cmd: "qiime dada2 denoise-paired --i-demultiplexed-seqs demux.qza \\\n  --p-trim-left-f 17 --p-trim-left-r 21 \\\n  --p-trunc-len-f 250 --p-trunc-len-r 200 \\\n  --p-n-threads 8 \\\n  --o-table table.qza --o-representative-sequences rep-seqs.qza \\\n  --o-denoising-stats stats.qza", lang: "bash" },
                { step: 3, title: "Taxonomy and diversity", cmd: "# Classify\nqiime feature-classifier classify-sklearn \\\n  --i-classifier silva-138-99-nb-classifier.qza \\\n  --i-reads rep-seqs.qza --o-classification taxonomy.qza\n\n# Build tree\nqiime phylogeny align-to-tree-mafft-fasttree \\\n  --i-sequences rep-seqs.qza \\\n  --o-rooted-tree rooted-tree.qza --o-alignment aligned.qza \\\n  --o-masked-alignment masked.qza --o-tree unrooted.qza\n\n# Core diversity\nqiime diversity core-metrics-phylogenetic \\\n  --i-phylogeny rooted-tree.qza --i-table table.qza \\\n  --p-sampling-depth 10000 --m-metadata-file metadata.tsv \\\n  --output-dir diversity-results", lang: "bash" }
              ],
              interpretation: "Alpha diversity (Shannon, Chao1) = within-sample diversity. Beta diversity (UniFrac, Bray-Curtis) = between-sample differences. PERMANOVA p<0.05 = significant community differences. Rarefaction curves should plateau.",
              references: [
                { text: "QIIME2 — Bolyen et al. 2019", url: "https://doi.org/10.1038/s41587-019-0209-9" },
                { text: "DADA2 — Callahan et al. 2016", url: "https://doi.org/10.1038/nmeth.3869" }
              ]
            }
          },
          {
            id: "shotgun_metagenomics",
            label: "Shotgun Metagenomics",
            icon: "SHO",
            content: {
              title: "Shotgun Metagenomics",
              what: "Sequences all DNA in a sample (not just marker genes), providing taxonomic and functional profiles at higher resolution.",
              workflow: [
                { step: 1, title: "Taxonomic profiling", cmd: "conda install -c bioconda kraken2 bracken\nkraken2 --db kraken2_db --paired reads_R1.fastq.gz reads_R2.fastq.gz \\\n  --output kraken_out.txt --report kraken_report.txt --threads 8\nbracken -d kraken2_db -i kraken_report.txt -o bracken_out.txt -r 150 -l S", lang: "bash" },
                { step: 2, title: "Functional profiling", cmd: "conda install -c bioconda humann\nhumann --input reads.fastq.gz --output humann_output/ --threads 8\n# Outputs: genefamilies.tsv, pathabundance.tsv, pathcoverage.tsv", lang: "bash" }
              ],
              references: [
                { text: "Kraken2 — Wood et al. 2019", url: "https://doi.org/10.1186/s13059-019-1891-0" },
                { text: "HUMAnN3 — Beghini et al. 2021", url: "https://doi.org/10.7554/eLife.65088" }
              ]
            }
          }
        ]
      },

      // ── 6. COMPARATIVE GENOMICS ──
      {
        id: "comparative_genomics",
        label: "Comparative Genomics",
        icon: "CMP",
        color: "red",
        content: {
          title: "Comparative Genomics",
          what: "Compares genome structure and content across species or strains to understand evolution, identify conserved elements, and find lineage-specific genes.",
          tools: [
            { name: "OrthoFinder", type: "tool", desc: "Ortholog inference" },
            { name: "Roary", type: "tool", desc: "Pan-genome analysis" },
            { name: "MUMmer", type: "tool", desc: "Whole-genome alignment" },
            { name: "pyani", type: "tool", desc: "ANI calculation" }
          ]
        },
        children: [
          {
            id: "pan_genome",
            label: "Pan-genome Analysis",
            icon: "PAN",
            content: {
              title: "Pan-genome Analysis",
              what: "Determines core genome (shared by all strains), accessory genome (some strains), and unique genes in a collection of related genomes.",
              workflow: [
                { step: 1, title: "Annotate genomes", cmd: "for genome in genomes/*.fasta; do\n  name=$(basename $genome .fasta)\n  prokka --outdir prokka_${name} --prefix ${name} --cpus 4 $genome\ndone", lang: "bash" },
                { step: 2, title: "Run Roary", cmd: "conda install -c bioconda roary\nmkdir gff_files && cp prokka_*/*.gff gff_files/\nroary -e -n -p 8 -f roary_output -i 95 gff_files/*.gff", lang: "bash" }
              ],
              interpretation: "Core genes (>=99% of genomes) = essential functions. Shell genes (15-95%) = niche adaptation. Cloud genes (<15%) = mobile/strain-specific. Open pan-genome: new genes keep appearing with each genome.",
              references: [
                { text: "Roary — Page et al. 2015", url: "https://doi.org/10.1093/bioinformatics/btv421" }
              ]
            }
          },
          {
            id: "whole_genome_alignment",
            label: "Genome Alignment",
            icon: "WGA",
            content: {
              title: "Whole Genome Alignment and Synteny",
              what: "Compares entire genomes to identify homologous regions, rearrangements, inversions, and syntenic blocks.",
              workflow: [
                { step: 1, title: "ANI calculation", cmd: "pip install pyani\naverage_nucleotide_identity.py -i genomes_dir/ -o ani_output/ -m ANIb -g\n# ANI > 95-96% = same species", lang: "bash" },
                { step: 2, title: "MUMmer alignment", cmd: "conda install -c bioconda mummer\nnucmer --prefix=alignment reference.fasta query.fasta\ndelta-filter -1 alignment.delta > filtered.delta\nshow-coords -rcl filtered.delta > alignment.coords\nmummerplot --png --large -p dotplot filtered.delta", lang: "bash" }
              ],
              interpretation: "In dot plots: diagonal lines = synteny, breaks = rearrangements, opposite-direction lines = inversions. ANI >95% is the prokaryotic species boundary.",
              references: [
                { text: "MUMmer — Kurtz et al. 2004", url: "https://doi.org/10.1186/gb-2004-5-2-r12" },
                { text: "ANI — Goris et al. 2007", url: "https://doi.org/10.1099/ijs.0.64483-0" }
              ]
            }
          },
          {
            id: "ortholog_analysis",
            label: "Ortholog Analysis",
            icon: "ORT",
            content: {
              title: "Ortholog and Paralog Analysis",
              what: "Orthologs: genes in different species from common ancestor (speciation). Paralogs: gene duplication within a species. Critical for functional annotation transfer.",
              workflow: [
                { step: 1, title: "OrthoFinder", cmd: "conda install -c bioconda orthofinder\nmkdir proteomes && cp prokka_*/*.faa proteomes/\northofinder -f proteomes/ -t 8 -a 4", lang: "bash" }
              ],
              references: [
                { text: "OrthoFinder — Emms & Kelly 2019", url: "https://doi.org/10.1186/s13059-019-1832-y" }
              ]
            }
          }
        ]
      },

      // ── 7. STRUCTURAL BIOINFORMATICS ──
      {
        id: "structural_bioinfo",
        label: "Structural Bioinformatics",
        icon: "STR",
        color: "cyan",
        content: {
          title: "Structural Bioinformatics",
          what: "Analysis and prediction of 3D structures of biological macromolecules. Understanding structure explains function and enables drug design.",
          tools: [
            { name: "AlphaFold2", type: "tool", desc: "Deep learning structure prediction" },
            { name: "PyMOL", type: "tool", desc: "Molecular visualization" },
            { name: "ChimeraX", type: "tool", desc: "UCSF visualization and analysis" },
            { name: "Swiss-Model", type: "tool", desc: "Homology modeling server" },
            { name: "AutoDock Vina", type: "tool", desc: "Molecular docking" },
            { name: "GROMACS", type: "tool", desc: "Molecular dynamics simulations" }
          ],
          databases: [
            { name: "PDB", type: "db", desc: "Protein Data Bank — experimental structures" },
            { name: "AlphaFold DB", type: "db", desc: "Predicted structures" },
            { name: "SCOP/CATH", type: "db", desc: "Structural classification" }
          ]
        },
        children: [
          {
            id: "structure_prediction",
            label: "Structure Prediction",
            icon: "PRD",
            content: {
              title: "Protein Structure Prediction",
              what: "Determines 3D fold from amino acid sequence via homology modeling, ab initio, or deep learning (AlphaFold2).",
              workflow: [
                { step: 1, title: "AlphaFold / ColabFold", cmd: "# Easiest: ColabFold notebook\n# https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb\n# Paste sequence, run all cells, download PDB + confidence scores\n\n# Local:\nconda install -c conda-forge -c bioconda colabfold\ncolabfold_batch input.fasta output_dir/\n\n# Pre-computed: https://alphafold.ebi.ac.uk/ — search by UniProt ID", lang: "bash" },
                { step: 2, title: "Visualize with PyMOL", cmd: "conda install -c conda-forge pymol-open-source\npymol predicted.pdb\n\n# Color by confidence (B-factor)\n# spectrum b, blue_red, minimum=0, maximum=100\n# show surface; set transparency, 0.5\n# ray 2400, 1800; png structure.png, dpi=300", lang: "bash" }
              ],
              interpretation: "AlphaFold pLDDT: >90 very high confidence, 70-90 confident, 50-70 low, <50 likely disordered. For homology models: GMQE >0.7 is good. Always validate with experimental data when possible.",
              references: [
                { text: "AlphaFold2 — Jumper et al. 2021 (Nature)", url: "https://doi.org/10.1038/s41586-021-03819-2" },
                { text: "ColabFold — Mirdita et al. 2022", url: "https://doi.org/10.1038/s41592-022-01488-1" }
              ]
            }
          },
          {
            id: "molecular_docking",
            label: "Molecular Docking",
            icon: "DOC",
            content: {
              title: "Molecular Docking",
              what: "Predicts how a small molecule (drug) binds to a protein receptor. Fundamental to computer-aided drug discovery.",
              workflow: [
                { step: 1, title: "Prepare receptor and ligand", cmd: "conda install -c conda-forge -c bioconda autodock-vina openbabel\n\n# Clean protein\nobabel 1AKE.pdb -O receptor.pdbqt -xh\n\n# Prepare ligand\nobabel ligand.sdf -O ligand.pdbqt --gen3d -h", lang: "bash" },
                { step: 2, title: "Run docking", cmd: "cat > config.txt << EOF\nreceptor = receptor.pdbqt\nligand = ligand.pdbqt\nout = results.pdbqt\ncenter_x = 10.0\ncenter_y = 20.0\ncenter_z = 30.0\nsize_x = 25\nsize_y = 25\nsize_z = 25\nexhaustiveness = 32\nnum_modes = 10\nEOF\n\nvina --config config.txt", lang: "bash" },
                { step: 3, title: "Analyze", cmd: "vina_split --input results.pdbqt\n# Visualize in PyMOL: pymol receptor.pdb results_1.pdbqt\n# Interaction analysis: https://plip-tool.biotec.tu-dresden.de/", lang: "bash" }
              ],
              interpretation: "Affinity (kcal/mol): more negative = stronger. -7 to -10 suggests good binding. Low RMSD between poses = consistent prediction. Validate computationally promising hits experimentally.",
              references: [
                { text: "AutoDock Vina — Trott & Olson 2010", url: "https://doi.org/10.1002/jcc.21334" },
                { text: "PLIP — Adasme et al. 2021", url: "https://doi.org/10.1093/nar/gkab294" }
              ]
            }
          },
          {
            id: "md_simulations",
            label: "Molecular Dynamics",
            icon: "MD",
            content: {
              title: "Molecular Dynamics Simulations",
              what: "Simulates physical movements of atoms over time via Newton's equations. Reveals protein dynamics, conformational changes, and stability.",
              math: [
                "F = ma, specifically: m_i(d^2r_i/dt^2) = -nabla V(r1,...,rN)",
                "Lennard-Jones: V(r) = 4*epsilon*[(sigma/r)^12 - (sigma/r)^6]",
                "RMSD: sqrt(1/N * sum(||r_i(t) - r_i(ref)||^2))"
              ],
              workflow: [
                { step: 1, title: "GROMACS setup", cmd: "conda install -c conda-forge -c bioconda gromacs\n\ngmx pdb2gmx -f protein.pdb -o processed.gro -water spce -ff amber99sb-ildn\ngmx editconf -f processed.gro -o boxed.gro -c -d 1.0 -bt cubic\ngmx solvate -cp boxed.gro -cs spc216.gro -o solvated.gro -p topol.top\n\n# Add ions\ngmx grompp -f ions.mdp -c solvated.gro -p topol.top -o ions.tpr\ngmx genion -s ions.tpr -o solv_ions.gro -p topol.top -pname NA -nname CL -neutral", lang: "bash" },
                { step: 2, title: "Minimize, equilibrate, run", cmd: "# Energy minimization\ngmx grompp -f minim.mdp -c solv_ions.gro -p topol.top -o em.tpr\ngmx mdrun -v -deffnm em\n\n# NVT equilibration\ngmx grompp -f nvt.mdp -c em.gro -r em.gro -p topol.top -o nvt.tpr\ngmx mdrun -deffnm nvt\n\n# NPT equilibration\ngmx grompp -f npt.mdp -c nvt.gro -r nvt.gro -t nvt.cpt -p topol.top -o npt.tpr\ngmx mdrun -deffnm npt\n\n# Production (100 ns)\ngmx grompp -f md.mdp -c npt.gro -t npt.cpt -p topol.top -o md.tpr\ngmx mdrun -deffnm md", lang: "bash" },
                { step: 3, title: "Analysis", cmd: "gmx rms -s md.tpr -f md.xtc -o rmsd.xvg -tu ns\ngmx rmsf -s md.tpr -f md.xtc -o rmsf.xvg -res\ngmx gyrate -s md.tpr -f md.xtc -o gyrate.xvg", lang: "bash" }
              ],
              interpretation: "RMSD should plateau indicating equilibration (typical 1-3 A for proteins). High RMSF = flexible regions. Stable radius of gyration = protein maintains fold. Run multiple replicates (n>=3).",
              references: [
                { text: "GROMACS — Abraham et al. 2015", url: "https://doi.org/10.1016/j.softx.2015.06.001" },
                { text: "GROMACS tutorials — Justin Lemkul", url: "http://www.mdtutorials.com/gmx/" }
              ]
            }
          }
        ]
      },

      // ── 8. PROTEOMICS ──
      {
        id: "proteomics",
        label: "Proteomics",
        icon: "PRO",
        color: "purple",
        content: {
          title: "Proteomics",
          what: "Large-scale study of proteins — expression, structure, function, interactions, and modifications. Mass spectrometry is the primary technology.",
          tools: [
            { name: "MaxQuant", type: "tool", desc: "Quantitative MS proteomics" },
            { name: "Perseus", type: "tool", desc: "Statistical analysis" },
            { name: "MSFragger", type: "tool", desc: "Ultra-fast peptide ID" },
            { name: "STRING", type: "tool", desc: "PPI networks" },
            { name: "Cytoscape", type: "tool", desc: "Network visualization" }
          ],
          databases: [
            { name: "UniProt", type: "db", desc: "Protein sequences" },
            { name: "PRIDE", type: "db", desc: "Proteomics data repository" },
            { name: "STRING", type: "db", desc: "Protein interactions" }
          ]
        },
        children: [
          {
            id: "ms_proteomics",
            label: "MS Proteomics",
            icon: "MS",
            content: {
              title: "Mass Spectrometry Proteomics",
              what: "Identifies and quantifies proteins by measuring mass-to-charge ratios of peptide ions.",
              workflow: [
                { step: 1, title: "MaxQuant analysis", cmd: "# GUI-based: https://www.maxquant.org/\n# Steps: Load .raw files, set UniProt FASTA database\n# Configure: Trypsin, Carbamidomethyl(C), Oxidation(M)\n# FDR 1%, LFQ enabled\n# Output: proteinGroups.txt", lang: "bash" },
                { step: 2, title: "Statistical analysis (R)", cmd: "library(limma)\npg <- read.delim(\"proteinGroups.txt\")\npg <- pg[pg$Reverse!=\"+\" & pg$Potential.contaminant!=\"+\",]\n\nlfq <- pg[, grep(\"LFQ.intensity.\", colnames(pg))]\nlfq_log <- log2(lfq)\nlfq_log[is.infinite(as.matrix(lfq_log))] <- NA\n\n# Filter: >=2 valid values per group\nvalid <- rowSums(!is.na(lfq_log[,1:3]))>=2 & rowSums(!is.na(lfq_log[,4:6]))>=2\nlfq_f <- lfq_log[valid,]\n\ngroup <- factor(c(rep(\"treatment\",3), rep(\"control\",3)))\ndesign <- model.matrix(~0+group)\nfit <- lmFit(lfq_f, design)\ncontrast <- makeContrasts(grouptreatment-groupcontrol, levels=design)\nfit2 <- eBayes(contrasts.fit(fit, contrast))\nresults <- topTable(fit2, number=Inf)\nwrite.csv(results, \"proteomics_DE.csv\")", lang: "r" }
              ],
              references: [
                { text: "MaxQuant — Cox & Mann 2008", url: "https://doi.org/10.1038/nbt.1511" }
              ]
            }
          },
          {
            id: "ppi_networks",
            label: "PPI Networks",
            icon: "NET",
            content: {
              title: "Protein-Protein Interaction Networks",
              what: "Maps physical and functional interactions between proteins, revealing complexes, pathways, and hub proteins.",
              workflow: [
                { step: 1, title: "STRING and Cytoscape", cmd: "# STRING: https://string-db.org/\n# Enter proteins, set confidence >= 0.7\n# Export TSV for Cytoscape\n\n# Cytoscape: https://cytoscape.org/\n# Import network, install MCODE/ClusterONE\n# Tools > NetworkAnalyzer > identify hubs\n# Apps > MCODE > find clusters", lang: "bash" }
              ],
              references: [
                { text: "STRING — Szklarczyk et al. 2021", url: "https://doi.org/10.1093/nar/gkaa1074" },
                { text: "Cytoscape — Shannon et al. 2003", url: "https://doi.org/10.1101/gr.1239303" }
              ]
            }
          }
        ]
      },

      // ── 9. SYSTEMS BIOLOGY ──
      {
        id: "systems_biology",
        label: "Systems Biology",
        icon: "SYS",
        color: "teal",
        content: {
          title: "Systems Biology and Pathway Analysis",
          what: "Integrates multi-omics data to understand biological systems holistically — networks, pathways, and emergent properties.",
          tools: [
            { name: "clusterProfiler", type: "tool", desc: "GO/KEGG enrichment" },
            { name: "GSEA", type: "tool", desc: "Gene Set Enrichment Analysis" },
            { name: "Pathview", type: "tool", desc: "KEGG pathway visualization" },
            { name: "WGCNA", type: "tool", desc: "Co-expression network analysis" },
            { name: "Reactome", type: "tool", desc: "Pathway database" }
          ]
        },
        children: [
          {
            id: "pathway_enrichment",
            label: "Pathway Enrichment",
            icon: "PTH",
            content: {
              title: "Pathway and GO Enrichment Analysis",
              what: "Tests whether predefined gene sets (GO terms, KEGG pathways) are over-represented in a gene list, providing biological context.",
              workflow: [
                { step: 1, title: "ORA and GSEA (R)", cmd: "library(clusterProfiler)\nlibrary(org.Hs.eg.db)\n\n# Over-representation\ngo <- enrichGO(gene=entrez_ids, OrgDb=org.Hs.eg.db, ont=\"BP\", pvalueCutoff=0.05)\nkegg <- enrichKEGG(gene=entrez_ids, organism=\"hsa\", pvalueCutoff=0.05)\n\n# GSEA (all genes ranked by fold change)\ngene_list <- sort(setNames(res$log2FoldChange, rownames(res)), decreasing=TRUE)\ngsea <- gseGO(geneList=gene_list, OrgDb=org.Hs.eg.db, ont=\"BP\", pvalueCutoff=0.05)\n\ndotplot(go, showCategory=20)\ndotplot(kegg, showCategory=20)", lang: "r" },
                { step: 2, title: "Pathview visualization", cmd: "library(pathview)\npathview(gene.data=gene_list_entrez, pathway.id=\"hsa04110\", species=\"hsa\")", lang: "r" }
              ],
              interpretation: "ORA tests over-representation in DE gene list. GSEA uses all genes ranked — more powerful. Low adjusted p-values and high gene ratios indicate meaningful enrichment.",
              references: [
                { text: "clusterProfiler — Yu et al. 2012", url: "https://doi.org/10.1089/omi.2011.0118" },
                { text: "GSEA — Subramanian et al. 2005", url: "https://doi.org/10.1073/pnas.0506580102" }
              ]
            }
          },
          {
            id: "wgcna",
            label: "WGCNA",
            icon: "WGC",
            content: {
              title: "Weighted Gene Co-expression Network Analysis",
              what: "Identifies modules of co-expressed genes and relates them to external traits. Finds hub genes within each module.",
              workflow: [
                { step: 1, title: "WGCNA (R)", cmd: "library(WGCNA)\noptions(stringsAsFactors=FALSE)\nallowWGCNAThreads()\n\ndatExpr <- t(normalized_counts)\n\n# Choose soft threshold\npowers <- c(1:20)\nsft <- pickSoftThreshold(datExpr, powerVector=powers)\n# Plot R^2 vs power, choose first value where R^2 > 0.85\n\n# Build network\nnet <- blockwiseModules(datExpr, power=6, TOMType='unsigned',\n  minModuleSize=30, mergeCutHeight=0.25, numericLabels=TRUE, verbose=3)\n\n# Correlate modules with traits\nMEs <- net$MEs\nmoduleTraitCor <- cor(MEs, traits, use='p')\nmoduleTraitPvalue <- corPvalueStudent(moduleTraitCor, nrow(datExpr))", lang: "r" }
              ],
              references: [
                { text: "WGCNA — Langfelder & Horvath 2008", url: "https://doi.org/10.1186/1471-2105-9-559" }
              ]
            }
          }
        ]
      },

      // ── 10. FUNCTIONAL GENOMICS ──
      {
        id: "functional_genomics",
        label: "Functional Genomics",
        icon: "FUN",
        color: "red",
        content: {
          title: "Functional Genomics",
          what: "High-throughput approaches to understand gene function, regulation, and interactions — ChIP-seq, ATAC-seq, epigenomics.",
          tools: [
            { name: "MACS2", type: "tool", desc: "ChIP-seq peak calling" },
            { name: "deepTools", type: "tool", desc: "NGS visualization (heatmaps, profiles)" },
            { name: "Homer", type: "tool", desc: "Motif discovery" },
            { name: "Bismark", type: "tool", desc: "DNA methylation (bisulfite-seq)" }
          ]
        },
        children: [
          {
            id: "chipseq",
            label: "ChIP-seq Analysis",
            icon: "CHP",
            content: {
              title: "ChIP-seq Analysis",
              what: "Identifies genome-wide binding sites of transcription factors or histone modifications.",
              workflow: [
                { step: 1, title: "Align and call peaks", cmd: "conda install -c bioconda bowtie2 samtools macs2 deeptools homer\n\n# Align\nbowtie2 -x genome_index -1 chip_R1.fastq.gz -2 chip_R2.fastq.gz -p 8 | samtools sort -o chip.bam\nbowtie2 -x genome_index -1 input_R1.fastq.gz -2 input_R2.fastq.gz -p 8 | samtools sort -o input.bam\nsamtools index chip.bam input.bam\n\n# Dedup\nsamtools markdup -r chip.bam chip_dedup.bam\nsamtools markdup -r input.bam input_dedup.bam\n\n# Call peaks\nmacs2 callpeak -t chip_dedup.bam -c input_dedup.bam -f BAMPE -g hs \\\n  --outdir macs2_output -n my_chip -q 0.05", lang: "bash" },
                { step: 2, title: "Visualization and motifs", cmd: "# Heatmap\ncomputeMatrix reference-point -S chip.bw -R peaks.bed \\\n  --referencePoint center -b 3000 -a 3000 -o matrix.gz\nplotHeatmap -m matrix.gz -out heatmap.png --colorMap RdYlBu\n\n# Motif discovery\nfindMotifsGenome.pl macs2_output/my_chip_peaks.narrowPeak hg38 homer_output/ -size 200", lang: "bash" }
              ],
              references: [
                { text: "MACS2 — Zhang et al. 2008", url: "https://doi.org/10.1186/gb-2008-9-9-r137" },
                { text: "ENCODE ChIP-seq guidelines", url: "https://www.encodeproject.org/chip-seq/" }
              ]
            }
          }
        ]
      },

      // ── 11. MACHINE LEARNING ──
      {
        id: "bioinfo_ml",
        label: "Machine Learning in Bio",
        icon: "ML",
        color: "yellow",
        content: {
          title: "Machine Learning in Bioinformatics",
          what: "ML/DL methods used for protein structure prediction, variant pathogenicity, tumor classification, drug response prediction, and biomarker discovery.",
          tools: [
            { name: "scikit-learn", type: "lang", desc: "Classical ML in Python" },
            { name: "TensorFlow/Keras", type: "lang", desc: "Deep learning" },
            { name: "PyTorch", type: "lang", desc: "Deep learning" },
            { name: "AlphaFold2", type: "tool", desc: "DL structure prediction" },
            { name: "DeepVariant", type: "tool", desc: "DL variant calling" },
            { name: "CADD", type: "tool", desc: "Variant pathogenicity scoring" }
          ],
          references: [
            { text: "ML in genomics review — Eraslan et al. 2019", url: "https://doi.org/10.1038/s41576-019-0122-6" },
            { text: "Deep learning in biology — Ching et al. 2018", url: "https://doi.org/10.1098/rsif.2017.0387" }
          ]
        },
        children: []
      },

      // ── 12. CLINICAL BIOINFORMATICS ──
      {
        id: "clinical_bioinfo",
        label: "Clinical Bioinformatics",
        icon: "CLN",
        color: "red",
        content: {
          title: "Clinical and Medical Bioinformatics",
          what: "Applies computational methods to clinical data — rare disease diagnosis, cancer genomics, pharmacogenomics.",
          tools: [
            { name: "ClinVar", type: "db", desc: "Clinical variant database" },
            { name: "OMIM", type: "db", desc: "Mendelian inheritance database" },
            { name: "PharmGKB", type: "db", desc: "Pharmacogenomics knowledge" },
            { name: "cBioPortal", type: "db", desc: "Cancer genomics portal" },
            { name: "COSMIC", type: "db", desc: "Somatic mutations in cancer" },
            { name: "VEP", type: "tool", desc: "Variant Effect Predictor" },
            { name: "InterVar", type: "tool", desc: "ACMG variant classification" }
          ],
          references: [
            { text: "ACMG variant guidelines — Richards et al. 2015", url: "https://doi.org/10.1038/gim.2015.30" },
            { text: "ClinVar", url: "https://www.ncbi.nlm.nih.gov/clinvar/" }
          ]
        },
        children: []
      }
    ]
  };


  // ==============================================================
  //  SECTION 2: UTILITY HELPERS
  // ==============================================================

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function flattenTree(node, path = []) {
    const currentPath = [...path, node.label];
    const items = [{ ...node, path: currentPath }];
    if (node.children) {
      for (const child of node.children) {
        items.push(...flattenTree(child, currentPath));
      }
    }
    return items;
  }

  function countStats(node) {
    let topics = 0, tools = 0, workflows = 0;
    function walk(n) {
      topics++;
      if (n.content) {
        if (n.content.tools) tools += n.content.tools.length;
        if (n.content.databases) tools += n.content.databases.length;
        if (n.content.workflow) workflows++;
      }
      if (n.children) n.children.forEach(walk);
    }
    walk(node);
    return { topics, tools, workflows };
  }


  // ==============================================================
  //  SECTION 3: STATE
  // ==============================================================

  const state = {
    activeNodeId: "root",
    expandedNodes: new Set(["root"]),
    theme: localStorage.getItem("bioinfo-theme") || "dark",
    flatNodes: flattenTree(KNOWLEDGE_TREE),
    sidebarWidth: parseInt(localStorage.getItem("bioinfo-sidebar-w") || "360", 10)
  };

  function findNode(id, node = KNOWLEDGE_TREE) {
    if (node.id === id) return node;
    if (node.children) {
      for (const c of node.children) {
        const found = findNode(id, c);
        if (found) return found;
      }
    }
    return null;
  }

  function getAncestry(id, node = KNOWLEDGE_TREE, path = []) {
    if (node.id === id) return [...path, node];
    if (node.children) {
      for (const c of node.children) {
        const res = getAncestry(id, c, [...path, node]);
        if (res) return res;
      }
    }
    return null;
  }


  // ==============================================================
  //  SECTION 4: THEME
  // ==============================================================

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bioinfo-theme", theme);
  }


  // ==============================================================
  //  SECTION 5: SIDEBAR TREE
  // ==============================================================

  const treeContainer = $("#treeContainer");

  function renderTree() {
    treeContainer.innerHTML = "";
    renderTreeNode(KNOWLEDGE_TREE, treeContainer, 0);
  }

  function renderTreeNode(node, parentEl, depth) {
    const div = document.createElement("div");
    div.className = "tree-node";
    div.dataset.id = node.id;

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = state.expandedNodes.has(node.id);
    const isActive = state.activeNodeId === node.id;

    const header = document.createElement("div");
    header.className = "tree-node-header" + (isActive ? " active" : "");
    header.style.setProperty("--depth", depth);
    if (node.color) header.dataset.color = node.color;

    const toggle = document.createElement("span");
    toggle.className = "tree-toggle" + (hasChildren ? (isExpanded ? " expanded" : "") : " leaf");
    toggle.innerHTML = "&#9654;";
    header.appendChild(toggle);

    const icon = document.createElement("span");
    icon.className = "node-icon";
    icon.textContent = node.icon || "---";
    header.appendChild(icon);

    const label = document.createElement("span");
    label.className = "node-label";
    label.textContent = node.label;
    header.appendChild(label);

    if (hasChildren) {
      const badge = document.createElement("span");
      badge.className = "node-badge";
      badge.textContent = node.children.length;
      header.appendChild(badge);
    }

    header.addEventListener("click", (e) => {
      e.stopPropagation();
      if (hasChildren) {
        if (state.expandedNodes.has(node.id)) {
          state.expandedNodes.delete(node.id);
        } else {
          state.expandedNodes.add(node.id);
        }
      }
      state.activeNodeId = node.id;
      renderTree();
      renderContent(node.id);
      updateBreadcrumb(node.id);
    });

    div.appendChild(header);

    if (hasChildren) {
      const childrenDiv = document.createElement("div");
      childrenDiv.className = "tree-node-children" + (isExpanded ? " expanded" : "");
      for (const child of node.children) {
        renderTreeNode(child, childrenDiv, depth + 1);
      }
      div.appendChild(childrenDiv);
    }

    parentEl.appendChild(div);
  }


  // ==============================================================
  //  SECTION 6: BREADCRUMB
  // ==============================================================

  const breadcrumbInner = $(".breadcrumb-inner");

  function updateBreadcrumb(id) {
    const ancestry = getAncestry(id);
    if (!ancestry) return;
    breadcrumbInner.innerHTML = "";
    ancestry.forEach((node, i) => {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "breadcrumb-separator";
        sep.textContent = "\u203A";
        breadcrumbInner.appendChild(sep);
      }
      if (i < ancestry.length - 1) {
        const item = document.createElement("span");
        item.className = "breadcrumb-item";
        item.textContent = (i === 0 ? "Home / " : "") + node.label;
        item.addEventListener("click", () => {
          state.activeNodeId = node.id;
          state.expandedNodes.add(node.id);
          renderTree();
          renderContent(node.id);
          updateBreadcrumb(node.id);
        });
        breadcrumbInner.appendChild(item);
      } else {
        const current = document.createElement("span");
        current.className = "breadcrumb-current";
        current.textContent = node.label;
        breadcrumbInner.appendChild(current);
      }
    });
  }


  // ==============================================================
  //  SECTION 7: CONTENT RENDERING
  // ==============================================================

  const contentPanel = $("#contentPanel");

  function renderContent(id) {
    const node = findNode(id);
    if (!node) return;
    const c = node.content || {};

    let html = "";

    if (id === "root") {
      html += renderLandingPage(node);
      contentPanel.innerHTML = html;
      attachLandingCardListeners();
      return;
    }

    // Title card
    html += '<div class="content-card">';
    html += '<h2>' + escapeHTML(c.title || node.label) + '</h2>';

    if (c.what) {
      html += '<div class="info-box definition"><div class="info-title">Definition</div><p>' + escapeHTML(c.what) + '</p></div>';
    }
    if (c.overview) {
      html += '<p>' + escapeHTML(c.overview) + '</p>';
    }
    if (c.questions && c.questions.length) {
      html += '<div class="info-box question"><div class="info-title">Biological Questions Addressed</div><ul>';
      c.questions.forEach(function(q) { html += '<li>' + escapeHTML(q) + '</li>'; });
      html += '</ul></div>';
    }
    html += '</div>';

    // Algorithms
    if (c.algorithms && c.algorithms.length) {
      html += '<div class="content-card"><h3>Algorithms and Methods</h3>';
      c.algorithms.forEach(function(a) {
        html += '<h4>' + escapeHTML(a.name) + '</h4><p>' + escapeHTML(a.desc) + '</p>';
      });
      html += '</div>';
    }

    // Math
    if (c.math && c.math.length) {
      html += '<div class="content-card"><h3>Mathematical Foundations</h3>';
      c.math.forEach(function(m) {
        html += '<div class="formula">' + escapeHTML(m) + '</div>';
      });
      html += '</div>';
    }

    // Tools
    if (c.tools && c.tools.length) {
      html += '<div class="content-card"><h3>Tools and Software</h3><div class="tags">';
      c.tools.forEach(function(t) {
        var cls = t.type === "tool" ? "tag-tool" : t.type === "lang" ? "tag-lang" : "tag-tool";
        html += '<span class="tag ' + cls + '" title="' + escapeHTML(t.desc || "") + '">' + escapeHTML(t.name) + '</span>';
      });
      html += '</div>';
      html += '<div class="table-wrapper"><table class="comparison-table"><thead><tr><th>Tool</th><th>Type</th><th>Description</th></tr></thead><tbody>';
      c.tools.forEach(function(t) {
        html += '<tr><td><strong>' + escapeHTML(t.name) + '</strong></td><td>' + escapeHTML(t.type || "") + '</td><td>' + escapeHTML(t.desc || "") + '</td></tr>';
      });
      html += '</tbody></table></div></div>';
    }

    // Databases
    if (c.databases && c.databases.length) {
      html += '<div class="content-card"><h3>Databases</h3><div class="tags">';
      c.databases.forEach(function(d) {
        html += '<span class="tag tag-db" title="' + escapeHTML(d.desc || "") + '">' + escapeHTML(d.name) + '</span>';
      });
      html += '</div>';
      html += '<div class="table-wrapper"><table class="comparison-table"><thead><tr><th>Database</th><th>Description</th></tr></thead><tbody>';
      c.databases.forEach(function(d) {
        html += '<tr><td><strong>' + escapeHTML(d.name) + '</strong></td><td>' + escapeHTML(d.desc || "") + '</td></tr>';
      });
      html += '</tbody></table></div></div>';
    }

    // Formats
    if (c.formats && c.formats.length) {
      html += '<div class="content-card"><h3>File Formats</h3>';
      html += '<div class="table-wrapper"><table class="comparison-table"><thead><tr><th>Format</th><th>Description</th></tr></thead><tbody>';
      c.formats.forEach(function(f) {
        html += '<tr><td><strong><code>' + escapeHTML(f.name) + '</code></strong></td><td>' + escapeHTML(f.desc) + '</td></tr>';
      });
      html += '</tbody></table></div></div>';
    }

    // Pipeline
    if (c.pipeline && c.pipeline.length) {
      html += '<div class="content-card"><h3>Analysis Pipeline</h3><div class="pipeline">';
      c.pipeline.forEach(function(p, i) {
        html += '<div class="pipeline-step"><div class="step-num">Step ' + (i + 1) + '</div><div class="step-name">' + escapeHTML(p.name) + '</div><div class="step-tool">' + escapeHTML(p.tool) + '</div></div>';
        if (i < c.pipeline.length - 1) {
          html += '<span class="pipeline-arrow">&rarr;</span>';
        }
      });
      html += '</div></div>';
    }

    // Workflow
    if (c.workflow && c.workflow.length) {
      html += '<div class="content-card"><h3>Step-by-Step Workflow</h3>';
      c.workflow.forEach(function(w) {
        html += '<h4>Step ' + w.step + ': ' + escapeHTML(w.title) + '</h4>';
        html += renderCodeBlock(w.cmd, w.lang || "bash");
      });
      html += '</div>';
    }

    // Interpretation
    if (c.interpretation) {
      html += '<div class="content-card"><div class="interpretation"><h4>Interpreting Results</h4><p>' + escapeHTML(c.interpretation) + '</p></div></div>';
    }

    // Errors
    if (c.errors && c.errors.length) {
      html += '<div class="content-card"><h3>Common Errors and Troubleshooting</h3>';
      c.errors.forEach(function(e, i) {
        var eid = "err_" + id + "_" + i;
        html += '<div class="error-item">';
        html += '<div class="error-header" data-eid="' + eid + '"><span class="error-icon">&#10007;</span><span class="error-text">' + escapeHTML(e.error) + '</span><span class="error-toggle" id="toggle_' + eid + '">&#9654;</span></div>';
        html += '<div class="error-solution" id="sol_' + eid + '"><div class="solution-label">Solution</div><p>' + escapeHTML(e.solution) + '</p></div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // References
    if (c.references && c.references.length) {
      html += '<div class="content-card"><h3>References and Further Reading</h3><ul class="references-list">';
      c.references.forEach(function(ref) {
        html += '<li><a href="' + escapeHTML(ref.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(ref.text) + '</a></li>';
      });
      html += '</ul></div>';
    }

    // Children navigation
    if (node.children && node.children.length) {
      html += '<div class="content-card"><h3>Sub-topics</h3><div class="landing-grid">';
      node.children.forEach(function(child) {
        var cc = child.content || {};
        var desc = cc.what || "";
        var childCount = child.children ? child.children.length : 0;
        html += '<div class="landing-card ' + (child.color || "") + '" data-nav-id="' + child.id + '">';
        html += '<div class="card-icon">' + escapeHTML(child.icon || "---") + '</div>';
        html += '<div class="card-title">' + escapeHTML(child.label) + '</div>';
        html += '<div class="card-desc">' + escapeHTML(desc.substring(0, 150)) + (desc.length > 150 ? "..." : "") + '</div>';
        if (childCount) html += '<div class="card-count">' + childCount + ' sub-topics</div>';
        html += '</div>';
      });
      html += '</div></div>';
    }

    contentPanel.innerHTML = html;
    contentPanel.scrollTop = 0;
    attachContentListeners();
  }

  function renderLandingPage(node) {
    var c = node.content || {};
    var html = '<div class="content-card">';
    html += '<h2>' + escapeHTML(c.title || node.label) + '</h2>';
    if (c.what) {
      html += '<div class="info-box definition"><div class="info-title">About This Archive</div><p>' + escapeHTML(c.what) + '</p></div>';
    }
    if (c.overview) {
      html += '<p>' + escapeHTML(c.overview) + '</p>';
    }
    if (c.questions && c.questions.length) {
      html += '<div class="info-box question"><div class="info-title">Key Questions in Bioinformatics</div><ul>';
      c.questions.forEach(function(q) { html += '<li>' + escapeHTML(q) + '</li>'; });
      html += '</ul></div>';
    }
    if (c.references && c.references.length) {
      html += '<div class="info-box"><div class="info-title">References</div><ul class="references-list">';
      c.references.forEach(function(ref) {
        html += '<li><a href="' + escapeHTML(ref.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(ref.text) + '</a></li>';
      });
      html += '</ul></div>';
    }
    html += '</div>';

    if (node.children && node.children.length) {
      html += '<div class="content-card"><h3>Explore Sub-fields</h3><div class="landing-grid">';
      node.children.forEach(function(child) {
        var cc = child.content || {};
        var desc = cc.what || "";
        var childCount = child.children ? child.children.length : 0;
        var toolCount = cc.tools ? cc.tools.length : 0;
        html += '<div class="landing-card ' + (child.color || "") + '" data-nav-id="' + child.id + '">';
        html += '<div class="card-icon">' + escapeHTML(child.icon || "---") + '</div>';
        html += '<div class="card-title">' + escapeHTML(child.label) + '</div>';
        html += '<div class="card-desc">' + escapeHTML(desc.substring(0, 160)) + (desc.length > 160 ? "..." : "") + '</div>';
        var meta = [];
        if (childCount) meta.push(childCount + " sub-topics");
        if (toolCount) meta.push(toolCount + " tools");
        if (meta.length) html += '<div class="card-count">' + meta.join(" | ") + '</div>';
        html += '</div>';
      });
      html += '</div></div>';
    }

    return html;
  }

  function renderCodeBlock(code, lang) {
    var id = "cb_" + Math.random().toString(36).substr(2, 9);
    return '<div class="code-block"><div class="code-block-header"><span class="code-block-lang">' + escapeHTML(lang) + '</span><button class="code-block-copy" data-code-id="' + id + '">Copy</button></div><pre id="' + id + '">' + highlightSyntax(escapeHTML(code), lang) + '</pre></div>';
  }

  function highlightSyntax(code, lang) {
    code = code.replace(/(#[^\n]*)/g, '<span class="comment">$1</span>');
    code = code.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|"[^"]*?"|'[^']*?')/g, '<span class="string">$1</span>');
    if (lang === "bash") {
      code = code.replace(/(\s)(--?[a-zA-Z][\w-]*)/g, '$1<span class="flag">$2</span>');
    }
    var keywords = lang === "r"
      ? ["library", "install\\.packages", "BiocManager", "if", "else", "for", "while", "function", "return", "TRUE", "FALSE", "NULL", "NA"]
      : ["sudo", "conda", "pip", "wget", "curl", "export", "mkdir", "cp", "mv", "rm", "cd", "cat", "echo", "for", "do", "done", "if", "then", "fi", "tar"];
    keywords.forEach(function(kw) {
      var re = new RegExp("\\b(" + kw + ")\\b", "g");
      code = code.replace(re, '<span class="keyword">$1</span>');
    });
    return code;
  }


  // ==============================================================
  //  SECTION 8: EVENT LISTENERS
  // ==============================================================

  function attachContentListeners() {
    attachLandingCardListeners();

    $$(".code-block-copy").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var codeId = btn.dataset.codeId;
        var codeEl = $("#" + codeId);
        if (!codeEl) return;
        var text = codeEl.textContent;
        navigator.clipboard.writeText(text).then(function() {
          btn.textContent = "Copied";
          btn.classList.add("copied");
          setTimeout(function() {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 2000);
        }).catch(function() {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          btn.textContent = "Copied";
          btn.classList.add("copied");
          setTimeout(function() {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 2000);
        });
      });
    });

    $$(".error-header").forEach(function(header) {
      header.addEventListener("click", function() {
        var eid = header.dataset.eid;
        var sol = $("#sol_" + eid);
        var tog = $("#toggle_" + eid);
        if (sol) {
          sol.classList.toggle("open");
          if (tog) tog.classList.toggle("open");
        }
      });
    });
  }

  function attachLandingCardListeners() {
    $$(".landing-card[data-nav-id]").forEach(function(card) {
      card.addEventListener("click", function() {
        navigateTo(card.dataset.navId);
      });
    });
  }

  function navigateTo(id) {
    var ancestry = getAncestry(id);
    if (ancestry) {
      ancestry.forEach(function(n) { state.expandedNodes.add(n.id); });
    }
    state.activeNodeId = id;
    renderTree();
    renderContent(id);
    updateBreadcrumb(id);
    setTimeout(function() {
      var activeHeader = $(".tree-node-header.active");
      if (activeHeader) {
        activeHeader.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }, 100);
  }


  // ==============================================================
  //  SECTION 9: SEARCH
  // ==============================================================

  var searchModal = $("#searchModal");
  var modalSearchInput = $("#modalSearchInput");
  var modalSearchResults = $("#modalSearchResults");
  var headerSearchInput = $("#searchInput");

  function openSearch() {
    searchModal.classList.add("open");
    modalSearchInput.value = "";
    modalSearchInput.focus();
    modalSearchResults.innerHTML = '<div class="search-empty"><p>Start typing to search all topics, tools, and workflows.</p></div>';
  }

  function closeSearch() {
    searchModal.classList.remove("open");
  }

  function performSearch(query) {
    if (!query || query.length < 2) {
      modalSearchResults.innerHTML = '<div class="search-empty"><p>Start typing to search all topics, tools, and workflows.</p></div>';
      return;
    }

    var q = query.toLowerCase();
    var results = [];

    state.flatNodes.forEach(function(node) {
      var score = 0;
      var lbl = (node.label || "").toLowerCase();
      var c = node.content || {};

      if (lbl.includes(q)) score += 10;
      if (lbl.startsWith(q)) score += 5;
      if ((c.what || "").toLowerCase().includes(q)) score += 3;

      if (c.tools) {
        c.tools.forEach(function(t) {
          if ((t.name || "").toLowerCase().includes(q)) score += 7;
          if ((t.desc || "").toLowerCase().includes(q)) score += 2;
        });
      }
      if (c.databases) {
        c.databases.forEach(function(d) {
          if ((d.name || "").toLowerCase().includes(q)) score += 7;
        });
      }
      if (c.algorithms) {
        c.algorithms.forEach(function(a) {
          if ((a.name || "").toLowerCase().includes(q)) score += 6;
        });
      }
      if (c.questions) {
        c.questions.forEach(function(question) {
          if (question.toLowerCase().includes(q)) score += 2;
        });
      }

      if (score > 0) results.push({ node: node, score: score });
    });

    results.sort(function(a, b) { return b.score - a.score; });
    var top = results.slice(0, 20);

    if (top.length === 0) {
      modalSearchResults.innerHTML = '<div class="search-empty"><p>No results for "<strong>' + escapeHTML(query) + '</strong>".</p></div>';
      return;
    }

    var html = "";
    top.forEach(function(r) {
      var n = r.node;
      var pathStr = n.path ? n.path.join(" > ") : n.label;
      html += '<div class="search-result-item" data-search-id="' + n.id + '">';
      html += '<span class="result-icon">' + escapeHTML(n.icon || "---") + '</span>';
      html += '<div class="result-info"><div class="result-title">' + escapeHTML(n.label) + '</div><div class="result-path">' + escapeHTML(pathStr) + '</div></div>';
      html += '<span class="result-arrow">&rarr;</span>';
      html += '</div>';
    });
    modalSearchResults.innerHTML = html;

    $$(".search-result-item").forEach(function(item) {
      item.addEventListener("click", function() {
        closeSearch();
        navigateTo(item.dataset.searchId);
      });
    });
  }


  // ==============================================================
  //  SECTION 10: SIDEBAR RESIZE
  // ==============================================================

  var sidebarEl = $("#sidebar");
  var resizeHandle = $("#resizeHandle");
  var isResizing = false;

  resizeHandle.addEventListener("mousedown", function(e) {
    isResizing = true;
    resizeHandle.classList.add("active");
    document.addEventListener("mousemove", onResize);
    document.addEventListener("mouseup", stopResize);
    e.preventDefault();
  });

  function onResize(e) {
    if (!isResizing) return;
    var newWidth = Math.min(Math.max(e.clientX, 240), 600);
    sidebarEl.style.width = newWidth + "px";
    state.sidebarWidth = newWidth;
  }

  function stopResize() {
    isResizing = false;
    resizeHandle.classList.remove("active");
    document.removeEventListener("mousemove", onResize);
    document.removeEventListener("mouseup", stopResize);
    localStorage.setItem("bioinfo-sidebar-w", state.sidebarWidth);
  }


  // ==============================================================
  //  SECTION 11: SCROLL TO TOP
  // ==============================================================

  var scrollTopBtn = $("#scrollTop");

  contentPanel.addEventListener("scroll", function() {
    if (contentPanel.scrollTop > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", function() {
    contentPanel.scrollTo({ top: 0, behavior: "smooth" });
  });


  // ==============================================================
  //  SECTION 12: INITIALIZATION
  // ==============================================================

  function init() {
    applyTheme(state.theme);
    sidebarEl.style.width = state.sidebarWidth + "px";
    renderTree();
    renderContent("root");
    updateBreadcrumb("root");

    var stats = countStats(KNOWLEDGE_TREE);
    var totalTopicsEl = $("#totalTopics");
    var totalToolsEl = $("#totalTools");
    var totalWorkflowsEl = $("#totalWorkflows");
    if (totalTopicsEl) totalTopicsEl.textContent = stats.topics;
    if (totalToolsEl) totalToolsEl.textContent = stats.tools;
    if (totalWorkflowsEl) totalWorkflowsEl.textContent = stats.workflows;

    $("#themeToggle").addEventListener("click", function() {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });

    $("#expandAll").addEventListener("click", function() {
      state.flatNodes.forEach(function(n) { state.expandedNodes.add(n.id); });
      renderTree();
    });

    $("#collapseAll").addEventListener("click", function() {
      state.expandedNodes.clear();
      state.expandedNodes.add("root");
      renderTree();
    });

    headerSearchInput.addEventListener("focus", function(e) {
      e.target.blur();
      openSearch();
    });

    document.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") {
        closeSearch();
      }
    });

    modalSearchInput.addEventListener("input", function(e) {
      performSearch(e.target.value);
    });

    searchModal.addEventListener("click", function(e) {
      if (e.target === searchModal) closeSearch();
    });

    setTimeout(function() {
      var loader = $("#loader");
      if (loader) loader.classList.add("hidden");
    }, 800);
  }

  // ==============================================================
  //  SECTION 13: MOBILE SIDEBAR
  // ==============================================================

  function setupMobileSidebar() {
    var menuToggle = document.querySelector(".mobile-menu-toggle");
    var overlay = document.querySelector(".sidebar-overlay");
    var sidebarClose = document.querySelector(".sidebar-close");

    function openSidebar() {
      sidebarEl.classList.add("mobile-open");
      if (overlay) overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
      sidebarEl.classList.remove("mobile-open");
      if (overlay) overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (menuToggle) menuToggle.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);

    document.addEventListener("click", function(e) {
      if (e.target.closest(".tree-node-header") && window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  }

  // Run
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      init();
      setupMobileSidebar();
    });
  } else {
    init();
    setupMobileSidebar();
  }

})();
