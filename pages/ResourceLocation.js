/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image, Linking} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useFonts } from 'expo-font';
import IconButton from '../components/IconButton';
import GoBackButton from '../components/GoBackButton';
// import IconButton from '../components/IconButton';
import moment from 'moment';
import locationsDetails from '../database/locations_details.json';
// import locationsData from './database/locations_basic.json';

// import * as styles from '../../styles/detailsStyles';


const ResourceLocation = ({ isVisible, onClose }) => {
  const navigation = useNavigation(); // used for navigation.navigate()
  const route = useRoute();
  const { location, distance } = route.params;

  // Initialize state for status and time message
  const [status, setStatus] = useState('');
  const [timeMessage, setTimeMessage] = useState('');

  // The indicator showing a place is whether opening or closed is determined here: 
  useEffect(() => {
    updateLocationStatus();
  }, [location]);

  // Find the matching entry and extract the specialRequirements:
  useEffect(() => {
    updateLocationStatus();
    // Assuming location includes an id
    const matchingDetails = locationsDetails.Meal.find(detail => detail.id === location.id);
    if (matchingDetails) {
      // Assuming you have a state for specialRequirements
      setSpecialRequirements(matchingDetails.specialRequirements);
    }
  }, [location]);

  // Declare specialRequirements  
  const [specialRequirements, setSpecialRequirements] = useState('');

  const updateLocationStatus = () => {
    const now = moment();
    const openTime = moment(location.openHours.open, "HH:mm");
    const closeTime = moment(location.openHours.close, "HH:mm");

    // Create a copy of closeTime for the "closing soon" comparison to avoid mutating the original closeTime
    const closingSoonTime = moment(closeTime).subtract(1, 'hours');

    if (now.isBetween(openTime, closingSoonTime)) {
        setStatus('open');
        setTimeMessage(`Closes at ${location.openHours.close}`);
    } else if (now.isBetween(closingSoonTime, closeTime)) {
        setStatus('closingSoon');
        setTimeMessage(`Closes at ${location.openHours.close}`);
    } else if (now.isBefore(openTime) && now.isAfter(moment(openTime).subtract(1, 'hours'))) {
        setStatus('openingSoon');
        setTimeMessage(`Opens at ${location.openHours.open}`);
    } else if (now.isBefore(openTime)) {
        setStatus('closed');
        setTimeMessage(`Opens at ${location.openHours.open}`);
    } else {
        setStatus('closed');
        setTimeMessage(`Opens at ${location.openHours.open}`); // Adjust according to how you handle next open time
    }
  };

  // Define styles based on status
  const getIndicatorStyle = () => {
    switch (status) {
      case 'closingSoon':
        return { ...styles.indicator, backgroundColor: '#ffe8ad' };
      case 'openingSoon':
        return { ...styles.indicator, backgroundColor: '#c1fcbb' };
      case 'open':
        return { ...styles.indicator, backgroundColor: '#c1fcbb' };
      case 'closed':
        return { ...styles.indicator, backgroundColor: '#ffd1d1' };
      default:
        return styles.indicator;
    }
  };

  const getTextStyle = () => {
    switch (status) {
      case 'closingSoon':
        return { ...styles.openOrClosed, color: '#543c00' };
      case 'openingSoon':
        return { ...styles.openOrClosed, color: '#075400' };
      case 'open':
        return { ...styles.openOrClosed, color: '#075400' };
      case 'closed':
        return { ...styles.openOrClosed, color: 'darkred' };
      default:
        return styles.openOrClosed;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'closingSoon':
        return 'Closes Soon';
      case 'openingSoon':
        return 'Opens Soon';
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
      default:
        return '';
    }
  };

  const [fontsLoaded] = useFonts({
    'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Return null to render nothing while loading fonts
  }


return (

        <View style={styles.mainContainer}>
          <View style={styles.resourceContainer}>
            <Text style={styles.subtitle}>Closest food location:</Text>
            <Text style={styles.title}>{location.name}</Text>
            <View style={styles.row}>
              <View style={styles.requirementIndicator}>
                <Text style={styles.openOrClosed}>{specialRequirements}</Text> 
              </View>
            </View>
            <Text style={styles.distance}>~ {distance} miles away</Text>
            {/* <Text style={styles.coordinates}>Lat: {location.coordinates.lat}, Lng: {location.coordinates.lng}</Text> */}
            <View style={styles.row}>
              <View style={getIndicatorStyle()}>
                <Text style={getTextStyle()}>{getStatusText()}</Text>
              </View>
              <Text style={styles.timing}> - {timeMessage}</Text>
            </View>
          </View>

          <View style={styles.resourceContainer}>

            <IconButton
              imageSource={require('../assets/directions.png')}
              title="Plan Your Route  "
              iconSize={32}
              buttonStyle={styles.secondaryButton}
              onPress={() => 
                navigation.navigate('Transportation', { 
                  location: location,
                  distance: distance,
                  statusText: getStatusText(), // Added status text here
                  indicatorColor: getIndicatorStyle().backgroundColor, // Extract backgroundColor from the style object
                  textColor: getTextStyle().color, // Extract color from the style object
                  timeMessage: timeMessage 
                })                
              }
            />

            <IconButton
              title="More Info  "
              iconSize={32}
              onPress={onClose}
              imageSource={require('../assets/info.png')}
              buttonStyle={styles.tertiaryButton}
            />
          </View>

          <View style={styles.resourceContainer}>

            <GoBackButton/>

            {/* <IconButton
              title="Call Navigator"
              onPress={onClose}
              buttonStyle={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            /> */}

          </View>

        </View>
  );
};

export default ResourceLocation;

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

  secondaryButton: {
    backgroundColor: '#E2E9F3',
    padding: 25
  },

  tertiaryButton: {
    // backgroundColor: '#E2E9F3',
    padding: 25
  },

  subtitle: {
    marginBottom: -2,
    color: '#2F2E41',
    fontSize: 17,
    fontFamily: 'Manrope-Bold',
    width: '80%',
  },
  requirementIndicator: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fce9c0',
  },
  distance: {
    marginBottom: 8,
    color: '#2F2E41',
    fontSize: 17,
    fontFamily: 'Manrope-Bold',
    width: '80%',
  },
  title: {
    marginBottom: 10,
    color: '#2F2E41',
    fontSize: 35,
    fontWeight: '900',
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    width: '80%',
    alignItems:'center',
    paddingBottom: 5
  },
  indicator: {
    // backgroundColor: '#fce9c0',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  openOrClosed: {
    fontSize: 17,
    // fontWeight: '700',
    // color: '#664501',
    fontFamily: 'Manrope-Bold',
  },
  timing: {
    fontSize: 17,
    // fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
});