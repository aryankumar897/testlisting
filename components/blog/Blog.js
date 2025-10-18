import React from 'react';
import Head from 'next/head';
import { Box, Grid, Container, Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';

const HomePage = () => {
    // Dummy data for blog posts
    const posts = [
        {
            id: 1,
            title: 'Sample Blog Post 1',
            image: '/images/list2.jpg',
            categories: ['Technology', 'Next.js'],
            date: '2024-06-21',
            user: {
                name: 'John Doe',
                icon: '/images/list2.jpg'
            },
            description: 'This is the content of Sample Blog Post 1. You can add more details here.',
        },
        {
            id: 2,
            title: 'Sample Blog Post 2',
            image: '/images/list2.jpg',
            categories: ['Design', 'UI/UX'],
            date: '2024-06-20',
            user: {
                name: 'Jane Smith',
                icon: '/images/list2.jpg'
            },
            description: 'This is the content of Sample Blog Post 2. You can add more details here.',
        },
        {
            id: 3,
            title: 'Sample Blog Post 3',
            image: '/images/list2.jpg',
            categories: ['Design', 'UI/UX'],
            date: '2024-06-20',
            user: {
                name: 'Michael Johnson',
                icon: '/images/list2.jpg'
            },
            description: 'This is the content of Sample Blog Post 3. You can add more details here.',
        },
        // Add more posts as needed
    ];

    return (
        <Box sx={{
            margin: '0 auto',
            width: '80%',  // Set full width of the container
            maxWidth: '1070px',
        }}>

            <Box textAlign="center" mt={14}>

                <Typography variant="h4" gutterBottom>
                    Our Blog
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Adjust the styles and properties to fit your specific components from Material-UI.
                </Typography>

            </Box>

            <Container sx={{ marginTop: "20px" }}>
                <Grid container spacing={3}>
                    {posts.map(post => (
                        <Grid item key={post.id} xs={12} sm={6} md={4}>
                            <Card sx={{ margin: '2px' }}>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={post.image}
                                    alt={post.title}
                                    sx={{
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                    }}
                                />
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                       
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                          {new Date(post.date).toLocaleDateString()}
                                        </Typography>
                                        {/* <img src={post.user.icon} alt={post.user.name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} /> */}
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 5 ,mt:1}}>
                                            {post.user.name}
                                        </Typography>
                                    </Box>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {post.title}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {post.description}
                                    </Typography>
                                   
                                </CardContent>
                                <CardActions>
                                    <Button 
                                    
                                        sx={{
                                          
                                            color: "#ff531a",
                                            
                                        }}

                                    size="small"
                                    
                                    
                                    >Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
