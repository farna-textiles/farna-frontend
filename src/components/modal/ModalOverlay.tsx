/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-extraneous-dependencies */
import React, { Fragment, ReactNode } from 'react';
import { Transition } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-30"
            leave="transition-opacity ease-in-out duration-300"
            leaveFrom="opacity-30"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={onClose}
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="absolute right-0 top-0 h-full max-w-md w-[90%] bg-white p-4 rounded-lg shadow-xl">
              <button
                type="button"
                className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
              {children}
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root>
  );
};

export default ModalOverlay;
