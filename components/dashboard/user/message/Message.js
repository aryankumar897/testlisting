"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Badge,
  Chip,
  CircularProgress,
  Alert,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

const getListingImage = (listing) => listing?.image || listing?.thumbnail_image || "/default-listing.jpg";
const getUserAvatar = (user) => user?.image || "https://i.pravatar.cc/150?img=3";
import styles from "./style"

export default function UserChat() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [messages, setMessages] = useState([]);
  const [listingsWithMessages, setListingsWithMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeListing, setActiveListing] = useState(null);
  const [activeReceiver, setActiveReceiver] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);
  const isTypingSentRef = useRef(false);
  const lastTypingSentAtRef = useRef(0);
  const pusherRef = useRef(null);
  const channelRef = useRef(null);

  const activeListingRef = useRef(activeListing);
  const activeReceiverRef = useRef(activeReceiver);
  const sessionRef = useRef(session);

  useEffect(() => { activeListingRef.current = activeListing; }, [activeListing]);
  useEffect(() => { activeReceiverRef.current = activeReceiver; }, [activeReceiver]);
  useEffect(() => { sessionRef.current = session; }, [session]);

  // Auto-close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && activeListing) {
      setSidebarOpen(false);
    }
  }, [activeListing, isMobile]);

  // Auto-open sidebar when switching to mobile and no active listing
  useEffect(() => {
    if (isMobile && !activeListing) {
      setSidebarOpen(true);
    }
  }, [isMobile, activeListing]);

  const TYPING_IDLE_MS = 5500;

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Fetch listings with messages
  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated") return;
      setLoading(true); setError(null);
      try {
        const response = await fetch(`${process.env.API}/user/messages`);
        if (!response.ok) throw new Error("Failed to fetch listings with messages");
        const { listings, unreadCounts } = await response.json();
        setListingsWithMessages(listings || []);
        setUnreadCounts(unreadCounts || {});
        if (listings && listings.length > 0) {
          const firstListing = listings[0];
          setActiveListing(firstListing);
          const receiver = getOtherUser(firstListing);
          setActiveReceiver(receiver);
          markMessagesAsRead(firstListing._id, receiver?._id);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const getOtherUser = (listing) => {
    if (!listing || !session?.user?._id) return null;
    return listing.last_message_sender_id === session.user._id ? listing.other_user : listing.other_user || listing.owner;
  };

  // Fetch messages for active listing
  useEffect(() => {
    if (!activeListing || !activeReceiver || !session?.user?._id) return;
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${process.env.API}/chats?sender_id=${session.user._id}&receiver_id=${activeReceiver._id}&listing_id=${activeListing._id}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const messagesData = await response.json();
        setMessages(messagesData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeListing, activeReceiver, session?.user?._id]);

  // Pusher subscription
  useEffect(() => {
    if (!session || status !== "authenticated") return;

    const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.KEY;
    const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.CLUSTER;

    pusherRef.current = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER, forceTLS: true });
    channelRef.current = pusherRef.current.subscribe("chat-channel");

    const handleNewMessage = (data) => {
      const { message } = data;
      if (!message) return;

      const msgListingId = message.listing_id?._id || message.listing_id || message.listingId;
      const msgSenderId = message.sender_id?._id || message.sender_id || message.senderId;
      const msgReceiverId = message.receiver_id?._id || message.receiver_id || message.receiverId;

      setListingsWithMessages((prev) => {
        const copy = Array.isArray(prev) ? [...prev] : [];
        const idx = copy.findIndex((l) => l._id === msgListingId);
        if (idx !== -1) {
          const found = { ...copy[idx], last_message: message.message, last_message_sender_id: msgSenderId, updatedAt: message.createdAt || Date.now() };
          copy.splice(idx, 1);
          return [found, ...copy];
        } else {
          const newListing = {
            _id: msgListingId,
            title: message.listing_id?.title || "Listing",
            image: message.listing_id?.image || null,
            price: message.listing_id?.price || null,
            last_message: message.message,
            last_message_sender_id: msgSenderId,
            other_user: message.sender_id?._id === sessionRef.current?.user?._id ? message.receiver_id : message.sender_id,
          };
          return [newListing, ...copy];
        }
      });

      if (activeListingRef.current && msgListingId === activeListingRef.current._id) {
        setMessages((prev) => {
          if (prev.some((m) => (m._id && message._id && m._id === message._id))) return prev;
          return [...prev, message];
        });

        if (msgReceiverId === sessionRef.current?.user?._id && msgSenderId !== sessionRef.current?.user?._id) {
          markMessagesAsRead(msgListingId, msgSenderId);
        }
      } else {
        if (msgReceiverId === sessionRef.current?.user?._id) {
          setUnreadCounts((prev) => ({ ...prev, [msgListingId]: (prev[msgListingId] || 0) + 1 }));
        }
      }
    };

    const handleTyping = (data) => {
      const userId = data.userId || data.user_id || data.senderId || data.sender_id;
      const receiverId = data.receiverId || data.receiver_id;
      const listingId = data.listingId || data.listing_id;
      const isTypingEvent = data.isTyping === true || data.is_typing === true || data.isTyping === "true";

      if (
        activeListingRef.current &&
        activeReceiverRef.current &&
        userId === activeReceiverRef.current._id &&
        receiverId === sessionRef.current?.user?._id &&
        listingId === activeListingRef.current._id
      ) {
        if (isTypingEvent) {
          setIsTyping(true);
          setTypingUser(data.userName || data.user_name || null);
          clearTimeout(typingStopTimeoutRef.current);
          typingStopTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTypingUser(null);
          }, TYPING_IDLE_MS);
        } else {
          setIsTyping(false);
          setTypingUser(null);
        }
      }
    };

    channelRef.current.bind("new-message", handleNewMessage);
    channelRef.current.bind("typing", handleTyping);

    return () => {
      try {
        if (channelRef.current) {
          channelRef.current.unbind("new-message", handleNewMessage);
          channelRef.current.unbind("typing", handleTyping);
          pusherRef.current.unsubscribe("chat-channel");
        }
        if (pusherRef.current) {
          pusherRef.current.disconnect();
        }
      } catch (err) {
        console.warn("Pusher cleanup error:", err);
      }
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingStopTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const markMessagesAsRead = async (listingId, senderId) => {
    try {
      await fetch(`${process.env.API}/chats/mark-as-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, sender_id: senderId, receiver_id: session.user._id }),
      });
      setUnreadCounts((prev) => ({ ...prev, [listingId]: 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleListingClick = (listing) => {
    setActiveListing(listing);
    const receiver = getOtherUser(listing);
    setActiveReceiver(receiver);
    if (receiver) markMessagesAsRead(listing._id, receiver._id);
    
    isTypingSentRef.current = false;
    clearTimeout(typingTimeoutRef.current);
    clearTimeout(typingStopTimeoutRef.current);
    setIsTyping(false);
    setTypingUser(null);
  };

  const sendTypingIndicator = async (isTyping) => {
    if (!activeListing || !activeReceiver || !session) return;
    try {
      await fetch(`${process.env.API}/user/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user._id,
          receiverId: activeReceiver._id,
          listingId: activeListing._id,
          isTyping,
        }),
      });
      if (!isTyping) isTypingSentRef.current = false;
      else isTypingSentRef.current = true;
    } catch (err) {
      console.error("Error sending typing notification:", err);
      if (!isTyping) isTypingSentRef.current = false;
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeListing || !activeReceiver) return;
    try {
      const messageData = { receiver_id: activeReceiver._id, listing_id: activeListing._id, message: newMessage, sender_id: session.user._id };
      const response = await fetch(`${process.env.API}/user/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      await sendTypingIndicator(false);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const debouncedTyping = useCallback(() => {
    if (!activeListing || !activeReceiver || !session) return;
    const now = Date.now();
    if (!isTypingSentRef.current) {
      sendTypingIndicator(true).catch(console.error);
      isTypingSentRef.current = true;
      lastTypingSentAtRef.current = now;
    } else {
      if (now - lastTypingSentAtRef.current > 2000) {
        sendTypingIndicator(true).catch(console.error);
        lastTypingSentAtRef.current = now;
      }
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false).catch(console.error);
      isTypingSentRef.current = false;
    }, TYPING_IDLE_MS);
  }, [activeListing, activeReceiver, session]);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
    debouncedTyping();
  };

  useEffect(() => {
    return () => {
      if (activeListing && activeReceiver && session) {
        sendTypingIndicator(false).catch(console.error);
        isTypingSentRef.current = false;
      }
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingStopTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeListing, activeReceiver, session]);

  useEffect(() => {
    if (newMessage.trim() === "") {
      sendTypingIndicator(false).catch(console.error);
      isTypingSentRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage]);

  const getLastMessagePreview = (listing) => listing.last_message || "No messages yet";
  const getOtherUserName = (listing) => {
    const otherUser = getOtherUser(listing);
    return otherUser?.name || "Unknown User";
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarContent = (
    <Box sx={styles.sidebar}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={styles.title}>
          Your Listings {loading && <CircularProgress size={16} sx={{ ml: 1 }} />}
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleSidebar} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

      <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        {listingsWithMessages.map((listing) => (
          <ListItem
            key={listing._id}
            sx={{
              ...styles.userItem,
              ...(activeListing?._id === listing._id && { backgroundColor: "primary.light", borderLeft: "3px solid", borderColor: "primary.main" }),
            }}
            onClick={() => handleListingClick(listing)}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                unreadCounts[listing._id] > 0 ? (
                  <Box sx={{ backgroundColor: "primary.main", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
                    {unreadCounts[listing._id]}
                  </Box>
                ) : null
              }
            >
              <Avatar sx={{ width: 50, height: 50, borderRadius: 2 }} src={getListingImage(listing)} variant="rounded" />
            </Badge>

            <Box sx={{ flex: 1, ml: 2, minWidth: 0 }}>
              <Typography fontWeight="600" noWrap sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>{listing.title}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Chat with {getOtherUserName(listing)}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>{getLastMessagePreview(listing)}</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                {listing.price && <Chip label={`$${listing.price}`} size="small" sx={{ height: "20px", fontSize: '0.7rem' }} color="primary" variant="outlined" />}
                {listing.is_verified && <Chip label="Verified" size="small" sx={{ height: "20px", fontSize: '0.7rem' }} color="success" />}
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      {!loading && listingsWithMessages.length === 0 && !error && (
        <Typography sx={{ p: 2, textAlign: "center", color: "text.secondary", fontSize: { xs: '0.9rem', md: '1rem' } }}>No conversations yet</Typography>
      )}
    </Box>
  );

  return (
    <Box sx={styles.container}>
      {/* Mobile Sidebar Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={toggleSidebar}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '85%',
              maxWidth: '400px',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        sidebarContent
      )}

      {/* Main Chat Area */}
      <Box sx={styles.chatWindow}>
        {activeListing && activeReceiver ? (
          <>
            {/* Chat Header */}
            <Box sx={{ 
              p: { xs: 1, md: 2 }, 
              borderBottom: 1, 
              borderColor: "divider", 
              display: "flex", 
              alignItems: "center", 
              backgroundColor: "background.paper",
              minHeight: '72px'
            }}>
              {isMobile && (
                <IconButton onClick={toggleSidebar} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Avatar src={getListingImage(activeListing)} sx={{ width: { xs: 50, md: 60 }, height: { xs: 50, md: 60 }, borderRadius: 2, mr: 2 }} variant="rounded" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight="600" noWrap sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{activeListing.title}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Chat with {activeReceiver.name}{activeListing.price && <span> • ${activeListing.price}</span>}
                </Typography>
                {activeListing.address && (
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                    {activeListing.address}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={styles.messageList}>
              {messages.filter((msg) => !activeListing || msg.listing_id === activeListing._id || msg.listing_id?._id === activeListing._id).map((msg) => {
                const senderId = msg.sender_id?._id || msg.sender_id;
                const isUser = senderId === session.user._id;
                return (
                  <Box key={msg._id || `${msg.createdAt}-${Math.random()}`} sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 1, px: { xs: 1, md: 2 } }}>
                    {!isUser && <Avatar src={getUserAvatar(activeReceiver)} sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 }, display: { xs: 'none', sm: 'flex' } }} />}
                    <Box sx={{ 
                      ...(isUser ? styles.userMessage : styles.otherMessage),
                      maxWidth: { xs: '85%', md: '70%' },
                      padding: { xs: '8px 12px', md: '12px 16px' }
                    }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, wordBreak: 'break-word' }}>
                        {msg.message}
                      </Typography>
                      <Typography sx={{ 
                        ...styles.messageTime, 
                        fontSize: { xs: '0.65rem', md: '0.7rem' } 
                      }}>
                        {new Date(msg.createdAt || msg.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </Box>
                    {isUser && <Avatar src={getUserAvatar(session.user)} sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 }, display: { xs: 'none', sm: 'flex' } }} />}
                  </Box>
                );
              })}

              {isTyping && (
                <Box sx={styles.typingIndicator}>
                  <Typography variant="caption" sx={{ mr: 1, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                    {typingUser ? `${typingUser.split(" ")[0]} is typing` : "is typing"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "primary.main", animation: "pulse 1.5s infinite" }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "primary.main", animation: "pulse 1.5s infinite 0.2s" }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "primary.main", animation: "pulse 1.5s infinite 0.4s" }} />
                  </Box>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={styles.inputBox}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Type a message..." 
                value={newMessage} 
                onChange={handleChange} 
                onKeyPress={handleKeyPress} 
                sx={styles.inputField} 
                multiline 
                maxRows={4}
              />
              <IconButton color="primary" sx={styles.sendButton} onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: 2, p: 2 }}>
            {isMobile ? (
              <IconButton onClick={toggleSidebar} sx={{ mb: 2 }}>
                <MenuIcon fontSize="large" />
              </IconButton>
            ) : null}
            <Typography variant="h6" color="text.secondary" align="center" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              {listingsWithMessages.length === 0 ? "No conversations yet" : "Select a listing to start chatting"}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              {listingsWithMessages.length === 0 ? "Your listing conversations will appear here" : "Choose a listing from the sidebar to view messages"}
            </Typography>
            {isMobile && listingsWithMessages.length > 0 && (
              <Typography variant="body2" color="primary" align="center" sx={{ mt: 2 }}>
                Tap the menu icon to view your conversations
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}