import React from 'react';

interface LogoProps {
  width: number;
  height: number;
  theme?: string;
}

const Logo: React.FC<LogoProps> = ({ width, height, theme }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 230 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="none" />
      <text
        x="0"
        y="50"
        fontFamily="'KeepCalm', sans-serif"
        fontSize="40"
        fontWeight="bold"
        fill={theme === 'light' ? 'black' : 'white'}
      >
        My
      </text>
      <text
        x="60"
        y="50"
        fontFamily="'KeepCalm', sans-serif"
        fontSize="40"
        fontWeight="bold"
        fill="red"
      >
        Delivery
      </text>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=KeepCalm:wght@700&display=swap');`}
      </style>
    </svg>
  );
};

export default Logo;
