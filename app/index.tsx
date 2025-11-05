import { Redirect } from "expo-router";

export default function Index() {
  const isAuth = false; // Tu lógica de autenticación aquí

  if (isAuth) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth" />;
}