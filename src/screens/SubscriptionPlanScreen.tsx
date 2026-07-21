import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/Header";
import { useAppTheme } from "@/hooks/useTheme";
import { isPremiumActive, useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";

type SvgIconProps = {
  color: string;
  size?: number;
};

const TicketIcon = ({ color, size = 24 }: SvgIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3.8"
      y="6"
      width="16.4"
      height="12"
      rx="3"
      stroke={color}
      strokeWidth="1.6"
    />
    <Path
      d="M8 10H15.2"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path d="M8 14H12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Circle cx="5.8" cy="12" r="1" fill={color} />
    <Circle cx="18.2" cy="12" r="1" fill={color} />
  </Svg>
);

const AdFreeIcon = ({ color, size = 24 }: SvgIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4.2"
      y="5.4"
      width="15.6"
      height="13.2"
      rx="3"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.4 8.8L16.6 15.2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M8.2 15.1L11 9H13L15.8 15.1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const OfflineIcon = ({ color, size = 24 }: SvgIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4.8V14.1"
      stroke={color}
      strokeWidth="1.55"
      strokeLinecap="round"
    />
    <Path
      d="M8.6 10.9L12 14.3L15.4 10.9"
      stroke={color}
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.7 18H18.3"
      stroke={color}
      strokeWidth="1.55"
      strokeLinecap="round"
    />
    <Path
      d="M7.2 7.8C8.45 6.65 10.12 5.95 12 5.95C13.88 5.95 15.55 6.65 16.8 7.8"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      opacity="0.55"
    />
  </Svg>
);

const CheckIcon = ({ color, size = 18 }: SvgIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M4 9.2L7.25 12.45L14 5.75"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Barcode = ({ color }: { color: string }) => (
  <Svg width={122} height={38} viewBox="0 0 122 38" fill="none">
    {[
      0, 4, 9, 15, 18, 25, 31, 35, 42, 48, 53, 59, 63, 70, 76, 81, 88, 92, 99,
      105, 112, 117,
    ].map((x, index) => (
      <Rect
        key={`${x}-${index}`}
        x={x}
        y={3}
        width={index % 3 === 0 ? 2 : 1}
        height={32}
        fill={color}
        opacity={index % 4 === 0 ? 0.95 : 0.62}
      />
    ))}
  </Svg>
);

const RouteArrow = ({ color, accent }: { color: string; accent: string }) => (
  <Svg width={82} height={14} viewBox="0 0 82 14" fill="none">
    <Circle cx="6" cy="7" r="3" fill={accent} />
    <Line x1="12" y1="7" x2="72" y2="7" stroke={color} strokeWidth="1" />
    <Path
      d="M72 7L66 3M72 7L66 11"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </Svg>
);

const plans = [
  {
    id: "monthly",
    label: "Aylık",
    price: "69,99 TL",
    period: "/ ay",
    note: "Esnek destek planı.",
    badge: undefined,
  },
  {
    id: "yearly",
    label: "Yıllık",
    price: "839,88 TL",
    period: "/ yıl",
    note: "Uzun vadeli destek için.",
    badge: "Önerilen",
  },
] as const;

const benefits = [
  {
    icon: AdFreeIcon,
    title: "Reklamsız okuma",
    description: "Okuma ve keşif akışında reklam gösterilmez.",
  },
  {
    icon: OfflineIcon,
    title: "Offline okuma",
    description: "İndirdiğin bölümleri bağlantı olmadan da okuyabilirsin.",
  },
] as const;

const formatPassDate = (date: Date) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

const formatPremiumUntil = (premiumUntil: string | null) => {
  if (!premiumUntil) return "Belirsiz";

  const date = new Date(premiumUntil);
  if (Number.isNaN(date.getTime())) return "Belirsiz";

  return formatPassDate(date);
};

const getSubscriptionPeriodLabel = (period: string | null) => {
  if (period === "monthly") return "AYLIK";
  if (period === "yearly") return "YILLIK";
  return null;
};

const getPremiumStartDate = (
  premiumUntil: string | null,
  subscriptionPeriod: string | null,
) => {
  if (!premiumUntil) return null;

  const endDate = new Date(premiumUntil);
  if (Number.isNaN(endDate.getTime())) return null;

  const startDate = new Date(endDate);
  if (subscriptionPeriod === "monthly") {
    startDate.setMonth(startDate.getMonth() - 1);
    return startDate;
  }

  if (subscriptionPeriod === "yearly") {
    startDate.setFullYear(startDate.getFullYear() - 1);
    return startDate;
  }

  return null;
};

const SubscriptionPlanScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const subscriptionTier = useAuthStore((state) => state.subscriptionTier);
  const subscriptionPeriod = useAuthStore((state) => state.subscriptionPeriod);
  const isLoggedIn = !!user;
  const hasActivePremium = isPremiumActive(isPremium, premiumUntil);
  const [selectedPlanId, setSelectedPlanId] =
    useState<(typeof plans)[number]["id"]>("yearly");

  useEffect(() => {
    if (!__DEV__) return;

    console.log("Auro Pass Premium Status:", {
      userId: user?.id ?? null,
      isPremium,
      premiumUntil,
      subscriptionTier,
      subscriptionPeriod,
      hasActivePremium,
    });
  }, [
    hasActivePremium,
    isPremium,
    premiumUntil,
    subscriptionPeriod,
    subscriptionTier,
    user?.id,
  ]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
    [selectedPlanId],
  );

  const passDates = useMemo(() => {
    if (hasActivePremium) {
      const startDate = getPremiumStartDate(premiumUntil, subscriptionPeriod);

      return {
        start: startDate ? formatPassDate(startDate) : "Belirsiz",
        end: formatPremiumUntil(premiumUntil),
      };
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    if (selectedPlanId === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    return {
      start: formatPassDate(startDate),
      end: formatPassDate(endDate),
    };
  }, [hasActivePremium, premiumUntil, selectedPlanId, subscriptionPeriod]);

  const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "#E3E8EF";
  const mutedBorder = isDarkMode ? "rgba(255,255,255,0.07)" : "#EEF2F7";
  const ticketBg = isDarkMode ? theme.surface : "#FFFFFF";
  const softBg = isDarkMode ? "rgba(255,255,255,0.04)" : "#F8FAFC";
  const selectedBg = isDarkMode ? "rgba(13, 12, 40, 0.9)" : "#F1F6FF";
  const accentStart = hasActivePremium
    ? isDarkMode
      ? "#8B6CFF"
      : "#8B6CFF"
    : isDarkMode
      ? "#4C6FFF"
      : "#4C6FFF";
  const accentEnd = hasActivePremium
    ? isDarkMode
      ? "#E58CFA"
      : "#E58CFA"
    : isDarkMode
      ? "#57D3F4"
      : "#57D3F4";
  const ctaTextColor = isDarkMode ? theme.background : "#FFFFFF";
  const ticketOwner = user?.nickname?.trim() || "Giriş gerekli";
  const passCode = user?.id ? `#${user.id.slice(-6)}` : "#000000";
  const subscriptionPeriodLabel =
    getSubscriptionPeriodLabel(subscriptionPeriod);
  const currentPlanLabel = hasActivePremium ? "PREMİUM" : "STANDART";
  const targetPlanLabel = hasActivePremium ? "AKTİF" : "PREMİUM";
  const routeTargetLabel = hasActivePremium ? "DURUM" : "GEÇİŞ";
  const stubTitle = hasActivePremium
    ? "Premium Auro Pass"
    : `${selectedPlan.label} Auro Pass`;
  const stubNote = hasActivePremium
    ? "Auro Pass üyeliğin aktif. Reklamsız ve offline okuma ayrıcalıkları kullanılabilir."
    : "Satın alma akışı ödeme altyapısı bağlandığında açılacak.";

  const handleContinue = () => {
    if (!isLoggedIn) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "Auro Pass satın almak için lütfen önce giriş yapın.",
      });
      return;
    }

    useToastStore.getState().showToast({
      type: "Bilgi",
      message: `${selectedPlan.label} Auro Pass ödeme akışı yakında bağlanacak.`,
    });
  };

  return (
    <Screen backgroundColor={theme.background}>
      <Header title="Auro Pass" isAdjacent={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.ticket,
            {
              backgroundColor: ticketBg,
              borderColor,
              shadowColor: isDarkMode ? "#000000" : "#1B2838",
            },
          ]}
        >
          <LinearGradient
            colors={[accentStart, accentEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ticketBand}
          >
            <Text style={styles.bandBrand}>AURO PASS</Text>
            <Text style={styles.bandText}>{passCode}</Text>
          </LinearGradient>

          <View style={styles.ticketMain}>
            <View style={styles.ticketTop}>
              <View style={styles.passengerBlock}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  BİLET SAHİBİ
                </Text>
                <Text
                  style={[styles.passengerName, { color: theme.textPrimary }]}
                >
                  {ticketOwner}
                </Text>
              </View>

              <View
                style={[
                  styles.passIcon,
                  { backgroundColor: softBg, borderColor: mutedBorder },
                ]}
              >
                <TicketIcon color={theme.accent} />
              </View>
            </View>

            <View style={[styles.routeBox, { borderColor: mutedBorder }]}>
              <View style={styles.routeItem}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  MEVCUT
                </Text>
                <Text style={[styles.routeValue, { color: theme.textPrimary }]}>
                  {currentPlanLabel}
                </Text>
              </View>
              <View style={styles.routeLine}>
                <RouteArrow color={theme.textSecondary} accent={theme.accent} />
              </View>

              <View style={styles.routeItem}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  {routeTargetLabel}
                </Text>
                <Text style={[styles.routeValue, { color: theme.textPrimary }]}>
                  {targetPlanLabel}
                </Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCell}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  REKLAMSIZ
                </Text>
                <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                  Okuma alanı
                </Text>
              </View>
              <View style={styles.infoCell}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  ÇEVRİMDIŞI
                </Text>
                <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                  Bölüm indirme
                </Text>
              </View>
              <View style={styles.infoCell}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  BAŞLANGIÇ
                </Text>
                <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                  {passDates.start}
                </Text>
              </View>
              <View style={styles.infoCell}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  BİTİŞ
                </Text>
                <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                  {passDates.end}
                </Text>
              </View>
            </View>

            <Text style={[styles.ticketText, { color: theme.textSecondary }]}>
              Auro Pass; uygulamanın bakımını, altyapısını ve geliştirme
              sürecini sürdürülebilir hale getirmek için hazırlanmıştır.
            </Text>
          </View>

          <View style={styles.perforation}>
            <View
              style={[
                styles.cutout,
                styles.cutoutLeft,
                { backgroundColor: theme.background, borderColor },
              ]}
            />
            <View style={[styles.dashLine, { borderTopColor: borderColor }]} />
            <View
              style={[
                styles.cutout,
                styles.cutoutRight,
                { backgroundColor: theme.background, borderColor },
              ]}
            />
          </View>

          <View style={styles.stub}>
            <View style={styles.stubText}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                OKUMA KARTI
              </Text>
              <Text style={[styles.stubTitle, { color: theme.textPrimary }]}>
                {stubTitle}
              </Text>
              <Text style={[styles.stubNote, { color: theme.textSecondary }]}>
                {stubNote}
              </Text>
            </View>

            <View style={styles.stubCode}>
              <Barcode color={theme.textPrimary} />
              {hasActivePremium ? (
                subscriptionPeriodLabel ? (
                  <Text
                    style={[
                      styles.stubActivePeriod,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {subscriptionPeriodLabel}
                  </Text>
                ) : null
              ) : (
                <Text style={[styles.stubPrice, { color: theme.textPrimary }]}>
                  {selectedPlan.price}
                  <Text
                    style={[styles.stubPeriod, { color: theme.textSecondary }]}
                  >
                    {" "}
                    {selectedPlan.period}
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </View>

        {!hasActivePremium && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Plan seçimi
            </Text>

            <View style={styles.planList}>
              {plans.map((plan) => {
                const isSelected = plan.id === selectedPlanId;

                return (
                  <Pressable
                    key={plan.id}
                    onPress={() => setSelectedPlanId(plan.id)}
                    style={({ pressed }) => [
                      styles.planCard,
                      {
                        backgroundColor: isSelected ? selectedBg : ticketBg,
                        borderColor: isSelected ? theme.accent : mutedBorder,
                        opacity: pressed ? 0.78 : 1,
                      },
                    ]}
                  >
                    <View style={styles.planText}>
                      <View style={styles.planTitleRow}>
                        <Text
                          style={[
                            styles.planLabel,
                            { color: theme.textPrimary },
                          ]}
                        >
                          {plan.label}
                        </Text>
                        {plan.badge && (
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor: softBg,
                                borderColor: mutedBorder,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeText,
                                { color: theme.textPrimary },
                              ]}
                            >
                              {plan.badge}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.planNote,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {plan.note}
                      </Text>
                    </View>

                    <View style={styles.priceWrap}>
                      <Text
                        style={[styles.price, { color: theme.textPrimary }]}
                      >
                        {plan.price}
                      </Text>
                      <Text
                        style={[styles.period, { color: theme.textSecondary }]}
                      >
                        {plan.period}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.checkWrap,
                        {
                          borderColor: isSelected ? theme.accent : borderColor,
                          backgroundColor: isSelected
                            ? theme.accent
                            : "transparent",
                        },
                      ]}
                    >
                      {isSelected && (
                        <CheckIcon color={ctaTextColor} size={16} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Özellikler
          </Text>

          <View style={styles.benefitList}>
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <View
                  key={benefit.title}
                  style={[
                    styles.benefitCard,
                    { backgroundColor: ticketBg, borderColor: mutedBorder },
                  ]}
                >
                  <View
                    style={[styles.benefitIcon, { backgroundColor: softBg }]}
                  >
                    <Icon color={theme.accent} />
                  </View>

                  <View style={styles.benefitText}>
                    <Text
                      style={[
                        styles.benefitTitle,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {benefit.title}
                    </Text>
                    <Text
                      style={[
                        styles.benefitDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {!hasActivePremium && (
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: theme.textPrimary,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={[styles.ctaText, { color: ctaTextColor }]}>
              Devam et
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    gap: 18,
    paddingTop: 8,
    paddingBottom: 42,
  },
  ticket: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  ticketBand: {
    minHeight: 68,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bandBrand: {
    color: "#FFFFFF",
    fontFamily: "Mont-800",
    fontSize: 22,
    letterSpacing: 1.5,
  },
  bandText: {
    color: "rgba(255,255,255,0.78)",
    fontFamily: "Mont-800",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  ticketMain: {
    padding: 16,
    gap: 16,
  },
  ticketTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  passengerBlock: {
    flex: 1,
    gap: 5,
  },
  fieldLabel: {
    fontFamily: "Mont-800",
    fontSize: 9,
    letterSpacing: 0.9,
  },
  passengerName: {
    fontFamily: "Mont-800",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  passIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  routeBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  routeItem: {
    flex: 1,
    gap: 5,
  },
  routeValue: {
    fontFamily: "Mont-800",
    fontSize: 13,
  },
  routeLine: {
    width: 82,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  infoCell: {
    width: "50%",
    gap: 5,
  },
  infoValue: {
    fontFamily: "Mont-700",
    fontSize: 13,
    lineHeight: 18,
  },
  ticketText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 19,
  },
  perforation: {
    height: 24,
    justifyContent: "center",
  },
  dashLine: {
    borderTopWidth: 1,
    borderStyle: "dashed",
  },
  cutout: {
    position: "absolute",
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  cutoutLeft: {
    left: -10,
  },
  cutoutRight: {
    right: -10,
  },
  stub: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  stubText: {
    flex: 1,
    gap: 5,
  },
  stubTitle: {
    fontFamily: "Mont-800",
    fontSize: 14,
  },
  stubNote: {
    fontFamily: "Mont-500",
    fontSize: 10,
    lineHeight: 15,
  },
  stubCode: {
    alignItems: "flex-end",
    gap: 4,
  },
  stubPrice: {
    fontFamily: "Mont-800",
    fontSize: 15,
  },
  stubActivePeriod: {
    fontFamily: "Mont-400",
    fontSize: 14,
    letterSpacing: 1,
  },
  stubPeriod: {
    fontFamily: "Mont-600",
    fontSize: 10,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    marginLeft: 4,
  },
  planList: {
    gap: 10,
  },
  planCard: {
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planText: {
    flex: 1,
    gap: 6,
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planLabel: {
    fontFamily: "Mont-800",
    fontSize: 14,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: "Mont-800",
    fontSize: 9,
  },
  planNote: {
    fontFamily: "Mont-500",
    fontSize: 11,
  },
  priceWrap: {
    alignItems: "flex-end",
    gap: 2,
  },
  price: {
    fontFamily: "Mont-800",
    fontSize: 16,
  },
  period: {
    fontFamily: "Mont-500",
    fontSize: 10,
  },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitList: {
    gap: 10,
  },
  benefitCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    flex: 1,
    gap: 4,
  },
  benefitTitle: {
    fontFamily: "Mont-800",
    fontSize: 13,
  },
  benefitDescription: {
    fontFamily: "Mont-500",
    fontSize: 11,
    lineHeight: 17,
  },
  cta: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "Mont-700",
    fontSize: 14,
  },
});

export default SubscriptionPlanScreen;
