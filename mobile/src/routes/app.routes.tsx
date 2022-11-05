import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { NewPoll } from "../screens/NewPoll";
import { Polls } from "../screens/Polls";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator>
      <Screen name="new" component={NewPoll} />
      <Screen name="polls" component={Polls} />
    </Navigator>
  );
}
