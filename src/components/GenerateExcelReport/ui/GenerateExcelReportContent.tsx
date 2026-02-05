import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { useCallback, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { save } from '@tauri-apps/plugin-dialog'
import { HStack } from '@/UI/Stack'
import { classNames } from '@/utils/lib/classNames/classNames'
import { Button } from '@/UI/Button/Button'
import { Loader } from '@/UI/Loader/Loader'
import { Text } from '@/UI/Text/Text'

export interface GenerateExcelReportProps<T> {
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e: unknown) {
			setError(JSON.stringify('Произошла ошибка при попытке сгенерировать отчет. Попробуйте ещё раз'))
		} finally {
			setIsLoading(false)
		}
	}, [data, generatedFunctionName, reportName])

	return (
		<HStack className={classNames('', {}, [className])} gap="12" align="center" max>
			<Button onClick={onSaveToExcel} theme="outline">
				Сохранить в Excel
			</Button>
			{isLoading && <Loader size="loader_s"/>}
			{success && <Text text={success} theme="secondary" size="size_s"/>}
			{error && <Text text={error} theme="error" size="size_s"/>}
		</HStack>
	)
}

export default GenerateExcelReportContent
