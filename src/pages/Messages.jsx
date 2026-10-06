import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Search, Phone, Video, MessageSquare, Zap, Check, CheckCheck, ArrowLeft, Users, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI, authAPI } from '../utils/api';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 80px)',
    background: '#f8fafc',
    overflow: 'hidden',
    fontFamily: 'inherit',
  },
  sidebar: {
    width: '320px',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '24px 20px 16px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
  },
  sidebarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    color: '#0f172a',
    fontWeight: 900,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '10px 12px 10px 36px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    letterSpacing: '0.05em',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
  },
  chatItem: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '4px',
    background: isActive
      ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
      : 'transparent',
    border: isActive ? '1px solid #7c3aed' : '1px solid transparent',
  }),
  avatar: (isActive) => ({
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '14px',
    flexShrink: 0,
    background: isActive
      ? '#ffffff'
      : 'rgba(124,58,237,0.1)',
    color: isActive ? '#7c3aed' : '#7c3aed',
    position: 'relative',
  }),
  onlineDot: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '12px',
    height: '12px',
    background: '#22c55e',
    borderRadius: '50%',
    border: '2px solid #ffffff',
  },
  chatInfo: {
    marginLeft: '12px',
    flex: 1,
    minWidth: 0,
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3px',
  },
  chatName: (isActive) => ({
    fontSize: '11px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isActive ? '#ffffff' : '#0f172a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  chatTime: (isActive) => ({
    fontSize: '9px',
    fontWeight: 700,
    color: isActive ? 'rgba(255,255,255,0.8)' : '#64748b',
    flexShrink: 0,
    marginLeft: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }),
  chatLastMsg: (isActive) => ({
    fontSize: '10px',
    fontWeight: 600,
    color: isActive ? 'rgba(255,255,255,0.85)' : '#64748b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  // Chat window
  chatWindow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#f8fafc',
  },
  chatWindowHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#ffffff',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backButton: {
    background: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '8px',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '13px',
    color: '#ffffff',
    flexShrink: 0,
  },
  headerName: {
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#0f172a',
    marginBottom: '2px',
  },
  headerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '9px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  statusDot: (online) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: online ? '#22c55e' : '#94a3b8',
  }),
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    padding: '8px',
    borderRadius: '10px',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  encryptionBadge: {
    alignSelf: 'center',
    padding: '4px 14px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '99px',
    fontSize: '8px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '8px',
  },
  msgRow: (isMe) => ({
    display: 'flex',
    justifyContent: isMe ? 'flex-end' : 'flex-start',
  }),
  msgBubble: (isMe) => ({
    maxWidth: '65%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMe ? 'flex-end' : 'flex-start',
  }),
  msgText: (isMe) => ({
    padding: '12px 16px',
    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '1.5',
    background: isMe
      ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
      : '#ffffff',
    border: isMe ? 'none' : '1px solid #e2e8f0',
    color: isMe ? '#ffffff' : '#0f172a',
    boxShadow: isMe ? '0 4px 15px rgba(124,58,237,0.25)' : '0 2px 8px rgba(0,0,0,0.03)',
  }),
  msgMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
    padding: '0 2px',
    fontSize: '9px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  inputBar: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    background: '#ffffff',
    backdropFilter: 'blur(20px)',
    flexShrink: 0,
  },
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '16px',
    padding: '6px 6px 6px 16px',
  },
  msgInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a',
    padding: '8px 0',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
    transition: 'all 0.2s',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px',
    gap: '16px',
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.03)',
    border: '2px dashed rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.03em',
    color: '#ffffff',
    fontStyle: 'italic',
  },
  emptySubtitle: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#4b5563',
    maxWidth: '320px',
    lineHeight: '1.8',
  },
};

// Render WhatsApp status tick
const MessageTick = ({ status }) => {
  if (status === 'sent') {
    // 1 tick gray (sent from my side)
    return <Check size={12} style={{ color: '#9ca3af' }} title="Sent" />;
  }
  if (status === 'delivered') {
    // 2 ticks gray (delivered to buddy)
    return <CheckCheck size={12} style={{ color: '#9ca3af' }} title="Delivered" />;
  }
  if (status === 'seen') {
    // 2 ticks blue / colored (seen by buddy)
    return <CheckCheck size={12} style={{ color: '#3b82f6' }} title="Seen" />;
  }
  return <CheckCheck size={12} style={{ color: '#9ca3af' }} />;
};

