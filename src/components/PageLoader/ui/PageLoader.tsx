import { Loader } from '@/UI/Loader/Loader'
import { VStack } from '@/UI/Stack'
import { memo } from 'react'

interface PageLoaderProps {
	className?: string
}

export const PageLoader = memo(({ className }: PageLoaderProps) => {
	return (
		<VStack className={className} justify="center" max>
			<Loader
				theme="loader_dark"
			/>
		</VStack>
	)
})
