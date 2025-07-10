import { Card } from '@/UI/Card/Card'
import { classNames } from '@/utils/functions/classNames'
import { memo, useCallback, useState } from 'react'
import cls from './DrowingForm.module.scss'
import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { Input } from '@/UI/Input/Input'
import { Button } from '@/UI/Button/Button'
import { CalculateOperationsCountResult, DrowingOperationDataV2, DrowingFormParams } from '../../lib/types/drowing'
import { SubmitHandler, useForm } from 'react-hook-form'
import { drowingTabsConfig } from '../../lib/consts/drowing'
import { DrowingResult } from '../DrowingResult/DrowingResult'
import { basedValidateFormRule } from '@/utils/consts/reactHookForm'
import { calculateDrawingOperationsCountV2, calculateDrawingOperationsDataV2 } from '../../lib/helpers/calculateNewDrowing'
import { DrowingCountOperations } from '../DrowingCountOperations/DrowingCountOperations'
import { DetailMaterialValue, DetailMaterialValueType, SelectMaterial } from '@/components/SelectMaterial'
import { getCurrentDate } from '@/utils/functions/getCurrentDate'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { GenerateExcelReport } from '@/components/GenerateExcelReport'
import { getCurrentMoscowTime } from '@/utils/functions/getCurrentMoscowTime'
import { ParseDrowingModelResult, ParseModelVariablesGuide } from '@/components/ParseModelVariables'
import { useCopyText } from '@/utils/hooks/useCopyText'
import DrowingSketch from '@/assets/image/drowing.jpg'

interface DrowingFormProps {
	className?: string
}

// const initialParams: TechnologistDrowingForm = {
// 	init_diameter: 160,            // Начальный диаметр
// 	init_thickness: 15,      	   // Начальная толщина
// 	fin_diameter: 91.8,            // Конечный диаметр
// 	fin_thickness: 1.78,       	   // Конечная толщина
// 	coefficient_of_stock: 1.2,     // Коэффициент запаса
// 	fin_volume: 21000,             // Конечный объём
// 	max_pull_first_op: 0.48,   	   // Предельный коэффициент вытяжки (ПКВ)
// 	max_pull_subsequent_op: 0.79,  // ПКВ для последующих операций (если больше 1 вытяжки)
// 	max_thin_first_op: 0.7,   	   // Предельный коэффициент утонения (ПКУ)
// 	max_thin_subsequent_op: 0.5,   // ПКУ для последующих операций (если больше 1 вытяжки)
// 	wall_thickness_ls: 1,   	   // Толщина стенки в нижнем сечении
// 	wall_thickness_us: 0.5,   	   // Толщина стенки в верхнем сечении
// 	rounding_radius: 2,            // Радиус закругления
// 	fin_height: 100,               // Высота на последней операции 
// 	coefficient_of_friction: 1,     // Коэф. трения
// 	material: DrowingMaterialValue.STEEL_10
// }

