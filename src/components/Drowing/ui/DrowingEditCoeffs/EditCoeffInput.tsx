import { Input } from '@/UI/Input/Input'
import { useDebounce } from '@/utils/hooks/useDebounce'
import { memo, useCallback, useState } from 'react'

interface EditDrowingInputProps {
	className?: string,
	initialValue?: number,
	inputIndex?: number,
	onChange: (value: number, index: number) => void
}

export const EditCoeffInput = memo(({ className, initialValue, inputIndex, onChange }: EditDrowingInputProps) => {
	
	const [coeff, setCoeff] = useState<string>(String(initialValue))

	const debouncedOnChange = useDebounce(onChange, 2000)

	const onChangeCoeff = useCallback((value: string) => {
		if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
			setCoeff(value)
			debouncedOnChange(Number(value), inputIndex ?? 0)
		}
	}, [debouncedOnChange, inputIndex])
	
	return (
		<Input
			className={className}
			onChange={onChangeCoeff}
			value={String(coeff)}
		/>
	)
})
