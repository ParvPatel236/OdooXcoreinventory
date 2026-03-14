import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_USER = {
  id: 'user_1',
  name: 'Admin User',
  email: 'admin@coreinventory.com',
  password: 'Admin@123',
  role: 'Inventory Manager',
  avatar: 'AU',
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      otpStore: null, // { email, otp, expiry }

      login: (email, password) => {
        if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
          set({ user: DEFAULT_USER, isAuthenticated: true });
          return { success: true };
        }
        // Check localStorage for signed up users
        const users = JSON.parse(localStorage.getItem('ci_users') || '[]');
        const found = users.find((u) => u.email === email && u.password === password);
        if (found) {
          set({ user: found, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password.' };
      },

      signup: (name, email, password, role) => {
        const users = JSON.parse(localStorage.getItem('ci_users') || '[]');
        if (users.find((u) => u.email === email) || email === DEFAULT_USER.email) {
          return { success: false, error: 'Email already registered.' };
        }
        const newUser = {
          id: `user_${Date.now()}`,
          name,
          email,
          password,
          role,
          avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
        };
        users.push(newUser);
        localStorage.setItem('ci_users', JSON.stringify(users));
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      sendOtp: (email) => {
        const users = JSON.parse(localStorage.getItem('ci_users') || '[]');
        const exists = users.find((u) => u.email === email) || email === DEFAULT_USER.email;
        if (!exists) return { success: false, error: 'No account found with this email.' };
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 5 * 60 * 1000;
        set({ otpStore: { email, otp, expiry } });
        return { success: true, otp }; // returning OTP for demo display
      },

      verifyOtp: (otp) => {
        const { otpStore } = get();
        if (!otpStore) return { success: false, error: 'No OTP requested.' };
        if (Date.now() > otpStore.expiry) return { success: false, error: 'OTP expired.' };
        if (otp !== otpStore.otp) return { success: false, error: 'Incorrect OTP.' };
        return { success: true };
      },

      resetPassword: (email, newPassword) => {
        if (email === DEFAULT_USER.email) {
          DEFAULT_USER.password = newPassword;
          return { success: true };
        }
        const users = JSON.parse(localStorage.getItem('ci_users') || '[]');
        const idx = users.findIndex((u) => u.email === email);
        if (idx === -1) return { success: false, error: 'User not found.' };
        users[idx].password = newPassword;
        localStorage.setItem('ci_users', JSON.stringify(users));
        set({ otpStore: null });
        return { success: true };
      },
    }),
    { name: 'ci_auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);
