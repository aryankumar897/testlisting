"use client"

import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    Grid,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';

const CustomFormControl = styled(FormControl)`
    max-height: 300px;
    overflow-y: auto;

    /* Hide scrollbar for WebKit-based browsers (Chrome, Safari) */
    &::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for Firefox */
    scrollbar-width: none;

    /* Hide scrollbar for IE, Edge */
    -ms-overflow-style: none;
`;

export default function FilterComponent() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [keyword, setKeyword] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [categories, setCategories] = useState([
        { label: 'Category 1', checked: false },
        { label: 'Category 2', checked: false },
        { label: 'Category 3', checked: false },
        { label: 'Category 4', checked: false },
        { label: 'Category 5', checked: false },
        { label: 'Category 6', checked: false },
        { label: 'Category 7', checked: false },
        { label: 'Category 8', checked: false },
    ]);

    const handleKeywordChange = (event) => {
        setKeyword(event.target.value);
    };

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    const handleCategoryChange = (index) => (event) => {
        const newCategories = [...categories];
        newCategories[index].checked = event.target.checked;
        setCategories(newCategories);
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('Submitting form with:', {
            keyword,
            selectedTag,
            selectedLocation,
            categories: categories.filter(cat => cat.checked).map(cat => cat.label)
        });
        // Add your logic to use these values, e.g., fetching data or updating state
    };

    return (
        <Box
            sx={{
                padding: 2,
                boxShadow: 2,
                borderRadius: 2,
                width: isSmallScreen ? '100%' : '250px',
                margin: isSmallScreen ? '0 auto' : 'inherit',
                 backgroundColor: "#fff", height: "auto" 
      
            }}
        >
            <Typography variant="h6">Filters</Typography>

            {/* Search keyword */}
            <TextField



                label="Search Keyword"
                variant="outlined"
                fullWidth
                value={keyword}
                onChange={handleKeywordChange}
         
                sx={{
                    marginTop: 2,
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
                }}
            />

            {/* Select tag */}
            <FormControl
            
            
             variant="outlined" fullWidth 
                sx={{
                    marginTop: 2,
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
                }}
             
       
             >
                <InputLabel 
                   
                
                  >Select Tag</InputLabel>
                <Select
                    value={selectedTag}
                    onChange={handleTagChange}
                    label="Select Tag"
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="tag1">Tag 1</MenuItem>
                    <MenuItem value="tag2">Tag 2</MenuItem>
                    <MenuItem value="tag3">Tag 3</MenuItem>
                </Select>
            </FormControl>

            {/* Select location */}
            <FormControl
                sx={{
                    marginTop: 2,
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
                }}

            
             variant="outlined" fullWidth >
                <InputLabel  >Select Location</InputLabel>
                <Select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    label="Select Location"
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="location1">Location 1</MenuItem>
                    <MenuItem value="location2">Location 2</MenuItem>
                    <MenuItem value="location3">Location 3</MenuItem>
                </Select>
            </FormControl>

            {/* Category checkboxes */}
            <CustomFormControl component="fieldset" sx={{ marginTop: 2 }}>
                <Typography variant="subtitle1">Category</Typography>
                {categories.map((category, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                sx={{
                                    color: '#ff531a',
                                    '&.Mui-checked': {
                                        color: '#ff531a',
                                    },
                                }}
                                checked={category.checked}
                                onChange={handleCategoryChange(index)}
                            />
                        }
                        label={category.label}
                    />
                ))}
            </CustomFormControl>

            {/* Submit button */}
            <Button
             
               
                fullWidth
                sx={{ marginTop: 2, 

                 
                    borderColor: '#ff531a',
                    '&:hover': {
                        borderColor: '#ff531a',
                    },
                
                    '&:hover': {
                        backgroundColor: '#ff531a',
                        border: '#ff531a',
                        color :"white"
                    },
                
                }}
                onClick={handleSubmit}
                variant="outlined"
              

            >
                Use Filter
            </Button>
        </Box>
    );
}
