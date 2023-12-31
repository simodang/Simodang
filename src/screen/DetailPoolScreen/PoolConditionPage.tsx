import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { StyleSheet, View, Text } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import usePondStore from '../../store/pond/PondStore';

import { CONSTANT } from '../../themes';

import DisplayTextComponent from '../../components/text/DisplayTextComponent';

type PoolConditionProps = {
  pondId?: string;
};

const PoolConditionPage = ({ pondId }: PoolConditionProps) => {
  const { pondDetail } = usePondStore();

  const [temperature, setTemperature] = useState<number>(0);
  const [pH, setPH] = useState<number>(0);
  const [tdo, setTDO] = useState<number>(0);
  const [tds, setTDS] = useState<number>(0);
  const [turbidity, setTurbidity] = useState<number>(0);

  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      const topic = remoteMessage.from?.split('/').pop();
      if (topic?.split('-').pop() === 'realtime') {
        if (topic.split('-')[0] === pondId) {
          setTemperature(
            remoteMessage.data ? Number(remoteMessage.data.temperature) : 0,
          );
          setPH(remoteMessage.data ? Number(remoteMessage.data.ph) : 0);
          setTDO(remoteMessage.data ? Number(remoteMessage.data.tdo) : 0);
          setTDS(remoteMessage.data ? Number(remoteMessage.data.tds) : 0);
          setTurbidity(
            remoteMessage.data ? Number(remoteMessage.data.turbidity) : 0,
          );
        }
      }
    });
  }, [pondId]);

  return (
    <View className="my-1">
      {/* Page Title Section */}
      <View>
        <Text style={styles.poolConditionTitle}>Informasi Kolam</Text>
      </View>

      <View className="mb-2">
        {pondDetail.deviceId ? (
          <DisplayTextComponent
            DisplayTitle="Kode Alat"
            DisplayValue={pondDetail.deviceId}
            TextStyle="ml-3"
          />
        ) : (
          <DisplayTextComponent
            DisplayTitle="Kode Alat"
            DisplayValue=""
            TextStyle="ml-3"
          />
        )}
        <DisplayTextComponent
          DisplayTitle="Tanggal Masuk Benih"
          DisplayValue={moment(pondDetail.seedDate)
            .utcOffset('+0700')
            .format('D MMMM YYYY')}
          TextStyle="ml-3"
        />
        <DisplayTextComponent
          DisplayTitle="Status Tambak"
          DisplayValue={pondDetail.isFilled ? 'Terisi' : 'Kosong'}
          TextStyle="ml-3"
        />
      </View>

      {/* Pool Measurement Section */}
      <View className="flex flex-row mt-2 justify-between items-center">
        <Text style={styles.poolConditionTitle}>Pengukuran Saat Ini</Text>
      </View>

      <View className="mb-4">
        <DisplayTextComponent
          DisplayTitle="Suhu"
          DisplayValue={`${temperature} \u00B0C`}
          TextStyle="ml-3"
        />
        <DisplayTextComponent
          DisplayTitle="pH"
          DisplayValue={pH}
          TextStyle="ml-3"
        />
        <DisplayTextComponent
          DisplayTitle="TDO"
          DisplayValue={`${tdo} mg/L`}
          TextStyle="ml-3"
        />
        <DisplayTextComponent
          DisplayTitle="TDS"
          DisplayValue={`${tds} ppm`}
          TextStyle="ml-3"
        />
        <DisplayTextComponent
          DisplayTitle="Turbiditas"
          DisplayValue={`${turbidity} NTU`}
          TextStyle="ml-3"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  poolConditionTitle: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.font,
  },
});

export default PoolConditionPage;
