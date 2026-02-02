import { Button } from '@/UI/Button/Button'
import { HStack } from '@/UI/Stack'
import { memo, MouseEvent, useCallback, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { open } from '@tauri-apps/plugin-dialog'
import { classNames } from '@/utils/lib/classNames/classNames'
import { ParseDrowingModelResult } from '../../lib/types/parseDrowingModel'
import { Loader } from '@/UI/Loader/Loader'
import { Text } from '@/UI/Text/Text'
import { DesktopComponent } from '@/utils/lib/components/DesktopComponent'

interface ParseModelVariablesProps<T> {
	className?: string,
	onSetParsedValues?: (data: ParseDrowingModelResult<T>) => void
}

const ParseModelVariablesContent = <T extends object>(props: ParseModelVariablesProps<T>) => {
	
	const { className, onSetParsedValues } = props

	const [success, setSuccess] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const onPickFile = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		try {
			setError('')
			setSuccess('')
			const filePath = await open({
				multiple: false,
				directory: false,
				filters: [{ name: 'Model', extensions: ['m3d'] }]
			})
			setIsLoading(true)
			const parseResult: ParseDrowingModelResult<T> = await invoke(InkoveFunction.RUN_PARSE_MODEL_VARIABLES_SCRIPT, {
				params: {
					file_path: filePath
				}
			})
			if (parseResult.status !== 200) {
				setError(parseResult.message)
			} else {
				setSuccess(parseResult.message)
				onSetParsedValues?.(parseResult)
			}
		} catch (e: unknown) {
			setError(JSON.stringify(e))
			// произошла ошибка при попытке открыть чертеж. попробуйте еще раз
		} finally {
			setIsLoading(false)
		}
	}, [onSetParsedValues])

	useEffect(() => {
		if (success) {
			setTimeout(() => {
				setSuccess('')
			}, 3000)
		}
	}, [success])

	return (
		<HStack className={classNames('', {}, [className])} gap="16" align="center">
			<Button onClick={onPickFile} theme="backgroundInverted">
				Загрузить модель
			</Button>
			<Text text="Поддерживаемые форматы: .m3d, .cdw, .spw" size="size_s" theme="tertiary"/>
			{success && <Text text={success}/>}
			{error && <Text text={error} theme="error"/>}
			{isLoading && <Loader size="loader_s"/>}
		</HStack>
	)
}

export const ParseModelVariables = memo(<T extends object>(props: ParseModelVariablesProps<T>) => {
	return (
		<DesktopComponent>
			<ParseModelVariablesContent {...props}/>
		</DesktopComponent>
	)
}) as <T extends object>(props: ParseModelVariablesProps<T>) => JSX.Element
