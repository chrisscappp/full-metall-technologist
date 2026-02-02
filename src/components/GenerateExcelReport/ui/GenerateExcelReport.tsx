import { Button } from '@/UI/Button/Button'
import { Loader } from '@/UI/Loader/Loader'
import { HStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { classNames } from '@/utils/lib/classNames/classNames'
import { DesktopComponent } from '@/utils/lib/components/DesktopComponent'
import { invoke } from '@tauri-apps/api/core'
import { save } from '@tauri-apps/plugin-dialog'
import { memo, useCallback, useEffect, useState } from 'react'

interface GenerateExcelReportProps<T> {
	className?: string,
	generatedFunctionName?: InkoveFunction,
	data?: T,
	reportName?: string
}

const GenerateExcelReportContent = <T extends object>(props: GenerateExcelReportProps<T>) => {
	
	const { className, data, generatedFunctionName, reportName = 'Отчет' } = props

	const [isLoading, setIsLoading] = useState(false)
	const [success, setSuccess] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		if (success) {
			setTimeout(() => {
				setSuccess('')
			}, 3000)
		}
	}, [success])

	const onSaveToExcel = useCallback(async () => {
		try {
			setSuccess('')
			setError('')
			const path = await save({
				filters: [{ name: 'Excel filters', extensions: ['xls', 'xlsx'] }],
				defaultPath: reportName
			})
			setIsLoading(true)
			
			if (!path || !generatedFunctionName || !data) return

			await invoke(generatedFunctionName, { 
				outputPath: path,
				data
			})
			setSuccess('Отчет успешно сгенерирован!')
		} catch (e: unknown) {
			console.log(e)
			setError(JSON.stringify('Произошла ошибка при попытке сгенерировать отчет. Попробуйте ещё раз'))
		} finally {
			setIsLoading(false)
		}
	}, [data, generatedFunctionName, reportName])

	return (
		<HStack className={classNames('', {}, [className])} gap="12" max>
			<Button onClick={onSaveToExcel} theme="outline">
				Сохранить в Excel
			</Button>
			{isLoading && <Loader/>}
			{success && <Text text={success}/>}
			{error && <Text text={error} theme="error"/>}
		</HStack>
	)
}

export const GenerateExcelReport = memo(<T extends object>(props: GenerateExcelReportProps<T>) => {
	return (
		<DesktopComponent>
			<GenerateExcelReportContent {...props}/>
		</DesktopComponent>
	)
})
