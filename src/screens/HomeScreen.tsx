import { View, ScrollView } from "react-native";
import { Screen } from "../components/layout/Screen";
import { FakeSearchBar } from "../components/fakeSearchBar";
import { HomeCarousel } from "../Features/HomeScreen/Carousel";
import { WeeklyPopular } from "../Features/HomeScreen/WeeklySeries";
import { UpdatedSeries } from "@/Features/HomeScreen/UpdatedSeries";
import { Categories } from "@/Features/HomeScreen/Categories";
import { BestofCategory } from "@/Features/HomeScreen/BestofCategory";
import { RecenltyAdded } from "@/Features/HomeScreen/RecenltyAdded";
const HomeScreen = () => {
  return (
    <Screen style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginBottom: 16 }}>
        <FakeSearchBar />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 28, paddingBottom: 120 }}
      >
        <HomeCarousel />
        <WeeklyPopular />
        <UpdatedSeries />
        <Categories />
        <BestofCategory />
        <RecenltyAdded />
      </ScrollView>
    </Screen>
  );
};
export default HomeScreen;
