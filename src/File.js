class File {

	constructor(){

		this.reader = new FileReader()
		this.reader.onload = (f) => {

			if(this.reader.readyState === FileReader.DONE){
				this.file.content = this.reader.result
			}
		}
	}

	/**
	 * [read description]
	 * @param  {[type]} file [description]
	 * @return {[type]}      [description]
	 */
	read(file){

		this.file = {
			name: file.name,
			type: file.type,
			lastModifiedDate: file.lastModifiedDate
		}

		this.reader.readAsText(file)

		window.setTimeout(() => {

			this.format()

		}, 1000);
	}

	save(filename, text){

		let a = document.createElement('a')
		a.style = "display:none"

		document.body.appendChild(a)

		let blob = new Blob([text], {type: "octet/stream"})
		let url = window.URL.createObjectURL(blob)

		a.href = url
		a.download = `${filename}`
		a.click()

		window.URL.revokeObjectURL(url)
	}

	statistics(){

		Object.keys(this.stats).forEach( (e) => {

			let set = this.stats[e].data.sort((a,b) => {return a-b})

			this.stats[e].min = set[0]
			this.stats[e].max = set[set.length - 1]

			//mediana
			let half = set.length/2;
			if (set.length % 2 === 0){
				
				this.stats[e].median = (set[half] + set[half - 1])/2
			}
			else{

				this.stats[e].median = set[half-1/2]
			}

			//media
			this.stats[e].average = set.reduce((total, e) => {
				return total + e
			}, 0)/set.length

			//desvio padrao
			let dp = set.reduce((total, a) => {

				return total + Math.pow(a - this.stats[e].average, 2)
			}, 0)

			this.stats[e].dp = Math.sqrt((1/(set.length - 1)) * dp)
		})
	}

	columnNormalization(){

		let clone = this.clone()

		clone.data.map((linha) => {

			return Object.keys(linha).map((coluna) => {

				let valor = (linha[coluna] - this.stats[coluna].min)/(this.stats[coluna].max - this.stats[coluna].min)
				linha[coluna] = (Number.isNaN(valor) ? linha[coluna] : valor)
			})
		})

		return clone
	}

	lineNormalization(){

		let clone = this.clone()
	
		clone.data.map((linha) => {

			let total = Object.values(linha).reduce((total, elem) => {
				return total + (Number.isNaN(Number(elem)) ? 0 : elem*elem)
			}, 0)

			total = Math.sqrt(total)

			return Object.keys(linha).map((coluna) => {

				let valor = Math.pow(linha[coluna], 2)/total
				linha[coluna] = (Number.isNaN(valor) ? linha[coluna] : valor)
			})
		})

		return clone
	}

	zScoreNormalization(){

		let clone = this.clone()

		clone.data.map((linha) => {

			return Object.keys(linha).map((coluna) => {

				let valor = (linha[coluna] - this.stats[coluna].average)/(this.stats[coluna].dp)
				linha[coluna] = (Number.isNaN(valor) ? linha[coluna] : valor)
			})
		})	

		return clone
	}

	clone(){

		return Object.assign( window.eval(`new ${this.constructor.name}()`), JSON.parse(JSON.stringify(this)))


	}
}

class ProjectionExplorerFile extends File{

	constructor(){

		super();

		this.extension = 'data'
	}

	format(){

		let linhas = this.file.content.split('\n')

		if (linhas[0] === 'DN') {
			this.dense = true
			this.class = false
		}
		else{
			this.dense = true
			this.class = true
		}

		this.length = Number.parseInt(linhas[1])
		this.numAttributes = Number.parseInt(linhas[2])
		this.attributes = linhas[3].trim().split(';')

		this.attributes.unshift('ID')

		this.stats = {}

		this.attributes.filter((a) => {return a != 'ID'}).forEach((e) => {

			this.stats[e] = {
				data: []
			}
		})


		this.data = [];
		for (let i = 0; i < this.length; i++) {
			
			let object = {}
			let values = linhas[i+4].split(';')

			let count = 0

			this.attributes.forEach((e) => {
				
				if (e !== 'ID') {

					if (isNaN(Number.parseFloat(values[count]))){
						object[e] = values[count]
					}
					else {
						this.stats[e].data.push(Number.parseFloat(values[count]))
						object[e] = Number.parseFloat(values[count])
					}
				}
				else{
					object[e] = values[count]
				}

				count++ 

			}, object, values, count)

			this.data.push(object)
		}

	}

	exportCSV(){

		let text = this.attributes.join() + '\n'

		this.data.forEach((e) => {

			text += Object.values(e).join() + '\n'
		}, text)

		return text
	}
	
}

class CSVFile extends File{

	constructor(){

		super();

		this.extension = 'csv'
	}

	format(){

		let linhas = this.file.content.split('\n')

		this.attributes = linhas[0].split(',')
		this.numAttributes = this.attributes.length - 1;

		this.length = linhas.length - 1;

		this.stats = {}

		this.attributes.forEach((e) => {

			this.stats[e] = {
				data: []
			}
		})

		this.data = [];
		for (let i = 1; i < this.length; i++) {
			
			let object = {}
			let values = linhas[i].split(',')

			let count = 0

			this.attributes.forEach((e) => {
				
				if (isNaN(Number.parseFloat(values[count]))){
					object[e] = values[count]
				}
				else {
					this.stats[e].data.push(Number.parseFloat(values[count]))
					object[e] = Number.parseFloat(values[count])
				}

				count++
			}, object, values, count)

			this.data.push(object)
		}

		//this.statistcs()
	}

	exportProjectionExplorer(){

		let text = 	(this.class ? "DY" : "DN") + "\n" +
		this.length + "\n" +
		this.numAttributes + "\n" +
		this.attributes.join(';') + '\n'

		this.data.forEach((e) => {

			text += Object.values(e).join(';') + '\n'
		}, text)

		return text
	}
}