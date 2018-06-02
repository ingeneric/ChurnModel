const colors = [ 
  '#2a5788', //Header blue
  '#f96332', //Primary orange  
  '#9b59b6', //Purple
  '#2ecc71', //Green
  '#1abc9c', //Turquoise
  '#2c3e50' //Dark blue
];

Math.log10 = Math.log10 || function(x) {
  return Math.log(x) * Math.LOG10E;
};

HTMLElement.prototype.hasClass = function( className ) {
	if (this.classList)
		return this.classList.contains(className)
	else
		return !!this.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

HTMLElement.prototype.addClass = function( className ) {
	if (this.classList)
		this.classList.add(className)
	else if (!hasClass(this, className)) this.className += " " + className
}


function setTitle( titleElement, title ) {
  document.getElementsByTagName('title')[0].innerText = title;
  titleElement.innerText = title;
}

function createHead( tableElement ) {
  const head = tableElement.createTHead();
  head.addClass('text-primary');
  return head;
}

function createHeadCell( cellContent ) {
  const headCell = document.createElement('th');
  headCell.addClass('text-center');
  headCell.innerHTML = cellContent;
  return headCell;
}

function createBodyCell( cellContent ) {
  const bodyCell = document.createElement('td');
  bodyCell.addClass('text-center');
  bodyCell.addClass('cp');
  bodyCell.title = 'Click to copy to Clipboard';
  bodyCell.innerHTML = cellContent;
  return bodyCell;
}

function createWarning( warningContent ) {
  const warningElement = document.createElement('div');
  warningElement.addClass('alert');
  warningElement.addClass('alert-warning');
  warningElement.innerHTML = '<b>Warning - </b> ' + warningContent;  
  return warningElement;
}

function plotIsoStressInverse( graphElement, isoStressData ) {
  const data = [];

  for( let i = 0; i < isoStressData.stress.length; i++) {    
    const x = [];
    const y = [];
    const xFit = [];
    const yFit = [];

    for( let j = 0; j < isoStressData.T[i].length ; j++) {
      x.push( 1.0 / isoStressData.T[i][j] );
      y.push( Math.log10(isoStressData.tr[i][j]) );
      xFit.push( isoStressData.fitInverse.T[i][j] )
      yFit.push( isoStressData.fitInverse.tr[i][j] )
    }

    let trace = { x: x, 
                  y: y, 
                  mode: 'markers',
                  showlegend: false,
                  name: isoStressData.stress[i] + 'MPa',
                  legendgroup: i,
                  marker: { color: colors[i] }
                };
    
    data.push( trace );

    trace = { x: xFit, 
              y: yFit, 
              mode: 'line',
              name: isoStressData.stress[i] + 'MPa Fitted',
              legendgroup: i,
              line: { color: colors[i] }
            };
    
    data.push( trace );
  }

  const layout = {    
    xaxis: {
      title: '1/Temperature (1/°C)'
    },
    yaxis: {
      title: 'log(t) (h)'
    },
    margin: {
      t: 20
    }
  };

  Plotly.newPlot(graphElement,data,layout);
}

function plotIsoStress( graphElement, isoStressData) {
  const data = [];

  for( let i = 0; i < isoStressData.stress.length; i++) {    
    const x = [];
    const y = [];
    const xFit = [];
    const yFit = [];

    for( let j = 0; j < isoStressData.T[i].length ; j++) {
      x.push( isoStressData.T[i][j] );
      y.push( Math.log10(isoStressData.tr[i][j]) );
      xFit.push( isoStressData.fit.T[i][j] )
      yFit.push( isoStressData.fit.tr[i][j] )
    }

    let trace = { x: x, 
                  y: y, 
                  mode: 'markers',
                  showlegend: false,
                  name: isoStressData.stress[i] + 'MPa',
                  legendgroup: i,
                  marker: { color: colors[i] }
                };
    
    data.push( trace );

    trace = { x: xFit, 
              y: yFit, 
              mode: 'line',
              name: isoStressData.stress[i] + 'MPa Fitted',
              legendgroup: i,
              line: { color: colors[i] }
            };
    
    data.push( trace );
  }

  const layout = {    
    xaxis: {
      title: 'Temperature (°C)'
    },
    yaxis: {
      title: 'log(t) (h)'
    },
    margin: {
      t: 20
    }
  };

  Plotly.newPlot(graphElement,data,layout);
}

function populateMasterCuveTable( tableElement, coefficients) {
  if( coefficients ) {
    const head = createHead( tableElement );
    const headRow = head.insertRow();

    const body = tableElement.createTBody();
    const bodyRow = body.insertRow();

    for( let i = 65; i < (65 + coefficients.length ) ; i++) {
      headRow.appendChild( createHeadCell( String.fromCharCode(i) ) );
      bodyRow.appendChild( createBodyCell( coefficients[i-65]) );
    }  
  } else {
    console.error('Cannot populate master curve table : Coefficients undefined');
  }
}

function plotMasterCurve( graphElement, masterCurveData ) {
  const data = [];

  const x = [];
  const y = [];
  const xFit = [];
  const yFit = [];

  for( let i = 0 ; i < masterCurveData.trainData.p.length; i++) {
    x.push( masterCurveData.trainData.stress[i] );
    y.push( masterCurveData.trainData.p[i] );
  }  

  for( let i = 0; i < masterCurveData.testData.p.length; i++ ) {
    xFit.push( masterCurveData.testData.stress[i] );
    yFit.push( masterCurveData.testData.p[i] );
  }

  let trace = {
    x: x,
    y: y,
    mode: 'markers',
    name: 'Parameters'
  }

  data.push(trace);

  trace = {
    x: xFit,
    y: yFit,
    mode: 'line',
    name: 'Mastercuve'
  }

  data.push(trace);
  

  const layout = {    
    xaxis: {
      title: 'Stress (MPa)'
    },
    yaxis: {
      title: 'Paramter'
    },
    margin: {
      t: 20
    }
  };

  Plotly.newPlot(graphElement,data,layout);
}

function populateStressPredictionTable( tableElement, test ) {
  const head = createHead(tableElement);

  let headRow = head.insertRow();
  let headCell = createHeadCell('Temperature (&deg;C)');
  headCell.rowSpan = 2;
  headRow.appendChild(headCell);

  for( let i = 0; i < test.tr.length; i++) {
    headCell = createHeadCell( test.tr[i] + ' h');
    headCell.colSpan = 4;
    headRow.appendChild(headCell);
  }

  headRow = head.insertRow();
  
  for( let i = 0; i < test.tr.length; i++) {
    headCell = createHeadCell('Stress (MPa)');
    headRow.appendChild(headCell);

    headCell = createHeadCell('Predicted Stress (MPa)');
    headRow.appendChild(headCell);

    headCell = createHeadCell('Error (MPa)');
    headRow.appendChild(headCell);

    headCell = createHeadCell('|Error| (%)');
    headRow.appendChild(headCell);
  }

  const body = tableElement.createTBody();
  let bodyRow;

  for( let i = 0 ; i < test.T.length ; i++) {
    bodyRow = body.insertRow();
    bodyRow.appendChild( createBodyCell( test.T[i] ) );

    for( let j = 0; j < test.tr.length; j++ ) {
      bodyRow.appendChild( createBodyCell( test.stressActual[i][j] ) );
      bodyRow.appendChild( createBodyCell( test.stressPredicted[i][j] ) );
      bodyRow.appendChild( createBodyCell( test.errors.Err[j][i].toFixed(3) ) );
      bodyRow.appendChild( createBodyCell( test.errors.Abs[j][i].toFixed(3) ) );
    }
  }

}

document.addEventListener( 'click', ( event ) => {
  if( event.target.classList.contains('cp') ) {
    const tempTextArea = document.createElement('textArea');
    tempTextArea.value = event.target.innerText;
    const valueCopied = tempTextArea.value;
    document.body.appendChild( tempTextArea );
    tempTextArea.select();

    try{
      let copySuccessfull = document.execCommand('copy');

      if( copySuccessfull ) {
        event.target.innerText = 'Copied';
      } else {
        event.target.innerText = 'Could not copy';
      }
    } catch ( error ) {
      console.error(error);
    }

    document.body.removeChild(tempTextArea);
    setTimeout( resetElement, 1000, event.target, valueCopied);
  }
});

function resetElement( element, content ) {
  element.innerText = content;
}