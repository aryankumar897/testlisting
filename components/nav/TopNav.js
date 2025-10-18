"use client"

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";


export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const redirectBasedOnRole = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'user':
        router.push('/dashboard/user');
        break;


         case 'agent':
        router.push('/dashboard/agent');
        break;
      default:
        router.push('/');
        break;
    }
  };

  const handleAvatarClick = () => {
    if (session) {
      redirectBasedOnRole(session.user.role);
    }
  };

  const handleButtonClick = () => {
    if (session) {
      redirectBasedOnRole(session.user.role);
    } else {
      router.push('/login');
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff9a00' }}>
          <Toolbar sx={{ justifyContent: 'space-evenly' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconButton color="inherit">
                <PhoneIcon />
              </IconButton>
              <Typography variant="body1" noWrap>
                +1234567890
              </Typography>
              <IconButton color="inherit">
                <AlternateEmailIcon />
              </IconButton>
              <Typography variant="body1" noWrap>
                test@gmail.com
              </Typography>
            </Typography>

            <Box sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Button
                variant="outlined"
                color="inherit"
                disabled
                startIcon={<PersonPinIcon />}
              >
                Loading...
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#ff9a00' }}>
        <Toolbar sx={{ justifyContent: 'space-evenly' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton color="inherit">
              <PhoneIcon />
            </IconButton>
            <Typography variant="body1" noWrap>
              +1234567890
            </Typography>
            <IconButton color="inherit">
              <AlternateEmailIcon />
            </IconButton>
            <Typography variant="body1" noWrap>
              test@gmail.com
            </Typography>
          </Typography>

          <Box sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1
          }}>
            {session ? (
              <>
                <Avatar
                  src={session.user?.image || ''}
                  alt={session.user?.name || 'User'}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={handleAvatarClick}
                />
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleButtonClick}
                  startIcon={<PersonPinIcon />}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleButtonClick}
                startIcon={<PersonPinIcon />}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}