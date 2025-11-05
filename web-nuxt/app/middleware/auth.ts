export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, fetchUser } = useAuth();
  const token = useCookie("auth_token");

  if (!token.value) {
    return navigateTo("/login");
  }

  if (!isAuthenticated.value) {
    await fetchUser();
  }

  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});
