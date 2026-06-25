import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

export default function CashStack({ percentRemaining, isAnimating }) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flyX = useRef(new Animated.Value(0)).current;
  const flyY = useRef(new Animated.Value(0)).current;
  const flyOpacity = useRef(new Animated.Value(0)).current;
  const flyRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      flyOpacity.setValue(1);
      flyX.setValue(0);
      flyY.setValue(0);
      flyRotate.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]),
        Animated.timing(flyX, { toValue: 80, duration: 900, useNativeDriver: true }),
        Animated.timing(flyY, { toValue: -60, duration: 900, useNativeDriver: true }),
        Animated.timing(flyRotate, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(flyOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [isAnimating]);

  const stackScale = Math.max(0.55, percentRemaining / 100);
  const flyRotateInterp = flyRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '25deg'],
  });

  return (
    <View style={styles.container}>
      {/* Big stack shadow */}
      <View style={[styles.bigShadow, { width: 180 * stackScale }]} />

      {/* MAIN STACK */}
      <Animated.View
        style={[
          styles.mainStackWrapper,
          {
            transform: [
              { translateX: shakeAnim },
              { scaleX: stackScale },
              { scaleY: stackScale },
            ],
          },
        ]}
      >
        <View style={styles.mainBill}>
          <View style={styles.mainBand} />
          <View style={styles.mainDollarCircle}>
            <Text style={styles.mainDollarSign}>$</Text>
          </View>
        </View>
      </Animated.View>

      {/* SMALL STACKS */}
      <View style={styles.smallStacksRow}>
        <View style={[styles.smallStack, styles.s1]}>
          <View style={styles.smallBand} />
        </View>

        <View style={[styles.smallStack, styles.s2]}>
          <View style={styles.smallBand} />
        </View>

        <View style={[styles.smallStack, styles.s3]}>
          <View style={styles.smallBand} />
        </View>

        <View style={[styles.smallStack, styles.s4]}>
          <View style={styles.smallBand} />
        </View>
      </View>

      {/* FLYING BILL */}
      {isAnimating && (
        <Animated.View
          style={[
            styles.flyingBill,
            {
              transform: [
                { translateX: flyX },
                { translateY: flyY },
                { rotate: flyRotateInterp },
              ],
              opacity: flyOpacity,
            },
          ]}
        >
          <View style={styles.flyingBillBand} />
        </Animated.View>
      )}

      {/* SPARKLES */}
      {percentRemaining > 50 && !isAnimating && (
        <>
          <Text style={[styles.sparkle, { top: 20, left: '20%' }]}>✦</Text>
          <Text style={[styles.sparkle, { top: 10, right: '22%', fontSize: 14 }]}>✦</Text>
        </>
      )}

      {/* PERCENT PILL */}
      <View style={styles.percentPill}>
        <Text style={styles.percentText}>
          {parseFloat(percentRemaining).toFixed(2)}% of budget remaining
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  /* BIG STACK SHADOW */
  bigShadow: {
    position: 'absolute',
    bottom: 110,
    height: 26,
    backgroundColor: '#d4edff',
    borderRadius: 60,
    opacity: 0.55,
  },

  /* MAIN STACK */
  mainStackWrapper: {
    position: 'absolute',
    bottom: 120,
    width: 160,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainBill: {
    width: 150,
    height: 95,
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  mainBand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 48,
    backgroundColor: '#F9A825',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#C68400',
  },

  mainDollarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EEE',
    zIndex: 2,
  },

  mainDollarSign: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2E7D32',
  },

  /* SMALL STACKS ROW */
  smallStacksRow: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 22,
  },

  /* SHARED SMALL STACK STYLE */
  smallStack: {
    width: 48,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2E7D32',

    /* Perspective tilt like the photo */
    transform: [
      { perspective: 600 },
      { rotateX: '14deg' },
    ],

    /* Soft shadow like the table */
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },

    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  /* INDIVIDUAL STACK HEIGHTS + COLORS */
  s1: { height: 32, backgroundColor: '#C8E6C9' },
  s2: { height: 42, backgroundColor: '#A5D6A7' },
  s3: { height: 52, backgroundColor: '#81C784' },
  s4: { height: 62, backgroundColor: '#66BB6A' },

  /* SMALL STACK BAND */
  smallBand: {
    position: 'absolute',
    height: 10,
    width: '100%',
    backgroundColor: '#F9A825',
    opacity: 0.9,
    top: '45%',
  },

  /* FLYING BILL */
  flyingBill: {
    position: 'absolute',
    bottom: 150,
    left: '25%',
    width: 80,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  flyingBillBand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: '#F9A825',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#C68400',
  },

  sparkle: {
    position: 'absolute',
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
  },

  percentPill: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },

  percentText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
});
