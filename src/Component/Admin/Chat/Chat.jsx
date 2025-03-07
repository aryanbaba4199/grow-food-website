import { getterFunction, vendorApi } from "@/Api";
import React, { useEffect, useState } from "react";
import { Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText, Badge, Box, TextField, Button } from "@mui/material";
import { FaCircle } from "react-icons/fa";

const Chat = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [chatters, setChatters] = useState([]);
  const [selectedChatter, setSelectedChatter] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      getChatters();
    }
  }, [user]);

  useEffect(() => {
    if (chatters.length > 0) {
      setSelectedChatter(chatters[0]);
      getChats(chatters[0]._id);
    }
  }, [chatters]);

  const getChatters = async () => {
    try {
      const res = await getterFunction(`${vendorApi.getChatters}/${user._id}`);
      setChatters(res.chatters);
    } catch (e) {
      console.error("Error fetching chatters", e);
    }
  };

  const getChats = async (chatterId) => {
    try {
      const res = await getterFunction(`${vendorApi.getChats}/${chatterId}`);
      setChats(res);
    } catch (e) {
      console.error("Error fetching chats", e);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      // Replace with your API call to send a message
      const res = await getterFunction(`${vendorApi.sendMessage}`, {
        method: "POST",
        body: JSON.stringify({
          senderId: user._id,
          receiverId: selectedChatter._id,
          message,
        }),
      });
      if (res) {
        setMessage("");
        getChats(selectedChatter._id); // Refresh chats
      }
    } catch (e) {
      console.error("Error sending message", e);
    }
  };

  return (
    <Box display="flex" height="85vh">
      {/* Chatters List (30% width) */}
      <Box width="30%" borderRight="1px solid #ccc">
        <Typography variant="h6" p={2} borderBottom="1px solid #ccc">
          Messages
        </Typography>
        <List>
         
          {chatters.map((chatter) => (
            <ListItem
              key={chatter._id}
              button
              onClick={() => {
                setSelectedChatter(chatter);
                getChats(chatter._id);
              }}
              sx={{
                backgroundColor: selectedChatter?._id === chatter._id ? "#f0f0f0" : "inherit",
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <FaCircle
                      size={10}
                      color={chatter.isOnline ? "green" : "gray"}
                    />
                  }
                >
                  <Avatar src={chatter.image} alt={chatter.name} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={chatter.name}
                secondary={chatter.isOnline ? "Online" : "Offline"}
              />
            </ListItem>
          ))}
        </List>
      </Box>


      <Box width="70%" display="flex" flexDirection="column">
        {/* Chat Header */}
        {selectedChatter && (
          <Box p={2} borderBottom="1px solid #ccc">
            <Typography variant="h6">
              {selectedChatter.name}
              <FaCircle
                size={10}
                color={selectedChatter.isOnline ? "green" : "gray"}
                style={{ marginLeft: 8 }}
              />
            </Typography>
          </Box>
        )}

        {/* Chat Messages */}
        <Box flex={1} p={2} overflow="auto">
            {chats.length===0 ? <div className="flex justify-center items-center w-full h-full">
                <span>Nothing to show</span>
            </div> : 
            <>
          {chats.map((chat, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={chat.senderId === user._id ? "flex-end" : "flex-start"}
              mb={2}
            >
              <Box
                bgcolor={chat.senderId === user._id ? "#dcf8c6" : "#f0f0f0"}
                p={1.5}
                borderRadius={2}
                maxWidth="70%"
              >
                <Typography>{chat.message}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(chat.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))}
          </>}
        </Box>

        {/* Message Input */}
        <Box p={2} borderTop="1px solid #ccc">
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;