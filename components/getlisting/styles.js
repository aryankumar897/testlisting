// styles.js
export const styles = {
  container: {
    margin: '0 auto',
    width: '80%',
    maxWidth: '1070px',
  },
  leftSideContainer: {
    backgroundColor: 'white', 
    padding: 3, 
    borderRadius: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  },
  socialIconsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    backgroundColor: '#fff',
  },
  infoBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  button: {
    backgroundColor: '#ff531a',
    border: '#ff531a',
    color: "white",
    '&:hover': {
      backgroundColor: '#ff531a',
      border: '#ff531a',
    }
  },
  listingItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  listingImage: {
    width: 80,
    height: 80,
    marginRight: '10px',
    objectFit: 'cover',
    borderRadius: '4px',
  }
};