// import { session } from 'electron';

// /**
//  * Set up permission handlers for camera and file system access
//  * This function should be called in the main process before creating windows
//  */
// export function setupPermissions() {
//   // Handle permission requests
//   session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
//     console.log(`Permission requested: ${permission}`);

//     // Allow camera access
//     if (permission === 'media') {
//       const url = webContents.getURL();
//       callback(url.startsWith('http://localhost') || url.startsWith('app://'));
//       return;
//     }

//     // Allow other permissions as needed
//     if (permission === 'fullscreen' || permission === 'notifications') {
//       callback(true);
//       return;
//     }

//     // Deny other permissions by default
//     callback(false);
//   });

//   // Handle permission check
//   session.defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
//     console.log(`Permission check: ${permission} from ${requestingOrigin}`);
//     console.log(webContents?.userAgent);

//     // Allow camera and microphone
//     if (permission === 'media' || permission === 'mediaKeySystem') {
//       return true;
//     }

//     return false;
//   });
// }

// /**
//  * Platform-specific permission notes:
//  * 
//  * macOS:
//  * - Camera access requires "NSCameraUsageDescription" in Info.plist
//  * - Microphone access requires "NSMicrophoneUsageDescription" in Info.plist
//  * - File system access is handled through native dialogs
//  * 
//  * Windows:
//  * - Camera access is handled by Windows privacy settings
//  * - File system access is handled through native dialogs
//  * - No additional manifest entries required for basic access
//  */

import { app } from "electron";

/**
 * Setup permissions for the Electron app
 * Let the OS handle the actual permission prompts - we just define what's allowed
 */
export function setupPermissions() {
  app.on("web-contents-created", (_event, webContents) => {
    // Set permission request handler - automatically allow these permissions
    webContents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
      // List of allowed permissions - OS will prompt user when needed
      const allowedPermissions = ["media", "mediaKeySystem", "fullscreen", "notifications"];
      callback(allowedPermissions.includes(permission));
    });

    // Set permission check handler for checking existing permissions
    webContents.session.setPermissionCheckHandler((_webContents, permission) => {
      const allowedPermissions = ["media", "mediaKeySystem", "fullscreen", "notifications"];
      return allowedPermissions.includes(permission);
    });
  });
}
