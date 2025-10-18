"use client"
// pages/index.js
import { Container, Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';

import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MapIcon from '@mui/icons-material/Map';
import ReactPlayer from 'react-player';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import {  Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function IndexPage  ()  {
    const [openVideoModal, setOpenVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleVideoClick = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setOpenVideoModal(true);
    };

    const handleCloseModal = () => {
        setOpenVideoModal(false);
        setSelectedVideo(null);
    };


    const dummyImages = [
        '/images/list2.jpg',
        '/images/list1.jpg',
  
        '/images/list2.jpg',
        '/images/list1.jpg',
         '/images/list2.jpg',
        '/images/list1.jpg',
     '/images/list2.jpg',
        '/images/list1.jpg',
     
       
    ];
    const amenities = [
        { id: 1, name: 'WiFi' },
        { id: 2, name: 'Parking' },
        { id: 3, name: 'Swimming Pool' },
        { id: 4, name: 'Gym' },
        { id: 5, name: 'Restaurant' },
        { id: 6, name: 'Bar' },
        { id: 7, name: 'Spa' },
        { id: 8, name: 'Conference Room' },
        { id: 9, name: 'Business Center' },
    ];
    const videos = [
        { id: 1, title: 'Dummy Video 1', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 2, title: 'Dummy Video 2', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 3, title: 'Dummy Video 3', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 4, title: 'Dummy Video 4', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 5, title: 'Dummy Video 5', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 6, title: 'Dummy Video 6', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 7, title: 'Dummy Video 7', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 8, title: 'Dummy Video 8', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
        { id: 9, title: 'Dummy Video 9', url: 'https://www.youtube.com/watch?v=OebBDuui1O0' },
    ];

    const openingHours = [
        { day: 'Sunday', hours: '6am - 9pm' },
        { day: 'Monday', hours: '6am - 9pm' },
        { day: 'Tuesday', hours: '6am - 9pm' },
        { day: 'Wednesday', hours: '6am - 9pm' },
        { day: 'Thursday', hours: '6am - 9pm' },
        { day: 'Friday', hours: '6am - 9pm' },
        { day: 'Saturday', hours: '6am - 9pm' },
    ];

    const listings = [
        {
            image: '/images/list2.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/list2.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/list2.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/list2.jpg',
            title: 'Box for date and comments: The date and comments are wrapped in a Box ',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/list2.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },

        // Add more listings as needed
    ];

    return (

        <Box sx={{
            margin: '0 auto',
            width: '80%',
            maxWidth: '1070px',
        }}>

        <Grid container spacing={3} style={{marginTop:"30px"}}  >
            {/* Left Side */}
            <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Avatar alt="User Photo" src="/images/list2.jpg" sx={{ width: 100, height: 100 }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">john deo</Typography>
                    
                    </Grid>
                 



                        <Grid item xs={12} container spacing={2}>
                            {/* Verified */}
                            <Grid item style={{ display: 'flex' }}>
                                <IconButton aria-label="Verified">
                                    <VerifiedUserIcon style={{ color: '#ff531a' }} />
                                </IconButton>
                                <Typography variant="body2" 
                                 sx={{marginTop:1}}
                                 
                                 >Verified</Typography>
                            </Grid>
                            {/* Add to Favorites */}
                            <Grid item style={{ display: 'flex' }}>
                                <IconButton aria-label="Add to Favorites">
                                    <FavoriteIcon style={{ color: '#ff531a' }} />
                                </IconButton>
                                <Typography variant="body2" sx={{ marginTop: 1 }}>Add to Favorites</Typography>
                            </Grid>
                            {/* Views */}
                            <Grid item style={{ display: 'flex' }}>
                                <IconButton aria-label="Add to Favorites">
                                    <VisibilityIcon style={{ color: '#ff531a' }} />
                                </IconButton>

                                <Typography variant="body2" sx={{ marginTop: 1 }}>
                                    100 views
                                </Typography>
                            </Grid>
                            <Grid item style={{ display: 'flex' }}>
                               

                                <Typography variant="body2" sx={{ marginTop: 1 }}>
                                   open
                                </Typography>
                            </Grid>

                        </Grid>


                 
                    <Grid item xs={12}>
                        <Typography variant="body1">
                        Description of user or item goes here.
                        
                                Grid Container and Items: Use nested Grid containers and items to organize and align content.
                                Flex Display: Wrap each pair of IconButton and Typography inside a Grid item with display: flex CSS style to align them horizontally.
                                Icons and Text: Use Material-UI icons (VerifiedUserIcon, FavoriteIcon, VisibilityIcon, MapIcon, YouTubeIcon) and placeholder FontAwesome icons (fab icons for Facebook, Twitter, Instagram).
                                State Management: Uses useState hook for managing state (openVideoModal)Grid Container and Items: Use nested Grid containers and items to organize and align content.
                                Flex Display: Wrap each pair of IconButton and Typography inside a Grid item with display: flex CSS style to align them horizontally.
                                Icons and Text: Use Material-UI icons (VerifiedUserIcon, FavoriteIcon, VisibilityIcon, MapIcon, YouTubeIcon) and placeholder FontAwesome icons (fab icons for Facebook, Twitter, Instagram).
State Management: Uses useState hook for managing state (openVideoModal) to handle opening a modal or navigating to a video. to handle opening a modal or navigating to a video.
                        
                        </Typography>
                    </Grid>
                    {/* Main Image */}



      




                        <Grid container spacing={2}>
                            {/* Images Section */}
                            {dummyImages.map((image, index) => (
                                <Grid item xs={4} key={index}>
                                    <img src={image} alt={`Image ${index + 1}`} style={{ width: '100%' }} />
                                </Grid>
                            ))}
                        </Grid>




                    {/* Amenities */}


                        <Grid item xs={12}>
                            <Typography variant="h6">Amenities:</Typography>
                            <Grid container spacing={2}>
                                {amenities.map((amenity) => (
                                    <Grid item xs={6} sm={4} key={amenity.id}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton aria-label={amenity.name} style={{ color: '#ff531a' }}>
                                                <MapIcon />
                                            </IconButton>
                                            <Typography variant="body2" style={{ backgroundColor: '#ff531a', color: '#fff', padding: '5px', borderRadius: '4px', marginLeft: '10px' }}>
                                                {amenity.name}
                                            </Typography>
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    
                    {/* Videos */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Videos:</Typography>
                                <Grid container spacing={2}>
                                    {videos.map((video) => (
                                        <Grid item xs={12} sm={4} key={video.id} style={{ position: 'relative' }}>
                                            <IconButton
                                                aria-label={video.title}
                                                onClick={() => handleVideoClick(video.url)}
                                                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                                            >
                                                <PlayArrowIcon style={{ color: '#fff', fontSize: 64 }} />
                                            </IconButton>
                                            <img src="/images/list2.jpg"    alt={video.title} style={{ width: '100%', display: 'block' }} />
                                            <Typography variant="body2" align="center">{video.title}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            <VideoModal open={openVideoModal} handleClose={handleCloseModal} videoUrl={selectedVideo} />
                        </Grid>
                    {/* Google Map */}



                    <Grid item xs={12}>
                        <IconButton aria-label="Google Map">
                            <MapIcon />
                        </IconButton>
                        <Typography variant="body2">View on Google Map</Typography>
                   
                            <Box sx={{ height: 200, border: '1px solid #ccc', marginTop: 2 }}>
                                <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="100%" frameBorder="0" style={{ border: 0 }} allowFullScreen aria-hidden="false" tabIndex="0"></iframe>

                            </Box>
                   
                   
                    </Grid>


                    
                    {/* Login to Review */}
                    <Grid item xs={12}>

                        <Typography variant="body1">Login to leave a review.</Typography>
                  
                  
                    </Grid>


                </Grid>
            </Grid>

            {/* Right Side */}




            <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                    {/* Contact Information */}


                    <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    marginTop: '10px', // Adjust spacing as needed
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Shadow effect
                                    padding: '10px',
                                    backgroundColor: '#fff', // Background color for social icons container
                                }}
                            >
                            <Typography variant="body2" sx={{ color: '#000' }}>
                                <strong><PhoneIcon style={{ color: '#ff531a' }} /></strong> +123456789<br />
                                <strong><EmailIcon style={{ color: '#ff531a' }} /> </strong> example@email.com<br />
                                <strong><LocationOnIcon style={{ color: '#ff531a' }} /> </strong> City, Country<br />
                                <strong><LanguageIcon style={{ color: '#ff531a' }} /> </strong> www.example.com
                            </Typography>
                            </Box>
                    </Grid>


                    {/* Social Icons */}


                    <Grid item xs={12}>


                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    marginTop: '10px', // Adjust spacing as needed
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Shadow effect
                                    padding: '10px',
                                    backgroundColor: '#fff', // Background color for social icons container
                                }}
                            >
                     
                            <div style={{ marginTop: '1px', display: 'flex', justifyContent: 'flex-start' }}>


                                <Facebook color="#ff531a" style={{ marginRight: '18px', color: "#ff531a" }} />


                                <Twitter color="#ff531a" style={{ marginRight: '18px', color: "#ff531a" }} />


                                <Instagram color="#ff531a" style={{ marginRight: '18px', color:"#ff531a" }} />

                            </div>
</Box>
                    </Grid>




                        {/* opening hourse*/}


                        <Grid item xs={12}>


                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        marginTop: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: '20px',
                                        backgroundColor: '#fff',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                        Opening Hours
                                    </Typography>
                                    {openingHours.map((entry, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                marginTop: '5px'
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {entry.day}
                                            </Typography>
                                            <Typography variant="body2">
                                                {entry.hours}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>


                        {/* send msage*/}


                        <Grid item xs={12}>


                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                  
                                        justifyContent: 'flex-start',
                                        marginTop: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: '10px',
                                        backgroundColor: '#fff',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                       send mesage
                                    </Typography>
                                   
                                    <Button
                                        variant="outlined"
                                        
                                        sx={{
                                            backgroundColor: '#ff531a',
                                            border: '#ff531a',
                                            color:"white",
                                            '&:hover': {
                                                backgroundColor: '#ff531a',
                                                border: '#ff531a',
                                            }}}>

send message

                                            </Button>


                                </Box>
                            </Grid>
                        </Grid>


                        {/* claim this listing*/}


                        <Grid item xs={12}>


                            <Grid item xs={12}>
                                <Box
                                    sx={{

                                        justifyContent: 'flex-start',
                                        marginTop: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: '10px',
                                        backgroundColor: '#fff',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                     claim this listing
                                    </Typography>

                                    <Button
                                        variant="outlined"

                                        sx={{
                                            backgroundColor: '#ff531a',
                                            border: '#ff531a',
                                            color: "white",
                                            '&:hover': {
                                                backgroundColor: '#ff531a',
                                                border: '#ff531a',
                                            }
                                        }}>

                                claim

                                    </Button>


                                </Box>
                            </Grid>
                        </Grid>


                        {/* similar listing*/}

                     
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: '10px',
                                        backgroundColor: '#fff',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                        Similar Listings
                                    </Typography>
                                    {listings.map((listing, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={listing.image}
                                                alt={listing.title}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    marginRight: '10px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px', // Ensure the image has a square shape
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {listing.title}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginTop: '5px',
                                                    }}
                                                >
                                                    <Typography variant="body2" color="textSecondary">
                                                        {listing.postedDate}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {listing.commentsCount} comm
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                    

                </Grid>
            </Grid>
        </Grid>

</Box>


    );
};




const VideoModal = ({ open, handleClose, videoUrl }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '100%', maxHeight: '100%', backgroundColor: '#ff531a', padding: '20px', borderRadius: '8px' }}>
                <IconButton aria-label="Close" style={{ position: 'absolute', top: '2px', right: '5px', color: '#fff' }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <ReactPlayer url={videoUrl} controls width="500px" height="500px" />
            </div>
        </Modal>
    );
};

