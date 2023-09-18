/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import getCurrencyUnits from '../../api/currencyUnitApi';
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
    <div className="">
      <label className="text-gray-600 dark:text-light pr-2">Currency:</label>
      <select
        className="border rounded-md p-2"
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
