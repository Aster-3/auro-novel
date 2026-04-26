import { GlobalNotifications } from "@/Features/NotificationScreen/GlobalNotifications";
import { Screen } from "../components/layout/Screen";
import { NotificationHeader } from "@/Features/NotificationScreen/NotificationHeader";
import { PersonalNotifications } from "@/Features/NotificationScreen/PersonalNotifications";
import { SelectNotificationType } from "@/Features/NotificationScreen/SelectNotificationType";

import { useState } from "react";

export enum NotificationTypeEnum {
  PERSONAL = "personal",
  GLOBAL = "global",
}

const NotificationScreen = () => {
  const [selectedType, setSelectedType] = useState<NotificationTypeEnum>(
    NotificationTypeEnum.PERSONAL,
  );

  return (
    <Screen style={{ paddingTop: 8 }}>
      <NotificationHeader />
      <SelectNotificationType
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      {selectedType === NotificationTypeEnum.GLOBAL && <GlobalNotifications />}
      {selectedType === NotificationTypeEnum.PERSONAL && (
        <PersonalNotifications />
      )}
    </Screen>
  );
};
export default NotificationScreen;
