import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext.js';
import { authService } from '../services/auth.service.js';
import { tokenService } from '../services/token.service.js';
import { toast } from 'sonner';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      if (!tokenService.get()) {
        setUser(null);
        return;
      }

      const response = await authService.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Unable to verify your session');
      }
    } catch (error) {
      if (error.status === 401) {
        tokenService.clear();
      } else {
        toast.error(error.message || 'Unable to verify your session');
      }
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]);

  const establishSession = useCallback((response, failureMessage, successMessage) => {
    const session = response?.data;
    if (!response?.success || !session?.user || !session.token) {
      return { success: false, message: response?.message || failureMessage };
    }

    tokenService.set(session.token);
    setUser(session.user);
    toast.success(successMessage);
    return { success: true, user: session.user };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      return establishSession(response, 'Login failed', 'Welcome back!');
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }, [establishSession]);

  const register = useCallback(async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      const result = establishSession(
        response,
        'Registration failed',
        'Account created successfully!'
      );
      return result.success ? { success: true } : result;
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  }, [establishSession]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      tokenService.clear();
      setUser(null);
      toast.success('Logged out successfully');
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast.success('Profile updated');
        return { success: true };
      }
      return { success: false, message: response.message || 'Update failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Update failed' };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      if (response.success) {
        toast.success('Password changed');
        return { success: true };
      }
      return { success: false, message: response.message || 'Password change failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Password change failed' };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      initialized,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }),
    [user, loading, initialized, login, register, logout, updateProfile, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
