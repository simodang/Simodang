import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  PermissionsAndroid,
  Alert,
  Image,
  // ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import axios from 'axios';
import { PhotoIcon } from 'react-native-heroicons/solid';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

import { CONSTANT } from '../themes';

import useDeviceStore from '../store/device/DeviceStore';
import { PondsStatusDropdown } from '../utils/dropdownData/DropdownData';

import BackIcon from '../assets/icons/BackIcon.svg';
import IconQROutline from '../assets/icons/IconQROutline.svg';
import InputFieldComponent from '../components/input/InputFieldComponent';
import DropdownComponent from '../components/dropdown/DropdownComponent';
import { ModalComponent } from '../components/popupDialog/ModalComponent';
import ButtonComponent from '../components/button/ButtonComponent';
// import useAuthStore from '../store/auth/AuthStore';

const AddPoolPage = () => {
  const {
    getAllDevices,
    filterIdDeviceId,
    dropdownData,
    scanResult,
    deviceId,
    filteredDeviceId,
    dropdownIdDevicesValue,
  } = useDeviceStore();

  //* Dropdown State
  const [isFocusIdDevices, setIsFocusIdDevices] = useState<boolean>(false);
  const [isFocusPondStatus, setIsFocusPondStatus] = useState<boolean>(false);
  // const [dropdownIdDevicesValue, setDropdownIdDevicesValue] = useState<
  //   string | undefined
  // >();
  const [dropdownPondStatusValue, setDropdownPondStatusValue] = useState<
    string | undefined
  >();

  //* state for filepath image uploade
  const [filePath, setFilePath] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string>();
  const [firebaseImageURL, setFirebaseImageURL] = useState<string | undefined>(
    undefined,
  );

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  //* state for submit button
  // const [inputData, setInputData] = useState({
  //   name: '',
  //   address: '',
  //   city: '',
  //   deviceId: '',
  // });

  const navigation = useNavigation();

  //* Camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message:
              'Aplikasi membutuhkan izin akses kamera untuk mengambil gambar',
            buttonPositive: 'OK',
            buttonNegative: 'CANCEL',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.warn(error);
        return false;
      }
    } else {
      return true;
    }
  };

  //* external write permission
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission for storing files.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err: any) {
        console.warn(err);
        Alert.alert('Write permission err', err.toString());
      }
      return false;
    } else {
      return true;
    }
  };

  const handleModal = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  const captureImage = async (type: 'photo') => {
    const options = {
      mediaType: type,
      saveToPhotos: true,
    };

    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          Alert.alert('User cancelled camera picker');
          return;
        } else if (response.errorCode === 'camera_unavailable') {
          Alert.alert('Camera not available on device');
          return;
        } else if (response.errorCode === 'permission') {
          Alert.alert('Permission not satisfied');
          return;
        } else if (response.errorCode === 'others') {
          const errorMessage = response.errorMessage || 'Unknown error';
          Alert.alert(errorMessage);
          return;
        }

        setImageUri(response.assets?.[0].uri);
        setFilePath(response.assets);
      });
    }
  };

  const chooseFile = (type: 'photo') => {
    const options = {
      mediaType: type,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        return;
      } else if (response.errorCode === 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode === 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode === 'others') {
        const errorMessage = response.errorMessage || 'Unknown error';
        Alert.alert(errorMessage);
        return;
      }

      setImageUri(response.assets?.[0].uri);
      setFilePath(response.assets);
    });
  };

  const uploadImage = async () => {
    try {
      if (Object.keys(filePath).length === 0) {
        return Alert.alert('Please Select any File');
      }

      setUploading(true);
      setTransferred(0);

      const fileName = filePath[0].uri.substring(
        filePath[0].uri.lastIndexOf('/') + 1,
      );

      const uploadUri =
        Platform.OS === 'ios'
          ? filePath[0].uri.replace('file://', '')
          : filePath[0].uri;

      const task = storage().ref(`/addPond/img/${fileName}`).putFile(uploadUri);

      await task.on('state_changed', taskSnapshot => {
        setTransferred(
          Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
            10000,
        );
      });

      await task.then(() => {
        Alert.alert('Image Uploaded');
        setTransferred(0);

        storage()
          .ref(`/addPond/img/${fileName}`)
          .getDownloadURL()
          .then(downloadedURL => {
            console.log(`DownloadedURL: ${downloadedURL}`);
            setFirebaseImageURL(String(downloadedURL));
          });
      });

      setFilePath({});
    } catch (error) {
      console.log('Error from catch', error);
      Alert.alert(`Error: ${error}`);
    }

    setUploading(false);
  };

  useEffect(() => {
    getAllDevices();
    filterIdDeviceId();
  }, [deviceId, getAllDevices, filterIdDeviceId]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="m-4 my-5 px-3">
          {/* Header Title */}
          <View className="flex flex-row items-center justify-between mt-4">
            <Pressable
              className="items-start"
              onPress={() => navigation.goBack()}>
              <BackIcon fill={CONSTANT.themeColors.font} />
            </Pressable>

            <View className="items-center">
              <Text style={styles.addPoolHeaderTitle}>Tambah Kolam</Text>
            </View>

            <View />
          </View>

          {/* Input Field Section */}
          <View className="mt-10">
            <InputFieldComponent
              inputTitle="Nama Kolam"
              placeholder="Nama Kolam"
              // value={inputData.name}
              // onChangeText={text => handleChangeForm('name', text)}
            />
            <InputFieldComponent
              inputTitle="Alamat Kolam"
              placeholder="Alamat Kolam"
              // value={inputData.address}
              // onChangeText={text => handleChangeForm('address', text)}
            />
            <InputFieldComponent
              inputTitle="Kota"
              placeholder="Kota"
              // value={inputData.city}
              // onChangeText={text => handleChangeForm('city', text)}
            />

            <View className="flex mt-4">
              <View className="flex-row items-center">
                <DropdownComponent
                  // dropdownPlaceholder="Id Perangkat"
                  dropdownPlaceholder={
                    deviceId === filteredDeviceId[0]?.value
                      ? deviceId
                      : 'Id Perangkat'
                  }
                  valueField="label"
                  labelField="value"
                  value={dropdownIdDevicesValue}
                  // dropdownData={dropdownData}
                  dropdownData={
                    deviceId === filteredDeviceId[0]?.value
                      ? filteredDeviceId
                      : dropdownData
                  }
                  dropdownStyle={{ ...styles.dropdown, width: wp('75%') }}
                  isFocus={isFocusIdDevices}
                  onFocus={() => {
                    setIsFocusIdDevices(true);
                  }}
                  onBlur={() => setIsFocusIdDevices(false)}
                  onChange={(item: any) => {
                    deviceId === filteredDeviceId[0]?.value
                      ? useDeviceStore.setState({
                          dropdownIdDevicesValue: deviceId,
                        })
                      : useDeviceStore.setState({
                          dropdownIdDevicesValue: item.label,
                        });

                    setIsFocusIdDevices(false);
                  }}
                />

                <Pressable
                  className="mx-2"
                  onPress={() => {
                    navigation.navigate('QRCode');
                    useDeviceStore.setState({ scan: true });
                  }}>
                  <IconQROutline
                    height={hp('3.5%')}
                    width={wp('7%')}
                    fill={CONSTANT.themeColors.font}
                  />
                </Pressable>
              </View>
              {scanResult && <Text>{deviceId}</Text>}

              <View className="mt-4">
                <DropdownComponent
                  dropdownPlaceholder="Status Kolam"
                  valueField="value"
                  labelField="label"
                  value={dropdownPondStatusValue}
                  dropdownData={PondsStatusDropdown}
                  dropdownStyle={{ ...styles.dropdown, width: wp('75%') }}
                  isFocus={isFocusPondStatus}
                  onFocus={() => setIsFocusPondStatus(true)}
                  onBlur={() => setIsFocusPondStatus(false)}
                  onChange={(item: any) => {
                    setDropdownPondStatusValue(item.value);
                    setIsFocusPondStatus(false);
                  }}
                />
              </View>
            </View>

            <Pressable className="mt-6" onPress={handleModal}>
              <View
                style={styles.photoUploadContainer}
                className="border-2 border-dashed">
                {filePath === null ? (
                  <View className="m-10">
                    <View className="items-center opacity-50">
                      <PhotoIcon
                        size={hp('5%')}
                        fill={CONSTANT.themeColors.disable}
                      />
                    </View>
                    <View>
                      <Text
                        style={styles.uploadImageText}
                        className="text-center opacity-80">
                        Unggah Gambar
                      </Text>
                      <Text style={styles.maxFileSize} className="text-center">
                        Mak. Ukuran File: 5MB
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center m-2">
                    {firebaseImageURL ? (
                      <Image
                        source={{
                          uri: firebaseImageURL,
                        }}
                        height={150}
                        width={270}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.uploadImageText,
                          { color: CONSTANT.themeColors.disable },
                        ]}>
                        Image not available
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </Pressable>

            {/* Modal */}
            <ModalComponent isVisible={isModalVisible}>
              <ModalComponent.Container>
                <ModalComponent.Header title="Unggah Gambar" />
                <ModalComponent.Body>
                  {filePath === null ? (
                    <Text
                      style={[
                        styles.uploadImageText,
                        { color: CONSTANT.themeColors.disable },
                      ]}>
                      Unggah Gambar
                    </Text>
                  ) : (
                    <View>
                      <Image
                        source={{
                          uri: imageUri,
                        }}
                        height={100}
                        width={200}
                      />
                    </View>
                  )}
                </ModalComponent.Body>

                <ModalComponent.Footer>
                  <View className="flex-row space-x-5 py-3">
                    <Pressable
                      className="items-center"
                      onPress={() => captureImage('photo')}>
                      <Text style={styles.footerModalTextStyle}>
                        Buka Kamera
                      </Text>
                    </Pressable>
                    <View style={styles.separator} />
                    <Pressable
                      // style={styles.footerModal}
                      className="items-center">
                      <Text
                        style={styles.footerModalTextStyle}
                        onPress={() => chooseFile('photo')}>
                        Buka Galeri
                      </Text>
                    </Pressable>
                  </View>

                  {uploading ? (
                    <View>
                      <Progress.Bar progress={transferred} width={300} />
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => uploadImage()}
                      style={[
                        styles.footerModal,
                        {
                          borderTopColor: CONSTANT.themeColors.complementary,
                          borderTopWidth: StyleSheet.hairlineWidth,
                        },
                      ]}
                      className="py-3 w-full items-center">
                      <Text
                        style={[
                          styles.footerModalTextStyle,
                          styles.footerModalSubmit,
                        ]}>
                        Submit
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={handleModal}
                    className="pt-3 w-full items-center">
                    <Text
                      style={[
                        styles.footerModalTextStyle,
                        styles.footerModalCancel,
                      ]}>
                      Cancel
                    </Text>
                  </Pressable>
                </ModalComponent.Footer>
              </ModalComponent.Container>
            </ModalComponent>
          </View>

          {/* Buttoon Section */}
          <View className="mt-12 mb-6">
            <ButtonComponent
              buttonText="Simpan"
              style={styles.submitButton}
              className="rounded-md h-fit py-1"
              onPress={() => {
                // handleSubmit();
                console.log('Pressed');
              }}
            />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Activity Indicator
      {isLoading && (
        <ActivityIndicator
          size={hp('10%')}
          hidesWhenStopped={true}
          color={CONSTANT.themeColors.primary}
          style={styles.indicatorWrapper}
        />
      )} */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  indicatorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.15)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  addPoolHeaderTitle: {
    fontFamily: CONSTANT.customFonts.heading1,
    fontSize: CONSTANT.fontSizes.heading1,
    color: CONSTANT.themeColors.font,
  },
  dropdown: {
    height: hp('6%'),
    // width: wp('40%'),
    borderColor: CONSTANT.themeColors.disable,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  photoUploadContainer: {
    borderColor: CONSTANT.themeColors.complementary,
  },
  uploadImageText: {
    fontFamily: CONSTANT.customFonts.body,
    fontSize: CONSTANT.fontSizes.body,
    color: CONSTANT.themeColors.primary,
  },
  maxFileSize: {
    fontFamily: CONSTANT.customFonts.caption,
    fontSize: CONSTANT.fontSizes.caption,
    color: CONSTANT.themeColors.disable,
  },
  footerModal: {
    borderBottomColor: CONSTANT.themeColors.complementary,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  separator: {
    borderRightColor: CONSTANT.themeColors.complementary,
    borderRightWidth: 1,
  },
  footerModalTextStyle: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.primary,
  },
  footerModalCancel: {
    color: CONSTANT.themeColors.warningRed,
  },
  footerModalSubmit: {
    color: CONSTANT.themeColors.success,
  },
  submitButton: {
    fontFamily: CONSTANT.customFonts.heading2,
    fontSize: CONSTANT.fontSizes.heading2,
    color: CONSTANT.themeColors.base,
    backgroundColor: CONSTANT.themeColors.primary,
  },
});

export default AddPoolPage;
