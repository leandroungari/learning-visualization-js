window.onload = () => {

	let dropArea = document.querySelector('.modulo-arquivo-drop')
	
	dropArea.addEventListener('drop', (event) => {
		event.preventDefault()
		event.stopPropagation()

		let file = new CSVFile()
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
		

		let plot = new RadViz('.modulo-visualizacao');
		window.setTimeout(() => {


			plot.read(file);
			//plot.setAttributes('Sep_len','Sep_wid','Pet_len','Pet_wid');
			plot.colorful();
			plot.create();

		}, 1000);
		
	})
	dropArea.addEventListener('dragover', (event) => {
		event.preventDefault()
		event.stopPropagation()

		event.dataTransfer.dropEffect = 'copy'
	})

}