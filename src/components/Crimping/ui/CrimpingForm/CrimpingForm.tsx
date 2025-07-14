import { Card } from '@/UI/Card/Card'
import { classNames } from '@/utils/functions/classNames'
import { memo, useCallback, useState } from 'react'
import { CrimpingCalculateResult, CrimpingFormParams } from '../../lib/types/crimping'
import { SubmitHandler, useForm } from 'react-hook-form'
import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { Input } from '@/UI/Input/Input'
import { basedValidateFormRule } from '@/utils/consts/reactHookForm'
import { crimpingTabsConfig } from '../../lib/consts/crimpingTabs'
import { Button } from '@/UI/Button/Button'
import { CrimpingResult } from '../CrimpingResult/CrimpingResult'
import cls from './CrimpingForm.module.scss'
import { getCurrentDate } from '@/utils/functions/getCurrentDate'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { getCurrentMoscowTime } from '@/utils/functions/getCurrentMoscowTime'
import { GenerateExcelReport } from '@/components/GenerateExcelReport'
import { DetailMaterialValue, DetailMaterialValueType, SelectMaterial } from '@/components/SelectMaterial'
import { ParseDrowingModelResult, ParseModelVariablesGuide } from '@/components/ParseModelVariables'
import CrimpingSketch from '@/assets/image/crimping.jpg'
import { useCopyText } from '@/utils/hooks/useCopyText'
import { newCalculateCrimping } from '../../lib/helpers/calculateCrimping'

interface CrimpingFormProps {
	className?: string
}

// const initialParams: CrimpingFormParams = {
//     up_init_diameter: 75,                        // Диаметр в.р.с
//     mid_init_diameter: 130,                      // Диаметр с.р.с
// 	down_init_diameter: 145,                     // Диаметр н.р.с
// 	up_init_thin: 2,                             // Толщина в.р.с
//     mid_init_thin: 3,                            // Толщина с.р.с
// 	down_init_thin: 4,                           // Толщина н.р.с
// 	allow_thin: 0.25,                            // Допуск на толщину
//     strength_limit: 300,                         // Предел прочности
//     yield_strength: 200,                         // Предел текучести
//     relative_uniform_contraction: 0.2,           // Относительное равномерное сужение
//     ramp_height: 25,                             // Высота ската
//     angle_a: 47,                                 // Угол альфа
//     angle_b: 1,                                  // Угол бэта
// 	coeff_of_stock: 2,                           // Коэф. запаса устойчивости
// 	material: DetailMaterialValue.STEEL_10,      // Материал 
// 	operator_name: 'Вася',                       // Имя оператора
// 	organization_name: '"ЗАО" БЕЩЕКИ',           // Организация
// 	detail_name: 'Гильза мощная'                 // Наименование детали
// }

