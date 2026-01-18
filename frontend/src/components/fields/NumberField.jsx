// NumberField.jsx - Numeric input with label

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

export const NumberField = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  className,
  inputClassName,
  ...props
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label className="text-xs text-muted-foreground">{label}</Label>
      )}
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={cn('h-8 text-sm', inputClassName)}
        {...props}
      />
    </div>
  );
};

export default NumberField;



