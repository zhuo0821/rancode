package com.restaurant.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.restaurant.alipay.AlipayNotify;
import com.restaurant.bean.Address;
import com.restaurant.bean.Member;
import com.restaurant.bean.Product;
import com.restaurant.service.SaleProductService;

@Controller
public class SaleProductController  {
	
	@Resource
	private SaleProductService saleProductService;
	private final Log logger = LogFactory.getLog(SaleProductController.class);
	
	@RequestMapping(value = "addChart.do", method = { RequestMethod.GET })
	public void beforeAddToChart(HttpServletRequest request,HttpServletResponse response) throws IOException{
		String id = request.getParameter("id");
		String ip = request.getLocalAddr();
		HttpSession session = request.getSession();
		String[] req;
		Member member = (Member)session.getAttribute("member");
		if(member != null){
			req = saleProductService.beforeAddToChart(id, member,ip);
		}else {
			req = new String[]{"未登陆","0"};
		}
		JSONObject json = new JSONObject();
		json.put("status", req[1]);
		json.put("message", req[0]);
		response.setCharacterEncoding("utf8");
		PrintWriter writer = response.getWriter();
		writer.write(json.toString());
	}
	
	@RequestMapping(value = "cart.jspx",method = {RequestMethod.GET})
	public ModelAndView showChart(HttpServletRequest request) throws UnsupportedEncodingException{
		HttpSession session = request.getSession();
		Member member = (Member)session.getAttribute("member");
		List<Product> products = new LinkedList<Product>();
		if(member != null){
			Cookie[] cookies = request.getCookies();
			String productsJson = saleProductService.getProductsJson(cookies);
			if(productsJson.equals("")){
				ModelAndView mv = new ModelAndView("message");
				mv.addObject("msg", "购物车没有商品");
				mv.addObject("result", true);
				mv.addObject("return_url", "./index.jspx");
				return mv;
			}else {
				JSONArray json = JSONArray.fromObject(productsJson);
				float allCharge = 0;
				for(int i = 0 ; i < json.size() ; i++){
					JSONObject j = (JSONObject)json.get(i);
					String id = j.getString("id");
					Product p = saleProductService.getProduct(id);
					int buyNumber = Integer.parseInt(j.getString("number").toString());
					p.setBuyNumber(buyNumber);
					allCharge += p.getPrice() * buyNumber * p.getDiscount();
					products.add(p);
				}
				ModelAndView mv = new ModelAndView("shopcar");
				mv.addObject("products", products);
				mv.addObject("allCharge", allCharge);
				return mv;
			}
		}else {
			ModelAndView mv = new ModelAndView("message");
			mv.addObject("msg", "请先登陆");
			mv.addObject("result", true);
			mv.addObject("return_url", "./login.jspx");
			return mv;
		}
	}
	
	@RequestMapping(value = "confirmOrder.jspx" , params = { "action=chooseAddr" })
	public ModelAndView chooseAddress(HttpServletRequest request){
		HttpSession session = request.getSession();
		Member member = (Member)session.getAttribute("member");
		if(member != null){
			List<Address> addresses = saleProductService.getAddress(member); 
			ModelAndView mv = new ModelAndView("chose_address");
			mv.addObject("addresses", addresses);
			return mv;
		}else {
			ModelAndView mv = new ModelAndView("message");
			mv.addObject("msg", "请先登陆");
			mv.addObject("result", true);
			mv.addObject("return_url", "./login.jspx");
			return mv;
		}
	}
	
	@RequestMapping(value = "checkNumber.jspx" , method = {RequestMethod.GET})
	public void checkNumber(HttpServletRequest request,HttpServletResponse response) throws IOException{
		String id = request.getParameter("id");
		int number = saleProductService.getLastedProductCount(id);
		JSONObject json = new JSONObject();
		json.put("count", number+"");
		response.setCharacterEncoding("utf8");
		PrintWriter writer = response.getWriter();
		writer.write(json.toString());
	}
	
