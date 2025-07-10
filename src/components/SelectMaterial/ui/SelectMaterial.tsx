import { VStack } from '@/UI/Stack'
import { memo, useCallback, useEffect, useState } from 'react'
import { ListBox, ListBoxOption } from '@/UI/ListBox/ListBox'
import { Input } from '@/UI/Input/Input'
import { DetailMaterialValue } from '../lib/consts/material'
import { DetailMaterialValueType } from '../lib/types/material'

const materialOptions: ListBoxOption<DetailMaterialValue>[] = [
	{ content: DetailMaterialValue.STEEL_10, value: DetailMaterialValue.STEEL_10 },
	{ content: DetailMaterialValue.STEEL_20, value: DetailMaterialValue.STEEL_20 },
	{ content: DetailMaterialValue.STEEL_30, value: DetailMaterialValue.STEEL_30 },
	{ content: DetailMaterialValue.STAINLESS_STEEL_08, value: DetailMaterialValue.STAINLESS_STEEL_08 },
	{ content: DetailMaterialValue.BRASS_L_63, value: DetailMaterialValue.BRASS_L_63 },
	{ content: DetailMaterialValue.BRASS_L_68, value: DetailMaterialValue.BRASS_L_68 },
	{ content: DetailMaterialValue.ALUMINIUM_AMG_5, value: DetailMaterialValue.ALUMINIUM_AMG_5 },
	{ content: DetailMaterialValue.ALUMINIUM_AMG_6, value: DetailMaterialValue.ALUMINIUM_AMG_6 },
	{ content: DetailMaterialValue.COPPER_M_1, value: DetailMaterialValue.COPPER_M_1 },
	{ content: DetailMaterialValue.OTHER, value: DetailMaterialValue.OTHER }
]

interface SelectMaterialProps {
	className?: string,
	defaultMaterial?: DetailMaterialValue,
	material?: DetailMaterialValueType,
	onChangeMaterial?: (value: DetailMaterialValueType) => void
}

export const SelectMaterial = memo((props: SelectMaterialProps) => {

	const { className, defaultMaterial, onChangeMaterial, material } = props

	const [isOtherMaterial, setIsOtherMaterial] = useState(false)
	const [materialValue, setMaterialValue] = useState('')
	const [listBoxValue, setListBoxValue] = useState(defaultMaterial)

	useEffect(() => {
		const finded = materialOptions.find(item => item.value === material)
		if (!finded) {
			setIsOtherMaterial(true)
			setListBoxValue(DetailMaterialValue.OTHER)
			setMaterialValue(material ?? '')
		} else {
			setIsOtherMaterial(false)
			setListBoxValue(finded.value)
		}
	}, [material])

	const onChangeListBoxMaterial = useCallback((value: DetailMaterialValue) => {
		if (value !== DetailMaterialValue.OTHER) {
			setIsOtherMaterial(false)
			onChangeMaterial?.(value)
			setMaterialValue('')
		} else {
			setIsOtherMaterial(true)
			onChangeMaterial?.('')
		}
		setListBoxValue(value)
	}, [onChangeMaterial])

	const onChangeOtherMaterialValue = useCallback((value: string) => {
		onChangeMaterial?.(value)
	}, [onChangeMaterial])

	return (
		<VStack className={className} gap='12' max>
			<ListBox<DetailMaterialValue>
				label="Материал:"
				options={materialOptions}	
				value={listBoxValue}
				onChange={onChangeListBoxMaterial}			
			/>
			{isOtherMaterial && (
				<Input
					placeholder="Введите название материала"
					value={materialValue}
					onChange={onChangeOtherMaterialValue}
				/>
			)}
		</VStack>
	)
})
