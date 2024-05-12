 
import {  View,   FlatList, Alert, Image, Modal ,  Text, TouchableOpacity,  ScrollView  ,Pressable } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Card, TouchableRipple , GridList } from 'react-native-paper';
import styles from './AssetsM/theme'
import TypingEffect from './AssetsM/hooks/typed';
import GConf from './AssetsM/GConf';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgUri } from 'react-native-svg';
// import SvgUri from 'react-native-svg-uri';

function MainPage() {
   
 /*########################[Card]###########################*/
 const [modalVisible, setModalVisible] = useState(false);
 const navigation = useNavigation();
 const [selectedTag ,setSelectedTag] = useState('Plombier')
 const [gouv ,setGouv] = useState('Souuse')
    const [deleg ,setDeleg] = useState('fddfgfd')
    const [defaultSearch, setDefaultSearch] = useState({depart:'', region:''})
    const [delegList ,setDelegList] = useState([])

    const [openD, setOpenD] = useState(false)
    const [selectModal, setOpenMSelect] = useState(false)
 

    const [suggestionListe , setSuggestionListe] = useState([])
    const [pageLoading, setPageLoading] = useState(true)

 const proffListe = [
  {id:1, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Plombier',  link:'Plombier', genre:'Plombier', text:'Plombier', imageSrc:'Plombier.gif'},
  {id:2, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Électricien',  link:'Électricien', genre:'Électricien', text:'Électricien', imageSrc:'Électricien.gif'},
  {id:3, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Serrurier',  link:'Serrurier', genre:'Serrurier', text:'Serrurier', imageSrc:'Serrurier.gif'},
  {id:4, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Chauffagiste',  link:'Chauffagiste', genre:'Chauffagiste', text:'Chauffagiste', imageSrc:'Chauffagiste.gif'},
  {id:5, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Vitrier',  link:'Vitrier', genre:'Vitrier', text:'Vitrier', imageSrc:'Vitrier.gif'},
  {id:6, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Jardinier',  link:'Jardinier', genre:'Jardinier', text:'Jardinier', imageSrc:'Jardinier.gif'},
  {id:7, colL: 6 , width:'47%',  color:'#e3ebfc', tag:'Couvreur',  link:'Couvreur', genre:'Couvreur', text:'Femme de Ménage', imageSrc:'femme-de-menage.gif'},
  {id:8, colL: 6 , width:'47%',   color:'#e3ebfc', tag:'Peinture',  link:'Peinture', genre:'Peinture', text:'Garde Enfant', imageSrc:'garde-enfant.gif'},
  ]

  useEffect(() => {
    checkIfStored()
  }, []);

  const checkIfStored = async () => {
    const value = await AsyncStorage.getItem('UserData');
    if (!value) { navigation.navigate('UserLogIn') }
  };

  

  const GetRandomItems = (totalCount) => {
    const allItems = [];

    for (const category in GConf.profTags) {
        const categoryItems = GConf.profTags[category];
        const shuffled = categoryItems.sort(() => 0.5 - Math.random());
        allItems.push(...shuffled);
    }

    const shuffledAllItems = allItems.sort(() => 0.5 - Math.random());
    //console.log(shuffledAllItems.slice(0, totalCount).map(item => item.text));
    return shuffledAllItems.slice(0, totalCount).map(item => item.text);
  }

  const TopNavBar = () => {
     
    return (
      <Appbar style={styles.navBar}>
         
        <Appbar.Content titleStyle={{ color: '#FFFFFF' }}  title="Kallax-s.fr" />
         
        <Appbar.Action 
            icon={({ color, size }) => (
              <View style={styles.containerUser}>
                <TouchableOpacity  style={styles.imageContainer} onPress={() => navigation.navigate('UserLandingPage')}>
                  <Image
                    source={{uri:`https://assets.ansl.tn/Images/kallax/user.gif`}} // Replace with the path to your image
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity >
              </View>
        )}
        onPress={() => {}}
      />
    
      </Appbar>  )
  }

  const AdsTextWithTyped = () => {
    return(<>
        <View style={{padding:10, marginLeft:10, marginBottom:20, marginTop:20}}>
        
        <TypingEffect
            
            textArray={GetRandomItems(15)}
            typingSpeed={100} // Adjust typing speed as needed
            loop={true} // Set to true if you want the typing to loop
        />
        </View>
    </>)
  }

  const RenderItem = (props) => {
    return (<> 
      <TouchableOpacity  style={[styles.itemList, { backgroundColor: props.data.color , width: props.data.width }]} onPress={() =>  {setSelectedTag(props.data.tag) ; setOpenMSelect(true)}}>
          <Image
                source={{uri:`https://assets.ansl.tn/images/kallax/${props.data.imageSrc}`}} // Replace with the path to your image
                style={{ width: 50, height: 50 }}
              />
      <Text  >{props.data.text} </Text>
    </TouchableOpacity >
    </>)
    
  }

  const ProItemListCard = () => {
    return(<>
          <View style={{ flex: 1 , margin:10, flexDirection: 'row', flexGrow: 1, flexWrap: 'wrap', justifyContent: 'space-between',}}>   
            {/* <FlatList
              data={proffListe}
              renderItem={(item ) => <RenderItem data={item} />}
              //renderItem={RenderItem}
              keyExtractor={item => item.id}
              numColumns={3}
               
            /> */}
             {proffListe.map((item) => (
                <RenderItem key={item.id} data={item} />
              ))}
              
          </View>
    </>)
  }

  const AdsForProfessionals = () => {
    return (
       
      <View   style={{  overflow: 'hidden', borderWidth: 1, borderColor: '#dedede', backgroundColor:'white', margin:13, borderRadius: 15,  marginBottom: 10 }}  >
        <View style={{ padding: 10 , borderRadius: 15,}}>
          <Text style={{ color: 'blue', fontSize: 18, fontWeight: 'bold' }}>Etes vous un professionnel ?</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
              <Text style={{ color: 'gray', marginTop: 5 , fontSize: 13}}>
                Inscrivez-vous gratuitement et vous pourrez communiquer avec de nouveaux clients potentiels et bien organiser votre entreprise
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <SvgUri
              width="80"
              height="80"
              uri="https://assets.ansl.tn/images/kallax/sign-up.svg"
            />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              mode="contained"
              //color="#f0b000"
              labelStyle={{ color: 'white', marginRight: 10 }}
              onPress={() => navigation.navigate('ProfLandingPage')}
            >
              <Text>Créer Un compte Professionnel</Text>
            </Button>
          </View>
        </View>
      </View>
      
    );
  };
  const SuggestionCard = () => {
     // Sample data
    const data = [
      { key: '1', text: 'Item 1', Social_Name :'Joel le Grand', Genre:'Plombier' },
      { key: '2', text: 'Item 2', Social_Name :'Michel Abrier ', Genre:'Électricien' },
      { key: '3', text: 'Item 3', Social_Name :'Socite colmar de Chaffage ', Genre:'Serrurier' },
      { key: '4', text: 'Item 3', Social_Name :'Chantale Patis', Genre:'Jardinier' },
      { key: '5', text: 'Item 3', Social_Name :'Manou Ambelli ', Genre:'Couvreur' },
      { key: '6', text: 'Item 3', Social_Name :'Amber Terhimi', Genre:'Peinture' },
      { key: '7', text: 'Item 3', Social_Name :'Syoumo Tatikacha', Genre:'Chauffagiste' },
      // Add more items as needed
    ];

      // Render item function
      const renderItem = ({ item }) => (
    
        <TouchableOpacity onPress={() => Alert.alert('Hello')}>
          <View style={{ padding: 10, marginBottom: 8, backgroundColor:'#ffffff', margin: 5,   borderRadius: 8,     }}>
            <View style={{ flexDirection: 'row', alignContent:'center' }}>
              <View style={{ marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: `https://assets.ansl.tn/images/kallax/${item.Genre}.gif` }}
                  style={{width: 30, height: 30,}}
                />
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 }}>{item.Social_Name}</Text>
                <Text style={{ fontSize: 10,  color: '#057fb3', marginBottom: 0 , marginTop : 1 }}>{item.Genre}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    return(<>
    <View style={{ margin:10,  marginBottom : 35, marginTop:20  }}>
        <View style={{ padding: 0 }}>
            <Text style={{fontSize: 16, marginBottom : 10 }}>Les Plus Courant  :  </Text>

            <View style={{flexDirection: 'row' , justifyContent: 'space-between'}}>
            <FlatList
                data={data}
                horizontal
                renderItem={renderItem}
                keyExtractor={item => item.key}
              />
              {/* <View style={{flex:8}}>
                  <Card style={{backgroundColor:'white', margin:4,  padding:15}}>
                      <Text>Hello</Text>
                  </Card>
              </View>
              <View style={{flex:4}}>
                <Card style={{backgroundColor:'white', margin:4,  padding:15}}>
                      <Text>Hello</Text>
                  </Card>

              </View> */}
            </View>
      </View>
    </View>
       
    </>)
  }

  const BottomCard = () => {
    return (
      <View style={{ backgroundColor: '#6f787d', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
          <View style={{ padding: 20 }}>
            <View style={{ flex: 1 }}>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: 'white' }}>
                  <Ionicons name="call-outline" size={12} color="white" /> +21697913914, +33 6 56 70 89 08
                </Text>
                <Text style={{ color: 'white' }}>
                <Ionicons name="map-outline" size={13} color="white" /> 5, rue oberlin Schiltigheim 67300
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 0, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'start', flex: 1 }}>
              <IconButton icon={() => <Ionicons name="logo-facebook" size={20} color="white" />} onPress={() => navigate('#')} />
                  <IconButton icon={() => <Ionicons name="logo-youtube" size={20} color="white" />} onPress={() => navigate('#')} />
                  <IconButton icon={() => <Ionicons name="logo-instagram" size={20} color="white" />} onPress={() => navigate('#')} />
                  <IconButton icon={() => <Ionicons name="logo-whatsapp" size={20} color="white" />} onPress={() => navigate('#')} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
              <IconButton icon={() => <Ionicons name="arrow-forward" size={20} color="white" />} onPress={() => navigate('/about')} />
              </View>
            </View>
          </View>
      </View>
    );
  };

  const ItemCard = (props) => {
    return (
      <View style={{ flex: 0, flexDirection: 'row',    marginBottom: 8  }}>
        <View style={{ flex: 1, paddingRight: 5 }}>
          <TouchableOpacity
            style={{ borderWidth: 1, borderColor: '#dedede', padding: 8, borderRadius : 8 }}
            onPress={() => {setOpenMSelect(!selectModal);  navigation.navigate('AddDemmande')}}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={{
                    uri: props.data.photo
                      ? `https://assets.ansl.tn/Images/kallax/itemes/${props.data.photo}`
                      : `https://assets.ansl.tn/Images/kallax/${selectedTag}.gif`,
                  }}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 3 }}>
                    <Text numberOfLines={2} style={{ fontWeight: 'bold', maxWidth: 350 }}>
                      {props.data.text}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>30.5 €</Text>
                  </View>
                </View>
                <Text numberOfLines={2} style={{ maxWidth: '95%', fontSize: 10 }}>
                  {props.data.description.join(', ')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (<>
  <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 ,  }} >
        
           
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* <View style={{ height: 70}}></View> */}
          <AdsTextWithTyped />
          <ProItemListCard />
          <AdsForProfessionals />
          <SuggestionCard />
          <BottomCard />
          </ScrollView>
      </SafeAreaView>

      <Modal
          animationType="slide"
          transparent={true}
          visible={selectModal}
           >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Appbar style={{backgroundColor:'white'}}>
                  <Appbar.BackAction onPress={() => setOpenMSelect(!selectModal)} />
                  <Appbar.Content title="Selectioner Un Service " />
                    
                </Appbar>
                    {GConf.profTags[selectedTag].sort((a, b) => a.id - b.id).map( (carouselData,index) => 
                            <ItemCard  key={carouselData.id} data={carouselData} index={index} /> 
                      )}

            </View>
          </View>
      </Modal>
      </SafeAreaProvider>
  </>);
}

export default MainPage