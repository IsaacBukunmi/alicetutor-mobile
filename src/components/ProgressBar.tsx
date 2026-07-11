import { Colors } from '@/constants';
import { View } from 'react-native';

export default function ProgressBar({ progress, bgColor }:{progress: number, bgColor:string}) {

  return (
    <View style={{ height: 4, borderRadius: 999, backgroundColor: Colors.divider }}>
      <View style={{
          width: `${progress}%`,
          height: 4,
          borderRadius: 999,
          backgroundColor: bgColor,
      }} />
    </View>
  );
}
