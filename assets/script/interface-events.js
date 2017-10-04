window.onload = () => {

	let dropArea = document.querySelector('.modulo-arquivo-drop')
	
	dropArea.addEventListener('drop', (event) => {
		event.preventDefault()
		event.stopPropagation()

		let file = new 	CSVFile()
		file.read(event.dataTransfer.files[0])

		window.setTimeout(() => {

			//console.log(file.exportProjectionExplorer())

			//file.save('output', file.exportProjectionExplorer())
			file.statistics()
			//console.log(file)
			//file.columnNormalization()
			//file.lineNormalization()
			file.zScoreNormalization()
			console.log(file)
			//console.log(novo)

		}, 1000)

		/*let file = new ProjectionExplorerFile()
		file.read(event.dataTransfer.files[0])

		window.setTimeout(() => {

			//console.log(file.exportProjectionExplorer())

			file.save('output', file.exportCSV())
			console.log(file)

		}, 1000)*/


	})
	dropArea.addEventListener('dragover', (event) => {
		event.preventDefault()
		event.stopPropagation()

		event.dataTransfer.dropEffect = 'copy'
	})

}