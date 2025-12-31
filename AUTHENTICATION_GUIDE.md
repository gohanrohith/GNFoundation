# Authentication & Session Management Guide

## Overview
The GN Foundation admin panel uses JWT-based authentication with automatic session expiry after 15 minutes of inactivity.

---

## Security Features

### 1. JWT Token Authentication
- **Technology**: JSON Web Tokens (JWT)
- **Expiration**: 15 minutes from login
- **Storage**: Browser localStorage
- **Secret**: Configurable via environment variable

### 2. Inactivity Tracking
- **Timeout**: 15 minutes of inactivity
- **Activity Detection**: Mouse movements, keyboard input, clicks, scroll, touch events
- **Auto-Logout**: User is automatically logged out after 15 minutes of no activity
- **Warning**: User receives a warning 1 minute before session expires

### 3. Session Validation
- **Continuous Monitoring**: Session validity checked every 60 seconds
- **Route Protection**: Authentication verified on every route change
- **Token Expiry**: Sessions automatically expire after timeout period

---

## How It Works

### Login Flow

```
1. User enters credentials
   ↓
2. Server validates against environment variables
   ↓
3. Server generates JWT token (15min expiry)
   ↓
4. Token stored in localStorage with timestamp
   ↓
5. User redirected to admin panel
```

### Activity Tracking

```
User Activity (mouse, keyboard, etc.)
   ↓
updateActivity() called
   ↓
localStorage timestamp updated
   ↓
Session timer resets
```

### Auto-Logout Flow

```
15 minutes of inactivity
   ↓
validateToken() returns false
   ↓
Toast notification: "Session Expired"
   ↓
User redirected to login page
```

---

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```bash
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# JWT Secret (use a long random string)
JWT_SECRET=your_very_secure_random_string_here_minimum_32_characters
```

**Security Note**:
- Never commit `.env.local` to version control
- Use a strong, random JWT secret (minimum 32 characters)
- Change default admin password immediately

---

## API Endpoints

### POST `/api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900000
}
```

**Error Response:**
```json
{
  "error": "Invalid username or password"
}
```

---

## User Experience Features

### 1. Session Expiry Warning
Users receive a toast notification **1 minute before** their session expires:

> **Session Expiring Soon**
> Your session will expire in 1 minute due to inactivity. Move your mouse or click to stay logged in.

### 2. Auto-Logout Notification
When session expires, users see:

> **Session Expired**
> You have been logged out due to 15 minutes of inactivity.

### 3. Loading States
- Skeleton loading animation while verifying authentication
- Prevents flashing admin content to unauthorized users

---

## Implementation Details

### Files Modified

1. **`src/app/api/auth/login/route.ts`**
   - Generates JWT tokens with 15-minute expiry
   - Validates credentials against environment variables
   - Returns token and expiration time

2. **`src/hooks/use-auth.ts`** (NEW)
   - Custom React hook for session management
   - Tracks user activity (mouse, keyboard, touch, scroll)
   - Validates token expiration
   - Auto-logout after 15 minutes of inactivity
   - Provides authentication state to components

3. **`src/app/login/_components/login-form.tsx`**
   - Stores JWT token using `setAuthToken()` helper
   - Redirects to admin panel on successful login

4. **`src/app/admin/layout.tsx`**
   - Uses `useAuth()` hook for authentication
   - Shows session expiry warning (14 minutes)
   - Displays loading skeleton during auth check

5. **`src/app/admin/page.tsx`**
   - Uses `logout()` function from auth hook
   - Proper session cleanup on logout button click

---

## Security Best Practices

### ✅ Implemented
- JWT token with expiration
- Inactivity timeout (15 minutes)
- Secure token storage (localStorage)
- HTTPS required in production
- Password stored in environment variables
- Session validation on route changes
- Activity-based session renewal

### ⚠️ Recommendations for Production

1. **HTTPS Only**: Never use HTTP in production
2. **Strong Passwords**: Use complex admin passwords (20+ characters)
3. **Rotate Secrets**: Change JWT_SECRET periodically
4. **Rate Limiting**: Add rate limiting to login endpoint
5. **Audit Logging**: Log all authentication attempts
6. **Multi-Factor Auth**: Consider adding 2FA for additional security
7. **Secure Headers**: Add security headers (CSP, HSTS, etc.)

---

## Troubleshooting

### Issue: "Session keeps expiring too quickly"
**Solution**: Check that activity listeners are working. Open DevTools Console and verify activity events are firing.

### Issue: "Can't login - Invalid token"
**Solution**:
1. Check that `JWT_SECRET` is set in `.env.local`
2. Ensure `.env.local` is in the project root directory
3. Restart the development server after changing environment variables

### Issue: "Logged out when switching tabs"
**Solution**: This is expected behavior if you're inactive for 15 minutes across all tabs. Activity tracking works across tabs, but you need to interact with the page to reset the timer.

### Issue: "Warning appears immediately after login"
**Solution**: The warning timer should start 14 minutes after login. Check browser console for errors. Clear localStorage and try logging in again.

---

## Testing the Authentication

### Manual Testing Steps

1. **Login Test**
   ```
   - Navigate to /login
   - Enter credentials
   - Should redirect to /admin
   - Token should be in localStorage
   ```

2. **Activity Tracking Test**
   ```
   - Login successfully
   - Move mouse around
   - Check localStorage 'admin-last-activity' timestamp updates
   ```

3. **Auto-Logout Test**
   ```
   - Login successfully
   - Don't interact with page for 15 minutes
   - Should see "Session Expired" notification
   - Should redirect to /login
   ```

4. **Session Warning Test**
   ```
   - Login successfully
   - Wait 14 minutes
   - Should see "Session Expiring Soon" notification
   - Move mouse to reset timer
   ```

5. **Manual Logout Test**
   ```
   - Login successfully
   - Click "Logout" button
   - Should redirect to /login
   - localStorage should be cleared
   ```

---

## Code Examples

### Using the Auth Hook in Components

```typescript
import { useAuth } from '@/hooks/use-auth';

