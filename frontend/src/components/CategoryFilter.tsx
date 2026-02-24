import { Category } from '../backend';
import { type CategoryFilterValue, ALL_CATEGORIES } from '../hooks/useQueries';

const CATEGORY_LABELS: Record<Category | typeof ALL_CATEGORIES, string> = {
  [ALL_CATEGORIES]: 'All',
  [Category.Sword]: 'Sword',
  [Category.Axe]: 'Axe',
  [Category.Crystal]: 'Crystal',
  [Category.Mace]: 'Mace',
  [Category.Spearmace]: 'Spearmace',
  [Category.DiamondSMP]: 'Diamond SMP',
  [Category.UHC]: 'UHC',
  [Category.SMP]: 'SMP',
};

const CATEGORY_OPTIONS: CategoryFilterValue[] = [
  ALL_CATEGORIES,
  Category.Sword,
  Category.Axe,
  Category.Crystal,
  Category.Mace,
  Category.Spearmace,
  Category.DiamondSMP,
  Category.UHC,
  Category.SMP,
];

interface CategoryFilterProps {
  selectedCategory: CategoryFilterValue;
  onCategoryChange: (category: CategoryFilterValue) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_OPTIONS.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`
              px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded border transition-all duration-150
              ${isActive
                ? 'bg-tier-ht1 border-tier-ht1 text-app-bg shadow-glow-ht1'
                : 'bg-app-surface border-white/10 text-app-muted hover:border-tier-ht1/50 hover:text-app-fg'
              }
            `}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}
