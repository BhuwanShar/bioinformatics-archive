// ================================================================
//  BIOINFORMATICS KNOWLEDGE ARCHIVE — Complete Script
//  Created by Bhuwan Sharma | © 2026
//  Single self-contained file — no external dependencies
// ================================================================

(function () {
  "use strict";

  // ==============================================================
  //  SECTION 1: KNOWLEDGE DATA — The entire bioinformatics tree
  // ==============================================================

  const KNOWLEDGE_TREE = {
    id: "root",
    label: "Bioinformatics",
    icon: "🧬",
    color: "blue",
    content: {
      title: "🧬 Bioinformatics Knowledge Archive",
      what: "Bioinformatics is an interdisciplinary field that combines biology, computer science, mathematics, and statistics to analyze and interpret biological data. It involves the development and application of computational tools and methods to understand biological processes at the molecular level.",
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
      overview: "This archive provides a comprehensive, interactive decision tree covering every major sub-field of bioinformatics. Each node contains definitions, biological questions answered, tools, algorithms, mathematical foundations, step-by-step reproducible workflows, common errors and troubleshooting, and interpretation guides."
    },
    children: [
      // ──────────────────────────────────────────────
      //  1. SEQUENCE ANALYSIS
      // ──────────────────────────────────────────────
      {
        id: "sequence_analysis",
        label: "Sequence Analysis",
        icon: "🔤",
        color: "yellow",
        content: {
          title: "🔤 Sequence Analysis",
          what: "Sequence analysis is the process of subjecting a DNA, RNA, or protein sequence to computational methods to understand its features, function, structure, or evolution. It is the foundational pillar of bioinformatics.",
          questions: [
            "What is the identity of an unknown sequence?",
            "Which regions of two or more sequences are similar?",
            "What functional domains exist in a protein sequence?",
            "Where are the open reading frames in a DNA sequence?",
            "How conserved is a particular region across species?"
          ],
          tools: [
            { name: "BLAST", type: "tool", desc: "Basic Local Alignment Search Tool — finds similar sequences in databases" },
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
            { name: "Pfam", type: "db", desc: "Protein family domains (now in InterPro)" },
            { name: "InterPro", type: "db", desc: "Protein classification and domain database" }
          ]
        },
        children: [
          {
            id: "pairwise_alignment",
            label: "Pairwise Alignment",
            icon: "↔️",
            content: {
              title: "↔️ Pairwise Sequence Alignment",
              what: "Pairwise alignment compares two sequences to identify regions of similarity. It can be global (entire length, Needleman-Wunsch) or local (best matching sub-region, Smith-Waterman).",
              questions: [
                "How similar are two sequences?",
                "What is the optimal alignment between two sequences?",
                "Are two proteins homologous?"
              ],
              algorithms: [
                { name: "Needleman-Wunsch", desc: "Global alignment using dynamic programming. Time: O(mn), Space: O(mn)." },
                { name: "Smith-Waterman", desc: "Local alignment using dynamic programming with zero-reset. Time: O(mn), Space: O(mn)." },
                { name: "BLAST heuristic", desc: "Seed-and-extend heuristic for fast database search." }
              ],
              math: [
                "Needleman-Wunsch recurrence: F(i,j) = max{ F(i-1,j-1) + s(xᵢ,yⱼ), F(i-1,j) + d, F(i,j-1) + d }",
                "Smith-Waterman recurrence: H(i,j) = max{ 0, H(i-1,j-1) + s(xᵢ,yⱼ), H(i-1,j) + d, H(i,j-1) + d }",
                "E-value: E = K·m·n·e^(−λS) — expected number of alignments with score ≥ S by chance"
              ],
              workflow: [
                { step: 1, title: "Install BLAST+", cmd: "sudo apt-get install ncbi-blast+", lang: "bash" },
                { step: 2, title: "Create a BLAST database", cmd: "makeblastdb -in reference.fasta -dbtype nucl -out mydb", lang: "bash" },
                { step: 3, title: "Run BLAST search", cmd: "blastn -query query.fasta -db mydb -out results.txt -evalue 1e-5 -outfmt 6 -num_threads 4", lang: "bash" },
                { step: 4, title: "Interpret output columns", cmd: "# Output format 6 columns:\n# qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore\n# Key: evalue < 1e-5 = significant hit\n# pident > 30% for proteins suggests homology", lang: "bash" }
              ],
              interpretation: "An E-value < 1e-5 generally indicates a statistically significant match. Percent identity >30% for proteins or >70% for nucleotides suggests homology. Bit score is a normalized score independent of database size — higher is better. Check alignment length to ensure it covers a significant portion of the query.",
              errors: [
                { error: "BLAST database error: No alias or index file found", solution: "Run makeblastdb again. Ensure -dbtype matches your sequence type (nucl or prot). Verify file permissions." },
                { error: "Bus error or Segmentation fault", solution: "Usually a memory issue. Try reducing -num_threads or use a machine with more RAM. Check BLAST version compatibility." },
                { error: "No hits found", solution: "Try increasing -evalue threshold (e.g., 10). Verify your query isn't empty. Try a different BLAST program (blastn vs tblastx). Check if database is appropriate." }
              ]
            }
          },
          {
            id: "msa",
            label: "Multiple Sequence Alignment",
            icon: "📊",
            content: {
              title: "📊 Multiple Sequence Alignment (MSA)",
              what: "MSA extends pairwise alignment to three or more sequences simultaneously, revealing conserved regions, functional domains, and evolutionary relationships across a set of related sequences.",
              questions: [
                "Which residues are conserved across a protein family?",
                "What regions are functionally important?",
                "How can we infer evolutionary relationships from sequence conservation?"
              ],
              algorithms: [
                { name: "Progressive alignment (Clustal)", desc: "Build guide tree, align closest pairs first, progressively add sequences." },
                { name: "Iterative refinement (MUSCLE)", desc: "Repeated refinement cycles to improve alignment score." },
                { name: "Consistency-based (T-Coffee)", desc: "Uses library of pairwise alignments to guide multiple alignment." },
                { name: "MAFFT FFT-NS-2", desc: "Fast Fourier Transform-based rapid alignment." }
              ],
              tools: [
                { name: "Clustal Omega", type: "tool" },
                { name: "MUSCLE", type: "tool" },
                { name: "MAFFT", type: "tool" },
                { name: "T-Coffee", type: "tool" },
                { name: "MEGA", type: "tool" },
                { name: "Jalview", type: "tool", desc: "MSA visualization and editing" }
              ],
              math: [
                "Sum-of-pairs score: SP = Σᵢ<ⱼ score(Sᵢ, Sⱼ)",
                "Guide tree: UPGMA or Neighbor-Joining distance tree from pairwise distances",
                "Substitution matrices: BLOSUM62 for proteins, NUC.4.4 for nucleotides"
              ],
              workflow: [
                { step: 1, title: "Install MAFFT", cmd: "sudo apt-get install mafft\n# or\nconda install -c bioconda mafft", lang: "bash" },
                { step: 2, title: "Prepare input FASTA", cmd: "# sequences.fasta should contain 3+ related sequences\n# Example:\n# >Seq1_Human\n# MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSH\n# >Seq2_Mouse\n# MVLSGEDKSNIKAAWGKIGGHGAEYGAEALERMFASFPTTKTYFPHFDVSH\n# >Seq3_Chicken\n# MVLSAADKNNVKGIFTKIAGHAEEYGAETLERMFITYPPTKTYFPHFDLSH", lang: "bash" },
                { step: 3, title: "Run MAFFT alignment", cmd: "# Default (fast)\nmafft sequences.fasta > aligned.fasta\n\n# High accuracy (L-INS-i for <200 sequences)\nmafft --localpair --maxiterate 1000 sequences.fasta > aligned.fasta\n\n# For large datasets (>2000 sequences)\nmafft --retree 1 sequences.fasta > aligned.fasta", lang: "bash" },
                { step: 4, title: "Visualize with Jalview or AliView", cmd: "# Install AliView (lightweight MSA viewer)\n# Download from: https://ormbunkar.se/aliview/\n# Open aligned.fasta in AliView\n\n# Or use command-line visualization:\nless aligned.fasta", lang: "bash" },
                { step: 5, title: "Alternative: Clustal Omega", cmd: "# Install\nsudo apt-get install clustalo\n\n# Run\nclustal omega -i sequences.fasta -o aligned.fasta --outfmt=fasta -v\n\n# With guide tree output\nclustal omega -i sequences.fasta -o aligned.fasta --guidetree-out=tree.nwk", lang: "bash" }
              ],
              interpretation: "Look for columns with high conservation (same amino acid/nucleotide across most sequences) — these are likely functionally or structurally important. Gaps may indicate insertions or deletions (indels). Variable regions may evolve under less selective constraint. Use alignment quality scores and manually inspect ambiguous regions.",
              errors: [
                { error: "Sequences too divergent — poor alignment", solution: "Use more sensitive algorithm like L-INS-i in MAFFT or T-Coffee. Consider if sequences are truly homologous. Try PSI-BLAST first to confirm." },
                { error: "Out of memory for large datasets", solution: "Use MAFFT --retree 1 or --parttree for >10,000 sequences. Reduce dataset by removing redundant sequences with CD-HIT." }
              ]
            }
          },
          {
            id: "sequence_databases",
            label: "Sequence Databases & Retrieval",
            icon: "🗄️",
            content: {
              title: "🗄️ Sequence Databases & Retrieval",
              what: "Biological sequence databases are organized collections of DNA, RNA, and protein sequences. Efficient retrieval and understanding of database formats is fundamental to all bioinformatics analyses.",
              questions: [
                "Where can I find a specific gene or protein sequence?",
                "How do I download sequences programmatically?",
                "What file formats are used for biological sequences?"
              ],
              databases: [
                { name: "NCBI GenBank", type: "db", desc: "Primary nucleotide database" },
                { name: "NCBI RefSeq", type: "db", desc: "Curated reference sequences" },
                { name: "UniProt/SwissProt", type: "db", desc: "Curated protein sequences" },
                { name: "UniProt/TrEMBL", type: "db", desc: "Computationally annotated proteins" },
                { name: "Ensembl", type: "db", desc: "Vertebrate genomes and annotation" },
                { name: "DDBJ", type: "db", desc: "DNA Data Bank of Japan" },
                { name: "ENA", type: "db", desc: "European Nucleotide Archive" },
                { name: "PDB", type: "db", desc: "Protein Data Bank — 3D structures" },
                { name: "KEGG", type: "db", desc: "Pathway and genome database" },
                { name: "Gene Ontology (GO)", type: "db", desc: "Functional annotation terms" }
              ],
              formats: [
                { name: "FASTA", desc: ">header followed by sequence — universal format" },
                { name: "GenBank (.gb)", desc: "Rich annotation format with features" },
                { name: "FASTQ", desc: "Sequence + quality scores from NGS" },
                { name: "SAM/BAM", desc: "Sequence Alignment/Map format" },
                { name: "VCF", desc: "Variant Call Format" },
                { name: "GFF/GTF", desc: "Genome Feature Format for annotations" },
                { name: "BED", desc: "Genomic intervals" },
                { name: "PDB", desc: "Protein 3D structure coordinates" },
                { name: "EMBL", desc: "European sequence annotation format" }
              ],
              workflow: [
                { step: 1, title: "Install Entrez Direct (NCBI E-utilities CLI)", cmd: "# Install NCBI Entrez Direct\nsh -c \"$(curl -fsSL https://ftp.ncbi.nlm.nih.gov/entrez/entrezdirect/install-edirect.sh)\"\nexport PATH=${HOME}/edirect:${PATH}", lang: "bash" },
                { step: 2, title: "Search and download sequences", cmd: "# Search for human TP53 gene\nesearch -db nucleotide -query \"TP53[Gene] AND Homo sapiens[Organism] AND refseq[filter]\" | efetch -format fasta > tp53.fasta\n\n# Download protein by accession\nefetch -db protein -id P04637 -format fasta > p53_protein.fasta\n\n# Download multiple accessions\nefetch -db nucleotide -id NM_000546,NM_001126112 -format fasta > tp53_variants.fasta", lang: "bash" },
                { step: 3, title: "Using datasets CLI (NCBI Datasets)", cmd: "# Install NCBI datasets CLI\nconda install -c conda-forge ncbi-datasets-cli\n\n# Download genome by organism\ndatasets download genome taxon 'Homo sapiens' --reference --include genome,gff3\n\n# Download by accession\ndatasets download genome accession GCF_000001405.40 --include genome,gff3", lang: "bash" },
                { step: 4, title: "SRA data download", cmd: "# Install SRA Toolkit\nconda install -c bioconda sra-tools\n\n# Download FASTQ from SRA\nprefetch SRR1234567\nfasterq-dump SRR1234567 --split-3 -O ./fastq_output/", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  2. GENOMICS
      // ──────────────────────────────────────────────
      {
        id: "genomics",
        label: "Genomics",
        icon: "🧪",
        color: "blue",
        content: {
          title: "🧪 Genomics",
          what: "Genomics is the study of the complete set of DNA (genome) within an organism. It encompasses genome sequencing, assembly, annotation, variant calling, and comparative analysis of genomes across species.",
          questions: [
            "What is the complete DNA sequence of an organism?",
            "How many genes does an organism have and what are they?",
            "What genetic variants exist between individuals?",
            "How do genomes evolve and differ between species?",
            "Which genomic regions are associated with diseases?"
          ],
          tools: [
            { name: "BWA", type: "tool", desc: "Burrows-Wheeler Aligner for read mapping" },
            { name: "Bowtie2", type: "tool", desc: "Fast short-read aligner" },
            { name: "SAMtools", type: "tool", desc: "SAM/BAM manipulation and variant calling" },
            { name: "BCFtools", type: "tool", desc: "Variant calling and filtering" },
            { name: "GATK", type: "tool", desc: "Genome Analysis Toolkit — gold-standard variant calling" },
            { name: "SPAdes", type: "tool", desc: "De novo genome assembler" },
            { name: "Velvet", type: "tool", desc: "Short read de novo assembler" },
            { name: "Picard", type: "tool", desc: "BAM manipulation utilities" },
            { name: "FastQC", type: "tool", desc: "Quality control for sequencing data" },
            { name: "MultiQC", type: "tool", desc: "Aggregate QC reports" }
          ]
        },
        children: [
          {
            id: "genome_assembly",
            label: "Genome Assembly",
            icon: "🏗️",
            content: {
              title: "🏗️ Genome Assembly",
              what: "Genome assembly is the computational process of reconstructing the complete genome sequence from short or long reads produced by sequencing. It can be de novo (no reference) or reference-guided.",
              questions: [
                "How do we reconstruct a genome from millions of short reads?",
                "What is the quality and completeness of an assembly?",
                "How do we handle repetitive regions?"
              ],
              algorithms: [
                { name: "De Bruijn Graph", desc: "Breaks reads into k-mers and finds Eulerian path. Used by SPAdes, Velvet, SOAPdenovo." },
                { name: "Overlap-Layout-Consensus (OLC)", desc: "Finds overlaps between reads, builds layout graph, generates consensus. Used by Canu, Flye for long reads." },
                { name: "String Graph", desc: "Variant of OLC avoiding redundant overlaps. Used by SGA." }
              ],
              math: [
                "Coverage depth: C = (N × L) / G where N=number of reads, L=read length, G=genome size",
                "N50: length of the shortest contig at 50% of total assembly length",
                "L50: number of contigs needed to reach 50% of total assembly"
              ],
              tools: [
                { name: "SPAdes", type: "tool", desc: "De novo assembler for bacterial/small genomes" },
                { name: "Canu", type: "tool", desc: "Long-read assembler (PacBio/ONT)" },
                { name: "Flye", type: "tool", desc: "Fast long-read assembler" },
                { name: "MEGAHIT", type: "tool", desc: "Ultra-fast metagenomic assembler" },
                { name: "Hifiasm", type: "tool", desc: "Haplotype-resolved HiFi assembler" },
                { name: "QUAST", type: "tool", desc: "Assembly quality assessment" },
                { name: "BUSCO", type: "tool", desc: "Completeness assessment using orthologs" }
              ],
              workflow: [
                { step: 1, title: "Quality Control", cmd: "# Install FastQC\nconda install -c bioconda fastqc multiqc\n\n# Run FastQC\nfastqc reads_R1.fastq.gz reads_R2.fastq.gz -o qc_output/ -t 4\n\n# Aggregate results\nmultiqc qc_output/ -o multiqc_report/", lang: "bash" },
                { step: 2, title: "Read Trimming", cmd: "# Install Trimmomatic\nconda install -c bioconda trimmomatic\n\n# Trim adapters and low quality bases\ntrimmomatic PE -threads 4 \\\n  reads_R1.fastq.gz reads_R2.fastq.gz \\\n  trimmed_R1.fastq.gz unpaired_R1.fastq.gz \\\n  trimmed_R2.fastq.gz unpaired_R2.fastq.gz \\\n  ILLUMINACLIP:TruSeq3-PE.fa:2:30:10 \\\n  LEADING:3 TRAILING:3 \\\n  SLIDINGWINDOW:4:15 MINLEN:36", lang: "bash" },
                { step: 3, title: "De novo Assembly with SPAdes", cmd: "# Install SPAdes\nconda install -c bioconda spades\n\n# Run assembly\nspades.py -1 trimmed_R1.fastq.gz -2 trimmed_R2.fastq.gz \\\n  -o spades_output/ --careful -t 8 -m 16\n\n# For bacterial isolate genomes\nspades.py --isolate -1 trimmed_R1.fastq.gz -2 trimmed_R2.fastq.gz \\\n  -o spades_output/ -t 8", lang: "bash" },
                { step: 4, title: "Assembly Quality Assessment", cmd: "# Install QUAST and BUSCO\nconda install -c bioconda quast busco\n\n# Run QUAST\nquast spades_output/scaffolds.fasta \\\n  -o quast_results/ \\\n  --min-contig 500\n\n# Run BUSCO (check completeness)\nbusco -i spades_output/scaffolds.fasta \\\n  -l bacteria_odb10 -o busco_results \\\n  -m genome -c 4\n\n# Key QUAST metrics to check:\n# - Total length, # contigs, N50, L50\n# - Largest contig, GC%\n# BUSCO: >95% complete = good assembly", lang: "bash" }
              ],
              interpretation: "A good assembly has high N50 (large contigs), few total contigs, and total length close to expected genome size. BUSCO completeness >95% indicates most genes are present. Check for contamination using tools like CheckM (prokaryotes). High duplication in BUSCO may indicate contamination or polyploidy.",
              errors: [
                { error: "SPAdes: Error in K-mer counting — not enough memory", solution: "Reduce k-mer sizes (--only-assembler), use -m to set memory limit, or subsample reads with seqtk sample." },
                { error: "BUSCO: cannot find lineage dataset", solution: "Download lineage manually: busco --list-datasets, then busco --download bacteria_odb10" },
                { error: "Assembly too fragmented (low N50)", solution: "Check coverage (aim 50-100x), ensure proper read trimming, try different k-mer sizes, use long reads if available." }
              ]
            }
          },
          {
            id: "read_mapping",
            label: "Read Mapping & Alignment",
            icon: "🗺️",
            content: {
              title: "🗺️ Read Mapping / Alignment to Reference",
              what: "Read mapping aligns sequencing reads to a reference genome. This is a prerequisite for variant calling, gene expression quantification, ChIP-seq peak calling, and many other downstream analyses.",
              questions: [
                "Where does each sequencing read originate in the reference genome?",
                "How many reads map to each genomic region?",
                "What is the mapping quality and coverage distribution?"
              ],
              algorithms: [
                { name: "Burrows-Wheeler Transform (BWT)", desc: "Used by BWA and Bowtie2 for efficient exact and approximate string matching." },
                { name: "FM-index", desc: "Compressed full-text index supporting fast pattern search on BWT." },
                { name: "Minimap2 algorithm", desc: "Minimizer-based seed-chain-align for long reads." }
              ],
              tools: [
                { name: "BWA-MEM2", type: "tool", desc: "Standard short-read aligner (DNA-seq)" },
                { name: "Bowtie2", type: "tool", desc: "Fast gapped-read aligner" },
                { name: "HISAT2", type: "tool", desc: "Splice-aware aligner for RNA-seq" },
                { name: "STAR", type: "tool", desc: "Fast RNA-seq aligner" },
                { name: "Minimap2", type: "tool", desc: "Long-read and assembly aligner" },
                { name: "SAMtools", type: "tool", desc: "SAM/BAM processing and stats" }
              ],
              workflow: [
                { step: 1, title: "Install tools", cmd: "conda install -c bioconda bwa-mem2 samtools picard", lang: "bash" },
                { step: 2, title: "Index reference genome", cmd: "# Download reference genome (e.g., E. coli K-12)\nwget https://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/000/005/845/GCF_000005845.2_ASM584v2/GCF_000005845.2_ASM584v2_genomic.fna.gz\ngunzip GCF_000005845.2_ASM584v2_genomic.fna.gz\nmv GCF_000005845.2_ASM584v2_genomic.fna reference.fasta\n\n# Index\nbwa-mem2 index reference.fasta\nsamtools faidx reference.fasta", lang: "bash" },
                { step: 3, title: "Map reads", cmd: "# Align paired-end reads\nbwa-mem2 mem -t 8 reference.fasta \\\n  trimmed_R1.fastq.gz trimmed_R2.fastq.gz | \\\n  samtools sort -@ 4 -o aligned.bam\n\n# Index BAM\nsamtools index aligned.bam", lang: "bash" },
                { step: 4, title: "Mark duplicates and stats", cmd: "# Mark PCR duplicates\npicard MarkDuplicates \\\n  I=aligned.bam O=dedup.bam \\\n  M=dup_metrics.txt REMOVE_DUPLICATES=true\nsamtools index dedup.bam\n\n# Alignment statistics\nsamtools flagstat dedup.bam\nsamtools stats dedup.bam > stats.txt\nplot-bamstats -p stats_plots/ stats.txt\n\n# Coverage\nsamtools depth -a dedup.bam | \\\n  awk '{sum+=$3} END {print \"Average coverage:\", sum/NR}'", lang: "bash" }
              ],
              interpretation: "Mapping rate >95% is expected for same-species DNA-seq. Duplicate rate >30% may indicate library complexity issues. Average coverage 30-50x is standard for variant calling. Check for even coverage distribution — sharp drops may indicate structural variants or repetitive regions.",
              errors: [
                { error: "bwa-mem2: fail to open reference file", solution: "Ensure reference.fasta exists and is indexed. Run bwa-mem2 index reference.fasta first." },
                { error: "samtools sort: out of memory", solution: "Use -m flag to limit memory per thread: samtools sort -m 2G -@ 4" },
                { error: "Very low mapping rate (<50%)", solution: "Check if reads and reference are from the same organism. Check for adapter contamination. Verify read quality with FastQC." }
              ]
            }
          },
          {
            id: "variant_calling",
            label: "Variant Calling",
            icon: "🔬",
            content: {
              title: "🔬 Variant Calling",
              what: "Variant calling identifies differences between a sequenced sample and a reference genome, including SNPs (Single Nucleotide Polymorphisms), insertions, deletions (indels), and structural variants.",
              questions: [
                "What SNPs and indels exist in this genome compared to the reference?",
                "Which variants are associated with disease phenotypes?",
                "What is the allele frequency of variants in a population?",
                "Are there structural variants (SVs) like large deletions or inversions?"
              ],
              tools: [
                { name: "GATK HaplotypeCaller", type: "tool", desc: "Gold-standard variant caller" },
                { name: "BCFtools mpileup", type: "tool", desc: "Bayesian variant calling" },
                { name: "FreeBayes", type: "tool", desc: "Bayesian haplotype-based caller" },
                { name: "DeepVariant", type: "tool", desc: "Deep learning-based variant caller by Google" },
                { name: "SnpEff", type: "tool", desc: "Variant annotation and effect prediction" },
                { name: "ANNOVAR", type: "tool", desc: "Functional variant annotation" },
                { name: "VEP", type: "tool", desc: "Variant Effect Predictor (Ensembl)" }
              ],
              math: [
                "Genotype likelihood: P(D|G) = ∏ P(base|genotype) for each read covering the position",
                "Phred quality: Q = -10·log₁₀(P_error) — Q30 means 1 in 1000 error probability",
                "Variant Quality Score Recalibration (VQSR): Gaussian mixture model on variant annotations"
              ],
              workflow: [
                { step: 1, title: "Install GATK and bcftools", cmd: "conda install -c bioconda gatk4 bcftools vcftools snpsift snpeff", lang: "bash" },
                { step: 2, title: "Variant calling with bcftools (simple)", cmd: "# Generate pileup and call variants\nbcftools mpileup -f reference.fasta dedup.bam | \\\n  bcftools call -mv -Oz -o variants.vcf.gz\n\n# Index VCF\ntabix -p vcf variants.vcf.gz\n\n# Filter variants\nbcftools filter -s 'LowQual' -e 'QUAL<20 || DP<10' \\\n  variants.vcf.gz -Oz -o filtered.vcf.gz", lang: "bash" },
                { step: 3, title: "GATK Best Practices pipeline", cmd: "# Create sequence dictionary\ngatk CreateSequenceDictionary -R reference.fasta\n\n# Add read groups (if not present)\ngatk AddOrReplaceReadGroups \\\n  -I dedup.bam -O rg_dedup.bam \\\n  -RGID 1 -RGLB lib1 -RGPL illumina \\\n  -RGPU unit1 -RGSM sample1\nsamtools index rg_dedup.bam\n\n# Call variants\ngatk HaplotypeCaller \\\n  -R reference.fasta \\\n  -I rg_dedup.bam \\\n  -O raw_variants.vcf\n\n# Select SNPs and filter\ngatk SelectVariants -V raw_variants.vcf \\\n  --select-type-to-include SNP -O raw_snps.vcf\n\ngatk VariantFiltration -V raw_snps.vcf \\\n  --filter-expression 'QD < 2.0' --filter-name 'QD2' \\\n  --filter-expression 'FS > 60.0' --filter-name 'FS60' \\\n  --filter-expression 'MQ < 40.0' --filter-name 'MQ40' \\\n  --filter-expression 'SOR > 3.0' --filter-name 'SOR3' \\\n  -O filtered_snps.vcf", lang: "bash" },
                { step: 4, title: "Annotate variants", cmd: "# Annotate with SnpEff\nsnpEff ann GRCh38.105 filtered_snps.vcf > annotated.vcf\n\n# Summary stats\nbcftools stats annotated.vcf > vcf_stats.txt\n\n# View specific variant info\nbcftools query -f '%CHROM\\t%POS\\t%REF\\t%ALT\\t%QUAL\\t%INFO/ANN\\n' annotated.vcf | head", lang: "bash" }
              ],
              interpretation: "SNPs with QUAL>30 and depth>10 are typically reliable. Ti/Tv ratio ~2.0-2.1 for whole-genome human data indicates good call quality. SnpEff classifies impacts as HIGH (stop gain, frameshift), MODERATE (missense), LOW (synonymous), MODIFIER (intergenic). Focus on HIGH and MODERATE impact variants for disease studies.",
              errors: [
                { error: "GATK: Read groups missing from BAM", solution: "Add read groups with gatk AddOrReplaceReadGroups or Picard. Every read must have RG tag." },
                { error: "GATK: Contig names don't match reference", solution: "Ensure BAM and reference use same chromosome naming (chr1 vs 1). Use samtools reheader to fix." },
                { error: "Too many variants (>10M for human)", solution: "Likely includes many false positives. Apply stricter filters. Check if duplicate marking was done. Verify mapping quality." }
              ]
            }
          },
          {
            id: "genome_annotation",
            label: "Genome Annotation",
            icon: "🏷️",
            content: {
              title: "🏷️ Genome Annotation",
              what: "Genome annotation is the process of identifying the locations and functions of genes and other functional elements in a genome sequence. Structural annotation finds genes; functional annotation assigns biological roles.",
              questions: [
                "Where are the genes located in this genome?",
                "What proteins do these genes encode?",
                "What are the regulatory elements?",
                "How do we distinguish coding from non-coding regions?"
              ],
              tools: [
                { name: "Prokka", type: "tool", desc: "Rapid prokaryotic genome annotation" },
                { name: "PGAP", type: "tool", desc: "NCBI Prokaryotic Genome Annotation Pipeline" },
                { name: "Augustus", type: "tool", desc: "Eukaryotic gene prediction" },
                { name: "GeneMark", type: "tool", desc: "Gene prediction using HMMs" },
                { name: "Prodigal", type: "tool", desc: "Prokaryotic gene finding" },
                { name: "eggNOG-mapper", type: "tool", desc: "Functional annotation" },
                { name: "InterProScan", type: "tool", desc: "Protein domain annotation" }
              ],
              workflow: [
                { step: 1, title: "Prokaryotic annotation with Prokka", cmd: "# Install Prokka\nconda install -c bioconda prokka\n\n# Run annotation\nprokka --outdir prokka_output \\\n  --prefix my_genome \\\n  --kingdom Bacteria \\\n  --cpus 8 \\\n  --mincontiglen 200 \\\n  scaffolds.fasta\n\n# Key output files:\n# .gff — annotation in GFF3 format\n# .gbk — GenBank format\n# .faa — protein sequences\n# .ffn — nucleotide gene sequences\n# .tsv — feature table\n# .txt — summary statistics", lang: "bash" },
                { step: 2, title: "Functional annotation with eggNOG", cmd: "# Install eggNOG-mapper\nconda install -c bioconda eggnog-mapper\n\n# Download databases (first time only)\ndownload_eggnog_data.py\n\n# Run annotation\nemapper.py -i prokka_output/my_genome.faa \\\n  -o eggnog_results \\\n  --cpu 8 -m diamond", lang: "bash" },
                { step: 3, title: "Check annotation stats", cmd: "# Count features\ngrep -c 'CDS' prokka_output/my_genome.gff\ngrep -c 'tRNA' prokka_output/my_genome.gff\ngrep -c 'rRNA' prokka_output/my_genome.gff\n\n# View summary\ncat prokka_output/my_genome.txt", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  3. TRANSCRIPTOMICS / NGS DATA ANALYSIS
      // ──────────────────────────────────────────────
      {
        id: "transcriptomics",
        label: "Transcriptomics & Gene Expression",
        icon: "📈",
        color: "green",
        content: {
          title: "📈 Transcriptomics & Gene Expression Analysis",
          what: "Transcriptomics studies the complete set of RNA transcripts (transcriptome) produced by the genome under specific conditions. It reveals which genes are active, their expression levels, and how expression changes across conditions.",
          questions: [
            "Which genes are differentially expressed between conditions?",
            "What biological pathways are affected?",
            "How does gene expression change over time or treatment?",
            "What alternative splicing events occur?",
            "What are the key regulatory networks?"
          ],
          tools: [
            { name: "DESeq2", type: "tool", desc: "Differential expression analysis (R/Bioconductor)" },
            { name: "limma-voom", type: "tool", desc: "Linear models for microarray/RNA-seq" },
            { name: "edgeR", type: "tool", desc: "Differential expression with empirical Bayes" },
            { name: "HISAT2", type: "tool", desc: "Splice-aware RNA-seq read aligner" },
            { name: "STAR", type: "tool", desc: "Fast RNA-seq aligner" },
            { name: "featureCounts", type: "tool", desc: "Read counting for genes" },
            { name: "HTSeq", type: "tool", desc: "Read counting" },
            { name: "Trimmomatic", type: "tool", desc: "Read quality trimming" },
            { name: "fastp", type: "tool", desc: "Fast all-in-one FASTQ preprocessor" },
            { name: "clusterProfiler", type: "tool", desc: "GO/KEGG enrichment analysis (R)" },
            { name: "GEO2R", type: "tool", desc: "Online DE analysis on GEO datasets" },
            { name: "DEGEAR", type: "tool", desc: "DE analysis tool (lab-developed)" }
          ]
        },
        children: [
          {
            id: "rnaseq_pipeline",
            label: "RNA-seq Analysis Pipeline",
            icon: "🔬",
            content: {
              title: "🔬 RNA-seq Analysis Pipeline",
              what: "A complete RNA-seq analysis pipeline takes raw FASTQ files through quality control, alignment, quantification, normalization, differential expression testing, and functional enrichment analysis.",
              questions: [
                "What is the step-by-step process for RNA-seq analysis?",
                "How do I go from raw reads to differentially expressed genes?",
                "What quality metrics should I check at each step?"
              ],
              pipeline: [
                { name: "QC", tool: "FastQC/fastp" },
                { name: "Trim", tool: "Trimmomatic" },
                { name: "Align", tool: "HISAT2/STAR" },
                { name: "Count", tool: "featureCounts" },
                { name: "Normalize", tool: "DESeq2" },
                { name: "DE Analysis", tool: "DESeq2/limma" },
                { name: "Enrichment", tool: "clusterProfiler" },
                { name: "Visualize", tool: "R/ggplot2" }
              ],
              workflow: [
                { step: 1, title: "Quality Control with fastp", cmd: "# Install tools\nconda install -c bioconda fastp hisat2 samtools subread\n\n# Run fastp (QC + trimming in one step)\nfor sample in sample1 sample2 sample3; do\n  fastp \\\n    -i ${sample}_R1.fastq.gz \\\n    -I ${sample}_R2.fastq.gz \\\n    -o ${sample}_trimmed_R1.fastq.gz \\\n    -O ${sample}_trimmed_R2.fastq.gz \\\n    --html ${sample}_fastp.html \\\n    --json ${sample}_fastp.json \\\n    --thread 4 \\\n    --qualified_quality_phred 20 \\\n    --length_required 36\ndone\n\n# Alternative: Trimmomatic\ntrimmomatic PE -threads 4 \\\n  sample1_R1.fastq.gz sample1_R2.fastq.gz \\\n  sample1_trim_R1.fastq.gz sample1_unpaired_R1.fastq.gz \\\n  sample1_trim_R2.fastq.gz sample1_unpaired_R2.fastq.gz \\\n  ILLUMINACLIP:TruSeq3-PE.fa:2:30:10 \\\n  LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36", lang: "bash" },
                { step: 2, title: "Build HISAT2 index and align", cmd: "# Download reference genome and annotation\n# Example: Human GRCh38\nwget https://genome-idx.s3.amazonaws.com/hisat2/grch38.tar.gz\ntar -xzf grch38.tar.gz\n\n# Or build custom index\nhisat2-build reference.fasta genome_index\n\n# Align reads\nfor sample in sample1 sample2 sample3; do\n  hisat2 -x genome_index \\\n    -1 ${sample}_trimmed_R1.fastq.gz \\\n    -2 ${sample}_trimmed_R2.fastq.gz \\\n    -S ${sample}.sam \\\n    --dta \\\n    -p 8 \\\n    --summary-file ${sample}_alignment_summary.txt\n\n  # Convert to sorted BAM\n  samtools sort -@ 4 ${sample}.sam -o ${sample}.bam\n  samtools index ${sample}.bam\n  rm ${sample}.sam\ndone", lang: "bash" },
                { step: 3, title: "Count reads with featureCounts", cmd: "# Count reads per gene\nfeatureCounts \\\n  -a annotation.gtf \\\n  -o counts.txt \\\n  -T 8 \\\n  -p --countReadPairs \\\n  -s 2 \\\n  sample1.bam sample2.bam sample3.bam \\\n  control1.bam control2.bam control3.bam\n\n# -s 0: unstranded\n# -s 1: stranded\n# -s 2: reverse stranded (most common Illumina)\n\n# Check assignment summary\ncat counts.txt.summary", lang: "bash" },
                { step: 4, title: "Differential Expression with DESeq2 (R)", cmd: "# ===== R Script: deseq2_analysis.R =====\n\n# Install packages (first time)\nif (!requireNamespace(\"BiocManager\", quietly = TRUE))\n  install.packages(\"BiocManager\")\nBiocManager::install(c(\"DESeq2\", \"clusterProfiler\",\n  \"org.Hs.eg.db\", \"enrichplot\", \"AnnotationDbi\"))\ninstall.packages(c(\"ggplot2\", \"pheatmap\", \"ggrepel\"))\n\n# Load libraries\nlibrary(DESeq2)\nlibrary(ggplot2)\nlibrary(pheatmap)\nlibrary(ggrepel)\n\n# Read count matrix\ncounts_data <- read.table(\"counts.txt\",\n  header = TRUE, row.names = 1, skip = 1)\n# Keep only count columns (remove Chr, Start, End, Strand, Length)\ncounts_data <- counts_data[, 6:ncol(counts_data)]\n\n# Clean column names\ncolnames(counts_data) <- gsub(\"\\\\.bam$\", \"\", colnames(counts_data))\n\n# Create sample info\ncondition <- factor(c(rep(\"treatment\", 3), rep(\"control\", 3)))\ncoldata <- data.frame(\n  row.names = colnames(counts_data),\n  condition = condition\n)\n\n# Create DESeq2 dataset\ndds <- DESeqDataSetFromMatrix(\n  countData = round(counts_data),\n  colData = coldata,\n  design = ~ condition\n)\n\n# Pre-filter low count genes\nkeep <- rowSums(counts(dds)) >= 10\ndds <- dds[keep, ]\n\n# Run DESeq2\ndds <- DESeq(dds)\nres <- results(dds, contrast = c(\"condition\", \"treatment\", \"control\"),\n  alpha = 0.05)\n\n# Summary\nsummary(res)\n\n# Get significant results\nres_sig <- subset(as.data.frame(res),\n  padj < 0.05 & abs(log2FoldChange) > 1)\nres_sig <- res_sig[order(res_sig$padj), ]\n\n# Save results\nwrite.csv(as.data.frame(res), \"deseq2_all_results.csv\")\nwrite.csv(res_sig, \"deseq2_significant_results.csv\")\n\ncat(\"Total DEGs (padj<0.05, |LFC|>1):\", nrow(res_sig), \"\\n\")\ncat(\"Upregulated:\", sum(res_sig$log2FoldChange > 0), \"\\n\")\ncat(\"Downregulated:\", sum(res_sig$log2FoldChange < 0), \"\\n\")", lang: "r" },
                { step: 5, title: "Visualization", cmd: "# ===== Continuing R Script =====\n\n# --- MA Plot ---\npng(\"MA_plot.png\", width=800, height=600)\nplotMA(res, ylim=c(-5,5), main=\"MA Plot\")\ndev.off()\n\n# --- Volcano Plot ---\nres_df <- as.data.frame(res)\nres_df$significant <- ifelse(\n  res_df$padj < 0.05 & abs(res_df$log2FoldChange) > 1,\n  ifelse(res_df$log2FoldChange > 1, \"Up\", \"Down\"), \"NS\")\n\npng(\"volcano_plot.png\", width=900, height=700)\nggplot(res_df, aes(x=log2FoldChange, y=-log10(pvalue),\n  color=significant)) +\n  geom_point(alpha=0.6, size=1.5) +\n  scale_color_manual(values=c(\"Down\"=\"#3498db\",\n    \"NS\"=\"grey70\", \"Up\"=\"#e74c3c\")) +\n  theme_minimal(base_size=14) +\n  geom_vline(xintercept=c(-1,1), linetype=\"dashed\", color=\"grey40\") +\n  geom_hline(yintercept=-log10(0.05), linetype=\"dashed\", color=\"grey40\") +\n  labs(title=\"Volcano Plot\",\n    x=\"Log2 Fold Change\", y=\"-Log10 P-value\",\n    color=\"Significance\") +\n  theme(legend.position=\"top\")\ndev.off()\n\n# --- Heatmap of top 50 DEGs ---\nvsd <- vst(dds, blind=FALSE)\ntop50 <- head(order(res$padj), 50)\nmat <- assay(vsd)[top50, ]\nmat <- mat - rowMeans(mat)  # center\n\npng(\"heatmap_top50.png\", width=800, height=1000)\npheatmap(mat, scale=\"row\",\n  annotation_col=coldata,\n  show_rownames=TRUE,\n  fontsize_row=8,\n  main=\"Top 50 Differentially Expressed Genes\")\ndev.off()\n\n# --- PCA Plot ---\npng(\"pca_plot.png\", width=800, height=600)\nplotPCA(vsd, intgroup=\"condition\") +\n  theme_minimal(base_size=14) +\n  ggtitle(\"PCA of Samples\")\ndev.off()", lang: "r" },
                { step: 6, title: "GO & Pathway Enrichment (clusterProfiler)", cmd: "# ===== Continuing R Script =====\n\nlibrary(clusterProfiler)\nlibrary(org.Hs.eg.db)  # Human; use org.Mm.eg.db for mouse\nlibrary(enrichplot)\n\n# Get gene list\ngene_list <- res_sig$log2FoldChange\nnames(gene_list) <- rownames(res_sig)\n\n# Convert gene symbols to Entrez IDs\ngene_ids <- bitr(rownames(res_sig),\n  fromType = \"ENSEMBL\",  # or \"SYMBOL\"\n  toType = \"ENTREZID\",\n  OrgDb = org.Hs.eg.db)\n\n# GO Enrichment (Biological Process)\ngo_bp <- enrichGO(\n  gene = gene_ids$ENTREZID,\n  OrgDb = org.Hs.eg.db,\n  ont = \"BP\",\n  pAdjustMethod = \"BH\",\n  pvalueCutoff = 0.05,\n  qvalueCutoff = 0.05,\n  readable = TRUE\n)\n\n# KEGG Pathway Enrichment\nkegg <- enrichKEGG(\n  gene = gene_ids$ENTREZID,\n  organism = \"hsa\",  # hsa=human, mmu=mouse\n  pvalueCutoff = 0.05\n)\n\n# Save results\nwrite.csv(as.data.frame(go_bp), \"GO_BP_enrichment.csv\")\nwrite.csv(as.data.frame(kegg), \"KEGG_enrichment.csv\")\n\n# Visualize\npng(\"GO_dotplot.png\", width=900, height=700)\ndotplot(go_bp, showCategory=20) + ggtitle(\"GO Biological Process\")\ndev.off()\n\npng(\"KEGG_dotplot.png\", width=900, height=700)\ndotplot(kegg, showCategory=20) + ggtitle(\"KEGG Pathways\")\ndev.off()\n\npng(\"GO_barplot.png\", width=900, height=700)\nbarplot(go_bp, showCategory=15) + ggtitle(\"GO Enrichment\")\ndev.off()\n\n# Gene-concept network\npng(\"cnetplot.png\", width=1000, height=800)\ncnetplot(go_bp, categorySize=\"pvalue\", showCategory=5)\ndev.off()", lang: "r" }
              ],
              interpretation: "DESeq2 uses negative binomial model. Genes with padj < 0.05 and |log2FC| > 1 are typically considered significant. In volcano plots, genes in upper corners are most significant. PCA should show clear separation between conditions. GO enrichment reveals which biological processes are affected — look for terms with low q-values and high gene counts.",
              errors: [
                { error: "DESeq2: every gene has 0 counts", solution: "Check that featureCounts used correct GTF annotation matching your reference. Verify BAM files contain mapped reads (samtools flagstat). Check -s strandedness parameter." },
                { error: "featureCounts: 0% assignment rate", solution: "Most common cause: wrong strandedness (-s parameter). Try -s 0, -s 1, and -s 2. Also check GTF matches reference genome version." },
                { error: "clusterProfiler: no enrichment found", solution: "Ensure gene IDs match database (ENSEMBL vs SYMBOL vs ENTREZID). Try relaxing thresholds. Check organism database is correct." },
                { error: "HISAT2: 0% alignment rate", solution: "Verify genome index matches reads species. Check FASTQ quality. Ensure index was built correctly." }
              ]
            }
          },
          {
            id: "geo_analysis",
            label: "GEO Data Analysis",
            icon: "🌐",
            content: {
              title: "🌐 GEO Data Analysis (Microarray & RNA-seq)",
              what: "NCBI Gene Expression Omnibus (GEO) is a public repository of gene expression data. GEO2R allows online differential expression analysis. For more control, download data and analyze with limma or DESeq2.",
              questions: [
                "How do I find and analyze published expression datasets?",
                "How do I use GEO2R for quick DE analysis?",
                "How do I download and re-analyze GEO data locally?"
              ],
              tools: [
                { name: "GEO2R", type: "tool", desc: "Online DE analysis at NCBI GEO" },
                { name: "GEOquery", type: "tool", desc: "R package to download GEO data" },
                { name: "limma", type: "tool", desc: "Linear models for microarray/RNA-seq" },
                { name: "DEGEAR", type: "tool", desc: "Lab-developed DE analysis tool" },
                { name: "affy", type: "tool", desc: "Affymetrix microarray preprocessing" }
              ],
              workflow: [
                { step: 1, title: "Using GEO2R (Online — Quick)", cmd: "# Step-by-step GEO2R usage:\n# 1. Go to https://www.ncbi.nlm.nih.gov/geo/\n# 2. Search for your dataset (e.g., GSE12345)\n# 3. Click 'Analyze with GEO2R'\n# 4. Define groups (e.g., 'Control' vs 'Treatment')\n# 5. Assign samples to groups\n# 6. Click 'Top 250' to get results\n# 7. Download full results table\n# 8. View auto-generated R script for reproducibility", lang: "bash" },
                { step: 2, title: "Download and analyze GEO data in R", cmd: "# Install packages\nBiocManager::install(c(\"GEOquery\", \"limma\", \"pheatmap\"))\n\nlibrary(GEOquery)\nlibrary(limma)\nlibrary(ggplot2)\nlibrary(pheatmap)\n\n# Download GEO dataset\ngse <- getGEO(\"GSE12345\", GSEMatrix = TRUE)\ndata <- gse[[1]]\n\n# Get expression matrix\nexpr_mat <- exprs(data)\n\n# Get phenotype/sample info\npheno <- pData(data)\n\n# Check what columns are available\ncolnames(pheno)\nhead(pheno)\n\n# Define groups (adapt column name to your dataset)\ngroup <- factor(pheno$`condition:ch1`)\ndesign <- model.matrix(~ 0 + group)\ncolnames(design) <- levels(group)\n\n# Fit linear model (limma)\nfit <- lmFit(expr_mat, design)\ncontrast.matrix <- makeContrasts(\n  Treatment_vs_Control = treatment - control,\n  levels = design)\nfit2 <- contrasts.fit(fit, contrast.matrix)\nfit2 <- eBayes(fit2)\n\n# Get results\nresults <- topTable(fit2, number = Inf, sort.by = \"P\")\nresults_sig <- subset(results,\n  adj.P.Val < 0.05 & abs(logFC) > 1)\n\nwrite.csv(results, \"limma_all_results.csv\")\nwrite.csv(results_sig, \"limma_significant.csv\")\n\ncat(\"Significant DEGs:\", nrow(results_sig), \"\\n\")", lang: "r" }
              ]
            }
          },
          {
            id: "transcriptome_assembly",
            label: "Transcriptome Assembly",
            icon: "🧩",
            content: {
              title: "🧩 Transcriptome Assembly (de novo)",
              what: "Transcriptome assembly reconstructs full-length transcript sequences from RNA-seq reads. Useful for organisms without a reference genome. Trinity is the standard tool for de novo RNA-seq assembly.",
              questions: [
                "What transcripts are expressed in an organism without a reference genome?",
                "How do we reconstruct full-length mRNA from short reads?"
              ],
              tools: [
                { name: "Trinity", type: "tool", desc: "De novo RNA-seq assembler" },
                { name: "Trans-ABySS", type: "tool", desc: "Alternative transcriptome assembler" },
                { name: "RSEM", type: "tool", desc: "Transcript quantification" },
                { name: "Salmon", type: "tool", desc: "Fast transcript quantification" },
                { name: "TransDecoder", type: "tool", desc: "Identify coding regions in transcripts" },
                { name: "Trinotate", type: "tool", desc: "Transcriptome functional annotation" }
              ],
              workflow: [
                { step: 1, title: "De novo assembly with Trinity", cmd: "# Install Trinity\nconda install -c bioconda trinity\n\n# Run assembly (requires significant memory ~1GB per 1M reads)\nTrinity --seqType fq \\\n  --left trimmed_R1.fastq.gz \\\n  --right trimmed_R2.fastq.gz \\\n  --CPU 8 --max_memory 50G \\\n  --output trinity_output\n\n# Assembly stats\nTrinityStats.pl trinity_output/Trinity.fasta", lang: "bash" },
                { step: 2, title: "Assembly quality and quantification", cmd: "# Check completeness with BUSCO\nbusco -i trinity_output/Trinity.fasta \\\n  -l metazoa_odb10 -o busco_transcriptome \\\n  -m transcriptome -c 4\n\n# Quantify with Salmon\nsalmon index -t trinity_output/Trinity.fasta -i trinity_index\nsalmon quant -i trinity_index \\\n  -l A -1 trimmed_R1.fastq.gz -2 trimmed_R2.fastq.gz \\\n  -o salmon_quant -p 8", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  4. PHYLOGENETICS & PHYLOGENOMICS
      // ──────────────────────────────────────────────
      {
        id: "phylogenetics",
        label: "Phylogenetics & Phylogenomics",
        icon: "🌳",
        color: "orange",
        content: {
          title: "🌳 Phylogenetics & Phylogenomics",
          what: "Phylogenetics is the study of evolutionary relationships among organisms using molecular data (DNA, RNA, protein sequences). Phylogenomics extends this to whole-genome scale analysis. Results are depicted as phylogenetic trees.",
          questions: [
            "How are organisms evolutionarily related?",
            "When did species diverge (molecular dating)?",
            "Did horizontal gene transfer (HGT) occur?",
            "What is the evolutionary history of a gene family?",
            "How do we classify new organisms?"
          ],
          tools: [
            { name: "MEGA", type: "tool", desc: "Molecular Evolutionary Genetics Analysis — GUI-based" },
            { name: "RAxML", type: "tool", desc: "Maximum Likelihood phylogenetics (v8 & RAxML-NG)" },
            { name: "IQ-TREE", type: "tool", desc: "Fast ML tree with model selection" },
            { name: "MrBayes", type: "tool", desc: "Bayesian phylogenetic inference" },
            { name: "BEAST2", type: "tool", desc: "Bayesian molecular dating" },
            { name: "FigTree", type: "tool", desc: "Tree visualization" },
            { name: "ape (R)", type: "tool", desc: "R package for phylogenetics" },
            { name: "ggtree (R)", type: "tool", desc: "Tree visualization in R/ggplot2" },
            { name: "HGTPhyloDetect", type: "tool", desc: "Horizontal gene transfer detection" },
            { name: "NCBI Genome Workbench", type: "tool", desc: "Integrated genome analysis viewer" }
          ]
        },
        children: [
          {
            id: "tree_construction",
            label: "Tree Construction Methods",
            icon: "🔨",
            content: {
              title: "🔨 Phylogenetic Tree Construction",
              what: "Phylogenetic trees can be built using distance-based methods (UPGMA, Neighbor-Joining), maximum parsimony, maximum likelihood (RAxML, IQ-TREE), or Bayesian inference (MrBayes, BEAST).",
              questions: [
                "Which tree-building method is most appropriate for my data?",
                "How do I assess tree reliability (bootstrap)?",
                "What substitution model should I use?"
              ],
              algorithms: [
                { name: "UPGMA", desc: "Unweighted Pair Group Method with Arithmetic Mean — assumes molecular clock (rarely appropriate)." },
                { name: "Neighbor-Joining (NJ)", desc: "Distance-based method that doesn't assume a molecular clock. Fast, good for initial analysis." },
                { name: "Maximum Parsimony", desc: "Finds tree requiring fewest evolutionary changes." },
                { name: "Maximum Likelihood (ML)", desc: "Finds tree that maximizes probability of observed data given a substitution model. Gold standard." },
                { name: "Bayesian Inference", desc: "Uses MCMC to sample tree space and estimate posterior probabilities. Provides support values directly." }
              ],
              math: [
                "Jukes-Cantor distance: d = -¾ ln(1 - 4p/3) where p = proportion of different sites",
                "Kimura 2-parameter: d = -½ ln(1-2P-Q) - ¼ ln(1-2Q) where P=transitions, Q=transversions",
                "ML: L(T,θ) = P(D|T,θ) — find tree T and parameters θ that maximize likelihood of data D",
                "Bootstrap: resample alignment columns with replacement, rebuild tree, report % support"
              ],
              workflow: [
                { step: 1, title: "Prepare alignment for phylogeny", cmd: "# First, create MSA of homologous sequences\nmafft --auto sequences.fasta > aligned.fasta\n\n# Trim poorly aligned regions\nconda install -c bioconda trimal\ntrimal -in aligned.fasta -out trimmed.fasta -automated1\n\n# Convert formats if needed\nconda install -c bioconda goalign\ngoalign reformat phylip -i trimmed.fasta -o trimmed.phy", lang: "bash" },
                { step: 2, title: "Build tree with IQ-TREE (recommended)", cmd: "# Install IQ-TREE\nconda install -c bioconda iqtree\n\n# Run with automatic model selection + bootstrap\niqtree -s trimmed.fasta \\\n  -m MFP \\\n  -bb 1000 \\\n  -alrt 1000 \\\n  -nt AUTO \\\n  -pre phylo_output\n\n# MFP = ModelFinder Plus (auto model selection)\n# -bb 1000 = 1000 ultrafast bootstrap replicates\n# -alrt 1000 = SH-aLRT test replicates\n\n# Output files:\n# phylo_output.treefile — best ML tree (Newick format)\n# phylo_output.iqtree — full report with model info\n# phylo_output.log — run log", lang: "bash" },
                { step: 3, title: "Build tree with RAxML", cmd: "# Install RAxML-NG\nconda install -c bioconda raxml-ng\n\n# Run RAxML-NG\nraxml-ng --all \\\n  --msa trimmed.fasta \\\n  --model GTR+G \\\n  --bs-trees 100 \\\n  --threads 4 \\\n  --prefix raxml_output\n\n# Classic RAxML v8 syntax (if using v8)\n# raxmlHPC -f a -x 12345 -p 12345 -# 100 \\\n#   -s trimmed.phy -n output -m GTRGAMMA", lang: "bash" },
                { step: 4, title: "Phylogenetics in R with ape", cmd: "# ===== R Script =====\ninstall.packages(\"ape\")\ninstall.packages(\"phangorn\")\nBiocManager::install(\"ggtree\")\n\nlibrary(ape)\nlibrary(phangorn)\nlibrary(ggtree)\n\n# Read alignment\naln <- read.phyDat(\"trimmed.fasta\", format=\"fasta\", type=\"DNA\")\n\n# Distance-based tree (NJ with Kimura 2-parameter)\ndist_mat <- dist.dna(as.DNAbin(aln), model=\"K80\")  # Kimura 2-parameter\nnj_tree <- nj(dist_mat)\n\n# Bootstrap NJ tree\nbs_nj <- boot.phylo(nj_tree, as.DNAbin(aln),\n  function(x) nj(dist.dna(x, model=\"K80\")),\n  B = 1000, quiet = TRUE)\n\n# Plot\npng(\"nj_tree.png\", width=800, height=600)\nplot(nj_tree, main=\"Neighbor-Joining Tree (K2P)\")\nnodelabels(bs_nj, cex=0.7, bg=\"lightyellow\")\nadd.scale.bar()\ndev.off()\n\n# Maximum Likelihood with phangorn\nfit <- pml(nj_tree, data=aln)\nfit_gtr <- optim.pml(fit, model=\"GTR\", optGamma=TRUE,\n  optInv=TRUE, rearrangement=\"stochastic\")\n\n# Bootstrap ML\nbs_ml <- bootstrap.pml(fit_gtr, bs=100,\n  optNni=TRUE, multicore=TRUE, mc.cores=4)\n\n# Plot ML tree with ggtree\nml_tree <- fit_gtr$tree\npng(\"ml_tree.png\", width=800, height=600)\nggtree(ml_tree) +\n  geom_tiplab(size=3) +\n  geom_nodelab(aes(label=label), size=2, hjust=-0.1) +\n  theme_tree2() +\n  ggtitle(\"Maximum Likelihood Tree (GTR+G+I)\")\ndev.off()", lang: "r" },
                { step: 5, title: "Visualize tree with FigTree or iTOL", cmd: "# FigTree (desktop application)\n# Download: http://tree.bio.ed.ac.uk/software/figtree/\n# Open .treefile in FigTree\n\n# iTOL (online)\n# Upload .treefile to https://itol.embl.de/\n# Customize appearance, add annotations\n\n# ETE Toolkit (Python)\npip install ete3\npython3 -c \"\nfrom ete3 import Tree\nt = Tree('phylo_output.treefile')\nprint(t.get_ascii(show_internal=True))\n\"", lang: "bash" }
              ],
              interpretation: "Bootstrap values ≥70% (ML) or posterior probabilities ≥0.95 (Bayesian) indicate well-supported nodes. Use IQ-TREE's ModelFinder to select the best substitution model (don't just assume GTR+G). Long branches may indicate rapid evolution, sequencing errors, or long-branch attraction artifacts. Root the tree with an outgroup for proper interpretation.",
              errors: [
                { error: "IQ-TREE: Alignment has too many identical sequences", solution: "Remove duplicate/identical sequences. Use CD-HIT to reduce redundancy: cd-hit -i sequences.fasta -o unique.fasta -c 0.99" },
                { error: "RAxML: Sequence names contain illegal characters", solution: "Remove spaces, colons, semicolons, parentheses from sequence names. Use sed: sed 's/[^a-zA-Z0-9_]/_/g'" },
                { error: "Very long branches in tree", solution: "Could be long-branch attraction. Try removing problematic taxon, using better models, or Bayesian methods. Verify sequences are correct (not chimeric)." }
              ]
            }
          },
          {
            id: "molecular_dating",
            label: "Molecular Dating",
            icon: "⏰",
            content: {
              title: "⏰ Molecular Dating & Divergence Times",
              what: "Molecular dating estimates when lineages diverged using molecular clock models. It combines phylogenetic analysis with fossil calibrations or known divergence times to put absolute time on evolutionary trees.",
              questions: [
                "When did two species diverge?",
                "What is the rate of molecular evolution?",
                "How old is a particular gene duplication event?"
              ],
              tools: [
                { name: "BEAST2", type: "tool", desc: "Bayesian Evolutionary Analysis by Sampling Trees" },
                { name: "MEGA (RelTime)", type: "tool", desc: "Relative time estimation in MEGA" },
                { name: "r8s", type: "tool", desc: "Rate smoothing for divergence time estimation" },
                { name: "MCMCTree (PAML)", type: "tool", desc: "Bayesian dating in PAML package" }
              ],
              workflow: [
                { step: 1, title: "Molecular dating with MEGA", cmd: "# MEGA is GUI-based. Steps:\n# 1. Open MEGA software\n# 2. Load aligned sequences (File > Open Alignment)\n# 3. Go to Phylogeny > Construct Timetree\n# 4. Select calibration points (known divergence times)\n# 5. Choose substitution model (e.g., Kimura 2-parameter)\n# 6. Set molecular clock type (Strict or Relaxed)\n# 7. Run analysis and export timetree\n\n# For command-line alternative, use BEAST2:\nconda install -c bioconda beast2", lang: "bash" }
              ]
            }
          },
          {
            id: "hgt_detection",
            label: "Horizontal Gene Transfer",
            icon: "🔀",
            content: {
              title: "🔀 Horizontal Gene Transfer (HGT) Detection",
              what: "HGT is the transfer of genetic material between organisms outside of vertical (parent to offspring) inheritance. Common in prokaryotes. Detection methods include phylogenetic incongruence, compositional analysis, and comparative genomics.",
              questions: [
                "Has a gene been acquired from a distant organism?",
                "What genes have undergone horizontal transfer?",
                "How does HGT affect phylogenetic reconstruction?"
              ],
              tools: [
                { name: "HGTPhyloDetect", type: "tool", desc: "Phylogenetic approach to HGT detection" },
                { name: "IslandViewer", type: "tool", desc: "Web tool for genomic island prediction" },
                { name: "Alien_hunter", type: "tool", desc: "Compositional bias-based HGT detection" },
                { name: "T-REX", type: "tool", desc: "Tree comparison for HGT inference" }
              ],
              workflow: [
                { step: 1, title: "HGT detection with HGTPhyloDetect", cmd: "# Install HGTPhyloDetect\npip install HGTPhyloDetect\n\n# Or clone from GitHub\ngit clone https://github.com/user/HGTPhyloDetect.git\ncd HGTPhyloDetect\npython setup.py install\n\n# Run analysis following tool documentation\n# Generally involves:\n# 1. Building gene trees for each gene family\n# 2. Comparing gene trees with species tree\n# 3. Identifying topological incongruence\n# 4. Statistical testing for HGT events", lang: "bash" },
                { step: 2, title: "Compositional analysis for HGT", cmd: "# Genes acquired by HGT often have different\n# GC content and codon usage than the host genome\n\n# Calculate GC content along genome\n# Using Biopython\npython3 << 'EOF'\nfrom Bio import SeqIO\nimport numpy as np\n\ndef gc_content(seq):\n    gc = sum(1 for b in seq.upper() if b in 'GC')\n    return gc / len(seq) * 100\n\ngenome = SeqIO.read('genome.fasta', 'fasta')\nwindow = 1000\nstep = 500\n\nfor i in range(0, len(genome.seq) - window, step):\n    subseq = genome.seq[i:i+window]\n    gc = gc_content(str(subseq))\n    print(f'{i}\\t{gc:.2f}')\nEOF\n\n# Regions with significantly different GC content\n# may have been acquired by HGT", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  5. METAGENOMICS & MICROBIAL ANALYSIS
      // ──────────────────────────────────────────────
      {
        id: "metagenomics",
        label: "Metagenomics & Microbial Analysis",
        icon: "🦠",
        color: "pink",
        content: {
          title: "🦠 Metagenomics & Microbial Analysis",
          what: "Metagenomics studies genetic material recovered directly from environmental or clinical samples. It enables analysis of microbial community composition, diversity, and function without culturing individual organisms.",
          questions: [
            "What microorganisms are present in a sample?",
            "How diverse is the microbial community?",
            "How do communities differ between conditions?",
            "What metabolic functions are present in the community?",
            "Are there pathogenic organisms present?"
          ],
          tools: [
            { name: "QIIME2", type: "tool", desc: "Comprehensive microbiome analysis platform" },
            { name: "mothur", type: "tool", desc: "Microbial community analysis" },
            { name: "Kraken2", type: "tool", desc: "Taxonomic classification" },
            { name: "MetaPhlAn", type: "tool", desc: "Metagenomic profiling" },
            { name: "HUMAnN", type: "tool", desc: "Functional profiling of metagenomes" },
            { name: "phyloseq (R)", type: "tool", desc: "Microbiome data analysis in R" },
            { name: "DADA2", type: "tool", desc: "ASV inference from amplicon data" }
          ]
        },
        children: [
          {
            id: "amplicon_16s",
            label: "16S rRNA Amplicon Analysis",
            icon: "🔍",
            content: {
              title: "🔍 16S rRNA Amplicon Analysis",
              what: "16S rRNA gene sequencing targets the bacterial 16S ribosomal RNA gene to identify and classify bacteria in a sample. Variable regions (V3-V4 most common) provide taxonomic resolution.",
              questions: [
                "What bacterial species are present?",
                "How diverse is the bacterial community (alpha/beta diversity)?",
                "Which taxa differ between treatment groups?"
              ],
              workflow: [
                { step: 1, title: "QIIME2 Analysis Pipeline", cmd: "# Install QIIME2\nconda install -c qiime2 qiime2\n# Or use official install: https://docs.qiime2.org/\n\n# Import data\nqiime tools import \\\n  --type 'SampleData[PairedEndSequencesWithQuality]' \\\n  --input-path manifest.tsv \\\n  --output-path demux.qza \\\n  --input-format PairedEndFastqManifestPhred33V2\n\n# Visualize quality\nqiime demux summarize \\\n  --i-data demux.qza \\\n  --o-visualization demux.qzv", lang: "bash" },
                { step: 2, title: "Denoise with DADA2 (in QIIME2)", cmd: "# DADA2 denoising\nqiime dada2 denoise-paired \\\n  --i-demultiplexed-seqs demux.qza \\\n  --p-trim-left-f 17 \\\n  --p-trim-left-r 21 \\\n  --p-trunc-len-f 250 \\\n  --p-trunc-len-r 200 \\\n  --p-n-threads 8 \\\n  --o-table table.qza \\\n  --o-representative-sequences rep-seqs.qza \\\n  --o-denoising-stats stats.qza\n\n# View denoising stats\nqiime metadata tabulate \\\n  --m-input-file stats.qza \\\n  --o-visualization stats.qzv", lang: "bash" },
                { step: 3, title: "Taxonomy classification", cmd: "# Download pre-trained classifier (Silva or Greengenes2)\n# Silva 138 V3-V4 classifier:\nwget https://data.qiime2.org/2024.2/common/silva-138-99-nb-classifier.qza\n\n# Classify\nqiime feature-classifier classify-sklearn \\\n  --i-classifier silva-138-99-nb-classifier.qza \\\n  --i-reads rep-seqs.qza \\\n  --o-classification taxonomy.qza\n\n# Visualize taxonomy barplot\nqiime taxa barplot \\\n  --i-table table.qza \\\n  --i-taxonomy taxonomy.qza \\\n  --m-metadata-file metadata.tsv \\\n  --o-visualization taxa-barplot.qzv", lang: "bash" },
                { step: 4, title: "Diversity analysis", cmd: "# Build phylogenetic tree\nqiime phylogeny align-to-tree-mafft-fasttree \\\n  --i-sequences rep-seqs.qza \\\n  --o-alignment aligned-rep-seqs.qza \\\n  --o-masked-alignment masked-aligned.qza \\\n  --o-tree unrooted-tree.qza \\\n  --o-rooted-tree rooted-tree.qza\n\n# Core diversity analysis\nqiime diversity core-metrics-phylogenetic \\\n  --i-phylogeny rooted-tree.qza \\\n  --i-table table.qza \\\n  --p-sampling-depth 10000 \\\n  --m-metadata-file metadata.tsv \\\n  --output-dir diversity-results\n\n# Alpha diversity significance\nqiime diversity alpha-group-significance \\\n  --i-alpha-diversity diversity-results/shannon_vector.qza \\\n  --m-metadata-file metadata.tsv \\\n  --o-visualization shannon-significance.qzv\n\n# Beta diversity significance (PERMANOVA)\nqiime diversity beta-group-significance \\\n  --i-distance-matrix diversity-results/unweighted_unifrac_distance_matrix.qza \\\n  --m-metadata-column treatment \\\n  --m-metadata-file metadata.tsv \\\n  --o-visualization permanova.qzv", lang: "bash" }
              ],
              interpretation: "Alpha diversity (Shannon, Chao1, observed features) measures within-sample diversity. Beta diversity (UniFrac, Bray-Curtis) measures between-sample differences — visualize with PCoA/NMDS. PERMANOVA p<0.05 indicates significant community differences. Taxonomy barplots show relative abundance at different taxonomic levels. Rarefaction curves should plateau to ensure sufficient sequencing depth.",
              errors: [
                { error: "QIIME2: No sequences passed the filter", solution: "Adjust --p-trunc-len to where quality scores are still >20. Check quality plots first. Ensure trim parameters don't remove too much." },
                { error: "DADA2: Too few reads remain after filtering", solution: "Relax quality parameters. Check if primers are properly trimmed. Verify input format matches expected format." }
              ]
            }
          },
          {
            id: "shotgun_metagenomics",
            label: "Shotgun Metagenomics",
            icon: "💥",
            content: {
              title: "💥 Shotgun Metagenomics",
              what: "Shotgun metagenomics sequences all DNA in a sample (not just 16S), providing both taxonomic and functional information at higher resolution.",
              questions: [
                "What organisms are present at species/strain level?",
                "What functional genes and pathways are in the community?",
                "Are antimicrobial resistance genes present?"
              ],
              tools: [
                { name: "Kraken2", type: "tool", desc: "Fast taxonomic classification using k-mers" },
                { name: "MetaPhlAn4", type: "tool", desc: "Marker-based taxonomic profiling" },
                { name: "HUMAnN3", type: "tool", desc: "Functional profiling — pathways, gene families" },
                { name: "MEGAHIT", type: "tool", desc: "Metagenomic assembly" },
                { name: "MaxBin2", type: "tool", desc: "Metagenomic binning" },
                { name: "CheckM", type: "tool", desc: "Bin quality assessment" }
              ],
              workflow: [
                { step: 1, title: "Taxonomic profiling with Kraken2", cmd: "# Install\nconda install -c bioconda kraken2 bracken\n\n# Download database (8GB standard)\nkraken2-build --standard --db kraken2_db --threads 8\n\n# Run classification\nkraken2 --db kraken2_db \\\n  --paired reads_R1.fastq.gz reads_R2.fastq.gz \\\n  --output kraken_output.txt \\\n  --report kraken_report.txt \\\n  --threads 8\n\n# Abundance estimation with Bracken\nbracken -d kraken2_db \\\n  -i kraken_report.txt \\\n  -o bracken_output.txt \\\n  -r 150 -l S", lang: "bash" },
                { step: 2, title: "Functional profiling with HUMAnN3", cmd: "conda install -c bioconda humann\n\n# Download databases\nhumann_databases --download chocophlan full /path/to/databases\nhumann_databases --download uniref uniref90_diamond /path/to/databases\n\n# Run HUMAnN3\nhumann --input reads.fastq.gz \\\n  --output humann_output/ \\\n  --threads 8\n\n# Output:\n# *_genefamilies.tsv — gene family abundances\n# *_pathabundance.tsv — pathway abundances\n# *_pathcoverage.tsv — pathway coverage", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  6. COMPARATIVE GENOMICS
      // ──────────────────────────────────────────────
      {
        id: "comparative_genomics",
        label: "Comparative Genomics",
        icon: "🔄",
        color: "red",
        content: {
          title: "🔄 Comparative Genomics",
          what: "Comparative genomics compares genome structure and content across species or strains to understand evolution, identify conserved elements, find lineage-specific genes, and understand genome rearrangements.",
          questions: [
            "What genes are shared between organisms (core genome)?",
            "What genes are unique to a particular lineage (accessory genome)?",
            "How do genomes rearrange during evolution?",
            // ================================================================
//  CONTINUATION — paste directly after the last line of Part 1
//  (which ended inside comparative_genomics.content.questions)
// ================================================================

            "What syntenic regions are conserved between genomes?",
            "What role does gene duplication play in evolution?"
          ],
          tools: [
            { name: "OrthoFinder", type: "tool", desc: "Ortholog and orthogroup inference" },
            { name: "Roary", type: "tool", desc: "Pan-genome analysis for prokaryotes" },
            { name: "Panaroo", type: "tool", desc: "Robust pan-genome pipeline" },
            { name: "MUMmer", type: "tool", desc: "Whole-genome alignment" },
            { name: "Mauve", type: "tool", desc: "Multiple genome alignment and visualization" },
            { name: "SyMAP", type: "tool", desc: "Synteny mapping" },
            { name: "ANI calculator", type: "tool", desc: "Average Nucleotide Identity" },
            { name: "Sibelia", type: "tool", desc: "Synteny block detection" }
          ]
        },
        children: [
          {
            id: "pan_genome",
            label: "Pan-genome Analysis",
            icon: "🫧",
            content: {
              title: "🫧 Pan-genome Analysis",
              what: "Pan-genome analysis determines the core genome (genes shared by all strains), accessory genome (present in some strains), and unique genes in a collection of related genomes.",
              questions: [
                "What is the core genome of this species?",
                "How open or closed is the pan-genome?",
                "What accessory genes differentiate pathogenic from commensal strains?"
              ],
              tools: [
                { name: "Roary", type: "tool", desc: "Fast pan-genome pipeline from GFF files" },
                { name: "Panaroo", type: "tool", desc: "Error-aware pan-genome pipeline" },
                { name: "PIRATE", type: "tool", desc: "Pangenome analysis with intergenic regions" },
                { name: "PPanGGOLiN", type: "tool", desc: "Partitioned pan-genome graphs" }
              ],
              workflow: [
                { step: 1, title: "Annotate all genomes first", cmd: "# Annotate each genome with Prokka\nfor genome in genomes/*.fasta; do\n  name=$(basename $genome .fasta)\n  prokka --outdir prokka_${name} \\\n    --prefix ${name} \\\n    --cpus 4 \\\n    $genome\ndone", lang: "bash" },
                { step: 2, title: "Run Roary pan-genome analysis", cmd: "# Install Roary\nconda install -c bioconda roary\n\n# Collect GFF files\nmkdir gff_files\ncp prokka_*//*.gff gff_files/\n\n# Run Roary\nroary -e -n -p 8 \\\n  -f roary_output \\\n  -i 95 \\\n  gff_files/*.gff\n\n# Key outputs:\n# gene_presence_absence.csv — matrix of gene presence/absence\n# core_gene_alignment.aln — alignment of core genes\n# summary_statistics.txt — pan-genome stats\n# pan_genome_reference.fa — representative sequences", lang: "bash" },
                { step: 3, title: "Visualize with Roary plots", cmd: "# Generate pan-genome plots\npython roary_plots.py roary_output/accessory_binary_genes.fa.newick \\\n  roary_output/gene_presence_absence.csv\n\n# Or use R\n# install.packages('pagoo') for interactive pan-genome analysis", lang: "bash" }
              ],
              interpretation: "Core genes (present in ≥99% of genomes) represent essential functions. Shell genes (15-95%) may be involved in niche adaptation. Cloud genes (<15%) are often mobile elements or strain-specific. A pan-genome is 'open' if new genes keep appearing with each new genome added, and 'closed' if it plateaus."
            }
          },
          {
            id: "whole_genome_alignment",
            label: "Whole Genome Alignment",
            icon: "🔗",
            content: {
              title: "🔗 Whole Genome Alignment & Synteny",
              what: "Whole-genome alignment compares entire genome sequences to identify homologous regions, structural rearrangements, inversions, translocations, and syntenic blocks.",
              questions: [
                "What regions are conserved between two genomes?",
                "What structural rearrangements have occurred?",
                "What is the Average Nucleotide Identity (ANI) between strains?"
              ],
              tools: [
                { name: "MUMmer / nucmer", type: "tool", desc: "Fast whole-genome alignment using suffix trees" },
                { name: "Mauve", type: "tool", desc: "Progressive genome alignment with rearrangements" },
                { name: "minimap2", type: "tool", desc: "Fast pairwise alignment for long sequences" },
                { name: "pyani", type: "tool", desc: "ANI calculation in Python" }
              ],
              workflow: [
                { step: 1, title: "ANI calculation", cmd: "# Install pyani\npip install pyani\n\n# Calculate ANI\naverage_nucleotide_identity.py \\\n  -i genomes_directory/ \\\n  -o ani_output/ \\\n  -m ANIb \\\n  -g\n\n# ANI > 95-96% = same species\n# ANI > 99% = same strain", lang: "bash" },
                { step: 2, title: "Whole-genome alignment with MUMmer", cmd: "# Install MUMmer\nconda install -c bioconda mummer\n\n# Run nucmer\nnucmer --prefix=alignment \\\n  reference.fasta query.fasta\n\n# Filter alignments\ndelta-filter -1 alignment.delta > filtered.delta\n\n# Generate coords\nshow-coords -rcl filtered.delta > alignment.coords\n\n# Generate dotplot\nmummerplot --png --large \\\n  -p dotplot filtered.delta\n\n# Show SNPs\nshow-snps -Clr filtered.delta > snps.txt", lang: "bash" }
              ],
              interpretation: "In dot plots, diagonal lines indicate syntenic (collinear) regions. Breaks in the diagonal suggest rearrangements. Inversions appear as lines going in the opposite direction. ANI >95% is the standard species boundary for prokaryotes."
            }
          },
          {
            id: "ortholog_analysis",
            label: "Ortholog / Paralog Analysis",
            icon: "👥",
            content: {
              title: "👥 Ortholog & Paralog Analysis",
              what: "Orthologs are genes in different species descended from a common ancestor (speciation events). Paralogs arise from gene duplication within a species. Identifying orthologs is crucial for functional annotation transfer and phylogenomics.",
              questions: [
                "Which genes in different species are orthologs?",
                "What gene duplication events have occurred?",
                "How can orthology inform gene function prediction?"
              ],
              tools: [
                { name: "OrthoFinder", type: "tool", desc: "Comprehensive ortholog inference from proteomes" },
                { name: "OrthoMCL", type: "tool", desc: "Graph-based ortholog clustering" },
                { name: "InParanoid", type: "tool", desc: "Pairwise ortholog detection" },
                { name: "BUSCO", type: "tool", desc: "Universal single-copy orthologs for completeness" }
              ],
              workflow: [
                { step: 1, title: "Run OrthoFinder", cmd: "# Install\nconda install -c bioconda orthofinder\n\n# Prepare: one FASTA file of proteins per species\nmkdir proteomes\n# Copy .faa files from Prokka output\ncp prokka_*//*.faa proteomes/\n\n# Run OrthoFinder\northofinder -f proteomes/ -t 8 -a 4\n\n# Key outputs (in Results_XXXX/):\n# Orthogroups/Orthogroups.tsv — gene membership\n# Comparative_Genomics_Statistics/\n# Species_Tree/SpeciesTree_rooted.txt\n# Phylogenetic_Hierarchical_Orthogroups/", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  7. STRUCTURAL BIOINFORMATICS
      // ──────────────────────────────────────────────
      {
        id: "structural_bioinfo",
        label: "Structural Bioinformatics",
        icon: "🏛️",
        color: "cyan",
        content: {
          title: "🏛️ Structural Bioinformatics",
          what: "Structural bioinformatics deals with the analysis and prediction of 3D structures of biological macromolecules (proteins, nucleic acids). Understanding structure helps explain function, interactions, and enables drug design.",
          questions: [
            "What is the 3D structure of a protein?",
            "How can we predict structure from sequence?",
            "What is the binding site for a drug or ligand?",
            "How do two proteins interact?",
            "How does a mutation affect protein structure?"
          ],
          tools: [
            { name: "AlphaFold2", type: "tool", desc: "Deep learning protein structure prediction (revolutionary)" },
            { name: "PyMOL", type: "tool", desc: "Molecular visualization" },
            { name: "Chimera / ChimeraX", type: "tool", desc: "UCSF molecular visualization and analysis" },
            { name: "Swiss-Model", type: "tool", desc: "Homology modeling server" },
            { name: "MODELLER", type: "tool", desc: "Comparative protein structure modeling" },
            { name: "AutoDock Vina", type: "tool", desc: "Molecular docking" },
            { name: "GROMACS", type: "tool", desc: "Molecular dynamics simulations" },
            { name: "Rosetta", type: "tool", desc: "Protein structure prediction and design" },
            { name: "I-TASSER", type: "tool", desc: "Structure and function prediction" },
            { name: "SWISS-PDB Viewer", type: "tool", desc: "Protein structure analysis" }
          ],
          databases: [
            { name: "PDB", type: "db", desc: "Protein Data Bank — experimental structures" },
            { name: "AlphaFold DB", type: "db", desc: "Predicted structures from AlphaFold" },
            { name: "SCOP/CATH", type: "db", desc: "Structural classification databases" },
            { name: "UniProt", type: "db", desc: "Protein sequences with structure links" }
          ]
        },
        children: [
          {
            id: "structure_prediction",
            label: "Protein Structure Prediction",
            icon: "🔮",
            content: {
              title: "🔮 Protein Structure Prediction",
              what: "Protein structure prediction determines the 3D fold of a protein from its amino acid sequence. Methods include homology modeling (template-based), ab initio prediction, and deep learning approaches like AlphaFold2.",
              questions: [
                "What is the predicted 3D structure of my protein?",
                "How confident is the prediction?",
                "What structural domains does my protein contain?"
              ],
              tools: [
                { name: "AlphaFold2", type: "tool", desc: "State-of-the-art deep learning prediction" },
                { name: "ColabFold", type: "tool", desc: "AlphaFold2 on Google Colab (easy access)" },
                { name: "ESMFold", type: "tool", desc: "Meta's protein language model predictions" },
                { name: "Swiss-Model", type: "tool", desc: "Automated homology modeling" },
                { name: "RoseTTAFold", type: "tool", desc: "Three-track neural network prediction" }
              ],
              workflow: [
                { step: 1, title: "Structure prediction with ColabFold", cmd: "# ColabFold (easiest method — uses Google Colab)\n# 1. Go to: https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb\n# 2. Paste your protein sequence in the query field\n# 3. Set parameters (num_recycles=3, use_amber=True for refinement)\n# 4. Run all cells\n# 5. Download results (.pdb files + confidence scores)\n\n# Local AlphaFold2 installation (requires GPU + ~2TB database)\nconda install -c conda-forge -c bioconda colabfold\ncolabfold_batch input.fasta output_dir/\n\n# Or use the AlphaFold Database directly:\n# https://alphafold.ebi.ac.uk/\n# Search by UniProt ID to get pre-computed structures", lang: "bash" },
                { step: 2, title: "Homology modeling with Swiss-Model", cmd: "# Swiss-Model (web server — no installation needed)\n# 1. Go to: https://swissmodel.expasy.org/\n# 2. Paste protein sequence\n# 3. Click 'Build Model'\n# 4. Server identifies templates, builds models\n# 5. Download .pdb file\n\n# Evaluate model quality:\n# - GMQE (Global Model Quality Estimation): 0-1, higher is better\n# - QMEANDisCo: local quality per residue\n# - QMEAN Z-score: > -4.0 is acceptable", lang: "bash" },
                { step: 3, title: "Visualize with PyMOL", cmd: "# Install PyMOL\nconda install -c conda-forge pymol-open-source\n\n# Open structure\npymol predicted_structure.pdb\n\n# PyMOL commands:\n# Color by secondary structure\ncolor red, ss h  # helices\ncolor yellow, ss s  # sheets\ncolor green, ss l+''  # loops\n\n# Color by B-factor (confidence for AlphaFold)\nspectrum b, blue_red, minimum=0, maximum=100\n\n# Show surface\nshow surface\nset transparency, 0.5\n\n# Save image\nray 2400, 1800\npng structure_image.png, dpi=300", lang: "bash" }
              ],
              interpretation: "For AlphaFold2: pLDDT (predicted Local Distance Difference Test) >90 = very high confidence, 70-90 = confident, 50-70 = low confidence, <50 = very low (likely disordered). PAE (Predicted Aligned Error) matrix shows inter-domain confidence — useful for multidomain proteins. For homology models, GMQE >0.7 is good. Always validate with experimental data when possible."
            }
          },
          {
            id: "molecular_docking",
            label: "Molecular Docking",
            icon: "🔑",
            content: {
              title: "🔑 Molecular Docking",
              what: "Molecular docking predicts how a small molecule (ligand/drug) binds to a protein receptor. It is fundamental to computer-aided drug discovery (CADD), predicting binding affinity and pose.",
              questions: [
                "Where does a drug molecule bind on a protein?",
                "What is the predicted binding affinity?",
                "Which candidate drugs bind best to a target?",
                "What are the key interactions (H-bonds, hydrophobic, etc.)?"
              ],
              tools: [
                { name: "AutoDock Vina", type: "tool", desc: "Fast and accurate open-source docking" },
                { name: "AutoDock4", type: "tool", desc: "Classic docking with force fields" },
                { name: "SwissDock", type: "tool", desc: "Web-based docking server" },
                { name: "HADDOCK", type: "tool", desc: "Protein-protein docking" },
                { name: "Open Babel", type: "tool", desc: "Chemical format conversion" },
                { name: "MGLTools", type: "tool", desc: "AutoDock receptor/ligand preparation" },
                { name: "PLIP", type: "tool", desc: "Protein-Ligand Interaction Profiler" }
              ],
              workflow: [
                { step: 1, title: "Prepare receptor and ligand", cmd: "# Install tools\nconda install -c conda-forge -c bioconda \\\n  autodock-vina openbabel mgltools\n\n# Download protein structure from PDB\nwget https://files.rcsb.org/download/1AKE.pdb\n\n# Remove water and heteroatoms, add hydrogens\n# Using Open Babel\nobabel 1AKE.pdb -O receptor_clean.pdb -d  # delete H\nobabel receptor_clean.pdb -O receptor.pdbqt -xh  # add H and convert\n\n# Prepare with MGLTools (more control)\npythonsh prepare_receptor4.py -r 1AKE.pdb \\\n  -o receptor.pdbqt -A hydrogens\n\n# Prepare ligand (from SDF, MOL2, or SMILES)\n# Download from PubChem, ZINC, or ChEMBL\nobabel ligand.sdf -O ligand.pdbqt --gen3d -h", lang: "bash" },
                { step: 2, title: "Define search space and run docking", cmd: "# Create Vina config file\ncat > vina_config.txt << EOF\nreceptor = receptor.pdbqt\nligand = ligand.pdbqt\nout = docking_results.pdbqt\n\n# Search space (center and size in Angstroms)\ncenter_x = 10.0\ncenter_y = 20.0\ncenter_z = 30.0\nsize_x = 25\nsize_y = 25\nsize_z = 25\n\nexhaustiveness = 32\nnum_modes = 10\nenergy_range = 3\nEOF\n\n# Run Vina\nvina --config vina_config.txt\n\n# Output shows:\n# mode | affinity (kcal/mol) | rmsd l.b. | rmsd u.b.\n#    1        -8.5               0.000       0.000\n#    2        -7.9               2.134       3.456", lang: "bash" },
                { step: 3, title: "Analyze and visualize results", cmd: "# Split docking output into individual poses\nvina_split --input docking_results.pdbqt\n\n# Visualize in PyMOL\npymol receptor.pdb docking_results_1.pdbqt\n\n# PyMOL commands for visualization:\n# show sticks, ligand\n# show cartoon, receptor\n# select binding_site, byres ligand around 5\n# show sticks, binding_site\n# color cyan, ligand\n\n# Analyze interactions with PLIP (web)\n# Upload complex to: https://plip-tool.biotec.tu-dresden.de/", lang: "bash" }
              ],
              interpretation: "Binding affinity (kcal/mol): more negative = stronger binding. Values of -7 to -10 kcal/mol suggest good binding. Check RMSD between poses — low RMSD cluster means consistent prediction. Key interactions: hydrogen bonds (<3.5Å), hydrophobic contacts, π-π stacking, salt bridges. Always validate computationally promising hits experimentally.",
              errors: [
                { error: "Vina: ERROR: Could not parse receptor", solution: "Ensure PDBQT format is correct. Use MGLTools prepare_receptor4.py instead of Open Babel for better compatibility." },
                { error: "All binding affinities near 0", solution: "Check search space — it may not cover the binding site. Increase exhaustiveness. Verify ligand has proper 3D coordinates." }
              ]
            }
          },
          {
            id: "md_simulations",
            label: "Molecular Dynamics",
            icon: "🌊",
            content: {
              title: "🌊 Molecular Dynamics Simulations",
              what: "Molecular dynamics (MD) simulates the physical movements of atoms over time by solving Newton's equations of motion. It reveals protein dynamics, conformational changes, binding mechanisms, and stability.",
              questions: [
                "How does a protein move and flex in solution?",
                "Is a drug-protein complex stable over time?",
                "What conformational changes occur upon ligand binding?",
                "How does a mutation affect protein stability?"
              ],
              tools: [
                { name: "GROMACS", type: "tool", desc: "High-performance MD engine" },
                { name: "AMBER", type: "tool", desc: "MD simulation suite" },
                { name: "NAMD", type: "tool", desc: "Scalable MD program" },
                { name: "OpenMM", type: "tool", desc: "GPU-accelerated MD in Python" },
                { name: "VMD", type: "tool", desc: "Visualization and analysis of MD trajectories" }
              ],
              math: [
                "Newton's equation: F = ma → mᵢ(d²rᵢ/dt²) = -∇V(r₁, r₂, ..., rₙ)",
                "Lennard-Jones potential: V(r) = 4ε[(σ/r)¹² - (σ/r)⁶]",
                "Coulomb: V(r) = q₁q₂ / (4πε₀r)",
                "RMSD: √(1/N Σ||rᵢ(t) - rᵢ(ref)||²)",
                "RMSF: √(1/T Σ||rᵢ(t) - ⟨rᵢ⟩||²)"
              ],
              workflow: [
                { step: 1, title: "Setup GROMACS simulation", cmd: "# Install GROMACS\nconda install -c conda-forge -c bioconda gromacs\n\n# Prepare topology\ngmx pdb2gmx -f protein.pdb -o processed.gro \\\n  -water spce -ff amber99sb-ildn\n\n# Define simulation box\ngmx editconf -f processed.gro -o boxed.gro \\\n  -c -d 1.0 -bt cubic\n\n# Solvate\ngmx solvate -cp boxed.gro -cs spc216.gro \\\n  -o solvated.gro -p topol.top\n\n# Add ions (neutralize charge)\ngmx grompp -f ions.mdp -c solvated.gro \\\n  -p topol.top -o ions.tpr\ngmx genion -s ions.tpr -o solv_ions.gro \\\n  -p topol.top -pname NA -nname CL -neutral", lang: "bash" },
                { step: 2, title: "Energy minimization and equilibration", cmd: "# Energy minimization\ngmx grompp -f minim.mdp -c solv_ions.gro \\\n  -p topol.top -o em.tpr\ngmx mdrun -v -deffnm em\n\n# NVT equilibration (100 ps)\ngmx grompp -f nvt.mdp -c em.gro -r em.gro \\\n  -p topol.top -o nvt.tpr\ngmx mdrun -deffnm nvt\n\n# NPT equilibration (100 ps)\ngmx grompp -f npt.mdp -c nvt.gro -r nvt.gro \\\n  -t nvt.cpt -p topol.top -o npt.tpr\ngmx mdrun -deffnm npt", lang: "bash" },
                { step: 3, title: "Production MD run and analysis", cmd: "# Production run (e.g., 100 ns)\ngmx grompp -f md.mdp -c npt.gro -t npt.cpt \\\n  -p topol.top -o md.tpr\ngmx mdrun -deffnm md -nb gpu\n\n# Analysis: RMSD\ngmx rms -s md.tpr -f md.xtc -o rmsd.xvg -tu ns\n\n# Analysis: RMSF (flexibility)\ngmx rmsf -s md.tpr -f md.xtc -o rmsf.xvg -res\n\n# Analysis: Radius of gyration (compactness)\ngmx gyrate -s md.tpr -f md.xtc -o gyrate.xvg\n\n# Analysis: Hydrogen bonds\ngmx hbond -s md.tpr -f md.xtc -num hbond.xvg\n\n# Plot with xmgrace or Python\nxmgrace rmsd.xvg", lang: "bash" }
              ],
              interpretation: "RMSD: should plateau (stabilize) — indicates equilibration. Typical protein RMSD 1-3 Å. RMSF: high values indicate flexible regions (loops, termini). Radius of gyration: stable value means protein doesn't unfold. Hydrogen bonds: stable count supports structural integrity. Run multiple replicates (n≥3) for statistical confidence."
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  8. PROTEOMICS
      // ──────────────────────────────────────────────
      {
        id: "proteomics",
        label: "Proteomics",
        icon: "🧫",
        color: "purple",
        content: {
          title: "🧫 Proteomics",
          what: "Proteomics is the large-scale study of proteins — their expression, structure, function, interactions, and modifications. Mass spectrometry (MS) is the primary technology.",
          questions: [
            "What proteins are expressed in a cell/tissue?",
            "How do protein levels change between conditions?",
            "What post-translational modifications (PTMs) are present?",
            "What protein-protein interactions exist?",
            "What proteins are in a complex?"
          ],
          tools: [
            { name: "MaxQuant", type: "tool", desc: "Quantitative MS proteomics" },
            { name: "Proteome Discoverer", type: "tool", desc: "Thermo Fisher MS data analysis" },
            { name: "Perseus", type: "tool", desc: "Statistical analysis of proteomics data" },
            { name: "MSFragger", type: "tool", desc: "Ultra-fast peptide identification" },
            { name: "OpenMS", type: "tool", desc: "Open-source MS data processing" },
            { name: "STRING", type: "tool", desc: "Protein-protein interaction networks" },
            { name: "Cytoscape", type: "tool", desc: "Network visualization and analysis" }
          ],
          databases: [
            { name: "UniProt", type: "db", desc: "Protein sequence and annotation" },
            { name: "PDB", type: "db", desc: "Protein 3D structures" },
            { name: "PRIDE", type: "db", desc: "Proteomics data repository" },
            { name: "PhosphoSitePlus", type: "db", desc: "Post-translational modifications" },
            { name: "STRING", type: "db", desc: "Protein interaction database" },
            { name: "IntAct", type: "db", desc: "Molecular interaction database" }
          ]
        },
        children: [
          {
            id: "ms_proteomics",
            label: "Mass Spectrometry Proteomics",
            icon: "⚗️",
            content: {
              title: "⚗️ Mass Spectrometry-based Proteomics",
              what: "MS proteomics identifies and quantifies proteins by measuring mass-to-charge ratios of peptide ions. Bottom-up (shotgun) proteomics digests proteins into peptides before MS analysis.",
              questions: [
                "What proteins are present in my sample?",
                "How do I quantify protein abundance differences?",
                "What post-translational modifications can I detect?"
              ],
              tools: [
                { name: "MaxQuant", type: "tool", desc: "Label-free and SILAC quantification" },
                { name: "MSFragger", type: "tool", desc: "Database search engine" },
                { name: "Comet", type: "tool", desc: "MS/MS search engine" },
                { name: "Percolator", type: "tool", desc: "Semi-supervised PSM rescoring" }
              ],
              workflow: [
                { step: 1, title: "Analyze with MaxQuant", cmd: "# MaxQuant is GUI-based (Windows/Linux)\n# Download from: https://www.maxquant.org/\n\n# Steps:\n# 1. Load raw MS files (.raw, .mzML)\n# 2. Set protein database (UniProt FASTA)\n# 3. Configure:\n#    - Enzyme: Trypsin/P\n#    - Fixed modifications: Carbamidomethyl (C)\n#    - Variable modifications: Oxidation (M), Acetyl (Protein N-term)\n#    - Max missed cleavages: 2\n#    - FDR: 1% at peptide and protein level\n#    - LFQ (Label-Free Quantification): enabled\n# 4. Run analysis\n# 5. Key output: proteinGroups.txt, evidence.txt", lang: "bash" },
                { step: 2, title: "Statistical analysis with Perseus or R", cmd: "# ===== R Script for proteomics DE analysis =====\n\nlibrary(limma)\nlibrary(ggplot2)\n\n# Read MaxQuant output\npg <- read.delim(\"proteinGroups.txt\", stringsAsFactors=FALSE)\n\n# Filter\npg <- pg[pg$Reverse != \"+\", ]\npg <- pg[pg$Potential.contaminant != \"+\", ]\npg <- pg[pg$Only.identified.by.site != \"+\", ]\n\n# Extract LFQ intensity columns\nlfq <- pg[, grep(\"LFQ.intensity.\", colnames(pg))]\nrownames(lfq) <- pg$Protein.IDs\n\n# Log2 transform\nlfq_log <- log2(lfq)\nlfq_log[is.infinite(as.matrix(lfq_log))] <- NA\n\n# Filter: at least 2 valid values per group\nvalid <- rowSums(!is.na(lfq_log[,1:3])) >= 2 &\n         rowSums(!is.na(lfq_log[,4:6])) >= 2\nlfq_filtered <- lfq_log[valid, ]\n\n# Imputation (replace NA with low values)\nset.seed(42)\nfor(i in 1:ncol(lfq_filtered)) {\n  na_idx <- is.na(lfq_filtered[,i])\n  lfq_filtered[na_idx, i] <- rnorm(\n    sum(na_idx),\n    mean = min(lfq_filtered[,i], na.rm=TRUE) - 1.8,\n    sd = 0.3)\n}\n\n# limma DE analysis\ngroup <- factor(c(rep(\"treatment\",3), rep(\"control\",3)))\ndesign <- model.matrix(~0+group)\nfit <- lmFit(lfq_filtered, design)\ncontrast <- makeContrasts(grouptreatment - groupcontrol, levels=design)\nfit2 <- contrasts.fit(fit, contrast)\nfit2 <- eBayes(fit2)\nresults <- topTable(fit2, number=Inf)\n\nwrite.csv(results, \"proteomics_DE_results.csv\")", lang: "r" }
              ]
            }
          },
          {
            id: "ppi_networks",
            label: "Protein-Protein Interactions",
            icon: "🕸️",
            content: {
              title: "🕸️ Protein-Protein Interaction Networks",
              what: "PPI networks map the physical and functional interactions between proteins. Network analysis reveals protein complexes, signaling pathways, and key hub proteins.",
              questions: [
                "Which proteins interact with my protein of interest?",
                "What are the key hub proteins in the network?",
                "What functional modules exist?"
              ],
              tools: [
                { name: "STRING", type: "tool", desc: "Online PPI database and visualization" },
                { name: "Cytoscape", type: "tool", desc: "Desktop network analysis and visualization" },
                { name: "NetworkX (Python)", type: "tool", desc: "Graph analysis library" }
              ],
              workflow: [
                { step: 1, title: "Get PPI network from STRING", cmd: "# STRING (web): https://string-db.org/\n# 1. Enter protein(s) of interest\n# 2. Select organism\n# 3. Set confidence threshold (0.4=medium, 0.7=high, 0.9=highest)\n# 4. Export network as TSV for Cytoscape\n\n# STRING API (programmatic access)\n# Get interactions for TP53:\ncurl 'https://string-db.org/api/tsv/network?identifiers=TP53&species=9606&required_score=700' \\\n  -o tp53_network.tsv", lang: "bash" },
                { step: 2, title: "Analyze in Cytoscape", cmd: "# Download Cytoscape: https://cytoscape.org/\n# 1. File > Import > Network from File > string_network.tsv\n# 2. Install apps: ClusterONE, MCODE, NetworkAnalyzer\n# 3. Tools > NetworkAnalyzer > Analyze Network\n#    - Identify hub proteins (high degree/betweenness)\n# 4. Apps > MCODE > Find Clusters\n#    - Identifies densely connected modules\n# 5. Style > map node size to degree centrality\n# 6. Export as image/session", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  9. SYSTEMS BIOLOGY
      // ──────────────────────────────────────────────
      {
        id: "systems_biology",
        label: "Systems Biology",
        icon: "🔄",
        color: "teal",
        content: {
          title: "🔄 Systems Biology & Pathway Analysis",
          what: "Systems biology integrates multi-omics data (genomics, transcriptomics, proteomics, metabolomics) to understand biological systems holistically. It focuses on networks, pathways, and emergent properties.",
          questions: [
            "What biological pathways are affected in my experiment?",
            "How do different molecular levels (DNA, RNA, protein) interact?",
            "What are the key regulatory networks?"
          ],
          tools: [
            { name: "clusterProfiler", type: "tool", desc: "GO/KEGG enrichment" },
            { name: "Pathview", type: "tool", desc: "KEGG pathway visualization in R" },
            { name: "GSEA", type: "tool", desc: "Gene Set Enrichment Analysis" },
            { name: "Reactome", type: "tool", desc: "Pathway database and analysis" },
            { name: "DAVID", type: "tool", desc: "Online functional annotation" },
            { name: "Cytoscape", type: "tool", desc: "Network visualization" },
            { name: "WGCNA", type: "tool", desc: "Weighted Gene Co-expression Network Analysis" }
          ]
        },
        children: [
          {
            id: "pathway_enrichment",
            label: "Pathway & GO Enrichment",
            icon: "🗺️",
            content: {
              title: "🗺️ Pathway & Gene Ontology Enrichment",
              what: "Enrichment analysis determines whether predefined gene sets (pathways, GO terms) are over-represented in a list of differentially expressed genes. This provides biological context to gene lists.",
              questions: [
                "What biological processes are enriched in my gene list?",
                "Which KEGG pathways are significantly affected?",
                "What molecular functions are over-represented?"
              ],
              workflow: [
                { step: 1, title: "GO & KEGG enrichment with clusterProfiler", cmd: "# (See full workflow under Transcriptomics > RNA-seq Pipeline > Step 6)\n# Summary of key functions:\n\nlibrary(clusterProfiler)\nlibrary(org.Hs.eg.db)\n\n# Over-Representation Analysis (ORA)\ngo_results <- enrichGO(\n  gene = sig_gene_entrez_ids,\n  OrgDb = org.Hs.eg.db,\n  ont = \"BP\",     # BP, MF, CC, or ALL\n  pvalueCutoff = 0.05\n)\n\n# Gene Set Enrichment Analysis (GSEA)\n# Requires ranked gene list (all genes, not just significant)\ngene_list <- sort(setNames(res$log2FoldChange, rownames(res)), decreasing=TRUE)\n\ngsea_results <- gseGO(\n  geneList = gene_list,\n  OrgDb = org.Hs.eg.db,\n  ont = \"BP\",\n  pvalueCutoff = 0.05\n)\n\n# KEGG GSEA\ngsea_kegg <- gseKEGG(\n  geneList = entrez_ranked_list,\n  organism = \"hsa\",\n  pvalueCutoff = 0.05\n)", lang: "r" },
                { step: 2, title: "Pathview visualization", cmd: "library(pathview)\n\n# Visualize specific KEGG pathway\npathview(\n  gene.data = gene_list_entrez,\n  pathway.id = \"hsa04110\",  # Cell cycle\n  species = \"hsa\",\n  limit = list(gene=2, cpd=1)\n)\n# Generates .png file with colored pathway map", lang: "r" }
              ],
              interpretation: "ORA tests if pathway genes are over-represented in your DE gene list. GSEA tests if pathway genes tend to be at the top/bottom of a ranked list — more powerful as it uses all genes. Low p-adjusted values and high gene ratios indicate meaningful enrichment. Consider multiple GO categories: Biological Process (BP), Molecular Function (MF), Cellular Component (CC)."
            }
          },
          {
            id: "wgcna",
            label: "WGCNA Co-expression Networks",
            icon: "🧵",
            content: {
              title: "🧵 WGCNA — Weighted Gene Co-expression Network Analysis",
              what: "WGCNA identifies modules of highly correlated genes and relates them to external traits. It builds a gene co-expression network and finds clusters (modules) of co-expressed genes.",
              questions: [
                "Which genes are co-expressed (form functional modules)?",
                "Which modules correlate with clinical traits?",
                "What are the hub genes within each module?"
              ],
              tools: [
                { name: "WGCNA (R)", type: "tool", desc: "R package for weighted correlation network analysis" }
              ],
              workflow: [
                { step: 1, title: "Run WGCNA analysis", cmd: "# ===== R Script =====\ninstall.packages('WGCNA')\nlibrary(WGCNA)\noptions(stringsAsFactors = FALSE)\nallowWGCNAThreads()\n\n# Input: normalized expression matrix (genes as columns!)\n# rows = samples, columns = genes\ndatExpr <- t(normalized_counts)  # transpose if needed\n\n# Choose soft-thresholding power\npowers <- c(1:20)\nsft <- pickSoftThreshold(datExpr, powerVector=powers)\n\n# Plot to choose power (first value where R² > 0.85)\nplot(sft$fitIndices[,1], -sign(sft$fitIndices[,3])*sft$fitIndices[,2],\n  xlab='Soft Threshold', ylab='Scale Free R²')\nabline(h=0.85, col='red')\n\n# Build network and identify modules\nnet <- blockwiseModules(\n  datExpr,\n  power = 6,  # chosen from plot above\n  TOMType = 'unsigned',\n  minModuleSize = 30,\n  reassignThreshold = 0,\n  mergeCutHeight = 0.25,\n  numericLabels = TRUE,\n  verbose = 3\n)\n\n# Module eigengenes\nMEs <- net$MEs\n\n# Relate modules to traits\nmoduleTraitCor <- cor(MEs, traits, use='p')\nmoduleTraitPvalue <- corPvalueStudent(moduleTraitCor, nrow(datExpr))", lang: "r" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  10. FUNCTIONAL GENOMICS
      // ──────────────────────────────────────────────
      {
        id: "functional_genomics",
        label: "Functional Genomics",
        icon: "⚙️",
        color: "red",
        content: {
          title: "⚙️ Functional Genomics",
          what: "Functional genomics uses high-throughput approaches to understand gene function, regulation, and interactions on a genome-wide scale. It includes ChIP-seq, ATAC-seq, CRISPR screens, and epigenomics.",
          questions: [
            "Where do transcription factors bind in the genome?",
            "What regions of chromatin are accessible?",
            "What epigenetic modifications regulate gene expression?",
            "What is the function of a specific gene (loss/gain of function)?"
          ],
          tools: [
            { name: "MACS2", type: "tool", desc: "ChIP-seq peak calling" },
            { name: "Bowtie2", type: "tool", desc: "Short read alignment for ChIP-seq" },
            { name: "deepTools", type: "tool", desc: "NGS data visualization (heatmaps, profiles)" },
            { name: "Homer", type: "tool", desc: "Motif discovery and ChIP-seq analysis" },
            { name: "Genrich", type: "tool", desc: "ATAC-seq peak calling" },
            { name: "Bismark", type: "tool", desc: "Bisulfite sequencing (DNA methylation)" }
          ]
        },
        children: [
          {
            id: "chipseq",
            label: "ChIP-seq Analysis",
            icon: "🎯",
            content: {
              title: "🎯 ChIP-seq Analysis",
              what: "ChIP-seq (Chromatin Immunoprecipitation Sequencing) identifies genome-wide binding sites of transcription factors, histone modifications, and other chromatin-associated proteins.",
              questions: [
                "Where does my transcription factor bind in the genome?",
                "What DNA motif does the TF recognize?",
                "What genes are regulated by this TF?"
              ],
              workflow: [
                { step: 1, title: "ChIP-seq pipeline", cmd: "# Install tools\nconda install -c bioconda bowtie2 samtools \\\n  macs2 deeptools homer\n\n# Align reads\nbowtie2 -x genome_index \\\n  -1 chip_R1.fastq.gz -2 chip_R2.fastq.gz \\\n  -p 8 | samtools sort -o chip.bam\nsamtools index chip.bam\n\n# Same for input control\nbowtie2 -x genome_index \\\n  -1 input_R1.fastq.gz -2 input_R2.fastq.gz \\\n  -p 8 | samtools sort -o input.bam\nsamtools index input.bam\n\n# Remove duplicates\nsamtools markdup -r chip.bam chip_dedup.bam\nsamtools markdup -r input.bam input_dedup.bam", lang: "bash" },
                { step: 2, title: "Peak calling with MACS2", cmd: "# Call peaks\nmacs2 callpeak \\\n  -t chip_dedup.bam \\\n  -c input_dedup.bam \\\n  -f BAMPE \\\n  -g hs \\\n  --outdir macs2_output \\\n  -n my_chip \\\n  -q 0.05\n\n# For broad marks (H3K27me3, H3K36me3):\nmacs2 callpeak -t chip.bam -c input.bam \\\n  -f BAMPE -g hs --broad --broad-cutoff 0.1 \\\n  --outdir macs2_broad -n broad_marks", lang: "bash" },
                { step: 3, title: "Visualization and motif analysis", cmd: "# deepTools heatmap\ncomputeMatrix reference-point \\\n  -S chip.bw -R peaks.bed \\\n  --referencePoint center \\\n  -b 3000 -a 3000 \\\n  -o matrix.gz\n\nplotHeatmap -m matrix.gz \\\n  -out heatmap.png \\\n  --colorMap RdYlBu\n\n# Motif discovery with Homer\nfindMotifsGenome.pl \\\n  macs2_output/my_chip_peaks.narrowPeak \\\n  hg38 homer_output/ -size 200 -mask", lang: "bash" }
              ]
            }
          }
        ]
      },

      // ──────────────────────────────────────────────
      //  11. DATA SCIENCE & MACHINE LEARNING IN BIOINFORMATICS
      // ──────────────────────────────────────────────
      {
        id: "bioinfo_ml",
        label: "Machine Learning in Bio",
        icon: "🤖",
        color: "yellow",
        content: {
          title: "🤖 Machine Learning in Bioinformatics",
          what: "Machine learning and deep learning methods are increasingly used in bioinformatics for prediction tasks: protein structure (AlphaFold), variant pathogenicity, drug response, gene expression prediction, and biomarker discovery.",
          questions: [
            "Can we predict protein function from sequence?",
            "Which variants are pathogenic?",
            "Can we classify tumor types from expression data?",
            "What biomarkers predict drug response?"
          ],
          tools: [
            { name: "scikit-learn", type: "lang", desc: "Classical ML in Python" },
            { name: "TensorFlow/Keras", type: "lang", desc: "Deep learning framework" },
            { name: "PyTorch", type: "lang", desc: "Deep learning framework" },
            { name: "caret (R)", type: "lang", desc: "ML framework in R" },
            { name: "AlphaFold2", type: "tool", desc: "DL protein structure prediction" },
            { name: "DeepVariant", type: "tool", desc: "DL variant calling" },
            { name: "CADD", type: "tool", desc: "Combined Annotation Dependent Depletion — variant pathogenicity" }
          ]
        },
        children: []
      },

      // ──────────────────────────────────────────────
      //  12. CLINICAL / MEDICAL BIOINFORMATICS
      // ──────────────────────────────────────────────
      {
        id: "clinical_bioinfo",
        label: "Clinical Bioinformatics",
        icon: "🏥",
        color: "red",
        content: {
          title: "🏥 Clinical & Medical Bioinformatics",
          what: "Clinical bioinformatics applies computational methods to clinical data for diagnosis, prognosis, and treatment decisions. Includes pharmacogenomics, cancer genomics, and rare disease diagnosis.",
          questions: [
            "What causative variant underlies a patient's rare disease?",
            "What targeted therapy is appropriate for a tumor's mutations?",
            "How does a patient's genotype affect drug metabolism?"
          ],
          tools: [
            { name: "ClinVar", type: "db", desc: "Clinical variant database" },
            { name: "OMIM", type: "db", desc: "Online Mendelian Inheritance in Man" },
            { name: "PharmGKB", type: "db", desc: "Pharmacogenomics knowledge base" },
            { name: "cBioPortal", type: "db", desc: "Cancer genomics portal" },
            { name: "COSMIC", type: "db", desc: "Catalogue of Somatic Mutations in Cancer" },
            { name: "VEP", type: "tool", desc: "Variant Effect Predictor" },
            { name: "InterVar", type: "tool", desc: "ACMG variant classification" }
          ]
        },
        children: []
      }
    ] // end root children
  }; // end KNOWLEDGE_TREE


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

  /** Flatten tree into array for search */
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

  /** Count various statistics */
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

  /** Lookup a node by id */
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

  /** Get ancestry path to a node */
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
  //  SECTION 5: SIDEBAR TREE RENDERING
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

    // Header
    const header = document.createElement("div");
    header.className = "tree-node-header" + (isActive ? " active" : "");
    header.style.setProperty("--depth", depth);
    if (node.color) header.dataset.color = node.color;

    // Toggle chevron
    const toggle = document.createElement("span");
    toggle.className = "tree-toggle" + (hasChildren ? (isExpanded ? " expanded" : "") : " leaf");
    toggle.innerHTML = "▶";
    header.appendChild(toggle);

    // Icon
    const icon = document.createElement("span");
    icon.className = "node-icon";
    icon.textContent = node.icon || "📄";
    header.appendChild(icon);

    // Label
    const label = document.createElement("span");
    label.className = "node-label";
    label.textContent = node.label;
    header.appendChild(label);

    // Badge (child count)
    if (hasChildren) {
      const badge = document.createElement("span");
      badge.className = "node-badge";
      badge.textContent = node.children.length;
      header.appendChild(badge);
    }

    header.addEventListener("click", (e) => {
      e.stopPropagation();
      // Toggle expand
      if (hasChildren) {
        if (state.expandedNodes.has(node.id)) {
          state.expandedNodes.delete(node.id);
        } else {
          state.expandedNodes.add(node.id);
        }
      }
      // Set active
      state.activeNodeId = node.id;
      renderTree();
      renderContent(node.id);
      updateBreadcrumb(node.id);
    });

    div.appendChild(header);

    // Children container
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
        sep.textContent = "›";
        breadcrumbInner.appendChild(sep);
      }
      if (i < ancestry.length - 1) {
        const item = document.createElement("span");
        item.className = "breadcrumb-item";
        item.textContent = (i === 0 ? "🏠 " : "") + node.label;
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

    // ── Landing page for root ──
    if (id === "root") {
      html += renderLandingPage(node);
      contentPanel.innerHTML = html;
      attachLandingCardListeners();
      return;
    }

    // ── Title card ──
    html += `<div class="content-card">`;
    html += `<h2>${escapeHTML(c.title || node.label)}</h2>`;

    // Definition
    if (c.what) {
      html += `<div class="info-box definition"><div class="info-title">📘 What is it?</div><p>${escapeHTML(c.what)}</p></div>`;
    }

    // Overview
    if (c.overview) {
      html += `<p>${escapeHTML(c.overview)}</p>`;
    }

    // Questions
    if (c.questions && c.questions.length) {
      html += `<div class="info-box question"><div class="info-title">❓ Biological Questions Answered</div><ul>`;
      c.questions.forEach(q => { html += `<li>${escapeHTML(q)}</li>`; });
      html += `</ul></div>`;
    }

    html += `</div>`; // end title card

    // ── Algorithms ──
    if (c.algorithms && c.algorithms.length) {
      html += `<div class="content-card"><h3>🧮 Algorithms & Methods</h3>`;
      c.algorithms.forEach(a => {
        html += `<h4>${escapeHTML(a.name)}</h4><p>${escapeHTML(a.desc)}</p>`;
      });
      html += `</div>`;
    }

    // ── Math ──
    if (c.math && c.math.length) {
      html += `<div class="content-card"><h3>📐 Mathematical Foundations</h3>`;
      c.math.forEach(m => {
        html += `<div class="formula">${escapeHTML(m)}</div>`;
      });
      html += `</div>`;
    }

    // ── Tools ──
    if (c.tools && c.tools.length) {
      html += `<div class="content-card"><h3>🛠️ Tools & Software</h3><div class="tags">`;
      c.tools.forEach(t => {
        const cls = t.type === "tool" ? "tag-tool" : t.type === "lang" ? "tag-lang" : "tag-tool";
        html += `<span class="tag ${cls}" title="${escapeHTML(t.desc || "")}">${escapeHTML(t.name)}</span>`;
      });
      html += `</div>`;
      // Table
      html += `<div class="table-wrapper"><table class="comparison-table"><thead><tr><th>Tool</th><th>Type</th><th>Description</th></tr></thead><tbody>`;
      c.tools.forEach(t => {
        html += `<tr><td><strong>${escapeHTML(t.name)}</strong></td><td>${escapeHTML(t.type || "")}</td><td>${escapeHTML(t.desc || "")}</td></tr>`;
      });
      html += `</tbody></table></div></div>`;
    }

    // ── Databases ──
    if (c.databases && c.databases.length) {
      html += `<div class="content-card"><h3>🗄️ Databases</h3><div class="tags">`;
      c.databases.forEach(d => {
        html += `<span class="tag tag-db" title="${escapeHTML(d.desc || "")}">${escapeHTML(d.name)}</span>`;
      });
      html += `</div>`;
      html += `<div class="table-wrapper"><table class="comparison-table"><thead><tr><th>Database</th><th>Description</th></tr></thead><tbody>`;
      c.databases.forEach(d => {
        html += `<tr><td><strong>${escapeHTML(d.name)}</strong></td><td>${escapeHTML(d.desc || "")}</td></tr>`;
      });
      html += `</tbody></table></div></div>`;
    }

    // ── Formats ──
    if (c.formats && c.formats.length) {
      html += `<div class="content-card"><h3>📄 File Formats</h3>`;
      html += `<div class="table-wrapper"><table class="comparison-table"><thead><tr><th>Format</th><th>Description</th></tr></thead><tbody>`;
      c.formats.forEach(f => {
        html += `<tr><td><strong><code>${escapeHTML(f.name)}</code></strong></td><td>${escapeHTML(f.desc)}</td></tr>`;
      });
      html += `</tbody></table></div></div>`;
    }

    // ── Pipeline ──
    if (c.pipeline && c.pipeline.length) {
      html += `<div class="content-card"><h3>🔀 Analysis Pipeline</h3><div class="pipeline">`;
      c.pipeline.forEach((p, i) => {
        html += `<div class="pipeline-step"><div class="step-num">Step ${i + 1}</div><div class="step-name">${escapeHTML(p.name)}</div><div class="step-tool">${escapeHTML(p.tool)}</div></div>`;
        if (i < c.pipeline.length - 1) {
          html += `<span class="pipeline-arrow">→</span>`;
        }
      });
      html += `</div></div>`;
    }

    // ── Workflow ──
    if (c.workflow && c.workflow.length) {
      html += `<div class="content-card"><h3>📋 Step-by-Step Reproducible Workflow</h3>`;
      c.workflow.forEach(w => {
        html += `<h4>Step ${w.step}: ${escapeHTML(w.title)}</h4>`;
        html += renderCodeBlock(w.cmd, w.lang || "bash");
      });
      html += `</div>`;
    }

    // ── Interpretation ──
    if (c.interpretation) {
      html += `<div class="content-card"><div class="interpretation"><h4>📊 How to Interpret Results</h4><p>${escapeHTML(c.interpretation)}</p></div></div>`;
    }

    // ── Errors ──
    if (c.errors && c.errors.length) {
      html += `<div class="content-card"><h3>⚠️ Common Errors & Troubleshooting</h3>`;
      c.errors.forEach((e, i) => {
        const eid = `err_${id}_${i}`;
        html += `<div class="error-item">`;
        html += `<div class="error-header" data-eid="${eid}"><span class="error-icon">✗</span><span class="error-text">${escapeHTML(e.error)}</span><span class="error-toggle" id="toggle_${eid}">▶</span></div>`;
        html += `<div class="error-solution" id="sol_${eid}"><div class="solution-label">✔ Solution</div><p>${escapeHTML(e.solution)}</p></div>`;
        html += `</div>`;
      });
      html += `</div>`;
    }

    // ── Children navigation ──
    if (node.children && node.children.length) {
      html += `<div class="content-card"><h3>📂 Sub-topics</h3><div class="landing-grid">`;
      node.children.forEach(child => {
        const cc = child.content || {};
        const desc = cc.what || "";
        const childCount = child.children ? child.children.length : 0;
        html += `<div class="landing-card ${child.color || ""}" data-nav-id="${child.id}">`;
        html += `<div class="card-icon">${child.icon || "📄"}</div>`;
        html += `<div class="card-title">${escapeHTML(child.label)}</div>`;
        html += `<div class="card-desc">${escapeHTML(desc.substring(0, 150))}${desc.length > 150 ? "..." : ""}</div>`;
        if (childCount) html += `<div class="card-count">${childCount} sub-topics</div>`;
        html += `</div>`;
      });
      html += `</div></div>`;
    }

    contentPanel.innerHTML = html;
    contentPanel.scrollTop = 0;
    attachContentListeners();
  }

  /** Render landing page (root) */
  function renderLandingPage(node) {
    const c = node.content || {};
    let html = `<div class="content-card">`;
    html += `<h2>${escapeHTML(c.title || node.label)}</h2>`;
    if (c.what) {
      html += `<div class="info-box definition"><div class="info-title">📘 About This Archive</div><p>${escapeHTML(c.what)}</p></div>`;
    }
    if (c.overview) {
      html += `<p>${escapeHTML(c.overview)}</p>`;
    }
    if (c.questions && c.questions.length) {
      html += `<div class="info-box question"><div class="info-title">❓ Key Questions in Bioinformatics</div><ul>`;
      c.questions.forEach(q => { html += `<li>${escapeHTML(q)}</li>`; });
      html += `</ul></div>`;
    }
    html += `</div>`;

    // Children grid
    if (node.children && node.children.length) {
      html += `<div class="content-card"><h3>🌐 Explore Sub-fields</h3><div class="landing-grid">`;
      node.children.forEach(child => {
        const cc = child.content || {};
        const desc = cc.what || "";
        const childCount = child.children ? child.children.length : 0;
        const toolCount = cc.tools ? cc.tools.length : 0;
        html += `<div class="landing-card ${child.color || ""}" data-nav-id="${child.id}">`;
        html += `<div class="card-icon">${child.icon || "📄"}</div>`;
        html += `<div class="card-title">${escapeHTML(child.label)}</div>`;
        html += `<div class="card-desc">${escapeHTML(desc.substring(0, 160))}${desc.length > 160 ? "..." : ""}</div>`;
        let meta = [];
        if (childCount) meta.push(`${childCount} sub-topics`);
        if (toolCount) meta.push(`${toolCount} tools`);
        if (meta.length) html += `<div class="card-count">${meta.join(" · ")}</div>`;
        html += `</div>`;
      });
      html += `</div></div>`;
    }

    return html;
  }

  /** Render a code block */
  function renderCodeBlock(code, lang) {
    const id = "cb_" + Math.random().toString(36).substr(2, 9);
    return `<div class="code-block"><div class="code-block-header"><span class="code-block-lang">${escapeHTML(lang)}</span><button class="code-block-copy" data-code-id="${id}">📋 Copy</button></div><pre id="${id}">${highlightSyntax(escapeHTML(code), lang)}</pre></div>`;
  }

  /** Simple syntax highlighting */
  function highlightSyntax(code, lang) {
    // Comments
    code = code.replace(/(#[^\n]*)/g, '<span class="comment">$1</span>');
    // Strings
    code = code.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|"[^"]*?"|'[^']*?')/g, '<span class="string">$1</span>');
    // Flags (bash)
    if (lang === "bash") {
      code = code.replace(/(\s)(--?[a-zA-Z][\w-]*)/g, '$1<span class="flag">$2</span>');
    }
    // R/bash keywords
    const keywords = lang === "r"
      ? ["library", "install\\.packages", "BiocManager", "if", "else", "for", "while", "function", "return", "TRUE", "FALSE", "NULL", "NA", "require"]
      : ["sudo", "conda", "pip", "wget", "curl", "export", "mkdir", "cp", "mv", "rm", "cd", "cat", "echo", "for", "do", "done", "if", "then", "fi", "tar"];
    keywords.forEach(kw => {
      const re = new RegExp(`\\b(${kw})\\b`, "g");
      code = code.replace(re, '<span class="keyword">$1</span>');
    });
    return code;
  }


  // ==============================================================
  //  SECTION 8: EVENT LISTENERS FOR CONTENT
  // ==============================================================

  function attachContentListeners() {
    // Landing card navigation
    attachLandingCardListeners();

    // Copy buttons
    $$(".code-block-copy").forEach(btn => {
      btn.addEventListener("click", () => {
        const codeId = btn.dataset.codeId;
        const codeEl = $(`#${codeId}`);
        if (!codeEl) return;
        const text = codeEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "✓ Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "📋 Copy";
            btn.classList.remove("copied");
          }, 2000);
        }).catch(() => {
          // Fallback
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          btn.textContent = "✓ Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "📋 Copy";
            btn.classList.remove("copied");
          }, 2000);
        });
      });
    });

    // Error toggles
    $$(".error-header").forEach(header => {
      header.addEventListener("click", () => {
        const eid = header.dataset.eid;
        const sol = $(`#sol_${eid}`);
        const tog = $(`#toggle_${eid}`);
        if (sol) {
          sol.classList.toggle("open");
          if (tog) tog.classList.toggle("open");
        }
      });
    });
  }

  function attachLandingCardListeners() {
    $$(".landing-card[data-nav-id]").forEach(card => {
      card.addEventListener("click", () => {
        const targetId = card.dataset.navId;
        navigateTo(targetId);
      });
    });
  }

  function navigateTo(id) {
    // Expand ancestry
    const ancestry = getAncestry(id);
    if (ancestry) {
      ancestry.forEach(n => state.expandedNodes.add(n.id));
    }
    state.activeNodeId = id;
    renderTree();
    renderContent(id);
    updateBreadcrumb(id);
    // Scroll tree to active node
    setTimeout(() => {
      const activeHeader = $(".tree-node-header.active");
      if (activeHeader) {
        activeHeader.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }, 100);
  }


  // ==============================================================
  //  SECTION 9: SEARCH
  // ==============================================================

  const searchModal = $("#searchModal");
  const modalSearchInput = $("#modalSearchInput");
  const modalSearchResults = $("#modalSearchResults");
  const headerSearchInput = $("#searchInput");

  function openSearch() {
    searchModal.classList.add("open");
    modalSearchInput.value = "";
    modalSearchInput.focus();
    modalSearchResults.innerHTML = `<div class="search-empty"><p>Start typing to search across all bioinformatics topics, tools, and workflows.</p></div>`;
  }

  function closeSearch() {
    searchModal.classList.remove("open");
  }

  function performSearch(query) {
    if (!query || query.length < 2) {
      modalSearchResults.innerHTML = `<div class="search-empty"><p>Start typing to search across all bioinformatics topics, tools, and workflows.</p></div>`;
      return;
    }

    const q = query.toLowerCase();
    const results = [];

    state.flatNodes.forEach(node => {
      let score = 0;
      const label = (node.label || "").toLowerCase();
      const c = node.content || {};

      // Label match
      if (label.includes(q)) score += 10;
      if (label.startsWith(q)) score += 5;

      // Content match
      const what = (c.what || "").toLowerCase();
      if (what.includes(q)) score += 3;

      // Tools match
      if (c.tools) {
        c.tools.forEach(t => {
          if ((t.name || "").toLowerCase().includes(q)) score += 7;
          if ((t.desc || "").toLowerCase().includes(q)) score += 2;
        });
      }

      // Databases match
      if (c.databases) {
        c.databases.forEach(d => {
          if ((d.name || "").toLowerCase().includes(q)) score += 7;
        });
      }

      // Algorithms
      if (c.algorithms) {
        c.algorithms.forEach(a => {
          if ((a.name || "").toLowerCase().includes(q)) score += 6;
        });
      }

      // Questions
      if (c.questions) {
        c.questions.forEach(question => {
          if (question.toLowerCase().includes(q)) score += 2;
        });
      }

      if (score > 0) {
        results.push({ node, score });
      }
    });

    results.sort((a, b) => b.score - a.score);
    const top = results.slice(0, 20);

    if (top.length === 0) {
      modalSearchResults.innerHTML = `<div class="search-empty"><p>No results found for "<strong>${escapeHTML(query)}</strong>".</p></div>`;
      return;
    }

    let html = "";
    top.forEach(r => {
      const n = r.node;
      const pathStr = n.path ? n.path.join(" › ") : n.label;
      html += `<div class="search-result-item" data-search-id="${n.id}">`;
      html += `<span class="result-icon">${n.icon || "📄"}</span>`;
      html += `<div class="result-info"><div class="result-title">${escapeHTML(n.label)}</div><div class="result-path">${escapeHTML(pathStr)}</div></div>`;
      html += `<span class="result-arrow">→</span>`;
      html += `</div>`;
    });
    modalSearchResults.innerHTML = html;

    // Attach click
    $$(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        const targetId = item.dataset.searchId;
        closeSearch();
        navigateTo(targetId);
      });
    });
  }


  // ==============================================================
  //  SECTION 10: SIDEBAR RESIZE
  // ==============================================================

  const sidebar = $("#sidebar");
  const resizeHandle = $("#resizeHandle");
  let isResizing = false;

  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true;
    resizeHandle.classList.add("active");
    document.addEventListener("mousemove", onResize);
    document.addEventListener("mouseup", stopResize);
    e.preventDefault();
  });

  function onResize(e) {
    if (!isResizing) return;
    const newWidth = Math.min(Math.max(e.clientX, 240), 600);
    sidebar.style.width = newWidth + "px";
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

  const scrollTopBtn = $("#scrollTop");

  contentPanel.addEventListener("scroll", () => {
    if (contentPanel.scrollTop > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    contentPanel.scrollTo({ top: 0, behavior: "smooth" });
  });


  // ==============================================================
  //  SECTION 12: INITIALIZATION
  // ==============================================================

  function init() {
    // Apply theme
    applyTheme(state.theme);

    // Set sidebar width
    sidebar.style.width = state.sidebarWidth + "px";

    // Render tree
    renderTree();

    // Render initial content
    renderContent("root");
    updateBreadcrumb("root");

    // Update footer stats
    const stats = countStats(KNOWLEDGE_TREE);
    const totalTopicsEl = $("#totalTopics");
    const totalToolsEl = $("#totalTools");
    const totalWorkflowsEl = $("#totalWorkflows");
    if (totalTopicsEl) totalTopicsEl.textContent = stats.topics;
    if (totalToolsEl) totalToolsEl.textContent = stats.tools;
    if (totalWorkflowsEl) totalWorkflowsEl.textContent = stats.workflows;

    // Theme toggle
    $("#themeToggle").addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });

    // Expand / Collapse all
    $("#expandAll").addEventListener("click", () => {
      state.flatNodes.forEach(n => state.expandedNodes.add(n.id));
      renderTree();
    });

    $("#collapseAll").addEventListener("click", () => {
      state.expandedNodes.clear();
      state.expandedNodes.add("root");
      renderTree();
    });

    // Header search — open modal
    headerSearchInput.addEventListener("focus", (e) => {
      e.target.blur();
      openSearch();
    });

    // Keyboard shortcut Ctrl+K
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") {
        closeSearch();
      }
    });

    // Modal search input
    modalSearchInput.addEventListener("input", (e) => {
      performSearch(e.target.value);
    });

    // Close modal on overlay click
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) closeSearch();
    });

    // Hide loader
    setTimeout(() => {
      const loader = $("#loader");
      if (loader) loader.classList.add("hidden");
    }, 800);
  }

  // Run
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
// Mobile sidebar toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.sidebar-overlay');
const sidebarClose = document.querySelector('.sidebar-close');

function openSidebar() {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock body scroll when drawer open
}

function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
}

if (menuToggle) menuToggle.addEventListener('click', openSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);
if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);

// Close sidebar when a tree node is clicked on mobile
document.querySelectorAll('.tree-node-header').forEach(node => {
    node.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    });
});
})();
