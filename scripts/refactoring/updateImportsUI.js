// @/components/UI/... -> @/UI/...

import { Project } from 'ts-morph'

const project = new Project()

project.addSourceFilesAtPaths('src/**/*.ts')
project.addSourceFilesAtPaths('src/**/*.tsx')

const files = project.getSourceFiles()

files.forEach(file => {
	const importDeclarations = file.getImportDeclarations()
	importDeclarations.forEach(importDeclaration => {
		const value = importDeclaration.getModuleSpecifierValue()
		if (value.startsWith('@/components/UI')) {
			const splittedValue = value.split('/') // ['@', 'components', 'UI', ...]
			splittedValue.splice(1, 1)
			const newValue = splittedValue.join('/')
			importDeclaration.setModuleSpecifier(newValue)
		}
	})
})

project.save()
