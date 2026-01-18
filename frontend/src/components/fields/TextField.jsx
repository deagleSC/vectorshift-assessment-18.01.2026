// TextField.jsx - Text input field with label

import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

export const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  ...props
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-8 text-sm bg-slate-50 border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors',
          inputClassName
        )}
        {...props}
      />
    </div>
  );
};

export default TextField;
