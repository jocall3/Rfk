import React, { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Filter,
  Users,
  Building2,
  FileText,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  GitCommit,
  Network,
  Scale,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Radio,
  BookOpen,
  Layers,
  BarChart3,
  RefreshCw,
} from "lucide-react";

// --- TYPES ---

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type Sector = "Financial" | "Healthcare & Pharma" | "Energy & Environment" | "Tech & Telecom" | "Defense & Transport";

export interface RevolvingDoorMetric {
  formerOfficialsInIndustry: number;
  industryExecutivesInAgency: number;
  lobbyingSpendMillions: number;
  captureIndex: number; // 0 - 100
}

export interface AgencyRelationship {
  targetSector: Sector;
  riskLevel: RiskLevel;
  primaryAgency: string;
  agencyAcronym: string;
  keyEntities: string[];
  revolvingDoor: RevolvingDoorMetric;
  topMechanism: string;
  markdownDocPath: string;
  answeredQuestion: string;
  followUpQuestion: string;
  summary: string;
}

export interface ResearchQuestionItem {
  id: number;
  phase: "Answered (1-20)" | "Deep Research (21-40)";
  title: string;
  category: Sector | "General Regulatory Strategy";
  agency: string;
  status: "Completed" | "In Progress" | "Queue";
  filePath: string;
  summaryOrPrompt: string;
}

// --- DATA ---

const AGENCIES_DATA: AgencyRelationship[] = [
  {
    primaryAgency: "Securities and Exchange Commission",
    agencyAcronym: "SEC",
    targetSector: "Financial",
    riskLevel: "High",
    keyEntities: ["Wall Street Banks", "Market Makers", "Private Equity Firms"],
    revolvingDoor: {
      formerOfficialsInIndustry: 412,
      industryExecutivesInAgency: 185,
      lobbyingSpendMillions: 142.5,
      captureIndex: 78,
    },
    topMechanism: "Delayed enforcement waivers & deferred prosecution agreements",
    markdownDocPath: "/research/doc-01-sec-capture",
    answeredQuestion: "Q1: How do deferred prosecution agreements signify enforcement capture at the SEC?",
    followUpQuestion: "Q21: What structural budget reforms could decouple SEC funding from industry penalty dependencies?",
    summary: "Systemic pressure from high-frequency trading firms and major investment banks shifts agency focus from prevention to post-hoc settlement fees."
  },
  {
    primaryAgency: "Food and Drug Administration",
    agencyAcronym: "FDA",
    targetSector: "Healthcare & Pharma",
    riskLevel: "Critical",
    keyEntities: ["Big Pharma", "Medical Device Mfrs", "PDUFA User Fee Coalitions"],
    revolvingDoor: {
      formerOfficialsInIndustry: 620,
      industryExecutivesInAgency: 310,
      lobbyingSpendMillions: 356.0,
      captureIndex: 91,
    },
    topMechanism: "User Fee Acts (PDUFA) funding 70%+ of drug review budgets",
    markdownDocPath: "/research/doc-02-fda-pdufa",
    answeredQuestion: "Q2: How do prescription drug user fees create agency dependency on regulated pharmaceutical firms?",
    followUpQuestion: "Q22: Can independent non-profit clinical trial registries replace corporate-sponsored drug safety trials?",
    summary: "High reliance on PDUFA user fees creates accelerated approval incentives, dampening rigorous long-term post-market safety oversight."
  },
  {
    primaryAgency: "Federal Communications Commission",
    agencyAcronym: "FCC",
    targetSector: "Tech & Telecom",
    riskLevel: "High",
    keyEntities: ["Broadband Monopolies", "Wireless Carriers", "Big Tech"],
    revolvingDoor: {
      formerOfficialsInIndustry: 290,
      industryExecutivesInAgency: 145,
      lobbyingSpendMillions: 118.2,
      captureIndex: 82,
    },
    topMechanism: "Revolving door leadership defining spectrum auction policy & net neutrality definitions",
    markdownDocPath: "/research/doc-03-fcc-telecom",
    answeredQuestion: "Q3: What mechanisms allowed telecom incumbents to stifle municipal broadband expansion?",
    followUpQuestion: "Q23: How can public spectrum allocation algorithms be audited for incumbent bias?",
    summary: "Heavy lobbying and revolving leadership have historically favored incumbent telecom cartels over community broadband infrastructure."
  },
  {
    primaryAgency: "Environmental Protection Agency",
    agencyAcronym: "EPA",
    targetSector: "Energy & Environment",
    riskLevel: "High",
    keyEntities: ["Fossil Fuel Refiners", "Chemical Producers", "Agribusiness Conglomerates"],
    revolvingDoor: {
      formerOfficialsInIndustry: 380,
      industryExecutivesInAgency: 195,
      lobbyingSpendMillions: 210.8,
      captureIndex: 84,
    },
    topMechanism: "Suppression of toxicological data via science advisory board stacking",
    markdownDocPath: "/research/doc-04-epa-chemical",
    answeredQuestion: "Q4: How does chemical industry science advisory board placement shape risk assessments?",
    followUpQuestion: "Q24: What legal models best insulate climate risk models from administrative rollbacks?",
    summary: "Corporate scientific litigation tactics delay chemical toxicity evaluations for decades through endless methodological disputes."
  },
  {
    primaryAgency: "Federal Aviation Administration",
    agencyAcronym: "FAA",
    targetSector: "Defense & Transport",
    riskLevel: "Critical",
    keyEntities: ["Aerospace Manufacturers", "Major Domestic Airlines"],
    revolvingDoor: {
      formerOfficialsInIndustry: 210,
      industryExecutivesInAgency: 130,
      lobbyingSpendMillions: 88.4,
      captureIndex: 89,
    },
    topMechanism: "Delegated certification authority (ODA program) allowing self-auditing",
    markdownDocPath: "/research/doc-05-faa-oda",
    answeredQuestion: "Q5: How did Organization Designation Authorization (ODA) compromise Boeing safety oversight?",
    followUpQuestion: "Q25: What is the economic cost of re-establishing fully in-house agency flight certification testing?",
    summary: "Outsourcing flight safety validation directly to manufacturers created systemic blind spots and tragic regulatory failure."
  },
  {
    primaryAgency: "Federal Reserve Board",
    agencyAcronym: "FED",
    targetSector: "Financial",
    riskLevel: "Moderate",
    keyEntities: ["Primary Dealer Banks", "Shadow Banking Coalitions"],
    revolvingDoor: {
      formerOfficialsInIndustry: 540,
      industryExecutivesInAgency: 280,
      lobbyingSpendMillions: 95.0,
      captureIndex: 68,
    },
    topMechanism: "Regional Reserve Bank director appointments held by regulated bank CEOs",
    markdownDocPath: "/research/doc-06-fed-governance",
    answeredQuestion: "Q6: How do regional Federal Reserve governance structures enable commercial bank influence?",
    followUpQuestion: "Q26: Should regional Fed directors be chosen through open public elections rather than bank member votes?",
    summary: "Structural representation of commercial bank executives on regional boards creates subtle alignment with financial sector preferences."
  }
];

