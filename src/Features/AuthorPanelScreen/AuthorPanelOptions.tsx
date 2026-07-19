import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { CreateNovelIcon } from "@/components/icons/CreateNovelIcon";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useAppTheme } from "@/hooks/useTheme";
import {
  useAuthorMeQuery,
  useCreateAuthorMutation,
} from "@/hooks/useAuthorMeQuery";

const MENU_OPTIONS = [
  {
    id: "create_novel",
    label: "Yeni Roman Oluştur",
    icon: CreateNovelIcon,
  },
];

export const AuthorPanelOptions = () => {
  const { theme, isDarkMode } = useAppTheme();
  const authorMeQuery = useAuthorMeQuery();
  const createAuthorMutation = useCreateAuthorMutation();

  const handleCreateNovelPress = async () => {
    const authorMe = authorMeQuery.data ?? (await authorMeQuery.refetch()).data;

    if (authorMe?.isAuthor) {
      globalNavigate("CreateNovel");
      return;
    }

    createAuthorMutation.mutate(undefined, {
      onSuccess: () => globalNavigate("CreateNovel"),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {MENU_OPTIONS.map((option) => {
        const Icon = option.icon;

        return (
          <Pressable
            key={option.id}
            onPress={handleCreateNovelPress}
            disabled={createAuthorMutation.isPending || authorMeQuery.isFetching}
            style={({ pressed }) => [
              styles.optionRow,
              {
                backgroundColor: pressed
                  ? isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#f0f0f0"
                  : "transparent",
                opacity:
                  createAuthorMutation.isPending || authorMeQuery.isFetching
                    ? 0.55
                    : pressed
                      ? 0.82
                      : 1,
              },
            ]}
          >
            <View style={styles.leftContent}>
              <View style={[styles.iconContainer]}>
                <Icon size={18} color={theme.textPrimary} />
              </View>
              <Text style={[styles.label, { color: theme.textPrimary }]}>
                {option.label}
              </Text>
            </View>
            <RightArrowIcon size={16} color={theme.textSecondary} />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 20,
  },
  optionRow: {
    width: "100%",
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 12,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontFamily: "Mont-500",
    fontSize: 14,
  },
});
