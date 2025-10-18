"use client"
// pages/contact.js
import React from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/system';
import MapIcon from '@mui/icons-material/Map';
import IconButton from '@mui/material/IconButton';


const ContactBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}));

const ContactIcon = styled(Box)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));


const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#ff531a', // Custom border color
        },
        '&:hover fieldset': {
            borderColor: '#ff531a', // Custom border color on hover
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ff531a', // Custom border color when focused
        },
    },
}));

export default function Contact() {
    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Contact Us
            </Typography>

            <ContactBox>
                <Grid item xs={1}>
                    <ContactIcon>
                        <PhoneIcon style={{ color: "#ff531a", }} />
                    </ContactIcon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="body1">(123) 456-7890</Typography>
                </Grid>
            </ContactBox>

            <ContactBox>
                <Grid item xs={1}>
                    <ContactIcon>
                        <LocationOnIcon style={{ color: "#ff531a", }} />
                    </ContactIcon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="body1">1234 Elm St, Some City, ST 56789</Typography>
                </Grid>
            </ContactBox>

            <ContactBox>
                <Grid item xs={1}>
                    <ContactIcon>
                        <EmailIcon style={{ color: "#ff531a", }}    />
                    </ContactIcon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="body1">contact@yourdomain.com</Typography>
                </Grid>
            </ContactBox>

            <Box component="form" noValidate autoComplete="off">
                <CustomTextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                />
                <Button 
                    sx={{

                        backgroundColor: '#ff531a',
                        color:"white",
                        '&:hover': {
                            backgroundColor: '#ff531a',
                            border: '#ff531a',
                        },}}
                
                variant="contained"  fullWidth>
                    Send
                </Button>
            </Box>

            <Grid item xs={12}>
                <IconButton aria-label="Google Map">
                    <MapIcon />
                </IconButton>
                <Typography variant="body2">View on Google Map</Typography>

                <Box sx={{ height: 200, border: '1px solid #ccc', marginTop: 2 }}>
                    <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="100%" frameBorder="0" style={{ border: 0 }} allowFullScreen aria-hidden="false" tabIndex="0"></iframe>

                </Box>


            </Grid>




        </Container>
    );
}
