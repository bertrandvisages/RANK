import React from 'react';
import { Frame } from '@nativescript/core';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { useAuth } from './hooks/useAuth';

const Stack = createNativeStackNavigator();

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen 
            name="Login" 
            component={LoginPage}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Dashboard"
            component={DashboardPage}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}