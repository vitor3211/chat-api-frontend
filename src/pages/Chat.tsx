import { LuSearch, LuSend, LuUser } from "react-icons/lu";
import { PiDotsThreeOutline } from "react-icons/pi";
import { TbXboxXFilled } from "react-icons/tb";
import Button from "../components/Button";
import { IoReorderThree } from "react-icons/io5";
import api from "../service";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";

const MainChat = () => {
    type User = {
        id: string;
        name: string;
        email: string;
        imageProfileUrl: string;
    };

    type Chat = {
        id: string;
        contactId: string;
        name: string;
        avatar: string;
        lastMsg: string;
    };

    type Message = {
        id?: string;
        _id?: string;
        content: string;
        sender: string;
        roomID: string;
        messageTime: string;
    };

    const stompClient = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [user, setUser] = useState<User>(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser
            ? JSON.parse(storedUser)
            : { id: "", name: "", email: "", imageProfileUrl: "" };
    });

    const navigate: NavigateFunction = useNavigate();
    const [searchUser, setSearchUser] = useState<string>("");
    const [chatList, setChatList] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [roomID, setRoomID] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [newContactName, setNewContactName] = useState<string>("");
    const [loadingRooms, setLoadingRooms] = useState<boolean>(true);
    const [showLogout, setShowLogout] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showDeleteContactModal, setShowDeleteContactModal] = useState<boolean>(false);
    const [showAddContact, setShowAddContact] = useState<boolean>(false);

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, chatId: string) => {
        e.stopPropagation();
        setOpenMenuId(prev => (prev === chatId ? null : chatId));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await api.get<User>("/user/me");
                setUser(response.data);
                localStorage.setItem("userData", JSON.stringify(response.data));
            } catch (err) {
                console.error(err);
            }
        };

        if (!user.id) fetchUserData();
    }, [user.id, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !roomID) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/gs-guide-websocket`),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe(`/topic/chat/${roomID}`, (message) => {
                    const receivedMessage: Message = JSON.parse(message.body);
                    setMessages(prev => {
                        const id = receivedMessage.id || receivedMessage._id;
                        const exists = prev.find(m => (m.id || m._id) === id);
                        return exists ? prev : [...prev, receivedMessage];
                    });
                });
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            stompClient.current?.deactivate();
        };
    }, [roomID]);

    const formatAndSetRooms = (rooms: any[], profiles: User[]) => {
        const profileMap: Record<string, User> = profiles.reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
        }, {} as Record<string, User>);

        const formatted: Chat[] = rooms.map(room => {
            const contactId = room.user1 === user.id ? room.user2 : room.user1;
            const profile = profileMap[contactId];
            return {
                id: room.id,
                contactId,
                name: profile ? profile.name : "Unknown",
                avatar: profile?.imageProfileUrl || contactId.charAt(0).toUpperCase(),
                lastMsg: "Click to chat"
            };
        });

        setChatList(formatted);
        if (formatted.length > 0 && !roomID) setRoomID(formatted[0].id);
    };

    const fetchRoomsData = async () => {
        try {
            setLoadingRooms(true);
            const roomResponse = await api.get<any[]>("/room");
            if (!roomResponse.data.length) {
                setChatList([]);
                return;
            }

            const contactIds = roomResponse.data.map(r => r.user1 === user.id ? r.user2 : r.user1);
            const uniqueIds = [...new Set(contactIds)];

            const userResponse = await api.get<User[]>(`/user/details?ids=${uniqueIds.join(',')}`);
            formatAndSetRooms(roomResponse.data, userResponse.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingRooms(false);
        }
    };

    useEffect(() => {
        if (user.id) fetchRoomsData();
    }, [user.id]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!roomID) return;
            try {
                const response = await api.get<{ content?: Message[] }>(`/room/${roomID}/messages?page=0&size=50`);
                const historyData = response.data.content || response.data;
                setMessages(Array.isArray(historyData) ? historyData : []);
            } catch {
                setMessages([]);
            }
        };
        fetchHistory();
    }, [roomID]);

    const handleSendMessage = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !roomID) return;

        if (stompClient.current?.connected) {
            const messageRequest: Message = {
                content: inputValue,
                sender: user.id,
                roomID,
                messageTime: new Date().toISOString()
            };

            stompClient.current.publish({
                destination: `/app/sendMessage/${roomID}`,
                body: JSON.stringify(messageRequest)
            });

            setInputValue("");
        }
    };

    const handleAddContact = async () => {
        if (!newContactName.trim()) return;
        const toastId = toast.loading("Adding contact...");
        try {
            const response = await api.post("/room/name", { contactId: newContactName });
            if (response.status === 200 || response.status === 201) {
                setNewContactName("");
                setShowAddContact(false);
                await fetchRoomsData();
            }
            toast.update(toastId, { render: "User added successfully!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "User not found.";
            toast.update(toastId, { render: errorMsg, type: "error", isLoading: false, autoClose: 3000 });
            setShowAddContact(false);
            setNewContactName("");
        }
    };

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            await api.post("/auth/logout", { refreshToken });
            toast.update(toastId, { render: "Logged out successfully!", type: "success", isLoading: false, autoClose: 1500 });
            localStorage.clear();
            navigate("/login");
        } catch {
            localStorage.clear();
            toast.dismiss(toastId);
            navigate("/login");
        }
    };

    const handleOpenDeleteContactModal = (e: React.MouseEvent<HTMLButtonElement>, contactId: string) => {
        e.stopPropagation();
        setContactToDelete(contactId);
        setShowDeleteContactModal(true);
        setOpenMenuId(null);
    };

    const confirmDeleteContact = async () => {
        if (!contactToDelete) return;
        const toastId = toast.loading("Deleting contact...");
        try {
            await api.delete(`/room/${contactToDelete}`);
            setChatList(prev => prev.filter(c => c.contactId !== contactToDelete));
            if (chatList.find(c => c.contactId === contactToDelete)?.id === roomID) {
                setRoomID(null);
                setMessages([]);
            }
            toast.update(toastId, { render: "User deleted successfully!", type: "success", isLoading: false, autoClose: 1500 });
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to delete user. Please try again.";
            toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setShowDeleteContactModal(false);
            setContactToDelete(null);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const toastId = toast.loading("Uploading your new profile picture...");

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post("/files/uploadFile", formData, { headers: { "Content-Type": "multipart/form-data" } });
            const response = await api.get<User>("/user/me");
            setUser(response.data);
            localStorage.setItem("userData", JSON.stringify(response.data));
            toast.update(toastId, { render: "Profile picture updated!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (err) {
            console.error("Upload error:", err);
            toast.update(toastId, { render: "Error updating photo. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleOpenDeleteModal = (messageId: string) => {
        setMessageToDelete(messageId);
        setShowDeleteModal(true);
    };

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;
        try {
            await api.delete(`/room/messages/${messageToDelete}`);
            setMessages(prev => prev.filter(msg => (msg.id || msg._id) !== messageToDelete));
        } catch (err) {
            console.error(err);
        } finally {
            setShowDeleteModal(false);
            setMessageToDelete(null);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const filteredChats = chatList.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeChat = chatList.find(c => c.id === roomID);

    return (
        <div className="flex h-screen w-screen overflow-hidden font-sans">
            <div className="flex w-full h-full bg-slate-50 overflow-hidden">
                <aside className="w-full md:w-80 bg-slate-800 flex flex-col z-20">
                    <header className="p-4 bg-sky-800 flex justify-between items-center h-16 shrink-0">
                        <h1 className="text-xl font-bold text-white tracking-wide">ChatApi</h1>
                    </header>
                    
                    <div className="flex flex-col gap-2 p-3 bg-slate-100 shrink-0">
                        {showAddContact ? (
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="relative flex items-center group">
                                    <input 
                                        type="text" 
                                        onChange={(e) => setSearchUser(e.target.value)}
                                        placeholder="Username" 
                                        className="w-full bg-white text-sm rounded-lg pl-10 pr-4 py-2.5 border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-500 shadow-sm"
                                    />
                                    </div>
                                <div className="flex flex-row gap-5 py-1">
                                    <Button
                                    text="Add"
                                    onClick={handleAddContact}
                                    className="text-xs px-2.5 h-8 min-w-fit rounded-md"
                                    />
                                    <Button
                                        text="cancel"
                                        variant="danger"
                                        icon={TbXboxXFilled}
                                        onClick={() => setShowAddContact(false)}
                                        className="px-2 h-8 min-w-fit rounded-md"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => setShowAddContact(true)}>
                                <Button
                                    text="+Add a new contact"
                                    loading={false}
                                    className="h-9 w-full"
                                />
                            </div>
                        )}
                        
                        <div className="relative flex items-center group">
                            <span className="absolute left-3 text-slate-500">
                                <LuSearch size={18} />
                            </span>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search messages..." 
                                className="w-full bg-white text-sm rounded-lg pl-10 pr-4 py-2.5 border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-500 shadow-sm"
                            />
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto bg-slate-100">
                        {loadingRooms ? (
                            <div className="p-4 text-center text-slate-500 text-sm">Loading contacts...</div>
                        ) : (
                            filteredChats.map(chat => (
                                <div 
                                    key={chat.id} 
                                    onClick={() => setRoomID(chat.id)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer shadow-sm transition-colors border-l-4 ${roomID === chat.id ? 'bg-white border-sky-600' : 'bg-slate-100 border-transparent hover:bg-slate-200'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md overflow-hidden">
                                        {chat.avatar.length > 1 ? (
                                            <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                                        ) : (
                                            chat.avatar
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-bold text-slate-800 text-sm">{chat.name}</h3>
                                        <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 relative">
                                        <button onClick={(e) => handleOpenMenu(e, chat.id)} className="text-[20px] font-bold text-slate-500 hover:text-slate-800">
                                            <PiDotsThreeOutline/>
                                        </button>
                                        
                                        {openMenuId === chat.id && (
                                            <div className="absolute top-6 right-0 bg-white border shadow-lg rounded-md p-1 z-50">
                                                <button 
                                                    onClick={(e) => handleOpenDeleteContactModal(e, chat.contactId)}
                                                    className="text-red-500 text-sm px-4 py-2 hover:bg-slate-100 w-full text-left rounded-md whitespace-nowrap"
                                                >
                                                    Delete Contact
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </nav>
                </aside>

                <main className="flex-1 flex flex-col bg-slate-50 hidden md:flex relative">
                    <header className="h-16 px-6 bg-sky-800 flex items-center justify-between shadow-md z-10 shrink-0">
                        {activeChat ? (
                            <div className="flex items-center gap-3 cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-600 font-bold shadow-sm overflow-hidden">
                                    {activeChat.avatar.length > 1 ? (
                                        <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        activeChat.avatar
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">{activeChat.name}</h2>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <h2 className="font-bold text-white/70">Select a chat to start</h2>
                            </div>
                        )}

                        <div className="flex items-center justify-center relative">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*"
                            />

                            <button onClick={() => setShowLogout(!showLogout)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-sky-600 hover:border-sky-400 transition-all active:scale-95 shadow-sm cursor-pointer">
                                <IoReorderThree size={24} />
                            </button>

                            {showLogout && (
                                <div className="absolute top-12 right-0 bg-white border shadow-lg rounded-md p-1 z-50 min-w-[150px] transition-all duration-300 ease-in-out">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="flex items-center gap-2 text-slate-700 text-sm px-4 py-2 cursor-pointer w-full text-left rounded-md whitespace-nowrap hover:bg-slate-100"
                                    >
                                        <LuUser size={16} /> Change Photo
                                    </button>

                                    <div className="h-[1px] bg-slate-100 my-1"></div>

                                    <button 
                                        onClick={handleLogout} 
                                        className="text-red-500 text-sm px-4 py-2 cursor-pointer w-full text-left rounded-md whitespace-nowrap hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <section className="flex-1 overflow-y-auto p-6 flex flex-col bg-slate-800 gap-4">
                        {messages.length === 0 && roomID ? (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-slate-400 text-sm">No messages yet. Say "Hi!"</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = msg.sender === user.id;
                                const timeString = msg.messageTime 
                                    ? new Date(msg.messageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : '';
                            
                                return (
                                    <div key={msg.id || msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`${isMe ? 'bg-sky-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 rounded-tl-sm border border-slate-300'} px-4 py-2.5 rounded-2xl max-w-[70%] shadow-sm relative group`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-sky-200' : 'text-slate-400'}`}>
                                                {timeString}
                                            </span>

                                            {isMe && (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleOpenDeleteModal(msg.id || (msg._id as string))}
                                                    className="absolute top-1 -left-16 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 text-[10px] font-bold bg-slate-900/50 px-2 py-1 rounded cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </section>

                    <footer className="p-4 bg-slate-700 shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-5xl mx-auto">
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={!roomID}
                                    placeholder={roomID ? "Type a message..." : "Select a chat first"} 
                                    className="w-full bg-white border border-slate-300 focus:ring-2 focus:ring-sky-400 rounded-full pl-5 pr-4 py-3.5 text-sm outline-none transition-all shadow-sm placeholder:text-slate-400"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={!roomID || !inputValue.trim()}
                                className="w-12 h-12 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-md shadow-sky-900/20 transition-all shrink-0"
                            >
                                <LuSend size={20} />
                            </button>
                        </form>
                    </footer>
                </main>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h3 className="font-bold text-slate-800 mb-4">Delete message?</h3>
                        <p className="text-sm text-slate-600 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                            <button onClick={confirmDeleteMessage} className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteContactModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h3 className="font-bold text-slate-800 mb-4">Delete Contact?</h3>
                        <p className="text-sm text-slate-600 mb-6">This will remove the chat and all history for you.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowDeleteContactModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                            <button onClick={confirmDeleteContact} className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainChat;
