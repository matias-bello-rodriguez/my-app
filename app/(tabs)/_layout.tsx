import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function RootLayout() {
  return(
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header estilo Facebook */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>AutoBox</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search" size={24} color="#1C1E21" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="chatbubble-outline" size={24} color="#1C1E21" />
          </TouchableOpacity>
        </View>
      </View>

      <Tabs screenOptions={{
        tabBarActiveTintColor:'coral',
        headerShown: false, // Ocultar el header de las tabs
      }}> 
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
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1877F2',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});