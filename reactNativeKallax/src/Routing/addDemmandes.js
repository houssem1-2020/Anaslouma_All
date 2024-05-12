import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from '../AssetsM/theme'
import { Appbar, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import GConf from '../AssetsM/GConf';
import AutocompleteInput from 'react-native-autocomplete-input';
import axios from 'axios';
import MapView, { Marker, Callout } from 'react-native-maps';

const App = () => {
  // const {tag, subTag, code} = useParams()
  const [tag, subTag, code] = ['Plombier','reparation-fuites-eau','']
    const [proffData, setProffData] = useState({Horaires: '[]' , Lat:7.755644917488099, Lng:48.60693300840386 }); 
    const [suivieListe, setSuivieListe] = useState([])
    const [loading, setLOD] = useState(true); 
    const [openD, setOpenD] = useState(false)
    const [rateValue,setRateValue] =useState({comment:'', rating:0})
    const [rating ,setRating] = useState([20, 37])
    const [rendyVousD, setRdvData] = useState({Genre : subTag , Comment:'b',  Wanted_Time :'' , Services : []})
    const [loaderState, setLS] = useState(false)
    const [myPosition, setMyPosition] = useState([36.17720,9.12337])
    const [targetPosition, setTragetPosition] = useState([36.17720,9.12337])
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(0);
    const [targetIndex,setTargetIndex] = useState(0)
    const [isChecked, setIsChecked] = useState(false);
    let [fetchedList, setFetchedListe] = useState([])
    let [fetchedListAll, setFetchedListeAll] = useState([])
    let [fetchingState, setFetchingState] = useState(false)
    let [activePIndex, setActivePIndex] = useState(0)

 
  const [query, setQuery] = useState('');
 
 

  const SelectPlaceInput = (data) => {
    // Implement your selection logic here
  };

  // Assuming GConf.profTags[tag].filter((selected => selected.value == subTag))[0].description is available
  const chipData = GConf.profTags[tag].filter(selected => selected.value === subTag)[0].description;


  const AppBar = () => {
    return(<>
          <Appbar style={{backgroundColor:'white'}}>
            <Appbar.BackAction onPress={() => navigation.navigate('LandingPage')} />
            <Appbar.Content title=" " /> 
            <Appbar.Action 
            icon={({ color, size }) => (
              <View style={styles.container}>
                <TouchableOpacity  style={styles.imageContainer} onPress={() => Alert.alert('User')}>
                  <Image
                    source={{uri:`https://assets.ansl.tn/Images/kallax/user.gif`}} // Replace with the path to your image
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity >
              </View>
        )}
        onPress={() => {}}
      />
          </Appbar>
    </>)
  }

  const saveFunction = () =>{
    console.log('true')
  }

  const FetchPlacesData = (fetchedPos) =>{
        
    setFetchingState(true)
        axios.get(`https://nominatim.openstreetmap.org/search?q=${fetchedPos}&format=json&addressdetails=1`)
        .then(function (response) {
            setFetchedListeAll(response.data)
            let finalPlaces = []
            response.data.map((data) => finalPlaces.push({label: `${data.display_name}, ${data.country}` , Lat: data.lat, Lng: data.lon,  icon: <LocationOnIcon />, value: data.osm_id}))
            setFetchedListe(finalPlaces)
            setFetchingState(false)
            
        })
    }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}} >
      <ScrollView>
        <View style={styles.container}>
          {/* <AppBar /> */}
          {/* <View style={styles.content}>
            <Text style={styles.textContent}>Ajouter Demmande!</Text>
          </View> */}
          <View style={{flex: 1, padding: 15}}>
          <View style={{ backgroundColor: 'transparent', borderRadius: 8, borderWidth: 0, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 12 }}>Sous Service ?</Text>
        <ScrollView
        horizontal
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
        showsHorizontalScrollIndicator={false}
      >
        {chipData.map((carouselData, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveIndex(index)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginHorizontal: 4,
              borderRadius: 20,
              backgroundColor: activeIndex === index ? '#007bff' : '#ffffff',
              borderWidth: 1,
              borderColor: '#007bff',
            }}
          >
            <Text style={{ color: activeIndex === index ? '#ffffff' : '#007bff' }}>{carouselData}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 12 }}>Le montant moyen que vous pouvez payer ?</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>{rating[0]} - {rating[1]} Euro</Text>
        </View>
        <Slider
            style={{width: '100%', height: 40}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="black"
            maximumTrackTintColor="#000000"
          />
        {/* <Slider
          style={{ width: '100%', marginTop: 6 }}
          value={rating}
          minimumValue={3}
          maximumValue={500}
          step={1}
          onValueChange={(value) => setRating(value)}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#000000"
        /> */}
        {/* Implement your urgency selection UI here */}
        {/* Implement your payment selection UI here */}
      </View>

      <Text>Urgence  ?</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{
              flex: 1,
              marginHorizontal: 4,
              padding: 8,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: targetIndex === 1 ? 'green' : 'transparent',
              backgroundColor: targetIndex === 1 ? 'green' : 'transparent',
            }}
            onPress={() => setTargetIndex(1)}
          >
            <Text style={{ color: targetIndex === 1 ? '#fff' : 'green', textAlign: 'center' }}>urgant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginHorizontal: 4,
              padding: 8,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: targetIndex === 2 ? 'red' : 'transparent',
              backgroundColor: targetIndex === 2 ? 'red' : 'transparent',
            }}
            onPress={() => setTargetIndex(2)}
          >
            <Text style={{ color: targetIndex === 2 ? '#fff' : 'red', textAlign: 'center' }}>Tres Urgent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginHorizontal: 4,
              padding: 8,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: targetIndex === 3 ? 'yellow' : 'transparent',
              backgroundColor: targetIndex === 3 ? 'yellow' : 'transparent',
            }}
            onPress={() => setTargetIndex(3)}
          >
            <Text style={{ color: targetIndex === 3 ? '#fff' : 'yellow', textAlign: 'center' }}>Asser urgent</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Paymment ?</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            marginHorizontal: 4,
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: activePIndex === 1 ? '#6c757d' : 'transparent',
            backgroundColor: activePIndex === 1 ? '#6c757d' : 'transparent',
          }}
          onPress={() => setActivePIndex(1)}
        >
          <Text style={{ color: activePIndex === 1 ? '#fff' : '#6c757d', textAlign: 'center' }}>Sur Place</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            marginHorizontal: 4,
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: activePIndex === 2 ? '#6c757d' : 'transparent',
            backgroundColor: activePIndex === 2 ? '#6c757d' : 'transparent',
          }}
          onPress={() => setActivePIndex(2)}
        >
          <Text style={{ color: activePIndex === 2 ? '#fff' : '#6c757d', textAlign: 'center' }}>En Ligne</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: 'transparent', borderRadius: 8, borderWidth: 0, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 12 }}>Position & Confirmation ?</Text>
        <Text>C'est Votre position ?</Text>
           <View style={{marginBottom : 30}}>
              <AutocompleteInput
                data={fetchedList}
                defaultValue={query}
                onChangeText={(text) => {
                  setQuery(text);
                  FetchPlacesData(text);
                }}
                renderItem={(item) => (
                  <TouchableOpacity onPress={() => SelectPlaceInput(item)}>
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
                renderTextInput={(props) => (
                  <TextInput
                    {...props}
                    placeholder="Votre position"
                    style={{ borderBottomWidth: 1, borderColor: '#000', padding: 10 }}
                  />
                )}
                keyExtractor={(item) => item.osm_id.toString()}
                placeholder="Votre position"
                containerStyle={{ marginVertical: 10 }}
                inputContainerStyle={{ borderWidth: 0 }}
                listContainerStyle={{ borderWidth: 1, borderColor: '#000', backgroundColor: '#fff' }}
                // Adjust other props as needed
              />
              {fetchingState && <ActivityIndicator size="large" color="black" />}
              {/* Other components */}
            </View>
        {/* Implement your Map component here */} 
        <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}>
          <MapView
            style={{ flex: 1, width:'100%',  height: 200, borderRadius : 20 }} // Adjust the style as needed
            initialRegion={{
              latitude: myPosition[0], // Assuming myPosition is an array with latitude at index 0 and longitude at index 1
              longitude: myPosition[1],
              latitudeDelta: 0.0922, // Adjust the values as needed
              longitudeDelta: 0.0421,
            }}
            onRegionChangeComplete={(region) => console.log(region)} // You can handle region change if needed
          >
            {/* Marker for target position */}
            <Marker coordinate={{ latitude: targetPosition[0], longitude: targetPosition[1] }}>
              <Callout>
                {/* Popup content here */}
              </Callout>
            </Marker>
          </MapView>
          </View>
        {/* Implement your checkbox here */}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Checkbox.Android
        status={isChecked ? 'checked' : 'unchecked'}
        onPress={() => setIsChecked(!isChecked)}
        color="green"
      />
      <Text style={{ marginLeft: 8 }}>Accepter les conditions</Text>
    </View>

        <TouchableOpacity style={{   backgroundColor: '#007bff', borderRadius: 8, padding: 12, marginTop: 12 }} onPress={saveFunction} disabled={false}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
      </View>
        </View>
        </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

 

export default App;
