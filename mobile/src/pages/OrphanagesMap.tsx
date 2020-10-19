import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import mapMarker from "../images/map-marker.png";
import api from "../services/api";

interface OrphanageItem {
	id: number
	name: string
	latitude: number
	longitude: number
}

export default function OrphanagesMap() {
	const navigation = useNavigation()
	const [ orphanages, setOrphanages ] = useState<OrphanageItem[]>([]);

	useFocusEffect(() => {
		api.get('/orphanages')
			.then(res => setOrphanages(res.data))
	})

	function navigateToDetails(id: number) {
		navigation.navigate('OrphanageDetails', { id })
	}

	function navigateToCreateOrphanage() {
		navigation.navigate('SelectMapPosition')
	}

	return (
		<View style={styles.container}>

			<StatusBar translucent/>

			<MapView
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: -23.1521858,
					longitude: -45.910248,
					latitudeDelta: 0.008,
					longitudeDelta: 0.008
				}}>

				{
					orphanages.map(orphanageItem => {
						return (
							<Marker
								key={orphanageItem.id}
								icon={mapMarker}
								calloutAnchor={{
									x: 2.7,
									y: 0.8
								}}
								coordinate={{
									latitude: orphanageItem.latitude,
									longitude: orphanageItem.longitude,
								}}>

								<Callout tooltip onPress={() => navigateToDetails(orphanageItem.id)}>
									<View style={styles.calloutContainer}>
										<Text style={styles.calloutText}>{orphanageItem.name}</Text>
									</View>
								</Callout>
							</Marker>
						)
					})
				}
			</MapView>

			<View style={styles.footer}>
				<Text style={styles.footerText}>{ orphanages.length} Orfanatos encontrados </Text>

				<RectButton style={styles.createOrphanageButton} onPress={navigateToCreateOrphanage}>
					<Feather name="plus" size={20} color="#fff"/>
				</RectButton>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},

	title: {
		color: '#f00',
		fontSize: 35,
		textAlign: 'center'
	},

	map: {
		width: Dimensions.get('screen').width,
		height: Dimensions.get('screen').height,
	},

	calloutContainer: {
		width: 160,
		height: 46,
		paddingHorizontal: 16,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		borderRadius: 16,
		justifyContent: 'center'
	},

	calloutText: {
		color: '#0089a5',
		fontSize: 14,
		fontFamily: "Nunito_700Bold"
	},

	footer: {
		position: 'absolute',
		left: 24,
		right: 24,
		bottom: 32,

		backgroundColor: '#fff',
		borderRadius: 20,
		height: 56,
		paddingLeft: 24,

		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',

		elevation: 10
	},

	footerText: {
		fontFamily: 'Nunito_700Bold',
		color: '#8fa7b3'
	},

	createOrphanageButton: {
		width: 56,
		height: 56,
		backgroundColor: '#15c3d6',
		borderRadius: 20,

		justifyContent: "center",
		alignItems: "center"
	},
});
