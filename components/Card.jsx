import {
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatPublishDate } from "../lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
const Card = ({ data, setBooks, books }) => {
  const { token } = useAuthStore();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= data.rating ? "star" : "star-outline"}
          color={i <= data.rating ? "#faac02" : null}
          size={20}
        />
      );
    }
    return stars;
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://192.168.189.31:3000/api/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) return Alert.alert("Error", "unable to delete");
      Alert.alert("Success", "book deleted successfully");
      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      console.log("error deleting content");
    }
  };
  return (
    <View className="flex  shadow shadow-black bg-white  rounded-xl mb-5">
      <View className="flex flex-row items-center justify-between p-5">
        <View className="flex items-center flex-row gap-4">
          <Image
            source={data?.image}
            style={{
              width: 80,
              height: 120,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 20,
            }}
            contentFit="cover"
          />
          <View className="flex flex-col gap-1 overflow-hidden max-w-[200px]">
            <View className="flex flex-col gap-2">
              <View>
                <Text className="text-xl overflow-hidden capitalize font-extrabold text-green-900">
                  {data?.title}
                </Text>
                <View className="flex flex-row gap-1">{renderStars()}</View>
                <Text
                  numberOfLines={2}
                  className="overflow-hidden flex text-bold text-lg"
                >
                  {data?.caption}
                </Text>
              </View>
              <Text className="text-xl text-slate-500">
                {formatPublishDate(data.createdAt)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => handleDelete(data._id)}>
          <AntDesign name="delete" size={24} color="black" />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Card;