export const DrowingForm = memo(({ className }: DrowingFormProps) => {
	
	const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm<DrowingFormParams>({ 
		defaultValues: { material: DetailMaterialValue.STEEL_10 }
	})
	const { onCopyText } = useCopyText()
	const [drowingOperationsResult, setDrowingOperationsResult] = useState<DrowingOperationDataV2[]>()
	const [drowingOperationsCount, setDrowingOperationsCount] = useState<CalculateOperationsCountResult>()

	const onCalculateDrowingOperationsCount: SubmitHandler<DrowingFormParams> = useCallback(async (data) => {
		let key: keyof DrowingFormParams
		for (key in data) {
			if (key === 'material' || key === 'organization_name' || key === 'operator_name') continue
			//@ts-ignore
			data[key] = Number(data[key])
		}
		const res = await calculateDrawingOperationsCountV2(data)
		setDrowingOperationsCount(res)
	}, [])

	const onCalculateDrowingOperationsData = useCallback(async () => {
		const data = getValues()
		if (data && drowingOperationsCount) {
			const res = await calculateDrawingOperationsDataV2(data as DrowingFormParams, drowingOperationsCount)
			setDrowingOperationsResult(res)
		}
	}, [drowingOperationsCount, getValues])

	const onChangeMaterial = useCallback((value: DetailMaterialValueType) => {
		setValue('material', value)
	}, [setValue])

	const onChangeDrowingOperationsCount = useCallback((value: CalculateOperationsCountResult) => {
		setDrowingOperationsCount(value)
		setDrowingOperationsResult(undefined)
	}, [])

	const onSetParsedValues = useCallback((data: ParseDrowingModelResult<Partial<DrowingFormParams>>) => {
		setValue('material', data.data.modelParams.material)
		setValue('fin_volume', data.data.modelParams.volume)
		setValue('init_diameter', Number((Math.sqrt((4 * data.data.modelParams.volume * 1.15) / (3.14 * data.data.modelParams.variables.wall_thickness_down))).toFixed(0)))
		Object.entries(data.data.modelParams.variables).filter(([, value]) => Boolean(value)).map(([key, value]) => {
			setValue(key as keyof DrowingFormParams, value)
		})
	}, [setValue])

	return (
		<VStack className={classNames(cls.TechnologistDetailDrowing, {}, [className])} gap='20' max>
			<ParseModelVariablesGuide<Partial<DrowingFormParams>>
				className={cls.parser}
				onSetParsedValues={onSetParsedValues}
				tabId={drowingTabsConfig.model.id}
				title={drowingTabsConfig.model.title}
				sketchImg={DrowingSketch}
				variablesToParse={[
					['Конечный диаметр (фDн)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'fin_diameter'} onClick={() => onCopyText('fin_diameter')}><Text text={'fin_diameter'} size="size_s" align="center"/></Button>],
					['Толщина дна заготовки (Sдна)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'wall_thickness_down'} onClick={() => onCopyText('wall_thickness_down')}><Text text={'wall_thickness_down'} size="size_s" align="center"/></Button>], 
					['Толщина стенки в нижнем сечении (Sн)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'wall_thickness_ls'} onClick={() => onCopyText('wall_thickness_ls')}><Text text={'wall_thickness_ls'} size="size_s" align="center"/></Button>],
					['Толщина стенки в верхнем сечении (Sв)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'wall_thickness_us'} onClick={() => onCopyText('wall_thickness_us')}><Text text={'wall_thickness_us'} size="size_s" align="center"/></Button>],
					['Высота на последней операции (H)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'fin_height'} onClick={() => onCopyText('fin_height')}><Text text={'fin_height'} size="size_s" align="center"/></Button>],
					['Радиус закругления (Rв)', <Button className={cls.btn} title="Скопировать" theme="clear" size="size_s" key={'rounding_radius'} onClick={() => onCopyText('rounding_radius')}><Text text={'rounding_radius'} size="size_s" align="center"/></Button>]
				]}
			/>
			<Card>
				<form onSubmit={handleSubmit(onCalculateDrowingOperationsCount)}>
				<VStack gap="32" max>
					<VStack gap="12" max>
						<Text id={drowingTabsConfig.organizationData.id} title={drowingTabsConfig.organizationData.title} size="size_s" weight="weight_bold"/>
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
						<Text id={drowingTabsConfig.material.id} title={drowingTabsConfig.material.title} size="size_s" weight="weight_bold"/>
						<SelectMaterial 
							material={watch('material') as DetailMaterialValueType}
							onChangeMaterial={onChangeMaterial}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={drowingTabsConfig.geometryParams.id} title={drowingTabsConfig.geometryParams.title} size="size_s" weight="weight_bold"/>
						<Input
      						label="Диаметр заготовки D0 (мм)"
      						register={{...register('init_diameter', basedValidateFormRule)}}
							error={errors.init_diameter?.message}
    					/>
						<Input
							label="Диаметр полуфабриката фDн (мм)"
							register={{...register('fin_diameter', basedValidateFormRule)}}
							error={errors.fin_diameter?.message}
						/>
						<Input
							label="Толщина дна заготовки Sдна (мм)"
							register={{...register('wall_thickness_down', basedValidateFormRule)}}
							error={errors.wall_thickness_down?.message}
						/>
						<Input
							label="Толщина стенки в верхнем сечении Sв (мм)"
							register={{...register('wall_thickness_us', basedValidateFormRule)}}
							error={errors.wall_thickness_us?.message}
						/>
						<Input
							label="Толщина стенки в нижнем сечении Sн (мм)"
							register={{...register('wall_thickness_ls', basedValidateFormRule)}}
							error={errors.wall_thickness_ls?.message}
						/>
						<Input
							label="Высота изделия на последней операции Н (мм)"
							register={{...register('fin_height', basedValidateFormRule)}}
							error={errors.fin_height?.message}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={drowingTabsConfig.additionalParams.id} title={drowingTabsConfig.additionalParams.title} size="size_s" weight="weight_bold"/>
						<Input
							label="Коэффициент запаса"
							register={{...register('coefficient_of_stock', basedValidateFormRule)}}
							error={errors.coefficient_of_stock?.message}
						/>
						<Input
							label="Коэффициент трения"
							register={{...register('coefficient_of_friction', basedValidateFormRule)}}
							error={errors.coefficient_of_friction?.message}
						/>
						<Input
							label="Объем готового изделия (мм3)"
							register={{...register('fin_volume', basedValidateFormRule)}}
							error={errors.fin_volume?.message}
						/>
						<Input
							label="Радиус закругления Rв (мм)"
							register={{...register('rounding_radius', basedValidateFormRule)}}
							error={errors.rounding_radius?.message}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={drowingTabsConfig.maxPull.id} title={drowingTabsConfig.maxPull.title} size="size_s" weight="weight_bold"/>
						<Input
							label="На первой операции"
							register={{...register('max_pull_first_op', basedValidateFormRule)}}
							error={errors.max_pull_first_op?.message}
						/>
						<Input
							label="На последующих операциях"
							register={{...register('max_pull_subsequent_op', basedValidateFormRule)}}
							error={errors.max_pull_subsequent_op?.message}
						/>
					</VStack>
					<VStack gap="12" max>
						<Text id={drowingTabsConfig.maxThin.id} title={drowingTabsConfig.maxThin.title} size="size_s" weight="weight_bold"/>
						<Input
							label="На первой операции"
							register={{...register('max_thin_first_op', basedValidateFormRule)}}
							error={errors.max_thin_first_op?.message}
						/>
						<Input
							label="На последующих операциях"
							register={{...register('max_thin_subsequent_op', basedValidateFormRule)}}
							error={errors.max_thin_subsequent_op?.message}
						/>
					</VStack>
					<Button type="submit">
						Начать расчет
					</Button>
				</VStack>
			</form>
			{drowingOperationsCount && (
				<DrowingCountOperations 
					className={cls.result} 
					operationsResult={drowingOperationsCount}
					onChangeOperations={onChangeDrowingOperationsCount}
					onCalculateDrowingOperationsData={onCalculateDrowingOperationsData}
				/>
			)}
			{drowingOperationsResult && (
				<>
					<DrowingResult className={cls.result} result={drowingOperationsResult}/>
					<GenerateExcelReport
						generatedFunctionName={InkoveFunction.DROWING_EXCEL_REPORT}
						reportName={`Отчет о вытяжке_${getCurrentDate()}`}
						data={{
							...drowingOperationsCount,
							drowingOperations: drowingOperationsResult.map(item => {
								return {
									...item,
									height: Number(item.height)
								}
							}),
							operatorName: getValues('operator_name'),
							organizationName: getValues('organization_name'),
							date: `${getCurrentDate()}, ${getCurrentMoscowTime()}`,
							detailName: getValues('detail_name'),
							coefficientOfFriction: Number(getValues('coefficient_of_friction')),
							coefficientOfStock: Number(getValues('coefficient_of_stock')),
							finVolume: Number(getValues('fin_volume')),
							initThin: Number(getValues('wall_thickness_down')),
							initDiameter: Number(getValues('init_diameter')),
							material: getValues('material'),
							max_pull_first_op: Number(getValues('max_pull_first_op')),           
							max_pull_subsequent_op: Number(getValues('max_pull_subsequent_op')),  
							max_thin_first_op: Number(getValues('max_thin_first_op')),
							max_thin_subsequent_op: Number(getValues('max_thin_subsequent_op')),
						}}
					/>
				</>
			)}
			</Card>
		</VStack>
	)
})
