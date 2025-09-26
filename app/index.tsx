import * as Font from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Cloud from "../assets/svg/Cloud";
import Humidity from "../assets/svg/Humidity";
import Wind from "../assets/svg/Wind";
import getLocation from './location';
import getWeatherData, { CurrentParam, DailyParam, WeatherData } from './weather';

const BACKGROUND_COLOR = '#FAFDF3';
const ICON_HEIGHT = hp('5%');
const ICON_WIDTH = hp('5%');



export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontLoaded, fontError] = Font.useFonts({
    'Monoton': require('../assets/fonts/Monoton-Regular.ttf'),
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | number;
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const location = await getLocation();
        const { latitude, longitude } = location.coords;
        try {
          const weather = await getWeatherData({
            latitude,
            longitude,
            current: [
              CurrentParam.Temperature2m,
              CurrentParam.RelativeHumidity2m,
              CurrentParam.WindSpeed10m,
              CurrentParam.WeatherCode
            ],
            daily: [
              DailyParam.PrecipitationProbabilityMax
            ]
          });
          setWeatherData(weather);
        } catch (err) {
          setError("Could not fetch weather data. Please check your network and API key.");
          console.error(err);
        }
      } catch (err) {
        setError("Could not fetch location.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    intervalId = setInterval(fetchWeather, 5 * 60 * 1000); // 5 minutes
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
   useEffect(() => {
    if (Platform.OS === 'android') {
      const setImmersive = async () => {
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setVisibilityAsync('hidden');
      };
      setImmersive();
      const subscription = NavigationBar.addVisibilityListener(({ visibility }) => {
        if (visibility === 'visible') {
          setImmersive();
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);
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
          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>
              {weatherData.temperature}°
            </Text>
          </View>

          <View style={styles.infoRow}>

            <View style={styles.infoItem}>
              <Cloud height={ICON_HEIGHT} width={ICON_WIDTH} />
              <Text style={styles.infoText}>
                {weatherData.condition.toUpperCase()}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Humidity height={ICON_HEIGHT} width={ICON_WIDTH} />
              <Text style={styles.infoText}>
                {weatherData.humidity}%
              </Text>
            </View>


            <View style={styles.infoItem}>
              <Wind height={ICON_HEIGHT} width={ICON_WIDTH} />
              <Text style={styles.infoText}>
                {weatherData.windSpeed} KMPH
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
    padding: wp('2%'),
    paddingLeft: wp('4%'),
    gap: hp('5%'),
  },
  tempContainer: {
    height: hp('45%'),
    // borderWidth: 1,
    borderColor: 'black',
  },
  temperature: {
    fontSize: hp('35%'),
    fontWeight: '500',
    fontFamily: 'Monoton',
    color: '#000',
    letterSpacing: wp('2%'),
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
    justifyContent: 'space-between',
    height: hp('10%'),
    minWidth: '100%',
    // borderWidth: 1,
    paddingHorizontal: wp('2%'),
  },
  verticalSeparator: {
    width: 5,
    height: 48,
    backgroundColor: '#9ca3af',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: wp('40%'),
    gap: wp('2%'),
    // borderWidth: 1,
  },
  infoText: {
    fontSize: hp('4%'),
    color: '#4b5563',
    letterSpacing: 10,
    fontWeight: '600',
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
