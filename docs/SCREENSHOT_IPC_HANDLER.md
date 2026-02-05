# Screenshot IPC Handler Implementation Guide

## Overview
The Tasks page includes a screenshot capture button that requires an IPC handler to be implemented on the Electron main process side.

## Implementation Steps

### 1. Install Required Package
```bash
npm install screenshot-desktop
```

### 2. Add IPC Handler in `electron/main.ts`

Add the following code to your main process:

```typescript
import { ipcMain } from 'electron';
import screenshot from 'screenshot-desktop';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Add this handler in your main.ts file
ipcMain.handle('take-screenshot', async () => {
  try {
    // Capture screenshot
    const img = await screenshot();
    
    // Convert to base64
    const base64 = img.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    
    return {
      success: true,
      data: dataUrl
    };
  } catch (error) {
    console.error('Screenshot error:', error);
    return {
      success: false,
      error: 'Failed to capture screenshot'
    };
  }
});
```

### 3. Update `electron/preload.ts`

Add the screenshot method to the exposed API:

```typescript
contextBridge.exposeInMainWorld('electron', {
  // ... existing methods
  takeScreenshot: async (): Promise<{ success: boolean; data?: string; error?: string }> => {
    return ipcRenderer.invoke('take-screenshot');
  }
});
```

### 4. Update TypeScript Definitions

Update your `electron/electron-env.d.ts` or create type definitions:

```typescript
interface Window {
  electron: {
    // ... existing methods
    takeScreenshot: () => Promise<{ success: boolean; data?: string; error?: string }>;
  };
}
```

### 5. Update Tasks.tsx (already prepared)

The Tasks page already has a placeholder for the screenshot functionality:

```typescript
const handleScreenshot = async () => {
  try {
    const result = await window.electron.takeScreenshot();
    
    if (result.success && result.data) {
      setPreviewUrl(result.data);
      toast.success('Screenshot captured!');
    } else {
      toast.error(result.error || 'Failed to capture screenshot');
    }
  } catch (error) {
    toast.error('Failed to capture screenshot');
    console.error(error);
  }
};
```

## Alternative: Using Electron's Built-in API

Instead of `screenshot-desktop`, you can use Electron's built-in `desktopCapturer`:

```typescript
import { ipcMain, desktopCapturer } from 'electron';

ipcMain.handle('take-screenshot', async () => {
  try {
    const sources = await desktopCapturer.getSources({ 
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    
    if (sources.length > 0) {
      const screenshot = sources[0].thumbnail.toDataURL();
      return {
        success: true,
        data: screenshot
      };
    }
    
    return {
      success: false,
      error: 'No screen source available'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to capture screenshot'
    };
  }
});
```

## Testing

1. Start your application: `npm run dev`
2. Navigate to the Tasks page
3. Click "Add New Task"
4. Click the "Screenshot" button
5. The screenshot should be captured and displayed as a preview

## Notes

- Screenshots are stored as base64 data URLs in the todo items
- The current implementation stores screenshots in memory only
- For production, consider saving screenshots to disk and storing file paths instead
- Add error handling for permission issues on different platforms
