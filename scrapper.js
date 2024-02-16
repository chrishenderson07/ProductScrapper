import puppeteer from 'puppeteer'
import { GoogleGenerativeAI } from '@google/generative-ai'

const url =
	'https://www.thekingofparfums.com.br/lacrado/lattafa/?mpage=2&Volume=100%20Ml|100ml|100ml%20Sem%20Caixa|1oo%20Ml'

// Faça conecção com o Gemini
const APIKey = `AIzaSyCZ6q1Bp27qpYsQ4XynE8M2dQUdBysbZfU`
const genAI = new GoogleGenerativeAI(APIKey)

export const scrapper = async () => {
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
			if (elemento && elemento.textContent.trim()) {
				const scriptElement = elemento.querySelector(
					'script[type="application/ld+json"]',
				)
				if (scriptElement && scriptElement.textContent.trim()) {
					const json = JSON.parse(scriptElement.textContent)
					if (json && json.name && json.description) {
						produtos.push({
							name: json.name,
							description: json.description,
						})
					}
				}
			}
		})

		return produtos
	})

	// Percorre o array de produtos e atribui uma nova descrição utilizando geminiHelper
	for (let i = 0; i < produtos.length; i++) {
		const produto = produtos[i]
		console.log('Produto:', produto)
		try {
			const newDescription = await geminiHelper(
				JSON.stringify(produto.description),
			)

			console.log('Nova descrição:', newDescription)
			produto.description = newDescription
		} catch (error) {
			console.error('Erro ao obter descrição do produto:', error)
		}
	}

	console.log('Novos valores dos produtos:', produtos)

	await browser.close()
}

// Definindo a função geminiHelper
async function geminiHelper(description) {
	const usePrompt = 'Crie uma boa descrição para o produto ' + description
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

await scrapper()
