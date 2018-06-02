const preprocessing = {
  getXArray: function( data ) {
    let retXArray = [];

    for( let i = 0; i < data.length ; i++ ) {
      let row = [];

      row.push( this.isSpain( data[i].Geography) );
      row.push( this.isGermany( data[i].Geography) );
      row.push( data[i].Age );
      row.push( data[i].Balance );
      row.push( data[i].CreditScore );
      row.push( data[i].EstimatedSalary );
      row.push( this.isMale( data[i].Gender) );
      row.push( data[i].HasCrCard );
      row.push( data[i].IsActiveMember );
      row.push( data[i].NumOfProducts );
      row.push( data[i].Tenure );
      
      retXArray.push(row);
    }

    return retXArray;
  },
  getYArray: function( data ) {
    let retYArray = [];

    for( let i = 0; i < data.length; i++ ) {
      retYArray.push( data[i].Exited );
    }

    return retYArray;
  },

  isSpain: (geo) => ( (geo === 'Spain') ? 1 : 0 ),
  isGermany: (geo) => ( (geo === 'Germany') ? 1 : 0 ),
  isMale: (gender) => ( ( gender === 'Male') ? 1 : 0 ),

  setFeatureStats: function( X, statColumns ) {
    preprocessing.featureStats = [];

    for( let i = 0; i < X[0].length ; i++ ) {

      let tempStats = {};

      if( statColumns[i] ) {
        tempStats.xbar = this.mean(X,i);
        tempStats.sigma = this.std(X,tempStats.xbar,i);
      } else {
        tempStats.xbar = 0;
        tempStats.sigma = 1;
      }

      preprocessing.featureStats.push( tempStats );
    }
  },
  mean: function( X, col) {
    let xbar = 0;

    for( let i = 0 ; i < X.length ; i++ ) {
      xbar == X[i][col];
    }

    return xbar/X.length;
  },
  std: function( X, mean, col ) {
    let sigma = 0;

    for( let i = 0 ; i < X.length ; i++ ) {
      sigma += Math.pow( (X[i][col] - mean), 2);
    }

    sigma /= X.length;

    return Math.sqrt(sigma);
  },

  getNormalisedX: function(X) {
    let scaledX = [];
    
    if( this.featureStats != undefined ) {
      if( X[0].length === undefined ) {
        for( let i = 0; i < X.length ; i++ ) {
          scaledX[i] = this.getNormalisedValue(X[i], i);
        }
      } else {
        for( let i = 0 ; i < X.length; i++ ) {
          let scaledRow = [];
          for( let j = 0; j < X[0].length; j++ ) {
            scaledRow[j] = this.getNormalisedValue(X[i][j], j);
          }

          scaledX.push(scaledRow);
        }
      }      
    } else {
      console.error('Feature stats not set : please run setFeatureStats(X,statColumns) first');
    }

    return scaledX;
  },
  getNormalisedValue: function( value, col ) {
    if( this.featureStats != undefined ) {
      return ( (value-this.featureStats[col].xbar)/this.featureStats[col].sigma );
    } else {
      console.error('Feature stats not set : please run setFeatureStats(X,statColumns) first');
    }
  },

  generateTestTrainSplit: function( data, trainPercentage ) {
    let n = data.length;

    let trainN = Math.floor(n*trainPercentage);

    let testN = n - trainN;

    let trainIndex = [];

    for( let i = 0; i < n ; i++ ) {
      trainIndex.push(i);
    }


    let testIndex = [];

    let currentIndex = 0;

    for( let j = 0; j < testN ; j++ ) {
      currentIndex = Math.floor( Math.random()*trainIndex.length);

      testIndex.push( currentIndex );
      trainIndex.splice( currentIndex, 1);
    }

    this.testTrainSplit = { test: testIndex, train: trainIndex };
  },

  getTrainX: function( X ) {

    let trainX = [];

    if( this.testTrainSplit != undefined ) {
      for( let i = 0; i < this.testTrainSplit.train.length ; i++ ) {
        trainX.push( X[this.testTrainSplit.train[i]] );
      }
    } else {
      console.error('Test Train Split not defined : Run generateTestTrainSplit( data, trainPercentage) first');
    }

    return trainX;
  },
  getTrainY: function( y ) {
    let trainY = [];

    if( this.testTrainSplit != undefined ) {
      for( let i = 0; i < this.testTrainSplit.train.length ; i++ ) {
        trainY.push( y[this.testTrainSplit.train[i]] );
      }
    } else {
      console.error('Test Train Split not defined : Run generateTestTrainSplit( data, trainPercentage) first');
    }

    return trainY;
  },
  getTestX: function( X ) {
    let testX = [];

    if( this.testTrainSplit != undefined ) {
      for( let i = 0; i < this.testTrainSplit.test.length ; i++ ) {
        testX.push( X[this.testTrainSplit.test[i]] );
      }
    } else {
      console.error('Test Train Split not defined : Run generateTestTrainSplit( data, trainPercentage) first');
    }

    return testX;
  },
  getTestY: function( y ) {
    let testY = [];

    if( this.testTrainSplit != undefined ) {
      for( let i = 0; i < this.testTrainSplit.test.length ; i++ ) {
        testY.push( y[this.testTrainSplit.test[i]] );
      }
    } else {
      console.error('Test Train Split not defined : Run generateTestTrainSplit( data, trainPercentage) first');
    }

    return testY;
  },

  getXTensor: function( X ) {
    return tf.tensor2d( this.getNormalisedX(X) );
  },
  getYTensor: function( y ) {
    return tf.tensor1d( y );
  }
};