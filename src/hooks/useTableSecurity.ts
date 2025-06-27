
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface TableSecurityState {
  isLocked: boolean;
  lockedBy: string | null;
  sessionExpiry: Date | null;
  sessionId: string | null;
}

export const useTableSecurity = (tableId: string) => {
  const [securityState, setSecurityState] = useState<TableSecurityState>({
    isLocked: false,
    lockedBy: null,
    sessionExpiry: null,
    sessionId: null
  });
  const [loading, setLoading] = useState(false);

  const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  const checkTableLock = async () => {
    try {
      const sessionData = localStorage.getItem(`table-lock-${tableId}`);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const now = new Date();
        const expiry = new Date(parsed.expiry);
        
        if (now < expiry) {
          setSecurityState({
            isLocked: true,
            lockedBy: parsed.lockedBy,
            sessionExpiry: expiry,
            sessionId: parsed.sessionId
          });
          return true;
        } else {
          // Session expired, clean up
          localStorage.removeItem(`table-lock-${tableId}`);
        }
      }
      
      setSecurityState({
        isLocked: false,
        lockedBy: null,
        sessionExpiry: null,
        sessionId: null
      });
      return false;
    } catch (error) {
      console.error('Error checking table lock:', error);
      return false;
    }
  };

  const lockTable = async (customerName: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Check if table is already locked
      const isLocked = await checkTableLock();
      if (isLocked) {
        toast({
          title: "Table Already in Use",
          description: "This table is currently being used by another customer. Please try again later.",
          variant: "destructive",
        });
        return false;
      }

      // Create new session
      const sessionId = `session-${tableId}-${Date.now()}`;
      const expiry = new Date(Date.now() + SESSION_DURATION);
      
      const lockData = {
        sessionId,
        lockedBy: customerName,
        tableId,
        expiry: expiry.toISOString(),
        lockedAt: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem(`table-lock-${tableId}`, JSON.stringify(lockData));
      
      // Store in session storage as backup
      sessionStorage.setItem(`table-session-${tableId}`, JSON.stringify(lockData));
      
      setSecurityState({
        isLocked: true,
        lockedBy: customerName,
        sessionExpiry: expiry,
        sessionId
      });

      console.log(`Table ${tableId} locked by ${customerName} until ${expiry}`);
      return true;
    } catch (error) {
      console.error('Error locking table:', error);
      toast({
        title: "Lock Failed",
        description: "Unable to secure table session. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlockTable = () => {
    try {
      localStorage.removeItem(`table-lock-${tableId}`);
      sessionStorage.removeItem(`table-session-${tableId}`);
      
      setSecurityState({
        isLocked: false,
        lockedBy: null,
        sessionExpiry: null,
        sessionId: null
      });
      
      console.log(`Table ${tableId} unlocked`);
    } catch (error) {
      console.error('Error unlocking table:', error);
    }
  };

  const extendSession = () => {
    try {
      const sessionData = localStorage.getItem(`table-lock-${tableId}`);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const newExpiry = new Date(Date.now() + SESSION_DURATION);
        
        parsed.expiry = newExpiry.toISOString();
        localStorage.setItem(`table-lock-${tableId}`, JSON.stringify(parsed));
        
        setSecurityState(prev => ({
          ...prev,
          sessionExpiry: newExpiry
        }));
        
        toast({
          title: "Session Extended",
          description: "Your table session has been extended for 2 more hours.",
        });
      }
    } catch (error) {
      console.error('Error extending session:', error);
    }
  };

  const getRemainingTime = (): number => {
    if (!securityState.sessionExpiry) return 0;
    const now = new Date();
    const expiry = new Date(securityState.sessionExpiry);
    return Math.max(0, expiry.getTime() - now.getTime());
  };

  const formatRemainingTime = (): string => {
    const remaining = getRemainingTime();
    if (remaining === 0) return "Expired";
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  useEffect(() => {
    checkTableLock();
    
    // Set up interval to check for expired sessions
    const interval = setInterval(() => {
      checkTableLock();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tableId]);

  return {
    securityState,
    loading,
    lockTable,
    unlockTable,
    extendSession,
    checkTableLock,
    getRemainingTime,
    formatRemainingTime,
    isSessionExpiring: getRemainingTime() < 15 * 60 * 1000 // Less than 15 minutes
  };
};
