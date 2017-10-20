window.onload = () => {

	let dropArea = document.querySelector('.modulo-arquivo-drop')
	
	dropArea.addEventListener('drop', (event) => {
		event.preventDefault()
		event.stopPropagation()

		let file = new ProjectionExplorerFile()
		file.read(event.dataTransfer.files[0])

		/*window.setTimeout(() => {

			console.log(file)
			file.statistics()
			console.log(file)
						
			let novo = file.columnNormalization()
			console.log(novo)
			novo.statistics()
			console.log(novo)


		}, 1000)*/

		/*let file = new ProjectionExplorerFile()
		file.read(event.dataTransfer.files[0])

		window.setTimeout(() => {

			//console.log(file.exportProjectionExplorer())
			file.statistics()
			//file.save('output', file.exportCSV())
			console.log(file)

		}, 1000)*/
		

		let plot = new ScatterPlot('.modulo-visualizacao');
		window.setTimeout(() => {


			plot.setAxisX(0, 'A1');
			plot.setAxisY(4, 'Classe de Íris');
			plot.setColor(1, 'A2');

			plot.read(file);

			plot.create();

		}, 1000);
		
	})
	dropArea.addEventListener('dragover', (event) => {
		event.preventDefault()
		event.stopPropagation()

		event.dataTransfer.dropEffect = 'copy'
	})

}