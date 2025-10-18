export const orderStyles = {
  // Container styles
  container: {
    p: 2,
    background: 'linear-gradient(135deg, #fff9e6 0%, #ffefc2 100%)',
    minHeight: '100vh',
  },
  
  // Header styles
  header: {
    background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    color: 'white',
    padding: 3,
    borderRadius: 2,
    marginBottom: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  
  // Table styles
  tableHeader: {
    background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    '& th': {
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      padding: '12px 16px',
    }
  },
  
  tableRow: {
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#fff9e6',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#fffef5',
    }
  },
  
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  
  // Status badge styles
  statusBadge: {
    px: 2,
    py: 1,
    borderRadius: '20px',
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  // Button styles
  primaryButton: {
    background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    color: '#fff',
    textTransform: 'none',
    fontWeight: 'bold',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '0.75rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #e6c200 0%, #c4951c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
    },
  },
  
  // Loading styles
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  
  // Empty state styles
  emptyState: {
    textAlign: 'center',
    padding: 4,
    color: '#64748b',
  },
  
  // Responsive styles
  responsiveTable: {
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  }
};