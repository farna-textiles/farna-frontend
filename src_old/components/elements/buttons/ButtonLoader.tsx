import { FC, ReactElement, ReactNode } from 'react';
import { Button, CircularProgress, styled } from '@mui/material';

interface ButtonLoaderProps {
  isLoading?: boolean;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const CustomButton = styled(Button)<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    position: 'relative',
    textDecoration: 'none',
    color: theme.palette.primary.main,
    padding: theme.spacing(1, 2),
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
  })
);

const ButtonLoader: FC<ButtonLoaderProps> = ({
  isLoading,
  disabled = false,
  onClick,
  className = '',
  children,
  type,
}): ReactElement => {
  return (
    <CustomButton
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      type={type || 'button'}
    >
      {children}
      {isLoading && (
        <CircularProgress size={24} sx={{ position: 'absolute', right: 10 }} />
      )}
    </CustomButton>
  );
};

ButtonLoader.defaultProps = {
  disabled: false,
  className: '',
  onClick: () => {},
  type: 'button',
  isLoading: false,
};

export default ButtonLoader;