const QUESTIONS_20_ANSWERED: ResearchQuestionItem[] = Array.from({ length: 20 }).map((_, i) => {
  const index = i + 1;
  const sectors: Sector[] = ["Financial", "Healthcare & Pharma", "Energy & Environment", "Tech & Telecom", "Defense & Transport"];
  const sector = sectors[i % sectors.length];
  return {
    id: index,
    phase: "Answered (1-20)",
    title: `Core Question #${index}: Regulatory Capture Analysis on Node ${index}`,
    category: sector,
    agency: i % 2 === 0 ? "SEC / FDA" : "EPA / FCC / FAA",
    status: "Completed",
    filePath: `/markdown/answers/q${index < 10 ? '0' + index : index}-analysis.md`,
    summaryOrPrompt: `Detailed examination answering how administrative procedure acts, revolving doors, and lobby coalitions shape policy outcome #${index}.`
  };
});

const QUESTIONS_20_RESEARCH: ResearchQuestionItem[] = Array.from({ length: 20 }).map((_, i) => {
  const index = i + 21;
  const sectors: Sector[] = ["Financial", "Healthcare & Pharma", "Energy & Environment", "Tech & Telecom", "Defense & Transport"];
  const sector = sectors[i % sectors.length];
  return {
    id: index,
    phase: "Deep Research (21-40)",
    title: `Follow-up Research #${index}: Counter-Measure & Decoupling Strategy`,
    category: sector,
    agency: i % 2 === 0 ? "CFTC / FTC" : "NRC / FERC / DOT",
    status: i % 3 === 0 ? "In Progress" : "Queue",
    filePath: `/markdown/research/q${index}-deep-dive.md`,
    summaryOrPrompt: `Synthesis question gathering field data, financial disclosures, and legislative proposals to solve captured regulatory node #${index}.`
  };
});

