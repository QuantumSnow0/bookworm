import { create } from "zustand"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../constants/api";
const API_CONFIG = {
    endpoint: (route) => `https://react-native-bookworm-ytm8.onrender.com/api/auth/${route}`,
    headers: { "Content-Type": "application/json" },
  
}
export const useAuthStore = create((set) => ({
   user: null,
   token: null,
   isLoading: false,
   isCheckingAuth: true,
   register: async(username, email, password) => {
    try {
        set({isLoading : true})
        const response = await fetch( API_CONFIG.endpoint("register"), {
            method: "POST",
            headers: API_CONFIG.headers,
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        const data = await response.json()
        if(!response.ok) throw new Error(data.message || "something went wrong")
        await AsyncStorage.setItem("user" , JSON.stringify(data.user))
        await AsyncStorage.setItem("token" , data.token)
        set({token: data.token, user: data.user, isLoading : false})
        return {
            success : true
        }
    } catch (error) {
        set({ isLoading : false})
        return {success : false, error: error.message}
    }
    },
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token")
            const userJson = await AsyncStorage.getItem("user")
            const user = userJson ? JSON.parse(userJson) : null 
            set({ token, user})
        } catch (error) {
            console.log("Error Auth check failed", error)
        
        } finally {
            set({isCheckingAuth: false})
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("user")
        set({user: null, token: null})
    },
    login: async (email, password) => {
        try {
            set({ isLoading: true })
            
            const response = await fetch(API_CONFIG.endpoint("login"), {
                method: "POST",
                headers: API_CONFIG.headers,
                body: JSON.stringify({
                    email,
                    password
                })
            })
            
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || "Invalid credentials");
             
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)
            set({user : data.user, token : data.token, isLoading: false})
            return {
                success: true
            }
        } catch (error) {
            set({isLoading : false})
           
            return {success : false, error: error.message}
        }
    }
}))