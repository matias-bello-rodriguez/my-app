import { Ionicons } from '@expo/vector-icons';
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
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#4CAF50" 
        translucent={false}
      />
      
      {/* Header estilo Facebook */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>AutoBox</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Tabs screenOptions={{
        tabBarActiveTintColor:'#FFFFFF',
        tabBarInactiveTintColor:'#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#4CAF50',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        headerShown: false, // Ocultar el header de las tabs
      }}> 
        <Tabs.Screen 
          name="index" 
          options={{
            title: 'Inicio', 
            tabBarIcon: ({ color, focused }) => 
              (<Ionicons name={focused ? "home" : "home-outline"} size={24} color={color}/>), 
          }}
        />
        
        <Tabs.Screen 
          name="inspections" 
          options={{
            title: 'Inspecciones',
            tabBarIcon: ({ color, focused }) => 
              (<Ionicons name={focused ? "checkmark-circle" : "checkmark-circle-outline"} size={24} color={color}/>),
          }}
        />

        <Tabs.Screen 
          name="publish" 
          options={{
            title: 'Vender',
            tabBarIcon: ({ color, focused }) => 
              (<Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={24} color={color}/>),
          }}
        />
        
        <Tabs.Screen 
          name="auth" 
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, focused }) => 
              (<Ionicons name={focused ? "person" : "person-outline"} size={24} color={color}/>),
          }}
        />

        <Tabs.Screen 
          name="menu" 
          options={{
            title: 'Menú',
            tabBarIcon: ({ color, focused }) => 
              (<Ionicons name={focused ? "menu" : "menu-outline"} size={24} color={color}/>),
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
    paddingTop: 50, // Espacio para la status bar de iOS
    backgroundColor: '#4CAF50',
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
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});