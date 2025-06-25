
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TableSession {
  tableId: string;
  sessionId: string;
  startTime: Date;
  active: boolean;
}

export const useTableSession = () => {
  const [activeSessions, setActiveSessions] = useState<Map<string, TableSession>>(new Map());

  const startSession = (tableId: string, tableNumber: string) => {
    const sessionId = `${tableId}-${Date.now()}`;
    const session: TableSession = {
      tableId,
      sessionId,
      startTime: new Date(),
      active: true
    };
    
    setActiveSessions(prev => new Map(prev.set(tableId, session)));
    
    // Store in localStorage for persistence
    localStorage.setItem(`table-session-${tableId}`, JSON.stringify(session));
    
    console.log(`Started session for table ${tableNumber}:`, sessionId);
    return sessionId;
  };

  const endSession = (tableId: string) => {
    setActiveSessions(prev => {
      const newSessions = new Map(prev);
      newSessions.delete(tableId);
      return newSessions;
    });
    
    localStorage.removeItem(`table-session-${tableId}`);
    console.log(`Ended session for table ${tableId}`);
  };

  const isTableActive = (tableId: string): boolean => {
    return activeSessions.has(tableId);
  };

  const getSession = (tableId: string): TableSession | null => {
    return activeSessions.get(tableId) || null;
  };

  // Load sessions from localStorage on mount
  useEffect(() => {
    const loadSessions = () => {
      const sessions = new Map<string, TableSession>();
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('table-session-')) {
          try {
            const tableId = key.replace('table-session-', '');
            const sessionData = JSON.parse(localStorage.getItem(key) || '');
            sessionData.startTime = new Date(sessionData.startTime);
            sessions.set(tableId, sessionData);
          } catch (error) {
            console.error('Error loading session data:', error);
          }
        }
      }
      
      setActiveSessions(sessions);
    };

    loadSessions();
  }, []);

  return {
    startSession,
    endSession,
    isTableActive,
    getSession,
    activeSessions: Array.from(activeSessions.values())
  };
};
