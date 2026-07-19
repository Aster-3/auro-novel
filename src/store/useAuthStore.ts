import { create } from "zustand";

export interface UserMe {
  id: string;
  username: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  profileBackgroundImageUrl?: string;
  description?: string;
  gender?: "male" | "female" | "null" | null;
}

interface PremiumClaims {
  isPremium: boolean;
  premiumUntil: string | null;
  subscriptionTier: string | null;
  subscriptionPeriod: "monthly" | "yearly" | string | null;
}

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return globalThis.atob?.(padded);
};

const getPremiumClaimsFromToken = (token: string | null): PremiumClaims => {
  if (!token) {
    return {
      isPremium: false,
      premiumUntil: null,
      subscriptionTier: null,
      subscriptionPeriod: null,
    };
  }

  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return {
        isPremium: false,
        premiumUntil: null,
        subscriptionTier: null,
        subscriptionPeriod: null,
      };
    }

    const decoded = decodeBase64Url(payload);
    if (!decoded) {
      return {
        isPremium: false,
        premiumUntil: null,
        subscriptionTier: null,
        subscriptionPeriod: null,
      };
    }

    const claims = JSON.parse(decoded) as {
      isPremium?: boolean;
      premiumUntil?: string | null;
      subscriptionTier?: string | null;
      subscriptionPeriod?: string | null;
    };

    return {
      isPremium: claims.isPremium === true,
      premiumUntil: claims.premiumUntil ?? null,
      subscriptionTier: claims.subscriptionTier ?? null,
      subscriptionPeriod: claims.subscriptionPeriod ?? null,
    };
  } catch {
    return {
      isPremium: false,
      premiumUntil: null,
      subscriptionTier: null,
      subscriptionPeriod: null,
    };
  }
};

const initialState = {
  user: null,
  accessToken: null,
  isPremium: false,
  premiumUntil: null,
  subscriptionTier: null,
  subscriptionPeriod: null,
};

interface AuthState {
  user: UserMe | null;
  setUser: (user: UserMe) => void;
  accessToken: string | null;
  isPremium: boolean;
  premiumUntil: string | null;
  subscriptionTier: string | null;
  subscriptionPeriod: "monthly" | "yearly" | string | null;
  setAccessToken: (token: string | null) => void;
  setAuthSession: (payload: {
    user?: UserMe | null;
    accessToken: string | null;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setUser: (user: UserMe) => set({ user }),
  setAccessToken: (accessToken: string | null) =>
    set({ accessToken, ...getPremiumClaimsFromToken(accessToken) }),
  setAuthSession: ({ user, accessToken }) =>
    set((state) => ({
      user: user === undefined ? state.user : user,
      accessToken,
      ...getPremiumClaimsFromToken(accessToken),
    })),
  logout: () => set(initialState),
}));

export const isPremiumActive = (
  isPremium: boolean,
  premiumUntil: string | null,
) => {
  if (!isPremium || !premiumUntil) return false;
  return new Date(premiumUntil).getTime() > Date.now();
};
