// This Page is developed to fit Grand Rapids environment, where 
// "God’s Kitchen" is for lunch and "Mel Trotter" is for dinner.
// These two locations are the only locations we know that doesn't require payments for food.  
import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image, Linking} from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import * as Location from 'expo-location';
import ActionButton from '../components/ActionButton';
import GoBackButton from '../components/GoBackButton';
import IconButton from '../components/IconButton';
// import locationsData from './database/locations_basic.json';
// import * as styles from '../../styles/detailsStyles';


const Page = ({ isVisible, onClose }) => {
  const navigation = useNavigation(); // used for navigation.navigate()
return (

        <View style={styles.mainContainer}>
          {/* Empty Component to make buttons in the middle of the screen but not on top, easier for user to reach*/}
          <View></View> 
          <View style={styles.resourceContainer}>
            <Text style={styles.title}>Lunch or Dinner?</Text>
            <IconButton
              imageSource={require('../assets/meal.png')}
              title="Lunch"
              buttonStyle={styles.primaryButton}
              onPress={() => navigation.navigate('SelectResourceLocation', { category: 'Meal' })}
            />

            <IconButton
              imageSource={require('../assets/grocery.png')}
              title="Dinner"
              buttonStyle={styles.primaryButton}
              onPress={() => navigation.navigate('SelectResourceLocation', { category: 'Groceries' })}
            />
          </View>

          <View style={styles.resourceContainer}>

            <GoBackButton/>

            {/* <ActionButton
              title="Call Navigator"
              onPress={onClose}
              buttonStyle={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            /> */}

          </View>

        </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: '5%',
    paddingBottom: '5%',
  },
  resourceContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    fontSize: 15, 
  },
  primaryButton: {
    backgroundColor: '#E2E9F3',
  },

  title: {
    marginBottom: 18,
    color: '#2F2E41',
    fontSize: 35,
    fontWeight: '900',
    width: '80%',
  },

});