export default function MyComponent() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Checking Authentication Without Hook

```typescript
import { isUserAuthenticated } from '@/hooks/use-auth';

// Use in utility functions or outside React components
if (isUserAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}
```

---

## Activity Events Tracked

The following user interactions reset the inactivity timer:

- **Mouse Events**: `mousedown`, `click`
- **Keyboard Events**: `keydown`
- **Touch Events**: `touchstart` (mobile)
- **Scroll Events**: `scroll`

**Note**: Simply having the tab open in the background does NOT reset the timer. User must actively interact with the page.

---

## Session Duration

| Duration | Event |
|----------|-------|
| 0:00 | User logs in |
| 0:00 - 14:00 | Active session |
| 14:00 | Warning toast appears |
| 14:00 - 15:00 | Grace period (still logged in) |
| 15:00 | Auto-logout + Error toast |
| 15:00+ | Redirected to login page |

---

## Migration from Old System

### Old System (Insecure)
```typescript
// Just stored 'true' in localStorage
localStorage.setItem('admin-auth-token', 'true');

// No expiration, no security
if (localStorage.getItem('admin-auth-token') === 'true') {
  // User stays logged in forever
}
```

### New System (Secure)
```typescript
// Stores JWT token with expiration
const token = jwt.sign({ ... }, secret, { expiresIn: '15m' });
localStorage.setItem('admin-auth-token', token);
localStorage.setItem('admin-last-activity', Date.now());

// Validates token and inactivity
if (validateToken() && !isInactive()) {
  // User is authenticated
}
```

---

## Future Enhancements

### Potential Improvements

1. **Remember Me**: Add option to extend session to 7 days
2. **Session History**: Track login history and active sessions
3. **Device Management**: View and revoke sessions from other devices
4. **IP Whitelisting**: Restrict admin access to specific IPs
5. **Brute Force Protection**: Lock account after failed attempts
6. **Email Notifications**: Alert on new login from unknown device
7. **API Key Authentication**: Alternative auth for programmatic access

---

**Last Updated**: 2025-12-30
**Version**: 2.0.0
**Security Level**: Medium (suitable for internal admin panels)

---

## Support

For security issues or questions about authentication:
1. Check this guide first
2. Review `src/hooks/use-auth.ts` implementation
3. Check browser console for errors
4. Verify environment variables are set correctly
5. Restart development server after changes
