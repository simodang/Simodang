import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import { CONSTANT } from '../themes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ChevronRightIcon } from 'react-native-heroicons/solid';
import messaging from '@react-native-firebase/messaging';

import usePondStore from '../store/pond/PondStore';

import InformationCardComponent from '../components/cards/InformationCardComponent';
import PoolCardComponent from '../components/cards/PoolCardComponent';
import NotifIconSvg from '../assets/icons/NotifIconSolid.svg';
import WebViewCardComponent from '../components/cards/WebViewCardComponent';
import useProfileStore from '../store/profile/ProfileStore';
import useArticleStore from '../store/article/ArticleStore';
import moment from 'moment';

const HomePage = () => {
  const { getAllArticles, getAllArticlesData } = useArticleStore();
  const { getUser, userDetail } = useProfileStore();
  const { pondsData, getAllPonds } = usePondStore();

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const handlePondPress = (pondId: string) => {
    navigation.navigate('PoolDetail', { pondId });
  };

  const handleArticlePress = (articleId: string) => {
    console.log(articleId);

    navigation.navigate('ArticleDetail', { articleId });
  };

  const handleNotificationPress = () => {
    navigation.navigate('NotificationPage');
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getAllPonds();
    setRefreshing(false);
  }, [getAllPonds]);

  useEffect(() => {
    const pondIds = usePondStore.getState().pondsData.map(item => item.pondId);
    pondIds.forEach(message => {
      // fcm for notification
      messaging().subscribeToTopic(message);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
      console.log(`Remote Message ${remoteMessage}`);
    });
  }, []);

  useEffect(() => {
    getAllPonds();
    getAllArticles();
    getUser();
  }, [getAllPonds, getUser, getAllArticles]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.homePage}
      className="flex-1 relative"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <StatusBar />

      {/* Header Section */}
      <View style={styles.headerContainer} className="w-full rounded-b-3xl">
        <View className="justify-self-center mx-4 px-3">
          <View className="flex-row mt-7 mx-0 gap-x-4 ">
            <View className="flex-col">
              <Text style={styles.heading}>
                Hai, {userDetail.userName?.split(' ')[0]}!
              </Text>
              <Text
                style={styles.caption}
                numberOfLines={1}
                className="my-1 text-ellipsis">
                Bagaimana kondisi rata-rata kolam anda?
              </Text>
            </View>
            <View className="align-middle">
              <Pressable onPress={() => handleNotificationPress()}>
                <NotifIconSvg
                  height={hp('3.5%')}
                  width={wp('7%')}
                  fill={CONSTANT.themeColors.base}
                />
              </Pressable>
            </View>
          </View>
          <View
            style={styles.cardInformationContainer}
            className="rounded-xl my-5 justify-center items-center">
            <InformationCardComponent />
          </View>
        </View>
      </View>

      <SafeAreaView className="mx-4 px-3 mb-4">
        {/* Pool List Section */}
        <View className="mt-7">
          <View className="flex flex-row justify-between items-center">
            <Text style={styles.myPool}>Kolam Saya</Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                navigation.navigate('Monitor');
              }}>
              <Text style={styles.showAll}>Lihat Semua</Text>
              <ChevronRightIcon
                size={CONSTANT.fontSizes.body}
                color={CONSTANT.themeColors.font}
                fill="black"
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={pondsData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <PoolCardComponent
                  poolNameProps={item.pondName}
                  poolLocationProps={item.city}
                  imageUri={item.imageUrl}
                  poolStatusIndicator={
                    item.status === true ? (
                      <View
                        style={styles.indicatorContainer}
                        className="flex flex-row justify-center gap-x-1 items-center rounded-full">
                        <View
                          style={styles.indicatorGoodDot}
                          className="rounded-full"
                        />
                        <Text style={styles.cardIndicator}>Baik</Text>
                      </View>
                    ) : (
                      <View
                        style={styles.indicatorContainer}
                        className="flex flex-row justify-center gap-x-1 items-center rounded-full">
                        <View
                          style={styles.indicatorBadDot}
                          className="rounded-full"
                        />
                        <Text style={styles.cardIndicator}>Buruk</Text>
                      </View>
                    )
                  }
                  onPress={() => handlePondPress(item.pondId)}
                />
              );
            }}
          />
        </View>

        {/* News Section */}
        <View className="mt-4">
          <View>
            <Text style={styles.informationForYou}>Informasi untuk Anda</Text>
          </View>
          <View className="mt-2 gap-y-3">
            <FlatList
              data={getAllArticlesData}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({ item }) => {
                return (
                  <View className="my-1">
                    <WebViewCardComponent
                      title={item.title}
                      imageUri={item.imageUrl}
                      createdAt={moment(item.createdAt).format('DD MMM YYYY')}
                      onPress={() => {
                        handleArticlePress(item.id);
                      }}
                    />
                  </View>
                );
              }}
            />
          </View>
          {/* <View className="mt-2">
            <WebViewCardComponent />
          </View> */}
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
    height: hp('35%'),
  },
  cardInformationContainer: {
    backgroundColor: CONSTANT.themeColors.base,
    height: hp('15%'),
  },
  heading: {
    fontFamily: CONSTANT.customFonts.heading1,
    fontSize: CONSTANT.fontSizes.heading1,
    color: CONSTANT.themeColors.base,
  },
  caption: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.body,
    color: CONSTANT.themeColors.base,
  },
  myPool: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.font,
  },
  indicatorContainer: {
    backgroundColor: CONSTANT.themeColors.complementary,
    height: hp('3%'),
    width: wp('16%'),
  },
  indicatorGoodDot: {
    backgroundColor: CONSTANT.themeColors.success,
    width: wp('3%'),
    height: hp('1.5%'),
  },
  indicatorBadDot: {
    backgroundColor: CONSTANT.themeColors.warningRed,
    width: wp('3%'),
    height: hp('1.5%'),
  },
  cardIndicator: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.caption,
    color: CONSTANT.themeColors.font,
  },
  showAll: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.body,
    color: CONSTANT.themeColors.font,
  },
  informationForYou: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.font,
  },
});

export default HomePage;
