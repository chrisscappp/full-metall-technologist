import { Card } from '@/UI/Card/Card'
import { classNames } from '@/utils/lib/classNames/classNames'
import { memo, useCallback, useState } from 'react'
import cls from './FellingForm.module.scss'
import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { Input } from '@/UI/Input/Input'
import { ListBox } from '@/UI/ListBox/ListBox'
import { Felling } from '../../lib/consts/felling'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FellingCalculateResult, FellingFormParams } from '../../lib/types/felling'
import { basedValidateFormRule } from '@/utils/consts/reactHookForm'
import { Button } from '@/UI/Button/Button'
import { FellingResult } from '../FellingResult/FellingResult'
import { calculateFellingV2 } from '../../lib/helpers/calculateFellingNew'
import { DetailMaterialValue, DetailMaterialValueType, SelectMaterial } from '@/components/SelectMaterial'
import { getCurrentDate } from '@/utils/lib/getCurrentDate/getCurrentDate'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { getCurrentMoscowTime } from '@/utils/lib/getCurrentMoscowTime/getCurrentMoscowTime'
import { GenerateExcelReport } from '@/components/GenerateExcelReport'
import { NumericContent } from '@/UI/NumericContent/NumericContent'

interface FellingFormProps {
	className?: string
}

const initialValues: FellingFormParams = {
	mass: 200,
	diameter: 19.5,
	thin: 3.2,
	strength: 400,
	stripeCount: 4,
	coeffOfStock: 2,
	lengthLoosePart: 2,
	row_number: 0,
	permissibleCompressionStress: 400,
	permissibleBendingStress: 460,
	permissibleGapStress: 400,
	diameterOfCylindricalBelt: 19.48,
	diameterOfCircle: 26,
	insideMatrixDiameter: 53,
	thinOfMatrix: 14,
	material: DetailMaterialValue.STEEL_10,
	operator_name: 'Вася',
	organization_name: '"ЗАО" БЕЩЕКИ',
	detail_name: 'Лабубу'
}

const selectOptions = [
	{ content: 'Однорядный', value: Felling.ONE_LINE },
	{ content: 'Шахматный', value: Felling.CHECKMATE }
]