	@RequestMapping(value = "confirmOrder.jspx" , params = { "action=confirm" })
	public ModelAndView confirmOrder(HttpServletRequest request) throws UnsupportedEncodingException{
		HttpSession session = request.getSession();
		Member member = (Member)session.getAttribute("member");
		if(member != null){
			Cookie[] cookies = request.getCookies();
			String a_id = request.getParameter("a_id");
			String concacts = request.getParameter("concacts");
			String phone = request.getParameter("phone");
			String address = request.getParameter("address");
			saleProductService.updateAddress(a_id, address, concacts, phone);
			List<Product> products = saleProductService.getProducts(cookies);
			float allCharge = saleProductService.getAllCharge(products);
			ModelAndView mv = new ModelAndView("confirm_order");
			mv.addObject("a_id", a_id);
			mv.addObject("allcharge",allCharge);
			mv.addObject("products", products);
			mv.addObject("address", address);
			mv.addObject("phone", phone);
			mv.addObject("concacts", concacts);
			return mv;
		}else {
			ModelAndView mv = new ModelAndView("message");
			mv.addObject("msg", "请先登陆");
			mv.addObject("result", true);
			mv.addObject("return_url", "./login.jspx");
			return mv;
		}
	}
	
	@RequestMapping(value = "confirmOrder.jspx" , params = { "action=submit","payment=0" })
	public ModelAndView submitOrder(HttpServletRequest request,HttpServletResponse response) throws UnsupportedEncodingException{
		HttpSession session = request.getSession();
		Member member = (Member)session.getAttribute("member");
		if(member != null){
			String a_id = request.getParameter("a_id");
			Cookie[] cookies = request.getCookies();
			String paytype = request.getParameter("payment");
			saleProductService.insertOrder(a_id, member, paytype, cookies);
			Cookie cookie = new Cookie("products","[]");
			cookie.setMaxAge(0);
			response.addCookie(cookie);
			ModelAndView mv = new ModelAndView("message");
			mv.addObject("msg", "订单提交成功");
			mv.addObject("result", true);
			mv.addObject("return_url", "./user.jspx");
			return mv;
		}else {
			ModelAndView mv = new ModelAndView("message");
			mv.addObject("msg", "请先登陆");
			mv.addObject("result", true);
			mv.addObject("return_url", "./login.jspx");
			return mv;
		}
	}
	
	@RequestMapping(value = "confirmOrder.jspx" , params = { "action=submit","payment=1" })
	public void submitOrderAliPay(HttpServletRequest request,HttpServletResponse response) throws IOException{
		HttpSession session = request.getSession();
		Member member = (Member)session.getAttribute("member");
		if(member != null){
			String a_id = request.getParameter("a_id");
			Cookie[] cookies = request.getCookies();
			String paytype = request.getParameter("payment");
			String allCharge = request.getParameter("allCharge");
			String orderNumber = saleProductService.insertOrder(a_id, member, paytype, cookies);
			Cookie cookie = new Cookie("products","[]");
			cookie.setMaxAge(0);
			response.addCookie(cookie);
			//转到支付页面
			String aliPayHtml = saleProductService.makeAliPayForm(orderNumber, allCharge);
			response.setCharacterEncoding("utf8");
			PrintWriter writer = response.getWriter();
			writer.write(aliPayHtml.toString());
		}else {
			/*
			response.setCharacterEncoding("utf8");
			PrintWriter writer = response.getWriter();
			writer.write("请先登陆");
			*/
			response.sendRedirect("./user.jspx");
		}
	}
	
	@RequestMapping(value = "payStatus.jspx" , method = {RequestMethod.GET})
	public ModelAndView PaySuccess(HttpServletRequest request,HttpServletResponse response) throws UnsupportedEncodingException{
		//获取支付宝GET过来反馈信息
		Map<String,String> params = new HashMap<String,String>();
		Map requestParams = request.getParameterMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
			params.put(name, valueStr);
		}
		//商户订单号
		String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"),"UTF-8");
		//支付宝交易号
		String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"),"UTF-8");
		//交易状态
		String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"),"UTF-8");
		boolean verify_result = AlipayNotify.verify(params);
		if(verify_result){//验证成功
			if(trade_status.equals("TRADE_FINISHED") || trade_status.equals("TRADE_SUCCESS")){
				saleProductService.changeOrderPayStatus(out_trade_no, "2",trade_no);
				ModelAndView mv = new ModelAndView("message");
				mv.addObject("msg", "付款成功");
				mv.addObject("result", true);
				mv.addObject("return_url", "./user.jspx");
				return mv;
			}else{
				saleProductService.changeOrderPayStatus(out_trade_no, "0",trade_no);
				ModelAndView mv = new ModelAndView("message");
				mv.addObject("msg", "付款失败");
				mv.addObject("result", true);
				mv.addObject("return_url", "./user.jspx");
				return mv;
			}
		}else{
			ModelAndView mv = new ModelAndView("message");
			mv.addObject("msg", "付款失败");
			mv.addObject("result", true);
			mv.addObject("return_url", "./user.jspx");
			return mv;
		}
	}
	
}
