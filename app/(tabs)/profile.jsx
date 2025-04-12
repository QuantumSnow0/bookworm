import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { formatPublishDate } from "../../lib/utils";
import Card from "../../components/Card";
const Profile = () => {
  const { user, logout, token } = useAuthStore();
  const date = formatPublishDate(user?.createdAt);
  const [books, setBooks] = useState([]);

  const handleLogout = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logout ?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => await logout(),
          style: "destructive",
        },
      ]);
    } catch (error) {
      console.log("Error loging out:", error);
    }
  };
  const getBookbyUser = async () => {
    try {
      const response = await fetch(
        "https://react-native-bookworm-ytm8.onrender.com/api/books/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) return console.log("error fetching books");
      setBooks(data);
    } catch (error) {
      console.log("error fetching books:", error);
    }
  };
  useEffect(() => {
    getBookbyUser();
  }, []);
  return (
    <View className="flex-1 bg-[#e8f5e9] px-6 pt-5 ">
      <View
        className="flex flex-row items-center gap-4 p-10 bg-[#e8f5e9] rounded-xl"
        style={{
          shadowOffset: { width: 1, height: 1 },
          elevation: 10,
          shadowColor: "black",
        }}
      >
        <Image
          source={{ uri: user?.profileImage }}
          style={{ width: 80, height: 80 }}
        />
        <View className="flex gap-2">
          <Text className="text-2xl capitalize font-extrabold">
            {user?.username}
          </Text>
          <Text className="text-lg">{user?.email}</Text>
          <Text className="text-lg">member since {date}</Text>
        </View>
      </View>
      <TouchableOpacity className="w-full mt-5" onPress={handleLogout}>
        <View className="flex flex-row gap-2 p-4 items-center justify-center bg-green-500 rounded-xl">
          <Ionicons name="exit-outline" color="white" size={26} />
          <Text className="text-white text-2xl">Logout</Text>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row items-center mt-10 justify-between">
        <Text className="text-2xl text-green-900 font-extrabold">
          Your recommendations
        </Text>
        <Text className="text-xl font-bold text-slate-500">
          {books.length} books
        </Text>
      </View>
      <View className="flex-1 mt-5">
        <FlatList
          data={books}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <Card
              data={item}
              key={item._id}
              books={books}
              setBooks={(value) => setBooks(value)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Profile;
