---

layout: post
title: Excel工具类
description: Excel工具类
keywords: excel
category: excel

---


## 代码
	package com.util;
	
	import java.io.File;
	import java.io.FileInputStream;
	import java.io.FileNotFoundException;
	import java.io.FileOutputStream;
	import java.io.IOException;
	import java.io.OutputStream;
	import java.io.UnsupportedEncodingException;
	import java.net.URLEncoder;
	import java.util.ArrayList;
	import java.util.HashMap;
	import java.util.LinkedList;
	import java.util.List; 
	import java.util.Map;
	
	import javax.servlet.ServletOutputStream;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	import org.apache.commons.lang.StringUtils;
	import org.apache.poi.hssf.usermodel.HSSFCell;
	import org.apache.poi.hssf.usermodel.HSSFRichTextString;
	import org.apache.poi.hssf.usermodel.HSSFRow;
	import org.apache.poi.hssf.usermodel.HSSFSheet;
	import org.apache.poi.hssf.usermodel.HSSFWorkbook;
	
	/**
	 * Excel工具类
	 * 
	 * @作者 张剑
	 * @版本 1.3
	 * @日期 2014年8月22日
	 * @时间 上午10:39:10
	 * @更新 张剑--2014年8月22日--1.1--添加读取Excel为String[][]
	 * @更新 张剑--2014年8月22日--1.2--关闭输入输出流 抛出异常
	 * @更新 张剑--2014年8月25日--1.3--修改读取代码
	 */
	public class ZJ_ExcelUtils {
	
		/**
		 * 设置下载头，防止文件名乱码
		 * 
		 * @param request
		 * @param response
		 * @param fileName
		 */
		public static void setFileDownloadHeader(HttpServletRequest request, HttpServletResponse response, String fileName) {
			final String userAgent = request.getHeader("USER-AGENT");
			try {
				String finalFileName = null;
				if (StringUtils.contains(userAgent, "Firefox")) {// google,火狐浏览器
					finalFileName = new String(fileName.getBytes(), "ISO8859-1");
				} else {
					finalFileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
				}
				response.setHeader("Content-Disposition", "attachment; filename=\"" + finalFileName + "\"");// 这里设置一下让浏览器弹出下载提示框，而不是直接在浏览器中打开
			} catch (UnsupportedEncodingException e) {
			}
		}
	
		/**
		 * *
		 * 
		 * @param filename
		 *            保存到客户端的文件名 例：用户.xls
		 * @param title
		 *            标题行 例：String[]{"名称","地址"}
		 * @param key
		 *            从查询结果List取得的MAP的KEY顺序， 需要和title顺序匹配，
		 *            例：String[]{"name","address"}
		 * @param values
		 * 				List<Map<String, String>> values=new ArrayList<Map<String,String>>();
		 * 				Map<String, String> m=new HashMap<String, String>();
		 * 				m.put("name", "zhangjian");
		 *				m.put("address", "郑州");
		 *				values.add(m);
		 *            结果集
		 * @param httpServletResponse
		 * @throws IOException
		 */
		public static void createExcel(String fileName, String[] title, String[] key, List<Map<String, String>> values, HttpServletRequest request, HttpServletResponse response) throws IOException {
			setFileDownloadHeader(request, response, fileName);
			HSSFWorkbook workbook = null;
			response.setContentType("application/x-download");
			response.setCharacterEncoding("UTF-8");
			workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFRow row = null;
			HSSFCell cell = null;
			row = sheet.createRow(0);
			for (int i = 0; title != null && i < title.length; i++) {
				cell = row.createCell(i);
				cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(new HSSFRichTextString(title[i]));
			}
			Map<String, String> map = null;
			for (int i = 0; values != null && i < values.size(); i++) {
				row = sheet.createRow(i + 1);
				map = values.get(i);
				for (int i2 = 0; i2 < key.length; i2++) {
					cell = row.createCell(i2);
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					if (map.get(key[i2]) == null) {
						cell.setCellValue(new HSSFRichTextString(""));
					} else {
						cell.setCellValue(new HSSFRichTextString(map.get(key[i2]).toString()));
					}
				}
			}
			ServletOutputStream servletOutputStream = null;
			try {
				servletOutputStream = response.getOutputStream();
				workbook.write(servletOutputStream);
			}finally {
				if (null != servletOutputStream) {
					servletOutputStream.flush();
					servletOutputStream.close();
				}
			}
		}
	
		/**
		 * 导出到文件
		 * 
		 * @param outputStream
		 * @param title
		 *            String[]
		 * @param key
		 *            String[]
		 * @param values
		 *            List<Map<String, String>>
		 * @throws IOException
		 */
		public static void createExcel(OutputStream outputStream, String[] title, String[] key, List<Map<String, String>> values) throws IOException {
			HSSFWorkbook workbook = null;
			workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFRow row = null;
			HSSFCell cell = null;
			row = sheet.createRow(0);
			for (int i = 0; title != null && i < title.length; i++) {
				cell = row.createCell(i);
				cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(new HSSFRichTextString(title[i]));
			}
			Map<String, String> map = null;
			for (int i = 0; values != null && i < values.size(); i++) {
				row = sheet.createRow(i + 1);
				map = values.get(i);
				for (int i2 = 0; i2 < key.length; i2++) {
					cell = row.createCell(i2);
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					if (map.get(key[i2]) == null) {
						cell.setCellValue(new HSSFRichTextString(""));
					} else {
						cell.setCellValue(new HSSFRichTextString(map.get(key[i2]).toString()));
					}
				}
			}
			ServletOutputStream servletOutputStream = null;
			try {
				workbook.write(outputStream);
			} finally {
				if (null != servletOutputStream) {
					servletOutputStream.flush();
					servletOutputStream.close();
				}
			}
		}
	
		/**
		 * 导出到文件
		 * 
		 * @param outputStream
		 * @param values
		 * @throws IOException
		 */
		public static void createExcel(OutputStream outputStream, List<Map<String, String>> values) throws IOException {
			HSSFWorkbook workbook = null;
			workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFRow row = null;
			HSSFCell cell = null;
			row = sheet.createRow(0);
			Object[] title = null;
			// 添加标题
			if (values.size() > 0) {
				title = values.get(0).keySet().toArray();
				for (int i = 0; title != null && i < title.length; i++) {
					cell = row.createCell(i);
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue(title[i].toString());
				}
			}
	
			Map<String, String> map = null;
			for (int i = 0; values != null && i < values.size(); i++) {
				row = sheet.createRow(i + 1);
				map = values.get(i);
				for (int i2 = 0; i2 < title.length; i2++) {
					cell = row.createCell(i2);
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					if (map.get(title[i2]) == null) {
						cell.setCellValue("");
					} else {
						cell.setCellValue(map.get(title[i2]).toString());
					}
				}
			}
			ServletOutputStream servletOutputStream = null;
			try {
				workbook.write(outputStream);
			} finally {
				if (null != servletOutputStream) {
					servletOutputStream.flush();
					servletOutputStream.close();
				}
			}
		}
	
		/**
		 * 导出到文件
		 * 
		 * @param outputStream
		 * @param title
		 *            String[]
		 * @param values
		 *            List<String[]>
		 * @throws IOException
		 */
		public static void createExcel(OutputStream outputStream, String[] title, List<String[]> values) throws IOException {
			HSSFWorkbook workbook = null;
			workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFRow row = null;
			HSSFCell cell = null;
			row = sheet.createRow(0);
			for (int i = 0; title != null && i < title.length; i++) {
				cell = row.createCell(i);
				cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(new HSSFRichTextString(title[i]));
			}
			String[] strArray = null;
			for (int i = 0; values != null && i < values.size(); i++) {
				row = sheet.createRow(i + 1);
				strArray = values.get(i);
				for (int i2 = 0; i2 < strArray.length; i2++) {
					cell = row.createCell(i2);
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					if (strArray[i2] == null) {
						cell.setCellValue(new HSSFRichTextString(""));
					} else {
						cell.setCellValue(strArray[i2].toString());
					}
				}
			}
			ServletOutputStream servletOutputStream = null;
			try {
				workbook.write(outputStream);
			} finally {
				if (null != servletOutputStream) {
					servletOutputStream.flush();
					servletOutputStream.close();
				}
			}
		}
	
		/**
		 * 读取excel（第一行必须为标题）
		 * 
		 * @param filePath
		 * @return
		 * @throws IOException
		 * @throws FileNotFoundException
		 */
		public static List<Map<String, String>> getMapListByExcelFilePath(String filePath) throws FileNotFoundException, IOException {
			File file = new File(filePath);
			List<Map<String, String>> list = getMapListByExcelFile(file);
			return list;
		}
	
		/**
		 * 读取excel（第一行必须为标题）
		 * 
		 * @param file
		 * @return
		 * @throws IOException
		 * @throws FileNotFoundException
		 */
		public static List<Map<String, String>> getMapListByExcelFile(File file) throws FileNotFoundException, IOException {
			List<Map<String, String>> list = new LinkedList<Map<String, String>>();
			FileInputStream fileInputStream = null;
			try {
				// 创建对Excel工作簿文件的引用
				fileInputStream = new FileInputStream(file);
				HSSFWorkbook wookbook = new HSSFWorkbook(fileInputStream);
				// 在Excel文档中，第一张工作表的缺省索引是0
				HSSFSheet sheet = wookbook.getSheetAt(0);
				// 获取到Excel文件中的所有行数
				int rows = sheet.getPhysicalNumberOfRows();
				int columns = 0;
				HSSFRow titleRow = null;
				if (rows > 0) {
					titleRow = sheet.getRow(0);
					columns = titleRow.getPhysicalNumberOfCells();
				}
				// 遍历行
				for (int i = 1; i < rows; i++) {
					Map<String, String> map = new HashMap<String, String>();
					HSSFRow row = sheet.getRow(i);
					if (row != null) {
	
						// 遍历列
						for (int j = 0; j < columns; j++) {
							// 获取到列的值
							HSSFCell cell = row.getCell(j);
							if (cell != null) {
								switch (cell.getCellType()) {
								case HSSFCell.CELL_TYPE_NUMERIC:
									map.put(titleRow.getCell(j).getStringCellValue(), cell.getNumericCellValue() + "");
									break;
								case HSSFCell.CELL_TYPE_STRING:
									map.put(titleRow.getCell(j).getStringCellValue(), cell.getStringCellValue());
									break;
								case HSSFCell.CELL_TYPE_FORMULA:
									map.put(titleRow.getCell(j).getStringCellValue(), cell.getNumericCellValue() + "");
									break;
								case HSSFCell.CELL_TYPE_BLANK:
									map.put(titleRow.getCell(j).getStringCellValue(), "");
									break;
								case HSSFCell.CELL_TYPE_BOOLEAN:
									map.put(titleRow.getCell(j).getStringCellValue(), cell.getBooleanCellValue() + "");
									break;
								default:
									map.put(titleRow.getCell(j).getStringCellValue(), null);
									break;
								}
							}
						}
						list.add(map);
					}
				}
				return list;
			} finally {
				if (null != fileInputStream) {
					fileInputStream.close();
				}
			}
		}
	
		/**
		 * 读取Excel转为二维数组
		 * 
		 * @param file
		 * @return
		 * @throws IOException
		 * @throws FileNotFoundException
		 */
		public static String[][] getStrArrayByExcelFile(File file) throws FileNotFoundException, IOException {
			String[][] strArray = null;
			FileInputStream fileInputStream = null;
			fileInputStream = new FileInputStream(file);
			try {
				// 创建对Excel工作簿文件的引用
				HSSFWorkbook wookbook = new HSSFWorkbook(fileInputStream);
				// 在Excel文档中，第一张工作表的缺省索引是0
				HSSFSheet sheet = wookbook.getSheetAt(0);
				// 获取到Excel文件中的所有行数
				int rows = sheet.getPhysicalNumberOfRows();
				int cellNum = 0;
				if (rows > 0) {
					cellNum = sheet.getRow(0).getPhysicalNumberOfCells();
					strArray = new String[rows][cellNum];
				}
				// 遍历行
				for (int i = 0; i < rows; i++) {
					HSSFRow row = sheet.getRow(i);
					if (row != null) {
						// 遍历列
						for (int j = 0; j < cellNum; j++) {
							// 获取到列的值
							HSSFCell cell = row.getCell(j);
							if (cell != null) {
								switch (cell.getCellType()) {
								case HSSFCell.CELL_TYPE_NUMERIC:
									strArray[i][j] = cell.getNumericCellValue() + "";
									break;
								case HSSFCell.CELL_TYPE_STRING:
									strArray[i][j] = cell.getStringCellValue();
									break;
								case HSSFCell.CELL_TYPE_FORMULA:
									strArray[i][j] = cell.getNumericCellValue() + "";
									break;
								case HSSFCell.CELL_TYPE_BLANK:
									strArray[i][j] = "";
									break;
								case HSSFCell.CELL_TYPE_BOOLEAN:
									strArray[i][j] = cell.getBooleanCellValue() + "";
									break;
								default:
									strArray[i][j] = null;
									break;
								}
							}
						}
					}
				}
				return strArray;
			} finally {
				if (null != fileInputStream) {
					fileInputStream.close();
				}
			}
		}
	
		/**
		 * 读取Excel转为二维数组
		 * 
		 * @param filePath
		 * @return
		 * @throws IOException
		 * @throws FileNotFoundException
		 */
		public static String[][] getStrArrayByExcelFilePath(String filePath) throws FileNotFoundException, IOException {
			File file = new File(filePath);
			String[][] strArray = getStrArrayByExcelFile(file);
			return strArray;
		}
	
		public static void main(String[] args) throws FileNotFoundException, IOException {
			// 演示1
			String[] title = { "姓名", "密码" };
			List<String[]> values = new ArrayList<String[]>();
			values.add(new String[] { "zhangjian", "123456" });
			values.add(new String[] { "lisi", "654321" });
			createExcel(new FileOutputStream("D:/测试1.xls"), title, values);
			// ------------------------------------------------------------------
			// 演示2
			List<Map<String, String>> list = new ArrayList<Map<String, String>>();
			Map<String, String> m1 = new HashMap<String, String>();
			m1.put("账号", "zhangjian");
			m1.put("密码", "123456");
			Map<String, String> m2 = new HashMap<String, String>();
			m2.put("账号", "lisi");
			m2.put("密码", "654321");
			list.add(m1);
			list.add(m2);
			createExcel(new FileOutputStream("D:/测试2.xls"), list);
			// ------------------------------------------------------------------
			// 演示3
			String[] title3 = { "账号", "密码" };
			String[] key3 = { "code", "pwd" };
			List<Map<String, String>> values3 = new ArrayList<Map<String, String>>();
			Map<String, String> v1 = new HashMap<String, String>();
			v1.put("code", "zhangjian");
			v1.put("pwd", "123456");
			Map<String, String> v2 = new HashMap<String, String>();
			v2.put("code", "lisi");
			v2.put("pwd", "654321");
			values3.add(v1);
			values3.add(v2);
			createExcel(new FileOutputStream("D:/测试3.xls"), title3, key3, values3);
	
			// 读取测试1
			List<Map<String, String>> list4 = getMapListByExcelFilePath("D:/1.xls");
			System.out.println(list4.get(0));
	
			// 读取测试2
			String[][] strArray = getStrArrayByExcelFilePath("D:/1.xls");
			for (String[] strings : strArray) {
				for (String string : strings) {
					System.out.print(String.format("%5s", string) + "\t");
				}
				System.out.println("");
			}
		}
	}