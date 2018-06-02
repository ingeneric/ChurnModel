const data = JSON.parse( rawData );
const statColumns = [false, false, true, true, true, true, false, false, false, true, true];
const MODEL_NAME = 'churnModel';

ui.createLossPlot();
ui.createAccPlot();

const X = preprocessing.getXArray(data);
const y = preprocessing.getYArray(data);

let updateRate = 10;


document.getElementById('predictButton').addEventListener( 'click', (e) => {
  e.preventDefault();
  ui.showPrediction( 'test' );
})

document.getElementById('trainButton').addEventListener( 'click', (e) => {
  if( ui.validTrainingParameters() ) {
    console.log(Date.now());
    updateRate = ui.getUpdateRate();
    train();
  }
});

window.onresize = function() {
  Plotly.Plots.resize( ui.lossChart );
  Plotly.Plots.resize( ui.accChart );
}

async function train() {
  preprocessing.generateTestTrainSplit( data, ui.getTestTrainSplit() );
  preprocessing.setFeatureStats(X, statColumns)
  const trainX = preprocessing.getTrainX(X);
  const trainY = preprocessing.getTrainY(y);

  const trainXTensor = preprocessing.getXTensor( trainX );
  const trainYTensor = preprocessing.getYTensor( trainY );

  const model = tf.sequential();
  model.add( tf.layers.dense({ units: 6, inputDim : 11, kernelInitializer :'randomUniform', activation: 'relu'  }));
  model.add( tf.layers.dense({ units: 6, kernelInitializer: 'randomUniform', activation: 'relu'}) );
  model.add( tf.layers.dense({ units: 1, kernelInitializer: 'randomUniform', activation: 'sigmoid'}) );
  model.compile( { optimizer : 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] } );

  let batchCounter = 0;

  await model.fit( trainXTensor, trainYTensor,
  {
    batchSize: ui.getBatchSize(),
    epochs: ui.getEpochs(),
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        batchCounter++;
        ui.setLoss( logs.loss.toFixed(5) );
        ui.setAcc( logs.acc.toFixed(5) );
        ui.setBatchCount(batchCounter);

        if( ((batchCounter % updateRate) === 0) || batchCounter-1 == 0 ) {
          ui.lossX.push(batchCounter);
          ui.lossY.push(logs.loss);

          ui.accX.push(batchCounter);
          ui.accY.push(logs.acc);
          ui.plotLoss();
          ui.plotAcc();
        }
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        ui.setEpoch( epoch+1);
        await tf.nextFrame();
      },
      onTrainEnd: async () => {   
        const saveResults = await model.save('localstorage://' + MODEL_NAME);        
      }
    }
  });

  
  test();
}

async function test() {
  console.log("Running test");
  const testModel = await tf.loadModel('localstorage://' + MODEL_NAME);
  
  tf.tidy( function() {
    const yTest = preprocessing.getYTensor( preprocessing.getTestY( y ) );
    const probabilities = testModel.predict( preprocessing.getXTensor( preprocessing.getTestX(X) ) );
    const classifications = probabilities.round().transpose();
    const sumT = classifications.add(yTest);


    const fpT = classifications.greater(yTest);
    const fnT = yTest.greater(classifications);
    const tnT = sumT.equal(tf.zerosLike(sumT));
    const tpT = sumT.equal(tf.onesLike(sumT).mul(tf.scalar(2)));

    const fp = fpT.sum();
    const fn = fnT.sum();
    const tn = tnT.sum();
    const tp = tpT.sum();


    const total = yTest.size;
    const actualYes = yTest.sum();
    const actualNo = total - actualYes.get();
    const predictedYes = classifications.sum();

    ui.setFP( fp.get() );
    ui.setFN( fn.get() );
    ui.setTN( tn.get() );
    ui.setTP( tp.get() );

    ui.setAccuracy(((tp.get() + tn.get()) / total).toFixed(3));
    ui.setMiscalcRate(((fp.get() + fn.get()) / total).toFixed(3));
    ui.setTpRate((tp.get() / actualYes.get()).toFixed(3));
    ui.setFpRate((fp.get() / actualNo).toFixed(3));
    ui.setSpecificity((tp.get() / actualNo).toFixed(3));
    ui.setPrecision((tp.get() / predictedYes.get()).toFixed(3));
    ui.setPrevalence((actualYes.get() / total).toFixed(3));
  });

  console.log(Date.now());  
}