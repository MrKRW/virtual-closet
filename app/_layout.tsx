import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#000000' }}>
      
      {/* Tab 1: The Home Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Closet',
          tabBarIcon: ({ color }) => <Ionicons name="shirt-outline" size={24} color={color} />,
          headerShown: false, // Hides the default header because we built a custom one
        }}
      />
      
      {/* Tab 2: The Add Item Screen */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Item',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={24} color={color} />,
        }}
      />

    </Tabs>
  );
}