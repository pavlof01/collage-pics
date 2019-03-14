import { NativeModules } from 'react-native'
import RNFS from 'react-native-fs';

export const { PESDK } = NativeModules;

export const getAssetFileAbsolutePath = async (assetPath) => {
  const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
    .toString(36)
    .substring(7)}.jpg`;
  try {
    const absolutePath = await RNFS.copyAssetsFileIOS(assetPath, dest, 0, 0);
    return absolutePath;
  } catch (err) {
    console.warn(err);
  }
};

export const startEdit = (uri) => {
    PESDK.present(uri)
}
