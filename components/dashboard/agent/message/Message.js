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
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

const getListingImage = (listing) => listing?.image || listing?.thumbnail_image || "/default-listing.jpg";
const getUserAvatar = (user) => user?.image || "https://i.pravatar.cc/150?img=3";
import styles from "./style";

export default function AgentChat() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [messages, setMessages] = useState([]);
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [activeListing, setActiveListing] = useState(null);
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

  // refs so pusher handlers read latest values
  const activeUserRef = useRef(activeUser);
  const activeListingRef = useRef(activeListing);
  const sessionRef = useRef(session);
  useEffect(() => { activeUserRef.current = activeUser; }, [activeUser]);
  useEffect(() => { activeListingRef.current = activeListing; }, [activeListing]);
  useEffect(() => { sessionRef.current = session; }, [session]);

  const TYPING_IDLE_MS = 5500;

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Auto-close sidebar on mobile when user is selected
  useEffect(() => {
    if (isMobile && activeUser) {
      setSidebarOpen(false);
    }
  }, [activeUser, isMobile]);

  // Fetch users (sidebar) + unread counts
  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated") return;
      setLoading(true); setError(null);
      try {
        const response = await fetch(`${process.env.API}/agent/test`);
        if (!response.ok) throw new Error("Failed to fetch users with messages");
        const { users, unreadCounts } = await response.json();
        setUsersWithMessages(users || []);
        setUnreadCounts(unreadCounts || {});
        if (users && users.length > 0) {
          const firstUser = users[0];
          setActiveUser(firstUser);
          setActiveListing(firstUser.last_listing || null);
          markMessagesAsRead(firstUser._id);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  // Fetch messages for active user/listing
  useEffect(() => {
    if (!activeUser) return;
    const fetchMessages = async () => {
      try {
        const url = `${process.env.API}/agent/conversation?receiver_id=${activeUser._id}${ activeListing ? `&listing_id=${activeListing._id}` : "" }`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const messagesData = await response.json();
        setMessages(messagesData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeUser, activeListing]);

  // Pusher - single stable subscription
  useEffect(() => {
    if (!session || status !== "authenticated") return;

    const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.KEY;
    const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.CLUSTER;

    pusherRef.current = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER, forceTLS: true });
    channelRef.current = pusherRef.current.subscribe("agent-chat-channel");

    const handleNewMessage = (data) => {
      const { message } = data;
      if (!message) return;

      const msgListingId = message.listing_id?._id || message.listing_id || message.listingId;
      const msgSenderId = message.sender_id?._id || message.sender_id || message.senderId;
      const msgReceiverId = message.receiver_id?._id || message.receiver_id || message.receiverId;

      setUsersWithMessages((prev) => {
        const arr = Array.isArray(prev) ? [...prev] : [];
        const idx = arr.findIndex((u) => u._id === (message.sender_id?._id || message.sender_id) || u._id === (message.receiver_id?._id || message.receiver_id));
        if (idx !== -1) {
          const found = { ...arr[idx], last_message: message.message, last_listing: message.listing_id || arr[idx].last_listing, updatedAt: message.createdAt || Date.now() };
          arr.splice(idx, 1);
          return [found, ...arr];
        } else {
          const otherUser = msgSenderId === sessionRef.current?.user?._id ? message.receiver_id : message.sender_id;
          const newUser = {
            _id: otherUser?._id || otherUser,
            name: otherUser?.name || "User",
            last_message: message.message,
            last_listing: message.listing_id || null,
          };
          return [newUser, ...arr];
        }
      });

      if (activeUserRef.current && (msgSenderId === activeUserRef.current._id || msgReceiverId === activeUserRef.current._id) &&
          (msgListingId === undefined || !activeListingRef.current || msgListingId === activeListingRef.current._id)) {
        setMessages((prev) => {
          if (message._id && prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });

        if (msgReceiverId === sessionRef.current?.user?._id && msgSenderId !== sessionRef.current?.user?._id) {
          markMessagesAsRead(msgSenderId);
        }
      } else {
        if (msgReceiverId === sessionRef.current?.user?._id) {
          const senderKey = msgSenderId || (message.sender_id?._id || message.sender_id);
          setUnreadCounts((prev) => ({ ...prev, [senderKey]: (prev[senderKey] || 0) + 1 }));
        }
      }
    };

    const handleTyping = (data) => {
      const userId = data.userId || data.user_id || data.senderId || data.sender_id;
      const receiverId = data.receiverId || data.receiver_id;
      const listingId = data.listingId || data.listing_id;
      const isTypingEvent = data.isTyping === true || data.is_typing === true || data.isTyping === "true";

      if (
        activeUserRef.current &&
        userId === activeUserRef.current._id &&
        receiverId === sessionRef.current?.user?._id &&
        (listingId === undefined || !activeListingRef.current || listingId === activeListingRef.current._id)
      ) {
        if (isTypingEvent) {
          setIsTyping(true);
          setTypingUser(data.userName || data.user_name || activeUserRef.current?.name || null);
          clearTimeout(typingStopTimeoutRef.current);
          typingStopTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTypingUser(null);
          }, Math.max(TYPING_IDLE_MS, 2000));
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
          pusherRef.current.unsubscribe("agent-chat-channel");
        }
        if (pusherRef.current) pusherRef.current.disconnect();
      } catch (err) {
        console.warn("Pusher cleanup error:", err);
      }
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingStopTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const markMessagesAsRead = async (userId) => {
    try {
      const response = await fetch(`${process.env.API}/agent/markasread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: userId, receiver_id: session.user._id }),
      });
      if (!response.ok) throw new Error("Failed to mark messages as read");
      setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  const sendTypingIndicator = async (isTyping) => {
    if (!activeUser || !session) return;
    try {
      await fetch(`${process.env.API}/agent/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user._id,
          receiverId: activeUser._id,
          listingId: activeListing?._id,
          isTyping,
        }),
      });
      isTyping ? (isTypingSentRef.current = true) : (isTypingSentRef.current = false);
    } catch (err) {
      console.error("Error sending typing notification:", err);
      if (!isTyping) isTypingSentRef.current = false;
    }
  };

  const handleUserClick = (user) => {
    setActiveUser(user);
    setActiveListing(user.last_listing || null);
    markMessagesAsRead(user._id);
    isTypingSentRef.current = false;
    clearTimeout(typingTimeoutRef.current);
    clearTimeout(typingStopTimeoutRef.current);
    setIsTyping(false);
    setTypingUser(null);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeUser) return;
    try {
      const messageData = { receiver_id: activeUser._id, listing_id: activeListing?._id, message: newMessage };
      const response = await fetch(`${process.env.API}/agent/postmsg`, {
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
    if (!activeUser || !session) return;
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
  }, [activeUser, activeListing, session]);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
    debouncedTyping();
  };

  useEffect(() => {
    return () => {
      if (activeUser && session) {
        sendTypingIndicator(false).catch(console.error);
        isTypingSentRef.current = false;
      }
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingStopTimeoutRef.current);
    };
  }, [activeUser, activeListing, session]);

  useEffect(() => {
    if (newMessage.trim() === "") {
      sendTypingIndicator(false).catch(console.error);
      isTypingSentRef.current = false;
    }
  }, [newMessage]);

  const getLastMessagePreview = (user) => user.last_message || "No messages yet";
  const getUserStatus = (user) => (user?.is_online ? "Online" : "Offline");

  const sidebarContent = (
    <Box sx={styles.sidebar}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {isMobile && (
          <IconButton onClick={() => setSidebarOpen(false)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={styles.title}>
          Messages {loading && <CircularProgress size={16} sx={{ ml: 1 }} />}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

      <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
        {usersWithMessages.map((user) => (
          <ListItem
            key={user._id}
            sx={{
              ...styles.userItem,
              ...(activeUser?._id === user._id && { backgroundColor: "secondary.light", borderLeft: "3px solid", borderColor: "secondary.main" }),
            }}
            onClick={() => handleUserClick(user)}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                unreadCounts[user._id] > 0 ? (
                  <Box sx={{ backgroundColor: "secondary.main", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
                    {unreadCounts[user._id]}
                  </Box>
                ) : null
              }
            >
              <Badge color={user?.is_online ? "success" : "default"} variant="dot" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Avatar sx={{ width: { xs: 40, md: 50 }, height: { xs: 40, md: 50 } }} src={getUserAvatar(user)} />
              </Badge>
            </Badge>

            <Box sx={{ flex: 1, ml: 2, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography fontWeight="600" noWrap sx={{ flex: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>{user.name}</Typography>
                <Chip label={getUserStatus(user)} size="small" color={user?.is_online ? "success" : "default"} sx={{ height: "20px", fontSize: "0.7rem" }} />
              </Box>

              {user.last_listing ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Avatar src={getListingImage(user.last_listing)} sx={{ width: 24, height: 24, borderRadius: 1 }} variant="rounded" />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{user.last_listing.title}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">${user.last_listing.price}</Typography>
                      {user.last_listing.is_verified && <Chip label="Verified" size="small" color="success" sx={{ height: "16px", fontSize: "0.6rem" }} />}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>General Inquiry</Typography>
              )}

              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.75rem', md: '0.8rem' } }}>{getLastMessagePreview(user)}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>

      {!loading && usersWithMessages.length === 0 && !error && (
        <Typography sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>No messages yet</Typography>
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
          onClose={() => setSidebarOpen(false)}
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
        {activeUser ? (
          <>
            <Box sx={{ 
              p: { xs: 1, md: 2 }, 
              borderBottom: 1, 
              borderColor: "divider", 
              backgroundColor: "background.paper", 
              display: "flex", 
              alignItems: "center" 
            }}>
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(true)} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Badge color={activeUser?.is_online ? "success" : "default"} variant="dot" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Avatar src={getUserAvatar(activeUser)} sx={{ width: { xs: 40, md: 50 }, height: { xs: 40, md: 50 }, mr: 2 }} />
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight="600" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{activeUser.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{getUserStatus(activeUser)}</Typography>
                {activeListing && (
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                    About: {activeListing.title}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={styles.messageList}>
              {messages.map((msg) => {
                const senderId = msg.sender_id?._id || msg.sender_id;
                const isAgent = senderId === session?.user?._id;
                return (
                  <Box key={msg._id || `${msg.createdAt}-${Math.random()}`} sx={{ 
                    display: "flex", 
                    justifyContent: isAgent ? "flex-end" : "flex-start", 
                    alignItems: "flex-start", 
                    gap: 1,
                    px: { xs: 1, md: 2 }
                  }}>
                    {!isAgent && (
                      <Avatar src={getUserAvatar(activeUser)} sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 } }} />
                    )}
                    <Box sx={isAgent ? styles.agentMessage : styles.userMessage}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '0.9rem' } }}>{msg.message}</Typography>
                      <Typography sx={styles.messageTime}>
                        {new Date(msg.createdAt || msg.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </Box>
                    {isAgent && (
                      <Avatar src={session?.user?.image} sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 } }} />
                    )}
                  </Box>
                );
              })}

              {isTyping && (
                <Box sx={styles.typingIndicator}>
                  <Typography variant="caption" sx={{ mr: 1, fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
                    {typingUser ? `${typingUser.split(" ")[0]} is typing` : `${activeUser?.name?.split(" ")[0]} is typing`}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "secondary.main", animation: "pulse 1.5s infinite" }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "secondary.main", animation: "pulse 1.5s infinite 0.2s" }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "secondary.main", animation: "pulse 1.5s infinite 0.4s" }} />
                  </Box>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

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
              <IconButton color="secondary" sx={styles.sendButton} onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100%", 
            flexDirection: "column", 
            gap: 2,
            textAlign: 'center',
            px: 2
          }}>
            {isMobile && !sidebarOpen && (
              <IconButton 
                onClick={() => setSidebarOpen(true)} 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16,
                  backgroundColor: 'background.paper'
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              {usersWithMessages.length === 0 ? "No messages yet" : "Select a user to start chatting"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '0.9rem' } }}>
              {usersWithMessages.length === 0 
                ? "User messages will appear here when they contact you" 
                : "Choose a user from the sidebar to view messages"}
            </Typography>
            {isMobile && usersWithMessages.length > 0 && (
              <IconButton 
                onClick={() => setSidebarOpen(true)} 
                sx={{ 
                  backgroundColor: 'secondary.main', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'secondary.dark' }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}