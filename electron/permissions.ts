import { session } from 'electron';

/**
 * Set up permission handlers for camera and file system access
 * This function should be called in the main process before creating windows
 */
export function setupPermissions() {
  // Handle permission requests
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log(`Permission requested: ${permission}`);

    // Allow camera access
    if (permission === 'media') {
      const url = webContents.getURL();
      callback(url.startsWith('http://localhost') || url.startsWith('app://'));
      return;
    }

    // Allow other permissions as needed
    if (permission === 'fullscreen' || permission === 'notifications') {
      callback(true);
      return;
    }

    // Deny other permissions by default
    callback(false);
  });

  // Handle permission check
  session.defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
    console.log(`Permission check: ${permission} from ${requestingOrigin}`);

    // Allow camera and microphone
    if (permission === 'media' || permission === 'mediaKeySystem') {
      return true;
    }

    return false;
  });
}

/**
 * Platform-specific permission notes:
 * 
 * macOS:
 * - Camera access requires "NSCameraUsageDescription" in Info.plist
 * - Microphone access requires "NSMicrophoneUsageDescription" in Info.plist
 * - File system access is handled through native dialogs
 * 
 * Windows:
 * - Camera access is handled by Windows privacy settings
 * - File system access is handled through native dialogs
 * - No additional manifest entries required for basic access
 */
