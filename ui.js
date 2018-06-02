const ui = {

  lossChart: document.getElementById('lossChart'),
  accChart: document.getElementById('accChart'),

  lossData: [],
  lossX: [],
  lossY: [],
  lossLayout: {
    yaxis: {
      title: 'Loss'
    },
    title: 'Loss over Batches'
  },

  accData: [],
  accX: [],
  accY: [],
  accLayout: {
    yaxis: {
      title: 'Accuracy'
    },
    title: 'Accuracy over Batches'
  },

  createLossPlot: function() {
    let trace = {
      x: this.lossX,
      y: this.lossY,
      mode: 'line',
      name: 'Loss',
      fill: 'tozeroy'
    };

    this.lossData.push(trace);

    Plotly.react( this.lossChart, this.lossData, this.lossLayout);
    Plotly.relayout( this.lossChart, {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  },

  createAccPlot: function() {
    let trace = {
      x: this.accX,
      y: this.accY,
      mode: 'line',
      name: 'Accuracy',
      fill: 'tozeroy'
    };

    this.accData.push(trace);

    Plotly.react( this.accChart, this.accData, this.accLayout );

    Plotly.relayout( this.accChart, {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  },

  plotLoss: function() {
    Plotly.react(document.getElementById('lossChart'),this.lossData,this.lossLayout);
    Plotly.relayout( document.getElementById('lossChart'), {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  },
  plotAcc: function() {
    Plotly.react(document.getElementById('accChart'),this.accData,this.accLayout);
    Plotly.relayout( document.getElementById('accChart'), {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  },

  showPrediction: function( predictedValue ) {
    document.getElementById('predictionResult').innerText = predictedValue;    
    $('#resultModal').modal('show');
  },

  getTestTrainSplit: () => ( Number( document.getElementById('testTrainSplitInput').value) ),
  getBatchSize: () => ( Math.floor(Number( document.getElementById('batchInput').value) ) ),
  getEpochs: () => ( Math.floor(Number( document.getElementById('epochInput').value) ) ),
  getUpdateRate: () => (Math.floor(Number( document.getElementById('updateInput').value) )),

  setTestTrainSplitFeedback: function( valid ) {
    if( !valid ) {
      document.getElementById('testTrainFeedback').classList = 'text-invalid text-center';
      document.getElementById('testTrainFeedback').innerText = 'Must be in set (0,1)';
    } else {
      document.getElementById('testTrainFeedback').classList = '';
      document.getElementById('testTrainFeedback').innerText = '';
    }
  },
  setBatchSizeFeedback: function( valid ) {
    if( !valid ) {
      document.getElementById('batchFeedback').classList = 'text-invalid text-center';
      document.getElementById('batchFeedback').innerText = 'Must be > 0';
    } else {
      document.getElementById('batchFeedback').classList = '';
      document.getElementById('batchFeedback').innerText = '';
    }
  },
  setEpochsFeedback: function( valid ) {
    if( !valid ) {
      document.getElementById('epochFeedback').classList = 'text-invalid text-center';
      document.getElementById('epochFeedback').innerText = 'Must be > 0';
    } else {
      document.getElementById('epochFeedback').classList = '';
      document.getElementById('epochFeedback').innerText = '';
    }
  },
  setUpdateFeedback: function( valid ) {
    if( !valid ) {
      document.getElementById('updateFeedback').classList = 'text-invalid text-center';
      document.getElementById('updateFeedback').innerText = 'Must be > 0';
    } else {
      document.getElementById('updateFeedback').classList = '';
      document.getElementById('updateFeedback').innerText = '';
    }
  },

  validTrainingParameters: function() {

    let splitValid = ( this.getTestTrainSplit() > 0 && this.getTestTrainSplit() < 1.0 );
    let batchValid = ( this.getBatchSize() > 0 );
    let epochValid = ( this.getEpochs() > 0 );
    let updateValid = ( this.getUpdateRate() > 0);

    this.setTestTrainSplitFeedback( splitValid );
    this.setBatchSizeFeedback( batchValid );
    this.setEpochsFeedback( epochValid );
    this.setUpdateFeedback( updateValid );

    return ( splitValid & batchValid & epochValid & updateValid );
  },

  setBatchCount: function( count ) {
    document.getElementById('batch').innerText = count;
  },
  setLoss: function( loss ) {
    document.getElementById('loss').innerText = loss;
  },
  setAcc: function( acc ) {
    document.getElementById('acc').innerText = acc;
  },
  setEpoch: function( epoch ) {
    document.getElementById('epoch').innerText = epoch;
  },

  setFP: function( fp ) {
    document.getElementById('fp').innerText = fp;
  },
  setFN: function( fn ) {
    document.getElementById('fn').innerText = fn;
  },
  setTP: function( tp ) {
    document.getElementById('tp').innerText = tp;
  },
  setTN: function( tn ) {
    document.getElementById('tn').innerText = tn;
  },
  setAccuracy: function( accuracy ) {
    document.getElementById('accuracy').innerText = accuracy;
  },
  setMiscalcRate: function( misscalc ) {
    document.getElementById('misscalc').innerText = misscalc;
  },
  setTpRate: function( tprate ) {
    document.getElementById('tprate').innerText = tprate;
  },
  setFpRate: function( fprate ) {
    document.getElementById('fprate').innerText = fprate;
  },
  setSpecificity: function( specificity ) {
    document.getElementById('specificity').innerText = specificity;
  },
  setPrecision: function( precision ) {
    document.getElementById('precision').innerText = precision;
  },
  setPrevalence: function( prevalence ) {
    document.getElementById('prevalence').innerText = prevalence;
  }


  /*
  
    

    document.getElementById('predictButton').disabled = false;*/
};