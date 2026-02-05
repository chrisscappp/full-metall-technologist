import { VStack } from '@/UI/Stack'
import { memo, useCallback, useState } from 'react'
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

	const [listBoxValue, setListBoxValue] = useState(defaultMaterial)

	const onChangeListBoxMaterial = useCallback((value: DetailMaterialValue) => {
		onChangeMaterial?.(value === DetailMaterialValue.OTHER ? '' : value)
		setListBoxValue(value)
	}, [onChangeMaterial])

	const onChangeOtherMaterialValue = useCallback((value: string) => {
		onChangeMaterial?.(value)
	}, [onChangeMaterial])

	return (
		<VStack className={className} gap='12' max>
			<ListBox<DetailMaterialValue>
				label="Материал"
				options={materialOptions}	
				value={listBoxValue}
				onChange={onChangeListBoxMaterial}			
			/>
			{listBoxValue === DetailMaterialValue.OTHER && (
				<Input
					placeholder="Введите название материала"
					value={material}
					onChange={onChangeOtherMaterialValue}
				/>
			)}
		</VStack>
	)
})
