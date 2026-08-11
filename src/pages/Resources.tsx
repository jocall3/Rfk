import React, { useState } from 'react';

interface Resource {
  title: string;
  description: string;
  url: string;
  category: 'guidelines' | 'literature' | 'tools';
  organization: string;
}

const resourcesData: Resource[] = [
  {
    title: "Dietary Guidelines for Americans",
    description: "Provides science-based advice on what to eat and drink to promote health, reduce risk of chronic disease, and meet nutrient needs.",
    url: "https://www.dietaryguidelines.gov/",
    category: "guidelines",
    organization: "U.S. Department of Agriculture (USDA) & HHS"
  },
  {
    title: "WHO Healthy Diet Fact Sheet",
    description: "Global recommendations and key facts on maintaining a healthy diet to protect against malnutrition and noncommunicable diseases.",
    url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    category: "guidelines",
    organization: "World Health Organization"
  },
  {
    title: "PubMed / MEDLINE",
    description: "A free resource supporting the search and retrieval of peer-reviewed biomedical and life sciences literature.",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    category: "literature",
    organization: "National Institutes of Health (NIH)"
  },
  {
    title: "Cochrane Database of Systematic Reviews",
    description: "The leading journal and database for systematic reviews in health care, providing high-quality, independent evidence.",
    url: "https://www.cochranelibrary.com/",
    category: "literature",
    organization: "Cochrane Collaboration"
  },
  {
    title: "FoodData Central",
    description: "An integrated data system that provides expanded, nutrient profile data on food and food components.",
    url: "https://fdc.nal.usda.gov/",
    category: "tools",
    organization: "U.S. Department of Agriculture (USDA)"
  },
  {
    title: "CDC Nutrition, Physical Activity, and Obesity Data",
    description: "Access to national and state-level data, statistics, and interactive tools regarding nutrition and health outcomes.",
    url: "https://www.cdc.gov/nccdphp/dnpao/index.html",
    category: "tools",
    organization: "Centers for Disease Control and Prevention"
  }
];

export default function Resources() {
  const [activeTab, setActiveTab] = useState<'all' | 'guidelines' | 'literature' | 'tools'>('all');

  const filteredResources = activeTab === 'all' 
    ? resourcesData 
    : resourcesData.filter(r => r.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
            Public Health & Nutrition Resources
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access evidence-based dietary guidelines, peer-reviewed scientific literature, and official public health research tools.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-2 mb-8 border-b border-gray-200 pb-4">
          {(['all', 'guidelines', 'literature', 'tools'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredResources.map((resource, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${
                  resource.category === 'guidelines' ? 'bg-green-100 text-green-800' :
                  resource.category === 'literature' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {resource.category === 'guidelines' ? 'Dietary Guideline' :
                   resource.category === 'literature' ? 'Scientific Literature' :
                   'Research Tool'}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3 font-medium">
                  {resource.organization}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {resource.description}
                </p>
              </div>
              <div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Access Resource
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer / Grounding Section */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-base font-semibold text-blue-900 mb-2">
            About Evidence-Based Public Health
          </h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            Public health guidelines and nutritional recommendations are developed through rigorous, peer-reviewed scientific research, systematic reviews, and consensus among multidisciplinary experts. Utilizing verified databases and official institutional resources helps ensure access to accurate, objective, and clinically validated information regarding dietary health and wellness.
          </p>
        </div>
      </div>
    </div>
  );
}