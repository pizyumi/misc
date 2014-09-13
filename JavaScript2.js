var CreateGraph = function (elemId, width, height, dataX, dataYs, title, labelX, labelYs1, labelYs2, axises, types) {
    var canvas = document.createElement('canvas');

    if (!canvas || !canvas.getContext) {
        return false;
    }

    canvas.width = width;
    canvas.height = height;

    var elem = document.getElementById(elemId);
    elem.appendChild(canvas);

    var ctx = canvas.getContext('2d');


    var isNeededYAxis1 = false;
    var isNeededYAxis2 = false;
    for (var i = 0; i < axises.length; i++) {
        if (axises[i] == 1) {
            isNeededYAxis1 = true;
        }
        else if (axises[i] == 2) {
            isNeededYAxis2 = true;
        }
    }

    var isNeededYAxisLabel1 = labelYs1 != null;
    var isNeededYAxisLabel2 = labelYs2 != null;


    var marginRateYTop = 0.1;
    var marginRateYBottom = 0.1;
    var marginRateYTop2 = 0;
    var marginRateYBottom2 = -0.2;

    var supportedMaxValue = 65535;
    var supportedMinValue = -65535;


    var maxValueFirst = supportedMinValue - 1;
    var minValueFirst = supportedMaxValue + 1;
    var maxValue2First = supportedMinValue - 1;
    var minValue2First = supportedMaxValue + 1;
    var maxValue = maxValueFirst;
    var minValue = minValueFirst;
    var maxValue2 = maxValue2First;
    var minValue2 = minValue2First;
    var dataYsYAxis1 = new Array();
    var dataYsYAxis2 = new Array();
    for (var i = 0; i < dataYs.length; i++) {
        if (axises[i] == 1) {
            dataYsYAxis1.push(dataYs[i]);
        }
        else if (axises[i] == 2) {
            dataYsYAxis2.push(dataYs[i]);
        }
    }
    if (isNeededYAxis1) {
        for (var i = 0; i < dataYsYAxis1.length; i++) {
            for (var j = 0; j < dataYsYAxis1[i].length; j++) {
                if (dataYsYAxis1[i][j] != null) {
                    if (dataYsYAxis1[i][j] > maxValue) {
                        maxValue = dataYsYAxis1[i][j];
                    }
                    if (dataYsYAxis1[i][j] < minValue) {
                        minValue = dataYsYAxis1[i][j];
                    }
                }
            }
        }
    }
    if (isNeededYAxis2) {
        for (var i = 0; i < dataYsYAxis2.length; i++) {
            for (var j = 0; j < dataYsYAxis2[i].length; j++) {
                if (dataYsYAxis2[i][j] != null) {
                    if (dataYsYAxis2[i][j] > maxValue2) {
                        maxValue2 = dataYsYAxis2[i][j];
                    }
                    if (dataYsYAxis2[i][j] < minValue2) {
                        minValue2 = dataYsYAxis2[i][j];
                    }
                }
            }
        }
    }
    if (maxValue == maxValueFirst || minValue == minValueFirst) {
        isNeededYAxis1 = false;
    }
    if (maxValue2 == maxValue2First || minValue2 == minValue2First) {
        isNeededYAxis2 = false;
    }
    var difValue = maxValue - minValue;
    var difValue2 = maxValue2 - minValue2;


    var marginValueTop = difValue * marginRateYTop;
    var marginValueBottom = difValue * marginRateYBottom;
    var marginValueTop2 = difValue2 * marginRateYTop2;
    var marginValueBottom2 = difValue2 * marginRateYBottom2;
    var maxValueAndMargin = maxValue + marginValueTop;
    var minValueAndMargin = minValue - marginValueBottom;
    var maxValueAndMargin2 = maxValue2 + marginValueTop2;
    var minValueAndMargin2 = minValue2 - marginValueBottom2;
    if (maxValueAndMargin == minValueAndMargin) {
        var d = maxValueAndMargin * 0.2;

        var marginRateY = marginRateYTop + marginRateYBottom;
        var marginRateYTopRate = marginRateYTop / marginRateY;
        var marginRateYBottomRate = marginRateYBottom / marginRateY;

        maxValueAndMargin += d * marginRateYTopRate;
        minValueAndMargin -= d * marginRateYBottomRate;
    }
    if (maxValueAndMargin2 == minValueAndMargin2) {
        var d = maxValueAndMargin2 * 0.2;

        var marginRateY2 = marginRateYTop2 + marginRateYBottom2;
        var marginRateYTop2Rate = marginRateYTop2 / marginRateY2;
        var marginRateYBottom2Rate = marginRateYBottom2 / marginRateY2;

        maxValueAndMargin2 += d * marginRateYTop2Rate;
        minValueAndMargin2 -= d * marginRateYBottom2Rate;
    }
    var difValueAndMargin = maxValueAndMargin - minValueAndMargin;
    var difValueAndMargin2 = maxValueAndMargin2 - minValueAndMargin2;
    var centerValueAndMargin = minValueAndMargin + difValueAndMargin / 2;
    var centerValueAndMargin2 = minValueAndMargin2 + difValueAndMargin2 / 2;


    var minTick = 4;
    var intervalVAM = difValueAndMargin / minTick;

    var actualIntervalVAMCandidates = new Array(0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 500);
    var actualIntervalVAM = 0;
    if (intervalVAM < actualIntervalVAMCandidates[0] || intervalVAM > actualIntervalVAMCandidates[actualIntervalVAMCandidates.length - 1]) {
        throw new Error();
    }
    for (var i = 0; i < actualIntervalVAMCandidates.length; i++) {
        if (intervalVAM > actualIntervalVAMCandidates[i]) {
            actualIntervalVAM = actualIntervalVAMCandidates[i];
        }
    }

    var centerTickCandidate1 = Math.floor(centerValueAndMargin / actualIntervalVAM) * actualIntervalVAM;
    var centerTickCandidate2 = Math.ceil(centerValueAndMargin / actualIntervalVAM) * actualIntervalVAM;

    var actualCenterTick = 0;
    var abs1 = Math.abs(centerValueAndMargin - centerTickCandidate1);
    var abs2 = Math.abs(centerValueAndMargin - centerTickCandidate2);
    if (abs1 < abs2) {
        actualCenterTick = centerTickCandidate1;
    }
    else {
        actualCenterTick = centerTickCandidate2;
    }

    var ticks = new Array();
    var temp = actualCenterTick;
    while (temp < maxValueAndMargin) {
        temp += actualIntervalVAM;
        ticks.push(temp);
    }
    var actualMaxValueAndMargin = temp;
    var numberOfTicksUpper = ticks.length;
    temp = actualCenterTick;
    while (temp > minValueAndMargin) {
        temp -= actualIntervalVAM;
        ticks.push(temp);
    }
    var actualMinValueAndMargin = temp;
    var numberOfTicksLower = ticks.length - numberOfTicksUpper;
    ticks.push(actualCenterTick);
    var actualDifValueAndMargin = actualMaxValueAndMargin - actualMinValueAndMargin;


    if (isNeededYAxis2) {
        var intervalVAM2 = difValueAndMargin2 / (ticks.length - 1);

        var actualIntervalVAM2 = 0;
        if (intervalVAM2 < actualIntervalVAMCandidates[0] || intervalVAM2 > actualIntervalVAMCandidates[actualIntervalVAMCandidates.length - 1]) {
            throw new Error();
        }
        for (var i = 0; i < actualIntervalVAMCandidates.length; i++) {
            if (intervalVAM2 < actualIntervalVAMCandidates[i]) {
                actualIntervalVAM2 = actualIntervalVAMCandidates[i];
                break;
            }
        }

        centerTickCandidate1 = Math.floor(centerValueAndMargin2 / actualIntervalVAM2) * actualIntervalVAM2;
        centerTickCandidate2 = Math.ceil(centerValueAndMargin2 / actualIntervalVAM2) * actualIntervalVAM2;

        var actualCenterTick2 = 0;
        abs1 = Math.abs(centerValueAndMargin2 - centerTickCandidate1);
        abs2 = Math.abs(centerValueAndMargin2 - centerTickCandidate2);
        if (abs1 < abs2) {
            actualCenterTick2 = centerTickCandidate1;
        }
        else {
            actualCenterTick2 = centerTickCandidate2;
        }

        var ticks2 = new Array();
        for (var i = 0; i < numberOfTicksUpper; i++) {
            ticks2.push(actualCenterTick2 + (i + 1) * actualIntervalVAM2);
        }
        for (var i = 0; i < numberOfTicksLower; i++) {
            ticks2.push(actualCenterTick2 - (i + 1) * actualIntervalVAM2);
        }
        ticks2.push(actualCenterTick2);
        var actualMaxValueAndMargin2 = actualCenterTick2 + numberOfTicksUpper * actualIntervalVAM2;
        var actualMinValueAndMargin2 = actualCenterTick2 - numberOfTicksLower * actualIntervalVAM2;
        var actualDifValueAndMargin2 = actualMaxValueAndMargin2 - actualMinValueAndMargin2;
    }


    var titleAreaHeight = 10;
    var xAxisTickAreaHeight = 30;
    var xAxisLabelAreaHeight = 30;
    var plotAreaHeight = height - titleAreaHeight - xAxisTickAreaHeight - xAxisLabelAreaHeight;

    var yAxisLabelAreaWidth = isNeededYAxisLabel1 ? 100 : 0;
    var yAxisTickAreaWidth = isNeededYAxis1 ? 40 : 0;
    var yAxisTickArea2Width = isNeededYAxis2 ? 40 : 0;
    var yAxisLabelArea2Width = isNeededYAxisLabel2 ? 80 : 0;
    var plotAreaWidth = width - yAxisLabelAreaWidth - yAxisTickAreaWidth - yAxisTickArea2Width - yAxisLabelArea2Width;

    var titleAreaWidth = width;
    var xAxisTickAreaWidth = plotAreaWidth;
    var xAxisLabelAreaWidth = plotAreaWidth;
    var yAxisLabelAreaHeight = plotAreaHeight;
    var yAxisTickAreaHeight = plotAreaHeight;
    var yAxisTickArea2Height = plotAreaHeight;
    var yAxisLabelArea2Height = plotAreaHeight;

    var titleAreaX = 0;
    var titleAreaY = 0;
    var yAxisLabelAreaX = 0;
    var yAxisLabelAreaY = titleAreaHeight;
    var yAxisTickAreaX = yAxisLabelAreaWidth;
    var yAxisTickAreaY = titleAreaHeight;
    var plotAreaX = yAxisLabelAreaWidth + yAxisTickAreaWidth;
    var plotAreaY = titleAreaHeight;
    var yAxisTickArea2X = yAxisLabelAreaWidth + yAxisTickAreaWidth + plotAreaWidth;
    var yAxisTickArea2Y = titleAreaHeight;
    var yAxisLabelArea2X = yAxisLabelAreaWidth + yAxisTickAreaWidth + plotAreaWidth + yAxisTickArea2Width;
    var yAxisLabelArea2Y = titleAreaHeight;
    var xAxisTickAreaX = yAxisLabelAreaWidth + yAxisTickAreaWidth;
    var xAxisTickAreaY = titleAreaHeight + plotAreaHeight;
    var xAxisLabelAreaX = yAxisLabelAreaWidth + yAxisTickAreaWidth;
    var xAxisLabelAreaY = titleAreaHeight + plotAreaHeight + xAxisTickAreaHeight;

    var dataAreaHeight = plotAreaHeight;
    var dataAreaWidth = plotAreaWidth / dataX.length;
    var dataAreaCenterX = dataAreaWidth / 2;


    var plotRadius = 4;

    var barWidthRate = 0.5;

    var lineTickness = 2;
    var plotAreaFrameTickness = 3;
    var plotAreaTickBorderTicknessX = 2;
    var plotAreaTickBorderTicknessY = 2;
    var plotAreaTickTicknessX = 2;
    var plotAreaTickTicknessY = 2;
    var plotAreaTickTicknessY2 = 2;

    var titleFontSize = 16;
    var xAxisLabelFontSize = 12;
    var yAxisLabelFontSize = 12;
    var yAxisLabelFontSize2 = 12;
    var xAxisTickFontSize = 10;
    var yAxisTickFontSize = 10;
    var yAxisTickFontSize2 = 10;

    var fontname = 'メイリオ';


    var vaxel = plotAreaHeight / actualDifValueAndMargin;
    var vaxel2 = plotAreaHeight / actualDifValueAndMargin2;

    var dataYsPlotX = new Array();
    var dataYsPlotY = new Array();
    for (var i = 0; i < dataYs.length; i++) {
        var dataYPlotX = new Array();
        var dataYPlotY = new Array();

        temp = dataAreaCenterX;

        if (axises[i] == 1) {
            for (var j = 0; j < dataYs[i].length; j++) {
                dataYPlotX.push(temp);
                if (dataYs[i][j] != null) {
                    dataYPlotY.push(vaxel * (actualMaxValueAndMargin - dataYs[i][j]));
                }
                else {
                    dataYPlotY.push(null);
                }

                temp += dataAreaWidth;
            }
        }
        else if (axises[i] == 2) {
            for (var j = 0; j < dataYs[i].length; j++) {
                dataYPlotX.push(temp);
                if (dataYs[i][j] != null) {
                    dataYPlotY.push(vaxel2 * (actualMaxValueAndMargin2 - dataYs[i][j]));
                }
                else {
                    dataYPlotY.push(null);
                }

                temp += dataAreaWidth;
            }
        }

        dataYsPlotX.push(dataYPlotX);
        dataYsPlotY.push(dataYPlotY);
    }


    ctx.font = titleFontSize + "pt '" + fontname + "'";
    var titleWidth = ctx.measureText(title).width;
    var titleHeight = titleFontSize;
    var titleX = (titleAreaWidth - titleWidth) / 2;
    var titleY = (titleAreaHeight - titleHeight) / 2;
    ctx.fillText(title, titleAreaX + titleX, titleAreaY + titleY + titleFontSize);

    ctx.lineWidth = plotAreaTickBorderTicknessX;
    ctx.strokeStyle = 'rgb(190,190,190)';
    for (var i = 1; i < dataX.length; i++) {
        var x = plotAreaX + i * dataAreaWidth;

        ctx.beginPath();
        ctx.moveTo(x, plotAreaY);
        ctx.lineTo(x, plotAreaY + plotAreaHeight);
        ctx.stroke();
    }

    ctx.lineWidth = plotAreaTickBorderTicknessY;
    ctx.strokeStyle = 'rgb(190,190,190)';
    for (var i = 0; i < ticks.length; i++) {
        if (ticks[i] != actualMaxValueAndMargin && ticks[i] != actualMinValueAndMargin) {
            var y = plotAreaY + vaxel * (actualMaxValueAndMargin - ticks[i]);

            ctx.beginPath();
            ctx.moveTo(plotAreaX, y);
            ctx.lineTo(plotAreaX + plotAreaWidth, y);
            ctx.stroke();
        }
    }

    if (isNeededYAxis1) {
        ctx.lineWidth = plotAreaTickTicknessX;
        ctx.strokeStyle = 'rgb(0,0,0)';
        for (var i = 0; i < ticks.length; i++) {
            if (ticks[i] != actualMaxValueAndMargin && ticks[i] != actualMinValueAndMargin) {
                var y = plotAreaY + vaxel * (actualMaxValueAndMargin - ticks[i]);

                ctx.beginPath();
                ctx.moveTo(plotAreaX - 3, y);
                ctx.lineTo(plotAreaX + 3, y);
                ctx.stroke();
            }
        }
    }
    if (isNeededYAxis2) {
        ctx.lineWidth = plotAreaTickTicknessY;
        ctx.strokeStyle = 'rgb(0,0,0)';
        for (var i = 0; i < ticks.length; i++) {
            if (ticks[i] != actualMaxValueAndMargin && ticks[i] != actualMinValueAndMargin) {
                var y = plotAreaY + vaxel * (actualMaxValueAndMargin - ticks[i]);

                ctx.beginPath();
                ctx.moveTo(plotAreaX + plotAreaWidth - 3, y);
                ctx.lineTo(plotAreaX + plotAreaWidth + 3, y);
                ctx.stroke();
            }
        }
    }

    var colors = new Array('rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)');
    ctx.lineWidth = lineTickness;
    var barWidth = dataAreaWidth * barWidthRate;
    for (var i = 0; i < dataYsPlotX.length; i++) {
        if (types[i] == 'bou') {
            ctx.fillStyle = colors[i % 3];

            for (var j = 0; j < dataYsPlotX[i].length; j++) {
                if (dataYsPlotY[i][j] != null) {
                    var actualX = plotAreaX + dataYsPlotX[i][j];
                    var actualX1 = actualX - (barWidth / 2);
                    var actualX2 = actualX + (barWidth / 2);
                    var actualY = plotAreaY + dataYsPlotY[i][j];

                    ctx.fillRect(actualX1, actualY, barWidth, plotAreaHeight - dataYsPlotY[i][j]);
                }
            }
        }
    }
    for (var i = 0; i < dataYsPlotX.length; i++) {
        if (types[i] == 'sen') {
            ctx.strokeStyle = colors[i % 3];
            ctx.fillStyle = colors[i % 3];

            var actualPreviousX = null;
            var actualPreviousY = null;

            for (var j = 0; j < dataYsPlotX[i].length; j++) {
                if (dataYsPlotY[i][j] != null) {
                    var actualX = plotAreaX + dataYsPlotX[i][j];
                    var actualY = plotAreaY + dataYsPlotY[i][j];

                    ctx.beginPath();
                    ctx.arc(actualX, actualY, plotRadius, 0, Math.PI * 2);
                    ctx.fill();

                    if (actualPreviousX != null) {
                        ctx.beginPath();
                        ctx.moveTo(actualPreviousX, actualPreviousY);
                        ctx.lineTo(actualX, actualY);
                        ctx.stroke();
                    }

                    actualPreviousX = actualX;
                    actualPreviousY = actualY;
                }
            }
        }
    }

    ctx.lineWidth = plotAreaFrameTickness;
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(plotAreaX, plotAreaY, plotAreaWidth, plotAreaHeight);

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = xAxisTickFontSize + "pt '" + fontname + "'";
    for (var i = 0; i < dataX.length; i++) {
        var tickWidth = ctx.measureText(dataX[i]).width;
        var tickX = plotAreaX + i * dataAreaWidth + (dataAreaWidth - tickWidth) / 2;
        ctx.fillText(dataX[i], tickX, plotAreaY + plotAreaHeight + xAxisTickFontSize + 5);
    }

    ctx.font = xAxisLabelFontSize + "pt '" + fontname + "'";
    var labelXWidth = ctx.measureText(labelX).width;
    var labelXHeight = xAxisLabelFontSize;
    var labelXX = (xAxisLabelAreaWidth - labelXWidth) / 2;
    var labelXY = (xAxisLabelAreaHeight - labelXHeight) / 2;
    ctx.fillText(labelX, xAxisLabelAreaX + labelXX, xAxisLabelAreaY + labelXY);

    if (isNeededYAxis1) {
        for (var i = 0; i < ticks.length; i++) {
            ctx.font = yAxisTickFontSize + "pt '" + fontname + "'";
            var tickWidth = ctx.measureText(ticks[i]).width;
            var tickY = plotAreaY + vaxel * (actualMaxValueAndMargin - ticks[i]) + (yAxisTickFontSize / 2);
            ctx.fillText(ticks[i], yAxisTickAreaX + yAxisTickAreaWidth - tickWidth - 5, tickY);
        }
    }
    if (isNeededYAxis2) {
        for (var i = 0; i < ticks2.length; i++) {
            ctx.font = yAxisTickFontSize2 + "pt '" + fontname + "'";
            var tickY = plotAreaY + vaxel2 * (actualMaxValueAndMargin2 - ticks2[i]) + (yAxisTickFontSize2 / 2);
            ctx.fillText(ticks2[i], yAxisTickArea2X + 5, tickY);
        }
    }

    if (isNeededYAxisLabel1) {
        ctx.font = yAxisLabelFontSize + "pt '" + fontname + "'";
        var yAxisLabelWidths = new Array();
        var yAxisLabelWidthMax = 0;
        for (var i = 0; i < labelYs1.length; i++) {
            var lWidth = ctx.measureText(labelYs1[i]).width;

            yAxisLabelWidths.push(lWidth);

            if (yAxisLabelWidthMax < lWidth) {
                yAxisLabelWidthMax = lWidth;
            }
        }
        var yAxisLabelX = yAxisLabelAreaWidth - yAxisLabelWidthMax;
        var yAxislabelY = (yAxisLabelAreaHeight - labelYs1.length * yAxisLabelFontSize * 1.4) / 2;

        for (var i = 0; i < labelYs1.length; i++) {
            var x = yAxisLabelAreaX + yAxisLabelX + (yAxisLabelWidthMax - yAxisLabelWidths[i]) / 2;
            var y = yAxisLabelAreaY + yAxislabelY + i * yAxisLabelFontSize * 1.4;

            ctx.fillText(labelYs1[i], x, y);
        }
    }
    if (isNeededYAxisLabel2) {
        ctx.font = yAxisLabelFontSize2 + "pt '" + fontname + "'";
        var yAxisLabelWidths = new Array();
        var yAxisLabelWidthMax = 0;
        for (var i = 0; i < labelYs2.length; i++) {
            var lWidth = ctx.measureText(labelYs2[i]).width;

            yAxisLabelWidths.push(lWidth);

            if (yAxisLabelWidthMax < lWidth) {
                yAxisLabelWidthMax = lWidth;
            }
        }
        var yAxisLabelX = 0;
        var yAxislabelY = (yAxisLabelArea2Height - labelYs2.length * yAxisLabelFontSize2 * 1.4) / 2;

        for (var i = 0; i < labelYs2.length; i++) {
            var x = yAxisLabelArea2X + yAxisLabelX + (yAxisLabelWidthMax - yAxisLabelWidths[i]) / 2;
            var y = yAxisLabelArea2Y + yAxislabelY + i * yAxisLabelFontSize2 * 1.4;

            ctx.fillText(labelYs2[i], x, y);
        }
    }
}