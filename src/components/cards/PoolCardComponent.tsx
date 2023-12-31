import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CONSTANT } from '../../themes';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { useNavigation } from '@react-navigation/native';

type PoolCardProps = {
  poolNameProps: string;
  poolLocationProps: string;
  imageUri: string;
  poolStatusIndicator: React.ReactNode;
  onPress: () => void;
};

const PoolCardComponent = ({
  poolNameProps,
  poolLocationProps,
  onPress,
  imageUri,
  poolStatusIndicator,
}: PoolCardProps) => {
  return (
    <View className="items-center px-1">
      <TouchableOpacity
        style={styles.cardContainer}
        className="my-2 p-2 px-3 rounded-lg shadow-md drop-shadow-sm shadow-gray-600"
        onPress={onPress}>
        <View>
          <View className="items-center">
            {/* Change this image later */}
            <Image
              source={{
                // uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAABfCAYAAAAkox8MAAAAAXNSR0IArs4c6QAABH5JREFUeF7tmElP8zAQhs0mChKLBAXEcgBO/P+/wZ0T5cIiVrFICBDLp4nkfK5JUtNppXT85NbWnWTe9/F4JlPHx8c/jit7BaYAIXsGCgEAAQ4AAQb+K0BFgAYqAgxQEWAgUoCjASQ4GmCAowEGOBpgoEoBegS4oEeAAXoEGKBHgAF6BBioVYBmEThoFmGAZhEGaBZhgGYRBmgWYaBZAaYGCGFqgAGmBhhgaoABpgYYYGqAAaYGGEhQgPExQaQclgBCDi4n5AgICSLlsAQQcnA5IUdASBAphyWAkIPLCTkCQoJIOSwBhBxcTsgREBJEymEJIOTgckKOgJAgUg5LWgvC4uKiOzg4cI+Pj+78/LzPi93dXbe5uVl+J2tOT08b11xfX/+KMwqDDw8P3erqahHq+/vbXVxcuJubmzL0xsaG29nZcdPT0323G9fzDJtTa0E4OjpyAkMsmBf29va2MNZ/fn5+LmEQULrdbmlK/HlYseL/CQTLy8vlfeRZtre33eXlZQmD3Ht9fd2dnZ25p6enUd165HFaB8LKyorb3993MzMzRbIxCAKI/Nbr9dzr62uxRgxZWFgovpNLKsnX15c7OTkpBZP/yRV+p1HTP+fLy0tfNQqfRZ4v/qy55zj/2yoQvLifn5/u/v7ebW1tOb/zm0QI4ZibmytAuru76zsKmnZmeF8PmD+aZmdnK3dz1e6XZ4zvI8/28fHx6+gap6nDxG4VCGEC8RFQl1zVURGXZ29QeFzE8eI4cdmvWj/oPu/v733VzcdoW38gzzWxIIRHiAjud3LTTm0CwR8xS0tLRTWRtWHfEYPQdDT4vkH+I43i29tbeST5RrdtMEwsCKExsnvFQGnI5ufnfzVsKRVB1tTBVVeNpOx3Op2+ZlGMlyueHsIYVX3OMOV8lP8xAUK4O6V5G1Syw/EuFtOPg6k71k83Ekcqk1SRtbW1RhBCcNsySZgDQcr6X5tFD0M488vUMczIl2JyyppR7vaUWBMFgu/k49EwbPQeHh6GGh99bBHt6urK7e3tFTu8btys6hHi56t7fzHqUTbF6EFrJgoEf9bLW0VfukMDfcMYN2QpL5SqXkKF96kSUgyVnsRXjnjSqHq2QdPIIMPG9fvEgRDC4EWRFzfxzo1fQzed+b6ihN29xI6bwToYxHC5qo4TD4MAI1fVa+hxmfuXuK0F4S9JsFavACDoNTQRARBM2KhPAhD0GpqIAAgmbNQnAQh6DU1EAAQTNuqTAAS9hiYiAIIJG/VJAIJeQxMRAMGEjfokAEGvoYkIgGDCRn0SgKDX0EQEQDBhoz4JQNBraCICIJiwUZ8EIOg1NBEBEEzYqE8CEPQamogACCZs1CcBCHoNTUQABBM26pMABL2GJiIAggkb9UkAgl5DExEAwYSN+iQAQa+hiQiAYMJGfRKAoNfQRARAMGGjPglA0GtoIgIgmLBRnwQg6DU0EQEQTNioTwIQ9BqaiAAIJmzUJwEIeg1NRAAEEzbqkwAEvYYmIgCCCRv1SQCCXkMTEQDBhI36JP4BMtagSg3G4XkAAAAASUVORK5CYII=',
                uri: imageUri,
              }}
              style={styles.image}
              className="rounded-md "
            />
          </View>
          <View className="pt-3 items-start">
            {/* Change this text later */}
            <Text
              style={styles.poolName}
              numberOfLines={1}
              className="text-ellipsis">
              {poolNameProps}
            </Text>
            <Text
              style={styles.poolLocation}
              numberOfLines={1}
              className="text-ellipsis">
              {poolLocationProps}
            </Text>
          </View>
        </View>
        <View className="items-end mt-4">
          {poolStatusIndicator}
          {/* <View
            style={styles.indicatorContainer}
            className="flex flex-row justify-center gap-x-1 items-center rounded-full">
            <View style={styles.indicatorDot} className="rounded-full" />
            <Text style={styles.cardIndicator}>Baik</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: CONSTANT.themeColors.base,
    width: wp('39%'),
    height: hp('28%'),
  },
  poolName: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.body,
    color: CONSTANT.themeColors.font,
  },
  poolLocation: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.caption,
    color: CONSTANT.themeColors.font,
  },
  image: {
    width: wp('34.5%'),
    height: hp('13.5%'),
  },
  indicatorContainer: {
    backgroundColor: CONSTANT.themeColors.complementary,
    height: hp('3%'),
    width: wp('16%'),
  },
  indicatorDot: {
    backgroundColor: CONSTANT.themeColors.success,
    width: wp('3%'),
    height: hp('1.5%'),
  },
  cardIndicator: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.caption,
    color: CONSTANT.themeColors.font,
  },
});

export default PoolCardComponent;