export const FellingForm = memo(({ className }: FellingFormProps) => {
	
	const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm<FellingFormParams>({
		defaultValues: initialValues
	})
	const [cutting, setCutting] = useState(Felling.ONE_LINE)
	const [isCheckmate, setIsCheckmate] = useState(cutting === Felling.CHECKMATE ? true : false)
	const [result, setResult] = useState<FellingCalculateResult>()
	const [fellingCalculateError, setFellingCalculateError] = useState('')

	const onChangeMaterial = useCallback((value: DetailMaterialValueType) => {
		setValue('material', value)
	}, [setValue])

	const onCalculateFelling: SubmitHandler<FellingFormParams> = useCallback(async (data) => {
		setFellingCalculateError('')
		let key: keyof FellingFormParams
		for (key in data) {
			if (key === 'material' || key === 'organization_name' || key === 'operator_name') continue
			//@ts-ignore
			data[key] = Number(data[key])
		}
		const result = await calculateFellingV2({
			...data,
			felling_type: cutting,
			row_number: data.row_number ?? 0
		})
		if (typeof result !== 'string') {
			setResult(result)
		} else {
			setFellingCalculateError(result)
		}
	}, [cutting])

	const onChangeCutting = useCallback((value: Felling) => {
		setCutting(value)
		setIsCheckmate(value === Felling.CHECKMATE)
	}, [])
	
	return (
		<VStack className={classNames(cls.DeforestationForm, {}, [className])} gap='32' max>
			<VStack className={cls.header} gap="8" max>
				<Text
					title="Вытяжка с утонением стенки"
					size="size_l"
				/>
				<Text
					text="Работа с моделью КОМПАС 3D и расчет параметров"
					theme="secondary"
					size="size_s"
				/>
			</VStack>
			<form className={cls.form} onSubmit={handleSubmit(onCalculateFelling)}>
				<VStack gap="20" max>
					<Card>
						<VStack gap="20" max>
							<NumericContent number="1">
								<Text title="Данные организации" size="size_s"/>
							</NumericContent>
							<Input
								label="Ваше ФИО"
								register={{...register('operator_name', { required: 'Поле является обязательным' })}}
								error={errors.operator_name?.message}
							/>
							<Input
								label="Название организации"
								register={{...register('organization_name', { required: 'Поле является обязательным' })}}
								error={errors.organization_name?.message}
							/>
							<Input
								label="Наименование обрабатываемой детали"
								register={{...register('detail_name', { required: 'Поле является обязательным' })}}
								error={errors.detail_name?.message}
							/>
						</VStack>
					</Card>
					<Card>
						<VStack gap="20" max>
							<NumericContent number="2">
								<Text title="Материал" size="size_s"/>
							</NumericContent>
							<SelectMaterial 
								material={watch('material') as DetailMaterialValueType}
								onChangeMaterial={onChangeMaterial}
							/>
						</VStack>
					</Card>
					<Card>
						<VStack gap="20" max>
							<NumericContent number="3">
								<Text title="Исходные данные" size="size_s" />
							</NumericContent>
							<Input
								label="Масса полуфабриката (г)"
								register={{...register('mass', basedValidateFormRule)}}
								error={errors.mass?.message}
							/>
							<Input
								label="Диаметр кружка (мм)"
								register={{...register('diameter', basedValidateFormRule)}}
								error={errors.diameter?.message}
							/>
							<Input
								label="Толщина кружка (мм)"
								register={{...register('thin', basedValidateFormRule)}}
								error={errors.thin?.message}
							/>
							<Input
								label="Прочность материала (МПа)"
								register={{...register('strength', basedValidateFormRule)}}
								error={errors.strength?.message}
							/>
						</VStack>
					</Card>
					<Card>
						<VStack gap="20" max>
							<NumericContent number="4">
								<Text title="Допускаемое напряжение на инструменте" size="size_s"/>
							</NumericContent>
							<Input
								label="Допускаемое напряжение на сжатие (МПа)"
								register={{...register('permissibleCompressionStress', basedValidateFormRule)}}
								error={errors.permissibleCompressionStress?.message}
							/>
							<Input
								label="Допускаемое напряжение на изгиб (МПа)"
								register={{...register('permissibleBendingStress', basedValidateFormRule)}}
								error={errors.permissibleBendingStress?.message}
							/>
							<Input
								label="Допускаемое напряжение на разрыв (МПа)"
								register={{...register('permissibleGapStress', basedValidateFormRule)}}
								error={errors.permissibleGapStress?.message}
							/>
						</VStack>
					</Card>
					<Card>
						<VStack gap="20" max>
							<NumericContent number="5">
								<Text title="Параметры матрицы" size="size_s"/>
							</NumericContent>
							<Input
								label="Диаметр цилиндрического пояска (мм)"
								register={{...register('diameterOfCylindricalBelt', basedValidateFormRule)}}
								error={errors.diameterOfCylindricalBelt?.message}
							/>
							<Input
								label="Диаметр опорного кольца (мм)"
								register={{...register('diameterOfCircle', basedValidateFormRule)}}
								error={errors.diameterOfCircle?.message}
							/>
							<Input
								label="Наружный диаметр матрицы (мм)"
								register={{...register('insideMatrixDiameter', basedValidateFormRule)}}
								error={errors.insideMatrixDiameter?.message}
							/>
							<Input
								label="Толщина матрицы (мм)"
								register={{...register('insideMatrixDiameter', basedValidateFormRule)}}
								error={errors.insideMatrixDiameter?.message}
							/>
						</VStack>
					</Card>
					<Card>
						<VStack gap="20" max>
							<NumericContent number="6">
								<Text title="Доп. параметры" size="size_s"/>
							</NumericContent>
							<ListBox<Felling>
								label="Раскрой:"
								value={cutting}
								options={selectOptions}
								onChange={onChangeCutting}
							/>
							{isCheckmate && (
								<Input
									label="Число рядов"
									register={{...register('row_number', basedValidateFormRule)}}
									error={errors.row_number?.message}
								/>
							)}
							<Input
								label="Количество полос для раскроя"
								register={{...register('stripeCount', basedValidateFormRule)}}
								error={errors.stripeCount?.message}
							/>
							<Input
								label="Коэф. запаса устойчивости (от 2 до 3)"
								register={{...register('coeffOfStock', basedValidateFormRule)}}
								error={errors.coeffOfStock?.message}
							/>
							<Input
								label="Длина незакреп. части пуансона"
								register={{...register('lengthLoosePart', basedValidateFormRule)}}
								error={errors.lengthLoosePart?.message}
							/>
						</VStack>
					</Card>
					<Button type="submit">
						Произвести расчет
					</Button>
				</VStack>
			</form>
			{fellingCalculateError && <Text text={fellingCalculateError} theme="error"/>}
			{result && (
				<VStack className={cls.resultWrap} max gap="20">
					<FellingResult result={result}/>
					<GenerateExcelReport
						generatedFunctionName={InkoveFunction.FELLING_EXCEL_REPORT}
						reportName={`Отчет о вырубке_${getCurrentDate()}`}
						data={{
							...result,
							operatorName: getValues('operator_name'),
							organizationName: getValues('organization_name'),
							date: `${getCurrentDate()}, ${getCurrentMoscowTime()}`,
							material: getValues('material'),
							detailName: getValues('detail_name'),
							cutting: cutting === Felling.ONE_LINE ? 'однорядный' : 'шахматный',
							mass: Number(getValues('mass')),
							thin: Number(getValues('thin')),
							diameter: Number(getValues('diameter')),
							insideMatrixDiameter: Number(getValues('insideMatrixDiameter'))
						}}
					/>
				</VStack>
			)}
		</VStack>
	)
})
