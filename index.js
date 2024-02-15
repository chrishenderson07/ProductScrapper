import { createObjectCsvWriter } from 'csv-writer'

const csvWriter = createObjectCsvWriter({
	path: 'out.csv',
	header: [
		{ id: 'ID', title: 'ID', default: '' },
		{ id: 'Tipo', title: 'Tipo', default: '' },
		{ id: 'SKU', title: 'SKU', default: '' },
		// Adicionar mais colunas conforme necessário
	],

	fieldDelimiter: ';',
	append: false,
})

const data = [
	{
		ID: '1',
		Tipo: 'Tipo A',
		SKU: 'SKU123',
		Nome: 'Produto 1',
		Publicado: 'Sim',
		'Em destaque?': 'Não',
		'Visibilidade no catálogo': 'Sim',
		'Descrição curta': 'Descrição curta do produto 1',
		Descrição: 'Descrição completa do produto 1',
	},
	// Adicione mais registros conforme necessário
]

csvWriter
	.writeRecords(data)
	.then(() => console.log('Registros foram escritos com sucesso.'))
	.catch((err) => console.error('Erro ao escrever registros: ', err))
