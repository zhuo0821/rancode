package com.restaurant.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.restaurant.bean.Category;
import com.restaurant.bean.Product;
import com.restaurant.service.ListService;

@Controller
public class ListController {
	@Resource
	private ListService listService ;
	private final Log logger = LogFactory.getLog(ListController.class);
	
	private static int pageSize = 20;
	
	@RequestMapping(value = "list.jspx", method = { RequestMethod.GET })
	public ModelAndView list(HttpServletRequest request){
		String storeId = listService.getStoreId(request.getCookies());
		HashMap<String,List<Category>> categorys = listService.getCategorys();
		
		String cid = request.getParameter("cid");
		String isParent = request.getParameter("is_parent");
		String page = request.getParameter("page");
		String currentCategoryName = "";
		if(cid == null || cid.equals("")){
			cid = "0";
			currentCategoryName = "全部";
			isParent = "true";
		}else {
			Category currentCategory = listService.getCategory(cid);
			currentCategoryName = currentCategory.getName();
			isParent = "false";
		}
		if(page == null){
			page = "1";
		}
		List<Product> products = listService.getProducts(cid, isParent, storeId, Integer.parseInt(page), pageSize);
		
		
		
		ModelAndView mav = new ModelAndView("list");
		mav.addObject("categorys", categorys);
		mav.addObject("products", products);
		mav.addObject("cname", currentCategoryName);
		mav.addObject("cid", cid);
		mav.addObject("isParent", isParent);
		return mav;
	}
	
	@RequestMapping(value = "search.jspx", method = { RequestMethod.GET })
	public ModelAndView search(HttpServletRequest request) throws UnsupportedEncodingException{
		//request.setCharacterEncoding("utf-8");
		String key = new String(request.getParameter("keywords"));
		//byte[] bs = request.getParameter("keywords").getBytes();
		//String key = request.getParameter("keywords");
		String page = request.getParameter("page");
		String storeId = listService.getStoreId(request.getCookies());
		List<Product> products = listService.getProducts(key, storeId, page, pageSize);
		HashMap<String,List<Category>> categorys = listService.getCategorys();
		
		ModelAndView mav = new ModelAndView("list");
		mav.addObject("categorys", categorys);
		mav.addObject("products", products);
		mav.addObject("cname", "搜索 " + key);
		return mav;
		
	}
	
	@RequestMapping (value = "filter.jspx",method = {RequestMethod.GET})
	public ModelAndView filter(HttpServletRequest request){
		String price = request.getParameter("price");
		String cid = request.getParameter("cid");
		String isParent = request.getParameter("is_parent");
		String page = request.getParameter("page");
		String storeId = listService.getStoreId(request.getCookies());
		
		String currentCategoryName = "";
		if(cid == null || cid.equals("") || cid.equals("0")){
			cid = "0";
			currentCategoryName = "全部";
			isParent = "true";
		}else {
			Category currentCategory = listService.getCategory(cid);
			currentCategoryName = currentCategory.getName();
			isParent = "false";
		}
		
		HashMap<String,List<Category>> categorys = listService.getCategorys();
		List<Product> products = listService.getProducts(price, storeId, cid, isParent, page, pageSize);
		ModelAndView mav = new ModelAndView("list");
		mav.addObject("products", products);
		mav.addObject("categorys", categorys);
		mav.addObject("cname",currentCategoryName);
		mav.addObject("cid", cid);
		mav.addObject("isParent", isParent);
		return mav;
	}
	
}
