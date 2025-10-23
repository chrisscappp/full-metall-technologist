import { Button } from '@/UI/Button/Button'
import { HStack } from '@/UI/Stack'
import { memo, MouseEvent, useCallback, useEffect, useState } from 'react'
import UploadWhite from '@/assets/icons/upload-white-64-64.svg'
import UploadDark from '@/assets/icons/upload-black-64-64.svg'
import { useTheme } from '@/utils/hooks/useTheme'
import { invoke } from '@tauri-apps/api/core'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { open } from '@tauri-apps/plugin-dialog'
import cls from './ParseModelVariables.module.scss'
import { classNames } from '@/utils/lib/classNames/classNames'
import { ParseDrowingModelResult } from '../../lib/types/parseDrowingModel'
import { Loader } from '@/UI/Loader/Loader'
import { Text } from '@/UI/Text/Text'

interface ParseModelVariablesProps<T> {
	className?: string,
	onSetParsedValues?: (data: ParseDrowingModelResult<T>) => void
}

const ParseModelVariablesComponent = <T extends object>(props: ParseModelVariablesProps<T>) => {
	
	const { className, onSetParsedValues } = props

	const { isLightTheme } = useTheme()
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
		<HStack className={classNames('', {}, [className])} gap="20">
			<Button onClick={onPickFile}>
				Загрузить модель <img src={isLightTheme ? UploadWhite : UploadDark} className={cls.img}/>
			</Button>
			{success && <Text text={success}/>}
			{error && <Text text={error} theme="error"/>}
			{isLoading && <Loader size="loader_s"/>}
		</HStack>
	)
}

export const ParseModelVariables = memo(ParseModelVariablesComponent) as <T extends object>(props: ParseModelVariablesProps<T>) => JSX.Element
