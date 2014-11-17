package com.restaurant.util;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.jdbc.core.JdbcTemplate;

/**  
 * 创建时间：2014-6-4 下午3:02:10  
 * 项目名称：restaurant  
 * @author 朱卓
 * 文件名称：CacheLoader.java  
 * 说明：  
 */
public class CacheLoader implements InitializingBean {
	private static JdbcTemplate jdbcTemplate;
	private static Map<String, Object> cache;
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	public static Map<String, Object> getCache() {
		return cache;
	}
	@Override
	public void afterPropertiesSet() throws Exception {
		System.out.println("初始化开始");
		cacheRefresh();
		System.out.println("初始化成功");
	}
	public static boolean cacheRefresh() {
		String sql = "select * from sysConfig";
		String storeSql = "select * from store where del_flag = 1 and id <> 1" ;
		List<Map<String, Object>> storeList = jdbcTemplate.queryForList(storeSql);
		StringBuffer storeBuffer = new StringBuffer("[");
		for (int i = 0; i < storeList.size(); i++) {
			Map<String, Object> temp = storeList.get(i);
			String tempString = "{id:"+temp.get("id")+",name:'"+temp.get("name")+"'}";
			if(i != storeList.size() -1)
				tempString += ",";
			storeBuffer.append(tempString);	
		}
		storeBuffer.append("]");
		cache = jdbcTemplate.queryForMap(sql);
		cache.put("storeList", storeBuffer.toString());
		return true;
	}

}
