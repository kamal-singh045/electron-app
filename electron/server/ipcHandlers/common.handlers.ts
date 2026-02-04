export function setDockProgressHandler(window: Electron.BrowserWindow | null, progress: number) {
  if (!window) return;
  if (progress < 0) {
    window.setProgressBar(-1); // Reset progress
  } else {
    window.setProgressBar(progress);
  }
}
