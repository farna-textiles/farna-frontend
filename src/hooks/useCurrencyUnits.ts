import { useQuery } from '@tanstack/react-query';
import getCurrencyUnits from '../api/currencyUnitApi';

const useCurrencyUnits = () => {
  return useQuery(['currencyUnits'], () => getCurrencyUnits());
};

export default useCurrencyUnits;