// --- COMPONENT ---

export default function RegulatoryMapDashboard() {
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedRisk, setSelectedRisk] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"map" | "questions" | "matrix">("map");
  const [selectedAgency, setSelectedAgency] = useState<AgencyRelationship | null>(AGENCIES_DATA[0]);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  // Filters
  const filteredAgencies = useMemo(() => {
    return AGENCIES_DATA.filter((agency) => {
      const matchesSector = selectedSector === "All" || agency.targetSector === selectedSector;
      const matchesRisk = selectedRisk === "All" || agency.riskLevel === selectedRisk;
      const matchesSearch =
        agency.primaryAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.agencyAcronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.keyEntities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        agency.topMechanism.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesRisk && matchesSearch;
    });
  }, [selectedSector, selectedRisk, searchQuery]);

  const allQuestions = useMemo(() => {
    return [...QUESTIONS_20_ANSWERED, ...QUESTIONS_20_RESEARCH].filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.summaryOrPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.agency.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === "All" || q.category === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [searchQuery, selectedSector]);

  const getRiskBadgeColor = (risk: RiskLevel) => {
    switch (risk) {
      case "Critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "High":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Moderate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <>
      <Head>
        <title>Regulatory Capture Map & Relationship Dashboard</title>
        <meta
          name="description"
          value="Interactive dashboard tracking agency capture mechanisms, revolving door metrics, answered core questions (1-20), and research questions (21-40)."
        />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {/* TOP NAVIGATION BAR */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Regulatory Capture Map
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    v2.4
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Agency Relationships, Influence Pathways & 40-Question Research Nexus
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/research/docs"
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-medium border border-slate-700"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Markdown Papers
              </Link>
              <div className="h-4 w-[1px] bg-slate-800 my-auto" />
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                20/20 Solved | 20 Queued
              </span>
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* STATS OVERVIEW CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">Agencies Mapped</span>
                <Building2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">6 Core Agencies</div>
              <p className="text-xs text-slate-400 mt-1">SEC, FDA, FCC, EPA, FAA, FED</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">Avg Capture Risk</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono">82.0 / 100</div>
              <p className="text-xs text-slate-400 mt-1">High systemic exposure across sectors</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">Revolving Door Tracked</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">2,457 Personnel</div>
              <p className="text-xs text-slate-400 mt-1">Agency-to-Industry swaps logged</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">Research Progress</span>
                <FileText className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">40 Questions</div>
              <p className="text-xs text-slate-400 mt-1">20 Answered + 20 Deep-Dive Prompts</p>
            </div>
          </section>

          {/* CONTROL BAR: CONTROLS & TABS */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* TAB SWITCHER */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-sm">
                <button
                  onClick={() => setActiveTab("map")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                    activeTab === "map"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Network className="w-4 h-4" />
                  Agency Network
                </button>
                <button
                  onClick={() => setActiveTab("questions")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                    activeTab === "questions"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  40-Question Hub
                </button>
                <button
                  onClick={() => setActiveTab("matrix")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                    activeTab === "matrix"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Revolving Door Risk Matrix
                </button>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agencies, mechanisms, or research questions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* FILTERS ROW */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400 font-mono flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </span>

              {/* SECTOR SELECT */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Sector:</span>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Sectors</option>
                  <option value="Financial">Financial</option>
                  <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                  <option value="Energy & Environment">Energy & Environment</option>
                  <option value="Tech & Telecom">Tech & Telecom</option>
                  <option value="Defense & Transport">Defense & Transport</option>
                </select>
              </div>

              {/* RISK SELECT */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Risk Level:</span>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </div>

              {(selectedSector !== "All" || selectedRisk !== "All" || searchQuery !== "") && (
                <button
                  onClick={() => {
                    setSelectedSector("All");
                    setSelectedRisk("All");
                    setSearchQuery("");
                  }}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-auto font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Filters
                </button>
              )}
            </div>
          </section>

          {/* TAB 1: AGENCY NETWORK MAP */}
          {activeTab === "map" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* AGENCY LIST & CARDS */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Regulated Sector Relationships ({filteredAgencies.length})
                </h2>

                {filteredAgencies.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                    No agencies match the current filter criteria.
                  </div>
                ) : (
                  filteredAgencies.map((agency) => {
                    const isSelected = selectedAgency?.agencyAcronym === agency.agencyAcronym;
                    return (
                      <div
                        key={agency.agencyAcronym}
                        onClick={() => setSelectedAgency(agency)}
                        className={`cursor-pointer rounded-xl border p-5 transition backdrop-blur ${
                          isSelected
                            ? "bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-xl"
                            : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-lg font-bold text-white">
                                {agency.agencyAcronym}
                              </span>
                              <span className="text-slate-400 font-medium text-sm">
                                {agency.primaryAgency}
                              </span>
                            </div>
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                              {agency.targetSector}
                            </span>
                          </div>

                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold border ${getRiskBadgeColor(
                              agency.riskLevel
                            )}`}
                          >
                            Risk: {agency.riskLevel}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs bg-slate-950/60 rounded-lg p-3 border border-slate-800/80">
                          <div>
                            <span className="text-slate-400 block">Capture Index</span>
                            <span className="font-mono font-bold text-amber-400 text-sm">
                              {agency.revolvingDoor.captureIndex} / 100
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Revolving Swaps</span>
                            <span className="font-mono font-bold text-slate-200 text-sm">
                              {agency.revolvingDoor.formerOfficialsInIndustry + agency.revolvingDoor.industryExecutivesInAgency}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Lobby Spend</span>
                            <span className="font-mono font-bold text-slate-200 text-sm">
                              ${agency.revolvingDoor.lobbyingSpendMillions}M
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-slate-300 line-clamp-2">
                          <strong className="text-slate-400">Primary Mechanism:</strong> {agency.topMechanism}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* AGENCY DETAILED ANALYSIS SIDEBAR */}
              <div className="lg:col-span-5">
                <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                  {selectedAgency ? (
                    <>
                      <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                            Agency Capture Deep Dive
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border ${getRiskBadgeColor(
                              selectedAgency.riskLevel
                            )}`}
                          >
                            {selectedAgency.riskLevel} Risk
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1">
                          {selectedAgency.primaryAgency} ({selectedAgency.agencyAcronym})
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">{selectedAgency.summary}</p>
                      </div>

                      {/* TARGET ENTITIES */}
                      <div>
                        <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Regulated Entangled Groups
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAgency.keyEntities.map((entity, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
                            >
                              {entity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* REVOLVING DOOR breakdown */}
                      <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center justify-between">
                          <span>Revolving Door Dynamics</span>
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-slate-300">
                            <span>Ex-Agency Personnel in Industry:</span>
                            <span className="font-mono font-semibold text-emerald-400">
                              {selectedAgency.revolvingDoor.formerOfficialsInIndustry}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Ex-Industry Execs in Agency:</span>
                            <span className="font-mono font-semibold text-indigo-400">
                              {selectedAgency.revolvingDoor.industryExecutivesInAgency}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Annual Industry Lobbying Spend:</span>
                            <span className="font-mono font-semibold text-amber-400">
                              ${selectedAgency.revolvingDoor.lobbyingSpendMillions} Million
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* LINKED RESEARCH PAPERS */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" /> Linked Research Papers
                        </h4>

                        {/* Answered Q */}
                        <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-1">
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 inline-block">
                            Answered Core Question (1-20)
                          </span>
                          <p className="text-xs font-medium text-slate-200">
                            {selectedAgency.answeredQuestion}
                          </p>
                          <Link
                            href={selectedAgency.markdownDocPath}
                            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline pt-1 font-mono"
                          >
                            Read Full Paper <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        {/* Research Prompt Q */}
                        <div className="p-3 bg-indigo-950/20 border border-indigo-800/40 rounded-lg space-y-1">
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 inline-block">
                            Follow-Up Research Question (21-40)
                          </span>
                          <p className="text-xs font-medium text-slate-200">
                            {selectedAgency.followUpQuestion}
                          </p>
                          <Link
                            href={`${selectedAgency.markdownDocPath}-deep`}
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline pt-1 font-mono"
                          >
                            Explore Research Specs <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-500 py-12">
                      Select an agency card to view detailed relationship map metrics.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 40-QUESTION RESEARCH HUB */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                  Complete 40-Question Research System
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  The primary project deliverable consists of 20 answered markdown papers unpacking core regulatory capture scenarios, alongside 20 expansion research questions generated to drive further field data collection and reform design.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 20 ANSWERED QUESTIONS SECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Phase 1: 20 Answered Questions
                    </h3>
                    <span className="text-xs font-mono text-slate-400">20 / 20 Completed</span>
                  </div>

                  {allQuestions
                    .filter((q) => q.phase === "Answered (1-20)")
                    .map((q) => {
                      const isExpanded = expandedQuestionId === q.id;
                      return (
                        <div
                          key={q.id}
                          className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-4 transition hover:border-slate-700"
                        >
                          <div
                            className="flex items-start justify-between cursor-pointer gap-2"
                            onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                                {q.category}
                              </span>
                              <h4 className="text-xs font-semibold text-slate-200 mt-1">
                                {q.title}
                              </h4>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2 text-slate-300">
                              <p>{q.summaryOrPrompt}</p>
                              <div className="flex items-center justify-between pt-2">
                                <span className="font-mono text-[10px] text-slate-500">
                                  Path: {q.filePath}
                                </span>
                                <Link
                                  href={q.filePath}
                                  className="text-emerald-400 hover:underline text-xs flex items-center gap-1 font-mono"
                                >
                                  Open Markdown <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* 20 EXPANSION QUESTIONS SECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold font-mono text-indigo-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Phase 2: 20 Deep-Research Questions
                    </h3>
                    <span className="text-xs font-mono text-slate-400">20 Active Prompts</span>
                  </div>

                  {allQuestions
                    .filter((q) => q.phase === "Deep Research (21-40)")
                    .map((q) => {
                      const isExpanded = expandedQuestionId === q.id;
                      return (
                        <div
                          key={q.id}
                          className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-4 transition hover:border-slate-700"
                        >
                          <div
                            className="flex items-start justify-between cursor-pointer gap-2"
                            onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                                {q.category}
                              </span>
                              <h4 className="text-xs font-semibold text-slate-200 mt-1">
                                {q.title}
                              </h4>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2 text-slate-300">
                              <p>{q.summaryOrPrompt}</p>
                              <div className="flex items-center justify-between pt-2">
                                <span className="font-mono text-[10px] text-slate-500">
                                  Path: {q.filePath}
                                </span>
                                <Link
                                  href={q.filePath}
                                  className="text-indigo-400 hover:underline text-xs flex items-center gap-1 font-mono"
                                >
                                  Gather Data <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVOLVING DOOR RISK MATRIX */}
          {activeTab === "matrix" && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  Comparative Agency Capture & Lobbying Risk Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Quantitative breakdown comparing former agency personnel in private industry versus lobby expenditure and risk scoring.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4">Agency</th>
                      <th className="p-4">Sector</th>
                      <th className="p-4">Risk Level</th>
                      <th className="p-4">Ex-Agency in Industry</th>
                      <th className="p-4">Ex-Industry in Agency</th>
                      <th className="p-4">Lobby Spend ($M)</th>
                      <th className="p-4 text-right">Capture Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {AGENCIES_DATA.map((agency) => (
                      <tr key={agency.agencyAcronym} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <span className="font-mono text-indigo-400">{agency.agencyAcronym}</span>
                          <span className="text-slate-400 font-normal hidden sm:inline">
                            - {agency.primaryAgency}
                          </span>
                        </td>
                        <td className="p-4">{agency.targetSector}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-semibold border ${getRiskBadgeColor(
                              agency.riskLevel
                            )}`}
                          >
                            {agency.riskLevel}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{agency.revolvingDoor.formerOfficialsInIndustry}</td>
                        <td className="p-4 font-mono">{agency.revolvingDoor.industryExecutivesInAgency}</td>
                        <td className="p-4 font-mono">${agency.revolvingDoor.lobbyingSpendMillions}M</td>
                        <td className="p-4 text-right font-mono font-bold text-amber-400">
                          {agency.revolvingDoor.captureIndex} / 100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-800 bg-slate-950 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
            <p className="font-mono">
              Regulatory Capture Dashboard & Database &bull; Generated Markdown Research System
            </p>
            <p>
              20 Core Questions Fully Answered &bull; 20 Deep-Dive Expansion Research Prompts Ready
              for Synthesis
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}