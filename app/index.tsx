import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


const BACKGROUND_COLOR = '#FAFDF3';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, fontError] = Font.useFonts({
  'Monoton': require('../assets/fonts/Monoton-Regular.ttf'),
});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // setLoading(true);
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //   setError('Permission to access location was denied');
        //   setLoading(false);
        //   return;
        // }

        // let location = await Location.getCurrentPositionAsync({});
        // const { latitude, longitude } = location.coords;
        // const apiKey = WEATHER_API_KEY;
        // const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

        // const response = await axios.get(weatherUrl);
        // const data = response.data;
        
        // setWeatherData({
        //   temperature: Math.round(data.main.temp),
        //   condition: data.weather[0].main,
        //   location: data.name.toUpperCase(),
        //   humidity: data.main.humidity,
        //   windSpeed: Math.round(data.wind.speed)
        // });
          setWeatherData({
          temperature:38,
          condition: "Cloudy",
          location: "LUCKNOW",
          humidity: 80,
          windSpeed: 10
        });
      } catch (err) {
        setError("Could not fetch weather data. Please check your network and API key.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const formatDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weatherData && (
        <View style={styles.contentContainer}>
          {/* Main temperature display - first thing on screen */}
          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>
              {weatherData.temperature}°
            </Text>
          </View>

          {/* Date */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {formatDate(currentTime)}
            </Text>
          </View>

          {/* Separator line
          <View style={styles.separator}></View> */}

          {/* City, Weather condition, Humidity, and Wind on same line with separators */}
          <View style={styles.infoRow}>
            <Text style={styles.locationText}>
              {weatherData.location}
            </Text>

            <View style={styles.verticalSeparator}></View>

            <View style={styles.infoItem}>
              
              <Text style={styles.infoText}>
                {weatherData.condition}
              </Text>
            </View>

            <View style={styles.verticalSeparator}></View>

            <View style={styles.infoItem}>
              
              <Text style={styles.infoText}>
                {weatherData.humidity}%
              </Text>
            </View>

            <View style={styles.verticalSeparator}></View>

            <View style={styles.infoItem}>

              <Text style={styles.infoText}>
                {weatherData.windSpeed} MPH
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'red',
    padding: wp('2%'),
    paddingLeft: wp('4%'),
    // padding: wp('1%'),
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  tempContainer: {
    height: hp('40%'),
    // borderWidth: 1,
    borderColor: 'black',
  },
  temperature: {
    fontSize: hp('33%'),
    fontWeight: '500',
    fontFamily: 'Monoton',
    color: '#000',
  },
  dateContainer: {
    marginBottom: 48,
  },
  dateText: {
    fontSize: 28,
    color: '#4b5563',
    letterSpacing: 2,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#d1d5db',
    marginBottom: 48,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  locationText: {
    fontSize: 28,
    letterSpacing: 1,
  },
  verticalSeparator: {
    width: 1,
    height: 48,
    backgroundColor: '#9ca3af',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    fontSize: 24,
    color: '#4b5563',
    letterSpacing: 1,
  },
  loadingText: {
    fontSize: 20,
    marginTop: 10,
    color: '#333',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
  }
});
