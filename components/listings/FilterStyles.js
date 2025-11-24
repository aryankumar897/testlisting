// components/FilterStyles.js
import { styled } from '@mui/system';
import {
  Box,
  FormControl,
  TextField,
  Button,
  Checkbox,
} from '@mui/material';

// Styled Components
export const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: 2,
  borderRadius: 8,
  width: '100%',
  maxWidth: 250,
  margin: '0 auto',
  backgroundColor: "#fff",
  height: "auto",
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  }
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ff531a',
    },
    '&:hover fieldset': {
      borderColor: '#ff531a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff531a',
    },
  },
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ff531a',
    },
    '&:hover fieldset': {
      borderColor: '#ff531a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff531a',
    },
  },
}));

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#ff531a',
  '&.Mui-checked': {
    color: '#ff531a',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderColor: '#ff531a',
  color: '#ff531a',
  '&:hover': {
    backgroundColor: '#ff531a',
    borderColor: '#ff531a',
    color: 'white'
  },
}));

export const StyledCustomFormControl = styled(FormControl)(({ theme }) => ({
  maxHeight: '300px',
  overflowY: 'auto',
  marginTop: theme.spacing(2),
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}));