'use strict';

/**
 * @ngdoc function
 * @name codeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the codeApp
 */
angular.module('codeApp')
  .controller('PlotCtrl', function ($scope, $mdToast, $mdSidenav, $mdExpansionPanel, $mdExpansionPanelGroup,
                                    $anchorScroll, $window, $mdDialog, datagenerationservice, propertyservice,
                                    plotguideservice) {

    let SCOPE = $scope;

    /** stores information about the database schema */
    $scope.schema = [];

    /** The overall title of the plot. */
    $scope.titleOfThePlot = "Title of the plot";

    /** The name / label of the distribution which is on top. */
    $scope.nameOfTopDistribution = "Group A";

    /** The name / label of the distribution which is the bottom. */
    $scope.nameOfBottomDistribution = "Group B";

    /** The distribution for the top; init with some example. */
    $scope.inputDistributionTop = "3, 4, 1, 4, 2, 1, 2, 1, 2, 3, 1, 5, 4, 1, 4, 4, 6, 4, 1, 1, 2, 1, 1, 4, 2, 4, 4, 3, 2, 2, 1, 3, 3, 2, 2, 1, 4, 2, 3, 2, 2, 6, 2, 3, 3, 2, 2, 3, 3, 1, 2, 4, 5, 2, 1, 1, 3, 2, 1, 1, 1, 4, 5, 6, 3, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 2, 5, 1, 2, 4, 2, 3, 2, 1, 5, 2, 1, 3, 2, 2, 2, 4, 1, 1, 2, 4, 1, 1, 1, 4, 4, 2, 2, 3, 2, 1, 2, 2, 3, 4, 4, 3, 3, 2, 2, 3, 2, 2, 2, 6, 5, 1, 2, 2, 1, 1, 4, 2, 2, 2, 4, 1, 2, 2, 4, 1, 3, 1, 1, 1, 2, 1, 2, 4, 2, 1, 2, 2, 2, 3, 4, 3, 2, 4, 2, 1, 1, 2, 4, 3, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 4, 4, 6, 3, 2, 2, 1, 1, 2, 4, 2, 2, 1, 1, 2, 4, 2, 2, 4, 1, 2, 4, 1, 1, 1, 2, 3, 3, 2, 2, 3, 1, 2, 2, 2, 1, 2, 4, 1, 6, 1, 1, 2, 3, 3, 4, 2, 3, 5, 1, 4, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 3, 1, 2, 2, 3, 1, 1, 1, 4, 1, 2, 2, 4, 2, 2, 4, 4, 2, 5, 2, 1, 2, 1, 2, 3, 3, 1, 3, 3, 2, 1, 2, 2, 3, 2, 4, 1, 1, 1, 1, 1, 1, 3, 3, 1, 6, 2, 3, 3, 1, 4, 3, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 2, 2, 4, 1, 1, 1, 5, 2, 5, 2, 4, 3, 4, 2, 4, 3, 1, 3, 1, 1, 3, 1, 2, 3, 4, 5, 4, 4, 1, 5, 4, 2, 1, 3, 3, 1, 2, 1, 1, 2, 4, 1, 2, 1, 2, 1, 2, 2, 2, 2, 3, 2, 1, 2, 2, 3, 1, 2, 1, 2, 2, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 2, 2, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 3, 2, 2, 2, 1, 1, 2, 1, 1, 1, 4, 2, 1, 1, 2, 1, 1, 3, 1, 1, 2, 3, 2, 2, 2, 2, 2, 7, 1, 5";
    //
    /** The distribution for the bottom; init with some example. */
    $scope.inputDistributionBottom = "2, 1, 6, 1, 3, 2, 4, 7, 4, 6, 5, 3, 3, 4, 4, 2, 4, 1, 2, 2, 5, 2, 3, 2, 3, 4, 1, 1, 3, 5, 2, 4, 3, 3, 2, 5, 3, 2, 2, 1, 4, 4, 6, 3, 4, 4, 5, 3, 5, 1, 4, 2, 2, 4, 3, 5, 2, 3, 2, 3, 1, 5, 2, 2, 7, 2, 2, 4, 3, 2, 4, 4, 2, 2, 2, 2, 3, 3, 2, 7, 2, 4, 2, 2, 4, 4, 2, 3, 5, 2, 2, 1, 2, 3, 4, 7, 2, 3, 2, 1, 5, 3, 2, 2, 2, 2, 2, 6, 5, 4, 2, 3, 1, 5, 1, 5, 4, 4, 4, 7, 7, 3, 2, 4, 1, 4, 1, 2, 4, 5, 1, 2, 1, 6, 5, 1, 7, 2, 4, 5, 3, 2, 2, 2, 1, 1, 1, 6, 1, 1, 1, 2, 2";


    /** Visualization Properties: General, Histogram and Density**/
    $scope.properties = propertyservice.getDefaultProperties(); // {

    /** The actual distribution, parsed from the GUI.*/
    $scope.distributionTop = undefined;

    /** The actual distribution, parsed from the GUI.*/
    $scope.distributionBottom = undefined;

    /** All data related to uploading csv file and the result in JSON. */
    $scope.csv = {accept: '.csv', columnNames: [], separator: ';', content: ''};

    /** Selected Column Index for top & bottom distribution data **/
    $scope.selectedColIndex = {};

    /** Selected column data and filter values for filtering column data using filter values **/
    $scope.selectedColFilter = {};

    /** Selected column data and filter values for filtering column data using filter values for binning all columns **/
    $scope.selectedColBin = {};

    /** Property to watch which item in Navbar is currently selected **/
    $scope.currentNavItem = 'database';

    /** Property to watch which item in Upload CSV sub navigation is currently selected **/
    $scope.uploadCsvNavItem = 'colSelect';

    /** For speed dial to download visualization**/
    $scope.downloadVizIsOpen = false;

    /** Html div id which contains the visualization **/
    $scope.vizId = '#vplot';

    /** URL to create for exporting fonts and styles **/
    $scope.url = '';

    /** To hold the JSON file after importing. Array is required by the bower library. **/
    $scope.files = [];

    /** All panel names **/
    $scope.panels = ['defaultLayouts', 'generalProp', 'histogramProp', 'densityProp', 'styleAndFonts', 'statisticProp'];

    /** For collapsing all panels except the active one **/
    $scope.panelClickedName = 'defaultLayouts';

    /** Default layout information **/
    $scope.layouts = [
      {
        thumbnail: 'images/only_hist.png',
        title: 'Only Histogram',
        properties: {
          showDensityShape: false,
          showDifferenceDensityShape: false,
          showHistograms: true,
          showDifferenceHistogram: false
        }
      },
      {
        thumbnail: 'images/both_hist.png',
        title: 'Histogram + Diff. Histogram',
        properties: {
          showDensityShape: false,
          showDifferenceDensityShape: false,
          showHistograms: true,
          showDifferenceHistogram: true
        }
      },
      {
        thumbnail: 'images/only_den.png',
        title: 'Only Density',
        properties: {
          showDensityShape: true,
          showDifferenceDensityShape: false,
          showHistograms: false,
          showDifferenceHistogram: false
        }
      },
      {
        thumbnail: 'images/both_den.png',
        title: 'Density + Diff. Density',
        properties: {
          showDensityShape: true,
          showDifferenceDensityShape: true,
          showHistograms: false,
          showDifferenceHistogram: false
        }
      },
      {
        thumbnail: 'images/hist_den.png',
        title: 'Histogram + Density',
        properties: {
          showDensityShape: true,
          showDifferenceDensityShape: false,
          showHistograms: true,
          showDifferenceHistogram: false
        }
      },
      {
        thumbnail: 'images/hist_diffDen.png',
        title: 'Histogram + Diff. Density',
        properties: {
          showDensityShape: false,
          showDifferenceDensityShape: true,
          showHistograms: true,
          showDifferenceHistogram: false
        }
      },
      {
        thumbnail: 'images/both_hist_den.png',
        title: 'Both Histogram + Density',
        properties: {
          showDensityShape: true,
          showDifferenceDensityShape: false,
          showHistograms: true,
          showDifferenceHistogram: true
        }
      },
      {
        thumbnail: 'images/both_hist_diffDen.png',
        title: 'Both Histogram + Diff. Density',
        properties: {
          showDensityShape: false,
          showDifferenceDensityShape: true,
          showHistograms: true,
          showDifferenceHistogram: true
        }
      }
    ];

    /** To keep track if top or bottom distribution has decimal numbers **/
    $scope.isDecimal = {top: false, bottom: false};

    /** This value will be true automatically when either top or bottom distribution contains decimal**/
    $scope.continuous = false;

    /** The number of bins for the histogram (only relevant if $scope.continuous is selected. */
    $scope.numOfBins = 10;

    /******* Design Guide for V-Plot Variables *****/
    $scope.plot = {

      /*Type of the Layout*/
      layoutType: 'squared',

      /* Data Type */
      dataType: 'discrete',

      /* Binning */
      binning: false,

      /* Colorful or Black and White */
      isColorful: 'colorful',

      /* Local Analysis Tasks */
      local: false,
      l1: 'not-relevant',
      l2: 'not-relevant',
      l3: 'not-relevant',
      l4: 'not-relevant',
      l5: 'not-relevant',

      /* Aggregation Analysis Tasks */
      aggregation: false,
      statistic: 'mean-std',
      a1: 'not-relevant',
      a2: 'not-relevant',
      a3: 'not-relevant',

      /* Global Analysis Tasks */
      global: false,
      g1: 'not-relevant',
      g2: 'not-relevant',
      g3: 'not-relevant',
      g4: 'not-relevant',
      g5: 'not-relevant'

    };

    /*Type of the plot */
    $scope.plotType = 'v-plot';

    /* Ratio settings */
    $scope.ratio = false;

    /* Space settings */
    $scope.space = false;

    /* Data Type */
    $scope.dataType = undefined;

    /* Binning */
    $scope.binning = false;

    /* Colorful or Black and White */
    $scope.isColorful = 'colorful';

    /* Local Analysis Tasks */
    $scope.local = true;
    $scope.l1 = 'relevant';
    $scope.l2 = 'relevant';
    $scope.l3 = 'relevant';
    $scope.l4 = 'relevant';
    $scope.l5 = 'relevant';

    /* Aggregation Analysis Tasks */
    $scope.aggregation = true;
    $scope.meanMedian = undefined;
    $scope.stdSettings = undefined;
    $scope.compareMean = undefined;
    $scope.compareStd = undefined;

    /* Global Analysis Tasks */
    $scope.global = true;
    $scope.g1 = undefined;
    $scope.g2 = undefined;
    $scope.g3 = undefined;
    $scope.g4 = undefined;
    $scope.g5 = undefined;

    // @TS: Helper methods and constants
    const NUMERIC_TYPES = ['integer', 'smallint', 'numeric', 'bigint', 'double'];

    const isNumericDatatype = (t) => {
      const idx = NUMERIC_TYPES.findIndex(nt => t.toLowerCase().startsWith(nt.toLowerCase()));

      return idx >= 0;
    };

    const isNumeric = (n) => {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    const isInteger = (value) => {
      const _isInteger = (_value) => {
        if (typeof _value === 'number') {
          return _value % 1 === 0;
        }
        return false;
      };

      if(Array.isArray(value) && value.length > 0) {
        return value.reduce((acc, cur) => acc && _isInteger(cur), true)
      }

      return _isInteger(value);
    };

    /**
     * Watch for changes in the properties.
     * Store previous steps so that the user can undo the changes.
     */
    $scope.$watch('properties', function () {
      propertyservice.addPreviousProperties($scope.properties);
    }, true);


    /** Modify the grid once it is changed on the GUI.*/
    $scope.$watch('properties.gridGranularity', function () {

      if ($scope.properties.gridGranularity == 0.2) {
        $scope.properties.grid = [0.2, 0.4, 0.6, 0.8, 1.0];

      } else if ($scope.properties.gridGranularity == 0.1) {
        $scope.properties.grid = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

      } else if ($scope.properties.gridGranularity == 0.05) {
        let grid = [];
        let value = 0.05;
        for (let i = 0; value <= 1.0; i++) {
          grid.push(value);
          value += 0.05;
        }
        $scope.properties.grid = grid;

      } else if ($scope.properties.gridGranularity == 0.01) {
        let grid = [];
        let value = 0.01;
        for (let i = 0; value <= 1.0; i++) {
          grid.push(value);
          value += 0.01;
        }
        $scope.properties.grid = grid;

      } else {
        console.log("ERROR changing grid granularity", $scope.properties.gridGranularity);
      }
    });

    $scope.onMouseOverColFn = function (e, column) {
      if (isNumericDatatype(column.data_type)) {
        d3.select(e.currentTarget).style('cursor', 'pointer')
        if ((e.clientX - e.currentTarget.offsetLeft) < e.currentTarget.getBoundingClientRect().width / 2) {
          d3.select(e.currentTarget).style('background', 'rgba(31, 97, 141, 0.5)')
        } else {
          d3.select(e.currentTarget).style('background', 'rgba(146, 43, 33, 0.5)')
        }
      } else {
        d3.select(e.currentTarget).style('cursor', 'not-allowed')
      }
    }

    $scope.onMouseOutColFn = function (e, column) {
      d3.select(e.currentTarget).style('background', $scope.colorColFn(column))
    }

    $scope.colorColFn = function (column) {
      if (isNumericDatatype(column.data_type)) {
        return "rgba(2,155,92, 0.5)";
      }
      else if (column.data_type.toLowerCase().startsWith("recordtype")) {
        return "rgba(97,121,247, 0.2)";
      }
      else if (column.data_type.toLowerCase().startsWith("varchar")) {
        return "rgba(173,83,70, 0.2)"
      }
      else if (column.data_type.toLowerCase().startsWith("boolean")) {
        return "rgba(59,71,82, 0.2)"
      }

      return "white";
    }

    /** Communication with the backend to get data from the database */
    $scope.dbColumnAsVPlot = function (e, table, column) {
      e.preventDefault();

      //only fetch data if datatype is numerical
      if (isNumericDatatype(column.data_type)) {

        $scope.titleOfThePlot = table;

        getDatafromDB({table: table, columns: [column.column_name]}).then(data => {
          // Convert list of key-value-pairs to list of numerical values
          const values = data.map(e => e[column.column_name]);
          const distribution = values.filter(v => isNumeric(v));

          const datastring = distribution.join(",");

          //set top or botton distribution according to mouse position
          if ((e.clientX - e.currentTarget.offsetLeft) < e.currentTarget.getBoundingClientRect().width / 2) {
            $scope.distributionTop = parseDistribution(datastring, 'top');
            $scope.nameOfTopDistribution = column.column_name;
            d3.selectAll('.activeTopDist').classed('activeTopDist', false)
            d3.select(e.currentTarget).classed('activeTopDist', true)
          } else {
            $scope.nameOfBottomDistribution = column.column_name;
            $scope.distributionBottom = parseDistribution(datastring, 'bottom');
            d3.selectAll('.activeBottomDist').classed('activeBottomDist', false)
            d3.select(e.currentTarget).classed('activeBottomDist', true)
          }
          $scope.$applyAsync()
        })
      }
    }

    /** Communication with the backend to get data from the database */
    async function getDatafromDB(data) {
      const response = await fetch('http://diascld32.iccluster.epfl.ch:3001/table', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.assign({proteus: true, maxRows: 500}, data))
      });
      return response.json();
    }

    /**
     * Get all tablenames and columns from the database.
     * Columns from tables are selectable as datasource.
     */
    async function getTablesfromDB() {
      const response = await fetch('http://diascld32.iccluster.epfl.ch:3001/schema', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({proteus: true})
      });
      return response.json();
    };


    /**
     * Parse the distribution string to identify if it is an array of signed integers or decimals.
     * A single decimal value classifies the entire distribution string to decimal.
     * Accordingly set the top or bottom to be decimal.
     * If either top or bottom distribution is decimal, automatically set $scope.continuous to be true
     *
     * @param distributionString the input string
     * @param identifier whether the passed distribution string is 'top' or 'bottom'
     * @return a valid array of numbers.
     */
    function parseDistribution(distributionString, identifier) {
      distributionString = distributionString.replace(' ', '');
      let allItems = distributionString.split(',');
      let allInvalidItems = [];
      let isDecimal = false;
      let intFormat = /^\s*([-]?\d+(\s*,\s*[-]?\d+)*)?\s*$/;

      for (let i = 0; i < allItems.length; i++) {
        if (allItems[i] % 1 !== 0)
          isDecimal = true;
        else if (!intFormat.test(allItems[i]))
          allInvalidItems.push(allItems[i].trim());
      }

      if (allInvalidItems.length === 0) {
        if (isDecimal) {
          if (identifier === 'top')
            $scope.isDecimal.top = true;
          else
            $scope.isDecimal.bottom = true;
        } else {
          if (identifier === 'top')
            $scope.isDecimal.top = false;
          else
            $scope.isDecimal.bottom = false;
        }

        if ($scope.isDecimal.top || $scope.isDecimal.bottom)
         $scope.continuous = true;

        return JSON.parse("[" + distributionString + "]");
      } else {
        if (identifier === 'top')
          $scope.showErrorToast('"' + $scope.nameOfTopDistribution + '" column contains non-numerical character(s): ' + allInvalidItems);
        else
          $scope.showErrorToast('"' + $scope.nameOfBottomDistribution + '" column contains non-numerical character(s): ' + allInvalidItems);
      }
    }

    /**
     * Check if the variable is JSON or not.
     * @param item the variable to check for correctness.
     * @returns {boolean} true - if JSON, false otherwise
     */
    function isJson(item) {
      item = typeof item !== "string" ? JSON.stringify(item) : item;
      try {
        item = JSON.parse(item);
      } catch (e) {
        return false;
      }
      return typeof item === "object" && item !== null;
    }


    /** Init the data, e.g., parse the distributions from the view etc. */
    function init() {

      // parse the distribution from the gui.
      $scope.distributionTop = parseDistribution($scope.inputDistributionTop, 'top');
      $scope.distributionBottom = parseDistribution($scope.inputDistributionBottom, 'bottom');
      $mdExpansionPanel().waitFor('defaultLayouts').then(function (instance) {
        instance.expand();
      });


      getTablesfromDB().then(data => {
        console.log("data here", data);
        $scope.schema = data;
      });
    }

    init();

    /**
     * For showing any messages via toast
     */
    $scope.showErrorToast = function (message) {
      $scope.toastPromise = $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position('top right')
          .action('Close')
          .hideDelay(0)
          .parent(document.getElementById('toast-container'))
          .theme('error-toast')
      ).then(function () {
        $mdToast.hide();
      });
    };

    /**
     * Once the user resets the properties on the GUI
     * */
    $scope.loadDefaultProperties = function (event) {
      $scope.properties = propertyservice.getDefaultProperties();
    };

    /**
     * Function to toggle side nav with component id of the side nav.
     */
    $scope.toggleSideNav = function (componentId) {
      return $mdSidenav(componentId).toggle();
    };

    /**
     * Update the Viz properties once a user chooses from default layout.
     */
    $scope.changeLayout = function (layout) {
      Object.keys(layout.properties).filter(function (k) {
        $scope.properties[k] = layout.properties[k];
      })
    };

    /**
     * Undo the last change. Fixme: except for color it is working properly.
     * @param event
     */
    $scope.undoLastChange = function (event) {
      $scope.properties = propertyservice.getPreviousProperty();
    };

    /**
     * Scroll to particular element on page. Used to get to top of side nav when opened.
     * @param id the id of HTML element
     */
    $scope.scrollTo = function (id) {
      $anchorScroll(id);
    };

    /**
     * Filename for saving the visualization. Removes all special characters from title of plot and replaces space with underscore.
     * If title of plot is empty, returns predefined file name.
     * @returns {string} Formatted filename
     */
    $scope.filename = function () {
      return $scope.titleOfThePlot.length > 0 ? $scope.titleOfThePlot.replace(/[^a-zA-Z0-9 ]/gi, '').replace(/[ ]/gi, '_') : 'Histogram_Visualization';
    };

    /**
     * Convert the JS variable into BLOB data and present it as URL to download the file
     * @param style the JS variable content
     */
    $scope.exportStyleAndFonts = function (style) {
      style = JSON.stringify(style, null, 4);
      let blob = new Blob([style], {type: 'text/plain'});
      $scope.url = ($window.URL || $window.webkitURL).createObjectURL(blob);
    };

    /**
     * Loads and reads the JSON file from the data url passed by the lf-ng-md-file-input
     */
    $scope.importFileSelected = function () {
      if ($scope.files.length > 0) {
        //Use XHR request to fetch the blob url and convert into readable text.
        let xhr = new XMLHttpRequest;
        xhr.responseType = 'blob';

        xhr.onload = function () {
          let recoveredBlob = xhr.response;
          let reader = new FileReader();
          //Convert Blob to plain text
          reader.onload = function (e) {
            if (isJson(e.target.result)) {
              $scope.properties = angular.fromJson(e.target.result);
              $scope.$digest();
            } else
              $scope.showErrorToast('Invalid JSON!');
          };
          reader.readAsText(recoveredBlob);
        };
        xhr.open('GET', $scope.files[0].lfDataUrl);
        xhr.send();
      }
    };

    /**
     * Callback function after the uploaded csv file has been parsed to JSON.
     */
    $scope.fileParsed = function () {
      //actual file content: $scope.csv.content
      //json parsed result: $scope.csv.result
      //column names: csv.columnNames
      $scope.selectedColIndex = {};
      $scope.csv.columnNames = Object.keys($scope.csv.result[0]).map(function (val) {
        return $scope.csv.result[0][val];
      });

      $scope.inputDistributionTop = '';
      $scope.inputDistributionBottom = '';

      $scope.$digest();
    };

    /**
     * Called when user selects a column extracted from csv file.
     * The column data is then parsed to comma separated integers.
     * Missing values, if any are set.
     * If column is filter col, only distinct values are parsed.
     * If column is data col, all values including missing values are parsed.
     */
    $scope.colSelect = function (distribution) {
      let index;

      if (distribution === 'top')
        index = $scope.selectedColIndex.top;
      else if (distribution === 'bottom')
        index = $scope.selectedColIndex.bottom;
      else if (distribution === 'filter')
        index = $scope.selectedColIndex.filter;
      else if (distribution === 'filterBin')
        index = $scope.selectedColIndex.filterBin;

      let parsedVal = $scope.parseCsvValuesForCol(index);

      //Set the distribution variables. This will trigger the watchers. Also set the missing values.
      if (distribution === 'top') {
        $scope.selectedColIndex.topValues = parsedVal.totalValues;
        $scope.selectedColIndex.topMissingValues = parsedVal.missingValues;
        $scope.inputDistributionTop = parsedVal.parsedData;
      } else if (distribution === 'bottom') {
        $scope.selectedColIndex.bottomValues = parsedVal.totalValues;
        $scope.selectedColIndex.bottomMissingValues = parsedVal.missingValues;
        $scope.inputDistributionBottom = parsedVal.parsedData;
      } else if (distribution === 'filter') {
        $scope.selectedColFilter.filterValues = parsedVal.parsedData.split(',').filter(function (item, index, array) {
          return array.indexOf(item) === index;
        });
      } else if (distribution === 'filterBin') {
        $scope.selectedColBin.filterValues = parsedVal.parsedData.split(',').filter(function (item, index, array) {
          return array.indexOf(item) === index;
        });
      }
    };

    /**
     * General function to extract values from parsed csv file and also identify missing values.
     * @param index the column index that needs to be parsed
     * @returns {{parsedData: string, missingValues: number, totalValues: number}}
     */
    $scope.parseCsvValuesForCol = function (index) {
      let counter = 0;
      let data = {
        parsedData: '',
        missingValues: 0,
        totalValues: 0
      };
      //Extract values from csv.result and parse in comma separated integers for that column
      for (let i = 1; i < $scope.csv.result.length; i++) {   // TODO check, here was length - 1

        if ($scope.csv.result[i][index]) {
          data.parsedData += $scope.csv.result[i][index] + ',';
          data.totalValues += counter + 1;
          data.missingValues += counter;
          counter = 0;
        } else
          counter++;
      }
      //Trim the last character if it is comma
      if (data.parsedData.slice(-1) === ',')
        data.parsedData = data.parsedData.slice(0, -1);
      return data;
    };

    /**
     * From the selected column as data, choose only the values which match the filter values in
     * the $scope.selectedColFilter.filterValues
     * @param filterVal the value to filter
     * @param distribution the distribution to set after applying filter
     */
    $scope.filterSelect = function (distribution) {
      let filterVal = distribution === 'top' ? $scope.selectedColFilter.topFilter : $scope.selectedColFilter.bottomFilter;
      let dataIndex = $scope.selectedColIndex.data;
      let filterIndex = $scope.selectedColIndex.filter;
      let parsedData = '';
      for (let i = 1; i < $scope.csv.result.length; i++) {     // TODO check, here was length - 1
        if ($scope.csv.result[i][filterIndex] === filterVal && $scope.csv.result[i][dataIndex])
          parsedData += $scope.csv.result[i][dataIndex] + ',';
      }
      if (parsedData.slice(-1) === ',')
        parsedData = parsedData.slice(0, -1);

      if (distribution === 'top') {
        $scope.inputDistributionTop = parsedData;
      } else {
        $scope.inputDistributionBottom = parsedData;
      }
    };

    /**
     * Filter all columns based on selected filter value and calculate the height for each column
     * @param distribution the selected filter is for the top or the bottom distribution.
     */
    $scope.filterBinSelect = function (distribution) {
      let filterVal = distribution === 'top' ? $scope.selectedColBin.topFilterBin : $scope.selectedColBin.bottomFilterBin;
      let filterIndex = $scope.selectedColIndex.filterBin;
      let bins = [];
      let totalFilterValRows = 0;

      // Check if the selected filter value is set in any of the rows in entire data set except for the filter column.
      let filterValInData = $scope.csv.result.filter(function (row) {
        return row[0].split($scope.csv.separator).filter(rowVal => rowVal === filterVal).length > 1;
      });

      for (let i = 0; i < $scope.csv.result.length; i++) {   // TODO check, here was length - 1
        let rows = Object.keys($scope.csv.result[i]).map(function (val) {
          return $scope.csv.result[i][val];
        });

        for (let j = 0; j < rows.length; j++) {
          // For 0th row, we initialize an object for each column by extracting the column names
          if (i === 0 && j !== filterIndex) {
            bins[j] = {
              colName: rows[j],
              parsedData: '',
              height: 0
            };
          } else {
            // If the row matches the selected filter value
            if (j !== filterIndex && rows[j] && rows[filterIndex] === filterVal && bins[j]) {
              totalFilterValRows++;
              if (rows[j] === filterVal)
                bins[j].parsedData += rows[j] + ',';
              // If the row val is not an item of filter column and it does not exist in any row of entire data set
              else if ($scope.selectedColBin.filterValues.indexOf(rows[j]) === -1 && filterValInData.length === 0)
                bins[j].parsedData += rows[j] + ',';
            }
          }
        }
      }

      // Remove the bin with filter column
      bins.splice(filterIndex, 1);
      // Calculate the height for each bin
      for (let i = 0; i < bins.length; i++) {
        if (bins[i].parsedData.slice(-1) === ',')
          bins[i].parsedData = bins[i].parsedData.slice(0, -1);
        bins[i].height = (bins[i].parsedData.split(',').length / totalFilterValRows).toPrecision(3);
      }

      // 'bins' contain the binned columns based on the selected filter value. Currently, just returning the value and
      // not set anywhere. Use this variable for visualization.
      return bins;
    };

    /**
     * Watches for changes on variables that create histogram. On any change, it updates the visualization.
     */
    $scope.$watchGroup(['inputDistributionTop', 'inputDistributionBottom'], function (newValue, oldValue) {
      let returnVal = '';
      if (newValue[0] !== oldValue[0]) {
        returnVal = parseDistribution(newValue[0], 'top');
        if (returnVal !== undefined && returnVal.length >= 0) {
          $scope.distributionTop = returnVal;
        }
      }

      if (newValue[1] !== oldValue[1]) {
        returnVal = parseDistribution(newValue[1], 'bottom');
        if (returnVal !== undefined && returnVal.length >= 0) {
          $scope.distributionBottom = returnVal;
        }
      }
    });

    /**
     * Update the Viz when data source or filter is changed for Select Column and Filter option
     */
    $scope.$watchGroup(['selectedColIndex.data', 'selectedColIndex.filter'], function (newValue, oldValue) {
      if (newValue[0] !== oldValue[0] || newValue[1] !== oldValue[1]) {
        if ($scope.selectedColFilter.topFilter !== undefined)
          $scope.filterSelect('top');
        if ($scope.selectedColFilter.bottomFilter !== undefined)
          $scope.filterSelect('bottom');
      }
    });

    /**
     * Once a file is uploaded, automatically detect the separator and update the value.
     */
    $scope.$watch('csv.content', function (newValue, oldValue) {
      let firstRow = $scope.csv.content.split("\n")[0];
      let commaCount = firstRow.split(",").length;
      let semicolonCount = firstRow.split(";").length;
      let tabCount = firstRow.split("\t").length;

      if (semicolonCount > commaCount && semicolonCount > tabCount)
        $scope.csv.separator = ";";
      else if (tabCount > commaCount && tabCount > semicolonCount)
        $scope.csv.separator = "\t";
      else
        $scope.csv.separator = ",";
    });

    /**
     * Called when an expansion panel is clicked. This updates the panelClickedName var and $watcher is fired.
     * @param panelClicked the name of the clicked panel
     */
    $scope.panelClicked = function (panelClicked) {
      $scope.panelClickedName = panelClicked;
    };

    /**
     * First check if the expansion panel has been initialized and then register the $watcher for clicked panel name.
     */
    $mdExpansionPanelGroup().waitFor('vizProp').then(function () {
      $scope.$watch('panelClickedName', function (newVal, oldVal) {
        $scope.panels.forEach(function (panelName) {
          if (newVal !== panelName)
            $mdExpansionPanel(panelName).collapse();
        });
      });
    });


    /**
     * Shows the dialog containing information about the format of dataset that needs to be uploaded for each of the
     * 3 options in 'Upload CSV' section i.e. SELECT COLUMNS, SELECT COLUMNS AND FILTER, and EACH COLUMN A BIN.
     * @param event the dialog event
     * @param dialogTemplate which template to open.
     */
    $scope.showDataSetInfoDialog = function (event, dialogTemplate) {
      $mdDialog.show({
        controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function () {
            $mdDialog.hide();
          }
        },
        templateUrl: dialogTemplate,
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: false
      });
    };

    /**
     * Shows a dialog with alternative representations / visualizations to compare v-plots with.
     * @param event the dialog event
     */
    $scope.showAlternativeVisualizationsDialog = function (event) {

      // shallow copy
      let properties = _.clone($scope.properties);
      properties.distributionTop = $scope.distributionTop;
      properties.distributionBottom = $scope.distributionBottom;

      $mdDialog.show({
        controller: function DialogController($scope, $mdDialog, $timeout, alternativevisservice, properties) {

          $scope.closeDialog = function () {
            $mdDialog.hide();
          };

          $timeout(function () {

            // delete previous
            alternativevisservice.clearAll();

            // make a continuous version of the data
            properties = alternativevisservice.convertDistributionToContinuous(properties);

            // --------------------------------------------------------------------------------------------------
            // add alternatives for discrete distribution
            let svgElement = undefined;

            // factor to resize the charts in the preview.
            let scaleFactor = 0.6;

            svgElement = alternativevisservice.addElementToHistogram('v-plot');
            alternativevisservice.addVPlot(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToHistogram('Bar Charts');
            alternativevisservice.addDiscreteBarChartSeparate(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToHistogram('Broken Line Graph I');
            alternativevisservice.addDiscreteBarchartBrokenLine(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToHistogram('Grouped Bar Charts');
            alternativevisservice.addDiscreteBarchartGrouped(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToHistogram('Mirrored Bar Charts I');
            alternativevisservice.addDiscreteBarchartMirrored(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToHistogram('Mirrored Bar Charts II');
            alternativevisservice.addDiscreteBarchartMirroredRotated(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToHistogram('Stacked Bar Charts');
            alternativevisservice.addDiscreteBarchartStacked(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToHistogram('Cumulative Bar Charts');
            alternativevisservice.addDiscreteCumulativeBarchartGrouped(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");


            // --------------------------------------------------------------------------------------------------
            svgElement = alternativevisservice.addElementToShape('Density Distribution I');
            alternativevisservice.addContinuousDensityDistributionSeparate(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToShape('Density Distribution III');
            alternativevisservice.addContinuousDensityDistributionCombined(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToShape('Density Distribution II');
            alternativevisservice.addContinuousDensityDistributionSeparateRotated(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToShape('Cumulative Distribution');
            alternativevisservice.addContinuousDensityCumulativeCombined(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");


            svgElement = alternativevisservice.addElementToShape('Violin Plot');
            alternativevisservice.addContinuousViolinPlot(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToShape('Beanplot');
            alternativevisservice.addContinuousBeanPlot(svgElement, properties, true);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToShape('Split Violin Plot');
            alternativevisservice.addContinuousSplitViolinPlot(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToShape('Asymmetric Beanplot');
            alternativevisservice.addContinuousAsymmBeanPlot(svgElement, properties, true);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            // --------------------------------------------------------------------------------------------------


            svgElement = alternativevisservice.addElementToOther('Broken Line Graph II');
            alternativevisservice.addDiscreteBrokenLine(svgElement, properties);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToOther('Gradient Plot');
            alternativevisservice.addContinuousGradientSeparate(svgElement, properties, true);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");


            // --------------------------------------------------------------------------------------------------
            // add alternatives for continuous distribution
            // svgElement = alternativevisservice.addElementToContinuous('v-plot');
            // alternativevisservice.addVPlot(svgElement, properties, false);

            svgElement = alternativevisservice.addElementToStatistic('Box Plot');
            alternativevisservice.addContinuousBoxPlot(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");


            svgElement = alternativevisservice.addElementToStatistic('Error Bars I');
            alternativevisservice.addErrorBarsBar(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

            svgElement = alternativevisservice.addElementToStatistic('Error Bars II');
            alternativevisservice.addErrorBarsLine(svgElement, properties, false);
            svgElement.attr("transform", "scale(" + scaleFactor + ")");

          });

        },
        templateUrl: 'templates/template-alternative-visualizations.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: false,
        locals: {
          properties: properties
        }
      });
    };


    $scope.showNormalDistributionExample = function () {
      $scope.distributionBottom = datagenerationservice.getNormalDistribution(5, 1.5);
      //$scope.distributionTop = datagenerationservice.getNormalDistribution(5, 2.0);
      $scope.distributionTop = datagenerationservice.getNormalDistribution(4, 1.5);
    };

    $scope.showCumulativeNormalDistributionExample = function () {

      $scope.distributionBottom = datagenerationservice.getCumulativeNormalDistribution(0, 0.1);
      $scope.distributionTop = datagenerationservice.getCumulativeNormalDistribution(0, 10.0);

    };

    $scope.showEqualDistributionExample = function () {
      $scope.distributionBottom = datagenerationservice.getEqualDistribution();
      // $scope.distributionTop = datagenerationservice.getNormalDistribution(4, 1.5);
      $scope.distributionTop = datagenerationservice.getEqualDistribution();
    };

    $scope.showExponentialDistributionExample = function () {
      $scope.distributionBottom = datagenerationservice.getExponentialDistribution(1, true);
      $scope.distributionTop = datagenerationservice.getExponentialDistribution(1, false);
      // $scope.distributionTop = datagenerationservice.getExponentialDistribution(1.5, false);
    };

    $scope.showLogNormalDistributionExample = function () {
      $scope.distributionBottom = datagenerationservice.getLogNormalDistribution(0, 1.0, true);
      $scope.distributionTop = datagenerationservice.getLogNormalDistribution(0, 3.0, false);
      // $scope.distributionTop = datagenerationservice.getExponentialDistribution(1.5, false);
    };

    $scope.showMultiModalDistributionExample = function () {

      let left = [
        {'mu': 3, 'sigma': 1.0},
        {'mu': 7, 'sigma': 0.5},
      ];

      let right = [
        {'mu': 3, 'sigma': 0.5},
        {'mu': 7, 'sigma': 1.0}
      ];
      $scope.distributionBottom = datagenerationservice.getMultimodalDistribution(right);
      $scope.distributionTop = datagenerationservice.getMultimodalDistribution(left);
    };

    $scope.showSkewedDistributionExample = function () {
      $scope.distributionBottom = datagenerationservice.getSkewedNormalDistribution(5, 2.5, 3);
      // $scope.distributionTop = datagenerationservice.getSkewedDistribution(5, 2.5, -5);
      $scope.distributionTop = datagenerationservice.getNormalDistribution(5, 2.5);
      // $scope.distributionTop = datagenerationservice.getSkewedDistribution(5, 1.0, 1, false);
    };


    $scope.showEditPlot = function (event, parent) {

      // Load the default properties in the beginning, so that they fit to the wizard options.
      SCOPE.loadDefaultProperties();

      // shallow copy
      let properties = $scope.properties;
      properties.distributionTop = $scope.distributionTop;
      properties.distributionBottom = $scope.distributionBottom;

      let localDisabled = true;
      let globalDisabled = true;
      let aggregationDisabled = true;

      $mdDialog.show({
        controller: function DialogController($scope, $mdDialog, $timeout, alternativevisservice, properties, localScope) {

          // Load the default properties in the beginning, so that they fit to the wizard options.
          // SCOPE.loadDefaultProperties();

          $scope.closeDialog = function (data) {
            //callPreview(localScope.plotType);
            $mdDialog.hide();
          };


          $scope.onChange = function (data) {

            let defaultProp = propertyservice.getDefaultProperties();

            // ------------------------------------------------------------
            // Functions to determine relevance of a task
            const R = 'relevant';
            const NR = 'not-relevant';
            const VR = 'very-relevant';

            let relevant = function (task) {
              return task === R;
            };

            let notRelevant = function (task) {
              return task === NR;
            };

            let veryRelevant = function (task) {
              return task === VR;
            };

            let relevantOrVeryRelevant = function (task) {
              return task === R || task === VR;
            };

            // ------------------------------------------------------------
            // if a task group is disabled, then mark all underlying tasks as not-relevant.
            if (!data.local) {
              data.l1 = NR;
              data.l2 = NR;
              data.l3 = NR;
              data.l4 = NR;
              data.l5 = NR;
            }

            if (!data.global) {
              data.g1 = NR;
              data.g2 = NR;
              data.g3 = NR;
              data.g4 = NR;
              data.g5 = NR;
            }

            if (!data.aggregation) {
              data.a1 = NR;
              data.a2 = NR;
              data.a3 = NR;
            }

            // Check if local, aggregated, or global disabled.
            // This is true, if the task group is disabled, or if all tasks are set to non-relevant.
            localDisabled = !data.local || (notRelevant(data.l1) && notRelevant(data.l2) && notRelevant(data.l3) && notRelevant(data.l4) && notRelevant(data.l5));
            globalDisabled = !data.global || (notRelevant(data.g1) && notRelevant(data.g2) && notRelevant(data.g3) && notRelevant(data.g4) && notRelevant(data.g5));
            aggregationDisabled = !data.aggregation || (notRelevant(data.a1) && notRelevant(data.a2) && notRelevant(data.a3));


            // ------------ RULES I ---------------------------
            // User enables or disables task groups (show or remove statistic, density distribution, histograms)

            //Aggregated analysis tasks (enable / disable depending on task group is selected or not).
            SCOPE.properties.showStatistics = !aggregationDisabled;

            //Global analysis tasks
            SCOPE.properties.showDensityShape = !globalDisabled;
            SCOPE.properties.showDifferenceDensityShape = false;

            // Local analysis tasks
            SCOPE.properties.showHistograms = !localDisabled;
            SCOPE.properties.showDifferenceHistogram = !localDisabled;


            // ------------ RULES LOCAL TASKS ------------------
            // User adjusts local tasks --> primarily influence histogram, difference histogram, and the grid.

            // ----
            // Identification (L1) or comparison task very relevant --> increase opacity; otherwise default.
            if (veryRelevant(data.l1) || veryRelevant(data.l2) || veryRelevant(data.l3)) {
              SCOPE.properties.colorHistogramOpacity = 0.9;
            } else if (relevant(data.l1) || relevant(data.l2) || relevant(data.l3) || relevant(data.l4) || relevant(data.l5)) {
              SCOPE.properties.colorHistogramOpacity = defaultProp.colorHistogramOpacity;
            }

            // ----
            // L4 (compare frequencies across distributions) or L5 (identify largest and smallest distribution) very relevant -> increase opacity
            if (veryRelevant(data.l4) || veryRelevant(data.l5)) {
              SCOPE.properties.colorInnerHistogramOpacity = 0.95;
            } else if (relevant(data.l4) || relevant(data.l5)) {
              SCOPE.properties.colorInnerHistogramOpacity = defaultProp.colorInnerHistogramOpacity;
            } else if (notRelevant(data.l4) || notRelevant(data.l5)) {
              SCOPE.properties.showDifferenceHistogram = false;
            }

            // ----
            // L1 very important: add percentage to the bins. Remove grid, if not enables.
            if (notRelevant(data.l1)) {
              SCOPE.properties.showGrid = false;
              SCOPE.properties.showLabelHeightInPercentage = false;
            } else if (relevant(data.l1)) {
              SCOPE.properties.showGrid = true;
              SCOPE.properties.showLabelHeightInPercentage = false;
            } else if (veryRelevant(data.l1)) {
              SCOPE.properties.showGrid = true;
              SCOPE.properties.showLabelHeightInPercentage = true;
            }


            // ------------ RULES AGGREGATED TASKS ---------------

            // ----
            // statistic in foreground, if both are very relevant
            SCOPE.properties.statisticInForeground = (veryRelevant(data.a2) || veryRelevant(data.a3));

            // ----
            // Compare means / medians
            // Relevant --> draw line (a bit opacity)
            SCOPE.properties.connectMean = relevantOrVeryRelevant(data.a2);
            SCOPE.properties.connectStd = relevantOrVeryRelevant(data.a3);

            SCOPE.properties.colorStatisticConnectionOpacity = (veryRelevant(data.a2) || veryRelevant(data.a3)) ? 0.9 : defaultProp.colorStatisticConnectionOpacity;
            SCOPE.properties.statisticConnectionBackground = veryRelevant(data.a3);


            // ------------ RULES GLOBAL TASKS ---------------
            if (!globalDisabled) {

              // ----
              // G1 - G2 very relevant --> high opacity, otherwise nomral
              if (veryRelevant(data.g1) || veryRelevant(data.g2)) {
                SCOPE.properties.colorShapesOpacity = 0.6
              } else {
                SCOPE.properties.colorShapesOpacity = defaultProp.colorShapesOpacity;
              }

              // ----
              // G3 - G5 relevant or very relevant --> we need to show the difference between the distributions
              // The type depends whether local differences are enabled or not.
              if (relevantOrVeryRelevant(data.g3) || relevantOrVeryRelevant(data.g4) || relevantOrVeryRelevant(data.g5)) {

                // Distinguish whether local analysis tasks are enabled or not
                // Adjust opacity based on whether tasks are relevant or very relevant.
                if (localDisabled || (notRelevant(data.l4) && notRelevant(data.l5))) {
                  SCOPE.properties.showDifferenceDensityShape = true;
                  SCOPE.properties.colorDifferenceShapesOpacity = (veryRelevant(data.g3) || veryRelevant(data.g4) || veryRelevant(data.g5)) ? 0.75 : defaultProp.colorDifferenceShapesOpacity;

                } else {
                  SCOPE.properties.showDifferenceHistogram = true;
                  if (veryRelevant(data.g3) || veryRelevant(data.g4) || veryRelevant(data.g5)) {
                    SCOPE.properties.colorInnerHistogramOpacity = 0.9; // this may already be changed in the local tasks --> therefore, we only increase the opacity (and not decrease).
                  }

                }
              }

            }


            // -------------------------------------------------------------------------
            // Compute ranking of alternative plots

            // collect tasks and weights
            let tasks = [];
            let weightRelevant = 1;
            let weightVeryRelevant = 1.5;

            if (relevant(data.l1)) tasks.push({'task': 'L1', 'weight': weightRelevant});
            if (relevant(data.l2)) tasks.push({'task': 'L2', 'weight': weightRelevant});
            if (relevant(data.l3)) tasks.push({'task': 'L3', 'weight': weightRelevant});
            if (relevant(data.l4)) tasks.push({'task': 'L4', 'weight': weightRelevant});
            if (relevant(data.l5)) tasks.push({'task': 'L5', 'weight': weightRelevant});

            if (relevant(data.a1)) tasks.push({'task': 'A1', 'weight': weightRelevant});

            if (relevant(data.g1)) tasks.push({'task': 'G1', 'weight': weightRelevant});
            if (relevant(data.g2)) tasks.push({'task': 'G2', 'weight': weightRelevant});
            if (relevant(data.g3)) tasks.push({'task': 'G3', 'weight': weightRelevant});
            if (relevant(data.g4)) tasks.push({'task': 'G4', 'weight': weightRelevant});
            if (relevant(data.g5)) tasks.push({'task': 'G5', 'weight': weightRelevant});


            if (veryRelevant(data.l1)) tasks.push({'task': 'L1', 'weight': weightVeryRelevant});
            if (veryRelevant(data.l2)) tasks.push({'task': 'L2', 'weight': weightVeryRelevant});
            if (veryRelevant(data.l3)) tasks.push({'task': 'L3', 'weight': weightVeryRelevant});
            if (veryRelevant(data.l4)) tasks.push({'task': 'L4', 'weight': weightVeryRelevant});
            if (veryRelevant(data.l5)) tasks.push({'task': 'L5', 'weight': weightVeryRelevant});

            if (veryRelevant(data.a1)) tasks.push({'task': 'A1', 'weight': weightVeryRelevant});

            if (veryRelevant(data.g1)) tasks.push({'task': 'G1', 'weight': weightVeryRelevant});
            if (veryRelevant(data.g2)) tasks.push({'task': 'G2', 'weight': weightVeryRelevant});
            if (veryRelevant(data.g3)) tasks.push({'task': 'G3', 'weight': weightVeryRelevant});
            if (veryRelevant(data.g4)) tasks.push({'task': 'G4', 'weight': weightVeryRelevant});
            if (veryRelevant(data.g5)) tasks.push({'task': 'G5', 'weight': weightVeryRelevant});


            let ranking = plotguideservice.getRankedVisualizationsForTasks(tasks);
            console.log("ranking", ranking);

            // keep only three elements (one from each group)
            let groupH = true;
            let groupS = true;
            let groupST = true;
            let rankingFinal = [];
            _.each(ranking, function (r) {

              if (r.group === 'H' && groupH) {
                rankingFinal.push(r);
                groupH = false;
              }

              if (r.group === 'S' && groupS) {
                rankingFinal.push(r);
                groupS = false;
              }

              if (r.group === 'ST' && groupST) {
                rankingFinal.push(r);
                groupST = false;
              }

            });

            propertyservice.setWizardSettings(data);
            callPreview(rankingFinal, ranking);


          };


          /**
           *
           * @param ranking -- top 3
           * @param rankingAll -- all rankings
           */
          let callPreview = function (ranking, rankingAll) {

            // create the div and svg elements including a caption
            alternativevisservice.clearPreview();
            alternativevisservice.clearAll();

            // width and height of the figures
            let widthRank = 270;
            let heightRank = 290;
            let sizeSmallMultiple = 50;

            // add the visualizations only, if the tasks are enabled; otherwise show empty boxes
            if (!localDisabled || !globalDisabled || !aggregationDisabled) {

              // clone the current properties and add the distributions (as used in the alternativevisservice.
              let properties = _.clone(SCOPE.properties);
              properties.distributionTop = SCOPE.distributionTop;
              properties.distributionBottom = SCOPE.distributionBottom;


              let preview = alternativevisservice.addElementToRank("v-plot", widthRank, heightRank, 0);
              let previewRank1 = alternativevisservice.addElementToRank(ranking[0].visualization + " - Rank: " + ranking[0].rank + " / 20 - score: " + ranking[0].score.toFixed(2), widthRank, heightRank, 1);
              let previewRank2 = alternativevisservice.addElementToRank(ranking[1].visualization + " - Rank: " + ranking[1].rank + " / 20 - score: " + ranking[1].score.toFixed(2), widthRank, heightRank, 2);
              let previewRank3 = alternativevisservice.addElementToRank(ranking[2].visualization + " - Rank: " + ranking[2].rank + " / 20 - score: " + ranking[2].score.toFixed(2), widthRank, heightRank, 3);

              // small multiples
              let smallMultiples = [];
              let i = 0;
              _.each(rankingAll, function () {
                smallMultiples.push(alternativevisservice.addElementToSmallMultiple('', ('#smallMultiple' + i), sizeSmallMultiple, sizeSmallMultiple));
                i++;
              });


              // show the different visualizations
              alternativevisservice.addVPlot(preview, properties, localScope.continuous, widthRank); // widthPreview = optional size.

              let addVis = function (elem, vis) {

                if (vis === 'Bar Chart') alternativevisservice.addDiscreteBarChartSeparate(elem, properties);
                if (vis === 'Broken Line Graph I') alternativevisservice.addDiscreteBarchartBrokenLine(elem, properties);
                if (vis === 'Grouped Bar Charts') alternativevisservice.addDiscreteBarchartGrouped(elem, properties);
                if (vis === 'Mirrored Bar Chart I') alternativevisservice.addDiscreteBarchartMirrored(elem, properties);
                if (vis === 'Mirrored Bar Charts II') alternativevisservice.addDiscreteBarchartMirroredRotated(elem, properties);
                if (vis === 'Stacked Bar Charts') alternativevisservice.addDiscreteBarchartStacked(elem, properties);
                if (vis === 'Cumulative Bar Charts') alternativevisservice.addDiscreteCumulativeBarchartGrouped(elem, properties);
                if (vis === 'Density Distribution I') alternativevisservice.addContinuousDensityDistributionSeparate(elem, properties, false);
                if (vis === 'Density Distribution III') alternativevisservice.addContinuousDensityDistributionCombined(elem, properties, false);
                if (vis === 'Density Distribution II') alternativevisservice.addContinuousDensityDistributionSeparateRotated(elem, properties, false);
                if (vis === 'Cumulative Distribution') alternativevisservice.addContinuousDensityCumulativeCombined(elem, properties, false);
                if (vis === 'Violin Plot') alternativevisservice.addContinuousViolinPlot(elem, properties, false);
                if (vis === 'Beanplot') alternativevisservice.addContinuousBeanPlot(elem, properties, false);
                if (vis === 'Split Violin Plot') alternativevisservice.addContinuousSplitViolinPlot(elem, properties, false);
                if (vis === 'Asymmetric Beanplot') alternativevisservice.addContinuousAsymmBeanPlot(elem, properties, false);
                if (vis === 'Broken Line Graph II') alternativevisservice.addDiscreteBrokenLine(elem, properties, widthRank);
                if (vis === 'Gradient Plot') alternativevisservice.addContinuousGradientSeparate(elem, properties, false);
                if (vis === 'Box Plot') alternativevisservice.addContinuousBoxPlot(elem, properties, false);
                if (vis === 'Error Bars I') alternativevisservice.addErrorBarsBar(elem, properties, false);
                if (vis === 'Error Bars II') alternativevisservice.addErrorBarsLine(elem, properties, false);

              };

              addVis(previewRank1, ranking[0].visualization);
              addVis(previewRank2, ranking[1].visualization);
              addVis(previewRank3, ranking[2].visualization);

              i = 0;
              _.each(rankingAll, function () {
                addVis(smallMultiples[i], rankingAll[i].visualization);
                smallMultiples[i].attr("transform", "scale(0.1852)"); // 50 / 270
                i++;
              });

            } else {
              // show emppty boxes as preview
              alternativevisservice.addElementToRank("", widthRank, heightRank, 0);
              alternativevisservice.addElementToRank("", widthRank, heightRank, 1);
              alternativevisservice.addElementToRank("", widthRank, heightRank, 2);
              alternativevisservice.addElementToRank("", widthRank, heightRank, 3);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple0', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple1', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple2', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple3', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple4', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple5', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple6', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple7', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple8', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple9', sizeSmallMultiple, sizeSmallMultiple);

              alternativevisservice.addElementToSmallMultiple('#smallMultiple10', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple11', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple12', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple13', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple14', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple15', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple16', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple17', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple18', sizeSmallMultiple, sizeSmallMultiple);
              alternativevisservice.addElementToSmallMultiple('#smallMultiple19', sizeSmallMultiple, sizeSmallMultiple);
            }

          }


        },
        templateUrl: 'templates/template-edit-plot.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: false,
        locals: {
          properties: properties,
          localScope: $scope
        }
      });

    };

    /**
     * Computes sturges rule to decide for a number of records.
     * @param obv the number of observations.
     * @return {number} the number of bins.
     */
    $scope.sturgesRule = function (obv) {

      // formula based on description in https://en.wikipedia.org/wiki/Histogram
      return Math.ceil(Math.log2(obv)) + 1;

      // var interval = 1 + 3.322 * Math.log(obv);
      // return interval;
    };


  });


