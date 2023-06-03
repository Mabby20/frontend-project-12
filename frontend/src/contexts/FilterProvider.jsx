import { useCallback } from 'react';
import filter from 'leo-profanity';
import { FilterContext } from './index';

const FilterProvider = ({ children }) => {
  const badWordsRu = filter.getDictionary('ru');
  filter.add(badWordsRu);

  const filterBadWord = useCallback((word) => filter.clean(word), []);

  return (
    <FilterContext.Provider value={filterBadWord}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
