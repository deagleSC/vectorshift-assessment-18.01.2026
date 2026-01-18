// TextAreaField.jsx - Multi-line text input with label

import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  textareaClassName,
  rows = 3,
  ...props
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'text-sm resize-none min-h-[60px] bg-slate-50 border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors',
          textareaClassName
        )}
        {...props}
      />
    </div>
  );
};

export default TextAreaField;
