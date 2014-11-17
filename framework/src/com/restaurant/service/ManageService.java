package com.restaurant.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;

/**  
 * 创建时间：2014-7-29 下午8:10:30  
 * 项目名称：restaurant  
 * @author 朱卓
 * 文件名称：ManageService.java  
 * 说明：  
 */
public class ManageService {
	private final Log logger = LogFactory.getLog(ManageService.class);
	private JdbcTemplate jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public JSONObject confirmOrder(String id) {
		JSONObject result = new JSONObject();
		try {
			String sql = "select count(d.number)count,p.name,p.id,p.made_volume,p.amount from order_detail d,product p where p.id=d.p_id and d.o_id = ? group by d.p_id";
			List<Map<String, Object>> detailList = jdbcTemplate.queryForList(sql,id);
			if(detailList.size() <= 0) {
				result.put("success", false);
				result.put("msg", "该订单所定菜品为空，请查验！");
				return result;
			}
			String msg = "所定菜品：";
			List list = new ArrayList();
			for(Map<String, Object> temp : detailList){
				int count = ((Long)temp.get("count")).intValue();
				int made_volume = ((Integer) temp.get("made_volume"));
				int amount = ((Integer) temp.get("amount"));
				if(count + made_volume > amount) {
					msg += temp.get("name")+"、";
				} else {
					String[] product =  {(count + made_volume)+"",(int) temp.get("id")+""};
					list.add(product);
				}
			}
			if (!msg.equals("所定菜品：")) {
				result.put("success", false);
				result.put("msg", msg+"超过当日制作量！");
				return result;
			}
			
			String updateOrder = "update order_form set status = 2,time2=NOW() where id=?";
			jdbcTemplate.update(updateOrder,id);
			
			String updateProduct = "update product set made_volume = ? where id = ?";
			jdbcTemplate.batchUpdate(updateProduct,list);
			result.put("success", true);
			logger.info("确认订单，订单id为"+id);
		} catch (Exception e) {
			result.put("success", false);
			result.put("msg", "系统内部错误！");
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public JSONObject finishOrder(String id) {
		JSONObject result = new JSONObject();
		try {
			String sql = "select count(d.number)count,p.id,p.sales_volume from order_detail d,product p where p.id=d.p_id and d.o_id = ? group by d.p_id";
			List<Map<String, Object>> detailList = jdbcTemplate.queryForList(sql,id);
			List list = new ArrayList();
			for(Map<String, Object> temp : detailList){
				int count = ((Long)temp.get("count")).intValue();
				int sales_volume = ((Integer) temp.get("sales_volume"));
				String[] product =  {(count + sales_volume)+"",(int) temp.get("id")+""};
				list.add(product);
			}
			
			String updateOrder = "update order_form set status = 4,pay_status = 2,time4=NOW() where id=?";
			jdbcTemplate.update(updateOrder,id);
			
			String updateProduct = "update product set sales_volume = ? where id = ?";
			jdbcTemplate.batchUpdate(updateProduct,list);
			result.put("success", true);
			logger.info("完成订单，订单id为"+id);
		} catch (Exception e) {
			result.put("success", false);
			result.put("msg", "系统内部错误！");
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

}
