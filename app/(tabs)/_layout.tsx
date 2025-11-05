import { Tabs } from "expo-router";

export default function RootLayout() {
  return(
  <Tabs> 

    <Tabs.Screen name = "index" options={{title: 'Home'}}></Tabs.Screen>
    <Tabs.Screen name = "login" options={{title: 'Login'}}></Tabs.Screen>


  </Tabs>)
}
