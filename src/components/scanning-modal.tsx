import { useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { FileSearch, FolderOpen, CheckCircle } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

type ScanStage = 'idle' | 'scanning' | 'fetching' | 'done';

interface ScanningModalProps {
  visible: boolean;
  stage: ScanStage;
  filesFound: number;
  filesImported: number;
  currentPath?: string;
  onCancel?: () => void;
  onComplete?: () => void;
}

const AnimatedFileSearch = Animated.createAnimatedComponent(FileSearch);
const AnimatedContainer = Animated.createAnimatedComponent(View);

export function ScanningModal({
  visible,
  stage,
  filesFound,
  filesImported,
  currentPath,
  onCancel,
  onComplete,
}: ScanningModalProps) {
  const c = useTheme();
  const spin = useSharedValue(0);
  const pulse = useSharedValue(1);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    if (stage === 'scanning' || stage === 'fetching') {
      spin.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
      pulse.value = withRepeat(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      spin.value = withTiming(0, { duration: 0 });
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [stage, spin, pulse]);

  useEffect(() => {
    progressValue.value = filesFound > 0 ? filesImported / filesFound : 0;
  }, [filesFound, filesImported, progressValue]);

  useEffect(() => {
    if (stage === 'done' && onComplete) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={stage === 'done' ? onComplete : onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: c.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
        }}
      >
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={{
            width: '100%',
            maxWidth: 340,
            backgroundColor: c.surface,
            borderRadius: 20,
            paddingHorizontal: 28,
            paddingVertical: 32,
            borderCurve: 'continuous',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            borderWidth: 1,
            borderColor: c.border,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <AnimatedContainer
              style={[
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: stage === 'done' ? c.primaryContainer : c.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                },
                stage === 'done' ? {} : pulseStyle,
              ]}
            >
              {stage === 'done' ? (
                <CheckCircle size={32} color={c.success} />
              ) : (
                <AnimatedFileSearch
                  size={28}
                  color={c.primary}
                  style={spinStyle}
                />
              )}
            </AnimatedContainer>

            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: c.text,
                textAlign: 'center',
                marginBottom: 6,
              }}
            >
              {stage === 'scanning' && 'Scanning for documents'}
              {stage === 'fetching' && 'Importing documents'}
              {stage === 'done' && 'Scan complete'}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: c.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              {stage === 'scanning' && 'Searching your device for supported files...'}
              {stage === 'fetching' && `Processing ${filesFound} found documents...`}
              {stage === 'done' && `Successfully imported ${filesImported} documents`}
            </Text>
          </View>

          {stage !== 'done' && (
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: c.surfaceVariant,
                  overflow: 'hidden',
                  marginBottom: 12,
                }}
              >
                <Animated.View
                  style={[
                    {
                      height: '100%',
                      borderRadius: 3,
                      backgroundColor: c.primary,
                    },
                    progressStyle,
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FolderOpen size={14} color={c.textTertiary} />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: c.textTertiary,
                      maxWidth: 180,
                    }}
                  >
                    {currentPath || 'Searching...'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: c.textSecondary,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {filesImported}/{filesFound}
                </Text>
              </View>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {stage === 'done' ? (
              <Pressable
                onPress={onComplete}
                style={{
                  flex: 1,
                  backgroundColor: c.primary,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>
                  Done
                </Text>
              </Pressable>
            ) : (
              <>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: c.textTertiary,
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {progressValue.value > 0
                      ? `${Math.round(progressValue.value * 100)}%`
                      : 'Working...'}
                  </Text>
                </View>
                {onCancel && (
                  <Pressable
                    onPress={onCancel}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: c.border,
                    }}
                  >
                    <Text
                      style={{
                        color: c.textSecondary,
                        fontWeight: '500',
                        fontSize: 15,
                      }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
