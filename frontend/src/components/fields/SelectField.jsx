// SelectField.jsx - Dropdown select with label

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '../../lib/utils';

export const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange} {...props}>
        <SelectTrigger className="h-8 text-sm bg-slate-50 border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
