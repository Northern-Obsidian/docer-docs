import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { View } from 'react-native';

type PdfProps = Record<string, unknown>;

const Pdf: ForwardRefExoticComponent<PdfProps & RefAttributes<unknown>> = forwardRef(function Pdf(_props, ref) {
  return <View ref={ref as never} />;
});

export type PdfRef = unknown;

export default Pdf;
