import React from 'react';

interface HeadingProps {
  title: string;
  description: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-800 md:text-5xl lg:text-6xl dark:text-white">
        {title}
      </h1>
      <p className="text-lg font-normal text-gray-600 lg:text-xl dark-text-gray-400">
        {description}
      </p>
    </>
  );
};

export default Heading;
