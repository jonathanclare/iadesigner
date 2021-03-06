iadesigner = (function (iad, undefined)
{
    'use strict';

    iad = iad || {};

    iad.defaults =
    {
        // Called when app is ready.
        onAppReady: function ()
        {
            console.log('------------ app is ready ------------');
        },

        // Locale
        locale:'en',

        configForms:
        {
            // Lists the config properties that should use a text area for long text.
            useTextArea:             
            [
                'title', 'tip', 'tip2', 'xAxisTitle', 'yAxisTitle', 'text'
            ],
            // Lists the config properties to exclude.
            excludeProperties:
            [
                'minChartValue', 'maxChartValue', 'minChartValueX', 'minChartValueY', 'maxChartValueX', 'maxChartValueY', 'metadataKey',
                'customClassifierKey', 'customColoursKey', 'customBreaksKey', 'customLabelsKey', 'customPaletteKey',
                'customClassifierKey2', 'customColoursKey2', 'customBreaksKey2', 'customLabelsKey2', 'customPaletteKey2',
                'breakData', 'breakFlipData', 'useMouseClick', 'expandedThemeIds',
                'googleGreyscaleText', 'googleOffText', 'includeSearchTool', 'backgroundMappingPath', 'clearButtonText', 'filterButtonText',
                'sd1', 'sd2', 'sd3', 'sd4', 'sd5', 'sd6', 'sdSize',
                'equalInterval', 'quantile', 'natural', 'continuous', 'standardDeviation',
                'legendBreaks', 'legendLabels', 'legendBreaks2', 'legendLabels2', 'mapPalette2',
                'saveImageText', 'emailReportText', 'embedReportText',
                'showLegendTypePanel', 'showLegendTools', 'showPalettePanel', 'showSizePanel',
                'zIndex', 'isExportable', 'notAvailableText', 'allowUserSorting',
                'barData', 'barHeight', 'barColor',
                'minValue', 'midValue', 'maxValue',
                'ignoreThemeIds', 'ignoreIndicatorIds',
                'syncDates'
            ],
            // Lists the config properties that require a data dropdown menu.
            requireDataDropdown:                
            [
                'data', 'data2', 'xData', 'yData', 'sizeData',
                'largestObservationField', 'upperQuartileField', 'medianField', 'lowerQuartileField', 'smallestObservationField',
                'target_data_1', 'target_data_2', 'target_data_3', 'target_data_4', 'barData'
            ],
            // Lists the config properties that require a substitution variable dropdown menu. 
            requireSubVarDropdown:              
            [
                'title', 'xAxisTitle', 'yAxisTitle', 'text'
            ],
            // Lists the config properties that require a tootltip dropdown menu. 
            requireTipDropdown:           
            [
                'tip', 'tip2'
            ],
            // Lists the config properties that require a data properties dropdown menu.
            requirePropertiesDropdown:             
            [
                'minChartValue', 'maxChartValue', 'minChartValueX', 'minChartValueY', 'maxChartValueX', 'maxChartValueY', 'metadataKey',
                'customClassifierKey', 'customColoursKey', 'customBreaksKey', 'customLabelsKey', 'customPaletteKey',
                'customClassifierKey2', 'customColoursKey2', 'customBreaksKey2', 'customLabelsKey2', 'customPaletteKey2',
                'breakData', 'breakFlipData'
            ],
            // Lists the config properties that require a javascript functions dropdown menu.
            requireJavaScriptDropdown:           
            [
                'menuFunc1', 'menuFunc2', 'menuFunc3', 'menuFunc4', 'menuFunc5', 'menuFunc6', 'menuFunc7'
            ],
            // Lists the available substitution variables for tooltips for data source 1.
            tooltipOptions:            
            [
                { 'header': 'Substitution variables' },
                { 'label': 'Feature name', 'value': '${featureName}' },
                { 'label': 'Indicator value', 'value': '${indicatorValue}' }
            ],
             // Lists the available substitution variables for tooltips for data source 2.
            tooltipOptions2:          
            [
                { 'header': 'Substitution variables' },
                { 'label': 'Feature name', 'value': '${featureName2}' },
                { 'label': 'Indicator value', 'value': '${indicatorValue2}' }
            ],
            // Lists the available substitution variables for data source 1.
            subVarOptions:    
            [
                { 'header': 'Substitution variables' },
                { 'divider': 'true', 'header': 'Updated when the data changes' },
                { 'label': 'Geography name', 'value': '${geogName}' },
                { 'label': 'Theme name', 'value': '${themeName}' },
                { 'label': 'Indicator name', 'value': '${indicatorName}' },
                { 'label': 'Date', 'value': '${date}' },
                { 'divider': 'true', 'header': 'Updated when the legend type changes' },
                { 'label': 'Legend type', 'value': '${legendType}' },
                { 'divider': 'true', 'header': 'Updated when the selected feature changes' },
                { 'label': 'Selected feature', 'value': '${selectedFeature}' },
                { 'divider': 'true', 'header': 'Stats - updated when the data changes' },
                { 'label': 'Mean', 'value': '${mean}' },
                { 'label': 'Median', 'value': '${median}' },
                { 'label': 'Sum', 'value': '${sum}' },
                { 'label': 'Min value', 'value': '${minValue}' },
                { 'label': 'Max value', 'value': '${maxValue}' },
                { 'label': 'Range', 'value': '${range}' },
                { 'label': 'Lower quartile', 'value': '${lowerQuartile}' },
                { 'label': 'Upper quartile', 'value': '${upperQuartile}' },
                { 'label': 'Interquartile range', 'value': '${interquartileRange}' },
                { 'label': 'Variance', 'value': '${variance}' },
                { 'label': 'Standard deviation', 'value': '${standardDeviation}' }
            ],
            // Lists the available substitution variables for data source 2.
            subVarOptions2:   
            [
                { 'header': 'Substitution variables' },
                { 'divider': 'true', 'header': 'Updated when the data changes' },
                { 'label': 'Geography name', 'value': '${geogName2}' },
                { 'label': 'Theme name', 'value': '${themeName2}' },
                { 'label': 'Indicator name', 'value': '${indicatorName2}' },
                { 'label': 'Date', 'value': '${date2}' },
                { 'divider': 'true', 'header': 'Updated when the legend type changes' },
                { 'label': 'Legend type', 'value': '${legendType2}' },
                { 'divider': 'true', 'header': 'Updated when the selected feature changes' },
                { 'label': 'Selected feature', 'value': '${selectedFeature2}' },
                { 'divider': 'true', 'header': 'Stats - updated when the data changes' },
                { 'label': 'Mean', 'value': '${mean2}' },
                { 'label': 'Median', 'value': '${median2}' },
                { 'label': 'Sum', 'value': '${sum2}' },
                { 'label': 'Min value', 'value': '${minValue2}' },
                { 'label': 'Max value', 'value': '${maxValue2}' },
                { 'label': 'Range', 'value': '${range2}' },
                { 'label': 'Lower quartile', 'value': '${lowerQuartile2}' },
                { 'label': 'Upper quartile', 'value': '${upperQuartile2}' },
                { 'label': 'Interquartile range', 'value': '${interquartileRange2}' },
                { 'label': 'Variance', 'value': '${variance2}' },
                { 'label': 'Standard deviation', 'value': '${standardDeviation2}' }
            ],
            javaScriptOptions:
            [
                {'label': 'Print Preview', 'value': 'javascript:iaOpenPrintPreview()'},
                {'label': 'Toggle Share', 'value': 'javascript:iaToggleShare()'},
                {'label': 'Toggle Legend Editor', 'value': 'javascript:iaToggleLegendEditor()'}
            ]
        },

        // Config.
        config:
        {
            paths:
            [
                {template:'areaprofiler::flash::html', path:'config/en/db-area-profile/config.xml'},
                {template:'bubbleplot::flash::html', path:'config/en/db-bubble-plot/config.xml'},
                {template:'bubbleplot::flash::html', path:'config/en/db-bubble-plot-alt/config.xml'},
                {template:'bubbleplot::flash::html::single', path:'config/en/db-bubble-plot-simple/config.xml'},
                {template:'double_timeseries_advanced_dm::flash::double_base::html', path:'config/en/db-double-base-layer/config.xml'},
                {template:'double_timeseries_advanced_dm::flash::double_base::html', path:'config/en/db-double-base-layer-alt/config.xml'},
                {template:'double_timeseries_advanced_dm::flash::html', path:'config/en/db-double-geog/config.xml'},
                {template:'double_timeseries_advanced_dm::flash::html', path:'config/en/db-double-geog-alt/config.xml'},
                {template:'timeseries_advanced_dm::flash::html', path:'config/en/db-double-plot/config.xml'},
                {template:'timeseries_advanced_dm::flash::html', path:'config/en/db-double-plot-alt/config.xml'},
                {template:'areaprofiler::flash::election::html', path:'config/en/db-election/config.xml'},
                {template:'areaprofiler::flash::election::html', path:'config/en/db-election-alt/config.xml'},
                {template:'bubbleplot::flash::html::single', path:'config/en/db-funnel-plot/config.xml'},
                {template:'areaprofiler::flash::html', path:'config/en/db-health-profile/config.xml'},
                {template:'areaprofiler::flash::html', path:'config/en/db-performance-profile/config.xml'},
                {template:'timeseries_advanced_sm::flash::pyramid::html', path:'config/en/db-pyramid/config.xml'},
                {template:'bubbleplot::flash::html::single', path:'config/en/db-scatter-plot/config.xml'},
                {template:'timeseries_advanced_sm::flash::html', path:'config/en/db-single-map/config.xml'},
                {template:'timeseries_advanced_sm::flash::html', path:'config/en/db-single-map-alt/config.xml'},
                {template:'timeseries_advanced_sm::flash::html', path:'config/en/db-single-map-default/config.xml'},
                {template:'timeseries_advanced_sm::flash::html', path:'config/en/db-single-map-only/config.xml'}
            ]
        },

        // Report.
        report:
        {
            path:'config/en/db-single-map/config.xml', // Path of default report to load.
        },

        // Map Json
        map:
        {
            form: 
            [
                {'id':'name', 'name':'Name', 'type':'string'},
                {'id':'visible', 'name':'Visible', 'type':'boolean'},
                {'id':'fillColor', 'name':'Fill Colour', 'type':'colour'},
                {'id':'fillOpacity', 'name':'Fill Opacity', 'type':'range', 'min':0, 'max':1, 'step':0.1},
                {'id':'borderThickness', 'name':'Border Thickness', 'type':'range', 'min':0, 'max':10, 'step':1},
                {'id':'borderColor', 'name':'Border Colour', 'type':'colour'},
                {'id':'showInLayerList', 'name':'Show In Legend', 'type':'boolean'},
                {'id':'showDataTips', 'name':'Show Tool Tips', 'type':'boolean'},
                {'id':'showLabels', 'name':'Show Labels', 'type':'boolean'},
                {'id':'labelPosition', 'name':'Label Position', 'type':'select', 'choices':[
                                                                                                {'label':'Top Left', 'value':'top-left'},
                                                                                                {'label':'Top', 'value':'top'},
                                                                                                {'label':'Top Right', 'value':'top-right'},
                                                                                                {'label':'Left', 'value':'left'},
                                                                                                {'label':'Center', 'value':'center'},
                                                                                                {'label':'Right', 'value':'right'},
                                                                                                {'label':'Bottom Left', 'value':'bottom-left'},
                                                                                                {'label':'Bottom', 'value':'bottom'},
                                                                                                {'label':'Bottom Right', 'value':'bottom-right'}
                                                                                            ]},
                {'id':'displayLabelsOnly', 'name':'Hide Symbols', 'type':'boolean'},
                {'id':'minLabelExtent', 'name':'Minimum Label Extent', 'type':'integer'},
                {'id':'maxLabelExtent', 'name':'Maximum Label Extent', 'type':'integer'},
                {'id':'symbolSize', 'name':'Symbol Size', 'type':'integer-counter'},
                {'id':'iconPath', 'name':'Icon Path For Symbols', 'type':'string'}
            ]
        },

        // CSS.
        css:
        {
            lessFile  : 'lib/ia/default.less',
            lessVars   : 
            {
                '@background-color':'#FFFFFF',
                '@button-background-color':'#5B9EAE',
                '@button-border-color':'#396B88',
                '@button-border-radius':'4px',
                '@button-border-width':'0px',
                '@button-font-color':'#FFFFFF',
                '@button-font-weight':'bold',
                '@chart-font-color':'#666666',
                '@chart-font-size':'11px',
                '@chart-grid-color':'#DDDDDD',
                '@font-color':'#666666',
                '@font-family':'Arial, Helvetica, sans-serif',
                '@font-size':'12px',
                '@highlight-color':'#e66c64',
                '@panel-background-color':'#FDFDFD',
                '@panel-border-color':'#DDDDDD',
                '@panel-border-radius':'0px',
                '@panel-border-width':'1px',
                '@panel-header-background-color':'#FDFDFD',
                '@panel-header-font-color':'#777777',
                '@panel-header-font-weight':'bold',
                '@report-min-height':'600px',
                '@report-min-width':'600px',
                '@selection-color':'#953d37'
            },
            form   : 
            {
                'id': 'css',
                'forms': [
                {
                    'name': 'General',
                    'id': 'css',
                    'type': 'CSS',
                    'expand': true,
                    'controls': [
                    {
                        'name'      : 'Font Family',
                        'type'      : 'select',
                        'id'        : 'font-family',
                        'value'     : 'Verdana, Geneva, sans-serif',
                        'choices'   : 
                        [
                            { 'label': 'Arial', 'value': 'Arial, Helvetica, sans-serif' },
                            { 'label': 'Helvetica', 'value': 'Helvetica, sans-serif' },
                            { 'label': 'sans-serif', 'value': 'sans-serif' },
                            { 'label': 'Verdana', 'value': 'Verdana, Geneva, sans-serif' },
                            { 'label': 'Calibri', 'value': 'Calibri' },
                            { 'label': 'Tahoma', 'value': 'Tahoma, Geneva, sans-serif' },
                            { 'label': 'Trebuchet MS', 'value': '"Trebuchet MS", Helvetica, sans-serif' },
                            { 'label': 'Lucida Sans Unicode', 'value': '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
                            { 'label': 'Droid Sans', 'value': '"Droid Sans", Helvetica, sans-serif' },
                            { 'label': 'Lato', 'value': 'Lato, Helvetica, sans-serif' },
                            { 'label': 'Open Sans', 'value': '"Open Sans", Helvetica, sans-serif' },
                            { 'label': 'Oswald', 'value': 'Oswald, Helvetica, sans-serif' },
                            { 'label': 'PT Sans', 'value': '"PT Sans", Helvetica, sans-serif' },
                            { 'label': 'Roboto', 'value': 'Roboto, Helvetica, sans-serif' },
                            { 'label': 'Georgia', 'value': 'Georgia, serif' },
                            { 'label': 'Times New Roman', 'value': '"Times New Roman", Times, serif' },
                            { 'label': 'Bitter', 'value': 'Bitter, Helvetica, sans-serif' },
                            { 'label': 'Droid Serif', 'value': '"Droid Serif", Helvetica, sans-serif' },
                            { 'label': 'Roboto Slab', 'value': '"Roboto Slab", Helvetica, sans-serif' }
                        ]
                    },
                    {
                        'name'      : 'Font Size',
                        'type'      : 'range',
                        'id'        : 'font-size',
                        'value'     : 12,
                        'min'       : 8,
                        'max'       : 20,
                        'step'      : 1
                    },
                    {
                        'name'      : 'Font Color',
                        'type'      : 'colour',
                        'id'        : 'font-color',
                        'value'     : '#2B484A'
                    },
                    {
                        'name'      : 'Background Color',
                        'type'      : 'colour',
                        'id'        : 'background-color',
                        'value'     : '#ffffff'
                    }]
                },
                {
                    'name': 'Widgets',
                    'id': 'css',
                    'type': 'CSS',
                    'controls': [
                    {
                        'name'      : 'Title Font Color',
                        'type'      : 'colour',
                        'id'        : 'panel-header-font-color',
                        'value'     : '#2B484A'
                    },
                    {
                        'name'      : 'Title Font Weight',
                        'type'      : 'select',
                        'id'        : 'panel-header-font-weight',
                        'value'     : 'bold',
                        'choices'   : [{'label': 'bold','value': 'bold'}, {'label': 'normal','value': 'normal'}]
                    },
                    {
                        'name'      : 'Title Background Color',
                        'type'      : 'colour',
                        'id'        : 'panel-header-background-color',
                        'value'     : '#d9f1f7'
                    },
                    {
                        'name'      : 'Background Color',
                        'type'      : 'colour',
                        'id'        : 'panel-background-color',
                        'value'     : '#f7fbfd'
                    },
                    {
                        'name'      : 'Border Color',
                        'type'      : 'colour',
                        'id'        : 'panel-border-color',
                        'value'     : '#BBD6DD'
                    },
                    {
                        'name'      : 'Border Width',
                        'type'      : 'range',
                        'id'        : 'panel-border-width',
                        'value'     : 1,
                        'min'       : 0,
                        'max'       : 10,
                        'step'      : 1
                    },
                    {
                        'name'      : 'Corner Radius',
                        'type'      : 'range',
                        'id'        : 'panel-border-radius',
                        'value'     : 0,
                        'min'       : 0,
                        'max'       : 20,
                        'step'      : 1
                    }]
                },
                {
                    'name': 'Buttons',
                    'id': 'css',
                    'type': 'CSS',
                    'controls': [
                    {
                        'name'      : 'Font Color',
                        'type'      : 'colour',
                        'id'        : 'button-font-color',
                        'value'     : '#ffffff'
                    },
                    {
                        'name'      : 'Font Weight',
                        'type'      : 'select',
                        'id'        : 'button-font-weight',
                        'value'     : 'bold',
                        'choices'   : [{'label': 'bold','value': 'bold'}, {'label': 'normal','value': 'normal'}]
                    },
                    {
                        'name'      : 'Background Color',
                        'type'      : 'colour',
                        'id'        : 'button-background-color',
                        'value'     : '#aa4848'
                    },
                    {
                        'name'      : 'Border Color',
                        'type'      : 'colour',
                        'id'        : 'button-border-color',
                        'value'     : '#883939'
                    },
                    {
                        'name'      : 'Border Width',
                        'type'      : 'range',
                        'id'        : 'button-border-width',
                        'value'     : 0,
                        'min'       : 0,
                        'max'       : 10,
                        'step'      : 1
                    },
                    {
                        'name'      : 'Corner Radius',
                        'type'      : 'range',
                        'id'        : 'button-border-radius',
                        'value'     : 0,
                        'min'       : 0,
                        'max'       : 20,
                        'step'      : 1
                    }]
                },
                {
                    'name': 'Charts',
                    'id': 'css',
                    'type': 'CSS',
                    'controls': [
                    {
                        'name'      : 'Font Size',
                        'type'      : 'range',
                        'id'        : 'chart-font-size',
                        'value'     : 12,
                        'min'       : 8,
                        'max'       : 20,
                        'step'      : 1
                    },
                    {
                        'name'      : 'Font Color',
                        'type'      : 'colour',
                        'id'        : 'chart-font-color',
                        'value'     : '#2B484A'
                    },
                    {
                        'name'      : 'Grid Color',
                        'type'      : 'colour',
                        'id'        : 'chart-grid-color',
                        'value'     : '#2B484A'
                    },
                    {
                        'name'      : 'Highlight Color',
                        'type'      : 'colour',
                        'id'        : 'highlight-color',
                        'value'     : '#2B484A'
                    },
                    {
                        'name'      : 'Selection Color',
                        'type'      : 'colour',
                        'id'        : 'selection-color',
                        'value'     : '#2B484A'
                    }]
                }/*,
                {
                    'name': 'Minimum Page Size',
                    'id': 'css',
                    'type': 'CSS',
                    'controls': [
                    {
                        'name'      : 'Width',
                        'type'      : 'integer',
                        'id'        : 'report-min-width',
                        'value'     : 600
                    },
                    {
                        'name'      : 'Height',
                        'type'      : 'integer',
                        'id'        : 'report-min-height',
                        'value'     : 600
                    }]
                }*/]
            }
        },

        // Template gallery.
        templateGallery:
        {
            reportPath : 'lib/ia',
            configPath : 'config/en',
            json :
            {
               'thumbnail':{
                  'buttons':{
                     'preview':'Example',
                     'apply':'Apply'
                  }
               },
               'galleries':[
                  {
                     'header':'Displaying patterns and trends for a single indicator',
                     'description':'This is our starter report and is generally applicable to all data types.',
                     'reports':[
                        {
                           'header':'Starter report',
                           'description':'Combines a single map and table with a range of supporting chart types.',
                           'path':'db-single-map-default'
                        },
                        {
                           'header':'Starter with Time Series',
                           'description':'Includes a time series chart and time animation control.',
                           'path':'db-single-map'
                        }
                     ]
                  },
                  {
                     'header':'Profiling Areas',
                     'description':'Enables at-a-glance analysis across a range of indicators for a selected area.',
                     'reports':[
                        {
                           'header':'Area profile',
                           'description':'Compare areas against each other and the national average.',
                           'path':'db-area-profile'
                        },
                        {
                           'header':'Performance profile',
                           'description':'Judge the performance of areas and see which ones have hit their targets.',
                           'path':'db-performance-profile'
                        },
                        {
                           'header':'Health profile',
                           'description':'Designed to meet the needs of health professionals. See how well an area is doing against the national average.',
                           'path':'db-health-profile'
                        },
                        {
                           'header':'Election Results',
                           'description':'Displays area-by-area details and a breakdown of results for each candidate.',
                           'path':'db-election'
                        }
                     ]
                  },
                  {
                     'header':'Presenting statistical relationships between indicators',
                     'description':'Make a side-by-side comparison of indicators for a data layer.',
                     'reports':[
                        {
                           'header':'Scatter Plot',
                           'description':'Explore the degree of correlation between two indicators for the same data layer.',
                           'path':'db-double-plot'
                        },
                        {
                           'header':'Scatter Plot (synced date selection)',
                           'description':'Explore the degree of correlation between two indicators for the same data layer.',
                           'path':'db-double-plot-alt'
                        }
                     ]
                  },
                  {
                     'header':'Displaying geographical relationships between indicators',
                     'description':'Make a side-by-side comparison of two different data layers within the same geographical area. Works with both one and two data layers.',
                     'reports':[
                        {
                           'header':'Double Map',
                           'description':'Useful for viewing the same indicator at two different geographical levels. The spatial data for each map can be the same or different.',
                           'path':'db-double-geog'
                        },
                        {
                           'header':'Double Map (synced data selection)',
                           'description':'Useful for viewing the same indicator at two different data layers. The spatial data for each map can be the same or different.',
                           'path':'db-double-geog-alt'
                        }
                     ]
                  }, 
                  {
                     'header':'Looking at the relationship between numbers and rates',
                     'description':'Display proportional circles over shaded polygons.',
                     'reports':[
                        {
                           'header':'Proportional Circles',
                           'description':'Allows two data layers to be superimposed in the same map. Each layer has its own dedicated table, charts and other components.',
                           'path':'db-double-base-layer-alt'
                        },
                        {
                           'header':'Proportional Circles (synced data selection)',
                           'description':'Allows two data layers to be superimposed in the same map. Each layer has its own dedicated table, charts and other components.',
                           'path':'db-double-base-layer'
                        }
                     ]
                  },
                  {
                     'header':'Showing the relationships between multiple indicators',
                     'description':'Combines a map with a bubble plot for multidimensional data reporting.',
                     'reports':[
                        {
                           'header':'Bubble Plot (multiple data selection)',
                           'description':'Display and compare up to four indicators at the same time.',
                           'path':'db-bubble-plot-alt'
                        },
                        {
                           'header':'Bubble Plot (single data selection)',
                           'description':'Compare the selected indicator with up to 3 of its associates.',
                           'path':'db-bubble-plot-simple'
                        },
                        {
                           'header':'Funnel Plot',
                           'description':'A funnel plot is a simple scatter plot of the intervention effect estimates from individual studies against some measure of each studys size or precision. In common with forest plots, it is most common to plot the effect estimates on the horizontal scale, and thus the measure of study size on the vertical axis.',
                           'path':'db-funnel-plot'
                        }
                     ]
                  },
                  {
                     'header':'Exploring the make-up of population in an area or place',
                     'description':'Uses a population pyramid to show the breakdown of population data by different age groups and gender.',
                     'reports':[
                        {
                           'header':'Pyramid Chart',
                           'description':'The pyramid chart contains two themes. The first theme stores data for males. The second theme stores data for females.',
                           'path':'db-pyramid'
                        }
                     ]
                  }
               ]
            }
        },

        // Widget gallery.
        widgetGallery:
        {
            json :  
            {
                'dataSourceIndex' : 0,
                'header' : 
                {
                    'description':'This template contains two data sources. Use the buttons below to toggle between the available widgets for each data source.',
                    'buttons':
                    {
                        'datasource1':{'text':'Data Source 1', 'active':'active'},
                        'datasource2':{'text':'Data Source 2', 'active':''},
                    },
                    'include':false,
                },
                'galleries':
                [
                    {
                        'id':'ui',
                        'header':'UI',
                        'description':'',
                        /*'include':true,*/
                        'widgets':
                        [
                            /*{'id':'Button','thumbnail':'button.png','name':'Button','description':'Add a new button.','include':'true'},
                            {'id':'Text','thumbnail':'text.png','name':'Text','description':'Add new text.','include':'true'},
                            {'id':'Image','thumbnail':'image.png','name':'Image','description':'Add a new image.','include':'true'},*/
                            {'id':'dataExplorer','thumbnail':'dataExplorer.png'},                            
                            {'id':'dropdownExplorer','thumbnail':'dropdownExplorer.png'},
                            {'id':'filterExplorer','thumbnail':'filterExplorer.png'},
                            {'id':'geogExplorer','thumbnail':'geogExplorer.png'},
                            {'id':'menuBar','thumbnail':'menuBar.png'}
                        ]
                    },
                    {
                        'id':'mappedIndicator',
                        'header':'Mapped Indicator',
                        'description':'Display information about the selected indicator for all features.',
                        'widgets':
                        [
                            {'id':'map','thumbnail':'map.png'},
                            {'id':'legend','thumbnail':'legend.png'},
                            {'id':'pieChart','thumbnail':'pieChart.png'},
                            {'id':'barChart','thumbnail':'barChart.png'},
                            {'id':'boxAndWhisker','thumbnail':'boxAndWhisker.png'},
                            {'id':'statsbox','thumbnail':'statsbox.png'},
                            {'id':'metadata','thumbnail':'metadata.png'},
                            {'id':'table','thumbnail':'table.png'},
                            {'id':'comparisonTable','thumbnail':'comparisonTable.png'}
                        ]
                    },
                    {
                        'id':'timeSeries',
                        'header':'Time Series',
                        'description':'Display time series data for the selected indicator.',
                        'widgets':
                        [
                            {'id':'timeSeries','thumbnail':'timeSeries.png'},
                            {'id':'discreteTimeSeries','thumbnail':'discreteTimeSeries.png'},
                            {'id':'stackedFeaturesTimeSeries','thumbnail':'stackedFeaturesTimeSeries.png'},
                            {'id':'featureLegend','thumbnail':'featureLegend.png'},
                            {'id':'timeControl','thumbnail':'timeControl.png'}
                        ]
                    },
                    {
                        'id':'areaBreakdown',
                        'header':'Area Breakdown',
                        'description':'Display all indicators (or indicators with same date) in the current theme or associates of the selected indicator.',
                        'widgets':
                        [
                            {'id':'areaBreakdownPieChart','thumbnail':'areaBreakdownPieChart.png'},
                            {'id':'areaBreakdownPieLegend','thumbnail':'areaBreakdownPieLegend.png'},
                            {'id':'areaBreakdownBarChart','thumbnail':'areaBreakdownBarChart.png'}
                        ]
                    },
                    {
                        'id':'associateBreakdown',
                        'header':'Breakdown Of Associate Data',
                        'description':'Display associate data for the selected indicator.',
                        'widgets':
                        [
                            {'id':'stackedBarChart','thumbnail':'stackedBarChart.png'},
                            {'id':'stackedTimeSeries','thumbnail':'stackedTimeSeries.png'},
                            {'id':'stackedLegend','thumbnail':'stackedLegend.png'}
                        ]
                    },
                    {
                        'id':'advanced',
                        'header':'Advanced',
                        'description':'',
                        'widgets':
                        [
                            {'id':'scatterPlot','thumbnail':'scatterPlot.png'},
                            {'id':'spineChart','thumbnail':'spineChart.png'},
                            {'id':'profileLegend','thumbnail':'profileLegend.png'},
                            {'id':'featureCard','thumbnail':'featureCard.png'},
                            {'id':'pyramidChart','thumbnail':'pyramidChart.png'},
                            {'id':'pyramidLegend','thumbnail':'pyramidLegend.png'},
                            {'id':'radarChart','thumbnail':'radarChart.png'}
                        ]
                    },
                    {
                        'id':'other',
                        'header':'Other',
                        'description':'',
                        'widgets': [
                            
                        ]
                    }
                ]
            }
        }
    };

    return iad;

})(iadesigner || {});