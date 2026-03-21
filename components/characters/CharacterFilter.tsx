'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { CharacterCard } from './CharacterCard';
import type { DatabaseCharacter } from './CharacterCard';

interface Props {
  spiderVerse: DatabaseCharacter[];
  spiderVillains: DatabaseCharacter[];
  marvelUniverse: DatabaseCharacter[];
}

type FilterKey = 'all' | 'spider-verse' | 'spider-villains' | 'marvel-universe';

export function CharacterFilter({ spiderVerse, spiderVillains, marvelUniverse }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<FilterKey>('all');

  const all = useMemo(
    () => [...spiderVerse, ...spiderVillains, ...marvelUniverse],
    [spiderVerse, spiderVillains, marvelUniverse]
  );

  const FILTERS = [
    { key: 'all' as FilterKey,             label: 'Todos',          count: all.length },
    { key: 'spider-verse' as FilterKey,    label: 'Spider-Verse',   count: spiderVerse.length },
    { key: 'spider-villains' as FilterKey, label: 'Villanos',       count: spiderVillains.length },
    { key: 'marvel-universe' as FilterKey, label: 'Marvel Universe',count: marvelUniverse.length },
  ];

  const filtered = useMemo(() => {
    let list = active === 'all' ? all : all.filter(c => c.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.realName?.toLowerCase().includes(q) ||
          c.powers.some(p => p.toLowerCase().includes(q))
      );
    }
    return list;
  }, [all, active, query]);

  const isSearching = query.trim().length > 0 || active !== 'all';

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Input búsqueda */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Nombre, alter ego o poder..."
            className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === f.key
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                active === f.key ? 'bg-white/20' : 'bg-white/5'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {isSearching && (
        <div>
          <p className="text-gray-500 text-sm mb-6">
            {filtered.length > 0
              ? `${filtered.length} personaje${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`
              : 'No se encontraron personajes'}
          </p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(c => <CharacterCard key={c.id} character={c} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-600">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Prueba con otro nombre o poder</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
