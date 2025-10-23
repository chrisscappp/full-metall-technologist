import { describe, test, expect } from 'vitest'
import { calculateDrawingOperationsCountV2, calculateDrawingOperationsDataV2, calculateOperationsCount, normalizeOpertionsV2 } from './calculateNewDrowing'
import { initialParams } from '../../consts/params'
import { CalculateOperationsCountResult, DrowingOperationDataV2 } from '../../types/drowing'

describe('calculateNewDrowing', () => {
	test('normalize opreations data 1', () => {
		const calculateOperationsCountResult: CalculateOperationsCountResult = {
			drowingCoeff: [0.58, 0.98],
			operationsCount: 2,
			sumDrowingCoeff: 0.57,
			sumThinCoeff: 0.5,
			thinCoeff: [0.84, 0.6]
		}
		expect(calculateOperationsCount(initialParams)).toEqual<CalculateOperationsCountResult>(calculateOperationsCountResult)
		expect(normalizeOpertionsV2(calculateOperationsCountResult, Number(initialParams.max_pull_subsequent_op), Number(initialParams.max_thin_subsequent_op))).toEqual({
			drowingCoeffArr: [0.89, 0.64],
			operationsCount: 2,
			sumDrowingCoeff: 0.57,
			sumThinCoeff: 0.5,
			thinCoeffArr: [0.6, 0.83]
		})
	})
	test('calculate operations count v2 + operations data 1', () => {
		const result: CalculateOperationsCountResult = {
			drowingCoeff: [0.89, 0.64],
			operationsCount: 2,
			sumDrowingCoeff: 0.57,
			sumThinCoeff: 0.5,
			thinCoeff: [0.6, 0.83]
		}
		expect(calculateDrawingOperationsCountV2(initialParams)).toEqual<CalculateOperationsCountResult>(result)
		expect(calculateDrawingOperationsDataV2(initialParams, result)).toEqual<DrowingOperationDataV2[]>([
			{
				amount_of_effort_hub: 634.94,
				area_changes_us: 0.47,
				bottom_thin: 0.5,
				deformation_power: 2.12,
				degree_deformation_ls: 0.67,
				degree_deformation_us: 0.72,
				distance_ls_us: 0.49,
				distance_us_us: 15.81,
				elastic_deformation_matrix: 2.85,
				elastic_unloading: 0.0025800000000000003,
				executive_dimensions_hob_ls: 140.15,
				executive_dimensions_hob_us: 140.67,
				executive_dimensions_matrix: 139.87,
				height: 16.310000000000002,
				inside_diameter_ls: 141.58,
				inside_diameter_us: 142.1,
				lower_area_hub: 0.98,
				matrix_radius: 1,
				median_diameter_us: 142.4,
				outside_diameter: 142.7,
				radius: 0.5,
				specific_force: 2158.56,
				sphere_part_height: 23.87,
				total_elastic_deform_unload: 2.85,
				wall_thin_ls: 0.56,
				wall_thin_us: 0.3
			},
			{
				amount_of_effort_hub: 634.94,
				area_changes_us: 0.47,
				bottom_thin: 0.5,
				deformation_power: 1.73,
				degree_deformation_ls: 0.26,
				degree_deformation_us: 0.73,
				distance_ls_us: 1.97,
				distance_us_us: 34.92,
				elastic_deformation_matrix: 1.83,
				elastic_unloading: 0.00318,
				executive_dimensions_hob_ls: 88.86,
				executive_dimensions_hob_us: 89.97,
				executive_dimensions_matrix: 89.58,
				height: 100,
				inside_diameter_ls: 89.77,
				inside_diameter_us: 90.89,
				lower_area_hub: 2.06,
				matrix_radius: 0.5,
				median_diameter_us: 91.14,
				outside_diameter: 91.39,
				radius: 2,
				specific_force: 837.65,
				sphere_part_height: 15.56,
				total_elastic_deform_unload: 1.83,
				wall_thin_ls: 0.81,
				wall_thin_us: 0.25
			}
		])
	})

	test('calculate operations count v2 + operations data 2', () => {
		const result: CalculateOperationsCountResult = {
			drowingCoeff: [0.6, 0.95],
			operationsCount: 2,
			sumDrowingCoeff: 0.57,
			sumThinCoeff: 0.5,
			thinCoeff: [0.6, 0.83]
		}
		const newParams = {
			...initialParams, 
			max_pull_first_op: 0.4,
			max_pull_subsequent_op: 0.5
		}
		expect(calculateDrawingOperationsCountV2(newParams)).toEqual<CalculateOperationsCountResult>(result)
		
		expect(calculateDrawingOperationsDataV2(initialParams, result)).toEqual<DrowingOperationDataV2[]>([{
			amount_of_effort_hub: 2837.58,
			area_changes_us: 0.64,
			bottom_thin: 0.5,
			deformation_power: -1.83,
			degree_deformation_ls: -0.08,
			degree_deformation_us: 1.18,
			distance_ls_us: 0.49,
			distance_us_us: 71.35,
			elastic_deformation_matrix: 1.93,
			elastic_unloading: 0.0054,
			executive_dimensions_hob_ls: 92.36,
			executive_dimensions_hob_us: 94.73,
			executive_dimensions_matrix: 94.39,
			height: 71.85,
			inside_diameter_ls: 93.29,
			inside_diameter_us: 95.7,
			lower_area_hub: 7.11,
			matrix_radius: 1,
			median_diameter_us: 96,
			outside_diameter: 96.3,
			radius: 0.5,
			specific_force: -257.74,
			sphere_part_height: 16.13,
			total_elastic_deform_unload: 1.94,
			wall_thin_ls: 1.5,
			wall_thin_us: 0.3
		},
		{
			amount_of_effort_hub: 2837.58,
			area_changes_us: 0.21,
			bottom_thin: 0.5,
			deformation_power: 0.95,
			degree_deformation_ls: 1.14,
			degree_deformation_us: 0.27,
			distance_ls_us: 1.97,
			distance_us_us: 4.47,
			elastic_deformation_matrix: 1.83,
			elastic_unloading: 0.0016200000000000001,
			executive_dimensions_hob_ls: 89.95,
			executive_dimensions_hob_us: 90.03,
			executive_dimensions_matrix: 89.64,
			height: 100,
			inside_diameter_ls: 90.87,
			inside_diameter_us: 90.95,
			lower_area_hub: 0.26,
			matrix_radius: 0.5,
			median_diameter_us: 91.2,
			outside_diameter: 91.45,
			radius: 2,
			specific_force: 3672.78,
			sphere_part_height: 15.58,
			total_elastic_deform_unload: 1.83,
			wall_thin_ls: 0.29,
			wall_thin_us: 0.25
		}
	])
	})
})
