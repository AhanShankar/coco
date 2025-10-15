import * as Font from 'expo-font';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import Humidity from "../../assets/icons/Humidity";
import Wind from "../../assets/icons/Wind";
import { delay } from '../../utils/helper';
import getLocation from '../../utils/location';
import getWeatherData, { CurrentParam, DailyParam, getWeatherIcon, WeatherData } from '../../utils/weather';


const BACKGROUND_COLOR = '#FAFDF3';
const ICON_HEIGHT = RFValue(25);
const ICON_WIDTH = RFValue(25);
const NAVBAR_VISIBLE_TIME = 1000; // 1 second

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontLoaded, fontError] = Font.useFonts({
    'Monoton': require('../../assets/fonts/Monoton-Regular.ttf'),
  });

  useEffect(() => {
    activateKeepAwakeAsync();
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
      deactivateKeepAwake();
    };
  }, []);
  useEffect(() => {
    if (Platform.OS === 'android') {
      const setImmersive = async () => {
        await NavigationBar.setVisibilityAsync('hidden');
      };
      setImmersive();
      const subscription = NavigationBar.addVisibilityListener(async ({ visibility }) => {
        if (visibility === 'visible') {
          await delay(NAVBAR_VISIBLE_TIME);
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
              {weatherData.temperature.toFixed(1)}°
            </Text>
          </View>
          <View style={styles.infoRow}>

            <View style={styles.infoItem}>
              {getWeatherIcon(weatherData.condition, ICON_HEIGHT, ICON_WIDTH)}
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
    paddingHorizontal: '1%',
    gap: '5%',
    // borderWidth: 1,
  },
  tempContainer: {
    height: '70%',
    // borderWidth: 1,
    borderColor: 'black',
  },
  temperature: {
    fontSize: RFValue(210),
    fontWeight: '500',
    fontFamily: 'Monoton',
    color: '#000',
    letterSpacing: RFValue(10),
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
    height: '20%',
    minWidth: '100%',
    // borderWidth: 1,
  },
  verticalSeparator: {
    width: 5,
    height: 48,
    backgroundColor: '#9ca3af',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30%',
    gap: '10%',
    // borderWidth: 1,
  },

  infoText: {
    fontSize: RFValue(20),
    color: '#4b5563',
    letterSpacing: RFValue(5),
    fontWeight: '300',
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
