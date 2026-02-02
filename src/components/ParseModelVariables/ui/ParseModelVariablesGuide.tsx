import { lazy, memo } from 'react'
import { ParseModelVariablesGuideProps } from './ParseModelVariablesGuideContent/ParseModelVariablesGuideContent'
import { DesktopComponent } from '@/utils/components/DesktopComponent'

const ParseModelVariablesLazy = lazy(() => import('./ParseModelVariablesGuideContent/ParseModelVariablesGuideContent'))

export const ParseModelVariables = memo(<T extends object>(props: ParseModelVariablesGuideProps<T>) => {
	return (
		<DesktopComponent>
			{/** @ts-ignore */}
			<ParseModelVariablesLazy {...props} />
		</DesktopComponent>
	)
}) as <T extends object>(props: ParseModelVariablesGuideProps<T>) => JSX.Element
