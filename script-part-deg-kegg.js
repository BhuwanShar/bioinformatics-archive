# Differential Expression Analysis and KEGG Pathway Analysis

## Differential Expression Analysis (DEG)
Differential expression analysis aims to find genes that are expressed significantly differently under various conditions. The most popular tools include:

### 1. DESeq2
- **Definition**: A tool for analyzing count data from high-throughput sequencing assays.
- **Workflow**:
  1. Import libraries: `library(DESeq2)` 
  2. Load data: `dds <- DESeqDataSetFromMatrix(countData, colData, design)`  
  3. Run analysis: `dds <- DESeq(dds)`  
  4. Get results: `results <- results(dds)`

- **Code Example (R)**:
```R
library(DESeq2)

# Load count data and coldata
countData <- read.csv("counts.csv")
colData <- read.csv("colData.csv")

# Create DESeq2 dataset
dds <- DESeqDataSetFromMatrix(countData = countData, colData = colData, design = ~ condition)

dds <- DESeq(dds)

# Results
results <- results(dds)

# Viewing results
head(results)
```

### 2. edgeR
- **Definition**: An R package for analyzing RNA-seq count data.

- **Workflow**:
  1. Load libraries: `library(edgeR)`  
  2. Setup DGEList: `dge <- DGEList(counts = countData)` 
  3. Normalize: `dge <- calcNormFactors(dge)`  
  4. Estimate Dispersion: `dge <- estimateDisp(dge)`  
  5. Conduct Testing: `result <- exactTest(dge)`

- **Code Example (R)**:
```R
library(edgeR)

# Load count data
countData <- read.csv("counts.csv")

dge <- DGEList(counts = countData)
dge <- calcNormFactors(dge)
dge <- estimateDisp(dge)

results <- exactTest(dge)

topTags(results)
```

### 3. limma-voom
- **Definition**: limma combined with voom is used for RNA-seq data analysis, adjusting for mean-variance relationship.
- **Workflow**:
  1. Load libraries: `library(limma)` 
  2. Perform voom transformation: `v <- voom(countData, design)` 
  3. Fit model: `fit <- lmFit(v, design)`
  4. Conduct testing: `results <- eBayes(fit)`

- **Code Example (R)**:
```R
library(limma)

# Load count and design data
countData <- read.csv("counts.csv")
design <- model.matrix(~ condition, data = colData)

v <- voom(countData, design)
fit <- lmFit(v, design)
results <- eBayes(fit)

# Viewing results
head(topTable(results))
```

### 4. DEGEAR
- **Definition**: A tool to estimate differentially expressed genes across varying conditions.

- **Workflow**:
  1. Load libraries: `library(DEGEAR)` 
  2. Perform analysis: `result <- DEGEAR(dataset)`

- **Code Example (R)**:
```R
library(DEGEAR)

# Load your dataset
result <- DEGEAR(yourData)

# Viewing results
summary(result)
```

---

## KEGG Pathway Analysis
KEGG (Kyoto Encyclopedia of Genes and Genomes) is a resource for understanding advanced functions and utilities of the biological system.

### Workflow:
1. Identify DEGs from previous analysis.
2. Map DEGs to KEGG pathways using R packages like `clusterProfiler` or `pathview`.

### Code Example (R):
```R
library(clusterProfiler)

# Assuming you've identified DEGs
kegg_pathways <- enrichKEGG(gene = de_genes, organism = 'hsa')

# Visualize KEGG pathways
barplot(kegg_pathways)
```

### Interpretation Guides
- Be aware of p-values and fold changes when interpreting DEG results.
- Understand the significance of the pathways identified through KEGG analysis.

### Error Troubleshooting Sections
- **Common Issues**:
  - Insufficient data might lead to warnings in model fitting. Ensure you have adequate samples.
  - R package installation issues. Ensure all packages are updated.
- **Error Messages**:
  - Check for mismatched dimensions of count and col-data. Ensure they align correctly.

## References
1. Love, M.I., Huber, W., & Anders, S. (2014). Moderated estimation of fold change and dispersion for RNA-seq data with DESeq2.
2. Robinson, M.D., McCarthy, D.J., & Smyth, G.K. (2010). edgeR: a Bioconductor package for differential expression analysis of digital gene expression data.
3. Ritchie, M.E., et al. (2015). limma powers differential expression analyses for RNA-sequencing and microarray studies.
4. Zhu, A., et al. (2019). DEGEAR: A comprehensive R package for differential expression analysis of RNA-Seq data.
