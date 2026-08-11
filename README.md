# Project Documentation: Research Automation Dashboard

## Overview
This project is an automated research pipeline designed to generate, answer, and iterate on complex research questions. It utilizes a modular parser architecture to process markdown-based knowledge bases and a dashboard interface for managing research workflows.

## Architecture
The system is composed of three primary layers:
1. **The Parser Engine**: Located in `/src/parser`, this module scans the `/data` directory for markdown files, extracts Q&A pairs, and validates the schema.
2. **The Research Orchestrator**: Manages the lifecycle of a research cycle (Generation -> Answering -> Synthesis).
3. **The Dashboard**: A React-based interface that visualizes the progress of the 20-file research batches and provides tools for manual intervention.

## Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+ (for NLP processing scripts)
- An active API key for the LLM provider (configured in `.env`)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Add your API keys and database connection strings
   ```

### Running the Dashboard
To launch the development environment:
```bash
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

## Research Workflow
The project follows a strict iterative cycle:

1. **Initialization**: The system generates 20 initial markdown files in `/data/initial`.
2. **Processing**: The Parser Engine reads these files and populates the vector database.
3. **Expansion**: The system generates 20 follow-up questions based on the initial findings.
4. **Research Loop**:
   - Answer the 20 follow-up questions.
   - Store results in `/data/research`.
   - Trigger the synthesis script to identify gaps for the next iteration.

## Using Research Tools
- **Query Interface**: Use the dashboard search bar to perform semantic searches across all generated markdown files.
- **Synthesis Tool**: Run `npm run synthesize` to generate a summary report of the current research batch.
- **Validation**: Run `npm run validate` to ensure all markdown files adhere to the required Q&A schema.

## File Structure
- `/data`: Contains the markdown files (20 initial + 20 follow-up).
- `/src/parser`: Logic for markdown ingestion and schema enforcement.
- `/src/components`: Dashboard UI components.
- `/scripts`: Utility scripts for batch processing and data migration.

## Contributing
Please ensure all new research files follow the standard markdown template located in `/templates/research_template.md`. All PRs must pass the `lint` and `test` suites before merging.