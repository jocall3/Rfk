import React, { useState, useEffect } from 'react';

export interface FilterState {
  searchQuery: string;
  category: string;
  toxicityLevel: string;
  ingredientPresence: 'all' | 'with-ingredients' | 'without-ingredients';
}

interface SearchBarV2Props {
  categories?: string[];
  toxicityLevels?: string[];
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export const SearchBar_v2: React.FC<SearchBarV2Props> = ({
  categories = ['All', 'Cosmetics', 'Food Additives', 'Household Chemicals', 'Pesticides', 'Industrial'],
  toxicityLevels = ['All', 'Safe', 'Low', 'Moderate', 'High', 'Hazardous'],
  onFilterChange,
  initialFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || '');
  const [category, setCategory] = useState(initialFilters?.category || 'All');
  const [toxicityLevel, setToxicityLevel] = useState(initialFilters?.toxicityLevel || 'All');
  const [ingredientPresence, setIngredientPresence] = useState<'all' | 'with-ingredients' | 'without-ingredients'>(
    initialFilters?.ingredientPresence || 'all'
  );
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Trigger callback whenever any filter state changes
  useEffect(() => {
    onFilterChange({
      searchQuery,
      category,
      toxicityLevel,
      ingredientPresence,
    });
  }, [searchQuery, category, toxicityLevel, ingredientPresence, onFilterChange]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategory('All');
    setToxicityLevel('All');
    setIngredientPresence('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    category !== 'All' ||
    toxicityLevel !== 'All' ||
    ingredientPresence !== 'all';

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200">
      {/* Search Input and Toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="Search questions, ingredients, or chemical compounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex w-full md:w-auto gap-2 justify-end">
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all w-full md:w-auto ${
              isFilterExpanded || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z"
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                !
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Expandable Filter Panel */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isFilterExpanded ? 'max-h-[400px] mt-4 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Toxicity Level Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Toxicity Level
            </label>
            <select
              value={toxicityLevel}
              onChange={(e) => setToxicityLevel(e.target.value)}
              className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {toxicityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Ingredient Presence Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ingredient Presence
            </label>
            <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-300 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIngredientPresence('all')}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  ingredientPresence === 'all'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setIngredientPresence('with-ingredients')}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  ingredientPresence === 'with-ingredients'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                With
              </button>
              <button
                type="button"
                onClick={() => setIngredientPresence('without-ingredients')}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  ingredientPresence === 'without-ingredients'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Without
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                  &times;
                </button>
              </span>
            )}
            {category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                Category: {category}
                <button onClick={() => setCategory('All')} className="hover:text-red-500">
                  &times;
                </button>
              </span>
            )}
            {toxicityLevel !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                Toxicity: {toxicityLevel}
                <button onClick={() => setToxicityLevel('All')} className="hover:text-red-500">
                  &times;
                </button>
              </span>
            )}
            {ingredientPresence !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                Ingredients: {ingredientPresence === 'with-ingredients' ? 'Present' : 'Absent'}
                <button onClick={() => setIngredientPresence('all')} className="hover:text-red-500">
                  &times;
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};