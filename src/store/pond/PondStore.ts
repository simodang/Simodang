import { BASE_URL } from '@env';
import axios from 'axios';
import { create } from 'zustand';

import useAuthStore from '../auth/AuthStore';
// import { produce } from 'immer';

enum PondStatus {
  bad = 0,
  good = 1,
}

enum isFilled {
  false = 0,
  true = 1,
}

enum NotificationStatus {
  false = 0,
  true = 1,
}

enum isSaved {
  false = 0,
  true = 1,
}

type PondsData = {
  pondId: string;
  pondName: string;
  city: string;
};

type PondDetail = {
  pondId: string;
  pondName: string;
  adress: string;
  city: string;
  seedDate: string;
  imageUrl: string;
  status: PondStatus;
  isFilled: isFilled;
  deviceId: string;
  device: {
    deviceId: string;
    DeviceName: string;
    notificationEnabled: NotificationStatus;
    isSaved: isSaved;
    tempLow: string;
    tempHigh: string;
    phLow: string;
    phHigh: string;
    tdoLow: string;
    tdoHigh: string;
    tdsLow: string;
    tdsHigh: string;
    turbiditiesLow: string;
    turbiditiesHigh: string;
  };
};

type PondStoreState = {
  pondsData: PondsData[];
  totalPonds: number;
  pondDetail: PondDetail;
};

type PondStoreAction = {
  getAllPonds: () => Promise<void>;
  getOnePond: (pondId: string) => Promise<void>;
  updateThresholdData: (
    // pondId: string,
    thresholdData: PondDetail,
  ) => Promise<void>;
};

const usePondStore = create<PondStoreState & PondStoreAction>()((set, get) => ({
  pondsData: [],
  pondDetail: {
    pondId: '',
    pondName: '',
    adress: '',
    city: '',
    seedDate: '',
    imageUrl: '',
    status: PondStatus.bad,
    isFilled: isFilled.true,
    deviceId: '',
    device: {
      deviceId: '',
      DeviceName: '',
      notificationEnabled: NotificationStatus.true,
      isSaved: isSaved.false,
      tempLow: '',
      tempHigh: '',
      phLow: '',
      phHigh: '',
      tdoLow: '',
      tdoHigh: '',
      tdsLow: '',
      tdsHigh: '',
      turbiditiesLow: '',
      turbiditiesHigh: '',
    },
  },
  totalPonds: 0,

  getAllPonds: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ponds`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().userDetail.token}`,
        },
      });

      const pondData = response.data.map(
        (dataItem: {
          id: string;
          name: string;
          address: string;
          city: string;
          status: PondStatus;
        }) => {
          return {
            pondId: dataItem.id,
            pondName: dataItem.name,
            address: dataItem.address,
            city: dataItem.city,
            status: dataItem.status,
          };
        },
      );

      // console.log(response.data);
      set({
        pondsData: pondData,
        totalPonds: response.data.length,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getOnePond: async (pondId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/ponds/${pondId}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().userDetail.token}`,
        },
      });

      set({
        pondDetail: {
          pondId: response.data.id,
          pondName: response.data.name,
          adress: response.data.address,
          city: response.data.city,
          seedDate: response.data.seedDate,
          imageUrl: response.data.imageUrl,
          status: response.data.status,
          isFilled: response.data.isFilled as isFilled,
          deviceId: response.data.deviceId,
          device: {
            deviceId: response.data.device.id,
            DeviceName: response.data.device.name,
            notificationEnabled: response.data.device.notificationEnabled,
            isSaved: response.data.device.isSaved,
            tempLow: response.data.device.tempLow,
            tempHigh: response.data.device.tempHigh,
            phLow: response.data.device.phLow,
            phHigh: response.data.device.phHigh,
            tdoLow: response.data.device.tdoLow,
            tdoHigh: response.data.device.tdoHigh,
            tdsLow: response.data.device.tdsLow,
            tdsHigh: response.data.device.tdsHigh,
            turbiditiesLow: response.data.device.turbiditiesLow,
            turbiditiesHigh: response.data.device.turbiditiesHigh,
          },
        },
      });
      // console.log(usePondStore.getState().pondDetail);
    } catch (error) {
      console.log(error);
    }
  },

  updateThresholdData: async (data: Partial<PondDetail>) => {
    try {
      console.log(data.device);

      const response = await axios.patch(
        `${BASE_URL}/ponds/${get().pondDetail.pondId}/device`,
        // 'https://webhook.site/a333c63c-7560-426b-b89e-87aad7d5734a',
        data.device,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().userDetail.token}`,
          },
          // validateStatus: () => {
          //   return false;
          // },
        },
      );

      set({ pondDetail: response.data });
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  },
}));

export default usePondStore;
