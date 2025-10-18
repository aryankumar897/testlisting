// pages/privacy.js
import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Container>
            <Box my={4} sx={{
                margin: '0 auto',
                width: '80%',  // Set full width of the container
                maxWidth: '1070px',   }}    >
                <Typography variant="h2" component="h1" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    This is the privacy policy for our application. Please read it carefully to understand how we collect, use, and protect your personal information.
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Information We Collect
                </Typography>
                <Typography variant="body1" paragraph>
                    We collect various types of information in connection with the services we provide, including:
                </Typography>
                <ul>
                    <li>
                        <Typography variant="body1">Personal identification information (Name, email address, phone number, etc.)</Typography>
                    </li>
                    <li>
                        <Typography variant="body1">Usage data and log information (IP address, browser type, pages visited, etc.)</Typography>
                    </li>
                    <li>
                        <Typography variant="body1">Cookies and tracking technologies</Typography>
                    </li>
                </ul>
                <Typography variant="h4" component="h2" gutterBottom>
                    How We Use Information
                </Typography>
                <Typography variant="body1" paragraph>
                    We use the collected information for various purposes, such as:
                </Typography>
                <ul>
                    <li>
                        <Typography variant="body1">Providing and maintaining our service</Typography>
                    </li>
                    <li>
                        <Typography variant="body1">Improving our service</Typography>
                    </li>
                    <li>
                        <Typography variant="body1">Communicating with you</Typography>
                    </li>
                    <li>
                        <Typography variant="body1">Analyzing usage patterns</Typography>
                    </li>
                </ul>
                <Typography variant="h4" component="h2" gutterBottom>
                    Data Protection
                </Typography>
                <Typography variant="body1" paragraph>
                    We prioritize the security of your data and use industry-standard measures to protect it.
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Changes to This Privacy Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </Typography>
                <Typography variant="body1" paragraph>
                    This Privacy Policy was last updated on [Date].
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
                </Typography>
            </Box>
        </Container>
    );
};

export default PrivacyPolicy;
