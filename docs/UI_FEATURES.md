# UI Features Guide

## 🎨 Color Theme

The application uses a beautiful, modern color scheme defined in `src/index.css`:

### Color Variables
```css
--color-primary: #6366f1 (Indigo)
--color-primary-dark: #4f46e5
--color-primary-light: #818cf8

--color-secondary: #8b5cf6 (Purple)
--color-accent: #ec4899 (Pink)
--color-success: #10b981 (Green)
--color-warning: #f59e0b (Amber)
--color-error: #ef4444 (Red)
```

These colors can be used in any component using Tailwind's bracket notation:
```tsx
<div className="bg-[--color-primary] text-[--color-secondary]">
```

## 🧭 Navigation System

### Sidebar Component
- **Location**: Left side, fixed position
- **Width**: 16rem (64px * 4)
- **Features**:
  - Gradient background (primary → primary-dark)
  - Active route highlighting with white background
  - Hover effects with transparency
  - User greeting at the top
  - Logout button at the bottom

### Navigation Items:
1. **Home** (🏠) - Dashboard and file upload demo
2. **Tasks** (📋) - Todo list manager
3. **Profile** (👤) - User profile page

## 🏠 Home Page Features

### Hero Section
- Personalized greeting based on time of day:
  - Morning (before 12 PM): "Good Morning"
  - Afternoon (12 PM - 6 PM): "Good Afternoon"
  - Evening (after 6 PM): "Good Evening"
- User's name display
- Rocket icon animation

### Quick Access Cards
- **My Tasks**: Navigate to task manager
- **My Profile**: View user profile
- **Status Card**: Account status indicator

### File Upload Demo
- Drag and drop support (UI ready)
- File size display
- Progress bar with gradient
- macOS Dock progress integration
- Chunked upload simulation

## ✅ Tasks Page Features

### Statistics Dashboard
Three cards showing:
1. **Total Tasks** - Total number of tasks
2. **Completed** - Tasks marked as done
3. **Pending** - Tasks still to do

### Task Management
- ✏️ **Create Tasks**: Modal dialog with textarea
- 🖼️ **Image Upload**: Attach images to tasks
- 📸 **Screenshot**: Capture and attach screenshots (IPC handler needed)
- ✅ **Mark Complete**: Toggle task completion status
- ✏️ **Edit**: Inline editing of task text
- 🗑️ **Delete**: Remove tasks with confirmation

### Task Modal Features
- Large text area for task description
- Image preview with remove button
- Two buttons:
  - "Upload Image": Select from file system
  - "Screenshot": Capture screen (needs IPC handler)
- Cancel/Save actions

### Task Display
- Checkbox for completion status
- Strike-through text for completed tasks
- Image thumbnail if attached
- Creation timestamp
- Edit and delete buttons
- Hover effects for interactivity

## 🎭 Design Patterns Used

### Cards
All content is organized in card layouts with:
- White background
- Subtle shadows
- Rounded corners (rounded-xl)
- Border with theme color
- Hover animations (lift effect)

### Buttons
Three main button styles:
1. **Primary**: Gradient background, white text
2. **Secondary**: Outlined with theme color
3. **Danger**: Red color for delete actions

### Animations
- Hover lift effect (transform translateY)
- Smooth color transitions
- Loading spinners
- Progress bar animations

### Icons
Using `react-icons` library (Font Awesome):
- Consistent sizing
- Theme-colored
- Contextual usage

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts adjust on smaller screens
- Sidebar remains fixed on desktop
- Content area scrollable
- Cards stack on mobile (grid-cols-1)
- Expand to 2-3 columns on larger screens

## 🎨 Usage Examples

### Using Theme Colors
```tsx
// Background colors
<div className="bg-[--color-primary]">

// Text colors
<span className="text-[--color-secondary]">

// Border colors
<div className="border-[--color-border]">
```

### Creating Cards
```tsx
<div className="bg-white p-6 rounded-xl shadow-sm border border-[--color-border] hover:shadow-lg transition-all">
  {/* Card content */}
</div>
```

### Gradient Backgrounds
```tsx
<div className="bg-linear-to-r from-[--color-primary] to-[--color-secondary]">
```

## 🔧 Customization

To change the color scheme:
1. Edit `src/index.css`
2. Modify the color variables in the `@theme` block
3. Changes will apply throughout the entire app

## 💡 Tips

- All pages automatically include the sidebar when authenticated
- Use toast notifications for user feedback (already integrated)
- Images are stored as Data URLs (base64)
- Tasks are stored in component state (consider adding persistence)
- Screenshot feature requires IPC handler implementation

## 🚀 Performance

- Optimized with React hooks
- Minimal re-renders
- Efficient state management
- Smooth animations with CSS transitions
- No unnecessary API calls
