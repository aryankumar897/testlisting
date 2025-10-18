// dashboardStyles.js
const dashboardStyles = {
  // Main container styles
  container: {
    flexGrow: 1,
    padding: { xs: 1, sm: 2, md: 3 },
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },

  // Header styles
  header: {
    mb: 4,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: 2
  },

  sectionTitle: {
    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    mb: 3
  },

  // Stats card styles
  statsGrid: {
    mb: 4
  },

  statCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    borderRadius: 3,
    padding: { xs: 1.5, sm: 2, md: 3 },
    textAlign: 'center',
    minHeight: { xs: 80, sm: 100, md: 120 },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
    }
  },

  statCount: {
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
    fontWeight: 'bold',
    color: 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },

  statTitle: {
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    color: 'white',
    opacity: 0.9,
    mt: 1
  },

  // Two-column table styles
  twoColumnTable: {
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    mb: 4,
    backgroundColor: 'white'
  },

  tableRow: {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    '&:last-child': {
      borderBottom: 'none'
    },
    '&:hover': {
      backgroundColor: '#f8fafc'
    }
  },

  tableHeader: {
    flex: 1,
    padding: { xs: 1, sm: 1.5, md: 2 },
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
    fontSize: { xs: '0.875rem', sm: '1rem' },
    color: '#334155',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center'
  },

  tableValue: {
    flex: 2,
    padding: { xs: 1, sm: 1.5, md: 2 },
    fontSize: { xs: '0.875rem', sm: '1rem' },
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 1
  },

  // Subscription card styles for mobile
  subscriptionCard: {
    mb: 3,
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    backgroundColor: 'white'
  },

  cardHeader: {
    background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
    color: 'white',
    padding: { xs: 2, sm: 2.5 },
    textAlign: 'center'
  },

  cardTitle: {
    fontSize: { xs: '1.125rem', sm: '1.25rem' },
    fontWeight: 'bold',
    mb: 0.5
  },

  cardSubtitle: {
    fontSize: { xs: '0.875rem', sm: '1rem' },
    opacity: 0.9
  },

  cardContent: {
    padding: 0
  },

  // Chip styles
  chip: {
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    height: { xs: 24, sm: 28 },
    fontWeight: 'medium'
  },

  chipPaid: {
    backgroundColor: '#2196F3',
    color: 'white'
  },

  chipActive: {
    backgroundColor: '#4caf50',
    color: 'white'
  },

  chipInactive: {
    backgroundColor: '#9e9e9e',
    color: 'white'
  },

  chipSuccess: {
    backgroundColor: '#4caf50',
    color: 'white'
  },

  chipWarning: {
    backgroundColor: '#ff9800',
    color: 'white'
  },

  // Empty state styles
  emptyState: {
    p: 4,
    backgroundColor: 'white',
    borderRadius: 3,
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },

  emptyStateIcon: {
    fontSize: '4rem',
    color: '#cbd5e1',
    mb: 2
  },

  // Summary section styles
  summarySection: {
    mt: 4,
    p: { xs: 2, sm: 3 },
    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },

  summaryGrid: {
    mt: 2
  },

  summaryItem: {
    textAlign: 'center',
    p: 2
  },

  summaryLabel: {
    fontSize: { xs: '0.875rem', sm: '1rem' },
    color: '#64748b',
    mb: 1
  },

  summaryValue: {
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
    fontWeight: 'bold',
    color: '#1e293b'
  },

  // Loading styles
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    flexDirection: 'column',
    gap: 2
  },

  loadingSpinner: {
    color: '#2196F3'
  },

  // Error styles
  errorContainer: {
    p: 3,
    backgroundColor: '#ffebee',
    borderRadius: 2,
    textAlign: 'center',
    border: '1px solid #f44336'
  },

  // Price styles
  priceText: {
    fontWeight: 'bold',
    color: '#2196F3',
    fontSize: { xs: '1rem', sm: '1.125rem' }
  },

  // Unlimited badge
  unlimitedBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  }
};

export default dashboardStyles;