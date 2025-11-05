import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return(
    <Tabs screenOptions={{tabBarActiveTintColor:'coral'}}> 
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home', 
          tabBarIcon: () => 
            (<FontAwesome5 name="home" size={24} color="black"/>), 
        }}
      />
      
      <Tabs.Screen 
        name="auth" 
        options={{
          title: 'auth',
          tabBarIcon: () => 
            (<FontAwesome5 name="sign-in-alt" size={24} color="black"/>),
        }}
      />
    </Tabs>
  )
}