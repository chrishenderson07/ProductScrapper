import { createObjectCsvWriter } from 'csv-writer'
import puppeteer from 'puppeteer'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const sizeML = '100 ml'

const csvWriter = createObjectCsvWriter({
	path: 'out.csv',
	header: [
		{ id: 'ID', title: 'ID', default: '' },
		{ id: 'Tipo', title: 'Tipo', default: 'variable' },
		{ id: 'SKU', title: 'SKU', default: '' },
		{ id: 'Nome', title: 'Nome', default: '' },
		{ id: 'Publicado', title: 'Publicado', default: 1 },
		{ id: 'Em destaque?', title: 'Em destaque?', default: 0 },
		{
			id: 'Visibilidade no catálogo',
			title: 'Visibilidade no catálogo',
			default: 'visible',
		},
		{ id: 'Descrição curta', title: 'Descrição curta', default: '' },
		{ id: 'Descrição', title: 'Descrição', default: '' },
		{
			id: 'Data de preço promocional começa em',
			title: 'Data de preço promocional começa em',
			default: '',
		},
		{
			id: 'Data de preço promocional termina em',
			title: 'Data de preço promocional termina em',
			default: '',
		},
		{ id: 'Status do imposto', title: 'Status do imposto', default: 'taxable' },
		{ id: 'Classe de imposto', title: 'Classe de imposto', default: '' },
		{ id: 'Em estoque?', title: 'Em estoque?', default: 1 },
		{ id: 'Estoque', title: 'Estoque', default: '' },
		{
			id: 'Quantidade baixa de estoque',
			title: 'Quantidade baixa de estoque',
			default: '',
		},
		{
			id: 'São permitidas encomendas?',
			title: 'São permitidas encomendas?',
			default: 0,
		},
		{
			id: 'Vendido individualmente?',
			title: 'Vendido individualmente?',
			default: 0,
		},
		{ id: 'Peso (kg)', title: 'Peso (kg)', default: 0.44 },
		{ id: 'Comprimento (cm)', title: 'Comprimento (cm)', default: 12 },
		{ id: 'Largura (cm)', title: 'Largura (cm)', default: 10 },
		{ id: 'Altura (cm)', title: 'Altura (cm)', default: 4 },
		{
			id: 'Permitir avaliações de clientes?',
			title: 'Permitir avaliações de clientes?',
			default: 1,
		},
		{ id: 'Nota da compra', title: 'Nota da compra', default: '' },
		{ id: 'Preço promocional', title: 'Preço promocional', default: '' },
		{ id: 'Preço', title: 'Preço', default: '' },
		{
			id: 'Categorias',
			title: 'Categorias',
			default: 'Marcas > Lattafa, Perfumes',
		},
		{ id: 'Tags', title: 'Tags', default: '' },
		{ id: 'Classe de entrega', title: 'Classe de entrega', default: '' },
		{
			id: 'Imagens',
			title: 'Imagens',
			default:
				'https://acdn.mitiendanube.com/stores/001/216/674/products/hayaati-5d6c9a9a1555d8899916970489970541-240-0.webp',
		},
		{ id: 'Posição', title: 'Posição', default: 0 },
		{
			id: 'Nome do atributo 1',
			title: 'Nome do atributo 1',
			default: 'Tamanho',
		},
		{
			id: 'Valores do atributo 1',
			title: 'Valores do atributo 1',
			default: sizeML,
		},
		{
			id: 'Visibilidade do atributo 1',
			title: 'Visibilidade do atributo 1',
			default: 1,
		},
		{ id: 'Atributo global 1', title: 'Atributo global 1', default: 1 },
		{
			id: 'Metadado: _yoast_wpseo_title',
			title: 'Metadado: _yoast_wpseo_title',
		},

		{
			id: 'Metadado: _yoast_wpseo_metadesc',
			title: 'Metadado: _yoast_wpseo_metadesc',
		},
		{
			id: 'Metadado: _yoast_wpseo_focuskw',
			title: 'Metadado: _yoast_wpseo_focuskw',
		},
	],

	fieldDelimiter: ',',
	append: false,
})

