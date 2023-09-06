import React from 'react';

type ToggleSwitchProps = {
  isOn: boolean;
  onToggle: () => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
  return (
    <button
      className="relative focus:outline-none"
      type="button"
      onClick={onToggle}
    >
      <div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker" />
      <div
        className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
          isOn
            ? 'translate-x-6 bg-primary-light dark:bg-primary'
            : 'translate-x-0 bg-white dark:bg-primary-100'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