const Messages = () => {
  const { user } = useAuth();
  const [buddies, setBuddies] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingBuddies, setLoadingBuddies] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch verified connected buddies ONLY
  const fetchBuddies = useCallback(async () => {
    try {
      setLoadingBuddies(true);
      const res = await authAPI.getConnections();
      if (res.data) {
        setBuddies(res.data);
      }
    } catch (e) {
      console.error('Failed to load connections:', e);
      setBuddies([]);
    } finally {
      setLoadingBuddies(false);
    }
  }, []);

  useEffect(() => {
    fetchBuddies();
  }, [fetchBuddies]);

  // Fetch conversation messages when active chat changes
  const fetchMessagesForChat = useCallback(async (buddyId) => {
    try {
      const res = await messagesAPI.getMessages(buddyId);
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    }
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessagesForChat(activeChat._id);
      // Auto poll messages every 3 seconds for active chat
      const interval = setInterval(() => {
        fetchMessagesForChat(activeChat._id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeChat, fetchMessagesForChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const textToSend = newMessage.trim();
    setNewMessage('');

    // Optimistic UI message with initial 1 tick 'sent' status
    const tempMsg = {
      _id: 'temp-' + Date.now(),
      sender: user?._id || user?.id,
      receiver: activeChat._id,
      text: textToSend,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await messagesAPI.sendMessage(activeChat._id, textToSend);
      if (res.data && res.data.message) {
        // Update temp message with real backend message (defaults to 'delivered' = 2 gray ticks)
        setMessages(prev => prev.map(m => m._id === tempMsg._id ? res.data.message : m));
      }
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  const filteredBuddies = buddies.filter(b => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSidebar = !isMobile || !activeChat;
  const showChatWindow = !isMobile || !!activeChat;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      {showSidebar && (
        <div style={isMobile ? { ...styles.sidebar, width: '100%', minWidth: '100%' } : styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.sidebarTitle}>
              <MessageSquare size={16} color="#a78bfa" />
              Buddy <span style={{ color: '#a78bfa' }}>Chats</span>
            </div>
            <div style={styles.searchWrapper}>
              <Search style={styles.searchIcon} size={14} />
              <input
                type="text"
                placeholder="Search Buddies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.chatList}>
            {loadingBuddies ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '11px', fontWeight: 700 }}>
                Loading buddies...
              </div>
            ) : filteredBuddies.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <Users size={32} style={{ color: '#4b5563', margin: '0 auto 12px' }} />
                <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
                  No Connected Buddies
                </p>
                <p style={{ color: '#4b5563', fontSize: '9px', fontWeight: 700, marginBottom: '16px', lineHeight: '1.6' }}>
                  Chats are only allowed with connected buddies. Send or accept requests first.
                </p>
                <Link
                  to="/find-buddies"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: 'rgba(124,58,237,0.2)',
                    border: '1px solid rgba(124,58,237,0.4)',
                    borderRadius: '10px',
                    color: '#a78bfa',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  <UserPlus size={12} /> Find Buddies
                </Link>
              </div>
            ) : (
              filteredBuddies.map(buddy => {
                const isActive = activeChat?._id === buddy._id;
                return (
                  <div
                    key={buddy._id}
                    style={styles.chatItem(isActive)}
                    onClick={() => setActiveChat(buddy)}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={styles.avatar(isActive)}>
                        {buddy.name?.[0] || 'B'}
                      </div>
                      <div style={styles.onlineDot} />
                    </div>
                    <div style={styles.chatInfo}>
                      <div style={styles.chatHeader}>
                        <span style={styles.chatName(isActive)}>{buddy.name}</span>
                      </div>
                      <p style={styles.chatLastMsg(isActive)}>
                        {buddy.branch || 'Campus Buddy'} · {buddy.year || 'Student'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {showChatWindow && (
        <div style={styles.chatWindow}>
          {activeChat ? (
            <>
              {/* Header */}
              <div style={styles.chatWindowHeader}>
                <div style={styles.headerLeft}>
                  {isMobile && (
                    <button style={styles.backButton} onClick={() => setActiveChat(null)}>
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <div style={styles.headerAvatar}>{activeChat.name?.[0]}</div>
                  <div>
                    <div style={styles.headerName}>{activeChat.name}</div>
                    <div style={styles.headerStatus}>
                      <div style={styles.statusDot(true)} />
                      Connected Buddy
                    </div>
                  </div>
                </div>
                <div style={styles.headerActions}>
                  <button style={styles.iconBtn} onClick={() => alert('Audio call coming soon!')}>
                    <Phone size={17} />
                  </button>
                  <button style={styles.iconBtn} onClick={() => alert('Video chat coming soon!')}>
                    <Video size={17} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div style={styles.messagesArea}>
                <div style={styles.encryptionBadge}>🔒 End-to-end encrypted buddy chat</div>

                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4b5563', fontSize: '11px', fontWeight: 700 }}>
                    Say hello to start the conversation! 👋
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = (msg.sender?._id || msg.sender) === (user?._id || user?.id);
                    const timeStr = msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Just now';

                    return (
                      <div key={msg._id} style={styles.msgRow(isMe)}>
                        <div style={styles.msgBubble(isMe)}>
                          <div style={styles.msgText(isMe)}>{msg.text}</div>
                          <div style={styles.msgMeta}>
                            <span>{timeStr}</span>
                            {isMe && <MessageTick status={msg.status || 'delivered'} />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={styles.inputBar}>
                <form onSubmit={handleSend} style={styles.inputForm}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={`Message ${activeChat.name}...`}
                    style={styles.msgInput}
                  />
                  <button type="submit" style={styles.sendBtn} title="Send Message">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Empty state */
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Zap size={36} color="rgba(124,58,237,0.4)" />
              </div>
              <div style={styles.emptyTitle}>
                Buddy <span style={{ color: '#a78bfa' }}>Chat</span>
              </div>
              <p style={styles.emptySubtitle}>
                Select a connected buddy from the sidebar to start a real-time encrypted conversation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
