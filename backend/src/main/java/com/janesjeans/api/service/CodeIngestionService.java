package com.janesjeans.api.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.parser.java.JavaModuleSyntaxParser;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

/**
 * Service for ingesting code files into the vector store for AI-powered code search.
 * Uses LangChain4j for document loading, splitting, and embedding generation.
 */
@Service
@Slf44j
public class CodeIngestionService {

    private final EmbeddingStore embeddingStore;
    private final EmbeddingModel embeddingModel;

    public CodeIngestionService(EmbeddingStore embeddingStore, EmbeddingModel embeddingModel) {
        this.embeddingStore = embeddingStore;
        this.embeddingModel = embeddingModel;
    }

    /**
     * Ingest all code files from a directory into the vector store.
     *
     * @param directoryPath The path to the directory containing code files
     * @return IngestionResult containing statistics about the ingestion
     */
    @Transactional
    public IngestionResult ingestProject(String directoryPath) {
        log.info("Starting code ingestion from directory: {}", directoryPath);

        Path basePath = Paths.get(directoryPath);
        if (!Files.exists(basePath) || !Files.isDirectory(basePath)) {
            throw new IllegalArgumentException("Directory does not exist: " + directoryPath);
        }

        int totalFiles = 0;
        int successfulFiles = 0;
        int failedFiles = 0;
        int totalChunks = 0;

        try (Stream<Path> paths = Files.walk(basePath)) {
            List<Path> codeFiles = paths
                    .filter(Files::isRegularFile)
                    .filter(p -> {
                        String ext = p.toString().toLowerCase();
                        return ext.endsWith(".java") || 
                               ext.endsWith(".js") || 
                               ext.endsWith(".ts") ||
                               ext.endsWith(".jsx") ||
                               ext.endsWith(".tsx") ||
                               ext.endsWith(".py") ||
                               ext.endsWith(".xml") ||
                               ext.endsWith(".yml") ||
                               ext.endsWith(".yaml") ||
                               ext.endsWith(".json") ||
                               ext.endsWith(".sql") ||
                               ext.endsWith(".md");
                    })
                    .toList();

            totalFiles = codeFiles.size();
            log.info("Found {} code files to process", totalFiles);

            for (Path filePath : codeFiles) {
                try {
                    List<Document> documents = loadAndSplitDocument(filePath);
                    if (!documents.isEmpty()) {
                        embeddingStore.add(documents, embeddingModel);
                        successfulFiles++;
                        totalChunks += documents.size();
                        log.debug("Ingested {} chunks from file: {}", documents.size(), filePath);
                    }
                } catch (Exception e) {
                    failedFiles++;
                    log.error("Failed to process file: {}", filePath, e);
                }
            }
        } catch (IOException e) {
            log.error("Failed to walk directory: {}", directoryPath, e);
            throw new RuntimeException("Failed to read directory: " + directoryPath, e);
        }

        log.info("Code ingestion completed. Total: {}, Successful: {}, Failed: {}, Total chunks: {}",
                totalFiles, successfulFiles, failedFiles, totalChunks);

        return new IngestionResult(totalFiles, successfulFiles, failedFiles, totalChunks);
    }

    /**
     * Ingest a single code file into the vector store.
     *
     * @param filePath The path to the code file
     * @return IngestionResult containing statistics about the ingestion
     */
    @Transactional
    public IngestionResult ingestFile(String filePath) {
        log.info("Starting code ingestion for file: {}", filePath);

        Path path = Paths.get(filePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            throw new IllegalArgumentException("File does not exist: " + filePath);
        }

        try {
            List<Document> documents = loadAndSplitDocument(path);
            if (!documents.isEmpty()) {
                embeddingStore.add(documents, embeddingModel);
                return new IngestionResult(1, 1, 0, documents.size());
            }
            return new IngestionResult(1, 0, 1, 0);
        } catch (Exception e) {
            log.error("Failed to ingest file: {}", filePath, e);
            throw new RuntimeException("Failed to ingest file: " + filePath, e);
        }
    }

    /**
     * Load and split a document into chunks.
     */
    private List<Document> loadAndSplitDocument(Path filePath) {
        // Use Java module syntax parser for better code understanding
        TextDocumentParser parser;
        String fileName = filePath.getFileName().toString().toLowerCase();
        
        if (fileName.endsWith(".java")) {
            parser = new JavaModuleSyntaxParser();
        } else {
            parser = new TextDocumentParser();
        }
        
        // Load the document
        Document document = dev.langchain4j.data.document.loader.FileSystemDocumentLoader
                .loadDocument(filePath, parser);
        
        // Split into paragraphs for better context
        DocumentByParagraphSplitter splitter = new DocumentByParagraphSplitter(
                1000,  // maxParagraphSize
                200    // overlap
        );
        
        return splitter.split(document);
    }

    /**
     * Result of an ingestion operation.
     */
    public record IngestionResult(
            int totalFiles,
            int successfulFiles,
            int failedFiles,
            int totalChunks
    ) {
        public String getSummary() {
            return String.format(
                    "Ingested %d/%d files (%d chunks). Failed: %d",
                    successfulFiles, totalFiles, totalChunks, failedFiles
            );
        }
    }
}
