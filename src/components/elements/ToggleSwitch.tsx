import React from 'react';

type ToggleSwitchProps = {
  isOn: boolean;
  onToggle: () => void;
  labelLeft?: string;
  labelRight?: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  labelLeft,
  labelRight,
}) => {
  return (
    <div className="flex items-center">
      <p
        className={`mr-2 text-sm font-medium ${
          isOn ? 'text-primary' : 'text-gray-500'
        }`}
      >
        {labelLeft}
      </p>
      <label className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          className="sr-only"
          checked={isOn}
          onChange={onToggle}
        />
        <div className="absolute w-12 h-6 bg-gray-400 rounded-full transition transform duration-300 ease-in-out">
          <div
            className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition transform duration-300 ease-in-out ${
              isOn ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
      </label>
      <p
        className={`ml-2 text-sm font-medium ${
          isOn ? 'text-gray-500' : 'text-primary'
        }`}
      >
        {labelRight}
      </p>
    </div>
  );
};

ToggleSwitch.defaultProps = {
  labelLeft: '',
  labelRight: '',
};

export default ToggleSwitch;
