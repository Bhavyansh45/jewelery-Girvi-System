// Network connectivity utilities
export interface NetworkStatus {
  isOnline: boolean;
  lastCheck: number;
  latency?: number;
  firebaseReachable: boolean;
}

let networkStatus: NetworkStatus = {
  isOnline: false,
  lastCheck: 0,
  firebaseReachable: false
};

/**
 * Check if the system is online
 */
export async function checkOnlineStatus(): Promise<boolean> {
  try {
    // Try to fetch a small resource from a reliable CDN
    const startTime = Date.now();
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    const latency = Date.now() - startTime;
    
    networkStatus = {
      isOnline: true,
      lastCheck: Date.now(),
      latency,
      firebaseReachable: true
    };
    
    return true;
  } catch (error) {
    networkStatus = {
      isOnline: false,
      lastCheck: Date.now(),
      firebaseReachable: false
    };
    
    return false;
  }
}

/**
 * Check if Firebase is reachable
 */
export async function checkFirebaseReachability(): Promise<boolean> {
  try {
    const startTime = Date.now();
    const response = await fetch('https://jewelrygirvisystem-default-rtdb.asia-southeast1.firebasedatabase.app/.json', {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    const latency = Date.now() - startTime;
    
    networkStatus.firebaseReachable = true;
    networkStatus.latency = latency;
    
    return true;
  } catch (error) {
    networkStatus.firebaseReachable = false;
    return false;
  }
}

/**
 * Get current network status
 */
export function getNetworkStatus(): NetworkStatus {
  return { ...networkStatus };
}

/**
 * Check if we should attempt online validation
 * This prevents excessive network calls when offline
 */
export function shouldAttemptOnlineValidation(): boolean {
  const now = Date.now();
  const lastCheck = networkStatus.lastCheck;
  const timeSinceLastCheck = now - lastCheck;
  
  // If we're currently online, always attempt
  if (networkStatus.isOnline) {
    return true;
  }
  
  // If offline, only attempt every 5 minutes
  const offlineRetryInterval = 5 * 60 * 1000; // 5 minutes
  return timeSinceLastCheck > offlineRetryInterval;
}

/**
 * Initialize network monitoring
 */
export function initializeNetworkMonitoring(): void {
  // Check online status immediately
  checkOnlineStatus();
  
  // Set up periodic checks
  setInterval(() => {
    checkOnlineStatus();
  }, 30000); // Check every 30 seconds
  
  // Listen for online/offline events
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      networkStatus.isOnline = true;
      networkStatus.lastCheck = Date.now();
    });
    
    window.addEventListener('offline', () => {
      networkStatus.isOnline = false;
      networkStatus.lastCheck = Date.now();
    });
  }
}

/**
 * Force a network status check
 */
export async function forceNetworkCheck(): Promise<NetworkStatus> {
  await checkOnlineStatus();
  await checkFirebaseReachability();
  return getNetworkStatus();
}
