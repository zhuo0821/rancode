package com.restaurant.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.restaurant.service.ManageService;

/**  
 * 创建时间：2014-7-29 下午8:10:49  
 * 项目名称：restaurant  
 * @author 朱卓
 * 文件名称：ManageController.java  
 * 说明：  
 */
@Controller
public class ManageController {
	@Resource
	private ManageService manageService;
	private final Log logger = LogFactory.getLog(ManageController.class);
	
	@RequestMapping(value = "/manage.do", params = "action=confirmOrder")
	public void confirmOrder(HttpServletRequest request, HttpServletResponse response, String id)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		JSONObject result = manageService.confirmOrder(id);
		response.getWriter().print(result);
	}
	
	@RequestMapping(value = "/manage.do", params = "action=finishOrder")
	public void finishOrder(HttpServletRequest request, HttpServletResponse response, String id)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		JSONObject result = manageService.finishOrder(id);
		response.getWriter().print(result);
	}
}
