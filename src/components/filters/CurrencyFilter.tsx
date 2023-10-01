/* eslint-disable import/no-extraneous-dependencies */
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { getAllCurrencyUnits } from '../../api/currencyUnitApi';

interface CurrencyFilterProps {
  selectedCurrency: number;
  onCurrencyChange: (newCurrency: number) => void;
}

const CurrencyFilter: React.FC<CurrencyFilterProps> = ({
  selectedCurrency,
  onCurrencyChange,
}) => {
  const { data: currencyUnits } = useQuery(['currencyUnits'], async () =>
    getAllCurrencyUnits()
  );

  return (
    <div className="flex items-center">
      <select
        id="currency"
        className="p-2 rounded-md border-2 bg-gray-100 border-gray-300 dark:border-gray-700 text-sm"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(+e.target.value)}
      >
        {currencyUnits?.data?.map((currency) => (
          <option key={currency.id} value={currency.id}>
            {currency.name} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

CurrencyFilter.propTypes = {
  selectedCurrency: PropTypes.number.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
};

export default CurrencyFilter;