// Scrapper

const url =
	'https://www.thekingofparfums.com.br/lacrado/masculino/lacrado-masculino-armaf/?Tamanho=100%20Ml|100ml|100ml%20Sem%20Caixa|105%20Ml|105%20Ml%20Tester|105ml'
// Faça conecção com o Gemini
const APIKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(APIKey)

const scrapper = async () => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.setViewport({ width: 1200, height: 800 })

	await page.goto(url)
	await new Promise((resolve) => setTimeout(resolve, 4000))
	const produtos = await page.evaluate(() => {
		const elementos = document.querySelectorAll(
			'.span3.item-container.m-bottom-half',
		)
		const produtos = []

		elementos.forEach((elemento) => {
			const sizeML = '100 ml'

			if (elemento && elemento.textContent.trim()) {
				const scriptElement = elemento.querySelector(
					'script[type="application/ld+json"]',
				)
				if (scriptElement && scriptElement.textContent.trim()) {
					const json = JSON.parse(scriptElement.textContent)
					if (json && json.name && json.description && json.image) {
						produtos.push({
							Tipo: 'variable',
							Nome: json.name,
							Publicado: 1,
							'Em destaque?': 0,
							'Visibilidade no catálogo': 'visible',
							'Descrição curta': json.description.slice(0, 100) + '...',
							Descrição: json.description,
							'Data de preço promocional começa em': '',
							'Data de preço promocional termina em': '',
							'Status do imposto': 'taxable',
							'Classe de imposto': '',
							'Em estoque?': 1,
							Estoque: 0,
							'Quantidade baixa de estoque': 10,
							'São permitidas encomendas?': 0,
							'Vendido individualmente?': 1,
							'Peso (kg)': 0.5,
							'Comprimento (cm)': 15,
							'Largura (cm)': 10,
							'Altura (cm)': 5,
							'Permitir avaliações de clientes?': 1,
							'Nota da compra': '',
							'Preço promocional': '',
							Categorias: 'Marcas, Armaf, Perfumes, Masculino',
							// Tags: 'amadeirado, cítrico, masculino',
							Imagens: json.image,
							Posição: 0,
							'Nome do atributo 1': 'Tamanho',
							'Valores do atributo 1': sizeML,
							'Visibilidade do atributo 1': 1,
							'Atributo global 1': 1,

							'Metadado: _yoast_wpseo_title': 'Perfume ' + json.name,
							'Metadado: _yoast_wpseo_metadesc': json.description.slice(0, 150),
							'Metadado: _yoast_wpseo_focuskw': 'Perfume ' + json.name,
						})
					}
				}
			}
		})

		return produtos
	})

	const produtosComNovasDescricoes = []

	// Percorre o array de produtos e atribui uma nova descrição utilizando geminiHelper
	for (let i = 0; i < produtos.length; i++) {
		const produto = produtos[i]
		console.log('Produto:', produto)
		try {
			const newDescription = await geminiHelper(
				JSON.stringify(produto.Descrição),
			)

			console.log('Nova descrição:', newDescription)
			produto.Descrição = newDescription
			produtosComNovasDescricoes.push(produto)
		} catch (error) {
			console.error('Erro ao obter descrição do produto:', error)
		}
	}

	console.log('Novos valores dos produtos:', produtosComNovasDescricoes)
	return produtosComNovasDescricoes
}

// Definindo a função geminiHelper
async function geminiHelper(description) {
	const usePrompt =
		'Crie uma boa descrição e detalhada para o produto: ' + description
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
		const result = await model.generateContent(usePrompt)
		const response = await result.response
		const text = await response.text()
		return text
	} catch (error) {
		return 'Erro ao capturar mensagem: ' + error.message
	}
}

const produtosComNovasDescricoes = await scrapper()

console.log(typeof produtosComNovasDescricoes)
csvWriter
	.writeRecords(produtosComNovasDescricoes)
	.then(() => console.log('Registros foram escritos com sucesso.'))
	.catch((err) => console.error('Erro ao escrever registros: ', err))
