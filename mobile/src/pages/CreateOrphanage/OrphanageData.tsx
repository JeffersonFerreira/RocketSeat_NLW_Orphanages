import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import { MediaTypeOptions, PermissionStatus } from "expo-image-picker";
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import api from "../../services/api";

interface OrphanageDataRouteParams {
	position: {
		latitude: number
		longitude: number
	}
}

export default function OrphanageData() {

	const [ name, setName ] = useState('');
	const [ instructions, setInstructions ] = useState('');
	const [ about, setAbout ] = useState('');
	const [ opening_hours, setOpeningHours ] = useState('');
	const [ open_on_weekends, setOpenOnWeekends ] = useState(false);
	const [ images, setImages ] = useState<string[]>([]);

	const navigation = useNavigation();
	const params = useRoute().params as OrphanageDataRouteParams

	async function createOrphanage() {
		const data = { name, instructions, about, opening_hours, open_on_weekends, ...params.position }

		const formData = new FormData();

		Object
			.entries(data)
			.forEach(([ key, value ]) => formData.append(key, String(value)))

		images.forEach((img, index) => {
			formData.append('images', {
				name: `image_${index}.jpg`,
				type: 'image/jpg',
				uri: img,
			} as any);
		})

		await api.post('orphanages', formData)

		navigation.navigate('OrphanageMap')
	}

	async function handleSelectImages() {
		const { status } = await ImagePicker.getCameraRollPermissionsAsync()

		if (status !== PermissionStatus.GRANTED) {

			const s = await ImagePicker.requestCameraRollPermissionsAsync()
			if (s.status !== PermissionStatus.GRANTED) {
				alert("Dá permissão ai bobão")
				return
			}
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
			mediaTypes: MediaTypeOptions.Images
		})

		if (result.cancelled)
			return

		setImages([ ...images, result.uri ])
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
			<Text style={styles.title}>Dados</Text>

			<Text style={styles.label}>Nome</Text>
			<TextInput style={styles.input} value={name} onChangeText={setName}/>

			<Text style={styles.label}>Sobre</Text>
			<TextInput style={[ styles.input, { height: 110 } ]} multiline value={about} onChangeText={setAbout}/>

			<Text style={styles.label}>Fotos</Text>

			<View style={styles.uploadedImagesContainer}>
				{
					images.map((img, index) =>
						<Image style={styles.uploadedImage} key={index} source={{ uri: img }}/>
					)
				}
			</View>

			<TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
				<Feather name="plus" size={24} color="#15B6D6"/>
			</TouchableOpacity>

			<Text style={styles.title}>Visitação</Text>

			<Text style={styles.label}>Instruções</Text>
			<TextInput style={[ styles.input, { height: 110 } ]} multiline value={instructions}
					   onChangeText={setInstructions}/>

			<Text style={styles.label}>Horario de visitas</Text>
			<TextInput style={styles.input} value={opening_hours} onChangeText={setOpeningHours}/>

			<View style={styles.switchContainer}>
				<Text style={styles.label}>Atende final de semana?</Text>
				<Switch thumbColor="#fff"
						trackColor={{ false: '#ccc', true: '#39CC83' }}
						value={open_on_weekends}
						onValueChange={setOpenOnWeekends}/>
			</View>

			<RectButton style={styles.nextButton} onPress={createOrphanage}>
				<Text style={styles.nextButtonText}>Cadastrar</Text>
			</RectButton>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	title: {
		color: '#5c8599',
		fontSize: 24,
		fontFamily: 'Nunito_700Bold',
		marginBottom: 32,
		paddingBottom: 24,
		borderBottomWidth: 0.8,
		borderBottomColor: '#D3E2E6'
	},

	label: {
		color: '#8fa7b3',
		fontFamily: 'Nunito_600SemiBold',
		marginBottom: 8,
	},

	comment: {
		fontSize: 11,
		color: '#8fa7b3',
	},

	input: {
		backgroundColor: '#fff',
		borderWidth: 1.4,
		borderColor: '#d3e2e6',
		borderRadius: 20,
		height: 56,
		paddingVertical: 18,
		paddingHorizontal: 24,
		marginBottom: 16,
		textAlignVertical: 'top',
	},

	imagesInput: {
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderStyle: 'dashed',
		borderColor: '#96D2F0',
		borderWidth: 1.4,
		borderRadius: 20,
		height: 56,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 32,
	},

	switchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 16,
	},

	nextButton: {
		backgroundColor: '#15c3d6',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		height: 56,
		marginTop: 32,
	},

	nextButtonText: {
		fontFamily: 'Nunito_800ExtraBold',
		fontSize: 16,
		color: '#FFF',
	},

	uploadedImagesContainer: {
		flexDirection: "row"
	},

	uploadedImage: {
		width: 64,
		height: 64,
		borderRadius: 20,
		marginBottom: 32,
		marginRight: 8
	}
})