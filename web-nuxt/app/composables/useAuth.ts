export const useAuth = () => {
  const user = useState<any>("user", () => null);
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isModerator = computed(
    () => user.value?.role === "moderator" || user.value?.role === "admin",
  );

  const login = async (username: string, password: string) => {
    const trpc = useTrpc();
    try {
      const result = await trpc.auth.login.mutate({ username, password });
      token.value = result.token;
      user.value = result.user;
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const trpc = useTrpc();
    try {
      const result = await trpc.auth.register.mutate(data);
      token.value = result.token;
      user.value = result.user;
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    navigateTo("/login");
  };

  const fetchUser = async () => {
    if (!token.value) return;

    const trpc = useTrpc();
    try {
      const currentUser = await trpc.auth.me.query();
      user.value = currentUser;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      token.value = null;
      user.value = null;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    isModerator,
    login,
    register,
    logout,
    fetchUser,
  };
};
