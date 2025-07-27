import React, { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { FaPaperPlane, FaArrowLeft, FaSpinner } from 'react-icons/fa';

const ChatWindow = ({ onBack }) => {
    // Get the setMessages function and loggedInUser from the context
    const { messages, setMessages, currentChat, socket, loadingChat, loggedInUser } = useContext(ChatContext);
    
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault(); // This is crucial to prevent page reload/shift
        if (!newMessage.trim() || !socket || !currentChat) return;

        // --- FIX: OPTIMISTIC UI UPDATE ---
        // Create a temporary message object that looks like a real one
        const tempMessage = {
            _id: Date.now().toString(), // Temporary unique ID
            message: newMessage.trim(),
            senderModel: 'User', // We know the sender is the current user
            sender: {
                _id: loggedInUser._id, // Use the logged-in user's data
                name: loggedInUser.name,
                image: loggedInUser.image,
            },
            timestamp: new Date().toISOString(),
        };

        // Instantly add the message to the UI
        setMessages(prevMessages => [...prevMessages, tempMessage]);
        
        // --- END OF FIX ---

        // Now, send the real message to the server in the background
        socket.emit('sendMessage', {
            appointmentId: currentChat.appointmentId,
            message: newMessage.trim(),
        });

        setNewMessage('');
    };
    
    if (loadingChat) {
        return (
            <div className="bg-white rounded-lg shadow-md border h-full flex items-center justify-center">
                <FaSpinner className="animate-spin text-blue-500 text-3xl" />
            </div>
        );
    }
    
    if (!currentChat) {
        return <div className="p-4 text-center text-gray-500">Select a conversation to begin.</div>;
    }

    return (
        // FIX: The component structure is designed to prevent page shifts.
        // The header and form are fixed, and only the middle div scrolls.
        <div className="bg-white rounded-lg shadow-md border h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-4 flex-shrink-0">
                <button onClick={onBack} className="lg:hidden p-2 rounded-full hover:bg-gray-100">
                    <FaArrowLeft />
                </button>
                <img src={currentChat.doctorId.image} alt={currentChat.doctorId.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <h3 className="text-lg font-semibold">{currentChat.doctorId.name}</h3>
                    <p className="text-sm text-gray-500">{currentChat.doctorId.speciality}</p>
                </div>
            </div>

            {/* Scrollable Message Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg) => {
                    // Check if the sender is the currently logged-in user
                    const isMyMessage = msg.senderModel === 'User'; 
                    return (
                        <div key={msg._id} className={`flex my-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-sm ${isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="text-sm break-words">{msg.message}</p>
                                <p className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="off"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-300" disabled={!newMessage.trim()}>
                        <FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
