/**
 * A Highcharts plugin for exporting data from a rendered chart as CSV, XLS or HTML table
 *
 * Author:   张剑
 * Licence:  MIT
 * Version:  1.0.0
 */
/*global Highcharts, window, document, Blob */
(function (Highcharts) {
    Highcharts.setOptions({
        lang:{
           contextButtonTitle:"图表导出菜单",
           decimalPoint:".",
           downloadJPEG:"下载JPEG图片",
           downloadPDF:"下载PDF文件",
           downloadPNG:"下载PNG文件",
           downloadSVG:"下载SVG文件",
           downloadCSV: '下载CSV文件',
           downloadXLS: '下载XLS文件',
           drillUpText:"返回 {series.name}",
           loading:"加载中",
           months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
           noData:"没有数据",
           numericSymbols: [ "千" , "兆" , "G" , "T" , "P" , "E"],
           printChart:"打印图表",
           resetZoom:"恢复缩放",
           resetZoomTitle:"恢复图表",
           shortMonths: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
           thousandsSep:",",
           weekdays: ["星期一", "星期二", "星期三", "星期三", "星期四", "星期五", "星期六","星期天"]
        }
    });
    
    $("text[text-anchor='end']").html("");

}(Highcharts));
