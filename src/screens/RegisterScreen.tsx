import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { RegisterHeader } from "@/Features/RegisterScreen/RegisterHeader";
import { RegisterForm } from "@/Features/RegisterScreen/RegisterForm";
import masqoute from "@assets/masqoute.png";
import { Image } from "expo-image";

const RegisterScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <RegisterHeader />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <RegisterForm />
          <View style={styles.mosqouteContainer}>
            <Image
              source={masqoute}
              style={{ width: 100, height: 100, objectFit: "contain" }}
            />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  mosqouteContainer: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default RegisterScreen;
