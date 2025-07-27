import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AppContext } from './AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export const ChatContext = createContext(null);

export const ChatContextProvider = ({ children }) => {
    const { token, BACKEND_URL, userData } = useContext(AppContext);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userChats, setUserChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    // Effect 1: Initialize and disconnect the socket connection based on token
    useEffect(() => {
        if (token) {
            const newSocket = io(BACKEND_URL, {
                auth: { token }
            });
            setSocket(newSocket);

            return () => newSocket.disconnect();
        }
    }, [token, BACKEND_URL]);

    // Effect 2: Handle incoming messages (This is the corrected part)
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // Check if the incoming message belongs to the currently open chat
            if (currentChat && currentChat.appointmentId === newMessage.appointmentId) {
                // Add the new message to the state, triggering a UI update
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
            // Always refresh the chat list to show new message previews or unread counts
            fetchUserChats();
        };

        socket.on('newMessage', handleNewMessage);

        // Cleanup: remove the listener when the component unmounts or dependencies change
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
        // THE FIX: This effect MUST re-run when the user selects a new chat.
    }, [socket, currentChat]); // <-- By adding currentChat here, the listener always knows which chat is active.

    const fetchUserChats = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${BACKEND_URL}/api/messages/my-chats`, { headers: { token } });
            if (response.data.success) {
                setUserChats(response.data.chats);
            }
        } catch (error) {
            console.error("Failed to fetch user chats:", error);
        }
    };

    const getChat = async (appointmentId) => {
        if (!token) return;
        setLoadingChat(true);
        setMessages([]);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/messages/appointment/${appointmentId}`, { headers: { token } });
            if (response.data.success) {
                setCurrentChat(response.data.chat);
                setMessages(response.data.chat.messages);
                socket?.emit('joinChat', appointmentId);
            }
        } catch (error) {
            toast.error("Failed to load chat.");
        } finally {
            setLoadingChat(false);
        }
    };

    const value = {
        socket,
        messages,
        setMessages, // For optimistic updates
        userChats,
        fetchUserChats,
        getChat,
        loadingChat,
        currentChat,
        loggedInUser: userData
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
