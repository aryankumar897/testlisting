// components/dashboard/admin/orders/orderstatus/OrderDetailsStyles.js
import { styled } from "@mui/material/styles";
import { Box, Typography, Chip, TableCell, Button, Card } from "@mui/material";

// Color palette
const colors = {
  primary: '#6366f1',
  secondary: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  orange: '#f97316',
  blue: '#0ea5e9',
  red: '#ef4444'
};

export const StyledContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  minHeight: '100vh',
}));

export const ColorfulHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.purple} 100%)`,
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 150,
    height: 150,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
  },
}));

export const GradientCard = styled(Card)(({ theme, type = 'default' }) => {
  const gradients = {
    customer: `linear-gradient(135deg, ${colors.teal}15 0%, ${colors.blue}15 100%)`,
    package: `linear-gradient(135deg, ${colors.success}15 0%, ${colors.teal}15 100%)`,
    status: `linear-gradient(135deg, ${colors.purple}15 0%, ${colors.secondary}15 100%)`,
    default: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.info}15 100%)`
  };

  return {
    padding: theme.spacing(3),
    background: gradients[type] || gradients.default,
    borderRadius: theme.shape.borderRadius * 2,
    border: `2px solid ${type === 'customer' ? colors.teal : type === 'package' ? colors.success : type === 'status' ? colors.purple : colors.primary}30`,
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
  };
});

export const ProductCell = styled(TableCell)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  background: 'rgba(255,255,255,0.8)',
}));

export const OptionList = styled("ul")(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  margin: 0,
  listStyleType: "none",
  "& li": {
    padding: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
    "&:before": {
      content: '"▸"',
      color: colors.success,
      marginRight: theme.spacing(1),
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
  },
}));

export const FeatureBadge = styled(Typography)(({ theme }) => ({
  color: colors.success,
  fontWeight: 600,
  background: 'rgba(16, 185, 129, 0.1)',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  display: 'inline-block',
  margin: theme.spacing(0.25),
}));

export const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusColors = {
    pending: `linear-gradient(45deg, ${colors.warning}, ${colors.orange})`,
    completed: `linear-gradient(45deg, ${colors.success}, ${colors.teal})`,
    failed: `linear-gradient(45deg, ${colors.red}, #dc2626)`,
    default: `linear-gradient(45deg, ${colors.primary}, ${colors.info})`
  };

  return {
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontSize: "0.875rem",
    background: statusColors[status] || statusColors.default,
    color: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
    },
    transition: 'all 0.3s ease',
  };
});

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  borderBottom: `3px solid ${colors.primary}30`,
  paddingBottom: theme.spacing(1.5),
  fontSize: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const SummaryBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.purple}10 0%, ${colors.secondary}10 100%)`,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(3),
  border: `2px solid ${colors.purple}30`,
  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)',
}));

export const UpdateButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${colors.purple} 0%, ${colors.secondary} 100%)`,
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 6px 15px rgba(139, 92, 246, 0.4)',
  '&:hover': {
    background: `linear-gradient(45deg, ${colors.secondary} 0%, ${colors.purple} 100%)`,
    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.6)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: '#9ca3af',
    transform: 'none',
    boxShadow: 'none',
  },
  transition: 'all 0.3s ease',
}));

export const PrintButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${colors.orange} 0%, ${colors.warning} 100%)`,
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  padding: theme.spacing(2, 5),
  borderRadius: theme.shape.borderRadius * 4,
  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
  '&:hover': {
    background: `linear-gradient(45deg, ${colors.warning} 0%, ${colors.orange} 100%)`,
    boxShadow: '0 12px 25px rgba(245, 158, 11, 0.6)',
    transform: 'translateY(-3px)',
  },
  transition: 'all 0.3s ease',
}));