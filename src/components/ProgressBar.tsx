import { Colors } from '@/constants';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function ProgressBar({ progress }:{progress: number}) {
  // Ensure progress stays safely between 0 and 1
  const validatedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = validatedProgress * 100;

  return (
    <View>
      {/* Outer Track */}
      <View style={styles.track}>
        {/* Inner Fill */}
        <View style={[styles.fill, { width: percentage }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    track: {
        height: 7,
        width: '100%',
        backgroundColor: Colors.bgBoard,
        borderRadius: 6,
        overflow: 'hidden', // Ensures the inner fill respects track corners
    },
    fill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 6,
    },
});
