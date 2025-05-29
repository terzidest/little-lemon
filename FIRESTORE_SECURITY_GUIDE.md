# 🔒 Firestore Security Rules for Demo/Portfolio Project

## Overview
These rules are specifically designed for a **demo/portfolio project** that will be shared publicly via Expo Go. They balance functionality with security to prevent abuse while allowing potential clients to experience the app.

## Key Security Features

### 1. **Public Menu Access**
- Menu items are read-only for all users (even unauthenticated)
- Allows demo users to browse without creating an account
- No write access to prevent menu tampering

### 2. **Authenticated User Features**
- Users can only read/write their own profile data
- Profile updates are rate-limited (5-second cooldown)
- Data size validation to prevent storage abuse
- No deletion allowed to prevent accidental data loss

### 3. **Data Validation**
- Profile fields are validated (firstName, lastName, email required)
- String length limits (50 characters max)
- Document size limits to prevent abuse
- Strict data structure enforcement

### 4. **Rate Limiting**
- Updates throttled to prevent spam
- Helps control Firebase usage costs
- Prevents potential DoS attempts

## Deployment Steps

1. **Deploy the rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Test the rules:**
   ```bash
   firebase emulators:start --only firestore
   ```

3. **Monitor usage in Firebase Console:**
   - Check Firestore usage metrics
   - Monitor for any security rule denials
   - Track daily read/write operations

## Additional Demo Recommendations

### 1. **Set Firebase Quotas**
In Firebase Console > Settings > Usage and billing:
- Set daily spending limits
- Enable budget alerts
- Monitor usage regularly

### 2. **Demo Data Setup**
Create sample menu items in Firestore:
```javascript
// Example menu item structure
{
  name: "Greek Salad",
  description: "Fresh vegetables, feta cheese, olives",
  price: 12.99,
  category: "starters",
  image: "greek-salad.jpg"
}
```

### 3. **Demo Account (Optional)**
Consider creating a demo account for clients:
- Email: demo@littlelemon.com
- Password: DemoPass123!
- Pre-populated with sample data

### 4. **Monitoring**
- Enable Firebase Analytics
- Set up Cloud Monitoring alerts
- Track authentication events

### 5. **Expiration Strategy**
For long-term demos, consider:
- Periodic data cleanup (delete old demo accounts)
- Set Firestore rules to expire after demo period
- Use Firebase App Check for additional security

## Security Best Practices for Demo

1. **Never share:**
   - Firebase service account keys
   - Admin credentials
   - Firebase config with admin permissions

2. **Always monitor:**
   - Daily active users
   - Firestore read/write operations
   - Storage usage (if implementing avatar uploads)

3. **Consider implementing:**
   - reCAPTCHA for registration (prevent bot signups)
   - Email verification (reduce fake accounts)
   - Session limits (auto-logout after inactivity)

## Cost Optimization

To minimize Firebase costs for your demo:
1. Use Firestore indexes efficiently
2. Implement client-side caching
3. Lazy load images
4. Set up billing alerts
5. Use Firebase's free tier limits:
   - 50K reads/day
   - 20K writes/day
   - 20K deletes/day

## Quick Commands

```bash
# Deploy rules
firebase deploy --only firestore:rules

# Test rules locally
firebase emulators:start

# View rule coverage
firebase firestore:rules:coverage

# Check deployment status
firebase deploy:list
```

## Emergency Shutdown

If you notice abuse or excessive usage:
```javascript
// Temporary lockdown rules
match /{document=**} {
  allow read, write: if false;
}
```

Then investigate and fix the issue before re-enabling access.
