/**
 * @since 2023-10-09
 * @author vivaxy
 */
import {
  camelCaseToKebabCase,
  camelCaseToSnakeCase,
  camelCaseToPascalCase,
  camelCaseToTitleCase,
  camelCaseToSentenceCase,
  kebabCaseToCamelCase,
  kebabCaseToPascalCase,
  kebabCaseToSentenceCase,
  snakeCaseToCamelCase,
  pascalCaseToCamelCase,
  pascalCaseToKebabCase,
} from '../strings.js';

test('camelCaseToKebabCase', function () {
  expect(camelCaseToKebabCase('fileName')).toBe('file-name');
});

test('camelCaseToSnakeCase', function () {
  expect(camelCaseToSnakeCase('fileName')).toBe('file_name');
});

test('camelCaseToPascalCase', function () {
  expect(camelCaseToPascalCase('fileName')).toBe('FileName');
});

test('camelCaseToTitleCase', function () {
  expect(camelCaseToTitleCase('fileName')).toBe('File Name');
});

test('camelCaseToSentenceCase', function () {
  expect(camelCaseToSentenceCase('fileName')).toBe('File name');
});

test('kebabCaseToCamelCase', function () {
  expect(kebabCaseToCamelCase('file-name')).toBe('fileName');
});

test('kebabCaseToPascalCase', function () {
  expect(kebabCaseToPascalCase('file-name')).toBe('FileName');
});

test('kebabCaseToSentenceCase', function () {
  expect(kebabCaseToSentenceCase('file-name')).toBe('File Name');
});

test('snakeCaseToCamelCase', function () {
  expect(snakeCaseToCamelCase('file_name')).toBe('fileName');
});

test('pascalCaseToCamelCase', function () {
  expect(pascalCaseToCamelCase('FileName')).toBe('fileName');
});

test('pascalCaseToKebabCase', function () {
  expect(pascalCaseToKebabCase('FileName')).toBe('file-name');
});
