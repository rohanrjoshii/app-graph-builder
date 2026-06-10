import * as SliderPrimitive from '@radix-ui/react-slider';

type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className="slider-root"
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([nextValue]) => onValueChange(nextValue ?? value)}
    >
      <SliderPrimitive.Track className="slider-track">
        <SliderPrimitive.Range className="slider-range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="slider-thumb" aria-label="Capacity" />
    </SliderPrimitive.Root>
  );
}