export const CrimpingForm = memo(({ className }: CrimpingFormProps) => {
	
	const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm<CrimpingFormParams>({
		defaultValues: { material: DetailMaterialValue.STEEL_10 }
	})
	const [crimpingResult, setCrimpingResult] = useState<CrimpingCalculateResult>()
	const { onCopyText } = useCopyText()

	const onCalculateCrimpingOperationsCount: SubmitHandler<CrimpingFormParams> = useCallback(async (data) => {
		let key: keyof CrimpingFormParams
		for (key in data) {
			if (key === 'material' || key === 'organization_name' || key === 'operator_name') continue
			//@ts-ignore
			data[key] = Number(data[key])
		}
		const result = newCalculateCrimping(data)
		setCrimpingResult(result)
	}, [])

	const onChangeMaterial = useCallback((value: DetailMaterialValueType) => {
		setValue('material', value)
	}, [setValue])

	const onSetParsedValues = useCallback((data: ParseDrowingModelResult<Partial<CrimpingFormParams>>) => {
		setValue('material', data.data.modelParams.material)
		Object.entries(data.data.modelParams.variables).filter(([, value]) => Boolean(value)).map(([key, value]) => {
			setValue(key as keyof CrimpingFormParams, value)
		})
	}, [setValue])
	
	return (
		<VStack className={classNames('', {}, [className])} gap='20' max>
			<ParseModelVariablesGuide<Partial<CrimpingFormParams>>
				className={cls.parser}
				onSetParsedValues={onSetParsedValues}
				tabId={crimpingTabsConfig.model.id}
				title={crimpingTabsConfig.model.title}
				sketchImg={CrimpingSketch}
				variablesToParse={[
					['Диаметр изделия в.р.с (фd1)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'up_init_diameter'} onClick={() => onCopyText('up_init_diameter')}><Text text={'up_init_diameter'} size="size_s" align="center"/></Button>],
					['Диаметр изделия с.р.с (фd2)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'mid_init_diameter'} onClick={() => onCopyText('mid_init_diameter')}><Text text={'mid_init_diameter'} size="size_s" align="center"/></Button>],
					['Диаметр изделия н.р.с (фd3)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'down_init_diameter'} onClick={() => onCopyText('down_init_diameter')}><Text text={'down_init_diameter'} size="size_s" align="center"/></Button>],
					['Толщина стенки в.р.с. (S1)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'up_init_thin'} onClick={() => onCopyText('up_init_thin')}><Text text={'up_init_thin'} size="size_s" align="center"/></Button>], 
					['Толщина стенки с.р.с. (S2)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'mid_init_thin'} onClick={() => onCopyText('mid_init_thin')}><Text text={'mid_init_thin'} size="size_s" align="center"/></Button>], 
					['Толщина стенки н.р.с. (S3)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'down_init_thin'} onClick={() => onCopyText('down_init_thin')}><Text text={'down_init_thin'} size="size_s" align="center"/></Button>], 
					['Высота ската (h2)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'ramp_height'} onClick={() => onCopyText('ramp_height')}><Text text={'ramp_height'} size="size_s" align="center"/></Button>],
					['Угол a (a)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'angle_a'} onClick={() => onCopyText('angle_a')}><Text text={'angle_a'} size="size_s" align="center"/></Button>],
					['Угол b (b)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'angle_b'} onClick={() => onCopyText('angle_b')}><Text text={'angle_b'} size="size_s" align="center"/></Button>]
				]}
			/>
			<Card>
			<form onSubmit={handleSubmit(onCalculateCrimpingOperationsCount)}>
				<VStack gap="32" max>
					<VStack gap="12" max>
						<Text id={crimpingTabsConfig.organizationData.id} title={crimpingTabsConfig.organizationData.title} size="size_s" weight="weight_bold"/>
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
					<VStack gap="12" max>
						<Text id={crimpingTabsConfig.material.id} title={crimpingTabsConfig.material.title} size="size_s" weight="weight_bold"/>
						<SelectMaterial 
							material={watch('material') as DetailMaterialValueType}
							onChangeMaterial={onChangeMaterial}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={crimpingTabsConfig.diameter.id} title={crimpingTabsConfig.diameter.title} size="size_s" weight="weight_bold"/>
						<Input
							label="Диаметр в в.р.с (мм)"
							register={{...register('up_init_diameter', basedValidateFormRule)}}
							error={errors.up_init_diameter?.message}
						/>
						<Input
							label="Диаметр в с.р.с (мм)"
							register={{...register('mid_init_diameter', basedValidateFormRule)}}
							error={errors.mid_init_diameter?.message}
						/>
						<Input
							label="Диаметр в н.р.с (мм)"
							register={{...register('down_init_diameter', basedValidateFormRule)}}
							error={errors.down_init_diameter?.message}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={crimpingTabsConfig.thickness.id} title={crimpingTabsConfig.thickness.title} size="size_s" weight="weight_bold"/>
						<Input
							label="Толщина стенки в.р.с. (мм)"
							register={{...register('up_init_thin', basedValidateFormRule)}}
							error={errors.up_init_thin?.message}
						/>
						<Input
							label="Толщина стенки с.р.с. (мм)"
							register={{...register('mid_init_thin', basedValidateFormRule)}}
							error={errors.mid_init_thin?.message}
						/>
						<Input
							label="Толщина стенки н.р.с. (мм)"
							register={{...register('down_init_thin', basedValidateFormRule)}}
							error={errors.down_init_thin?.message}
						/>
						<Input
							label="Допуск на толщину (мм)"
							register={{...register('allow_thin', basedValidateFormRule)}}
							error={errors.allow_thin?.message}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={crimpingTabsConfig.strength.id} title={crimpingTabsConfig.strength.title} size="size_s" weight="weight_bold"/>
						<Input
							label="Предел прочности (МПа)"
							register={{...register('strength_limit', basedValidateFormRule)}}
							error={errors.strength_limit?.message}
						/>
						<Input
							label="Предел текучести (МПа)"
							register={{...register('yield_strength', basedValidateFormRule)}}
							error={errors.yield_strength?.message}
						/>
						<Input
							label="Отн. равномерн. сужение"
							register={{...register('relative_uniform_contraction', basedValidateFormRule)}}
							error={errors.relative_uniform_contraction?.message}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={crimpingTabsConfig.additionalParams.id} title={crimpingTabsConfig.additionalParams.title} size="size_s" weight="weight_bold"/>
						<Input
							label="Высота ската (мм)"
							register={{...register('ramp_height', basedValidateFormRule)}}
							error={errors.ramp_height?.message}
						/>
						<Input
							label="Коэф. запаса устойчивости"
							register={{...register('coeff_of_stock', basedValidateFormRule)}}
							error={errors.coeff_of_stock?.message}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={crimpingTabsConfig.angle.id} title={crimpingTabsConfig.angle.title} size="size_s" weight="weight_bold"/>
						<Input
							label="Угол A (градусы)"
							register={{...register('angle_a', basedValidateFormRule)}}
							error={errors.angle_a?.message}
						/>
						<Input
							label="Угол B (градусы)"
							register={{...register('angle_b', basedValidateFormRule)}}
							error={errors.angle_b?.message}
						/>
					</VStack>
					<Button type="submit">
						Произвести расчет
					</Button>
				</VStack>
			</form>
			{crimpingResult && (
				<>
					<CrimpingResult className={cls.result} crimpingData={crimpingResult}/>
					<GenerateExcelReport
						generatedFunctionName={InkoveFunction.CRIMPING_EXCEL_REPORT}
						reportName={`Отчет об обжиме_${getCurrentDate()}`}
						data={{
							...crimpingResult,
							operatorName: getValues('operator_name'),
							organizationName: getValues('organization_name'),
							date: `${getCurrentDate()}, ${getCurrentMoscowTime()}`,
							material: getValues('material'),
							detailName: getValues('detail_name'),
							init_diameter: Number(getValues('down_init_diameter')),
							fin_diameter: Number(getValues('up_init_diameter')),
							init_thin: Number(getValues('up_init_thin'))
						}}
					/>
				</>
			)}
		</Card>
		</VStack>
	)
})
