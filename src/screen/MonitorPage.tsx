import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  Text,
} from 'react-native';
import {
  // widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { CONSTANT } from '../themes';
import SearchComponent from '../components/search/SearchComponent';
import PoolCardComponent from '../components/cards/PoolCardComponent';
import usePondStore from '../store/pond/PondStore';

const MonitorPage = () => {
  const { totalPonds, pondsData, getAllPonds } = usePondStore();
  const navigation = useNavigation();

  const handlePondPress = (pondId: string) => {
    navigation.navigate('PoolDetail', { pondId });
  };

  useEffect(() => {
    getAllPonds();
  }, [getAllPonds]);

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={styles.homePage}
      className="flex-1 relative">
      <StatusBar />

      {/* Header Section */}
      <View
        style={styles.headerContainer}
        className="w-full rounded-b-3xl fixed">
        <View className="my-10 mx-4 px-3">
          <SearchComponent />
        </View>
      </View>

      <SafeAreaView className="m-4 my-5 px-3 items-center">
        {/* Pool List Section */}
        <View>
          <View className="flex flex-row justify-between items-center">
            <View className="flex-row justify-center items-center space-x-1">
              <Text style={styles.myPool}>Kolam Saya</Text>
              <Text style={styles.separator}>●</Text>
              <Text style={styles.count}>{totalPonds}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('AddPool')}>
              <Text style={styles.count}>Tambah</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-3">
            <FlatList
              data={pondsData}
              renderItem={({ item }) => (
                <PoolCardComponent
                  poolNameProps={item.pondName}
                  poolLocationProps={item.city}
                  onPress={() => handlePondPress(item.pondId)}
                />
              )}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  homePage: {
    backgroundColor: CONSTANT.themeColors.base,
  },
  headerContainer: {
    backgroundColor: CONSTANT.themeColors.primary,
    height: hp('15%'),
  },
  myPool: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.font,
  },
  separator: {
    color: CONSTANT.themeColors.font,
    fontSize: hp('1%'),
  },
  count: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.font,
  },
  changePool: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.body,
    color: CONSTANT.themeColors.font,
  },
});

export default MonitorPage;
