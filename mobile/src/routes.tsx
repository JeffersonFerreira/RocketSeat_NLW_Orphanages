import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./components/Header";
import OrphanageData from "./pages/CreateOrphanage/OrphanageData";
import SelectMapPosition from "./pages/CreateOrphanage/SelectMapPosition";
import OrphanageDetails from "./pages/OrphanageDetails";
import OrphanagesMap from "./pages/OrphanagesMap";

const { Navigator, Screen } = createStackNavigator()

export default function Routes() {
	return (
		<NavigationContainer>
			<Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f3f5' } }}>
				<Screen name="OrphanageMap" component={OrphanagesMap}/>

				<Screen name="OrphanageDetails"
						component={OrphanageDetails}
						options={{ headerShown: true, header: () => <Header title="Orfanato"/> }}
				/>
				
				<Screen name="SelectMapPosition"
						component={SelectMapPosition}
						options={{headerShown: true, header: () => <Header title="Selecione no mapa" showCancel/>}}
				/>
				
				<Screen name="OrphanageData"
						component={OrphanageData}
						options={{headerShown: true, header: () => <Header title="Informe os dados" showCancel/>}}
				/>
			</Navigator>
		</NavigationContainer>
	)
}