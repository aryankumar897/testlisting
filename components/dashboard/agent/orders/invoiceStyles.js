export const invoiceStyles = {
  // Container styles
  container: {
    background: 'linear-gradient(135deg, #fff9e6 0%, #ffefc2 100%)',
    padding: 3,
    borderRadius: '16px',
  },
  
  // Header styles
  header: {
    background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    color: 'white',
    padding: 3,
    borderRadius: '12px',
    marginBottom: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  
  // Card styles
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: 3,
    marginBottom: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #fff9e6',
  },
  
  // Info section styles
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 3,
  },
  
  infoBlock: {
    flex: 1,
    minWidth: '250px',
  },
  
  // Table styles
  tableHeader: {
    background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    '& th': {
      color: 'white',
      fontWeight: 'bold',
      padding: '16px',
      fontSize: '0.9rem',
    }
  },
  
  tableRow: {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#fff9e6',
    },
  },
  
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  
  // Feature list styles
  featureList: {
    margin: 0,
    paddingLeft: 2,
    '& li': {
      marginBottom: 1,
      paddingLeft: 1,
    }
  },
  
  // Highlight text
  highlightText: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  
  // Total row styles
  totalRow: {
    backgroundColor: '#fff9e6',
    '& td': {
      fontWeight: 'bold',
      fontSize: '1rem',
      padding: '20px 16px',
    }
  },
  
  // Button styles
  printButton: {
    background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    color: '#fff',
    textTransform: 'none',
    fontWeight: 'bold',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #e6c200 0%, #c4951c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
    },
  },
  
  // Status badge styles
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }
};