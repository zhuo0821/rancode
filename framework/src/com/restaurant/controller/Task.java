package com.restaurant.controller;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**  
 * 创建时间：2014-7-30 下午9:34:07  
 * 项目名称：restaurant  
 * @author 朱卓
 * 文件名称：Task.java  
 * 说明：  
 */
@Component 
public class Task {
	@Resource
	private JdbcTemplate jdbcTemplate;
	private final Log logger = LogFactory.getLog(Task.class);
	
	@Scheduled(cron="0 0 23 * * ?") //每天23点执行
	public void updateMadeVolume(){  
        String sql = "update product set made_volume=0";
	    try {
			jdbcTemplate.update(sql);
			logger.info("每日制作量重置完成！");
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
			logger.info("每日制作量重置失败！");
		}
    }  
}
