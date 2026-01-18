// ToggleField.jsx - Boolean toggle switch with label

import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

export const ToggleField = ({
  label,
  checked,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-between py-1', className)}>
      {label && (
        <Label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </Label>
      )}
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary"
        {...props}
      />
    </div>
  );
};

export default ToggleField;
