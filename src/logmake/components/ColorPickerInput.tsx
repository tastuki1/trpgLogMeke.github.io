import formStyles from '@/logmake/styles/forms.module.css'

interface ColorPickerInputProps {
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
}

/**
 * カラーピッカー入力コンポーネント。
 * ブラウザの標準 color input を使用し、スタイルを調整している。
 */
export function ColorPickerInput({
  value,
  onChange,
  ariaLabel,
}: ColorPickerInputProps) {
  return (
    <input
      aria-label={ariaLabel}
      className={formStyles.colorSwatch}
      type="color"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  )
}
