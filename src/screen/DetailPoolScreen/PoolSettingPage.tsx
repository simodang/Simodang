import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import usePondStore from '../../store/pond/PondStore';

import { CONSTANT } from '../../themes';

import ThresholdFieldComponent from '../../components/Field/ThresholdFieldComponent';
import ButtonComponent from '../../components/button/ButtonComponent';
import ControlledCard from '../../components/cards/ControlledCard';

const PoolSettingPage = () => {
  const { pondDetail, updateDeviceData } = usePondStore();

  const [savedData, setSavedData] = useState<boolean | null>(
    usePondStore.getState().pondDetail.device.isSaved,
  );

  const [autoWaterEnable, setAutoWaterEnable] = useState<boolean | null>(
    usePondStore.getState().pondDetail.device.autoWaterEnabled,
  );

  const [autoFeedEnable, setAutoFeedEnable] = useState<boolean | null>(
    usePondStore.getState().pondDetail.device.autoFeedEnabled,
  );

  const [newLowValue, setNewLowValue] = useState({
    newTempLow: pondDetail.device.tempLow,
    newPHLow: pondDetail.device.phLow,
    newTDOLow: pondDetail.device.tdoLow,
    newTDSLow: pondDetail.device.tdsLow,
    newTurbiditiesLow: pondDetail.device.turbiditiesLow,
  });
  const [newHighValue, setNewHighValue] = useState({
    newTempHigh: pondDetail.device.tempHigh,
    newPHHigh: pondDetail.device.phHigh,
    newTDOHigh: pondDetail.device.tdoHigh,
    newTDSHigh: pondDetail.device.tdsHigh,
    newTurbiditiesHigh: pondDetail.device.turbiditiesHigh,
  });

  const handleUpdateThresholdData = async () => {
    const updatedData = {
      ...pondDetail,
      device: {
        ...pondDetail.device,
        tempLow: Number(newLowValue.newTempLow),
        tempHigh: Number(newHighValue.newTempHigh),
        phLow: Number(newLowValue.newPHLow),
        phHigh: Number(newHighValue.newPHHigh),
        tdoLow: Number(newLowValue.newTDOLow),
        tdoHigh: Number(newHighValue.newTDOHigh),
        tdsLow: Number(newLowValue.newTDSLow),
        tdsHigh: Number(newHighValue.newTDSHigh),
        turbiditiesLow: Number(newLowValue.newTurbiditiesLow),
        turbiditiesHigh: Number(newHighValue.newTurbiditiesHigh),
      },
    };

    await updateDeviceData(updatedData);
  };

  const switchSavedData = async () => {
    const updateData = {
      ...pondDetail,
      device: {
        ...pondDetail.device,
        isSaved: !savedData,
      },
    };

    setSavedData(previousState => !previousState);

    console.log(updateData);

    await updateDeviceData(updateData);
  };

  const switchAutoFeed = async () => {
    const updateData = {
      ...pondDetail,
      device: {
        ...pondDetail.device,
        autoFeedEnabled: !autoFeedEnable,
      },
    };

    setAutoFeedEnable(previousState => !previousState);

    console.log(updateData);

    await updateDeviceData(updateData);
  };

  const switchAutoWater = async () => {
    const updateData = {
      ...pondDetail,
      device: {
        ...pondDetail.device,
        autoWaterEnabled: !autoWaterEnable,
      },
    };

    setAutoWaterEnable(previousState => !previousState);

    console.log(updateData);

    await updateDeviceData(updateData);
  };

  return (
    <View className="my-1">
      {/* Threshold Setting Section */}
      <View>
        <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
          <View className="flex flex-row mb-2">
            <ControlledCard
              title="Simpan Data"
              thumbColor={
                savedData
                  ? CONSTANT.themeColors.primary
                  : CONSTANT.themeColors.base
              }
              onValueChange={switchSavedData}
              value={savedData ?? false}
            />
            <ControlledCard
              title="Aktifkan Auto Feeder"
              thumbColor={
                autoFeedEnable
                  ? CONSTANT.themeColors.primary
                  : CONSTANT.themeColors.base
              }
              onValueChange={switchAutoFeed}
              value={autoFeedEnable ?? false}
            />
            <ControlledCard
              title="Aktifkan Auto Water"
              thumbColor={
                autoWaterEnable
                  ? CONSTANT.themeColors.primary
                  : CONSTANT.themeColors.base
              }
              onValueChange={switchAutoWater}
              value={autoWaterEnable ?? false}
            />
          </View>
        </ScrollView>

        <View className="mt-2">
          <Text style={styles.poolSettingTitle}>Atur Threshold Parameter</Text>
        </View>

        {/* Threshold Parameter Setup Section */}
        <View className="mb-2">
          <ThresholdFieldComponent
            valueLow={pondDetail.device.tempLow}
            valueHigh={pondDetail.device.tempHigh}
            onChangeLowValue={value =>
              setNewLowValue(prevState => ({
                ...prevState,
                newTempLow: Number(value),
              }))
            }
            onChangeHighValue={value =>
              setNewHighValue(prevState => ({
                ...prevState,
                newTempHigh: Number(value),
              }))
            }
            type="float"
            thresholdTitle="Suhu"
            thresholdUnit={
              <Text style={styles.appendTextStyle} className="mr-1">
                &#176;C
              </Text>
            }
          />
          <ThresholdFieldComponent
            valueLow={pondDetail.device.phLow}
            valueHigh={pondDetail.device.phHigh}
            onChangeLowValue={value =>
              setNewLowValue(prevState => ({
                ...prevState,
                newPHLow: Number(value),
              }))
            }
            onChangeHighValue={value =>
              setNewHighValue(prevState => ({
                ...prevState,
                newPHHigh: Number(value),
              }))
            }
            type="float"
            max={14.0}
            thresholdTitle="pH"
          />
          <ThresholdFieldComponent
            valueLow={pondDetail.device.tdoLow}
            valueHigh={pondDetail.device.tdoHigh}
            onChangeLowValue={value =>
              setNewLowValue(prevState => ({
                ...prevState,
                newTDOLow: Number(value),
              }))
            }
            onChangeHighValue={value =>
              setNewHighValue(prevState => ({
                ...prevState,
                newTDOHigh: Number(value),
              }))
            }
            type="float"
            thresholdTitle="TDO"
            thresholdUnit={
              <Text style={styles.appendTextStyle} className="mr-1">
                mg/L
              </Text>
            }
          />
          <ThresholdFieldComponent
            valueLow={pondDetail.device.tdsLow}
            valueHigh={pondDetail.device.tdsHigh}
            onChangeLowValue={value =>
              setNewLowValue(prevState => ({
                ...prevState,
                newTDSLow: Number(value),
              }))
            }
            onChangeHighValue={value =>
              setNewHighValue(prevState => ({
                ...prevState,
                newTDSHigh: Number(value),
              }))
            }
            type="int"
            thresholdTitle="TDS"
            thresholdUnit={
              <Text style={styles.appendTextStyle} className="mr-1">
                ppm
              </Text>
            }
          />
          <ThresholdFieldComponent
            valueLow={pondDetail.device.turbiditiesLow}
            valueHigh={pondDetail.device.turbiditiesHigh}
            onChangeLowValue={value =>
              setNewLowValue(prevState => ({
                ...prevState,
                newTurbiditiesLow: Number(value),
              }))
            }
            onChangeHighValue={value =>
              setNewHighValue(prevState => ({
                ...prevState,
                newTurbiditiesHigh: Number(value),
              }))
            }
            type="float"
            thresholdTitle="Turbiditas"
            thresholdUnit={
              <Text style={styles.appendTextStyle} className="mr-1">
                NTU
              </Text>
            }
          />
        </View>
      </View>

      {/* Button Section */}
      <View className="my-10">
        <ButtonComponent
          buttonText="Simpan Perubahan"
          style={styles.saveButton}
          className="rounded-md w-fit px-3 py-1.5 text-center align-middle"
          onPress={() => {
            handleUpdateThresholdData();
            // console.log('Button Save Pressed');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  poolSettingTitle: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.font,
  },
  saveButton: {
    backgroundColor: CONSTANT.themeColors.primary,
    fontFamily: CONSTANT.customFonts.body,
    fontSize: CONSTANT.fontSizes.body,
    color: CONSTANT.themeColors.base,
  },
  widthInputContainer: {
    width: wp('15%'),
  },
  appendTextStyle: {
    fontFamily: CONSTANT.customFonts.body,
    fontSize: CONSTANT.fontSizes.caption,
    color: CONSTANT.themeColors.font,
  },
});

export default PoolSettingPage;
