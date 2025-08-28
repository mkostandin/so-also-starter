// PWA utilities for So Also app

export interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export interface PWADisplayMode {
  isStandalone: boolean;
  isFullscreen: boolean;
  isMinimalUI: boolean;
  isBrowser: boolean;
}

export interface PWAInstallStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  installPrompt: PWAInstallPrompt | null;
}

/**
 * Detect the current display mode of the PWA
 */
export function getPWADisplayMode(): PWADisplayMode {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  const isBrowser = window.matchMedia('(display-mode: browser)').matches;

  return {
    isStandalone,
    isFullscreen,
    isMinimalUI,
    isBrowser
  };
}

/**
 * Check if the app is running in standalone mode (installed PWA)
 */
export function isStandalone(): boolean {
  const displayMode = getPWADisplayMode();
  return displayMode.isStandalone;
}

/**
 * Check if the app is running on a mobile device
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if the app can be installed as a PWA
 */
export function canInstallPWA(): boolean {
  // Check if we're not already in standalone mode
  if (isStandalone()) return false;

  // Check if the browser supports PWA installation
  return 'onbeforeinstallprompt' in window || 'standalone' in navigator;
}

/**
 * PWA Installation Manager
 */
export class PWAInstallManager {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private installStatus: PWAInstallStatus;
  private listeners: Set<(status: PWAInstallStatus) => void> = new Set();

  constructor() {
    this.installStatus = {
      isInstallable: false,
      isInstalled: false,
      canInstall: canInstallPWA(),
      installPrompt: null
    };

    this.initialize();
  }

  private initialize() {
    // Check if already installed
    this.installStatus.isInstalled = isStandalone();

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as PWAInstallPrompt;
      this.installStatus = {
        ...this.installStatus,
        isInstallable: true,
        installPrompt: e as PWAInstallPrompt
      };
      this.notifyListeners();
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      this.installStatus = {
        ...this.installStatus,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      };
      this.deferredPrompt = null;
      this.notifyListeners();
    });

    // Check for iOS standalone mode
    if (this.isIOS() && this.isInWebAppiOS()) {
      this.installStatus.isInstalled = true;
      this.installStatus.isInstallable = false;
    }
  }

  /**
   * Get current installation status
   */
  getStatus(): PWAInstallStatus {
    return { ...this.installStatus };
  }

  /**
   * Prompt the user to install the PWA
   */
  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        this.installStatus = {
          ...this.installStatus,
          isInstallable: false,
          installPrompt: null
        };
        this.notifyListeners();
        return true;
      }

      return false;
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  }

  /**
   * Subscribe to installation status changes
   */
  onStatusChange(callback: (status: PWAInstallStatus) => void): () => void {
    this.listeners.add(callback);
    // Immediately call with current status
    callback(this.getStatus());

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.getStatus()));
  }

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  private isInWebAppiOS(): boolean {
    if (!this.isIOS()) return false;

    // Check for standalone mode
    const isStandalone = (window.navigator as any).standalone === true;

    // Also check for fullscreen display mode (iOS 11.3+)
    const isFullscreen = window.matchMedia('(display-mode: standalone)').matches;

    // Check if launched from home screen shortcut (older iOS versions)
    const isLaunchedFromHomeScreen = window.history.length <= 1;

    return isStandalone || isFullscreen || (isLaunchedFromHomeScreen && !window.opener);
  }
}

// Create a singleton instance
export const pwaInstallManager = new PWAInstallManager();

/**
 * Check if the app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline status changes
 */
export function onConnectivityChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Call immediately with current status
  callback(isOnline());

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Check if the device orientation is portrait
 */
export function isPortrait(): boolean {
  return window.innerHeight > window.innerWidth;
}

/**
 * Listen for orientation changes
 */
export function onOrientationChange(callback: (isPortrait: boolean) => void): () => void {
  const handleOrientationChange = () => {
    callback(isPortrait());
  };

  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);

  // Call immediately with current orientation
  callback(isPortrait());

  // Return cleanup function
  return () => {
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('resize', handleOrientationChange);
  };
}

/**
 * Request orientation lock (if supported)
 */
export async function lockOrientation(orientation: 'portrait' | 'landscape'): Promise<boolean> {
  if (!screen.orientation || !screen.orientation.lock) {
    return false;
  }

  try {
    await screen.orientation.lock(orientation);
    return true;
  } catch (error) {
    console.warn('Orientation lock failed:', error);
    return false;
  }
}

/**
 * Get the current screen orientation
 */
export function getScreenOrientation(): 'portrait' | 'landscape' | null {
  if (!screen.orientation) return null;

  const angle = screen.orientation.angle;
  return (angle === 0 || angle === 180) ? 'portrait' : 'landscape';
}

/**
 * Check if the app has permission to show notifications
 */
export async function canShowNotifications(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  // Permission not requested yet, we can try to request it
  return true;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission !== 'default') {
    return Notification.permission;
  }

  return await Notification.requestPermission();
}

/**
 * Show a notification (if permission granted)
 */
export function showNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  return new Notification(title, {
    icon: '/app/icon-192.png',
    badge: '/app/icon-192.png',
    ...options
  });
}

/**
 * Get the app version from the service worker or manifest
 */
export async function getAppVersion(): Promise<string> {
  try {
    const response = await fetch('/app/manifest.json');
    const manifest = await response.json();
    return manifest.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

/**
 * Check if a service worker update is available
 */
export function onServiceWorkerUpdate(callback: (registration: ServiceWorkerRegistration) => void): () => void {
  if (!('serviceWorker' in navigator)) {
    return () => {};
  }

  const handleUpdate = (registration: ServiceWorkerRegistration) => {
    callback(registration);
  };

  let updateFoundHandler: ((this: ServiceWorkerRegistration, ev: Event) => any) | null = null;

  navigator.serviceWorker.getRegistration().then(registration => {
    if (!registration) return;

    // Listen for when a new service worker is waiting
    if (registration.waiting) {
      handleUpdate(registration);
    }

    // Listen for new service worker installation
    updateFoundHandler = () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker is installed and ready to activate
          handleUpdate(registration);
        }
      });
    };

    registration.addEventListener('updatefound', updateFoundHandler);
  });

  // Return cleanup function
  return () => {
    if (updateFoundHandler) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.removeEventListener('updatefound', updateFoundHandler);
        }
      });
    }
  };
}
