import { NativeModules } from 'react-native';

interface FloatingCaptionModuleType {
  checkOverlayPermission(): Promise<boolean>;
  requestOverlayPermission(): void;
  startFloatingService(): Promise<boolean>;
  stopFloatingService(): Promise<boolean>;
  updateCaption(text: string): void;
}

const { FloatingCaptionModule } = NativeModules;

export default FloatingCaptionModule as FloatingCaptionModuleType;
