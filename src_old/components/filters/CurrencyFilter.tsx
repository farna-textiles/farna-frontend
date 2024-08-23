/* eslint-disable react/prop-types */
import { CurrencyUnit } from '../../interfaces';

interface CurrencyFilterProps {
  selectedCurrency: number;
  allCurrencyUnits: CurrencyUnit[];
  onCurrencyChange: (newCurrency: number) => void;
}

const CurrencyFilter: React.FC<CurrencyFilterProps> = ({
  selectedCurrency,
  onCurrencyChange,
  allCurrencyUnits,
}) => {
  return (
    <div className="flex items-center">
      <select
        id="currency"
        className="p-2 rounded-md border-2 bg-gray-100 border-gray-300 dark:border-gray-700 text-sm"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(+e.target.value)}
      >
        {allCurrencyUnits?.map((currency) => (
          <option key={currency.id} value={currency.id}>
            {currency.name} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyFilter;
