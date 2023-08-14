import React from 'react';
import Button from '@mui/material/Button';
import { Theme, styled } from '@mui/material/styles';
import { Loader } from '@mantine/core';

interface CustomButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const StyledButton = styled(Button)<{ disabled?: boolean }>(
  ({ theme, disabled }: { theme: Theme; disabled?: boolean }) => ({
    position: 'relative',
    textDecoration: 'none',
    color: theme.palette.primary.main,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    ...(disabled && {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.text.primary,
      pointerEvents: 'none',
      '&:hover': {
        backgroundColor: theme.palette.grey[300],
        borderColor: theme.palette.grey[300],
        color: theme.palette.text.primary,
      },
    }),
    ...(disabled && {
      pointerEvents: 'none',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.shape.borderRadius,
      },
    }),
  })
);

const CustomButton: React.FC<CustomButtonProps> = ({
  type = 'button',
  disabled = false,
  isLoading = false,
  onClick,
  children,
}) => {
  return (
    <StyledButton
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader color="blue" />
        </div>
      )}
      {children}
    </StyledButton>
  );
};

CustomButton.defaultProps = {
  type: 'button',
  disabled: false,
  isLoading: false,
  onClick: () => {},
};

export default CustomButton;
