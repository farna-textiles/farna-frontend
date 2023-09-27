/* eslint-disable import/no-extraneous-dependencies */
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import {getCurrencyUnits} from '../../api/currencyUnitApi';
import { CurrencyUnit } from '../../interfaces';

interface CurrencyFilterProps {
  selectedCurrency: number;
  onCurrencyChange: (newCurrency: number) => void;
}

const CurrencyFilter: React.FC<CurrencyFilterProps> = ({
  selectedCurrency,
  onCurrencyChange,
}) => {
  const { data } = useQuery(['currencyUnits'], getCurrencyUnits) as {
    data: CurrencyUnit[];
  };

  return (
    <div className="flex items-center">
      <select
        id="currency"
        className="p-2 rounded-md border-2 bg-gray-100 border-gray-300 dark:border-gray-700 text-sm"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(+e.target.value)}
      >
        {data?.map((currency) => (
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
