import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  //commun styles

  //landing page
  navBar: {
    backgroundColor: '#36278f', // Background color of the app bar
    elevation: 4, // Elevation for shadow effect (Android)
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
  },
  typedText:{
    fontSize:15,
    color: 'red',
    // fontFamily: 'Expo Arabic Book',
  },
  itemList: {
    //backgroundColor: '#f9c2ff',
    padding: 8,
    margin: 5,
    //marginVertical: 8,
    //marginHorizontal: 16,
    //flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    
    height: 'auto', //Dimensions.get('window').width / numColumns, // Adjust item height based on screen width and number of columns
    borderRadius: 10,
  },
  imageContainer: {
    borderRadius: 50, // Make it circular
    borderWidth: 0.5, // Add border width
    borderColor: 'white', // Set border color to white
    overflow: 'hidden', // Ensure image stays within the border
  },
  containerUser: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    width : '100%',
    height:'100%'
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    width : '100%',
    height : '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  containerTabs: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navBar: {
    height: 60,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  //add Commandes
  //User Page
  //LogIn
  //Sign Up
  //Profile
  

});

export default styles