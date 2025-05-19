# Little Lemon Mobile App

![Little Lemon Banner](https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/little-lemon-banner.png)

A React Native mobile application for the Little Lemon restaurant, featuring a clean, modern UI with menu browsing, user profiles, authentication, and more.

## 📱 Screenshots

<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/little-lemon-home.png" alt="Home Screen" width="250" style="border-radius: 10px;"/>
  <img src="https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/little-lemon-menu.png" alt="Menu" width="250" style="border-radius: 10px;"/>
  <img src="https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/little-lemon-profile.png" alt="Profile" width="250" style="border-radius: 10px;"/>
</div>

## 🌟 Features

- **Authentication**: Email/password authentication with user registration and login
- **Menu Browsing**: View and filter restaurant menu items by category
- **Search**: Find menu items by name or description
- **User Profiles**: Create and manage your profile, including avatar uploads
- **Notification Preferences**: Manage your email notification settings
- **Responsive Design**: Beautiful UI that adapts to different device sizes
- **Offline Support**: Basic functionality works without an internet connection

## 🛠️ Technology Stack

- **React Native & Expo**: Core framework for cross-platform mobile development
- **Firebase**: Authentication and Firestore database for backend
- **Zustand**: Lightweight state management with a slice pattern
- **NativeWind**: Tailwind CSS for React Native styling
- **React Navigation**: Screen navigation and routing
- **Custom Hooks**: Business logic separation with custom React hooks

## 📂 Project Architecture

The app follows a modern, component-based architecture with a clear separation of concerns:

- **Components**: Reusable UI elements
  - **Forms**: Form-specific components 
  - **Layout**: Structural components
  - **UI**: Basic interface elements
- **Hooks**: Custom React hooks for business logic
- **Navigation**: Screen routing configuration
- **Screens**: Full-screen components
- **Store**: State management with Zustand
  - **Slices**: Modular state pieces
- **Utils**: Helper functions and constants

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/little-lemon.git
   cd little-lemon
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Register a web app in your Firebase project

4. Configure Firebase:
   - Copy your Firebase configuration from the console
   - Create a file at `src/firebase/firebase-config-local.js` with your config:
     ```javascript
     export default {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

5. Start the app:
   ```
   npm start
   ```

### Initial Data Migration

To populate the app with initial menu data:

1. Uncomment the data migration code in App.jsx:
   ```javascript
   /* React.useEffect(() => {
     const migrateData = async () => {
       try {
         setMigrating(true);
         await migrateMenuDataFromAPIToFirestore('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
         setMigrating(false);
       } catch (error) {
         console.error('Migration failed:', error);
         setMigrationError(error.message || 'Migration failed');
         setMigrating(false);
         Alert.alert('Data Migration Failed', 'There was an error migrating the initial menu data. Please try again later.');
       }
     };
     
     migrateData();
   }, []); */
   ```

2. Run the app once to migrate data, then comment the code back out

## 📊 Firebase Collections

- **menu_items**: Restaurant menu items
- **user_profiles**: User profile information 
- **notification_preferences**: User notification settings

## 🔨 Development

### Code Style

The project uses NativeWind (Tailwind CSS for React Native) for styling with class-based components:

```jsx
<View className="bg-primary p-4 rounded-lg">
  <Text className="text-white text-lg">Hello Little Lemon!</Text>
</View>
```

### State Management Pattern

The app uses Zustand with a slice pattern for modular state management:

```javascript
// Store slice example
const createAuthSlice = (set, get) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
});
```

### Component Philosophy

- Components should be focused, reusable, and single-purpose
- Business logic belongs in hooks, not components
- Use composition over inheritance
- Prefer functional components with hooks

## 🛡️ Security Notes

This project includes basic security features:

- Firebase Authentication for user management
- Firestore security rules for data access control
- Client-side input validation

For production use, consider implementing:
- Enhanced Firebase security rules
- Email verification
- Social auth providers
- Firebase Analytics for usage tracking
- Push notifications with Firebase Cloud Messaging

## 📝 Future Enhancements

- [ ] Ordering functionality
- [ ] Payment integration
- [ ] Table reservations
- [ ] User reviews and ratings
- [ ] Push notifications
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] TypeScript migration

## 🙏 Credits

- Restaurant imagery from [Meta Mobile Developer Course](https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API)
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ as a demonstration of React Native and Firebase development.
