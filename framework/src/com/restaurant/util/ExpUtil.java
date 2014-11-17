package com.restaurant.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.ss.util.Region;

public class ExpUtil {
	@SuppressWarnings("deprecation")
	public HSSFWorkbook exportExcel(String sheetName,String columns, JSONArray dataArray) throws Exception {

		HSSFWorkbook workbook = null;
		try {

			// 这里的数据即时你要从后台取得的数据
			
			// 创建工作簿实例
			workbook = new HSSFWorkbook();
			// 创建工作表实例
			HSSFSheet sheet = workbook.createSheet(sheetName);
			// 获取样式
			HSSFCellStyle style = this.createTitleStyle(workbook);
			short rowCount = 1;
			short columnCount = 0;
			ArrayList<String> model = new ArrayList<>();
			JSONArray columnArray = JSONArray.fromObject(columns);
			for (int i = 0; i < columnArray.size(); i++) {
				HSSFRow row;
				if(sheet.getRow(0)!=null)
					row = sheet.getRow(0);
				else 
					row = sheet.createRow(0);
				JSONObject temp = columnArray.getJSONObject(i);
				this.createCell(row, columnCount, style, HSSFCell.CELL_TYPE_STRING, temp.getString("text"));
				JSONArray tempChildrenArray = new JSONArray();
				if(temp.get("columns")!=null)
					tempChildrenArray = temp.getJSONArray("columns");
				if(tempChildrenArray!=null && tempChildrenArray.size() > 0){
					int childCount = tempChildrenArray.size();
					if(childCount > 1){
						sheet.addMergedRegion(new CellRangeAddress(0,(short) 0,columnCount,(short) (columnCount+childCount-1)));
					}
					HSSFRow childrow;
					if(sheet.getRow(1)!=null)
						childrow = sheet.getRow(1);
					else{
						childrow = sheet.createRow(1);
						rowCount = 2;
					}
					for (int j = 0; j < childCount; j++) {
						this.createCell(childrow, columnCount+j, style, HSSFCell.CELL_TYPE_STRING, tempChildrenArray.getJSONObject(j).getString("text"));
						model.add(tempChildrenArray.getJSONObject(j).getString("dataIndex"));
					}
					columnCount += childCount;
				}else {
					model.add(temp.getString("dataIndex"));
					columnCount += 1;
				}
			}
			if (dataArray != null && dataArray.size() > 0) {
				// 给excel填充数据

				for (int i = 0; i < dataArray.size(); i++) {
					JSONObject temp = dataArray.getJSONObject(i);
					HSSFRow row1 = sheet.createRow(rowCount + i);// 建立新行
					for (int j = 0; j < model.size(); j++) {
						this.createCell(row1, j, style,
								HSSFCell.CELL_TYPE_STRING, temp.get(model.get(j))==null?"":temp.get(model.get(j)));
					}
				}
			} else {
				this.createCell(sheet.createRow(rowCount), 0, style,
						HSSFCell.CELL_TYPE_STRING, "查无数据");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return workbook;
	}


	// 设置excel的title样式
	private HSSFCellStyle createTitleStyle(HSSFWorkbook wb) {
		HSSFFont boldFont = wb.createFont();
		boldFont.setFontHeight((short) 200);
		HSSFCellStyle style = wb.createCellStyle();
		style.setFont(boldFont);
		style.setDataFormat(HSSFDataFormat.getBuiltinFormat("###,##0.00"));
		return style;

	}

	// 创建Excel单元格
	private void createCell(HSSFRow row, int column, HSSFCellStyle style,
			int cellType, Object value) {
		HSSFCell cell = row.createCell(column);
		if (style != null) {
			cell.setCellStyle(style);
		}
		switch (cellType) {
		case HSSFCell.CELL_TYPE_BLANK: {
		}
			break;
		case HSSFCell.CELL_TYPE_STRING: {
			cell.setCellValue(value.toString());
		}
			break;
		case HSSFCell.CELL_TYPE_NUMERIC: {
			cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
			cell.setCellValue(Double.parseDouble(value.toString()));
		}
			break;
		default:
			break;

		}
	}
}
