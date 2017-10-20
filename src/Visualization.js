class ScatterPlot  {

	constructor(selector){

		this.selector = selector;

		this.margin = {
			top: 50,
			left: 80,
			bottom: 50,
			right: 80
		}

		this.width = 740 - this.margin.left - this.margin.right;
		this.height = 600 - this.margin.top - this.margin.bottom;

		this.scaleX = d3.scaleLinear().range([0, this.width]);
		this.scaleY = d3.scaleLinear().range([this.height, 0]);
		this.scaleColor = d3.scaleOrdinal().range(d3.schemeCategory10);
	}

	setAxisX(posPropertyX, labelX){
		this.posPropertyX = posPropertyX;
		this.labelX = labelX;
	}


	setAxisY(posPropertyY, labelY){
		this.posPropertyY = posPropertyY;
		this.labelY = labelY;
	}

	setColor(posPropertyColor, labelColor){
		this.posPropertyColor = posPropertyColor;
		this.labelColor = labelColor;
	}

	read(file){

		this.data = file.data;

		let keys = Object.keys(this.data[0]);
		this.propertyX = keys[this.posPropertyX];
		this.propertyY = keys[this.posPropertyY];
		this.propertyColor = keys[this.posPropertyColor];
	}


	create(){

		this.element = d3.select(this.selector)
		.style('font','11px sans-serif')
		.style('border', '1px solid #ccc')
		.append('svg')
		.style('display', 'block')
		.style('margin', '0 auto')
		.attr('width', this.width + this.margin.left + this.margin.right)
		.attr('height', this.height + this.margin.top + this.margin.bottom)
		.append('g')
		.attr('transform', `translate(${this.margin.left},${this.margin.right})`);

		this.tooltip = d3.select(this.selector)
		.append('div')
		.attr('class','tooltip')
		.style('opacity', 0);

		//this.scaleX.domain(d3.extent(this.data, (d) => { return d[this.propertyX]; }));
		//this.scaleY.domain(d3.extent(this.data, (d) => { return d[this.propertyY]; }));

		this.scaleX.domain([d3.min(this.data, (d) => { return d[this.propertyX]; })-0.3, d3.max(this.data, (d) => { return d[this.propertyX]; })+0.3]);
		this.scaleY.domain([d3.min(this.data, (d) => { return d[this.propertyY]; })-0.3, d3.max(this.data, (d) => { return d[this.propertyY]; })+0.3]);

		if (this.posPropertyColor != null) {

			this.element.selectAll("dot")
			.data(this.data)
			.enter().append("circle")
			.attr("r", 6)
			.attr("fill", (d) => { return d3.color(this.scaleColor(d[this.propertyColor]));})
			.attr("cx", (d) => { return this.scaleX(d[this.propertyX]); })
			.attr("cy", (d) => { return this.scaleY(d[this.propertyY]); })
			.attr('stroke-width', 1)
			.attr('stroke', '#000')
			.attr('fill-opacity', 0.7)
			.on('mouseover', (d) => {

				d3.select(d3.event.target).each(function(){
					d3.select(this).transition().duration(200).style('fill-opacity', 1);
				});
			})
			.on('mouseleave', () => {

				d3.select(d3.event.target).each(function(){
					d3.select(this).transition().duration(200).style('fill-opacity', .7);
				});
				
			});
		}
		else{

			this.element.selectAll("dot")
			.data(this.data)
			.enter().append("circle")
			.attr("r", 6)
			.attr("cx", (d) => { return this.scaleX(d[this.propertyX]); })
			.attr("cy", (d) => { return this.scaleY(d[this.propertyY]); });
		}

		this.element.append("g")
		.attr('class', 'eixo-x')
		.attr("transform", "translate(0," + this.height + ")")
		.call(d3.axisBottom(this.scaleX));

		d3.select('.eixo-x')
		.append("text")
		.attr("x", this.width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.style('fill','#000')
		.text(this.labelX);

		this.element.append("g")
		.attr('class', 'eixo-y')
		.call(d3.axisLeft(this.scaleY))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style('fill','#000')
		.text(this.labelY);

		this.legend = this.element.selectAll(".legend")
		.data(this.scaleColor.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", (d, i) => { return "translate(0," + i * 15 + ")"; });


		this.legend.append("rect")
		.attr("x", this.width - 10)
		.attr("width", 12)
		.attr("height", 12)
		.style("fill", this.scaleColor)
		.style('stroke', '#000')
		.on('mouseover', (d) => {
			let color = this.propertyColor;
			d3.selectAll('circle').each(function(a){

				if (a[color] == d) d3.select(this).raise().transition().duration(200).attr('r', 10);
				//d3.select(this).transition().duration(200).style('fill-opacity', 1);
			});
		})
		.on('mouseleave', (d) => {
			let color = this.propertyColor;
			d3.selectAll('circle').each(function(a){
				
				if (a[color] == d) d3.select(this).transition().duration(200).attr('r', 6);
				//d3.select(this).transition().duration(200).style('fill-opacity', 1);
			});

		});

		this.legend.append("text")
		.attr("x", this.width - 16)
		.attr("y", 9)
		.attr("dy", "3px")
		.style("text-anchor", "end")
		.text((d) => { return d;})

	}
}

class RadViz {

	constructor(selector){

		d3.select(selector)
		.style('display', 'block')
		.style('margin', '0 auto');

		this.element = d3.select(selector).append('svg');

		this.width = 800;
		this.height = 600;
		this.radius = 250;


		this.element
		.attr('width', this.width)
		.attr('height', this.height)
		.style('display', 'block')
		.style('margin', '0 auto');

		this.scaleColor = d3.scaleOrdinal().range(d3.schemeCategory10);
		this.colored = false;
	}

	setRadius(radius){

		this.radius = radius;
	}

	setAttributes(...lista){

		this.listAttributes = [];

		let num = lista.length;
		let period = 2*Math.PI/num;

		lista.forEach((e,i) => {

			this.listAttributes.push(
			{
				label: e,
				xForce: Math.cos(period*i),
				yForce: Math.sin(period*i)
			}
			);
		});
	}

	read(file){

		this.data = file.data;

	}

	colorful(){

		this.colored = true;
	}

	create(){

		if (this.listAttributes == null) {

			let lista = Object.keys(this.data[0]);
			
			//Discard the class
			lista.pop();

			this.listAttributes = [];

			let num = lista.length;
			let period = 2*Math.PI/num;

			lista.forEach((e,i) => {

				this.listAttributes.push(
				{
					label: e,
					xForce: Math.cos(period*i),
					yForce: Math.sin(period*i)
				}
				);
			});
		}

		this.element
		.append('g')
		.attr('class','container');

		let container = this.element.select('.container');

		container
		.append('circle')
		.attr('stroke-width', 3)
		.attr('stroke','#000')
		.attr('cx', this.width/2)
		.attr('cy', this.height/2)
		.attr('r', this.radius)
		.attr('fill', '#fff');

		//--------------------------------------------------------------
		// Drawing attributes points
		//--------------------------------------------------------------
		let num = this.listAttributes.length;
		let period = 2*Math.PI/num;

		this.listAttributes.forEach((e,i) => {

			container.append('circle')
			.attr('r', 5)
			.attr('cx', e.xForce*this.radius + this.width/2)
			.attr('cy', e.yForce*this.radius + this.height/2)
			
			let x = e.xForce*(this.radius + 25) + this.width/2;
			let y = e.yForce*(this.radius + 25) + this.height/2;

			container.append("text")
			.attr("x", x)
			.attr("y", y)
			.attr('transform',`rotate(${(360/this.listAttributes.length)*(i-1)},${x},${y})`)
			.style("text-anchor", "middle")
			.style('fill','#000')
			.text(e.label);
		});

		

		//--------------------------------------------------------------
		// Drawing data points
		//--------------------------------------------------------------
		let data_group = container.append('g')
		.attr('class','data-group');

		this.data.forEach((item, i) => {

			let a = 0;
			let valor = Object.values(item).reduce((total, atual) => {return total + atual}, 0);

			
			let cx = Object.values(item).reduce((total, atual) => {
				if (Number.isNaN(new Number(atual)) || this.listAttributes.length <= a) return total;
				return total + atual*this.listAttributes[a++].xForce;
			}, a);

			cx /= valor;

			a = 0;
			let cy = Object.values(item).reduce((total, atual) => {
				if (Number.isNaN(new Number(atual)) || this.listAttributes.length <= a) return total;
				return total + atual*this.listAttributes[a++].yForce;
			}, a);

			cy /= valor;
			
			//console.log(cx + " -- " + cy);
			//console.log(Object.values(a));
			if (this.colored) {
				data_group.append('circle')
				.attr('r', 6)
				.attr('cx', cx*this.radius + this.width/2)
				.attr('cy', cy*this.radius + this.height/2)
				.attr('stroke', '#000')
				.attr('fill', d3.color(this.scaleColor(Object.values(item)[a])))
				.on('mouseover', (d) => {

					d3.select(d3.event.target).each(function(){
						d3.select(this).raise().transition().duration(200).attr('r', 10);
					});
				})
				.on('mouseleave', () => {

					d3.select(d3.event.target).each(function(){
						d3.select(this).transition().duration(200).attr('r', 6);
					});

				});
			}
			else{
				data_group.append('circle')
				.attr('r', 6)
				.attr('cx', cx*this.radius + this.width/2)
				.attr('cy', cy*this.radius + this.height/2)
				.attr('stroke', '#000')
				.attr('fill', 'blue');

			}
		});

	}
}