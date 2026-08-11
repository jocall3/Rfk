import React, { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Tag,
  Plus,
  Trash2,
  Sparkles,
  Share2,
  MessageSquare,
  FlaskConical,
  Clock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export interface QuestionData {
  id: string;
  numericId: number;
  type: 'initial' | 'followup';
  question: string;
  summary: string;
  markdownAnswer: string;
  ingredients: string[];
  category: string;
  status: 'answered' | 'unanswered' | 'researching';
  relatedQuestionIds: string[];
}

// Fallback dataset for static rendering & previewing
const MOCK_QUESTIONS: Record<string, QuestionData> = Array.from({ length: 40 }).reduce(
  (acc, _, idx) => {
    const numericId = idx + 1;
    const id = `q${numericId}`;
    const isInitial = numericId <= 20;

    const initialIngredients = [
      'Niacinamide (5%)',
      'Hyaluronic Acid',
      'Centella Asiatica',
      'Salicylic Acid (2%)',
      'Zinc PCA',
      'Ceramides NP'
    ];

    const followupIngredients = [
      'Peptide Complex',
      'Squalane',
      'Bakuchiol',
      'Madecassoside',
      'Alpha Arbutin',
      'Green Tea Extract'
    ];

    acc[id] = {
      id,
      numericId,
      type: isInitial ? 'initial' : 'followup',
      question: isInitial
        ? `Question #${numericId}: What are the therapeutic mechanism and molecular pathways of target compound #${numericId}?`
        : `Follow-up #${numericId}: How does research compound #${numericId} interact under varying pH and co-formulation conditions?`,
      summary: isInitial
        ? `Comprehensive analysis of compound #${numericId}, evaluating efficacy, bio-availability, and cellular interactions.`
        : `Deep-dive investigation exploring secondary research pathways and synergistic molecular interactions for question #${numericId}.`,
      category: isInitial ? (numericId % 2 === 0 ? 'Dermatology' : 'Biochemistry') : 'Clinical Synergy',
      status: isInitial ? 'answered' : numericId <= 30 ? 'answered' : 'researching',
      ingredients: isInitial
        ? [initialIngredients[idx % initialIngredients.length], 'Glycerin', 'Tocopherol']
        : [followupIngredients[idx % followupIngredients.length], 'Panthenol', 'Allantoin'],
      relatedQuestionIds: [
        `q${(numericId % 40) + 1}`,
        `q${((numericId + 5) % 40) + 1}`
      ],
      markdownAnswer: `## Executive Summary
This document provides a detailed, evidence-based overview answering **Question #${numericId}**.

---

### Key Findings & Biological Pathways
1. **Primary Mechanism**: The primary mechanism involves modulation of cell membrane permeability and receptor signal transduction.
2. **Bioavailability**: Demonstrates optimal absorption rates when formulated within a **pH 5.5 - 6.5** range.
3. **Synergistic Action**: Enhances lipid barrier repair when paired with physiological ceramides.

\`\`\`json
{
  "compound_id": "${id}",
  "optimal_ph": 5.8,
  "stability_index": 0.94,
  "recommended_concentration": "2.0% - 5.0%"
}
\`\`\`

### Clinical Application Guidelines
- **Frequency**: Apply twice daily (Morning/Evening).
- **Contraindications**: Avoid simultaneous application with highly acidic L-Ascorbic Acid solutions above 15% concentration.
- **Observed Benefits**: 
  - Reduced trans-epidermal water loss (TEWL) by up to **28%**.
  - Noticeable improvement in skin texture and inflammation regulation within **14 days**.

> *Note: Further longitudinal research is required to evaluate long-term receptor desensitization over 12 consecutive months.*
`
    };
    return acc;
  },
  {} as Record<string, QuestionData>
);

interface QuestionDetailProps {
  question: QuestionData | null;
}

// Lightweight Custom Markdown Renderer for rendering markdown safely without external heavy deps
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  const renderedElements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        renderedElements.push(
          <pre key={`code-${index}`} className="p-4 my-4 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto text-sm font-mono shadow-inner border border-slate-800">
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith('## ')) {
      renderedElements.push(
        <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      renderedElements.push(
        <h3 key={index} className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={index} className="p-4 my-4 border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 rounded-r-lg italic">
          {line.replace('> ', '')}
        </blockquote>
      );
    } else if (line.startsWith('- ')) {
      renderedElements.push(
        <li key={index} className="ml-6 list-disc text-slate-700 dark:text-slate-300 my-1">
          {parseInlineMarkdown(line.replace('- ', ''))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      renderedElements.push(
        <li key={index} className="ml-6 list-decimal text-slate-700 dark:text-slate-300 my-1">
          {parseInlineMarkdown(line.replace(/^\d+\.\s/, ''))}
        </li>
      );
    } else if (line.trim() === '---') {
      renderedElements.push(<hr key={index} className="my-6 border-slate-200 dark:border-slate-800" />);
    } else if (line.trim() !== '') {
      renderedElements.push(
        <p key={index} className="text-slate-700 dark:text-slate-300 my-3 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  });

  return <div className="markdown-body leading-relaxed">{renderedElements}</div>;
};

// Simple bold / italic / code inline parser
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-slate-800 dark:text-slate-200">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function QuestionDetailPage({ question }: QuestionDetailProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Load research notes from localStorage
  useEffect(() => {
    if (question?.id) {
      const storageKey = `research_notes_${question.id}`;
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (e) {
          console.error('Failed to parse research notes from localStorage', e);
        }
      } else {
        setNotes([]);
      }
    }
  }, [question?.id]);

  // Save notes to localStorage
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim() || !question) return;

    const newNoteObj: Note = {
      id: Date.now().toString(),
      text: newNoteInput.trim(),
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedNotes = [newNoteObj, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`research_notes_${question.id}`, JSON.stringify(updatedNotes));
    setNewNoteInput('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (!question) return;
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem(`research_notes_${question.id}`, JSON.stringify(updatedNotes));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-6 h-6 animate-spin text-indigo-600" />
          <span>Loading question details...</span>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <HelpCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Question Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The requested question ID could not be located in our research dataset.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const prevId = question.numericId > 1 ? `q${question.numericId - 1}` : null;
  const nextId = question.numericId < 40 ? `q${question.numericId + 1}` : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Link Copied!' : 'Share'}
            </button>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                question.type === 'initial'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
              }`}
            >
              {question.type === 'initial' ? 'Core Question (1-20)' : 'Follow-Up (21-40)'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <section className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                {question.category}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  question.status === 'answered'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {question.status === 'answered' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Answer Complete
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Research in Progress
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
              {question.question}
            </h1>

            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base border-l-2 border-slate-200 dark:border-slate-700 pl-4 italic">
              {question.summary}
            </p>
          </div>

          {/* Markdown Content Section */}
          <article className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="w-5 h-5" />
              <span>Full Research Answer & Analysis</span>
            </div>

            <MarkdownRenderer content={question.markdownAnswer} />
          </article>

          {/* Previous / Next Navigation */}
          <div className="flex items-center justify-between pt-4">
            {prevId ? (
              <Link
                href={`/questions/${prevId}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Question
              </Link>
            ) : <div />}

            {nextId ? (
              <Link
                href={`/questions/${nextId}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition"
              >
                Next Question <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <div />}
          </div>
        </section>

        {/* Sidebar Info & Research Notes */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Detected Ingredients / Key Entities */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-indigo-500" />
              Detected Key Ingredients
            </h3>

            <div className="flex flex-wrap gap-2">
              {question.ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-lg border border-indigo-100 dark:border-indigo-900 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Research Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Gather & Research Notes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Add observations or follow-up notes for further secondary synthesis.
            </p>

            <form onSubmit={handleAddNote} className="space-y-3 mb-6">
              <textarea
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Type additional findings or hypotheses..."
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none h-24"
              />
              <button
                type="submit"
                disabled={!newNoteInput.trim()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition"
              >
                <Plus className="w-4 h-4" /> Add Research Note
              </button>
            </form>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-4 italic">
                  No research notes recorded yet.
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50 relative group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {note.timestamp}
                      </span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Questions Link Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-base mb-2">Connected Research</h4>
            <p className="text-xs opacity-90 mb-4">
              Explore interconnected queries to build a full cross-reference analytical model.
            </p>
            <div className="space-y-2">
              {question.relatedQuestionIds.map((relId) => (
                <Link
                  key={relId}
                  href={`/questions/${relId}`}
                  className="block p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium backdrop-blur-sm transition flex items-center justify-between"
                >
                  <span>Explore Question #{relId.replace('q', '')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Array.from({ length: 40 }, (_, i) => ({
    params: { id: `q${i + 1}` }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<QuestionDetailProps> = async ({ params }) => {
  const id = params?.id as string;
  const question = MOCK_QUESTIONS[id] || null;

  return {
    props: {
      question
    }
  };
}